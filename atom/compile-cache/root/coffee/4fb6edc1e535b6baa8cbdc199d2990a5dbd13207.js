(function() {
  var CompositeDisposable;

  CompositeDisposable = require("atom").CompositeDisposable;

  module.exports = {
    subscriptions: null,
    flows: [],
    flow: null,
    key: "activate-power-mode.flow",
    enable: function() {
      this.subscriptions = new CompositeDisposable;
      this.observeFlow();
      return this.initList();
    },
    disable: function() {
      var ref, ref1;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      if ((ref1 = this.flowList) != null) {
        ref1.dispose();
      }
      return this.flowList = null;
    },
    setDefaultFlow: function(flow) {
      this.flow = flow;
      return this.flows['default'] = flow;
    },
    addFlow: function(code, flow) {
      this.flows[code] = flow;
      if (atom.config.get(this.key) === code) {
        return this.flow = flow;
      }
    },
    observeFlow: function() {
      return this.subscriptions.add(atom.config.observe(this.key, (function(_this) {
        return function(code) {
          if (_this.flows[code] != null) {
            return _this.flow = _this.flows[code];
          } else {
            return _this.flow = _this.flows['default'];
          }
        };
      })(this)));
    },
    selectFlow: function(code) {
      return atom.config.set(this.key, code);
    },
    initList: function() {
      if (this.flowList != null) {
        return;
      }
      this.flowList = require("./flow-list");
      this.flowList.init(this);
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        "activate-power-mode:select-flow": (function(_this) {
          return function() {
            return _this.flowList.toggle();
          };
        })(this)
      }));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvZmxvdy1yZWdpc3RyeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBQ0EsS0FBQSxFQUFPLEVBRFA7SUFFQSxJQUFBLEVBQU0sSUFGTjtJQUdBLEdBQUEsRUFBSywwQkFITDtJQUtBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsV0FBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBQTtJQUhNLENBTFI7SUFVQSxPQUFBLEVBQVMsU0FBQTtBQUNQLFVBQUE7O1dBQWMsQ0FBRSxPQUFoQixDQUFBOzs7WUFDUyxDQUFFLE9BQVgsQ0FBQTs7YUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZO0lBSEwsQ0FWVDtJQWVBLGNBQUEsRUFBZ0IsU0FBQyxJQUFEO01BQ2QsSUFBQyxDQUFBLElBQUQsR0FBUTthQUNSLElBQUMsQ0FBQSxLQUFNLENBQUEsU0FBQSxDQUFQLEdBQW9CO0lBRk4sQ0FmaEI7SUFtQkEsT0FBQSxFQUFTLFNBQUMsSUFBRCxFQUFPLElBQVA7TUFDUCxJQUFDLENBQUEsS0FBTSxDQUFBLElBQUEsQ0FBUCxHQUFlO01BRWYsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLEdBQWpCLENBQUEsS0FBeUIsSUFBNUI7ZUFDRSxJQUFDLENBQUEsSUFBRCxHQUFRLEtBRFY7O0lBSE8sQ0FuQlQ7SUF5QkEsV0FBQSxFQUFhLFNBQUE7YUFDWCxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQ2pCLElBQUMsQ0FBQSxHQURnQixFQUNYLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQ0osSUFBRyx5QkFBSDttQkFDRSxLQUFDLENBQUEsSUFBRCxHQUFRLEtBQUMsQ0FBQSxLQUFNLENBQUEsSUFBQSxFQURqQjtXQUFBLE1BQUE7bUJBR0UsS0FBQyxDQUFBLElBQUQsR0FBUSxLQUFDLENBQUEsS0FBTSxDQUFBLFNBQUEsRUFIakI7O1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFcsQ0FBbkI7SUFEVyxDQXpCYjtJQWtDQSxVQUFBLEVBQVksU0FBQyxJQUFEO2FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLElBQUMsQ0FBQSxHQUFqQixFQUFzQixJQUF0QjtJQURVLENBbENaO0lBcUNBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBVSxxQkFBVjtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxPQUFBLENBQVEsYUFBUjtNQUNaLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQWY7YUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtRQUFBLGlDQUFBLEVBQW1DLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ2pDLEtBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFBO1VBRGlDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQztPQURpQixDQUFuQjtJQU5RLENBckNWOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgZmxvd3M6IFtdXG4gIGZsb3c6IG51bGxcbiAga2V5OiBcImFjdGl2YXRlLXBvd2VyLW1vZGUuZmxvd1wiXG5cbiAgZW5hYmxlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAb2JzZXJ2ZUZsb3coKVxuICAgIEBpbml0TGlzdCgpXG5cbiAgZGlzYWJsZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQGZsb3dMaXN0Py5kaXNwb3NlKClcbiAgICBAZmxvd0xpc3QgPSBudWxsXG5cbiAgc2V0RGVmYXVsdEZsb3c6IChmbG93KSAtPlxuICAgIEBmbG93ID0gZmxvd1xuICAgIEBmbG93c1snZGVmYXVsdCddID0gZmxvd1xuXG4gIGFkZEZsb3c6IChjb2RlLCBmbG93KSAtPlxuICAgIEBmbG93c1tjb2RlXSA9IGZsb3dcblxuICAgIGlmIGF0b20uY29uZmlnLmdldChAa2V5KSBpcyBjb2RlXG4gICAgICBAZmxvdyA9IGZsb3dcblxuICBvYnNlcnZlRmxvdzogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgIEBrZXksIChjb2RlKSA9PlxuICAgICAgICBpZiBAZmxvd3NbY29kZV0/XG4gICAgICAgICAgQGZsb3cgPSBAZmxvd3NbY29kZV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBmbG93ID0gQGZsb3dzWydkZWZhdWx0J11cbiAgICApXG5cbiAgc2VsZWN0RmxvdzogKGNvZGUpIC0+XG4gICAgYXRvbS5jb25maWcuc2V0KEBrZXksIGNvZGUpXG5cbiAgaW5pdExpc3Q6IC0+XG4gICAgcmV0dXJuIGlmIEBmbG93TGlzdD9cblxuICAgIEBmbG93TGlzdCA9IHJlcXVpcmUgXCIuL2Zsb3ctbGlzdFwiXG4gICAgQGZsb3dMaXN0LmluaXQgdGhpc1xuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIixcbiAgICAgIFwiYWN0aXZhdGUtcG93ZXItbW9kZTpzZWxlY3QtZmxvd1wiOiA9PlxuICAgICAgICBAZmxvd0xpc3QudG9nZ2xlKClcbiJdfQ==
