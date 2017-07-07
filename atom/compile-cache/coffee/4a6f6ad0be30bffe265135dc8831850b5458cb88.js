(function() {
  var BufferedProcess, CompositeDisposable, RubocopAutoCorrect, fs, path, ref, spawnSync, temp, which;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, BufferedProcess = ref.BufferedProcess;

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
            return _this.run(atom.workspace.getActiveTextEditor());
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
        'rubocop-auto-correct:toggle-only-fixes-notification': (function(_this) {
          return function() {
            return _this.toggleOnlyFixesNotification();
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

    RubocopAutoCorrect.prototype.toggleMessage = function(messagePrepend, enabled) {
      return "Rubocop Auto Correct: " + messagePrepend + " " + (enabled ? "ON" : "OFF");
    };

    RubocopAutoCorrect.prototype.toggleAutoRun = function() {
      var setting;
      setting = atom.config.get('rubocop-auto-correct.autoRun');
      atom.config.set('rubocop-auto-correct.autoRun', !setting);
      return atom.notifications.addSuccess(this.toggleMessage("Auto Run", !setting));
    };

    RubocopAutoCorrect.prototype.toggleNotification = function() {
      var setting;
      setting = atom.config.get('rubocop-auto-correct.notification');
      atom.config.set('rubocop-auto-correct.notification', !setting);
      return atom.notifications.addSuccess(this.toggleMessage("Notifications", !setting));
    };

    RubocopAutoCorrect.prototype.toggleOnlyFixesNotification = function() {
      var setting;
      setting = atom.config.get('rubocop-auto-correct.onlyFixesNotification');
      atom.config.set('rubocop-auto-correct.onlyFixesNotification', !setting);
      return atom.notifications.addSuccess(this.toggleMessage("Only fixes notification", !setting));
    };

    RubocopAutoCorrect.prototype.toggleCorrectFile = function() {
      var setting;
      setting = atom.config.get('rubocop-auto-correct.correctFile');
      atom.config.set('rubocop-auto-correct.correctFile', !setting);
      return atom.notifications.addSuccess(this.toggleMessage("Correct File", !setting));
    };

    RubocopAutoCorrect.prototype.toggleDebugMode = function() {
      var setting;
      setting = atom.config.get('rubocop-auto-correct.debugMode');
      atom.config.set('rubocop-auto-correct.debugMode', !setting);
      return atom.notifications.addSuccess(this.toggleMessage("Debug Mode", !setting));
    };

    RubocopAutoCorrect.prototype.run = function(editor) {
      if (!editor) {
        return;
      }
      if (!editor.getGrammar().scopeName.match("ruby")) {
        return atom.notifications.addError("Only use source.ruby");
      }
      if (atom.config.get('rubocop-auto-correct.correctFile')) {
        if (editor.isModified()) {
          editor.save();
        }
        return this.autoCorrectFile(editor);
      } else {
        return this.autoCorrectBuffer(editor);
      }
    };

    RubocopAutoCorrect.prototype.rubocopConfigPath = function(filePath) {
      var configFile, homeConfigPath, projectConfigPath, projectPath, ref1, relativePath;
      configFile = '/.rubocop.yml';
      ref1 = atom.project.relativizePath(filePath), projectPath = ref1[0], relativePath = ref1[1];
      projectConfigPath = projectPath + configFile;
      homeConfigPath = fs.getHomeDirectory() + configFile;
      if (fs.existsSync(projectConfigPath)) {
        return ['--config', projectConfigPath];
      }
      if (fs.existsSync(homeConfigPath)) {
        return ['--config', homeConfigPath];
      }
      return [];
    };

    RubocopAutoCorrect.prototype.rubocopCommand = function() {
      var commandWithArgs;
      commandWithArgs = atom.config.get('rubocop-auto-correct.rubocopCommandPath').concat(" --format json").replace(/--format\s[^(\sj)]+/, "").split(/\s+/).filter(function(i) {
        return i;
      });
      return [commandWithArgs[0], commandWithArgs.slice(1)];
    };

    RubocopAutoCorrect.prototype.autoCorrectBuffer = function(editor) {
      var args, buffer, command, rubocopCommand, tempFilePath;
      buffer = editor.getBuffer();
      tempFilePath = this.makeTempFile("rubocop.rb");
      fs.writeFileSync(tempFilePath, buffer.getText());
      rubocopCommand = this.rubocopCommand();
      command = rubocopCommand[0];
      args = rubocopCommand[1].concat(['-a', tempFilePath]).concat(this.rubocopConfigPath(buffer.getPath()));
      return which(command, (function(_this) {
        return function(err) {
          var rubocop;
          if (err) {
            return _this.rubocopNotFoundError();
          }
          rubocop = spawnSync(command, args, {
            encoding: 'utf-8',
            timeout: 5000
          });
          if (rubocop.stderr) {
            return _this.rubocopOutput({
              "stderr": "" + rubocop.stderr
            });
          }
          buffer.setTextViaDiff(fs.readFileSync(tempFilePath, 'utf-8'));
          return _this.rubocopOutput(JSON.parse(rubocop.stdout));
        };
      })(this));
    };

    RubocopAutoCorrect.prototype.autoCorrectFile = function(editor) {
      var args, buffer, command, filePath, rubocopCommand, stderr, stdout;
      filePath = editor.getPath();
      buffer = editor.getBuffer();
      rubocopCommand = this.rubocopCommand();
      command = rubocopCommand[0];
      args = rubocopCommand[1].concat(['-a', filePath]).concat(this.rubocopConfigPath(filePath));
      stdout = (function(_this) {
        return function(output) {
          _this.rubocopOutput(JSON.parse(output));
          return buffer.reload();
        };
      })(this);
      stderr = (function(_this) {
        return function(output) {
          return _this.rubocopOutput({
            "stderr": "" + output
          });
        };
      })(this);
      return which(command, (function(_this) {
        return function(err) {
          if (err) {
            return _this.rubocopNotFoundError();
          }
          return new BufferedProcess({
            command: command,
            args: args,
            stdout: stdout,
            stderr: stderr
          });
        };
      })(this));
    };

    RubocopAutoCorrect.prototype.rubocopNotFoundError = function() {
      return atom.notifications.addError("Rubocop command is not found.", {
        detail: 'When you don\'t install rubocop yet, Run `gem install rubocop` first.\n\nIf you already installed rubocop,\nPlease check package setting at `Rubocop Command Path`.'
      });
    };

    RubocopAutoCorrect.prototype.rubocopOutput = function(data) {
      var debug, file, j, len, notification, offense, onlyFixesNotification, ref1, results;
      debug = atom.config.get('rubocop-auto-correct.debugMode');
      notification = atom.config.get('rubocop-auto-correct.notification');
      onlyFixesNotification = atom.config.get('rubocop-auto-correct.onlyFixesNotification');
      if (debug) {
        console.log(data);
      }
      if (data.stderr) {
        if (notification) {
          atom.notifications.addError(data.stderr);
        }
        return;
      }
      if (data.summary.offense_count === 0) {
        if (!onlyFixesNotification) {
          if (notification) {
            atom.notifications.addSuccess("No offenses found");
          }
        }
        return;
      }
      if (!onlyFixesNotification) {
        if (notification) {
          atom.notifications.addWarning(data.summary.offense_count + " offenses found!");
        }
      }
      ref1 = data.files;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        file = ref1[j];
        results.push((function() {
          var k, len1, ref2, results1;
          ref2 = file.offenses;
          results1 = [];
          for (k = 0, len1 = ref2.length; k < len1; k++) {
            offense = ref2[k];
            if (offense.corrected) {
              if (notification) {
                results1.push(atom.notifications.addSuccess("Line: " + offense.location.line + ", Col:" + offense.location.column + " (FIXED)", {
                  detail: "" + offense.message
                }));
              } else {
                results1.push(void 0);
              }
            } else {
              if (!onlyFixesNotification) {
                if (notification) {
                  results1.push(atom.notifications.addWarning("Line: " + offense.location.line + ", Col:" + offense.location.column, {
                    detail: "" + offense.message
                  }));
                } else {
                  results1.push(void 0);
                }
              } else {
                results1.push(void 0);
              }
            }
          }
          return results1;
        })());
      }
      return results;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3J1Ym9jb3AtYXV0by1jb3JyZWN0L2xpYi9ydWJvY29wLWF1dG8tY29ycmVjdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQXlDLE9BQUEsQ0FBUSxNQUFSLENBQXpDLEVBQUMsNkNBQUQsRUFBc0I7O0VBQ3JCLFlBQWEsT0FBQSxDQUFRLGVBQVI7O0VBQ2QsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztFQUNSLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyw0QkFBQTtNQUNYLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7VUFDbkQsSUFBRyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsU0FBUyxDQUFDLEtBQTlCLENBQW9DLE1BQXBDLENBQUg7bUJBQ0UsS0FBQyxDQUFBLFlBQUQsQ0FBYyxNQUFkLEVBREY7O1FBRG1EO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFuQjtNQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO1FBQUEsbUNBQUEsRUFBcUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDbkMsS0FBQyxDQUFBLEdBQUQsQ0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBTDtVQURtQztRQUFB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YUFBQSxNQUFBO2NBT0UsSUFBRyxDQUFDLHFCQUFKO2dCQUNFLElBSUssWUFKTDtnQ0FBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQ0UsUUFBQSxHQUFTLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBMUIsR0FBK0IsUUFBL0IsR0FDTSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BRnpCLEVBR0U7b0JBQUUsTUFBQSxFQUFRLEVBQUEsR0FBRyxPQUFPLENBQUMsT0FBckI7bUJBSEYsR0FBQTtpQkFBQSxNQUFBO3dDQUFBO2lCQURGO2VBQUEsTUFBQTtzQ0FBQTtlQVBGOztBQURGOzs7QUFERjs7SUF0QmE7O2lDQXNDZixZQUFBLEdBQWMsU0FBQyxRQUFEO0FBQ1osVUFBQTtNQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsU0FBTCxDQUFBO01BQ1osUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixRQUFyQjtNQUNYLEVBQUUsQ0FBQyxhQUFILENBQWlCLFFBQWpCLEVBQTJCLEVBQTNCO2FBQ0E7SUFKWTs7Ozs7QUF6TGhCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGUsIEJ1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xue3NwYXduU3luY30gPSByZXF1aXJlICdjaGlsZF9wcm9jZXNzJ1xud2hpY2ggPSByZXF1aXJlICd3aGljaCdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xudGVtcCA9IHJlcXVpcmUgJ3RlbXAnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFJ1Ym9jb3BBdXRvQ29ycmVjdFxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgaWYgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUubWF0Y2goXCJydWJ5XCIpXG4gICAgICAgIEBoYW5kbGVFdmVudHMoZWRpdG9yKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAncnVib2NvcC1hdXRvLWNvcnJlY3Q6Y3VycmVudC1maWxlJzogPT5cbiAgICAgICAgQHJ1bihhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gICAgICAncnVib2NvcC1hdXRvLWNvcnJlY3Q6dG9nZ2xlLWF1dG8tcnVuJzogPT4gQHRvZ2dsZUF1dG9SdW4oKVxuICAgICAgJ3J1Ym9jb3AtYXV0by1jb3JyZWN0OnRvZ2dsZS1ub3RpZmljYXRpb24nOiA9PiBAdG9nZ2xlTm90aWZpY2F0aW9uKClcbiAgICAgICdydWJvY29wLWF1dG8tY29ycmVjdDp0b2dnbGUtb25seS1maXhlcy1ub3RpZmljYXRpb24nOiA9PlxuICAgICAgICBAdG9nZ2xlT25seUZpeGVzTm90aWZpY2F0aW9uKClcbiAgICAgICdydWJvY29wLWF1dG8tY29ycmVjdDp0b2dnbGUtY29ycmVjdC1maWxlJzogPT4gQHRvZ2dsZUNvcnJlY3RGaWxlKClcbiAgICAgICdydWJvY29wLWF1dG8tY29ycmVjdDp0b2dnbGUtZGVidWctbW9kZSc6ID0+IEB0b2dnbGVEZWJ1Z01vZGUoKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbiAgaGFuZGxlRXZlbnRzOiAoZWRpdG9yKSAtPlxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGJ1ZmZlclNhdmVkU3Vic2NyaXB0aW9uID0gYnVmZmVyLm9uRGlkU2F2ZSA9PlxuICAgICAgYnVmZmVyLnRyYW5zYWN0ID0+XG4gICAgICAgIEBydW4oZWRpdG9yKSBpZiBhdG9tLmNvbmZpZy5nZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0LmF1dG9SdW4nKVxuXG4gICAgZWRpdG9yRGVzdHJveWVkU3Vic2NyaXB0aW9uID0gZWRpdG9yLm9uRGlkRGVzdHJveSAtPlxuICAgICAgYnVmZmVyU2F2ZWRTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICBlZGl0b3JEZXN0cm95ZWRTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQoYnVmZmVyU2F2ZWRTdWJzY3JpcHRpb24pXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvckRlc3Ryb3llZFN1YnNjcmlwdGlvbilcblxuICB0b2dnbGVNZXNzYWdlOiAobWVzc2FnZVByZXBlbmQsIGVuYWJsZWQpIC0+XG4gICAgXCJSdWJvY29wIEF1dG8gQ29ycmVjdDogXCIrIG1lc3NhZ2VQcmVwZW5kICsgXCIgXCIgK1xuICAgICAgKGlmIGVuYWJsZWQgdGhlbiBcIk9OXCIgZWxzZSBcIk9GRlwiKVxuXG4gIHRvZ2dsZUF1dG9SdW46IC0+XG4gICAgc2V0dGluZyA9IGF0b20uY29uZmlnLmdldCgncnVib2NvcC1hdXRvLWNvcnJlY3QuYXV0b1J1bicpXG4gICAgYXRvbS5jb25maWcuc2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5hdXRvUnVuJywgIXNldHRpbmcpXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoQHRvZ2dsZU1lc3NhZ2UoXCJBdXRvIFJ1blwiLCAhc2V0dGluZykpXG5cbiAgdG9nZ2xlTm90aWZpY2F0aW9uOiAtPlxuICAgIHNldHRpbmcgPSBhdG9tLmNvbmZpZy5nZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0Lm5vdGlmaWNhdGlvbicpXG4gICAgYXRvbS5jb25maWcuc2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5ub3RpZmljYXRpb24nLCAhc2V0dGluZylcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhAdG9nZ2xlTWVzc2FnZShcIk5vdGlmaWNhdGlvbnNcIiwgIXNldHRpbmcpKVxuXG4gIHRvZ2dsZU9ubHlGaXhlc05vdGlmaWNhdGlvbjogLT5cbiAgICBzZXR0aW5nID0gYXRvbS5jb25maWcuZ2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5vbmx5Rml4ZXNOb3RpZmljYXRpb24nKVxuICAgIGF0b20uY29uZmlnLnNldCgncnVib2NvcC1hdXRvLWNvcnJlY3Qub25seUZpeGVzTm90aWZpY2F0aW9uJywgIXNldHRpbmcpXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXG4gICAgICBAdG9nZ2xlTWVzc2FnZShcIk9ubHkgZml4ZXMgbm90aWZpY2F0aW9uXCIsICFzZXR0aW5nKVxuICAgIClcblxuICB0b2dnbGVDb3JyZWN0RmlsZTogLT5cbiAgICBzZXR0aW5nID0gYXRvbS5jb25maWcuZ2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5jb3JyZWN0RmlsZScpXG4gICAgYXRvbS5jb25maWcuc2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5jb3JyZWN0RmlsZScsICFzZXR0aW5nKVxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKEB0b2dnbGVNZXNzYWdlKFwiQ29ycmVjdCBGaWxlXCIsICFzZXR0aW5nKSlcblxuICB0b2dnbGVEZWJ1Z01vZGU6IC0+XG4gICAgc2V0dGluZyA9IGF0b20uY29uZmlnLmdldCgncnVib2NvcC1hdXRvLWNvcnJlY3QuZGVidWdNb2RlJylcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0LmRlYnVnTW9kZScsICFzZXR0aW5nKVxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKEB0b2dnbGVNZXNzYWdlKFwiRGVidWcgTW9kZVwiLCAhc2V0dGluZykpXG5cbiAgcnVuOiAoZWRpdG9yKSAtPlxuICAgIHJldHVybiBpZiAhZWRpdG9yXG4gICAgdW5sZXNzIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lLm1hdGNoKFwicnVieVwiKVxuICAgICAgcmV0dXJuIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIk9ubHkgdXNlIHNvdXJjZS5ydWJ5XCIpXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5jb3JyZWN0RmlsZScpXG4gICAgICBlZGl0b3Iuc2F2ZSgpIGlmIGVkaXRvci5pc01vZGlmaWVkKClcbiAgICAgIEBhdXRvQ29ycmVjdEZpbGUoZWRpdG9yKVxuICAgIGVsc2VcbiAgICAgIEBhdXRvQ29ycmVjdEJ1ZmZlcihlZGl0b3IpXG5cbiAgcnVib2NvcENvbmZpZ1BhdGg6IChmaWxlUGF0aCkgLT5cbiAgICBjb25maWdGaWxlID0gJy8ucnVib2NvcC55bWwnXG4gICAgW3Byb2plY3RQYXRoLCByZWxhdGl2ZVBhdGhdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVxuICAgIHByb2plY3RDb25maWdQYXRoID0gcHJvamVjdFBhdGggKyBjb25maWdGaWxlXG4gICAgaG9tZUNvbmZpZ1BhdGggPSBmcy5nZXRIb21lRGlyZWN0b3J5KCkgKyBjb25maWdGaWxlXG4gICAgcmV0dXJuIFsnLS1jb25maWcnLCBwcm9qZWN0Q29uZmlnUGF0aF0gaWYgKGZzLmV4aXN0c1N5bmMocHJvamVjdENvbmZpZ1BhdGgpKVxuICAgIHJldHVybiBbJy0tY29uZmlnJywgaG9tZUNvbmZpZ1BhdGhdIGlmIChmcy5leGlzdHNTeW5jKGhvbWVDb25maWdQYXRoKSlcbiAgICBbXVxuXG4gIHJ1Ym9jb3BDb21tYW5kOiAtPlxuICAgIGNvbW1hbmRXaXRoQXJncyA9IGF0b20uY29uZmlnLmdldCgncnVib2NvcC1hdXRvLWNvcnJlY3QucnVib2NvcENvbW1hbmRQYXRoJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChcIiAtLWZvcm1hdCBqc29uXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8tLWZvcm1hdFxcc1teKFxcc2opXSsvLCBcIlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoL1xccysvKS5maWx0ZXIoKGkpIC0+IGkpXG4gICAgW2NvbW1hbmRXaXRoQXJnc1swXSwgY29tbWFuZFdpdGhBcmdzWzEuLl1dXG5cbiAgYXV0b0NvcnJlY3RCdWZmZXI6IChlZGl0b3IpICAtPlxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuXG4gICAgdGVtcEZpbGVQYXRoID0gQG1ha2VUZW1wRmlsZShcInJ1Ym9jb3AucmJcIilcbiAgICBmcy53cml0ZUZpbGVTeW5jKHRlbXBGaWxlUGF0aCwgYnVmZmVyLmdldFRleHQoKSlcblxuICAgIHJ1Ym9jb3BDb21tYW5kID0gQHJ1Ym9jb3BDb21tYW5kKClcbiAgICBjb21tYW5kID0gcnVib2NvcENvbW1hbmRbMF1cbiAgICBhcmdzID0gcnVib2NvcENvbW1hbmRbMV1cbiAgICAgIC5jb25jYXQoWyctYScsIHRlbXBGaWxlUGF0aF0pXG4gICAgICAuY29uY2F0KEBydWJvY29wQ29uZmlnUGF0aChidWZmZXIuZ2V0UGF0aCgpKSlcblxuICAgIHdoaWNoIGNvbW1hbmQsIChlcnIpID0+XG4gICAgICByZXR1cm4gQHJ1Ym9jb3BOb3RGb3VuZEVycm9yKCkgaWYgKGVycilcbiAgICAgIHJ1Ym9jb3AgPSBzcGF3blN5bmMoY29tbWFuZCwgYXJncywgeyBlbmNvZGluZzogJ3V0Zi04JywgdGltZW91dDogNTAwMCB9KVxuICAgICAgcmV0dXJuIEBydWJvY29wT3V0cHV0KHtcInN0ZGVyclwiOiBcIiN7cnVib2NvcC5zdGRlcnJ9XCJ9KSBpZiAocnVib2NvcC5zdGRlcnIpXG4gICAgICBidWZmZXIuc2V0VGV4dFZpYURpZmYoZnMucmVhZEZpbGVTeW5jKHRlbXBGaWxlUGF0aCwgJ3V0Zi04JykpXG4gICAgICBAcnVib2NvcE91dHB1dChKU09OLnBhcnNlKHJ1Ym9jb3Auc3Rkb3V0KSlcblxuICBhdXRvQ29ycmVjdEZpbGU6IChlZGl0b3IpICAtPlxuICAgIGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuXG4gICAgcnVib2NvcENvbW1hbmQgPSBAcnVib2NvcENvbW1hbmQoKVxuICAgIGNvbW1hbmQgPSBydWJvY29wQ29tbWFuZFswXVxuICAgIGFyZ3MgPSBydWJvY29wQ29tbWFuZFsxXVxuICAgICAgLmNvbmNhdChbJy1hJywgZmlsZVBhdGhdKVxuICAgICAgLmNvbmNhdChAcnVib2NvcENvbmZpZ1BhdGgoZmlsZVBhdGgpKVxuXG4gICAgc3Rkb3V0ID0gKG91dHB1dCkgPT5cbiAgICAgIEBydWJvY29wT3V0cHV0KEpTT04ucGFyc2Uob3V0cHV0KSlcbiAgICAgIGJ1ZmZlci5yZWxvYWQoKVxuICAgIHN0ZGVyciA9IChvdXRwdXQpID0+XG4gICAgICBAcnVib2NvcE91dHB1dCh7XCJzdGRlcnJcIjogXCIje291dHB1dH1cIn0pXG5cbiAgICB3aGljaCBjb21tYW5kLCAoZXJyKSA9PlxuICAgICAgcmV0dXJuIEBydWJvY29wTm90Rm91bmRFcnJvcigpIGlmIChlcnIpXG4gICAgICBuZXcgQnVmZmVyZWRQcm9jZXNzKHtjb21tYW5kLCBhcmdzLCBzdGRvdXQsIHN0ZGVycn0pXG5cbiAgcnVib2NvcE5vdEZvdW5kRXJyb3I6IC0+XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgXCJSdWJvY29wIGNvbW1hbmQgaXMgbm90IGZvdW5kLlwiLFxuICAgICAgeyBkZXRhaWw6ICcnJ1xuICAgICAgV2hlbiB5b3UgZG9uJ3QgaW5zdGFsbCBydWJvY29wIHlldCwgUnVuIGBnZW0gaW5zdGFsbCBydWJvY29wYCBmaXJzdC5cXG5cbiAgICAgIElmIHlvdSBhbHJlYWR5IGluc3RhbGxlZCBydWJvY29wLFxuICAgICAgUGxlYXNlIGNoZWNrIHBhY2thZ2Ugc2V0dGluZyBhdCBgUnVib2NvcCBDb21tYW5kIFBhdGhgLlxuICAgICAgJycnIH1cbiAgICApXG5cbiAgcnVib2NvcE91dHB1dDogKGRhdGEpIC0+XG4gICAgZGVidWcgPSBhdG9tLmNvbmZpZy5nZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0LmRlYnVnTW9kZScpXG4gICAgbm90aWZpY2F0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5ub3RpZmljYXRpb24nKVxuICAgIG9ubHlGaXhlc05vdGlmaWNhdGlvbiA9XG4gICAgICBhdG9tLmNvbmZpZy5nZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0Lm9ubHlGaXhlc05vdGlmaWNhdGlvbicpXG5cbiAgICBjb25zb2xlLmxvZyhkYXRhKSBpZiBkZWJ1Z1xuXG4gICAgaWYgKGRhdGEuc3RkZXJyKVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGRhdGEuc3RkZXJyKSBpZiBub3RpZmljYXRpb25cbiAgICAgIHJldHVyblxuXG4gICAgaWYgKGRhdGEuc3VtbWFyeS5vZmZlbnNlX2NvdW50ID09IDApXG4gICAgICBpZiAhb25seUZpeGVzTm90aWZpY2F0aW9uXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiTm8gb2ZmZW5zZXMgZm91bmRcIikgaWYgbm90aWZpY2F0aW9uXG4gICAgICByZXR1cm5cblxuICAgIGlmICFvbmx5Rml4ZXNOb3RpZmljYXRpb25cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuICAgICAgICBcIiN7ZGF0YS5zdW1tYXJ5Lm9mZmVuc2VfY291bnR9IG9mZmVuc2VzIGZvdW5kIVwiXG4gICAgICApIGlmIG5vdGlmaWNhdGlvblxuXG4gICAgZm9yIGZpbGUgaW4gZGF0YS5maWxlc1xuICAgICAgZm9yIG9mZmVuc2UgaW4gZmlsZS5vZmZlbnNlc1xuICAgICAgICBpZiBvZmZlbnNlLmNvcnJlY3RlZFxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFxuICAgICAgICAgICAgXCJMaW5lOiAje29mZmVuc2UubG9jYXRpb24ubGluZX0sXG4gICAgICAgICAgICBDb2w6I3tvZmZlbnNlLmxvY2F0aW9uLmNvbHVtbn0gKEZJWEVEKVwiLFxuICAgICAgICAgICAgeyBkZXRhaWw6IFwiI3tvZmZlbnNlLm1lc3NhZ2V9XCIgfVxuICAgICAgICAgICkgaWYgbm90aWZpY2F0aW9uXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiAhb25seUZpeGVzTm90aWZpY2F0aW9uXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgICAgICAgXCJMaW5lOiAje29mZmVuc2UubG9jYXRpb24ubGluZX0sXG4gICAgICAgICAgICAgIENvbDoje29mZmVuc2UubG9jYXRpb24uY29sdW1ufVwiLFxuICAgICAgICAgICAgICB7IGRldGFpbDogXCIje29mZmVuc2UubWVzc2FnZX1cIiB9XG4gICAgICAgICAgICApIGlmIG5vdGlmaWNhdGlvblxuXG4gIG1ha2VUZW1wRmlsZTogKGZpbGVuYW1lKSAtPlxuICAgIGRpcmVjdG9yeSA9IHRlbXAubWtkaXJTeW5jKClcbiAgICBmaWxlUGF0aCA9IHBhdGguam9pbihkaXJlY3RvcnksIGZpbGVuYW1lKVxuICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgsICcnKVxuICAgIGZpbGVQYXRoXG4iXX0=
