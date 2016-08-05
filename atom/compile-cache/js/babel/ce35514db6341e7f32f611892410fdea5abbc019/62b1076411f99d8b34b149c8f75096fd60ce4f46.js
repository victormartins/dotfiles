'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {
  function DiffViewEditor(editor) {
    _classCallCheck(this, DiffViewEditor);

    this._editor = editor;
    this._markers = [];
    this._currentSelection = null;
    this._oldPlaceholderText = editor.getPlaceholderText();
    editor.setPlaceholderText('Paste what you want to diff here!');
  }

  /**
   * Creates a decoration for an offset. Adds the marker to this._markers.
   *
   * @param lineNumber The line number to add the block decoration to.
   * @param numberOfLines The number of lines that the block decoration's height will be.
   * @param blockPosition Specifies whether to put the decoration before the line or after.
   */

  _createClass(DiffViewEditor, [{
    key: '_addOffsetDecoration',
    value: function _addOffsetDecoration(lineNumber, numberOfLines, blockPosition) {
      var element = document.createElement('div');
      element.className += 'split-diff-offset';
      // if no text, set height for blank lines
      element.style.minHeight = numberOfLines * this._editor.getLineHeightInPixels() + 'px';

      var marker = this._editor.markScreenPosition([lineNumber, 0], { invalidate: 'never', persistent: false });
      this._editor.decorateMarker(marker, { type: 'block', position: blockPosition, item: element });
      this._markers.push(marker);
    }

    /**
     * Adds offsets (blank lines) into the editor.
     *
     * @param lineOffsets An array of offsets (blank lines) to insert into this editor.
     */
  }, {
    key: 'setLineOffsets',
    value: function setLineOffsets(lineOffsets) {
      var offsetLineNumbers = Object.keys(lineOffsets).map(function (lineNumber) {
        return parseInt(lineNumber, 10);
      }).sort(function (x, y) {
        return x - y;
      });

      for (var offsetLineNumber of offsetLineNumbers) {
        if (offsetLineNumber == 0) {
          // add block decoration before if adding to line 0
          this._addOffsetDecoration(offsetLineNumber - 1, lineOffsets[offsetLineNumber], 'before');
        } else {
          // add block decoration after if adding to lines > 0
          this._addOffsetDecoration(offsetLineNumber - 1, lineOffsets[offsetLineNumber], 'after');
        }
      }
    }

    /**
     * Creates markers for line highlights. Adds them to this._markers. Should be
     * called before setLineOffsets since this initializes this._markers.
     *
     * @param changedLines An array of buffer line numbers that should be highlighted.
     * @param type The type of highlight to be applied to the line.
     */
  }, {
    key: 'setLineHighlights',
    value: function setLineHighlights(changedLines, highlightType) {
      if (changedLines === undefined) changedLines = [];

      var highlightClass = 'split-diff-' + highlightType;
      for (var i = 0; i < changedLines.length; i++) {
        this._markers.push(this._createLineMarker(changedLines[i][0], changedLines[i][1], highlightClass));
      }
    }

    /**
     * Creates a marker and decorates its line and line number.
     *
     * @param startLineNumber A buffer line number to start highlighting at.
     * @param endLineNumber A buffer line number to end highlighting at.
     * @param highlightClass The type of highlight to be applied to the line.
     *    Could be a value of: ['split-diff-insert', 'split-diff-delete',
     *    'split-diff-select'].
     * @return The created line marker.
     */
  }, {
    key: '_createLineMarker',
    value: function _createLineMarker(startLineNumber, endLineNumber, highlightClass) {
      var marker = this._editor.markBufferRange([[startLineNumber, 0], [endLineNumber, 0]], { invalidate: 'never', persistent: false, 'class': highlightClass });

      this._editor.decorateMarker(marker, { type: 'line-number', 'class': highlightClass });
      this._editor.decorateMarker(marker, { type: 'line', 'class': highlightClass });

      return marker;
    }

    /**
     * Highlights words in a given line.
     *
     * @param lineNumber The line number to highlight words on.
     * @param wordDiff An array of objects which look like...
     *    added: boolean (not used)
     *    count: number (not used)
     *    removed: boolean (not used)
     *    value: string
     *    changed: boolean
     * @param type The type of highlight to be applied to the words.
     */
  }, {
    key: 'setWordHighlights',
    value: function setWordHighlights(lineNumber, wordDiff, type, isWhitespaceIgnored) {
      if (wordDiff === undefined) wordDiff = [];

      var klass = 'split-diff-word-' + type;
      var count = 0;

      for (var i = 0; i < wordDiff.length; i++) {
        // if there was a change
        // AND one of these is true:
        // if the string is not spaces, highlight
        // OR
        // if the string is spaces and whitespace not ignored, highlight
        if (wordDiff[i].changed && (/\S/.test(wordDiff[i].value) || !/\S/.test(wordDiff[i].value) && !isWhitespaceIgnored)) {
          var marker = this._editor.markBufferRange([[lineNumber, count], [lineNumber, count + wordDiff[i].value.length]], { invalidate: 'never', persistent: false, 'class': klass });

          this._editor.decorateMarker(marker, { type: 'highlight', 'class': klass });
          this._markers.push(marker);
        }
        count += wordDiff[i].value.length;
      }
    }

    /**
     * Destroys all markers added to this editor by split-diff.
     */
  }, {
    key: 'destroyMarkers',
    value: function destroyMarkers() {
      for (var i = 0; i < this._markers.length; i++) {
        this._markers[i].destroy();
      }
      this._markers = [];

      this.deselectAllLines();
      this._editor.setPlaceholderText(this._oldPlaceholderText);
    }

    /**
     * Not added to this._markers because we want it to persist between updates.
     *
     * @param startLine The line number that the selection starts at.
     * @param endLine The line number that the selection ends at (non-inclusive).
     */
  }, {
    key: 'selectLines',
    value: function selectLines(startLine, endLine) {
      // don't want to highlight if they are the same (same numbers means chunk is
      // just pointing to a location to copy-to-right/copy-to-left)
      if (startLine < endLine) {
        this._currentSelection = this._createLineMarker(startLine, endLine, 'split-diff-selected');
      }
    }

    /**
     * Destroy the selection markers.
     */
  }, {
    key: 'deselectAllLines',
    value: function deselectAllLines() {
      if (this._currentSelection) {
        this._currentSelection.destroy();
        this._currentSelection = null;
      }
    }

    /**
     * Enable soft wrap for this editor.
     */
  }, {
    key: 'enableSoftWrap',
    value: function enableSoftWrap() {
      try {
        this._editor.setSoftWrapped(true);
      } catch (e) {
        //console.log('Soft wrap was enabled on a text editor that does not exist.');
      }
    }

    /**
     * Removes the text editor without prompting a save.
     */
  }, {
    key: 'cleanUp',
    value: function cleanUp() {
      this._editor.setText('');
      this._editor.destroy();
    }

    /**
     * Finds cursor-touched line ranges that are marked as different in an editor
     * view.
     *
     * @return The line ranges of diffs that are touched by a cursor.
     */
  }, {
    key: 'getCursorDiffLines',
    value: function getCursorDiffLines() {
      var cursorPositions = this._editor.getCursorBufferPositions();
      var touchedLines = [];

      for (var i = 0; i < cursorPositions.length; i++) {
        for (var j = 0; j < this._markers.length; j++) {
          var markerRange = this._markers[j].getBufferRange();

          if (cursorPositions[i].row >= markerRange.start.row && cursorPositions[i].row < markerRange.end.row) {
            touchedLines.push(markerRange);
            break;
          }
        }
      }

      // put the chunks in order so the copy function doesn't mess up
      touchedLines.sort(function (lineA, lineB) {
        return lineA.start.row - lineB.start.row;
      });

      return touchedLines;
    }

    /**
     * Used to get the Text Editor object for this view. Helpful for calling basic
     * Atom Text Editor functions.
     *
     * @return The Text Editor object for this view.
     */
  }, {
    key: 'getEditor',
    value: function getEditor() {
      return this._editor;
    }
  }]);

  return DiffViewEditor;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9naXQtdGltZS1tYWNoaW5lL25vZGVfbW9kdWxlcy9zcGxpdC1kaWZmL2xpYi9idWlsZC1saW5lcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7OztBQUVYLE1BQU0sQ0FBQyxPQUFPO0FBS0QsV0FMVSxjQUFjLENBS3ZCLE1BQU0sRUFBRTswQkFMQyxjQUFjOztBQU1qQyxRQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN0QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztBQUN2RCxVQUFNLENBQUMsa0JBQWtCLENBQUMsbUNBQW1DLENBQUMsQ0FBQztHQUNoRTs7Ozs7Ozs7OztlQVhvQixjQUFjOztXQW9CZiw4QkFBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBUTtBQUNuRSxVQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLGFBQU8sQ0FBQyxTQUFTLElBQUksbUJBQW1CLENBQUM7O0FBRXpDLGFBQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEFBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsR0FBSSxJQUFJLENBQUM7O0FBRXhGLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0FBQ3hHLFVBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFB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QUM7O0FBRXBELGNBQUksZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFDOUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtBQUMvQyx3QkFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMvQixrQkFBTTtXQUNUO1NBQ0Y7T0FDRjs7O0FBR0Qsa0JBQVksQ0FBQyxJQUFJLENBQUMsVUFBUyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3ZDLGVBQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7T0FDMUMsQ0FBQyxDQUFDOztBQUVILGFBQU8sWUFBWSxDQUFDO0tBQ3JCOzs7Ozs7Ozs7O1dBUVEscUJBQWU7QUFDdEIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCOzs7U0FuTm9CLGNBQWM7SUFvTnBDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvbm9kZV9tb2R1bGVzL3NwbGl0LWRpZmYvbGliL2J1aWxkLWxpbmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEaWZmVmlld0VkaXRvciB7XG4gIF9lZGl0b3I6IE9iamVjdDtcbiAgX21hcmtlcnM6IEFycmF5PGF0b20kTWFya2VyPjtcbiAgX2N1cnJlbnRTZWxlY3Rpb246IEFycmF5PGF0b20kTWFya2VyPjtcblxuICBjb25zdHJ1Y3RvcihlZGl0b3IpIHtcbiAgICB0aGlzLl9lZGl0b3IgPSBlZGl0b3I7XG4gICAgdGhpcy5fbWFya2VycyA9IFtdO1xuICAgIHRoaXMuX2N1cnJlbnRTZWxlY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX29sZFBsYWNlaG9sZGVyVGV4dCA9IGVkaXRvci5nZXRQbGFjZWhvbGRlclRleHQoKTtcbiAgICBlZGl0b3Iuc2V0UGxhY2Vob2xkZXJUZXh0KCdQYXN0ZSB3aGF0IHlvdSB3YW50IHRvIGRpZmYgaGVyZSEnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZGVjb3JhdGlvbiBmb3IgYW4gb2Zmc2V0LiBBZGRzIHRoZSBtYXJrZXIgdG8gdGhpcy5fbWFya2Vycy5cbiAgICpcbiAgICogQHBhcmFtIGxpbmVOdW1iZXIgVGhlIGxpbmUgbnVtYmVyIHRvIGFkZCB0aGUgYmxvY2sgZGVjb3JhdGlvbiB0by5cbiAgICogQHBhcmFtIG51bWJlck9mTGluZXMgVGhlIG51bWJlciBvZiBsaW5lcyB0aGF0IHRoZSBibG9jayBkZWNvcmF0aW9uJ3MgaGVpZ2h0IHdpbGwgYmUuXG4gICAqIEBwYXJhbSBibG9ja1Bvc2l0aW9uIFNwZWNpZmllcyB3aGV0aGVyIHRvIHB1dCB0aGUgZGVjb3JhdGlvbiBiZWZvcmUgdGhlIGxpbmUgb3IgYWZ0ZXIuXG4gICAqL1xuICBfYWRkT2Zmc2V0RGVjb3JhdGlvbihsaW5lTnVtYmVyLCBudW1iZXJPZkxpbmVzLCBibG9ja1Bvc2l0aW9uKTogdm9pZCB7XG4gICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSArPSAnc3BsaXQtZGlmZi1vZmZzZXQnO1xuICAgIC8vIGlmIG5vIHRleHQsIHNldCBoZWlnaHQgZm9yIGJsYW5rIGxpbmVzXG4gICAgZWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSAobnVtYmVyT2ZMaW5lcyAqIHRoaXMuX2VkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKSkgKyAncHgnO1xuXG4gICAgdmFyIG1hcmtlciA9IHRoaXMuX2VkaXRvci5tYXJrU2NyZWVuUG9zaXRpb24oW2xpbmVOdW1iZXIsIDBdLCB7aW52YWxpZGF0ZTogJ25ldmVyJywgcGVyc2lzdGVudDogZmFsc2V9KTtcbiAgICB0aGlzLl9lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2Jsb2NrJywgcG9zaXRpb246IGJsb2NrUG9zaXRpb24sIGl0ZW06IGVsZW1lbnR9KTtcbiAgICB0aGlzLl9tYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIG9mZnNldHMgKGJsYW5rIGxpbmVzKSBpbnRvIHRoZSBlZGl0b3IuXG4gICAqXG4gICAqIEBwYXJhbSBsaW5lT2Zmc2V0cyBBbiBhcnJheSBvZiBvZmZzZXRzIChibGFuayBsaW5lcykgdG8gaW5zZXJ0IGludG8gdGhpcyBlZGl0b3IuXG4gICAqL1xuICBzZXRMaW5lT2Zmc2V0cyhsaW5lT2Zmc2V0czogYW55KTogdm9pZCB7XG4gICAgdmFyIG9mZnNldExpbmVOdW1iZXJzID0gT2JqZWN0LmtleXMobGluZU9mZnNldHMpLm1hcChsaW5lTnVtYmVyID0+IHBhcnNlSW50KGxpbmVOdW1iZXIsIDEwKSkuc29ydCgoeCwgeSkgPT4geCAtIHkpO1xuXG4gICAgZm9yICh2YXIgb2Zmc2V0TGluZU51bWJlciBvZiBvZmZzZXRMaW5lTnVtYmVycykge1xuICAgICAgaWYgKG9mZnNldExpbmVOdW1iZXIgPT0gMCkge1xuICAgICAgICAvLyBhZGQgYmxvY2sgZGVjb3JhdGlvbiBiZWZvcmUgaWYgYWRkaW5nIHRvIGxpbmUgMFxuICAgICAgICB0aGlzLl9hZGRPZmZzZXREZWNvcmF0aW9uKG9mZnNldExpbmVOdW1iZXItMSwgbGluZU9mZnNldHNbb2Zmc2V0TGluZU51bWJlcl0sICdiZWZvcmUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGFkZCBibG9jayBkZWNvcmF0aW9uIGFmdGVyIGlmIGFkZGluZyB0byBsaW5lcyA+IDBcbiAgICAgICAgdGhpcy5fYWRkT2Zmc2V0RGVjb3JhdGlvbihvZmZzZXRMaW5lTnVtYmVyLTEsIGxpbmVPZmZzZXRzW29mZnNldExpbmVOdW1iZXJdLCAnYWZ0ZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBtYXJrZXJzIGZvciBsaW5lIGhpZ2hsaWdodHMuIEFkZHMgdGhlbSB0byB0aGlzLl9tYXJrZXJzLiBTaG91bGQgYmVcbiAgICogY2FsbGVkIGJlZm9yZSBzZXRMaW5lT2Zmc2V0cyBzaW5jZSB0aGlzIGluaXRpYWxpemVzIHRoaXMuX21hcmtlcnMuXG4gICAqXG4gICAqIEBwYXJhbSBjaGFuZ2VkTGluZXMgQW4gYXJyYXkgb2YgYnVmZmVyIGxpbmUgbnVtYmVycyB0aGF0IHNob3VsZCBiZSBoaWdobGlnaHRlZC5cbiAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgaGlnaGxpZ2h0IHRvIGJlIGFwcGxpZWQgdG8gdGhlIGxpbmUuXG4gICAqL1xuICBzZXRMaW5lSGlnaGxpZ2h0cyhjaGFuZ2VkTGluZXM6IEFycmF5PG51bWJlcj4gPSBbXSwgaGlnaGxpZ2h0VHlwZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdmFyIGhpZ2hsaWdodENsYXNzID0gJ3NwbGl0LWRpZmYtJyArIGhpZ2hsaWdodFR5cGU7XG4gICAgZm9yICh2YXIgaT0wOyBpPGNoYW5nZWRMaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fbWFya2Vycy5wdXNoKHRoaXMuX2NyZWF0ZUxpbmVNYXJrZXIoY2hhbmdlZExpbmVzW2ldWzBdLCBjaGFuZ2VkTGluZXNbaV1bMV0sIGhpZ2hsaWdodENsYXNzKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBtYXJrZXIgYW5kIGRlY29yYXRlcyBpdHMgbGluZSBhbmQgbGluZSBudW1iZXIuXG4gICAqXG4gICAqIEBwYXJhbSBzdGFydExpbmVOdW1iZXIgQSBidWZmZXIgbGluZSBudW1iZXIgdG8gc3RhcnQgaGlnaGxpZ2h0aW5nIGF0LlxuICAgKiBAcGFyYW0gZW5kTGluZU51bWJlciBBIGJ1ZmZlciBsaW5lIG51bWJlciB0byBlbmQgaGlnaGxpZ2h0aW5nIGF0LlxuICAgKiBAcGFyYW0gaGlnaGxpZ2h0Q2xhc3MgVGhlIHR5cGUgb2YgaGlnaGxpZ2h0IHRvIGJlIGFwcGxpZWQgdG8gdGhlIGxpbmUuXG4gICAqICAgIENvdWxkIGJlIGEgdmFsdWUgb2Y6IFsnc3BsaXQtZGlmZi1pbnNlcnQnLCAnc3BsaXQtZGlmZi1kZWxldGUnLFxuICAgKiAgICAnc3BsaXQtZGlmZi1zZWxlY3QnXS5cbiAgICogQHJldHVybiBUaGUgY3JlYXRlZCBsaW5lIG1hcmtlci5cbiAgICovXG4gIF9jcmVhdGVMaW5lTWFya2VyKHN0YXJ0TGluZU51bWJlcjogbnVtYmVyLCBlbmRMaW5lTnVtYmVyOiBudW1iZXIsIGhpZ2hsaWdodENsYXNzOiBzdHJpbmcpOiBhdG9tJE1hcmtlciB7XG4gICAgdmFyIG1hcmtlciA9IHRoaXMuX2VkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW1tzdGFydExpbmVOdW1iZXIsIDBdLCBbZW5kTGluZU51bWJlciwgMF1dLCB7aW52YWxpZGF0ZTogJ25ldmVyJywgcGVyc2lzdGVudDogZmFsc2UsIGNsYXNzOiBoaWdobGlnaHRDbGFzc30pXG5cbiAgICB0aGlzLl9lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUtbnVtYmVyJywgY2xhc3M6IGhpZ2hsaWdodENsYXNzfSk7XG4gICAgdGhpcy5fZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICdsaW5lJywgY2xhc3M6IGhpZ2hsaWdodENsYXNzfSk7XG5cbiAgICByZXR1cm4gbWFya2VyO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgd29yZHMgaW4gYSBnaXZlbiBsaW5lLlxuICAgKlxuICAgKiBAcGFyYW0gbGluZU51bWJlciBUaGUgbGluZSBudW1iZXIgdG8gaGlnaGxpZ2h0IHdvcmRzIG9uLlxuICAgKiBAcGFyYW0gd29yZERpZmYgQW4gYXJyYXkgb2Ygb2JqZWN0cyB3aGljaCBsb29rIGxpa2UuLi5cbiAgICogICAgYWRkZWQ6IGJvb2xlYW4gKG5vdCB1c2VkKVxuICAgKiAgICBjb3VudDogbnVtYmVyIChub3QgdXNlZClcbiAgICogICAgcmVtb3ZlZDogYm9vbGVhbiAobm90IHVzZWQpXG4gICAqICAgIHZhbHVlOiBzdHJpbmdcbiAgICogICAgY2hhbmdlZDogYm9vbGVhblxuICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiBoaWdobGlnaHQgdG8gYmUgYXBwbGllZCB0byB0aGUgd29yZHMuXG4gICAqL1xuICBzZXRXb3JkSGlnaGxpZ2h0cyhsaW5lTnVtYmVyOiBudW1iZXIsIHdvcmREaWZmOiBBcnJheTxhbnk+ID0gW10sIHR5cGU6IHN0cmluZywgaXNXaGl0ZXNwYWNlSWdub3JlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHZhciBrbGFzcyA9ICdzcGxpdC1kaWZmLXdvcmQtJyArIHR5cGU7XG4gICAgdmFyIGNvdW50ID0gMDtcblxuICAgIGZvciAodmFyIGk9MDsgaTx3b3JkRGlmZi5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gaWYgdGhlcmUgd2FzIGEgY2hhbmdlXG4gICAgICAvLyBBTkQgb25lIG9mIHRoZXNlIGlzIHRydWU6XG4gICAgICAvLyBpZiB0aGUgc3RyaW5nIGlzIG5vdCBzcGFjZXMsIGhpZ2hsaWdodFxuICAgICAgLy8gT1JcbiAgICAgIC8vIGlmIHRoZSBzdHJpbmcgaXMgc3BhY2VzIGFuZCB3aGl0ZXNwYWNlIG5vdCBpZ25vcmVkLCBoaWdobGlnaHRcbiAgICAgIGlmICh3b3JkRGlmZltpXS5jaGFuZ2VkXG4gICAgICAgICYmICgvXFxTLy50ZXN0KHdvcmREaWZmW2ldLnZhbHVlKVxuICAgICAgICB8fCAoIS9cXFMvLnRlc3Qod29yZERpZmZbaV0udmFsdWUpICYmICFpc1doaXRlc3BhY2VJZ25vcmVkKSkpIHtcbiAgICAgICAgdmFyIG1hcmtlciA9IHRoaXMuX2VkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW1tsaW5lTnVtYmVyLCBjb3VudF0sIFtsaW5lTnVtYmVyLCAoY291bnQgKyB3b3JkRGlmZltpXS52YWx1ZS5sZW5ndGgpXV0sIHtpbnZhbGlkYXRlOiAnbmV2ZXInLCBwZXJzaXN0ZW50OiBmYWxzZSwgY2xhc3M6IGtsYXNzfSlcblxuICAgICAgICB0aGlzLl9lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiBrbGFzc30pO1xuICAgICAgICB0aGlzLl9tYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgIH1cbiAgICAgIGNvdW50ICs9IHdvcmREaWZmW2ldLnZhbHVlLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveXMgYWxsIG1hcmtlcnMgYWRkZWQgdG8gdGhpcyBlZGl0b3IgYnkgc3BsaXQtZGlmZi5cbiAgICovXG4gIGRlc3Ryb3lNYXJrZXJzKCk6IHZvaWQge1xuICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLl9tYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLl9tYXJrZXJzW2ldLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgdGhpcy5fbWFya2VycyA9IFtdO1xuXG4gICAgdGhpcy5kZXNlbGVjdEFsbExpbmVzKCk7XG4gICAgdGhpcy5fZWRpdG9yLnNldFBsYWNlaG9sZGVyVGV4dCh0aGlzLl9vbGRQbGFjZWhvbGRlclRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdCBhZGRlZCB0byB0aGlzLl9tYXJrZXJzIGJlY2F1c2Ugd2Ugd2FudCBpdCB0byBwZXJzaXN0IGJldHdlZW4gdXBkYXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHN0YXJ0TGluZSBUaGUgbGluZSBudW1iZXIgdGhhdCB0aGUgc2VsZWN0aW9uIHN0YXJ0cyBhdC5cbiAgICogQHBhcmFtIGVuZExpbmUgVGhlIGxpbmUgbnVtYmVyIHRoYXQgdGhlIHNlbGVjdGlvbiBlbmRzIGF0IChub24taW5jbHVzaXZlKS5cbiAgICovXG4gIHNlbGVjdExpbmVzKHN0YXJ0TGluZTogbnVtYmVyLCBlbmRMaW5lOiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBkb24ndCB3YW50IHRvIGhpZ2hsaWdodCBpZiB0aGV5IGFyZSB0aGUgc2FtZSAoc2FtZSBudW1iZXJzIG1lYW5zIGNodW5rIGlzXG4gICAgLy8ganVzdCBwb2ludGluZyB0byBhIGxvY2F0aW9uIHRvIGNvcHktdG8tcmlnaHQvY29weS10by1sZWZ0KVxuICAgIGlmIChzdGFydExpbmUgPCBlbmRMaW5lKSB7XG4gICAgICB0aGlzLl9jdXJyZW50U2VsZWN0aW9uID0gdGhpcy5fY3JlYXRlTGluZU1hcmtlcihzdGFydExpbmUsIGVuZExpbmUsICdzcGxpdC1kaWZmLXNlbGVjdGVkJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIHNlbGVjdGlvbiBtYXJrZXJzLlxuICAgKi9cbiAgZGVzZWxlY3RBbGxMaW5lcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY3VycmVudFNlbGVjdGlvbikge1xuICAgICAgdGhpcy5fY3VycmVudFNlbGVjdGlvbi5kZXN0cm95KCk7XG4gICAgICB0aGlzLl9jdXJyZW50U2VsZWN0aW9uID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlIHNvZnQgd3JhcCBmb3IgdGhpcyBlZGl0b3IuXG4gICAqL1xuICBlbmFibGVTb2Z0V3JhcCgpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fZWRpdG9yLnNldFNvZnRXcmFwcGVkKHRydWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vY29uc29sZS5sb2coJ1NvZnQgd3JhcCB3YXMgZW5hYmxlZCBvbiBhIHRleHQgZWRpdG9yIHRoYXQgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHRleHQgZWRpdG9yIHdpdGhvdXQgcHJvbXB0aW5nIGEgc2F2ZS5cbiAgICovXG4gIGNsZWFuVXAoKTogdm9pZCB7XG4gICAgdGhpcy5fZWRpdG9yLnNldFRleHQoJycpO1xuICAgIHRoaXMuX2VkaXRvci5kZXN0cm95KCk7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgY3Vyc29yLXRvdWNoZWQgbGluZSByYW5nZXMgdGhhdCBhcmUgbWFya2VkIGFzIGRpZmZlcmVudCBpbiBhbiBlZGl0b3JcbiAgICogdmlldy5cbiAgICpcbiAgICogQHJldHVybiBUaGUgbGluZSByYW5nZXMgb2YgZGlmZnMgdGhhdCBhcmUgdG91Y2hlZCBieSBhIGN1cnNvci5cbiAgICovXG4gIGdldEN1cnNvckRpZmZMaW5lcygpOiBib29sZWFuIHtcbiAgICB2YXIgY3Vyc29yUG9zaXRpb25zID0gdGhpcy5fZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpO1xuICAgIHZhciB0b3VjaGVkTGluZXMgPSBbXTtcblxuICAgIGZvciAodmFyIGk9MDsgaTxjdXJzb3JQb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGo9MDsgajx0aGlzLl9tYXJrZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBtYXJrZXJSYW5nZSA9IHRoaXMuX21hcmtlcnNbal0uZ2V0QnVmZmVyUmFuZ2UoKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChjdXJzb3JQb3NpdGlvbnNbaV0ucm93ID49IG1hcmtlclJhbmdlLnN0YXJ0LnJvd1xuICAgICAgICAgICYmIGN1cnNvclBvc2l0aW9uc1tpXS5yb3cgPCBtYXJrZXJSYW5nZS5lbmQucm93KSB7XG4gICAgICAgICAgICB0b3VjaGVkTGluZXMucHVzaChtYXJrZXJSYW5nZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHB1dCB0aGUgY2h1bmtzIGluIG9yZGVyIHNvIHRoZSBjb3B5IGZ1bmN0aW9uIGRvZXNuJ3QgbWVzcyB1cFxuICAgIHRvdWNoZWRMaW5lcy5zb3J0KGZ1bmN0aW9uKGxpbmVBLCBsaW5lQikge1xuICAgICAgcmV0dXJuIGxpbmVBLnN0YXJ0LnJvdyAtIGxpbmVCLnN0YXJ0LnJvdztcbiAgICB9KTtcblxuICAgIHJldHVybiB0b3VjaGVkTGluZXM7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byBnZXQgdGhlIFRleHQgRWRpdG9yIG9iamVjdCBmb3IgdGhpcyB2aWV3LiBIZWxwZnVsIGZvciBjYWxsaW5nIGJhc2ljXG4gICAqIEF0b20gVGV4dCBFZGl0b3IgZnVuY3Rpb25zLlxuICAgKlxuICAgKiBAcmV0dXJuIFRoZSBUZXh0IEVkaXRvciBvYmplY3QgZm9yIHRoaXMgdmlldy5cbiAgICovXG4gIGdldEVkaXRvcigpOiBUZXh0RWRpdG9yIHtcbiAgICByZXR1cm4gdGhpcy5fZWRpdG9yO1xuICB9XG59O1xuIl19
//# sourceURL=/Users/victor.martins/.atom/packages/git-time-machine/node_modules/split-diff/lib/build-lines.js
