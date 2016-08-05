(function() {
  var RubocopAutoCorrect;

  RubocopAutoCorrect = require('./rubocop-auto-correct');

  module.exports = {
    config: {
      rubocopCommandPath: {
        description: 'If the command does not work, please input rubocop full path here. Example: /Users/<username>/.rbenv/shims/rubocop)',
        type: 'string',
        "default": 'rubocop'
      },
      autoRun: {
        description: 'When you save the buffer, automatically it runs Rubocop auto correct. You need to run manually once at window before you use the option.',
        type: 'boolean',
        "default": false
      },
      notification: {
        description: 'When this option is disabled, you do not receive any notifications even thought a file is corrected.',
        type: 'boolean',
        "default": true
      },
      correctFile: {
        description: 'You can correct a file directly if you enable this option. You do not need to save file after correcting it.',
        type: 'boolean',
        "default": false
      },
      debugMode: {
        description: 'You can get log on console panel if you enable this option.',
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      return this.rubocopAutoCorrect = new RubocopAutoCorrect();
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.rubocopAutoCorrect) != null) {
        _ref.destroy();
      }
      return this.rubocopAutoCorrect = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3J1Ym9jb3AtYXV0by1jb3JyZWN0L2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx3QkFBUixDQUFyQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxrQkFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEscUhBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsU0FGVDtPQURGO0FBQUEsTUFJQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSwwSUFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BTEY7QUFBQSxNQVFBLFlBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLHNHQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBRlQ7T0FURjtBQUFBLE1BWUEsV0FBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsOEdBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQWJGO0FBQUEsTUFnQkEsU0FBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsNkRBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQWpCRjtLQURGO0FBQUEsSUFzQkEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxrQkFBRCxHQUEwQixJQUFBLGtCQUFBLENBQUEsRUFEbEI7SUFBQSxDQXRCVjtBQUFBLElBeUJBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQW1CLENBQUUsT0FBckIsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLGtCQUFELEdBQXNCLEtBRlo7SUFBQSxDQXpCWjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/victor.martins/.atom/packages/rubocop-auto-correct/lib/main.coffee
