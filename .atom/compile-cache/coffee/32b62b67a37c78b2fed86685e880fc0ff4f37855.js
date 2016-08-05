(function() {
  var PaneAxis, copyPaneAxis, copyRoot, debug, getActivePane, getAdjacentPane, getAllPaneAxis, getView, isSameOrientationAsParent, mergeToParentPaneAxis, moveActivePaneItem, moveAllPaneItems, resetPreviewStateForPane, setConfig, splitPane, swapActiveItem, _;

  _ = require('underscore-plus');

  getView = function(model) {
    return atom.views.getView(model);
  };

  getActivePane = function() {
    return atom.workspace.getActivePane();
  };

  debug = function(msg) {
    if (!atom.config.get('paner.debug')) {
      return;
    }
    return console.log(msg);
  };

  splitPane = function(pane, direction) {
    var method;
    method = "split" + (_.capitalize(direction));
    return pane[method]({
      copyActiveItem: true,
      activate: false
    });
  };

  resetPreviewStateForPane = function(pane) {
    var paneElement, _ref;
    paneElement = atom.views.getView(pane);
    return (_ref = paneElement.getElementsByClassName('preview-tab')[0]) != null ? _ref.clearPreview() : void 0;
  };

  setConfig = function(scope, value) {
    var origialValue;
    origialValue = atom.config.get(scope);
    if (origialValue !== value) {
      atom.config.set(scope, value);
      return function() {
        return atom.config.set(scope, origialValue);
      };
    }
  };

  getAdjacentPane = function(pane) {
    var children, index, next, prev, _base, _ref;
    if (!(children = typeof (_base = pane.getParent()).getChildren === "function" ? _base.getChildren() : void 0)) {
      return;
    }
    index = children.indexOf(pane);
    _ref = [children[index - 1], children[index + 1]], prev = _ref[0], next = _ref[1];
    return _.last(_.compact([prev, next]));
  };

  moveActivePaneItem = function(srcPane, dstPane) {
    var index, item;
    item = srcPane.getActiveItem();
    index = dstPane.getItems().length;
    resetPreviewStateForPane(dstPane);
    srcPane.moveItemToPane(item, dstPane, index);
    dstPane.activateItem(item);
    return resetPreviewStateForPane(dstPane);
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

  moveAllPaneItems = function(srcPane, dstPane) {
    var activeItem, i, item, _i, _len, _ref;
    activeItem = srcPane.getActiveItem();
    _ref = srcPane.getItems();
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      item = _ref[i];
      srcPane.moveItemToPane(item, dstPane, i);
      resetPreviewStateForPane(dstPane);
    }
    return dstPane.activateItem(activeItem);
  };

  isSameOrientationAsParent = function(paneAxis) {
    var parent;
    parent = paneAxis.getParent();
    return paneAxis.getOrientation() === parent.getOrientation();
  };

  mergeToParentPaneAxis = function(paneAxis) {
    var child, children, firstChild, parent;
    parent = paneAxis.getParent();
    children = paneAxis.getChildren();
    firstChild = children.shift();
    firstChild.setFlexScale();
    parent.replaceChild(paneAxis, firstChild);
    while ((child = children.shift())) {
      parent.insertChildAfter(firstChild, child);
    }
    return paneAxis.destroy();
  };

  PaneAxis = null;

  getAllPaneAxis = function(paneAxis, results) {
    var child, _i, _len, _ref;
    if (results == null) {
      results = [];
    }
    if (PaneAxis == null) {
      PaneAxis = paneAxis.constructor;
    }
    _ref = paneAxis.getChildren();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (child instanceof PaneAxis) {
        results.push(child);
        getAllPaneAxis(child, results);
      }
    }
    return results;
  };

  copyPaneAxis = function(paneAxis) {
    var c, children, container, orientation, _i, _len;
    if (PaneAxis == null) {
      PaneAxis = paneAxis.constructor;
    }
    children = paneAxis.getChildren();
    for (_i = 0, _len = children.length; _i < _len; _i++) {
      c = children[_i];
      paneAxis.unsubscribeFromChild(c);
    }
    container = paneAxis.getContainer();
    orientation = paneAxis.getOrientation();
    return new PaneAxis({
      container: container,
      orientation: orientation,
      children: children
    });
  };

  copyRoot = function(root) {
    var axis, newRoot, _i, _len, _ref;
    newRoot = copyPaneAxis(root);
    _ref = getAllPaneAxis(newRoot);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      axis = _ref[_i];
      axis.getParent().replaceChild(axis, copyPaneAxis(axis));
      axis.destroy();
    }
    return newRoot;
  };

  module.exports = {
    getView: getView,
    getActivePane: getActivePane,
    debug: debug,
    splitPane: splitPane,
    resetPreviewStateForPane: resetPreviewStateForPane,
    setConfig: setConfig,
    getAdjacentPane: getAdjacentPane,
    moveActivePaneItem: moveActivePaneItem,
    swapActiveItem: swapActiveItem,
    moveAllPaneItems: moveAllPaneItems,
    mergeToParentPaneAxis: mergeToParentPaneAxis,
    getAllPaneAxis: getAllPaneAxis,
    copyPaneAxis: copyPaneAxis,
    copyRoot: copyRoot,
    isSameOrientationAsParent: isSameOrientationAsParent
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3BhbmVyL2xpYi91dGlscy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMlBBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtXQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixLQUFuQixFQURRO0VBQUEsQ0FGVixDQUFBOztBQUFBLEVBS0EsYUFBQSxHQUFnQixTQUFBLEdBQUE7V0FDZCxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxFQURjO0VBQUEsQ0FMaEIsQ0FBQTs7QUFBQSxFQVFBLEtBQUEsR0FBUSxTQUFDLEdBQUQsR0FBQTtBQUNOLElBQUEsSUFBQSxDQUFBLElBQWtCLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsYUFBaEIsQ0FBZDtBQUFBLFlBQUEsQ0FBQTtLQUFBO1dBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaLEVBRk07RUFBQSxDQVJSLENBQUE7O0FBQUEsRUFZQSxTQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sU0FBUCxHQUFBO0FBQ1YsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVUsT0FBQSxHQUFNLENBQUMsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxTQUFiLENBQUQsQ0FBaEIsQ0FBQTtXQUNBLElBQUssQ0FBQSxNQUFBLENBQUwsQ0FBYTtBQUFBLE1BQUMsY0FBQSxFQUFnQixJQUFqQjtBQUFBLE1BQXVCLFFBQUEsRUFBVSxLQUFqQztLQUFiLEVBRlU7RUFBQSxDQVpaLENBQUE7O0FBQUEsRUFnQkEsd0JBQUEsR0FBMkIsU0FBQyxJQUFELEdBQUE7QUFDekIsUUFBQSxpQkFBQTtBQUFBLElB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

//# sourceURL=/Users/victor.martins/.atom/packages/paner/lib/utils.coffee
