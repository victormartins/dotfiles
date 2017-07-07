(function() {
  var CompositeDisposable, debounce, defer, sample;

  CompositeDisposable = require("atom").CompositeDisposable;

  debounce = require("lodash.debounce");

  defer = require("lodash.defer");

  sample = require("lodash.sample");

  module.exports = {
    subscriptions: null,
    conf: [],
    isEnable: false,
    currentStreak: 0,
    level: 0,
    maxStreakReached: false,
    setPluginManager: function(pluginManager) {
      return this.pluginManager = pluginManager;
    },
    observe: function(key) {
      return this.subscriptions.add(atom.config.observe("activate-power-mode.comboMode." + key, (function(_this) {
        return function(value) {
          return _this.conf[key] = value;
        };
      })(this)));
    },
    enable: function() {
      this.isEnable = true;
      return this.initConfigSubscribers();
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.observe('exclamationEvery');
      this.observe('activationThreshold');
      this.observe('exclamationTexts');
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        "activate-power-mode:reset-max-combo": (function(_this) {
          return function() {
            return _this.resetMaxStreak();
          };
        })(this)
      }));
    },
    reset: function() {
      var ref, ref1;
      return (ref = this.container) != null ? (ref1 = ref.parentNode) != null ? ref1.removeChild(this.container) : void 0 : void 0;
    },
    destroy: function() {
      var ref, ref1, ref2, ref3;
      this.isEnable = false;
      this.reset();
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      this.container = null;
      if ((ref1 = this.debouncedEndStreak) != null) {
        ref1.cancel();
      }
      this.debouncedEndStreak = null;
      if ((ref2 = this.streakTimeoutObserver) != null) {
        ref2.dispose();
      }
      if ((ref3 = this.opacityObserver) != null) {
        ref3.dispose();
      }
      this.currentStreak = 0;
      this.level = 0;
      return this.maxStreakReached = false;
    },
    createElement: function(name, parent) {
      this.element = document.createElement("div");
      this.element.classList.add(name);
      if (parent) {
        parent.appendChild(this.element);
      }
      return this.element;
    },
    setup: function(editorElement) {
      var leftTimeout, ref, ref1;
      if (!this.container) {
        this.maxStreak = this.getMaxStreak();
        this.container = this.createElement("streak-container");
        this.container.classList.add("combo-zero");
        this.title = this.createElement("title", this.container);
        this.title.textContent = "Combo";
        this.max = this.createElement("max", this.container);
        this.max.textContent = "Max " + this.maxStreak;
        this.counter = this.createElement("counter", this.container);
        this.bar = this.createElement("bar", this.container);
        this.exclamations = this.createElement("exclamations", this.container);
        if ((ref = this.streakTimeoutObserver) != null) {
          ref.dispose();
        }
        this.streakTimeoutObserver = atom.config.observe('activate-power-mode.comboMode.streakTimeout', (function(_this) {
          return function(value) {
            var ref1;
            _this.streakTimeout = value * 1000;
            _this.endStreak();
            if ((ref1 = _this.debouncedEndStreak) != null) {
              ref1.cancel();
            }
            return _this.debouncedEndStreak = debounce(_this.endStreak.bind(_this), _this.streakTimeout);
          };
        })(this));
        if ((ref1 = this.opacityObserver) != null) {
          ref1.dispose();
        }
        this.opacityObserver = atom.config.observe('activate-power-mode.comboMode.opacity', (function(_this) {
          return function(value) {
            var ref2;
            return (ref2 = _this.container) != null ? ref2.style.opacity = value : void 0;
          };
        })(this));
      }
      this.exclamations.innerHTML = '';
      editorElement.querySelector(".scroll-view").appendChild(this.container);
      if (this.currentStreak) {
        leftTimeout = this.streakTimeout - (performance.now() - this.lastStreak);
        this.refreshStreakBar(leftTimeout);
      }
      return this.renderStreak();
    },
    resetCounter: function() {
      if (this.currentStreak === 0) {
        return;
      }
      this.showExclamation("" + (-this.currentStreak), 'down', false);
      return this.endStreak();
    },
    modifyStreak: function(n) {
      var oldStreak;
      if (this.currentStreak === 0 && n < 0) {
        return;
      }
      this.lastStreak = performance.now();
      this.debouncedEndStreak();
      if (n > 0) {
        n = n * (this.level + 1);
      }
      oldStreak = this.currentStreak;
      this.currentStreak += n;
      if (this.currentStreak < 0) {
        this.currentStreak = 0;
      }
      if (n > 0) {
        this.streakIncreased(n);
      }
      if (n < 0) {
        this.streakDecreased(n);
      }
      if (this.currentStreak === 0) {
        this.endStreak();
      } else {
        this.refreshStreakBar();
      }
      this.renderStreak();
      if (oldStreak === 0 && n > 0) {
        return this.pluginManager.runOnComboStartStreak();
      }
    },
    streakIncreased: function(n) {
      this.container.classList.remove("combo-zero");
      if (this.currentStreak > this.maxStreak) {
        this.increaseMaxStreak();
      }
      if (this.checkLevel()) {
        return;
      }
      if (this.currentStreak % this.conf['exclamationEvery'] === 0) {
        return this.showExclamation();
      } else {
        return this.showExclamation("+" + n, 'up', false);
      }
    },
    streakDecreased: function(n) {
      this.showExclamation("" + n, 'down', false);
      this.checkLevel();
      if (this.currentStreak === 0) {
        return this.container.classList.add("combo-zero");
      }
    },
    checkLevel: function() {
      var i, j, len, level, ref, threshold;
      level = 0;
      ref = this.conf['activationThreshold'];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        threshold = ref[i];
        if (this.currentStreak < threshold) {
          break;
        }
        level++;
      }
      if (level !== this.level) {
        this.container.classList.remove("level-" + this.level);
        this.container.classList.add("level-" + level);
        this.showExclamation((level + 1) + "x", 'level', false);
        this.pluginManager.runOnComboLevelChange(level, this.level);
        this.level = level;
        return true;
      }
    },
    getLevel: function() {
      return this.level;
    },
    endStreak: function() {
      this.currentStreak = 0;
      this.maxStreakReached = false;
      this.container.classList.add("combo-zero");
      this.container.classList.remove("level-" + this.level);
      this.level = 0;
      this.container.classList.add("level-" + this.level);
      this.renderStreak();
      this.refreshStreakBar(0);
      return this.pluginManager.runOnComboEndStreak();
    },
    renderStreak: function() {
      this.counter.textContent = this.currentStreak;
      this.counter.classList.remove("bump");
      return defer((function(_this) {
        return function() {
          return _this.counter.classList.add("bump");
        };
      })(this));
    },
    refreshStreakBar: function(leftTimeout) {
      var scale;
      if (leftTimeout == null) {
        leftTimeout = this.streakTimeout;
      }
      scale = leftTimeout / this.streakTimeout;
      this.bar.style.transition = "none";
      this.bar.style.transform = "scaleX(" + scale + ")";
      return setTimeout((function(_this) {
        return function() {
          _this.bar.style.transform = "";
          return _this.bar.style.transition = "transform " + leftTimeout + "ms linear";
        };
      })(this), 100);
    },
    showExclamation: function(text, type, trigger) {
      var exclamation;
      if (text == null) {
        text = null;
      }
      if (type == null) {
        type = 'message';
      }
      if (trigger == null) {
        trigger = true;
      }
      exclamation = document.createElement("span");
      exclamation.classList.add("exclamation");
      exclamation.classList.add(type);
      if (text === null) {
        text = sample(this.conf['exclamationTexts']);
      }
      exclamation.textContent = text;
      this.exclamations.appendChild(exclamation);
      setTimeout((function(_this) {
        return function() {
          if (exclamation.parentNode === _this.exclamations) {
            return _this.exclamations.removeChild(exclamation);
          }
        };
      })(this), 2000);
      if (trigger) {
        return this.pluginManager.runOnComboExclamation(text);
      }
    },
    getMaxStreak: function() {
      var maxStreak;
      maxStreak = localStorage.getItem("activate-power-mode.maxStreak");
      if (maxStreak === null) {
        maxStreak = 0;
      }
      return maxStreak;
    },
    increaseMaxStreak: function() {
      localStorage.setItem("activate-power-mode.maxStreak", this.currentStreak);
      this.maxStreak = this.currentStreak;
      this.max.textContent = "Max " + this.maxStreak;
      if (this.maxStreakReached === false) {
        this.showExclamation("NEW MAX!!!", 'max-combo', false);
        this.pluginManager.runOnComboMaxStreak(this.maxStreak);
      }
      return this.maxStreakReached = true;
    },
    resetMaxStreak: function() {
      localStorage.setItem("activate-power-mode.maxStreak", 0);
      this.maxStreakReached = false;
      this.maxStreak = 0;
      if (this.max) {
        return this.max.textContent = "Max 0";
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvY29tYm8tcmVuZGVyZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVI7O0VBQ1gsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztFQUNSLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsYUFBQSxFQUFlLElBQWY7SUFDQSxJQUFBLEVBQU0sRUFETjtJQUVBLFFBQUEsRUFBVSxLQUZWO0lBR0EsYUFBQSxFQUFlLENBSGY7SUFJQSxLQUFBLEVBQU8sQ0FKUDtJQUtBLGdCQUFBLEVBQWtCLEtBTGxCO0lBT0EsZ0JBQUEsRUFBa0IsU0FBQyxhQUFEO2FBQ2hCLElBQUMsQ0FBQSxhQUFELEdBQWlCO0lBREQsQ0FQbEI7SUFVQSxPQUFBLEVBQVMsU0FBQyxHQUFEO2FBQ1AsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUNqQixnQ0FBQSxHQUFpQyxHQURoQixFQUN1QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtpQkFDdEMsS0FBQyxDQUFBLElBQUssQ0FBQSxHQUFBLENBQU4sR0FBYTtRQUR5QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEdkIsQ0FBbkI7SUFETyxDQVZUO0lBZ0JBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBQyxDQUFBLFFBQUQsR0FBWTthQUNaLElBQUMsQ0FBQSxxQkFBRCxDQUFBO0lBRk0sQ0FoQlI7SUFvQkEscUJBQUEsRUFBdUIsU0FBQTtNQUNyQixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01B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QWEsQ0FBQyxxQkFBZixDQUFxQyxJQUFyQyxFQURGOztJQWJlLENBbExqQjtJQWtNQSxZQUFBLEVBQWMsU0FBQTtBQUNaLFVBQUE7TUFBQSxTQUFBLEdBQVksWUFBWSxDQUFDLE9BQWIsQ0FBcUIsK0JBQXJCO01BQ1osSUFBaUIsU0FBQSxLQUFhLElBQTlCO1FBQUEsU0FBQSxHQUFZLEVBQVo7O2FBQ0E7SUFIWSxDQWxNZDtJQXVNQSxpQkFBQSxFQUFtQixTQUFBO01BQ2pCLFlBQVksQ0FBQyxPQUFiLENBQXFCLCtCQUFyQixFQUFzRCxJQUFDLENBQUEsYUFBdkQ7TUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQTtNQUNkLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxHQUFtQixNQUFBLEdBQU8sSUFBQyxDQUFBO01BQzNCLElBQUcsSUFBQyxDQUFBLGdCQUFELEtBQXFCLEtBQXhCO1FBQ0UsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsWUFBakIsRUFBK0IsV0FBL0IsRUFBNEMsS0FBNUM7UUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLG1CQUFmLENBQW1DLElBQUMsQ0FBQSxTQUFwQyxFQUZGOzthQUdBLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtJQVBILENBdk1uQjtJQWdOQSxjQUFBLEVBQWdCLFNBQUE7TUFDZCxZQUFZLENBQUMsT0FBYixDQUFxQiwrQkFBckIsRUFBc0QsQ0FBdEQ7TUFDQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0I7TUFDcEIsSUFBQyxDQUFBLFNBQUQsR0FBYTtNQUNiLElBQUcsSUFBQyxDQUFBLEdBQUo7ZUFDRSxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQUwsR0FBbUIsUUFEckI7O0lBSmMsQ0FoTmhCOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxuZGVib3VuY2UgPSByZXF1aXJlIFwibG9kYXNoLmRlYm91bmNlXCJcbmRlZmVyID0gcmVxdWlyZSBcImxvZGFzaC5kZWZlclwiXG5zYW1wbGUgPSByZXF1aXJlIFwibG9kYXNoLnNhbXBsZVwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBjb25mOiBbXVxuICBpc0VuYWJsZTogZmFsc2VcbiAgY3VycmVudFN0cmVhazogMFxuICBsZXZlbDogMFxuICBtYXhTdHJlYWtSZWFjaGVkOiBmYWxzZVxuXG4gIHNldFBsdWdpbk1hbmFnZXI6IChwbHVnaW5NYW5hZ2VyKSAtPlxuICAgIEBwbHVnaW5NYW5hZ2VyID0gcGx1Z2luTWFuYWdlclxuXG4gIG9ic2VydmU6IChrZXkpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICBcImFjdGl2YXRlLXBvd2VyLW1vZGUuY29tYm9Nb2RlLiN7a2V5fVwiLCAodmFsdWUpID0+XG4gICAgICAgIEBjb25mW2tleV0gPSB2YWx1ZVxuICAgIClcblxuICBlbmFibGU6IC0+XG4gICAgQGlzRW5hYmxlID0gdHJ1ZVxuICAgIEBpbml0Q29uZmlnU3Vic2NyaWJlcnMoKVxuXG4gIGluaXRDb25maWdTdWJzY3JpYmVyczogLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQG9ic2VydmUgJ2V4Y2xhbWF0aW9uRXZlcnknXG4gICAgQG9ic2VydmUgJ2FjdGl2YXRpb25UaHJlc2hvbGQnXG4gICAgQG9ic2VydmUgJ2V4Y2xhbWF0aW9uVGV4dHMnXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIixcbiAgICAgIFwiYWN0aXZhdGUtcG93ZXItbW9kZTpyZXNldC1tYXgtY29tYm9cIjogPT4gQHJlc2V0TWF4U3RyZWFrKClcblxuICByZXNldDogLT5cbiAgICBAY29udGFpbmVyPy5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZCBAY29udGFpbmVyXG5cbiAgZGVzdHJveTogLT5cbiAgICBAaXNFbmFibGUgPSBmYWxzZVxuICAgIEByZXNldCgpXG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEBjb250YWluZXIgPSBudWxsXG4gICAgQGRlYm91bmNlZEVuZFN0cmVhaz8uY2FuY2VsKClcbiAgICBAZGVib3VuY2VkRW5kU3RyZWFrID0gbnVsbFxuICAgIEBzdHJlYWtUaW1lb3V0T2JzZXJ2ZXI/LmRpc3Bvc2UoKVxuICAgIEBvcGFjaXR5T2JzZXJ2ZXI/LmRpc3Bvc2UoKVxuICAgIEBjdXJyZW50U3RyZWFrID0gMFxuICAgIEBsZXZlbCA9IDBcbiAgICBAbWF4U3RyZWFrUmVhY2hlZCA9IGZhbHNlXG5cbiAgY3JlYXRlRWxlbWVudDogKG5hbWUsIHBhcmVudCktPlxuICAgIEBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcImRpdlwiXG4gICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZCBuYW1lXG4gICAgcGFyZW50LmFwcGVuZENoaWxkIEBlbGVtZW50IGlmIHBhcmVudFxuICAgIEBlbGVtZW50XG5cbiAgc2V0dXA6IChlZGl0b3JFbGVtZW50KSAtPlxuICAgIGlmIG5vdCBAY29udGFpbmVyXG4gICAgICBAbWF4U3RyZWFrID0gQGdldE1heFN0cmVhaygpXG4gICAgICBAY29udGFpbmVyID0gQGNyZWF0ZUVsZW1lbnQgXCJzdHJlYWstY29udGFpbmVyXCJcbiAgICAgIEBjb250YWluZXIuY2xhc3NMaXN0LmFkZCBcImNvbWJvLXplcm9cIlxuICAgICAgQHRpdGxlID0gQGNyZWF0ZUVsZW1lbnQgXCJ0aXRsZVwiLCBAY29udGFpbmVyXG4gICAgICBAdGl0bGUudGV4dENvbnRlbnQgPSBcIkNvbWJvXCJcbiAgICAgIEBtYXggPSBAY3JlYXRlRWxlbWVudCBcIm1heFwiLCBAY29udGFpbmVyXG4gICAgICBAbWF4LnRleHRDb250ZW50ID0gXCJNYXggI3tAbWF4U3RyZWFrfVwiXG4gICAgICBAY291bnRlciA9IEBjcmVhdGVFbGVtZW50IFwiY291bnRlclwiLCBAY29udGFpbmVyXG4gICAgICBAYmFyID0gQGNyZWF0ZUVsZW1lbnQgXCJiYXJcIiwgQGNvbnRhaW5lclxuICAgICAgQGV4Y2xhbWF0aW9ucyA9IEBjcmVhdGVFbGVtZW50IFwiZXhjbGFtYXRpb25zXCIsIEBjb250YWluZXJcblxuICAgICAgQHN0cmVha1RpbWVvdXRPYnNlcnZlcj8uZGlzcG9zZSgpXG4gICAgICBAc3RyZWFrVGltZW91dE9ic2VydmVyID0gYXRvbS5jb25maWcub2JzZXJ2ZSAnYWN0aXZhdGUtcG93ZXItbW9kZS5jb21ib01vZGUuc3RyZWFrVGltZW91dCcsICh2YWx1ZSkgPT5cbiAgICAgICAgQHN0cmVha1RpbWVvdXQgPSB2YWx1ZSAqIDEwMDBcbiAgICAgICAgQGVuZFN0cmVhaygpXG4gICAgICAgIEBkZWJvdW5jZWRFbmRTdHJlYWs/LmNhbmNlbCgpXG4gICAgICAgIEBkZWJvdW5jZWRFbmRTdHJlYWsgPSBkZWJvdW5jZSBAZW5kU3RyZWFrLmJpbmQodGhpcyksIEBzdHJlYWtUaW1lb3V0XG5cbiAgICAgIEBvcGFjaXR5T2JzZXJ2ZXI/LmRpc3Bvc2UoKVxuICAgICAgQG9wYWNpdHlPYnNlcnZlciA9IGF0b20uY29uZmlnLm9ic2VydmUgJ2FjdGl2YXRlLXBvd2VyLW1vZGUuY29tYm9Nb2RlLm9wYWNpdHknLCAodmFsdWUpID0+XG4gICAgICAgIEBjb250YWluZXI/LnN0eWxlLm9wYWNpdHkgPSB2YWx1ZVxuXG4gICAgQGV4Y2xhbWF0aW9ucy5pbm5lckhUTUwgPSAnJ1xuXG4gICAgZWRpdG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnNjcm9sbC12aWV3XCIpLmFwcGVuZENoaWxkIEBjb250YWluZXJcblxuICAgIGlmIEBjdXJyZW50U3RyZWFrXG4gICAgICBsZWZ0VGltZW91dCA9IEBzdHJlYWtUaW1lb3V0IC0gKHBlcmZvcm1hbmNlLm5vdygpIC0gQGxhc3RTdHJlYWspXG4gICAgICBAcmVmcmVzaFN0cmVha0JhciBsZWZ0VGltZW91dFxuXG4gICAgQHJlbmRlclN0cmVhaygpXG5cbiAgcmVzZXRDb3VudGVyOiAtPlxuICAgIHJldHVybiBpZiBAY3VycmVudFN0cmVhayBpcyAwXG5cbiAgICBAc2hvd0V4Y2xhbWF0aW9uIFwiI3stQGN1cnJlbnRTdHJlYWt9XCIsICdkb3duJywgZmFsc2VcbiAgICBAZW5kU3RyZWFrKClcblxuICBtb2RpZnlTdHJlYWs6IChuKSAtPlxuICAgIHJldHVybiBpZiBAY3VycmVudFN0cmVhayBpcyAwIGFuZCBuIDwgMFxuXG4gICAgQGxhc3RTdHJlYWsgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIEBkZWJvdW5jZWRFbmRTdHJlYWsoKVxuXG4gICAgbiA9IG4gKiAoQGxldmVsICsgMSkgaWYgbiA+IDBcblxuICAgIG9sZFN0cmVhayA9IEBjdXJyZW50U3RyZWFrXG4gICAgQGN1cnJlbnRTdHJlYWsgKz0gblxuICAgIEBjdXJyZW50U3RyZWFrID0gMCBpZiBAY3VycmVudFN0cmVhayA8IDBcblxuICAgIEBzdHJlYWtJbmNyZWFzZWQgbiBpZiBuID4gMFxuICAgIEBzdHJlYWtEZWNyZWFzZWQgbiBpZiBuIDwgMFxuXG4gICAgaWYgQGN1cnJlbnRTdHJlYWsgaXMgMFxuICAgICAgQGVuZFN0cmVhaygpXG4gICAgZWxzZVxuICAgICAgQHJlZnJlc2hTdHJlYWtCYXIoKVxuICAgIEByZW5kZXJTdHJlYWsoKVxuXG4gICAgaWYgb2xkU3RyZWFrIGlzIDAgYW5kIG4gPiAwXG4gICAgICBAcGx1Z2luTWFuYWdlci5ydW5PbkNvbWJvU3RhcnRTdHJlYWsoKVxuXG4gIHN0cmVha0luY3JlYXNlZDogKG4pIC0+XG4gICAgQGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlIFwiY29tYm8temVyb1wiXG4gICAgaWYgQGN1cnJlbnRTdHJlYWsgPiBAbWF4U3RyZWFrXG4gICAgICBAaW5jcmVhc2VNYXhTdHJlYWsoKVxuXG4gICAgcmV0dXJuIGlmIEBjaGVja0xldmVsKClcblxuICAgIGlmIEBjdXJyZW50U3RyZWFrICUgQGNvbmZbJ2V4Y2xhbWF0aW9uRXZlcnknXSBpcyAwXG4gICAgICBAc2hvd0V4Y2xhbWF0aW9uKClcbiAgICBlbHNlXG4gICAgICBAc2hvd0V4Y2xhbWF0aW9uIFwiKyN7bn1cIiwgJ3VwJywgZmFsc2VcblxuICBzdHJlYWtEZWNyZWFzZWQ6IChuKSAtPlxuICAgIEBzaG93RXhjbGFtYXRpb24gXCIje259XCIsICdkb3duJywgZmFsc2VcblxuICAgIEBjaGVja0xldmVsKClcbiAgICBpZiBAY3VycmVudFN0cmVhayA9PSAwXG4gICAgICBAY29udGFpbmVyLmNsYXNzTGlzdC5hZGQgXCJjb21iby16ZXJvXCJcblxuICBjaGVja0xldmVsOiAtPlxuICAgIGxldmVsID0gMFxuICAgIGZvciB0aHJlc2hvbGQsIGkgaW4gQGNvbmZbJ2FjdGl2YXRpb25UaHJlc2hvbGQnXVxuICAgICAgYnJlYWsgaWYgQGN1cnJlbnRTdHJlYWsgPCB0aHJlc2hvbGRcbiAgICAgIGxldmVsKytcblxuICAgIGlmIGxldmVsICE9IEBsZXZlbFxuICAgICAgQGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlIFwibGV2ZWwtI3tAbGV2ZWx9XCJcbiAgICAgIEBjb250YWluZXIuY2xhc3NMaXN0LmFkZCBcImxldmVsLSN7bGV2ZWx9XCJcbiAgICAgIEBzaG93RXhjbGFtYXRpb24gXCIje2xldmVsKzF9eFwiLCAnbGV2ZWwnLCBmYWxzZVxuICAgICAgQHBsdWdpbk1hbmFnZXIucnVuT25Db21ib0xldmVsQ2hhbmdlKGxldmVsLCBAbGV2ZWwpXG4gICAgICBAbGV2ZWwgPSBsZXZlbFxuICAgICAgcmV0dXJuIHRydWVcblxuICBnZXRMZXZlbDogLT5cbiAgICBAbGV2ZWxcblxuICBlbmRTdHJlYWs6IC0+XG4gICAgQGN1cnJlbnRTdHJlYWsgPSAwXG4gICAgQG1heFN0cmVha1JlYWNoZWQgPSBmYWxzZVxuICAgIEBjb250YWluZXIuY2xhc3NMaXN0LmFkZCBcImNvbWJvLXplcm9cIlxuICAgIEBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSBcImxldmVsLSN7QGxldmVsfVwiXG4gICAgQGxldmVsID0gMFxuICAgIEBjb250YWluZXIuY2xhc3NMaXN0LmFkZCBcImxldmVsLSN7QGxldmVsfVwiXG4gICAgQHJlbmRlclN0cmVhaygpXG4gICAgQHJlZnJlc2hTdHJlYWtCYXIoMClcbiAgICBAcGx1Z2luTWFuYWdlci5ydW5PbkNvbWJvRW5kU3RyZWFrKClcblxuICByZW5kZXJTdHJlYWs6IC0+XG4gICAgQGNvdW50ZXIudGV4dENvbnRlbnQgPSBAY3VycmVudFN0cmVha1xuICAgIEBjb3VudGVyLmNsYXNzTGlzdC5yZW1vdmUgXCJidW1wXCJcblxuICAgIGRlZmVyID0+XG4gICAgICBAY291bnRlci5jbGFzc0xpc3QuYWRkIFwiYnVtcFwiXG5cbiAgcmVmcmVzaFN0cmVha0JhcjogKGxlZnRUaW1lb3V0ID0gQHN0cmVha1RpbWVvdXQpIC0+XG4gICAgc2NhbGUgPSBsZWZ0VGltZW91dCAvIEBzdHJlYWtUaW1lb3V0XG4gICAgQGJhci5zdHlsZS50cmFuc2l0aW9uID0gXCJub25lXCJcbiAgICBAYmFyLnN0eWxlLnRyYW5zZm9ybSA9IFwic2NhbGVYKCN7c2NhbGV9KVwiXG5cbiAgICBzZXRUaW1lb3V0ID0+XG4gICAgICBAYmFyLnN0eWxlLnRyYW5zZm9ybSA9IFwiXCJcbiAgICAgIEBiYXIuc3R5bGUudHJhbnNpdGlvbiA9IFwidHJhbnNmb3JtICN7bGVmdFRpbWVvdXR9bXMgbGluZWFyXCJcbiAgICAsIDEwMFxuXG4gIHNob3dFeGNsYW1hdGlvbjogKHRleHQgPSBudWxsLCB0eXBlID0gJ21lc3NhZ2UnLCB0cmlnZ2VyID0gdHJ1ZSkgLT5cbiAgICBleGNsYW1hdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJzcGFuXCJcbiAgICBleGNsYW1hdGlvbi5jbGFzc0xpc3QuYWRkIFwiZXhjbGFtYXRpb25cIlxuICAgIGV4Y2xhbWF0aW9uLmNsYXNzTGlzdC5hZGQgdHlwZVxuICAgIHRleHQgPSBzYW1wbGUgQGNvbmZbJ2V4Y2xhbWF0aW9uVGV4dHMnXSBpZiB0ZXh0IGlzIG51bGxcbiAgICBleGNsYW1hdGlvbi50ZXh0Q29udGVudCA9IHRleHRcblxuICAgIEBleGNsYW1hdGlvbnMuYXBwZW5kQ2hpbGQgZXhjbGFtYXRpb25cbiAgICBzZXRUaW1lb3V0ID0+XG4gICAgICBpZiBleGNsYW1hdGlvbi5wYXJlbnROb2RlIGlzIEBleGNsYW1hdGlvbnNcbiAgICAgICAgQGV4Y2xhbWF0aW9ucy5yZW1vdmVDaGlsZCBleGNsYW1hdGlvblxuICAgICwgMjAwMFxuXG4gICAgaWYgdHJpZ2dlclxuICAgICAgQHBsdWdpbk1hbmFnZXIucnVuT25Db21ib0V4Y2xhbWF0aW9uKHRleHQpXG5cbiAgZ2V0TWF4U3RyZWFrOiAtPlxuICAgIG1heFN0cmVhayA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtIFwiYWN0aXZhdGUtcG93ZXItbW9kZS5tYXhTdHJlYWtcIlxuICAgIG1heFN0cmVhayA9IDAgaWYgbWF4U3RyZWFrIGlzIG51bGxcbiAgICBtYXhTdHJlYWtcblxuICBpbmNyZWFzZU1heFN0cmVhazogLT5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSBcImFjdGl2YXRlLXBvd2VyLW1vZGUubWF4U3RyZWFrXCIsIEBjdXJyZW50U3RyZWFrXG4gICAgQG1heFN0cmVhayA9IEBjdXJyZW50U3RyZWFrXG4gICAgQG1heC50ZXh0Q29udGVudCA9IFwiTWF4ICN7QG1heFN0cmVha31cIlxuICAgIGlmIEBtYXhTdHJlYWtSZWFjaGVkIGlzIGZhbHNlXG4gICAgICBAc2hvd0V4Y2xhbWF0aW9uIFwiTkVXIE1BWCEhIVwiLCAnbWF4LWNvbWJvJywgZmFsc2VcbiAgICAgIEBwbHVnaW5NYW5hZ2VyLnJ1bk9uQ29tYm9NYXhTdHJlYWsoQG1heFN0cmVhaylcbiAgICBAbWF4U3RyZWFrUmVhY2hlZCA9IHRydWVcblxuICByZXNldE1heFN0cmVhazogLT5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSBcImFjdGl2YXRlLXBvd2VyLW1vZGUubWF4U3RyZWFrXCIsIDBcbiAgICBAbWF4U3RyZWFrUmVhY2hlZCA9IGZhbHNlXG4gICAgQG1heFN0cmVhayA9IDBcbiAgICBpZiBAbWF4XG4gICAgICBAbWF4LnRleHRDb250ZW50ID0gXCJNYXggMFwiXG4iXX0=
