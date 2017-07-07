(function() {
  var throttle;

  throttle = require("lodash.throttle");

  module.exports = {
    title: 'Play Audio',
    description: 'Plays selected audio on typing.',
    enable: function(api) {
      this.api = api;
      return this.throttledPlayAudio = throttle(this.api.playAudio.bind(this.api), 100, {
        trailing: false
      });
    },
    onInput: function() {
      return this.throttledPlayAudio();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvcGx1Z2luL3BsYXktYXVkaW8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxLQUFBLEVBQU8sWUFBUDtJQUNBLFdBQUEsRUFBYSxpQ0FEYjtJQUdBLE1BQUEsRUFBUSxTQUFDLEdBQUQ7TUFDTixJQUFDLENBQUEsR0FBRCxHQUFPO2FBQ1AsSUFBQyxDQUFBLGtCQUFELEdBQXNCLFFBQUEsQ0FBUyxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUMsQ0FBQSxHQUFyQixDQUFULEVBQW9DLEdBQXBDLEVBQXlDO1FBQUEsUUFBQSxFQUFVLEtBQVY7T0FBekM7SUFGaEIsQ0FIUjtJQU9BLE9BQUEsRUFBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBLGtCQUFELENBQUE7SUFETyxDQVBUOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsidGhyb3R0bGUgPSByZXF1aXJlIFwibG9kYXNoLnRocm90dGxlXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICB0aXRsZTogJ1BsYXkgQXVkaW8nXG4gIGRlc2NyaXB0aW9uOiAnUGxheXMgc2VsZWN0ZWQgYXVkaW8gb24gdHlwaW5nLidcblxuICBlbmFibGU6IChhcGkpIC0+XG4gICAgQGFwaSA9IGFwaVxuICAgIEB0aHJvdHRsZWRQbGF5QXVkaW8gPSB0aHJvdHRsZSBAYXBpLnBsYXlBdWRpby5iaW5kKEBhcGkpLCAxMDAsIHRyYWlsaW5nOiBmYWxzZVxuXG4gIG9uSW5wdXQ6IC0+XG4gICAgQHRocm90dGxlZFBsYXlBdWRpbygpXG4iXX0=
