(function() {
  var ParticlesEffect, Service;

  ParticlesEffect = require("./effect/particles");

  module.exports = Service = (function() {
    function Service(pluginRegistry, flowRegistry, effectRegistry) {
      this.pluginRegistry = pluginRegistry;
      this.flowRegistry = flowRegistry;
      this.effectRegistry = effectRegistry;
    }

    Service.prototype.registerPlugin = function(code, plugin) {
      return this.pluginRegistry.addPlugin(code, plugin);
    };

    Service.prototype.registerFlow = function(code, flow) {
      return this.flowRegistry.addFlow(code, flow);
    };

    Service.prototype.registerEffect = function(code, effect) {
      return this.effectRegistry.addEffect(code, effect);
    };

    Service.prototype.createParticlesEffect = function(particleManager) {
      return new ParticlesEffect(particleManager);
    };

    return Service;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvc2VydmljZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSOztFQUVsQixNQUFNLENBQUMsT0FBUCxHQUF1QjtJQUNSLGlCQUFDLGNBQUQsRUFBaUIsWUFBakIsRUFBK0IsY0FBL0I7TUFDWCxJQUFDLENBQUEsY0FBRCxHQUFrQjtNQUNsQixJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUNoQixJQUFDLENBQUEsY0FBRCxHQUFrQjtJQUhQOztzQkFLYixjQUFBLEdBQWdCLFNBQUMsSUFBRCxFQUFPLE1BQVA7YUFDZCxJQUFDLENBQUEsY0FBYyxDQUFDLFNBQWhCLENBQTBCLElBQTFCLEVBQWdDLE1BQWhDO0lBRGM7O3NCQUdoQixZQUFBLEdBQWMsU0FBQyxJQUFELEVBQU8sSUFBUDthQUNaLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFzQixJQUF0QixFQUE0QixJQUE1QjtJQURZOztzQkFHZCxjQUFBLEdBQWdCLFNBQUMsSUFBRCxFQUFPLE1BQVA7YUFDZCxJQUFDLENBQUEsY0FBYyxDQUFDLFNBQWhCLENBQTBCLElBQTFCLEVBQWdDLE1BQWhDO0lBRGM7O3NCQUdoQixxQkFBQSxHQUF1QixTQUFDLGVBQUQ7YUFDakIsSUFBQSxlQUFBLENBQWdCLGVBQWhCO0lBRGlCOzs7OztBQWpCekIiLCJzb3VyY2VzQ29udGVudCI6WyJQYXJ0aWNsZXNFZmZlY3QgPSByZXF1aXJlIFwiLi9lZmZlY3QvcGFydGljbGVzXCJcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTZXJ2aWNlXG4gIGNvbnN0cnVjdG9yOiAocGx1Z2luUmVnaXN0cnksIGZsb3dSZWdpc3RyeSwgZWZmZWN0UmVnaXN0cnkpIC0+XG4gICAgQHBsdWdpblJlZ2lzdHJ5ID0gcGx1Z2luUmVnaXN0cnlcbiAgICBAZmxvd1JlZ2lzdHJ5ID0gZmxvd1JlZ2lzdHJ5XG4gICAgQGVmZmVjdFJlZ2lzdHJ5ID0gZWZmZWN0UmVnaXN0cnlcblxuICByZWdpc3RlclBsdWdpbjogKGNvZGUsIHBsdWdpbikgLT5cbiAgICBAcGx1Z2luUmVnaXN0cnkuYWRkUGx1Z2luIGNvZGUsIHBsdWdpblxuXG4gIHJlZ2lzdGVyRmxvdzogKGNvZGUsIGZsb3cpIC0+XG4gICAgQGZsb3dSZWdpc3RyeS5hZGRGbG93IGNvZGUsIGZsb3dcblxuICByZWdpc3RlckVmZmVjdDogKGNvZGUsIGVmZmVjdCkgLT5cbiAgICBAZWZmZWN0UmVnaXN0cnkuYWRkRWZmZWN0IGNvZGUsIGVmZmVjdFxuXG4gIGNyZWF0ZVBhcnRpY2xlc0VmZmVjdDogKHBhcnRpY2xlTWFuYWdlcikgLT5cbiAgICBuZXcgUGFydGljbGVzRWZmZWN0KHBhcnRpY2xlTWFuYWdlcilcbiJdfQ==
