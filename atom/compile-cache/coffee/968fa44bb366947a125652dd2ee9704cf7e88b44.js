(function() {
  var RubocopAutoCorrect;

  RubocopAutoCorrect = require('./rubocop-auto-correct');

  module.exports = {
    activate: function() {
      return this.rubocopAutoCorrect = new RubocopAutoCorrect();
    },
    deactivate: function() {
      var ref;
      if ((ref = this.rubocopAutoCorrect) != null) {
        ref.destroy();
      }
      return this.rubocopAutoCorrect = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3J1Ym9jb3AtYXV0by1jb3JyZWN0L2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSOztFQUVyQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsa0JBQUQsR0FBMEIsSUFBQSxrQkFBQSxDQUFBO0lBRGxCLENBQVY7SUFHQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7O1dBQW1CLENBQUUsT0FBckIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsa0JBQUQsR0FBc0I7SUFGWixDQUhaOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsiUnVib2NvcEF1dG9Db3JyZWN0ID0gcmVxdWlyZSAnLi9ydWJvY29wLWF1dG8tY29ycmVjdCdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogLT5cbiAgICBAcnVib2NvcEF1dG9Db3JyZWN0ID0gbmV3IFJ1Ym9jb3BBdXRvQ29ycmVjdCgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAcnVib2NvcEF1dG9Db3JyZWN0Py5kZXN0cm95KClcbiAgICBAcnVib2NvcEF1dG9Db3JyZWN0ID0gbnVsbFxuIl19
