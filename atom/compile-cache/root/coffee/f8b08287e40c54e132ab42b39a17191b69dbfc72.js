(function() {
  var CompositeDisposable;

  CompositeDisposable = require("atom").CompositeDisposable;

  module.exports = {
    subscriptions: null,
    effects: [],
    effect: null,
    key: "activate-power-mode.particles.effect",
    enable: function() {
      this.subscriptions = new CompositeDisposable;
      this.observeEffect();
      return this.initList();
    },
    disable: function() {
      var ref, ref1;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      if ((ref1 = this.effectList) != null) {
        ref1.dispose();
      }
      return this.effectList = null;
    },
    setDefaultEffect: function(effect) {
      this.effect = effect;
      return this.effects['default'] = effect;
    },
    addEffect: function(code, effect) {
      this.effects[code] = effect;
      if (atom.config.get(this.key) === code) {
        return this.effect = effect;
      }
    },
    observeEffect: function() {
      return this.subscriptions.add(atom.config.observe(this.key, (function(_this) {
        return function(code) {
          var effect;
          if (_this.effects[code] != null) {
            effect = _this.effects[code];
          } else {
            effect = _this.effects['default'];
          }
          _this.effect.disable();
          _this.effect = effect;
          return _this.effect.init();
        };
      })(this)));
    },
    selectEffect: function(code) {
      return atom.config.set(this.key, code);
    },
    initList: function() {
      if (this.effectList != null) {
        return;
      }
      this.effectList = require("./effect-list");
      this.effectList.init(this);
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        "activate-power-mode:select-effect": (function(_this) {
          return function() {
            return _this.effectList.toggle();
          };
        })(this)
      }));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvZWZmZWN0LXJlZ2lzdHJ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsYUFBQSxFQUFlLElBQWY7SUFDQSxPQUFBLEVBQVMsRUFEVDtJQUVBLE1BQUEsRUFBUSxJQUZSO0lBR0EsR0FBQSxFQUFLLHNDQUhMO0lBS0EsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxhQUFELENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxDQUFBO0lBSE0sQ0FMUjtJQVVBLE9BQUEsRUFBUyxTQUFBO0FBQ1AsVUFBQTs7V0FBYyxDQUFFLE9BQWhCLENBQUE7OztZQUNXLENBQUUsT0FBYixDQUFBOzthQUNBLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFIUCxDQVZUO0lBZUEsZ0JBQUEsRUFBa0IsU0FBQyxNQUFEO01BQ2hCLElBQUMsQ0FBQSxNQUFELEdBQVU7YUFDVixJQUFDLENBQUEsT0FBUSxDQUFBLFNBQUEsQ0FBVCxHQUFzQjtJQUZOLENBZmxCO0lBbUJBLFNBQUEsRUFBVyxTQUFDLElBQUQsRUFBTyxNQUFQO01BQ1QsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFBLENBQVQsR0FBaUI7TUFFakIsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLEdBQWpCLENBQUEsS0FBeUIsSUFBNUI7ZUFDRSxJQUFDLENBQUEsTUFBRCxHQUFVLE9BRFo7O0lBSFMsQ0FuQlg7SUF5QkEsYUFBQSxFQUFlLFNBQUE7YUFDYixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQ2pCLElBQUMsQ0FBQSxHQURnQixFQUNYLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO0FBQ0osY0FBQTtVQUFBLElBQUcsMkJBQUg7WUFDRSxNQUFBLEdBQVMsS0FBQyxDQUFBLE9BQVEsQ0FBQSxJQUFBLEVBRHBCO1dBQUEsTUFBQTtZQUdFLE1BQUEsR0FBUyxLQUFDLENBQUEsT0FBUSxDQUFBLFNBQUEsRUFIcEI7O1VBSUEsS0FBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUE7VUFDQSxLQUFDLENBQUEsTUFBRCxHQUFVO2lCQUNWLEtBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFBO1FBUEk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFcsQ0FBbkI7SUFEYSxDQXpCZjtJQXFDQSxZQUFBLEVBQWMsU0FBQyxJQUFEO2FBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLElBQUMsQ0FBQSxHQUFqQixFQUFzQixJQUF0QjtJQURZLENBckNkO0lBd0NBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBVSx1QkFBVjtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxPQUFBLENBQVEsZUFBUjtNQUNkLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFpQixJQUFqQjthQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO1FBQUEsbUNBQUEsRUFBcUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDbkMsS0FBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUE7VUFEbUM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJDO09BRGlCLENBQW5CO0lBTlEsQ0F4Q1Y7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlIFwiYXRvbVwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBlZmZlY3RzOiBbXVxuICBlZmZlY3Q6IG51bGxcbiAga2V5OiBcImFjdGl2YXRlLXBvd2VyLW1vZGUucGFydGljbGVzLmVmZmVjdFwiXG5cbiAgZW5hYmxlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAb2JzZXJ2ZUVmZmVjdCgpXG4gICAgQGluaXRMaXN0KClcblxuICBkaXNhYmxlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAZWZmZWN0TGlzdD8uZGlzcG9zZSgpXG4gICAgQGVmZmVjdExpc3QgPSBudWxsXG5cbiAgc2V0RGVmYXVsdEVmZmVjdDogKGVmZmVjdCkgLT5cbiAgICBAZWZmZWN0ID0gZWZmZWN0XG4gICAgQGVmZmVjdHNbJ2RlZmF1bHQnXSA9IGVmZmVjdFxuXG4gIGFkZEVmZmVjdDogKGNvZGUsIGVmZmVjdCkgLT5cbiAgICBAZWZmZWN0c1tjb2RlXSA9IGVmZmVjdFxuXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KEBrZXkpIGlzIGNvZGVcbiAgICAgIEBlZmZlY3QgPSBlZmZlY3RcblxuICBvYnNlcnZlRWZmZWN0OiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgQGtleSwgKGNvZGUpID0+XG4gICAgICAgIGlmIEBlZmZlY3RzW2NvZGVdP1xuICAgICAgICAgIGVmZmVjdCA9IEBlZmZlY3RzW2NvZGVdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlZmZlY3QgPSBAZWZmZWN0c1snZGVmYXVsdCddXG4gICAgICAgIEBlZmZlY3QuZGlzYWJsZSgpXG4gICAgICAgIEBlZmZlY3QgPSBlZmZlY3RcbiAgICAgICAgQGVmZmVjdC5pbml0KClcbiAgICApXG5cbiAgc2VsZWN0RWZmZWN0OiAoY29kZSkgLT5cbiAgICBhdG9tLmNvbmZpZy5zZXQoQGtleSwgY29kZSlcblxuICBpbml0TGlzdDogLT5cbiAgICByZXR1cm4gaWYgQGVmZmVjdExpc3Q/XG5cbiAgICBAZWZmZWN0TGlzdCA9IHJlcXVpcmUgXCIuL2VmZmVjdC1saXN0XCJcbiAgICBAZWZmZWN0TGlzdC5pbml0IHRoaXNcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsXG4gICAgICBcImFjdGl2YXRlLXBvd2VyLW1vZGU6c2VsZWN0LWVmZmVjdFwiOiA9PlxuICAgICAgICBAZWZmZWN0TGlzdC50b2dnbGUoKVxuIl19
