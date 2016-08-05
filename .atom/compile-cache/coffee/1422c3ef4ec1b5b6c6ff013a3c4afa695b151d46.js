(function() {
  var COMMAND_CONFIG_KEY, DEFAULT_ARGS, DEFAULT_LOCATION, DEFAULT_MESSAGE, OLD_ARGS_CONFIG_KEY, OLD_EXEC_PATH_CONFIG_KEY, WARNINGS, convertOldConfig, helpers, lint, linter, path;

  path = require('path');

  helpers = require('atom-linter');

  COMMAND_CONFIG_KEY = 'linter-rubocop.command';

  OLD_EXEC_PATH_CONFIG_KEY = 'linter-rubocop.executablePath';

  OLD_ARGS_CONFIG_KEY = 'linter-rubocop.additionalArguments';

  DEFAULT_LOCATION = {
    line: 1,
    column: 1,
    length: 0
  };

  DEFAULT_ARGS = ['--cache', 'false', '--force-exclusion', '-f', 'json', '-s'];

  DEFAULT_MESSAGE = 'Unknown Error';

  WARNINGS = new Set(['refactor', 'convention', 'warning']);

  convertOldConfig = function() {
    var args, execPath;
    execPath = atom.config.get(OLD_EXEC_PATH_CONFIG_KEY);
    args = atom.config.get(OLD_ARGS_CONFIG_KEY);
    if (!(execPath || args)) {
      return;
    }
    atom.config.set(COMMAND_CONFIG_KEY, ("" + (execPath || '') + " " + (args || '')).trim());
    atom.config.set(OLD_EXEC_PATH_CONFIG_KEY, void 0);
    return atom.config.set(OLD_ARGS_CONFIG_KEY, void 0);
  };

  lint = function(editor) {
    var command, cwd, filePath, stdin, stream;
    convertOldConfig();
    command = atom.config.get(COMMAND_CONFIG_KEY).split(/\s+/).filter(function(i) {
      return i;
    }).concat(DEFAULT_ARGS, filePath = editor.getPath());
    cwd = path.dirname(helpers.find(filePath, '.'));
    stdin = editor.getText();
    stream = 'both';
    return helpers.exec(command[0], command.slice(1), {
      cwd: cwd,
      stdin: stdin,
      stream: stream
    }).then(function(result) {
      var parsed, stderr, stdout, _ref, _ref1;
      stdout = result.stdout, stderr = result.stderr;
      parsed = (function() {
        try {
          return JSON.parse(stdout);
        } catch (_error) {}
      })();
      if (typeof parsed !== 'object') {
        throw new Error(stderr || stdout);
      }
      return (((_ref = parsed.files) != null ? (_ref1 = _ref[0]) != null ? _ref1.offenses : void 0 : void 0) || []).map(function(offense) {
        var column, cop_name, length, line, location, message, severity, _ref;
        cop_name = offense.cop_name, location = offense.location, message = offense.message, severity = offense.severity;
        _ref = location || DEFAULT_LOCATION, line = _ref.line, column = _ref.column, length = _ref.length;
        return {
          type: WARNINGS.has(severity) ? 'Warning' : 'Error',
          text: (message || DEFAULT_MESSAGE) + (cop_name ? " (" + cop_name + ")" : ''),
          filePath: filePath,
          range: [[line - 1, column - 1], [line - 1, column + length - 1]]
        };
      });
    });
  };

  linter = {
    name: 'RuboCop',
    grammarScopes: ['source.ruby', 'source.ruby.rails', 'source.ruby.rspec', 'source.ruby.chef'],
    scope: 'file',
    lintOnFly: true,
    lint: lint
  };

  module.exports = {
    config: {
      command: {
        type: 'string',
        title: 'Command',
        "default": 'rubocop',
        description: 'This is the absolute path to your `rubocop` command. You may need to run `which rubocop` or `rbenv which rubocop` to find this. Examples: `/usr/local/bin/rubocop` or `/usr/local/bin/bundle exec rubocop --config /my/rubocop.yml`.'
      }
    },
    provideLinter: function() {
      return linter;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJvY29wL2luZGV4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyS0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVIsQ0FEVixDQUFBOztBQUFBLEVBR0Esa0JBQUEsR0FBcUIsd0JBSHJCLENBQUE7O0FBQUEsRUFJQSx3QkFBQSxHQUEyQiwrQkFKM0IsQ0FBQTs7QUFBQSxFQUtBLG1CQUFBLEdBQXNCLG9DQUx0QixDQUFBOztBQUFBLEVBTUEsZ0JBQUEsR0FBbUI7QUFBQSxJQUFDLElBQUEsRUFBTSxDQUFQO0FBQUEsSUFBVSxNQUFBLEVBQVEsQ0FBbEI7QUFBQSxJQUFxQixNQUFBLEVBQVEsQ0FBN0I7R0FObkIsQ0FBQTs7QUFBQSxFQU9BLFlBQUEsR0FBZSxDQUFDLFNBQUQsRUFBWSxPQUFaLEVBQXFCLG1CQUFyQixFQUEwQyxJQUExQyxFQUFnRCxNQUFoRCxFQUF3RCxJQUF4RCxDQVBmLENBQUE7O0FBQUEsRUFRQSxlQUFBLEdBQWtCLGVBUmxCLENBQUE7O0FBQUEsRUFTQSxRQUFBLEdBQWUsSUFBQSxHQUFBLENBQUksQ0FBQyxVQUFELEVBQWEsWUFBYixFQUEyQixTQUEzQixDQUFKLENBVGYsQ0FBQTs7QUFBQSxFQVdBLGdCQUFBLEdBQW1CLFNBQUEsR0FBQTtBQUNqQixRQUFBLGNBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBQVgsQ0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQkFBaEIsQ0FEUCxD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

//# sourceURL=/Users/victor.martins/.atom/packages/linter-rubocop/index.coffee