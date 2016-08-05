(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("TextObjects", function() {
    var editor, editorElement, keydown, vimState, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], vimState = _ref[2];
    beforeEach(function() {
      var vimMode;
      vimMode = atom.packages.loadPackage('vim-mode');
      vimMode.activateResources();
      return helpers.getEditorElement(function(element) {
        editorElement = element;
        editor = editorElement.getModel();
        vimState = editorElement.vimState;
        vimState.activateNormalMode();
        return vimState.resetNormalMode();
      });
    });
    keydown = function(key, options) {
      if (options == null) {
        options = {};
      }
      if (options.element == null) {
        options.element = editorElement;
      }
      return helpers.keydown(key, options);
    };
    describe("Text Object commands in normal mode not preceded by an operator", function() {
      beforeEach(function() {
        return vimState.activateNormalMode();
      });
      return it("selects the appropriate text", function() {
        editor.setText("<html> text </html>");
        editor.setCursorScreenPosition([0, 7]);
        atom.commands.dispatch(editorElement, "vim-mode:select-inside-tags");
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 6], [0, 12]]);
      });
    });
    describe("the 'iw' text object", function() {
      beforeEach(function() {
        editor.setText("12345 abcde ABCDE");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('w');
        expect(editor.getText()).toBe("12345  ABCDE");
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        expect(vimState.getRegister('"').text).toBe("abcde");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects inside the current word in visual mode", function() {
        keydown('v');
        keydown('i');
        keydown('w');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 6], [0, 11]]);
      });
      it("expands an existing selection in visual mode", function() {
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('w');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 9], [0, 17]]);
      });
      return it("works with multiple cursors", function() {
        editor.addCursorAtBufferPosition([0, 1]);
        keydown("v");
        keydown("i");
        keydown("w");
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 6], [0, 11]], [[0, 0], [0, 5]]]);
      });
    });
    describe("the 'iW' text object", function() {
      beforeEach(function() {
        editor.setText("12(45 ab'de ABCDE");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current whole word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('W', {
          shift: true
        });
        expect(editor.getText()).toBe("12(45  ABCDE");
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        expect(vimState.getRegister('"').text).toBe("ab'de");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects inside the current whole word in visual mode", function() {
        keydown('v');
        keydown('i');
        keydown('W', {
          shift: true
        });
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 6], [0, 11]]);
      });
      return it("expands an existing selection in visual mode", function() {
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('W', {
          shift: true
        });
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 9], [0, 17]]);
      });
    });
    describe("the 'i(' text object", function() {
      beforeEach(function() {
        editor.setText("( something in here and in (here) )");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('(');
        expect(editor.getText()).toBe("()");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the current word in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('(');
        expect(editor.getText()).toBe("( something in here and in () )");
        expect(editor.getCursorScreenPosition()).toEqual([0, 28]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("works with multiple cursors", function() {
        editor.setText("( a b ) cde ( f g h ) ijk");
        editor.setCursorBufferPosition([0, 2]);
        editor.addCursorAtBufferPosition([0, 18]);
        keydown("v");
        keydown("i");
        keydown("(");
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 1], [0, 6]], [[0, 13], [0, 20]]]);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('(');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 32]]);
      });
    });
    describe("the 'i{' text object", function() {
      beforeEach(function() {
        editor.setText("{ something in here and in {here} }");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('{');
        expect(editor.getText()).toBe("{}");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the current word in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('{');
        expect(editor.getText()).toBe("{ something in here and in {} }");
        expect(editor.getCursorScreenPosition()).toEqual([0, 28]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('{');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 32]]);
      });
    });
    describe("the 'i<' text object", function() {
      beforeEach(function() {
        editor.setText("< something in here and in <here> >");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('<');
        expect(editor.getText()).toBe("<>");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the current word in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('<');
        expect(editor.getText()).toBe("< something in here and in <> >");
        expect(editor.getCursorScreenPosition()).toEqual([0, 28]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('<');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 32]]);
      });
    });
    describe("the 'it' text object", function() {
      beforeEach(function() {
        editor.setText("<something>here</something><again>");
        return editor.setCursorScreenPosition([0, 5]);
      });
      it("applies only if in the value of a tag", function() {
        keydown('d');
        keydown('i');
        keydown('t');
        expect(editor.getText()).toBe("<something>here</something><again>");
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        editor.setCursorScreenPosition([0, 13]);
        keydown('d');
        keydown('i');
        keydown('t');
        expect(editor.getText()).toBe("<something></something><again>");
        expect(editor.getCursorScreenPosition()).toEqual([0, 11]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 7]);
        keydown('v');
        keydown('6');
        keydown('l');
        keydown('i');
        keydown('t');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 7], [0, 15]]);
      });
    });
    describe("the 'ip' text object", function() {
      beforeEach(function() {
        editor.setText("\nParagraph-1\nParagraph-1\nParagraph-1\n\n");
        return editor.setCursorBufferPosition([2, 2]);
      });
      it("applies operators inside the current paragraph in operator-pending mode", function() {
        keydown('y');
        keydown('i');
        keydown('p');
        expect(editor.getText()).toBe("\nParagraph-1\nParagraph-1\nParagraph-1\n\n");
        expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        expect(vimState.getRegister('"').text).toBe("Paragraph-1\nParagraph-1\nParagraph-1\n");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects inside the current paragraph in visual mode", function() {
        keydown('v');
        keydown('i');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[1, 0], [4, 0]]);
      });
      it("selects between paragraphs in visual mode if invoked on a empty line", function() {
        editor.setText("text\n\n\n\ntext\n");
        editor.setCursorBufferPosition([1, 0]);
        keydown('v');
        keydown('i');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[1, 0], [4, 0]]);
      });
      it("selects all the lines", function() {
        editor.setText("text\ntext\ntext\n");
        editor.setCursorBufferPosition([0, 0]);
        keydown('v');
        keydown('i');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 0], [3, 0]]);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setText("\nParagraph-1\nParagraph-1\nParagraph-1\n\n\nParagraph-2\nParagraph-2\nParagraph-2\n");
        editor.setCursorBufferPosition([2, 2]);
        keydown('v');
        keydown('i');
        keydown('p');
        keydown('j');
        keydown('j');
        keydown('j');
        keydown('i');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[1, 0], [9, 0]]);
      });
    });
    describe("the 'ap' text object", function() {
      beforeEach(function() {
        editor.setText("text\n\nParagraph-1\nParagraph-1\nParagraph-1\n\n\nmoretext");
        return editor.setCursorScreenPosition([3, 2]);
      });
      it("applies operators around the current paragraph in operator-pending mode", function() {
        keydown('y');
        keydown('a');
        keydown('p');
        expect(editor.getText()).toBe("text\n\nParagraph-1\nParagraph-1\nParagraph-1\n\n\nmoretext");
        expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        expect(vimState.getRegister('"').text).toBe("Paragraph-1\nParagraph-1\nParagraph-1\n\n\n");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects around the current paragraph in visual mode", function() {
        keydown('v');
        keydown('a');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[2, 0], [7, 0]]);
      });
      it("applies operators around the next paragraph in operator-pending mode when started from a blank/only-whitespace line", function() {
        editor.setText("text\n\n\n\nParagraph-1\nParagraph-1\nParagraph-1\n\n\nmoretext");
        editor.setCursorBufferPosition([1, 0]);
        keydown('y');
        keydown('a');
        keydown('p');
        expect(editor.getText()).toBe("text\n\n\n\nParagraph-1\nParagraph-1\nParagraph-1\n\n\nmoretext");
        expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        expect(vimState.getRegister('"').text).toBe("\n\n\nParagraph-1\nParagraph-1\nParagraph-1\n");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects around the next paragraph in visual mode when started from a blank/only-whitespace line", function() {
        editor.setText("text\n\n\n\nparagraph-1\nparagraph-1\nparagraph-1\n\n\nmoretext");
        editor.setCursorBufferPosition([1, 0]);
        keydown('v');
        keydown('a');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[1, 0], [7, 0]]);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setText("text\n\n\n\nparagraph-1\nparagraph-1\nparagraph-1\n\n\n\nparagraph-2\nparagraph-2\nparagraph-2\n\n\nmoretext");
        editor.setCursorBufferPosition([5, 0]);
        keydown('v');
        keydown('a');
        keydown('p');
        keydown('j');
        keydown('j');
        keydown('j');
        keydown('i');
        keydown('p');
        return expect(editor.getSelectedScreenRange()).toEqual([[4, 0], [13, 0]]);
      });
    });
    describe("the 'i[' text object", function() {
      beforeEach(function() {
        editor.setText("[ something in here and in [here] ]");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current word in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('[');
        expect(editor.getText()).toBe("[]");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the current word in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('[');
        expect(editor.getText()).toBe("[ something in here and in [] ]");
        expect(editor.getCursorScreenPosition()).toEqual([0, 28]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('[');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 32]]);
      });
    });
    describe("the 'i\'' text object", function() {
      beforeEach(function() {
        editor.setText("' something in here and in 'here' ' and over here");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current string in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('\'');
        expect(editor.getText()).toBe("''here' ' and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the next string in operator-pending mode (if not in a string)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('\'');
        expect(editor.getText()).toBe("' something in here and in 'here'' and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 33]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("makes no change if past the last string on a line", function() {
        editor.setCursorScreenPosition([0, 39]);
        keydown('d');
        keydown('i');
        keydown('\'');
        expect(editor.getText()).toBe("' something in here and in 'here' ' and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 39]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('\'');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 34]]);
      });
    });
    describe("the 'i\"' text object", function() {
      beforeEach(function() {
        editor.setText("\" something in here and in \"here\" \" and over here");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators inside the current string in operator-pending mode", function() {
        keydown('d');
        keydown('i');
        keydown('"');
        expect(editor.getText()).toBe("\"\"here\" \" and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators inside the next string in operator-pending mode (if not in a string)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('i');
        keydown('"');
        expect(editor.getText()).toBe("\" something in here and in \"here\"\" and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 33]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("makes no change if past the last string on a line", function() {
        editor.setCursorScreenPosition([0, 39]);
        keydown('d');
        keydown('i');
        keydown('"');
        expect(editor.getText()).toBe("\" something in here and in \"here\" \" and over here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 39]);
        return expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('i');
        keydown('"');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 34]]);
      });
    });
    describe("the 'aw' text object", function() {
      beforeEach(function() {
        editor.setText("12345 abcde ABCDE");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators from the start of the current word to the start of the next word in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('w');
        expect(editor.getText()).toBe("12345 ABCDE");
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        expect(vimState.getRegister('"').text).toBe("abcde ");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects from the start of the current word to the start of the next word in visual mode", function() {
        keydown('v');
        keydown('a');
        keydown('w');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 6], [0, 12]]);
      });
      it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 2]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('w');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 2], [0, 12]]);
      });
      it("doesn't span newlines", function() {
        editor.setText("12345\nabcde ABCDE");
        editor.setCursorBufferPosition([0, 3]);
        keydown("v");
        keydown("a");
        keydown("w");
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 0], [0, 5]]]);
      });
      return it("doesn't span special characters", function() {
        editor.setText("1(345\nabcde ABCDE");
        editor.setCursorBufferPosition([0, 3]);
        keydown("v");
        keydown("a");
        keydown("w");
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 2], [0, 5]]]);
      });
    });
    describe("the 'aW' text object", function() {
      beforeEach(function() {
        editor.setText("12(45 ab'de ABCDE");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators from the start of the current whole word to the start of the next whole word in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('W', {
          shift: true
        });
        expect(editor.getText()).toBe("12(45 ABCDE");
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        expect(vimState.getRegister('"').text).toBe("ab'de ");
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("selects from the start of the current whole word to the start of the next whole word in visual mode", function() {
        keydown('v');
        keydown('a');
        keydown('W', {
          shift: true
        });
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 6], [0, 12]]);
      });
      it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 2]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('W', {
          shift: true
        });
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 2], [0, 12]]);
      });
      return it("doesn't span newlines", function() {
        editor.setText("12(45\nab'de ABCDE");
        editor.setCursorBufferPosition([0, 4]);
        keydown('v');
        keydown('a');
        keydown('W', {
          shift: true
        });
        return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 0], [0, 5]]]);
      });
    });
    describe("the 'a(' text object", function() {
      beforeEach(function() {
        editor.setText("( something in here and in (here) )");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current parentheses in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('(');
        expect(editor.getText()).toBe("");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators around the current parentheses in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('(');
        expect(editor.getText()).toBe("( something in here and in  )");
        expect(editor.getCursorScreenPosition()).toEqual([0, 27]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('(');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 33]]);
      });
    });
    describe("the 'a{' text object", function() {
      beforeEach(function() {
        editor.setText("{ something in here and in {here} }");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current curly brackets in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('{');
        expect(editor.getText()).toBe("");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators around the current curly brackets in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('{');
        expect(editor.getText()).toBe("{ something in here and in  }");
        expect(editor.getCursorScreenPosition()).toEqual([0, 27]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('{');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 33]]);
      });
    });
    describe("the 'a<' text object", function() {
      beforeEach(function() {
        editor.setText("< something in here and in <here> >");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current angle brackets in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('<');
        expect(editor.getText()).toBe("");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators around the current angle brackets in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('<');
        expect(editor.getText()).toBe("< something in here and in  >");
        expect(editor.getCursorScreenPosition()).toEqual([0, 27]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('<');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 33]]);
      });
    });
    describe("the 'a[' text object", function() {
      beforeEach(function() {
        editor.setText("[ something in here and in [here] ]");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current square brackets in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('[');
        expect(editor.getText()).toBe("");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators around the current square brackets in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('[');
        expect(editor.getText()).toBe("[ something in here and in  ]");
        expect(editor.getCursorScreenPosition()).toEqual([0, 27]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('[');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 33]]);
      });
    });
    describe("the 'a\'' text object", function() {
      beforeEach(function() {
        editor.setText("' something in here and in 'here' '");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current single quotes in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('\'');
        expect(editor.getText()).toBe("here' '");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators around the current single quotes in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('\'');
        expect(editor.getText()).toBe("' something in here and in 'here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 31]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('\'');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 35]]);
      });
    });
    return describe("the 'a\"' text object", function() {
      beforeEach(function() {
        editor.setText("\" something in here and in \"here\" \"");
        return editor.setCursorScreenPosition([0, 9]);
      });
      it("applies operators around the current double quotes in operator-pending mode", function() {
        keydown('d');
        keydown('a');
        keydown('""');
        expect(editor.getText()).toBe('here" "');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("applies operators around the current double quotes in operator-pending mode (second test)", function() {
        editor.setCursorScreenPosition([0, 29]);
        keydown('d');
        keydown('a');
        keydown('"');
        expect(editor.getText()).toBe("\" something in here and in \"here");
        expect(editor.getCursorScreenPosition()).toEqual([0, 31]);
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("expands an existing selection in visual mode", function() {
        editor.setCursorScreenPosition([0, 25]);
        keydown('v');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('l');
        keydown('a');
        keydown('"');
        return expect(editor.getSelectedScreenRange()).toEqual([[0, 25], [0, 35]]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvdGV4dC1vYmplY3RzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGVBQVIsQ0FBVixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEsOENBQUE7QUFBQSxJQUFBLE9BQW9DLEVBQXBDLEVBQUMsZ0JBQUQsRUFBUyx1QkFBVCxFQUF3QixrQkFBeEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBZCxDQUEwQixVQUExQixDQUFWLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxpQkFBUixDQUFBLENBREEsQ0FBQTthQUdBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixTQUFDLE9BQUQsR0FBQTtBQUN2QixRQUFBLGFBQUEsR0FBZ0IsT0FBaEIsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLGFBQWEsQ0FBQyxRQUFkLENBQUEsQ0FEVCxDQUFBO0FBQUEsUUFFQSxRQUFBLEdBQVcsYUFBYSxDQUFDLFFBRnpCLENBQUE7QUFBQSxRQUdBLFFBQVEsQ0FBQyxrQkFBVCxDQUFBLENBSEEsQ0FBQTtlQUlBLFFBQVEsQ0FBQyxlQUFULENBQUEsRUFMdUI7TUFBQSxDQUF6QixFQUpTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQWFBLE9BQUEsR0FBVSxTQUFDLEdBQUQsRUFBTSxPQUFOLEdBQUE7O1FBQU0sVUFBUTtPQUN0Qjs7UUFBQSxPQUFPLENBQUMsVUFBVztPQUFuQjthQUNBLE9BQU8sQ0FB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

//# sourceURL=/Users/victor.martins/.atom/packages/vim-mode/spec/text-objects-spec.coffee
