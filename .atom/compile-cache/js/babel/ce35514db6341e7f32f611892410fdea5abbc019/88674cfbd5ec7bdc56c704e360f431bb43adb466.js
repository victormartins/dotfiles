Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _configSchema = require('./config-schema');

var _configSchema2 = _interopRequireDefault(_configSchema);

var _toggleQuotes = require('./toggle-quotes');

'use babel';

exports['default'] = {
  config: _configSchema2['default'],

  activate: function activate() {
    _this.subscription = atom.commands.add('atom-text-editor', 'toggle-quotes:toggle', function () {
      var editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        (0, _toggleQuotes.toggleQuotes)(editor);
      }
    });
  },

  deactivate: function deactivate() {
    _this.subscription.dispose();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy90b2dnbGUtcXVvdGVzL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzRCQUV5QixpQkFBaUI7Ozs7NEJBQ2YsaUJBQWlCOztBQUg1QyxXQUFXLENBQUE7O3FCQUtJO0FBQ2IsUUFBTSwyQkFBYzs7QUFFcEIsVUFBUSxFQUFFLG9CQUFNO0FBQ2QsVUFBSyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsc0JBQXNCLEVBQUUsWUFBTTtBQUN0RixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDakQsVUFBSSxNQUFNLEVBQUU7QUFDVix3Q0FBYSxNQUFNLENBQUMsQ0FBQTtPQUNyQjtLQUNGLENBQUMsQ0FBQTtHQUNIOztBQUVELFlBQVUsRUFBRSxzQkFBTTtBQUNoQixVQUFLLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUM1QjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy90b2dnbGUtcXVvdGVzL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGNvbmZpZ1NjaGVtYSBmcm9tICcuL2NvbmZpZy1zY2hlbWEnXG5pbXBvcnQge3RvZ2dsZVF1b3Rlc30gZnJvbSAnLi90b2dnbGUtcXVvdGVzJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzogY29uZmlnU2NoZW1hLFxuXG4gIGFjdGl2YXRlOiAoKSA9PiB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICd0b2dnbGUtcXVvdGVzOnRvZ2dsZScsICgpID0+IHtcbiAgICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgdG9nZ2xlUXVvdGVzKGVkaXRvcilcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIGRlYWN0aXZhdGU6ICgpID0+IHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgfVxufVxuIl19
//# sourceURL=/Users/victor.martins/.atom/packages/toggle-quotes/lib/main.js
