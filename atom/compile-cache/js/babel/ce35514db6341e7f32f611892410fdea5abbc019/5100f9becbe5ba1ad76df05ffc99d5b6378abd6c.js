Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

var _requestPromise = require('request-promise');

'use babel';

var DEFAULT_ARGS = ['--cache', 'false', '--force-exclusion', '--format', 'json', '--display-style-guide'];
var DOCUMENTATION_LIFETIME = 86400 * 1000; // 1 day TODO: Configurable?

var docsRuleCache = new Map();
var docsLastRetrieved = undefined;

var takeWhile = function takeWhile(source, predicate) {
  var result = [];
  var length = source.length;
  var i = 0;

  while (i < length && predicate(source[i], i)) {
    result.push(source[i]);
    i += 1;
  }

  return result;
};

var parseFromStd = function parseFromStd(stdout, stderr) {
  var parsed = undefined;
  try {
    parsed = JSON.parse(stdout);
  } catch (error) {
    // continue regardless of error
  }
  if (typeof parsed !== 'object') {
    throw new Error(stderr || stdout);
  }
  return parsed;
};

var getProjectDirectory = function getProjectDirectory(filePath) {
  return atom.project.relativizePath(filePath)[0] || _path2['default'].dirname(filePath);
};

// Retrieves style guide documentation with cached responses
var getMarkDown = _asyncToGenerator(function* (url) {
  var anchor = url.split('#')[1];

  if (new Date().getTime() - docsLastRetrieved < DOCUMENTATION_LIFETIME) {
    // If documentation is stale, clear cache
    docsRuleCache.clear();
  }

  if (docsRuleCache.has(anchor)) {
    return docsRuleCache.get(anchor);
  }

  var rawRulesMarkdown = undefined;
  try {
    rawRulesMarkdown = yield (0, _requestPromise.get)('https://raw.githubusercontent.com/bbatsov/ruby-style-guide/master/README.md');
  } catch (x) {
    return '***\nError retrieving documentation';
  }

  var byLine = rawRulesMarkdown.split('\n');
  // eslint-disable-next-line no-confusing-arrow
  var ruleAnchors = byLine.reduce(function (acc, line, idx) {
    return line.match(/\* <a name=/g) ? acc.concat([[idx, line]]) : acc;
  }, []);

  ruleAnchors.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var startingIndex = _ref2[0];
    var startingLine = _ref2[1];

    var ruleName = startingLine.split('"')[1];
    var beginSearch = byLine.slice(startingIndex + 1);

    // gobble all the documentation until you reach the next rule
    var documentationForRule = takeWhile(beginSearch, function (x) {
      return !x.match(/\* <a name=|##/);
    });
    var markdownOutput = '***\n'.concat(documentationForRule.join('\n'));

    docsRuleCache.set(ruleName, markdownOutput);
  });

  docsLastRetrieved = new Date().getTime();
  return docsRuleCache.get(anchor);
});

var forwardRubocopToLinter = function forwardRubocopToLinter(_ref3, file, editor) {
  var rawMessage = _ref3.message;
  var location = _ref3.location;
  var severity = _ref3.severity;
  var copName = _ref3.cop_name;

  var _rawMessage$split = rawMessage.split(/ \((.*)\)/, 2);

  var _rawMessage$split2 = _slicedToArray(_rawMessage$split, 2);

  var excerpt = _rawMessage$split2[0];
  var url = _rawMessage$split2[1];

  var position = undefined;
  if (location) {
    var line = location.line;
    var column = location.column;
    var _length = location.length;

    position = [[line - 1, column - 1], [line - 1, column + _length - 1]];
  } else {
    position = helpers.generateRange(editor, 0);
  }

  var severityMapping = {
    refactor: 'info',
    convention: 'info',
    warning: 'warning',
    error: 'error',
    fatal: 'error'
  };

  var linterMessage = {
    url: url,
    excerpt: excerpt + ' (' + copName + ')',
    severity: severityMapping[severity],
    description: url ? function () {
      return getMarkDown(url);
    } : null,
    location: {
      file: file,
      position: position
    }
  };
  return linterMessage;
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-rubocop', true);

    this.subscriptions = new _atom.CompositeDisposable();

    // Register fix command
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'linter-rubocop:fix-file': _asyncToGenerator(function* () {
        var textEditor = atom.workspace.getActiveTextEditor();

        if (!atom.workspace.isTextEditor(textEditor) || textEditor.isModified()) {
          // Abort for invalid or unsaved text editors
          return atom.notifications.addError('Linter-Rubocop: Please save before fixing');
        }

        var filePath = textEditor.getPath();
        var command = _this.command.split(/\s+/).filter(function (i) {
          return i;
        }).concat(DEFAULT_ARGS, '--auto-correct', filePath);
        var cwd = getProjectDirectory(filePath);

        var _ref4 = yield helpers.exec(command[0], command.slice(1), { cwd: cwd, stream: 'both' });

        var stdout = _ref4.stdout;
        var stderr = _ref4.stderr;

        var _parseFromStd = parseFromStd(stdout, stderr);

        var offenseCount = _parseFromStd.summary.offense_count;

        return offenseCount === 0 ? atom.notifications.addInfo('Linter-Rubocop: No fixes were made') : atom.notifications.addSuccess('Linter-Rubocop: Fixed ' + (0, _pluralize2['default'])('offenses', offenseCount, true));
      })
    }));

    // Config observers
    this.subscriptions.add(atom.config.observe('linter-rubocop.command', function (value) {
      _this.command = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-rubocop.disableWhenNoConfigFile', function (value) {
      _this.disableWhenNoConfigFile = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-rubocop.linterTimeout', function (value) {
      _this.linterTimeout = value;
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'RuboCop',
      grammarScopes: ['source.ruby', 'source.ruby.rails', 'source.ruby.rspec', 'source.ruby.chef'],
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (editor) {
        var filePath = editor.getPath();

        if (_this2.disableWhenNoConfigFile === true) {
          var config = yield helpers.findAsync(filePath, '.rubocop.yml');
          if (config === null) {
            return [];
          }
        }

        var command = _this2.command.split(/\s+/).filter(function (i) {
          return i;
        }).concat(DEFAULT_ARGS, '--stdin', filePath);
        var stdin = editor.getText();
        var cwd = getProjectDirectory(filePath);
        var exexOptions = {
          cwd: cwd,
          stdin: stdin,
          stream: 'both',
          timeout: _this2.linterTimeout,
          uniqueKey: 'linter-rubocop::' + filePath
        };
        var output = yield helpers.exec(command[0], command.slice(1), exexOptions);
        // Process was canceled by newer process
        if (output === null) {
          return null;
        }

        var _parseFromStd2 = parseFromStd(output.stdout, output.stderr);

        var files = _parseFromStd2.files;

        var offenses = files && files[0] && files[0].offenses;
        return (offenses || []).map(function (offense) {
          return forwardRubocopToLinter(offense, filePath, editor);
        });
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVib2NvcC9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07O29CQUN6QixNQUFNOzs7O3lCQUNELFdBQVc7Ozs7MEJBQ1IsYUFBYTs7SUFBMUIsT0FBTzs7OEJBQ0MsaUJBQWlCOztBQVByQyxXQUFXLENBQUE7O0FBU1gsSUFBTSxZQUFZLEdBQUcsQ0FDbkIsU0FBUyxFQUFFLE9BQU8sRUFDbEIsbUJBQW1CLEVBQ25CLFVBQVUsRUFBRSxNQUFNLEVBQ2xCLHVCQUF1QixDQUN4QixDQUFBO0FBQ0QsSUFBTSxzQkFBc0IsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFBOztBQUUzQyxJQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQy9CLElBQUksaUJBQWlCLFlBQUEsQ0FBQTs7QUFFckIsSUFBTSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUksTUFBTSxFQUFFLFNBQVMsRUFBSztBQUN2QyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUE7QUFDakIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQTtBQUM1QixNQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRVQsU0FBTyxDQUFDLEdBQUcsTUFBTSxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDNUMsVUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN0QixLQUFDLElBQUksQ0FBQyxDQUFBO0dBQ1A7O0FBRUQsU0FBTyxNQUFNLENBQUE7Q0FDZCxDQUFBOztBQUVELElBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLE1BQU0sRUFBRSxNQUFNLEVBQUs7QUFDdkMsTUFBSSxNQUFNLFlBQUEsQ0FBQTtBQUNWLE1BQUk7QUFDRixVQUFNLEdB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Q0FBQyxNQUFNLENBQUM7O1lBQXBELEtBQUssa0JBQUwsS0FBSzs7QUFDYixZQUFNLFFBQVEsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUE7QUFDdkQsZUFBTyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUEsQ0FBRSxHQUFHLENBQUMsVUFBQSxPQUFPO2lCQUFJLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDO1NBQUEsQ0FBQyxDQUFBO09BQzFGLENBQUE7S0FDRixDQUFBO0dBQ0Y7Q0FDRiIsImZpbGUiOiIvVXNlcnMvdmljdG9yLm1hcnRpbnMvLmF0b20vcGFja2FnZXMvbGludGVyLXJ1Ym9jb3Avc3JjL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9leHRlbnNpb25zLCBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBwbHVyYWxpemUgZnJvbSAncGx1cmFsaXplJ1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICdhdG9tLWxpbnRlcidcbmltcG9ydCB7IGdldCB9IGZyb20gJ3JlcXVlc3QtcHJvbWlzZSdcblxuY29uc3QgREVGQVVMVF9BUkdTID0gW1xuICAnLS1jYWNoZScsICdmYWxzZScsXG4gICctLWZvcmNlLWV4Y2x1c2lvbicsXG4gICctLWZvcm1hdCcsICdqc29uJyxcbiAgJy0tZGlzcGxheS1zdHlsZS1ndWlkZScsXG5dXG5jb25zdCBET0NVTUVOVEFUSU9OX0xJRkVUSU1FID0gODY0MDAgKiAxMDAwIC8vIDEgZGF5IFRPRE86IENvbmZpZ3VyYWJsZT9cblxuY29uc3QgZG9jc1J1bGVDYWNoZSA9IG5ldyBNYXAoKVxubGV0IGRvY3NMYXN0UmV0cmlldmVkXG5cbmNvbnN0IHRha2VXaGlsZSA9IChzb3VyY2UsIHByZWRpY2F0ZSkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBbXVxuICBjb25zdCBsZW5ndGggPSBzb3VyY2UubGVuZ3RoXG4gIGxldCBpID0gMFxuXG4gIHdoaWxlIChpIDwgbGVuZ3RoICYmIHByZWRpY2F0ZShzb3VyY2VbaV0sIGkpKSB7XG4gICAgcmVzdWx0LnB1c2goc291cmNlW2ldKVxuICAgIGkgKz0gMVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5jb25zdCBwYXJzZUZyb21TdGQgPSAoc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgbGV0IHBhcnNlZFxuICB0cnkge1xuICAgIHBhcnNlZCA9IEpTT04ucGFyc2Uoc3Rkb3V0KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIGNvbnRpbnVlIHJlZ2FyZGxlc3Mgb2YgZXJyb3JcbiAgfVxuICBpZiAodHlwZW9mIHBhcnNlZCAhPT0gJ29iamVjdCcpIHsgdGhyb3cgbmV3IEVycm9yKHN0ZGVyciB8fCBzdGRvdXQpIH1cbiAgcmV0dXJuIHBhcnNlZFxufVxuXG5jb25zdCBnZXRQcm9qZWN0RGlyZWN0b3J5ID0gZmlsZVBhdGggPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF0gfHwgcGF0aC5kaXJuYW1lKGZpbGVQYXRoKVxuXG5cbi8vIFJldHJpZXZlcyBzdHlsZSBndWlkZSBkb2N1bWVudGF0aW9uIHdpdGggY2FjaGVkIHJlc3BvbnNlc1xuY29uc3QgZ2V0TWFya0Rvd24gPSBhc3luYyAodXJsKSA9PiB7XG4gIGNvbnN0IGFuY2hvciA9IHVybC5zcGxpdCgnIycpWzFdXG5cbiAgaWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gZG9jc0xhc3RSZXRyaWV2ZWQgPCBET0NVTUVOVEFUSU9OX0xJRkVUSU1FKSB7XG4gICAgLy8gSWYgZG9jdW1lbnRhdGlvbiBpcyBzdGFsZSwgY2xlYXIgY2FjaGVcbiAgICBkb2NzUnVsZUNhY2hlLmNsZWFyKClcbiAgfVxuXG4gIGlmIChkb2NzUnVsZUNhY2hlLmhhcyhhbmNob3IpKSB7IHJldHVybiBkb2NzUnVsZUNhY2hlLmdldChhbmNob3IpIH1cblxuICBsZXQgcmF3UnVsZXNNYXJrZG93blxuICB0cnkge1xuICAgIHJhd1J1bGVzTWFya2Rvd24gPSBhd2FpdCBnZXQoJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9iYmF0c292L3J1Ynktc3R5bGUtZ3VpZGUvbWFzdGVyL1JFQURNRS5tZCcpXG4gIH0gY2F0Y2ggKHgpIHtcbiAgICByZXR1cm4gJyoqKlxcbkVycm9yIHJldHJpZXZpbmcgZG9jdW1lbnRhdGlvbidcbiAgfVxuXG4gIGNvbnN0IGJ5TGluZSA9IHJhd1J1bGVzTWFya2Rvd24uc3BsaXQoJ1xcbicpXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25mdXNpbmctYXJyb3dcbiAgY29uc3QgcnVsZUFuY2hvcnMgPSBieUxpbmUucmVkdWNlKChhY2MsIGxpbmUsIGlkeCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5tYXRjaCgvXFwqIDxhIG5hbWU9L2cpID8gYWNjLmNvbmNhdChbW2lkeCwgbGluZV1dKSA6IGFjYyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW10pXG5cbiAgcnVsZUFuY2hvcnMuZm9yRWFjaCgoW3N0YXJ0aW5nSW5kZXgsIHN0YXJ0aW5nTGluZV0pID0+IHtcbiAgICBjb25zdCBydWxlTmFtZSA9IHN0YXJ0aW5nTGluZS5zcGxpdCgnXCInKVsxXVxuICAgIGNvbnN0IGJlZ2luU2VhcmNoID0gYnlMaW5lLnNsaWNlKHN0YXJ0aW5nSW5kZXggKyAxKVxuXG4gICAgLy8gZ29iYmxlIGFsbCB0aGUgZG9jdW1lbnRhdGlvbiB1bnRpbCB5b3UgcmVhY2ggdGhlIG5leHQgcnVsZVxuICAgIGNvbnN0IGRvY3VtZW50YXRpb25Gb3JSdWxlID0gdGFrZVdoaWxlKGJlZ2luU2VhcmNoLCB4ID0+ICF4Lm1hdGNoKC9cXCogPGEgbmFtZT18IyMvKSlcbiAgICBjb25zdCBtYXJrZG93bk91dHB1dCA9ICcqKipcXG4nLmNvbmNhdChkb2N1bWVudGF0aW9uRm9yUnVsZS5qb2luKCdcXG4nKSlcblxuICAgIGRvY3NSdWxlQ2FjaGUuc2V0KHJ1bGVOYW1lLCBtYXJrZG93bk91dHB1dClcbiAgfSlcblxuICBkb2NzTGFzdFJldHJpZXZlZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gIHJldHVybiBkb2NzUnVsZUNhY2hlLmdldChhbmNob3IpXG59XG5cbmNvbnN0IGZvcndhcmRSdWJvY29wVG9MaW50ZXIgPVxuICAoeyBtZXNzYWdlOiByYXdNZXNzYWdlLCBsb2NhdGlvbiwgc2V2ZXJpdHksIGNvcF9uYW1lOiBjb3BOYW1lIH0sIGZpbGUsIGVkaXRvcikgPT4ge1xuICAgIGNvbnN0IFtleGNlcnB0LCB1cmxdID0gcmF3TWVzc2FnZS5zcGxpdCgvIFxcKCguKilcXCkvLCAyKVxuICAgIGxldCBwb3NpdGlvblxuICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgY29uc3QgeyBsaW5lLCBjb2x1bW4sIGxlbmd0aCB9ID0gbG9jYXRpb25cbiAgICAgIHBvc2l0aW9uID0gW1tsaW5lIC0gMSwgY29sdW1uIC0gMV0sIFtsaW5lIC0gMSwgKGNvbHVtbiArIGxlbmd0aCkgLSAxXV1cbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb24gPSBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UoZWRpdG9yLCAwKVxuICAgIH1cblxuICAgIGNvbnN0IHNldmVyaXR5TWFwcGluZyA9IHtcbiAgICAgIHJlZmFjdG9yOiAnaW5mbycsXG4gICAgICBjb252ZW50aW9uOiAnaW5mbycsXG4gICAgICB3YXJuaW5nOiAnd2FybmluZycsXG4gICAgICBlcnJvcjogJ2Vycm9yJyxcbiAgICAgIGZhdGFsOiAnZXJyb3InLFxuICAgIH1cblxuICAgIGNvbnN0IGxpbnRlck1lc3NhZ2UgPSB7XG4gICAgICB1cmwsXG4gICAgICBleGNlcnB0OiBgJHtleGNlcnB0fSAoJHtjb3BOYW1lfSlgLFxuICAgICAgc2V2ZXJpdHk6IHNldmVyaXR5TWFwcGluZ1tzZXZlcml0eV0sXG4gICAgICBkZXNjcmlwdGlvbjogdXJsID8gKCkgPT4gZ2V0TWFya0Rvd24odXJsKSA6IG51bGwsXG4gICAgICBsb2NhdGlvbjoge1xuICAgICAgICBmaWxlLFxuICAgICAgICBwb3NpdGlvbixcbiAgICAgIH0sXG4gICAgfVxuICAgIHJldHVybiBsaW50ZXJNZXNzYWdlXG4gIH1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmF0ZSgpIHtcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1ydWJvY29wJywgdHJ1ZSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIC8vIFJlZ2lzdGVyIGZpeCBjb21tYW5kXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywge1xuICAgICAgICAnbGludGVyLXJ1Ym9jb3A6Zml4LWZpbGUnOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgICAgICAgaWYgKCFhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IodGV4dEVkaXRvcikgfHwgdGV4dEVkaXRvci5pc01vZGlmaWVkKCkpIHtcbiAgICAgICAgICAgIC8vIEFib3J0IGZvciBpbnZhbGlkIG9yIHVuc2F2ZWQgdGV4dCBlZGl0b3JzXG4gICAgICAgICAgICByZXR1cm4gYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdMaW50ZXItUnVib2NvcDogUGxlYXNlIHNhdmUgYmVmb3JlIGZpeGluZycpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKVxuICAgICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLmNvbW1hbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGkgPT4gaSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoREVGQVVMVF9BUkdTLCAnLS1hdXRvLWNvcnJlY3QnLCBmaWxlUGF0aClcbiAgICAgICAgICBjb25zdCBjd2QgPSBnZXRQcm9qZWN0RGlyZWN0b3J5KGZpbGVQYXRoKVxuICAgICAgICAgIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGhlbHBlcnMuZXhlYyhjb21tYW5kWzBdLCBjb21tYW5kLnNsaWNlKDEpLCB7IGN3ZCwgc3RyZWFtOiAnYm90aCcgfSlcbiAgICAgICAgICBjb25zdCB7IHN1bW1hcnk6IHsgb2ZmZW5zZV9jb3VudDogb2ZmZW5zZUNvdW50IH0gfSA9IHBhcnNlRnJvbVN0ZChzdGRvdXQsIHN0ZGVycilcbiAgICAgICAgICByZXR1cm4gb2ZmZW5zZUNvdW50ID09PSAwID9cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdMaW50ZXItUnVib2NvcDogTm8gZml4ZXMgd2VyZSBtYWRlJykgOlxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoYExpbnRlci1SdWJvY29wOiBGaXhlZCAke3BsdXJhbGl6ZSgnb2ZmZW5zZXMnLCBvZmZlbnNlQ291bnQsIHRydWUpfWApXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICApXG5cbiAgICAvLyBDb25maWcgb2JzZXJ2ZXJzXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1ydWJvY29wLmNvbW1hbmQnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5jb21tYW5kID0gdmFsdWVcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXJ1Ym9jb3AuZGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5kaXNhYmxlV2hlbk5vQ29uZmlnRmlsZSA9IHZhbHVlXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1ydWJvY29wLmxpbnRlclRpbWVvdXQnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5saW50ZXJUaW1lb3V0ID0gdmFsdWVcbiAgICAgIH0pLFxuICAgIClcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnUnVib0NvcCcsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbXG4gICAgICAgICdzb3VyY2UucnVieScsXG4gICAgICAgICdzb3VyY2UucnVieS5yYWlscycsXG4gICAgICAgICdzb3VyY2UucnVieS5yc3BlYycsXG4gICAgICAgICdzb3VyY2UucnVieS5jaGVmJyxcbiAgICAgIF0sXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludHNPbkNoYW5nZTogdHJ1ZSxcbiAgICAgIGxpbnQ6IGFzeW5jIChlZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUgPT09IHRydWUpIHtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBhd2FpdCBoZWxwZXJzLmZpbmRBc3luYyhmaWxlUGF0aCwgJy5ydWJvY29wLnltbCcpXG4gICAgICAgICAgaWYgKGNvbmZpZyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMuY29tbWFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdCgvXFxzKy8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihpID0+IGkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChERUZBVUxUX0FSR1MsICctLXN0ZGluJywgZmlsZVBhdGgpXG4gICAgICAgIGNvbnN0IHN0ZGluID0gZWRpdG9yLmdldFRleHQoKVxuICAgICAgICBjb25zdCBjd2QgPSBnZXRQcm9qZWN0RGlyZWN0b3J5KGZpbGVQYXRoKVxuICAgICAgICBjb25zdCBleGV4T3B0aW9ucyA9IHtcbiAgICAgICAgICBjd2QsXG4gICAgICAgICAgc3RkaW4sXG4gICAgICAgICAgc3RyZWFtOiAnYm90aCcsXG4gICAgICAgICAgdGltZW91dDogdGhpcy5saW50ZXJUaW1lb3V0LFxuICAgICAgICAgIHVuaXF1ZUtleTogYGxpbnRlci1ydWJvY29wOjoke2ZpbGVQYXRofWAsXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgaGVscGVycy5leGVjKGNvbW1hbmRbMF0sIGNvbW1hbmQuc2xpY2UoMSksIGV4ZXhPcHRpb25zKVxuICAgICAgICAvLyBQcm9jZXNzIHdhcyBjYW5jZWxlZCBieSBuZXdlciBwcm9jZXNzXG4gICAgICAgIGlmIChvdXRwdXQgPT09IG51bGwpIHsgcmV0dXJuIG51bGwgfVxuXG4gICAgICAgIGNvbnN0IHsgZmlsZXMgfSA9IHBhcnNlRnJvbVN0ZChvdXRwdXQuc3Rkb3V0LCBvdXRwdXQuc3RkZXJyKVxuICAgICAgICBjb25zdCBvZmZlbnNlcyA9IGZpbGVzICYmIGZpbGVzWzBdICYmIGZpbGVzWzBdLm9mZmVuc2VzXG4gICAgICAgIHJldHVybiAob2ZmZW5zZXMgfHwgW10pLm1hcChvZmZlbnNlID0+IGZvcndhcmRSdWJvY29wVG9MaW50ZXIob2ZmZW5zZSwgZmlsZVBhdGgsIGVkaXRvcikpXG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cbiJdfQ==