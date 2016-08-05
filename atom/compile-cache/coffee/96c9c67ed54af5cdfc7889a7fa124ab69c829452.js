
/*
Language Support and default options.
 */

(function() {
  "use strict";
  var Languages, extend, _;

  _ = require('lodash');

  extend = null;

  module.exports = Languages = (function() {
    Languages.prototype.languageNames = ["apex", "arduino", "c-sharp", "c", "coffeescript", "coldfusion", "cpp", "css", "csv", "d", "ejs", "elm", "erb", "erlang", "gherkin", "go", "fortran", "handlebars", "haskell", "html", "java", "javascript", "json", "jsx", "less", "markdown", 'marko', "mustache", "objective-c", "pawn", "perl", "php", "puppet", "python", "riotjs", "ruby", "rust", "sass", "scss", "spacebars", "sql", "svg", "swig", "tss", "twig", "typescript", "vala", "visualforce", "xml", "xtemplate"];


    /*
    Languages
     */

    Languages.prototype.languages = null;


    /*
    Namespaces
     */

    Languages.prototype.namespaces = null;


    /*
    Constructor
     */

    function Languages() {
      this.languages = _.map(this.languageNames, function(name) {
        return require("./" + name);
      });
      this.namespaces = _.map(this.languages, function(language) {
        return language.namespace;
      });
    }


    /*
    Get language for grammar and extension
     */

    Languages.prototype.getLanguages = function(_arg) {
      var extension, grammar, name, namespace;
      name = _arg.name, namespace = _arg.namespace, grammar = _arg.grammar, extension = _arg.extension;
      return _.union(_.filter(this.languages, function(language) {
        return _.isEqual(language.name, name);
      }), _.filter(this.languages, function(language) {
        return _.isEqual(language.namespace, namespace);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.grammars, grammar);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.extensions, extension);
      }));
    };

    return Languages;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2xhbmd1YWdlcy9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBR0EsWUFIQSxDQUFBO0FBQUEsTUFBQSxvQkFBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUxKLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsSUFOVCxDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFJckIsd0JBQUEsYUFBQSxHQUFlLENBQ2IsTUFEYSxFQUViLFNBRmEsRUFHYixTQUhhLEVBSWIsR0FKYSxFQUtiLGNBTGEsRUFNYixZQU5hLEVBT2IsS0FQYSxFQVFiLEtBUmEsRUFTYixLQVRhLEVBVWIsR0FWYSxFQVdiLEtBWGEsRUFZYixLQVphLEVBYWIsS0FiYSxFQWNiLFFBZGEsRUFlYixTQWZhLEVBZ0JiLElBaEJhLEVBaUJiLFNBakJhLEVBa0JiLFlBbEJhLEVBbUJiLFNBbkJhLEVBb0JiLE1BcEJhLEVBcUJiLE1BckJhLEVBc0JiLFlBdEJhLEVBdUJiLE1BdkJhLEVBd0JiLEtBeEJhLEVBeUJiLE1BekJhLEVBMEJiLFVBMUJhLEVBMkJiLE9BM0JhLEVBNEJiLFVBNUJhLEVBNkJiLGFBN0JhLEVBOEJiLE1BOUJhLEVBK0JiLE1BL0JhLEVBZ0NiLEtBaENhLEVBaUNiLFFBakNhLEVBa0NiLFFBbENhLEVBbUNiLFFBbkNhLEVBb0NiLE1BcENhLEVBcUNiLE1BckNhLEVBc0NiLE1BdENhLEVBdUNiLE1BdkNhLEVBd0NiLFdBeENhLEVBeUNiLEtBekNhLEVBMENiLEtBMUNhLEVBMkNiLE1BM0NhLEVBNENiLEtBNUNhLEVBNkNiLE1BN0NhLEVBOENiLFlBOUNhLEVBK0NiLE1BL0NhLEVBZ0RiLGFBaERhLEVBaURiLEtBakRhLEVBa0RiLFdBbERhLENBQWYsQ0FBQTs7QUFxREE7QUFBQTs7T0FyREE7O0FBQUEsd0JBd0RBLFNBQUEsR0FBVyxJQXhEWCxDQUFBOztBQTBEQTtBQUFBOztPQTFEQTs7QUFBQSx3QkE2REEsVUFBQSxHQUFZLElBN0RaLENBQUE7O0FBK0RBO0FBQUE7O09BL0RBOztBQWtFYSxJQUFBLG1CQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsYUFBUCxFQUFzQixTQUFDLElBQUQsR0FBQTtlQUNqQyxPQUFBLENBQVMsSUFBQSxHQUFJLElBQWIsRUFEaUM7TUFBQSxDQUF0QixDQUFiLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsU0FBUCxFQUFrQixTQUFDLFFBQUQsR0FBQTtlQUFjLFFBQVEsQ0FBQyxVQUF2QjtNQUFBLENBQWxCLENBSGQsQ0FEVztJQUFBLENBbEViOztBQXdFQTtBQUFBOztPQXhFQTs7QUFBQSx3QkEyRUEsWUFBQSxHQUFjLFNBQUMsSUFBRCxHQUFBO0FBRVosVUFBQSxtQ0FBQTtBQUFBLE1BRmMsWUFBQSxNQUFNLGlCQUFBLFdBQVcsZUFBQSxTQUFTLGlCQUFBLFNBRXhDLENBQUE7YUFBQSxDQUFDLENBQUMsS0FBRixDQUNFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLENBQUMsT0FBRixDQUFVLFFBQVEsQ0FBQyxJQUFuQixFQUF5QixJQUF6QixFQUFkO01BQUEsQ0FBckIsQ0FERixFQUVFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLENBQUMsT0FBRixDQUFVLFFBQVEsQ0FBQyxTQUFuQixFQUE4QixTQUE5QixFQUFkO01BQUEsQ0FBckIsQ0FGRixFQUdFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLENBQUMsUUFBRixDQUFXLFFBQVEsQ0FBQyxRQUFwQixFQUE4QixPQUE5QixFQUFkO01BQUEsQ0FBckIsQ0FIRixFQUlFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLENBQUMsUUFBRixDQUFXLFFBQVEsQ0FBQyxVQUFwQixFQUFnQyxTQUFoQyxFQUFkO01BQUEsQ0FBckIsQ0FKRixFQUZZO0lBQUEsQ0EzRWQsQ0FBQTs7cUJBQUE7O01BYkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/victor.martins/.atom/packages/atom-beautify/src/languages/index.coffee
