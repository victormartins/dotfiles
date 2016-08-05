(function() {
  var CompositeDisposable, ExportHtml, ExportHtmlBrowserView, Shell, aliases, exec, os, path, _;

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
      var body, grammar, html, language, roaster, style, text, _ref, _ref1;
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
        language = (title != null ? (_ref = title.split(".")) != null ? _ref.pop() : void 0 : void 0) || ((_ref1 = grammar.scopeName) != null ? _ref1.split(".").pop() : void 0);
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
      css = "" + highlightjs + "/styles/" + style + ".min.css";
      js = "" + highlightjs + "/highlight.min.js";
      lang = "" + highlightjs + "/languages/" + language + ".min.js";
      html = "<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <script src=\"https://code.jquery.com/jquery-2.1.4.min.js\"></script>\n  <link rel=\"stylesheet\" href=\"" + css + "\">\n  <script src=\"" + js + "\"></script>\n  <script src=\"" + lang + "\"></script>\n  <style>\n    body {\n      margin: 0px;\n      padding: 15px;\n      font-size: " + (atom.config.get("export-html.fontSize")) + "\n    }\n    .hljs {\n      margin: -15px;\n      word-wrap: break-word;\n    }\n    body, .hljs {\n      font-family: " + (atom.config.get("editor.fontFamily")) + ";\n    }\n    .number {\n      float:left;\n      text-align: right;\n      display: inline-block;\n      margin-right: 5px;\n    }\n    .ln {\n      " + (atom.config.get("export-html.lineNumber.styles")) + "\n    }\n  </style>\n</head>\n<body>\n" + body + "\n</body>\n</html>";
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2V4cG9ydC1odG1sL2xpYi9leHBvcnQtaHRtbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUZBQUE7O0FBQUEsRUFBQSxxQkFBQSxHQUF3QixPQUFBLENBQVEsMkJBQVIsQ0FBeEIsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQyxPQUFRLE9BQUEsQ0FBUSxlQUFSLEVBQVIsSUFKRCxDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBTFIsQ0FBQTs7QUFBQSxFQU1BLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FOSixDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBUFYsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQUEsR0FDZjtBQUFBLElBQUEsT0FBQSxFQUFTLElBQVQ7QUFBQSxJQUNBLGFBQUEsRUFBZSxJQURmO0FBQUEsSUEyQkEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUdSLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO2FBR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLG9CQUFBLEVBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtB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

//# sourceURL=/Users/victor.martins/.atom/packages/export-html/lib/export-html.coffee
