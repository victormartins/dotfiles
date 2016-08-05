(function() {
  var CompositeDisposable, DiffViewEditor, Directory, File, LoadingView, SplitDiff, SyncScroll, configSchema, path, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Directory = _ref.Directory, File = _ref.File;

  DiffViewEditor = require('./build-lines');

  LoadingView = require('./loading-view');

  SyncScroll = require('./sync-scroll');

  configSchema = require("./config-schema");

  path = require('path');

  module.exports = SplitDiff = {
    config: configSchema,
    subscriptions: null,
    diffViewEditor1: null,
    diffViewEditor2: null,
    editorSubscriptions: null,
    isWhitespaceIgnored: false,
    isWordDiffEnabled: true,
    linkedDiffChunks: null,
    diffChunkPointer: 0,
    isFirstChunkSelect: true,
    wasEditor1SoftWrapped: false,
    wasEditor2SoftWrapped: false,
    isEnabled: false,
    wasEditor1Created: false,
    wasEditor2Created: false,
    hasGitRepo: false,
    process: null,
    loadingView: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable();
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'split-diff:enable': (function(_this) {
          return function() {
            return _this.diffPanes();
          };
        })(this),
        'split-diff:next-diff': (function(_this) {
          return function() {
            return _this.nextDiff();
          };
        })(this),
        'split-diff:prev-diff': (function(_this) {
          return function() {
            return _this.prevDiff();
          };
        })(this),
        'split-diff:copy-to-right': (function(_this) {
          return function() {
            return _this.copyChunkToRight();
          };
        })(this),
        'split-diff:copy-to-left': (function(_this) {
          return function() {
            return _this.copyChunkToLeft();
          };
        })(this),
        'split-diff:disable': (function(_this) {
          return function() {
            return _this.disable();
          };
        })(this),
        'split-diff:ignore-whitespace': (function(_this) {
          return function() {
            return _this.toggleIgnoreWhitespace();
          };
        })(this),
        'split-diff:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.disable(false);
      return this.subscriptions.dispose();
    },
    toggle: function() {
      if (this.isEnabled) {
        return this.disable(true);
      } else {
        return this.diffPanes();
      }
    },
    disable: function(displayMsg) {
      this.isEnabled = false;
      if (this.editorSubscriptions != null) {
        this.editorSubscriptions.dispose();
        this.editorSubscriptions = null;
      }
      if (this.diffViewEditor1 != null) {
        if (this.wasEditor1SoftWrapped) {
          this.diffViewEditor1.enableSoftWrap();
        }
        if (this.wasEditor1Created) {
          this.diffViewEditor1.cleanUp();
        }
      }
      if (this.diffViewEditor2 != null) {
        if (this.wasEditor2SoftWrapped) {
          this.diffViewEditor2.enableSoftWrap();
        }
        if (this.wasEditor2Created) {
          this.diffViewEditor2.cleanUp();
        }
      }
      this._clearDiff();
      this.diffChunkPointer = 0;
      this.isFirstChunkSelect = true;
      this.wasEditor1SoftWrapped = false;
      this.wasEditor1Created = false;
      this.wasEditor2SoftWrapped = false;
      this.wasEditor2Created = false;
      this.hasGitRepo = false;
      if (displayMsg) {
        return atom.notifications.addInfo('Split Diff Disabled', {
          dismissable: false
        });
      }
    },
    toggleIgnoreWhitespace: function() {
      this._setConfig('ignoreWhitespace', !this.isWhitespaceIgnored);
      return this.isWhitespaceIgnored = this._getConfig('ignoreWhitespace');
    },
    nextDiff: function() {
      if (!this.isFirstChunkSelect) {
        this.diffChunkPointer++;
        if (this.diffChunkPointer >= this.linkedDiffChunks.length) {
          this.diffChunkPointer = 0;
        }
      } else {
        this.isFirstChunkSelect = false;
      }
      return this._selectDiffs(this.linkedDiffChunks[this.diffChunkPointer]);
    },
    prevDiff: function() {
      if (!this.isFirstChunkSelect) {
        this.diffChunkPointer--;
        if (this.diffChunkPointer < 0) {
          this.diffChunkPointer = this.linkedDiffChunks.length - 1;
        }
      } else {
        this.isFirstChunkSelect = false;
      }
      return this._selectDiffs(this.linkedDiffChunks[this.diffChunkPointer]);
    },
    copyChunkToRight: function() {
      var diffChunk, lineRange, linesToMove, moveText, offset, _i, _len, _results;
      linesToMove = this.diffViewEditor1.getCursorDiffLines();
      offset = 0;
      _results = [];
      for (_i = 0, _len = linesToMove.length; _i < _len; _i++) {
        lineRange = linesToMove[_i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = this.linkedDiffChunks;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            diffChunk = _ref1[_j];
            if (lineRange.start.row === diffChunk.oldLineStart) {
              moveText = this.diffViewEditor1.getEditor().getTextInBufferRange([[diffChunk.oldLineStart, 0], [diffChunk.oldLineEnd, 0]]);
              this.diffViewEditor2.getEditor().setTextInBufferRange([[diffChunk.newLineStart + offset, 0], [diffChunk.newLineEnd + offset, 0]], moveText);
              _results1.push(offset += (diffChunk.oldLineEnd - diffChunk.oldLineStart) - (diffChunk.newLineEnd - diffChunk.newLineStart));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    },
    copyChunkToLeft: function() {
      var diffChunk, lineRange, linesToMove, moveText, offset, _i, _len, _results;
      linesToMove = this.diffViewEditor2.getCursorDiffLines();
      offset = 0;
      _results = [];
      for (_i = 0, _len = linesToMove.length; _i < _len; _i++) {
        lineRange = linesToMove[_i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = this.linkedDiffChunks;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            diffChunk = _ref1[_j];
            if (lineRange.start.row === diffChunk.newLineStart) {
              moveText = this.diffViewEditor2.getEditor().getTextInBufferRange([[diffChunk.newLineStart, 0], [diffChunk.newLineEnd, 0]]);
              this.diffViewEditor1.getEditor().setTextInBufferRange([[diffChunk.oldLineStart + offset, 0], [diffChunk.oldLineEnd + offset, 0]], moveText);
              _results1.push(offset += (diffChunk.newLineEnd - diffChunk.newLineStart) - (diffChunk.oldLineEnd - diffChunk.oldLineStart));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    },
    diffPanes: function() {
      var detailMsg, editors;
      this.disable(false);
      editors = this._getVisibleEditors();
      this.editorSubscriptions = new CompositeDisposable();
      this.editorSubscriptions.add(editors.editor1.onDidStopChanging((function(_this) {
        return function() {
          return _this.updateDiff(editors);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor2.onDidStopChanging((function(_this) {
        return function() {
          return _this.updateDiff(editors);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor1.onDidDestroy((function(_this) {
        return function() {
          return _this.disable(true);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor2.onDidDestroy((function(_this) {
        return function() {
          return _this.disable(true);
        };
      })(this)));
      this.editorSubscriptions.add(atom.config.onDidChange('split-diff', (function(_this) {
        return function() {
          return _this.updateDiff(editors);
        };
      })(this)));
      if (!this.hasGitRepo) {
        this.updateDiff(editors);
      }
      this.editorSubscriptions.add(atom.menu.add([
        {
          'label': 'Packages',
          'submenu': [
            {
              'label': 'Split Diff',
              'submenu': [
                {
                  'label': 'Ignore Whitespace',
                  'command': 'split-diff:ignore-whitespace'
                }, {
                  'label': 'Move to Next Diff',
                  'command': 'split-diff:next-diff'
                }, {
                  'label': 'Move to Previous Diff',
                  'command': 'split-diff:prev-diff'
                }, {
                  'label': 'Copy to Right',
                  'command': 'split-diff:copy-to-right'
                }, {
                  'label': 'Copy to Left',
                  'command': 'split-diff:copy-to-left'
                }
              ]
            }
          ]
        }
      ]));
      this.editorSubscriptions.add(atom.contextMenu.add({
        'atom-text-editor': [
          {
            'label': 'Split Diff',
            'submenu': [
              {
                'label': 'Ignore Whitespace',
                'command': 'split-diff:ignore-whitespace'
              }, {
                'label': 'Move to Next Diff',
                'command': 'split-diff:next-diff'
              }, {
                'label': 'Move to Previous Diff',
                'command': 'split-diff:prev-diff'
              }, {
                'label': 'Copy to Right',
                'command': 'split-diff:copy-to-right'
              }, {
                'label': 'Copy to Left',
                'command': 'split-diff:copy-to-left'
              }
            ]
          }
        ]
      }));
      detailMsg = 'Ignore Whitespace: ' + this.isWhitespaceIgnored;
      detailMsg += '\nShow Word Diff: ' + this.isWordDiffEnabled;
      detailMsg += '\nSync Horizontal Scroll: ' + this._getConfig('syncHorizontalScroll');
      return atom.notifications.addInfo('Split Diff Enabled', {
        detail: detailMsg,
        dismissable: false
      });
    },
    updateDiff: function(editors) {
      var BufferedNodeProcess, args, command, computedDiff, editorPaths, exit, stderr, stdout, theOutput;
      this.isEnabled = true;
      if (this.process != null) {
        this.process.kill();
        this.process = null;
      }
      this.isWhitespaceIgnored = this._getConfig('ignoreWhitespace');
      editorPaths = this._createTempFiles(editors);
      if (this.loadingView == null) {
        this.loadingView = new LoadingView();
        this.loadingView.createModal();
      }
      this.loadingView.show();
      BufferedNodeProcess = require('atom').BufferedNodeProcess;
      command = path.resolve(__dirname, "./compute-diff.js");
      args = [editorPaths.editor1Path, editorPaths.editor2Path, this.isWhitespaceIgnored];
      computedDiff = '';
      theOutput = '';
      stdout = (function(_this) {
        return function(output) {
          theOutput = output;
          return computedDiff = JSON.parse(output);
        };
      })(this);
      stderr = (function(_this) {
        return function(err) {
          return theOutput = err;
        };
      })(this);
      exit = (function(_this) {
        return function(code) {
          _this.loadingView.hide();
          if (code === 0) {
            return _this._resumeUpdateDiff(editors, computedDiff);
          } else {
            console.log('BufferedNodeProcess code was ' + code);
            return console.log(theOutput);
          }
        };
      })(this);
      return this.process = new BufferedNodeProcess({
        command: command,
        args: args,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    },
    _resumeUpdateDiff: function(editors, computedDiff) {
      var syncHorizontalScroll;
      this.linkedDiffChunks = this._evaluateDiffOrder(computedDiff.chunks);
      this._clearDiff();
      this._displayDiff(editors, computedDiff);
      this.isWordDiffEnabled = this._getConfig('diffWords');
      if (this.isWordDiffEnabled) {
        this._highlightWordDiff(this.linkedDiffChunks);
      }
      syncHorizontalScroll = this._getConfig('syncHorizontalScroll');
      this.syncScroll = new SyncScroll(editors.editor1, editors.editor2, syncHorizontalScroll);
      return this.syncScroll.syncPositions();
    },
    _getVisibleEditors: function() {
      var activeItem, editor1, editor2, editors, leftPane, p, panes, rightPane, _i, _len;
      editor1 = null;
      editor2 = null;
      panes = atom.workspace.getPanes();
      for (_i = 0, _len = panes.length; _i < _len; _i++) {
        p = panes[_i];
        activeItem = p.getActiveItem();
        if (atom.workspace.isTextEditor(activeItem)) {
          if (editor1 === null) {
            editor1 = activeItem;
          } else if (editor2 === null) {
            editor2 = activeItem;
            break;
          }
        }
      }
      if (editor1 === null) {
        editor1 = atom.workspace.buildTextEditor();
        this.wasEditor1Created = true;
        leftPane = atom.workspace.getActivePane();
        leftPane.addItem(editor1);
      }
      if (editor2 === null) {
        editor2 = atom.workspace.buildTextEditor();
        this.wasEditor2Created = true;
        editor2.setGrammar(editor1.getGrammar());
        rightPane = atom.workspace.getActivePane().splitRight();
        rightPane.addItem(editor2);
      }
      this._setupGitRepo(editor1, editor2);
      editor1.unfoldAll();
      editor2.unfoldAll();
      if (editor1.isSoftWrapped()) {
        this.wasEditor1SoftWrapped = true;
        editor1.setSoftWrapped(false);
      }
      if (editor2.isSoftWrapped()) {
        this.wasEditor2SoftWrapped = true;
        editor2.setSoftWrapped(false);
      }
      if (this.wasEditor2Created) {
        atom.views.getView(editor1).focus();
      }
      editors = {
        editor1: editor1,
        editor2: editor2
      };
      return editors;
    },
    _setupGitRepo: function(editor1, editor2) {
      var directory, editor1Path, gitHeadText, i, projectRepo, relativeEditor1Path, _i, _len, _ref1, _results;
      editor1Path = editor1.getPath();
      if ((editor1Path != null) && (editor2.getLineCount() === 1 && editor2.lineTextForBufferRow(0) === '')) {
        _ref1 = atom.project.getDirectories();
        _results = [];
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          directory = _ref1[i];
          if (editor1Path === directory.getPath() || directory.contains(editor1Path)) {
            projectRepo = atom.project.getRepositories()[i];
            if ((projectRepo != null) && (projectRepo.repo != null)) {
              relativeEditor1Path = projectRepo.relativize(editor1Path);
              gitHeadText = projectRepo.repo.getHeadBlob(relativeEditor1Path);
              if (gitHeadText != null) {
                editor2.setText(gitHeadText);
                this.hasGitRepo = true;
                break;
              } else {
                _results.push(void 0);
              }
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    _createTempFiles: function(editors) {
      var editor1Path, editor1TempFile, editor2Path, editor2TempFile, editorPaths, tempFolderPath;
      editor1Path = '';
      editor2Path = '';
      tempFolderPath = atom.getConfigDirPath() + '/split-diff';
      editor1Path = tempFolderPath + '/split-diff 1';
      editor1TempFile = new File(editor1Path);
      editor1TempFile.writeSync(editors.editor1.getText());
      editor2Path = tempFolderPath + '/split-diff 2';
      editor2TempFile = new File(editor2Path);
      editor2TempFile.writeSync(editors.editor2.getText());
      editorPaths = {
        editor1Path: editor1Path,
        editor2Path: editor2Path
      };
      return editorPaths;
    },
    _selectDiffs: function(diffChunk) {
      if ((diffChunk != null) && (this.diffViewEditor1 != null) && (this.diffViewEditor2 != null)) {
        this.diffViewEditor1.deselectAllLines();
        this.diffViewEditor2.deselectAllLines();
        if (diffChunk.oldLineStart != null) {
          this.diffViewEditor1.selectLines(diffChunk.oldLineStart, diffChunk.oldLineEnd);
          this.diffViewEditor2.getEditor().scrollToBufferPosition([diffChunk.oldLineStart, 0]);
        }
        if (diffChunk.newLineStart != null) {
          this.diffViewEditor2.selectLines(diffChunk.newLineStart, diffChunk.newLineEnd);
          return this.diffViewEditor2.getEditor().scrollToBufferPosition([diffChunk.newLineStart, 0]);
        }
      }
    },
    _clearDiff: function() {
      if (this.loadingView != null) {
        this.loadingView.hide();
      }
      if (this.diffViewEditor1 != null) {
        this.diffViewEditor1.destroyMarkers();
        this.diffViewEditor1 = null;
      }
      if (this.diffViewEditor2 != null) {
        this.diffViewEditor2.destroyMarkers();
        this.diffViewEditor2 = null;
      }
      if (this.syncScroll != null) {
        this.syncScroll.dispose();
        return this.syncScroll = null;
      }
    },
    _displayDiff: function(editors, computedDiff) {
      var leftColor, rightColor;
      this.diffViewEditor1 = new DiffViewEditor(editors.editor1);
      this.diffViewEditor2 = new DiffViewEditor(editors.editor2);
      leftColor = this._getConfig('leftEditorColor');
      rightColor = this._getConfig('rightEditorColor');
      if (leftColor === 'green') {
        this.diffViewEditor1.setLineHighlights(computedDiff.removedLines, 'added');
      } else {
        this.diffViewEditor1.setLineHighlights(computedDiff.removedLines, 'removed');
      }
      if (rightColor === 'green') {
        this.diffViewEditor2.setLineHighlights(computedDiff.addedLines, 'added');
      } else {
        this.diffViewEditor2.setLineHighlights(computedDiff.addedLines, 'removed');
      }
      this.diffViewEditor1.setLineOffsets(computedDiff.oldLineOffsets);
      return this.diffViewEditor2.setLineOffsets(computedDiff.newLineOffsets);
    },
    _evaluateDiffOrder: function(chunks) {
      var c, diffChunk, diffChunks, newLineNumber, oldLineNumber, prevChunk, _i, _len;
      oldLineNumber = 0;
      newLineNumber = 0;
      prevChunk = null;
      diffChunks = [];
      for (_i = 0, _len = chunks.length; _i < _len; _i++) {
        c = chunks[_i];
        if (c.added != null) {
          if ((prevChunk != null) && (prevChunk.removed != null)) {
            diffChunk = {
              newLineStart: newLineNumber,
              newLineEnd: newLineNumber + c.count,
              oldLineStart: oldLineNumber - prevChunk.count,
              oldLineEnd: oldLineNumber
            };
            diffChunks.push(diffChunk);
            prevChunk = null;
          } else {
            prevChunk = c;
          }
          newLineNumber += c.count;
        } else if (c.removed != null) {
          if ((prevChunk != null) && (prevChunk.added != null)) {
            diffChunk = {
              newLineStart: newLineNumber - prevChunk.count,
              newLineEnd: newLineNumber,
              oldLineStart: oldLineNumber,
              oldLineEnd: oldLineNumber + c.count
            };
            diffChunks.push(diffChunk);
            prevChunk = null;
          } else {
            prevChunk = c;
          }
          oldLineNumber += c.count;
        } else {
          if ((prevChunk != null) && (prevChunk.added != null)) {
            diffChunk = {
              newLineStart: newLineNumber - prevChunk.count,
              newLineEnd: newLineNumber,
              oldLineStart: oldLineNumber,
              oldLineEnd: oldLineNumber
            };
            diffChunks.push(diffChunk);
          } else if ((prevChunk != null) && (prevChunk.removed != null)) {
            diffChunk = {
              newLineStart: newLineNumber,
              newLineEnd: newLineNumber,
              oldLineStart: oldLineNumber - prevChunk.count,
              oldLineEnd: oldLineNumber
            };
            diffChunks.push(diffChunk);
          }
          prevChunk = null;
          oldLineNumber += c.count;
          newLineNumber += c.count;
        }
      }
      if ((prevChunk != null) && (prevChunk.added != null)) {
        diffChunk = {
          newLineStart: newLineNumber - prevChunk.count,
          newLineEnd: newLineNumber
        };
        diffChunks.push(diffChunk);
      } else if ((prevChunk != null) && (prevChunk.removed != null)) {
        diffChunk = {
          oldLineStart: oldLineNumber - prevChunk.count,
          oldLineEnd: oldLineNumber
        };
        diffChunks.push(diffChunk);
      }
      return diffChunks;
    },
    _highlightWordDiff: function(chunks) {
      var ComputeWordDiff, c, excessLines, i, j, leftColor, lineRange, rightColor, wordDiff, _i, _j, _len, _results;
      ComputeWordDiff = require('./compute-word-diff');
      leftColor = this._getConfig('leftEditorColor');
      rightColor = this._getConfig('rightEditorColor');
      _results = [];
      for (_i = 0, _len = chunks.length; _i < _len; _i++) {
        c = chunks[_i];
        if ((c.newLineStart != null) && (c.oldLineStart != null)) {
          lineRange = 0;
          excessLines = 0;
          if ((c.newLineEnd - c.newLineStart) < (c.oldLineEnd - c.oldLineStart)) {
            lineRange = c.newLineEnd - c.newLineStart;
            excessLines = (c.oldLineEnd - c.oldLineStart) - lineRange;
          } else {
            lineRange = c.oldLineEnd - c.oldLineStart;
            excessLines = (c.newLineEnd - c.newLineStart) - lineRange;
          }
          for (i = _j = 0; _j < lineRange; i = _j += 1) {
            wordDiff = ComputeWordDiff.computeWordDiff(this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + i), this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + i), this.isWhitespaceIgnored);
            if (leftColor === 'green') {
              this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, wordDiff.removedWords, 'added', this.isWhitespaceIgnored);
            } else {
              this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, wordDiff.removedWords, 'removed', this.isWhitespaceIgnored);
            }
            if (rightColor === 'green') {
              this.diffViewEditor2.setWordHighlights(c.newLineStart + i, wordDiff.addedWords, 'added', this.isWhitespaceIgnored);
            } else {
              this.diffViewEditor2.setWordHighlights(c.newLineStart + i, wordDiff.addedWords, 'removed', this.isWhitespaceIgnored);
            }
          }
          _results.push((function() {
            var _k, _results1;
            _results1 = [];
            for (j = _k = 0; _k < excessLines; j = _k += 1) {
              if ((c.newLineEnd - c.newLineStart) < (c.oldLineEnd - c.oldLineStart)) {
                if (leftColor === 'green') {
                  _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + lineRange + j)
                    }
                  ], 'added', this.isWhitespaceIgnored));
                } else {
                  _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + lineRange + j)
                    }
                  ], 'removed', this.isWhitespaceIgnored));
                }
              } else if ((c.newLineEnd - c.newLineStart) > (c.oldLineEnd - c.oldLineStart)) {
                if (rightColor === 'green') {
                  _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + lineRange + j)
                    }
                  ], 'added', this.isWhitespaceIgnored));
                } else {
                  _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + lineRange + j, [
                    {
                      changed: true,
                      value: this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + lineRange + j)
                    }
                  ], 'removed', this.isWhitespaceIgnored));
                }
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }).call(this));
        } else if (c.newLineStart != null) {
          lineRange = c.newLineEnd - c.newLineStart;
          _results.push((function() {
            var _k, _results1;
            _results1 = [];
            for (i = _k = 0; _k < lineRange; i = _k += 1) {
              if (rightColor === 'green') {
                _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + i)
                  }
                ], 'added', this.isWhitespaceIgnored));
              } else {
                _results1.push(this.diffViewEditor2.setWordHighlights(c.newLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor2.getEditor().lineTextForBufferRow(c.newLineStart + i)
                  }
                ], 'removed', this.isWhitespaceIgnored));
              }
            }
            return _results1;
          }).call(this));
        } else if (c.oldLineStart != null) {
          lineRange = c.oldLineEnd - c.oldLineStart;
          _results.push((function() {
            var _k, _results1;
            _results1 = [];
            for (i = _k = 0; _k < lineRange; i = _k += 1) {
              if (leftColor === 'green') {
                _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + i)
                  }
                ], 'added', this.isWhitespaceIgnored));
              } else {
                _results1.push(this.diffViewEditor1.setWordHighlights(c.oldLineStart + i, [
                  {
                    changed: true,
                    value: this.diffViewEditor1.getEditor().lineTextForBufferRow(c.oldLineStart + i)
                  }
                ], 'removed', this.isWhitespaceIgnored));
              }
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    _getConfig: function(config) {
      return atom.config.get("split-diff." + config);
    },
    _setConfig: function(config, value) {
      return atom.config.set("split-diff." + config, value);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvbm9kZV9tb2R1bGVzL3NwbGl0LWRpZmYvbGliL3NwbGl0LWRpZmYuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtIQUFBOztBQUFBLEVBQUEsT0FBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixpQkFBQSxTQUF0QixFQUFpQyxZQUFBLElBQWpDLENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxlQUFSLENBRGpCLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUhiLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBSmYsQ0FBQTs7QUFBQSxFQUtBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUxQLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQ2Y7QUFBQSxJQUFBLE1BQUEsRUFBUSxZQUFSO0FBQUEsSUFDQSxhQUFBLEVBQWUsSUFEZjtBQUFBLElBRUEsZUFBQSxFQUFpQixJQUZqQjtBQUFBLElBR0EsZUFBQSxFQUFpQixJQUhqQjtBQUFBLElBSUEsbUJBQUEsRUFBcUIsSUFKckI7QUFBQSxJQUtBLG1CQUFBLEVBQXFCLEtBTHJCO0FBQUEsSUFNQSxpQkFBQSxFQUFtQixJQU5uQjtBQUFBLElBT0EsZ0JBQUEsRUFBa0IsSUFQbEI7QUFBQSxJQVFBLGdCQUFBLEVBQWtCLENBUmxCO0FBQUEsSUFTQSxrQkFBQSxFQUFvQixJQVRwQjtBQUFBLElBVUEscUJBQUEsRUFBdUIsS0FWdkI7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

//# sourceURL=/Users/victor.martins/.atom/packages/git-time-machine/node_modules/split-diff/lib/split-diff.coffee
