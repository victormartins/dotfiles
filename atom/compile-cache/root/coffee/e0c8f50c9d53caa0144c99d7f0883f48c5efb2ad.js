(function() {
  var inputHandler,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  inputHandler = require("./input-handler");

  module.exports = {
    inputHandler: inputHandler,
    enable: function() {
      this.pluginManager.enable();
      this.changePaneSubscription = atom.workspace.onDidStopChangingActivePaneItem((function(_this) {
        return function() {
          return _this.setupPane();
        };
      })(this));
      return this.setupPane();
    },
    disable: function() {
      var ref, ref1, ref2;
      if ((ref = this.changePaneSubscription) != null) {
        ref.dispose();
      }
      if ((ref1 = this.inputSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.cursorSubscription) != null) {
        ref2.dispose();
      }
      return this.pluginManager.disable();
    },
    setPluginManager: function(pluginManager) {
      return this.pluginManager = pluginManager;
    },
    isExcludedFile: function() {
      var excluded, ref, ref1;
      excluded = this.getConfig("excludedFileTypes.excluded");
      return ref = (ref1 = this.editor.getPath()) != null ? ref1.split('.').pop() : void 0, indexOf.call(excluded, ref) >= 0;
    },
    setupPane: function() {
      var ref, ref1;
      if ((ref = this.inputSubscription) != null) {
        ref.dispose();
      }
      if ((ref1 = this.cursorSubscription) != null) {
        ref1.dispose();
      }
      this.editor = atom.workspace.getActiveTextEditor();
      if (!this.editor || this.isExcludedFile()) {
        this.pluginManager.runOnChangePane();
        return;
      }
      this.editorElement = this.editor.getElement();
      this.inputSubscription = this.editor.getBuffer().onDidChange(this.handleInput.bind(this));
      this.cursorSubscription = this.editor.observeCursors(this.handleCursor.bind(this));
      return this.pluginManager.runOnChangePane(this.editor, this.editorElement);
    },
    handleCursor: function(cursor) {
      return this.pluginManager.runOnNewCursor(cursor);
    },
    handleInput: function(e) {
      return requestIdleCallback((function(_this) {
        return function() {
          var cursor, screenPos;
          _this.inputHandler.handle(e);
          if (_this.inputHandler.isGhost()) {
            return;
          }
          screenPos = _this.editor.screenPositionForBufferPosition(_this.inputHandler.getPosition());
          cursor = _this.editor.getCursorAtScreenPosition(screenPos);
          if (!cursor) {
            return;
          }
          return _this.pluginManager.runOnInput(cursor, screenPos, _this.inputHandler);
        };
      })(this));
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvcG93ZXItZWRpdG9yLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsWUFBQTtJQUFBOztFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVI7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFlBQUEsRUFBYyxZQUFkO0lBRUEsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsQ0FBQTtNQUNBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFJLENBQUMsU0FBUyxDQUFDLCtCQUFmLENBQStDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDdkUsS0FBQyxDQUFBLFNBQUQsQ0FBQTtRQUR1RTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0M7YUFHMUIsSUFBQyxDQUFBLFNBQUQsQ0FBQTtJQUxNLENBRlI7SUFTQSxPQUFBLEVBQVMsU0FBQTtBQUNQLFVBQUE7O1dBQXVCLENBQUUsT0FBekIsQ0FBQTs7O1lBQ2tCLENBQUUsT0FBcEIsQ0FBQTs7O1lBQ21CLENBQUUsT0FBckIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtJQUpPLENBVFQ7SUFlQSxnQkFBQSxFQUFrQixTQUFDLGFBQUQ7YUFDaEIsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFERCxDQWZsQjtJQWtCQSxjQUFBLEVBQWdCLFNBQUE7QUFDZCxVQUFBO01BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxTQUFELENBQVcsNEJBQVg7Z0VBQ00sQ0FBRSxLQUFuQixDQUF5QixHQUF6QixDQUE2QixDQUFDLEdBQTlCLENBQUEsVUFBQSxFQUFBLGFBQXVDLFFBQXZDLEVBQUEsR0FBQTtJQUZjLENBbEJoQjtJQXNCQSxTQUFBLEVBQVcsU0FBQTtBQUNULFVBQUE7O1dBQWtCLENBQUUsT0FBcEIsQ0FBQTs7O1lBQ21CLENBQUUsT0FBckIsQ0FBQTs7TUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUVWLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTCxJQUFlLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBbEI7UUFDRSxJQUFDLENBQUEsYUFBYSxDQUFDLGVBQWYsQ0FBQTtBQUNBLGVBRkY7O01BSUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQUE7TUFFakIsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsV0FBcEIsQ0FBZ0MsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLElBQWxCLENBQWhDO01BQ3JCLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBdUIsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLElBQW5CLENBQXZCO2FBRXRCLElBQUMsQ0FBQSxhQUFhLENBQUMsZUFBZixDQUErQixJQUFDLENBQUEsTUFBaEMsRUFBd0MsSUFBQyxDQUFBLGFBQXpDO0lBZFMsQ0F0Qlg7SUFzQ0EsWUFBQSxFQUFjLFNBQUMsTUFBRDthQUNaLElBQUMsQ0FBQSxhQUFhLENBQUMsY0FBZixDQUE4QixNQUE5QjtJQURZLENBdENkO0lBeUNBLFdBQUEsRUFBYSxTQUFDLENBQUQ7YUFDWCxtQkFBQSxDQUFvQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDbEIsY0FBQTtVQUFBLEtBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxDQUFxQixDQUFyQjtVQUNBLElBQVUsS0FBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsQ0FBVjtBQUFBLG1CQUFBOztVQUVBLFNBQUEsR0FBWSxLQUFDLENBQUEsTUFBTSxDQUFDLCtCQUFSLENBQXdDLEtBQUMsQ0FBQSxZQUFZLENBQUMsV0FBZCxDQUFBLENBQXhDO1VBQ1osTUFBQSxHQUFTLEtBQUMsQ0FBQSxNQUFNLENBQUMseUJBQVIsQ0FBa0MsU0FBbEM7VUFDVCxJQUFBLENBQWMsTUFBZDtBQUFBLG1CQUFBOztpQkFFQSxLQUFDLENBQUEsYUFBYSxDQUFDLFVBQWYsQ0FBMEIsTUFBMUIsRUFBa0MsU0FBbEMsRUFBNkMsS0FBQyxDQUFBLFlBQTlDO1FBUmtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQjtJQURXLENBekNiO0lBb0RBLFNBQUEsRUFBVyxTQUFDLE1BQUQ7YUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQUEsR0FBdUIsTUFBdkM7SUFEUyxDQXBEWDs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbImlucHV0SGFuZGxlciA9IHJlcXVpcmUgXCIuL2lucHV0LWhhbmRsZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGlucHV0SGFuZGxlcjogaW5wdXRIYW5kbGVyXG5cbiAgZW5hYmxlOiAtPlxuICAgIEBwbHVnaW5NYW5hZ2VyLmVuYWJsZSgpXG4gICAgQGNoYW5nZVBhbmVTdWJzY3JpcHRpb24gPSBhdG9tLndvcmtzcGFjZS5vbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtID0+XG4gICAgICBAc2V0dXBQYW5lKClcblxuICAgIEBzZXR1cFBhbmUoKVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQGNoYW5nZVBhbmVTdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBpbnB1dFN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQGN1cnNvclN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQHBsdWdpbk1hbmFnZXIuZGlzYWJsZSgpXG5cbiAgc2V0UGx1Z2luTWFuYWdlcjogKHBsdWdpbk1hbmFnZXIpIC0+XG4gICAgQHBsdWdpbk1hbmFnZXIgPSBwbHVnaW5NYW5hZ2VyXG5cbiAgaXNFeGNsdWRlZEZpbGU6IC0+XG4gICAgZXhjbHVkZWQgPSBAZ2V0Q29uZmlnIFwiZXhjbHVkZWRGaWxlVHlwZXMuZXhjbHVkZWRcIlxuICAgIEBlZGl0b3IuZ2V0UGF0aCgpPy5zcGxpdCgnLicpLnBvcCgpIGluIGV4Y2x1ZGVkXG5cbiAgc2V0dXBQYW5lOiAtPlxuICAgIEBpbnB1dFN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQGN1cnNvclN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgaWYgbm90IEBlZGl0b3Igb3IgQGlzRXhjbHVkZWRGaWxlKClcbiAgICAgIEBwbHVnaW5NYW5hZ2VyLnJ1bk9uQ2hhbmdlUGFuZSgpXG4gICAgICByZXR1cm5cblxuICAgIEBlZGl0b3JFbGVtZW50ID0gQGVkaXRvci5nZXRFbGVtZW50KClcblxuICAgIEBpbnB1dFN1YnNjcmlwdGlvbiA9IEBlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRDaGFuZ2UgQGhhbmRsZUlucHV0LmJpbmQodGhpcylcbiAgICBAY3Vyc29yU3Vic2NyaXB0aW9uID0gQGVkaXRvci5vYnNlcnZlQ3Vyc29ycyBAaGFuZGxlQ3Vyc29yLmJpbmQodGhpcylcblxuICAgIEBwbHVnaW5NYW5hZ2VyLnJ1bk9uQ2hhbmdlUGFuZSBAZWRpdG9yLCBAZWRpdG9yRWxlbWVudFxuXG4gIGhhbmRsZUN1cnNvcjogKGN1cnNvcikgLT5cbiAgICBAcGx1Z2luTWFuYWdlci5ydW5Pbk5ld0N1cnNvciBjdXJzb3JcblxuICBoYW5kbGVJbnB1dDogKGUpIC0+XG4gICAgcmVxdWVzdElkbGVDYWxsYmFjayA9PlxuICAgICAgQGlucHV0SGFuZGxlci5oYW5kbGUgZVxuICAgICAgcmV0dXJuIGlmIEBpbnB1dEhhbmRsZXIuaXNHaG9zdCgpXG5cbiAgICAgIHNjcmVlblBvcyA9IEBlZGl0b3Iuc2NyZWVuUG9zaXRpb25Gb3JCdWZmZXJQb3NpdGlvbiBAaW5wdXRIYW5kbGVyLmdldFBvc2l0aW9uKClcbiAgICAgIGN1cnNvciA9IEBlZGl0b3IuZ2V0Q3Vyc29yQXRTY3JlZW5Qb3NpdGlvbiBzY3JlZW5Qb3NcbiAgICAgIHJldHVybiB1bmxlc3MgY3Vyc29yXG5cbiAgICAgIEBwbHVnaW5NYW5hZ2VyLnJ1bk9uSW5wdXQgY3Vyc29yLCBzY3JlZW5Qb3MsIEBpbnB1dEhhbmRsZXJcblxuICBnZXRDb25maWc6IChjb25maWcpIC0+XG4gICAgYXRvbS5jb25maWcuZ2V0IFwiYWN0aXZhdGUtcG93ZXItbW9kZS4je2NvbmZpZ31cIlxuIl19
