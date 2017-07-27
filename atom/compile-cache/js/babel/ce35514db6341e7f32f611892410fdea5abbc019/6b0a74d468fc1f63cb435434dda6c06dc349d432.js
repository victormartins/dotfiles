'use babel';
// Borrowed from Atom core's spec.

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.beforeEach = beforeEach;
exports.afterEach = afterEach;

var conditionPromise = _asyncToGenerator(function* (condition) {
  var startTime = Date.now();

  while (true) {
    yield timeoutPromise(100);

    if (yield condition()) {
      return;
    }

    if (Date.now() - startTime > 5000) {
      throw new Error("Timed out waiting on condition");
    }
  }
});

exports.conditionPromise = conditionPromise;
exports.timeoutPromise = timeoutPromise;
exports.emitterEventPromise = emitterEventPromise;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function beforeEach(fn) {
  global.beforeEach(function () {
    var result = fn();
    if (result instanceof Promise) {
      waitsForPromise(function () {
        return result;
      });
    }
  });
}

function afterEach(fn) {
  global.afterEach(function () {
    var result = fn();
    if (result instanceof Promise) {
      waitsForPromise(function () {
        return result;
      });
    }
  });
}

['it', 'fit', 'ffit', 'fffit'].forEach(function (name) {
  module.exports[name] = function (description, fn) {
    global[name](description, function () {
      var result = fn();
      if (result instanceof Promise) {
        waitsForPromise(function () {
          return result;
        });
      }
    });
  };
});

function timeoutPromise(timeout) {
  return new Promise(function (resolve) {
    global.setTimeout(resolve, timeout);
  });
}

function waitsForPromise(fn) {
  var promise = fn();
  global.waitsFor('spec promise to resolve', function (done) {
    promise.then(done, function (error) {
      jasmine.getEnv().currentSpec.fail(error);
      done();
    });
  });
}

function emitterEventPromise(emitter, event) {
  var timeout = arguments.length <= 2 || arguments[2] === undefined ? 15000 : arguments[2];

  return new Promise(function (resolve, reject) {
    var timeoutHandle = setTimeout(function () {
      reject(new Error('Timed out waiting for \'' + event + '\' event'));
    }, timeout);
    emitter.once(event, function () {
      clearTimeout(timeoutHandle);
      resolve();
    });
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9wYW5lci9zcGVjL2FzeW5jLXNwZWMtaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7OztJQWdDVyxnQkFBZ0IscUJBQS9CLFdBQWlDLFNBQVMsRUFBRztBQUNsRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7O0FBRTVCLFNBQU8sSUFBSSxFQUFFO0FBQ1gsVUFBTSxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRXpCLFFBQUksTUFBTSxTQUFTLEVBQUUsRUFBRTtBQUNyQixhQUFNO0tBQ1A7O0FBRUQsUUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxHQUFHLElBQUksRUFBRTtBQUNqQyxZQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7S0FDbEQ7R0FDRjtDQUNGOzs7Ozs7OztBQTNDTSxTQUFTLFVBQVUsQ0FBRSxFQUFFLEVBQUU7QUFDOUIsUUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFZO0FBQzVCLFFBQU0sTUFBTSxHQUFHLEVBQUUsRUFBRSxDQUFBO0FBQ25CLFFBQUksTUFBTSxZQUFZLE9BQU8sRUFBRTtBQUM3QixxQkFBZSxDQUFDO2VBQU0sTUFBTTtPQUFBLENBQUMsQ0FBQTtLQUM5QjtHQUNGLENBQUMsQ0FBQTtDQUNIOztBQUVNLFNBQVMsU0FBUyxDQUFFLEVBQUUsRUFBRTtBQUM3QixRQUFNLENBQUMsU0FBUyxDQUFDLFlBQVk7QUFDM0IsUUFBTSxNQUFNLEdBQUcsRUFBRSxFQUFFLENBQUE7QUFDbkIsUUFBSSxNQUFNLFlBQVksT0FBTyxFQUFFO0FBQzdCLHFCQUFlLENBQUM7ZUFBTSxNQUFNO09BQUEsQ0FBQyxDQUFBO0tBQzlCO0dBQ0YsQ0FBQyxDQUFBO0NBQ0g7O0FBRUQsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUU7QUFDckQsUUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLFdBQVcsRUFBRSxFQUFFLEVBQUU7QUFDaEQsVUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxZQUFZO0FBQ3BDLFVBQU0sTUFBTSxHQUFHLEVBQUUsRUFBRSxDQUFBO0FBQ25CLFVBQUksTUFBTSxZQUFZLE9BQU8sRUFBRTtBQUM3Qix1QkFBZSxDQUFDO2lCQUFNLE1BQU07U0FBQSxDQUFDLENBQUE7T0FDOUI7S0FDRixDQUFDLENBQUE7R0FDSCxDQUFBO0NBQ0YsQ0FBQyxDQUFBOztBQWtCSyxTQUFTLGNBQWMsQ0FBRSxPQUFPLEVBQUU7QUFDdkMsU0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRTtBQUNwQyxVQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtHQUNwQyxDQUFDLENBQUE7Q0FDSDs7QUFFRCxTQUFTLGVBQWUsQ0FBRSxFQUFFLEVBQUU7QUFDNUIsTUFBTSxPQUFPLEdBQUcsRUFBRSxFQUFFLENBQUE7QUFDcEIsUUFBTSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxVQUFVLElBQUksRUFBRTtBQUN6RCxXQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLEtBQUssRUFBRTtBQUNsQyxhQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN4QyxVQUFJLEVBQUUsQ0FBQTtLQUNQLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNIOztBQUVNLFNBQVMsbUJBQW1CLENBQUUsT0FBTyxFQUFFLEtBQUssRUFBbUI7TUFBakIsT0FBTyx5REFBRyxLQUFLOztBQUNsRSxTQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxRQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsWUFBTTtBQUNyQyxZQUFNLENBQUMsSUFBSSxLQUFLLDhCQUEyQixLQUFLLGNBQVUsQ0FBQyxDQUFBO0tBQzVELEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDWCxXQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxZQUFNO0FBQ3hCLGtCQUFZLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDM0IsYUFBTyxFQUFFLENBQUE7S0FDVixDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCIsImZpbGUiOiIvVXNlcnMvdmljdG9yLm1hcnRpbnMvLmF0b20vcGFja2FnZXMvcGFuZXIvc3BlYy9hc3luYy1zcGVjLWhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLy8gQm9ycm93ZWQgZnJvbSBBdG9tIGNvcmUncyBzcGVjLlxuXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlRWFjaCAoZm4pIHtcbiAgZ2xvYmFsLmJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGZuKClcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHJlc3VsdClcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZnRlckVhY2ggKGZuKSB7XG4gIGdsb2JhbC5hZnRlckVhY2goZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGZuKClcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHJlc3VsdClcbiAgICB9XG4gIH0pXG59XG5cblsnaXQnLCAnZml0JywgJ2ZmaXQnLCAnZmZmaXQnXS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gIG1vZHVsZS5leHBvcnRzW25hbWVdID0gZnVuY3Rpb24gKGRlc2NyaXB0aW9uLCBmbikge1xuICAgIGdsb2JhbFtuYW1lXShkZXNjcmlwdGlvbiwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZm4oKVxuICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHJlc3VsdClcbiAgICAgIH1cbiAgICB9KVxuICB9XG59KVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29uZGl0aW9uUHJvbWlzZSAoY29uZGl0aW9uKSAge1xuICBjb25zdCBzdGFydFRpbWUgPSBEYXRlLm5vdygpXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBhd2FpdCB0aW1lb3V0UHJvbWlzZSgxMDApXG5cbiAgICBpZiAoYXdhaXQgY29uZGl0aW9uKCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChEYXRlLm5vdygpIC0gc3RhcnRUaW1lID4gNTAwMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGltZWQgb3V0IHdhaXRpbmcgb24gY29uZGl0aW9uXCIpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aW1lb3V0UHJvbWlzZSAodGltZW91dCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICBnbG9iYWwuc2V0VGltZW91dChyZXNvbHZlLCB0aW1lb3V0KVxuICB9KVxufVxuXG5mdW5jdGlvbiB3YWl0c0ZvclByb21pc2UgKGZuKSB7XG4gIGNvbnN0IHByb21pc2UgPSBmbigpXG4gIGdsb2JhbC53YWl0c0Zvcignc3BlYyBwcm9taXNlIHRvIHJlc29sdmUnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHByb21pc2UudGhlbihkb25lLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGphc21pbmUuZ2V0RW52KCkuY3VycmVudFNwZWMuZmFpbChlcnJvcilcbiAgICAgIGRvbmUoKVxuICAgIH0pXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbWl0dGVyRXZlbnRQcm9taXNlIChlbWl0dGVyLCBldmVudCwgdGltZW91dCA9IDE1MDAwKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgdGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcihgVGltZWQgb3V0IHdhaXRpbmcgZm9yICcke2V2ZW50fScgZXZlbnRgKSlcbiAgICB9LCB0aW1lb3V0KVxuICAgIGVtaXR0ZXIub25jZShldmVudCwgKCkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRIYW5kbGUpXG4gICAgICByZXNvbHZlKClcbiAgICB9KVxuICB9KVxufVxuIl19