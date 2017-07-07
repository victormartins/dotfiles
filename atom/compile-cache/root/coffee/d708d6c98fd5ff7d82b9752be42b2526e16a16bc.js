(function() {
  var Api;

  module.exports = Api = (function() {
    function Api(editorRegistry, comboApi, screenShaker, audioPlayer) {
      this.editorRegistry = editorRegistry;
      this.screenShaker = screenShaker;
      this.audioPlayer = audioPlayer;
      this.combo = comboApi;
    }

    Api.prototype.shakeScreen = function(intensity) {
      if (intensity == null) {
        intensity = null;
      }
      return this.screenShaker.shake(this.editorRegistry.getEditorElement(), intensity);
    };

    Api.prototype.playAudio = function(audio) {
      return this.audioPlayer.play(audio);
    };

    Api.prototype.getEditor = function() {
      return this.editorRegistry.getEditor();
    };

    Api.prototype.getEditorElement = function() {
      return this.editorRegistry.getEditorElement();
    };

    Api.prototype.getCombo = function() {
      return this.combo;
    };

    return Api;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvYXBpLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7SUFDUixhQUFDLGNBQUQsRUFBaUIsUUFBakIsRUFBMkIsWUFBM0IsRUFBeUMsV0FBekM7TUFDWCxJQUFDLENBQUEsY0FBRCxHQUFrQjtNQUNsQixJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUNoQixJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUpFOztrQkFNYixXQUFBLEdBQWEsU0FBQyxTQUFEOztRQUFDLFlBQVk7O2FBQ3hCLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FBZCxDQUFvQixJQUFDLENBQUEsY0FBYyxDQUFDLGdCQUFoQixDQUFBLENBQXBCLEVBQXdELFNBQXhEO0lBRFc7O2tCQUdiLFNBQUEsR0FBVyxTQUFDLEtBQUQ7YUFDVCxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsS0FBbEI7SUFEUzs7a0JBR1gsU0FBQSxHQUFXLFNBQUE7YUFDVCxJQUFDLENBQUEsY0FBYyxDQUFDLFNBQWhCLENBQUE7SUFEUzs7a0JBR1gsZ0JBQUEsR0FBa0IsU0FBQTthQUNoQixJQUFDLENBQUEsY0FBYyxDQUFDLGdCQUFoQixDQUFBO0lBRGdCOztrQkFHbEIsUUFBQSxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUE7SUFETzs7Ozs7QUFuQloiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEFwaVxuICBjb25zdHJ1Y3RvcjogKGVkaXRvclJlZ2lzdHJ5LCBjb21ib0FwaSwgc2NyZWVuU2hha2VyLCBhdWRpb1BsYXllcikgLT5cbiAgICBAZWRpdG9yUmVnaXN0cnkgPSBlZGl0b3JSZWdpc3RyeVxuICAgIEBzY3JlZW5TaGFrZXIgPSBzY3JlZW5TaGFrZXJcbiAgICBAYXVkaW9QbGF5ZXIgPSBhdWRpb1BsYXllclxuICAgIEBjb21ibyA9IGNvbWJvQXBpXG5cbiAgc2hha2VTY3JlZW46IChpbnRlbnNpdHkgPSBudWxsKSAtPlxuICAgIEBzY3JlZW5TaGFrZXIuc2hha2UgQGVkaXRvclJlZ2lzdHJ5LmdldEVkaXRvckVsZW1lbnQoKSwgaW50ZW5zaXR5XG5cbiAgcGxheUF1ZGlvOiAoYXVkaW8pIC0+XG4gICAgQGF1ZGlvUGxheWVyLnBsYXkoYXVkaW8pXG5cbiAgZ2V0RWRpdG9yOiAtPlxuICAgIEBlZGl0b3JSZWdpc3RyeS5nZXRFZGl0b3IoKVxuXG4gIGdldEVkaXRvckVsZW1lbnQ6IC0+XG4gICAgQGVkaXRvclJlZ2lzdHJ5LmdldEVkaXRvckVsZW1lbnQoKVxuXG4gIGdldENvbWJvOiAtPlxuICAgIEBjb21ib1xuIl19
