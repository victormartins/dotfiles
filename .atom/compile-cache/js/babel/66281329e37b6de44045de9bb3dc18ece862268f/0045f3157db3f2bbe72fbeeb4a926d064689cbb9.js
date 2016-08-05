'use babel';

function mouseEvent(type, properties) {
  var defaults = {
    bubbles: true,
    cancelable: type !== 'mousemove',
    view: window,
    detail: 0,
    pageX: 0,
    pageY: 0,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: undefined
  };

  for (var k in defaults) {
    var v = defaults[k];
    if (!(properties[k] != null)) {
      properties[k] = v;
    }
  }

  var e = new MouseEvent(type, properties);

  for (var k in properties) {
    if (e[k] !== properties[k]) {
      e[k] = properties[k];
    }
  }

  return e;
}

function touchEvent(type, touches) {
  var event = new Event(type, {
    bubbles: true,
    cancelable: true,
    view: window,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    relatedTarget: undefined
  });
  event.touches = event.changedTouches = event.targetTouches = touches;

  return event;
}

function objectCenterCoordinates(obj) {
  var _obj$getBoundingClientRect = obj.getBoundingClientRect();

  var top = _obj$getBoundingClientRect.top;
  var left = _obj$getBoundingClientRect.left;
  var width = _obj$getBoundingClientRect.width;
  var height = _obj$getBoundingClientRect.height;

  return { x: left + width / 2, y: top + height / 2 };
}

function exists(value) {
  return typeof value !== 'undefined' && value !== null;
}

module.exports = { objectCenterCoordinates: objectCenterCoordinates, mouseEvent: mouseEvent };['mousedown', 'mousemove', 'mouseup', 'click'].forEach(function (key) {
  module.exports[key] = function (obj) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var x = _ref.x;
    var y = _ref.y;
    var cx = _ref.cx;
    var cy = _ref.cy;
    var btn = _ref.btn;

    if (!(typeof x !== 'undefined' && x !== null && typeof y !== 'undefined' && y !== null)) {
      var o = objectCenterCoordinates(obj);
      x = o.x;
      y = o.y;
    }

    if (!(typeof cx !== 'undefined' && cx !== null && typeof cy !== 'undefined' && cy !== null)) {
      cx = x;
      cy = y;
    }

    obj.dispatchEvent(mouseEvent(key, {
      pageX: x, pageY: y, clientX: cx, clientY: cy, button: btn
    }));
  };
});

module.exports.mousewheel = function (obj) {
  var deltaX = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var deltaY = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  obj.dispatchEvent(mouseEvent('mousewheel', {
    deltaX: deltaX,
    deltaY: deltaY,
    wheelDeltaX: deltaX,
    wheelDeltaY: deltaY
  }));
};['touchstart', 'touchmove', 'touchend'].forEach(function (key) {
  module.exports[key] = function (obj, touches) {
    if (!Array.isArray(touches)) {
      touches = [touches];
    }

    touches.forEach(function (touch) {
      if (!exists(touch.target)) {
        touch.target = obj;
      }

      if (!(exists(touch.pageX) && exists(touch.pageY))) {
        var o = objectCenterCoordinates(obj);
        touch.pageX = exists(touch.x) ? touch.x : o.x;
        touch.pageY = exists(touch.y) ? touch.y : o.y;
      }

      if (!(exists(touch.clientX) && exists(touch.clientY))) {
        touch.clientX = touch.pageX;
        touch.clientY = touch.pageY;
      }
    });

    obj.dispatchEvent(touchEvent(key, touches));
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL3NwZWMvaGVscGVycy9ldmVudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOztBQUVYLFNBQVMsVUFBVSxDQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7QUFDckMsTUFBSSxRQUFRLEdBQUc7QUFDYixXQUFPLEVBQUUsSUFBSTtBQUNiLGNBQVUsRUFBRyxJQUFJLEtBQUssV0FBVyxBQUFDO0FBQ2xDLFFBQUksRUFBRSxNQUFNO0FBQ1osVUFBTSxFQUFFLENBQUM7QUFDVCxTQUFLLEVBQUUsQ0FBQztBQUNSLFNBQUssRUFBRSxDQUFDO0FBQ1IsV0FBTyxFQUFFLENBQUM7QUFDVixXQUFPLEVBQUUsQ0FBQztBQUNWLFdBQU8sRUFBRSxLQUFLO0FBQ2QsVUFBTSxFQUFFLEtBQUs7QUFDYixZQUFRLEVBQUUsS0FBSztBQUNmLFdBQU8sRUFBRSxLQUFLO0FBQ2QsVUFBTSxFQUFFLENBQUM7QUFDVCxpQkFBYSxFQUFFLFNBQVM7R0FDekIsQ0FBQTs7QUFFRCxPQUFLLElBQUksQ0FBQyxJQUFJLFFBQVEsRUFBRTtBQUN0QixRQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbkIsUUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUEsQUFBQyxFQUFFO0FBQzVCLGdCQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ2xCO0dBQ0Y7O0FBRUQsTUFBTSxDQUFDLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFBOztBQUUxQyxPQUFLLElBQUksQ0FBQyxJQUFJLFVBQVUsRUFBRTtBQUN4QixRQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDMUIsT0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxD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LEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBLEFBQUMsRUFBRTtBQUNyRCxhQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUE7QUFDM0IsYUFBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFBO09BQzVCO0tBQ0YsQ0FBQyxDQUFBOztBQUVGLE9BQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO0dBQzVDLENBQUE7Q0FDRixDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9oZWxwZXJzL2V2ZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmZ1bmN0aW9uIG1vdXNlRXZlbnQgKHR5cGUsIHByb3BlcnRpZXMpIHtcbiAgbGV0IGRlZmF1bHRzID0ge1xuICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgY2FuY2VsYWJsZTogKHR5cGUgIT09ICdtb3VzZW1vdmUnKSxcbiAgICB2aWV3OiB3aW5kb3csXG4gICAgZGV0YWlsOiAwLFxuICAgIHBhZ2VYOiAwLFxuICAgIHBhZ2VZOiAwLFxuICAgIGNsaWVudFg6IDAsXG4gICAgY2xpZW50WTogMCxcbiAgICBjdHJsS2V5OiBmYWxzZSxcbiAgICBhbHRLZXk6IGZhbHNlLFxuICAgIHNoaWZ0S2V5OiBmYWxzZSxcbiAgICBtZXRhS2V5OiBmYWxzZSxcbiAgICBidXR0b246IDAsXG4gICAgcmVsYXRlZFRhcmdldDogdW5kZWZpbmVkXG4gIH1cblxuICBmb3IgKGxldCBrIGluIGRlZmF1bHRzKSB7XG4gICAgbGV0IHYgPSBkZWZhdWx0c1trXVxuICAgIGlmICghKHByb3BlcnRpZXNba10gIT0gbnVsbCkpIHtcbiAgICAgIHByb3BlcnRpZXNba10gPSB2XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZSA9IG5ldyBNb3VzZUV2ZW50KHR5cGUsIHByb3BlcnRpZXMpXG5cbiAgZm9yIChsZXQgayBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgaWYgKGVba10gIT09IHByb3BlcnRpZXNba10pIHtcbiAgICAgIGVba10gPSBwcm9wZXJ0aWVzW2tdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVcbn1cblxuZnVuY3Rpb24gdG91Y2hFdmVudCAodHlwZSwgdG91Y2hlcykge1xuICBsZXQgZXZlbnQgPSBuZXcgRXZlbnQodHlwZSwge1xuICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICB2aWV3OiB3aW5kb3csXG4gICAgY3RybEtleTogZmFsc2UsXG4gICAgYWx0S2V5OiBmYWxzZSxcbiAgICBzaGlmdEtleTogZmFsc2UsXG4gICAgbWV0YUtleTogZmFsc2UsXG4gICAgcmVsYXRlZFRhcmdldDogdW5kZWZpbmVkXG4gIH0pXG4gIGV2ZW50LnRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcyA9IGV2ZW50LnRhcmdldFRvdWNoZXMgPSB0b3VjaGVzXG5cbiAgcmV0dXJuIGV2ZW50XG59XG5cbmZ1bmN0aW9uIG9iamVjdENlbnRlckNvb3JkaW5hdGVzIChvYmopIHtcbiAgbGV0IHt0b3AsIGxlZnQsIHdpZHRoLCBoZWlnaHR9ID0gb2JqLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHJldHVybiB7eDogbGVmdCArIHdpZHRoIC8gMiwgeTogdG9wICsgaGVpZ2h0IC8gMn1cbn1cblxuZnVuY3Rpb24gZXhpc3RzICh2YWx1ZSkge1xuICByZXR1cm4gKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09IG51bGwpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge29iamVjdENlbnRlckNvb3JkaW5hdGVzLCBtb3VzZUV2ZW50fVxuXG47Wydtb3VzZWRvd24nLCAnbW91c2Vtb3ZlJywgJ21vdXNldXAnLCAnY2xpY2snXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgbW9kdWxlLmV4cG9ydHNba2V5XSA9IGZ1bmN0aW9uIChvYmosIHt4LCB5LCBjeCwgY3ksIGJ0bn0gPSB7fSkge1xuICAgIGlmICghKCh0eXBlb2YgeCAhPT0gJ3VuZGVmaW5lZCcgJiYgeCAhPT0gbnVsbCkgJiYgKHR5cGVvZiB5ICE9PSAndW5kZWZpbmVkJyAmJiB5ICE9PSBudWxsKSkpIHtcbiAgICAgIGxldCBvID0gb2JqZWN0Q2VudGVyQ29vcmRpbmF0ZXMob2JqKVxuICAgICAgeCA9IG8ueFxuICAgICAgeSA9IG8ueVxuICAgIH1cblxuICAgIGlmICghKCh0eXBlb2YgY3ggIT09ICd1bmRlZmluZWQnICYmIGN4ICE9PSBudWxsKSAmJiAodHlwZW9mIGN5ICE9PSAndW5kZWZpbmVkJyAmJiBjeSAhPT0gbnVsbCkpKSB7XG4gICAgICBjeCA9IHhcbiAgICAgIGN5ID0geVxuICAgIH1cblxuICAgIG9iai5kaXNwYXRjaEV2ZW50KG1vdXNlRXZlbnQoa2V5LCB7XG4gICAgICBwYWdlWDogeCwgcGFnZVk6IHksIGNsaWVudFg6IGN4LCBjbGllbnRZOiBjeSwgYnV0dG9uOiBidG5cbiAgICB9KSlcbiAgfVxufSlcblxubW9kdWxlLmV4cG9ydHMubW91c2V3aGVlbCA9IGZ1bmN0aW9uIChvYmosIGRlbHRhWCA9IDAsIGRlbHRhWSA9IDApIHtcbiAgb2JqLmRpc3BhdGNoRXZlbnQobW91c2VFdmVudCgnbW91c2V3aGVlbCcsIHtcbiAgICBkZWx0YVgsXG4gICAgZGVsdGFZLFxuICAgIHdoZWVsRGVsdGFYOiBkZWx0YVgsXG4gICAgd2hlZWxEZWx0YVk6IGRlbHRhWVxuICB9KSlcbn1cblxuO1sndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnLCAndG91Y2hlbmQnXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgbW9kdWxlLmV4cG9ydHNba2V5XSA9IGZ1bmN0aW9uIChvYmosIHRvdWNoZXMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodG91Y2hlcykpIHtcbiAgICAgIHRvdWNoZXMgPSBbdG91Y2hlc11cbiAgICB9XG5cbiAgICB0b3VjaGVzLmZvckVhY2goKHRvdWNoKSA9PiB7XG4gICAgICBpZiAoIWV4aXN0cyh0b3VjaC50YXJnZXQpKSB7XG4gICAgICAgIHRvdWNoLnRhcmdldCA9IG9ialxuICAgICAgfVxuXG4gICAgICBpZiAoIShleGlzdHModG91Y2gucGFnZVgpICYmIGV4aXN0cyh0b3VjaC5wYWdlWSkpKSB7XG4gICAgICAgIGxldCBvID0gb2JqZWN0Q2VudGVyQ29vcmRpbmF0ZXMob2JqKVxuICAgICAgICB0b3VjaC5wYWdlWCA9IGV4aXN0cyh0b3VjaC54KSA/IHRvdWNoLnggOiBvLnhcbiAgICAgICAgdG91Y2gucGFnZVkgPSBleGlzdHModG91Y2gueSkgPyB0b3VjaC55IDogby55XG4gICAgICB9XG5cbiAgICAgIGlmICghKGV4aXN0cyh0b3VjaC5jbGllbnRYKSAmJiBleGlzdHModG91Y2guY2xpZW50WSkpKSB7XG4gICAgICAgIHRvdWNoLmNsaWVudFggPSB0b3VjaC5wYWdlWFxuICAgICAgICB0b3VjaC5jbGllbnRZID0gdG91Y2gucGFnZVlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgb2JqLmRpc3BhdGNoRXZlbnQodG91Y2hFdmVudChrZXksIHRvdWNoZXMpKVxuICB9XG59KVxuIl19
//# sourceURL=/Users/victor.martins/.atom/packages/minimap/spec/helpers/events.js
