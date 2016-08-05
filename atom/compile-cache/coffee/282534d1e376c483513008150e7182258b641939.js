(function() {
  "use strict";
  var Beautifier, JSBeautify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = JSBeautify = (function(_super) {
    __extends(JSBeautify, _super);

    function JSBeautify() {
      return JSBeautify.__super__.constructor.apply(this, arguments);
    }

    JSBeautify.prototype.name = "JS Beautify";

    JSBeautify.prototype.options = {
      HTML: true,
      XML: true,
      Handlebars: true,
      Mustache: true,
      Marko: true,
      JavaScript: true,
      JSON: true,
      CSS: {
        indent_size: true,
        indent_char: true,
        selector_separator_newline: true,
        newline_between_rules: true,
        preserve_newlines: true,
        wrap_line_length: true
      }
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      this.verbose("JS Beautify language " + language);
      this.info("JS Beautify Options: " + (JSON.stringify(options, null, 4)));
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var beautifyCSS, beautifyHTML, beautifyJS, err;
          try {
            switch (language) {
              case "JSON":
              case "JavaScript":
                beautifyJS = require("js-beautify");
                text = beautifyJS(text, options);
                return resolve(text);
              case "Handlebars":
              case "Mustache":
                options.indent_handlebars = true;
                beautifyHTML = require("js-beautify").html;
                text = beautifyHTML(text, options);
                return resolve(text);
              case "HTML (Liquid)":
              case "HTML":
              case "XML":
              case "Marko":
              case "Web Form/Control (C#)":
              case "Web Handler (C#)":
                beautifyHTML = require("js-beautify").html;
                text = beautifyHTML(text, options);
                _this.debug("Beautified HTML: " + text);
                return resolve(text);
              case "CSS":
                beautifyCSS = require("js-beautify").css;
                text = beautifyCSS(text, options);
                return resolve(text);
            }
          } catch (_error) {
            err = _error;
            _this.error("JS Beautify error: " + err);
            return reject(err);
          }
        };
      })(this));
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2pzLWJlYXV0aWZ5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLElBQUEsR0FBTSxhQUFOLENBQUE7O0FBQUEseUJBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxJQUFBLEVBQU0sSUFEQztBQUFBLE1BRVAsR0FBQSxFQUFLLElBRkU7QUFBQSxNQUdQLFVBQUEsRUFBWSxJQUhMO0FBQUEsTUFJUCxRQUFBLEVBQVUsSUFKSDtBQUFBLE1BS1AsS0FBQSxFQUFPLElBTEE7QUFBQSxNQU1QLFVBQUEsRUFBWSxJQU5MO0FBQUEsTUFPUCxJQUFBLEVBQU0sSUFQQztBQUFBLE1BUVAsR0FBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsSUFBYjtBQUFBLFFBQ0EsV0FBQSxFQUFhLElBRGI7QUFBQSxRQUVBLDBCQUFBLEVBQTRCLElBRjVCO0FBQUEsUUFHQSxxQkFBQSxFQUF1QixJQUh2QjtBQUFBLFFBSUEsaUJBQUEsRUFBbUIsSUFKbkI7QUFBQSxRQUtBLGdCQUFBLEVBQWtCLElBTGxCO09BVEs7S0FGVCxDQUFBOztBQUFBLHlCQW1CQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsT0FBRCxDQUFVLHVCQUFBLEdBQXVCLFFBQWpDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBTyx1QkFBQSxHQUFzQixDQUFDLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBZixFQUF3QixJQUF4QixFQUE4QixDQUE5QixDQUFELENBQTdCLENBREEsQ0FBQTtBQUVBLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDbEIsY0FBQSwwQ0FBQTtBQUFBO0FBQ0Usb0JBQU8sUUFBUDtBQUFBLG1CQUNPLE1BRFA7QUFBQSxtQkFDZSxZQURmO0FBRUksZ0JBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxhQUFSLENBQWIsQ0FBQTtBQUFBLGdCQUNBLElBQUEsR0FBTyxVQUFBLENBQVcsSUFBWCxFQUFpQixPQUFqQixDQURQLENBQUE7dUJBRUEsT0FBQSxDQUFRLElBQVIsRUFKSjtBQUFBLG1CQUtPLFlBTFA7QUFBQSxtQkFLcUIsVUFMckI7QUFPSSxnQkFBQSxPQUFPLENBQUMsaUJBQVIsR0FBNEIsSUFBNUIsQ0FBQTtBQUFBLGdCQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDLElBRnRDLENBQUE7QUFBQSxnQkFHQSxJQUFBLEdBQU8sWUFBQSxDQUFhLElBQWIsRUFBbUIsT0FBbkIsQ0FIUCxDQUFBO3VCQUlBLE9BQUEsQ0FBUSxJQUFSLEVBWEo7QUFBQSxtQkFZTyxlQVpQO0FBQUEsbUJBWXdCLE1BWnhCO0FBQUEsbUJBWWdDLEtBWmhDO0FBQUEsbUJBWXVDLE9BWnZDO0FBQUEsbUJBWWdELHVCQVpoRDtBQUFBLG1CQVl5RSxrQkFaekU7QUFhSSxnQkFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQyxJQUF0QyxDQUFBO0FBQUEsZ0JBQ0EsSUFBQSxHQUFPLFlBQUEsQ0FBYSxJQUFiLEVBQW1CLE9BQW5CLENBRFAsQ0FBQTtBQUFBLGdCQUVBLEtBQUMsQ0FBQSxLQUFELENBQVEsbUJBQUEsR0FBbUIsSUFBM0IsQ0FGQSxDQUFBO3VCQUdBLE9BQUEsQ0FBUSxJQUFSLEVBaEJKO0FBQUEsbUJBaUJPLEtBakJQO0FBa0JJLGdCQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDLEdBQXJDLENBQUE7QUFBQSxnQkFDQSxJQUFBLEdBQU8sV0FBQSxDQUFZLElBQVosRUFBa0IsT0FBbEIsQ0FEUCxDQUFBO3VCQUVBLE9BQUEsQ0FBUSxJQUFSLEVBcEJKO0FBQUEsYUFERjtXQUFBLGNBQUE7QUF1QkUsWUFESSxZQUNKLENBQUE7QUFBQSxZQUFBLEtBQUMsQ0FBQSxLQUFELENBQVEscUJBQUEsR0FBcUIsR0FBN0IsQ0FBQSxDQUFBO21CQUNBLE1BQUEsQ0FBTyxHQUFQLEVBeEJGO1dBRGtCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVCxDQUFYLENBSFE7SUFBQSxDQW5CVixDQUFBOztzQkFBQTs7S0FEd0MsV0FIMUMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/victor.martins/.atom/packages/atom-beautify/src/beautifiers/js-beautify.coffee
