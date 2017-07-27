'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require("atom");

var CompositeDisposable = _require.CompositeDisposable;

var PaneAxis = null;

// Return adjacent pane of activePane within current PaneAxis.
//  * return next Pane if exists.
//  * return previous pane if next pane was not exits.
function getAdjacentPane(pane) {
  var parent = pane.getParent();
  if (!parent || !parent.getChildren) return;
  var children = pane.getParent().getChildren();
  var index = children.indexOf(pane);
  var previousPane = children[index - 1];
  var nextPane = children[index + 1];

  return nextPane || previousPane;
}

function getAllPaneAxis(root) {
  var result = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  if (root.children) {
    result.push(root);
    for (var child of root.children) {
      getAllPaneAxis(child, result);
    }
  }
  return result;
}

module.exports = (function () {
  function PanerPackage() {
    _classCallCheck(this, PanerPackage);
  }

  _createClass(PanerPackage, [{
    key: "activate",
    value: function activate() {
      var _this = this;

      this.subscriptions = new CompositeDisposable();

      this.subscriptions.add(atom.commands.add("atom-workspace", {
        "paner:move-pane-item": function panerMovePaneItem() {
          return _this.movePaneItem();
        },
        "paner:move-pane-item-stay": function panerMovePaneItemStay() {
          return _this.movePaneItem({ stay: true });
        },

        "paner:exchange-pane": function panerExchangePane() {
          return _this.exchangePane();
        },
        "paner:exchange-pane-stay": function panerExchangePaneStay() {
          return _this.exchangePane({ stay: true });
        },

        "paner:split-pane-up": function panerSplitPaneUp() {
          return _this.splitPane("Up");
        },
        "paner:split-pane-down": function panerSplitPaneDown() {
          return _this.splitPane("Down");
        },
        "paner:split-pane-left": function panerSplitPaneLeft() {
          return _this.splitPane("Left");
        },
        "paner:split-pane-right": function panerSplitPaneRight() {
          return _this.splitPane("Right");
        },

        "paner:split-pane-up-stay": function panerSplitPaneUpStay() {
          return _this.splitPane("Up", { stay: true });
        },
        "paner:split-pane-down-stay": function panerSplitPaneDownStay() {
          return _this.splitPane("Down", { stay: true });
        },
        "paner:split-pane-left-stay": function panerSplitPaneLeftStay() {
          return _this.splitPane("Left", { stay: true });
        },
        "paner:split-pane-right-stay": function panerSplitPaneRightStay() {
          return _this.splitPane("Right", { stay: true });
        },

        "paner:move-pane-to-very-top": function panerMovePaneToVeryTop() {
          return _this.movePaneToVery("top");
        },
        "paner:move-pane-to-very-bottom": function panerMovePaneToVeryBottom() {
          return _this.movePaneToVery("bottom");
        },
        "paner:move-pane-to-very-left": function panerMovePaneToVeryLeft() {
          return _this.movePaneToVery("left");
        },
        "paner:move-pane-to-very-right": function panerMovePaneToVeryRight() {
          return _this.movePaneToVery("right");
        }
      }));
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      this.subscriptions.dispose();
    }

    // Valid direction: ["Up", "Down", "Left", "Right"]
  }, {
    key: "splitPane",
    value: function splitPane(direction) {
      var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _ref$stay = _ref.stay;
      var stay = _ref$stay === undefined ? false : _ref$stay;

      var activePane = atom.workspace.getActivePane();
      var activeEditor = activePane.getActiveEditor();
      var newPane = activePane["split" + direction]({ copyActiveItem: true });

      // Currently Pane cannot be created without initially activate.
      // So I revert activate pane manually if needed.
      if (stay) {
        activePane.activate();
      }

      if (!activeEditor) return;

      var oldEditor = activeEditor;
      var newEditor = newPane.getActiveEditor();
      switch (direction) {
        case "Right":
        case "Left":
          // FIXME: Not perfectly work when lastBufferRow is visible.
          var firstVisibleScreenRow = oldEditor.getFirstVisibleScreenRow();
          return;
        case "Up":
        case "Down":
          var pixelTop = oldEditor.element.pixelPositionForScreenPosition(oldEditor.getCursorScreenPosition()).top;
          var ratio = (pixelTop - oldEditor.element.getScrollTop()) / oldEditor.element.getHeight();

          var newHeight = newEditor.element.getHeight();
          var scrolloff = 2;
          var lineHeightInPixels = oldEditor.getLineHeightInPixels();
          var offsetTop = lineHeightInPixels * scrolloff;
          var offsetBottom = newHeight - lineHeightInPixels * (scrolloff + 1);
          var offsetCursor = newHeight * ratio;
          var scrollTop = pixelTop - Math.min(Math.max(offsetCursor, offsetTop), offsetBottom);

          oldEditor.element.setScrollTop(scrollTop);
          newEditor.element.setScrollTop(scrollTop);
          return;
      }
    }
  }, {
    key: "movePaneItem",
    value: function movePaneItem() {
      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref2$stay = _ref2.stay;
      var stay = _ref2$stay === undefined ? false : _ref2$stay;

      var activePane = atom.workspace.getActivePane();
      var adjacentPane = getAdjacentPane(activePane);
      if (adjacentPane) {
        var activeItem = activePane.getActiveItem();
        activePane.moveItemToPane(activeItem, adjacentPane, adjacentPane.getItems().length);
        adjacentPane.activateItem(activeItem);
        if (!stay) {
          adjacentPane.activate();
        }
      }
    }

    // Exchange activePane with adjacentPane
  }, {
    key: "exchangePane",
    value: function exchangePane() {
      var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref3$stay = _ref3.stay;
      var stay = _ref3$stay === undefined ? false : _ref3$stay;

      var activePane = atom.workspace.getActivePane();
      var adjacentPane = getAdjacentPane(activePane);
      if (!adjacentPane) return;
      if (stay && adjacentPane.children) {
        // adjacent was paneAxis
        return;
      }

      var parent = activePane.getParent();
      var children = parent.getChildren();

      if (children.indexOf(activePane) < children.indexOf(adjacentPane)) {
        parent.removeChild(activePane, true);
        parent.insertChildAfter(adjacentPane, activePane);
      } else {
        parent.removeChild(activePane, true);
        parent.insertChildBefore(adjacentPane, activePane);
      }

      if (stay) {
        adjacentPane.activate();
      } else {
        activePane.activate();
      }
    }

    // Valid direction ["top", "bottom", "left", "right"]
  }, {
    key: "movePaneToVery",
    value: function movePaneToVery(direction) {
      if (atom.workspace.getCenter().getPanes().length < 2) return;

      var activePane = atom.workspace.getActivePane();
      var container = activePane.getContainer();
      var parent = activePane.getParent();

      var originalRoot = container.getRoot();
      var root = originalRoot;
      // If there is multiple pane in window, root is always instance of PaneAxis
      if (!PaneAxis) PaneAxis = root.constructor;

      var finalOrientation = ["top", "bottom"].includes(direction) ? "vertical" : "horizontal";

      if (root.getOrientation() !== finalOrientation) {
        root = new PaneAxis({ orientation: finalOrientation, children: [root] }, atom.views);
        container.setRoot(root);
      }

      // avoid automatic reparenting by pssing 2nd arg(= replacing ) to `true`.
      parent.removeChild(activePane, true);

      var indexToAdd = ["top", "left"].includes(direction) ? 0 : undefined;
      root.addChild(activePane, indexToAdd);

      if (parent.getChildren().length === 1) {
        parent.reparentLastChild();
      }

      for (var paneAxis of getAllPaneAxis(root)) {
        var _parent = paneAxis.getParent();
        if (_parent instanceof PaneAxis && paneAxis.getOrientation() === _parent.getOrientation()) {
          var lastChild = undefined;
          for (var child of paneAxis.getChildren()) {
            if (!lastChild) {
              _parent.replaceChild(paneAxis, child);
            } else {
              _parent.insertChildAfter(lastChild, child);
            }
            lastChild = child;
          }
          paneAxis.destroy();
        }
      }

      activePane.activate();
    }
  }]);

  return PanerPackage;
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9wYW5lci9saWIvcGFuZXItcGFja2FnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7OztlQUVtQixPQUFPLENBQUMsTUFBTSxDQUFDOztJQUF0QyxtQkFBbUIsWUFBbkIsbUJBQW1COztBQUMxQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUE7Ozs7O0FBS25CLFNBQVMsZUFBZSxDQUFDLElBQUksRUFBRTtBQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDL0IsTUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsT0FBTTtBQUMxQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDL0MsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtNQUM3QixZQUFZLEdBQWUsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7TUFBaEMsUUFBUSxHQUEwQixRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQzs7QUFDMUUsU0FBTyxRQUFRLElBQUksWUFBWSxDQUFBO0NBQ2hDOztBQUVELFNBQVMsY0FBYyxDQUFDLElBQUksRUFBZTtNQUFiLE1BQU0seURBQUcsRUFBRTs7QUFDdkMsTUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDakIsU0FBSyxJQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pDLG9CQUFjLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0tBQzlCO0dBQ0Y7QUFDRCxTQUFPLE1BQU0sQ0FBQTtDQUNkOztBQUVELE1BQU0sQ0FBQyxPQUFPO1dBQVMsWUFBWTswQkFBWixZQUFZOzs7ZUFB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SSxDQUFDLENBQUE7O0FBRXBDLFVBQU0sVUFBVSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFBO0FBQ3RFLFVBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFBOztBQUVyQyxVQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3JDLGNBQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO09BQzNCOztBQUVELFdBQUssSUFBTSxRQUFRLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzNDLFlBQU0sT0FBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUNuQyxZQUFJLE9BQU0sWUFBWSxRQUFRLElBQUksUUFBUSxDQUFDLGNBQWMsRUFBRSxLQUFLLE9BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBRTtBQUN2RixjQUFJLFNBQVMsWUFBQSxDQUFBO0FBQ2IsZUFBSyxJQUFNLEtBQUssSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDMUMsZ0JBQUksQ0FBQyxTQUFTLEVBQUU7QUFDZCxxQkFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7YUFDckMsTUFBTTtBQUNMLHFCQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFBO2FBQzFDO0FBQ0QscUJBQVMsR0FBRyxLQUFLLENBQUE7V0FDbEI7QUFDRCxrQkFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO1NBQ25CO09BQ0Y7O0FBRUQsZ0JBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtLQUN0Qjs7O1NBcktvQixZQUFZO0lBc0tsQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9wYW5lci9saWIvcGFuZXItcGFja2FnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmNvbnN0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoXCJhdG9tXCIpXG5sZXQgUGFuZUF4aXMgPSBudWxsXG5cbi8vIFJldHVybiBhZGphY2VudCBwYW5lIG9mIGFjdGl2ZVBhbmUgd2l0aGluIGN1cnJlbnQgUGFuZUF4aXMuXG4vLyAgKiByZXR1cm4gbmV4dCBQYW5lIGlmIGV4aXN0cy5cbi8vICAqIHJldHVybiBwcmV2aW91cyBwYW5lIGlmIG5leHQgcGFuZSB3YXMgbm90IGV4aXRzLlxuZnVuY3Rpb24gZ2V0QWRqYWNlbnRQYW5lKHBhbmUpIHtcbiAgY29uc3QgcGFyZW50ID0gcGFuZS5nZXRQYXJlbnQoKVxuICBpZiAoIXBhcmVudCB8fCAhcGFyZW50LmdldENoaWxkcmVuKSByZXR1cm5cbiAgY29uc3QgY2hpbGRyZW4gPSBwYW5lLmdldFBhcmVudCgpLmdldENoaWxkcmVuKClcbiAgY29uc3QgaW5kZXggPSBjaGlsZHJlbi5pbmRleE9mKHBhbmUpXG4gIGNvbnN0IFtwcmV2aW91c1BhbmUsIG5leHRQYW5lXSA9IFtjaGlsZHJlbltpbmRleCAtIDFdLCBjaGlsZHJlbltpbmRleCArIDFdXVxuICByZXR1cm4gbmV4dFBhbmUgfHwgcHJldmlvdXNQYW5lXG59XG5cbmZ1bmN0aW9uIGdldEFsbFBhbmVBeGlzKHJvb3QsIHJlc3VsdCA9IFtdKSB7XG4gIGlmIChyb290LmNoaWxkcmVuKSB7XG4gICAgcmVzdWx0LnB1c2gocm9vdClcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHJvb3QuY2hpbGRyZW4pIHtcbiAgICAgIGdldEFsbFBhbmVBeGlzKGNoaWxkLCByZXN1bHQpXG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYW5lclBhY2thZ2Uge1xuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoXCJhdG9tLXdvcmtzcGFjZVwiLCB7XG4gICAgICAgIFwicGFuZXI6bW92ZS1wYW5lLWl0ZW1cIjogKCkgPT4gdGhpcy5tb3ZlUGFuZUl0ZW0oKSxcbiAgICAgICAgXCJwYW5lcjptb3ZlLXBhbmUtaXRlbS1zdGF5XCI6ICgpID0+IHRoaXMubW92ZVBhbmVJdGVtKHtzdGF5OiB0cnVlfSksXG5cbiAgICAgICAgXCJwYW5lcjpleGNoYW5nZS1wYW5lXCI6ICgpID0+IHRoaXMuZXhjaGFuZ2VQYW5lKCksXG4gICAgICAgIFwicGFuZXI6ZXhjaGFuZ2UtcGFuZS1zdGF5XCI6ICgpID0+IHRoaXMuZXhjaGFuZ2VQYW5lKHtzdGF5OiB0cnVlfSksXG5cbiAgICAgICAgXCJwYW5lcjpzcGxpdC1wYW5lLXVwXCI6ICgpID0+IHRoaXMuc3BsaXRQYW5lKFwiVXBcIiksXG4gICAgICAgIFwicGFuZXI6c3BsaXQtcGFuZS1kb3duXCI6ICgpID0+IHRoaXMuc3BsaXRQYW5lKFwiRG93blwiKSxcbiAgICAgICAgXCJwYW5lcjpzcGxpdC1wYW5lLWxlZnRcIjogKCkgPT4gdGhpcy5zcGxpdFBhbmUoXCJMZWZ0XCIpLFxuICAgICAgICBcInBhbmVyOnNwbGl0LXBhbmUtcmlnaHRcIjogKCkgPT4gdGhpcy5zcGxpdFBhbmUoXCJSaWdodFwiKSxcblxuICAgICAgICBcInBhbmVyOnNwbGl0LXBhbmUtdXAtc3RheVwiOiAoKSA9PiB0aGlzLnNwbGl0UGFuZShcIlVwXCIsIHtzdGF5OiB0cnVlfSksXG4gICAgICAgIFwicGFuZXI6c3BsaXQtcGFuZS1kb3duLXN0YXlcIjogKCkgPT4gdGhpcy5zcGxpdFBhbmUoXCJEb3duXCIsIHtzdGF5OiB0cnVlfSksXG4gICAgICAgIFwicGFuZXI6c3BsaXQtcGFuZS1sZWZ0LXN0YXlcIjogKCkgPT4gdGhpcy5zcGxpdFBhbmUoXCJMZWZ0XCIsIHtzdGF5OiB0cnVlfSksXG4gICAgICAgIFwicGFuZXI6c3BsaXQtcGFuZS1yaWdodC1zdGF5XCI6ICgpID0+IHRoaXMuc3BsaXRQYW5lKFwiUmlnaHRcIiwge3N0YXk6IHRydWV9KSxcblxuICAgICAgICBcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LXRvcFwiOiAoKSA9PiB0aGlzLm1vdmVQYW5lVG9WZXJ5KFwidG9wXCIpLFxuICAgICAgICBcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LWJvdHRvbVwiOiAoKSA9PiB0aGlzLm1vdmVQYW5lVG9WZXJ5KFwiYm90dG9tXCIpLFxuICAgICAgICBcInBhbmVyOm1vdmUtcGFuZS10by12ZXJ5LWxlZnRcIjogKCkgPT4gdGhpcy5tb3ZlUGFuZVRvVmVyeShcImxlZnRcIiksXG4gICAgICAgIFwicGFuZXI6bW92ZS1wYW5lLXRvLXZlcnktcmlnaHRcIjogKCkgPT4gdGhpcy5tb3ZlUGFuZVRvVmVyeShcInJpZ2h0XCIpLFxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxuXG4gIC8vIFZhbGlkIGRpcmVjdGlvbjogW1wiVXBcIiwgXCJEb3duXCIsIFwiTGVmdFwiLCBcIlJpZ2h0XCJdXG4gIHNwbGl0UGFuZShkaXJlY3Rpb24sIHtzdGF5ID0gZmFsc2V9ID0ge30pIHtcbiAgICBjb25zdCBhY3RpdmVQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgY29uc3QgYWN0aXZlRWRpdG9yID0gYWN0aXZlUGFuZS5nZXRBY3RpdmVFZGl0b3IoKVxuICAgIGNvbnN0IG5ld1BhbmUgPSBhY3RpdmVQYW5lW2BzcGxpdCR7ZGlyZWN0aW9ufWBdKHtjb3B5QWN0aXZlSXRlbTogdHJ1ZX0pXG5cbiAgICAvLyBDdXJyZW50bHkgUGFuZSBjYW5ub3QgYmUgY3JlYXRlZCB3aXRob3V0IGluaXRpYWxseSBhY3RpdmF0ZS5cbiAgICAvLyBTbyBJIHJldmVydCBhY3RpdmF0ZSBwYW5lIG1hbnVhbGx5IGlmIG5lZWRlZC5cbiAgICBpZiAoc3RheSkge1xuICAgICAgYWN0aXZlUGFuZS5hY3RpdmF0ZSgpXG4gICAgfVxuXG4gICAgaWYgKCFhY3RpdmVFZGl0b3IpIHJldHVyblxuXG4gICAgY29uc3Qgb2xkRWRpdG9yID0gYWN0aXZlRWRpdG9yXG4gICAgY29uc3QgbmV3RWRpdG9yID0gbmV3UGFuZS5nZXRBY3RpdmVFZGl0b3IoKVxuICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIFwiUmlnaHRcIjpcbiAgICAgIGNhc2UgXCJMZWZ0XCI6XG4gICAgICAgIC8vIEZJWE1FOiBOb3QgcGVyZmVjdGx5IHdvcmsgd2hlbiBsYXN0QnVmZmVyUm93IGlzIHZpc2libGUuXG4gICAgICAgIGNvbnN0IGZpcnN0VmlzaWJsZVNjcmVlblJvdyA9IG9sZEVkaXRvci5nZXRGaXJzdFZpc2libGVTY3JlZW5Sb3coKVxuICAgICAgICByZXR1cm5cbiAgICAgIGNhc2UgXCJVcFwiOlxuICAgICAgY2FzZSBcIkRvd25cIjpcbiAgICAgICAgY29uc3QgcGl4ZWxUb3AgPSBvbGRFZGl0b3IuZWxlbWVudC5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oXG4gICAgICAgICAgb2xkRWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKClcbiAgICAgICAgKS50b3BcbiAgICAgICAgY29uc3QgcmF0aW8gPSAocGl4ZWxUb3AgLSBvbGRFZGl0b3IuZWxlbWVudC5nZXRTY3JvbGxUb3AoKSkgLyBvbGRFZGl0b3IuZWxlbWVudC5nZXRIZWlnaHQoKVxuXG4gICAgICAgIGNvbnN0IG5ld0hlaWdodCA9IG5ld0VkaXRvci5lbGVtZW50LmdldEhlaWdodCgpXG4gICAgICAgIGNvbnN0IHNjcm9sbG9mZiA9IDJcbiAgICAgICAgY29uc3QgbGluZUhlaWdodEluUGl4ZWxzID0gb2xkRWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG4gICAgICAgIGNvbnN0IG9mZnNldFRvcCA9IGxpbmVIZWlnaHRJblBpeGVscyAqIHNjcm9sbG9mZlxuICAgICAgICBjb25zdCBvZmZzZXRCb3R0b20gPSBuZXdIZWlnaHQgLSBsaW5lSGVpZ2h0SW5QaXhlbHMgKiAoc2Nyb2xsb2ZmICsgMSlcbiAgICAgICAgY29uc3Qgb2Zmc2V0Q3Vyc29yID0gbmV3SGVpZ2h0ICogcmF0aW9cbiAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gcGl4ZWxUb3AgLSBNYXRoLm1pbihNYXRoLm1heChvZmZzZXRDdXJzb3IsIG9mZnNldFRvcCksIG9mZnNldEJvdHRvbSlcblxuICAgICAgICBvbGRFZGl0b3IuZWxlbWVudC5zZXRTY3JvbGxUb3Aoc2Nyb2xsVG9wKVxuICAgICAgICBuZXdFZGl0b3IuZWxlbWVudC5zZXRTY3JvbGxUb3Aoc2Nyb2xsVG9wKVxuICAgICAgICByZXR1cm5cbiAgICB9XG4gIH1cblxuICBtb3ZlUGFuZUl0ZW0oe3N0YXkgPSBmYWxzZX0gPSB7fSkge1xuICAgIGNvbnN0IGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICBjb25zdCBhZGphY2VudFBhbmUgPSBnZXRBZGphY2VudFBhbmUoYWN0aXZlUGFuZSlcbiAgICBpZiAoYWRqYWNlbnRQYW5lKSB7XG4gICAgICBjb25zdCBhY3RpdmVJdGVtID0gYWN0aXZlUGFuZS5nZXRBY3RpdmVJdGVtKClcbiAgICAgIGFjdGl2ZVBhbmUubW92ZUl0ZW1Ub1BhbmUoYWN0aXZlSXRlbSwgYWRqYWNlbnRQYW5lLCBhZGphY2VudFBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpXG4gICAgICBhZGphY2VudFBhbmUuYWN0aXZhdGVJdGVtKGFjdGl2ZUl0ZW0pXG4gICAgICBpZiAoIXN0YXkpIHtcbiAgICAgICAgYWRqYWNlbnRQYW5lLmFjdGl2YXRlKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBFeGNoYW5nZSBhY3RpdmVQYW5lIHdpdGggYWRqYWNlbnRQYW5lXG4gIGV4Y2hhbmdlUGFuZSh7c3RheSA9IGZhbHNlfSA9IHt9KSB7XG4gICAgY29uc3QgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIGNvbnN0IGFkamFjZW50UGFuZSA9IGdldEFkamFjZW50UGFuZShhY3RpdmVQYW5lKVxuICAgIGlmICghYWRqYWNlbnRQYW5lKSByZXR1cm5cbiAgICBpZiAoc3RheSAmJiBhZGphY2VudFBhbmUuY2hpbGRyZW4pIHtcbiAgICAgIC8vIGFkamFjZW50IHdhcyBwYW5lQXhpc1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgcGFyZW50ID0gYWN0aXZlUGFuZS5nZXRQYXJlbnQoKVxuICAgIGNvbnN0IGNoaWxkcmVuID0gcGFyZW50LmdldENoaWxkcmVuKClcblxuICAgIGlmIChjaGlsZHJlbi5pbmRleE9mKGFjdGl2ZVBhbmUpIDwgY2hpbGRyZW4uaW5kZXhPZihhZGphY2VudFBhbmUpKSB7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoYWN0aXZlUGFuZSwgdHJ1ZSlcbiAgICAgIHBhcmVudC5pbnNlcnRDaGlsZEFmdGVyKGFkamFjZW50UGFuZSwgYWN0aXZlUGFuZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGFjdGl2ZVBhbmUsIHRydWUpXG4gICAgICBwYXJlbnQuaW5zZXJ0Q2hpbGRCZWZvcmUoYWRqYWNlbnRQYW5lLCBhY3RpdmVQYW5lKVxuICAgIH1cblxuICAgIGlmIChzdGF5KSB7XG4gICAgICBhZGphY2VudFBhbmUuYWN0aXZhdGUoKVxuICAgIH0gZWxzZSB7XG4gICAgICBhY3RpdmVQYW5lLmFjdGl2YXRlKClcbiAgICB9XG4gIH1cblxuICAvLyBWYWxpZCBkaXJlY3Rpb24gW1widG9wXCIsIFwiYm90dG9tXCIsIFwibGVmdFwiLCBcInJpZ2h0XCJdXG4gIG1vdmVQYW5lVG9WZXJ5KGRpcmVjdGlvbikge1xuICAgIGlmIChhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCA8IDIpIHJldHVyblxuXG4gICAgY29uc3QgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGFjdGl2ZVBhbmUuZ2V0Q29udGFpbmVyKClcbiAgICBjb25zdCBwYXJlbnQgPSBhY3RpdmVQYW5lLmdldFBhcmVudCgpXG5cbiAgICBjb25zdCBvcmlnaW5hbFJvb3QgPSBjb250YWluZXIuZ2V0Um9vdCgpXG4gICAgbGV0IHJvb3QgPSBvcmlnaW5hbFJvb3RcbiAgICAvLyBJZiB0aGVyZSBpcyBtdWx0aXBsZSBwYW5lIGluIHdpbmRvdywgcm9vdCBpcyBhbHdheXMgaW5zdGFuY2Ugb2YgUGFuZUF4aXNcbiAgICBpZiAoIVBhbmVBeGlzKSBQYW5lQXhpcyA9IHJvb3QuY29uc3RydWN0b3JcblxuICAgIGNvbnN0IGZpbmFsT3JpZW50YXRpb24gPSBbXCJ0b3BcIiwgXCJib3R0b21cIl0uaW5jbHVkZXMoZGlyZWN0aW9uKSA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiXG5cbiAgICBpZiAocm9vdC5nZXRPcmllbnRhdGlvbigpICE9PSBmaW5hbE9yaWVudGF0aW9uKSB7XG4gICAgICByb290ID0gbmV3IFBhbmVBeGlzKHtvcmllbnRhdGlvbjogZmluYWxPcmllbnRhdGlvbiwgY2hpbGRyZW46IFtyb290XX0sIGF0b20udmlld3MpXG4gICAgICBjb250YWluZXIuc2V0Um9vdChyb290KVxuICAgIH1cblxuICAgIC8vIGF2b2lkIGF1dG9tYXRpYyByZXBhcmVudGluZyBieSBwc3NpbmcgMm5kIGFyZyg9IHJlcGxhY2luZyApIHRvIGB0cnVlYC5cbiAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoYWN0aXZlUGFuZSwgdHJ1ZSlcblxuICAgIGNvbnN0IGluZGV4VG9BZGQgPSBbXCJ0b3BcIiwgXCJsZWZ0XCJdLmluY2x1ZGVzKGRpcmVjdGlvbikgPyAwIDogdW5kZWZpbmVkXG4gICAgcm9vdC5hZGRDaGlsZChhY3RpdmVQYW5lLCBpbmRleFRvQWRkKVxuXG4gICAgaWYgKHBhcmVudC5nZXRDaGlsZHJlbigpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcGFyZW50LnJlcGFyZW50TGFzdENoaWxkKClcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHBhbmVBeGlzIG9mIGdldEFsbFBhbmVBeGlzKHJvb3QpKSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSBwYW5lQXhpcy5nZXRQYXJlbnQoKVxuICAgICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIFBhbmVBeGlzICYmIHBhbmVBeGlzLmdldE9yaWVudGF0aW9uKCkgPT09IHBhcmVudC5nZXRPcmllbnRhdGlvbigpKSB7XG4gICAgICAgIGxldCBsYXN0Q2hpbGRcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBwYW5lQXhpcy5nZXRDaGlsZHJlbigpKSB7XG4gICAgICAgICAgaWYgKCFsYXN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHBhcmVudC5yZXBsYWNlQ2hpbGQocGFuZUF4aXMsIGNoaWxkKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnQuaW5zZXJ0Q2hpbGRBZnRlcihsYXN0Q2hpbGQsIGNoaWxkKVxuICAgICAgICAgIH1cbiAgICAgICAgICBsYXN0Q2hpbGQgPSBjaGlsZFxuICAgICAgICB9XG4gICAgICAgIHBhbmVBeGlzLmRlc3Ryb3koKVxuICAgICAgfVxuICAgIH1cblxuICAgIGFjdGl2ZVBhbmUuYWN0aXZhdGUoKVxuICB9XG59XG4iXX0=