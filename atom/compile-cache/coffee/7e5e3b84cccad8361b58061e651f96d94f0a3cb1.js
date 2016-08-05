(function() {
  describe("ruby-syntax-replacer", function() {
    var activationPromise, editor, editorView, replaceSyntax, _ref;
    _ref = [], activationPromise = _ref[0], editor = _ref[1], editorView = _ref[2];
    replaceSyntax = function(callback) {
      atom.commands.dispatch(editorView, 'ruby-syntax-replacer:replace');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        return activationPromise = atom.packages.activatePackage('ruby-syntax-replacer');
      });
    });
    return describe("when the ruby-syntax-replacer:replace event is triggered", function() {
      it("replaces all instances of old ruby syntax with new", function() {
        editor.setText("{\n  :name     => 'Mads Ohm Larsen',\n  :age      => '25',\n  :position => 'Lead developer'\n}");
        return replaceSyntax(function() {
          return expect(editor.getText()).toBe("{\n  name:     'Mads Ohm Larsen',\n  age:      '25',\n  position: 'Lead developer'\n}");
        });
      });
      it("replaces inline hashes", function() {
        editor.setText("{:name => 'Mads'}");
        return replaceSyntax(function() {
          return expect(editor.getText()).toBe("{name: 'Mads'}");
        });
      });
      it("keeps the whitespace", function() {
        editor.setText("{\n  :name => 'Mads Ohm Larsen',\n  :age     => '25',\n  :position     => 'Lead developer'\n}");
        return replaceSyntax(function() {
          return expect(editor.getText()).toBe("{\n  name: 'Mads Ohm Larsen',\n  age:     '25',\n  position:     'Lead developer'\n}");
        });
      });
      it("replaces selected text in the middle of a hash", function() {
        editor.setText("{\n  :name     => 'Mads Ohm Larsen',\n  :age      => '25',\n  :position => 'Lead developer'\n}");
        editor.setSelectedScreenRange([[1, 0], [1, 99]]);
        return replaceSyntax(function() {
          return expect(editor.getText()).toBe("{\n  name:     'Mads Ohm Larsen',\n  :age      => '25',\n  :position => 'Lead developer'\n}");
        });
      });
      it("replaces only selected instances of old ruby syntax with new", function() {
        editor.setText("{\n  :name     => 'Mads Ohm Larsen',\n  :age      => '25',\n  :position => 'Lead developer'\n}\n\n{\n  :repo => 'https://github.com/omegahm/ruby-syntax-replacer'\n}");
        editor.setSelectedScreenRange([[7, 0], [9, 0]]);
        return replaceSyntax(function() {
          return expect(editor.getText()).toBe("{\n  :name     => 'Mads Ohm Larsen',\n  :age      => '25',\n  :position => 'Lead developer'\n}\n\n{\n  repo: 'https://github.com/omegahm/ruby-syntax-replacer'\n}");
        });
      });
      return it("will not replace modules with rockets", function() {
        editor.setText("begin\nrescue Timeout::Error => e\nend");
        return replaceSyntax(function() {
          return expect(editor.getText()).toBe("begin\nrescue Timeout::Error => e\nend");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3J1Ynktc3ludGF4LXJlcGxhY2VyL3NwZWMvcnVieS1zeW50YXgtcmVwbGFjZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixRQUFBLDBEQUFBO0FBQUEsSUFBQSxPQUEwQyxFQUExQyxFQUFDLDJCQUFELEVBQW9CLGdCQUFwQixFQUE0QixvQkFBNUIsQ0FBQTtBQUFBLElBRUEsYUFBQSxHQUFnQixTQUFDLFFBQUQsR0FBQTtBQUNkLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFVBQXZCLEVBQW1DLDhCQUFuQyxDQUFBLENBQUE7QUFBQSxNQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsa0JBQUg7TUFBQSxDQUFoQixDQURBLENBQUE7YUFFQSxJQUFBLENBQUssUUFBTCxFQUhjO0lBQUEsQ0FGaEIsQ0FBQTtBQUFBLElBT0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxFQURjO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO2FBR0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxRQUNBLFVBQUEsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FEYixDQUFBO2VBR0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHNCQUE5QixFQUpqQjtNQUFBLENBQUwsRUFKUztJQUFBLENBQVgsQ0FQQSxDQUFBO1dBaUJBLFFBQUEsQ0FBUywwREFBVCxFQUFxRSxTQUFBLEdBQUE7QUFDbkUsTUFBQSxFQUFBLENBQUcsb0RBQUgsRUFBeUQsU0FBQSxHQUFBO0FBQ3ZELFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxnR0FBZixDQUFBLENBQUE7ZUFRQSxhQUFBLENBQWMsU0FBQSxHQUFBO2lCQUNaLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix1RkFBOUIsRUFEWTtRQUFBLENBQWQsRUFUdUQ7TUFBQSxDQUF6RCxDQUFBLENBQUE7QUFBQSxNQWtCQSxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxtQkFBZixDQUFBLENBQUE7ZUFJQSxhQUFBLENBQWMsU0FBQSxHQUFBO2lCQUNaLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixnQkFBOUIsRUFEWTtRQUFBLENBQWQsRUFMMkI7TUFBQSxDQUE3QixDQWxCQSxDQUFBO0FBQUEsTUE0QkEsRUFBQSxDQUFHLHNCQUFILEVBQTJCLFNBQUEsR0FBQTtBQUN6QixRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsK0ZBQWYsQ0FBQSxDQUFBO2VBUUEsYUFBQSxDQUFjLFNBQUEsR0FBQTtpQkFDWixNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsc0ZBQTlCLEVBRFk7UUFBQSxDQUFkLEVBVHlCO01BQUEsQ0FBM0IsQ0E1QkEsQ0FBQTtBQUFBLE1BOENBLEVBQUEsQ0FBRyxnREFBSCxFQUFxRCxTQUFBLEdBQUE7QUFDbkQsUUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLGdHQUFmLENBQUEsQ0FBQTtBQUFBLFFBUUEsTUFBTSxDQUFDLHNCQUFQLENBQThCLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksRUFBSixDQUFULENBQTlCLENBUkEsQ0FBQTtlQVVBLGFBQUEsQ0FBYyxTQUFBLEdBQUE7aUJBQ1osTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDZGQUE5QixFQURZO1FBQUEsQ0FBZCxFQVhtRDtNQUFBLENBQXJELENBOUNBLENBQUE7QUFBQSxNQWtFQSxFQUFBLENBQUcsOERBQUgsRUFBbUUsU0FBQSxHQUFBO0FBQ2pFLFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxzS0FBZixDQUFBLENBQUE7QUFBQSxRQVlBLE1BQU0sQ0FBQyxzQkFBUCxDQUE4QixDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUE5QixDQVpBLENBQUE7ZUFjQSxhQUFBLENBQWMsU0FBQSxHQUFBO2lCQUNaLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtS0FBOUIsRUFEWTtRQUFBLENBQWQsRUFmaUU7TUFBQSxDQUFuRSxDQWxFQSxDQUFBO2FBOEZBLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsUUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLHdDQUFmLENBQUEsQ0FBQTtlQU1BLGFBQUEsQ0FBYyxTQUFBLEdBQUE7aUJBQ1osTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHdDQUE5QixFQURZO1FBQUEsQ0FBZCxFQVAwQztNQUFBLENBQTVDLEVBL0ZtRTtJQUFBLENBQXJFLEVBbEIrQjtFQUFBLENBQWpDLENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/victor.martins/.atom/packages/ruby-syntax-replacer/spec/ruby-syntax-replacer-spec.coffee
