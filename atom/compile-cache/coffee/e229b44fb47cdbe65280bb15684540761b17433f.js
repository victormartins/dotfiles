(function() {
  var CompositeDisposable, Config, Emitter, Pane, PaneAxis, copyPaneAxis, copyRoot, debug, getActivePane, getAdjacentPane, getAllPaneAxis, getView, isSameOrientationAsParent, mergeToParentPaneAxis, moveActivePaneItem, moveAllPaneItems, resetPreviewStateForPane, setConfig, splitPane, swapActiveItem, _ref, _ref1;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ref1 = require('./utils'), debug = _ref1.debug, getView = _ref1.getView, getActivePane = _ref1.getActivePane, splitPane = _ref1.splitPane, resetPreviewStateForPane = _ref1.resetPreviewStateForPane, setConfig = _ref1.setConfig, getAdjacentPane = _ref1.getAdjacentPane, moveActivePaneItem = _ref1.moveActivePaneItem, swapActiveItem = _ref1.swapActiveItem, moveAllPaneItems = _ref1.moveAllPaneItems, mergeToParentPaneAxis = _ref1.mergeToParentPaneAxis, getAllPaneAxis = _ref1.getAllPaneAxis, copyPaneAxis = _ref1.copyPaneAxis, copyRoot = _ref1.copyRoot, isSameOrientationAsParent = _ref1.isSameOrientationAsParent;

  PaneAxis = null;

  Pane = null;

  Config = {
    debug: {
      type: 'boolean',
      "default": false
    },
    mergeSameOrientaion: {
      type: 'boolean',
      "default": true,
      description: "When moving very far, merge child PaneAxis to Parent if orientaion is same"
    }
  };

  module.exports = {
    config: Config,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.workspaceElement = getView(atom.workspace);
      Pane = atom.workspace.getActivePane().constructor;
      this.emitter = new Emitter;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'paner:maximize': (function(_this) {
          return function() {
            return _this.maximize();
          };
        })(this),
        'paner:swap-item': (function(_this) {
          return function() {
            return _this.swapItem();
          };
        })(this),
        'paner:merge-item': (function(_this) {
          return function() {
            return _this.mergeItem({
              activate: true
            });
          };
        })(this),
        'paner:send-item': (function(_this) {
          return function() {
            return _this.mergeItem({
              activate: false
            });
          };
        })(this),
        'paner:split-up': (function(_this) {
          return function() {
            return _this.split('up');
          };
        })(this),
        'paner:split-down': (function(_this) {
          return function() {
            return _this.split('down');
          };
        })(this),
        'paner:split-left': (function(_this) {
          return function() {
            return _this.split('left');
          };
        })(this),
        'paner:split-right': (function(_this) {
          return function() {
            return _this.split('right');
          };
        })(this),
        'paner:very-top': (function(_this) {
          return function() {
            return _this.moveToVery('top');
          };
        })(this),
        'paner:very-bottom': (function(_this) {
          return function() {
            return _this.moveToVery('bottom');
          };
        })(this),
        'paner:very-left': (function(_this) {
          return function() {
            return _this.moveToVery('left');
          };
        })(this),
        'paner:very-right': (function(_this) {
          return function() {
            return _this.moveToVery('right');
          };
        })(this)
      }));
      return this.onDidPaneSplit(function(_arg) {
        var direction, lineHeightInPixels, newEditor, newEditorElement, newHeight, newPane, offsetBottom, offsetCursor, offsetTop, oldEditor, oldEditorElement, oldPane, options, pixelTop, ratio, scrollTop, scrolloff;
        oldPane = _arg.oldPane, newPane = _arg.newPane, direction = _arg.direction, options = _arg.options;
        if (!(oldEditor = oldPane.getActiveEditor())) {
          return;
        }
        oldEditorElement = getView(oldEditor);
        newEditor = newPane.getActiveEditor();
        newEditorElement = getView(newEditor);
        switch (direction) {
          case 'right':
          case 'left':
            return newEditorElement.setScrollTop(oldEditorElement.getScrollTop());
          case 'up':
          case 'down':
            pixelTop = options.pixelTop, ratio = options.ratio;
            newHeight = newEditorElement.getHeight();
            scrolloff = 2;
            lineHeightInPixels = oldEditor.getLineHeightInPixels();
            offsetTop = lineHeightInPixels * scrolloff;
            offsetBottom = newHeight - lineHeightInPixels * (scrolloff + 1);
            offsetCursor = newHeight * ratio;
            scrollTop = pixelTop - Math.min(Math.max(offsetCursor, offsetTop), offsetBottom);
            oldEditorElement.setScrollTop(scrollTop);
            return newEditorElement.setScrollTop(scrollTop);
        }
      });
    },
    deactivate: function() {
      var _ref2;
      this.subscriptions.dispose();
      return _ref2 = {}, Pane = _ref2.Pane, PaneAxis = _ref2.PaneAxis, this.workspaceElement = _ref2.workspaceElement, _ref2;
    },
    onDidPaneSplit: function(callback) {
      return this.emitter.on('did-pane-split', callback);
    },
    maximize: function() {
      var subs;
      this.workspaceElement.classList.toggle('paner-maximize');
      return subs = getActivePane().onDidChangeActive((function(_this) {
        return function() {
          _this.workspaceElement.classList.remove('paner-maximize');
          return subs.dispose();
        };
      })(this));
    },
    getCursorPositionInfo: function(editor) {
      var editorElement, pixelTop, point, ratio;
      editorElement = getView(editor);
      point = editor.getCursorScreenPosition();
      pixelTop = editorElement.pixelPositionForScreenPosition(point).top;
      ratio = (pixelTop - editorElement.getScrollTop()) / editorElement.getHeight();
      return {
        pixelTop: pixelTop,
        ratio: ratio
      };
    },
    split: function(direction) {
      var newPane, oldPane, options;
      oldPane = getActivePane();
      options = null;
      if (direction === 'up' || direction === 'down') {
        options = this.getCursorPositionInfo(oldPane.getActiveEditor());
      }
      newPane = splitPane(oldPane, direction);
      return this.emitter.emit('did-pane-split', {
        oldPane: oldPane,
        newPane: newPane,
        direction: direction,
        options: options
      });
    },
    swapItem: function() {
      var adjacentPane, currentPane, restoreConfig;
      currentPane = getActivePane();
      if (adjacentPane = getAdjacentPane(currentPane)) {
        try {
          restoreConfig = setConfig('core.destroyEmptyPanes', false);
          return swapActiveItem(currentPane, adjacentPane);
        } finally {
          if (typeof restoreConfig === "function") {
            restoreConfig();
          }
        }
      }
    },
    mergeItem: function(_arg) {
      var activate, currentPane, dstPane;
      activate = (_arg != null ? _arg : {}).activate;
      currentPane = getActivePane();
      if (dstPane = getAdjacentPane(currentPane)) {
        moveActivePaneItem(currentPane, dstPane);
        if (activate) {
          return dstPane.activate();
        }
      }
    },
    moveToVery: function(direction) {
      var axis, children, container, currentPane, newPane, orientation, root, _i, _len, _ref2;
      if (atom.workspace.getPanes().length < 2) {
        return;
      }
      currentPane = getActivePane();
      container = currentPane.getContainer();
      root = container.getRoot();
      orientation = direction === 'top' || direction === 'bottom' ? 'vertical' : 'horizontal';
      if (PaneAxis == null) {
        PaneAxis = root.constructor;
      }
      if (root.getOrientation() !== orientation) {
        debug("Different orientation");
        children = [copyRoot(root)];
        root.destroy();
        container.setRoot(root = new PaneAxis({
          container: container,
          orientation: orientation,
          children: children
        }));
      }
      newPane = new Pane();
      switch (direction) {
        case 'top':
        case 'left':
          root.addChild(newPane, 0);
          break;
        case 'right':
        case 'bottom':
          root.addChild(newPane);
      }
      moveAllPaneItems(currentPane, newPane);
      currentPane.destroy();
      if (atom.config.get('paner.mergeSameOrientaion')) {
        _ref2 = getAllPaneAxis(root);
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          axis = _ref2[_i];
          if (!(isSameOrientationAsParent(axis))) {
            continue;
          }
          debug("merge to parent!!");
          mergeToParentPaneAxis(axis);
        }
      }
      return newPane.activate();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3BhbmVyL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpVEFBQTs7QUFBQSxFQUFBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUF0QixDQUFBOztBQUFBLEVBQ0EsUUFnQkksT0FBQSxDQUFRLFNBQVIsQ0FoQkosRUFDRSxjQUFBLEtBREYsRUFFRSxnQkFBQSxPQUZGLEVBR0Usc0JBQUEsYUFIRixFQUlFLGtCQUFBLFNBSkYsRUFLRSxpQ0FBQSx3QkFMRixFQU1FLGtCQUFBLFNBTkYsRUFPRSx3QkFBQSxlQVBGLEVBUUUsMkJBQUEsa0JBUkYsRUFTRSx1QkFBQSxjQVRGLEVBVUUseUJBQUEsZ0JBVkYsRUFXRSw4QkFBQSxxQkFYRixFQVlFLHVCQUFBLGNBWkYsRUFhRSxxQkFBQSxZQWJGLEVBY0UsaUJBQUEsUUFkRixFQWVFLGtDQUFBLHlCQWhCRixDQUFBOztBQUFBLEVBbUJBLFFBQUEsR0FBVyxJQW5CWCxDQUFBOztBQUFBLEVBb0JBLElBQUEsR0FBTyxJQXBCUCxDQUFBOztBQUFBLEVBd0JBLE1BQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLE1BQ0EsU0FBQSxFQUFTLEtBRFQ7S0FERjtBQUFBLElBR0EsbUJBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxNQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsTUFFQSxXQUFBLEVBQWEsNEVBRmI7S0FKRjtHQXpCRixDQUFBOztBQUFBLEVBaUNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFBUSxNQUFSO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGdCQUFELEdBQW9CLE9BQUEsQ0FBUSxJQUFJLENBQUMsU0FBYixDQURwQixDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxXQUZ0QyxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUhYLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSxnQkFBQSxFQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsUUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQjtBQUFBLFFBQ0EsaUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEckI7QUFBQSxRQUVBLGtCQUFBLEVBQXFCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxTQUFELENBQVc7QUFBQSxjQUFDLFFBQUEsRUFBVSxJQUFYO2FBQVgsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRnJCO0FBQUEsUUFHQSxpQkFBQSxFQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsY0FBQyxRQUFBLEVBQVUsS0FBWDthQUFYLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUhyQjtBQUFBLFFBS0EsZ0JBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLEtBQUQsQ0FBTyxJQUFQLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxyQjtBQUFBLFFBTUEsa0JBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLEtBQUQsQ0FBTyxNQUFQLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU5yQjtBQUFBLFFBT0Esa0JBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLEtBQUQsQ0FBTyxNQUFQLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVByQjtBQUFBLFFBUUEsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLEtBQUQsQ0FBTyxPQUFQLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVJyQjtBQUFBLFFBVUEsZ0JBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFVBQUQsQ0FBWSxLQUFaLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVZyQjtBQUFBLFFBV0EsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFVBQUQsQ0FBWSxRQUFaLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVhyQjtBQUFBLFFBWUEsaUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJB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

//# sourceURL=/Users/victor.martins/.atom/packages/paner/lib/main.coffee
