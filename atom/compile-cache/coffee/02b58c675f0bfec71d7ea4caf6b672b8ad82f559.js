(function() {
  var CompositeDisposable, Emitter, Pane, PaneAxis, _, debug, getActivePane, getAdjacentPane, getAllPaneAxis, getView, moveActivePaneItem, ref, reparent, splitPane, swapActiveItem, withConfig;

  _ = require('underscore-plus');

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  getView = function(model) {
    return atom.views.getView(model);
  };

  getActivePane = function() {
    return atom.workspace.getActivePane();
  };

  debug = function(msg) {
    console.log(msg);
    if (!atom.config.get('paner.debug')) {

    }
  };

  splitPane = function(pane, direction, params) {
    var method;
    method = "split" + (_.capitalize(direction));
    return pane[method](params);
  };

  withConfig = function(scope, value, fn) {
    var origialValue, restoreConfig;
    origialValue = atom.config.get(scope);
    if (origialValue !== value) {
      atom.config.set(scope, value);
      restoreConfig = function() {
        return atom.config.set(scope, origialValue);
      };
    }
    try {
      return fn();
    } finally {
      if (typeof restoreConfig === "function") {
        restoreConfig();
      }
    }
  };

  getAdjacentPane = function(pane) {
    var base, children, index, next, prev, ref1;
    if (!(children = typeof (base = pane.getParent()).getChildren === "function" ? base.getChildren() : void 0)) {
      return;
    }
    index = children.indexOf(pane);
    ref1 = [children[index - 1], children[index + 1]], prev = ref1[0], next = ref1[1];
    return _.last(_.compact([prev, next]));
  };

  moveActivePaneItem = function(srcPane, dstPane) {
    var index, item;
    item = srcPane.getActiveItem();
    index = dstPane.getItems().length;
    srcPane.moveItemToPane(item, dstPane, index);
    return dstPane.activateItem(item);
  };

  swapActiveItem = function(srcPane, dstPane) {
    var dstIndex, dstItem, srcIndex, srcItem;
    srcIndex = null;
    if ((srcItem = srcPane.getActiveItem()) != null) {
      srcIndex = srcPane.getActiveItemIndex();
    }
    dstIndex = null;
    if ((dstItem = dstPane.getActiveItem()) != null) {
      dstIndex = srcPane.getActiveItemIndex();
    }
    if (srcItem != null) {
      srcPane.moveItemToPane(srcItem, dstPane, dstIndex);
    }
    if (dstItem != null) {
      dstPane.moveItemToPane(dstItem, srcPane, srcIndex);
      srcPane.activateItem(dstItem);
    }
    return srcPane.activate();
  };

  reparent = function(paneAxis) {
    var anchor, child, i, j, len, parent, ref1;
    debug("reparent");
    parent = paneAxis.getParent();
    ref1 = paneAxis.getChildren();
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      child = ref1[i];
      if (i === 0) {
        parent.replaceChild(paneAxis, child);
      } else {
        parent.insertChildAfter(anchor, child);
      }
      anchor = child;
    }
    return paneAxis.destroy();
  };

  getAllPaneAxis = function(paneAxis, results) {
    var child, j, len, ref1;
    if (results == null) {
      results = [];
    }
    ref1 = paneAxis.getChildren();
    for (j = 0, len = ref1.length; j < len; j++) {
      child = ref1[j];
      if (!(child instanceof PaneAxis)) {
        continue;
      }
      results.push(child);
      getAllPaneAxis(child, results);
    }
    return results;
  };

  PaneAxis = null;

  Pane = null;

  module.exports = {
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.workspaceElement = getView(atom.workspace);
      Pane = getActivePane().constructor;
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
            return _this.splitPane('up');
          };
        })(this),
        'paner:split-down': (function(_this) {
          return function() {
            return _this.splitPane('down');
          };
        })(this),
        'paner:split-left': (function(_this) {
          return function() {
            return _this.splitPane('left');
          };
        })(this),
        'paner:split-right': (function(_this) {
          return function() {
            return _this.splitPane('right');
          };
        })(this),
        'paner:swap-pane': (function(_this) {
          return function() {
            return _this.swapPane();
          };
        })(this),
        'paner:very-top': (function(_this) {
          return function() {
            return _this.movePaneToVery('top');
          };
        })(this),
        'paner:very-bottom': (function(_this) {
          return function() {
            return _this.movePaneToVery('bottom');
          };
        })(this),
        'paner:very-left': (function(_this) {
          return function() {
            return _this.movePaneToVery('left');
          };
        })(this),
        'paner:very-right': (function(_this) {
          return function() {
            return _this.movePaneToVery('right');
          };
        })(this)
      }));
      return this.onDidPaneSplit(function(arg) {
        var direction, lineHeightInPixels, newEditor, newEditorElement, newHeight, newPane, offsetBottom, offsetCursor, offsetTop, oldEditor, oldEditorElement, oldPane, options, pixelTop, ratio, scrollTop, scrolloff;
        oldPane = arg.oldPane, newPane = arg.newPane, direction = arg.direction, options = arg.options;
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
      var ref1;
      this.subscriptions.dispose();
      return ref1 = {}, this.workspaceElement = ref1.workspaceElement, ref1;
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
    splitPane: function(direction) {
      var newPane, oldPane, options;
      oldPane = getActivePane();
      options = null;
      if (direction === 'up' || direction === 'down') {
        options = this.getCursorPositionInfo(oldPane.getActiveEditor());
      }
      newPane = splitPane(oldPane, direction, {
        copyActiveItem: true,
        activate: false
      });
      return this.emitter.emit('did-pane-split', {
        oldPane: oldPane,
        newPane: newPane,
        direction: direction,
        options: options
      });
    },
    swapItem: function() {
      var adjacentPane, currentPane;
      currentPane = getActivePane();
      if (adjacentPane = getAdjacentPane(currentPane)) {
        return withConfig('core.destroyEmptyPanes', false, function() {
          return swapActiveItem(currentPane, adjacentPane);
        });
      }
    },
    mergeItem: function(arg) {
      var activate, currentPane, dstPane;
      activate = (arg != null ? arg : {}).activate;
      currentPane = getActivePane();
      if (dstPane = getAdjacentPane(currentPane)) {
        moveActivePaneItem(currentPane, dstPane);
        if (activate) {
          return dstPane.activate();
        }
      }
    },
    swapPane: function() {
      var adjacentPane, children, index, pane, parent;
      pane = getActivePane();
      parent = pane.getParent();
      if (!(children = typeof parent.getChildren === "function" ? parent.getChildren() : void 0)) {
        return;
      }
      index = children.indexOf(pane);
      if (index === (children.length - 1)) {
        adjacentPane = children[index - 1];
        parent.removeChild(pane, true);
        parent.insertChildBefore(adjacentPane, pane);
      } else {
        adjacentPane = children[index + 1];
        parent.removeChild(pane, true);
        parent.insertChildAfter(adjacentPane, pane);
      }
      return pane.activate();
    },
    movePaneToVery: function(direction) {
      var axis, container, j, len, orientation, pane, parent, ref1, root;
      if (atom.workspace.getPanes().length < 2) {
        return;
      }
      pane = getActivePane();
      container = pane.getContainer();
      root = container.getRoot();
      orientation = direction === 'top' || direction === 'bottom' ? 'vertical' : 'horizontal';
      if (PaneAxis == null) {
        PaneAxis = root.constructor;
      }
      parent = pane.getParent();
      if (root.getOrientation() !== orientation) {
        container.setRoot(root = new PaneAxis({
          container: container,
          orientation: orientation,
          children: [root]
        }));
        parent.removeChild(pane);
      } else {
        parent.removeChild(pane, true);
      }
      switch (direction) {
        case 'top':
        case 'left':
          root.addChild(pane, 0);
          break;
        case 'right':
        case 'bottom':
          root.addChild(pane);
      }
      ref1 = getAllPaneAxis(root);
      for (j = 0, len = ref1.length; j < len; j++) {
        axis = ref1[j];
        if (axis.getOrientation() === axis.getParent().getOrientation()) {
          reparent(axis);
        }
      }
      return pane.activate();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3BhbmVyL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixNQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLDZDQUFELEVBQXNCOztFQUd0QixPQUFBLEdBQVUsU0FBQyxLQUFEO1dBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLEtBQW5CO0VBRFE7O0VBR1YsYUFBQSxHQUFnQixTQUFBO1dBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUE7RUFEYzs7RUFHaEIsS0FBQSxHQUFRLFNBQUMsR0FBRDtJQUNOLE9BQU8sQ0FBQyxHQUFSLENBQVksR0FBWjtJQUNBLElBQUEsQ0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsYUFBaEIsQ0FBZDtBQUFBOztFQUZNOztFQUlSLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxTQUFQLEVBQWtCLE1BQWxCO0FBQ1YsUUFBQTtJQUFBLE1BQUEsR0FBUyxPQUFBLEdBQU8sQ0FBQyxDQUFDLENBQUMsVUFBRixDQUFhLFNBQWIsQ0FBRDtXQUNoQixJQUFLLENBQUEsTUFBQSxDQUFMLENBQWEsTUFBYjtFQUZVOztFQUlaLFVBQUEsR0FBYSxTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsRUFBZjtBQUNYLFFBQUE7SUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLEtBQWhCO0lBQ2YsSUFBTyxZQUFBLEtBQWdCLEtBQXZCO01BQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLEtBQWhCLEVBQXVCLEtBQXZCO01BQ0EsYUFBQSxHQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLEtB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QixDQUFBLENBQTVCO1VBQ0UsUUFBQSxDQUFTLElBQVQsRUFERjs7QUFERjthQUlBLElBQUksQ0FBQyxRQUFMLENBQUE7SUF4QmMsQ0E3R2hCOztBQXRGRiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG57Q29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuXG4jIFV0aWxzXG5nZXRWaWV3ID0gKG1vZGVsKSAtPlxuICBhdG9tLnZpZXdzLmdldFZpZXcobW9kZWwpXG5cbmdldEFjdGl2ZVBhbmUgPSAtPlxuICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcblxuZGVidWcgPSAobXNnKSAtPlxuICBjb25zb2xlLmxvZyBtc2dcbiAgcmV0dXJuIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQoJ3BhbmVyLmRlYnVnJylcblxuc3BsaXRQYW5lID0gKHBhbmUsIGRpcmVjdGlvbiwgcGFyYW1zKSAtPlxuICBtZXRob2QgPSBcInNwbGl0I3tfLmNhcGl0YWxpemUoZGlyZWN0aW9uKX1cIlxuICBwYW5lW21ldGhvZF0ocGFyYW1zKVxuXG53aXRoQ29uZmlnID0gKHNjb3BlLCB2YWx1ZSwgZm4pIC0+XG4gIG9yaWdpYWxWYWx1ZSA9IGF0b20uY29uZmlnLmdldChzY29wZSlcbiAgdW5sZXNzIG9yaWdpYWxWYWx1ZSBpcyB2YWx1ZVxuICAgIGF0b20uY29uZmlnLnNldChzY29wZSwgdmFsdWUpXG4gICAgcmVzdG9yZUNvbmZpZyA9IC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoc2NvcGUsIG9yaWdpYWxWYWx1ZSlcbiAgdHJ5XG4gICAgZm4oKVxuICBmaW5hbGx5XG4gICAgcmVzdG9yZUNvbmZpZz8oKVxuXG4jIFJldHVybiBhZGphY2VudCBwYW5lIHdpdGhpbiBjdXJyZW50IFBhbmVBeGlzLlxuIyAgKiByZXR1cm4gbmV4dCBQYW5lIGlmIGV4aXN0cy5cbiMgICogcmV0dXJuIHByZXZpb3VzIHBhbmUgaWYgbmV4dCBwYW5lIHdhcyBub3QgZXhpdHMuXG5nZXRBZGphY2VudFBhbmUgPSAocGFuZSkgLT5cbiAgcmV0dXJuIHVubGVzcyBjaGlsZHJlbiA9IHBhbmUuZ2V0UGFyZW50KCkuZ2V0Q2hpbGRyZW4/KClcbiAgaW5kZXggPSBjaGlsZHJlbi5pbmRleE9mKHBhbmUpXG4gIFtwcmV2LCBuZXh0XSA9IFtjaGlsZHJlbltpbmRleC0xXSwgY2hpbGRyZW5baW5kZXgrMV1dXG4gIF8ubGFzdChfLmNvbXBhY3QoW3ByZXYsIG5leHRdKSlcblxuIyBNb3ZlIGFjdGl2ZSBpdGVtIGZyb20gc3JjUGFuZSB0byBkc3RQYW5lJ3MgbGFzdCBpbmRleFxubW92ZUFjdGl2ZVBhbmVJdGVtID0gKHNyY1BhbmUsIGRzdFBhbmUpIC0+XG4gIGl0ZW0gPSBzcmNQYW5lLmdldEFjdGl2ZUl0ZW0oKVxuICBpbmRleCA9IGRzdFBhbmUuZ2V0SXRlbXMoKS5sZW5ndGhcbiAgc3JjUGFuZS5tb3ZlSXRlbVRvUGFuZShpdGVtLCBkc3RQYW5lLCBpbmRleClcbiAgZHN0UGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbSlcblxuIyBbRklYTUVdIGFmdGVyIHN3YXBwZWQsIGRzdCBwYW5lIGhhdmUgbm8gZm9jdXMsIGJ1dCBjdXJzb3IgaXMgc3RpbGwgdmlzaWJsZS5cbiMgSSBjYW4gbWFudWFsbHkgY3Vyc29yLnNldFZpc2libGUoZmFsc2UpIGJ1dCB0aGlzIGNhdXNlIGN1cm9yIGlzIG5vdCB2aXNpYmxlXG4jIGFmdGVyIHBhbmUgZ290IGZvY3VzIGFnYWluLlxuc3dhcEFjdGl2ZUl0ZW0gPSAoc3JjUGFuZSwgZHN0UGFuZSkgLT5cbiAgc3JjSW5kZXggPSBudWxsXG4gIGlmIChzcmNJdGVtICA9IHNyY1BhbmUuZ2V0QWN0aXZlSXRlbSgpKT9cbiAgICBzcmNJbmRleCA9IHNyY1BhbmUuZ2V0QWN0aXZlSXRlbUluZGV4KClcblxuICBkc3RJbmRleCA9IG51bGxcbiAgaWYgKGRzdEl0ZW0gID0gZHN0UGFuZS5nZXRBY3RpdmVJdGVtKCkpP1xuICAgIGRzdEluZGV4ID0gc3JjUGFuZS5nZXRBY3RpdmVJdGVtSW5kZXgoKVxuXG4gIGlmIHNyY0l0ZW0/XG4gICAgc3JjUGFuZS5tb3ZlSXRlbVRvUGFuZShzcmNJdGVtLCBkc3RQYW5lLCBkc3RJbmRleClcblxuICBpZiBkc3RJdGVtP1xuICAgIGRzdFBhbmUubW92ZUl0ZW1Ub1BhbmUoZHN0SXRlbSwgc3JjUGFuZSwgc3JjSW5kZXgpXG4gICAgc3JjUGFuZS5hY3RpdmF0ZUl0ZW0oZHN0SXRlbSlcbiAgc3JjUGFuZS5hY3RpdmF0ZSgpXG5cbnJlcGFyZW50ID0gKHBhbmVBeGlzKSAtPlxuICBkZWJ1ZyhcInJlcGFyZW50XCIpXG4gIHBhcmVudCA9IHBhbmVBeGlzLmdldFBhcmVudCgpXG4gIGZvciBjaGlsZCwgaSBpbiBwYW5lQXhpcy5nZXRDaGlsZHJlbigpXG4gICAgaWYgaSBpcyAwXG4gICAgICBwYXJlbnQucmVwbGFjZUNoaWxkKHBhbmVBeGlzLCBjaGlsZClcbiAgICBlbHNlXG4gICAgICBwYXJlbnQuaW5zZXJ0Q2hpbGRBZnRlcihhbmNob3IsIGNoaWxkKVxuICAgIGFuY2hvciA9IGNoaWxkXG4gIHBhbmVBeGlzLmRlc3Ryb3koKVxuXG5nZXRBbGxQYW5lQXhpcyA9IChwYW5lQXhpcywgcmVzdWx0cz1bXSkgLT5cbiAgZm9yIGNoaWxkIGluIHBhbmVBeGlzLmdldENoaWxkcmVuKCkgd2hlbiBjaGlsZCBpbnN0YW5jZW9mIFBhbmVBeGlzXG4gICAgcmVzdWx0cy5wdXNoKGNoaWxkKVxuICAgIGdldEFsbFBhbmVBeGlzKGNoaWxkLCByZXN1bHRzKVxuICByZXN1bHRzXG5cblBhbmVBeGlzID0gbnVsbFxuUGFuZSA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAd29ya3NwYWNlRWxlbWVudCA9IGdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgUGFuZSA9IGdldEFjdGl2ZVBhbmUoKS5jb25zdHJ1Y3RvclxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ3BhbmVyOm1heGltaXplJzogPT4gQG1heGltaXplKClcbiAgICAgICdwYW5lcjpzd2FwLWl0ZW0nOiA9PiBAc3dhcEl0ZW0oKVxuICAgICAgJ3BhbmVyOm1lcmdlLWl0ZW0nOiA9PiBAbWVyZ2VJdGVtKGFjdGl2YXRlOiB0cnVlKVxuICAgICAgJ3BhbmVyOnNlbmQtaXRlbSc6ID0+IEBtZXJnZUl0ZW0oYWN0aXZhdGU6IGZhbHNlKVxuXG5cbiAgICAgICdwYW5lcjpzcGxpdC11cCc6ID0+IEBzcGxpdFBhbmUoJ3VwJylcbiAgICAgICdwYW5lcjpzcGxpdC1kb3duJzogPT4gQHNwbGl0UGFuZSgnZG93bicpXG4gICAgICAncGFuZXI6c3BsaXQtbGVmdCc6ID0+IEBzcGxpdFBhbmUoJ2xlZnQnKVxuICAgICAgJ3BhbmVyOnNwbGl0LXJpZ2h0JzogPT4gQHNwbGl0UGFuZSgncmlnaHQnKVxuXG4gICAgICAncGFuZXI6c3dhcC1wYW5lJzogPT4gQHN3YXBQYW5lKClcblxuICAgICAgJ3BhbmVyOnZlcnktdG9wJzogPT4gQG1vdmVQYW5lVG9WZXJ5KCd0b3AnKVxuICAgICAgJ3BhbmVyOnZlcnktYm90dG9tJzogPT4gQG1vdmVQYW5lVG9WZXJ5KCdib3R0b20nKVxuICAgICAgJ3BhbmVyOnZlcnktbGVmdCc6ID0+IEBtb3ZlUGFuZVRvVmVyeSgnbGVmdCcpXG4gICAgICAncGFuZXI6dmVyeS1yaWdodCc6ID0+IEBtb3ZlUGFuZVRvVmVyeSgncmlnaHQnKVxuXG4gICAgQG9uRGlkUGFuZVNwbGl0ICh7b2xkUGFuZSwgbmV3UGFuZSwgZGlyZWN0aW9uLCBvcHRpb25zfSkgLT5cbiAgICAgIHJldHVybiB1bmxlc3Mgb2xkRWRpdG9yID0gb2xkUGFuZS5nZXRBY3RpdmVFZGl0b3IoKVxuICAgICAgb2xkRWRpdG9yRWxlbWVudCA9IGdldFZpZXcob2xkRWRpdG9yKVxuICAgICAgbmV3RWRpdG9yID0gbmV3UGFuZS5nZXRBY3RpdmVFZGl0b3IoKVxuICAgICAgbmV3RWRpdG9yRWxlbWVudCA9IGdldFZpZXcobmV3RWRpdG9yKVxuICAgICAgc3dpdGNoIGRpcmVjdGlvblxuICAgICAgICB3aGVuICdyaWdodCcsICdsZWZ0J1xuICAgICAgICAgIG5ld0VkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKG9sZEVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkpXG5cbiAgICAgICAgd2hlbiAndXAnLCAnZG93bidcbiAgICAgICAgICB7cGl4ZWxUb3AsIHJhdGlvfSA9IG9wdGlvbnNcbiAgICAgICAgICBuZXdIZWlnaHQgPSBuZXdFZGl0b3JFbGVtZW50LmdldEhlaWdodCgpXG4gICAgICAgICAgc2Nyb2xsb2ZmID0gMlxuICAgICAgICAgIGxpbmVIZWlnaHRJblBpeGVscyA9IG9sZEVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKVxuXG4gICAgICAgICAgb2Zmc2V0VG9wID0gbGluZUhlaWdodEluUGl4ZWxzICogc2Nyb2xsb2ZmXG4gICAgICAgICAgb2Zmc2V0Qm90dG9tID0gbmV3SGVpZ2h0IC0gbGluZUhlaWdodEluUGl4ZWxzICogKHNjcm9sbG9mZisxKVxuICAgICAgICAgIG9mZnNldEN1cnNvciA9IG5ld0hlaWdodCAqIHJhdGlvXG4gICAgICAgICAgc2Nyb2xsVG9wID0gcGl4ZWxUb3AgLSBNYXRoLm1pbihNYXRoLm1heChvZmZzZXRDdXJzb3IsIG9mZnNldFRvcCksIG9mZnNldEJvdHRvbSlcblxuICAgICAgICAgIG9sZEVkaXRvckVsZW1lbnQuc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcClcbiAgICAgICAgICBuZXdFZGl0b3JFbGVtZW50LnNldFNjcm9sbFRvcChzY3JvbGxUb3ApXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB7QHdvcmtzcGFjZUVsZW1lbnR9ID0ge31cblxuICBvbkRpZFBhbmVTcGxpdDogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtcGFuZS1zcGxpdCcsIGNhbGxiYWNrXG5cbiAgIyBTaW1wbHkgYWRkL3JlbW92ZSBjc3MgY2xhc3MsIGFjdHVhbCBtYXhpbWl6YXRpb24gZWZmZWN0IGlzIGRvbmUgYnkgQ1NTLlxuICBtYXhpbWl6ZTogLT5cbiAgICBAd29ya3NwYWNlRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdwYW5lci1tYXhpbWl6ZScpXG4gICAgc3VicyA9IGdldEFjdGl2ZVBhbmUoKS5vbkRpZENoYW5nZUFjdGl2ZSA9PlxuICAgICAgQHdvcmtzcGFjZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgncGFuZXItbWF4aW1pemUnKVxuICAgICAgc3Vicy5kaXNwb3NlKClcblxuICBnZXRDdXJzb3JQb3NpdGlvbkluZm86IChlZGl0b3IpIC0+XG4gICAgZWRpdG9yRWxlbWVudCA9IGdldFZpZXcoZWRpdG9yKVxuICAgIHBvaW50ID0gZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKClcbiAgICBwaXhlbFRvcCA9IGVkaXRvckVsZW1lbnQucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKHBvaW50KS50b3BcbiAgICByYXRpbyA9IChwaXhlbFRvcCAtIGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkpIC8gZWRpdG9yRWxlbWVudC5nZXRIZWlnaHQoKVxuICAgIHtwaXhlbFRvcCwgcmF0aW99XG5cbiAgc3BsaXRQYW5lOiAoZGlyZWN0aW9uKSAtPlxuICAgIG9sZFBhbmUgPSBnZXRBY3RpdmVQYW5lKClcbiAgICBvcHRpb25zID0gbnVsbFxuICAgIGlmIGRpcmVjdGlvbiBpbiBbJ3VwJywgJ2Rvd24nXVxuICAgICAgb3B0aW9ucyA9IEBnZXRDdXJzb3JQb3NpdGlvbkluZm8ob2xkUGFuZS5nZXRBY3RpdmVFZGl0b3IoKSlcbiAgICBuZXdQYW5lID0gc3BsaXRQYW5lKG9sZFBhbmUsIGRpcmVjdGlvbiwgY29weUFjdGl2ZUl0ZW06IHRydWUsIGFjdGl2YXRlOiBmYWxzZSlcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtcGFuZS1zcGxpdCcsIHtvbGRQYW5lLCBuZXdQYW5lLCBkaXJlY3Rpb24sIG9wdGlvbnN9XG5cbiAgc3dhcEl0ZW06IC0+XG4gICAgY3VycmVudFBhbmUgPSBnZXRBY3RpdmVQYW5lKClcbiAgICBpZiBhZGphY2VudFBhbmUgPSBnZXRBZGphY2VudFBhbmUoY3VycmVudFBhbmUpXG4gICAgICAjIEluIGNhc2UgdGhlcmUgaXMgb25seSBvbmUgaXRlbSBpbiBwYW5lLCB3ZSBuZWVkIHRvIGF2b2lkIHBhbmUgaXRzZWxmXG4gICAgICAjIGRlc3Ryb3llZCB3aGlsZSBzd2FwcGluZy5cbiAgICAgIHdpdGhDb25maWcgJ2NvcmUuZGVzdHJveUVtcHR5UGFuZXMnLCBmYWxzZSwgLT5cbiAgICAgICAgc3dhcEFjdGl2ZUl0ZW0oY3VycmVudFBhbmUsIGFkamFjZW50UGFuZSlcblxuICBtZXJnZUl0ZW06ICh7YWN0aXZhdGV9PXt9KSAtPlxuICAgIGN1cnJlbnRQYW5lID0gZ2V0QWN0aXZlUGFuZSgpXG4gICAgaWYgZHN0UGFuZSA9IGdldEFkamFjZW50UGFuZShjdXJyZW50UGFuZSlcbiAgICAgIG1vdmVBY3RpdmVQYW5lSXRlbShjdXJyZW50UGFuZSwgZHN0UGFuZSlcbiAgICAgIGRzdFBhbmUuYWN0aXZhdGUoKSBpZiBhY3RpdmF0ZVxuXG4gIHN3YXBQYW5lOiAtPlxuICAgIHBhbmUgPSBnZXRBY3RpdmVQYW5lKClcbiAgICBwYXJlbnQgPSBwYW5lLmdldFBhcmVudCgpXG5cbiAgICByZXR1cm4gdW5sZXNzIGNoaWxkcmVuID0gcGFyZW50LmdldENoaWxkcmVuPygpXG5cbiAgICBpbmRleCA9IGNoaWxkcmVuLmluZGV4T2YocGFuZSlcbiAgICBpZiBpbmRleCBpcyAoY2hpbGRyZW4ubGVuZ3RoIC0gMSlcbiAgICAgIGFkamFjZW50UGFuZSA9IGNoaWxkcmVuW2luZGV4IC0gMV1cbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYW5lLCB0cnVlKVxuICAgICAgcGFyZW50Lmluc2VydENoaWxkQmVmb3JlKGFkamFjZW50UGFuZSwgcGFuZSlcbiAgICBlbHNlXG4gICAgICBhZGphY2VudFBhbmUgPSBjaGlsZHJlbltpbmRleCArIDFdXG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQocGFuZSwgdHJ1ZSlcbiAgICAgIHBhcmVudC5pbnNlcnRDaGlsZEFmdGVyKGFkamFjZW50UGFuZSwgcGFuZSlcblxuICAgIHBhbmUuYWN0aXZhdGUoKVxuXG4gIG1vdmVQYW5lVG9WZXJ5OiAoZGlyZWN0aW9uKSAtPlxuICAgIHJldHVybiBpZiBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpLmxlbmd0aCA8IDJcbiAgICBwYW5lID0gZ2V0QWN0aXZlUGFuZSgpXG4gICAgY29udGFpbmVyID0gcGFuZS5nZXRDb250YWluZXIoKVxuICAgIHJvb3QgPSBjb250YWluZXIuZ2V0Um9vdCgpXG4gICAgb3JpZW50YXRpb24gPSBpZiBkaXJlY3Rpb24gaW4gWyd0b3AnLCAnYm90dG9tJ10gdGhlbiAndmVydGljYWwnIGVsc2UgJ2hvcml6b250YWwnXG5cbiAgICAjIElmIHRoZXJlIGlzIG11bHRpcGxlIHBhbmUgaW4gd2luZG93LCByb290IGlzIGFsd2F5cyBpbnN0YW5jZSBvZiBQYW5lQXhpc1xuICAgIFBhbmVBeGlzID89IHJvb3QuY29uc3RydWN0b3JcbiAgICBwYXJlbnQgPSBwYW5lLmdldFBhcmVudCgpXG4gICAgaWYgcm9vdC5nZXRPcmllbnRhdGlvbigpIGlzbnQgb3JpZW50YXRpb25cbiAgICAgIGNvbnRhaW5lci5zZXRSb290KHJvb3QgPSBuZXcgUGFuZUF4aXMoe2NvbnRhaW5lciwgb3JpZW50YXRpb24sIGNoaWxkcmVuOiBbcm9vdF19KSlcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYW5lKVxuICAgIGVsc2VcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYW5lLCB0cnVlKVxuXG4gICAgc3dpdGNoIGRpcmVjdGlvblxuICAgICAgd2hlbiAndG9wJywgJ2xlZnQnIHRoZW4gcm9vdC5hZGRDaGlsZChwYW5lLCAwKVxuICAgICAgd2hlbiAncmlnaHQnLCAnYm90dG9tJyB0aGVuIHJvb3QuYWRkQ2hpbGQocGFuZSlcblxuICAgIGZvciBheGlzIGluIGdldEFsbFBhbmVBeGlzKHJvb3QpXG4gICAgICBpZiBheGlzLmdldE9yaWVudGF0aW9uKCkgaXMgYXhpcy5nZXRQYXJlbnQoKS5nZXRPcmllbnRhdGlvbigpXG4gICAgICAgIHJlcGFyZW50KGF4aXMpXG5cbiAgICBwYW5lLmFjdGl2YXRlKClcbiJdfQ==
