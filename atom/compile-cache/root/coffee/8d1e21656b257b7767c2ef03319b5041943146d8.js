(function() {
  module.exports = {
    title: 'Default Flow',
    description: 'Basic flow',
    handle: function(input, switcher, comboLvl) {
      if (comboLvl === 0) {
        switcher.offAll();
        return switcher.on('comboMode');
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvZmxvdy9kZWZhdWx0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxLQUFBLEVBQU8sY0FBUDtJQUNBLFdBQUEsRUFBYSxZQURiO0lBR0EsTUFBQSxFQUFRLFNBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsUUFBbEI7TUFDTixJQUFHLFFBQUEsS0FBWSxDQUFmO1FBQ0UsUUFBUSxDQUFDLE1BQVQsQ0FBQTtlQUNBLFFBQVEsQ0FBQyxFQUFULENBQVksV0FBWixFQUZGOztJQURNLENBSFI7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIHRpdGxlOiAnRGVmYXVsdCBGbG93J1xuICBkZXNjcmlwdGlvbjogJ0Jhc2ljIGZsb3cnXG5cbiAgaGFuZGxlOiAoaW5wdXQsIHN3aXRjaGVyLCBjb21ib0x2bCkgLT5cbiAgICBpZiBjb21ib0x2bCA9PSAwXG4gICAgICBzd2l0Y2hlci5vZmZBbGwoKVxuICAgICAgc3dpdGNoZXIub24oJ2NvbWJvTW9kZScpXG4iXX0=
