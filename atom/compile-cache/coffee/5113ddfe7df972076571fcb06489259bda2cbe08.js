(function() {
  var File, RubocopAutoCorrect, fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  File = require('atom').File;

  RubocopAutoCorrect = require('../lib/rubocop-auto-correct');

  describe("RubocopAutoCorrect", function() {
    var activationPromise, buffer, editor, filePath, ref, workspaceElement;
    ref = [], workspaceElement = ref[0], editor = ref[1], buffer = ref[2], filePath = ref[3], activationPromise = ref[4];
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
        return atom.config.set('rubocop-auto-correct.rubocopCommandPath', 'rubocop --no-color --format simple');
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
            return bufferChangedSpy.callCount > 1;
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
      it("changes notification", function() {
        atom.config.set('rubocop-auto-correct.onlyFixesNotification', false);
        this.rubocopAutoCorrect.toggleOnlyFixesNotification();
        expect(atom.config.get('rubocop-auto-correct').onlyFixesNotification).toBe(true);
        this.rubocopAutoCorrect.toggleOnlyFixesNotification();
        return expect(atom.config.get('rubocop-auto-correct').onlyFixesNotification).toBe(false);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3J1Ym9jb3AtYXV0by1jb3JyZWN0L3NwZWMvcnVib2NvcC1hdXRvLWNvcnJlY3Qtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLE9BQVEsT0FBQSxDQUFRLE1BQVI7O0VBRVQsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLDZCQUFSOztFQUVyQixRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQTtBQUM3QixRQUFBO0lBQUEsTUFBa0UsRUFBbEUsRUFBQyx5QkFBRCxFQUFtQixlQUFuQixFQUEyQixlQUEzQixFQUFtQyxpQkFBbkMsRUFBNkM7SUFFN0MsVUFBQSxDQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxTQUFMLENBQUE7TUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxTQUFELENBQXRCO01BQ0EsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QjtNQUNuQixpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsc0JBQTlCO01BQ3BCLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckI7TUFDWCxFQUFFLENBQUMsYUFBSCxDQUFpQixRQUFqQixFQUEyQixFQUEzQjtNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsRUFBZ0QsS0FBaEQ7TUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUNBQWhCLEVBQXFELEtBQXJE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QXBCLENBQUE7UUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixDQUF1QyxDQUFDLFNBQS9DLENBQXlELENBQUMsSUFBMUQsQ0FBK0QsSUFBL0Q7UUFDQSxJQUFDLENBQUEsa0JBQWtCLENBQUMsZUFBcEIsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLENBQXVDLENBQUMsU0FBL0MsQ0FBeUQsQ0FBQyxJQUExRCxDQUErRCxLQUEvRDtNQUx1QixDQUF6QjtJQWhDNkIsQ0FBL0I7V0F1Q0EsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUE7YUFDNUIsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUE7QUFDckIsWUFBQTtRQUFBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixJQUFJO1FBQzFCLFlBQUEsR0FBZSxJQUFDLENBQUEsa0JBQWtCLENBQUMsWUFBcEIsQ0FBaUMsWUFBakM7ZUFDZixNQUFBLENBQU8sRUFBRSxDQUFDLFVBQUgsQ0FBYyxZQUFkLENBQVAsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxJQUF6QztNQUhxQixDQUF2QjtJQUQ0QixDQUE5QjtFQTlKNkIsQ0FBL0I7QUFQQSIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xudGVtcCA9IHJlcXVpcmUgJ3RlbXAnXG57RmlsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5SdWJvY29wQXV0b0NvcnJlY3QgPSByZXF1aXJlICcuLi9saWIvcnVib2NvcC1hdXRvLWNvcnJlY3QnXG5cbmRlc2NyaWJlIFwiUnVib2NvcEF1dG9Db3JyZWN0XCIsIC0+XG4gIFt3b3Jrc3BhY2VFbGVtZW50LCBlZGl0b3IsIGJ1ZmZlciwgZmlsZVBhdGgsIGFjdGl2YXRpb25Qcm9taXNlXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGRpcmVjdG9yeSA9IHRlbXAubWtkaXJTeW5jKClcbiAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW2RpcmVjdG9yeV0pXG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdydWJvY29wLWF1dG8tY29ycmVjdCcpXG4gICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oZGlyZWN0b3J5LCAnZXhhbXBsZS5yYicpXG4gICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgJycpXG4gICAgYXRvbS5jb25maWcuc2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5hdXRvUnVuJywgZmFsc2UpXG4gICAgYXRvbS5jb25maWcuc2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5ub3RpZmljYXRpb24nLCBmYWxzZSlcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0LnJ1Ym9jb3BDb21tYW5kUGF0aCcsICdydWJvY29wJylcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJsYW5ndWFnZS1ydWJ5XCIpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpLnRoZW4gKG8pIC0+IGVkaXRvciA9IG9cblxuICAgIHJ1bnMgLT5cbiAgICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCB3b3Jrc3BhY2VFbGVtZW50LCAncnVib2NvcC1hdXRvLWNvcnJlY3Q6Y3VycmVudC1maWxlJ1xuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhY3RpdmF0aW9uUHJvbWlzZVxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgZWRpdG9yIGlzIGRlc3Ryb3llZFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5kZXN0cm95KClcblxuICAgIGl0IFwiZG9lcyBub3QgbGVhayBzdWJzY3JpcHRpb25zXCIsIC0+XG4gICAgICB7cnVib2NvcEF1dG9Db3JyZWN0fSA9IGF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZSgncnVib2NvcC1hdXRvLWNvcnJlY3QnKS5tYWluTW9kdWxlXG4gICAgICBleHBlY3QocnVib2NvcEF1dG9Db3JyZWN0LnN1YnNjcmlwdGlvbnMuZGlzcG9zYWJsZXMuc2l6ZSkudG9CZSA0XG5cbiAgICAgIGF0b20ucGFja2FnZXMuZGVhY3RpdmF0ZVBhY2thZ2UoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0JylcbiAgICAgIGV4cGVjdChydWJvY29wQXV0b0NvcnJlY3Quc3Vic2NyaXB0aW9ucy5kaXNwb3NhYmxlcykudG9CZU51bGwoKVxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgJ3J1Ym9jb3AtYXV0by1jb3JyZWN0OmN1cnJlbnQtZmlsZScgY29tbWFuZCBpcyBydW5cIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBidWZmZXIuc2V0VGV4dChcInsgOmF0b20gPT4gJ0EgaGFja2FibGUgdGV4dCBlZGl0b3IgZm9yIHRoZSAyMXN0IENlbnR1cnknIH1cXG5cIilcblxuICAgIGRlc2NyaWJlIFwid2hlbiBjb3JyZWN0IGJ1ZmZlclwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0LmNvcnJlY3RGaWxlJywgZmFsc2UpXG5cbiAgICAgIGl0IFwibWFudWFsbHkgcnVuXCIsIC0+XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgJ3J1Ym9jb3AtYXV0by1jb3JyZWN0OmN1cnJlbnQtZmlsZSdcblxuICAgICAgICBidWZmZXJDaGFuZ2VkU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKVxuICAgICAgICBidWZmZXIub25EaWRDaGFuZ2UoYnVmZmVyQ2hhbmdlZFNweSlcbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICBidWZmZXJDaGFuZ2VkU3B5LmNhbGxDb3VudCA+IDBcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChidWZmZXIuZ2V0VGV4dCgpKS50b0JlIFwieyBhdG9tOiAnQSBoYWNrYWJsZSB0ZXh0IGVkaXRvciBmb3IgdGhlIDIxc3QgQ2VudHVyeScgfVxcblwiXG5cbiAgICAgIGl0IFwiYXV0byBydW5cIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5hdXRvUnVuJywgdHJ1ZSlcbiAgICAgICAgZWRpdG9yLnNhdmUoKVxuXG4gICAgICAgIGJ1ZmZlckNoYW5nZWRTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpXG4gICAgICAgIGJ1ZmZlci5vbkRpZENoYW5nZShidWZmZXJDaGFuZ2VkU3B5KVxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIGJ1ZmZlckNoYW5nZWRTcHkuY2FsbENvdW50ID4gMFxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGJ1ZmZlci5nZXRUZXh0KCkpLnRvQmUgXCJ7IGF0b206ICdBIGhhY2thYmxlIHRleHQgZWRpdG9yIGZvciB0aGUgMjFzdCBDZW50dXJ5JyB9XFxuXCJcblxuICAgIGRlc2NyaWJlIFwid2hlbiBjb3JyZWN0IGZpbGVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5jb3JyZWN0RmlsZScsIHRydWUpXG5cbiAgICAgIGl0IFwibWFudWFsbHkgcnVuXCIsIC0+XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgJ3J1Ym9jb3AtYXV0by1jb3JyZWN0OmN1cnJlbnQtZmlsZSdcblxuICAgICAgICBidWZmZXJDaGFuZ2VkU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKVxuICAgICAgICBidWZmZXIub25EaWRDaGFuZ2UoYnVmZmVyQ2hhbmdlZFNweSlcbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICBidWZmZXJDaGFuZ2VkU3B5LmNhbGxDb3VudCA+IDFcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChidWZmZXIuZ2V0VGV4dCgpKS50b0JlIFwieyBhdG9tOiAnQSBoYWNrYWJsZSB0ZXh0IGVkaXRvciBmb3IgdGhlIDIxc3QgQ2VudHVyeScgfVxcblwiXG5cbiAgICAgIGl0IFwiYXV0byBydW5cIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5hdXRvUnVuJywgdHJ1ZSlcbiAgICAgICAgZWRpdG9yLnNhdmUoKVxuXG4gICAgICAgIGJ1ZmZlckNoYW5nZWRTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpXG4gICAgICAgIGJ1ZmZlci5vbkRpZENoYW5nZShidWZmZXJDaGFuZ2VkU3B5KVxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIGJ1ZmZlckNoYW5nZWRTcHkuY2FsbENvdW50ID4gMVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGJ1ZmZlci5nZXRUZXh0KCkpLnRvQmUgXCJ7IGF0b206ICdBIGhhY2thYmxlIHRleHQgZWRpdG9yIGZvciB0aGUgMjFzdCBDZW50dXJ5JyB9XFxuXCJcblxuICBkZXNjcmliZSBcIndoZW4gY29tbWFuZCB3aXRoIGFyZ3VtZW50c1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGJ1ZmZlci5zZXRUZXh0KFwieyA6YXRvbSA9PiAnQSBoYWNrYWJsZSB0ZXh0IGVkaXRvciBmb3IgdGhlIDIxc3QgQ2VudHVyeScgfVxcblwiKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5ydWJvY29wQ29tbWFuZFBhdGgnLCAncnVib2NvcCAtLW5vLWNvbG9yIC0tZm9ybWF0IHNpbXBsZScpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gY29ycmVjdCBidWZmZXJcIiwgLT5cbiAgICAgIGl0IFwibWFudWFsbHkgcnVuXCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgncnVib2NvcC1hdXRvLWNvcnJlY3QuY29ycmVjdEZpbGUnLCBmYWxzZSlcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCB3b3Jrc3BhY2VFbGVtZW50LCAncnVib2NvcC1hdXRvLWNvcnJlY3Q6Y3VycmVudC1maWxlJ1xuICAgICAgICBidWZmZXJDaGFuZ2VkU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKVxuICAgICAgICBidWZmZXIub25EaWRDaGFuZ2UoYnVmZmVyQ2hhbmdlZFNweSlcbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICBidWZmZXJDaGFuZ2VkU3B5LmNhbGxDb3VudCA+IDBcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChidWZmZXIuZ2V0VGV4dCgpKS50b0JlIFwieyBhdG9tOiAnQSBoYWNrYWJsZSB0ZXh0IGVkaXRvciBmb3IgdGhlIDIxc3QgQ2VudHVyeScgfVxcblwiXG5cbiAgICBkZXNjcmliZSBcIndoZW4gY29ycmVjdCBmaWxlXCIsIC0+XG4gICAgICBpdCBcIm1hbnVhbGx5IHJ1blwiLCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0LmNvcnJlY3RGaWxlJywgdHJ1ZSlcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCB3b3Jrc3BhY2VFbGVtZW50LCAncnVib2NvcC1hdXRvLWNvcnJlY3Q6Y3VycmVudC1maWxlJ1xuICAgICAgICBidWZmZXJDaGFuZ2VkU3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKVxuICAgICAgICBidWZmZXIub25EaWRDaGFuZ2UoYnVmZmVyQ2hhbmdlZFNweSlcbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICBidWZmZXJDaGFuZ2VkU3B5LmNhbGxDb3VudCA+IDFcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChidWZmZXIuZ2V0VGV4dCgpKS50b0JlIFwieyBhdG9tOiAnQSBoYWNrYWJsZSB0ZXh0IGVkaXRvciBmb3IgdGhlIDIxc3QgQ2VudHVyeScgfVxcblwiXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRvZ2dsZSBjb25maWdcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBAcnVib2NvcEF1dG9Db3JyZWN0ID0gbmV3IFJ1Ym9jb3BBdXRvQ29ycmVjdFxuXG4gICAgaXQgXCJjaGFuZ2VzIGF1dG8gcnVuXCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0LmF1dG9SdW4nLCBmYWxzZSlcbiAgICAgIEBydWJvY29wQXV0b0NvcnJlY3QudG9nZ2xlQXV0b1J1bigpXG4gICAgICBleHBlY3QoYXRvbS5jb25maWcuZ2V0KCdydWJvY29wLWF1dG8tY29ycmVjdCcpLmF1dG9SdW4pLnRvQmUgdHJ1ZVxuICAgICAgQHJ1Ym9jb3BBdXRvQ29ycmVjdC50b2dnbGVBdXRvUnVuKClcbiAgICAgIGV4cGVjdChhdG9tLmNvbmZpZy5nZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0JykuYXV0b1J1bikudG9CZSBmYWxzZVxuXG4gICAgaXQgXCJjaGFuZ2VzIG5vdGlmaWNhdGlvblwiLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5ub3RpZmljYXRpb24nLCBmYWxzZSlcbiAgICAgIEBydWJvY29wQXV0b0NvcnJlY3QudG9nZ2xlTm90aWZpY2F0aW9uKClcbiAgICAgIGV4cGVjdChhdG9tLmNvbmZpZy5nZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0Jykubm90aWZpY2F0aW9uKS50b0JlIHRydWVcbiAgICAgIEBydWJvY29wQXV0b0NvcnJlY3QudG9nZ2xlTm90aWZpY2F0aW9uKClcbiAgICAgIGV4cGVjdChhdG9tLmNvbmZpZy5nZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0Jykubm90aWZpY2F0aW9uKS50b0JlIGZhbHNlXG5cbiAgICBpdCBcImNoYW5nZXMgbm90aWZpY2F0aW9uXCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3J1Ym9jb3AtYXV0by1jb3JyZWN0Lm9ubHlGaXhlc05vdGlmaWNhdGlvbicsIGZhbHNlKVxuICAgICAgQHJ1Ym9jb3BBdXRvQ29ycmVjdC50b2dnbGVPbmx5Rml4ZXNOb3RpZmljYXRpb24oKVxuICAgICAgZXhwZWN0KGF0b20uY29uZmlnLmdldCgncnVib2NvcC1hdXRvLWNvcnJlY3QnKS5vbmx5Rml4ZXNOb3RpZmljYXRpb24pLnRvQmUgdHJ1ZVxuICAgICAgQHJ1Ym9jb3BBdXRvQ29ycmVjdC50b2dnbGVPbmx5Rml4ZXNOb3RpZmljYXRpb24oKVxuICAgICAgZXhwZWN0KGF0b20uY29uZmlnLmdldCgncnVib2NvcC1hdXRvLWNvcnJlY3QnKS5vbmx5Rml4ZXNOb3RpZmljYXRpb24pLnRvQmUgZmFsc2VcblxuICAgIGl0IFwiY2hhbmdlcyBjb3JyZWN0IG1ldGhvZFwiLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KCdydWJvY29wLWF1dG8tY29ycmVjdC5jb3JyZWN0RmlsZScsIGZhbHNlKVxuICAgICAgQHJ1Ym9jb3BBdXRvQ29ycmVjdC50b2dnbGVDb3JyZWN0RmlsZSgpXG4gICAgICBleHBlY3QoYXRvbS5jb25maWcuZ2V0KCdydWJvY29wLWF1dG8tY29ycmVjdCcpLmNvcnJlY3RGaWxlKS50b0JlIHRydWVcbiAgICAgIEBydWJvY29wQXV0b0NvcnJlY3QudG9nZ2xlQ29ycmVjdEZpbGUoKVxuICAgICAgZXhwZWN0KGF0b20uY29uZmlnLmdldCgncnVib2NvcC1hdXRvLWNvcnJlY3QnKS5jb3JyZWN0RmlsZSkudG9CZSBmYWxzZVxuXG4gICAgaXQgXCJjaGFuZ2VzIGRlYnVnIG1vZGVcIiwgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCgncnVib2NvcC1hdXRvLWNvcnJlY3QuZGVidWctbW9kZScsIGZhbHNlKVxuICAgICAgQHJ1Ym9jb3BBdXRvQ29ycmVjdC50b2dnbGVEZWJ1Z01vZGUoKVxuICAgICAgZXhwZWN0KGF0b20uY29uZmlnLmdldCgncnVib2NvcC1hdXRvLWNvcnJlY3QnKS5kZWJ1Z01vZGUpLnRvQmUgdHJ1ZVxuICAgICAgQHJ1Ym9jb3BBdXRvQ29ycmVjdC50b2dnbGVEZWJ1Z01vZGUoKVxuICAgICAgZXhwZWN0KGF0b20uY29uZmlnLmdldCgncnVib2NvcC1hdXRvLWNvcnJlY3QnKS5kZWJ1Z01vZGUpLnRvQmUgZmFsc2VcblxuICBkZXNjcmliZSBcIndoZW4gbWFrZVRlbXBGaWxlXCIsIC0+XG4gICAgaXQgXCJydW4gbWFrZVRlbXBGaWxlXCIsIC0+XG4gICAgICBAcnVib2NvcEF1dG9Db3JyZWN0ID0gbmV3IFJ1Ym9jb3BBdXRvQ29ycmVjdFxuICAgICAgdGVtcEZpbGVQYXRoID0gQHJ1Ym9jb3BBdXRvQ29ycmVjdC5tYWtlVGVtcEZpbGUoXCJydWJvY29wLnJiXCIpXG4gICAgICBleHBlY3QoZnMuaXNGaWxlU3luYyh0ZW1wRmlsZVBhdGgpKS50b0JlIHRydWVcbiJdfQ==
