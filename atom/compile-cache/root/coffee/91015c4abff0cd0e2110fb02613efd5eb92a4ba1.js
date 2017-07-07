(function() {
  var Api, ComboApi, ParticlesEffect, audioPlayer, canvasRenderer, comboMode, comboRenderer, defaultEffect, defaultFlow, editorRegistry, playAudio, powerCanvas, screenShake, screenShaker, switcher, userFileFlow;

  Api = require("./api");

  ParticlesEffect = require("./effect/particles");

  comboRenderer = require("./combo-renderer");

  canvasRenderer = require("./canvas-renderer");

  editorRegistry = require("./service/editor-registry");

  ComboApi = require("./service/combo-api");

  screenShaker = require("./service/screen-shaker");

  audioPlayer = require("./service/audio-player");

  screenShake = require("./plugin/screen-shake");

  playAudio = require("./plugin/play-audio");

  powerCanvas = require("./plugin/power-canvas");

  comboMode = require("./plugin/combo-mode");

  defaultEffect = require("./effect/default");

  defaultFlow = require("./flow/default");

  userFileFlow = require("./flow/user-file");

  switcher = require("./switcher");

  module.exports = {
    comboRenderer: comboRenderer,
    canvasRenderer: canvasRenderer,
    switcher: switcher,
    defaultEffect: defaultEffect,
    defaultFlow: defaultFlow,
    userFileFlow: userFileFlow,
    editorRegistry: editorRegistry,
    screenShaker: screenShaker,
    audioPlayer: audioPlayer,
    screenShake: screenShake,
    playAudio: playAudio,
    comboMode: comboMode,
    powerCanvas: powerCanvas,
    init: function(config, pluginRegistry, flowRegistry, effectRegistry) {
      this.pluginRegistry = pluginRegistry;
      this.flowRegistry = flowRegistry;
      this.effectRegistry = effectRegistry;
      this.initApi();
      pluginRegistry.init(config, this.api);
      this.initCoreFlows();
      this.initCoreEffects();
      return this.initCorePlugins();
    },
    initApi: function() {
      this.comboRenderer.setPluginManager(this);
      this.comboApi = new ComboApi(this.comboRenderer);
      this.canvasRenderer.setEffectRegistry(this.effectRegistry);
      this.screenShaker.init();
      this.audioPlayer.init();
      return this.api = new Api(this.editorRegistry, this.comboApi, this.screenShaker, this.audioPlayer);
    },
    initCorePlugins: function() {
      this.comboMode.setComboRenderer(this.comboRenderer);
      this.powerCanvas.setCanvasRenderer(this.canvasRenderer);
      this.pluginRegistry.addCorePlugin('particles', this.powerCanvas);
      this.pluginRegistry.addCorePlugin('comboMode', this.comboMode);
      this.pluginRegistry.addPlugin('screenShake', this.screenShake);
      return this.pluginRegistry.addPlugin('playAudio', this.playAudio);
    },
    initCoreFlows: function() {
      this.flowRegistry.setDefaultFlow(this.defaultFlow);
      return this.flowRegistry.addFlow('user-file', this.userFileFlow);
    },
    initCoreEffects: function() {
      var effect;
      effect = new ParticlesEffect(defaultEffect);
      return this.effectRegistry.setDefaultEffect(effect);
    },
    enable: function() {
      this.pluginRegistry.enable(this.api);
      this.flowRegistry.enable();
      return this.effectRegistry.enable();
    },
    disable: function() {
      this.screenShaker.disable();
      this.audioPlayer.disable();
      this.flowRegistry.disable();
      this.effectRegistry.disable();
      this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.disable === "function" ? plugin.disable() : void 0;
      });
      return this.pluginRegistry.disable();
    },
    runOnChangePane: function(editor, editorElement) {
      if (editor == null) {
        editor = null;
      }
      if (editorElement == null) {
        editorElement = null;
      }
      this.editorRegistry.setEditor(editor);
      this.editorRegistry.setEditorElement(editorElement);
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onChangePane === "function" ? plugin.onChangePane(editor, editorElement) : void 0;
      });
    },
    runOnNewCursor: function(cursor) {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onNewCursor === "function" ? plugin.onNewCursor(cursor) : void 0;
      });
    },
    runOnInput: function(cursor, screenPosition, input) {
      this.switcher.reset();
      this.flowRegistry.flow.handle(input, this.switcher, this.comboApi.getLevel());
      return this.pluginRegistry.onEnabled((function(_this) {
        return function(code, plugin) {
          if (_this.switcher.isOff(code)) {
            return true;
          }
          return typeof plugin.onInput === "function" ? plugin.onInput(cursor, screenPosition, input, _this.switcher.getData(code)) : void 0;
        };
      })(this));
    },
    runOnComboStartStreak: function() {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboStartStreak === "function" ? plugin.onComboStartStreak() : void 0;
      });
    },
    runOnComboLevelChange: function(newLvl, oldLvl) {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboLevelChange === "function" ? plugin.onComboLevelChange(newLvl, oldLvl) : void 0;
      });
    },
    runOnComboEndStreak: function() {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboEndStreak === "function" ? plugin.onComboEndStreak() : void 0;
      });
    },
    runOnComboExclamation: function(text) {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboExclamation === "function" ? plugin.onComboExclamation(text) : void 0;
      });
    },
    runOnComboMaxStreak: function(maxStreak) {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboMaxStreak === "function" ? plugin.onComboMaxStreak(maxStreak) : void 0;
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvcGx1Z2luLW1hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVI7O0VBQ04sZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVI7O0VBQ2xCLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSOztFQUNoQixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUjs7RUFDakIsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVI7O0VBQ2pCLFFBQUEsR0FBVyxPQUFBLENBQVEscUJBQVI7O0VBQ1gsWUFBQSxHQUFlLE9BQUEsQ0FBUSx5QkFBUjs7RUFDZixXQUFBLEdBQWMsT0FBQSxDQUFRLHdCQUFSOztFQUNkLFdBQUEsR0FBYyxPQUFBLENBQVEsdUJBQVI7O0VBQ2QsU0FBQSxHQUFZLE9BQUEsQ0FBUSxxQkFBUjs7RUFDWixXQUFBLEdBQWMsT0FBQSxDQUFRLHVCQUFSOztFQUNkLFNBQUEsR0FBWSxPQUFBLENBQVEscUJBQVI7O0VBQ1osYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVI7O0VBQ2hCLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBQ2QsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUjs7RUFDZixRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGFBQUEsRUFBZSxhQUFmO0lBQ0EsY0FBQSxFQUFnQixjQURoQjtJQUVBLFFBQUEsRUFBVSxRQUZWO0lBR0EsYUFBQSxFQUFlLGFBSGY7SUFJQSxXQUFBLEVBQWEsV0FKYjtJQUtBLFlBQUEsRUFBYyxZQUxkO0lBTUEsY0FBQSxFQUFnQixjQU5oQjtJQU9BLFlBQUEsRUFBYyxZQVBkO0lBUUEsV0FB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QjtRQUZqRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FERjtJQUpVLENBN0VaO0lBdUZBLHFCQUFBLEVBQXVCLFNBQUE7YUFDckIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFoQixDQUNFLFNBQUMsSUFBRCxFQUFPLE1BQVA7aUVBQWtCLE1BQU0sQ0FBQztNQUF6QixDQURGO0lBRHFCLENBdkZ2QjtJQTRGQSxxQkFBQSxFQUF1QixTQUFDLE1BQUQsRUFBUyxNQUFUO2FBQ3JCLElBQUMsQ0FBQSxjQUFjLENBQUMsU0FBaEIsQ0FDRSxTQUFDLElBQUQsRUFBTyxNQUFQO2lFQUFrQixNQUFNLENBQUMsbUJBQW9CLFFBQVE7TUFBckQsQ0FERjtJQURxQixDQTVGdkI7SUFpR0EsbUJBQUEsRUFBcUIsU0FBQTthQUNuQixJQUFDLENBQUEsY0FBYyxDQUFDLFNBQWhCLENBQ0UsU0FBQyxJQUFELEVBQU8sTUFBUDsrREFBa0IsTUFBTSxDQUFDO01BQXpCLENBREY7SUFEbUIsQ0FqR3JCO0lBc0dBLHFCQUFBLEVBQXVCLFNBQUMsSUFBRDthQUNyQixJQUFDLENBQUEsY0FBYyxDQUFDLFNBQWhCLENBQ0UsU0FBQyxJQUFELEVBQU8sTUFBUDtpRUFBa0IsTUFBTSxDQUFDLG1CQUFvQjtNQUE3QyxDQURGO0lBRHFCLENBdEd2QjtJQTJHQSxtQkFBQSxFQUFxQixTQUFDLFNBQUQ7YUFDbkIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFoQixDQUNFLFNBQUMsSUFBRCxFQUFPLE1BQVA7K0RBQWtCLE1BQU0sQ0FBQyxpQkFBa0I7TUFBM0MsQ0FERjtJQURtQixDQTNHckI7O0FBbEJGIiwic291cmNlc0NvbnRlbnQiOlsiQXBpID0gcmVxdWlyZSBcIi4vYXBpXCJcblBhcnRpY2xlc0VmZmVjdCA9IHJlcXVpcmUgXCIuL2VmZmVjdC9wYXJ0aWNsZXNcIlxuY29tYm9SZW5kZXJlciA9IHJlcXVpcmUgXCIuL2NvbWJvLXJlbmRlcmVyXCJcbmNhbnZhc1JlbmRlcmVyID0gcmVxdWlyZSBcIi4vY2FudmFzLXJlbmRlcmVyXCJcbmVkaXRvclJlZ2lzdHJ5ID0gcmVxdWlyZSBcIi4vc2VydmljZS9lZGl0b3ItcmVnaXN0cnlcIlxuQ29tYm9BcGkgPSByZXF1aXJlIFwiLi9zZXJ2aWNlL2NvbWJvLWFwaVwiXG5zY3JlZW5TaGFrZXIgPSByZXF1aXJlIFwiLi9zZXJ2aWNlL3NjcmVlbi1zaGFrZXJcIlxuYXVkaW9QbGF5ZXIgPSByZXF1aXJlIFwiLi9zZXJ2aWNlL2F1ZGlvLXBsYXllclwiXG5zY3JlZW5TaGFrZSA9IHJlcXVpcmUgXCIuL3BsdWdpbi9zY3JlZW4tc2hha2VcIlxucGxheUF1ZGlvID0gcmVxdWlyZSBcIi4vcGx1Z2luL3BsYXktYXVkaW9cIlxucG93ZXJDYW52YXMgPSByZXF1aXJlIFwiLi9wbHVnaW4vcG93ZXItY2FudmFzXCJcbmNvbWJvTW9kZSA9IHJlcXVpcmUgXCIuL3BsdWdpbi9jb21iby1tb2RlXCJcbmRlZmF1bHRFZmZlY3QgPSByZXF1aXJlIFwiLi9lZmZlY3QvZGVmYXVsdFwiXG5kZWZhdWx0RmxvdyA9IHJlcXVpcmUgXCIuL2Zsb3cvZGVmYXVsdFwiXG51c2VyRmlsZUZsb3cgPSByZXF1aXJlIFwiLi9mbG93L3VzZXItZmlsZVwiXG5zd2l0Y2hlciA9IHJlcXVpcmUgXCIuL3N3aXRjaGVyXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb21ib1JlbmRlcmVyOiBjb21ib1JlbmRlcmVyXG4gIGNhbnZhc1JlbmRlcmVyOiBjYW52YXNSZW5kZXJlclxuICBzd2l0Y2hlcjogc3dpdGNoZXJcbiAgZGVmYXVsdEVmZmVjdDogZGVmYXVsdEVmZmVjdFxuICBkZWZhdWx0RmxvdzogZGVmYXVsdEZsb3dcbiAgdXNlckZpbGVGbG93OiB1c2VyRmlsZUZsb3dcbiAgZWRpdG9yUmVnaXN0cnk6IGVkaXRvclJlZ2lzdHJ5XG4gIHNjcmVlblNoYWtlcjogc2NyZWVuU2hha2VyXG4gIGF1ZGlvUGxheWVyOiBhdWRpb1BsYXllclxuICBzY3JlZW5TaGFrZTogc2NyZWVuU2hha2VcbiAgcGxheUF1ZGlvOiBwbGF5QXVkaW9cbiAgY29tYm9Nb2RlOiBjb21ib01vZGVcbiAgcG93ZXJDYW52YXM6IHBvd2VyQ2FudmFzXG5cbiAgaW5pdDogKGNvbmZpZywgcGx1Z2luUmVnaXN0cnksIGZsb3dSZWdpc3RyeSwgZWZmZWN0UmVnaXN0cnkpIC0+XG4gICAgQHBsdWdpblJlZ2lzdHJ5ID0gcGx1Z2luUmVnaXN0cnlcbiAgICBAZmxvd1JlZ2lzdHJ5ID0gZmxvd1JlZ2lzdHJ5XG4gICAgQGVmZmVjdFJlZ2lzdHJ5ID0gZWZmZWN0UmVnaXN0cnlcbiAgICBAaW5pdEFwaSgpXG4gICAgcGx1Z2luUmVnaXN0cnkuaW5pdCBjb25maWcsIEBhcGlcbiAgICBAaW5pdENvcmVGbG93cygpXG4gICAgQGluaXRDb3JlRWZmZWN0cygpXG4gICAgQGluaXRDb3JlUGx1Z2lucygpXG5cbiAgaW5pdEFwaTogLT5cbiAgICBAY29tYm9SZW5kZXJlci5zZXRQbHVnaW5NYW5hZ2VyIHRoaXNcbiAgICBAY29tYm9BcGkgPSBuZXcgQ29tYm9BcGkoQGNvbWJvUmVuZGVyZXIpXG4gICAgQGNhbnZhc1JlbmRlcmVyLnNldEVmZmVjdFJlZ2lzdHJ5IEBlZmZlY3RSZWdpc3RyeVxuICAgIEBzY3JlZW5TaGFrZXIuaW5pdCgpXG4gICAgQGF1ZGlvUGxheWVyLmluaXQoKVxuICAgIEBhcGkgPSBuZXcgQXBpKEBlZGl0b3JSZWdpc3RyeSwgQGNvbWJvQXBpLCBAc2NyZWVuU2hha2VyLCBAYXVkaW9QbGF5ZXIpXG5cbiAgaW5pdENvcmVQbHVnaW5zOiAtPlxuICAgIEBjb21ib01vZGUuc2V0Q29tYm9SZW5kZXJlciBAY29tYm9SZW5kZXJlclxuICAgIEBwb3dlckNhbnZhcy5zZXRDYW52YXNSZW5kZXJlciBAY2FudmFzUmVuZGVyZXJcbiAgICBAcGx1Z2luUmVnaXN0cnkuYWRkQ29yZVBsdWdpbiAncGFydGljbGVzJywgQHBvd2VyQ2FudmFzXG4gICAgQHBsdWdpblJlZ2lzdHJ5LmFkZENvcmVQbHVnaW4gJ2NvbWJvTW9kZScsIEBjb21ib01vZGVcbiAgICBAcGx1Z2luUmVnaXN0cnkuYWRkUGx1Z2luICdzY3JlZW5TaGFrZScsIEBzY3JlZW5TaGFrZVxuICAgIEBwbHVnaW5SZWdpc3RyeS5hZGRQbHVnaW4gJ3BsYXlBdWRpbycsIEBwbGF5QXVkaW9cblxuICBpbml0Q29yZUZsb3dzOiAtPlxuICAgIEBmbG93UmVnaXN0cnkuc2V0RGVmYXVsdEZsb3cgQGRlZmF1bHRGbG93XG4gICAgQGZsb3dSZWdpc3RyeS5hZGRGbG93ICd1c2VyLWZpbGUnLCBAdXNlckZpbGVGbG93XG5cbiAgaW5pdENvcmVFZmZlY3RzOiAtPlxuICAgIGVmZmVjdCA9IG5ldyBQYXJ0aWNsZXNFZmZlY3QoZGVmYXVsdEVmZmVjdClcbiAgICBAZWZmZWN0UmVnaXN0cnkuc2V0RGVmYXVsdEVmZmVjdCBlZmZlY3RcblxuICBlbmFibGU6IC0+XG4gICAgQHBsdWdpblJlZ2lzdHJ5LmVuYWJsZSBAYXBpXG4gICAgQGZsb3dSZWdpc3RyeS5lbmFibGUoKVxuICAgIEBlZmZlY3RSZWdpc3RyeS5lbmFibGUoKVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQHNjcmVlblNoYWtlci5kaXNhYmxlKClcbiAgICBAYXVkaW9QbGF5ZXIuZGlzYWJsZSgpXG4gICAgQGZsb3dSZWdpc3RyeS5kaXNhYmxlKClcbiAgICBAZWZmZWN0UmVnaXN0cnkuZGlzYWJsZSgpXG5cbiAgICBAcGx1Z2luUmVnaXN0cnkub25FbmFibGVkKFxuICAgICAgKGNvZGUsIHBsdWdpbikgLT4gcGx1Z2luLmRpc2FibGU/KClcbiAgICApXG4gICAgQHBsdWdpblJlZ2lzdHJ5LmRpc2FibGUoKVxuXG4gIHJ1bk9uQ2hhbmdlUGFuZTogKGVkaXRvciA9IG51bGwsIGVkaXRvckVsZW1lbnQgPSBudWxsKSAtPlxuICAgIEBlZGl0b3JSZWdpc3RyeS5zZXRFZGl0b3IgZWRpdG9yXG4gICAgQGVkaXRvclJlZ2lzdHJ5LnNldEVkaXRvckVsZW1lbnQgZWRpdG9yRWxlbWVudFxuXG4gICAgQHBsdWdpblJlZ2lzdHJ5Lm9uRW5hYmxlZChcbiAgICAgIChjb2RlLCBwbHVnaW4pIC0+IHBsdWdpbi5vbkNoYW5nZVBhbmU/KGVkaXRvciwgZWRpdG9yRWxlbWVudClcbiAgICApXG5cbiAgcnVuT25OZXdDdXJzb3I6IChjdXJzb3IpIC0+XG4gICAgQHBsdWdpblJlZ2lzdHJ5Lm9uRW5hYmxlZChcbiAgICAgIChjb2RlLCBwbHVnaW4pIC0+IHBsdWdpbi5vbk5ld0N1cnNvcj8oY3Vyc29yKVxuICAgIClcblxuICBydW5PbklucHV0OiAoY3Vyc29yLCBzY3JlZW5Qb3NpdGlvbiwgaW5wdXQpIC0+XG4gICAgQHN3aXRjaGVyLnJlc2V0KClcbiAgICBAZmxvd1JlZ2lzdHJ5LmZsb3cuaGFuZGxlIGlucHV0LCBAc3dpdGNoZXIsIEBjb21ib0FwaS5nZXRMZXZlbCgpXG5cbiAgICBAcGx1Z2luUmVnaXN0cnkub25FbmFibGVkKFxuICAgICAgKGNvZGUsIHBsdWdpbikgPT5cbiAgICAgICAgcmV0dXJuIHRydWUgaWYgQHN3aXRjaGVyLmlzT2ZmIGNvZGVcbiAgICAgICAgcGx1Z2luLm9uSW5wdXQ/KGN1cnNvciwgc2NyZWVuUG9zaXRpb24sIGlucHV0LCBAc3dpdGNoZXIuZ2V0RGF0YSBjb2RlKVxuICAgIClcblxuICBydW5PbkNvbWJvU3RhcnRTdHJlYWs6IC0+XG4gICAgQHBsdWdpblJlZ2lzdHJ5Lm9uRW5hYmxlZChcbiAgICAgIChjb2RlLCBwbHVnaW4pIC0+IHBsdWdpbi5vbkNvbWJvU3RhcnRTdHJlYWs/KClcbiAgICApXG5cbiAgcnVuT25Db21ib0xldmVsQ2hhbmdlOiAobmV3THZsLCBvbGRMdmwpIC0+XG4gICAgQHBsdWdpblJlZ2lzdHJ5Lm9uRW5hYmxlZChcbiAgICAgIChjb2RlLCBwbHVnaW4pIC0+IHBsdWdpbi5vbkNvbWJvTGV2ZWxDaGFuZ2U/KG5ld0x2bCwgb2xkTHZsKVxuICAgIClcblxuICBydW5PbkNvbWJvRW5kU3RyZWFrOiAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeS5vbkVuYWJsZWQoXG4gICAgICAoY29kZSwgcGx1Z2luKSAtPiBwbHVnaW4ub25Db21ib0VuZFN0cmVhaz8oKVxuICAgIClcblxuICBydW5PbkNvbWJvRXhjbGFtYXRpb246ICh0ZXh0KSAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeS5vbkVuYWJsZWQoXG4gICAgICAoY29kZSwgcGx1Z2luKSAtPiBwbHVnaW4ub25Db21ib0V4Y2xhbWF0aW9uPyh0ZXh0KVxuICAgIClcblxuICBydW5PbkNvbWJvTWF4U3RyZWFrOiAobWF4U3RyZWFrKSAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeS5vbkVuYWJsZWQoXG4gICAgICAoY29kZSwgcGx1Z2luKSAtPiBwbHVnaW4ub25Db21ib01heFN0cmVhaz8obWF4U3RyZWFrKVxuICAgIClcbiJdfQ==
