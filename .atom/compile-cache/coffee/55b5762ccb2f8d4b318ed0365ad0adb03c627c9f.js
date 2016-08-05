(function() {
  "use strict";
  var Beautifier, TypeScriptFormatter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = TypeScriptFormatter = (function(_super) {
    __extends(TypeScriptFormatter, _super);

    function TypeScriptFormatter() {
      return TypeScriptFormatter.__super__.constructor.apply(this, arguments);
    }

    TypeScriptFormatter.prototype.name = "TypeScript Formatter";

    TypeScriptFormatter.prototype.options = {
      TypeScript: true
    };

    TypeScriptFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var e, format, formatterUtils, opts, result;
          format = require("typescript-formatter/lib/formatter");
          formatterUtils = require("typescript-formatter/lib/utils");
          opts = formatterUtils.createDefaultFormatCodeOptions();
          opts.TabSize = options.tab_width || options.indent_size;
          opts.IndentSize = options.indent_size;
          opts.IndentStyle = 'space';
          opts.convertTabsToSpaces = true;
          _this.verbose('typescript', text, opts);
          try {
            result = format(text, opts);
            _this.verbose(result);
            return resolve(result);
          } catch (_error) {
            e = _error;
            return reject(e);
          }
        };
      })(this));
    };

    return TypeScriptFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3R5cGVzY3JpcHQtZm9ybWF0dGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsMENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGtDQUFBLElBQUEsR0FBTSxzQkFBTixDQUFBOztBQUFBLGtDQUNBLE9BQUEsR0FBUztBQUFBLE1BQ1AsVUFBQSxFQUFZLElBREw7S0FEVCxDQUFBOztBQUFBLGtDQUtBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBRWxCLGNBQUEsdUNBQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsb0NBQVIsQ0FBVCxDQUFBO0FBQUEsVUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxnQ0FBUixDQURqQixDQUFBO0FBQUEsVUFHQSxJQUFBLEdBQU8sY0FBYyxDQUFDLDhCQUFmLENBQUEsQ0FIUCxDQUFBO0FBQUEsVUFJQSxJQUFJLENBQUMsT0FBTCxHQUFlLE9BQU8sQ0FBQyxTQUFSLElBQXFCLE9BQU8sQ0FBQyxXQUo1QyxDQUFBO0FBQUEsVUFLQSxJQUFJLENBQUMsVUFBTCxHQUFrQixPQUFPLENBQUMsV0FMMUIsQ0FBQTtBQUFBLFVBTUEsSUFBSSxDQUFDLFdBQUwsR0FBbUIsT0FObkIsQ0FBQTtBQUFBLFVBT0EsSUFBSSxDQUFDLG1CQUFMLEdBQTJCLElBUDNCLENBQUE7QUFBQSxVQVFBLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUF1QixJQUF2QixFQUE2QixJQUE3QixDQVJBLENBQUE7QUFTQTtBQUNFLFlBQUEsTUFBQSxHQUFTLE1BQUEsQ0FBTyxJQUFQLEVBQWEsSUFBYixDQUFULENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsTUFBVCxDQURBLENBQUE7bUJBRUEsT0FBQSxDQUFRLE1BQVIsRUFIRjtXQUFBLGNBQUE7QUFLRSxZQURJLFVBQ0osQ0FBQTtBQUFBLG1CQUFPLE1BQUEsQ0FBTyxDQUFQLENBQVAsQ0FMRjtXQVhrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQsQ0FBWCxDQURRO0lBQUEsQ0FMVixDQUFBOzsrQkFBQTs7S0FEaUQsV0FIbkQsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/victor.martins/.atom/packages/atom-beautify/src/beautifiers/typescript-formatter.coffee
