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
  var range = editor.bufferRangeForScopeAtPosition('.string.quoted', position);

  if (range == null) {
    // Attempt to match the current invalid region if it is wrapped in quotes
    // This is useful for languages where changing the quotes makes the range
    // invalid and so toggling again should properly restore the valid quotes

    range = editor.bufferRangeForScopeAtPosition('.invalid.illegal', position);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy90b2dnbGUtcXVvdGVzL2xpYi90b2dnbGUtcXVvdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7QUFFSixJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxNQUFNLEVBQUs7QUFDdEMsUUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFNO0FBQ3BCLFNBQUssSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3RDLFVBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0FBQ3pDLDJCQUFxQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUN2QyxZQUFNLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDbkM7R0FDRixDQUFDLENBQUE7Q0FDSCxDQUFBOzs7QUFFRCxJQUFNLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFJLGNBQWMsRUFBRSxrQkFBa0IsRUFBSztBQUNwRSxNQUFJLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDdEQsTUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEIsV0FBTyxJQUFJLENBQUE7R0FDWixNQUFNO0FBQ0wsV0FBTyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUEsR0FBSSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTtHQUNuRTtDQUNGLENBQUE7O0FBRUQsSUFBTSxxQkFBcUIsR0FBRyxTQUF4QixxQkFBcUIsQ0FBSSxNQUFNLEVBQUUsUUFBUSxFQUFLO0FBQ2xELE1BQUksVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUE7QUFDakUsTUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLDZCQUE2QixDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFBOztBQUU1RSxNQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7Ozs7O0FBS2pCLFNBQUssR0FBRyxNQUFNLENBQUMsNkJBQTZCLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDMUUsUUFBSSxLQUFLLEVBQUU7QUFDVCxVQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFNBQVM7ZUFBTyxTQUFTLFVBQUssU0FBUztPQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRXpGLFVBQUksQ0FBQyxNQUFNLFFBQU0sS0FBSyxTQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUN6RSxlQUFNO09BQ1A7S0FDRjtHQUNGOztBQUVELE1BQUksS0FBSyxJQUFJLElBQUksRUFBRTtBQUNqQixXQUFNO0dBQ1A7O0FBRUQsTUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFBOzs2QkFDdEIsSUFBSTs7TUFBdEIsY0FBYzs7Ozs7QUFLbkIsTUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFBO0FBQ2YsTUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dDQUNMLElBQUk7O0FBQTlCLFVBQU07QUFBRSxrQkFBYztHQUN4Qjs7QUFFRCxNQUFJLGtCQUFrQixHQUFHLHFCQUFxQixDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQTs7QUFFMUUsTUFBSSxDQUFDLGtCQUFrQixFQUFFO0FBQ3ZCLFdBQU07R0FDUDs7O0FBR0QsTUFBSSxpQkFBaUIsR0FBRyxJQUFJLE1BQU0sVUFBUSxjQUFjLEVBQUksR0FBRyxDQUFDLENBQUE7QUFDaEUsTUFBSSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUE7O0FBRXhELE1BQUksT0FBTyxHQUFHLElBQUksQ0FDZixPQUFPLENBQUMsY0FBYyxTQUFPLGtCQUFrQixDQUFHLENBQ2xELE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLENBQUMsQ0FBQTs7QUFFN0MsU0FBTyxHQUFHLE1BQU0sR0FBRyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsa0JBQWtCLENBQUE7O0FBRWpHLFFBQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUE7Q0FDNUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvdmljdG9yLm1hcnRpbnMvLmF0b20vcGFja2FnZXMvdG9nZ2xlLXF1b3Rlcy9saWIvdG9nZ2xlLXF1b3Rlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmV4cG9ydCBjb25zdCB0b2dnbGVRdW90ZXMgPSAoZWRpdG9yKSA9PiB7XG4gIGVkaXRvci50cmFuc2FjdCgoKSA9PiB7XG4gICAgZm9yIChsZXQgY3Vyc29yIG9mIGVkaXRvci5nZXRDdXJzb3JzKCkpIHtcbiAgICAgIGxldCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICB0b2dnbGVRdW90ZUF0UG9zaXRpb24oZWRpdG9yLCBwb3NpdGlvbilcbiAgICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihwb3NpdGlvbilcbiAgICB9XG4gIH0pXG59XG5cbmNvbnN0IGdldE5leHRRdW90ZUNoYXJhY3RlciA9IChxdW90ZUNoYXJhY3RlciwgYWxsUXVvdGVDaGFyYWN0ZXJzKSA9PiB7XG4gIGxldCBpbmRleCA9IGFsbFF1b3RlQ2hhcmFjdGVycy5pbmRleE9mKHF1b3RlQ2hhcmFjdGVyKVxuICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYWxsUXVvdGVDaGFyYWN0ZXJzWyhpbmRleCArIDEpICUgYWxsUXVvdGVDaGFyYWN0ZXJzLmxlbmd0aF1cbiAgfVxufVxuXG5jb25zdCB0b2dnbGVRdW90ZUF0UG9zaXRpb24gPSAoZWRpdG9yLCBwb3NpdGlvbikgPT4ge1xuICBsZXQgcXVvdGVDaGFycyA9IGF0b20uY29uZmlnLmdldCgndG9nZ2xlLXF1b3Rlcy5xdW90ZUNoYXJhY3RlcnMnKVxuICBsZXQgcmFuZ2UgPSBlZGl0b3IuYnVmZmVyUmFuZ2VGb3JTY29wZUF0UG9zaXRpb24oJy5zdHJpbmcucXVvdGVkJywgcG9zaXRpb24pXG5cbiAgaWYgKHJhbmdlID09IG51bGwpIHtcbiAgICAvLyBBdHRlbXB0IHRvIG1hdGNoIHRoZSBjdXJyZW50IGludmFsaWQgcmVnaW9uIGlmIGl0IGlzIHdyYXBwZWQgaW4gcXVvdGVzXG4gICAgLy8gVGhpcyBpcyB1c2VmdWwgZm9yIGxhbmd1YWdlcyB3aGVyZSBjaGFuZ2luZyB0aGUgcXVvdGVzIG1ha2VzIHRoZSByYW5nZVxuICAgIC8vIGludmFsaWQgYW5kIHNvIHRvZ2dsaW5nIGFnYWluIHNob3VsZCBwcm9wZXJseSByZXN0b3JlIHRoZSB2YWxpZCBxdW90ZXNcblxuICAgIHJhbmdlID0gZWRpdG9yLmJ1ZmZlclJhbmdlRm9yU2NvcGVBdFBvc2l0aW9uKCcuaW52YWxpZC5pbGxlZ2FsJywgcG9zaXRpb24pXG4gICAgaWYgKHJhbmdlKSB7XG4gICAgICBsZXQgaW5uZXIgPSBxdW90ZUNoYXJzLnNwbGl0KCcnKS5tYXAoY2hhcmFjdGVyID0+IGAke2NoYXJhY3Rlcn0uKiR7Y2hhcmFjdGVyfWApLmpvaW4oJ3wnKVxuXG4gICAgICBpZiAoIVJlZ0V4cChgXigke2lubmVyfSkkYCwgJ2cnKS50ZXN0KGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSkpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChyYW5nZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBsZXQgdGV4dCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgbGV0IFtxdW90ZUNoYXJhY3Rlcl0gPSB0ZXh0XG5cbiAgLy8gSW4gUHl0aG9uIGEgc3RyaW5nIGNhbiBoYXZlIGEgcHJlZml4IHNwZWNpZnlpbmcgaXRzIGZvcm1hdC4gVGhlIFB5dGhvblxuICAvLyBncmFtbWFyIGluY2x1ZGVzIHRoaXMgcHJlZml4IGluIHRoZSBzdHJpbmcsIGFuZCB0aHVzIHdlIG5lZWQgdG8gZXhjbHVkZVxuICAvLyBpdCB3aGVuIHRvZ2dsaW5nIHF1b3Rlc1xuICBsZXQgcHJlZml4ID0gJydcbiAgaWYgKC9bdVVyXS8udGVzdChxdW90ZUNoYXJhY3RlcikpIHtcbiAgICBbcHJlZml4LCBxdW90ZUNoYXJhY3Rlcl0gPSB0ZXh0XG4gIH1cblxuICBsZXQgbmV4dFF1b3RlQ2hhcmFjdGVyID0gZ2V0TmV4dFF1b3RlQ2hhcmFjdGVyKHF1b3RlQ2hhcmFjdGVyLCBxdW90ZUNoYXJzKVxuXG4gIGlmICghbmV4dFF1b3RlQ2hhcmFjdGVyKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBsZXQgcXVvdGVSZWdleCA9IG5ldyBSZWdFeHAocXVvdGVDaGFyYWN0ZXIsICdnJylcbiAgbGV0IGVzY2FwZWRRdW90ZVJlZ2V4ID0gbmV3IFJlZ0V4cChgXFxcXFxcXFwke3F1b3RlQ2hhcmFjdGVyfWAsICdnJylcbiAgbGV0IG5leHRRdW90ZVJlZ2V4ID0gbmV3IFJlZ0V4cChuZXh0UXVvdGVDaGFyYWN0ZXIsICdnJylcblxuICBsZXQgbmV3VGV4dCA9IHRleHRcbiAgICAucmVwbGFjZShuZXh0UXVvdGVSZWdleCwgYFxcXFwke25leHRRdW90ZUNoYXJhY3Rlcn1gKVxuICAgIC5yZXBsYWNlKGVzY2FwZWRRdW90ZVJlZ2V4LCBxdW90ZUNoYXJhY3RlcilcblxuICBuZXdUZXh0ID0gcHJlZml4ICsgbmV4dFF1b3RlQ2hhcmFjdGVyICsgbmV3VGV4dC5zbGljZSgxICsgcHJlZml4Lmxlbmd0aCwgLTEpICsgbmV4dFF1b3RlQ2hhcmFjdGVyXG5cbiAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlLCBuZXdUZXh0KVxufVxuIl19