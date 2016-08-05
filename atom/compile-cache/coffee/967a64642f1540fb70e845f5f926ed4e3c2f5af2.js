(function() {
  var ChangeCase, Commands, makeCommand;

  ChangeCase = require('change-case');

  Commands = {
    camel: 'camelCase',
    constant: 'constantCase',
    dot: 'dotCase',
    lower: 'lowerCase',
    lowerFirst: 'lowerCaseFirst',
    param: 'paramCase',
    pascal: 'pascalCase',
    path: 'pathCase',
    sentence: 'sentenceCase',
    snake: 'snakeCase',
    "switch": 'switchCase',
    title: 'titleCase',
    upper: 'upperCase',
    upperFirst: 'upperCaseFirst'
  };

  module.exports = {
    activate: function(state) {
      var command, _results;
      _results = [];
      for (command in Commands) {
        _results.push(makeCommand(command));
      }
      return _results;
    }
  };

  makeCommand = function(command) {
    return atom.commands.add('atom-workspace', "change-case:" + command, function() {
      var converter, cursor, editor, method, newText, options, position, range, text, _i, _len, _ref, _results;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      method = Commands[command];
      converter = ChangeCase[method];
      options = {};
      options.wordRegex = /^[\t ]*$|[^\s\/\\\(\)"':,\.;<>~!@#\$%\^&\*\|\+=\[\]\{\}`\?]+/g;
      _ref = editor.getCursors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        position = cursor.getBufferPosition();
        range = cursor.getCurrentWordBufferRange(options);
        text = editor.getTextInBufferRange(range);
        newText = converter(text);
        _results.push(editor.setTextInBufferRange(range, newText));
      }
      return _results;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2NoYW5nZS1jYXNlL2xpYi9jaGFuZ2UtY2FzZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxLQUFBLEVBQU8sV0FBUDtBQUFBLElBQ0EsUUFBQSxFQUFVLGNBRFY7QUFBQSxJQUVBLEdBQUEsRUFBSyxTQUZMO0FBQUEsSUFHQSxLQUFBLEVBQU8sV0FIUDtBQUFBLElBSUEsVUFBQSxFQUFZLGdCQUpaO0FBQUEsSUFLQSxLQUFBLEVBQU8sV0FMUDtBQUFBLElBTUEsTUFBQSxFQUFRLFlBTlI7QUFBQSxJQU9BLElBQUEsRUFBTSxVQVBOO0FBQUEsSUFRQSxRQUFBLEVBQVUsY0FSVjtBQUFBLElBU0EsS0FBQSxFQUFPLFdBVFA7QUFBQSxJQVVBLFFBQUEsRUFBUSxZQVZSO0FBQUEsSUFXQSxLQUFBLEVBQU8sV0FYUDtBQUFBLElBWUEsS0FBQSxFQUFPLFdBWlA7QUFBQSxJQWFBLFVBQUEsRUFBWSxnQkFiWjtHQUhGLENBQUE7O0FBQUEsRUFrQkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxpQkFBQTtBQUFBO1dBQUEsbUJBQUEsR0FBQTtBQUNFLHNCQUFBLFdBQUEsQ0FBWSxPQUFaLEVBQUEsQ0FERjtBQUFBO3NCQURRO0lBQUEsQ0FBVjtHQW5CRixDQUFBOztBQUFBLEVBdUJBLFdBQUEsR0FBYyxTQUFDLE9BQUQsR0FBQTtXQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBcUMsY0FBQSxHQUFjLE9BQW5ELEVBQThELFNBQUEsR0FBQTtBQUM1RCxVQUFBLG9HQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBYyxjQUFkO0FBQUEsY0FBQSxDQUFBO09BREE7QUFBQSxNQUdBLE1BQUEsR0FBUyxRQUFTLENBQUEsT0FBQSxDQUhsQixDQUFBO0FBQUEsTUFJQSxTQUFBLEdBQVksVUFBVyxDQUFBLE1BQUEsQ0FKdkIsQ0FBQTtBQUFBLE1BTUEsT0FBQSxHQUFVLEVBTlYsQ0FBQTtBQUFBLE1BT0EsT0FBTyxDQUFDLFNBQVIsR0FBb0IsK0RBUHBCLENBQUE7QUFRQTtBQUFBO1dBQUEsMkNBQUE7MEJBQUE7QUFDRSxRQUFBLFFBQUEsR0FBVyxNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQUFYLENBQUE7QUFBQSxRQUVBLEtBQUEsR0FBUSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsT0FBakMsQ0FGUixDQUFBO0FBQUEsUUFHQSxJQUFBLEdBQU8sTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLENBSFAsQ0FBQTtBQUFBLFFBSUEsT0FBQSxHQUFVLFNBQUEsQ0FBVSxJQUFWLENBSlYsQ0FBQTtBQUFBLHNCQUtBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixFQUFtQyxPQUFuQyxFQUxBLENBREY7QUFBQTtzQkFUNEQ7SUFBQSxDQUE5RCxFQURZO0VBQUEsQ0F2QmQsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/victor.martins/.atom/packages/change-case/lib/change-case.coffee
