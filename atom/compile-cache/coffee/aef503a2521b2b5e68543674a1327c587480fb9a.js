(function() {
  var CompositeDisposable, Snippets, Yard;

  CompositeDisposable = require('atom').CompositeDisposable;

  Snippets = require(atom.packages.resolvePackagePath('snippets') + '/lib/snippets.js');

  module.exports = Yard = {
    activate: function(state) {
      return atom.commands.add('atom-workspace', "yard:create", (function(_this) {
        return function() {
          return _this.create();
        };
      })(this));
    },
    create: function() {
      var cursor, editor;
      editor = atom.workspace.getActivePaneItem();
      cursor = editor.getLastCursor();
      return editor.transact((function(_this) {
        return function() {
          var params, prevDefRow, snippet_string;
          prevDefRow = _this.findStartRow(editor, cursor);
          params = _this.parseMethodLine(editor.lineTextForBufferRow(prevDefRow));
          snippet_string = _this.buildSnippetString(params);
          return _this.insertSnippet(editor, cursor, prevDefRow, snippet_string);
        };
      })(this));
    },
    findStartRow: function(editor, cursor) {
      var row;
      row = cursor.getBufferRow();
      while (editor.buffer.lines[row].indexOf('def ') === -1) {
        if (row === 0) {
          break;
        }
        row -= 1;
      }
      return row;
    },
    insertSnippet: function(editor, cursor, prevDefRow, snippet_string) {
      var indentation;
      cursor.setBufferPosition([prevDefRow, 0]);
      editor.moveToFirstCharacterOfLine();
      indentation = cursor.getIndentLevel();
      editor.insertNewlineAbove();
      editor.setIndentationForBufferRow(cursor.getBufferRow(), indentation);
      return Snippets.insert(snippet_string);
    },
    buildSnippetString: function(params) {
      var i, index, len, param, snippet_string;
      snippet_string = "# ${1:Description of method}\n#\n";
      index = 2;
      for (i = 0, len = params.length; i < len; i++) {
        param = params[i];
        snippet_string += "# @param [${" + index + ":Type}] " + param + " ${" + (index + 1) + ":describe " + param + "}\n";
        index += 2;
      }
      snippet_string += "# @return [${" + index + ":Type}] ${" + (index + 1) + ":description of returned object}";
      return snippet_string;
    },
    parseMethodLine: function(methodLine) {
      var closed_bracket, opened_bracket, params_string;
      opened_bracket = methodLine.indexOf("(");
      closed_bracket = methodLine.indexOf(")");
      if (opened_bracket === -1 && closed_bracket === -1) {
        return [];
      }
      params_string = methodLine.substring(opened_bracket + 1, closed_bracket);
      return params_string.split(',').map(function(m) {
        return m.trim();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3lhcmQvbGliL3lhcmQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLFFBQUEsR0FBVyxPQUFBLENBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFpQyxVQUFqQyxDQUFBLEdBQStDLGtCQUF2RDs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFBLEdBQ2Y7SUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFEO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxhQUFwQyxFQUFtRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuRDtJQURRLENBQVY7SUFHQSxNQUFBLEVBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBO01BQ1QsTUFBQSxHQUFTLE1BQU0sQ0FBQyxhQUFQLENBQUE7YUFDVCxNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDZCxjQUFBO1VBQUEsVUFBQSxHQUFhLEtBQUMsQ0FBQSxZQUFELENBQWMsTUFBZCxFQUFzQixNQUF0QjtVQUNiLE1BQUEsR0FBUyxLQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsb0JBQVAsQ0FBNEIsVUFBNUIsQ0FBakI7VUFDVCxjQUFBLEdBQWlCLEtBQUMsQ0FBQSxrQkFBRCxDQUFvQixNQUFwQjtpQkFDakIsS0FBQyxDQUFBLGFBQUQsQ0FBZSxNQUFmLEVBQXVCLE1BQXZCLEVBQStCLFVBQS9CLEVBQTJDLGNBQTNDO1FBSmM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO0lBSE0sQ0FIUjtJQVlBLFlBQUEsRUFBYyxTQUFDLE1BQUQsRUFBUyxNQUFUO0FBQ1osVUFBQTtNQUFBLEdBQUEsR0FBTSxNQUFNLENBQUMsWUFBUCxDQUFBO0FBQ04sYUFBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQU0sQ0FBQSxHQUFBLENBQUksQ0FBQyxPQUF6QixDQUFpQyxNQUFqQyxDQUFBLEtBQTRDLENBQUMsQ0FBcEQ7UUFDRSxJQUFTLEdBQUEsS0FBTyxDQUFoQjtBQUFBLGdCQUFBOztRQUNBLEdBQUEsSUFBTztNQUZUO2FBR0E7SUFMWSxDQVpkO0lBbUJBLGFBQUEsRUFBZSxTQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLFVBQWpCLEVBQTZCLGNBQTdCO0FBQ2IsVUFBQTtNQUFBLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixDQUFDLFVBQUQsRUFBWSxDQUFaLENBQXpCO01BQ0EsTUFBTSxDQUFDLDBCQUFQLENBQUE7TUFDQSxXQUFBLEdBQWMsTUFBTSxDQUFDLGNBQVAsQ0FBQTtNQUNkLE1BQU0sQ0FBQyxrQkFBUCxDQUFBO01BQ0EsTUFBTSxDQUFDLDBCQUFQLENBQWtDLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBbEMsRUFBeUQsV0FBekQ7YUFDQSxRQUFRLENBQUMsTUFBVCxDQUFnQixjQUFoQjtJQU5hLENBbkJmO0lBMkJBLGtCQUFBLEVBQW9CLFNBQUMsTUFBRDtBQUNsQixVQUFBO01BQUEsY0FBQSxHQUFpQjtNQUNqQixLQUFBLEdBQVE7QUFDUixXQUFBLHdDQUFBOztRQUNFLGNBQUEsSUFBa0IsY0FBQSxHQUFlLEtBQWYsR0FBcUIsVUFBckIsR0FBK0IsS0FBL0IsR0FBcUMsS0FBckMsR0FBeUMsQ0FBQyxLQUFBLEdBQVEsQ0FBVCxDQUF6QyxHQUFvRCxZQUFwRCxHQUFnRSxLQUFoRSxHQUFzRTtRQUN4RixLQUFBLElBQVM7QUFGWDtNQUdBLGNBQUEsSUFBa0IsZUFBQSxHQUFnQixLQUFoQixHQUFzQixZQUF0QixHQUFpQyxDQUFDLEtBQUEsR0FBUSxDQUFULENBQWpDLEdBQTRDO2FBQzlEO0lBUGtCLENBM0JwQjtJQW9DQSxlQUFBLEVBQWlCLFNBQUMsVUFBRDtBQUNmLFVBQUE7TUFBQSxjQUFBLEdBQWlCLFVBQVUsQ0FBQyxPQUFYLENBQW1CLEdBQW5CO01BQ2pCLGNBQUEsR0FBaUIsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsR0FBbkI7TUFDakIsSUFBYSxjQUFBLEtBQWtCLENBQUMsQ0FBbkIsSUFBeUIsY0FBQSxLQUFrQixDQUFDLENBQXpEO0FBQUEsZUFBTyxHQUFQOztNQUNBLGFBQUEsR0FBZ0IsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsY0FBQSxHQUFpQixDQUF0QyxFQUF5QyxjQUF6QzthQUNoQixhQUFhLENBQUMsS0FBZCxDQUFvQixHQUFwQixDQUF3QixDQUFDLEdBQXpCLENBQTZCLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQyxJQUFGLENBQUE7TUFBUCxDQUE3QjtJQUxlLENBcENqQjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5TbmlwcGV0cyA9IHJlcXVpcmUgYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ3NuaXBwZXRzJykgKyAnL2xpYi9zbmlwcGV0cy5qcydcblxubW9kdWxlLmV4cG9ydHMgPSBZYXJkID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCBcInlhcmQ6Y3JlYXRlXCIsID0+IEBjcmVhdGUoKVxuXG4gIGNyZWF0ZTogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKVxuICAgIGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgcHJldkRlZlJvdyA9IEBmaW5kU3RhcnRSb3coZWRpdG9yLCBjdXJzb3IpXG4gICAgICBwYXJhbXMgPSBAcGFyc2VNZXRob2RMaW5lKGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhwcmV2RGVmUm93KSlcbiAgICAgIHNuaXBwZXRfc3RyaW5nID0gQGJ1aWxkU25pcHBldFN0cmluZyhwYXJhbXMpXG4gICAgICBAaW5zZXJ0U25pcHBldChlZGl0b3IsIGN1cnNvciwgcHJldkRlZlJvdywgc25pcHBldF9zdHJpbmcpXG5cbiAgZmluZFN0YXJ0Um93OiAoZWRpdG9yLCBjdXJzb3IpIC0+XG4gICAgcm93ID0gY3Vyc29yLmdldEJ1ZmZlclJvdygpXG4gICAgd2hpbGUgKGVkaXRvci5idWZmZXIubGluZXNbcm93XS5pbmRleE9mKCdkZWYgJykgPT0gLTEpXG4gICAgICBicmVhayBpZiByb3cgPT0gMFxuICAgICAgcm93IC09IDFcbiAgICByb3dcblxuICBpbnNlcnRTbmlwcGV0OiAoZWRpdG9yLCBjdXJzb3IsIHByZXZEZWZSb3csIHNuaXBwZXRfc3RyaW5nKSAtPlxuICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihbcHJldkRlZlJvdywwXSlcbiAgICBlZGl0b3IubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUoKVxuICAgIGluZGVudGF0aW9uID0gY3Vyc29yLmdldEluZGVudExldmVsKClcbiAgICBlZGl0b3IuaW5zZXJ0TmV3bGluZUFib3ZlKClcbiAgICBlZGl0b3Iuc2V0SW5kZW50YXRpb25Gb3JCdWZmZXJSb3coY3Vyc29yLmdldEJ1ZmZlclJvdygpLCBpbmRlbnRhdGlvbilcbiAgICBTbmlwcGV0cy5pbnNlcnQoc25pcHBldF9zdHJpbmcpXG5cbiAgYnVpbGRTbmlwcGV0U3RyaW5nOiAocGFyYW1zKSAtPlxuICAgIHNuaXBwZXRfc3RyaW5nID0gXCIjICR7MTpEZXNjcmlwdGlvbiBvZiBtZXRob2R9XFxuI1xcblwiXG4gICAgaW5kZXggPSAyXG4gICAgZm9yIHBhcmFtIGluIHBhcmFtc1xuICAgICAgc25pcHBldF9zdHJpbmcgKz0gXCIjIEBwYXJhbSBbJHsje2luZGV4fTpUeXBlfV0gI3twYXJhbX0gJHsje2luZGV4ICsgMX06ZGVzY3JpYmUgI3twYXJhbX19XFxuXCJcbiAgICAgIGluZGV4ICs9IDJcbiAgICBzbmlwcGV0X3N0cmluZyArPSBcIiMgQHJldHVybiBbJHsje2luZGV4fTpUeXBlfV0gJHsje2luZGV4ICsgMX06ZGVzY3JpcHRpb24gb2YgcmV0dXJuZWQgb2JqZWN0fVwiXG4gICAgc25pcHBldF9zdHJpbmdcblxuICBwYXJzZU1ldGhvZExpbmU6IChtZXRob2RMaW5lKSAtPlxuICAgIG9wZW5lZF9icmFja2V0ID0gbWV0aG9kTGluZS5pbmRleE9mKFwiKFwiKVxuICAgIGNsb3NlZF9icmFja2V0ID0gbWV0aG9kTGluZS5pbmRleE9mKFwiKVwiKVxuICAgIHJldHVybiBbXSBpZiBvcGVuZWRfYnJhY2tldCA9PSAtMSBhbmQgY2xvc2VkX2JyYWNrZXQgPT0gLTFcbiAgICBwYXJhbXNfc3RyaW5nID0gbWV0aG9kTGluZS5zdWJzdHJpbmcob3BlbmVkX2JyYWNrZXQgKyAxLCBjbG9zZWRfYnJhY2tldClcbiAgICBwYXJhbXNfc3RyaW5nLnNwbGl0KCcsJykubWFwKChtKSAtPiBtLnRyaW0oKSlcbiJdfQ==
