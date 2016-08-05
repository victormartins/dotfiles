(function() {
  var $, GitLog, GitRevisionView, GitTimeMachineView, GitTimeplot, View, moment, path, str, _, _ref;

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View;

  path = require('path');

  _ = require('underscore-plus');

  str = require('bumble-strings');

  moment = require('moment');

  GitLog = require('git-log-utils');

  GitTimeplot = require('./git-timeplot');

  GitRevisionView = require('./git-revision-view');

  module.exports = GitTimeMachineView = (function() {
    function GitTimeMachineView(serializedState, options) {
      if (options == null) {
        options = {};
      }
      if (!this.$element) {
        this.$element = $("<div class='git-time-machine'>");
      }
      if (options.editor != null) {
        this.setEditor(options.editor);
        this.render();
      }
    }

    GitTimeMachineView.prototype.setEditor = function(editor) {
      var file, _ref1;
      file = editor != null ? editor.getPath() : void 0;
      if (!((file != null) && !str.startsWith(path.basename(file), GitRevisionView.FILE_PREFIX))) {
        return;
      }
      _ref1 = [editor, file], this.editor = _ref1[0], this.file = _ref1[1];
      return this.render();
    };

    GitTimeMachineView.prototype.render = function() {
      var commits;
      commits = this.gitCommitHistory();
      if (!((this.file != null) && (commits != null))) {
        this._renderPlaceholder();
      } else {
        this.$element.text("");
        this._renderCloseHandle();
        this._renderStats(commits);
        this._renderTimeline(commits);
      }
      return this.$element;
    };

    GitTimeMachineView.prototype.serialize = function() {
      return null;
    };

    GitTimeMachineView.prototype.destroy = function() {
      return this.$element.remove();
    };

    GitTimeMachineView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.timeplot) != null ? _ref1.hide() : void 0;
    };

    GitTimeMachineView.prototype.show = function() {
      var _ref1;
      return (_ref1 = this.timeplot) != null ? _ref1.show() : void 0;
    };

    GitTimeMachineView.prototype.getElement = function() {
      return this.$element.get(0);
    };

    GitTimeMachineView.prototype.gitCommitHistory = function(file) {
      var commits, e;
      if (file == null) {
        file = this.file;
      }
      if (file == null) {
        return null;
      }
      try {
        commits = GitLog.getCommitHistory(file);
      } catch (_error) {
        e = _error;
        if (e.message != null) {
          if (e.message.match('File not a git repository') || str.weaklyHas(e.message, "is outside repository")) {
            atom.notifications.addError("Error: Not in a git repository");
            return null;
          }
        }
        atom.notifications.addError(String(e));
        return null;
      }
      return commits;
    };

    GitTimeMachineView.prototype._renderPlaceholder = function() {
      this.$element.html("<div class='placeholder'>Select a file in the git repo to see timeline</div>");
    };

    GitTimeMachineView.prototype._renderCloseHandle = function() {
      var $closeHandle;
      $closeHandle = $("<div class='close-handle'>X</div>");
      this.$element.append($closeHandle);
      return $closeHandle.on('mousedown', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        return atom.commands.dispatch(atom.views.getView(atom.workspace), "git-time-machine:toggle");
      });
    };

    GitTimeMachineView.prototype._renderTimeline = function(commits) {
      this.timeplot || (this.timeplot = new GitTimeplot(this.$element));
      this.timeplot.render(this.editor, commits);
    };

    GitTimeMachineView.prototype._renderStats = function(commits) {
      var authorCount, byAuthor, content, durationInMs, timeSpan;
      content = "";
      if (commits.length > 0) {
        byAuthor = _.indexBy(commits, 'authorName');
        authorCount = _.keys(byAuthor).length;
        durationInMs = moment.unix(commits[commits.length - 1].authorDate).diff(moment.unix(commits[0].authorDate));
        timeSpan = moment.duration(durationInMs).humanize();
        content = "<span class='total-commits'>" + commits.length + "</span> commits by " + authorCount + " authors spanning " + timeSpan;
      }
      this.$element.append("<div class='stats'>\n  " + content + "\n</div>");
    };

    return GitTimeMachineView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvbGliL2dpdC10aW1lLW1hY2hpbmUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkZBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGdCQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUpULENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVIsQ0FOVCxDQUFBOztBQUFBLEVBT0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQVBkLENBQUE7O0FBQUEsRUFRQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQVJsQixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsNEJBQUMsZUFBRCxFQUFrQixPQUFsQixHQUFBOztRQUFrQixVQUFRO09BQ3JDO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBd0QsQ0FBQSxRQUF4RDtBQUFBLFFBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFBLENBQUUsZ0NBQUYsQ0FBWixDQUFBO09BQUE7QUFDQSxNQUFBLElBQUcsc0JBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsT0FBTyxDQUFDLE1BQW5CLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLE1B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

//# sourceURL=/Users/victor.martins/.atom/packages/git-time-machine/lib/git-time-machine-view.coffee
