'use babel';
'use strict';

var _this = this;

describe('AMU ui options', function () {
    beforeEach(function () {
        _this.workspace = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(_this.workspace);

        waitsForPromise('Theme Activation', function () {
            return atom.packages.activatePackage('atom-material-ui');
        });
    });

    it('should be able to cast shadows', function () {
        atom.config.set('atom-material-ui.ui.panelShadows', false);
        expect(_this.workspace.classList.contains('panel-shadows')).toBe(false);

        atom.config.set('atom-material-ui.ui.panelShadows', true);
        expect(_this.workspace.classList.contains('panel-shadows')).toBe(true);
    });

    it('should be able to add contrast to panels', function () {
        atom.config.set('atom-material-ui.ui.panelContrast', false);
        expect(_this.workspace.classList.contains('panel-contrast')).toBe(false);

        atom.config.set('atom-material-ui.ui.panelContrast', true);
        expect(_this.workspace.classList.contains('panel-contrast')).toBe(true);
    });

    it('should be able to toggle animations', function () {
        atom.config.set('atom-material-ui.ui.animations', false);
        expect(_this.workspace.classList.contains('use-animations')).toBe(false);

        atom.config.set('atom-material-ui.ui.animations', true);
        expect(_this.workspace.classList.contains('use-animations')).toBe(true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL3NwZWMvc2V0dGluZ3MtdWktc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7QUFDWixZQUFZLENBQUM7Ozs7QUFFYixRQUFRLENBQUMsZ0JBQWdCLEVBQUUsWUFBTTtBQUM3QixjQUFVLENBQUMsWUFBTTtBQUNiLGNBQUssU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNwRCxlQUFPLENBQUMsV0FBVyxDQUFDLE1BQUssU0FBUyxDQUFDLENBQUM7O0FBRXBDLHVCQUFlLENBQUMsa0JBQWtCLEVBQUUsWUFBTTtBQUN0QyxtQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1NBQzVELENBQUMsQ0FBQztLQUNOLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsZ0NBQWdDLEVBQUUsWUFBTTtBQUN2QyxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMzRCxjQUFNLENBQUMsTUFBSyxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFdkUsWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUQsY0FBTSxDQUFDLE1BQUssU0FBUyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDekUsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQywwQ0FBMEMsRUFBRSxZQUFNO0FBQ2pELFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVELGNBQU0sQ0FBQyxNQUFLLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhFLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNELGNBQU0sQ0FBQyxNQUFLLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDMUUsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyxxQ0FBcUMsRUFBRSxZQUFNO0FBQzVDLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3pELGNBQU0sQ0FBQyxNQUFLLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhFLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hELGNBQU0sQ0FBQyxNQUFLLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDMUUsQ0FBQyxDQUFDO0NBQ04sQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL3NwZWMvc2V0dGluZ3MtdWktc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuJ3VzZSBzdHJpY3QnO1xuXG5kZXNjcmliZSgnQU1VIHVpIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHRoaXMud29ya3NwYWNlID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh0aGlzLndvcmtzcGFjZSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCdUaGVtZSBBY3RpdmF0aW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdG9tLW1hdGVyaWFsLXVpJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIGNhc3Qgc2hhZG93cycsICgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdG9tLW1hdGVyaWFsLXVpLnVpLnBhbmVsU2hhZG93cycsIGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KHRoaXMud29ya3NwYWNlLmNsYXNzTGlzdC5jb250YWlucygncGFuZWwtc2hhZG93cycpKS50b0JlKGZhbHNlKTtcblxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2F0b20tbWF0ZXJpYWwtdWkudWkucGFuZWxTaGFkb3dzJywgdHJ1ZSk7XG4gICAgICAgIGV4cGVjdCh0aGlzLndvcmtzcGFjZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhbmVsLXNoYWRvd3MnKSkudG9CZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgYWJsZSB0byBhZGQgY29udHJhc3QgdG8gcGFuZWxzJywgKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2F0b20tbWF0ZXJpYWwtdWkudWkucGFuZWxDb250cmFzdCcsIGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KHRoaXMud29ya3NwYWNlLmNsYXNzTGlzdC5jb250YWlucygncGFuZWwtY29udHJhc3QnKSkudG9CZShmYWxzZSk7XG5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdG9tLW1hdGVyaWFsLXVpLnVpLnBhbmVsQ29udHJhc3QnLCB0cnVlKTtcbiAgICAgICAgZXhwZWN0KHRoaXMud29ya3NwYWNlLmNsYXNzTGlzdC5jb250YWlucygncGFuZWwtY29udHJhc3QnKSkudG9CZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgYWJsZSB0byB0b2dnbGUgYW5pbWF0aW9ucycsICgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdG9tLW1hdGVyaWFsLXVpLnVpLmFuaW1hdGlvbnMnLCBmYWxzZSk7XG4gICAgICAgIGV4cGVjdCh0aGlzLndvcmtzcGFjZS5jbGFzc0xpc3QuY29udGFpbnMoJ3VzZS1hbmltYXRpb25zJykpLnRvQmUoZmFsc2UpO1xuXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYXRvbS1tYXRlcmlhbC11aS51aS5hbmltYXRpb25zJywgdHJ1ZSk7XG4gICAgICAgIGV4cGVjdCh0aGlzLndvcmtzcGFjZS5jbGFzc0xpc3QuY29udGFpbnMoJ3VzZS1hbmltYXRpb25zJykpLnRvQmUodHJ1ZSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/Users/victor.martins/.atom/packages/atom-material-ui/spec/settings-ui-spec.js
