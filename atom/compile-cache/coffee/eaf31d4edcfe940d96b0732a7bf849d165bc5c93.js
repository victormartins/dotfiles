(function() {
  var Range, getView, getVisibleBufferRange, getVisibleBufferRowRange, openFile, setConfig;

  Range = require('atom').Range;

  getView = function(model) {
    return atom.views.getView(model);
  };

  setConfig = function(name, value) {
    return atom.config.set("paner." + name, value);
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

  getVisibleBufferRange = function(editor) {
    var endRow, startRow, _ref;
    _ref = getVisibleBufferRowRange(), startRow = _ref[0], endRow = _ref[1];
    return new Range([startRow, 0], [endRow, Infinity]);
  };

  module.exports = {
    setConfig: setConfig,
    openFile: openFile,
    getVisibleBufferRowRange: getVisibleBufferRowRange,
    getVisibleBufferRange: getVisibleBufferRange,
    getView: getView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3BhbmVyL3NwZWMvc3BlYy1oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9GQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtXQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixLQUFuQixFQURRO0VBQUEsQ0FGVixDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLEtBQVAsR0FBQTtXQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFpQixRQUFBLEdBQVEsSUFBekIsRUFBaUMsS0FBakMsRUFEVTtFQUFBLENBTFosQ0FBQTs7QUFBQSxFQVFBLFFBQUEsR0FBVyxTQUFDLFFBQUQsRUFBVyxPQUFYLEVBQXVCLEVBQXZCLEdBQUE7O01BQVcsVUFBUTtLQUM1Qjs7TUFEZ0MsS0FBRztLQUNuQztXQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLEVBQThCLE9BQTlCLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsU0FBQyxDQUFELEdBQUE7MENBQzFDLEdBQUksWUFEc0M7TUFBQSxDQUE1QyxFQURjO0lBQUEsQ0FBaEIsRUFEUztFQUFBLENBUlgsQ0FBQTs7QUFBQSxFQWFBLHdCQUFBLEdBQTJCLFNBQUMsQ0FBRCxHQUFBO1dBQ3pCLE9BQUEsQ0FBUSxDQUFSLENBQVUsQ0FBQyxrQkFBWCxDQUFBLENBQStCLENBQUMsR0FBaEMsQ0FBb0MsU0FBQyxHQUFELEdBQUE7YUFDbEMsQ0FBQyxDQUFDLHFCQUFGLENBQXdCLEdBQXhCLEVBRGtDO0lBQUEsQ0FBcEMsRUFEeUI7RUFBQSxDQWIzQixDQUFBOztBQUFBLEVBaUJBLHFCQUFBLEdBQXdCLFNBQUMsTUFBRCxHQUFBO0FBQ3RCLFFBQUEsc0JBQUE7QUFBQSxJQUFBLE9BQXFCLHdCQUFBLENBQUEsQ0FBckIsRUFBQyxrQkFBRCxFQUFXLGdCQUFYLENBQUE7V0FDSSxJQUFBLEtBQUEsQ0FBTSxDQUFDLFFBQUQsRUFBVyxDQUFYLENBQU4sRUFBcUIsQ0FBQyxNQUFELEVBQVMsUUFBVCxDQUFyQixFQUZrQjtFQUFBLENBakJ4QixDQUFBOztBQUFBLEVBcUJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFDZixXQUFBLFNBRGU7QUFBQSxJQUNKLFVBQUEsUUFESTtBQUFBLElBRWYsMEJBQUEsd0JBRmU7QUFBQSxJQUVXLHVCQUFBLHFCQUZYO0FBQUEsSUFHZixTQUFBLE9BSGU7R0FyQmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/victor.martins/.atom/packages/paner/spec/spec-helper.coffee
