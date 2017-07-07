(function() {
  var CompositeDisposable, colorHelper, random;

  CompositeDisposable = require("atom").CompositeDisposable;

  random = require("lodash.random");

  colorHelper = require("./color-helper");

  module.exports = {
    colorHelper: colorHelper,
    subscriptions: null,
    conf: [],
    phaseStep: 0,
    setEffectRegistry: function(effectRegistry) {
      return this.effectRegistry = effectRegistry;
    },
    enable: function() {
      this.initConfigSubscribers();
      return this.colorHelper.init();
    },
    init: function() {
      this.effectRegistry.effect.init();
      return this.animationOn();
    },
    resetCanvas: function() {
      var ref;
      this.animationOff();
      if ((ref = this.canvas) != null) {
        ref.style.display = "none";
      }
      this.editor = null;
      return this.editorElement = null;
    },
    animationOff: function() {
      cancelAnimationFrame(this.animationFrame);
      return this.animationFrame = null;
    },
    animationOn: function() {
      return this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    },
    destroy: function() {
      var ref, ref1, ref2, ref3;
      this.resetCanvas();
      if ((ref = this.effectRegistry) != null) {
        ref.effect.disable();
      }
      if ((ref1 = this.canvas) != null) {
        ref1.parentNode.removeChild(this.canvas);
      }
      this.canvas = null;
      if ((ref2 = this.subscriptions) != null) {
        ref2.dispose();
      }
      return (ref3 = this.colorHelper) != null ? ref3.disable() : void 0;
    },
    setupCanvas: function(editor, editorElement) {
      if (!this.canvas) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.classList.add("power-mode-canvas");
        this.initConfigSubscribers();
      }
      this.scrollView = editorElement.querySelector(".scroll-view");
      this.editorContents = editorElement.querySelector(".editor-contents--private");
      this.editorContents.appendChild(this.canvas);
      this.canvas.style.display = "block";
      this.editorElement = editorElement;
      this.editor = editor;
      this.updateCanvasDimesions();
      this.calculateOffsets();
      window.addEventListener('resize', (function(_this) {
        return function() {
          _this.updateCanvasDimesions();
          return _this.calculateOffsets();
        };
      })(this));
      return this.init();
    },
    observe: function(key) {
      return this.subscriptions.add(atom.config.observe("activate-power-mode.particles." + key, (function(_this) {
        return function(value) {
          return _this.conf[key] = value;
        };
      })(this)));
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.observe('spawnCount.min');
      this.observe('spawnCount.max');
      this.observe('totalCount.max');
      this.observe('size.min');
      return this.observe('size.max');
    },
    spawn: function(cursor, screenPosition, input, size) {
      var colorGenerate, colorGenerator, position, randomSize;
      position = this.calculatePositions(screenPosition);
      colorGenerator = this.colorHelper.generateColors(cursor, this.editorElement);
      randomSize = (function(_this) {
        return function() {
          return _this.randomSize(size);
        };
      })(this);
      colorGenerate = function() {
        return colorGenerator.next().value;
      };
      return this.effectRegistry.effect.spawn(position, colorGenerate, input, randomSize, this.conf);
    },
    randomSize: function(size) {
      var max, min;
      min = this.conf['size.min'];
      max = this.conf['size.max'];
      if (size === 'max') {
        return random(max - min + 2, max + 2, true);
      } else if (size === 'min') {
        return random(min - 1, max - min, true);
      } else {
        return random(min, max, true);
      }
    },
    calculatePositions: function(screenPosition) {
      var left, ref, top;
      ref = this.editorElement.pixelPositionForScreenPosition(screenPosition), left = ref.left, top = ref.top;
      return {
        left: left + this.offsetLeft - this.editorElement.getScrollLeft(),
        top: top + this.offsetTop - this.editorElement.getScrollTop() + this.editor.getLineHeightInPixels() / 2
      };
    },
    calculateOffsets: function() {
      if (!this.scrollView) {
        return;
      }
      this.offsetLeft = this.scrollView.offsetLeft;
      return this.offsetTop = this.scrollView.offsetTop;
    },
    updateCanvasDimesions: function() {
      if (!this.editorElement) {
        return;
      }
      this.canvas.width = this.editorElement.offsetWidth;
      this.canvas.height = this.editorElement.offsetHeight;
      this.canvas.style.width = this.editorElement.width;
      return this.canvas.style.height = this.editorElement.height;
    },
    animate: function() {
      this.animationOn();
      this.effectRegistry.effect.update();
      if (this.phaseStep === 0) {
        this.canvas.width = this.canvas.width;
        this.effectRegistry.effect.animate(this.context);
      }
      this.phaseStep++;
      if (this.phaseStep > 2) {
        return this.phaseStep = 0;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvY2FudmFzLXJlbmRlcmVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7O0VBQ1QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUjs7RUFFZCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsV0FBQSxFQUFhLFdBQWI7SUFDQSxhQUFBLEVBQWUsSUFEZjtJQUVBLElBQUEsRUFBTSxFQUZOO0lBR0EsU0FBQSxFQUFXLENBSFg7SUFLQSxpQkFBQSxFQUFtQixTQUFDLGNBQUQ7YUFDakIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFERCxDQUxuQjtJQVFBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBQyxDQUFBLHFCQUFELENBQUE7YUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBQTtJQUZNLENBUlI7SUFZQSxJQUFBLEVBQU0sU0FBQTtNQUNKLElBQUMsQ0FBQSxjQUFjLENBQUMsTUFBTSxDQUFDLElBQXZCLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBO0lBRkksQ0FaTjtJQWdCQSxXQUFBLEVBQWEsU0FBQTtBQUNYLFVBQUE7TUFBQSxJQUFDLENBQUEsWUFBRCxDQUFBOztXQUNPLENBQUUsS0FBSyxDQUFDLE9BQWYsR0FBeUI7O01BQ3pCLElBQUMsQ0FBQSxNQUFELEdBQVU7YUFDVixJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUpOLENBaEJiO0lBc0JBLFlBQUEsRUFBYyxTQUFBO01BQ1osb0JBQUEsQ0FBcUIsSUFBQyxDQUFBLGNBQXRCO2FBQ0EsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFGTixDQXRCZDtJQTBCQSxXQUFBLEVBQWEsU0FB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O0FBTEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlIFwiYXRvbVwiXG5yYW5kb20gPSByZXF1aXJlIFwibG9kYXNoLnJhbmRvbVwiXG5jb2xvckhlbHBlciA9IHJlcXVpcmUgXCIuL2NvbG9yLWhlbHBlclwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29sb3JIZWxwZXI6IGNvbG9ySGVscGVyXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgY29uZjogW11cbiAgcGhhc2VTdGVwOiAwXG5cbiAgc2V0RWZmZWN0UmVnaXN0cnk6IChlZmZlY3RSZWdpc3RyeSkgLT5cbiAgICBAZWZmZWN0UmVnaXN0cnkgPSBlZmZlY3RSZWdpc3RyeVxuXG4gIGVuYWJsZTogLT5cbiAgICBAaW5pdENvbmZpZ1N1YnNjcmliZXJzKClcbiAgICBAY29sb3JIZWxwZXIuaW5pdCgpXG5cbiAgaW5pdDogLT5cbiAgICBAZWZmZWN0UmVnaXN0cnkuZWZmZWN0LmluaXQoKVxuICAgIEBhbmltYXRpb25PbigpXG5cbiAgcmVzZXRDYW52YXM6IC0+XG4gICAgQGFuaW1hdGlvbk9mZigpXG4gICAgQGNhbnZhcz8uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgQGVkaXRvciA9IG51bGxcbiAgICBAZWRpdG9yRWxlbWVudCA9IG51bGxcblxuICBhbmltYXRpb25PZmY6IC0+XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoQGFuaW1hdGlvbkZyYW1lKVxuICAgIEBhbmltYXRpb25GcmFtZSA9IG51bGxcblxuICBhbmltYXRpb25PbjogLT5cbiAgICBAYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgQGFuaW1hdGUuYmluZCh0aGlzKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHJlc2V0Q2FudmFzKClcbiAgICBAZWZmZWN0UmVnaXN0cnk/LmVmZmVjdC5kaXNhYmxlKClcbiAgICBAY2FudmFzPy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkIEBjYW52YXNcbiAgICBAY2FudmFzID0gbnVsbFxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAY29sb3JIZWxwZXI/LmRpc2FibGUoKVxuXG4gIHNldHVwQ2FudmFzOiAoZWRpdG9yLCBlZGl0b3JFbGVtZW50KSAtPlxuICAgIGlmIG5vdCBAY2FudmFzXG4gICAgICBAY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcImNhbnZhc1wiXG4gICAgICBAY29udGV4dCA9IEBjYW52YXMuZ2V0Q29udGV4dCBcIjJkXCJcbiAgICAgIEBjYW52YXMuY2xhc3NMaXN0LmFkZCBcInBvd2VyLW1vZGUtY2FudmFzXCJcbiAgICAgIEBpbml0Q29uZmlnU3Vic2NyaWJlcnMoKVxuXG4gICAgQHNjcm9sbFZpZXcgPSBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2Nyb2xsLXZpZXdcIilcbiAgICBAZWRpdG9yQ29udGVudHMgPSBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdG9yLWNvbnRlbnRzLS1wcml2YXRlXCIpXG4gICAgQGVkaXRvckNvbnRlbnRzLmFwcGVuZENoaWxkIEBjYW52YXNcbiAgICBAY2FudmFzLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcbiAgICBAZWRpdG9yRWxlbWVudCA9IGVkaXRvckVsZW1lbnRcbiAgICBAZWRpdG9yID0gZWRpdG9yXG4gICAgQHVwZGF0ZUNhbnZhc0RpbWVzaW9ucygpXG4gICAgQGNhbGN1bGF0ZU9mZnNldHMoKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCA9PlxuICAgICAgQHVwZGF0ZUNhbnZhc0RpbWVzaW9ucygpXG4gICAgICBAY2FsY3VsYXRlT2Zmc2V0cygpXG5cbiAgICBAaW5pdCgpXG5cbiAgb2JzZXJ2ZTogKGtleSkgLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSBcImFjdGl2YXRlLXBvd2VyLW1vZGUucGFydGljbGVzLiN7a2V5fVwiLCAodmFsdWUpID0+XG4gICAgICBAY29uZltrZXldID0gdmFsdWVcblxuICBpbml0Q29uZmlnU3Vic2NyaWJlcnM6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBvYnNlcnZlICdzcGF3bkNvdW50Lm1pbidcbiAgICBAb2JzZXJ2ZSAnc3Bhd25Db3VudC5tYXgnXG4gICAgQG9ic2VydmUgJ3RvdGFsQ291bnQubWF4J1xuICAgIEBvYnNlcnZlICdzaXplLm1pbidcbiAgICBAb2JzZXJ2ZSAnc2l6ZS5tYXgnXG5cbiAgc3Bhd246IChjdXJzb3IsIHNjcmVlblBvc2l0aW9uLCBpbnB1dCwgc2l6ZSkgLT5cbiAgICBwb3NpdGlvbiA9IEBjYWxjdWxhdGVQb3NpdGlvbnMgc2NyZWVuUG9zaXRpb25cbiAgICBjb2xvckdlbmVyYXRvciA9IEBjb2xvckhlbHBlci5nZW5lcmF0ZUNvbG9ycyBjdXJzb3IsIEBlZGl0b3JFbGVtZW50XG4gICAgcmFuZG9tU2l6ZSA9ID0+IEByYW5kb21TaXplKHNpemUpXG4gICAgY29sb3JHZW5lcmF0ZSA9IC0+IGNvbG9yR2VuZXJhdG9yLm5leHQoKS52YWx1ZVxuXG4gICAgQGVmZmVjdFJlZ2lzdHJ5LmVmZmVjdC5zcGF3biBwb3NpdGlvbiwgY29sb3JHZW5lcmF0ZSwgaW5wdXQsIHJhbmRvbVNpemUsIEBjb25mXG5cbiAgcmFuZG9tU2l6ZTogKHNpemUpIC0+XG4gICAgbWluID0gQGNvbmZbJ3NpemUubWluJ11cbiAgICBtYXggPSBAY29uZlsnc2l6ZS5tYXgnXVxuXG4gICAgaWYgc2l6ZSBpcyAnbWF4J1xuICAgICAgcmFuZG9tIG1heCAtIG1pbiArIDIsIG1heCArIDIsIHRydWVcbiAgICBlbHNlIGlmIHNpemUgaXMgJ21pbidcbiAgICAgIHJhbmRvbSBtaW4gLSAxLCBtYXggLSBtaW4sIHRydWVcbiAgICBlbHNlXG4gICAgICByYW5kb20gbWluLCBtYXgsIHRydWVcblxuICBjYWxjdWxhdGVQb3NpdGlvbnM6IChzY3JlZW5Qb3NpdGlvbikgLT5cbiAgICB7bGVmdCwgdG9wfSA9IEBlZGl0b3JFbGVtZW50LnBpeGVsUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbiBzY3JlZW5Qb3NpdGlvblxuICAgIGxlZnQ6IGxlZnQgKyBAb2Zmc2V0TGVmdCAtIEBlZGl0b3JFbGVtZW50LmdldFNjcm9sbExlZnQoKVxuICAgIHRvcDogdG9wICsgQG9mZnNldFRvcCAtIEBlZGl0b3JFbGVtZW50LmdldFNjcm9sbFRvcCgpICsgQGVkaXRvci5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKSAvIDJcblxuICBjYWxjdWxhdGVPZmZzZXRzOiAtPlxuICAgIHJldHVybiBpZiBub3QgQHNjcm9sbFZpZXdcbiAgICBAb2Zmc2V0TGVmdCA9IEBzY3JvbGxWaWV3Lm9mZnNldExlZnRcbiAgICBAb2Zmc2V0VG9wID0gQHNjcm9sbFZpZXcub2Zmc2V0VG9wXG5cbiAgdXBkYXRlQ2FudmFzRGltZXNpb25zOiAtPlxuICAgIHJldHVybiBpZiBub3QgQGVkaXRvckVsZW1lbnRcbiAgICBAY2FudmFzLndpZHRoID0gQGVkaXRvckVsZW1lbnQub2Zmc2V0V2lkdGhcbiAgICBAY2FudmFzLmhlaWdodCA9IEBlZGl0b3JFbGVtZW50Lm9mZnNldEhlaWdodFxuICAgIEBjYW52YXMuc3R5bGUud2lkdGggPSBAZWRpdG9yRWxlbWVudC53aWR0aFxuICAgIEBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gQGVkaXRvckVsZW1lbnQuaGVpZ2h0XG5cbiAgYW5pbWF0ZTogLT5cbiAgICBAYW5pbWF0aW9uT24oKVxuICAgIEBlZmZlY3RSZWdpc3RyeS5lZmZlY3QudXBkYXRlKClcbiAgICBpZiBAcGhhc2VTdGVwIGlzIDBcbiAgICAgIEBjYW52YXMud2lkdGggPSBAY2FudmFzLndpZHRoXG4gICAgICBAZWZmZWN0UmVnaXN0cnkuZWZmZWN0LmFuaW1hdGUoQGNvbnRleHQpXG5cbiAgICBAcGhhc2VTdGVwKytcbiAgICBAcGhhc2VTdGVwID0gMCBpZiBAcGhhc2VTdGVwID4gMlxuIl19
