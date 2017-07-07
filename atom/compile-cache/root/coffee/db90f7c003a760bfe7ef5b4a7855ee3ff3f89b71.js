(function() {
  var ComboApi;

  module.exports = ComboApi = (function() {
    function ComboApi(comboRenderer) {
      this.combo = comboRenderer;
    }

    ComboApi.prototype.increase = function(n) {
      if (n == null) {
        n = 1;
      }
      if (this.combo.isEnable) {
        return this.combo.modifyStreak(n);
      }
    };

    ComboApi.prototype.decrease = function(n) {
      if (n == null) {
        n = 1;
      }
      if (this.combo.isEnable) {
        return this.combo.modifyStreak(-n);
      }
    };

    ComboApi.prototype.exclame = function(word, type) {
      if (word == null) {
        word = null;
      }
      if (type == null) {
        type = null;
      }
      if (this.combo.isEnable) {
        return this.combo.showExclamation(word, type);
      }
    };

    ComboApi.prototype.resetCounter = function() {
      if (this.combo.isEnable) {
        return this.combo.resetCounter();
      }
    };

    ComboApi.prototype.getLevel = function() {
      if (this.combo.isEnable) {
        return this.combo.getLevel();
      } else {
        return null;
      }
    };

    ComboApi.prototype.isEnable = function() {
      return this.combo.isEnable;
    };

    return ComboApi;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvc2VydmljZS9jb21iby1hcGkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtJQUNSLGtCQUFDLGFBQUQ7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBREU7O3VCQUdiLFFBQUEsR0FBVSxTQUFDLENBQUQ7O1FBQUMsSUFBSTs7TUFDYixJQUF5QixJQUFDLENBQUEsS0FBSyxDQUFDLFFBQWhDO2VBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxZQUFQLENBQW9CLENBQXBCLEVBQUE7O0lBRFE7O3VCQUdWLFFBQUEsR0FBVSxTQUFDLENBQUQ7O1FBQUMsSUFBSTs7TUFDYixJQUEyQixJQUFDLENBQUEsS0FBSyxDQUFDLFFBQWxDO2VBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxZQUFQLENBQW9CLENBQUMsQ0FBckIsRUFBQTs7SUFEUTs7dUJBR1YsT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFjLElBQWQ7O1FBQUMsT0FBTzs7O1FBQU0sT0FBTzs7TUFDNUIsSUFBcUMsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUE1QztlQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsZUFBUCxDQUF1QixJQUF2QixFQUE2QixJQUE3QixFQUFBOztJQURPOzt1QkFHVCxZQUFBLEdBQWMsU0FBQTtNQUNaLElBQXlCLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBaEM7ZUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLFlBQVAsQ0FBQSxFQUFBOztJQURZOzt1QkFHZCxRQUFBLEdBQVUsU0FBQTtNQUNSLElBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFWO2VBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFQLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxLQUhGOztJQURROzt1QkFNVixRQUFBLEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxLQUFLLENBQUM7SUFEQzs7Ozs7QUF0QloiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENvbWJvQXBpXG4gIGNvbnN0cnVjdG9yOiAoY29tYm9SZW5kZXJlcikgLT5cbiAgICBAY29tYm8gPSBjb21ib1JlbmRlcmVyXG5cbiAgaW5jcmVhc2U6IChuID0gMSkgLT5cbiAgICBAY29tYm8ubW9kaWZ5U3RyZWFrIG4gaWYgQGNvbWJvLmlzRW5hYmxlXG5cbiAgZGVjcmVhc2U6IChuID0gMSkgLT5cbiAgICBAY29tYm8ubW9kaWZ5U3RyZWFrKC1uKSBpZiBAY29tYm8uaXNFbmFibGVcblxuICBleGNsYW1lOiAod29yZCA9IG51bGwsIHR5cGUgPSBudWxsKSAtPlxuICAgIEBjb21iby5zaG93RXhjbGFtYXRpb24gd29yZCwgdHlwZSBpZiBAY29tYm8uaXNFbmFibGVcblxuICByZXNldENvdW50ZXI6IC0+XG4gICAgQGNvbWJvLnJlc2V0Q291bnRlcigpIGlmIEBjb21iby5pc0VuYWJsZVxuXG4gIGdldExldmVsOiAtPlxuICAgIGlmIEBjb21iby5pc0VuYWJsZVxuICAgICAgQGNvbWJvLmdldExldmVsKClcbiAgICBlbHNlXG4gICAgICBudWxsXG5cbiAgaXNFbmFibGU6IC0+XG4gICAgQGNvbWJvLmlzRW5hYmxlXG4iXX0=
