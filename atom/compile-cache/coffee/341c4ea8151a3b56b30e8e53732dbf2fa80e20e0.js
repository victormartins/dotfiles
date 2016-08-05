(function() {
  module.exports = {
    analytics: {
      title: 'Anonymous Analytics',
      type: 'boolean',
      "default": true,
      description: "There is [Segment.io](https://segment.io/) which forwards data to [Google Analytics](http://www.google.com/analytics/) to track what languages are being used the most, as well as other stats. Everything is anonymized and no personal information, such as source code, is sent. See https://github.com/Glavin001/atom-beautify/issues/47 for more details."
    },
    _analyticsUserId: {
      title: 'Analytics User Id',
      type: 'string',
      "default": "",
      description: "Unique identifier for this user for tracking usage analytics"
    },
    _loggerLevel: {
      title: "Logger Level",
      type: 'string',
      "default": 'warn',
      description: 'Set the level for the logger',
      "enum": ['verbose', 'debug', 'info', 'warn', 'error']
    },
    beautifyEntireFileOnSave: {
      title: "Beautify Entire File On Save",
      type: 'boolean',
      "default": true,
      description: "When beautifying on save, use the entire file, even if there is selected text in the editor"
    },
    muteUnsupportedLanguageErrors: {
      title: "Mute Unsupported Language Errors",
      type: 'boolean',
      "default": false,
      description: "Do not show \"Unsupported Language\" errors when they occur"
    },
    muteAllErrors: {
      title: "Mute All Errors",
      type: 'boolean',
      "default": false,
      description: "Do not show any/all errors when they occur"
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2NvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUNmLFNBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLHFCQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU8sU0FEUDtBQUFBLE1BRUEsU0FBQSxFQUFVLElBRlY7QUFBQSxNQUdBLFdBQUEsRUFBYyxnV0FIZDtLQUZhO0FBQUEsSUFVZixnQkFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sbUJBQVA7QUFBQSxNQUNBLElBQUEsRUFBTyxRQURQO0FBQUEsTUFFQSxTQUFBLEVBQVUsRUFGVjtBQUFBLE1BR0EsV0FBQSxFQUFjLDhEQUhkO0tBWGE7QUFBQSxJQWVmLFlBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLGNBQVA7QUFBQSxNQUNBLElBQUEsRUFBTyxRQURQO0FBQUEsTUFFQSxTQUFBLEVBQVUsTUFGVjtBQUFBLE1BR0EsV0FBQSxFQUFjLDhCQUhkO0FBQUEsTUFJQSxNQUFBLEVBQU8sQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixNQUFyQixFQUE2QixNQUE3QixFQUFxQyxPQUFyQyxDQUpQO0tBaEJhO0FBQUEsSUFxQmYsd0JBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLDhCQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU8sU0FEUDtBQUFBLE1BRUEsU0FBQSxFQUFVLElBRlY7QUFBQSxNQUdBLFdBQUEsRUFBYyw2RkFIZDtLQXRCYTtBQUFBLElBMEJmLDZCQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxrQ0FBUDtBQUFBLE1BQ0EsSUFBQSxFQUFPLFNBRFA7QUFBQSxNQUVBLFNBQUEsRUFBVSxLQUZWO0FBQUEsTUFHQSxXQUFBLEVBQWMsNkRBSGQ7S0EzQmE7QUFBQSxJQStCZixhQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxpQkFBUDtBQUFBLE1BQ0EsSUFBQSxFQUFPLFNBRFA7QUFBQSxNQUVBLFNBQUEsRUFBVSxLQUZWO0FBQUEsTUFHQSxXQUFBLEVBQWMsNENBSGQ7S0FoQ2E7R0FBakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/victor.martins/.atom/packages/atom-beautify/src/config.coffee
