(function() {
  var $, BufferedProcess, CompositeDisposable, GitRevisionView, SplitDiff, fs, path, _, _ref;

  _ = require('underscore-plus');

  path = require('path');

  fs = require('fs');

  _ref = require("atom"), CompositeDisposable = _ref.CompositeDisposable, BufferedProcess = _ref.BufferedProcess;

  $ = require("atom-space-pen-views").$;

  SplitDiff = require('split-diff');

  module.exports = GitRevisionView = (function() {
    function GitRevisionView() {}

    GitRevisionView.FILE_PREFIX = "TimeMachine - ";


    /*
      This code and technique was originally from git-history package,
      see https://github.com/jakesankey/git-history/blob/master/lib/git-history-view.coffee
    
      Changes to permit click and drag in the time plot to travel in time:
      - don't write revision to disk for faster access and to give the user feedback when git'ing
        a rev to show is slow
      - reuse tabs more - don't open a new tab for every rev of the same file
    
      Changes to permit scrolling to same lines in view in the editor the history is for
    
      thank you, @jakesankey!
     */

    GitRevisionView.showRevision = function(editor, revHash, options) {
      var exit, file, fileContents, stdout;
      if (options == null) {
        options = {};
      }
      options = _.defaults(options, {
        diff: false
      });
      SplitDiff.disable(false);
      file = editor.getPath();
      fileContents = "";
      stdout = (function(_this) {
        return function(output) {
          return fileContents += output;
        };
      })(this);
      exit = (function(_this) {
        return function(code) {
          if (code === 0) {
            return _this._showRevision(file, editor, revHash, fileContents, options);
          } else {
            return atom.notifications.addError("Could not retrieve revision for " + (path.basename(file)) + " (" + code + ")");
          }
        };
      })(this);
      return this._loadRevision(file, revHash, stdout, exit);
    };

    GitRevisionView._loadRevision = function(file, hash, stdout, exit) {
      var showArgs;
      showArgs = ["show", "" + hash + ":./" + (path.basename(file))];
      return new BufferedProcess({
        command: "git",
        args: showArgs,
        options: {
          cwd: path.dirname(file)
        },
        stdout: stdout,
        exit: exit
      });
    };

    GitRevisionView._getInitialLineNumber = function(editor) {
      var editorEle, lineNumber;
      editorEle = atom.views.getView(editor);
      lineNumber = 0;
      if ((editor != null) && editor !== '') {
        lineNumber = editorEle.getLastVisibleScreenRow();
      }
      return lineNumber - 5;
    };

    GitRevisionView._showRevision = function(file, editor, revHash, fileContents, options) {
      var outputDir, outputFilePath, tempContent, _ref1;
      if (options == null) {
        options = {};
      }
      outputDir = "" + (atom.getConfigDirPath()) + "/git-time-machine";
      if (!fs.existsSync(outputDir)) {
        fs.mkdir(outputDir);
      }
      outputFilePath = "" + outputDir + "/" + this.FILE_PREFIX + (path.basename(file));
      if (options.diff) {
        outputFilePath += ".diff";
      }
      tempContent = "Loading..." + ((_ref1 = editor.buffer) != null ? _ref1.lineEndingForRow(0) : void 0);
      return fs.writeFile(outputFilePath, tempContent, (function(_this) {
        return function(error) {
          var promise;
          if (!error) {
            promise = atom.workspace.open(outputFilePath, {
              split: "right",
              activatePane: false,
              activateItem: true,
              searchAllPanes: true
            });
            return promise.then(function(newTextEditor) {
              return _this._updateNewTextEditor(newTextEditor, editor, revHash, fileContents);
            });
          }
        };
      })(this));
    };

    GitRevisionView._updateNewTextEditor = function(newTextEditor, editor, revHash, fileContents) {
      return _.delay((function(_this) {
        return function() {
          var lineEnding, _ref1;
          lineEnding = ((_ref1 = editor.buffer) != null ? _ref1.lineEndingForRow(0) : void 0) || "\n";
          fileContents = fileContents.replace(/(\r\n|\n)/g, lineEnding);
          newTextEditor.buffer.setPreferredLineEnding(lineEnding);
          newTextEditor.setText(fileContents);
          newTextEditor.buffer.cachedDiskContents = fileContents;
          _this._splitDiff(editor, newTextEditor);
          _this._syncScroll(editor, newTextEditor);
          return _this._affixTabTitle(newTextEditor, revHash);
        };
      })(this), 300);
    };

    GitRevisionView._affixTabTitle = function(newTextEditor, revHash) {
      var $el, $tabTitle, titleText;
      $el = $(atom.views.getView(newTextEditor));
      $tabTitle = $el.parents('atom-pane').find('li.tab.active .title');
      titleText = $tabTitle.text();
      if (titleText.indexOf('@') >= 0) {
        titleText = titleText.replace(/\@.*/, "@" + revHash);
      } else {
        titleText += " @" + revHash;
      }
      return $tabTitle.text(titleText);
    };

    GitRevisionView._splitDiff = function(editor, newTextEditor) {
      var editors;
      editors = {
        editor1: newTextEditor,
        editor2: editor
      };
      SplitDiff.editorSubscriptions = new CompositeDisposable();
      SplitDiff.editorSubscriptions.add(editors.editor1.onDidStopChanging((function(_this) {
        return function() {
          if (editors != null) {
            return SplitDiff.updateDiff(editors);
          }
        };
      })(this)));
      SplitDiff.editorSubscriptions.add(editors.editor2.onDidStopChanging((function(_this) {
        return function() {
          if (editors != null) {
            return SplitDiff.updateDiff(editors);
          }
        };
      })(this)));
      SplitDiff.editorSubscriptions.add(editors.editor1.onDidDestroy((function(_this) {
        return function() {
          editors = null;
          return SplitDiff.disable(false);
        };
      })(this)));
      SplitDiff.editorSubscriptions.add(editors.editor2.onDidDestroy((function(_this) {
        return function() {
          editors = null;
          return SplitDiff.disable(false);
        };
      })(this)));
      SplitDiff.editorSubscriptions.add(atom.config.onDidChange('split-diff.ignoreWhitespace', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return SplitDiff.updateDiff(editors);
        };
      })(this)));
      return SplitDiff.updateDiff(editors);
    };

    GitRevisionView._syncScroll = function(editor, newTextEditor) {
      return _.delay((function(_this) {
        return function() {
          return newTextEditor.scrollToBufferPosition({
            row: _this._getInitialLineNumber(editor),
            column: 0
          });
        };
      })(this), 50);
    };

    return GitRevisionView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvbGliL2dpdC1yZXZpc2lvbi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxzRkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxPQUF5QyxPQUFBLENBQVEsTUFBUixDQUF6QyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLHVCQUFBLGVBSnRCLENBQUE7O0FBQUEsRUFLQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBTEQsQ0FBQTs7QUFBQSxFQU9BLFNBQUEsR0FBWSxPQUFBLENBQVEsWUFBUixDQVBaLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNNO2lDQUVKOztBQUFBLElBQUEsZUFBQyxDQUFBLFdBQUQsR0FBZSxnQkFBZixDQUFBOztBQUNBO0FBQUE7Ozs7Ozs7Ozs7OztPQURBOztBQUFBLElBZUEsZUFBQyxDQUFBLFlBQUQsR0FBZSxTQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLE9BQWxCLEdBQUE7QUFDYixVQUFBLGdDQUFBOztRQUQrQixVQUFRO09BQ3ZDO0FBQUEsTUFBQSxPQUFBLEdBQVUsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxPQUFYLEVBQ1I7QUFBQSxRQUFBLElBQUEsRUFBTSxLQUFOO09BRFEsQ0FBVixDQUFBO0FBQUEsTUFHQSxTQUFTLENBQUMsT0FBVixDQUFrQixLQUFsQixDQUhBLENBQUE7QUFBQSxNQUtBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FB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

//# sourceURL=/Users/victor.martins/.atom/packages/git-time-machine/lib/git-revision-view.coffee
