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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvcnVieS1zeW50YXgtcmVwbGFjZXIvbGliL3J1Ynktc3ludGF4LXJlcGxhY2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNWO1FBQUEsOEJBQUEsRUFBZ0MsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtBQUM5QixnQkFBQTtZQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUE7bUJBQ1QsS0FBQyxDQUFBLGNBQUQsQ0FBZ0IsTUFBaEI7VUFGOEI7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDO09BRFU7SUFESixDQUFWO0lBTUEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQTtJQURVLENBTlo7SUFTQSxjQUFBLEVBQWdCLFNBQUMsTUFBRDtBQUNkLFVBQUE7TUFBQSxJQUFHLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBSDtRQUNFLElBQUEsR0FBTyxNQUFNLENBQUMsZUFBUCxDQUFBO2VBQ1AsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBQyxDQUFBLG1CQUFELENBQXFCLElBQXJCLENBQWxCLEVBRkY7T0FBQSxNQUFBO1FBSUUsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUE7ZUFDUCxNQUFNLENBQUMsT0FBUCxDQUFlLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixJQUFyQixDQUFmLEVBTEY7O0lBRGMsQ0FUaEI7SUFpQkEsbUJBQUEsRUFBcUIsU0FBQyxJQUFEO2FBQ25CLElBQUksQ0FBQyxPQUFMLENBQWEsbUNBQWIsRUFBa0QsWUFBbEQ7SUFEbUIsQ0FqQnJCOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogLT5cbiAgICBAY29tbWFuZHMgPSBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsXG4gICAgICAncnVieS1zeW50YXgtcmVwbGFjZXI6cmVwbGFjZSc6ID0+XG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICAgICAgQF9yZXBsYWNlU3ludGF4KGVkaXRvcilcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBjb21tYW5kcy5kaXNwb3NlKClcblxuICBfcmVwbGFjZVN5bnRheDogKGVkaXRvcikgLT5cbiAgICBpZiBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICAgIHRleHQgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0KEBfcmVwbGFjZUhhc2hSb2NrZXRzKHRleHQpKVxuICAgIGVsc2VcbiAgICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBlZGl0b3Iuc2V0VGV4dChAX3JlcGxhY2VIYXNoUm9ja2V0cyh0ZXh0KSlcblxuICBfcmVwbGFjZUhhc2hSb2NrZXRzOiAodGV4dCkgLT5cbiAgICB0ZXh0LnJlcGxhY2UgLyhbXjpdfF4pOihcXHcrKVxccz8oXFxzKik9Plxccz8oXFxzKikvZywgXCIkMSQyOiAkMyQ0XCJcbiJdfQ==
