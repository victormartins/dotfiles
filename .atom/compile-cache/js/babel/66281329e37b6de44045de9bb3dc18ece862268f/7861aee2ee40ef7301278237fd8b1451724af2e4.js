function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('./helpers/workspace');

var _libMinimap = require('../lib/minimap');

var _libMinimap2 = _interopRequireDefault(_libMinimap);

var _libMinimapElement = require('../lib/minimap-element');

var _libMinimapElement2 = _interopRequireDefault(_libMinimapElement);

'use babel';

describe('Minimap package', function () {
  var _ref = [];
  var editor = _ref[0];
  var minimap = _ref[1];
  var editorElement = _ref[2];
  var minimapElement = _ref[3];
  var workspaceElement = _ref[4];
  var minimapPackage = _ref[5];

  beforeEach(function () {
    atom.config.set('minimap.autoToggle', true);

    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);

    _libMinimapElement2['default'].registerViewProvider(_libMinimap2['default']);

    waitsForPromise(function () {
      return atom.workspace.open('sample.coffee');
    });

    waitsForPromise(function () {
      return atom.packages.activatePackage('minimap').then(function (pkg) {
        minimapPackage = pkg.mainModule;
      });
    });

    waitsFor(function () {
      return workspaceElement.querySelector('atom-text-editor');
    });

    runs(function () {
      editor = atom.workspace.getActiveTextEditor();
      editorElement = atom.views.getView(editor);
    });

    waitsFor(function () {
      return workspaceElement.querySelector('atom-text-editor::shadow atom-text-editor-minimap');
    });
  });

  it('registers the minimap views provider', function () {
    var textEditor = atom.workspace.buildTextEditor({});
    minimap = new _libMinimap2['default']({ textEditor: textEditor });
    minimapElement = atom.views.getView(minimap);

    expect(minimapElement).toExist();
  });

  describe('when an editor is opened', function () {
    it('creates a minimap model for the editor', function () {
      expect(minimapPackage.minimapForEditor(editor)).toBeDefined();
    });

    it('attaches a minimap element to the editor view', function () {
      expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).toExist();
    });
  });

  describe('::observeMinimaps', function () {
    var _ref2 = [];
    var spy = _ref2[0];

    beforeEach(function () {
      spy = jasmine.createSpy('observeMinimaps');
      minimapPackage.observeMinimaps(spy);
    });

    it('calls the callback with the existing minimaps', function () {
      expect(spy).toHaveBeenCalled();
    });

    it('calls the callback when a new editor is opened', function () {
      waitsForPromise(function () {
        return atom.workspace.open('other-sample.js');
      });

      runs(function () {
        expect(spy.calls.length).toEqual(2);
      });
    });
  });

  describe('::deactivate', function () {
    beforeEach(function () {
      minimapPackage.deactivate();
    });

    it('destroys all the minimap models', function () {
      expect(minimapPackage.editorsMinimaps).toBeUndefined();
    });

    it('destroys all the minimap elements', function () {
      expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).not.toExist();
    });
  });

  describe('service', function () {
    it('returns the minimap main module', function () {
      expect(minimapPackage.provideMinimapServiceV1()).toEqual(minimapPackage);
    });

    it('creates standalone minimap with provided text editor', function () {
      var textEditor = atom.workspace.buildTextEditor({});
      var standaloneMinimap = minimapPackage.standAloneMinimapForEditor(textEditor);
      expect(standaloneMinimap.getTextEditor()).toEqual(textEditor);
    });
  });

  //    ########  ##       ##     ##  ######   #### ##    ##  ######
  //    ##     ## ##       ##     ## ##    ##   ##  ###   ## ##    ##
  //    ##     ## ##       ##     ## ##         ##  ####  ## ##
  //    ########  ##       ##     ## ##   ####  ##  ## ## ##  ######
  //    ##        ##       ##     ## ##    ##   ##  ##  ####       ##
  //    ##        ##       ##     ## ##    ##   ##  ##   ### ##    ##
  //    ##        ########  #######   ######   #### ##    ##  ######

  describe('plugins', function () {
    var _ref3 = [];
    var registerHandler = _ref3[0];
    var unregisterHandler = _ref3[1];
    var plugin = _ref3[2];

    beforeEach(function () {
      atom.config.set('minimap.displayPluginsControls', true);
      atom.config.set('minimap.plugins.dummy', undefined);

      plugin = {
        active: false,
        activatePlugin: function activatePlugin() {
          this.active = true;
        },
        deactivatePlugin: function deactivatePlugin() {
          this.active = false;
        },
        isActive: function isActive() {
          return this.active;
        }
      };

      spyOn(plugin, 'activatePlugin').andCallThrough();
      spyOn(plugin, 'deactivatePlugin').andCallThrough();

      registerHandler = jasmine.createSpy('register handler');
      unregisterHandler = jasmine.createSpy('unregister handler');
    });

    describe('when registered', function () {
      beforeEach(function () {
        minimapPackage.onDidAddPlugin(registerHandler);
        minimapPackage.onDidRemovePlugin(unregisterHandler);
        minimapPackage.registerPlugin('dummy', plugin);
      });

      it('makes the plugin available in the minimap', function () {
        expect(minimapPackage.plugins['dummy']).toBe(plugin);
      });

      it('emits an event', function () {
        expect(registerHandler).toHaveBeenCalled();
      });

      it('creates a default config for the plugin', function () {
        expect(minimapPackage.config.plugins.properties.dummy).toBeDefined();
        expect(minimapPackage.config.plugins.properties.dummyDecorationsZIndex).toBeDefined();
      });

      it('sets the corresponding config', function () {
        expect(atom.config.get('minimap.plugins.dummy')).toBeTruthy();
        expect(atom.config.get('minimap.plugins.dummyDecorationsZIndex')).toEqual(0);
      });

      describe('triggering the corresponding plugin command', function () {
        beforeEach(function () {
          atom.commands.dispatch(workspaceElement, 'minimap:toggle-dummy');
        });

        it('receives a deactivation call', function () {
          expect(plugin.deactivatePlugin).toHaveBeenCalled();
        });
      });

      describe('and then unregistered', function () {
        beforeEach(function () {
          minimapPackage.unregisterPlugin('dummy');
        });

        it('has been unregistered', function () {
          expect(minimapPackage.plugins['dummy']).toBeUndefined();
        });

        it('emits an event', function () {
          expect(unregisterHandler).toHaveBeenCalled();
        });

        describe('when the config is modified', function () {
          beforeEach(function () {
            atom.config.set('minimap.plugins.dummy', false);
          });

          it('does not activates the plugin', function () {
            expect(plugin.deactivatePlugin).not.toHaveBeenCalled();
          });
        });
      });

      describe('on minimap deactivation', function () {
        beforeEach(function () {
          expect(plugin.active).toBeTruthy();
          minimapPackage.deactivate();
        });

        it('deactivates all the plugins', function () {
          expect(plugin.active).toBeFalsy();
        });
      });
    });

    describe('when the config for it is false', function () {
      beforeEach(function () {
        atom.config.set('minimap.plugins.dummy', false);
        minimapPackage.registerPlugin('dummy', plugin);
      });

      it('does not receive an activation call', function () {
        expect(plugin.activatePlugin).not.toHaveBeenCalled();
      });
    });

    describe('the registered plugin', function () {
      beforeEach(function () {
        minimapPackage.registerPlugin('dummy', plugin);
      });

      it('receives an activation call', function () {
        expect(plugin.activatePlugin).toHaveBeenCalled();
      });

      it('activates the plugin', function () {
        expect(plugin.active).toBeTruthy();
      });

      describe('when the config is modified after registration', function () {
        beforeEach(function () {
          atom.config.set('minimap.plugins.dummy', false);
        });

        it('receives a deactivation call', function () {
          expect(plugin.deactivatePlugin).toHaveBeenCalled();
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL3NwZWMvbWluaW1hcC1tYWluLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7UUFFTyxxQkFBcUI7OzBCQUNSLGdCQUFnQjs7OztpQ0FDVCx3QkFBd0I7Ozs7QUFKbkQsV0FBVyxDQUFBOztBQU1YLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFNO2FBQ3lELEVBQUU7TUFBdEYsTUFBTTtNQUFFLE9BQU87TUFBRSxhQUFhO01BQUUsY0FBYztNQUFFLGdCQUFnQjtNQUFFLGNBQWM7O0FBRXJGLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUE7O0FBRTNDLG9CQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNyRCxXQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7O0FBRXJDLG1DQUFlLG9CQUFvQix5QkFBUyxDQUFBOztBQUU1QyxtQkFBZSxDQUFDLFlBQU07QUFDcEIsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtLQUM1QyxDQUFDLENBQUE7O0FBRUYsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQzVELHNCQUFjLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQTtPQUNoQyxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7O0FBRUYsWUFBUSxDQUFDLFlBQU07QUFDYixhQUFPLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0tBQzFELENBQUMsQ0FBQTs7QUFFRixRQUFJLENBQUMsWUFBTTtBQUNU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QUFDLGNBQWMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7T0FDakQsQ0FBQyxDQUFBOztBQUVGLFFBQUUsQ0FBQyxzQkFBc0IsRUFBRSxZQUFNO0FBQy9CLGNBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUE7T0FDbkMsQ0FBQyxDQUFBOztBQUVGLGNBQVEsQ0FBQyxnREFBZ0QsRUFBRSxZQUFNO0FBQy9ELGtCQUFVLENBQUMsWUFBTTtBQUNmLGNBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFBO1NBQ2hELENBQUMsQ0FBQTs7QUFFRixVQUFFLENBQUMsOEJBQThCLEVBQUUsWUFBTTtBQUN2QyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7U0FDbkQsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL3NwZWMvbWluaW1hcC1tYWluLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgJy4vaGVscGVycy93b3Jrc3BhY2UnXG5pbXBvcnQgTWluaW1hcCBmcm9tICcuLi9saWIvbWluaW1hcCdcbmltcG9ydCBNaW5pbWFwRWxlbWVudCBmcm9tICcuLi9saWIvbWluaW1hcC1lbGVtZW50J1xuXG5kZXNjcmliZSgnTWluaW1hcCBwYWNrYWdlJywgKCkgPT4ge1xuICBsZXQgW2VkaXRvciwgbWluaW1hcCwgZWRpdG9yRWxlbWVudCwgbWluaW1hcEVsZW1lbnQsIHdvcmtzcGFjZUVsZW1lbnQsIG1pbmltYXBQYWNrYWdlXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmF1dG9Ub2dnbGUnLCB0cnVlKVxuXG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpXG5cbiAgICBNaW5pbWFwRWxlbWVudC5yZWdpc3RlclZpZXdQcm92aWRlcihNaW5pbWFwKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUuY29mZmVlJylcbiAgICB9KVxuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbWluaW1hcCcpLnRoZW4oKHBrZykgPT4ge1xuICAgICAgICBtaW5pbWFwUGFja2FnZSA9IHBrZy5tYWluTW9kdWxlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhdG9tLXRleHQtZWRpdG9yJylcbiAgICB9KVxuXG4gICAgcnVucygoKSA9PiB7XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgIH0pXG5cbiAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhdG9tLXRleHQtZWRpdG9yOjpzaGFkb3cgYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwJylcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdyZWdpc3RlcnMgdGhlIG1pbmltYXAgdmlld3MgcHJvdmlkZXInLCAoKSA9PiB7XG4gICAgbGV0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3Ioe30pXG4gICAgbWluaW1hcCA9IG5ldyBNaW5pbWFwKHt0ZXh0RWRpdG9yfSlcbiAgICBtaW5pbWFwRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhtaW5pbWFwKVxuXG4gICAgZXhwZWN0KG1pbmltYXBFbGVtZW50KS50b0V4aXN0KClcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiBhbiBlZGl0b3IgaXMgb3BlbmVkJywgKCkgPT4ge1xuICAgIGl0KCdjcmVhdGVzIGEgbWluaW1hcCBtb2RlbCBmb3IgdGhlIGVkaXRvcicsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5taW5pbWFwRm9yRWRpdG9yKGVkaXRvcikpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ2F0dGFjaGVzIGEgbWluaW1hcCBlbGVtZW50IHRvIHRoZSBlZGl0b3IgdmlldycsICgpID0+IHtcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwJykpLnRvRXhpc3QoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJzo6b2JzZXJ2ZU1pbmltYXBzJywgKCkgPT4ge1xuICAgIGxldCBbc3B5XSA9IFtdXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgnb2JzZXJ2ZU1pbmltYXBzJylcbiAgICAgIG1pbmltYXBQYWNrYWdlLm9ic2VydmVNaW5pbWFwcyhzcHkpXG4gICAgfSlcblxuICAgIGl0KCdjYWxscyB0aGUgY2FsbGJhY2sgd2l0aCB0aGUgZXhpc3RpbmcgbWluaW1hcHMnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ2NhbGxzIHRoZSBjYWxsYmFjayB3aGVuIGEgbmV3IGVkaXRvciBpcyBvcGVuZWQnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4geyByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbignb3RoZXItc2FtcGxlLmpzJykgfSlcblxuICAgICAgcnVucygoKSA9PiB7IGV4cGVjdChzcHkuY2FsbHMubGVuZ3RoKS50b0VxdWFsKDIpIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnOjpkZWFjdGl2YXRlJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgbWluaW1hcFBhY2thZ2UuZGVhY3RpdmF0ZSgpXG4gICAgfSlcblxuICAgIGl0KCdkZXN0cm95cyBhbGwgdGhlIG1pbmltYXAgbW9kZWxzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG1pbmltYXBQYWNrYWdlLmVkaXRvcnNNaW5pbWFwcykudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdkZXN0cm95cyBhbGwgdGhlIG1pbmltYXAgZWxlbWVudHMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ2F0b20tdGV4dC1lZGl0b3ItbWluaW1hcCcpKS5ub3QudG9FeGlzdCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnc2VydmljZScsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyB0aGUgbWluaW1hcCBtYWluIG1vZHVsZScsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5wcm92aWRlTWluaW1hcFNlcnZpY2VWMSgpKS50b0VxdWFsKG1pbmltYXBQYWNrYWdlKVxuICAgIH0pXG5cbiAgICBpdCgnY3JlYXRlcyBzdGFuZGFsb25lIG1pbmltYXAgd2l0aCBwcm92aWRlZCB0ZXh0IGVkaXRvcicsICgpID0+IHtcbiAgICAgIGxldCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHt9KVxuICAgICAgbGV0IHN0YW5kYWxvbmVNaW5pbWFwID0gbWluaW1hcFBhY2thZ2Uuc3RhbmRBbG9uZU1pbmltYXBGb3JFZGl0b3IodGV4dEVkaXRvcilcbiAgICAgIGV4cGVjdChzdGFuZGFsb25lTWluaW1hcC5nZXRUZXh0RWRpdG9yKCkpLnRvRXF1YWwodGV4dEVkaXRvcilcbiAgICB9KVxuICB9KVxuXG4gIC8vICAgICMjIyMjIyMjICAjIyAgICAgICAjIyAgICAgIyMgICMjIyMjIyAgICMjIyMgIyMgICAgIyMgICMjIyMjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICMjICAgIyMgICMjIyAgICMjICMjICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgICAjIyAgIyMjIyAgIyMgIyNcbiAgLy8gICAgIyMjIyMjIyMgICMjICAgICAgICMjICAgICAjIyAjIyAgICMjIyMgICMjICAjIyAjIyAjIyAgIyMjIyMjXG4gIC8vICAgICMjICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgIyMgICAjIyAgIyMgICMjIyMgICAgICAgIyNcbiAgLy8gICAgIyMgICAgICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAjIyAgICMjICAjIyAgICMjIyAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgICAgIyMjIyMjIyMgICMjIyMjIyMgICAjIyMjIyMgICAjIyMjICMjICAgICMjICAjIyMjIyNcblxuICBkZXNjcmliZSgncGx1Z2lucycsICgpID0+IHtcbiAgICBsZXQgW3JlZ2lzdGVySGFuZGxlciwgdW5yZWdpc3RlckhhbmRsZXIsIHBsdWdpbl0gPSBbXVxuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAuZGlzcGxheVBsdWdpbnNDb250cm9scycsIHRydWUpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teScsIHVuZGVmaW5lZClcblxuICAgICAgcGx1Z2luID0ge1xuICAgICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgICBhY3RpdmF0ZVBsdWdpbiAoKSB7IHRoaXMuYWN0aXZlID0gdHJ1ZSB9LFxuICAgICAgICBkZWFjdGl2YXRlUGx1Z2luICgpIHsgdGhpcy5hY3RpdmUgPSBmYWxzZSB9LFxuICAgICAgICBpc0FjdGl2ZSAoKSB7IHJldHVybiB0aGlzLmFjdGl2ZSB9XG4gICAgICB9XG5cbiAgICAgIHNweU9uKHBsdWdpbiwgJ2FjdGl2YXRlUGx1Z2luJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgc3B5T24ocGx1Z2luLCAnZGVhY3RpdmF0ZVBsdWdpbicpLmFuZENhbGxUaHJvdWdoKClcblxuICAgICAgcmVnaXN0ZXJIYW5kbGVyID0gamFzbWluZS5jcmVhdGVTcHkoJ3JlZ2lzdGVyIGhhbmRsZXInKVxuICAgICAgdW5yZWdpc3RlckhhbmRsZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgndW5yZWdpc3RlciBoYW5kbGVyJylcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3doZW4gcmVnaXN0ZXJlZCcsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBtaW5pbWFwUGFja2FnZS5vbkRpZEFkZFBsdWdpbihyZWdpc3RlckhhbmRsZXIpXG4gICAgICAgIG1pbmltYXBQYWNrYWdlLm9uRGlkUmVtb3ZlUGx1Z2luKHVucmVnaXN0ZXJIYW5kbGVyKVxuICAgICAgICBtaW5pbWFwUGFja2FnZS5yZWdpc3RlclBsdWdpbignZHVtbXknLCBwbHVnaW4pXG4gICAgICB9KVxuXG4gICAgICBpdCgnbWFrZXMgdGhlIHBsdWdpbiBhdmFpbGFibGUgaW4gdGhlIG1pbmltYXAnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5wbHVnaW5zWydkdW1teSddKS50b0JlKHBsdWdpbilcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdlbWl0cyBhbiBldmVudCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJlZ2lzdGVySGFuZGxlcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnY3JlYXRlcyBhIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgcGx1Z2luJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWluaW1hcFBhY2thZ2UuY29uZmlnLnBsdWdpbnMucHJvcGVydGllcy5kdW1teSkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QobWluaW1hcFBhY2thZ2UuY29uZmlnLnBsdWdpbnMucHJvcGVydGllcy5kdW1teURlY29yYXRpb25zWkluZGV4KS50b0JlRGVmaW5lZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2V0cyB0aGUgY29ycmVzcG9uZGluZyBjb25maWcnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChhdG9tLmNvbmZpZy5nZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teScpKS50b0JlVHJ1dGh5KClcbiAgICAgICAgZXhwZWN0KGF0b20uY29uZmlnLmdldCgnbWluaW1hcC5wbHVnaW5zLmR1bW15RGVjb3JhdGlvbnNaSW5kZXgnKSkudG9FcXVhbCgwKVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoJ3RyaWdnZXJpbmcgdGhlIGNvcnJlc3BvbmRpbmcgcGx1Z2luIGNvbW1hbmQnLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ21pbmltYXA6dG9nZ2xlLWR1bW15JylcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgncmVjZWl2ZXMgYSBkZWFjdGl2YXRpb24gY2FsbCcsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QocGx1Z2luLmRlYWN0aXZhdGVQbHVnaW4pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoJ2FuZCB0aGVuIHVucmVnaXN0ZXJlZCcsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgbWluaW1hcFBhY2thZ2UudW5yZWdpc3RlclBsdWdpbignZHVtbXknKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KCdoYXMgYmVlbiB1bnJlZ2lzdGVyZWQnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1pbmltYXBQYWNrYWdlLnBsdWdpbnNbJ2R1bW15J10pLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KCdlbWl0cyBhbiBldmVudCcsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QodW5yZWdpc3RlckhhbmRsZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBjb25maWcgaXMgbW9kaWZpZWQnLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teScsIGZhbHNlKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpdCgnZG9lcyBub3QgYWN0aXZhdGVzIHRoZSBwbHVnaW4nLCAoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QocGx1Z2luLmRlYWN0aXZhdGVQbHVnaW4pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoJ29uIG1pbmltYXAgZGVhY3RpdmF0aW9uJywgKCkgPT4ge1xuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QocGx1Z2luLmFjdGl2ZSkudG9CZVRydXRoeSgpXG4gICAgICAgICAgbWluaW1hcFBhY2thZ2UuZGVhY3RpdmF0ZSgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaXQoJ2RlYWN0aXZhdGVzIGFsbCB0aGUgcGx1Z2lucycsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QocGx1Z2luLmFjdGl2ZSkudG9CZUZhbHN5KClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBjb25maWcgZm9yIGl0IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5wbHVnaW5zLmR1bW15JywgZmFsc2UpXG4gICAgICAgIG1pbmltYXBQYWNrYWdlLnJlZ2lzdGVyUGx1Z2luKCdkdW1teScsIHBsdWdpbilcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdkb2VzIG5vdCByZWNlaXZlIGFuIGFjdGl2YXRpb24gY2FsbCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHBsdWdpbi5hY3RpdmF0ZVBsdWdpbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3RoZSByZWdpc3RlcmVkIHBsdWdpbicsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBtaW5pbWFwUGFja2FnZS5yZWdpc3RlclBsdWdpbignZHVtbXknLCBwbHVnaW4pXG4gICAgICB9KVxuXG4gICAgICBpdCgncmVjZWl2ZXMgYW4gYWN0aXZhdGlvbiBjYWxsJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QocGx1Z2luLmFjdGl2YXRlUGx1Z2luKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdhY3RpdmF0ZXMgdGhlIHBsdWdpbicsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHBsdWdpbi5hY3RpdmUpLnRvQmVUcnV0aHkoKVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoJ3doZW4gdGhlIGNvbmZpZyBpcyBtb2RpZmllZCBhZnRlciByZWdpc3RyYXRpb24nLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5wbHVnaW5zLmR1bW15JywgZmFsc2UpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaXQoJ3JlY2VpdmVzIGEgZGVhY3RpdmF0aW9uIGNhbGwnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHBsdWdpbi5kZWFjdGl2YXRlUGx1Z2luKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=
//# sourceURL=/Users/victor.martins/.atom/packages/minimap/spec/minimap-main-spec.js
