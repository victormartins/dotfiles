(function() {
  var $, ExportHtmlBrowserView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), View = _ref.View, $ = _ref.$;

  module.exports = ExportHtmlBrowserView = (function(_super) {
    __extends(ExportHtmlBrowserView, _super);

    function ExportHtmlBrowserView() {
      return ExportHtmlBrowserView.__super__.constructor.apply(this, arguments);
    }

    ExportHtmlBrowserView.content = function(params, self) {
      return this.div({
        style: "height:100%;width:0px"
      }, (function(_this) {
        return function() {
          return _this.tag("webview", {
            id: "epreview",
            outlet: "epreview",
            src: params.src,
            nodeintegration: "on"
          });
        };
      })(this));
    };

    ExportHtmlBrowserView.prototype.initialize = function(params, self) {
      return this.self = self;
    };

    ExportHtmlBrowserView.prototype.attached = function(onDom) {
      return this.epreview[0].addEventListener("did-finish-load", (function(_this) {
        return function(evt) {
          _this.epreview[0].print();
          return _this.self.panelHide();
        };
      })(this));
    };

    ExportHtmlBrowserView.prototype.loadURL = function(path) {
      return this.epreview[0].src = path;
    };

    return ExportHtmlBrowserView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2V4cG9ydC1odG1sL2xpYi9leHBvcnQtaHRtbC1ib3dzZXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxZQUFBLElBQUQsRUFBTyxTQUFBLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSiw0Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxxQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQsRUFBUyxJQUFULEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxLQUFBLEVBQU0sdUJBQU47T0FBTCxFQUFvQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNsQyxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUwsRUFBZ0I7QUFBQSxZQUFBLEVBQUEsRUFBRyxVQUFIO0FBQUEsWUFBZSxNQUFBLEVBQU8sVUFBdEI7QUFBQSxZQUFrQyxHQUFBLEVBQUksTUFBTSxDQUFDLEdBQTdDO0FBQUEsWUFBa0QsZUFBQSxFQUFnQixJQUFsRTtXQUFoQixFQURrQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsb0NBSUEsVUFBQSxHQUFZLFNBQUMsTUFBRCxFQUFTLElBQVQsR0FBQTthQUNWLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FERTtJQUFBLENBSlosQ0FBQTs7QUFBQSxvQ0FPQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFDLENBQUEsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLGdCQUFiLENBQThCLGlCQUE5QixFQUFpRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEdBQUE7QUFDL0MsVUFBQSxLQUFDLENBQUEsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQWIsQ0FBQSxDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUEsRUFGK0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqRCxFQURRO0lBQUEsQ0FQVixDQUFBOztBQUFBLG9DQVlBLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTthQUNQLElBQUMsQ0FBQSxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsR0FBYixHQUFtQixLQURaO0lBQUEsQ0FaVCxDQUFBOztpQ0FBQTs7S0FEa0MsS0FGdEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/victor.martins/.atom/packages/export-html/lib/export-html-bowser-view.coffee
