(function() {
  var $, CompositeDisposable, DiffViewEditor, Emitter, SplitDiff, SyncScroll, TextBuffer, TextEditor, configSchema, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter, TextEditor = _ref.TextEditor, TextBuffer = _ref.TextBuffer;

  $ = require('space-pen').$;

  DiffViewEditor = require('./build-lines');

  SyncScroll = require('./sync-scroll');

  configSchema = require("./config-schema");

  module.exports = SplitDiff = {
    config: configSchema,
    subscriptions: null,
    diffViewEditor1: null,
    diffViewEditor2: null,
    editorSubscriptions: null,
    isWhitespaceIgnored: false,
    linkedDiffChunks: null,
    diffChunkPointer: 0,
    isFirstChunkSelect: true,
    wasEditor1SoftWrapped: false,
    wasEditor2SoftWrapped: false,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable();
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'split-diff:diffPanes': (function(_this) {
          return function() {
            return _this.diffPanes();
          };
        })(this),
        'split-diff:nextDiff': (function(_this) {
          return function() {
            return _this.nextDiff();
          };
        })(this),
        'split-diff:prevDiff': (function(_this) {
          return function() {
            return _this.prevDiff();
          };
        })(this),
        'split-diff:disable': (function(_this) {
          return function() {
            return _this.disable();
          };
        })(this),
        'split-diff:toggleIgnoreWhitespace': (function(_this) {
          return function() {
            return _this.toggleIgnoreWhitespace();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.disable();
      return this.subscriptions.dispose();
    },
    serialize: function() {
      return this.disable();
    },
    getVisibleEditors: function() {
      var editor1, editor2, editors, leftPane, rightPane;
      editor1 = null;
      editor2 = null;
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var $editorView, editorView;
          editorView = atom.views.getView(editor);
          $editorView = $(editorView);
          if ($editorView.is(':visible')) {
            if (editor1 === null) {
              return editor1 = editor;
            } else if (editor2 === null) {
              return editor2 = editor;
            }
          }
        };
      })(this));
      if (editor1 === null) {
        editor1 = new TextEditor();
        leftPane = atom.workspace.getActivePane();
        leftPane.addItem(editor1);
      }
      if (editor2 === null) {
        editor2 = new TextEditor();
        rightPane = atom.workspace.getActivePane().splitRight();
        rightPane.addItem(editor2);
      }
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
      editors = {
        editor1: editor1,
        editor2: editor2
      };
      return editors;
    },
    diffPanes: function() {
      var detailMsg, editors;
      this.disable(false);
      editors = this.getVisibleEditors();
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
      this.editorSubscriptions.add(atom.config.onDidChange('split-diff.ignoreWhitespace', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.updateDiff(editors);
        };
      })(this)));
      this.updateDiff(editors);
      detailMsg = 'Ignore whitespace: ' + this.isWhitespaceIgnored;
      return atom.notifications.addInfo('Split Diff Enabled', {
        detail: detailMsg
      });
    },
    updateDiff: function(editors) {
      var SplitDiffCompute, computedDiff;
      this.clearDiff();
      this.isWhitespaceIgnored = this.getConfig('ignoreWhitespace');
      SplitDiffCompute = require('./split-diff-compute');
      computedDiff = SplitDiffCompute.computeDiff(editors.editor1.getText(), editors.editor2.getText(), this.isWhitespaceIgnored);
      this.linkedDiffChunks = this.evaluateDiffOrder(computedDiff.chunks);
      this.displayDiff(editors, computedDiff);
      this.syncScroll = new SyncScroll(editors.editor1, editors.editor2);
      return this.syncScroll.syncPositions();
    },
    disable: function(displayMsg) {
      if (this.wasEditor1SoftWrapped) {
        this.diffViewEditor1.enableSoftWrap();
        this.wasEditor1SoftWrapped = false;
      }
      if (this.wasEditor2SoftWrapped) {
        this.diffViewEditor2.enableSoftWrap();
        this.wasEditor2SoftWrapped = false;
      }
      this.clearDiff();
      if (this.editorSubscriptions) {
        this.editorSubscriptions.dispose();
        this.editorSubscriptions = null;
      }
      if (displayMsg) {
        return atom.notifications.addInfo('Split Diff Disabled');
      }
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
      return this.selectDiffs(this.linkedDiffChunks[this.diffChunkPointer]);
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
      return this.selectDiffs(this.linkedDiffChunks[this.diffChunkPointer]);
    },
    selectDiffs: function(diffChunk) {
      if (this.diffViewEditor1 && this.diffViewEditor2) {
        this.diffViewEditor1.deselectAllLines();
        this.diffViewEditor2.deselectAllLines();
        if (diffChunk.oldLineStart) {
          this.diffViewEditor1.selectLines(diffChunk.oldLineStart, diffChunk.oldLineEnd);
          this.diffViewEditor2.scrollToLine(diffChunk.oldLineStart);
        }
        if (diffChunk.newLineStart) {
          this.diffViewEditor2.selectLines(diffChunk.newLineStart, diffChunk.newLineEnd);
          return this.diffViewEditor2.scrollToLine(diffChunk.newLineStart);
        }
      }
    },
    clearDiff: function() {
      var diffChunkPointer, isFirstChunkSelect;
      diffChunkPointer = 0;
      isFirstChunkSelect = true;
      if (this.diffViewEditor1) {
        this.diffViewEditor1.removeLineOffsets();
        this.diffViewEditor1.removeLineHighlights();
        this.diffViewEditor1.destroyMarkers();
        this.diffViewEditor1 = null;
      }
      if (this.diffViewEditor2) {
        this.diffViewEditor2.removeLineOffsets();
        this.diffViewEditor2.removeLineHighlights();
        this.diffViewEditor2.destroyMarkers();
        this.diffViewEditor2 = null;
      }
      if (this.syncScroll) {
        this.syncScroll.dispose();
        return this.syncScroll = null;
      }
    },
    displayDiff: function(editors, computedDiff) {
      this.diffViewEditor1 = new DiffViewEditor(editors.editor1);
      this.diffViewEditor2 = new DiffViewEditor(editors.editor2);
      this.diffViewEditor1.setLineOffsets(computedDiff.oldLineOffsets);
      this.diffViewEditor2.setLineOffsets(computedDiff.newLineOffsets);
      this.diffViewEditor1.setLineHighlights(void 0, computedDiff.removedLines);
      return this.diffViewEditor2.setLineHighlights(computedDiff.addedLines, void 0);
    },
    evaluateDiffOrder: function(chunks) {
      var c, diffChunk, diffChunks, newLineNumber, oldLineNumber, prevChunk, _i, _len;
      oldLineNumber = 0;
      newLineNumber = 0;
      prevChunk = null;
      diffChunks = [];
      for (_i = 0, _len = chunks.length; _i < _len; _i++) {
        c = chunks[_i];
        if (c.added) {
          if (prevChunk && prevChunk.removed) {
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
        } else if (c.removed) {
          if (prevChunk && prevChunk.added) {
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
          if (prevChunk && prevChunk.added) {
            diffChunk = {
              newLineStart: newLineNumber - prevChunk.count,
              newLineEnd: newLineNumber
            };
            diffChunks.push(diffChunk);
          } else if (prevChunk && prevChunk.removed) {
            diffChunk = {
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
      return diffChunks;
    },
    toggleIgnoreWhitespace: function() {
      this.setConfig('ignoreWhitespace', !this.isWhitespaceIgnored);
      this.isWhiteSpaceIgnored = this.getConfig('ignoreWhitespace');
      return this.diffPanes();
    },
    getConfig: function(config) {
      return atom.config.get("split-diff." + config);
    },
    setConfig: function(config, value) {
      return atom.config.set("split-diff." + config, value);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvbm9kZV9tb2R1bGVzL3NwbGl0LWRpZmYvbGliL3NwbGl0LWRpZmYuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtIQUFBOztBQUFBLEVBQUEsT0FBeUQsT0FBQSxDQUFRLE1BQVIsQ0FBekQsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixlQUFBLE9BQXRCLEVBQStCLGtCQUFBLFVBQS9CLEVBQTJDLGtCQUFBLFVBQTNDLENBQUE7O0FBQUEsRUFDQyxJQUFLLE9BQUEsQ0FBUSxXQUFSLEVBQUwsQ0FERCxDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsZUFBUixDQUZqQixDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FKZixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQSxHQUNmO0FBQUEsSUFBQSxNQUFBLEVBQVEsWUFBUjtBQUFBLElBQ0EsYUFBQSxFQUFlLElBRGY7QUFBQSxJQUVBLGVBQUEsRUFBaUIsSUFGakI7QUFBQSxJQUdBLGVBQUEsRUFBaUIsSUFIakI7QUFBQSxJQUlBLG1CQUFBLEVBQXFCLElBSnJCO0FBQUEsSUFLQSxtQkFBQSxFQUFxQixLQUxyQjtBQUFBLElBTUEsZ0JBQUEsRUFBa0IsSUFObEI7QUFBQSxJQU9BLGdCQUFBLEVBQWtCLENBUGxCO0FBQUEsSUFRQSxrQkFBQSxFQUFvQixJQVJwQjtBQUFBLElBU0EscUJBQUEsRUFBdUIsS0FUdkI7QUFBQSxJQVVBLHFCQUFBLEVBQXVCLEtBVnZCO0FBQUEsSUFZQSxRQUFBLEVBQVUsU0FBQyxLQUFE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

//# sourceURL=/Users/victor.martins/.atom/packages/git-time-machine/node_modules/split-diff/lib/split-diff.coffee
