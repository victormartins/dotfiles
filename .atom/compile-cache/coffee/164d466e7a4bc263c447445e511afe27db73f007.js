(function() {
  var CompositeDisposable, ExportHtml, Shell, exec, os, path, _;

  CompositeDisposable = require('atom').CompositeDisposable;

  os = require("os");

  path = require("path");

  exec = require('child_process').exec;

  Shell = require('shell');

  _ = require('underscore-plus');

  module.exports = ExportHtml = {
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
      return this.subscriptions.dispose();
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
          var fs;
          fs = require('fs');
          fs.writeFileSync(path, contents, "utf8");
          if (atom.config.get("export-html.openBrowser") === true) {
            return _this.openPath(path);
          }
        };
      })(this));
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
        html = this.buildHtml(body);
        return cb(path, html);
      }
    },
    buildHtml: function(body) {
      var css, highlightjs, html, js, style;
      style = atom.config.get("export-html.style");
      highlightjs = "http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.0.0";
      css = "" + highlightjs + "/styles/" + style + ".min.css";
      js = "" + highlightjs + "/highlight.min.js";
      html = "<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <script src=\"https://code.jquery.com/jquery-2.1.4.min.js\"></script>\n  <link rel=\"stylesheet\" href=\"" + css + "\">\n  <script src=\"" + js + "\"></script>\n  <style>\n    body {\n      margin: 0px;\n      padding: 15px;\n      font-size: " + (atom.config.get("export-html.fontSize")) + "\n    }\n    .hljs {\n      margin: -15px;\n      word-wrap: break-word;\n    }\n    body, .hljs {\n      font-family: " + (atom.config.get("editor.fontFamily")) + ";\n    }\n    .number {\n      float:left;\n      text-align: right;\n      display: inline-block;\n      margin-right: 5px;\n    }\n    .ln {\n      " + (atom.config.get("export-html.lineNumber.styles")) + "\n    }\n  </style>\n</head>\n<body>\n" + body + "\n</body>\n</html>";
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2V4cG9ydC1odG1sL2xpYi9leHBvcnQtaHRtbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseURBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0MsT0FBUSxPQUFBLENBQVEsZUFBUixFQUFSLElBSEQsQ0FBQTs7QUFBQSxFQUlBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUpSLENBQUE7O0FBQUEsRUFLQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBTEosQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQUEsR0FDZjtBQUFBLElBQUEsYUFBQSxFQUFlLElBQWY7QUFBQSxJQTBCQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBR1IsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7YUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztBQUFBLFFBQUEsb0JBQUEsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQUEsQ0FBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QjtPQUFwQyxDQUFuQixFQU5RO0lBQUEsQ0ExQlY7QUFBQSxJQWtDQSxVQUFBLEVBQVksU0FB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

//# sourceURL=/Users/victor.martins/.atom/packages/export-html/lib/export-html.coffee
