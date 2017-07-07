(function() {
  var ActivatePowerMode, CompositeDisposable, configSchema;

  CompositeDisposable = require("atom").CompositeDisposable;

  configSchema = require("./config-schema");

  module.exports = ActivatePowerMode = {
    config: configSchema,
    subscriptions: null,
    active: false,
    activate: function(state) {
      this.pluginRegistry = require("./plugin-registry");
      this.flowRegistry = require("./flow-registry");
      this.effectRegistry = require("./effect-registry");
      return requestIdleCallback((function(_this) {
        return function() {
          _this.subscriptions = new CompositeDisposable;
          _this.powerEditor = require("./power-editor");
          _this.pluginManager = require("./plugin-manager");
          _this.powerEditor.setPluginManager(_this.pluginManager);
          _this.pluginManager.init(_this.config, _this.pluginRegistry, _this.flowRegistry, _this.effectRegistry);
          _this.subscriptions.add(atom.commands.add("atom-workspace", {
            "activate-power-mode:toggle": function() {
              return _this.toggle();
            },
            "activate-power-mode:enable": function() {
              return _this.enable();
            },
            "activate-power-mode:disable": function() {
              return _this.disable();
            }
          }));
          if (_this.getConfig("autoToggle")) {
            return _this.toggle();
          }
        };
      })(this));
    },
    deactivate: function() {
      var ref;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      this.active = false;
      return this.powerEditor.disable();
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode." + config);
    },
    toggle: function() {
      if (this.active) {
        return this.disable();
      } else {
        return this.enable();
      }
    },
    enable: function() {
      this.active = true;
      return this.powerEditor.enable();
    },
    disable: function() {
      this.active = false;
      return this.powerEditor.disable();
    },
    provideServiceV1: function() {
      var Service;
      if (!this.service) {
        Service = require("./service");
        this.service = new Service(this.pluginRegistry, this.flowRegistry, this.effectRegistry);
      }
      return this.service;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvYWN0aXZhdGUtcG93ZXItbW9kZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUjs7RUFFZixNQUFNLENBQUMsT0FBUCxHQUFpQixpQkFBQSxHQUNmO0lBQUEsTUFBQSxFQUFRLFlBQVI7SUFDQSxhQUFBLEVBQWUsSUFEZjtJQUVBLE1BQUEsRUFBUSxLQUZSO0lBSUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUNSLElBQUMsQ0FBQSxjQUFELEdBQWtCLE9BQUEsQ0FBUSxtQkFBUjtNQUNsQixJQUFDLENBQUEsWUFBRCxHQUFnQixPQUFBLENBQVEsaUJBQVI7TUFDaEIsSUFBQyxDQUFBLGNBQUQsR0FBa0IsT0FBQSxDQUFRLG1CQUFSO2FBRWxCLG1CQUFBLENBQW9CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNsQixLQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO1VBRXJCLEtBQUMsQ0FBQSxXQUFELEdBQWUsT0FBQSxDQUFRLGdCQUFSO1VBQ2YsS0FBQyxDQUFBLGFBQUQsR0FBaUIsT0FBQSxDQUFRLGtCQUFSO1VBQ2pCLEtBQUMsQ0FBQSxXQUFXLENBQUMsZ0JBQWIsQ0FBOEIsS0FBQyxDQUFBLGFBQS9CO1VBQ0EsS0FBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQW9CLEtBQUMsQ0FBQSxNQUFyQixFQUE2QixLQUFDLENBQUEsY0FBOUIsRUFBOEMsS0FBQyxDQUFBLFlBQS9DLEVBQTZELEtBQUMsQ0FBQSxjQUE5RDtVQUVBLEtBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO1lBQUEsNEJBQUEsRUFBOEIsU0FBQTtxQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1lBQUgsQ0FBOUI7WUFDQSw0QkFBQSxFQUE4QixTQUFBO3FCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7WUFBSCxDQUQ5QjtZQUVBLDZCQUFBLEVBQStCLFNBQUE7cUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBQTtZQUFILENBRi9CO1dBRGlCLENBQW5CO1VBS0EsSUFBRyxLQUFDLENBQUEsU0FBRCxDQUFXLFlBQVgsQ0FBSDttQkFDRSxLQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7O1FBYmtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQjtJQUxRLENBSlY7SUF5QkEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBOztXQUFjLENBQUUsT0FBaEIsQ0FBQTs7TUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVO2FBQ1YsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7SUFIVSxDQXpCWjtJQThCQSxTQUFBLEVBQVcsU0FBQyxNQUFEO2FBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFBLEdBQXVCLE1BQXZDO0lBRFMsQ0E5Qlg7SUFpQ0EsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFHLElBQUMsQ0FBQSxNQUFKO2VBQWdCLElBQUMsQ0FBQSxPQUFELENBQUEsRUFBaEI7T0FBQSxNQUFBO2VBQWdDLElBQUMsQ0FBQSxNQUFELENBQUEsRUFBaEM7O0lBRE0sQ0FqQ1I7SUFvQ0EsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFDLENBQUEsTUFBRCxHQUFVO2FBQ1YsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQUE7SUFGTSxDQXBDUjtJQXdDQSxPQUFBLEVBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxNQUFELEdBQVU7YUFDVixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTtJQUZPLENBeENUO0lBNENBLGdCQUFBLEVBQWtCLFNBQUE7QUFDaEIsVUFBQTtNQUFBLElBQUcsQ0FBSSxJQUFDLENBQUEsT0FBUjtRQUNFLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUjtRQUNWLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxPQUFBLENBQVEsSUFBQyxDQUFBLGNBQVQsRUFBeUIsSUFBQyxDQUFBLFlBQTFCLEVBQXdDLElBQUMsQ0FBQSxjQUF6QyxFQUZqQjs7YUFHQSxJQUFDLENBQUE7SUFKZSxDQTVDbEI7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlIFwiYXRvbVwiXG5jb25maWdTY2hlbWEgPSByZXF1aXJlIFwiLi9jb25maWctc2NoZW1hXCJcblxubW9kdWxlLmV4cG9ydHMgPSBBY3RpdmF0ZVBvd2VyTW9kZSA9XG4gIGNvbmZpZzogY29uZmlnU2NoZW1hXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgYWN0aXZlOiBmYWxzZVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQHBsdWdpblJlZ2lzdHJ5ID0gcmVxdWlyZSBcIi4vcGx1Z2luLXJlZ2lzdHJ5XCJcbiAgICBAZmxvd1JlZ2lzdHJ5ID0gcmVxdWlyZSBcIi4vZmxvdy1yZWdpc3RyeVwiXG4gICAgQGVmZmVjdFJlZ2lzdHJ5ID0gcmVxdWlyZSBcIi4vZWZmZWN0LXJlZ2lzdHJ5XCJcblxuICAgIHJlcXVlc3RJZGxlQ2FsbGJhY2sgPT5cbiAgICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICAgQHBvd2VyRWRpdG9yID0gcmVxdWlyZSBcIi4vcG93ZXItZWRpdG9yXCJcbiAgICAgIEBwbHVnaW5NYW5hZ2VyID0gcmVxdWlyZSBcIi4vcGx1Z2luLW1hbmFnZXJcIlxuICAgICAgQHBvd2VyRWRpdG9yLnNldFBsdWdpbk1hbmFnZXIgQHBsdWdpbk1hbmFnZXJcbiAgICAgIEBwbHVnaW5NYW5hZ2VyLmluaXQgQGNvbmZpZywgQHBsdWdpblJlZ2lzdHJ5LCBAZmxvd1JlZ2lzdHJ5LCBAZWZmZWN0UmVnaXN0cnlcblxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIixcbiAgICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlOnRvZ2dsZVwiOiA9PiBAdG9nZ2xlKClcbiAgICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlOmVuYWJsZVwiOiA9PiBAZW5hYmxlKClcbiAgICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlOmRpc2FibGVcIjogPT4gQGRpc2FibGUoKVxuXG4gICAgICBpZiBAZ2V0Q29uZmlnIFwiYXV0b1RvZ2dsZVwiXG4gICAgICAgIEB0b2dnbGUoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEBhY3RpdmUgPSBmYWxzZVxuICAgIEBwb3dlckVkaXRvci5kaXNhYmxlKClcblxuICBnZXRDb25maWc6IChjb25maWcpIC0+XG4gICAgYXRvbS5jb25maWcuZ2V0IFwiYWN0aXZhdGUtcG93ZXItbW9kZS4je2NvbmZpZ31cIlxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAYWN0aXZlIHRoZW4gQGRpc2FibGUoKSBlbHNlIEBlbmFibGUoKVxuXG4gIGVuYWJsZTogLT5cbiAgICBAYWN0aXZlID0gdHJ1ZVxuICAgIEBwb3dlckVkaXRvci5lbmFibGUoKVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQGFjdGl2ZSA9IGZhbHNlXG4gICAgQHBvd2VyRWRpdG9yLmRpc2FibGUoKVxuXG4gIHByb3ZpZGVTZXJ2aWNlVjE6IC0+XG4gICAgaWYgbm90IEBzZXJ2aWNlXG4gICAgICBTZXJ2aWNlID0gcmVxdWlyZSBcIi4vc2VydmljZVwiXG4gICAgICBAc2VydmljZSA9IG5ldyBTZXJ2aWNlKEBwbHVnaW5SZWdpc3RyeSwgQGZsb3dSZWdpc3RyeSwgQGVmZmVjdFJlZ2lzdHJ5KVxuICAgIEBzZXJ2aWNlXG4iXX0=
