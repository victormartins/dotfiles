(function() {
  var CompositeDisposable;

  CompositeDisposable = require("atom").CompositeDisposable;

  module.exports = {
    subscriptions: null,
    conf: [],
    golden_ratio_conjugate: 0.618033988749895,
    init: function() {
      return this.initConfigSubscribers();
    },
    disable: function() {
      var ref;
      return (ref = this.subscriptions) != null ? ref.dispose() : void 0;
    },
    observe: function(key) {
      return this.subscriptions.add(atom.config.observe("activate-power-mode.particles.colours." + key, (function(_this) {
        return function(value) {
          return _this.conf[key] = value;
        };
      })(this)));
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.observe('type');
      return this.observe('fixed');
    },
    hsvToRgb: function(h, s, v) {
      var c, h2, h3, m, x;
      c = v * s;
      h2 = (360.0 * h) / 60.0;
      h3 = Math.abs((h2 % 2) - 1.0);
      x = c * (1.0 - h3);
      m = v - c;
      if ((0 <= h2 && h2 < 1)) {
        return [c + m, x + m, m];
      }
      if ((1 <= h2 && h2 < 2)) {
        return [x + m, c + m, m];
      }
      if ((2 <= h2 && h2 < 3)) {
        return [m, c + m, x + m];
      }
      if ((3 <= h2 && h2 < 4)) {
        return [m, x + m, c + m];
      }
      if ((4 <= h2 && h2 < 5)) {
        return [x + m, m, c + m];
      }
      if ((5 <= h2 && h2 < 6)) {
        return [c + m, m, x + m];
      }
    },
    getFixedColorGenerator: function*() {
      var c, color;
      c = this.conf['fixed'];
      color = "rgb(" + c.red + "," + c.green + "," + c.blue + ")";
      while (true) {
        yield color;
      }
    },
    getRandomGenerator: function*() {
      var b, g, r, rgb, seed;
      seed = Math.random();
      while (true) {
        seed += this.golden_ratio_conjugate;
        seed = seed - (Math.floor(seed / 1));
        rgb = this.hsvToRgb(seed, 1, 1);
        r = Math.floor((rgb[0] * 255) / 1);
        g = Math.floor((rgb[1] * 255) / 1);
        b = Math.floor((rgb[2] * 255) / 1);
        yield ("rgb(" + r + "," + g + "," + b + ")");
      }
    },
    getColorAtCursorGenerator: function*(cursor, editorElement) {
      var color;
      color = this.getColorAtCursor(cursor, editorElement);
      while (true) {
        yield color;
      }
    },
    getColorAtCursor: function(cursor, editorElement) {
      var el, error, scope;
      scope = cursor.getScopeDescriptor();
      scope = scope.toString().replace(/\./g, '.syntax--');
      try {
        el = editorElement.querySelector(scope);
      } catch (error1) {
        error = error1;
        "rgb(255, 255, 255)";
      }
      if (el) {
        return getComputedStyle(el).color;
      } else {
        return "rgb(255, 255, 255)";
      }
    },
    generateColors: function(cursor, editorElement) {
      var colorType;
      colorType = this.conf['type'];
      if (colorType === 'random') {
        return this.getRandomGenerator();
      } else if (colorType === 'fixed') {
        return this.getFixedColorGenerator();
      } else {
        return this.getColorAtCursorGenerator(cursor, editorElement);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2NvbG9yLWhlbHBlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBQ0EsSUFBQSxFQUFNLEVBRE47SUFFQSxzQkFBQSxFQUF3QixpQkFGeEI7SUFJQSxJQUFBLEVBQU0sU0FBQTthQUNKLElBQUMsQ0FBQSxxQkFBRCxDQUFBO0lBREksQ0FKTjtJQU9BLE9BQUEsRUFBUyxTQUFBO0FBQ1AsVUFBQTtxREFBYyxDQUFFLE9BQWhCLENBQUE7SUFETyxDQVBUO0lBVUEsT0FBQSxFQUFTLFNBQUMsR0FBRDthQUNQLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FDakIsd0NBQUEsR0FBeUMsR0FEeEIsRUFDK0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7aUJBQzlDLEtBQUMsQ0FBQSxJQUFLLENBQUEsR0FBQSxDQUFOLEdBQWE7UUFEaUM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRC9CLENBQW5CO0lBRE8sQ0FWVDtJQWdCQSxxQkFBQSxFQUF1QixTQUFBO01BQ3JCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLE9BQUQsQ0FBUyxNQUFUO2FBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxPQUFUO0lBSHFCLENBaEJ2QjtJQXFCQSxRQUFBLEVBQVUsU0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUw7QUFDUixVQUFBO01BQUEsQ0FBQSxHQUFJLENBQUEsR0FBSTtNQUNSLEVBQUEsR0FBSyxDQUFDLEtBQUEsR0FBTSxDQUFQLENBQUEs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QUE7TUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLGtCQUFQLENBQUE7TUFDUixLQUFBLEdBQVEsS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUFnQixDQUFDLE9BQWpCLENBQXlCLEtBQXpCLEVBQWdDLFdBQWhDO0FBRVI7UUFDRSxFQUFBLEdBQUssYUFBYSxDQUFDLGFBQWQsQ0FBNEIsS0FBNUIsRUFEUDtPQUFBLGNBQUE7UUFFTTtRQUNKLHFCQUhGOztNQUtBLElBQUcsRUFBSDtlQUNFLGdCQUFBLENBQWlCLEVBQWpCLENBQW9CLENBQUMsTUFEdkI7T0FBQSxNQUFBO2VBR0UscUJBSEY7O0lBVGdCLENBN0RsQjtJQTJFQSxjQUFBLEVBQWdCLFNBQUMsTUFBRCxFQUFTLGFBQVQ7QUFDZCxVQUFBO01BQUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxJQUFLLENBQUEsTUFBQTtNQUNsQixJQUFJLFNBQUEsS0FBYSxRQUFqQjtBQUNFLGVBQU8sSUFBQyxDQUFBLGtCQUFELENBQUEsRUFEVDtPQUFBLE1BRUssSUFBRyxTQUFBLEtBQWEsT0FBaEI7ZUFDSCxJQUFDLENBQUEsc0JBQUQsQ0FBQSxFQURHO09BQUEsTUFBQTtlQUdILElBQUMsQ0FBQSx5QkFBRCxDQUEyQixNQUEzQixFQUFtQyxhQUFuQyxFQUhHOztJQUpTLENBM0VoQjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgXCJhdG9tXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzdWJzY3JpcHRpb25zOiBudWxsXG4gIGNvbmY6IFtdXG4gIGdvbGRlbl9yYXRpb19jb25qdWdhdGU6IDAuNjE4MDMzOTg4NzQ5ODk1XG5cbiAgaW5pdDogLT5cbiAgICBAaW5pdENvbmZpZ1N1YnNjcmliZXJzKClcblxuICBkaXNhYmxlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcblxuICBvYnNlcnZlOiAoa2V5KSAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlLnBhcnRpY2xlcy5jb2xvdXJzLiN7a2V5fVwiLCAodmFsdWUpID0+XG4gICAgICAgIEBjb25mW2tleV0gPSB2YWx1ZVxuICAgIClcblxuICBpbml0Q29uZmlnU3Vic2NyaWJlcnM6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBvYnNlcnZlICd0eXBlJ1xuICAgIEBvYnNlcnZlICdmaXhlZCdcblxuICBoc3ZUb1JnYjogKGgscyx2KSAtPiAjIEhTViB0byBSR0IgYWxnb3JpdGhtLCBhcyBwZXIgd2lraXBlZGlhXG4gICAgYyA9IHYgKiBzXG4gICAgaDIgPSAoMzYwLjAqaCkgLzYwLjAgIyBBY2NvcmRpbmcgdG8gd2lraXBlZGlhLCAwPGg8MzYwLi4uXG4gICAgaDMgPSBNYXRoLmFicygoaDIlMikgLSAxLjApXG4gICAgeCA9IGMgKiAoMS4wIC0gaDMpXG4gICAgbSA9IHYgLSBjXG4gICAgaWYgMDw9aDI8MSB0aGVuIHJldHVybiBbYyttLHgrbSxtXVxuICAgIGlmIDE8PWgyPDIgdGhlbiByZXR1cm4gW3grbSxjK20sbV1cbiAgICBpZiAyPD1oMjwzIHRoZW4gcmV0dXJuIFttLGMrbSx4K21dXG4gICAgaWYgMzw9aDI8NCB0aGVuIHJldHVybiBbbSx4K20sYyttXVxuICAgIGlmIDQ8PWgyPDUgdGhlbiByZXR1cm4gW3grbSxtLGMrbV1cbiAgICBpZiA1PD1oMjw2IHRoZW4gcmV0dXJuIFtjK20sbSx4K21dXG5cbiAgZ2V0Rml4ZWRDb2xvckdlbmVyYXRvcjogLT5cbiAgICBjID0gQGNvbmZbJ2ZpeGVkJ11cbiAgICBjb2xvciA9IFwicmdiKCN7Yy5yZWR9LCN7Yy5ncmVlbn0sI3tjLmJsdWV9KVwiXG5cbiAgICBsb29wXG4gICAgICB5aWVsZCBjb2xvclxuICAgIHJldHVyblxuXG4gIGdldFJhbmRvbUdlbmVyYXRvcjogLT5cbiAgICBzZWVkID0gTWF0aC5yYW5kb20oKVxuICAgIGxvb3BcbiAgICAgIHNlZWQgKz0gQGdvbGRlbl9yYXRpb19jb25qdWdhdGVcbiAgICAgIHNlZWQgPSBzZWVkIC0gKHNlZWQvLzEpXG4gICAgICByZ2IgPSBAaHN2VG9SZ2Ioc2VlZCwxLDEpXG4gICAgICByID0gKHJnYlswXSoyNTUpLy8xXG4gICAgICBnID0gKHJnYlsxXSoyNTUpLy8xXG4gICAgICBiID0gKHJnYlsyXSoyNTUpLy8xXG5cbiAgICAgIHlpZWxkIFwicmdiKCN7cn0sI3tnfSwje2J9KVwiXG4gICAgcmV0dXJuXG5cbiAgZ2V0Q29sb3JBdEN1cnNvckdlbmVyYXRvcjogKGN1cnNvciwgZWRpdG9yRWxlbWVudCkgLT5cbiAgICBjb2xvciA9IEBnZXRDb2xvckF0Q3Vyc29yIGN1cnNvciwgZWRpdG9yRWxlbWVudFxuICAgIGxvb3BcbiAgICAgIHlpZWxkIGNvbG9yXG4gICAgcmV0dXJuXG5cbiAgZ2V0Q29sb3JBdEN1cnNvcjogKGN1cnNvciwgZWRpdG9yRWxlbWVudCkgLT5cbiAgICBzY29wZSA9IGN1cnNvci5nZXRTY29wZURlc2NyaXB0b3IoKVxuICAgIHNjb3BlID0gc2NvcGUudG9TdHJpbmcoKS5yZXBsYWNlKC9cXC4vZywgJy5zeW50YXgtLScpXG5cbiAgICB0cnlcbiAgICAgIGVsID0gZWRpdG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yIHNjb3BlXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcblxuICAgIGlmIGVsXG4gICAgICBnZXRDb21wdXRlZFN0eWxlKGVsKS5jb2xvclxuICAgIGVsc2VcbiAgICAgIFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcblxuICBnZW5lcmF0ZUNvbG9yczogKGN1cnNvciwgZWRpdG9yRWxlbWVudCkgLT5cbiAgICBjb2xvclR5cGUgPSBAY29uZlsndHlwZSddXG4gICAgaWYgKGNvbG9yVHlwZSA9PSAncmFuZG9tJylcbiAgICAgIHJldHVybiBAZ2V0UmFuZG9tR2VuZXJhdG9yKClcbiAgICBlbHNlIGlmIGNvbG9yVHlwZSA9PSAnZml4ZWQnXG4gICAgICBAZ2V0Rml4ZWRDb2xvckdlbmVyYXRvcigpXG4gICAgZWxzZVxuICAgICAgQGdldENvbG9yQXRDdXJzb3JHZW5lcmF0b3IgY3Vyc29yLCBlZGl0b3JFbGVtZW50XG4iXX0=
