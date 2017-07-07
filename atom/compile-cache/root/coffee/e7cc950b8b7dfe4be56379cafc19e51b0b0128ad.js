(function() {
  module.exports = {
    reset: function() {
      return this.onAll();
    },
    offAll: function() {
      this["default"] = false;
      return this.plugins = [];
    },
    onAll: function() {
      this["default"] = true;
      return this.plugins = [];
    },
    off: function(code) {
      return this.plugins[code] = false;
    },
    on: function(code, data) {
      if (data != null) {
        return this.plugins[code] = data;
      } else {
        return this.plugins[code] = true;
      }
    },
    isOff: function(code) {
      return !this.isOn(code);
    },
    isOn: function(code) {
      if (this.plugins[code] == null) {
        return this["default"];
      } else {
        return true;
      }
    },
    getData: function(code) {
      if ((this.plugins[code] != null) && typeof this.plugins[code] === 'object') {
        return this.plugins[code];
      } else {
        return [];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvc3dpdGNoZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLEtBQUEsRUFBTyxTQUFBO2FBQ0wsSUFBQyxDQUFBLEtBQUQsQ0FBQTtJQURLLENBQVA7SUFHQSxNQUFBLEVBQVEsU0FBQTtNQUNOLElBQUMsRUFBQSxPQUFBLEVBQUQsR0FBVzthQUNYLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFGTCxDQUhSO0lBT0EsS0FBQSxFQUFPLFNBQUE7TUFDTCxJQUFDLEVBQUEsT0FBQSxFQUFELEdBQVc7YUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXO0lBRk4sQ0FQUDtJQVdBLEdBQUEsRUFBSyxTQUFDLElBQUQ7YUFDSCxJQUFDLENBQUEsT0FBUSxDQUFBLElBQUEsQ0FBVCxHQUFpQjtJQURkLENBWEw7SUFjQSxFQUFBLEVBQUksU0FBQyxJQUFELEVBQU8sSUFBUDtNQUNGLElBQUcsWUFBSDtlQUNFLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQSxDQUFULEdBQWlCLEtBRG5CO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQSxDQUFULEdBQWlCLEtBSG5COztJQURFLENBZEo7SUFvQkEsS0FBQSxFQUFPLFNBQUMsSUFBRDthQUNMLENBQUksSUFBQyxDQUFBLElBQUQsQ0FBTSxJQUFOO0lBREMsQ0FwQlA7SUF1QkEsSUFBQSxFQUFNLFNBQUMsSUFBRDtNQUNKLElBQU8sMEJBQVA7ZUFDRSxJQUFDLEVBQUEsT0FBQSxHQURIO09BQUEsTUFBQTtlQUdFLEtBSEY7O0lBREksQ0F2Qk47SUE2QkEsT0FBQSxFQUFTLFNBQUMsSUFBRDtNQUNQLElBQUcsNEJBQUEsSUFBb0IsT0FBTyxJQUFDLENBQUEsT0FBUSxDQUFBLElBQUEsQ0FBaEIsS0FBeUIsUUFBaEQ7ZUFDRSxJQUFDLENBQUEsT0FBUSxDQUFBLElBQUEsRUFEWDtPQUFBLE1BQUE7ZUFHRSxHQUhGOztJQURPLENBN0JUOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICByZXNldDogLT5cbiAgICBAb25BbGwoKVxuXG4gIG9mZkFsbDogLT5cbiAgICBAZGVmYXVsdCA9IGZhbHNlXG4gICAgQHBsdWdpbnMgPSBbXVxuXG4gIG9uQWxsOiAtPlxuICAgIEBkZWZhdWx0ID0gdHJ1ZVxuICAgIEBwbHVnaW5zID0gW11cblxuICBvZmY6IChjb2RlKSAtPlxuICAgIEBwbHVnaW5zW2NvZGVdID0gZmFsc2VcblxuICBvbjogKGNvZGUsIGRhdGEpIC0+XG4gICAgaWYgZGF0YT9cbiAgICAgIEBwbHVnaW5zW2NvZGVdID0gZGF0YVxuICAgIGVsc2VcbiAgICAgIEBwbHVnaW5zW2NvZGVdID0gdHJ1ZVxuXG4gIGlzT2ZmOiAoY29kZSkgLT5cbiAgICBub3QgQGlzT24gY29kZVxuXG4gIGlzT246IChjb2RlKSAtPlxuICAgIGlmIG5vdCBAcGx1Z2luc1tjb2RlXT9cbiAgICAgIEBkZWZhdWx0XG4gICAgZWxzZVxuICAgICAgdHJ1ZVxuXG4gIGdldERhdGE6IChjb2RlKSAtPlxuICAgIGlmIEBwbHVnaW5zW2NvZGVdPyBhbmQgdHlwZW9mIEBwbHVnaW5zW2NvZGVdIGlzICdvYmplY3QnXG4gICAgICBAcGx1Z2luc1tjb2RlXVxuICAgIGVsc2VcbiAgICAgIFtdXG4iXX0=
