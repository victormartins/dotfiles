'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var toggleQuotes = function toggleQuotes(editor) {
  editor.transact(function () {
    for (var cursor of editor.getCursors()) {
      var position = cursor.getBufferPosition();
      toggleQuoteAtPosition(editor, position);
      cursor.setBufferPosition(position);
    }
  });
};

exports.toggleQuotes = toggleQuotes;
var getNextQuoteCharacter = function getNextQuoteCharacter(quoteCharacter, allQuoteCharacters) {
  var index = allQuoteCharacters.indexOf(quoteCharacter);
  if (index === -1) {
    return null;
  } else {
    return allQuoteCharacters[(index + 1) % allQuoteCharacters.length];
  }
};

var toggleQuoteAtPosition = function toggleQuoteAtPosition(editor, position) {
  var quoteChars = atom.config.get('toggle-quotes.quoteCharacters');
  var range = editor.displayBuffer.bufferRangeForScopeAtPosition('.string.quoted', position);

  if (range == null) {
    // Attempt to match the current invalid region if it is wrapped in quotes
    // This is useful for languages where changing the quotes makes the range
    // invalid and so toggling again should properly restore the valid quotes

    range = editor.displayBuffer.bufferRangeForScopeAtPosition('.invalid.illegal', position);
    if (range) {
      var inner = quoteChars.split('').map(function (character) {
        return character + '.*' + character;
      }).join('|');

      if (!RegExp('^(' + inner + ')$', 'g').test(editor.getTextInBufferRange(range))) {
        return;
      }
    }
  }

  if (range == null) {
    return;
  }

  var text = editor.getTextInBufferRange(range);

  var _text = _slicedToArray(text, 1);

  var quoteCharacter = _text[0];

  // In Python a string can have a prefix specifying its format. The Python
  // grammar includes this prefix in the string, and thus we need to exclude
  // it when toggling quotes
  var prefix = '';
  if (/[uUr]/.test(quoteCharacter)) {
    var _text2 = _slicedToArray(text, 2);

    prefix = _text2[0];
    quoteCharacter = _text2[1];
  }

  var nextQuoteCharacter = getNextQuoteCharacter(quoteCharacter, quoteChars);

  if (!nextQuoteCharacter) {
    return;
  }

  // let quoteRegex = new RegExp(quoteCharacter, 'g')
  var escapedQuoteRegex = new RegExp('\\\\' + quoteCharacter, 'g');
  var nextQuoteRegex = new RegExp(nextQuoteCharacter, 'g');

  var newText = text.replace(nextQuoteRegex, '\\' + nextQuoteCharacter).replace(escapedQuoteRegex, quoteCharacter);

  newText = prefix + nextQuoteCharacter + newText.slice(1 + prefix.length, -1) + nextQuoteCharacter;

  editor.setTextInBufferRange(range, newText);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy90b2dnbGUtcXVvdGVzL2xpYi90b2dnbGUtcXVvdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7QUFFSixJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxNQUFNLEVBQUs7QUFDdEMsUUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFNO0FBQ3BCLFNBQUssSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3RDLFVBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0FBQ3pDLDJCQUFxQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUN2QyxZQUFNLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDbkM7R0FDRixDQUFDLENBQUE7Q0FDSCxDQUFBOzs7QUFFRCxJQUFNLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFJLGNBQWMsRUFBRSxrQkFBa0IsRUFBSztBQUNwRSxNQUFJLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDdEQsTUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEIsV0FBTyxJQUFJLENBQUE7R0FDWixNQUFNO0FBQ0wsV0FBTyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUEsR0FBSSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTtHQUNuRTtDQUNGLENBQUE7O0FBRUQsSUFBTSxxQkFBcUIsR0FBRyxTQUF4QixxQkFBcUIsQ0FBSSxNQUFNLEVBQUUsUUFBUSxFQUFLO0FBQ2xELE1BQUksVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUE7QUFDakUsTUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQTs7QUFFMUYsTUFBSSxLQUFLLElBQUksSUFBSSxFQUFFOzs7OztBQUtqQixTQUFLLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUN4RixRQUFJLEtBQUssRUFBRTtBQUNULFVBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsU0FBUztlQUFPLFNBQVMsVUFBSyxTQUFTO09BQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTs7QUFFekYsVUFBSSxDQUFDLE1BQU0sUUFBTSxLQUFLLFNBQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3pFLGVBQU07T0FDUDtLQUNGO0dBQ0Y7O0FBRUQsTUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ2pCLFdBQU07R0FDUDs7QUFFRCxNQUFJLElBQUksR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUE7OzZCQUN0QixJQUFJOztNQUF0QixjQUFjOzs7OztBQUtuQixNQUFJLE1BQU0sR0FBRyxFQUFFLENBQUE7QUFDZixNQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7Z0NBQ0wsSUFBSTs7QUFBOUIsVUFBTTtBQUFFLGtCQUFjO0dBQ3hCOztBQUVELE1BQUksa0JBQWtCLEdBQUcscUJBQXFCLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFBOztBQUUxRSxNQUFJLENBQUMsa0JBQWtCLEVBQUU7QUFDdkIsV0FBTTtHQUNQOzs7QUFHRCxNQUFJLGlCQUFpQixHQUFHLElBQUksTUFBTSxVQUFRLGNBQWMsRUFBSSxHQUFHLENBQUMsQ0FBQTtBQUNoRSxNQUFJLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQTs7QUFFeEQsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUNmLE9BQU8sQ0FBQyxjQUFjLFNBQU8sa0JBQWtCLENBQUcsQ0FDbEQsT0FBTyxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQyxDQUFBOztBQUU3QyxTQUFPLEdBQUcsTUFBTSxHQUFHLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxrQkFBa0IsQ0FBQTs7QUFFakcsUUFBTSxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTtDQUM1QyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy90b2dnbGUtcXVvdGVzL2xpYi90b2dnbGUtcXVvdGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZVF1b3RlcyA9IChlZGl0b3IpID0+IHtcbiAgZWRpdG9yLnRyYW5zYWN0KCgpID0+IHtcbiAgICBmb3IgKGxldCBjdXJzb3Igb2YgZWRpdG9yLmdldEN1cnNvcnMoKSkge1xuICAgICAgbGV0IHBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIHRvZ2dsZVF1b3RlQXRQb3NpdGlvbihlZGl0b3IsIHBvc2l0aW9uKVxuICAgICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKVxuICAgIH1cbiAgfSlcbn1cblxuY29uc3QgZ2V0TmV4dFF1b3RlQ2hhcmFjdGVyID0gKHF1b3RlQ2hhcmFjdGVyLCBhbGxRdW90ZUNoYXJhY3RlcnMpID0+IHtcbiAgbGV0IGluZGV4ID0gYWxsUXVvdGVDaGFyYWN0ZXJzLmluZGV4T2YocXVvdGVDaGFyYWN0ZXIpXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9IGVsc2Uge1xuICAgIHJldHVybiBhbGxRdW90ZUNoYXJhY3RlcnNbKGluZGV4ICsgMSkgJSBhbGxRdW90ZUNoYXJhY3RlcnMubGVuZ3RoXVxuICB9XG59XG5cbmNvbnN0IHRvZ2dsZVF1b3RlQXRQb3NpdGlvbiA9IChlZGl0b3IsIHBvc2l0aW9uKSA9PiB7XG4gIGxldCBxdW90ZUNoYXJzID0gYXRvbS5jb25maWcuZ2V0KCd0b2dnbGUtcXVvdGVzLnF1b3RlQ2hhcmFjdGVycycpXG4gIGxldCByYW5nZSA9IGVkaXRvci5kaXNwbGF5QnVmZmVyLmJ1ZmZlclJhbmdlRm9yU2NvcGVBdFBvc2l0aW9uKCcuc3RyaW5nLnF1b3RlZCcsIHBvc2l0aW9uKVxuXG4gIGlmIChyYW5nZSA9PSBudWxsKSB7XG4gICAgLy8gQXR0ZW1wdCB0byBtYXRjaCB0aGUgY3VycmVudCBpbnZhbGlkIHJlZ2lvbiBpZiBpdCBpcyB3cmFwcGVkIGluIHF1b3Rlc1xuICAgIC8vIFRoaXMgaXMgdXNlZnVsIGZvciBsYW5ndWFnZXMgd2hlcmUgY2hhbmdpbmcgdGhlIHF1b3RlcyBtYWtlcyB0aGUgcmFuZ2VcbiAgICAvLyBpbnZhbGlkIGFuZCBzbyB0b2dnbGluZyBhZ2FpbiBzaG91bGQgcHJvcGVybHkgcmVzdG9yZSB0aGUgdmFsaWQgcXVvdGVzXG5cbiAgICByYW5nZSA9IGVkaXRvci5kaXNwbGF5QnVmZmVyLmJ1ZmZlclJhbmdlRm9yU2NvcGVBdFBvc2l0aW9uKCcuaW52YWxpZC5pbGxlZ2FsJywgcG9zaXRpb24pXG4gICAgaWYgKHJhbmdlKSB7XG4gICAgICBsZXQgaW5uZXIgPSBxdW90ZUNoYXJzLnNwbGl0KCcnKS5tYXAoY2hhcmFjdGVyID0+IGAke2NoYXJhY3Rlcn0uKiR7Y2hhcmFjdGVyfWApLmpvaW4oJ3wnKVxuXG4gICAgICBpZiAoIVJlZ0V4cChgXigke2lubmVyfSkkYCwgJ2cnKS50ZXN0KGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSkpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChyYW5nZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBsZXQgdGV4dCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgbGV0IFtxdW90ZUNoYXJhY3Rlcl0gPSB0ZXh0XG5cbiAgLy8gSW4gUHl0aG9uIGEgc3RyaW5nIGNhbiBoYXZlIGEgcHJlZml4IHNwZWNpZnlpbmcgaXRzIGZvcm1hdC4gVGhlIFB5dGhvblxuICAvLyBncmFtbWFyIGluY2x1ZGVzIHRoaXMgcHJlZml4IGluIHRoZSBzdHJpbmcsIGFuZCB0aHVzIHdlIG5lZWQgdG8gZXhjbHVkZVxuICAvLyBpdCB3aGVuIHRvZ2dsaW5nIHF1b3Rlc1xuICBsZXQgcHJlZml4ID0gJydcbiAgaWYgKC9bdVVyXS8udGVzdChxdW90ZUNoYXJhY3RlcikpIHtcbiAgICBbcHJlZml4LCBxdW90ZUNoYXJhY3Rlcl0gPSB0ZXh0XG4gIH1cblxuICBsZXQgbmV4dFF1b3RlQ2hhcmFjdGVyID0gZ2V0TmV4dFF1b3RlQ2hhcmFjdGVyKHF1b3RlQ2hhcmFjdGVyLCBxdW90ZUNoYXJzKVxuXG4gIGlmICghbmV4dFF1b3RlQ2hhcmFjdGVyKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBsZXQgcXVvdGVSZWdleCA9IG5ldyBSZWdFeHAocXVvdGVDaGFyYWN0ZXIsICdnJylcbiAgbGV0IGVzY2FwZWRRdW90ZVJlZ2V4ID0gbmV3IFJlZ0V4cChgXFxcXFxcXFwke3F1b3RlQ2hhcmFjdGVyfWAsICdnJylcbiAgbGV0IG5leHRRdW90ZVJlZ2V4ID0gbmV3IFJlZ0V4cChuZXh0UXVvdGVDaGFyYWN0ZXIsICdnJylcblxuICBsZXQgbmV3VGV4dCA9IHRleHRcbiAgICAucmVwbGFjZShuZXh0UXVvdGVSZWdleCwgYFxcXFwke25leHRRdW90ZUNoYXJhY3Rlcn1gKVxuICAgIC5yZXBsYWNlKGVzY2FwZWRRdW90ZVJlZ2V4LCBxdW90ZUNoYXJhY3RlcilcblxuICBuZXdUZXh0ID0gcHJlZml4ICsgbmV4dFF1b3RlQ2hhcmFjdGVyICsgbmV3VGV4dC5zbGljZSgxICsgcHJlZml4Lmxlbmd0aCwgLTEpICsgbmV4dFF1b3RlQ2hhcmFjdGVyXG5cbiAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlLCBuZXdUZXh0KVxufVxuIl19
//# sourceURL=/Users/victor.martins/.atom/packages/toggle-quotes/lib/toggle-quotes.js
