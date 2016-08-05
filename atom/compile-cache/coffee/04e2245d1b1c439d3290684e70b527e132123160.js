(function() {
  var File, RubocopAutoCorrect, fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  File = require('atom').File;

  RubocopAutoCorrect = require('../lib/rubocop-auto-correct');

  describe("RubocopAutoCorrect", function() {
    var activationPromise, buffer, editor, filePath, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], editor = _ref[1], buffer = _ref[2], filePath = _ref[3], activationPromise = _ref[4];
    beforeEach(function() {
      var directory;
      directory = temp.mkdirSync();
      atom.project.setPaths([directory]);
      workspaceElement = atom.views.getView(atom.workspace);
      activationPromise = atom.packages.activatePackage('rubocop-auto-correct');
      filePath = path.join(directory, 'example.rb');
      fs.writeFileSync(filePath, '');
      atom.config.set('rubocop-auto-correct.autoRun', false);
      atom.config.set('rubocop-auto-correct.notification', false);
      atom.config.set('rubocop-auto-correct.rubocopCommandPath', 'rubocop');
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-ruby");
      });
      waitsForPromise(function() {
        return atom.workspace.open(filePath).then(function(o) {
          return editor = o;
        });
      });
      runs(function() {
        buffer = editor.getBuffer();
        return atom.commands.dispatch(workspaceElement, 'rubocop-auto-correct:current-file');
      });
      return waitsForPromise(function() {
        return activationPromise;
      });
    });
    describe("when the editor is destroyed", function() {
      beforeEach(function() {
        return editor.destroy();
      });
      return it("does not leak subscriptions", function() {
        var rubocopAutoCorrect;
        rubocopAutoCorrect = atom.packages.getActivePackage('rubocop-auto-correct').mainModule.rubocopAutoCorrect;
        expect(rubocopAutoCorrect.subscriptions.disposables.size).toBe(4);
        atom.packages.deactivatePackage('rubocop-auto-correct');
        return expect(rubocopAutoCorrect.subscriptions.disposables).toBeNull();
      });
    });
    describe("when the 'rubocop-auto-correct:current-file' command is run", function() {
      beforeEach(function() {
        return buffer.setText("{ :atom => 'A hackable text editor for the 21st Century' }\n");
      });
      describe("when correct buffer", function() {
        beforeEach(function() {
          return atom.config.set('rubocop-auto-correct.correctFile', false);
        });
        it("manually run", function() {
          var bufferChangedSpy;
          atom.commands.dispatch(workspaceElement, 'rubocop-auto-correct:current-file');
          bufferChangedSpy = jasmine.createSpy();
          buffer.onDidChange(bufferChangedSpy);
          waitsFor(function() {
            return bufferChangedSpy.callCount > 0;
          });
          return runs(function() {
            return expect(buffer.getText()).toBe("{ atom: 'A hackable text editor for the 21st Century' }\n");
          });
        });
        return it("auto run", function() {
          var bufferChangedSpy;
          atom.config.set('rubocop-auto-correct.autoRun', true);
          editor.save();
          bufferChangedSpy = jasmine.createSpy();
          buffer.onDidChange(bufferChangedSpy);
          waitsFor(function() {
            return bufferChangedSpy.callCount > 0;
          });
          return runs(function() {
            return expect(buffer.getText()).toBe("{ atom: 'A hackable text editor for the 21st Century' }\n");
          });
        });
      });
      return describe("when correct file", function() {
        beforeEach(function() {
          return atom.config.set('rubocop-auto-correct.correctFile', true);
        });
        it("manually run", function() {
          var bufferChangedSpy;
          atom.commands.dispatch(workspaceElement, 'rubocop-auto-correct:current-file');
          bufferChangedSpy = jasmine.createSpy();
          buffer.onDidChange(bufferChangedSpy);
          waitsFor(function() {
            return bufferChangedSpy.callCount > 1;
          });
          return runs(function() {
            return expect(buffer.getText()).toBe("{ atom: 'A hackable text editor for the 21st Century' }\n");
          });
        });
        return it("auto run", function() {
          var bufferChangedSpy;
          atom.config.set('rubocop-auto-correct.autoRun', true);
          editor.save();
          bufferChangedSpy = jasmine.createSpy();
          buffer.onDidChange(bufferChangedSpy);
          waitsFor(function() {
            return bufferChangedSpy.callCount > 1;
          });
          return runs(function() {
            return expect(buffer.getText()).toBe("{ atom: 'A hackable text editor for the 21st Century' }\n");
          });
        });
      });
    });
    describe("when command with arguments", function() {
      beforeEach(function() {
        buffer.setText("{ :atom => 'A hackable text editor for the 21st Century' }\n");
        return atom.config.set('rubocop-auto-correct.rubocopCommandPath', 'rubocop --format simple');
      });
      describe("when correct buffer", function() {
        return it("manually run", function() {
          var bufferChangedSpy;
          atom.config.set('rubocop-auto-correct.correctFile', false);
          atom.commands.dispatch(workspaceElement, 'rubocop-auto-correct:current-file');
          bufferChangedSpy = jasmine.createSpy();
          buffer.onDidChange(bufferChangedSpy);
          waitsFor(function() {
            return bufferChangedSpy.callCount > 0;
          });
          return runs(function() {
            return expect(buffer.getText()).toBe("{ atom: 'A hackable text editor for the 21st Century' }\n");
          });
        });
      });
      return describe("when correct file", function() {
        return it("manually run", function() {
          var bufferChangedSpy;
          atom.config.set('rubocop-auto-correct.correctFile', true);
          atom.commands.dispatch(workspaceElement, 'rubocop-auto-correct:current-file');
          bufferChangedSpy = jasmine.createSpy();
          buffer.onDidChange(bufferChangedSpy);
          waitsFor(function() {
            return bufferChangedSpy.callCount > 0;
          });
          return runs(function() {
            return expect(buffer.getText()).toBe("{ atom: 'A hackable text editor for the 21st Century' }\n");
          });
        });
      });
    });
    describe("when toggle config", function() {
      beforeEach(function() {
        return this.rubocopAutoCorrect = new RubocopAutoCorrect;
      });
      it("changes auto run", function() {
        atom.config.set('rubocop-auto-correct.autoRun', false);
        this.rubocopAutoCorrect.toggleAutoRun();
        expect(atom.config.get('rubocop-auto-correct').autoRun).toBe(true);
        this.rubocopAutoCorrect.toggleAutoRun();
        return expect(atom.config.get('rubocop-auto-correct').autoRun).toBe(false);
      });
      it("changes notification", function() {
        atom.config.set('rubocop-auto-correct.notification', false);
        this.rubocopAutoCorrect.toggleNotification();
        expect(atom.config.get('rubocop-auto-correct').notification).toBe(true);
        this.rubocopAutoCorrect.toggleNotification();
        return expect(atom.config.get('rubocop-auto-correct').notification).toBe(false);
      });
      it("changes correct method", function() {
        atom.config.set('rubocop-auto-correct.correctFile', false);
        this.rubocopAutoCorrect.toggleCorrectFile();
        expect(atom.config.get('rubocop-auto-correct').correctFile).toBe(true);
        this.rubocopAutoCorrect.toggleCorrectFile();
        return expect(atom.config.get('rubocop-auto-correct').correctFile).toBe(false);
      });
      return it("changes debug mode", function() {
        atom.config.set('rubocop-auto-correct.debug-mode', false);
        this.rubocopAutoCorrect.toggleDebugMode();
        expect(atom.config.get('rubocop-auto-correct').debugMode).toBe(true);
        this.rubocopAutoCorrect.toggleDebugMode();
        return expect(atom.config.get('rubocop-auto-correct').debugMode).toBe(false);
      });
    });
    return describe("when makeTempFile", function() {
      return it("run makeTempFile", function() {
        var tempFilePath;
        this.rubocopAutoCorrect = new RubocopAutoCorrect;
        tempFilePath = this.rubocopAutoCorrect.makeTempFile("rubocop.rb");
        return expect(fs.isFileSync(tempFilePath)).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3J1Ym9jb3AtYXV0by1jb3JyZWN0L3NwZWMvcnVib2NvcC1hdXRvLWNvcnJlY3Qtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFIRCxDQUFBOztBQUFBLEVBS0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLDZCQUFSLENBTHJCLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFFBQUEsbUVBQUE7QUFBQSxJQUFBLE9BQWtFLEVBQWxFLEVBQUMsMEJBQUQsRUFBbUIsZ0JBQW5CLEVBQTJCLGdCQUEzQixFQUFtQyxrQkFBbkMsRUFBNkMsMkJBQTdDLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLFNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsU0FBTCxDQUFBLENBQVosQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLENBQUMsU0FBRCxDQUF0QixDQURBLENBQUE7QUFBQSxNQUVBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FGbkIsQ0FBQTtBQUFBLE1BR0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENB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

//# sourceURL=/Users/victor.martins/.atom/packages/rubocop-auto-correct/spec/rubocop-auto-correct-spec.coffee
