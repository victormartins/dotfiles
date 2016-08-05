(function() {
  var Beautifiers, Handlebars, beautifier, beautifierName, beautifierOptions, beautifiers, context, exampleConfig, fs, languageOptions, linkifyTitle, optionDef, optionName, optionTemplate, optionTemplatePath, optionsPath, optionsTemplate, optionsTemplatePath, packageOptions, result, template, _i, _len, _ref;

  Handlebars = require('handlebars');

  Beautifiers = require("../src/beautifiers");

  fs = require('fs');

  console.log('Generating options...');

  beautifier = new Beautifiers();

  languageOptions = beautifier.options;

  packageOptions = require('../src/config.coffee');

  beautifierOptions = {};

  for (optionName in languageOptions) {
    optionDef = languageOptions[optionName];
    beautifiers = (_ref = optionDef.beautifiers) != null ? _ref : [];
    for (_i = 0, _len = beautifiers.length; _i < _len; _i++) {
      beautifierName = beautifiers[_i];
      if (beautifierOptions[beautifierName] == null) {
        beautifierOptions[beautifierName] = {};
      }
      beautifierOptions[beautifierName][optionName] = optionDef;
    }
  }

  console.log('Loading options template...');

  optionsTemplatePath = __dirname + '/options-template.md';

  optionTemplatePath = __dirname + '/option-template.md';

  optionsPath = __dirname + '/options.md';

  optionsTemplate = fs.readFileSync(optionsTemplatePath).toString();

  optionTemplate = fs.readFileSync(optionTemplatePath).toString();

  console.log('Building documentation from template and options...');

  Handlebars.registerPartial('option', optionTemplate);

  template = Handlebars.compile(optionsTemplate);

  linkifyTitle = function(title) {
    var p, sep;
    title = title.toLowerCase();
    p = title.split(/[\s,+#;,\/?:@&=+$]+/);
    sep = "-";
    return p.join(sep);
  };

  Handlebars.registerHelper('linkify', function(title, options) {
    return new Handlebars.SafeString("[" + (options.fn(this)) + "](\#" + (linkifyTitle(title)) + ")");
  });

  exampleConfig = function(option) {
    var c, d, json, k, namespace, t;
    t = option.type;
    d = (function() {
      switch (false) {
        case option["default"] == null:
          return option["default"];
        case t !== "string":
          return "";
        case t !== "integer":
          return 0;
        case t !== "boolean":
          return false;
        default:
          return null;
      }
    })();
    json = {};
    namespace = option.language.namespace;
    k = option.key;
    c = {};
    c[k] = d;
    json[namespace] = c;
    return "```json\n" + (JSON.stringify(json, void 0, 4)) + "\n```";
  };

  Handlebars.registerHelper('example-config', function(key, option, options) {
    var results;
    results = exampleConfig(key, option);
    return new Handlebars.SafeString(results);
  });

  context = {
    packageOptions: packageOptions,
    languageOptions: languageOptions,
    beautifierOptions: beautifierOptions
  };

  result = template(context);

  console.log('Writing documentation to file...');

  fs.writeFileSync(optionsPath, result);

  console.log('Done.');

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvZG9jcy9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFHQTtBQUFBLE1BQUEsOFNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxvQkFBUixDQURkLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSx1QkFBWixDQUpBLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWlCLElBQUEsV0FBQSxDQUFBLENBTGpCLENBQUE7O0FBQUEsRUFNQSxlQUFBLEdBQWtCLFVBQVUsQ0FBQyxPQU43QixDQUFBOztBQUFBLEVBT0EsY0FBQSxHQUFpQixPQUFBLENBQVEsc0JBQVIsQ0FQakIsQ0FBQTs7QUFBQSxFQVNBLGlCQUFBLEdBQW9CLEVBVHBCLENBQUE7O0FBVUEsT0FBQSw2QkFBQTs0Q0FBQTtBQUNJLElBQUEsV0FBQSxtREFBc0MsRUFBdEMsQ0FBQTtBQUNBLFNBQUEsa0RBQUE7dUNBQUE7O1FBQ0ksaUJBQWtCLENBQUEsY0FBQSxJQUFtQjtPQUFyQztBQUFBLE1BQ0EsaUJBQWtCLENBQUEsY0FBQSxDQUFnQixDQUFBLFVBQUEsQ0FBbEMsR0FBZ0QsU0FEaEQsQ0FESjtBQUFBLEtBRko7QUFBQSxHQVZBOztBQUFBLEVBZ0JBLE9BQU8sQ0FBQyxHQUFSLENBQVksNkJBQVosQ0FoQkEsQ0FBQTs7QUFBQSxFQWlCQSxtQkFBQSxHQUFzQixTQUFBLEdBQVksc0JBakJsQyxDQUFBOztBQUFBLEVBa0JBLGtCQUFBLEdBQXFCLFNBQUEsR0FBWSxxQkFsQmpDLENBQUE7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

//# sourceURL=/Users/victor.martins/.atom/packages/atom-beautify/docs/index.coffee
