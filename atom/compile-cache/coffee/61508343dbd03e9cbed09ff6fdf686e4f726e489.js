(function() {
  var Range, _, addCustomMatchers, getView, getVisibleBufferRowRange, openFile, splitPane;

  _ = require('underscore-plus');

  Range = require('atom').Range;

  getView = function(model) {
    return atom.views.getView(model);
  };

  openFile = function(filePath, options, fn) {
    if (options == null) {
      options = {};
    }
    if (fn == null) {
      fn = null;
    }
    return waitsForPromise(function() {
      return atom.workspace.open(filePath, options).then(function(e) {
        return typeof fn === "function" ? fn(e) : void 0;
      });
    });
  };

  getVisibleBufferRowRange = function(e) {
    return getView(e).getVisibleRowRange().map(function(row) {
      return e.bufferRowForScreenRow(row);
    });
  };

  splitPane = function(direction) {
    var e;
    e = atom.workspace.getActiveTextEditor();
    return atom.commands.dispatch(getView(e), "pane:split-" + direction);
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

  describe("paner", function() {
    var dispatchCommand, main, pathSample1, pathSample2, ref, ref1, view, workspaceElement;
    ref = [], main = ref[0], view = ref[1], workspaceElement = ref[2];
    ref1 = [], pathSample1 = ref1[0], pathSample2 = ref1[1];
    dispatchCommand = function(command) {
      return atom.commands.dispatch(workspaceElement, command);
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
        return dispatchCommand('paner:swap-item');
      });
      return waitsForPromise(function() {
        return activationPromise;
      });
    });
    describe("paner:maximize", function() {
      describe("when maximized", function() {
        return it('set css class to workspace element', function() {
          dispatchCommand('paner:maximize');
          return expect(workspaceElement.classList.contains('paner-maximize')).toBe(true);
        });
      });
      return describe("when maximized again", function() {
        beforeEach(function() {
          dispatchCommand('paner:maximize');
          return expect(workspaceElement.classList.contains('paner-maximize')).toBe(true);
        });
        return it('remove css class from workspace element', function() {
          dispatchCommand('paner:maximize');
          return expect(workspaceElement.classList.contains('paner-maximize')).toBe(false);
        });
      });
    });
    describe("pane item manipulation", function() {
      var e1, e2, paneL, paneR, panes, ref2;
      ref2 = [], panes = ref2[0], paneL = ref2[1], paneR = ref2[2], e1 = ref2[3], e2 = ref2[4];
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
          dispatchCommand('paner:swap-item');
          expect(paneL.getActiveItem()).toBe(e2);
          expect(paneR.getActiveItem()).toBe(e1);
          return expect(atom.workspace.getActivePane()).toBe(paneR);
        });
      });
      describe("merge-item", function() {
        return it("move active item to adjacent pane and activate adjacent pane", function() {
          dispatchCommand('paner:merge-item');
          expect(paneL.getItems()).toEqual([e1, e2]);
          expect(paneR.getItems()).toEqual([]);
          expect(paneL.getActiveItem()).toBe(e2);
          return expect(atom.workspace.getActivePane()).toBe(paneL);
        });
      });
      return describe("send-item", function() {
        return it("move active item to adjacent pane and don't change active pane", function() {
          dispatchCommand('paner:send-item');
          expect(paneL.getItems()).toEqual([e1, e2]);
          expect(paneR.getItems()).toEqual([]);
          expect(paneL.getActiveItem()).toBe(e2);
          return expect(atom.workspace.getActivePane()).toBe(paneR);
        });
      });
    });
    describe("split", function() {
      var editor, editorElement, newEditor, onDidSplit, pathSample, ref2, rowsPerPage, scroll, setRowsPerPage, subs;
      ref2 = [], editor = ref2[0], editorElement = ref2[1], pathSample = ref2[2], subs = ref2[3], newEditor = ref2[4];
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
        var newPane, oldPane, originalScrollTop, ref3;
        ref3 = [], newPane = ref3[0], oldPane = ref3[1], originalScrollTop = ref3[2];
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
            dispatchCommand('paner:split-up');
            setRowsPerPage(editor, rowsPerPage / 2);
            return expect(atom.workspace.getPanes()).toEqual([newPane, oldPane]);
          });
        });
        return describe("split-down", function() {
          return it("split-down with keeping scroll ratio", function() {
            dispatchCommand('paner:split-down');
            setRowsPerPage(editor, rowsPerPage / 2);
            return expect(atom.workspace.getPanes()).toEqual([oldPane, newPane]);
          });
        });
      });
      return describe("split left/right", function() {
        var newPane, oldPane, originalScrollTop, ref3;
        ref3 = [], newPane = ref3[0], oldPane = ref3[1], originalScrollTop = ref3[2];
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
            dispatchCommand('paner:split-left');
            return expect(atom.workspace.getPanes()).toEqual([newPane, oldPane]);
          });
        });
        return describe("split-right", function() {
          return it("split-right with keeping scroll ratio", function() {
            dispatchCommand('paner:split-right');
            return expect(atom.workspace.getPanes()).toEqual([oldPane, newPane]);
          });
        });
      });
    });
    return describe("moveToVery direction", function() {
      var e1, e2, e3, e4, ensurePaneLayout, f1, f2, f3, f4, moveToVery, p1, p2, p3, paneLayoutFor, ref2, ref3, ref4;
      ref2 = [], p1 = ref2[0], p2 = ref2[1], p3 = ref2[2];
      ref3 = [], f1 = ref3[0], f2 = ref3[1], f3 = ref3[2], f4 = ref3[3];
      ref4 = [], e1 = ref4[0], e2 = ref4[1], e3 = ref4[2], e4 = ref4[3];
      moveToVery = function(arg) {
        var command, initialPane;
        initialPane = arg.initialPane, command = arg.command;
        initialPane.activate();
        return dispatchCommand(command);
      };
      ensurePaneLayout = function(layout) {
        var pane, root;
        pane = atom.workspace.getActivePane();
        root = pane.getContainer().getRoot();
        return expect(paneLayoutFor(root)).toEqual(layout);
      };
      paneLayoutFor = function(root) {
        var layout;
        layout = {};
        layout[root.getOrientation()] = root.getChildren().map(function(child) {
          switch (child.constructor.name) {
            case 'Pane':
              return child.getItems();
            case 'PaneAxis':
              return paneLayoutFor(child);
          }
        });
        return layout;
      };
      beforeEach(function() {
        f1 = atom.project.resolvePath("file1");
        f2 = atom.project.resolvePath("file2");
        f3 = atom.project.resolvePath("file3");
        return f4 = atom.project.resolvePath("file4");
      });
      describe("all horizontal", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(f1).then(function(e) {
              return e1 = e;
            });
          });
          runs(function() {
            return splitPane('right');
          });
          waitsForPromise(function() {
            return atom.workspace.open(f2).then(function(e) {
              return e2 = e;
            });
          });
          runs(function() {
            return splitPane('right');
          });
          waitsForPromise(function() {
            return atom.workspace.open(f3).then(function(e) {
              return e3 = e;
            });
          });
          return runs(function() {
            var panes;
            panes = atom.workspace.getPanes();
            expect(panes).toHaveLength(3);
            p1 = panes[0], p2 = panes[1], p3 = panes[2];
            ensurePaneLayout({
              horizontal: [[e1], [e2], [e3]]
            });
            return expect(atom.workspace.getActivePane()).toBe(p3);
          });
        });
        describe("very-top", function() {
          it("case 1", function() {
            moveToVery({
              initialPane: p1,
              command: 'paner:very-top'
            });
            return ensurePaneLayout({
              vertical: [
                [e1], {
                  horizontal: [[e2], [e3]]
                }
              ]
            });
          });
          it("case 2", function() {
            moveToVery({
              initialPane: p2,
              command: 'paner:very-top'
            });
            return ensurePaneLayout({
              vertical: [
                [e2], {
                  horizontal: [[e1], [e3]]
                }
              ]
            });
          });
          return it("case 3", function() {
            moveToVery({
              initialPane: p3,
              command: 'paner:very-top'
            });
            return ensurePaneLayout({
              vertical: [
                [e3], {
                  horizontal: [[e1], [e2]]
                }
              ]
            });
          });
        });
        describe("very-bottom", function() {
          it("case 1", function() {
            moveToVery({
              initialPane: p1,
              command: 'paner:very-bottom'
            });
            return ensurePaneLayout({
              vertical: [
                {
                  horizontal: [[e2], [e3]]
                }, [e1]
              ]
            });
          });
          it("case 2", function() {
            moveToVery({
              initialPane: p2,
              command: 'paner:very-bottom'
            });
            return ensurePaneLayout({
              vertical: [
                {
                  horizontal: [[e1], [e3]]
                }, [e2]
              ]
            });
          });
          return it("case 3", function() {
            moveToVery({
              initialPane: p3,
              command: 'paner:very-bottom'
            });
            return ensurePaneLayout({
              vertical: [
                {
                  horizontal: [[e1], [e2]]
                }, [e3]
              ]
            });
          });
        });
        describe("very-left", function() {
          it("case 1", function() {
            moveToVery({
              initialPane: p1,
              command: 'paner:very-left'
            });
            return ensurePaneLayout({
              horizontal: [[e1], [e2], [e3]]
            });
          });
          it("case 2", function() {
            moveToVery({
              initialPane: p2,
              command: 'paner:very-left'
            });
            return ensurePaneLayout({
              horizontal: [[e2], [e1], [e3]]
            });
          });
          return it("case 3", function() {
            moveToVery({
              initialPane: p3,
              command: 'paner:very-left'
            });
            return ensurePaneLayout({
              horizontal: [[e3], [e1], [e2]]
            });
          });
        });
        describe("very-right", function() {
          it("case 1", function() {
            moveToVery({
              initialPane: p1,
              command: 'paner:very-right'
            });
            return ensurePaneLayout({
              horizontal: [[e2], [e3], [e1]]
            });
          });
          it("case 2", function() {
            moveToVery({
              initialPane: p2,
              command: 'paner:very-right'
            });
            return ensurePaneLayout({
              horizontal: [[e1], [e3], [e2]]
            });
          });
          return it("case 3", function() {
            moveToVery({
              initialPane: p3,
              command: 'paner:very-right'
            });
            return ensurePaneLayout({
              horizontal: [[e1], [e2], [e3]]
            });
          });
        });
        return describe("complex operation", function() {
          return it("case 1", function() {
            p1.activate();
            dispatchCommand('paner:very-top');
            ensurePaneLayout({
              vertical: [
                [e1], {
                  horizontal: [[e2], [e3]]
                }
              ]
            });
            dispatchCommand('paner:very-left');
            ensurePaneLayout({
              horizontal: [[e1], [e2], [e3]]
            });
            dispatchCommand('paner:very-bottom');
            ensurePaneLayout({
              vertical: [
                {
                  horizontal: [[e2], [e3]]
                }, [e1]
              ]
            });
            dispatchCommand('paner:very-right');
            return ensurePaneLayout({
              horizontal: [[e2], [e3], [e1]]
            });
          });
        });
      });
      describe("all vertical", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(f1).then(function(e) {
              return e1 = e;
            });
          });
          runs(function() {
            return splitPane('down');
          });
          waitsForPromise(function() {
            return atom.workspace.open(f2).then(function(e) {
              return e2 = e;
            });
          });
          runs(function() {
            return splitPane('down');
          });
          waitsForPromise(function() {
            return atom.workspace.open(f3).then(function(e) {
              return e3 = e;
            });
          });
          return runs(function() {
            var panes;
            panes = atom.workspace.getPanes();
            expect(panes).toHaveLength(3);
            p1 = panes[0], p2 = panes[1], p3 = panes[2];
            ensurePaneLayout({
              vertical: [[e1], [e2], [e3]]
            });
            return expect(atom.workspace.getActivePane()).toBe(p3);
          });
        });
        describe("very-top", function() {
          it("case 1", function() {
            moveToVery({
              initialPane: p1,
              command: 'paner:very-top'
            });
            return ensurePaneLayout({
              vertical: [[e1], [e2], [e3]]
            });
          });
          it("case 2", function() {
            moveToVery({
              initialPane: p2,
              command: 'paner:very-top'
            });
            return ensurePaneLayout({
              vertical: [[e2], [e1], [e3]]
            });
          });
          return it("case 3", function() {
            moveToVery({
              initialPane: p3,
              command: 'paner:very-top'
            });
            return ensurePaneLayout({
              vertical: [[e3], [e1], [e2]]
            });
          });
        });
        describe("very-bottom", function() {
          it("case 1", function() {
            moveToVery({
              initialPane: p1,
              command: 'paner:very-bottom'
            });
            return ensurePaneLayout({
              vertical: [[e2], [e3], [e1]]
            });
          });
          it("case 2", function() {
            moveToVery({
              initialPane: p2,
              command: 'paner:very-bottom'
            });
            return ensurePaneLayout({
              vertical: [[e1], [e3], [e2]]
            });
          });
          return it("case 3", function() {
            moveToVery({
              initialPane: p3,
              command: 'paner:very-bottom'
            });
            return ensurePaneLayout({
              vertical: [[e1], [e2], [e3]]
            });
          });
        });
        describe("very-left", function() {
          it("case 1", function() {
            moveToVery({
              initialPane: p1,
              command: 'paner:very-left'
            });
            return ensurePaneLayout({
              horizontal: [
                [e1], {
                  vertical: [[e2], [e3]]
                }
              ]
            });
          });
          it("case 2", function() {
            moveToVery({
              initialPane: p2,
              command: 'paner:very-left'
            });
            return ensurePaneLayout({
              horizontal: [
                [e2], {
                  vertical: [[e1], [e3]]
                }
              ]
            });
          });
          return it("case 3", function() {
            moveToVery({
              initialPane: p3,
              command: 'paner:very-left'
            });
            return ensurePaneLayout({
              horizontal: [
                [e3], {
                  vertical: [[e1], [e2]]
                }
              ]
            });
          });
        });
        describe("very-right", function() {
          it("case 1", function() {
            moveToVery({
              initialPane: p1,
              command: 'paner:very-right'
            });
            return ensurePaneLayout({
              horizontal: [
                {
                  vertical: [[e2], [e3]]
                }, [e1]
              ]
            });
          });
          it("case 2", function() {
            moveToVery({
              initialPane: p2,
              command: 'paner:very-right'
            });
            return ensurePaneLayout({
              horizontal: [
                {
                  vertical: [[e1], [e3]]
                }, [e2]
              ]
            });
          });
          return it("case 3", function() {
            moveToVery({
              initialPane: p3,
              command: 'paner:very-right'
            });
            return ensurePaneLayout({
              horizontal: [
                {
                  vertical: [[e1], [e2]]
                }, [e3]
              ]
            });
          });
        });
        return describe("complex operation", function() {
          return it("case 1", function() {
            p1.activate();
            dispatchCommand('paner:very-top');
            ensurePaneLayout({
              vertical: [[e1], [e2], [e3]]
            });
            dispatchCommand('paner:very-left');
            ensurePaneLayout({
              horizontal: [
                [e1], {
                  vertical: [[e2], [e3]]
                }
              ]
            });
            dispatchCommand('paner:very-bottom');
            ensurePaneLayout({
              vertical: [[e2], [e3], [e1]]
            });
            dispatchCommand('paner:very-right');
            return ensurePaneLayout({
              horizontal: [
                {
                  vertical: [[e2], [e3]]
                }, [e1]
              ]
            });
          });
        });
      });
      return describe("swapPane", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(f1).then(function(e) {
              return e1 = e;
            });
          });
          runs(function() {
            return splitPane('right');
          });
          waitsForPromise(function() {
            return atom.workspace.open(f2).then(function(e) {
              return e2 = e;
            });
          });
          waitsForPromise(function() {
            return atom.workspace.open(f3).then(function(e) {
              return e3 = e;
            });
          });
          runs(function() {
            return splitPane('down');
          });
          waitsForPromise(function() {
            return atom.workspace.open(f4).then(function(e) {
              return e4 = e;
            });
          });
          return runs(function() {
            var panes;
            panes = atom.workspace.getPanes();
            expect(panes).toHaveLength(3);
            p1 = panes[0], p2 = panes[1], p3 = panes[2];
            ensurePaneLayout({
              horizontal: [
                [e1], {
                  vertical: [[e2, e3], [e4]]
                }
              ]
            });
            expect(atom.workspace.getActivePane()).toBe(p3);
            return expect(atom.workspace.getActiveTextEditor()).toBe(e4);
          });
        });
        return it("case 1", function() {
          dispatchCommand('paner:swap-pane');
          ensurePaneLayout({
            horizontal: [
              [e1], {
                vertical: [[e4], [e2, e3]]
              }
            ]
          });
          expect(atom.workspace.getActiveTextEditor()).toBe(e4);
          dispatchCommand('paner:swap-pane');
          ensurePaneLayout({
            horizontal: [
              [e1], {
                vertical: [[e2, e3], [e4]]
              }
            ]
          });
          expect(atom.workspace.getActiveTextEditor()).toBe(e4);
          p1.activate();
          dispatchCommand('paner:swap-pane');
          ensurePaneLayout({
            horizontal: [
              {
                vertical: [[e2, e3], [e4]]
              }, [e1]
            ]
          });
          expect(atom.workspace.getActiveTextEditor()).toBe(e1);
          dispatchCommand('paner:swap-pane');
          ensurePaneLayout({
            horizontal: [
              [e1], {
                vertical: [[e2, e3], [e4]]
              }
            ]
          });
          return expect(atom.workspace.getActiveTextEditor()).toBe(e1);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3BhbmVyL3NwZWMvcGFuZXItc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0gsUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFFVixPQUFBLEdBQVUsU0FBQyxLQUFEO1dBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLEtBQW5CO0VBQVg7O0VBRVYsUUFBQSxHQUFXLFNBQUMsUUFBRCxFQUFXLE9BQVgsRUFBdUIsRUFBdkI7O01BQVcsVUFBUTs7O01BQUksS0FBRzs7V0FDbkMsZUFBQSxDQUFnQixTQUFBO2FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLEVBQThCLE9BQTlCLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsU0FBQyxDQUFEOzBDQUMxQyxHQUFJO01BRHNDLENBQTVDO0lBRGMsQ0FBaEI7RUFEUzs7RUFLWCx3QkFBQSxHQUEyQixTQUFDLENBQUQ7V0FDekIsT0FBQSxDQUFRLENBQVIsQ0FBVSxDQUFDLGtCQUFYLENBQUEsQ0FBK0IsQ0FBQyxHQUFoQyxDQUFvQyxTQUFDLEdBQUQ7YUFDbEMsQ0FBQyxDQUFDLHFCQUFGLENBQXdCLEdBQXhCO0lBRGtDLENBQXBDO0VBRHlCOztFQUkzQixTQUFBLEdBQVksU0FBQyxTQUFEO0FBQ1YsUUFBQTtJQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7V0FDSixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsT0FBQSxDQUFRLENBQVIsQ0FBdkIsRUFBbUMsYUFBQSxHQUFjLFNBQWpEO0VBRlU7O0VBSVosaUJBQUEsR0FBb0IsU0FBQyxJQUFEO1dBQ2xCLElBQUksQ0FBQyxXQUFMLENBQ0U7TUFBQSxpQkFBQSxFQUFt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QWtELEVBQWxEO1FBaENXLENBQWI7TUFyQm1CLENBQXJCO0lBMUsrQixDQUFqQztFQTFKZ0IsQ0FBbEI7QUFqQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xue1JhbmdlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbmdldFZpZXcgPSAobW9kZWwpIC0+IGF0b20udmlld3MuZ2V0Vmlldyhtb2RlbClcblxub3BlbkZpbGUgPSAoZmlsZVBhdGgsIG9wdGlvbnM9e30sIGZuPW51bGwpIC0+XG4gIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgsIG9wdGlvbnMpLnRoZW4gKGUpIC0+XG4gICAgICBmbj8oZSlcblxuZ2V0VmlzaWJsZUJ1ZmZlclJvd1JhbmdlID0gKGUpIC0+XG4gIGdldFZpZXcoZSkuZ2V0VmlzaWJsZVJvd1JhbmdlKCkubWFwIChyb3cpIC0+XG4gICAgZS5idWZmZXJSb3dGb3JTY3JlZW5Sb3cgcm93XG5cbnNwbGl0UGFuZSA9IChkaXJlY3Rpb24pIC0+XG4gIGUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChnZXRWaWV3KGUpLCBcInBhbmU6c3BsaXQtI3tkaXJlY3Rpb259XCIpXG5cbmFkZEN1c3RvbU1hdGNoZXJzID0gKHNwZWMpIC0+XG4gIHNwZWMuYWRkTWF0Y2hlcnNcbiAgICB0b0hhdmVTYW1wZVBhcmVudDogKGV4cGVjdGVkKSAtPlxuICAgICAgQGFjdHVhbC5nZXRQYXJlbnQoKSBpcyBleHBlY3RlZC5nZXRQYXJlbnQoKVxuXG4gICAgdG9IYXZlU2Nyb2xsVG9wOiAoZXhwZWN0ZWQpIC0+XG4gICAgICBnZXRWaWV3KEBhY3R1YWwpLmdldFNjcm9sbFRvcCgpIGlzIGV4cGVjdGVkXG5cbiAgICB0b0hhdmVWaXNpYmxlQnVmZmVyUm93UmFuZ2U6IChleHBlY3RlZCkgLT5cbiAgICAgIG5vdFRleHQgPSBpZiBAaXNOb3QgdGhlbiBcIiBub3RcIiBlbHNlIFwiXCJcbiAgICAgIGFjdHVhbFJvd1JhbmdlID0gZ2V0VmlzaWJsZUJ1ZmZlclJvd1JhbmdlKEBhY3R1YWwpXG4gICAgICB0aGlzLm1lc3NhZ2UgPSAtPlxuICAgICAgICBcIkV4cGVjdGVkIG9iamVjdCB3aXRoIHZpc2libGUgcm93IHJhbmdlICN7amFzbWluZS5wcChhY3R1YWxSb3dSYW5nZSl9IHRvI3tub3RUZXh0fSBoYXZlIHZpc2libGUgcm93IHJhbmdlICN7amFzbWluZS5wcChleHBlY3RlZCl9XCJcbiAgICAgIF8uaXNFcXVhbChhY3R1YWxSb3dSYW5nZSwgZXhwZWN0ZWQpXG5cbmRlc2NyaWJlIFwicGFuZXJcIiwgLT5cbiAgW21haW4sIHZpZXcsIHdvcmtzcGFjZUVsZW1lbnRdID0gW11cbiAgW3BhdGhTYW1wbGUxLCBwYXRoU2FtcGxlMl0gPSBbXVxuXG4gIGRpc3BhdGNoQ29tbWFuZCA9IChjb21tYW5kKSAtPlxuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgY29tbWFuZClcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgYWRkQ3VzdG9tTWF0Y2hlcnModGhpcylcblxuICAgIGFjdGl2YXRpb25Qcm9taXNlID0gbnVsbFxuICAgIHJ1bnMgLT5cbiAgICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBnZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgICAgcGF0aFNhbXBsZTEgPSBhdG9tLnByb2plY3QucmVzb2x2ZVBhdGgoXCJzYW1wbGUtMS5jb2ZmZWVcIilcbiAgICAgIHBhdGhTYW1wbGUyID0gYXRvbS5wcm9qZWN0LnJlc29sdmVQYXRoKFwic2FtcGxlLTIuY29mZmVlXCIpXG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpXG4gICAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdwYW5lcicpLnRoZW4gKHBhY2spIC0+XG4gICAgICAgIG1haW4gPSBwYWNrLm1haW5Nb2R1bGVcbiAgICAgIGRpc3BhdGNoQ29tbWFuZCgncGFuZXI6c3dhcC1pdGVtJylcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYWN0aXZhdGlvblByb21pc2VcblxuICBkZXNjcmliZSBcInBhbmVyOm1heGltaXplXCIsIC0+XG4gICAgZGVzY3JpYmUgXCJ3aGVuIG1heGltaXplZFwiLCAtPlxuICAgICAgaXQgJ3NldCBjc3MgY2xhc3MgdG8gd29ya3NwYWNlIGVsZW1lbnQnLCAtPlxuICAgICAgICBkaXNwYXRjaENvbW1hbmQoJ3BhbmVyOm1heGltaXplJylcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYW5lci1tYXhpbWl6ZScpKS50b0JlKHRydWUpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gbWF4aW1pemVkIGFnYWluXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGRpc3BhdGNoQ29tbWFuZCgncGFuZXI6bWF4aW1pemUnKVxuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BhbmVyLW1heGltaXplJykpLnRvQmUodHJ1ZSlcblxuICAgICAgaXQgJ3JlbW92ZSBjc3MgY2xhc3MgZnJvbSB3b3Jrc3BhY2UgZWxlbWVudCcsIC0+XG4gICAgICAgIGRpc3BhdGNoQ29tbWFuZCgncGFuZXI6bWF4aW1pemUnKVxuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BhbmVyLW1heGltaXplJykpLnRvQmUoZmFsc2UpXG5cbiAgZGVzY3JpYmUgXCJwYW5lIGl0ZW0gbWFuaXB1bGF0aW9uXCIsIC0+XG4gICAgW3BhbmVzLCBwYW5lTCwgcGFuZVIsIGUxLCBlMl0gPSBbXVxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIG9wZW5GaWxlIHBhdGhTYW1wbGUxLCB7fSwgKGUpIC0+IGUxID0gZVxuICAgICAgb3BlbkZpbGUgcGF0aFNhbXBsZTIsIHtzcGxpdDogJ3JpZ2h0JywgYWN0aXZhdGVQYW5lOiB0cnVlfSwgKGUpIC0+IGUyID0gZVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIHBhbmVzID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVxuICAgICAgICBleHBlY3QocGFuZXMpLnRvSGF2ZUxlbmd0aCAyXG4gICAgICAgIFtwYW5lTCwgcGFuZVJdID0gcGFuZXNcbiAgICAgICAgZXhwZWN0KHBhbmVMLmdldEFjdGl2ZUl0ZW0oKSkudG9CZShlMSlcbiAgICAgICAgZXhwZWN0KHBhbmVSLmdldEFjdGl2ZUl0ZW0oKSkudG9CZShlMilcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZShwYW5lUilcblxuICAgIGRlc2NyaWJlIFwic3dhcC1pdGVtXCIsIC0+XG4gICAgICBpdCBcInN3YXAgYWN0aXZlSXRlbSB0byBhZGphY2VudCBwYW5lJ3MgYWN0aXZlSXRlbVwiLCAtPlxuICAgICAgICBkaXNwYXRjaENvbW1hbmQoJ3BhbmVyOnN3YXAtaXRlbScpXG4gICAgICAgIGV4cGVjdChwYW5lTC5nZXRBY3RpdmVJdGVtKCkpLnRvQmUoZTIpXG4gICAgICAgIGV4cGVjdChwYW5lUi5nZXRBY3RpdmVJdGVtKCkpLnRvQmUoZTEpXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkpLnRvQmUocGFuZVIpXG5cbiAgICBkZXNjcmliZSBcIm1lcmdlLWl0ZW1cIiwgLT5cbiAgICAgIGl0IFwibW92ZSBhY3RpdmUgaXRlbSB0byBhZGphY2VudCBwYW5lIGFuZCBhY3RpdmF0ZSBhZGphY2VudCBwYW5lXCIsIC0+XG4gICAgICAgIGRpc3BhdGNoQ29tbWFuZCgncGFuZXI6bWVyZ2UtaXRlbScpXG4gICAgICAgIGV4cGVjdChwYW5lTC5nZXRJdGVtcygpKS50b0VxdWFsKFtlMSwgZTJdKVxuICAgICAgICBleHBlY3QocGFuZVIuZ2V0SXRlbXMoKSkudG9FcXVhbChbXSlcbiAgICAgICAgZXhwZWN0KHBhbmVMLmdldEFjdGl2ZUl0ZW0oKSkudG9CZShlMilcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZShwYW5lTClcbiAgICBkZXNjcmliZSBcInNlbmQtaXRlbVwiLCAtPlxuICAgICAgaXQgXCJtb3ZlIGFjdGl2ZSBpdGVtIHRvIGFkamFjZW50IHBhbmUgYW5kIGRvbid0IGNoYW5nZSBhY3RpdmUgcGFuZVwiLCAtPlxuICAgICAgICBkaXNwYXRjaENvbW1hbmQoJ3BhbmVyOnNlbmQtaXRlbScpXG4gICAgICAgIGV4cGVjdChwYW5lTC5nZXRJdGVtcygpKS50b0VxdWFsKFtlMSwgZTJdKVxuICAgICAgICBleHBlY3QocGFuZVIuZ2V0SXRlbXMoKSkudG9FcXVhbChbXSlcbiAgICAgICAgZXhwZWN0KHBhbmVMLmdldEFjdGl2ZUl0ZW0oKSkudG9CZShlMilcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZShwYW5lUilcblxuICBkZXNjcmliZSBcInNwbGl0XCIsIC0+XG4gICAgW2VkaXRvciwgZWRpdG9yRWxlbWVudCwgcGF0aFNhbXBsZSwgc3VicywgbmV3RWRpdG9yXSA9IFtdXG5cbiAgICBzY3JvbGwgPSAoZSkgLT5cbiAgICAgIGVsID0gZ2V0VmlldyhlKVxuICAgICAgZWwuc2V0U2Nyb2xsVG9wKGVsLmdldEhlaWdodCgpKVxuXG4gICAgcm93c1BlclBhZ2UgPSAxMFxuXG4gICAgc2V0Um93c1BlclBhZ2UgPSAoZSwgbnVtKSAtPlxuICAgICAgZ2V0VmlldyhlKS5zZXRIZWlnaHQobnVtICogZS5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKSlcblxuICAgIG9uRGlkU3BsaXQgPSAoZm4pIC0+XG4gICAgICBtYWluLmVtaXR0ZXIucHJlZW1wdCAnZGlkLXBhbmUtc3BsaXQnLCBmblxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcGF0aFNhbXBsZSA9IGF0b20ucHJvamVjdC5yZXNvbHZlUGF0aChcInNhbXBsZVwiKVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aFNhbXBsZSkudGhlbiAoZSkgLT5cbiAgICAgICAgICBlZGl0b3IgPSBlXG4gICAgICAgICAgc2V0Um93c1BlclBhZ2UoZWRpdG9yLCByb3dzUGVyUGFnZSlcbiAgICAgICAgICBlZGl0b3JFbGVtZW50ID0gZ2V0VmlldyhlZGl0b3IpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgc2Nyb2xsKGVkaXRvcilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFsxNiwgMF1cblxuICAgIGRlc2NyaWJlIFwic3BsaXQgdXAvZG93blwiLCAtPlxuICAgICAgW25ld1BhbmUsIG9sZFBhbmUsIG9yaWdpbmFsU2Nyb2xsVG9wXSA9IFtdXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIG9yaWdpbmFsU2Nyb2xsVG9wID0gZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxUb3AoKVxuICAgICAgICBvbkRpZFNwbGl0IChhcmdzKSAtPlxuICAgICAgICAgIHtuZXdQYW5lLCBvbGRQYW5lfSA9IGFyZ3NcbiAgICAgICAgICBuZXdFZGl0b3IgPSBuZXdQYW5lLmdldEFjdGl2ZUVkaXRvcigpXG4gICAgICAgICAgc2V0Um93c1BlclBhZ2UobmV3RWRpdG9yLCByb3dzUGVyUGFnZS8yKVxuXG4gICAgICBhZnRlckVhY2ggLT5cbiAgICAgICAgZXhwZWN0KG5ld1BhbmUpLnRvSGF2ZVNhbXBlUGFyZW50KG9sZFBhbmUpXG4gICAgICAgIGV4cGVjdChuZXdQYW5lLmdldFBhcmVudCgpLmdldE9yaWVudGF0aW9uKCkpLnRvQmUgJ3ZlcnRpY2FsJ1xuICAgICAgICBuZXdFZGl0b3JFbGVtZW50ID0gZ2V0VmlldyhuZXdFZGl0b3IpXG4gICAgICAgIGV4cGVjdChlZGl0b3IpLnRvSGF2ZVNjcm9sbFRvcCBuZXdFZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpXG5cbiAgICAgIGRlc2NyaWJlIFwic3BsaXQtdXBcIiwgLT5cbiAgICAgICAgaXQgXCJzcGxpdC11cCB3aXRoIGtlZXBpbmcgc2Nyb2xsIHJhdGlvXCIsIC0+XG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKCdwYW5lcjpzcGxpdC11cCcpXG4gICAgICAgICAgc2V0Um93c1BlclBhZ2UoZWRpdG9yLCByb3dzUGVyUGFnZS8yKVxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpKS50b0VxdWFsIFtuZXdQYW5lLCBvbGRQYW5lXVxuXG4gICAgICBkZXNjcmliZSBcInNwbGl0LWRvd25cIiwgLT5cbiAgICAgICAgaXQgXCJzcGxpdC1kb3duIHdpdGgga2VlcGluZyBzY3JvbGwgcmF0aW9cIiwgLT5cbiAgICAgICAgICBkaXNwYXRjaENvbW1hbmQoJ3BhbmVyOnNwbGl0LWRvd24nKVxuICAgICAgICAgIHNldFJvd3NQZXJQYWdlKGVkaXRvciwgcm93c1BlclBhZ2UvMilcbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKSkudG9FcXVhbCBbb2xkUGFuZSwgbmV3UGFuZV1cblxuICAgIGRlc2NyaWJlIFwic3BsaXQgbGVmdC9yaWdodFwiLCAtPlxuICAgICAgW25ld1BhbmUsIG9sZFBhbmUsIG9yaWdpbmFsU2Nyb2xsVG9wXSA9IFtdXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIG9yaWdpbmFsU2Nyb2xsVG9wID0gZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxUb3AoKVxuICAgICAgICBvbkRpZFNwbGl0IChhcmdzKSAtPlxuICAgICAgICAgIHtuZXdQYW5lLCBvbGRQYW5lfSA9IGFyZ3NcbiAgICAgICAgICBuZXdFZGl0b3IgPSBuZXdQYW5lLmdldEFjdGl2ZUVkaXRvcigpXG4gICAgICAgICAgc2V0Um93c1BlclBhZ2UobmV3RWRpdG9yLCByb3dzUGVyUGFnZSlcblxuICAgICAgYWZ0ZXJFYWNoIC0+XG4gICAgICAgIGV4cGVjdChuZXdQYW5lKS50b0hhdmVTYW1wZVBhcmVudChvbGRQYW5lKVxuICAgICAgICBleHBlY3QobmV3UGFuZS5nZXRQYXJlbnQoKS5nZXRPcmllbnRhdGlvbigpKS50b0JlICdob3Jpem9udGFsJ1xuICAgICAgICBuZXdFZGl0b3JFbGVtZW50ID0gZ2V0VmlldyhuZXdFZGl0b3IpXG4gICAgICAgIGV4cGVjdChlZGl0b3IpLnRvSGF2ZVNjcm9sbFRvcCBuZXdFZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpXG4gICAgICAgIGV4cGVjdChlZGl0b3IpLnRvSGF2ZVNjcm9sbFRvcCBvcmlnaW5hbFNjcm9sbFRvcFxuXG4gICAgICBkZXNjcmliZSBcInNwbGl0IGxlZnRcIiwgLT5cbiAgICAgICAgaXQgXCJzcGxpdC1sZWZ0IHdpdGgga2VlcGluZyBzY3JvbGwgcmF0aW9cIiwgLT5cbiAgICAgICAgICBkaXNwYXRjaENvbW1hbmQoJ3BhbmVyOnNwbGl0LWxlZnQnKVxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpKS50b0VxdWFsIFtuZXdQYW5lLCBvbGRQYW5lXVxuXG4gICAgICBkZXNjcmliZSBcInNwbGl0LXJpZ2h0XCIsIC0+XG4gICAgICAgIGl0IFwic3BsaXQtcmlnaHQgd2l0aCBrZWVwaW5nIHNjcm9sbCByYXRpb1wiLCAtPlxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZCgncGFuZXI6c3BsaXQtcmlnaHQnKVxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpKS50b0VxdWFsIFtvbGRQYW5lLCBuZXdQYW5lXVxuXG4gIGRlc2NyaWJlIFwibW92ZVRvVmVyeSBkaXJlY3Rpb25cIiwgLT5cbiAgICBbcDEsIHAyLCBwM10gPSBbXVxuICAgIFtmMSwgZjIsIGYzLCBmNF0gPSBbXVxuICAgIFtlMSwgZTIsIGUzLCBlNF0gPSBbXVxuXG4gICAgbW92ZVRvVmVyeSA9ICh7aW5pdGlhbFBhbmUsIGNvbW1hbmR9KSAtPlxuICAgICAgaW5pdGlhbFBhbmUuYWN0aXZhdGUoKVxuICAgICAgZGlzcGF0Y2hDb21tYW5kKGNvbW1hbmQpXG5cbiAgICBlbnN1cmVQYW5lTGF5b3V0ID0gKGxheW91dCkgLT5cbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgIHJvb3QgPSBwYW5lLmdldENvbnRhaW5lcigpLmdldFJvb3QoKVxuICAgICAgZXhwZWN0KHBhbmVMYXlvdXRGb3Iocm9vdCkpLnRvRXF1YWwobGF5b3V0KVxuXG4gICAgcGFuZUxheW91dEZvciA9IChyb290KSAtPlxuICAgICAgbGF5b3V0ID0ge31cbiAgICAgIGxheW91dFtyb290LmdldE9yaWVudGF0aW9uKCldID0gcm9vdC5nZXRDaGlsZHJlbigpLm1hcCAoY2hpbGQpIC0+XG4gICAgICAgIHN3aXRjaCBjaGlsZC5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgICAgICAgd2hlbiAnUGFuZScgdGhlbiBjaGlsZC5nZXRJdGVtcygpXG4gICAgICAgICAgd2hlbiAnUGFuZUF4aXMnIHRoZW4gcGFuZUxheW91dEZvcihjaGlsZClcbiAgICAgIGxheW91dFxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZjEgPSBhdG9tLnByb2plY3QucmVzb2x2ZVBhdGgoXCJmaWxlMVwiKVxuICAgICAgZjIgPSBhdG9tLnByb2plY3QucmVzb2x2ZVBhdGgoXCJmaWxlMlwiKVxuICAgICAgZjMgPSBhdG9tLnByb2plY3QucmVzb2x2ZVBhdGgoXCJmaWxlM1wiKVxuICAgICAgZjQgPSBhdG9tLnByb2plY3QucmVzb2x2ZVBhdGgoXCJmaWxlNFwiKVxuXG4gICAgZGVzY3JpYmUgXCJhbGwgaG9yaXpvbnRhbFwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihmMSkudGhlbiAoZSkgLT4gZTEgPSBlXG4gICAgICAgIHJ1bnMgLT4gc3BsaXRQYW5lKCdyaWdodCcpXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKGYyKS50aGVuIChlKSAtPiBlMiA9IGVcbiAgICAgICAgcnVucyAtPiBzcGxpdFBhbmUoJ3JpZ2h0JylcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oZjMpLnRoZW4gKGUpIC0+IGUzID0gZVxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBwYW5lcyA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClcbiAgICAgICAgICBleHBlY3QocGFuZXMpLnRvSGF2ZUxlbmd0aCgzKVxuICAgICAgICAgIFtwMSwgcDIsIHAzXSA9IHBhbmVzXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dChob3Jpem9udGFsOiBbW2UxXSwgW2UyXSwgW2UzXV0pXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZShwMylcblxuICAgICAgZGVzY3JpYmUgXCJ2ZXJ5LXRvcFwiLCAtPlxuICAgICAgICBpdCBcImNhc2UgMVwiLCAtPlxuICAgICAgICAgIG1vdmVUb1ZlcnkoaW5pdGlhbFBhbmU6IHAxLCBjb21tYW5kOiAncGFuZXI6dmVyeS10b3AnKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQodmVydGljYWw6IFtbZTFdLCB7aG9yaXpvbnRhbDogW1tlMl0sIFtlM11dfV0pXG4gICAgICAgIGl0IFwiY2FzZSAyXCIsIC0+XG4gICAgICAgICAgbW92ZVRvVmVyeShpbml0aWFsUGFuZTogcDIsIGNvbW1hbmQ6ICdwYW5lcjp2ZXJ5LXRvcCcpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh2ZXJ0aWNhbDogW1tlMl0sIHtob3Jpem9udGFsOiBbW2UxXSwgW2UzXV19XSlcbiAgICAgICAgaXQgXCJjYXNlIDNcIiwgLT5cbiAgICAgICAgICBtb3ZlVG9WZXJ5KGluaXRpYWxQYW5lOiBwMywgY29tbWFuZDogJ3BhbmVyOnZlcnktdG9wJylcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHZlcnRpY2FsOiBbW2UzXSwge2hvcml6b250YWw6IFtbZTFdLCBbZTJdXX1dKVxuXG4gICAgICBkZXNjcmliZSBcInZlcnktYm90dG9tXCIsIC0+XG4gICAgICAgIGl0IFwiY2FzZSAxXCIsIC0+XG4gICAgICAgICAgbW92ZVRvVmVyeShpbml0aWFsUGFuZTogcDEsIGNvbW1hbmQ6ICdwYW5lcjp2ZXJ5LWJvdHRvbScpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh2ZXJ0aWNhbDogW3tob3Jpem9udGFsOiBbW2UyXSwgW2UzXV19LCBbZTFdXSlcbiAgICAgICAgaXQgXCJjYXNlIDJcIiwgLT5cbiAgICAgICAgICBtb3ZlVG9WZXJ5KGluaXRpYWxQYW5lOiBwMiwgY29tbWFuZDogJ3BhbmVyOnZlcnktYm90dG9tJylcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHZlcnRpY2FsOiBbe2hvcml6b250YWw6IFtbZTFdLCBbZTNdXX0sIFtlMl1dKVxuICAgICAgICBpdCBcImNhc2UgM1wiLCAtPlxuICAgICAgICAgIG1vdmVUb1ZlcnkoaW5pdGlhbFBhbmU6IHAzLCBjb21tYW5kOiAncGFuZXI6dmVyeS1ib3R0b20nKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQodmVydGljYWw6IFt7aG9yaXpvbnRhbDogW1tlMV0sIFtlMl1dfSwgW2UzXV0pXG5cbiAgICAgIGRlc2NyaWJlIFwidmVyeS1sZWZ0XCIsIC0+XG4gICAgICAgIGl0IFwiY2FzZSAxXCIsIC0+XG4gICAgICAgICAgbW92ZVRvVmVyeShpbml0aWFsUGFuZTogcDEsIGNvbW1hbmQ6ICdwYW5lcjp2ZXJ5LWxlZnQnKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoaG9yaXpvbnRhbDogW1tlMV0sIFtlMl0sIFtlM11dKVxuICAgICAgICBpdCBcImNhc2UgMlwiLCAtPlxuICAgICAgICAgIG1vdmVUb1ZlcnkoaW5pdGlhbFBhbmU6IHAyLCBjb21tYW5kOiAncGFuZXI6dmVyeS1sZWZ0JylcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KGhvcml6b250YWw6IFtbZTJdLCBbZTFdLCBbZTNdXSlcbiAgICAgICAgaXQgXCJjYXNlIDNcIiwgLT5cbiAgICAgICAgICBtb3ZlVG9WZXJ5KGluaXRpYWxQYW5lOiBwMywgY29tbWFuZDogJ3BhbmVyOnZlcnktbGVmdCcpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dChob3Jpem9udGFsOiBbW2UzXSwgW2UxXSwgW2UyXV0pXG5cbiAgICAgIGRlc2NyaWJlIFwidmVyeS1yaWdodFwiLCAtPlxuICAgICAgICBpdCBcImNhc2UgMVwiLCAtPlxuICAgICAgICAgIG1vdmVUb1ZlcnkoaW5pdGlhbFBhbmU6IHAxLCBjb21tYW5kOiAncGFuZXI6dmVyeS1yaWdodCcpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dChob3Jpem9udGFsOiBbW2UyXSwgW2UzXSwgW2UxXV0pXG4gICAgICAgIGl0IFwiY2FzZSAyXCIsIC0+XG4gICAgICAgICAgbW92ZVRvVmVyeShpbml0aWFsUGFuZTogcDIsIGNvbW1hbmQ6ICdwYW5lcjp2ZXJ5LXJpZ2h0JylcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KGhvcml6b250YWw6IFtbZTFdLCBbZTNdLCBbZTJdXSlcbiAgICAgICAgaXQgXCJjYXNlIDNcIiwgLT5cbiAgICAgICAgICBtb3ZlVG9WZXJ5KGluaXRpYWxQYW5lOiBwMywgY29tbWFuZDogJ3BhbmVyOnZlcnktcmlnaHQnKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoaG9yaXpvbnRhbDogW1tlMV0sIFtlMl0sIFtlM11dKVxuXG4gICAgICBkZXNjcmliZSBcImNvbXBsZXggb3BlcmF0aW9uXCIsIC0+XG4gICAgICAgIGl0IFwiY2FzZSAxXCIsIC0+XG4gICAgICAgICAgcDEuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZCgncGFuZXI6dmVyeS10b3AnKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQodmVydGljYWw6IFtbZTFdLCB7aG9yaXpvbnRhbDogW1tlMl0sIFtlM11dfV0pXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKCdwYW5lcjp2ZXJ5LWxlZnQnKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoaG9yaXpvbnRhbDogW1tlMV0sIFtlMl0sIFtlM11dKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZCgncGFuZXI6dmVyeS1ib3R0b20nKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQodmVydGljYWw6IFt7aG9yaXpvbnRhbDogW1tlMl0sIFtlM11dfSwgW2UxXV0pXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKCdwYW5lcjp2ZXJ5LXJpZ2h0JylcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KGhvcml6b250YWw6IFtbZTJdLCBbZTNdLCBbZTFdXSlcblxuICAgIGRlc2NyaWJlIFwiYWxsIHZlcnRpY2FsXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKGYxKS50aGVuIChlKSAtPiBlMSA9IGVcbiAgICAgICAgcnVucyAtPiBzcGxpdFBhbmUoJ2Rvd24nKVxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihmMikudGhlbiAoZSkgLT4gZTIgPSBlXG4gICAgICAgIHJ1bnMgLT4gc3BsaXRQYW5lKCdkb3duJylcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oZjMpLnRoZW4gKGUpIC0+IGUzID0gZVxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBwYW5lcyA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClcbiAgICAgICAgICBleHBlY3QocGFuZXMpLnRvSGF2ZUxlbmd0aCgzKVxuICAgICAgICAgIFtwMSwgcDIsIHAzXSA9IHBhbmVzXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh2ZXJ0aWNhbDogW1tlMV0sIFtlMl0sIFtlM11dKVxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkpLnRvQmUocDMpXG5cbiAgICAgIGRlc2NyaWJlIFwidmVyeS10b3BcIiwgLT5cbiAgICAgICAgaXQgXCJjYXNlIDFcIiwgLT5cbiAgICAgICAgICBtb3ZlVG9WZXJ5KGluaXRpYWxQYW5lOiBwMSwgY29tbWFuZDogJ3BhbmVyOnZlcnktdG9wJylcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHZlcnRpY2FsOiBbW2UxXSwgW2UyXSwgW2UzXV0pXG4gICAgICAgIGl0IFwiY2FzZSAyXCIsIC0+XG4gICAgICAgICAgbW92ZVRvVmVyeShpbml0aWFsUGFuZTogcDIsIGNvbW1hbmQ6ICdwYW5lcjp2ZXJ5LXRvcCcpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh2ZXJ0aWNhbDogW1tlMl0sIFtlMV0sIFtlM11dKVxuICAgICAgICBpdCBcImNhc2UgM1wiLCAtPlxuICAgICAgICAgIG1vdmVUb1ZlcnkoaW5pdGlhbFBhbmU6IHAzLCBjb21tYW5kOiAncGFuZXI6dmVyeS10b3AnKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQodmVydGljYWw6IFtbZTNdLCBbZTFdLCBbZTJdXSlcblxuICAgICAgZGVzY3JpYmUgXCJ2ZXJ5LWJvdHRvbVwiLCAtPlxuICAgICAgICBpdCBcImNhc2UgMVwiLCAtPlxuICAgICAgICAgIG1vdmVUb1ZlcnkoaW5pdGlhbFBhbmU6IHAxLCBjb21tYW5kOiAncGFuZXI6dmVyeS1ib3R0b20nKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQodmVydGljYWw6IFtbZTJdLCBbZTNdLCBbZTFdXSlcbiAgICAgICAgaXQgXCJjYXNlIDJcIiwgLT5cbiAgICAgICAgICBtb3ZlVG9WZXJ5KGluaXRpYWxQYW5lOiBwMiwgY29tbWFuZDogJ3BhbmVyOnZlcnktYm90dG9tJylcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHZlcnRpY2FsOiBbW2UxXSwgW2UzXSwgW2UyXV0pXG4gICAgICAgIGl0IFwiY2FzZSAzXCIsIC0+XG4gICAgICAgICAgbW92ZVRvVmVyeShpbml0aWFsUGFuZTogcDMsIGNvbW1hbmQ6ICdwYW5lcjp2ZXJ5LWJvdHRvbScpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh2ZXJ0aWNhbDogW1tlMV0sIFtlMl0sIFtlM11dKVxuXG4gICAgICBkZXNjcmliZSBcInZlcnktbGVmdFwiLCAtPlxuICAgICAgICBpdCBcImNhc2UgMVwiLCAtPlxuICAgICAgICAgIG1vdmVUb1ZlcnkoaW5pdGlhbFBhbmU6IHAxLCBjb21tYW5kOiAncGFuZXI6dmVyeS1sZWZ0JylcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KGhvcml6b250YWw6IFtbZTFdLCB7dmVydGljYWw6IFtbZTJdLCBbZTNdXX1dKVxuICAgICAgICBpdCBcImNhc2UgMlwiLCAtPlxuICAgICAgICAgIG1vdmVUb1ZlcnkoaW5pdGlhbFBhbmU6IHAyLCBjb21tYW5kOiAncGFuZXI6dmVyeS1sZWZ0JylcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KGhvcml6b250YWw6IFtbZTJdLCB7dmVydGljYWw6IFtbZTFdLCBbZTNdXX1dKVxuICAgICAgICBpdCBcImNhc2UgM1wiLCAtPlxuICAgICAgICAgIG1vdmVUb1ZlcnkoaW5pdGlhbFBhbmU6IHAzLCBjb21tYW5kOiAncGFuZXI6dmVyeS1sZWZ0JylcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KGhvcml6b250YWw6IFtbZTNdLCB7dmVydGljYWw6IFtbZTFdLCBbZTJdXX1dKVxuXG4gICAgICBkZXNjcmliZSBcInZlcnktcmlnaHRcIiwgLT5cbiAgICAgICAgaXQgXCJjYXNlIDFcIiwgLT5cbiAgICAgICAgICBtb3ZlVG9WZXJ5KGluaXRpYWxQYW5lOiBwMSwgY29tbWFuZDogJ3BhbmVyOnZlcnktcmlnaHQnKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoaG9yaXpvbnRhbDogW3t2ZXJ0aWNhbDogW1tlMl0sIFtlM11dfSwgW2UxXV0pXG4gICAgICAgIGl0IFwiY2FzZSAyXCIsIC0+XG4gICAgICAgICAgbW92ZVRvVmVyeShpbml0aWFsUGFuZTogcDIsIGNvbW1hbmQ6ICdwYW5lcjp2ZXJ5LXJpZ2h0JylcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KGhvcml6b250YWw6IFt7dmVydGljYWw6IFtbZTFdLCBbZTNdXX0sIFtlMl1dKVxuICAgICAgICBpdCBcImNhc2UgM1wiLCAtPlxuICAgICAgICAgIG1vdmVUb1ZlcnkoaW5pdGlhbFBhbmU6IHAzLCBjb21tYW5kOiAncGFuZXI6dmVyeS1yaWdodCcpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dChob3Jpem9udGFsOiBbe3ZlcnRpY2FsOiBbW2UxXSwgW2UyXV19LCBbZTNdXSlcblxuICAgICAgZGVzY3JpYmUgXCJjb21wbGV4IG9wZXJhdGlvblwiLCAtPlxuICAgICAgICBpdCBcImNhc2UgMVwiLCAtPlxuICAgICAgICAgIHAxLmFjdGl2YXRlKClcbiAgICAgICAgICBkaXNwYXRjaENvbW1hbmQoJ3BhbmVyOnZlcnktdG9wJylcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHZlcnRpY2FsOiBbW2UxXSwgW2UyXSwgW2UzXV0pXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKCdwYW5lcjp2ZXJ5LWxlZnQnKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoaG9yaXpvbnRhbDogW1tlMV0sIHt2ZXJ0aWNhbDogW1tlMl0sIFtlM11dfV0pXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKCdwYW5lcjp2ZXJ5LWJvdHRvbScpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh2ZXJ0aWNhbDogW1tlMl0sIFtlM10sIFtlMV1dKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZCgncGFuZXI6dmVyeS1yaWdodCcpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dChob3Jpem9udGFsOiBbe3ZlcnRpY2FsOiBbW2UyXSwgW2UzXV19LCBbZTFdXSlcblxuICAgIGRlc2NyaWJlIFwic3dhcFBhbmVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oZjEpLnRoZW4gKGUpIC0+IGUxID0gZVxuICAgICAgICBydW5zIC0+IHNwbGl0UGFuZSgncmlnaHQnKVxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihmMikudGhlbiAoZSkgLT4gZTIgPSBlXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKGYzKS50aGVuIChlKSAtPiBlMyA9IGVcbiAgICAgICAgcnVucyAtPiBzcGxpdFBhbmUoJ2Rvd24nKVxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihmNCkudGhlbiAoZSkgLT4gZTQgPSBlXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIHBhbmVzID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVxuICAgICAgICAgIGV4cGVjdChwYW5lcykudG9IYXZlTGVuZ3RoKDMpXG4gICAgICAgICAgW3AxLCBwMiwgcDNdID0gcGFuZXNcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0XG4gICAgICAgICAgICBob3Jpem9udGFsOiBbXG4gICAgICAgICAgICAgIFtlMV1cbiAgICAgICAgICAgICAgdmVydGljYWw6IFtbZTIsIGUzXSwgW2U0XV1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpKS50b0JlKHAzKVxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpLnRvQmUoZTQpXG5cbiAgICAgIGl0IFwiY2FzZSAxXCIsIC0+XG4gICAgICAgIGRpc3BhdGNoQ29tbWFuZCgncGFuZXI6c3dhcC1wYW5lJylcbiAgICAgICAgZW5zdXJlUGFuZUxheW91dFxuICAgICAgICAgIGhvcml6b250YWw6IFtcbiAgICAgICAgICAgIFtlMV1cbiAgICAgICAgICAgIHZlcnRpY2FsOiBbW2U0XSwgW2UyLCBlM11dXG4gICAgICAgICAgXVxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKS50b0JlKGU0KVxuXG4gICAgICAgIGRpc3BhdGNoQ29tbWFuZCgncGFuZXI6c3dhcC1wYW5lJylcbiAgICAgICAgZW5zdXJlUGFuZUxheW91dFxuICAgICAgICAgIGhvcml6b250YWw6IFtcbiAgICAgICAgICAgIFtlMV1cbiAgICAgICAgICAgIHZlcnRpY2FsOiBbW2UyLCBlM10sIFtlNF1dXG4gICAgICAgICAgXVxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKS50b0JlKGU0KVxuXG4gICAgICAgIHAxLmFjdGl2YXRlKCkgIyBwMSBpcyBwYW5lIHJlcHJlc2VudGVkIGFzIFtlMV1cbiAgICAgICAgZGlzcGF0Y2hDb21tYW5kKCdwYW5lcjpzd2FwLXBhbmUnKVxuICAgICAgICBlbnN1cmVQYW5lTGF5b3V0XG4gICAgICAgICAgaG9yaXpvbnRhbDogW1xuICAgICAgICAgICAgdmVydGljYWw6IFtbZTIsIGUzXSwgW2U0XV1cbiAgICAgICAgICAgIFtlMV1cbiAgICAgICAgICBdXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpLnRvQmUoZTEpXG5cbiAgICAgICAgZGlzcGF0Y2hDb21tYW5kKCdwYW5lcjpzd2FwLXBhbmUnKVxuICAgICAgICBlbnN1cmVQYW5lTGF5b3V0XG4gICAgICAgICAgaG9yaXpvbnRhbDogW1xuICAgICAgICAgICAgW2UxXVxuICAgICAgICAgICAgdmVydGljYWw6IFtbZTIsIGUzXSwgW2U0XV1cbiAgICAgICAgICBdXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpLnRvQmUoZTEpXG4iXX0=
