(function() {
  var GitOps, ResolverView, util;

  ResolverView = require('../../lib/view/resolver-view').ResolverView;

  GitOps = require('../../lib/git').GitOps;

  util = require('../util');

  describe('ResolverView', function() {
    var fakeEditor, pkg, state, view, _ref;
    _ref = [], view = _ref[0], fakeEditor = _ref[1], pkg = _ref[2];
    state = {
      context: {
        isResolvedFile: function() {
          return Promise.resolve(false);
        },
        resolveFile: function() {},
        resolveText: "Stage"
      },
      relativize: function(filepath) {
        return filepath.slice("/fake/gitroot/".length);
      }
    };
    beforeEach(function() {
      pkg = util.pkgEmitter();
      fakeEditor = {
        isModified: function() {
          return true;
        },
        getURI: function() {
          return '/fake/gitroot/lib/file1.txt';
        },
        save: function() {},
        onDidSave: function() {}
      };
      return view = new ResolverView(fakeEditor, state, pkg);
    });
    it('begins needing both saving and staging', function() {
      waitsForPromise(function() {
        return view.refresh();
      });
      return runs(function() {
        return expect(view.actionText.text()).toBe('Save and stage');
      });
    });
    it('shows if the file only needs staged', function() {
      fakeEditor.isModified = function() {
        return false;
      };
      waitsForPromise(function() {
        return view.refresh();
      });
      return runs(function() {
        return expect(view.actionText.text()).toBe('Stage');
      });
    });
    return it('saves and stages the file', function() {
      var p;
      p = null;
      state.context.resolveFile = function(filepath) {
        p = filepath;
        return Promise.resolve();
      };
      spyOn(fakeEditor, 'save');
      waitsForPromise(function() {
        return view.resolve();
      });
      return runs(function() {
        expect(fakeEditor.save).toHaveBeenCalled();
        return expect(p).toBe('lib/file1.txt');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9zcGVjL3ZpZXcvcmVzb2x2ZXItdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQkFBQTs7QUFBQSxFQUFDLGVBQWdCLE9BQUEsQ0FBUSw4QkFBUixFQUFoQixZQUFELENBQUE7O0FBQUEsRUFFQyxTQUFVLE9BQUEsQ0FBUSxlQUFSLEVBQVYsTUFGRCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLGtDQUFBO0FBQUEsSUFBQSxPQUEwQixFQUExQixFQUFDLGNBQUQsRUFBTyxvQkFBUCxFQUFtQixhQUFuQixDQUFBO0FBQUEsSUFFQSxLQUFBLEdBQ0U7QUFBQSxNQUFBLE9BQUEsRUFDRTtBQUFBLFFBQUEsY0FBQSxFQUFnQixTQUFBLEdBQUE7aUJBQUcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsS0FBaEIsRUFBSDtRQUFBLENBQWhCO0FBQUEsUUFDQSxXQUFBLEVBQWEsU0FBQSxHQUFBLENBRGI7QUFBQSxRQUVBLFdBQUEsRUFBYSxPQUZiO09BREY7QUFBQSxNQUlBLFVBQUEsRUFBWSxTQUFDLFFBQUQsR0FBQTtlQUFjLFFBQVMsZ0NBQXZCO01BQUEsQ0FKWjtLQUhGLENBQUE7QUFBQSxJQVNBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsVUFBTCxDQUFBLENBQU4sQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFhO0FBQUEsUUFDWCxVQUFBLEVBQVksU0FBQSxHQUFBO2lCQUFHLEtBQUg7UUFBQSxDQUREO0FBQUEsUUFFWCxNQUFBLEVBQVEsU0FBQSxHQUFBO2lCQUFHLDhCQUFIO1FBQUEsQ0FGRztBQUFBLFFBR1gsSUFBQSxFQUFNLFNBQUEsR0FBQSxDQUhLO0FBQUEsUUFJWCxTQUFBLEVBQVcsU0FBQSxHQUFBLENBSkE7T0FEYixDQUFBO2FBUUEsSUFBQSxHQUFXLElBQUEsWUFBQSxDQUFhLFVBQWIsRUFBeUIsS0FBekIsRUFBZ0MsR0FBaEMsRUFURjtJQUFBLENBQVgsQ0FUQSxDQUFBO0FBQUEsSUFvQkEsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUEsR0FBQTtBQUMzQyxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBQSxFQUFIO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO2FBQ0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtlQUFHLE1BQUEsQ0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQWhCLENBQUEsQ0FBUCxDQUE4QixDQUFDLElBQS9CLENBQW9DLGdCQUFwQyxFQUFIO01BQUEsQ0FBTCxFQUYyQztJQUFBLENBQTdDLENBcEJBLENBQUE7QUFBQSxJQXdCQSxFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLE1BQUEsVUFBVSxDQUFDLFVBQVgsR0FBd0IsU0FBQSxHQUFBO2VBQUcsTUFBSDtNQUFBLENBQXhCLENBQUE7QUFBQSxNQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBQSxFQUFIO01BQUEsQ0FBaEIsQ0FEQSxDQUFBO2FBRUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtlQUFHLE1BQUEsQ0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQWhCLENBQUEsQ0FBUCxDQUE4QixDQUFDLElBQS9CLENBQW9DLE9BQXBDLEVBQUg7TUFBQSxDQUFMLEVBSHdDO0lBQUEsQ0FBMUMsQ0F4QkEsQ0FBQTtXQTZCQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFVBQUEsQ0FBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLElBQUosQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFkLEdBQTRCLFNBQUMsUUFBRCxHQUFBO0FBQzFCLFFBQUEsQ0FBQSxHQUFJLFFBQUosQ0FBQTtlQUNBLE9BQU8sQ0FBQyxPQUFSLENBQUEsRUFGMEI7TUFBQSxDQUQ1QixDQUFBO0FBQUEsTUFLQSxLQUFBLENBQU0sVUFBTixFQUFrQixNQUFsQixDQUxBLENBQUE7QUFBQSxNQU9BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBQSxFQUFIO01BQUEsQ0FBaEIsQ0FQQSxDQUFBO2FBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsTUFBQSxDQUFPLFVBQVUsQ0FBQyxJQUFsQixDQUF1QixDQUFDLGdCQUF4QixDQUFBLENBQUEsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxDQUFQLENBQVMsQ0FBQyxJQUFWLENBQWUsZUFBZixFQUZHO01BQUEsQ0FBTCxFQVY4QjtJQUFBLENBQWhDLEVBOUJ1QjtFQUFBLENBQXpCLENBTEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/victor.martins/.atom/packages/merge-conflicts/spec/view/resolver-view-spec.coffee
