(function() {
  var CompositeDisposable, ExportHtml, ExportHtmlBrowserView, Shell, _, aliases, exec, os, path;

  ExportHtmlBrowserView = require("./export-html-bowser-view");

  CompositeDisposable = require('atom').CompositeDisposable;

  os = require("os");

  path = require("path");

  exec = require('child_process').exec;

  Shell = require('shell');

  _ = require('underscore-plus');

  aliases = require('./aliases');

  module.exports = ExportHtml = {
    preview: null,
    subscriptions: null,
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'export-html:export': (function(_this) {
          return function() {
            return _this["export"]();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.preview = null;
      return this.previewPanel.destroy();
    },
    "export": function() {
      var editor, html, text, title, tmpdir, tmpfile;
      editor = atom.workspace.getActiveTextEditor();
      tmpdir = os.tmpdir();
      if (editor == null) {
        return;
      }
      title = editor.getTitle() || 'untitled';
      tmpfile = path.join(tmpdir, title + ".html");
      text = editor.getText();
      return html = this.getHtml(editor, title, tmpfile, (function(_this) {
        return function(path, contents) {
          var fs, openIn;
          fs = require('fs');
          fs.writeFileSync(path, contents, "utf8");
          openIn = atom.config.get("export-html.openIn");
          if (openIn === "atom") {
            return _this.openPreview(path);
          } else if (openIn === "browser") {
            return _this.openPath(path);
          }
        };
      })(this));
    },
    panelHide: function() {
      return this.previewPanel.hide();
    },
    openPreview: function(path) {
      var params;
      params = {};
      params.src = path;
      if (this.preview != null) {
        this.previewPanel.show();
        return this.preview.loadURL(params.src);
      } else {
        this.preview = new ExportHtmlBrowserView(params, this);
        return this.previewPanel = atom.workspace.addRightPanel({
          item: atom.views.getView(this.preview)
        });
      }
    },
    openPath: function(filePath) {
      var process_architecture;
      process_architecture = process.platform;
      switch (process_architecture) {
        case 'darwin':
          return exec('open "' + filePath + '"');
        case 'linux':
          return exec('xdg-open "' + filePath + '"');
        case 'win32':
          return Shell.openExternal('file:///' + filePath);
      }
    },
    getHtml: function(editor, title, path, cb) {
      var body, grammar, html, language, ref, ref1, roaster, style, text;
      grammar = editor.getGrammar();
      text = editor.getText();
      style = "";
      if (grammar.scopeName === "source.gfm") {
        roaster = require("roaster");
        return roaster(text, {
          isFile: false
        }, (function(_this) {
          return function(err, contents) {
            var html;
            html = _this.buildHtml(contents);
            return cb(path, html);
          };
        })(this));
      } else if (grammar.scopeName === "text.html.basic") {
        html = text;
        return cb(path, html);
      } else {
        language = (title != null ? (ref = title.split(".")) != null ? ref.pop() : void 0 : void 0) || ((ref1 = grammar.scopeName) != null ? ref1.split(".").pop() : void 0);
        body = this.buildBodyByCode(_.escape(text), language);
        html = this.buildHtml(body, language);
        return cb(path, html);
      }
    },
    resolveAliase: function(language) {
      var table;
      table = {};
      aliases.table.split("\n").map(function(l) {
        return l.split(/,\s?/);
      }).forEach(function(l) {
        return l.forEach(function(d) {
          return table[d] = l[0];
        });
      });
      return table[language];
    },
    buildHtml: function(body, language) {
      var css, highlightjs, html, js, lang, style;
      language = this.resolveAliase(language);
      style = atom.config.get("export-html.style");
      highlightjs = "https://rawgithub.com/highlightjs/cdn-release/master/build";
      css = highlightjs + "/styles/" + style + ".min.css";
      js = highlightjs + "/highlight.min.js";
      lang = highlightjs + "/languages/" + language + ".min.js";
      html = "<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <script src=\"https://code.jquery.com/jquery-2.1.4.min.js\"></script>\n  <link rel=\"stylesheet\" href=\"" + css + "\">\n  <script src=\"" + js + "\"></script>\n  <script src=\"" + lang + "\"></script>\n  <style>\n    body {\n      margin: 0px;\n      padding: 15px;\n      font-size: " + (atom.config.get("export-html.fontSize")) + "\n    }\n    .hljs {\n      margin: -15px;\n      word-wrap: break-word;\n    }\n    body, .hljs {\n      font-family: " + (atom.config.get("editor.fontFamily")) + ";\n    }\n    .number {\n      float:left;\n      text-align: right;\n      display: inline-block;\n      margin-right: 5px;\n    }\n    .ln {\n      " + (atom.config.get("export-html.lineNumber.styles")) + "\n    }\n    pre {\n      tab-size:      " + (atom.config.get("export-html.tabWidth")) + ";\n    }\n  </style>\n</head>\n<body>\n" + body + "\n</body>\n</html>";
      return html;
    },
    buildBodyByCode: function(text, language) {
      var body, lines, width;
      lines = text.split(/\r?\n/);
      width = lines.length.toString().split("").length > 3 ? "40" : "20";
      if (atom.config.get("export-html.lineNumber.use")) {
        text = lines.map((function(_this) {
          return function(l, i) {
            return "<span class=\"number\"><span>" + (i + 1) + "</span></span><span class=\"code\">" + l + "</span>";
          };
        })(this)).join("\n");
      }
      body = "<pre><code class=\"" + language + "\">\n" + text + "\n</code></pre>\n<script>hljs.initHighlightingOnLoad();</script>\n<script>\n  setTimeout(function() {\n    $(\".number\").css(\"width\", \"" + width + "px\");\n    $(\".number span\").attr(\"class\", \"ln hljs-subst\");\n    resize();\n    var timer = false;\n    $(window).resize(function() {\n      if (timer !== false) {\n        clearTimeout(timer);\n      }\n      timer = setTimeout(function() {\n        resize();\n      }, 200);\n    })\n\n  }, 100);\n  function resize() {\n    $(\"span.code\").each(function(i, c) {\n      var h = $(c).height();\n      $(c).prev().height(h);\n    });\n  }\n</script>";
      return body;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2V4cG9ydC1odG1sL2xpYi9leHBvcnQtaHRtbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSwyQkFBUjs7RUFDdkIsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLE9BQVEsT0FBQSxDQUFRLGVBQVI7O0VBQ1QsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztFQUNSLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQUEsR0FDZjtJQUFBLE9BQUEsRUFBUyxJQUFUO0lBQ0EsYUFBQSxFQUFlLElBRGY7SUEyQkEsUUFBQSxFQUFVLFNBQUE7TUFHUixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO2FBR3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO1FBQUEsb0JBQUEsRUFBc0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLEVBQUEsTUFBQSxFQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEI7T0FBcEMsQ0FBbkI7SUFOUSxDQTNCVjtJQW1DQSxVQUFBLEVBQVksU0FBQTtNQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO01BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVzthQUNYLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFBO0lBSFUsQ0FuQ1o7SUF3Q0EsQ0FBQSxNQUFBLENBQUEs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QUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRCxFQUFJLENBQUo7QUFDaEIsbUJBQU8sK0JBQUEsR0FBK0IsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUEvQixHQUFzQyxxQ0FBdEMsR0FBMkUsQ0FBM0UsR0FBNkU7VUFEcEU7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsQ0FFTixDQUFDLElBRkssQ0FFQSxJQUZBLEVBQVA7O01BSUEsSUFBQSxHQUFPLHFCQUFBLEdBQ2EsUUFEYixHQUNzQixPQUR0QixHQUVMLElBRkssR0FFQSw2SUFGQSxHQU8wQixLQVAxQixHQU9nQztBQXNCdkMsYUFBTztJQXBDUSxDQTdKakI7O0FBVkYiLCJzb3VyY2VzQ29udGVudCI6WyJFeHBvcnRIdG1sQnJvd3NlclZpZXcgPSByZXF1aXJlIFwiLi9leHBvcnQtaHRtbC1ib3dzZXItdmlld1wiXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xub3MgPSByZXF1aXJlIFwib3NcIlxucGF0aCA9IHJlcXVpcmUgXCJwYXRoXCJcbntleGVjfSA9IHJlcXVpcmUgJ2NoaWxkX3Byb2Nlc3MnXG5TaGVsbCA9IHJlcXVpcmUgJ3NoZWxsJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbmFsaWFzZXMgPSByZXF1aXJlICcuL2FsaWFzZXMnXG5cbm1vZHVsZS5leHBvcnRzID0gRXhwb3J0SHRtbCA9XG4gIHByZXZpZXc6IG51bGxcbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuXG4gICMgY29uZmlnOlxuICAjICAgZm9udFNpemU6XG4gICMgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICMgICAgIGRlZmF1bHQ6IDEyXG4gICMgICBvcGVuQnJvd3NlcjpcbiAgIyAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgIyAgICAgZGVmYXVsdDogdHJ1ZVxuICAjICAgc3R5bGU6XG4gICMgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgIyAgICAgZGVmYXVsdDogXCJnaXRodWJcIlxuICAjICAgICB0aWx0ZTogXCJTdHlsZXNoZWV0XCJcbiAgIyAgICAgZGVzY3JpcHRpb246IFwiQ2hvb3NlIGZyb20gW2hpZ2hsaWdodC5qcyBzdHlsZXMuXShodHRwczovL2dpdGh1Yi5jb20vaXNhZ2FsYWV2L2hpZ2hsaWdodC5qcy90cmVlL21hc3Rlci9zcmMvc3R5bGVzKSAuXCJcbiAgIyAgIGxpbmVOdW1iZXI6XG4gICMgICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgIyAgICAgcHJvcGVydGllczpcbiAgIyAgICAgICB1c2U6XG4gICMgICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAjICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAjICAgICAgIHN0eWxlczpcbiAgIyAgICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgIyAgICAgICAgIHRpdGxlOiBcIlN0eWxlU2hlZXRcIlxuICAjICAgICAgICAgZGVmYXVsdDogXCJvcGFjaXR5OiAwLjU7XCJcblxuXG4gIGFjdGl2YXRlOiAtPlxuXG4gICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdleHBvcnQtaHRtbDpleHBvcnQnOiA9PiBAZXhwb3J0KClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIEBwcmV2aWV3ID0gbnVsbFxuICAgIEBwcmV2aWV3UGFuZWwuZGVzdHJveSgpXG5cbiAgZXhwb3J0OiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHRtcGRpciA9IG9zLnRtcGRpcigpXG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3I/XG4gICAgdGl0bGUgPSBlZGl0b3IuZ2V0VGl0bGUoKSB8fCAndW50aXRsZWQnXG4gICAgdG1wZmlsZSA9IHBhdGguam9pbih0bXBkaXIsIHRpdGxlICsgXCIuaHRtbFwiKVxuICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgaHRtbCA9IEBnZXRIdG1sKGVkaXRvciwgdGl0bGUsIHRtcGZpbGUsIChwYXRoLCBjb250ZW50cykgPT5cbiAgICAgIGZzID0gcmVxdWlyZSAnZnMnXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGgsIGNvbnRlbnRzLCBcInV0ZjhcIilcbiAgICAgIG9wZW5JbiA9IGF0b20uY29uZmlnLmdldChcImV4cG9ydC1odG1sLm9wZW5JblwiKVxuICAgICAgaWYgb3BlbkluIGlzIFwiYXRvbVwiXG4gICAgICAgIEBvcGVuUHJldmlldyBwYXRoXG4gICAgICBlbHNlIGlmIG9wZW5JbiBpcyBcImJyb3dzZXJcIlxuICAgICAgICBAb3BlblBhdGggcGF0aFxuICAgIClcblxuICBwYW5lbEhpZGU6IC0+XG4gICAgQHByZXZpZXdQYW5lbC5oaWRlKClcblxuICBvcGVuUHJldmlldzogKHBhdGgpIC0+XG4gICAgcGFyYW1zID0ge31cbiAgICBwYXJhbXMuc3JjID0gcGF0aFxuICAgIGlmIEBwcmV2aWV3P1xuICAgICAgQHByZXZpZXdQYW5lbC5zaG93KClcbiAgICAgIEBwcmV2aWV3LmxvYWRVUkwgcGFyYW1zLnNyY1xuICAgIGVsc2VcbiAgICAgIEBwcmV2aWV3ID0gbmV3IEV4cG9ydEh0bWxCcm93c2VyVmlldyhwYXJhbXMsIHRoaXMpXG4gICAgICBAcHJldmlld1BhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkUmlnaHRQYW5lbChpdGVtOmF0b20udmlld3MuZ2V0VmlldyhAcHJldmlldykpXG5cbiAgb3BlblBhdGg6IChmaWxlUGF0aCkgLT5cbiAgICAjIGh0dHA6Ly9hdG9taW8uZGlzY291cnNlLm9yZy90L2hvdy1kby15b3UtZ2V0LWZpbGUtcGF0aC84NjkzLzdcbiAgICBwcm9jZXNzX2FyY2hpdGVjdHVyZSA9IHByb2Nlc3MucGxhdGZvcm1cbiAgICBzd2l0Y2ggcHJvY2Vzc19hcmNoaXRlY3R1cmVcbiAgICAgIHdoZW4gJ2RhcndpbicgdGhlbiBleGVjICgnb3BlbiBcIicrZmlsZVBhdGgrJ1wiJylcbiAgICAgIHdoZW4gJ2xpbnV4JyB0aGVuIGV4ZWMgKCd4ZGctb3BlbiBcIicrZmlsZVBhdGgrJ1wiJylcbiAgICAgIHdoZW4gJ3dpbjMyJyB0aGVuIFNoZWxsLm9wZW5FeHRlcm5hbCgnZmlsZTovLy8nK2ZpbGVQYXRoKVxuXG4gIGdldEh0bWw6IChlZGl0b3IsIHRpdGxlLCBwYXRoLCBjYikgLT5cbiAgICBncmFtbWFyID0gZWRpdG9yLmdldEdyYW1tYXIoKVxuICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgc3R5bGUgPSBcIlwiXG4gICAgaWYgZ3JhbW1hci5zY29wZU5hbWUgaXMgXCJzb3VyY2UuZ2ZtXCJcbiAgICAgIHJvYXN0ZXIgPSByZXF1aXJlIFwicm9hc3RlclwiXG4gICAgICByb2FzdGVyKHRleHQsIHtpc0ZpbGU6IGZhbHNlfSwgKGVyciwgY29udGVudHMpID0+XG4gICAgICAgIGh0bWwgPSBAYnVpbGRIdG1sKGNvbnRlbnRzKVxuICAgICAgICBjYihwYXRoLCBodG1sKVxuICAgICAgKVxuICAgIGVsc2UgaWYgZ3JhbW1hci5zY29wZU5hbWUgaXMgXCJ0ZXh0Lmh0bWwuYmFzaWNcIlxuICAgICAgaHRtbCA9IHRleHRcbiAgICAgIGNiKHBhdGgsIGh0bWwpXG4gICAgZWxzZVxuICAgICAgbGFuZ3VhZ2UgPSB0aXRsZT8uc3BsaXQoXCIuXCIpPy5wb3AoKSB8fCBncmFtbWFyLnNjb3BlTmFtZT8uc3BsaXQoXCIuXCIpLnBvcCgpXG4gICAgICBib2R5ID0gQGJ1aWxkQm9keUJ5Q29kZSBfLmVzY2FwZSh0ZXh0KSwgbGFuZ3VhZ2VcbiAgICAgIGh0bWwgPSBAYnVpbGRIdG1sIGJvZHksIGxhbmd1YWdlXG4gICAgICBjYihwYXRoLCBodG1sKVxuXG4gIHJlc29sdmVBbGlhc2U6IChsYW5ndWFnZSkgLT5cbiAgICB0YWJsZSA9IHt9XG4gICAgYWxpYXNlcy50YWJsZVxuICAgICAgLnNwbGl0KFwiXFxuXCIpXG4gICAgICAubWFwKChsKSAtPiBsLnNwbGl0KC8sXFxzPy8pKVxuICAgICAgLmZvckVhY2ggKGwpIC0+XG4gICAgICAgIGwuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgICB0YWJsZVtkXSA9IGxbMF1cblxuICAgIHJldHVybiB0YWJsZVtsYW5ndWFnZV07XG5cbiAgYnVpbGRIdG1sOiAoYm9keSwgbGFuZ3VhZ2UpIC0+XG4gICAgbGFuZ3VhZ2UgPSBAcmVzb2x2ZUFsaWFzZShsYW5ndWFnZSlcbiAgICBzdHlsZSA9IGF0b20uY29uZmlnLmdldChcImV4cG9ydC1odG1sLnN0eWxlXCIpXG4gICAgaGlnaGxpZ2h0anMgPSBcImh0dHBzOi8vcmF3Z2l0aHViLmNvbS9oaWdobGlnaHRqcy9jZG4tcmVsZWFzZS9tYXN0ZXIvYnVpbGRcIlxuICAgIGNzcyA9IFwiI3toaWdobGlnaHRqc30vc3R5bGVzLyN7c3R5bGV9Lm1pbi5jc3NcIlxuICAgIGpzID0gXCIje2hpZ2hsaWdodGpzfS9oaWdobGlnaHQubWluLmpzXCJcbiAgICBsYW5nID0gXCIje2hpZ2hsaWdodGpzfS9sYW5ndWFnZXMvI3tsYW5ndWFnZX0ubWluLmpzXCJcbiAgICBodG1sID0gXCJcIlwiXG4gICAgPGh0bWw+XG4gICAgPGhlYWQ+XG4gICAgICA8bWV0YSBjaGFyc2V0PVwiVVRGLThcIj5cbiAgICAgIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9jb2RlLmpxdWVyeS5jb20vanF1ZXJ5LTIuMS40Lm1pbi5qc1wiPjwvc2NyaXB0PlxuICAgICAgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIje2Nzc31cIj5cbiAgICAgIDxzY3JpcHQgc3JjPVwiI3tqc31cIj48L3NjcmlwdD5cbiAgICAgIDxzY3JpcHQgc3JjPVwiI3tsYW5nfVwiPjwvc2NyaXB0PlxuICAgICAgPHN0eWxlPlxuICAgICAgICBib2R5IHtcbiAgICAgICAgICBtYXJnaW46IDBweDtcbiAgICAgICAgICBwYWRkaW5nOiAxNXB4O1xuICAgICAgICAgIGZvbnQtc2l6ZTogI3thdG9tLmNvbmZpZy5nZXQoXCJleHBvcnQtaHRtbC5mb250U2l6ZVwiKX1cbiAgICAgICAgfVxuICAgICAgICAuaGxqcyB7XG4gICAgICAgICAgbWFyZ2luOiAtMTVweDtcbiAgICAgICAgICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XG4gICAgICAgIH1cbiAgICAgICAgYm9keSwgLmhsanMge1xuICAgICAgICAgIGZvbnQtZmFtaWx5OiAje2F0b20uY29uZmlnLmdldChcImVkaXRvci5mb250RmFtaWx5XCIpfTtcbiAgICAgICAgfVxuICAgICAgICAubnVtYmVyIHtcbiAgICAgICAgICBmbG9hdDpsZWZ0O1xuICAgICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDVweDtcbiAgICAgICAgfVxuICAgICAgICAubG4ge1xuICAgICAgICAgICN7YXRvbS5jb25maWcuZ2V0KFwiZXhwb3J0LWh0bWwubGluZU51bWJlci5zdHlsZXNcIil9XG4gICAgICAgIH1cbiAgICAgICAgcHJlIHtcbiAgICAgICAgICB0YWItc2l6ZTogICAgICAje2F0b20uY29uZmlnLmdldChcImV4cG9ydC1odG1sLnRhYldpZHRoXCIpfTtcbiAgICAgICAgfVxuICAgICAgPC9zdHlsZT5cbiAgICA8L2hlYWQ+XG4gICAgPGJvZHk+XG4gICAgI3tib2R5fVxuICAgIDwvYm9keT5cbiAgICA8L2h0bWw+XG4gICAgXCJcIlwiXG4gICAgcmV0dXJuIGh0bWxcblxuICBidWlsZEJvZHlCeUNvZGU6ICh0ZXh0LCBsYW5ndWFnZSkgLT5cbiAgICBsaW5lcyA9IHRleHQuc3BsaXQoL1xccj9cXG4vKVxuICAgIHdpZHRoID0gaWYgbGluZXMubGVuZ3RoLnRvU3RyaW5nKCkuc3BsaXQoXCJcIikubGVuZ3RoID4gMyB0aGVuIFwiNDBcIiBlbHNlIFwiMjBcIlxuICAgIHRleHQgPSBsaW5lcy5tYXAoIChsLCBpKSA9PlxuICAgICAgcmV0dXJuIFwiPHNwYW4gY2xhc3M9XFxcIm51bWJlclxcXCI+PHNwYW4+I3tpICsgMX08L3NwYW4+PC9zcGFuPjxzcGFuIGNsYXNzPVxcXCJjb2RlXFxcIj4je2x9PC9zcGFuPlwiXG4gICAgKS5qb2luKFwiXFxuXCIpIGlmIGF0b20uY29uZmlnLmdldChcImV4cG9ydC1odG1sLmxpbmVOdW1iZXIudXNlXCIpXG5cbiAgICBib2R5ID0gXCJcIlwiXG4gICAgPHByZT48Y29kZSBjbGFzcz1cIiN7bGFuZ3VhZ2V9XCI+XG4gICAgI3t0ZXh0fVxuICAgIDwvY29kZT48L3ByZT5cbiAgICA8c2NyaXB0PmhsanMuaW5pdEhpZ2hsaWdodGluZ09uTG9hZCgpOzwvc2NyaXB0PlxuICAgIDxzY3JpcHQ+XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKFwiLm51bWJlclwiKS5jc3MoXCJ3aWR0aFwiLCBcIiN7d2lkdGh9cHhcIik7XG4gICAgICAgICQoXCIubnVtYmVyIHNwYW5cIikuYXR0cihcImNsYXNzXCIsIFwibG4gaGxqcy1zdWJzdFwiKTtcbiAgICAgICAgcmVzaXplKCk7XG4gICAgICAgIHZhciB0aW1lciA9IGZhbHNlO1xuICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh0aW1lciAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJlc2l6ZSgpO1xuICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgIH0pXG5cbiAgICAgIH0sIDEwMCk7XG4gICAgICBmdW5jdGlvbiByZXNpemUoKSB7XG4gICAgICAgICQoXCJzcGFuLmNvZGVcIikuZWFjaChmdW5jdGlvbihpLCBjKSB7XG4gICAgICAgICAgdmFyIGggPSAkKGMpLmhlaWdodCgpO1xuICAgICAgICAgICQoYykucHJldigpLmhlaWdodChoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgPC9zY3JpcHQ+XG4gICAgXCJcIlwiXG4gICAgcmV0dXJuIGJvZHlcbiJdfQ==
