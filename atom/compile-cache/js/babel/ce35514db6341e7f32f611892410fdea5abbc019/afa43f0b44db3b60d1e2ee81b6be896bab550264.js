function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libLanguagesJavascript = require('../lib/languages/javascript');

var _libLanguagesJavascript2 = _interopRequireDefault(_libLanguagesJavascript);

var _libLanguagesCpp = require('../lib/languages/cpp');

var _libLanguagesCpp2 = _interopRequireDefault(_libLanguagesCpp);

var _libLanguagesRust = require('../lib/languages/rust');

var _libLanguagesRust2 = _interopRequireDefault(_libLanguagesRust);

var _libLanguagesPhp = require('../lib/languages/php');

var _libLanguagesPhp2 = _interopRequireDefault(_libLanguagesPhp);

var _libLanguagesCoffee = require('../lib/languages/coffee');

var _libLanguagesCoffee2 = _interopRequireDefault(_libLanguagesCoffee);

var _libLanguagesActionscript = require('../lib/languages/actionscript');

var _libLanguagesActionscript2 = _interopRequireDefault(_libLanguagesActionscript);

var _libLanguagesObjc = require('../lib/languages/objc');

var _libLanguagesObjc2 = _interopRequireDefault(_libLanguagesObjc);

var _libLanguagesJava = require('../lib/languages/java');

var _libLanguagesJava2 = _interopRequireDefault(_libLanguagesJava);

var _libLanguagesTypescript = require('../lib/languages/typescript');

var _libLanguagesTypescript2 = _interopRequireDefault(_libLanguagesTypescript);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

// Hack to let us call parsers by filename
"use babel";

var parsers = {
    JsParser: _libLanguagesJavascript2['default'],
    CppParser: _libLanguagesCpp2['default'],
    RustParser: _libLanguagesRust2['default'],
    PhpParser: _libLanguagesPhp2['default'],
    CoffeeParser: _libLanguagesCoffee2['default'],
    ActionscriptParser: _libLanguagesActionscript2['default'],
    ObjCParser: _libLanguagesObjc2['default'],
    JavaParser: _libLanguagesJava2['default'],
    TypescriptParser: _libLanguagesTypescript2['default']
};

var filepath = _path2['default'].resolve(_path2['default'].join(__dirname, 'dataset/languages'));
var files = _fs2['default'].readdirSync(filepath);

var _loop = function (_name) {
    var file_name = "Parser_" + _name.split('.')[0];
    describe(file_name, function () {
        var parser = undefined;
        var dataset = _jsYaml2['default'].load(_fs2['default'].readFileSync(_path2['default'].join(filepath, _name), 'utf8'));
        var parser_name = dataset['name'];
        delete dataset['name'];

        beforeEach(function () {
            return atom.packages.activatePackage('docblockr').then(function () {
                parser = new parsers[parser_name](atom.config.get('docblockr'));
            });
        });

        var _loop2 = function (key) {
            describe(key, function () {
                dataset[key].forEach(function (data) {
                    it(data[0], function () {
                        var out = undefined;
                        if (Array.isArray(data[1])) {
                            out = parser[key].apply(parser, data[1]);
                        } else {
                            out = parser[key](data[1]);
                        }
                        expect(out).to.deep.equal(data[2]);
                    });
                });
            });
        };

        for (var key in dataset) {
            _loop2(key);
        }
    });
};

for (var _name of files) {
    _loop(_name);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9kb2NibG9ja3Ivc3BlYy9sYW5ndWFnZS5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O3NDQUVxQiw2QkFBNkI7Ozs7K0JBQzVCLHNCQUFzQjs7OztnQ0FDckIsdUJBQXVCOzs7OytCQUN4QixzQkFBc0I7Ozs7a0NBQ25CLHlCQUF5Qjs7Ozt3Q0FDbkIsK0JBQStCOzs7O2dDQUN2Qyx1QkFBdUI7Ozs7Z0NBQ3ZCLHVCQUF1Qjs7OztzQ0FDakIsNkJBQTZCOzs7O2tCQUUzQyxJQUFJOzs7O29CQUNGLE1BQU07Ozs7c0JBQ04sU0FBUzs7Ozs7QUFkMUIsV0FBVyxDQUFBOztBQWlCWCxJQUFJLE9BQU8sR0FBRztBQUNWLFlBQVEscUNBQUE7QUFDUixhQUFTLDhCQUFBO0FBQ1QsY0FBVSwrQkFBQTtBQUNWLGFBQVMsOEJBQUE7QUFDVCxnQkFBWSxpQ0FBQTtBQUNaLHNCQUFrQix1Q0FBQTtBQUNsQixjQUFVLCtCQUFBO0FBQ1YsY0FBVSwrQkFBQTtBQUNWLG9CQUFnQixxQ0FBQTtDQUNuQixDQUFDOztBQUVGLElBQUksUUFBUSxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLG1CQUFtQixDQUFDLENBQUMsQ0FBQztBQUN2RSxJQUFJLEtBQUssR0FBRyxnQkFBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7O3NCQUU1QixLQUFJO0FBQ1QsUUFBSSxTQUFTLEdBQUcsU0FBUyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0MsWUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFNO0FBQ3RCLFlBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxZQUFJLE9BQU8sR0FBRyxvQkFBSyxJQUFJLENBQUMsZ0JBQUcsWUFBWSxDQUFDLGtCQUFLLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM1RSxZQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEMsZUFBTyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXZCLGtCQUFVLENBQUMsWUFBTTtBQUNiLG1CQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUM1QyxJQUFJLENBQUMsWUFBTTtBQUNSLHNCQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzthQUNuRSxDQUFDLENBQUM7U0FDVixDQUFDLENBQUM7OytCQUVLLEdBQUc7QUFDUCxvQkFBUSxDQUFDLEdBQUcsRUFBRSxZQUFNO0FBQ2hCLHVCQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQzNCLHNCQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQU07QUFDZCw0QkFBSSxHQUFHLFlBQUEsQ0FBQztBQUNSLDRCQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDeEIsK0JBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDNUMsTUFBTTtBQUNILCtCQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUM5QjtBQUNELDhCQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3RDLENBQUMsQ0FBQztpQkFDTixDQUFDLENBQUM7YUFDTixDQUFDLENBQUM7OztBQWJQLGFBQUksSUFBSSxHQUFHLElBQUksT0FBTyxFQUFFO21CQUFoQixHQUFHO1NBY1Y7S0FDSixDQUFDLENBQUM7OztBQTlCUCxLQUFLLElBQUksS0FBSSxJQUFJLEtBQUssRUFBRTtVQUFmLEtBQUk7Q0ErQloiLCJmaWxlIjoiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2RvY2Jsb2Nrci9zcGVjL2xhbmd1YWdlLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiXG5cbmltcG9ydCBKc1BhcnNlciBmcm9tICcuLi9saWIvbGFuZ3VhZ2VzL2phdmFzY3JpcHQnO1xuaW1wb3J0IENwcFBhcnNlciBmcm9tICcuLi9saWIvbGFuZ3VhZ2VzL2NwcCc7XG5pbXBvcnQgUnVzdFBhcnNlciBmcm9tICcuLi9saWIvbGFuZ3VhZ2VzL3J1c3QnO1xuaW1wb3J0IFBocFBhcnNlciBmcm9tICcuLi9saWIvbGFuZ3VhZ2VzL3BocCc7XG5pbXBvcnQgQ29mZmVlUGFyc2VyIGZyb20gJy4uL2xpYi9sYW5ndWFnZXMvY29mZmVlJztcbmltcG9ydCBBY3Rpb25zY3JpcHRQYXJzZXIgZnJvbSAnLi4vbGliL2xhbmd1YWdlcy9hY3Rpb25zY3JpcHQnO1xuaW1wb3J0IE9iakNQYXJzZXIgZnJvbSAnLi4vbGliL2xhbmd1YWdlcy9vYmpjJztcbmltcG9ydCBKYXZhUGFyc2VyIGZyb20gJy4uL2xpYi9sYW5ndWFnZXMvamF2YSc7XG5pbXBvcnQgVHlwZXNjcmlwdFBhcnNlciBmcm9tICcuLi9saWIvbGFuZ3VhZ2VzL3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeWFtbCBmcm9tICdqcy15YW1sJztcblxuLy8gSGFjayB0byBsZXQgdXMgY2FsbCBwYXJzZXJzIGJ5IGZpbGVuYW1lXG5sZXQgcGFyc2VycyA9IHtcbiAgICBKc1BhcnNlcixcbiAgICBDcHBQYXJzZXIsXG4gICAgUnVzdFBhcnNlcixcbiAgICBQaHBQYXJzZXIsXG4gICAgQ29mZmVlUGFyc2VyLFxuICAgIEFjdGlvbnNjcmlwdFBhcnNlcixcbiAgICBPYmpDUGFyc2VyLFxuICAgIEphdmFQYXJzZXIsXG4gICAgVHlwZXNjcmlwdFBhcnNlcixcbn07XG5cbnZhciBmaWxlcGF0aCA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnZGF0YXNldC9sYW5ndWFnZXMnKSk7XG52YXIgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhmaWxlcGF0aCk7XG5cbmZvciAobGV0IG5hbWUgb2YgZmlsZXMpIHtcbiAgICBsZXQgZmlsZV9uYW1lID0gXCJQYXJzZXJfXCIgKyBuYW1lLnNwbGl0KCcuJylbMF07XG4gICAgZGVzY3JpYmUoZmlsZV9uYW1lLCAoKSA9PiB7XG4gICAgICAgIGxldCBwYXJzZXI7XG4gICAgICAgIGxldCBkYXRhc2V0ID0geWFtbC5sb2FkKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oZmlsZXBhdGgsIG5hbWUpLCAndXRmOCcpKTtcbiAgICAgICAgbGV0IHBhcnNlcl9uYW1lID0gZGF0YXNldFsnbmFtZSddO1xuICAgICAgICBkZWxldGUgZGF0YXNldFsnbmFtZSddO1xuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdkb2NibG9ja3InKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VyID0gbmV3IHBhcnNlcnNbcGFyc2VyX25hbWVdKGF0b20uY29uZmlnLmdldCgnZG9jYmxvY2tyJykpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IobGV0IGtleSBpbiBkYXRhc2V0KSB7XG4gICAgICAgICAgICBkZXNjcmliZShrZXksICgpID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhc2V0W2tleV0uZm9yRWFjaCgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpdChkYXRhWzBdLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb3V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YVsxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXQgPSBwYXJzZXJba2V5XS5hcHBseShwYXJzZXIsIGRhdGFbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXQgPSBwYXJzZXJba2V5XShkYXRhWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChvdXQpLnRvLmRlZXAuZXF1YWwoZGF0YVsyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiJdfQ==