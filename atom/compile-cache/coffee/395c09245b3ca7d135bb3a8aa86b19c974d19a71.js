(function() {
  "use strict";
  var $, Beautifiers, CompositeDisposable, LoadingView, Promise, async, beautifier, beautify, beautifyDirectory, beautifyFile, beautifyFilePath, debug, defaultLanguageOptions, dir, fs, getCursors, handleSaveEvent, loadingView, logger, path, pkg, plugin, setCursors, showError, strip, yaml, _;

  pkg = require('../package.json');

  plugin = module.exports;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ = require("lodash");

  Beautifiers = require("./beautifiers");

  beautifier = new Beautifiers();

  defaultLanguageOptions = beautifier.options;

  logger = require('./logger')(__filename);

  Promise = require('bluebird');

  fs = null;

  path = require("path");

  strip = null;

  yaml = null;

  async = null;

  dir = null;

  LoadingView = null;

  loadingView = null;

  $ = null;

  getCursors = function(editor) {
    var bufferPosition, cursor, cursors, posArray, _i, _len;
    cursors = editor.getCursors();
    posArray = [];
    for (_i = 0, _len = cursors.length; _i < _len; _i++) {
      cursor = cursors[_i];
      bufferPosition = cursor.getBufferPosition();
      posArray.push([bufferPosition.row, bufferPosition.column]);
    }
    return posArray;
  };

  setCursors = function(editor, posArray) {
    var bufferPosition, i, _i, _len;
    for (i = _i = 0, _len = posArray.length; _i < _len; i = ++_i) {
      bufferPosition = posArray[i];
      if (i === 0) {
        editor.setCursorBufferPosition(bufferPosition);
        continue;
      }
      editor.addCursorAtBufferPosition(bufferPosition);
    }
  };

  beautifier.on('beautify::start', function() {
    if (LoadingView == null) {
      LoadingView = require("./views/loading-view");
    }
    if (loadingView == null) {
      loadingView = new LoadingView();
    }
    return loadingView.show();
  });

  beautifier.on('beautify::end', function() {
    return loadingView != null ? loadingView.hide() : void 0;
  });

  showError = function(error) {
    var detail, stack, _ref;
    if (!atom.config.get("atom-beautify.muteAllErrors")) {
      stack = error.stack;
      detail = error.description || error.message;
      return (_ref = atom.notifications) != null ? _ref.addError(error.message, {
        stack: stack,
        detail: detail,
        dismissable: true
      }) : void 0;
    }
  };

  beautify = function(_arg) {
    var allOptions, beautifyCompleted, detail, e, editedFilePath, editor, forceEntireFile, grammarName, isSelection, oldText, onSave, text;
    onSave = _arg.onSave;
    if (atom.config.get("atom-beautify.beautifyOnSave") === true) {
      detail = "See issue https://github.com/Glavin001/atom-beautify/issues/308\n\nTo stop seeing this message:\n- Uncheck (disable) the deprecated \"Beautify On Save\" option\n\nTo enable Beautify on Save for a particular language:\n- Go to Atom Beautify's package settings\n- Find option for \"Language Config - <Your Language> - Beautify On Save\"\n- Check (enable) Beautify On Save option for that particular language\n";
      if (typeof atom !== "undefined" && atom !== null) {
        atom.notifications.addWarning("The option \"atom-beautify.beautifyOnSave\" has been deprecated", {
          detail: detail,
          dismissable: true
        });
      }
    }
    if (path == null) {
      path = require("path");
    }
    forceEntireFile = onSave && atom.config.get("atom-beautify.beautifyEntireFileOnSave");
    beautifyCompleted = function(text) {
      var origScrollTop, posArray, selectedBufferRange;
      if (text == null) {

      } else if (text instanceof Error) {
        showError(text);
      } else if (typeof text === "string") {
        if (oldText !== text) {
          posArray = getCursors(editor);
          origScrollTop = editor.getScrollTop();
          if (!forceEntireFile && isSelection) {
            selectedBufferRange = editor.getSelectedBufferRange();
            editor.setTextInBufferRange(selectedBufferRange, text);
          } else {
            editor.setText(text);
          }
          setCursors(editor, posArray);
          setTimeout((function() {
            editor.setScrollTop(origScrollTop);
          }), 0);
        }
      } else {
        showError(new Error("Unsupported beautification result '" + text + "'."));
      }
    };
    editor = atom.workspace.getActiveTextEditor();
    if (editor == null) {
      return showError(new Error("Active Editor not found. ", "Please select a Text Editor first to beautify."));
    }
    isSelection = !!editor.getSelectedText();
    editedFilePath = editor.getPath();
    allOptions = beautifier.getOptionsForPath(editedFilePath, editor);
    text = void 0;
    if (!forceEntireFile && isSelection) {
      text = editor.getSelectedText();
    } else {
      text = editor.getText();
    }
    oldText = text;
    grammarName = editor.getGrammar().name;
    try {
      beautifier.beautify(text, allOptions, grammarName, editedFilePath, {
        onSave: onSave
      }).then(beautifyCompleted)["catch"](beautifyCompleted);
    } catch (_error) {
      e = _error;
      showError(e);
    }
  };

  beautifyFilePath = function(filePath, callback) {
    var $el, cb;
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
    $el.addClass('beautifying');
    cb = function(err, result) {
      $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
      $el.removeClass('beautifying');
      return callback(err, result);
    };
    if (fs == null) {
      fs = require("fs");
    }
    return fs.readFile(filePath, function(err, data) {
      var allOptions, completionFun, e, grammar, grammarName, input;
      if (err) {
        return cb(err);
      }
      input = data != null ? data.toString() : void 0;
      grammar = atom.grammars.selectGrammar(filePath, input);
      grammarName = grammar.name;
      allOptions = beautifier.getOptionsForPath(filePath);
      completionFun = function(output) {
        if (output instanceof Error) {
          return cb(output, null);
        } else if (typeof output === "string") {
          if (output === '') {
            return cb(null, output);
          }
          return fs.writeFile(filePath, output, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, output);
          });
        } else {
          return cb(new Error("Unknown beautification result " + output + "."), output);
        }
      };
      try {
        return beautifier.beautify(input, allOptions, grammarName, filePath).then(completionFun)["catch"](completionFun);
      } catch (_error) {
        e = _error;
        return cb(e);
      }
    });
  };

  beautifyFile = function(_arg) {
    var filePath, target;
    target = _arg.target;
    filePath = target.dataset.path;
    if (!filePath) {
      return;
    }
    beautifyFilePath(filePath, function(err, result) {
      if (err) {
        return showError(err);
      }
    });
  };

  beautifyDirectory = function(_arg) {
    var $el, dirPath, target;
    target = _arg.target;
    dirPath = target.dataset.path;
    if (!dirPath) {
      return;
    }
    if ((typeof atom !== "undefined" && atom !== null ? atom.confirm({
      message: "This will beautify all of the files found recursively in this directory, '" + dirPath + "'. Do you want to continue?",
      buttons: ['Yes, continue!', 'No, cancel!']
    }) : void 0) !== 0) {
      return;
    }
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
    $el.addClass('beautifying');
    if (dir == null) {
      dir = require("node-dir");
    }
    if (async == null) {
      async = require("async");
    }
    dir.files(dirPath, function(err, files) {
      if (err) {
        return showError(err);
      }
      return async.each(files, function(filePath, callback) {
        return beautifyFilePath(filePath, function() {
          return callback();
        });
      }, function(err) {
        $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
        return $el.removeClass('beautifying');
      });
    });
  };

  debug = function() {
    var addHeader, addInfo, allOptions, beautifiers, codeBlockSyntax, debugInfo, editor, filePath, grammarName, headers, language, linkifyTitle, selectedBeautifier, text, tocEl, _ref;
    editor = atom.workspace.getActiveTextEditor();
    linkifyTitle = function(title) {
      var p, sep;
      title = title.toLowerCase();
      p = title.split(/[\s,+#;,\/?:@&=+$]+/);
      sep = "-";
      return p.join(sep);
    };
    if (editor == null) {
      return confirm("Active Editor not found.\n" + "Please select a Text Editor first to beautify.");
    }
    if (!confirm('Are you ready to debug Atom Beautify?\n\n' + 'Warning: This will change your current clipboard contents.')) {
      return;
    }
    debugInfo = "";
    headers = [];
    tocEl = "<TABLEOFCONTENTS/>";
    addInfo = function(key, val) {
      if (key != null) {
        return debugInfo += "**" + key + "**: " + val + "\n\n";
      } else {
        return debugInfo += "" + val + "\n\n";
      }
    };
    addHeader = function(level, title) {
      debugInfo += "" + (Array(level + 1).join('#')) + " " + title + "\n\n";
      return headers.push({
        level: level,
        title: title
      });
    };
    addHeader(1, "Atom Beautify - Debugging information");
    debugInfo += "The following debugging information was " + ("generated by `Atom Beautify` on `" + (new Date()) + "`.") + "\n\n---\n\n" + tocEl + "\n\n---\n\n";
    addInfo('Platform', process.platform);
    addHeader(2, "Versions");
    addInfo('Atom Version', atom.appVersion);
    addInfo('Atom Beautify Version', pkg.version);
    addHeader(2, "Original file to be beautified");
    filePath = editor.getPath();
    addInfo('Original File Path', "`" + filePath + "`");
    grammarName = editor.getGrammar().name;
    addInfo('Original File Grammar', grammarName);
    language = beautifier.getLanguage(grammarName, filePath);
    addInfo('Original File Language', language != null ? language.name : void 0);
    addInfo('Language namespace', language != null ? language.namespace : void 0);
    beautifiers = beautifier.getBeautifiers(language.name);
    addInfo('Supported Beautifiers', _.map(beautifiers, 'name').join(', '));
    selectedBeautifier = beautifier.getBeautifierForLanguage(language);
    addInfo('Selected Beautifier', selectedBeautifier.name);
    text = editor.getText();
    codeBlockSyntax = ((_ref = language != null ? language.name : void 0) != null ? _ref : grammarName).toLowerCase().split(' ')[0];
    addHeader(3, 'Original File Contents');
    addInfo(null, "\n```" + codeBlockSyntax + "\n" + text + "\n```");
    addHeader(3, 'Package Settings');
    addInfo(null, "The raw package settings options\n" + ("```json\n" + (JSON.stringify(atom.config.get('atom-beautify'), void 0, 4)) + "\n```"));
    addHeader(2, "Beautification options");
    allOptions = beautifier.getOptionsForPath(filePath, editor);
    return Promise.all(allOptions).then(function(allOptions) {
      var cb, configOptions, e, editorConfigOptions, editorOptions, finalOptions, homeOptions, logFilePathRegex, logs, preTransformedOptions, projectOptions, subscription;
      editorOptions = allOptions[0], configOptions = allOptions[1], homeOptions = allOptions[2], editorConfigOptions = allOptions[3];
      projectOptions = allOptions.slice(4);
      preTransformedOptions = beautifier.getOptionsForLanguage(allOptions, language);
      if (selectedBeautifier) {
        finalOptions = beautifier.transformOptions(selectedBeautifier, language.name, preTransformedOptions);
      }
      addInfo('Editor Options', "\n" + "Options from Atom Editor settings\n" + ("```json\n" + (JSON.stringify(editorOptions, void 0, 4)) + "\n```"));
      addInfo('Config Options', "\n" + "Options from Atom Beautify package settings\n" + ("```json\n" + (JSON.stringify(configOptions, void 0, 4)) + "\n```"));
      addInfo('Home Options', "\n" + ("Options from `" + (path.resolve(beautifier.getUserHome(), '.jsbeautifyrc')) + "`\n") + ("```json\n" + (JSON.stringify(homeOptions, void 0, 4)) + "\n```"));
      addInfo('EditorConfig Options', "\n" + "Options from [EditorConfig](http://editorconfig.org/) file\n" + ("```json\n" + (JSON.stringify(editorConfigOptions, void 0, 4)) + "\n```"));
      addInfo('Project Options', "\n" + ("Options from `.jsbeautifyrc` files starting from directory `" + (path.dirname(filePath)) + "` and going up to root\n") + ("```json\n" + (JSON.stringify(projectOptions, void 0, 4)) + "\n```"));
      addInfo('Pre-Transformed Options', "\n" + "Combined options before transforming them given a beautifier's specifications\n" + ("```json\n" + (JSON.stringify(preTransformedOptions, void 0, 4)) + "\n```"));
      if (selectedBeautifier) {
        addHeader(3, 'Final Options');
        addInfo(null, "Final combined and transformed options that are used\n" + ("```json\n" + (JSON.stringify(finalOptions, void 0, 4)) + "\n```"));
      }
      logs = "";
      logFilePathRegex = new RegExp('\\: \\[(.*)\\]');
      subscription = logger.onLogging(function(msg) {
        var sep;
        sep = path.sep;
        return logs += msg.replace(logFilePathRegex, function(a, b) {
          var i, p, s;
          s = b.split(sep);
          i = s.indexOf('atom-beautify');
          p = s.slice(i + 2).join(sep);
          return ': [' + p + ']';
        });
      });
      cb = function(result) {
        var JsDiff, bullet, diff, header, indent, indentNum, toc, _i, _len;
        subscription.dispose();
        addHeader(2, "Results");
        addInfo('Beautified File Contents', "\n```" + codeBlockSyntax + "\n" + result + "\n```");
        JsDiff = require('diff');
        diff = JsDiff.createPatch(filePath, text, result, "original", "beautified");
        addInfo('Original vs. Beautified Diff', "\n```" + codeBlockSyntax + "\n" + diff + "\n```");
        addHeader(3, "Logs");
        addInfo(null, "```\n" + logs + "\n```");
        toc = "## Table Of Contents\n";
        for (_i = 0, _len = headers.length; _i < _len; _i++) {
          header = headers[_i];

          /*
          - Heading 1
            - Heading 1.1
           */
          indent = "  ";
          bullet = "-";
          indentNum = header.level - 2;
          if (indentNum >= 0) {
            toc += "" + (Array(indentNum + 1).join(indent)) + bullet + " [" + header.title + "](\#" + (linkifyTitle(header.title)) + ")\n";
          }
        }
        debugInfo = debugInfo.replace(tocEl, toc);
        atom.clipboard.write(debugInfo);
        return confirm('Atom Beautify debugging information is now in your clipboard.\n' + 'You can now paste this into an Issue you are reporting here\n' + 'https://github.com/Glavin001/atom-beautify/issues/\n\n' + 'Please follow the contribution guidelines found at\n' + 'https://github.com/Glavin001/atom-beautify/blob/master/CONTRIBUTING.md\n\n' + 'Warning: Be sure to look over the debug info before you send it, ' + 'to ensure you are not sharing undesirable private information.');
      };
      try {
        return beautifier.beautify(text, allOptions, grammarName, filePath).then(cb)["catch"](cb);
      } catch (_error) {
        e = _error;
        return cb(e);
      }
    });
  };

  handleSaveEvent = function() {
    return atom.workspace.observeTextEditors(function(editor) {
      var buffer, disposable;
      buffer = editor.getBuffer();
      disposable = buffer.onDidSave(function(_arg) {
        var beautifyOnSave, fileExtension, filePath, grammar, key, language, languages, origScrollTop, posArray;
        filePath = _arg.path;
        if (path == null) {
          path = require('path');
        }
        grammar = editor.getGrammar().name;
        fileExtension = path.extname(filePath);
        fileExtension = fileExtension.substr(1);
        languages = beautifier.languages.getLanguages({
          grammar: grammar,
          extension: fileExtension
        });
        if (languages.length < 1) {
          return;
        }
        language = languages[0];
        key = "atom-beautify.language_" + language.namespace + "_beautify_on_save";
        beautifyOnSave = atom.config.get(key);
        logger.verbose('save editor positions', key, beautifyOnSave);
        if (beautifyOnSave) {
          posArray = getCursors(editor);
          origScrollTop = editor.getScrollTop();
          return beautifyFilePath(filePath, function() {
            if (editor.isAlive() === true) {
              buffer.reload();
              logger.verbose('restore editor positions', posArray, origScrollTop);
              return setTimeout((function() {
                setCursors(editor, posArray);
                editor.setScrollTop(origScrollTop);
              }), 0);
            }
          });
        }
      });
      return plugin.subscriptions.add(disposable);
    });
  };

  plugin.config = _.merge(require('./config.coffee'), defaultLanguageOptions);

  plugin.activate = function() {
    this.subscriptions = new CompositeDisposable;
    this.subscriptions.add(handleSaveEvent());
    this.subscriptions.add(atom.config.observe("atom-beautify.beautifyOnSave", handleSaveEvent));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:beautify-editor", beautify));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:help-debug-editor", debug));
    this.subscriptions.add(atom.commands.add(".tree-view .file .name", "atom-beautify:beautify-file", beautifyFile));
    return this.subscriptions.add(atom.commands.add(".tree-view .directory .name", "atom-beautify:beautify-directory", beautifyDirectory));
  };

  plugin.deactivate = function() {
    return this.subscriptions.dispose();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZ5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLDZSQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxpQkFBUixDQUROLENBQUE7O0FBQUEsRUFJQSxNQUFBLEdBQVMsTUFBTSxDQUFDLE9BSmhCLENBQUE7O0FBQUEsRUFLQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBTEQsQ0FBQTs7QUFBQSxFQU1BLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQU5KLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGVBQVIsQ0FQZCxDQUFBOztBQUFBLEVBUUEsVUFBQSxHQUFpQixJQUFBLFdBQUEsQ0FBQSxDQVJqQixDQUFBOztBQUFBLEVBU0Esc0JBQUEsR0FBeUIsVUFBVSxDQUFDLE9BVHBDLENBQUE7O0FBQUEsRUFVQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBQSxDQUFvQixVQUFwQixDQVZULENBQUE7O0FBQUEsRUFXQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVIsQ0FYVixDQUFBOztBQUFBLEVBY0EsRUFBQSxHQUFLLElBZEwsQ0FBQTs7QUFBQSxFQWVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQWZQLENBQUE7O0FBQUEsRUFnQkEsS0FBQSxHQUFRLElBaEJSLENBQUE7O0FBQUEsRUFpQkEsSUFBQSxHQUFPLElBakJQLENBQUE7O0FBQUEsRUFrQkEsS0FBQSxHQUFRLElBbEJSLENBQUE7O0FBQUEsRUFtQkEsR0FBQSxHQUFNLElBbkJOLENBQUE7O0FBQUEsRUFvQkEsV0FBQSxHQUFjLElBcEJkLENBQUE7O0FBQUEsRUFxQkEsV0FBQSxHQUFjLElBckJkLENBQUE7O0FBQUEsRUFzQkEsQ0FBQSxHQUFJLElBdEJKLENBQUE7O0FBQUEsRUE0QkEsVUFBQSxHQUFhLFNBQUMsTUFBRCxHQUFBO0FBQ1gsUUFBQSxtREFBQTtBQUFBLElBQUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBVixDQUFBO0FBQUEsSUFDQSxRQUFBLEdBQVcsRUFEWCxDQUFBO0FBRUEsU0FBQSw4Q0FBQTsyQkFBQTtBQUNFLE1BQUEsY0FBQSxHQUFpQixNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQUFqQixDQUFBO0FBQUEsTUFDQSxRQUFRLENBQUMsSUFBVCxDQUFjLENBQ1osY0FBYyxDQUFDLEdBREgsRUFFWixjQUFjLENBQUMsTUFGSCxDQUFkLENBREEsQ0FERjtBQUFBLEtBRkE7V0FRQSxTQVRXO0VBQUEsQ0E1QmIsQ0FBQTs7QUFBQSxFQXNDQSxVQUFBLEdBQWEsU0FBQyxNQUFELEVBQVMsUUFBVCxHQUFBO0FBR1gsUUFBQSwyQkFBQTtBQUFBLFNBQUEsdURBQUE7bUNBQUE7QUFDRSxNQUFBLElBQUcsQ0FBQSxLQUFLLENBQVI7QUFDRSxRQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixjQUEvQixDQUFBLENBQUE7QUFDQSxpQkFGRjtPQUFBO0FBQUEsTUFHQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsY0FBakMsQ0FIQSxDQURGO0FBQUEsS0FIVztFQUFBLENBdENiLENBQUE7O0FBQUEsRUFpREEsVUFBVSxDQUFDLEVBQVgsQ0FBYyxpQkFBZCxFQUFpQyxTQUFBLEdBQUE7O01BQy9CLGNBQWUsT0FBQSxDQUFRLHNCQUFSO0tBQWY7O01BQ0EsY0FBbUIsSUFBQSxXQUFBLENBQUE7S0FEbkI7V0FFQSxXQUFXLENBQUMsSUFBWixDQUFBLEVBSCtCO0VBQUEsQ0FBakMsQ0FqREEsQ0FBQTs7QUFBQSxFQXNEQSxVQUFVLENBQUMsRUFBWCxDQUFjLGVBQWQsRUFBK0IsU0FBQSxHQUFBO2lDQUM3QixXQUFXLENBQUUsSUFBYixDQUFBLFdBRDZCO0VBQUEsQ0FBL0IsQ0F0REEsQ0FBQTs7QUFBQSxFQTBEQSxTQUFBLEdBQVksU0FBQyxLQUFELEdBQUE7QUFDVixRQUFBLG1CQUFBO0FBQUEsSUFBQSxJQUFHLENBQUEsSUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUFQO0FBRUUsTUFBQSxLQUFBLEdBQVEsS0FBSyxDQUFDLEtBQWQsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFTLEtBQUssQ0FBQyxXQUFOLElBQXFCLEtBQUssQ0FBQyxPQURwQyxDQUFBO3VEQUVrQixDQUFFLFFBQXBCLENBQTZCLEtBQUssQ0FBQyxPQUFuQyxFQUE0QztBQUFBLFFBQzFDLE9BQUEsS0FEMEM7QUFBQSxRQUNuQyxRQUFBLE1BRG1DO0FBQUEsUUFDM0IsV0FBQSxFQUFjLElBRGE7T0FBNUMsV0FKRjtLQURVO0VBQUEsQ0ExRFosQ0FBQTs7QUFBQSxFQWtFQSxRQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFFVCxRQUFBLGtJQUFBO0FBQUEsSUFGVyxTQUFELEtBQUMsTUFFWCxDQUFBO0FBQUEsSUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsQ0FBQSxLQUFtRCxJQUF0RDtBQUNFLE1BQUEsTUFBQSxHQUFTLHlaQUFULENBQUE7O1FBWUEsSUFBSSxDQUFFLGFBQWEsQ0FBQyxVQUFwQixDQUErQixpRUFBL0IsRUFBa0c7QUFBQSxVQUFDLFFBQUEsTUFBRDtBQUFBLFVBQVMsV0FBQSxFQUFjLElBQXZCO1NBQWxHO09BYkY7S0FBQTs7TUFnQkEsT0FBUSxPQUFBLENBQVEsTUFBUjtLQWhCUjtBQUFBLElBaUJBLGVBQUEsR0FBa0IsTUFBQSxJQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsQ0FqQjdCLENBQUE7QUFBQSxJQTRCQSxpQkFBQSxHQUFvQixTQUFDLElBQUQsR0FBQTtBQUVsQixVQUFBLDRDQUFBO0FBQUEsTUFBQSxJQUFPLFlBQVA7QUFBQTtPQUFBLE1BR0ssSUFBRyxJQUFBLFlBQWdCLEtBQW5CO0FBQ0gsUUFBQSxTQUFBLENBQVUsSUFBVixDQUFBLENBREc7T0FBQSxNQUVBLElBQUcsTUFBQSxDQUFBLElBQUEsS0FBZSxRQUFsQjtBQUNILFFBQUEsSUFBRyxPQUFBLEtBQWEsSUFBaEI7QUFHRSxVQUFBLFFBQUEsR0FBVyxVQUFBLENBQVcsTUFBWCxDQUFYLENBQUE7QUFBQSxVQUdBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUhoQixDQUFBO0FBTUEsVUFBQSxJQUFHLENBQUEsZUFBQSxJQUF3QixXQUEzQjtBQUNFLFlBQUEsbUJBQUEsR0FBc0IsTUFBTSxDQUFDLHNCQUFQLENBQUEsQ0FBdEIsQ0FBQTtBQUFBLFlBR0EsTUFBTSxDQUFDLG9CQUFQLENBQTRCLG1CQUE1QixFQUFpRCxJQUFqRCxDQUhBLENBREY7V0FBQSxNQUFBO0FBUUUsWUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLElBQWYsQ0FBQSxDQVJGO1dBTkE7QUFBQSxVQWlCQSxVQUFBLENBQVcsTUFBWCxFQUFtQixRQUFuQixDQWpCQSxDQUFBO0FBQUEsVUF1QkEsVUFBQSxDQUFXLENBQUUsU0FBQSxHQUFBO0FBR1gsWUFBQSxNQUFNLENBQUMsWUFBUCxDQUFvQixhQUFwQixDQUFBLENBSFc7VUFBQSxDQUFGLENBQVgsRUFLRyxDQUxILENBdkJBLENBSEY7U0FERztPQUFBLE1BQUE7QUFrQ0gsUUFBQSxTQUFBLENBQWUsSUFBQSxLQUFBLENBQU8scUNBQUEsR0FBcUMsSUFBckMsR0FBMEMsSUFBakQsQ0FBZixDQUFBLENBbENHO09BUGE7SUFBQSxDQTVCcEIsQ0FBQTtBQUFBLElBOEVBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0E5RVQsQ0FBQTtBQWtGQSxJQUFBLElBQU8sY0FBUDtBQUNFLGFBQU8sU0FBQSxDQUFlLElBQUEsS0FBQSxDQUFNLDJCQUFOLEVBQ3BCLGdEQURvQixDQUFmLENBQVAsQ0FERjtLQWxGQTtBQUFBLElBcUZBLFdBQUEsR0FBYyxDQUFBLENBQUMsTUFBTyxDQUFDLGVBQVAsQ0FBQSxDQXJGaEIsQ0FBQTtBQUFBLElBeUZBLGNBQUEsR0FBaUIsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQXpGakIsQ0FBQTtBQUFBLElBNkZBLFVBQUEsR0FBYSxVQUFVLENBQUMsaUJBQVgsQ0FBNkIsY0FBN0IsRUFBNkMsTUFBN0MsQ0E3RmIsQ0FBQTtBQUFBLElBaUdBLElBQUEsR0FBTyxNQWpHUCxDQUFBO0FBa0dBLElBQUEsSUFBRyxDQUFBLGVBQUEsSUFBd0IsV0FBM0I7QUFDRSxNQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsZUFBUCxDQUFBLENBQVAsQ0FERjtLQUFBLE1BQUE7QUFHRSxNQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FIRjtLQWxHQTtBQUFBLElBc0dBLE9BQUEsR0FBVSxJQXRHVixDQUFBO0FBQUEsSUEwR0EsV0FBQSxHQUFjLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxJQTFHbEMsQ0FBQTtBQThHQTtBQUNFLE1BQUEsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsSUFBcEIsRUFBMEIsVUFBMUIsRUFBc0MsV0FBdEMsRUFBbUQsY0FBbkQsRUFBbUU7QUFBQSxRQUFBLE1BQUEsRUFBUyxNQUFUO09BQW5FLENBQ0EsQ0FBQyxJQURELENBQ00saUJBRE4sQ0FFQSxDQUFDLE9BQUQsQ0FGQSxDQUVPLGlCQUZQLENBQUEsQ0FERjtLQUFBLGNBQUE7QUFLRSxNQURJLFVBQ0osQ0FBQTtBQUFBLE1BQUEsU0FBQSxDQUFVLENBQVYsQ0FBQSxDQUxGO0tBaEhTO0VBQUEsQ0FsRVgsQ0FBQTs7QUFBQSxFQTBMQSxnQkFBQSxHQUFtQixTQUFDLFFBQUQsRUFBVyxRQUFYLEdBQUE7QUFHakIsUUFBQSxPQUFBOztNQUFBLElBQUssT0FBQSxDQUFRLHNCQUFSLENBQStCLENBQUM7S0FBckM7QUFBQSxJQUNBLEdBQUEsR0FBTSxDQUFBLENBQUcsOEJBQUEsR0FBOEIsUUFBOUIsR0FBdUMsS0FBMUMsQ0FETixDQUFBO0FBQUEsSUFFQSxHQUFHLENBQUMsUUFBSixDQUFhLGFBQWIsQ0FGQSxDQUFBO0FBQUEsSUFLQSxFQUFBLEdBQUssU0FBQyxHQUFELEVBQU0sTUFBTixHQUFBO0FBQ0gsTUFBQSxHQUFBLEdBQU0sQ0FBQSxDQUFHLDhCQUFBLEdBQThCLFFBQTlCLEdBQXVDLEtBQTFDLENBQU4sQ0FBQTtBQUFBLE1BQ0EsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsYUFBaEIsQ0FEQSxDQUFBO0FBRUEsYUFBTyxRQUFBLENBQVMsR0FBVCxFQUFjLE1BQWQsQ0FBUCxDQUhHO0lBQUEsQ0FMTCxDQUFBOztNQVdBLEtBQU0sT0FBQSxDQUFRLElBQVI7S0FYTjtXQVlBLEVBQUUsQ0FBQyxRQUFILENBQVksUUFBWixFQUFzQixTQUFDLEdBQUQsRUFBTSxJQUFOLEdBQUE7QUFDcEIsVUFBQSx5REFBQTtBQUFBLE1BQUEsSUFBa0IsR0FBbEI7QUFBQSxlQUFPLEVBQUEsQ0FBRyxHQUFILENBQVAsQ0FBQTtPQUFBO0FBQUEsTUFDQSxLQUFBLGtCQUFRLElBQUksQ0FBRSxRQUFOLENBQUEsVUFEUixDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFkLENBQTRCLFFBQTVCLEVBQXNDLEtBQXRDLENBRlYsQ0FBQTtBQUFBLE1BR0EsV0FBQSxHQUFjLE9BQU8sQ0FBQyxJQUh0QixDQUFBO0FBQUEsTUFNQSxVQUFBLEdBQWEsVUFBVSxDQUFDLGlCQUFYLENBQTZCLFFBQTdCLENBTmIsQ0FBQTtBQUFBLE1BU0EsYUFBQSxHQUFnQixTQUFDLE1BQUQsR0FBQTtBQUNkLFFBQUEsSUFBRyxNQUFBLFlBQWtCLEtBQXJCO0FBQ0UsaUJBQU8sRUFBQSxDQUFHLE1BQUgsRUFBVyxJQUFYLENBQVAsQ0FERjtTQUFBLE1BRUssSUFBRyxNQUFBLENBQUEsTUFBQSxLQUFpQixRQUFwQjtBQUVILFVBQUEsSUFBMkIsTUFBQSxLQUFVLEVBQXJDO0FBQUEsbUJBQU8sRUFBQSxDQUFHLElBQUgsRUFBUyxNQUFULENBQVAsQ0FBQTtXQUFBO2lCQUVBLEVBQUUsQ0FBQyxTQUFILENBQWEsUUFBYixFQUF1QixNQUF2QixFQUErQixTQUFDLEdBQUQsR0FBQTtBQUM3QixZQUFBLElBQWtCLEdBQWxCO0FBQUEscUJBQU8sRUFBQSxDQUFHLEdBQUgsQ0FBUCxDQUFBO2FBQUE7QUFDQSxtQkFBTyxFQUFBLENBQUksSUFBSixFQUFXLE1BQVgsQ0FBUCxDQUY2QjtVQUFBLENBQS9CLEVBSkc7U0FBQSxNQUFBO0FBU0gsaUJBQU8sRUFBQSxDQUFRLElBQUEsS0FBQSxDQUFPLGdDQUFBLEdBQWdDLE1BQWhDLEdBQXVDLEdBQTlDLENBQVIsRUFBMkQsTUFBM0QsQ0FBUCxDQVRHO1NBSFM7TUFBQSxDQVRoQixDQUFBO0FBc0JBO2VBQ0UsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsS0FBcEIsRUFBMkIsVUFBM0IsRUFBdUMsV0FBdkMsRUFBb0QsUUFBcEQsQ0FDQSxDQUFDLElBREQsQ0FDTSxhQUROLENBRUEsQ0FBQyxPQUFELENBRkEsQ0FFTyxhQUZQLEVBREY7T0FBQSxjQUFBO0FBS0UsUUFESSxVQUNKLENBQUE7QUFBQSxlQUFPLEVBQUEsQ0FBRyxDQUFILENBQVAsQ0FMRjtPQXZCb0I7SUFBQSxDQUF0QixFQWZpQjtFQUFBLENBMUxuQixDQUFBOztBQUFBLEVBd09BLFlBQUEsR0FBZSxTQUFDLElBQUQsR0FBQTtBQUNiLFFBQUEsZ0JBQUE7QUFBQSxJQURlLFNBQUQsS0FBQyxNQUNmLENBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQTFCLENBQUE7QUFDQSxJQUFBLElBQUEsQ0FBQSxRQUFBO0FBQUEsWUFBQSxDQUFBO0tBREE7QUFBQSxJQUVBLGdCQUFBLENBQWlCLFFBQWpCLEVBQTJCLFNBQUMsR0FBRCxFQUFNLE1BQU4sR0FBQTtBQUN6QixNQUFBLElBQXlCLEdBQXpCO0FBQUEsZUFBTyxTQUFBLENBQVUsR0FBVixDQUFQLENBQUE7T0FEeUI7SUFBQSxDQUEzQixDQUZBLENBRGE7RUFBQSxDQXhPZixDQUFBOztBQUFBLEVBaVBBLGlCQUFBLEdBQW9CLFNBQUMsSUFBRCxHQUFBO0FBQ2xCLFFBQUEsb0JBQUE7QUFBQSxJQURvQixTQUFELEtBQUMsTUFDcEIsQ0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBekIsQ0FBQTtBQUNBLElBQUEsSUFBQSxDQUFBLE9BQUE7QUFBQSxZQUFBLENBQUE7S0FEQTtBQUdBLElBQUEsb0RBQVUsSUFBSSxDQUFFLE9BQU4sQ0FDUjtBQUFBLE1BQUEsT0FBQSxFQUFVLDRFQUFBLEdBQzRCLE9BRDVCLEdBQ29DLDZCQUQ5QztBQUFBLE1BR0EsT0FBQSxFQUFTLENBQUMsZ0JBQUQsRUFBa0IsYUFBbEIsQ0FIVDtLQURRLFdBQUEsS0FJd0MsQ0FKbEQ7QUFBQSxZQUFBLENBQUE7S0FIQTs7TUFVQSxJQUFLLE9BQUEsQ0FBUSxzQkFBUixDQUErQixDQUFDO0tBVnJDO0FBQUEsSUFXQSxHQUFBLEdBQU0sQ0FBQSxDQUFHLG1DQUFBLEdBQW1DLE9BQW5DLEdBQTJDLEtBQTlDLENBWE4sQ0FBQTtBQUFBLElBWUEsR0FBRyxDQUFDLFFBQUosQ0FBYSxhQUFiLENBWkEsQ0FBQTs7TUFlQSxNQUFPLE9BQUEsQ0FBUSxVQUFSO0tBZlA7O01BZ0JBLFFBQVMsT0FBQSxDQUFRLE9BQVI7S0FoQlQ7QUFBQSxJQWlCQSxHQUFHLENBQUMsS0FBSixDQUFVLE9BQVYsRUFBbUIsU0FBQyxHQUFELEVBQU0sS0FBTixHQUFBO0FBQ2pCLE1BQUEsSUFBeUIsR0FBekI7QUFBQSxlQUFPLFNBQUEsQ0FBVSxHQUFWLENBQVAsQ0FBQTtPQUFBO2FBRUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFYLEVBQWtCLFNBQUMsUUFBRCxFQUFXLFFBQVgsR0FBQTtlQUVoQixnQkFBQSxDQUFpQixRQUFqQixFQUEyQixTQUFBLEdBQUE7aUJBQUcsUUFBQSxDQUFBLEVBQUg7UUFBQSxDQUEzQixFQUZnQjtNQUFBLENBQWxCLEVBR0UsU0FBQyxHQUFELEdBQUE7QUFDQSxRQUFBLEdBQUEsR0FBTSxDQUFBLENBQUcsbUNBQUEsR0FBbUMsT0FBbkMsR0FBMkMsS0FBOUMsQ0FBTixDQUFBO2VBQ0EsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsYUFBaEIsRUFGQTtNQUFBLENBSEYsRUFIaUI7SUFBQSxDQUFuQixDQWpCQSxDQURrQjtFQUFBLENBalBwQixDQUFBOztBQUFBLEVBaVJBLEtBQUEsR0FBUSxTQUFBLEdBQUE7QUFHTixRQUFBLDhLQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLElBRUEsWUFBQSxHQUFlLFNBQUMsS0FBRCxHQUFBO0FBQ2IsVUFBQSxNQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsS0FBSyxDQUFDLFdBQU4sQ0FBQSxDQUFSLENBQUE7QUFBQSxNQUNBLENBQUEsR0FBSSxLQUFLLENBQUMsS0FBTixDQUFZLHFCQUFaLENBREosQ0FBQTtBQUFBLE1BRUEsR0FBQSxHQUFNLEdBRk4sQ0FBQTthQUdBLENBQUMsQ0FBQyxJQUFGLENBQU8sR0FBUCxFQUphO0lBQUEsQ0FGZixDQUFBO0FBU0EsSUFBQSxJQUFPLGNBQVA7QUFDRSxhQUFPLE9BQUEsQ0FBUSw0QkFBQSxHQUNmLGdEQURPLENBQVAsQ0FERjtLQVRBO0FBWUEsSUFBQSxJQUFBLENBQUEsT0FBYyxDQUFRLDJDQUFBLEdBQ3RCLDREQURjLENBQWQ7QUFBQSxZQUFBLENBQUE7S0FaQTtBQUFBLElBY0EsU0FBQSxHQUFZLEVBZFosQ0FBQTtBQUFBLElBZUEsT0FBQSxHQUFVLEVBZlYsQ0FBQTtBQUFBLElBZ0JBLEtBQUEsR0FBUSxvQkFoQlIsQ0FBQTtBQUFBLElBaUJBLE9BQUEsR0FBVSxTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7QUFDUixNQUFBLElBQUcsV0FBSDtlQUNFLFNBQUEsSUFBYyxJQUFBLEdBQUksR0FBSixHQUFRLE1BQVIsR0FBYyxHQUFkLEdBQWtCLE9BRGxDO09BQUEsTUFBQTtlQUdFLFNBQUEsSUFBYSxFQUFBLEdBQUcsR0FBSCxHQUFPLE9BSHRCO09BRFE7SUFBQSxDQWpCVixDQUFBO0FBQUEsSUFzQkEsU0FBQSxHQUFZLFNBQUMsS0FBRCxFQUFRLEtBQVIsR0FBQTtBQUNWLE1BQUEsU0FBQSxJQUFhLEVBQUEsR0FBRSxDQUFDLEtBQUEsQ0FBTSxLQUFBLEdBQU0sQ0FBWixDQUFjLENBQUMsSUFBZixDQUFvQixHQUFwQixDQUFELENBQUYsR0FBNEIsR0FBNUIsR0FBK0IsS0FBL0IsR0FBcUMsTUFBbEQsQ0FBQTthQUNBLE9BQU8sQ0FBQyxJQUFSLENBQWE7QUFBQSxRQUNYLE9BQUEsS0FEVztBQUFBLFFBQ0osT0FBQSxLQURJO09BQWIsRUFGVTtJQUFBLENBdEJaLENBQUE7QUFBQSxJQTJCQSxTQUFBLENBQVUsQ0FBVixFQUFhLHVDQUFiLENBM0JBLENBQUE7QUFBQSxJQTRCQSxTQUFBLElBQWEsMENBQUEsR0FDYixDQUFDLG1DQUFBLEdBQWtDLENBQUssSUFBQSxJQUFBLENBQUEsQ0FBTCxDQUFsQyxHQUE4QyxJQUEvQyxDQURhLEdBRWIsYUFGYSxHQUdiLEtBSGEsR0FJYixhQWhDQSxDQUFBO0FBQUEsSUFtQ0EsT0FBQSxDQUFRLFVBQVIsRUFBb0IsT0FBTyxDQUFDLFFBQTVCLENBbkNBLENBQUE7QUFBQSxJQW9DQSxTQUFBLENBQVUsQ0FBVixFQUFhLFVBQWIsQ0FwQ0EsQ0FBQTtBQUFBLElBd0NBLE9BQUEsQ0FBUSxjQUFSLEVBQXdCLElBQUksQ0FBQyxVQUE3QixDQXhDQSxDQUFBO0FBQUEsSUE0Q0EsT0FBQSxDQUFRLHVCQUFSLEVBQWlDLEdBQUcsQ0FBQyxPQUFyQyxDQTVDQSxDQUFBO0FBQUEsSUE2Q0EsU0FBQSxDQUFVLENBQVYsRUFBYSxnQ0FBYixDQTdDQSxDQUFBO0FBQUEsSUFtREEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FuRFgsQ0FBQTtBQUFBLElBc0RBLE9BQUEsQ0FBUSxvQkFBUixFQUErQixHQUFBLEdBQUcsUUFBSCxHQUFZLEdBQTNDLENBdERBLENBQUE7QUFBQSxJQXlEQSxXQUFBLEdBQWMsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLElBekRsQyxDQUFBO0FBQUEsSUE0REEsT0FBQSxDQUFRLHVCQUFSLEVBQWlDLFdBQWpDLENBNURBLENBQUE7QUFBQSxJQStEQSxRQUFBLEdBQVcsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsV0FBdkIsRUFBb0MsUUFBcEMsQ0EvRFgsQ0FBQTtBQUFBLElBZ0VBLE9BQUEsQ0FBUSx3QkFBUixxQkFBa0MsUUFBUSxDQUFFLGFBQTVDLENBaEVBLENBQUE7QUFBQSxJQWlFQSxPQUFBLENBQVEsb0JBQVIscUJBQThCLFFBQVEsQ0FBRSxrQkFBeEMsQ0FqRUEsQ0FBQTtBQUFBLElBb0VBLFdBQUEsR0FBYyxVQUFVLENBQUMsY0FBWCxDQUEwQixRQUFRLENBQUMsSUFBbkMsQ0FwRWQsQ0FBQTtBQUFBLElBcUVBLE9BQUEsQ0FBUSx1QkFBUixFQUFpQyxDQUFDLENBQUMsR0FBRixDQUFNLFdBQU4sRUFBbUIsTUFBbkIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxJQUFoQyxDQUFqQyxDQXJFQSxDQUFBO0FBQUEsSUFzRUEsa0JBQUEsR0FBcUIsVUFBVSxDQUFDLHdCQUFYLENBQW9DLFFBQXBDLENBdEVyQixDQUFBO0FBQUEsSUF1RUEsT0FBQSxDQUFRLHFCQUFSLEVBQStCLGtCQUFrQixDQUFDLElBQWxELENBdkVBLENBQUE7QUFBQSxJQTBFQSxJQUFBLEdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQTFFUCxDQUFBO0FBQUEsSUE2RUEsZUFBQSxHQUFrQixxRUFBa0IsV0FBbEIsQ0FBOEIsQ0FBQyxXQUEvQixDQUFBLENBQTRDLENBQUMsS0FBN0MsQ0FBbUQsR0FBbkQsQ0FBd0QsQ0FBQSxDQUFBLENBN0UxRSxDQUFBO0FBQUEsSUE4RUEsU0FBQSxDQUFVLENBQVYsRUFBYSx3QkFBYixDQTlFQSxDQUFBO0FBQUEsSUErRUEsT0FBQSxDQUFRLElBQVIsRUFBZSxPQUFBLEdBQU8sZUFBUCxHQUF1QixJQUF2QixHQUEyQixJQUEzQixHQUFnQyxPQUEvQyxDQS9FQSxDQUFBO0FBQUEsSUFpRkEsU0FBQSxDQUFVLENBQVYsRUFBYSxrQkFBYixDQWpGQSxDQUFBO0FBQUEsSUFrRkEsT0FBQSxDQUFRLElBQVIsRUFDRSxvQ0FBQSxHQUNBLENBQUMsV0FBQSxHQUFVLENBQUMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZUFBaEIsQ0FBZixFQUFpRCxNQUFqRCxFQUE0RCxDQUE1RCxDQUFELENBQVYsR0FBMEUsT0FBM0UsQ0FGRixDQWxGQSxDQUFBO0FBQUEsSUF1RkEsU0FBQSxDQUFVLENBQVYsRUFBYSx3QkFBYixDQXZGQSxDQUFBO0FBQUEsSUF5RkEsVUFBQSxHQUFhLFVBQVUsQ0FBQyxpQkFBWCxDQUE2QixRQUE3QixFQUF1QyxNQUF2QyxDQXpGYixDQUFBO1dBMkZBLE9BQU8sQ0FBQyxHQUFSLENBQVksVUFBWixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsVUFBRCxHQUFBO0FBRUosVUFBQSxnS0FBQTtBQUFBLE1BQ0ksNkJBREosRUFFSSw2QkFGSixFQUdJLDJCQUhKLEVBSUksbUNBSkosQ0FBQTtBQUFBLE1BTUEsY0FBQSxHQUFpQixVQUFXLFNBTjVCLENBQUE7QUFBQSxNQVFBLHFCQUFBLEdBQXdCLFVBQVUsQ0FBQyxxQkFBWCxDQUFpQyxVQUFqQyxFQUE2QyxRQUE3QyxDQVJ4QixDQUFBO0FBVUEsTUFBQSxJQUFHLGtCQUFIO0FBQ0UsUUFBQSxZQUFBLEdBQWUsVUFBVSxDQUFDLGdCQUFYLENBQTRCLGtCQUE1QixFQUFnRCxRQUFRLENBQUMsSUFBekQsRUFBK0QscUJBQS9ELENBQWYsQ0FERjtPQVZBO0FBQUEsTUFpQkEsT0FBQSxDQUFRLGdCQUFSLEVBQTBCLElBQUEsR0FDMUIscUNBRDBCLEdBRTFCLENBQUMsV0FBQSxHQUFVLENBQUMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxhQUFmLEVBQThCLE1BQTlCLEVBQXlDLENBQXpDLENBQUQsQ0FBVixHQUF1RCxPQUF4RCxDQUZBLENBakJBLENBQUE7QUFBQSxNQW9CQSxPQUFBLENBQVEsZ0JBQVIsRUFBMEIsSUFBQSxHQUMxQiwrQ0FEMEIsR0FFMUIsQ0FBQyxXQUFBLEdBQVUsQ0FBQyxJQUFJLENBQUMsU0FBTCxDQUFlLGFBQWYsRUFBOEIsTUFBOUIsRUFBeUMsQ0FBekMsQ0FBRCxDQUFWLEdBQXVELE9BQXhELENBRkEsQ0FwQkEsQ0FBQTtBQUFBLE1BdUJBLE9BQUEsQ0FBUSxjQUFSLEVBQXdCLElBQUEsR0FDeEIsQ0FBQyxnQkFBQSxHQUFlLENBQUMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxVQUFVLENBQUMsV0FBWCxDQUFBLENBQWIsRUFBdUMsZUFBdkMsQ0FBRCxDQUFmLEdBQXdFLEtBQXpFLENBRHdCLEdBRXhCLENBQUMsV0FBQSxHQUFVLENBQUMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxXQUFmLEVBQTRCLE1BQTVCLEVBQXVDLENBQXZDLENBQUQsQ0FBVixHQUFxRCxPQUF0RCxDQUZBLENBdkJBLENBQUE7QUFBQSxNQTBCQSxPQUFBLENBQVEsc0JBQVIsRUFBZ0MsSUFBQSxHQUNoQyw4REFEZ0MsR0FFaEMsQ0FBQyxXQUFBLEdBQVUsQ0FBQyxJQUFJLENBQUMsU0FBTCxDQUFlLG1CQUFmLEVBQW9DLE1BQXBDLEVBQStDLENBQS9DLENBQUQsQ0FBVixHQUE2RCxPQUE5RCxDQUZBLENBMUJBLENBQUE7QUFBQSxNQTZCQSxPQUFBLENBQVEsaUJBQVIsRUFBMkIsSUFBQSxHQUMzQixDQUFDLDhEQUFBLEdBQTZELENBQUMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBQUQsQ0FBN0QsR0FBcUYsMEJBQXRGLENBRDJCLEdBRTNCLENBQUMsV0FBQSxHQUFVLENBQUMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxjQUFmLEVBQStCLE1BQS9CLEVBQTBDLENBQTFDLENBQUQsQ0FBVixHQUF3RCxPQUF6RCxDQUZBLENBN0JBLENBQUE7QUFBQSxNQWdDQSxPQUFBLENBQVEseUJBQVIsRUFBbUMsSUFBQSxHQUNuQyxpRkFEbUMsR0FFbkMsQ0FBQyxXQUFBLEdBQVUsQ0FBQyxJQUFJLENBQUMsU0FBTCxDQUFlLHFCQUFmLEVBQXNDLE1BQXRDLEVBQWlELENBQWpELENBQUQsQ0FBVixHQUErRCxPQUFoRSxDQUZBLENBaENBLENBQUE7QUFtQ0EsTUFBQSxJQUFHLGtCQUFIO0FBQ0UsUUFBQSxTQUFBLENBQVUsQ0FBVixFQUFhLGVBQWIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxPQUFBLENBQVEsSUFBUixFQUNFLHdEQUFBLEdBQ0EsQ0FBQyxXQUFBLEdBQVUsQ0FBQyxJQUFJLENBQUMsU0FBTCxDQUFlLFlBQWYsRUFBNkIsTUFBN0IsRUFBd0MsQ0FBeEMsQ0FBRCxDQUFWLEdBQXNELE9BQXZELENBRkYsQ0FEQSxDQURGO09BbkNBO0FBQUEsTUEwQ0EsSUFBQSxHQUFPLEVBMUNQLENBQUE7QUFBQSxNQTJDQSxnQkFBQSxHQUF1QixJQUFBLE1BQUEsQ0FBTyxnQkFBUCxDQTNDdkIsQ0FBQTtBQUFBLE1BNENBLFlBQUEsR0FBZSxNQUFNLENBQUMsU0FBUCxDQUFpQixTQUFDLEdBQUQsR0FBQTtBQUU5QixZQUFBLEdBQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsR0FBWCxDQUFBO2VBQ0EsSUFBQSxJQUFRLEdBQUcsQ0FBQyxPQUFKLENBQVksZ0JBQVosRUFBOEIsU0FBQyxDQUFELEVBQUcsQ0FBSCxHQUFBO0FBQ3BDLGNBQUEsT0FBQTtBQUFBLFVBQUEsQ0FBQSxHQUFJLENBQUMsQ0FBQyxLQUFGLENBQVEsR0FBUixDQUFKLENBQUE7QUFBQSxVQUNBLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixDQUFVLGVBQVYsQ0FESixDQUFBO0FBQUEsVUFFQSxDQUFBLEdBQUksQ0FBQyxDQUFDLEtBQUYsQ0FBUSxDQUFBLEdBQUUsQ0FBVixDQUFZLENBQUMsSUFBYixDQUFrQixHQUFsQixDQUZKLENBQUE7QUFJQSxpQkFBTyxLQUFBLEdBQU0sQ0FBTixHQUFRLEdBQWYsQ0FMb0M7UUFBQSxDQUE5QixFQUhzQjtNQUFBLENBQWpCLENBNUNmLENBQUE7QUFBQSxNQXVEQSxFQUFBLEdBQUssU0FBQyxNQUFELEdBQUE7QUFDSCxZQUFBLDhEQUFBO0FBQUEsUUFBQSxZQUFZLENBQUMsT0FBYixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsU0FBQSxDQUFVLENBQVYsRUFBYSxTQUFiLENBREEsQ0FBQTtBQUFBLFFBSUEsT0FBQSxDQUFRLDBCQUFSLEVBQXFDLE9BQUEsR0FBTyxlQUFQLEdBQXVCLElBQXZCLEdBQTJCLE1BQTNCLEdBQWtDLE9BQXZFLENBSkEsQ0FBQTtBQUFBLFFBTUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxNQUFSLENBTlQsQ0FBQTtBQUFBLFFBT0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxXQUFQLENBQW1CLFFBQW5CLEVBQTZCLElBQTdCLEVBQ0wsTUFESyxFQUNHLFVBREgsRUFDZSxZQURmLENBUFAsQ0FBQTtBQUFBLFFBU0EsT0FBQSxDQUFRLDhCQUFSLEVBQXlDLE9BQUEsR0FBTyxlQUFQLEdBQXVCLElBQXZCLEdBQTJCLElBQTNCLEdBQWdDLE9BQXpFLENBVEEsQ0FBQTtBQUFBLFFBV0EsU0FBQSxDQUFVLENBQVYsRUFBYSxNQUFiLENBWEEsQ0FBQTtBQUFBLFFBWUEsT0FBQSxDQUFRLElBQVIsRUFBZSxPQUFBLEdBQU8sSUFBUCxHQUFZLE9BQTNCLENBWkEsQ0FBQTtBQUFBLFFBZUEsR0FBQSxHQUFNLHdCQWZOLENBQUE7QUFnQkEsYUFBQSw4Q0FBQTsrQkFBQTtBQUNFO0FBQUE7OzthQUFBO0FBQUEsVUFJQSxNQUFBLEdBQVMsSUFKVCxDQUFBO0FBQUEsVUFLQSxNQUFBLEdBQVMsR0FMVCxDQUFBO0FBQUEsVUFNQSxTQUFBLEdBQVksTUFBTSxDQUFDLEtBQVAsR0FBZSxDQU4zQixDQUFBO0FBT0EsVUFBQSxJQUFHLFNBQUEsSUFBYSxDQUFoQjtBQUNFLFlBQUEsR0FBQSxJQUFRLEVBQUEsR0FBRSxDQUFDLEtBQUEsQ0FBTSxTQUFBLEdBQVUsQ0FBaEIsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixNQUF4QixDQUFELENBQUYsR0FBcUMsTUFBckMsR0FBNEMsSUFBNUMsR0FBZ0QsTUFBTSxDQUFDLEtBQXZELEdBQTZELE1BQTdELEdBQWtFLENBQUMsWUFBQSxDQUFhLE1BQU0sQ0FBQyxLQUFwQixDQUFELENBQWxFLEdBQThGLEtBQXRHLENBREY7V0FSRjtBQUFBLFNBaEJBO0FBQUEsUUEyQkEsU0FBQSxHQUFZLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEtBQWxCLEVBQXlCLEdBQXpCLENBM0JaLENBQUE7QUFBQSxRQThCQSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsQ0FBcUIsU0FBckIsQ0E5QkEsQ0FBQTtlQStCQSxPQUFBLENBQVEsaUVBQUEsR0FDUiwrREFEUSxHQUVSLHdEQUZRLEdBR1Isc0RBSFEsR0FJUiw0RUFKUSxHQUtSLG1FQUxRLEdBTVIsZ0VBTkEsRUFoQ0c7TUFBQSxDQXZETCxDQUFBO0FBK0ZBO2VBQ0UsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsSUFBcEIsRUFBMEIsVUFBMUIsRUFBc0MsV0FBdEMsRUFBbUQsUUFBbkQsQ0FDQSxDQUFDLElBREQsQ0FDTSxFQUROLENBRUEsQ0FBQyxPQUFELENBRkEsQ0FFTyxFQUZQLEVBREY7T0FBQSxjQUFBO0FBS0UsUUFESSxVQUNKLENBQUE7QUFBQSxlQUFPLEVBQUEsQ0FBRyxDQUFILENBQVAsQ0FMRjtPQWpHSTtJQUFBLENBRE4sRUE5Rk07RUFBQSxDQWpSUixDQUFBOztBQUFBLEVBeWRBLGVBQUEsR0FBa0IsU0FBQSxHQUFBO1dBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFELEdBQUE7QUFDaEMsVUFBQSxrQkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxVQUFBLEdBQWEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsU0FBQyxJQUFELEdBQUE7QUFDNUIsWUFBQSxtR0FBQTtBQUFBLFFBRHFDLFdBQVIsS0FBQyxJQUM5QixDQUFBOztVQUFBLE9BQVEsT0FBQSxDQUFRLE1BQVI7U0FBUjtBQUFBLFFBRUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxJQUY5QixDQUFBO0FBQUEsUUFJQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYixDQUpoQixDQUFBO0FBQUEsUUFNQSxhQUFBLEdBQWdCLGFBQWEsQ0FBQyxNQUFkLENBQXFCLENBQXJCLENBTmhCLENBQUE7QUFBQSxRQVFBLFNBQUEsR0FBWSxVQUFVLENBQUMsU0FBUyxDQUFDLFlBQXJCLENBQWtDO0FBQUEsVUFBQyxTQUFBLE9BQUQ7QUFBQSxVQUFVLFNBQUEsRUFBVyxhQUFyQjtTQUFsQyxDQVJaLENBQUE7QUFTQSxRQUFBLElBQUcsU0FBUyxDQUFDLE1BQVYsR0FBbUIsQ0FBdEI7QUFDRSxnQkFBQSxDQURGO1NBVEE7QUFBQSxRQVlBLFFBQUEsR0FBVyxTQUFVLENBQUEsQ0FBQSxDQVpyQixDQUFBO0FBQUEsUUFjQSxHQUFBLEdBQU8seUJBQUEsR0FBeUIsUUFBUSxDQUFDLFNBQWxDLEdBQTRDLG1CQWRuRCxDQUFBO0FBQUEsUUFlQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixHQUFoQixDQWZqQixDQUFBO0FBQUEsUUFnQkEsTUFBTSxDQUFDLE9BQVAsQ0FBZSx1QkFBZixFQUF3QyxHQUF4QyxFQUE2QyxjQUE3QyxDQWhCQSxDQUFBO0FBaUJBLFFBQUEsSUFBRyxjQUFIO0FBQ0UsVUFBQSxRQUFBLEdBQVcsVUFBQSxDQUFXLE1BQVgsQ0FBWCxDQUFBO0FBQUEsVUFDQSxhQUFBLEdBQWdCLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FEaEIsQ0FBQTtpQkFFQSxnQkFBQSxDQUFpQixRQUFqQixFQUEyQixTQUFBLEdBQUE7QUFDekIsWUFBQSxJQUFHLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBQSxLQUFvQixJQUF2QjtBQUNFLGNBQUEsTUFBTSxDQUFDLE1BQVAsQ0FBQSxDQUFBLENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUsMEJBQWYsRUFBMkMsUUFBM0MsRUFBb0QsYUFBcEQsQ0FEQSxDQUFBO3FCQUtBLFVBQUEsQ0FBVyxDQUFFLFNBQUEsR0FBQTtBQUNYLGdCQUFBLFVBQUEsQ0FBVyxNQUFYLEVBQW1CLFFBQW5CLENBQUEsQ0FBQTtBQUFBLGdCQUNBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLGFBQXBCLENBREEsQ0FEVztjQUFBLENBQUYsQ0FBWCxFQUtHLENBTEgsRUFORjthQUR5QjtVQUFBLENBQTNCLEVBSEY7U0FsQjRCO01BQUEsQ0FBakIsQ0FEYixDQUFBO2FBcUNBLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBckIsQ0FBeUIsVUFBekIsRUF0Q2dDO0lBQUEsQ0FBbEMsRUFEZ0I7RUFBQSxDQXpkbEIsQ0FBQTs7QUFBQSxFQWlnQkEsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxPQUFBLENBQVEsaUJBQVIsQ0FBUixFQUFvQyxzQkFBcEMsQ0FqZ0JoQixDQUFBOztBQUFBLEVBa2dCQSxNQUFNLENBQUMsUUFBUCxHQUFrQixTQUFBLEdBQUE7QUFDaEIsSUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixlQUFBLENBQUEsQ0FBbkIsQ0FEQSxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDhCQUFwQixFQUFvRCxlQUFwRCxDQUFuQixDQUZBLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLCtCQUFwQyxFQUFxRSxRQUFyRSxDQUFuQixDQUhBLENBQUE7QUFBQSxJQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGlDQUFwQyxFQUF1RSxLQUF2RSxDQUFuQixDQUpBLENBQUE7QUFBQSxJQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isd0JBQWxCLEVBQTRDLDZCQUE1QyxFQUEyRSxZQUEzRSxDQUFuQixDQUxBLENBQUE7V0FNQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLDZCQUFsQixFQUFpRCxrQ0FBakQsRUFBcUYsaUJBQXJGLENBQW5CLEVBUGdCO0VBQUEsQ0FsZ0JsQixDQUFBOztBQUFBLEVBMmdCQSxNQUFNLENBQUMsVUFBUCxHQUFvQixTQUFBLEdBQUE7V0FDbEIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsRUFEa0I7RUFBQSxDQTNnQnBCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/victor.martins/.atom/packages/atom-beautify/src/beautify.coffee
