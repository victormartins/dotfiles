(function() {
  module.exports = {
    title: 'Screen Shake',
    description: 'Shakes the screen on typing.',
    enable: function(api) {
      return this.api = api;
    },
    onInput: function(cursor, screenPosition, input, data) {
      return this.api.shakeScreen(data['intensity']);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvcGx1Z2luL3NjcmVlbi1zaGFrZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsS0FBQSxFQUFPLGNBQVA7SUFDQSxXQUFBLEVBQWEsOEJBRGI7SUFHQSxNQUFBLEVBQVEsU0FBQyxHQUFEO2FBQ04sSUFBQyxDQUFBLEdBQUQsR0FBTztJQURELENBSFI7SUFNQSxPQUFBLEVBQVMsU0FBQyxNQUFELEVBQVMsY0FBVCxFQUF5QixLQUF6QixFQUFnQyxJQUFoQzthQUNQLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxDQUFpQixJQUFLLENBQUEsV0FBQSxDQUF0QjtJQURPLENBTlQ7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIHRpdGxlOiAnU2NyZWVuIFNoYWtlJ1xuICBkZXNjcmlwdGlvbjogJ1NoYWtlcyB0aGUgc2NyZWVuIG9uIHR5cGluZy4nXG5cbiAgZW5hYmxlOiAoYXBpKSAtPlxuICAgIEBhcGkgPSBhcGlcblxuICBvbklucHV0OiAoY3Vyc29yLCBzY3JlZW5Qb3NpdGlvbiwgaW5wdXQsIGRhdGEpIC0+XG4gICAgQGFwaS5zaGFrZVNjcmVlbihkYXRhWydpbnRlbnNpdHknXSlcbiJdfQ==
