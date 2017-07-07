(function() {
  var CompositeDisposable;

  CompositeDisposable = require("atom").CompositeDisposable;

  module.exports = {
    enabled: false,
    subscriptions: null,
    plugins: [],
    corePlugins: [],
    enabledPlugins: [],
    init: function(configSchema, api) {
      this.config = configSchema;
      return this.api = api;
    },
    enable: function() {
      var code, key, plugin, ref, ref1, results;
      this.subscriptions = new CompositeDisposable;
      this.enabled = true;
      ref = this.corePlugins;
      for (code in ref) {
        plugin = ref[code];
        this.observePlugin(code, plugin, "activate-power-mode." + code + ".enabled");
      }
      ref1 = this.plugins;
      results = [];
      for (code in ref1) {
        plugin = ref1[code];
        key = "activate-power-mode.plugins." + code;
        this.addConfigForPlugin(code, plugin, key);
        results.push(this.observePlugin(code, plugin, key));
      }
      return results;
    },
    disable: function() {
      var ref;
      this.enabled = false;
      return (ref = this.subscriptions) != null ? ref.dispose() : void 0;
    },
    addCorePlugin: function(code, plugin) {
      return this.corePlugins[code] = plugin;
    },
    addPlugin: function(code, plugin) {
      var key;
      key = "activate-power-mode.plugins." + code;
      this.plugins[code] = plugin;
      if (this.enabled) {
        this.addConfigForPlugin(code, plugin, key);
        return this.observePlugin(code, plugin, key);
      }
    },
    addConfigForPlugin: function(code, plugin, key) {
      this.config.plugins.properties[code] = {
        type: 'boolean',
        title: plugin.title,
        description: plugin.description,
        "default": true
      };
      if (atom.config.get(key) === void 0) {
        return atom.config.set(key, this.config.plugins.properties[code]["default"]);
      }
    },
    observePlugin: function(code, plugin, key) {
      return this.subscriptions.add(atom.config.observe(key, (function(_this) {
        return function(isEnabled) {
          if (isEnabled) {
            if (typeof plugin.enable === "function") {
              plugin.enable(_this.api);
            }
            return _this.enabledPlugins[code] = plugin;
          } else {
            if (typeof plugin.disable === "function") {
              plugin.disable();
            }
            return delete _this.enabledPlugins[code];
          }
        };
      })(this)));
    },
    onEnabled: function(callback) {
      var code, plugin, ref, results;
      ref = this.enabledPlugins;
      results = [];
      for (code in ref) {
        plugin = ref[code];
        if (callback(code, plugin)) {
          continue;
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvcGx1Z2luLXJlZ2lzdHJ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsT0FBQSxFQUFTLEtBQVQ7SUFDQSxhQUFBLEVBQWUsSUFEZjtJQUVBLE9BQUEsRUFBUyxFQUZUO0lBR0EsV0FBQSxFQUFhLEVBSGI7SUFJQSxjQUFBLEVBQWdCLEVBSmhCO0lBTUEsSUFBQSxFQUFNLFNBQUMsWUFBRCxFQUFlLEdBQWY7TUFDSixJQUFDLENBQUEsTUFBRCxHQUFVO2FBQ1YsSUFBQyxDQUFBLEdBQUQsR0FBTztJQUZILENBTk47SUFVQSxNQUFBLEVBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxPQUFELEdBQVc7QUFFWDtBQUFBLFdBQUEsV0FBQTs7UUFDRSxJQUFDLENBQUEsYUFBRCxDQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBNkIsc0JBQUEsR0FBdUIsSUFBdkIsR0FBNEIsVUFBekQ7QUFERjtBQUdBO0FBQUE7V0FBQSxZQUFBOztRQUNFLEdBQUEsR0FBTSw4QkFBQSxHQUErQjtRQUNyQyxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBcEIsRUFBMEIsTUFBMUIsRUFBa0MsR0FBbEM7cUJBQ0EsSUFBQyxDQUFBLGFBQUQsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQTZCLEdBQTdCO0FBSEY7O0lBUE0sQ0FWUjtJQXNCQSxPQUFBLEVBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXO3FEQUNHLENBQUUsT0FBaEIsQ0FBQTtJQUZPLENBdEJUO0lBMEJBLGFBQUEsRUFBZSxTQUFDLElBQUQsRUFBTyxNQUFQO2FBQ2IsSUFBQyxDQUFBLFdBQVksQ0FBQSxJQUFBLENBQWIsR0FBcUI7SUFEUixDQTFCZjtJQTZCQSxTQUFBLEVBQVcsU0FBQyxJQUFELEVBQU8sTUFBUDtBQUNULFVBQUE7TUFBQSxHQUFBLEdBQU0sOEJBQUEsR0FBK0I7TUFDckMsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFBLENBQVQsR0FBaUI7TUFFakIsSUFBRyxJQUFDLENBQUEsT0FBSjtRQUNFLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFwQixFQUEwQixNQUExQixFQUFrQyxHQUFsQztlQUNBLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBZixFQUFxQixNQUFyQixFQUE2QixHQUE3QixFQUZGOztJQUpTLENBN0JYO0lBcUNBLGtCQUFBLEVBQW9CLFNBQUMsSUFBRCxFQUFPLE1BQVAsRUFBZSxHQUFmO01BQ2xCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVcsQ0FBQSxJQUFBLENBQTNCLEdBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FEZDtRQUVBLFdBQUEsRUFBYSxNQUFNLENBQUMsV0FGcEI7UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7O01BS0YsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsQ0FBQSxLQUF3QixNQUEzQjtlQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFXLENBQUEsSUFBQSxDQUFLLEVBQUMsT0FBRCxFQUFyRCxFQURGOztJQVBrQixDQXJDcEI7SUErQ0EsYUFBQSxFQUFlLFNBQUMsSUFBRCxFQUFPLE1BQVAsRUFBZSxHQUFmO2FBQ2IsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUNqQixHQURpQixFQUNaLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxTQUFEO1VBQ0gsSUFBRyxTQUFIOztjQUNFLE1BQU0sQ0FBQyxPQUFRLEtBQUMsQ0FBQTs7bUJBQ2hCLEtBQUMsQ0FBQSxjQUFlLENBQUEsSUFBQSxDQUFoQixHQUF3QixPQUYxQjtXQUFBLE1BQUE7O2NBSUUsTUFBTSxDQUFDOzttQkFDUCxPQUFPLEtBQUMsQ0FBQSxjQUFlLENBQUEsSUFBQSxFQUx6Qjs7UUFERztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEWSxDQUFuQjtJQURhLENBL0NmO0lBMERBLFNBQUEsRUFBVyxTQUFDLFFBQUQ7QUFDVCxVQUFBO0FBQUE7QUFBQTtXQUFBLFdBQUE7O1FBQ0UsSUFBWSxRQUFBLENBQVMsSUFBVCxFQUFlLE1BQWYsQ0FBWjtBQUFBLG1CQUFBO1NBQUEsTUFBQTsrQkFBQTs7QUFERjs7SUFEUyxDQTFEWDs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgXCJhdG9tXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBlbmFibGVkOiBmYWxzZVxuICBzdWJzY3JpcHRpb25zOiBudWxsXG4gIHBsdWdpbnM6IFtdXG4gIGNvcmVQbHVnaW5zOiBbXVxuICBlbmFibGVkUGx1Z2luczogW11cblxuICBpbml0OiAoY29uZmlnU2NoZW1hLCBhcGkpIC0+XG4gICAgQGNvbmZpZyA9IGNvbmZpZ1NjaGVtYVxuICAgIEBhcGkgPSBhcGlcblxuICBlbmFibGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBlbmFibGVkID0gdHJ1ZVxuXG4gICAgZm9yIGNvZGUsIHBsdWdpbiBvZiBAY29yZVBsdWdpbnNcbiAgICAgIEBvYnNlcnZlUGx1Z2luIGNvZGUsIHBsdWdpbiwgXCJhY3RpdmF0ZS1wb3dlci1tb2RlLiN7Y29kZX0uZW5hYmxlZFwiXG5cbiAgICBmb3IgY29kZSwgcGx1Z2luIG9mIEBwbHVnaW5zXG4gICAgICBrZXkgPSBcImFjdGl2YXRlLXBvd2VyLW1vZGUucGx1Z2lucy4je2NvZGV9XCJcbiAgICAgIEBhZGRDb25maWdGb3JQbHVnaW4gY29kZSwgcGx1Z2luLCBrZXlcbiAgICAgIEBvYnNlcnZlUGx1Z2luIGNvZGUsIHBsdWdpbiwga2V5XG5cbiAgZGlzYWJsZTogLT5cbiAgICBAZW5hYmxlZCA9IGZhbHNlXG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuXG4gIGFkZENvcmVQbHVnaW46IChjb2RlLCBwbHVnaW4pIC0+XG4gICAgQGNvcmVQbHVnaW5zW2NvZGVdID0gcGx1Z2luXG5cbiAgYWRkUGx1Z2luOiAoY29kZSwgcGx1Z2luKSAtPlxuICAgIGtleSA9IFwiYWN0aXZhdGUtcG93ZXItbW9kZS5wbHVnaW5zLiN7Y29kZX1cIlxuICAgIEBwbHVnaW5zW2NvZGVdID0gcGx1Z2luXG5cbiAgICBpZiBAZW5hYmxlZFxuICAgICAgQGFkZENvbmZpZ0ZvclBsdWdpbiBjb2RlLCBwbHVnaW4sIGtleVxuICAgICAgQG9ic2VydmVQbHVnaW4gY29kZSwgcGx1Z2luLCBrZXlcblxuICBhZGRDb25maWdGb3JQbHVnaW46IChjb2RlLCBwbHVnaW4sIGtleSkgLT5cbiAgICBAY29uZmlnLnBsdWdpbnMucHJvcGVydGllc1tjb2RlXSA9XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICB0aXRsZTogcGx1Z2luLnRpdGxlLFxuICAgICAgZGVzY3JpcHRpb246IHBsdWdpbi5kZXNjcmlwdGlvbixcbiAgICAgIGRlZmF1bHQ6IHRydWVcblxuICAgIGlmIGF0b20uY29uZmlnLmdldChrZXkpID09IHVuZGVmaW5lZFxuICAgICAgYXRvbS5jb25maWcuc2V0IGtleSwgQGNvbmZpZy5wbHVnaW5zLnByb3BlcnRpZXNbY29kZV0uZGVmYXVsdFxuXG4gIG9ic2VydmVQbHVnaW46IChjb2RlLCBwbHVnaW4sIGtleSkgLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgIGtleSwgKGlzRW5hYmxlZCkgPT5cbiAgICAgICAgaWYgaXNFbmFibGVkXG4gICAgICAgICAgcGx1Z2luLmVuYWJsZT8oQGFwaSlcbiAgICAgICAgICBAZW5hYmxlZFBsdWdpbnNbY29kZV0gPSBwbHVnaW5cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBsdWdpbi5kaXNhYmxlPygpXG4gICAgICAgICAgZGVsZXRlIEBlbmFibGVkUGx1Z2luc1tjb2RlXVxuICAgIClcblxuICBvbkVuYWJsZWQ6IChjYWxsYmFjaykgLT5cbiAgICBmb3IgY29kZSwgcGx1Z2luIG9mIEBlbmFibGVkUGx1Z2luc1xuICAgICAgY29udGludWUgaWYgY2FsbGJhY2sgY29kZSwgcGx1Z2luXG4iXX0=
