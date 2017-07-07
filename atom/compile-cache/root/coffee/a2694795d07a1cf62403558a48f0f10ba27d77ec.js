(function() {
  var CompositeDisposable, path;

  CompositeDisposable = require("atom").CompositeDisposable;

  path = require("path");

  module.exports = {
    enabled: false,
    subscriptions: null,
    conf: [],
    init: function() {
      return this.enableSubscription = atom.config.observe('activate-power-mode.playAudio.enabled', (function(_this) {
        return function(value) {
          _this.enabled = value;
          if (_this.enabled) {
            return _this.enable();
          } else {
            return _this.disable();
          }
        };
      })(this));
    },
    destroy: function() {
      this.enableSubscription.dispose();
      return this.disable();
    },
    enable: function() {
      return this.initConfigSubscribers();
    },
    disable: function() {
      var ref;
      return (ref = this.subscriptions) != null ? ref.dispose() : void 0;
    },
    observe: function(key, loadAudio) {
      if (loadAudio == null) {
        loadAudio = true;
      }
      return this.subscriptions.add(atom.config.observe("activate-power-mode.playAudio." + key, (function(_this) {
        return function(value) {
          _this.conf[key] = value;
          if (loadAudio) {
            return _this.loadAudio();
          }
        };
      })(this)));
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.observe('audioclip');
      this.observe('customAudioclip');
      return this.observe('volume', false);
    },
    loadAudio: function() {
      var pathtoaudio;
      if (this.conf['audioclip'] === 'customAudioclip' && this.conf['customAudioclip']) {
        pathtoaudio = this.conf['customAudioclip'];
      } else {
        pathtoaudio = path.join(__dirname + "/..", this.conf['audioclip']);
      }
      return this.audio = new Audio(pathtoaudio);
    },
    play: function(audio) {
      if (!this.enabled) {
        return;
      }
      if (!audio) {
        audio = this.audio;
      }
      audio.currentTime = 0;
      audio.volume = this.conf['volume'];
      return audio.play();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvc2VydmljZS9hdWRpby1wbGF5ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsT0FBQSxFQUFTLEtBQVQ7SUFDQSxhQUFBLEVBQWUsSUFEZjtJQUVBLElBQUEsRUFBTSxFQUZOO0lBSUEsSUFBQSxFQUFNLFNBQUE7YUFDSixJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQ3BCLHVDQURvQixFQUNxQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtVQUN2QyxLQUFDLENBQUEsT0FBRCxHQUFXO1VBQ1gsSUFBRyxLQUFDLENBQUEsT0FBSjttQkFDRSxLQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFIRjs7UUFGdUM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHJCO0lBRGxCLENBSk47SUFjQSxPQUFBLEVBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxPQUFwQixDQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQTtJQUZPLENBZFQ7SUFrQkEsTUFBQSxFQUFRLFNBQUE7YUFDTixJQUFDLENBQUEscUJBQUQsQ0FBQTtJQURNLENBbEJSO0lBcUJBLE9BQUEsRUFBUyxTQUFBO0FBQ1AsVUFBQTtxREFBYyxDQUFFLE9BQWhCLENBQUE7SUFETyxDQXJCVDtJQXdCQSxPQUFBLEVBQVMsU0FBQyxHQUFELEVBQU0sU0FBTjs7UUFBTSxZQUFZOzthQUN6QixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQ2pCLGdDQUFBLEdBQWlDLEdBRGhCLEVBQ3VCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO1VBQ3RDLEtBQUMsQ0FBQSxJQUFLLENBQUEsR0FBQSxDQUFOLEdBQWE7VUFDYixJQUFnQixTQUFoQjttQkFBQSxLQUFDLENBQUEsU0FBRCxDQUFBLEVBQUE7O1FBRnNDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUR2QixDQUFuQjtJQURPLENBeEJUO0lBK0JBLHFCQUFBLEVBQXVCLFNBQUE7TUFDckIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsT0FBRCxDQUFTLFdBQVQ7TUFDQSxJQUFDLENBQUEsT0FBRCxDQUFTLGlCQUFUO2FBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxRQUFULEVBQW1CLEtBQW5CO0lBSnFCLENBL0J2QjtJQXFDQSxTQUFBLEVBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxJQUFHLElBQUMsQ0FBQSxJQUFLLENBQUEsV0FBQSxDQUFOLEtBQXNCLGlCQUF0QixJQUE0QyxJQUFDLENBQUEsSUFBSyxDQUFBLGlCQUFBLENBQXJEO1FBQ0UsV0FBQSxHQUFjLElBQUMsQ0FBQSxJQUFLLENBQUEsaUJBQUEsRUFEdEI7T0FBQSxNQUFBO1FBR0UsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQWEsU0FBRCxHQUFXLEtBQXZCLEVBQTZCLElBQUMsQ0FBQSxJQUFLLENBQUEsV0FBQSxDQUFuQyxFQUhoQjs7YUFJQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsS0FBQSxDQUFNLFdBQU47SUFMSixDQXJDWDtJQTRDQSxJQUFBLEVBQU0sU0FBQyxLQUFEO01BQ0osSUFBVSxDQUFJLElBQUMsQ0FBQSxPQUFmO0FBQUEsZUFBQTs7TUFFQSxJQUFrQixDQUFJLEtBQXRCO1FBQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFUOztNQUNBLEtBQUssQ0FBQyxXQUFOLEdBQW9CO01BQ3BCLEtBQUssQ0FBQyxNQUFOLEdBQWUsSUFBQyxDQUFBLElBQUssQ0FBQSxRQUFBO2FBQ3JCLEtBQUssQ0FBQyxJQUFOLENBQUE7SUFOSSxDQTVDTjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgXCJhdG9tXCJcbnBhdGggPSByZXF1aXJlIFwicGF0aFwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZW5hYmxlZDogZmFsc2VcbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBjb25mOiBbXVxuXG4gIGluaXQ6IC0+XG4gICAgQGVuYWJsZVN1YnNjcmlwdGlvbiA9IGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICAnYWN0aXZhdGUtcG93ZXItbW9kZS5wbGF5QXVkaW8uZW5hYmxlZCcsICh2YWx1ZSkgPT5cbiAgICAgICAgQGVuYWJsZWQgPSB2YWx1ZVxuICAgICAgICBpZiBAZW5hYmxlZFxuICAgICAgICAgIEBlbmFibGUoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGRpc2FibGUoKVxuICAgIClcblxuICBkZXN0cm95OiAtPlxuICAgIEBlbmFibGVTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgQGRpc2FibGUoKVxuXG4gIGVuYWJsZTogLT5cbiAgICBAaW5pdENvbmZpZ1N1YnNjcmliZXJzKClcblxuICBkaXNhYmxlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcblxuICBvYnNlcnZlOiAoa2V5LCBsb2FkQXVkaW8gPSB0cnVlKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlLnBsYXlBdWRpby4je2tleX1cIiwgKHZhbHVlKSA9PlxuICAgICAgICBAY29uZltrZXldID0gdmFsdWVcbiAgICAgICAgQGxvYWRBdWRpbygpIGlmIGxvYWRBdWRpb1xuICAgIClcblxuICBpbml0Q29uZmlnU3Vic2NyaWJlcnM6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBvYnNlcnZlICdhdWRpb2NsaXAnXG4gICAgQG9ic2VydmUgJ2N1c3RvbUF1ZGlvY2xpcCdcbiAgICBAb2JzZXJ2ZSAndm9sdW1lJywgZmFsc2VcblxuICBsb2FkQXVkaW86IC0+XG4gICAgaWYgQGNvbmZbJ2F1ZGlvY2xpcCddIGlzICdjdXN0b21BdWRpb2NsaXAnIGFuZCBAY29uZlsnY3VzdG9tQXVkaW9jbGlwJ11cbiAgICAgIHBhdGh0b2F1ZGlvID0gQGNvbmZbJ2N1c3RvbUF1ZGlvY2xpcCddXG4gICAgZWxzZVxuICAgICAgcGF0aHRvYXVkaW8gPSBwYXRoLmpvaW4oXCIje19fZGlybmFtZX0vLi5cIiwgQGNvbmZbJ2F1ZGlvY2xpcCddKVxuICAgIEBhdWRpbyA9IG5ldyBBdWRpbyhwYXRodG9hdWRpbylcblxuICBwbGF5OiAoYXVkaW8pIC0+XG4gICAgcmV0dXJuIGlmIG5vdCBAZW5hYmxlZFxuXG4gICAgYXVkaW8gPSBAYXVkaW8gaWYgbm90IGF1ZGlvXG4gICAgYXVkaW8uY3VycmVudFRpbWUgPSAwXG4gICAgYXVkaW8udm9sdW1lID0gQGNvbmZbJ3ZvbHVtZSddXG4gICAgYXVkaW8ucGxheSgpXG4iXX0=
