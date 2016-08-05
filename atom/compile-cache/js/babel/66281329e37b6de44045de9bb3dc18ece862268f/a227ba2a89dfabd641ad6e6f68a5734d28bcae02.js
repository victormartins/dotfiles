'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('atom');

var CompositeDisposable = _require.CompositeDisposable;

var SyncScroll = (function () {
  function SyncScroll(editor1, editor2) {
    var _this = this;

    _classCallCheck(this, SyncScroll);

    this._subscriptions = new CompositeDisposable();
    this._syncInfo = [{
      editor: editor1,
      scrolling: false
    }, {
      editor: editor2,
      scrolling: false
    }];

    this._syncInfo.forEach(function (editorInfo, i) {
      // Note that 'onDidChangeScrollTop' isn't technically in the public API.
      _this._subscriptions.add(editorInfo.editor.onDidChangeScrollTop(function () {
        return _this._scrollPositionChanged(i);
      }));
    });
  }

  _createClass(SyncScroll, [{
    key: '_scrollPositionChanged',
    value: function _scrollPositionChanged(changeScrollIndex) {
      var thisInfo = this._syncInfo[changeScrollIndex];
      var otherInfo = this._syncInfo[1 - changeScrollIndex];
      if (thisInfo.scrolling) {
        return;
      }
      var thisEditor = thisInfo.editor;
      var otherEditor = otherInfo.editor;

      otherInfo.scrolling = true;
      try {
        otherEditor.setScrollTop(thisEditor.getScrollTop());
      } catch (e) {
        //console.log(e);
      }
      otherInfo.scrolling = false;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._subscriptions) {
        this._subscriptions.dispose();
        this._subscriptions = null;
      }
    }
  }, {
    key: 'syncPositions',
    value: function syncPositions() {
      var activeTextEditor = atom.workspace.getActiveTextEditor();
      this._syncInfo.forEach(function (editorInfo, i) {
        if (editorInfo.editor == activeTextEditor) {
          editorInfo.editor.emitter.emit('did-change-scroll-top', editorInfo.editor.getScrollTop());
        }
      });
    }
  }]);

  return SyncScroll;
})();

module.exports = SyncScroll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9naXQtdGltZS1tYWNoaW5lL25vZGVfbW9kdWxlcy9zcGxpdC1kaWZmL2xpYi9zeW5jLXNjcm9sbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7OztlQUVnQixPQUFPLENBQUMsTUFBTSxDQUFDOztJQUF0QyxtQkFBbUIsWUFBbkIsbUJBQW1COztJQUVsQixVQUFVO0FBRUgsV0FGUCxVQUFVLENBRUYsT0FBbUIsRUFBRSxPQUFtQixFQUFFOzs7MEJBRmxELFVBQVU7O0FBR1osUUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7QUFDaEQsUUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDO0FBQ2hCLFlBQU0sRUFBRSxPQUFPO0FBQ2YsZUFBUyxFQUFFLEtBQUs7S0FDakIsRUFBRTtBQUNELFlBQU0sRUFBRSxPQUFPO0FBQ2YsZUFBUyxFQUFFLEtBQUs7S0FDakIsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVSxFQUFFLENBQUMsRUFBSzs7QUFFeEMsWUFBSyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUM7ZUFBTSxNQUFLLHNCQUFzQixDQUFDLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQyxDQUFDO0tBQ3ZHLENBQUMsQ0FBQztHQUNKOztlQWhCRyxVQUFVOztXQWtCUSxnQ0FBQyxpQkFBeUIsRUFBUTtBQUN0RCxVQUFJLFFBQVEsR0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDbEQsVUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztBQUN0RCxVQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUU7QUFDdEIsZUFBTztPQUNSO1VBQ1ksVUFBVSxHQUFJLFFBQVEsQ0FBOUIsTUFBTTtVQUNFLFdBQVcsR0FBSSxTQUFTLENBQWhDLE1BQU07O0FBQ1gsZUFBUyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDM0IsVUFBSTtBQUNGLG1CQUFXLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO09BQ3JELENBQUMsT0FBTyxDQUFDLEVBQUU7O09BRVg7QUFDRCxlQUFTLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUM3Qjs7O1dBRU0sbUJBQVM7QUFDZCxVQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDdkIsWUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QixZQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztPQUM1QjtLQUNGOzs7V0FFWSx5QkFBUztBQUNwQixVQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUM1RCxVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUs7QUFDeEMsWUFBRyxVQUFVLENBQUMsTUFBTSxJQUFJLGdCQUFnQixFQUFFO0FBQ3hDLG9CQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQzNGO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztTQWpERyxVQUFVOzs7QUFvRGhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9naXQtdGltZS1tYWNoaW5lL25vZGVfbW9kdWxlcy9zcGxpdC1kaWZmL2xpYi9zeW5jLXNjcm9sbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG52YXIge0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSgnYXRvbScpO1xuXG5jbGFzcyBTeW5jU2Nyb2xsIHtcblxuICBjb25zdHJ1Y3RvcihlZGl0b3IxOiBUZXh0RWRpdG9yLCBlZGl0b3IyOiBUZXh0RWRpdG9yKSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5fc3luY0luZm8gPSBbe1xuICAgICAgZWRpdG9yOiBlZGl0b3IxLFxuICAgICAgc2Nyb2xsaW5nOiBmYWxzZSxcbiAgICB9LCB7XG4gICAgICBlZGl0b3I6IGVkaXRvcjIsXG4gICAgICBzY3JvbGxpbmc6IGZhbHNlLFxuICAgIH1dO1xuXG4gICAgdGhpcy5fc3luY0luZm8uZm9yRWFjaCgoZWRpdG9ySW5mbywgaSkgPT4ge1xuICAgICAgLy8gTm90ZSB0aGF0ICdvbkRpZENoYW5nZVNjcm9sbFRvcCcgaXNuJ3QgdGVjaG5pY2FsbHkgaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmFkZChlZGl0b3JJbmZvLmVkaXRvci5vbkRpZENoYW5nZVNjcm9sbFRvcCgoKSA9PiB0aGlzLl9zY3JvbGxQb3NpdGlvbkNoYW5nZWQoaSkpKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9zY3JvbGxQb3NpdGlvbkNoYW5nZWQoY2hhbmdlU2Nyb2xsSW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIHZhciB0aGlzSW5mbyAgPSB0aGlzLl9zeW5jSW5mb1tjaGFuZ2VTY3JvbGxJbmRleF07XG4gICAgdmFyIG90aGVySW5mbyA9IHRoaXMuX3N5bmNJbmZvWzEgLSBjaGFuZ2VTY3JvbGxJbmRleF07XG4gICAgaWYgKHRoaXNJbmZvLnNjcm9sbGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIge2VkaXRvcjogdGhpc0VkaXRvcn0gPSB0aGlzSW5mbztcbiAgICB2YXIge2VkaXRvcjogb3RoZXJFZGl0b3J9ID0gb3RoZXJJbmZvO1xuICAgIG90aGVySW5mby5zY3JvbGxpbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBvdGhlckVkaXRvci5zZXRTY3JvbGxUb3AodGhpc0VkaXRvci5nZXRTY3JvbGxUb3AoKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy9jb25zb2xlLmxvZyhlKTtcbiAgICB9XG4gICAgb3RoZXJJbmZvLnNjcm9sbGluZyA9IGZhbHNlO1xuICB9XG5cbiAgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzeW5jUG9zaXRpb25zKCk6IHZvaWQge1xuICAgIHZhciBhY3RpdmVUZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIHRoaXMuX3N5bmNJbmZvLmZvckVhY2goKGVkaXRvckluZm8sIGkpID0+IHtcbiAgICAgIGlmKGVkaXRvckluZm8uZWRpdG9yID09IGFjdGl2ZVRleHRFZGl0b3IpIHtcbiAgICAgICAgZWRpdG9ySW5mby5lZGl0b3IuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXNjcm9sbC10b3AnLCBlZGl0b3JJbmZvLmVkaXRvci5nZXRTY3JvbGxUb3AoKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTeW5jU2Nyb2xsO1xuIl19
//# sourceURL=/Users/victor.martins/.atom/packages/git-time-machine/node_modules/split-diff/lib/sync-scroll.js
