(function() {
  module.exports = {
    activate: function() {
      return this.commands = atom.commands.add('atom-text-editor', {
        'ruby-syntax-replacer:replace': (function(_this) {
          return function() {
            var editor;
            editor = atom.workspace.getActivePaneItem();
            return _this._replaceSyntax(editor);
          };
        })(this)
      });
    },
    deactivate: function() {
      return this.commands.dispose();
    },
    _replaceSyntax: function(editor) {
      var text;
      if (editor.getSelectedText()) {
        text = editor.getSelectedText();
        return editor.insertText(this._replaceHashRockets(text));
      } else {
        text = editor.getText();
        return editor.setText(this._replaceHashRockets(text));
      }
    },
    _replaceHashRockets: function(text) {
      return text.replace(/([^:]|^):(\w+)\s?(\s*)=>\s?(\s*)/g, "$1$2: $3$4");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3J1Ynktc3ludGF4LXJlcGxhY2VyL2xpYi9ydWJ5LXN5bnRheC1yZXBsYWNlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNWO0FBQUEsUUFBQSw4QkFBQSxFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUM5QixnQkFBQSxNQUFBO0FBQUEsWUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBQVQsQ0FBQTttQkFDQSxLQUFDLENBQUEsY0FBRCxDQUFnQixNQUFoQixFQUY4QjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDO09BRFUsRUFESjtJQUFBLENBQVY7QUFBQSxJQU1BLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQSxFQURVO0lBQUEsQ0FOWjtBQUFBLElBU0EsY0FBQSxFQUFnQixTQUFDLE1BQUQsR0FBQTtBQUNkLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBRyxNQUFNLENBQUMsZUFBUCxDQUFBLENBQUg7QUFDRSxRQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsZUFBUCxDQUFBLENBQVAsQ0FBQTtlQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixJQUFyQixDQUFsQixFQUZGO09BQUEsTUFBQTtBQUlFLFFBQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUFBO2VBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsSUFBckIsQ0FBZixFQUxGO09BRGM7SUFBQSxDQVRoQjtBQUFBLElBaUJBLG1CQUFBLEVBQXFCLFNBQUMsSUFBRCxHQUFBO2FBQ25CLElBQUksQ0FBQyxPQUFMLENBQWEsbUNBQWIsRUFBa0QsWUFBbEQsRUFEbUI7SUFBQSxDQWpCckI7R0FERixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/victor.martins/.atom/packages/ruby-syntax-replacer/lib/ruby-syntax-replacer.coffee
