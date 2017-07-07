(function() {
  var os, path;

  path = require("path");

  os = require("os");

  module.exports = {
    title: 'User File',
    description: 'Based on user-file located on user\'s home',
    handle: function(input, switcher, comboLvl) {
      var error, filePath;
      if (this.error) {
        return;
      }
      if (!this.file) {
        filePath = path.join(os.homedir(), '/user-flow');
        try {
          this.file = require(filePath);
        } catch (error1) {
          error = error1;
          atom.notifications.addWarning("File " + filePath + " couldn't be open.");
          this.error = true;
          return;
        }
      }
      return this.file.handle(input, switcher, comboLvl);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvZmxvdy91c2VyLWZpbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUVMLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxLQUFBLEVBQU8sV0FBUDtJQUNBLFdBQUEsRUFBYSw0Q0FEYjtJQUdBLE1BQUEsRUFBUSxTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLFFBQWxCO0FBQ04sVUFBQTtNQUFBLElBQVUsSUFBQyxDQUFBLEtBQVg7QUFBQSxlQUFBOztNQUNBLElBQUcsQ0FBSSxJQUFDLENBQUEsSUFBUjtRQUNFLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxPQUFILENBQUEsQ0FBVixFQUF3QixZQUF4QjtBQUNYO1VBQ0UsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFBLENBQVEsUUFBUixFQURWO1NBQUEsY0FBQTtVQUVNO1VBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUE4QixPQUFBLEdBQVEsUUFBUixHQUFpQixvQkFBL0M7VUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTO0FBQ1QsaUJBTEY7U0FGRjs7YUFTQSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxLQUFiLEVBQW9CLFFBQXBCLEVBQThCLFFBQTlCO0lBWE0sQ0FIUjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlIFwicGF0aFwiXG5vcyA9IHJlcXVpcmUgXCJvc1wiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgdGl0bGU6ICdVc2VyIEZpbGUnXG4gIGRlc2NyaXB0aW9uOiAnQmFzZWQgb24gdXNlci1maWxlIGxvY2F0ZWQgb24gdXNlclxcJ3MgaG9tZSdcblxuICBoYW5kbGU6IChpbnB1dCwgc3dpdGNoZXIsIGNvbWJvTHZsKSAtPlxuICAgIHJldHVybiBpZiBAZXJyb3JcbiAgICBpZiBub3QgQGZpbGVcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgJy91c2VyLWZsb3cnKVxuICAgICAgdHJ5XG4gICAgICAgIEBmaWxlID0gcmVxdWlyZSBmaWxlUGF0aFxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXCJGaWxlICN7ZmlsZVBhdGh9IGNvdWxkbid0IGJlIG9wZW4uXCIpXG4gICAgICAgIEBlcnJvciA9IHRydWVcbiAgICAgICAgcmV0dXJuXG5cbiAgICBAZmlsZS5oYW5kbGUoaW5wdXQsIHN3aXRjaGVyLCBjb21ib0x2bClcbiJdfQ==
