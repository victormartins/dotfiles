(function() {
  var CompositeDisposable, random, throttle;

  CompositeDisposable = require("atom").CompositeDisposable;

  throttle = require("lodash.throttle");

  random = require("lodash.random");

  module.exports = {
    enabled: false,
    subscriptions: null,
    conf: [],
    init: function() {
      return this.enableSubscription = atom.config.observe('activate-power-mode.screenShake.enabled', (function(_this) {
        return function(value) {
          _this.enabled = value;
          if (_this.enabled) {
            return _this.enable();
          } else {
            return _this.disable();
          }
        };
      })(this));
    },
    destroy: function() {
      this.enableSubscription.dispose();
      return this.disable();
    },
    enable: function() {
      this.initConfigSubscribers();
      return this.throttledShake = throttle(this.shakeElement.bind(this), 100, {
        trailing: false
      });
    },
    disable: function() {
      var ref;
      return (ref = this.subscriptions) != null ? ref.dispose() : void 0;
    },
    observe: function(key) {
      return this.subscriptions.add(atom.config.observe("activate-power-mode.screenShake." + key, (function(_this) {
        return function(value) {
          return _this.conf[key] = value;
        };
      })(this)));
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.observe('minIntensity');
      return this.observe('maxIntensity');
    },
    shake: function(element, intensity) {
      if (this.enabled) {
        return this.throttledShake(element, intensity);
      }
    },
    shakeElement: function(element, intensity) {
      var max, min, x, y;
      min = this.conf['minIntensity'];
      max = this.conf['maxIntensity'];
      if (intensity === 'max') {
        min = max - min;
        max = max + 2;
      } else if (intensity === 'min') {
        max = max - min;
      }
      x = this.shakeIntensity(min, max);
      y = this.shakeIntensity(min, max);
      element.style.top = y + "px";
      element.style.left = x + "px";
      return setTimeout(function() {
        element.style.top = "";
        return element.style.left = "";
      }, 75);
    },
    shakeIntensity: function(min, max) {
      var direction;
      direction = Math.random() > 0.5 ? -1 : 1;
      return random(min, max, true) * direction;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvc2VydmljZS9zY3JlZW4tc2hha2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSOztFQUNYLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsT0FBQSxFQUFTLEtBQVQ7SUFDQSxhQUFBLEVBQWUsSUFEZjtJQUVBLElBQUEsRUFBTSxFQUZOO0lBSUEsSUFBQSxFQUFNLFNBQUE7YUFDSixJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQ3BCLHlDQURvQixFQUN1QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtVQUN6QyxLQUFDLENBQUEsT0FBRCxHQUFXO1VBQ1gsSUFBRyxLQUFDLENBQUEsT0FBSjttQkFDRSxLQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFIRjs7UUFGeUM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHZCO0lBRGxCLENBSk47SUFjQSxPQUFBLEVBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxPQUFwQixDQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQTtJQUZPLENBZFQ7SUFrQkEsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFDLENBQUEscUJBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxjQUFELEdBQWtCLFFBQUEsQ0FBUyxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsSUFBbkIsQ0FBVCxFQUFtQyxHQUFuQyxFQUF3QztRQUFBLFFBQUEsRUFBVSxLQUFWO09BQXhDO0lBRlosQ0FsQlI7SUFzQkEsT0FBQSxFQUFTLFNBQUE7QUFDUCxVQUFBO3FEQUFjLENBQUUsT0FBaEIsQ0FBQTtJQURPLENBdEJUO0lBeUJBLE9BQUEsRUFBUyxTQUFDLEdBQUQ7YUFDUCxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQ2pCLGtDQUFBLEdBQW1DLEdBRGxCLEVBQ3lCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO2lCQUN4QyxLQUFDLENBQUEsSUFBSyxDQUFBLEdBQUEsQ0FBTixHQUFhO1FBRDJCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUR6QixDQUFuQjtJQURPLENBekJUO0lBK0JBLHFCQUFBLEVBQXVCLFNBQUE7TUFDckIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsT0FBRCxDQUFTLGNBQVQ7YUFDQSxJQUFDLENBQUEsT0FBRCxDQUFTLGNBQVQ7SUFIcUIsQ0EvQnZCO0lBb0NBLEtBQUEsRUFBTyxTQUFDLE9BQUQsRUFBVSxTQUFWO01BQ0wsSUFBdUMsSUFBQyxDQUFBLE9BQXhDO2VBQUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsU0FBekIsRUFBQTs7SUFESyxDQXBDUDtJQXVDQSxZQUFBLEVBQWMsU0FBQyxPQUFELEVBQVUsU0FBVjtBQUNaLFVBQUE7TUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLElBQUssQ0FBQSxjQUFBO01BQ1osR0FBQSxHQUFNLElBQUMsQ0FBQSxJQUFLLENBQUEsY0FBQTtNQUNaLElBQUcsU0FBQSxLQUFhLEtBQWhCO1FBQ0UsR0FBQSxHQUFNLEdBQUEsR0FBTTtRQUNaLEdBQUEsR0FBTSxHQUFBLEdBQU0sRUFGZDtPQUFBLE1BR0ssSUFBRyxTQUFBLEtBQWEsS0FBaEI7UUFDSCxHQUFBLEdBQU0sR0FBQSxHQUFNLElBRFQ7O01BR0wsQ0FBQSxHQUFJLElBQUMsQ0FBQSxjQUFELENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCO01BQ0osQ0FBQSxHQUFJLElBQUMsQ0FBQSxjQUFELENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCO01BRUosT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFkLEdBQXVCLENBQUQsR0FBRztNQUN6QixPQUFPLENBQUMsS0FBSyxDQUFDLElBQWQsR0FBd0IsQ0FBRCxHQUFHO2FBRTFCLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFkLEdBQW9CO2VBQ3BCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBZCxHQUFxQjtNQUZaLENBQVgsRUFHRSxFQUhGO0lBZlksQ0F2Q2Q7SUEyREEsY0FBQSxFQUFnQixTQUFDLEdBQUQsRUFBTSxHQUFOO0FBQ2QsVUFBQTtNQUFBLFNBQUEsR0FBZSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsR0FBbkIsR0FBNEIsQ0FBQyxDQUE3QixHQUFvQzthQUNoRCxNQUFBLENBQU8sR0FBUCxFQUFZLEdBQVosRUFBaUIsSUFBakIsQ0FBQSxHQUF5QjtJQUZYLENBM0RoQjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgXCJhdG9tXCJcbnRocm90dGxlID0gcmVxdWlyZSBcImxvZGFzaC50aHJvdHRsZVwiXG5yYW5kb20gPSByZXF1aXJlIFwibG9kYXNoLnJhbmRvbVwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZW5hYmxlZDogZmFsc2VcbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBjb25mOiBbXVxuXG4gIGluaXQ6IC0+XG4gICAgQGVuYWJsZVN1YnNjcmlwdGlvbiA9IGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICAnYWN0aXZhdGUtcG93ZXItbW9kZS5zY3JlZW5TaGFrZS5lbmFibGVkJywgKHZhbHVlKSA9PlxuICAgICAgICBAZW5hYmxlZCA9IHZhbHVlXG4gICAgICAgIGlmIEBlbmFibGVkXG4gICAgICAgICAgQGVuYWJsZSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAZGlzYWJsZSgpXG4gICAgKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGVuYWJsZVN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICBAZGlzYWJsZSgpXG5cbiAgZW5hYmxlOiAtPlxuICAgIEBpbml0Q29uZmlnU3Vic2NyaWJlcnMoKVxuICAgIEB0aHJvdHRsZWRTaGFrZSA9IHRocm90dGxlIEBzaGFrZUVsZW1lbnQuYmluZCh0aGlzKSwgMTAwLCB0cmFpbGluZzogZmFsc2VcblxuICBkaXNhYmxlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcblxuICBvYnNlcnZlOiAoa2V5KSAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlLnNjcmVlblNoYWtlLiN7a2V5fVwiLCAodmFsdWUpID0+XG4gICAgICAgIEBjb25mW2tleV0gPSB2YWx1ZVxuICAgIClcblxuICBpbml0Q29uZmlnU3Vic2NyaWJlcnM6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBvYnNlcnZlICdtaW5JbnRlbnNpdHknXG4gICAgQG9ic2VydmUgJ21heEludGVuc2l0eSdcblxuICBzaGFrZTogKGVsZW1lbnQsIGludGVuc2l0eSkgLT5cbiAgICBAdGhyb3R0bGVkU2hha2UoZWxlbWVudCwgaW50ZW5zaXR5KSBpZiBAZW5hYmxlZFxuXG4gIHNoYWtlRWxlbWVudDogKGVsZW1lbnQsIGludGVuc2l0eSkgLT5cbiAgICBtaW4gPSBAY29uZlsnbWluSW50ZW5zaXR5J11cbiAgICBtYXggPSBAY29uZlsnbWF4SW50ZW5zaXR5J11cbiAgICBpZiBpbnRlbnNpdHkgaXMgJ21heCdcbiAgICAgIG1pbiA9IG1heCAtIG1pblxuICAgICAgbWF4ID0gbWF4ICsgMlxuICAgIGVsc2UgaWYgaW50ZW5zaXR5IGlzICdtaW4nXG4gICAgICBtYXggPSBtYXggLSBtaW5cblxuICAgIHggPSBAc2hha2VJbnRlbnNpdHkgbWluLCBtYXhcbiAgICB5ID0gQHNoYWtlSW50ZW5zaXR5IG1pbiwgbWF4XG5cbiAgICBlbGVtZW50LnN0eWxlLnRvcCA9IFwiI3t5fXB4XCJcbiAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBcIiN7eH1weFwiXG5cbiAgICBzZXRUaW1lb3V0IC0+XG4gICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IFwiXCJcbiAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IFwiXCJcbiAgICAsIDc1XG5cbiAgc2hha2VJbnRlbnNpdHk6IChtaW4sIG1heCkgLT5cbiAgICBkaXJlY3Rpb24gPSBpZiBNYXRoLnJhbmRvbSgpID4gMC41IHRoZW4gLTEgZWxzZSAxXG4gICAgcmFuZG9tKG1pbiwgbWF4LCB0cnVlKSAqIGRpcmVjdGlvblxuIl19
