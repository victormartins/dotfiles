'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('atom');

var Range = _require.Range;

var _require2 = require('./build-lines-helper');

var buildLineRangesWithOffsets = _require2.buildLineRangesWithOffsets;

module.exports = (function () {
  function DiffViewEditor(editor) {
    var _this = this;

    _classCallCheck(this, DiffViewEditor);

    this._editor = editor;
    this._markers = [];
    this._currentSelection = [];
    this._lineOffsets = {};

    // Ugly Hack to the display buffer to allow fake soft wrapped lines,
    // to create the non-numbered empty space needed between real text buffer lines.
    this._originalBuildScreenLines = this._editor.displayBuffer.buildScreenLines;
    this._originalCheckScreenLinesInvariant = this._editor.displayBuffer.checkScreenLinesInvariant;
    this._editor.displayBuffer.checkScreenLinesInvariant = function () {};
    this._editor.displayBuffer.buildScreenLines = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _this._buildScreenLinesWithOffsets.apply(_this, args);
    };
  }

  _createClass(DiffViewEditor, [{
    key: '_buildScreenLinesWithOffsets',
    value: function _buildScreenLinesWithOffsets(startBufferRow, endBufferRow) {
      var _originalBuildScreenLines$apply = this._originalBuildScreenLines.apply(this._editor.displayBuffer, arguments);

      var regions = _originalBuildScreenLines$apply.regions;
      var screenLines = _originalBuildScreenLines$apply.screenLines;

      if (!Object.keys(this._lineOffsets).length) {
        return { regions: regions, screenLines: screenLines };
      }

      return buildLineRangesWithOffsets(screenLines, this._lineOffsets, startBufferRow, endBufferRow, function () {
        var copy = screenLines[0].copy();
        copy.token = [];
        copy.text = '';
        copy.tags = [];
        return copy;
      });
    }
  }, {
    key: 'setLineOffsets',
    value: function setLineOffsets(lineOffsets) {
      this._lineOffsets = lineOffsets;
      // When the diff view is editable: upon edits in the new editor, the old editor needs to update its
      // rendering state to show the offset wrapped lines.
      // This isn't a public API, but came from a discussion on the Atom public channel.
      // Needed Atom API: Request a full re-render from an editor.
      this._editor.displayBuffer.updateAllScreenLines();
    }
  }, {
    key: 'removeLineOffsets',
    value: function removeLineOffsets() {
      this._editor.displayBuffer.checkScreenLinesInvariant = this._originalCheckScreenLinesInvariant;
      this._editor.displayBuffer.buildScreenLines = this._originalBuildScreenLines;
      this._editor.displayBuffer.updateAllScreenLines();
    }

    /**
     * @param addedLines An array of buffer line numbers that should be highlighted as added.
     * @param removedLines An array of buffer line numbers that should be highlighted as removed.
     */
  }, {
    key: 'setLineHighlights',
    value: function setLineHighlights() {
      var _this2 = this;

      var addedLines = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var removedLines = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      this._markers = addedLines.map(function (lineNumber) {
        return _this2._createLineMarker(lineNumber, 'added');
      }).concat(removedLines.map(function (lineNumber) {
        return _this2._createLineMarker(lineNumber, 'removed');
      }));
    }

    /**
     * @param lineNumber A buffer line number to be highlighted.
     * @param type The type of highlight to be applied to the line.
     *    Could be a value of: ['insert', 'delete'].
     */
  }, {
    key: '_createLineMarker',
    value: function _createLineMarker(lineNumber, type) {
      var klass = 'split-diff-' + type;
      var screenPosition = this._editor.screenPositionForBufferPosition({ row: lineNumber, column: 0 });
      var marker = this._editor.markScreenPosition(screenPosition, { invalidate: 'never', persistent: false, 'class': klass });

      this._editor.decorateMarker(marker, { type: 'line', 'class': klass });
      return marker;
    }
  }, {
    key: 'removeLineHighlights',
    value: function removeLineHighlights() {
      this._markers.map(function (marker) {
        return marker.destroy();
      });
    }
  }, {
    key: 'scrollToTop',
    value: function scrollToTop() {
      this._editor.scrollToTop();
    }
  }, {
    key: 'scrollToLine',
    value: function scrollToLine(lineNumber) {
      this._editor.scrollToBufferPosition([lineNumber, 0]);
    }
  }, {
    key: 'destroyMarkers',
    value: function destroyMarkers() {
      for (var i = 0; i < this._markers.length; i++) {
        this._markers[i].destroy();
      }
      this._markers = [];

      this.deselectAllLines();
    }

    /**
     * @param startLine The line number that the selection starts at.
     * @param endLine The line number that the selection ends at (non-inclusive).
     */
  }, {
    key: 'selectLines',
    value: function selectLines(startLine, endLine) {
      for (var i = startLine; i < endLine; i++) {
        this._currentSelection.push(this._createLineMarker(i, 'selected'));
      }
    }
  }, {
    key: 'deselectAllLines',
    value: function deselectAllLines() {
      for (var i = 0; i < this._currentSelection.length; i++) {
        this._currentSelection[i].destroy();
      }
      this._currentSelection = [];
    }
  }, {
    key: 'enableSoftWrap',
    value: function enableSoftWrap() {
      this._editor.setSoftWrapped(true);
    }
  }]);

  return DiffViewEditor;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9naXQtdGltZS1tYWNoaW5lL25vZGVfbW9kdWxlcy9zcGxpdC1kaWZmL2xpYi9idWlsZC1saW5lcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7OztlQUVJLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0lBQXpCLEtBQUssWUFBTCxLQUFLOztnQkFDeUIsT0FBTyxDQUFDLHNCQUFzQixDQUFDOztJQUE3RCwwQkFBMEIsYUFBMUIsMEJBQTBCOztBQUUvQixNQUFNLENBQUMsT0FBTztBQVFELFdBUlUsY0FBYyxDQVF2QixNQUFNLEVBQUU7OzswQkFSQyxjQUFjOztBQVNqQyxRQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN0QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDOzs7O0FBSXZCLFFBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztBQUM3RSxRQUFJLENBQUMsa0NBQWtDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUM7QUFDL0YsUUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMseUJBQXlCLEdBQUcsWUFBTSxFQUFFLENBQUM7QUFDaEUsUUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEdBQUc7d0NBQUksSUFBSTtBQUFKLFlBQUk7OzthQUFLLE1BQUssNEJBQTRCLENBQUMsS0FBSyxRQUFPLElBQUksQ0FBQztLQUFBLENBQUM7R0FDaEg7O2VBcEJvQixjQUFjOztXQXNCUCxzQ0FBQyxjQUFzQixFQUFFLFlBQW9CLEVBQXlCOzRDQUNuRSxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FB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QUFDLHNCQUFzQixDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEQ7OztXQUVhLDBCQUFTO0FBQ3JCLFdBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxZQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQzVCO0FBQ0QsVUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRW5CLFVBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0tBQ3pCOzs7Ozs7OztXQU1VLHFCQUFDLFNBQWlCLEVBQUUsT0FBZSxFQUFRO0FBQ3BELFdBQUksSUFBSSxDQUFDLEdBQUMsU0FBUyxFQUFFLENBQUMsR0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbkMsWUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7T0FDcEU7S0FDRjs7O1dBRWUsNEJBQVM7QUFDdkIsV0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDakQsWUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ3JDO0FBQ0QsVUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztLQUM3Qjs7O1dBRWEsMEJBQVM7QUFDckIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkM7OztTQXJIb0IsY0FBYztJQXNIcEMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvdmljdG9yLm1hcnRpbnMvLmF0b20vcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9ub2RlX21vZHVsZXMvc3BsaXQtZGlmZi9saWIvYnVpbGQtbGluZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG52YXIge1JhbmdlfSAgPSByZXF1aXJlKCdhdG9tJyk7XG52YXIge2J1aWxkTGluZVJhbmdlc1dpdGhPZmZzZXRzfSA9IHJlcXVpcmUoJy4vYnVpbGQtbGluZXMtaGVscGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRGlmZlZpZXdFZGl0b3Ige1xuICBfZWRpdG9yOiBPYmplY3Q7XG4gIF9tYXJrZXJzOiBBcnJheTxhdG9tJE1hcmtlcj47XG4gIF9jdXJyZW50U2VsZWN0aW9uOiBBcnJheTxhdG9tJE1hcmtlcj47XG4gIF9saW5lT2Zmc2V0czogT2JqZWN0O1xuICBfb3JpZ2luYWxCdWlsZFNjcmVlbkxpbmVzOiAoKSA9PiBPYmplY3Q7XG4gIF9vcmlnaW5hbENoZWNrU2NyZWVuTGluZXNJbnZhcmlhbnQ6ICgpID0+IE9iamVjdDtcblxuICBjb25zdHJ1Y3RvcihlZGl0b3IpIHtcbiAgICB0aGlzLl9lZGl0b3IgPSBlZGl0b3I7XG4gICAgdGhpcy5fbWFya2VycyA9IFtdO1xuICAgIHRoaXMuX2N1cnJlbnRTZWxlY3Rpb24gPSBbXTtcbiAgICB0aGlzLl9saW5lT2Zmc2V0cyA9IHt9O1xuXG4gICAgLy8gVWdseSBIYWNrIHRvIHRoZSBkaXNwbGF5IGJ1ZmZlciB0byBhbGxvdyBmYWtlIHNvZnQgd3JhcHBlZCBsaW5lcyxcbiAgICAvLyB0byBjcmVhdGUgdGhlIG5vbi1udW1iZXJlZCBlbXB0eSBzcGFjZSBuZWVkZWQgYmV0d2VlbiByZWFsIHRleHQgYnVmZmVyIGxpbmVzLlxuICAgIHRoaXMuX29yaWdpbmFsQnVpbGRTY3JlZW5MaW5lcyA9IHRoaXMuX2VkaXRvci5kaXNwbGF5QnVmZmVyLmJ1aWxkU2NyZWVuTGluZXM7XG4gICAgdGhpcy5fb3JpZ2luYWxDaGVja1NjcmVlbkxpbmVzSW52YXJpYW50ID0gdGhpcy5fZWRpdG9yLmRpc3BsYXlCdWZmZXIuY2hlY2tTY3JlZW5MaW5lc0ludmFyaWFudDtcbiAgICB0aGlzLl9lZGl0b3IuZGlzcGxheUJ1ZmZlci5jaGVja1NjcmVlbkxpbmVzSW52YXJpYW50ID0gKCkgPT4ge307XG4gICAgdGhpcy5fZWRpdG9yLmRpc3BsYXlCdWZmZXIuYnVpbGRTY3JlZW5MaW5lcyA9ICguLi5hcmdzKSA9PiB0aGlzLl9idWlsZFNjcmVlbkxpbmVzV2l0aE9mZnNldHMuYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICBfYnVpbGRTY3JlZW5MaW5lc1dpdGhPZmZzZXRzKHN0YXJ0QnVmZmVyUm93OiBudW1iZXIsIGVuZEJ1ZmZlclJvdzogbnVtYmVyKTogTGluZVJhbmdlc1dpdGhPZmZzZXRzIHtcbiAgICB2YXIge3JlZ2lvbnMsIHNjcmVlbkxpbmVzfSA9IHRoaXMuX29yaWdpbmFsQnVpbGRTY3JlZW5MaW5lcy5hcHBseSh0aGlzLl9lZGl0b3IuZGlzcGxheUJ1ZmZlciwgYXJndW1lbnRzKTtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuX2xpbmVPZmZzZXRzKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7cmVnaW9ucywgc2NyZWVuTGluZXN9O1xuICAgIH1cblxuICAgIHJldHVybiBidWlsZExpbmVSYW5nZXNXaXRoT2Zmc2V0cyhzY3JlZW5MaW5lcywgdGhpcy5fbGluZU9mZnNldHMsIHN0YXJ0QnVmZmVyUm93LCBlbmRCdWZmZXJSb3csXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHZhciBjb3B5ID0gc2NyZWVuTGluZXNbMF0uY29weSgpO1xuICAgICAgICBjb3B5LnRva2VuID0gW107XG4gICAgICAgIGNvcHkudGV4dCA9ICcnO1xuICAgICAgICBjb3B5LnRhZ3MgPSBbXTtcbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHNldExpbmVPZmZzZXRzKGxpbmVPZmZzZXRzOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9saW5lT2Zmc2V0cyA9IGxpbmVPZmZzZXRzO1xuICAgIC8vIFdoZW4gdGhlIGRpZmYgdmlldyBpcyBlZGl0YWJsZTogdXBvbiBlZGl0cyBpbiB0aGUgbmV3IGVkaXRvciwgdGhlIG9sZCBlZGl0b3IgbmVlZHMgdG8gdXBkYXRlIGl0c1xuICAgIC8vIHJlbmRlcmluZyBzdGF0ZSB0byBzaG93IHRoZSBvZmZzZXQgd3JhcHBlZCBsaW5lcy5cbiAgICAvLyBUaGlzIGlzbid0IGEgcHVibGljIEFQSSwgYnV0IGNhbWUgZnJvbSBhIGRpc2N1c3Npb24gb24gdGhlIEF0b20gcHVibGljIGNoYW5uZWwuXG4gICAgLy8gTmVlZGVkIEF0b20gQVBJOiBSZXF1ZXN0IGEgZnVsbCByZS1yZW5kZXIgZnJvbSBhbiBlZGl0b3IuXG4gICAgdGhpcy5fZWRpdG9yLmRpc3BsYXlCdWZmZXIudXBkYXRlQWxsU2NyZWVuTGluZXMoKTtcbiAgfVxuXG4gIHJlbW92ZUxpbmVPZmZzZXRzKCk6IHZvaWQge1xuICAgIHRoaXMuX2VkaXRvci5kaXNwbGF5QnVmZmVyLmNoZWNrU2NyZWVuTGluZXNJbnZhcmlhbnQgPSB0aGlzLl9vcmlnaW5hbENoZWNrU2NyZWVuTGluZXNJbnZhcmlhbnQ7XG4gICAgdGhpcy5fZWRpdG9yLmRpc3BsYXlCdWZmZXIuYnVpbGRTY3JlZW5MaW5lcyA9IHRoaXMuX29yaWdpbmFsQnVpbGRTY3JlZW5MaW5lcztcbiAgICB0aGlzLl9lZGl0b3IuZGlzcGxheUJ1ZmZlci51cGRhdGVBbGxTY3JlZW5MaW5lcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBhZGRlZExpbmVzIEFuIGFycmF5IG9mIGJ1ZmZlciBsaW5lIG51bWJlcnMgdGhhdCBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQgYXMgYWRkZWQuXG4gICAqIEBwYXJhbSByZW1vdmVkTGluZXMgQW4gYXJyYXkgb2YgYnVmZmVyIGxpbmUgbnVtYmVycyB0aGF0IHNob3VsZCBiZSBoaWdobGlnaHRlZCBhcyByZW1vdmVkLlxuICAgKi9cbiAgc2V0TGluZUhpZ2hsaWdodHMoYWRkZWRMaW5lczogQXJyYXk8bnVtYmVyPiA9IFtdLCByZW1vdmVkTGluZXM6IEFycmF5PG51bWJlcj4gPSBbXSkge1xuICAgIHRoaXMuX21hcmtlcnMgPSBhZGRlZExpbmVzLm1hcChsaW5lTnVtYmVyID0+IHRoaXMuX2NyZWF0ZUxpbmVNYXJrZXIobGluZU51bWJlciwgJ2FkZGVkJykpXG4gICAgICAgIC5jb25jYXQocmVtb3ZlZExpbmVzLm1hcChsaW5lTnVtYmVyID0+IHRoaXMuX2NyZWF0ZUxpbmVNYXJrZXIobGluZU51bWJlciwgJ3JlbW92ZWQnKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBsaW5lTnVtYmVyIEEgYnVmZmVyIGxpbmUgbnVtYmVyIHRvIGJlIGhpZ2hsaWdodGVkLlxuICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBoaWdobGlnaHQgdG8gYmUgYXBwbGllZCB0byB0aGUgbGluZS5cbiAgICogICAgQ291bGQgYmUgYSB2YWx1ZSBvZjogWydpbnNlcnQnLCAnZGVsZXRlJ10uXG4gICAqL1xuICBfY3JlYXRlTGluZU1hcmtlcihsaW5lTnVtYmVyOiBudW1iZXIsIHR5cGU6IHN0cmluZyk6IGF0b20kTWFya2VyIHtcbiAgICB2YXIga2xhc3MgPSAnc3BsaXQtZGlmZi0nICsgdHlwZTtcbiAgICB2YXIgc2NyZWVuUG9zaXRpb24gPSB0aGlzLl9lZGl0b3Iuc2NyZWVuUG9zaXRpb25Gb3JCdWZmZXJQb3NpdGlvbih7cm93OiBsaW5lTnVtYmVyLCBjb2x1bW46IDB9KTtcbiAgICB2YXIgbWFya2VyID0gdGhpcy5fZWRpdG9yLm1hcmtTY3JlZW5Qb3NpdGlvbihzY3JlZW5Qb3NpdGlvbiwge2ludmFsaWRhdGU6ICduZXZlcicsIHBlcnNpc3RlbnQ6IGZhbHNlLCBjbGFzczoga2xhc3N9KTtcblxuICAgIHRoaXMuX2VkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnbGluZScsIGNsYXNzOiBrbGFzc30pO1xuICAgIHJldHVybiBtYXJrZXI7XG4gIH1cblxuICByZW1vdmVMaW5lSGlnaGxpZ2h0cygpOiB2b2lkIHtcbiAgICB0aGlzLl9tYXJrZXJzLm1hcChtYXJrZXIgPT4gbWFya2VyLmRlc3Ryb3koKSk7XG4gIH1cblxuICBzY3JvbGxUb1RvcCgpOiB2b2lkIHtcbiAgICB0aGlzLl9lZGl0b3Iuc2Nyb2xsVG9Ub3AoKTtcbiAgfVxuXG4gIHNjcm9sbFRvTGluZShsaW5lTnVtYmVyOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLl9lZGl0b3Iuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbihbbGluZU51bWJlciwgMF0pO1xuICB9XG5cbiAgZGVzdHJveU1hcmtlcnMoKTogdm9pZCB7XG4gICAgZm9yKHZhciBpPTA7IGk8dGhpcy5fbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fbWFya2Vyc1tpXS5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMuX21hcmtlcnMgPSBbXTtcblxuICAgIHRoaXMuZGVzZWxlY3RBbGxMaW5lcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBzdGFydExpbmUgVGhlIGxpbmUgbnVtYmVyIHRoYXQgdGhlIHNlbGVjdGlvbiBzdGFydHMgYXQuXG4gICAqIEBwYXJhbSBlbmRMaW5lIFRoZSBsaW5lIG51bWJlciB0aGF0IHRoZSBzZWxlY3Rpb24gZW5kcyBhdCAobm9uLWluY2x1c2l2ZSkuXG4gICAqL1xuICBzZWxlY3RMaW5lcyhzdGFydExpbmU6IG51bWJlciwgZW5kTGluZTogbnVtYmVyKTogdm9pZCB7XG4gICAgZm9yKHZhciBpPXN0YXJ0TGluZTsgaTxlbmRMaW5lOyBpKyspIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRTZWxlY3Rpb24ucHVzaCh0aGlzLl9jcmVhdGVMaW5lTWFya2VyKGksICdzZWxlY3RlZCcpKTtcbiAgICB9XG4gIH1cblxuICBkZXNlbGVjdEFsbExpbmVzKCk6IHZvaWQge1xuICAgIGZvcih2YXIgaT0wOyBpPHRoaXMuX2N1cnJlbnRTZWxlY3Rpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRTZWxlY3Rpb25baV0uZGVzdHJveSgpO1xuICAgIH1cbiAgICB0aGlzLl9jdXJyZW50U2VsZWN0aW9uID0gW107XG4gIH1cblxuICBlbmFibGVTb2Z0V3JhcCgpOiB2b2lkIHtcbiAgICB0aGlzLl9lZGl0b3Iuc2V0U29mdFdyYXBwZWQodHJ1ZSk7XG4gIH1cbn07XG4iXX0=
//# sourceURL=/Users/victor.martins/.atom/packages/git-time-machine/node_modules/split-diff/lib/build-lines.js
