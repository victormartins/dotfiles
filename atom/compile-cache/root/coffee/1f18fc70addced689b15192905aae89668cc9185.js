(function() {
  var SublimeSelectEditorHandler, defaultCfg, inputCfg, key, mouseNumMap, os, packageName, selectKeyMap, value;

  packageName = "Sublime-Style-Column-Selection";

  os = require('os');

  SublimeSelectEditorHandler = require('./editor-handler.coffee');

  defaultCfg = (function() {
    switch (os.platform()) {
      case 'win32':
        return {
          selectKey: 'altKey',
          selectKeyName: 'Alt',
          mouseNum: 1,
          mouseName: "Left"
        };
      case 'darwin':
        return {
          selectKey: 'altKey',
          selectKeyName: 'Alt',
          mouseNum: 1,
          mouseName: "Left"
        };
      case 'linux':
        return {
          selectKey: 'shiftKey',
          selectKeyName: 'Shift',
          mouseNum: 1,
          mouseName: "Left"
        };
      default:
        return {
          selectKey: 'shiftKey',
          selectKeyName: 'Shift',
          mouseNum: 1,
          mouseName: "Left"
        };
    }
  })();

  mouseNumMap = {
    Left: 1,
    Middle: 2,
    Right: 3
  };

  selectKeyMap = {
    Shift: 'shiftKey',
    Alt: 'altKey',
    Ctrl: 'ctrlKey'
  };

  if (os.platform() === 'darwin') {
    selectKeyMap.Cmd = 'metaKey';
  }

  selectKeyMap.None = null;

  inputCfg = defaultCfg;

  module.exports = {
    config: {
      mouseButtonTrigger: {
        title: "Mouse Button",
        description: "The mouse button that will trigger column selection. If empty, the default will be used " + defaultCfg.mouseName + " mouse button.",
        type: 'string',
        "enum": (function() {
          var results;
          results = [];
          for (key in mouseNumMap) {
            value = mouseNumMap[key];
            results.push(key);
          }
          return results;
        })(),
        "default": defaultCfg.mouseName
      },
      selectKeyTrigger: {
        title: "Select Key",
        description: "The key that will trigger column selection. If empty, the default will be used " + defaultCfg.selectKeyName + " key.",
        type: 'string',
        "enum": (function() {
          var results;
          results = [];
          for (key in selectKeyMap) {
            value = selectKeyMap[key];
            results.push(key);
          }
          return results;
        })(),
        "default": defaultCfg.selectKeyName
      }
    },
    activate: function(state) {
      this.observers = [];
      this.editor_handler = null;
      this.observers.push(atom.config.observe(packageName + ".mouseButtonTrigger", (function(_this) {
        return function(newValue) {
          inputCfg.mouseName = newValue;
          return inputCfg.mouseNum = mouseNumMap[newValue];
        };
      })(this)));
      this.observers.push(atom.config.observe(packageName + ".selectKeyTrigger", (function(_this) {
        return function(newValue) {
          inputCfg.selectKeyName = newValue;
          return inputCfg.selectKey = selectKeyMap[newValue];
        };
      })(this)));
      this.observers.push(atom.workspace.onDidChangeActivePaneItem(this.switch_editor_handler));
      this.observers.push(atom.workspace.onDidAddPane(this.switch_editor_handler));
      return this.observers.push(atom.workspace.onDidDestroyPane(this.switch_editor_handler));
    },
    deactivate: function() {
      var i, len, observer, ref, ref1;
      if ((ref = this.editor_handler) != null) {
        ref.unsubscribe();
      }
      ref1 = this.observers;
      for (i = 0, len = ref1.length; i < len; i++) {
        observer = ref1[i];
        observer.dispose();
      }
      this.observers = null;
      return this.editor_handler = null;
    },
    switch_editor_handler: (function(_this) {
      return function() {
        var active_editor, ref;
        if ((ref = _this.editor_handler) != null) {
          ref.unsubscribe();
        }
        active_editor = atom.workspace.getActiveTextEditor();
        if (active_editor) {
          _this.editor_handler = new SublimeSelectEditorHandler(active_editor, inputCfg);
          return _this.editor_handler.subscribe();
        }
      };
    })(this)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvU3VibGltZS1TdHlsZS1Db2x1bW4tU2VsZWN0aW9uL2xpYi9zdWJsaW1lLXNlbGVjdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFdBQUEsR0FBYzs7RUFFZCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsMEJBQUEsR0FBNkIsT0FBQSxDQUFRLHlCQUFSOztFQUU3QixVQUFBO0FBQWEsWUFBTyxFQUFFLENBQUMsUUFBSCxDQUFBLENBQVA7QUFBQSxXQUNOLE9BRE07ZUFFVDtVQUFBLFNBQUEsRUFBZSxRQUFmO1VBQ0EsYUFBQSxFQUFlLEtBRGY7VUFFQSxRQUFBLEVBQWUsQ0FGZjtVQUdBLFNBQUEsRUFBZSxNQUhmOztBQUZTLFdBTU4sUUFOTTtlQU9UO1VBQUEsU0FBQSxFQUFlLFFBQWY7VUFDQSxhQUFBLEVBQWUsS0FEZjtVQUVBLFFBQUEsRUFBZSxDQUZmO1VBR0EsU0FBQSxFQUFlLE1BSGY7O0FBUFMsV0FXTixPQVhNO2VBWVQ7VUFBQSxTQUFBLEVBQWUsVUFBZjtVQUNBLGFBQUEsRUFBZSxPQURmO1VBRUEsUUFBQSxFQUFlLENBRmY7VUFHQSxTQUFBLEVBQWUsTUFIZjs7QUFaUztlQWlCVDtVQUFBLFNBQUEsRUFBZSxVQUFmO1VBQ0EsYUFBQSxFQUFlLE9BRGY7VUFFQSxRQUFBLEVBQWUsQ0FGZjtVQUdBLFNBQUEsRUFBZSxNQUhmOztBQWpCUzs7O0VBc0JiLFdBQUEsR0FDRTtJQUFBLElBQUEsRUFBUSxDQUFSO0lBQ0EsTUFBQSxFQUFRLENBRFI7SUFFQSxLQUFBLEVBQVEsQ0FGUjs7O0VBSUYsWUFBQSxHQUNFO0lBQUEsS0FBQSxFQUFPLFVBQVA7SUFDQSxHQUFBLEVBQU8sUUFEUDtJQUVBLElBQUEsRUFBTyxTQUZQOzs7RUFJRixJQUFnQyxFQUFFLENBQUMs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QWhCLENBQUEsRUFGRjs7TUFIcUI7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBdkN2Qjs7QUE3Q0YiLCJzb3VyY2VzQ29udGVudCI6WyJwYWNrYWdlTmFtZSA9IFwiU3VibGltZS1TdHlsZS1Db2x1bW4tU2VsZWN0aW9uXCJcblxub3MgPSByZXF1aXJlICdvcydcblN1YmxpbWVTZWxlY3RFZGl0b3JIYW5kbGVyID0gcmVxdWlyZSAnLi9lZGl0b3ItaGFuZGxlci5jb2ZmZWUnXG5cbmRlZmF1bHRDZmcgPSBzd2l0Y2ggb3MucGxhdGZvcm0oKVxuICB3aGVuICd3aW4zMidcbiAgICBzZWxlY3RLZXk6ICAgICAnYWx0S2V5J1xuICAgIHNlbGVjdEtleU5hbWU6ICdBbHQnXG4gICAgbW91c2VOdW06ICAgICAgMVxuICAgIG1vdXNlTmFtZTogICAgIFwiTGVmdFwiXG4gIHdoZW4gJ2RhcndpbidcbiAgICBzZWxlY3RLZXk6ICAgICAnYWx0S2V5J1xuICAgIHNlbGVjdEtleU5hbWU6ICdBbHQnXG4gICAgbW91c2VOdW06ICAgICAgMVxuICAgIG1vdXNlTmFtZTogICAgIFwiTGVmdFwiXG4gIHdoZW4gJ2xpbnV4J1xuICAgIHNlbGVjdEtleTogICAgICdzaGlmdEtleSdcbiAgICBzZWxlY3RLZXlOYW1lOiAnU2hpZnQnXG4gICAgbW91c2VOdW06ICAgICAgMVxuICAgIG1vdXNlTmFtZTogICAgIFwiTGVmdFwiXG4gIGVsc2VcbiAgICBzZWxlY3RLZXk6ICAgICAnc2hpZnRLZXknXG4gICAgc2VsZWN0S2V5TmFtZTogJ1NoaWZ0J1xuICAgIG1vdXNlTnVtOiAgICAgIDFcbiAgICBtb3VzZU5hbWU6ICAgICBcIkxlZnRcIlxuXG5tb3VzZU51bU1hcCA9XG4gIExlZnQ6ICAgMSxcbiAgTWlkZGxlOiAyLFxuICBSaWdodDogIDNcblxuc2VsZWN0S2V5TWFwID1cbiAgU2hpZnQ6ICdzaGlmdEtleScsXG4gIEFsdDogICAnYWx0S2V5JyxcbiAgQ3RybDogICdjdHJsS2V5Jyxcblxuc2VsZWN0S2V5TWFwLkNtZCA9ICdtZXRhS2V5JyBpZiBvcy5wbGF0Zm9ybSgpID09ICdkYXJ3aW4nXG5cbnNlbGVjdEtleU1hcC5Ob25lID0gbnVsbFxuXG5pbnB1dENmZyA9IGRlZmF1bHRDZmdcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIGNvbmZpZzpcbiAgICBtb3VzZUJ1dHRvblRyaWdnZXI6XG4gICAgICB0aXRsZTogXCJNb3VzZSBCdXR0b25cIlxuICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1vdXNlIGJ1dHRvbiB0aGF0IHdpbGwgdHJpZ2dlciBjb2x1bW4gc2VsZWN0aW9uLlxuICAgICAgICBJZiBlbXB0eSwgdGhlIGRlZmF1bHQgd2lsbCBiZSB1c2VkICN7ZGVmYXVsdENmZy5tb3VzZU5hbWV9IG1vdXNlIGJ1dHRvbi5cIlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGVudW06IChrZXkgZm9yIGtleSwgdmFsdWUgb2YgbW91c2VOdW1NYXApXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0Q2ZnLm1vdXNlTmFtZVxuXG4gICAgc2VsZWN0S2V5VHJpZ2dlcjpcbiAgICAgIHRpdGxlOiBcIlNlbGVjdCBLZXlcIlxuICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGtleSB0aGF0IHdpbGwgdHJpZ2dlciBjb2x1bW4gc2VsZWN0aW9uLlxuICAgICAgICBJZiBlbXB0eSwgdGhlIGRlZmF1bHQgd2lsbCBiZSB1c2VkICN7ZGVmYXVsdENmZy5zZWxlY3RLZXlOYW1lfSBrZXkuXCJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBlbnVtOiAoa2V5IGZvciBrZXksIHZhbHVlIG9mIHNlbGVjdEtleU1hcClcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRDZmcuc2VsZWN0S2V5TmFtZVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQG9ic2VydmVycyA9IFtdXG4gICAgQGVkaXRvcl9oYW5kbGVyID0gbnVsbFxuXG4gICAgQG9ic2VydmVycy5wdXNoIGF0b20uY29uZmlnLm9ic2VydmUgXCIje3BhY2thZ2VOYW1lfS5tb3VzZUJ1dHRvblRyaWdnZXJcIiwgKG5ld1ZhbHVlKSA9PlxuICAgICAgaW5wdXRDZmcubW91c2VOYW1lID0gbmV3VmFsdWVcbiAgICAgIGlucHV0Q2ZnLm1vdXNlTnVtID0gbW91c2VOdW1NYXBbbmV3VmFsdWVdXG5cbiAgICBAb2JzZXJ2ZXJzLnB1c2ggYXRvbS5jb25maWcub2JzZXJ2ZSBcIiN7cGFja2FnZU5hbWV9LnNlbGVjdEtleVRyaWdnZXJcIiwgKG5ld1ZhbHVlKSA9PlxuICAgICAgaW5wdXRDZmcuc2VsZWN0S2V5TmFtZSA9IG5ld1ZhbHVlXG4gICAgICBpbnB1dENmZy5zZWxlY3RLZXkgPSBzZWxlY3RLZXlNYXBbbmV3VmFsdWVdXG5cbiAgICBAb2JzZXJ2ZXJzLnB1c2ggYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSBAc3dpdGNoX2VkaXRvcl9oYW5kbGVyXG4gICAgQG9ic2VydmVycy5wdXNoIGF0b20ud29ya3NwYWNlLm9uRGlkQWRkUGFuZSAgICAgICAgICAgICAgQHN3aXRjaF9lZGl0b3JfaGFuZGxlclxuICAgIEBvYnNlcnZlcnMucHVzaCBhdG9tLndvcmtzcGFjZS5vbkRpZERlc3Ryb3lQYW5lICAgICAgICAgIEBzd2l0Y2hfZWRpdG9yX2hhbmRsZXJcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBlZGl0b3JfaGFuZGxlcj8udW5zdWJzY3JpYmUoKVxuICAgIG9ic2VydmVyLmRpc3Bvc2UoKSBmb3Igb2JzZXJ2ZXIgaW4gQG9ic2VydmVyc1xuICAgIEBvYnNlcnZlcnMgPSBudWxsXG4gICAgQGVkaXRvcl9oYW5kbGVyID0gbnVsbFxuXG4gIHN3aXRjaF9lZGl0b3JfaGFuZGxlcjogPT5cbiAgICBAZWRpdG9yX2hhbmRsZXI/LnVuc3Vic2NyaWJlKClcbiAgICBhY3RpdmVfZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgYWN0aXZlX2VkaXRvclxuICAgICAgQGVkaXRvcl9oYW5kbGVyID0gbmV3IFN1YmxpbWVTZWxlY3RFZGl0b3JIYW5kbGVyKGFjdGl2ZV9lZGl0b3IsIGlucHV0Q2ZnKVxuICAgICAgQGVkaXRvcl9oYW5kbGVyLnN1YnNjcmliZSgpXG4iXX0=
