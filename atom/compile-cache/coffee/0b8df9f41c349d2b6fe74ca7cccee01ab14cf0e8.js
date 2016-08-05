(function() {
  var BufferedProcess, CompositeDisposable, RubocopAutoCorrect, fs, path, spawnSync, temp, which, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, BufferedProcess = _ref.BufferedProcess;

  spawnSync = require('child_process').spawnSync;

  which = require('which');

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  module.exports = RubocopAutoCorrect = (function() {
    function RubocopAutoCorrect() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          if (editor.getGrammar().scopeName.match("ruby")) {
            return _this.handleEvents(editor);
          }
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'rubocop-auto-correct:current-file': (function(_this) {
          return function() {
            var editor;
            if (editor = atom.workspace.getActiveTextEditor()) {
              return _this.run(editor);
            }
          };
        })(this),
        'rubocop-auto-correct:toggle-auto-run': (function(_this) {
          return function() {
            return _this.toggleAutoRun();
          };
        })(this),
        'rubocop-auto-correct:toggle-notification': (function(_this) {
          return function() {
            return _this.toggleNotification();
          };
        })(this),
        'rubocop-auto-correct:toggle-correct-file': (function(_this) {
          return function() {
            return _this.toggleCorrectFile();
          };
        })(this),
        'rubocop-auto-correct:toggle-debug-mode': (function(_this) {
          return function() {
            return _this.toggleDebugMode();
          };
        })(this)
      }));
    }

    RubocopAutoCorrect.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    RubocopAutoCorrect.prototype.handleEvents = function(editor) {
      var buffer, bufferSavedSubscription, editorDestroyedSubscription;
      buffer = editor.getBuffer();
      bufferSavedSubscription = buffer.onDidSave((function(_this) {
        return function() {
          return buffer.transact(function() {
            if (atom.config.get('rubocop-auto-correct.autoRun')) {
              return _this.run(editor);
            }
          });
        };
      })(this));
      editorDestroyedSubscription = editor.onDidDestroy(function() {
        bufferSavedSubscription.dispose();
        return editorDestroyedSubscription.dispose();
      });
      this.subscriptions.add(bufferSavedSubscription);
      return this.subscriptions.add(editorDestroyedSubscription);
    };

    RubocopAutoCorrect.prototype.toggleAutoRun = function() {
      if (atom.config.get('rubocop-auto-correct.autoRun')) {
        atom.config.set('rubocop-auto-correct.autoRun', false);
        return atom.notifications.addSuccess("Turn OFF, Auto Run");
      } else {
        atom.config.set('rubocop-auto-correct.autoRun', true);
        return atom.notifications.addSuccess("Turn ON, Auto Run");
      }
    };

    RubocopAutoCorrect.prototype.toggleNotification = function() {
      if (atom.config.get('rubocop-auto-correct.notification')) {
        atom.config.set('rubocop-auto-correct.notification', false);
        return atom.notifications.addSuccess("Turn OFF, Notification");
      } else {
        atom.config.set('rubocop-auto-correct.notification', true);
        return atom.notifications.addSuccess("Turn ON, Notification");
      }
    };

    RubocopAutoCorrect.prototype.toggleCorrectFile = function() {
      if (atom.config.get('rubocop-auto-correct.correctFile')) {
        atom.config.set('rubocop-auto-correct.correctFile', false);
        return atom.notifications.addSuccess("Correct the buffer");
      } else {
        atom.config.set('rubocop-auto-correct.correctFile', true);
        return atom.notifications.addSuccess("Correct the file");
      }
    };

    RubocopAutoCorrect.prototype.toggleDebugMode = function() {
      if (atom.config.get('rubocop-auto-correct.debugMode')) {
        atom.config.set('rubocop-auto-correct.debugMode', false);
        return atom.notifications.addSuccess("Turn OFF, Debug Mode");
      } else {
        atom.config.set('rubocop-auto-correct.debugMode', true);
        return atom.notifications.addSuccess("Turn ON, Debug Mode");
      }
    };

    RubocopAutoCorrect.prototype.run = function(editor) {
      if (!editor.getGrammar().scopeName.match("ruby")) {
        return atom.notifications.addError("Only use source.ruby");
      }
      if (atom.config.get('rubocop-auto-correct.correctFile')) {
        if (editor.isModified()) {
          editor.save();
        }
        return this.autoCorrectFile(editor.getPath());
      } else {
        return this.autoCorrectBuffer(editor.getBuffer());
      }
    };

    RubocopAutoCorrect.prototype.autoCorrectBuffer = function(buffer) {
      var args, command, commandWithArgs, debug, notification, options, tempFilePath;
      tempFilePath = this.makeTempFile("rubocop.rb");
      fs.writeFileSync(tempFilePath, buffer.getText());
      commandWithArgs = atom.config.get('rubocop-auto-correct.rubocopCommandPath').split(/\s+/).filter(function(i) {
        return i;
      }).concat(['-a', tempFilePath]);
      command = commandWithArgs[0];
      args = commandWithArgs.slice(1);
      options = {
        encoding: 'utf-8',
        timeout: 5000
      };
      notification = atom.config.get('rubocop-auto-correct.notification');
      debug = atom.config.get('rubocop-auto-correct.debugMode');
      return which(command, function(err) {
        var offenses, re, rubocop;
        if (err) {
          return atom.notifications.addFatalError("Rubocop command is not found.", {
            detail: 'When you don\'t install rubocop yet, Run `gem install rubocop` first.\n\nIf you already installed rubocop, Please check package setting at `Rubocop Command Path`.'
          });
        }
        rubocop = spawnSync(command, args, options);
        if (rubocop.stderr !== "") {
          if (debug) {
            console.error(rubocop.stderr);
          }
          if (notification) {
            atom.notifications.addError(rubocop.stderr);
          }
        }
        if (rubocop.stdout.match("corrected")) {
          buffer.setTextViaDiff(fs.readFileSync(tempFilePath, 'utf-8'));
          if (notification || debug) {
            re = /^.+?(:[0-9]+:[0-9]+:.*$)/mg;
            offenses = rubocop.stdout.match(re);
            return offenses.map(function(offense) {
              var message;
              message = offense.replace(re, buffer.getBaseName() + "$1");
              if (debug) {
                console.log(message);
              }
              if (notification) {
                return atom.notifications.addSuccess(message);
              }
            });
          }
        }
      });
    };

    RubocopAutoCorrect.prototype.autoCorrectFile = function(filePath) {
      var args, command, commandWithArgs, debug, notification, stderr, stdout;
      commandWithArgs = atom.config.get('rubocop-auto-correct.rubocopCommandPath').split(/\s+/).filter(function(i) {
        return i;
      }).concat(['-a', filePath]);
      command = commandWithArgs[0];
      args = commandWithArgs.slice(1);
      debug = atom.config.get('rubocop-auto-correct.debugMode');
      notification = atom.config.get('rubocop-auto-correct.notification');
      stdout = function(output) {
        if (output.match("corrected")) {
          if (debug) {
            console.log(output);
          }
          if (notification) {
            return atom.notifications.addSuccess(output);
          }
        }
      };
      stderr = function(output) {
        if (debug) {
          console.error(output);
        }
        if (notification) {
          return atom.notifications.addError(output);
        }
      };
      return which(command, function(err) {
        var rubocop;
        if (err) {
          return atom.notifications.addFatalError("Rubocop command is not found.", {
            detail: 'When you don\'t install rubocop yet, Run `gem install rubocop` first.\n\nIf you already installed rubocop, Please check package setting at `Rubocop Command Path`.'
          });
        }
        return rubocop = new BufferedProcess({
          command: command,
          args: args,
          stdout: stdout,
          stderr: stderr
        });
      });
    };

    RubocopAutoCorrect.prototype.makeTempFile = function(filename) {
      var directory, filePath;
      directory = temp.mkdirSync();
      filePath = path.join(directory, filename);
      fs.writeFileSync(filePath, '');
      return filePath;
    };

    return RubocopAutoCorrect;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3J1Ym9jb3AtYXV0by1jb3JyZWN0L2xpYi9ydWJvY29wLWF1dG8tY29ycmVjdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0dBQUE7O0FBQUEsRUFBQSxPQUF5QyxPQUFBLENBQVEsTUFBUixDQUF6QyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLHVCQUFBLGVBQXRCLENBQUE7O0FBQUEsRUFDQyxZQUFhLE9BQUEsQ0FBUSxlQUFSLEVBQWIsU0FERCxDQUFBOztBQUFBLEVBRUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBRlIsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FKTCxDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTFAsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLDRCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO0FBQ25ELFVBQUEsSUFBRyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsU0FBUyxDQUFDLEtBQTlCLENBQW9DLE1BQXBDLENBQUg7bUJBQ0UsS0FBQyxDQUFBLFlBQUQsQ0FBYyxNQUFkLEVBREY7V0FEbUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFB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

//# sourceURL=/Users/victor.martins/.atom/packages/rubocop-auto-correct/lib/rubocop-auto-correct.coffee
