#include <node.h>
#include <v8.h>
#include <uv.h>
#include <string.h> /* memset */

using namespace v8;

static uv_check_t check_handle;
static uv_prepare_t prepare_handle;

typedef struct {
  uint32_t count;
  uint32_t sum_ms;
  uint32_t slowest_ms;
} mon_stats_t;

mon_stats_t uv_run_stats;

uint32_t start_time;
#ifdef _WIN32
  uv_loop_t tmp_loop; /* to keep from reallocating all the time in function */
#endif


/*
 * Start of the timing section, reset timers
 */
static void check_cb(uv_check_t* handle, int status) {
  // we don't actually need anything from the handle, just a starting point
  // timing from check_cb to prepare_cb, not loop->time to check_cb

  if (handle == NULL) {
    return;
  }
  if (handle->loop == NULL) {
    return;
  }

#ifdef _WIN32
  memcpy(&tmp_loop, handle->loop, sizeof(tmp_loop));
  uv_update_time(&tmp_loop);
  start_time = tmp_loop.time;
#else
  start_time = uv_hrtime() / 1000000;
#endif
}


/* 
 * This is the end of the timing point.
 */
static void prepare_cb(uv_prepare_t* handle, int status) {
  if (handle == NULL) {
    return;
  }
  if (handle->loop == NULL) {
    return;
  }
  if (start_time == 0) {
    // start_time wasn't initialized yet
    return;
  }

#ifdef _WIN32
  memcpy(&tmp_loop, handle->loop, sizeof(tmp_loop));
  uv_update_time(&tmp_loop);
  uint32_t now = tmp_loop.time;
#else
  uint32_t now = uv_hrtime() / 1000000;
#endif

  uint32_t delta;
  
  /* shouldn't have to check for this, but I swear I saw it happen once */
  if (now < start_time) {
    delta = 0;
  } else {
    delta = (now - start_time);
  }
  
  uv_run_stats.count++;
  uv_run_stats.sum_ms += delta;
  if (delta > uv_run_stats.slowest_ms) {
    uv_run_stats.slowest_ms = delta;
  }
}


/* 
 * Returns the data gathered from the uv_run() loop.
 * Resets all counters when called.
 */ 
Handle<Value> getData(const Arguments& args) {
  HandleScope scope;
  
  Local<Object> obj = Object::New();
  obj->Set(String::NewSymbol("count"), Integer::New(uv_run_stats.count));
  obj->Set(String::NewSymbol("sum_ms"), Integer::New(uv_run_stats.sum_ms));
  obj->Set(String::NewSymbol("slowest_ms"),
           Integer::New(uv_run_stats.slowest_ms));
  
  memset(&uv_run_stats, 0, sizeof(uv_run_stats));
  
  return scope.Close(obj);
}


/*
 * Initialization and registration of methods with node.
 */
void init(Handle<Object> target) {
  memset(&uv_run_stats, 0, sizeof(uv_run_stats));
#ifdef _WIN32
  memset(&tmp_loop, 0, sizeof(tmp_loop));
#endif
  start_time = 0;
  
  /* set up uv_run callback */
  uv_check_init(uv_default_loop(), &check_handle);
  uv_check_start(&check_handle, check_cb);
  uv_prepare_init(uv_default_loop(), &prepare_handle);
  uv_prepare_start(&prepare_handle, prepare_cb);
  
  NODE_SET_METHOD(target, "getData", getData);
}

NODE_MODULE(uvmon, init);
