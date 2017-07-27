'use babel';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _require = require("atom");

var Range = _require.Range;

var _require2 = require("./async-spec-helpers");

var it = _require2.it;
var fit = _require2.fit;
var ffit = _require2.ffit;
var fffit = _require2.fffit;
var emitterEventPromise = _require2.emitterEventPromise;
var beforeEach = _require2.beforeEach;
var afterEach = _require2.afterEach;

function getView(model) {
  return atom.views.getView(model);
}

function dispatchCommand(commandName) {
  atom.commands.dispatch(atom.workspace.getElement(), commandName);
}

describe("paner", function () {
  beforeEach(function () {
    // `destroyEmptyPanes` is default true, but atom's spec-helper reset to `false`
    // So set it to `true` again here to test with default value.
    atom.config.set("core.destroyEmptyPanes", true);
    jasmine.attachToDOM(atom.workspace.getElement());

    var activationPromise = atom.packages.activatePackage("paner");
    dispatchCommand("paner:exchange-pane");
    return activationPromise;
  });

  describe("pane item manipulation", function () {
    var e1 = undefined,
        e2 = undefined,
        e3 = undefined,
        e4 = undefined,
        p1 = undefined,
        p2 = undefined;
    beforeEach(_asyncToGenerator(function* () {
      e1 = yield atom.workspace.open("file1");
      e2 = yield atom.workspace.open("file2");
      e3 = yield atom.workspace.open("file3", { split: "right" });
      e4 = yield atom.workspace.open("file4");
      var panes = atom.workspace.getCenter().getPanes();
      expect(panes).toHaveLength(2);
      var _panes = _slicedToArray(panes, 2);

      p1 = _panes[0];
      p2 = _panes[1];

      p1.activate();
      p1.activateItem(e1);
      p2.activateItem(e3);

      expect(p1.getItems()).toEqual([e1, e2]);
      expect(p1.getActiveItem()).toBe(e1);
      expect(p2.getItems()).toEqual([e3, e4]);
      expect(p2.getActiveItem()).toBe(e3);
      expect(atom.workspace.getActivePane()).toBe(p1);
    }));

    describe("move-pane-item family", function () {
      describe("move-pane-item", function () {
        it("move active item to adjacent pane and don't change active pane", _asyncToGenerator(function* () {
          dispatchCommand("paner:move-pane-item");
          expect(p1.getItems()).toEqual([e2]);
          expect(p1.getActiveItem()).toBe(e2);
          expect(p2.getItems()).toEqual([e3, e4, e1]);
          expect(p2.getActiveItem()).toBe(e1);
          expect(atom.workspace.getActivePane()).toBe(p2);

          dispatchCommand("paner:move-pane-item");
          expect(p1.getItems()).toEqual([e2, e1]);
          expect(p1.getActiveItem()).toBe(e1);
          expect(p2.getItems()).toEqual([e3, e4]);
          expect(p2.getActiveItem()).toBe(e4);
          expect(atom.workspace.getActivePane()).toBe(p1);
        }));
      });

      describe("move-pane-item-stay", function () {
        it("move active item to adjacent pane and don't change active pane", _asyncToGenerator(function* () {
          dispatchCommand("paner:move-pane-item-stay");
          expect(p1.getItems()).toEqual([e2]);
          expect(p1.getActiveItem()).toBe(e2);
          expect(p2.getItems()).toEqual([e3, e4, e1]);
          expect(p2.getActiveItem()).toBe(e1);
          expect(atom.workspace.getActivePane()).toBe(p1);

          dispatchCommand("paner:move-pane-item-stay");
          expect(p2.getItems()).toEqual([e3, e4, e1, e2]);
          expect(p2.getActiveItem()).toBe(e2);
          expect(atom.workspace.getActivePane()).toBe(p2);
          expect(p1.isAlive()).toBe(false);
        }));
      });
    });
  });

  xdescribe("split", function () {
    var _Array$from = Array.from([]);

    var _Array$from2 = _slicedToArray(_Array$from, 4);

    var editor = _Array$from2[0];
    var editorElement = _Array$from2[1];
    var subs = _Array$from2[2];
    var newEditor = _Array$from2[3];

    var scroll = function scroll(e) {
      var el = getView(e);
      return el.setScrollTop(el.getHeight());
    };

    var rowsPerPage = 10;

    var setRowsPerPage = function setRowsPerPage(e, num) {
      return getView(e).setHeight(num * e.getLineHeightInPixels());
    };

    var onDidSplit = function onDidSplit(fn) {
      return main.emitter.preempt("did-split-pane", fn);
    };

    beforeEach(_asyncToGenerator(function* () {
      var pathSample = atom.project.resolvePath("sample");
      waitsForPromise(function () {
        return atom.workspace.open(pathSample).then(function (e) {
          editor = e;
          setRowsPerPage(editor, rowsPerPage);
          return editorElement = getView(editor);
        });
      });

      return runs(function () {
        scroll(editor);
        return editor.setCursorBufferPosition([16, 0]);
      });
    }));

    fdescribe("split up/down", function () {
      var _Array$from3 = Array.from([]);

      var _Array$from32 = _slicedToArray(_Array$from3, 3);

      var newPane = _Array$from32[0];
      var oldPane = _Array$from32[1];
      var originalScrollTop = _Array$from32[2];

      beforeEach(function () {
        originalScrollTop = editorElement.getScrollTop();
        return onDidSplit(function (args) {
          ;newPane = args.newPane;
          oldPane = args.oldPane;

          newEditor = newPane.getActiveEditor();
          return setRowsPerPage(newEditor, rowsPerPage / 2);
        });
      });

      afterEach(function () {
        expect(newPane).toHaveSampeParent(oldPane);
        expect(newPane.getParent().getOrientation()).toBe("vertical");
        var newEditorElement = getView(newEditor);
        return expect(editor).toHaveScrollTop(newEditorElement.getScrollTop());
      });

      describe("split-up", function () {
        return it("split-up with keeping scroll ratio", function () {
          dispatchCommand("paner:split-pane-up");
          setRowsPerPage(editor, rowsPerPage / 2);
          return expect(atom.workspace.getPanes()).toEqual([newPane, oldPane]);
        });
      });

      return describe("split-down", function () {
        return it("split-down with keeping scroll ratio", function () {
          dispatchCommand("paner:split-down");
          setRowsPerPage(editor, rowsPerPage / 2);
          return expect(atom.workspace.getPanes()).toEqual([oldPane, newPane]);
        });
      });
    });

    return describe("split left/right", function () {
      var _Array$from4 = Array.from([]);

      var _Array$from42 = _slicedToArray(_Array$from4, 3);

      var newPane = _Array$from42[0];
      var oldPane = _Array$from42[1];
      var originalScrollTop = _Array$from42[2];

      beforeEach(function () {
        originalScrollTop = editorElement.getScrollTop();
        return onDidSplit(function (args) {
          ;newPane = args.newPane;
          oldPane = args.oldPane;

          newEditor = newPane.getActiveEditor();
          return setRowsPerPage(newEditor, rowsPerPage);
        });
      });

      afterEach(function () {
        expect(newPane).toHaveSampeParent(oldPane);
        expect(newPane.getParent().getOrientation()).toBe("horizontal");
        var newEditorElement = getView(newEditor);
        expect(editor).toHaveScrollTop(newEditorElement.getScrollTop());
        return expect(editor).toHaveScrollTop(originalScrollTop);
      });

      describe("split left", function () {
        return it("split-left with keeping scroll ratio", function () {
          dispatchCommand("paner:split-left");
          return expect(atom.workspace.getPanes()).toEqual([newPane, oldPane]);
        });
      });

      return describe("split-right", function () {
        return it("split-right with keeping scroll ratio", function () {
          dispatchCommand("paner:split-right");
          return expect(atom.workspace.getPanes()).toEqual([oldPane, newPane]);
        });
      });
    });
  });

  describe("moveToVery direction", function () {
    function ensurePaneLayout(layout) {
      var root = atom.workspace.getActivePane().getContainer().getRoot();
      expect(paneLayoutFor(root)).toEqual(layout);
    }

    function paneLayoutFor(root) {
      var layout = {};
      layout[root.getOrientation()] = root.getChildren().map(function (child) {
        switch (child.constructor.name) {
          case "Pane":
            return child.getItems();
          case "PaneAxis":
            return paneLayoutFor(child);
        }
      });
      return layout;
    }

    describe("all horizontal", function () {
      var e1 = undefined,
          e2 = undefined,
          e3 = undefined,
          p1 = undefined,
          p2 = undefined,
          p3 = undefined;
      beforeEach(_asyncToGenerator(function* () {
        e1 = yield atom.workspace.open("file1");
        e2 = yield atom.workspace.open("file2", { split: "right" });
        e3 = yield atom.workspace.open("file3", { split: "right" });
        var panes = atom.workspace.getCenter().getPanes();
        expect(panes).toHaveLength(3);
        var _panes2 = _slicedToArray(panes, 3);

        p1 = _panes2[0];
        p2 = _panes2[1];
        p3 = _panes2[2];

        ensurePaneLayout({ horizontal: [[e1], [e2], [e3]] });
        expect(atom.workspace.getActivePane()).toBe(p3);
      }));

      describe("very-top", function () {
        it("case 1", function () {
          p1.activate();
          dispatchCommand("paner:move-pane-to-very-top");
          ensurePaneLayout({ vertical: [[e1], { horizontal: [[e2], [e3]] }] });
        });
        it("case 2", function () {
          p2.activate();
          dispatchCommand("paner:move-pane-to-very-top");
          ensurePaneLayout({ vertical: [[e2], { horizontal: [[e1], [e3]] }] });
        });
        it("case 3", function () {
          p3.activate();
          dispatchCommand("paner:move-pane-to-very-top");
          ensurePaneLayout({ vertical: [[e3], { horizontal: [[e1], [e2]] }] });
        });
      });

      describe("very-bottom", function () {
        it("case 1", function () {
          p1.activate();
          dispatchCommand("paner:move-pane-to-very-bottom");
          ensurePaneLayout({ vertical: [{ horizontal: [[e2], [e3]] }, [e1]] });
        });
        it("case 2", function () {
          p2.activate();
          dispatchCommand("paner:move-pane-to-very-bottom");
          ensurePaneLayout({ vertical: [{ horizontal: [[e1], [e3]] }, [e2]] });
        });
        it("case 3", function () {
          p3.activate();
          dispatchCommand("paner:move-pane-to-very-bottom");
          ensurePaneLayout({ vertical: [{ horizontal: [[e1], [e2]] }, [e3]] });
        });
      });

      describe("very-left", function () {
        it("case 1", function () {
          p1.activate();
          dispatchCommand("paner:move-pane-to-very-left");
          ensurePaneLayout({ horizontal: [[e1], [e2], [e3]] });
        });
        it("case 2", function () {
          p2.activate();
          dispatchCommand("paner:move-pane-to-very-left");
          ensurePaneLayout({ horizontal: [[e2], [e1], [e3]] });
        });
        it("case 3", function () {
          p3.activate();
          dispatchCommand("paner:move-pane-to-very-left");
          ensurePaneLayout({ horizontal: [[e3], [e1], [e2]] });
        });
      });

      describe("very-right", function () {
        it("case 1", function () {
          p1.activate();
          dispatchCommand("paner:move-pane-to-very-right");
          ensurePaneLayout({ horizontal: [[e2], [e3], [e1]] });
        });
        it("case 2", function () {
          p2.activate();
          dispatchCommand("paner:move-pane-to-very-right");
          ensurePaneLayout({ horizontal: [[e1], [e3], [e2]] });
        });
        it("case 3", function () {
          p3.activate();
          dispatchCommand("paner:move-pane-to-very-right");
          ensurePaneLayout({ horizontal: [[e1], [e2], [e3]] });
        });
      });

      describe("complex operation", function () {
        it("case 1", function () {
          p1.activate();
          dispatchCommand("paner:move-pane-to-very-top");
          ensurePaneLayout({ vertical: [[e1], { horizontal: [[e2], [e3]] }] });
          dispatchCommand("paner:move-pane-to-very-left");
          ensurePaneLayout({ horizontal: [[e1], [e2], [e3]] });
          dispatchCommand("paner:move-pane-to-very-bottom");
          ensurePaneLayout({ vertical: [{ horizontal: [[e2], [e3]] }, [e1]] });
          dispatchCommand("paner:move-pane-to-very-right");
          ensurePaneLayout({ horizontal: [[e2], [e3], [e1]] });
        });
      });
    });

    describe("all vertical", function () {
      var e1 = undefined,
          e2 = undefined,
          e3 = undefined,
          p1 = undefined,
          p2 = undefined,
          p3 = undefined;
      beforeEach(_asyncToGenerator(function* () {
        e1 = yield atom.workspace.open("file1");
        e2 = yield atom.workspace.open("file2", { split: "down" });
        e3 = yield atom.workspace.open("file3", { split: "down" });
        var panes = atom.workspace.getCenter().getPanes();
        expect(panes).toHaveLength(3);
        var _panes3 = _slicedToArray(panes, 3);

        p1 = _panes3[0];
        p2 = _panes3[1];
        p3 = _panes3[2];

        ensurePaneLayout({ vertical: [[e1], [e2], [e3]] });
        expect(atom.workspace.getActivePane()).toBe(p3);
      }));

      describe("very-top", function () {
        it("case 1", function () {
          p1.activate();
          dispatchCommand("paner:move-pane-to-very-top");
          ensurePaneLayout({ vertical: [[e1], [e2], [e3]] });
        });
        it("case 2", function () {
          p2.activate();
          dispatchCommand("paner:move-pane-to-very-top");
          ensurePaneLayout({ vertical: [[e2], [e1], [e3]] });
        });
        it("case 3", function () {
          p3.activate();
          dispatchCommand("paner:move-pane-to-very-top");
          ensurePaneLayout({ vertical: [[e3], [e1], [e2]] });
        });
      });

      describe("very-bottom", function () {
        it("case 1", function () {
          p1.activate();
          dispatchCommand("paner:move-pane-to-very-bottom");
          ensurePaneLayout({ vertical: [[e2], [e3], [e1]] });
        });
        it("case 2", function () {
          p2.activate();
          dispatchCommand("paner:move-pane-to-very-bottom");
          ensurePaneLayout({ vertical: [[e1], [e3], [e2]] });
        });
        it("case 3", function () {
          p3.activate();
          dispatchCommand("paner:move-pane-to-very-bottom");
          ensurePaneLayout({ vertical: [[e1], [e2], [e3]] });
        });
      });

      describe("very-left", function () {
        it("case 1", function () {
          p1.activate();
          dispatchCommand("paner:move-pane-to-very-left");
          ensurePaneLayout({ horizontal: [[e1], { vertical: [[e2], [e3]] }] });
        });
        it("case 2", function () {
          p2.activate();
          dispatchCommand("paner:move-pane-to-very-left");
          ensurePaneLayout({ horizontal: [[e2], { vertical: [[e1], [e3]] }] });
        });
        it("case 3", function () {
          p3.activate();
          dispatchCommand("paner:move-pane-to-very-left");
          ensurePaneLayout({ horizontal: [[e3], { vertical: [[e1], [e2]] }] });
        });
      });

      describe("very-right", function () {
        it("case 1", function () {
          p1.activate();
          dispatchCommand("paner:move-pane-to-very-right");
          ensurePaneLayout({ horizontal: [{ vertical: [[e2], [e3]] }, [e1]] });
        });
        it("case 2", function () {
          p2.activate();
          dispatchCommand("paner:move-pane-to-very-right");
          ensurePaneLayout({ horizontal: [{ vertical: [[e1], [e3]] }, [e2]] });
        });
        it("case 3", function () {
          p3.activate();
          dispatchCommand("paner:move-pane-to-very-right");
          ensurePaneLayout({ horizontal: [{ vertical: [[e1], [e2]] }, [e3]] });
        });
      });

      describe("complex operation", function () {
        return it("case 1", function () {
          p1.activate();
          dispatchCommand("paner:move-pane-to-very-top");
          ensurePaneLayout({ vertical: [[e1], [e2], [e3]] });
          dispatchCommand("paner:move-pane-to-very-left");
          ensurePaneLayout({ horizontal: [[e1], { vertical: [[e2], [e3]] }] });
          dispatchCommand("paner:move-pane-to-very-bottom");
          ensurePaneLayout({ vertical: [[e2], [e3], [e1]] });
          dispatchCommand("paner:move-pane-to-very-right");
          ensurePaneLayout({ horizontal: [{ vertical: [[e2], [e3]] }, [e1]] });
        });
      });
    });

    describe("exchange-pane family", function () {
      var p1 = undefined,
          p2 = undefined,
          p3 = undefined,
          items = undefined;
      beforeEach(_asyncToGenerator(function* () {
        var e1 = yield atom.workspace.open("file1");
        var e2 = yield atom.workspace.open("file2", { split: "right" });
        var e3 = yield atom.workspace.open("file3");
        var e4 = yield atom.workspace.open("file4", { split: "down" });
        var panes = atom.workspace.getCenter().getPanes();
        expect(panes).toHaveLength(3);
        var _panes4 = _slicedToArray(panes, 3);

        p1 = _panes4[0];
        p2 = _panes4[1];
        p3 = _panes4[2];

        items = {
          p1: p1.getItems(),
          p2: p2.getItems(),
          p3: p3.getItems()
        };
        expect(items).toEqual({
          p1: [e1],
          p2: [e2, e3],
          p3: [e4]
        });

        ensurePaneLayout({ horizontal: [items.p1, { vertical: [items.p2, items.p3] }] });
        expect(atom.workspace.getActivePane()).toBe(p3);
      }));

      describe("exchange-pane", function () {
        it("[adjacent is pane]: exchange pane, follow active pane", function () {
          dispatchCommand("paner:exchange-pane");
          ensurePaneLayout({ horizontal: [items.p1, { vertical: [items.p3, items.p2] }] });
          expect(atom.workspace.getActivePane()).toBe(p3);

          dispatchCommand("paner:exchange-pane");
          ensurePaneLayout({ horizontal: [items.p1, { vertical: [items.p2, items.p3] }] });
          expect(atom.workspace.getActivePane()).toBe(p3);
        });

        it("[adjacent is paneAxis]: exchange pane, when follow active pane", function () {
          p1.activate();
          dispatchCommand("paner:exchange-pane");
          ensurePaneLayout({ horizontal: [{ vertical: [items.p2, items.p3] }, items.p1] });
          expect(atom.workspace.getActivePane()).toBe(p1);

          dispatchCommand("paner:exchange-pane");
          ensurePaneLayout({ horizontal: [items.p1, { vertical: [items.p2, items.p3] }] });
          expect(atom.workspace.getActivePane()).toBe(p1);
        });
      });

      describe("exchange-pane-stay", function () {
        it("[adjacent is pane]: exchange pane and and stay active pane", function () {
          dispatchCommand("paner:exchange-pane-stay");
          ensurePaneLayout({ horizontal: [items.p1, { vertical: [items.p3, items.p2] }] });
          expect(atom.workspace.getActivePane()).toBe(p2);

          dispatchCommand("paner:exchange-pane-stay");
          ensurePaneLayout({ horizontal: [items.p1, { vertical: [items.p2, items.p3] }] });
          expect(atom.workspace.getActivePane()).toBe(p3);
        });

        it("[adjacent is paneAxis]: Do nothing when adjacent was paneAxis", function () {
          p1.activate();
          dispatchCommand("paner:exchange-pane-stay");
          ensurePaneLayout({ horizontal: [items.p1, { vertical: [items.p2, items.p3] }] });
          expect(atom.workspace.getActivePane()).toBe(p1);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9wYW5lci9zcGVjL3BhbmVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7ZUFFSyxPQUFPLENBQUMsTUFBTSxDQUFDOztJQUF4QixLQUFLLFlBQUwsS0FBSzs7Z0JBU1IsT0FBTyxDQUFDLHNCQUFzQixDQUFDOztJQVBqQyxFQUFFLGFBQUYsRUFBRTtJQUNGLEdBQUcsYUFBSCxHQUFHO0lBQ0gsSUFBSSxhQUFKLElBQUk7SUFDSixLQUFLLGFBQUwsS0FBSztJQUNMLG1CQUFtQixhQUFuQixtQkFBbUI7SUFDbkIsVUFBVSxhQUFWLFVBQVU7SUFDVixTQUFTLGFBQVQsU0FBUzs7QUFHWCxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDdEIsU0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtDQUNqQzs7QUFFRCxTQUFTLGVBQWUsQ0FBQyxXQUFXLEVBQUU7QUFDcEMsTUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQTtDQUNqRTs7QUFFRCxRQUFRLENBQUMsT0FBTyxFQUFFLFlBQVc7QUFDM0IsWUFBVSxDQUFDLFlBQU07OztBQUdmLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxDQUFBO0FBQy9DLFdBQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBOztBQUVoRCxRQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ2hFLG1CQUFlLENBQUMscUJBQXFCLENBQUMsQ0FBQTtBQUN0QyxXQUFPLGlCQUFpQixDQUFBO0dBQ3pCLENBQUMsQ0FBQTs7QUFF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QUFJLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDaEQsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9wYW5lci9zcGVjL3BhbmVyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCB7UmFuZ2V9ID0gcmVxdWlyZShcImF0b21cIilcbmNvbnN0IHtcbiAgaXQsXG4gIGZpdCxcbiAgZmZpdCxcbiAgZmZmaXQsXG4gIGVtaXR0ZXJFdmVudFByb21pc2UsXG4gIGJlZm9yZUVhY2gsXG4gIGFmdGVyRWFjaCxcbn0gPSByZXF1aXJlKFwiLi9hc3luYy1zcGVjLWhlbHBlcnNcIilcblxuZnVuY3Rpb24gZ2V0Vmlldyhtb2RlbCkge1xuICByZXR1cm4gYXRvbS52aWV3cy5nZXRWaWV3KG1vZGVsKVxufVxuXG5mdW5jdGlvbiBkaXNwYXRjaENvbW1hbmQoY29tbWFuZE5hbWUpIHtcbiAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLndvcmtzcGFjZS5nZXRFbGVtZW50KCksIGNvbW1hbmROYW1lKVxufVxuXG5kZXNjcmliZShcInBhbmVyXCIsIGZ1bmN0aW9uKCkge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAvLyBgZGVzdHJveUVtcHR5UGFuZXNgIGlzIGRlZmF1bHQgdHJ1ZSwgYnV0IGF0b20ncyBzcGVjLWhlbHBlciByZXNldCB0byBgZmFsc2VgXG4gICAgLy8gU28gc2V0IGl0IHRvIGB0cnVlYCBhZ2FpbiBoZXJlIHRvIHRlc3Qgd2l0aCBkZWZhdWx0IHZhbHVlLlxuICAgIGF0b20uY29uZmlnLnNldChcImNvcmUuZGVzdHJveUVtcHR5UGFuZXNcIiwgdHJ1ZSlcbiAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKGF0b20ud29ya3NwYWNlLmdldEVsZW1lbnQoKSlcblxuICAgIGNvbnN0IGFjdGl2YXRpb25Qcm9taXNlID0gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJwYW5lclwiKVxuICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOmV4Y2hhbmdlLXBhbmVcIilcbiAgICByZXR1cm4gYWN0aXZhdGlvblByb21pc2VcbiAgfSlcblxuICBkZXNjcmliZShcInBhbmUgaXRlbSBtYW5pcHVsYXRpb25cIiwgKCkgPT4ge1xuICAgIGxldCBlMSwgZTIsIGUzLCBlNCwgcDEsIHAyXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICBlMSA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oXCJmaWxlMVwiKVxuICAgICAgZTIgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKFwiZmlsZTJcIilcbiAgICAgIGUzID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihcImZpbGUzXCIsIHtzcGxpdDogXCJyaWdodFwifSlcbiAgICAgIGU0ID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihcImZpbGU0XCIpXG4gICAgICBjb25zdCBwYW5lcyA9IGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldFBhbmVzKClcbiAgICAgIGV4cGVjdChwYW5lcykudG9IYXZlTGVuZ3RoKDIpXG4gICAgICA7W3AxLCBwMl0gPSBwYW5lc1xuXG4gICAgICBwMS5hY3RpdmF0ZSgpXG4gICAgICBwMS5hY3RpdmF0ZUl0ZW0oZTEpXG4gICAgICBwMi5hY3RpdmF0ZUl0ZW0oZTMpXG5cbiAgICAgIGV4cGVjdChwMS5nZXRJdGVtcygpKS50b0VxdWFsKFtlMSwgZTJdKVxuICAgICAgZXhwZWN0KHAxLmdldEFjdGl2ZUl0ZW0oKSkudG9CZShlMSlcbiAgICAgIGV4cGVjdChwMi5nZXRJdGVtcygpKS50b0VxdWFsKFtlMywgZTRdKVxuICAgICAgZXhwZWN0KHAyLmdldEFjdGl2ZUl0ZW0oKSkudG9CZShlMylcbiAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkpLnRvQmUocDEpXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKFwibW92ZS1wYW5lLWl0ZW0gZmFtaWx5XCIsICgpID0+IHtcbiAgICAgIGRlc2NyaWJlKFwibW92ZS1wYW5lLWl0ZW1cIiwgKCkgPT4ge1xuICAgICAgICBpdChcIm1vdmUgYWN0aXZlIGl0ZW0gdG8gYWRqYWNlbnQgcGFuZSBhbmQgZG9uJ3QgY2hhbmdlIGFjdGl2ZSBwYW5lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICBkaXNwYXRjaENvbW1hbmQoXCJwYW5lcjptb3ZlLXBhbmUtaXRlbVwiKVxuICAgICAgICAgIGV4cGVjdChwMS5nZXRJdGVtcygpKS50b0VxdWFsKFtlMl0pXG4gICAgICAgICAgZXhwZWN0KHAxLmdldEFjdGl2ZUl0ZW0oKSkudG9CZShlMilcbiAgICAgICAgICBleHBlY3QocDIuZ2V0SXRlbXMoKSkudG9FcXVhbChbZTMsIGU0LCBlMV0pXG4gICAgICAgICAgZXhwZWN0KHAyLmdldEFjdGl2ZUl0ZW0oKSkudG9CZShlMSlcbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpKS50b0JlKHAyKVxuXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLWl0ZW1cIilcbiAgICAgICAgICBleHBlY3QocDEuZ2V0SXRlbXMoKSkudG9FcXVhbChbZTIsIGUxXSlcbiAgICAgICAgICBleHBlY3QocDEuZ2V0QWN0aXZlSXRlbSgpKS50b0JlKGUxKVxuICAgICAgICAgIGV4cGVjdChwMi5nZXRJdGVtcygpKS50b0VxdWFsKFtlMywgZTRdKVxuICAgICAgICAgIGV4cGVjdChwMi5nZXRBY3RpdmVJdGVtKCkpLnRvQmUoZTQpXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZShwMSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKFwibW92ZS1wYW5lLWl0ZW0tc3RheVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwibW92ZSBhY3RpdmUgaXRlbSB0byBhZGphY2VudCBwYW5lIGFuZCBkb24ndCBjaGFuZ2UgYWN0aXZlIHBhbmVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS1pdGVtLXN0YXlcIilcbiAgICAgICAgICBleHBlY3QocDEuZ2V0SXRlbXMoKSkudG9FcXVhbChbZTJdKVxuICAgICAgICAgIGV4cGVjdChwMS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUoZTIpXG4gICAgICAgICAgZXhwZWN0KHAyLmdldEl0ZW1zKCkpLnRvRXF1YWwoW2UzLCBlNCwgZTFdKVxuICAgICAgICAgIGV4cGVjdChwMi5nZXRBY3RpdmVJdGVtKCkpLnRvQmUoZTEpXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZShwMSlcblxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS1pdGVtLXN0YXlcIilcbiAgICAgICAgICBleHBlY3QocDIuZ2V0SXRlbXMoKSkudG9FcXVhbChbZTMsIGU0LCBlMSwgZTJdKVxuICAgICAgICAgIGV4cGVjdChwMi5nZXRBY3RpdmVJdGVtKCkpLnRvQmUoZTIpXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZShwMilcbiAgICAgICAgICBleHBlY3QocDEuaXNBbGl2ZSgpKS50b0JlKGZhbHNlKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIHhkZXNjcmliZShcInNwbGl0XCIsICgpID0+IHtcbiAgICBsZXQgW2VkaXRvciwgZWRpdG9yRWxlbWVudCwgc3VicywgbmV3RWRpdG9yXSA9IEFycmF5LmZyb20oW10pXG5cbiAgICBjb25zdCBzY3JvbGwgPSBmdW5jdGlvbihlKSB7XG4gICAgICBjb25zdCBlbCA9IGdldFZpZXcoZSlcbiAgICAgIHJldHVybiBlbC5zZXRTY3JvbGxUb3AoZWwuZ2V0SGVpZ2h0KCkpXG4gICAgfVxuXG4gICAgY29uc3Qgcm93c1BlclBhZ2UgPSAxMFxuXG4gICAgY29uc3Qgc2V0Um93c1BlclBhZ2UgPSAoZSwgbnVtKSA9PiBnZXRWaWV3KGUpLnNldEhlaWdodChudW0gKiBlLmdldExpbmVIZWlnaHRJblBpeGVscygpKVxuXG4gICAgY29uc3Qgb25EaWRTcGxpdCA9IGZuID0+IG1haW4uZW1pdHRlci5wcmVlbXB0KFwiZGlkLXNwbGl0LXBhbmVcIiwgZm4pXG5cbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBhdGhTYW1wbGUgPSBhdG9tLnByb2plY3QucmVzb2x2ZVBhdGgoXCJzYW1wbGVcIilcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGhTYW1wbGUpLnRoZW4oZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGVkaXRvciA9IGVcbiAgICAgICAgICBzZXRSb3dzUGVyUGFnZShlZGl0b3IsIHJvd3NQZXJQYWdlKVxuICAgICAgICAgIHJldHVybiAoZWRpdG9yRWxlbWVudCA9IGdldFZpZXcoZWRpdG9yKSlcbiAgICAgICAgfSlcbiAgICAgIClcblxuICAgICAgcmV0dXJuIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHNjcm9sbChlZGl0b3IpXG4gICAgICAgIHJldHVybiBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzE2LCAwXSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGZkZXNjcmliZShcInNwbGl0IHVwL2Rvd25cIiwgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgW25ld1BhbmUsIG9sZFBhbmUsIG9yaWdpbmFsU2Nyb2xsVG9wXSA9IEFycmF5LmZyb20oW10pXG4gICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBvcmlnaW5hbFNjcm9sbFRvcCA9IGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKClcbiAgICAgICAgcmV0dXJuIG9uRGlkU3BsaXQoZnVuY3Rpb24oYXJncykge1xuICAgICAgICAgIDsoe25ld1BhbmUsIG9sZFBhbmV9ID0gYXJncylcbiAgICAgICAgICBuZXdFZGl0b3IgPSBuZXdQYW5lLmdldEFjdGl2ZUVkaXRvcigpXG4gICAgICAgICAgcmV0dXJuIHNldFJvd3NQZXJQYWdlKG5ld0VkaXRvciwgcm93c1BlclBhZ2UgLyAyKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QobmV3UGFuZSkudG9IYXZlU2FtcGVQYXJlbnQob2xkUGFuZSlcbiAgICAgICAgZXhwZWN0KG5ld1BhbmUuZ2V0UGFyZW50KCkuZ2V0T3JpZW50YXRpb24oKSkudG9CZShcInZlcnRpY2FsXCIpXG4gICAgICAgIGNvbnN0IG5ld0VkaXRvckVsZW1lbnQgPSBnZXRWaWV3KG5ld0VkaXRvcilcbiAgICAgICAgcmV0dXJuIGV4cGVjdChlZGl0b3IpLnRvSGF2ZVNjcm9sbFRvcChuZXdFZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpKVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoXCJzcGxpdC11cFwiLCAoKSA9PlxuICAgICAgICBpdChcInNwbGl0LXVwIHdpdGgga2VlcGluZyBzY3JvbGwgcmF0aW9cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6c3BsaXQtcGFuZS11cFwiKVxuICAgICAgICAgIHNldFJvd3NQZXJQYWdlKGVkaXRvciwgcm93c1BlclBhZ2UgLyAyKVxuICAgICAgICAgIHJldHVybiBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKSkudG9FcXVhbChbbmV3UGFuZSwgb2xkUGFuZV0pXG4gICAgICAgIH0pKVxuXG4gICAgICByZXR1cm4gZGVzY3JpYmUoXCJzcGxpdC1kb3duXCIsICgpID0+XG4gICAgICAgIGl0KFwic3BsaXQtZG93biB3aXRoIGtlZXBpbmcgc2Nyb2xsIHJhdGlvXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOnNwbGl0LWRvd25cIilcbiAgICAgICAgICBzZXRSb3dzUGVyUGFnZShlZGl0b3IsIHJvd3NQZXJQYWdlIC8gMilcbiAgICAgICAgICByZXR1cm4gZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldFBhbmVzKCkpLnRvRXF1YWwoW29sZFBhbmUsIG5ld1BhbmVdKVxuICAgICAgICB9KSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGRlc2NyaWJlKFwic3BsaXQgbGVmdC9yaWdodFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBbbmV3UGFuZSwgb2xkUGFuZSwgb3JpZ2luYWxTY3JvbGxUb3BdID0gQXJyYXkuZnJvbShbXSlcbiAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIG9yaWdpbmFsU2Nyb2xsVG9wID0gZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxUb3AoKVxuICAgICAgICByZXR1cm4gb25EaWRTcGxpdChmdW5jdGlvbihhcmdzKSB7XG4gICAgICAgICAgOyh7bmV3UGFuZSwgb2xkUGFuZX0gPSBhcmdzKVxuICAgICAgICAgIG5ld0VkaXRvciA9IG5ld1BhbmUuZ2V0QWN0aXZlRWRpdG9yKClcbiAgICAgICAgICByZXR1cm4gc2V0Um93c1BlclBhZ2UobmV3RWRpdG9yLCByb3dzUGVyUGFnZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KG5ld1BhbmUpLnRvSGF2ZVNhbXBlUGFyZW50KG9sZFBhbmUpXG4gICAgICAgIGV4cGVjdChuZXdQYW5lLmdldFBhcmVudCgpLmdldE9yaWVudGF0aW9uKCkpLnRvQmUoXCJob3Jpem9udGFsXCIpXG4gICAgICAgIGNvbnN0IG5ld0VkaXRvckVsZW1lbnQgPSBnZXRWaWV3KG5ld0VkaXRvcilcbiAgICAgICAgZXhwZWN0KGVkaXRvcikudG9IYXZlU2Nyb2xsVG9wKG5ld0VkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkpXG4gICAgICAgIHJldHVybiBleHBlY3QoZWRpdG9yKS50b0hhdmVTY3JvbGxUb3Aob3JpZ2luYWxTY3JvbGxUb3ApXG4gICAgICB9KVxuXG4gICAgICBkZXNjcmliZShcInNwbGl0IGxlZnRcIiwgKCkgPT5cbiAgICAgICAgaXQoXCJzcGxpdC1sZWZ0IHdpdGgga2VlcGluZyBzY3JvbGwgcmF0aW9cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6c3BsaXQtbGVmdFwiKVxuICAgICAgICAgIHJldHVybiBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKSkudG9FcXVhbChbbmV3UGFuZSwgb2xkUGFuZV0pXG4gICAgICAgIH0pKVxuXG4gICAgICByZXR1cm4gZGVzY3JpYmUoXCJzcGxpdC1yaWdodFwiLCAoKSA9PlxuICAgICAgICBpdChcInNwbGl0LXJpZ2h0IHdpdGgga2VlcGluZyBzY3JvbGwgcmF0aW9cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6c3BsaXQtcmlnaHRcIilcbiAgICAgICAgICByZXR1cm4gZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldFBhbmVzKCkpLnRvRXF1YWwoW29sZFBhbmUsIG5ld1BhbmVdKVxuICAgICAgICB9KSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKFwibW92ZVRvVmVyeSBkaXJlY3Rpb25cIiwgZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gZW5zdXJlUGFuZUxheW91dChsYXlvdXQpIHtcbiAgICAgIGNvbnN0IHJvb3QgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0Q29udGFpbmVyKCkuZ2V0Um9vdCgpXG4gICAgICBleHBlY3QocGFuZUxheW91dEZvcihyb290KSkudG9FcXVhbChsYXlvdXQpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFuZUxheW91dEZvcihyb290KSB7XG4gICAgICBjb25zdCBsYXlvdXQgPSB7fVxuICAgICAgbGF5b3V0W3Jvb3QuZ2V0T3JpZW50YXRpb24oKV0gPSByb290LmdldENoaWxkcmVuKCkubWFwKGNoaWxkID0+IHtcbiAgICAgICAgc3dpdGNoIChjaGlsZC5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICAgICAgY2FzZSBcIlBhbmVcIjpcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5nZXRJdGVtcygpXG4gICAgICAgICAgY2FzZSBcIlBhbmVBeGlzXCI6XG4gICAgICAgICAgICByZXR1cm4gcGFuZUxheW91dEZvcihjaGlsZClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBsYXlvdXRcbiAgICB9XG5cbiAgICBkZXNjcmliZShcImFsbCBob3Jpem9udGFsXCIsICgpID0+IHtcbiAgICAgIGxldCBlMSwgZTIsIGUzLCBwMSwgcDIsIHAzXG4gICAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgZTEgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKFwiZmlsZTFcIilcbiAgICAgICAgZTIgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKFwiZmlsZTJcIiwge3NwbGl0OiBcInJpZ2h0XCJ9KVxuICAgICAgICBlMyA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oXCJmaWxlM1wiLCB7c3BsaXQ6IFwicmlnaHRcIn0pXG4gICAgICAgIGNvbnN0IHBhbmVzID0gYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVxuICAgICAgICBleHBlY3QocGFuZXMpLnRvSGF2ZUxlbmd0aCgzKVxuICAgICAgICA7W3AxLCBwMiwgcDNdID0gcGFuZXNcbiAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7aG9yaXpvbnRhbDogW1tlMV0sIFtlMl0sIFtlM11dfSlcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZShwMylcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKFwidmVyeS10b3BcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhc2UgMVwiLCAoKSA9PiB7XG4gICAgICAgICAgcDEuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LXRvcFwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe3ZlcnRpY2FsOiBbW2UxXSwge2hvcml6b250YWw6IFtbZTJdLCBbZTNdXX1dfSlcbiAgICAgICAgfSlcbiAgICAgICAgaXQoXCJjYXNlIDJcIiwgKCkgPT4ge1xuICAgICAgICAgIHAyLmFjdGl2YXRlKClcbiAgICAgICAgICBkaXNwYXRjaENvbW1hbmQoXCJwYW5lcjptb3ZlLXBhbmUtdG8tdmVyeS10b3BcIilcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHt2ZXJ0aWNhbDogW1tlMl0sIHtob3Jpem9udGFsOiBbW2UxXSwgW2UzXV19XX0pXG4gICAgICAgIH0pXG4gICAgICAgIGl0KFwiY2FzZSAzXCIsICgpID0+IHtcbiAgICAgICAgICBwMy5hY3RpdmF0ZSgpXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktdG9wXCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7dmVydGljYWw6IFtbZTNdLCB7aG9yaXpvbnRhbDogW1tlMV0sIFtlMl1dfV19KVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoXCJ2ZXJ5LWJvdHRvbVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FzZSAxXCIsICgpID0+IHtcbiAgICAgICAgICBwMS5hY3RpdmF0ZSgpXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktYm90dG9tXCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7dmVydGljYWw6IFt7aG9yaXpvbnRhbDogW1tlMl0sIFtlM11dfSwgW2UxXV19KVxuICAgICAgICB9KVxuICAgICAgICBpdChcImNhc2UgMlwiLCAoKSA9PiB7XG4gICAgICAgICAgcDIuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LWJvdHRvbVwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe3ZlcnRpY2FsOiBbe2hvcml6b250YWw6IFtbZTFdLCBbZTNdXX0sIFtlMl1dfSlcbiAgICAgICAgfSlcbiAgICAgICAgaXQoXCJjYXNlIDNcIiwgKCkgPT4ge1xuICAgICAgICAgIHAzLmFjdGl2YXRlKClcbiAgICAgICAgICBkaXNwYXRjaENvbW1hbmQoXCJwYW5lcjptb3ZlLXBhbmUtdG8tdmVyeS1ib3R0b21cIilcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHt2ZXJ0aWNhbDogW3tob3Jpem9udGFsOiBbW2UxXSwgW2UyXV19LCBbZTNdXX0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBkZXNjcmliZShcInZlcnktbGVmdFwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FzZSAxXCIsICgpID0+IHtcbiAgICAgICAgICBwMS5hY3RpdmF0ZSgpXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktbGVmdFwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe2hvcml6b250YWw6IFtbZTFdLCBbZTJdLCBbZTNdXX0pXG4gICAgICAgIH0pXG4gICAgICAgIGl0KFwiY2FzZSAyXCIsICgpID0+IHtcbiAgICAgICAgICBwMi5hY3RpdmF0ZSgpXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktbGVmdFwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe2hvcml6b250YWw6IFtbZTJdLCBbZTFdLCBbZTNdXX0pXG4gICAgICAgIH0pXG4gICAgICAgIGl0KFwiY2FzZSAzXCIsICgpID0+IHtcbiAgICAgICAgICBwMy5hY3RpdmF0ZSgpXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktbGVmdFwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe2hvcml6b250YWw6IFtbZTNdLCBbZTFdLCBbZTJdXX0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBkZXNjcmliZShcInZlcnktcmlnaHRcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhc2UgMVwiLCAoKSA9PiB7XG4gICAgICAgICAgcDEuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LXJpZ2h0XCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7aG9yaXpvbnRhbDogW1tlMl0sIFtlM10sIFtlMV1dfSlcbiAgICAgICAgfSlcbiAgICAgICAgaXQoXCJjYXNlIDJcIiwgKCkgPT4ge1xuICAgICAgICAgIHAyLmFjdGl2YXRlKClcbiAgICAgICAgICBkaXNwYXRjaENvbW1hbmQoXCJwYW5lcjptb3ZlLXBhbmUtdG8tdmVyeS1yaWdodFwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe2hvcml6b250YWw6IFtbZTFdLCBbZTNdLCBbZTJdXX0pXG4gICAgICAgIH0pXG4gICAgICAgIGl0KFwiY2FzZSAzXCIsICgpID0+IHtcbiAgICAgICAgICBwMy5hY3RpdmF0ZSgpXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktcmlnaHRcIilcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHtob3Jpem9udGFsOiBbW2UxXSwgW2UyXSwgW2UzXV19KVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoXCJjb21wbGV4IG9wZXJhdGlvblwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FzZSAxXCIsICgpID0+IHtcbiAgICAgICAgICBwMS5hY3RpdmF0ZSgpXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktdG9wXCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7dmVydGljYWw6IFtbZTFdLCB7aG9yaXpvbnRhbDogW1tlMl0sIFtlM11dfV19KVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LWxlZnRcIilcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHtob3Jpem9udGFsOiBbW2UxXSwgW2UyXSwgW2UzXV19KVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LWJvdHRvbVwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe3ZlcnRpY2FsOiBbe2hvcml6b250YWw6IFtbZTJdLCBbZTNdXX0sIFtlMV1dfSlcbiAgICAgICAgICBkaXNwYXRjaENvbW1hbmQoXCJwYW5lcjptb3ZlLXBhbmUtdG8tdmVyeS1yaWdodFwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe2hvcml6b250YWw6IFtbZTJdLCBbZTNdLCBbZTFdXX0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZShcImFsbCB2ZXJ0aWNhbFwiLCAoKSA9PiB7XG4gICAgICBsZXQgZTEsIGUyLCBlMywgcDEsIHAyLCBwM1xuICAgICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIGUxID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihcImZpbGUxXCIpXG4gICAgICAgIGUyID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihcImZpbGUyXCIsIHtzcGxpdDogXCJkb3duXCJ9KVxuICAgICAgICBlMyA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oXCJmaWxlM1wiLCB7c3BsaXQ6IFwiZG93blwifSlcbiAgICAgICAgY29uc3QgcGFuZXMgPSBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpXG4gICAgICAgIGV4cGVjdChwYW5lcykudG9IYXZlTGVuZ3RoKDMpXG4gICAgICAgIDtbcDEsIHAyLCBwM10gPSBwYW5lc1xuICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHt2ZXJ0aWNhbDogW1tlMV0sIFtlMl0sIFtlM11dfSlcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZShwMylcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKFwidmVyeS10b3BcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhc2UgMVwiLCAoKSA9PiB7XG4gICAgICAgICAgcDEuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LXRvcFwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe3ZlcnRpY2FsOiBbW2UxXSwgW2UyXSwgW2UzXV19KVxuICAgICAgICB9KVxuICAgICAgICBpdChcImNhc2UgMlwiLCAoKSA9PiB7XG4gICAgICAgICAgcDIuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LXRvcFwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe3ZlcnRpY2FsOiBbW2UyXSwgW2UxXSwgW2UzXV19KVxuICAgICAgICB9KVxuICAgICAgICBpdChcImNhc2UgM1wiLCAoKSA9PiB7XG4gICAgICAgICAgcDMuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LXRvcFwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe3ZlcnRpY2FsOiBbW2UzXSwgW2UxXSwgW2UyXV19KVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoXCJ2ZXJ5LWJvdHRvbVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FzZSAxXCIsICgpID0+IHtcbiAgICAgICAgICBwMS5hY3RpdmF0ZSgpXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktYm90dG9tXCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7dmVydGljYWw6IFtbZTJdLCBbZTNdLCBbZTFdXX0pXG4gICAgICAgIH0pXG4gICAgICAgIGl0KFwiY2FzZSAyXCIsICgpID0+IHtcbiAgICAgICAgICBwMi5hY3RpdmF0ZSgpXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktYm90dG9tXCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7dmVydGljYWw6IFtbZTFdLCBbZTNdLCBbZTJdXX0pXG4gICAgICAgIH0pXG4gICAgICAgIGl0KFwiY2FzZSAzXCIsICgpID0+IHtcbiAgICAgICAgICBwMy5hY3RpdmF0ZSgpXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktYm90dG9tXCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7dmVydGljYWw6IFtbZTFdLCBbZTJdLCBbZTNdXX0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBkZXNjcmliZShcInZlcnktbGVmdFwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FzZSAxXCIsICgpID0+IHtcbiAgICAgICAgICBwMS5hY3RpdmF0ZSgpXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktbGVmdFwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe2hvcml6b250YWw6IFtbZTFdLCB7dmVydGljYWw6IFtbZTJdLCBbZTNdXX1dfSlcbiAgICAgICAgfSlcbiAgICAgICAgaXQoXCJjYXNlIDJcIiwgKCkgPT4ge1xuICAgICAgICAgIHAyLmFjdGl2YXRlKClcbiAgICAgICAgICBkaXNwYXRjaENvbW1hbmQoXCJwYW5lcjptb3ZlLXBhbmUtdG8tdmVyeS1sZWZ0XCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7aG9yaXpvbnRhbDogW1tlMl0sIHt2ZXJ0aWNhbDogW1tlMV0sIFtlM11dfV19KVxuICAgICAgICB9KVxuICAgICAgICBpdChcImNhc2UgM1wiLCAoKSA9PiB7XG4gICAgICAgICAgcDMuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LWxlZnRcIilcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHtob3Jpem9udGFsOiBbW2UzXSwge3ZlcnRpY2FsOiBbW2UxXSwgW2UyXV19XX0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBkZXNjcmliZShcInZlcnktcmlnaHRcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhc2UgMVwiLCAoKSA9PiB7XG4gICAgICAgICAgcDEuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LXJpZ2h0XCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7aG9yaXpvbnRhbDogW3t2ZXJ0aWNhbDogW1tlMl0sIFtlM11dfSwgW2UxXV19KVxuICAgICAgICB9KVxuICAgICAgICBpdChcImNhc2UgMlwiLCAoKSA9PiB7XG4gICAgICAgICAgcDIuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LXJpZ2h0XCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7aG9yaXpvbnRhbDogW3t2ZXJ0aWNhbDogW1tlMV0sIFtlM11dfSwgW2UyXV19KVxuICAgICAgICB9KVxuICAgICAgICBpdChcImNhc2UgM1wiLCAoKSA9PiB7XG4gICAgICAgICAgcDMuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LXJpZ2h0XCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7aG9yaXpvbnRhbDogW3t2ZXJ0aWNhbDogW1tlMV0sIFtlMl1dfSwgW2UzXV19KVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoXCJjb21wbGV4IG9wZXJhdGlvblwiLCAoKSA9PlxuICAgICAgICBpdChcImNhc2UgMVwiLCAoKSA9PiB7XG4gICAgICAgICAgcDEuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LXRvcFwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe3ZlcnRpY2FsOiBbW2UxXSwgW2UyXSwgW2UzXV19KVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LWxlZnRcIilcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHtob3Jpem9udGFsOiBbW2UxXSwge3ZlcnRpY2FsOiBbW2UyXSwgW2UzXV19XX0pXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktYm90dG9tXCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7dmVydGljYWw6IFtbZTJdLCBbZTNdLCBbZTFdXX0pXG4gICAgICAgICAgZGlzcGF0Y2hDb21tYW5kKFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktcmlnaHRcIilcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHtob3Jpem9udGFsOiBbe3ZlcnRpY2FsOiBbW2UyXSwgW2UzXV19LCBbZTFdXX0pXG4gICAgICAgIH0pKVxuICAgIH0pXG5cbiAgICBkZXNjcmliZShcImV4Y2hhbmdlLXBhbmUgZmFtaWx5XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHAxLCBwMiwgcDMsIGl0ZW1zXG4gICAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgZTEgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKFwiZmlsZTFcIilcbiAgICAgICAgY29uc3QgZTIgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKFwiZmlsZTJcIiwge3NwbGl0OiBcInJpZ2h0XCJ9KVxuICAgICAgICBjb25zdCBlMyA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oXCJmaWxlM1wiKVxuICAgICAgICBjb25zdCBlNCA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oXCJmaWxlNFwiLCB7c3BsaXQ6IFwiZG93blwifSlcbiAgICAgICAgY29uc3QgcGFuZXMgPSBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpXG4gICAgICAgIGV4cGVjdChwYW5lcykudG9IYXZlTGVuZ3RoKDMpXG4gICAgICAgIDtbcDEsIHAyLCBwM10gPSBwYW5lc1xuICAgICAgICBpdGVtcyA9IHtcbiAgICAgICAgICBwMTogcDEuZ2V0SXRlbXMoKSxcbiAgICAgICAgICBwMjogcDIuZ2V0SXRlbXMoKSxcbiAgICAgICAgICBwMzogcDMuZ2V0SXRlbXMoKSxcbiAgICAgICAgfVxuICAgICAgICBleHBlY3QoaXRlbXMpLnRvRXF1YWwoe1xuICAgICAgICAgIHAxOiBbZTFdLFxuICAgICAgICAgIHAyOiBbZTIsIGUzXSxcbiAgICAgICAgICBwMzogW2U0XSxcbiAgICAgICAgfSlcblxuICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHtob3Jpem9udGFsOiBbaXRlbXMucDEsIHt2ZXJ0aWNhbDogW2l0ZW1zLnAyLCBpdGVtcy5wM119XX0pXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkpLnRvQmUocDMpXG4gICAgICB9KVxuXG4gICAgICBkZXNjcmliZShcImV4Y2hhbmdlLXBhbmVcIiwgKCkgPT4ge1xuICAgICAgICBpdChcIlthZGphY2VudCBpcyBwYW5lXTogZXhjaGFuZ2UgcGFuZSwgZm9sbG93IGFjdGl2ZSBwYW5lXCIsICgpID0+IHtcbiAgICAgICAgICBkaXNwYXRjaENvbW1hbmQoXCJwYW5lcjpleGNoYW5nZS1wYW5lXCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7aG9yaXpvbnRhbDogW2l0ZW1zLnAxLCB7dmVydGljYWw6IFtpdGVtcy5wMywgaXRlbXMucDJdfV19KVxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkpLnRvQmUocDMpXG5cbiAgICAgICAgICBkaXNwYXRjaENvbW1hbmQoXCJwYW5lcjpleGNoYW5nZS1wYW5lXCIpXG4gICAgICAgICAgZW5zdXJlUGFuZUxheW91dCh7aG9yaXpvbnRhbDogW2l0ZW1zLnAxLCB7dmVydGljYWw6IFtpdGVtcy5wMiwgaXRlbXMucDNdfV19KVxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkpLnRvQmUocDMpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaXQoXCJbYWRqYWNlbnQgaXMgcGFuZUF4aXNdOiBleGNoYW5nZSBwYW5lLCB3aGVuIGZvbGxvdyBhY3RpdmUgcGFuZVwiLCAoKSA9PiB7XG4gICAgICAgICAgcDEuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOmV4Y2hhbmdlLXBhbmVcIilcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHtob3Jpem9udGFsOiBbe3ZlcnRpY2FsOiBbaXRlbXMucDIsIGl0ZW1zLnAzXX0sIGl0ZW1zLnAxXX0pXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZShwMSlcblxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOmV4Y2hhbmdlLXBhbmVcIilcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHtob3Jpem9udGFsOiBbaXRlbXMucDEsIHt2ZXJ0aWNhbDogW2l0ZW1zLnAyLCBpdGVtcy5wM119XX0pXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZShwMSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKFwiZXhjaGFuZ2UtcGFuZS1zdGF5XCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJbYWRqYWNlbnQgaXMgcGFuZV06IGV4Y2hhbmdlIHBhbmUgYW5kIGFuZCBzdGF5IGFjdGl2ZSBwYW5lXCIsICgpID0+IHtcbiAgICAgICAgICBkaXNwYXRjaENvbW1hbmQoXCJwYW5lcjpleGNoYW5nZS1wYW5lLXN0YXlcIilcbiAgICAgICAgICBlbnN1cmVQYW5lTGF5b3V0KHtob3Jpem9udGFsOiBbaXRlbXMucDEsIHt2ZXJ0aWNhbDogW2l0ZW1zLnAzLCBpdGVtcy5wMl19XX0pXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZShwMilcblxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOmV4Y2hhbmdlLXBhbmUtc3RheVwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe2hvcml6b250YWw6IFtpdGVtcy5wMSwge3ZlcnRpY2FsOiBbaXRlbXMucDIsIGl0ZW1zLnAzXX1dfSlcbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpKS50b0JlKHAzKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KFwiW2FkamFjZW50IGlzIHBhbmVBeGlzXTogRG8gbm90aGluZyB3aGVuIGFkamFjZW50IHdhcyBwYW5lQXhpc1wiLCAoKSA9PiB7XG4gICAgICAgICAgcDEuYWN0aXZhdGUoKVxuICAgICAgICAgIGRpc3BhdGNoQ29tbWFuZChcInBhbmVyOmV4Y2hhbmdlLXBhbmUtc3RheVwiKVxuICAgICAgICAgIGVuc3VyZVBhbmVMYXlvdXQoe2hvcml6b250YWw6IFtpdGVtcy5wMSwge3ZlcnRpY2FsOiBbaXRlbXMucDIsIGl0ZW1zLnAzXX1dfSlcbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpKS50b0JlKHAxKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==