(function() {
  var getView, getVisibleBufferRange, getVisibleBufferRowRange, openFile, setConfig, _, _ref;

  _ = require('underscore-plus');

  _ref = require('./spec-helper'), setConfig = _ref.setConfig, openFile = _ref.openFile, getVisibleBufferRowRange = _ref.getVisibleBufferRowRange, getVisibleBufferRange = _ref.getVisibleBufferRange, getView = _ref.getView;

  describe("paner", function() {
    var addCustomMatchers, dispatchCommand, main, pathSample1, pathSample2, view, workspaceElement, _ref1, _ref2;
    _ref1 = [], main = _ref1[0], view = _ref1[1], workspaceElement = _ref1[2];
    _ref2 = [], pathSample1 = _ref2[0], pathSample2 = _ref2[1];
    dispatchCommand = function(command) {
      return atom.commands.dispatch(workspaceElement, "paner:" + command);
    };
    addCustomMatchers = function(spec) {
      return spec.addMatchers({
        toHaveSampeParent: function(expected) {
          return this.actual.getParent() === expected.getParent();
        },
        toHaveScrollTop: function(expected) {
          return getView(this.actual).getScrollTop() === expected;
        },
        toHaveVisibleBufferRowRange: function(expected) {
          var actualRowRange, notText;
          notText = this.isNot ? " not" : "";
          actualRowRange = getVisibleBufferRowRange(this.actual);
          this.message = function() {
            return "Expected object with visible row range " + (jasmine.pp(actualRowRange)) + " to" + notText + " have visible row range " + (jasmine.pp(expected));
          };
          return _.isEqual(actualRowRange, expected);
        }
      });
    };
    beforeEach(function() {
      var activationPromise;
      addCustomMatchers(this);
      activationPromise = null;
      runs(function() {
        workspaceElement = getView(atom.workspace);
        pathSample1 = atom.project.resolvePath("sample-1.coffee");
        pathSample2 = atom.project.resolvePath("sample-2.coffee");
        jasmine.attachToDOM(workspaceElement);
        activationPromise = atom.packages.activatePackage('paner').then(function(pack) {
          return main = pack.mainModule;
        });
        return dispatchCommand('swap-item');
      });
      return waitsForPromise(function() {
        return activationPromise;
      });
    });
    describe("paner:maximize", function() {
      describe("when maximized", function() {
        return it('set css class to workspace element', function() {
          dispatchCommand('maximize');
          return expect(workspaceElement.classList.contains('paner-maximize')).toBe(true);
        });
      });
      return describe("when maximized again", function() {
        beforeEach(function() {
          dispatchCommand('maximize');
          return expect(workspaceElement.classList.contains('paner-maximize')).toBe(true);
        });
        return it('remove css class from workspace element', function() {
          dispatchCommand('maximize');
          return expect(workspaceElement.classList.contains('paner-maximize')).toBe(false);
        });
      });
    });
    describe("pane item manipulation", function() {
      var e1, e2, paneL, paneR, panes, _ref3;
      _ref3 = [], panes = _ref3[0], paneL = _ref3[1], paneR = _ref3[2], e1 = _ref3[3], e2 = _ref3[4];
      beforeEach(function() {
        openFile(pathSample1, {}, function(e) {
          return e1 = e;
        });
        openFile(pathSample2, {
          split: 'right',
          activatePane: true
        }, function(e) {
          return e2 = e;
        });
        return runs(function() {
          panes = atom.workspace.getPanes();
          expect(panes).toHaveLength(2);
          paneL = panes[0], paneR = panes[1];
          expect(paneL.getActiveItem()).toBe(e1);
          expect(paneR.getActiveItem()).toBe(e2);
          return expect(atom.workspace.getActivePane()).toBe(paneR);
        });
      });
      describe("swap-item", function() {
        return it("swap activeItem to adjacent pane's activeItem", function() {
          dispatchCommand('swap-item');
          expect(paneL.getActiveItem()).toBe(e2);
          expect(paneR.getActiveItem()).toBe(e1);
          return expect(atom.workspace.getActivePane()).toBe(paneR);
        });
      });
      describe("merge-item", function() {
        return it("move active item to adjacent pane and activate adjacent pane", function() {
          dispatchCommand('merge-item');
          expect(paneL.getItems()).toEqual([e1, e2]);
          expect(paneR.getItems()).toEqual([]);
          expect(paneL.getActiveItem()).toBe(e2);
          return expect(atom.workspace.getActivePane()).toBe(paneL);
        });
      });
      return describe("send-item", function() {
        return it("move active item to adjacent pane and don't change active pane", function() {
          dispatchCommand('send-item');
          expect(paneL.getItems()).toEqual([e1, e2]);
          expect(paneR.getItems()).toEqual([]);
          expect(paneL.getActiveItem()).toBe(e2);
          return expect(atom.workspace.getActivePane()).toBe(paneR);
        });
      });
    });
    describe("split", function() {
      var editor, editorElement, newEditor, onDidSplit, pathSample, rowsPerPage, scroll, setRowsPerPage, subs, _ref3;
      _ref3 = [], editor = _ref3[0], editorElement = _ref3[1], pathSample = _ref3[2], subs = _ref3[3], newEditor = _ref3[4];
      scroll = function(e) {
        var el;
        el = getView(e);
        return el.setScrollTop(el.getHeight());
      };
      rowsPerPage = 10;
      setRowsPerPage = function(e, num) {
        return getView(e).setHeight(num * e.getLineHeightInPixels());
      };
      onDidSplit = function(fn) {
        return main.emitter.preempt('did-pane-split', fn);
      };
      beforeEach(function() {
        pathSample = atom.project.resolvePath("sample");
        waitsForPromise(function() {
          return atom.workspace.open(pathSample).then(function(e) {
            editor = e;
            setRowsPerPage(editor, rowsPerPage);
            return editorElement = getView(editor);
          });
        });
        return runs(function() {
          scroll(editor);
          return editor.setCursorBufferPosition([16, 0]);
        });
      });
      describe("split up/down", function() {
        var newPane, oldPane, originalScrollTop, _ref4;
        _ref4 = [], newPane = _ref4[0], oldPane = _ref4[1], originalScrollTop = _ref4[2];
        beforeEach(function() {
          originalScrollTop = editorElement.getScrollTop();
          return onDidSplit(function(args) {
            newPane = args.newPane, oldPane = args.oldPane;
            newEditor = newPane.getActiveEditor();
            return setRowsPerPage(newEditor, rowsPerPage / 2);
          });
        });
        afterEach(function() {
          var newEditorElement;
          expect(newPane).toHaveSampeParent(oldPane);
          expect(newPane.getParent().getOrientation()).toBe('vertical');
          newEditorElement = getView(newEditor);
          return expect(editor).toHaveScrollTop(newEditorElement.getScrollTop());
        });
        describe("split-up", function() {
          return it("split-up with keeping scroll ratio", function() {
            dispatchCommand('split-up');
            setRowsPerPage(editor, rowsPerPage / 2);
            return expect(atom.workspace.getPanes()).toEqual([newPane, oldPane]);
          });
        });
        return describe("split-down", function() {
          return it("split-down with keeping scroll ratio", function() {
            dispatchCommand('split-down');
            setRowsPerPage(editor, rowsPerPage / 2);
            return expect(atom.workspace.getPanes()).toEqual([oldPane, newPane]);
          });
        });
      });
      return describe("split left/right", function() {
        var newPane, oldPane, originalScrollTop, _ref4;
        _ref4 = [], newPane = _ref4[0], oldPane = _ref4[1], originalScrollTop = _ref4[2];
        beforeEach(function() {
          originalScrollTop = editorElement.getScrollTop();
          return onDidSplit(function(args) {
            newPane = args.newPane, oldPane = args.oldPane;
            newEditor = newPane.getActiveEditor();
            return setRowsPerPage(newEditor, rowsPerPage);
          });
        });
        afterEach(function() {
          var newEditorElement;
          expect(newPane).toHaveSampeParent(oldPane);
          expect(newPane.getParent().getOrientation()).toBe('horizontal');
          newEditorElement = getView(newEditor);
          expect(editor).toHaveScrollTop(newEditorElement.getScrollTop());
          return expect(editor).toHaveScrollTop(originalScrollTop);
        });
        describe("split left", function() {
          return it("split-left with keeping scroll ratio", function() {
            dispatchCommand('split-left');
            return expect(atom.workspace.getPanes()).toEqual([newPane, oldPane]);
          });
        });
        return describe("split-right", function() {
          return it("split-right with keeping scroll ratio", function() {
            dispatchCommand('split-right');
            return expect(atom.workspace.getPanes()).toEqual([oldPane, newPane]);
          });
        });
      });
    });
    return describe("moveToVery direction", function() {
      var expectPanePaths, f1, f2, f3, getPaneOrientations, getPanePaths, p1, p2, p3, split, _ref3, _ref4;
      _ref3 = [], p1 = _ref3[0], p2 = _ref3[1], p3 = _ref3[2];
      _ref4 = [], f1 = _ref4[0], f2 = _ref4[1], f3 = _ref4[2];
      split = function(direction) {
        var e;
        e = atom.workspace.getActiveTextEditor();
        return atom.commands.dispatch(getView(e), "pane:split-" + direction);
      };
      getPanePaths = function() {
        return atom.workspace.getPanes().map(function(p) {
          return p.getActiveItem().getPath();
        });
      };
      getPaneOrientations = function() {
        return atom.workspace.getPanes().map(function(p) {
          return p.getParent().getOrientation();
        });
      };
      expectPanePaths = function(_arg) {
        var active, command, orientaions, paths;
        active = _arg.active, command = _arg.command, paths = _arg.paths, orientaions = _arg.orientaions;
        active.activate();
        dispatchCommand(command);
        expect(getPanePaths()).toEqual(paths);
        if (orientaions != null) {
          return expect(getPaneOrientations()).toEqual(orientaions);
        }
      };
      beforeEach(function() {
        f1 = atom.project.resolvePath("file1");
        f2 = atom.project.resolvePath("file2");
        return f3 = atom.project.resolvePath("file3");
      });
      describe("all horizontal", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(f1);
          });
          runs(function() {
            return split('right');
          });
          waitsForPromise(function() {
            return atom.workspace.open(f2);
          });
          runs(function() {
            return split('right');
          });
          waitsForPromise(function() {
            return atom.workspace.open(f3);
          });
          return runs(function() {
            var panes;
            panes = atom.workspace.getPanes();
            expect(panes).toHaveLength(3);
            p1 = panes[0], p2 = panes[1], p3 = panes[2];
            expect(p1.getParent().getOrientation()).toBe('horizontal');
            expect(atom.workspace.getActivePane()).toBe(p3);
            return expect(getPanePaths()).toEqual([f1, f2, f3]);
          });
        });
        describe("very-top", function() {
          var command, orientations;
          command = 'very-top';
          orientations = ['vertical', 'horizontal', 'horizontal'];
          describe("when p1 is active", function() {
            return it("move to very top", function() {
              return expectPanePaths({
                active: p1,
                command: command,
                paths: [f1, f2, f3],
                orientations: orientations
              });
            });
          });
          describe("when p2 is active", function() {
            return it("move to very top", function() {
              return expectPanePaths({
                active: p2,
                command: command,
                paths: [f2, f1, f3],
                orientations: orientations
              });
            });
          });
          return describe("when p3 is active", function() {
            return it("move to very top", function() {
              return expectPanePaths({
                active: p3,
                command: command,
                paths: [f3, f1, f2],
                orientations: orientations
              });
            });
          });
        });
        describe("very-bottom", function() {
          var command, orientations;
          command = 'very-bottom';
          orientations = ['horizontal', 'horizontal', 'vertical'];
          describe("when p1 is active", function() {
            return it("move to very bottom", function() {
              return expectPanePaths({
                active: p1,
                command: command,
                paths: [f2, f3, f1],
                orientations: orientations
              });
            });
          });
          describe("when p2 is active", function() {
            return it("move to very bottom", function() {
              return expectPanePaths({
                active: p2,
                command: command,
                paths: [f1, f3, f2],
                orientations: orientations
              });
            });
          });
          return describe("when p3 is active", function() {
            return it("move to very bottom", function() {
              return expectPanePaths({
                active: p3,
                command: command,
                paths: [f1, f2, f3],
                orientations: orientations
              });
            });
          });
        });
        describe("very-left", function() {
          var command;
          command = 'very-left';
          describe("when p1 is active", function() {
            return it("move to very left", function() {
              return expectPanePaths({
                active: p1,
                command: command,
                paths: [f1, f2, f3]
              });
            });
          });
          describe("when p2 is active", function() {
            return it("move to very left", function() {
              return expectPanePaths({
                active: p2,
                command: command,
                paths: [f2, f1, f3]
              });
            });
          });
          return describe("when p3 is active", function() {
            return it("move to very left", function() {
              return expectPanePaths({
                active: p3,
                command: command,
                paths: [f3, f1, f2]
              });
            });
          });
        });
        return describe("very-right", function() {
          var command;
          command = 'very-right';
          describe("when p1 is active", function() {
            return it("move to very right", function() {
              return expectPanePaths({
                active: p1,
                command: command,
                paths: [f2, f3, f1]
              });
            });
          });
          describe("when p2 is active", function() {
            return it("move to very right", function() {
              return expectPanePaths({
                active: p2,
                command: command,
                paths: [f1, f3, f2]
              });
            });
          });
          return describe("when p3 is active", function() {
            return it("move to very right", function() {
              return expectPanePaths({
                active: p3,
                command: command,
                paths: [f1, f2, f3]
              });
            });
          });
        });
      });
      return describe("all vertical", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(f1);
          });
          runs(function() {
            return split('down');
          });
          waitsForPromise(function() {
            return atom.workspace.open(f2);
          });
          runs(function() {
            return split('down');
          });
          waitsForPromise(function() {
            return atom.workspace.open(f3);
          });
          return runs(function() {
            var panes;
            panes = atom.workspace.getPanes();
            expect(panes).toHaveLength(3);
            p1 = panes[0], p2 = panes[1], p3 = panes[2];
            expect(p1.getParent().getOrientation()).toBe('vertical');
            expect(atom.workspace.getActivePane()).toBe(p3);
            return expect(getPanePaths()).toEqual([f1, f2, f3]);
          });
        });
        describe("very-top", function() {
          var command;
          command = 'very-top';
          describe("when p1 is active", function() {
            return it("move to very top", function() {
              return expectPanePaths({
                active: p1,
                command: command,
                paths: [f1, f2, f3]
              });
            });
          });
          describe("when p2 is active", function() {
            return it("move to very top", function() {
              return expectPanePaths({
                active: p2,
                command: command,
                paths: [f2, f1, f3]
              });
            });
          });
          return describe("when p3 is active", function() {
            return it("move to very top", function() {
              return expectPanePaths({
                active: p3,
                command: command,
                paths: [f3, f1, f2]
              });
            });
          });
        });
        describe("very-bottom", function() {
          var command;
          command = 'very-bottom';
          describe("when p1 is active", function() {
            return it("move to very bottom", function() {
              return expectPanePaths({
                active: p1,
                command: command,
                paths: [f2, f3, f1]
              });
            });
          });
          describe("when p2 is active", function() {
            return it("move to very bottom", function() {
              return expectPanePaths({
                active: p2,
                command: command,
                paths: [f1, f3, f2]
              });
            });
          });
          return describe("when p3 is active", function() {
            return it("move to very bottom", function() {
              return expectPanePaths({
                active: p3,
                command: command,
                paths: [f1, f2, f3]
              });
            });
          });
        });
        describe("very-left", function() {
          var command, orientations;
          command = 'very-left';
          orientations = ['horizontal', 'vertical', 'vertical'];
          describe("when p1 is active", function() {
            return it("move to very left", function() {
              return expectPanePaths({
                active: p1,
                command: command,
                paths: [f1, f2, f3],
                orientations: orientations
              });
            });
          });
          describe("when p2 is active", function() {
            return it("move to very left", function() {
              return expectPanePaths({
                active: p2,
                command: command,
                paths: [f2, f1, f3],
                orientations: orientations
              });
            });
          });
          return describe("when p3 is active", function() {
            return it("move to very left", function() {
              return expectPanePaths({
                active: p3,
                command: command,
                paths: [f3, f1, f2],
                orientations: orientations
              });
            });
          });
        });
        return describe("very-right", function() {
          var command, orientations;
          command = 'very-right';
          orientations = ['horizontal', 'vertical', 'vertical'];
          describe("when p1 is active", function() {
            return it("move to very right", function() {
              return expectPanePaths({
                active: p1,
                command: command,
                paths: [f2, f3, f1],
                orientations: orientations
              });
            });
          });
          describe("when p2 is active", function() {
            return it("move to very right", function() {
              return expectPanePaths({
                active: p2,
                command: command,
                paths: [f1, f3, f2],
                orientations: orientations
              });
            });
          });
          return describe("when p3 is active", function() {
            return it("move to very right", function() {
              return expectPanePaths({
                active: p3,
                command: command,
                paths: [f1, f2, f3],
                orientations: orientations
              });
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3BhbmVyL3NwZWMvcGFuZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUVBLE9BSUksT0FBQSxDQUFRLGVBQVIsQ0FKSixFQUNFLGlCQUFBLFNBREYsRUFDYSxnQkFBQSxRQURiLEVBRUUsZ0NBQUEsd0JBRkYsRUFFNEIsNkJBQUEscUJBRjVCLEVBR0UsZUFBQSxPQUxGLENBQUE7O0FBQUEsRUFTQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsUUFBQSx3R0FBQTtBQUFBLElBQUEsUUFBaUMsRUFBakMsRUFBQyxlQUFELEVBQU8sZUFBUCxFQUFhLDJCQUFiLENBQUE7QUFBQSxJQUNBLFFBQTZCLEVBQTdCLEVBQUMsc0JBQUQsRUFBYyxzQkFEZCxDQUFBO0FBQUEsSUFHQSxlQUFBLEdBQWtCLFNBQUMsT0FBRCxHQUFBO2FBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBMEMsUUFBQSxHQUFRLE9BQWxELEVBRGdCO0lBQUEsQ0FIbEIsQ0FBQTtBQUFBLElBTUEsaUJBQUEsR0FBb0IsU0FBQyxJQUFELEdBQUE7YUFDbEIsSUFBSSxDQUFDLFdBQUwsQ0FDRTtBQUFBLFFBQUEsaUJBQUEsRUFBbUIsU0FBQyxRQUFELEdBQUE7aUJBQ2pCLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQUEsS0FBdUIsUUFBUSxDQUFDLFNBQVQsQ0FBQSxFQUROO1FBQUEsQ0FBbkI7QUFBQSxRQUdBLGVBQUEsRUFBaUIsU0FBQyxRQUFELEdBQUE7aUJBQ2YsT0FBQSxDQUFRLElBQUMsQ0FB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

//# sourceURL=/Users/victor.martins/.atom/packages/paner/spec/paner-spec.coffee
