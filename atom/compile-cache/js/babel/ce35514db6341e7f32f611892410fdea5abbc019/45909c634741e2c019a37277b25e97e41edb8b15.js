function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _fs = require('fs');

// eslint-disable-next-line import/no-extraneous-dependencies

var _tmp = require('tmp');

var _tmp2 = _interopRequireDefault(_tmp);

'use babel';

var lint = require('../src/index.js').provideLinter().lint;

var badPath = path.join(__dirname, 'fixtures', 'lintableFiles', 'bad.rb');
var emptyPath = path.join(__dirname, 'fixtures', 'lintableFiles', 'empty.rb');
var goodPath = path.join(__dirname, 'fixtures', 'lintableFiles', 'good.rb');
var invalidWithUrlPath = path.join(__dirname, 'fixtures', 'lintableFiles', 'invalid_with_url.rb');
var ruby23Path = path.join(__dirname, 'fixtures', 'lintableFiles', 'ruby_2_3.rb');
var ruby23PathYml22 = path.join(__dirname, 'fixtures', 'yml2_2', 'ruby_2_3.rb');

describe('The RuboCop provider for Linter', function () {
  beforeEach(function () {
    // Reset/set project path to fixtures
    atom.project.setPaths([path.join(__dirname, 'fixtures')]);

    atom.workspace.destroyActivePaneItem();

    // Info about this beforeEach() implementation:
    // https://github.com/AtomLinter/Meta/issues/15
    var activationPromise = atom.packages.activatePackage('linter-rubocop');

    waitsForPromise(function () {
      return atom.packages.activatePackage('language-ruby').then(function () {
        return atom.workspace.open(goodPath);
      });
    });

    atom.packages.triggerDeferredActivationHooks();
    waitsForPromise(function () {
      return activationPromise;
    });
  });

  it('should be in the packages list', function () {
    return expect(atom.packages.isPackageLoaded('linter-rubocop')).toBe(true);
  });

  it('should be an active package', function () {
    return expect(atom.packages.isPackageActive('linter-rubocop')).toBe(true);
  });

  describe('shows errors in a file with errors', function () {
    var editor = null;

    beforeEach(function () {
      waitsForPromise(function () {
        return atom.workspace.open(badPath).then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('verifies the first message', function () {
      var msgText = 'unterminated string meets end of file\n(Using Ruby 2.3 parser; ' + 'configure using `TargetRubyVersion` parameter, under `AllCops`) (Syntax)';

      waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          expect(messages[0].severity).toBe('error');
          expect(messages[0].excerpt).toBe(msgText);
          expect(messages[0].description).toBe(null);
          expect(messages[0].location.file).toBe(badPath);
          expect(messages[0].location.position).toEqual([[1, 6], [1, 7]]);
        });
      });
    });
  });

  describe('shows errors with a clickable link in a file with warnings', function () {
    var editor = null;

    beforeEach(function () {
      waitsForPromise(function () {
        return atom.workspace.open(invalidWithUrlPath).then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('verifies the first message', function () {
      var msgText = "Prefer single-quoted strings when you don't need " + 'string interpolation or special symbols. (Style/StringLiterals)';

      waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          expect(messages[0].severity).toBe('info');
          expect(messages[0].excerpt).toBe(msgText);
          expect(messages[0].location.file).toBe(invalidWithUrlPath);
          expect(messages[0].location.position).toEqual([[2, 6], [2, 20]]);
          waitsForPromise(function () {
            return messages[0].description().then(function (desc) {
              return expect(desc).toBeTruthy();
            });
          });
        });
      });
    });
  });

  it('finds nothing wrong with an empty file', function () {
    waitsForPromise(function () {
      return atom.workspace.open(emptyPath).then(function (editor) {
        return lint(editor).then(function (messages) {
          return expect(messages.length).toBe(0);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', function () {
    waitsForPromise(function () {
      return atom.workspace.open(goodPath).then(function (editor) {
        return lint(editor).then(function (messages) {
          return expect(messages.length).toBe(0);
        });
      });
    });
  });

  describe('respects .ruby-version when .rubycop.yml has not defined ruby version', function () {
    it('finds violations when .rubocop.yml sets syntax to Ruby 2.2', function () {
      atom.project.setPaths([path.join(__dirname, 'fixtures', 'yml2_2')]);
      waitsForPromise(function () {
        return atom.workspace.open(ruby23PathYml22).then(function (editor) {
          return lint(editor).then(function (messages) {
            return expect(messages.length).toBe(1);
          });
        });
      });
    });

    it('finds nothing wrong with a file when .rubocop.yml does not override the Ruby version', function () {
      waitsForPromise(function () {
        return atom.workspace.open(ruby23Path).then(function (editor) {
          return lint(editor).then(function (messages) {
            return expect(messages.length).toBe(0);
          });
        });
      });
    });
  });

  describe('allows the user to autocorrect the current file', function () {
    var doneCorrecting = undefined;
    var tmpobj = _tmp2['default'].fileSync({ postfix: '.rb' });
    var checkNotificaton = function checkNotificaton(notification) {
      var message = notification.getMessage();
      if (message === 'Linter-Rubocop: No fixes were made') {
        expect(notification.getType()).toBe('info');
      } else {
        expect(message).toMatch(/Linter-Rubocop: Fixed \d offenses/);
        expect(notification.getType()).toBe('success');
      }
      doneCorrecting = true;
    };

    beforeEach(function () {
      (0, _fs.truncateSync)(tmpobj.name);
      doneCorrecting = false;
    });

    it('corrects the bad file', function () {
      (0, _fs.writeFileSync)(tmpobj.name, (0, _fs.readFileSync)(invalidWithUrlPath));
      waitsForPromise(function () {
        return atom.workspace.open(tmpobj.name).then(function (editor) {
          atom.notifications.onDidAddNotification(checkNotificaton);
          atom.commands.dispatch(atom.views.getView(editor), 'linter-rubocop:fix-file');
        });
      });
      waitsFor(function () {
        return doneCorrecting;
      }, 'Notification type should be checked');
    });

    it("doesn't modify a good file", function () {
      waitsForPromise(function () {
        return atom.workspace.open(goodPath).then(function (editor) {
          atom.notifications.onDidAddNotification(checkNotificaton);
          atom.commands.dispatch(atom.views.getView(editor), 'linter-rubocop:fix-file');
        });
      });
      waitsFor(function () {
        return doneCorrecting;
      }, 'Notification type should be checked');
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVib2NvcC9zcGVjL2xpbnRlci1ydWJvY29wLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFc0IsTUFBTTs7SUFBaEIsSUFBSTs7a0JBQzBDLElBQUk7Ozs7bUJBRTlDLEtBQUs7Ozs7QUFMckIsV0FBVyxDQUFBOztBQU9YLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQTs7QUFFNUQsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUMzRSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQy9FLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDN0UsSUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLHFCQUFxQixDQUFDLENBQUE7QUFDbkcsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQTtBQUNuRixJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFBOztBQUVqRixRQUFRLENBQUMsaUNBQWlDLEVBQUUsWUFBTTtBQUNoRCxZQUFVLENBQUMsWUFBTTs7QUFFZixRQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUks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Ii9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVib2NvcC9zcGVjL2xpbnRlci1ydWJvY29wLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyB0cnVuY2F0ZVN5bmMsIHdyaXRlRmlsZVN5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJ1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHRtcCBmcm9tICd0bXAnXG5cbmNvbnN0IGxpbnQgPSByZXF1aXJlKCcuLi9zcmMvaW5kZXguanMnKS5wcm92aWRlTGludGVyKCkubGludFxuXG5jb25zdCBiYWRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ2xpbnRhYmxlRmlsZXMnLCAnYmFkLnJiJylcbmNvbnN0IGVtcHR5UGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdsaW50YWJsZUZpbGVzJywgJ2VtcHR5LnJiJylcbmNvbnN0IGdvb2RQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ2xpbnRhYmxlRmlsZXMnLCAnZ29vZC5yYicpXG5jb25zdCBpbnZhbGlkV2l0aFVybFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnbGludGFibGVGaWxlcycsICdpbnZhbGlkX3dpdGhfdXJsLnJiJylcbmNvbnN0IHJ1YnkyM1BhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnbGludGFibGVGaWxlcycsICdydWJ5XzJfMy5yYicpXG5jb25zdCBydWJ5MjNQYXRoWW1sMjIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAneW1sMl8yJywgJ3J1YnlfMl8zLnJiJylcblxuZGVzY3JpYmUoJ1RoZSBSdWJvQ29wIHByb3ZpZGVyIGZvciBMaW50ZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIC8vIFJlc2V0L3NldCBwcm9qZWN0IHBhdGggdG8gZml4dHVyZXNcbiAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW3BhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycpXSlcblxuICAgIGF0b20ud29ya3NwYWNlLmRlc3Ryb3lBY3RpdmVQYW5lSXRlbSgpXG5cbiAgICAvLyBJbmZvIGFib3V0IHRoaXMgYmVmb3JlRWFjaCgpIGltcGxlbWVudGF0aW9uOlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9BdG9tTGludGVyL01ldGEvaXNzdWVzLzE1XG4gICAgY29uc3QgYWN0aXZhdGlvblByb21pc2UgPVxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xpbnRlci1ydWJvY29wJylcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLXJ1YnknKS50aGVuKCgpID0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZ29vZFBhdGgpLFxuICAgICkpXG5cbiAgICBhdG9tLnBhY2thZ2VzLnRyaWdnZXJEZWZlcnJlZEFjdGl2YXRpb25Ib29rcygpXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGFjdGl2YXRpb25Qcm9taXNlKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgYmUgaW4gdGhlIHBhY2thZ2VzIGxpc3QnLCAoKSA9PlxuICAgIGV4cGVjdChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUxvYWRlZCgnbGludGVyLXJ1Ym9jb3AnKSkudG9CZSh0cnVlKSxcbiAgKVxuXG4gIGl0KCdzaG91bGQgYmUgYW4gYWN0aXZlIHBhY2thZ2UnLCAoKSA9PlxuICAgIGV4cGVjdChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUFjdGl2ZSgnbGludGVyLXJ1Ym9jb3AnKSkudG9CZSh0cnVlKSxcbiAgKVxuXG4gIGRlc2NyaWJlKCdzaG93cyBlcnJvcnMgaW4gYSBmaWxlIHdpdGggZXJyb3JzJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3IgPSBudWxsXG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGJhZFBhdGgpLnRoZW4oKG9wZW5FZGl0b3IpID0+IHsgZWRpdG9yID0gb3BlbkVkaXRvciB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3ZlcmlmaWVzIHRoZSBmaXJzdCBtZXNzYWdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbXNnVGV4dCA9ICd1bnRlcm1pbmF0ZWQgc3RyaW5nIG1lZXRzIGVuZCBvZiBmaWxlXFxuKFVzaW5nIFJ1YnkgMi4zIHBhcnNlcjsgJyArXG4gICAgICAgICdjb25maWd1cmUgdXNpbmcgYFRhcmdldFJ1YnlWZXJzaW9uYCBwYXJhbWV0ZXIsIHVuZGVyIGBBbGxDb3BzYCkgKFN5bnRheCknXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBsaW50KGVkaXRvcikudGhlbigobWVzc2FnZXMpID0+IHtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ2Vycm9yJylcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0uZXhjZXJwdCkudG9CZShtc2dUZXh0KVxuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5kZXNjcmlwdGlvbikudG9CZShudWxsKVxuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5maWxlKS50b0JlKGJhZFBhdGgpXG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLnBvc2l0aW9uKS50b0VxdWFsKFtbMSwgNl0sIFsxLCA3XV0pXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3Nob3dzIGVycm9ycyB3aXRoIGEgY2xpY2thYmxlIGxpbmsgaW4gYSBmaWxlIHdpdGggd2FybmluZ3MnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvciA9IG51bGxcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oaW52YWxpZFdpdGhVcmxQYXRoKS50aGVuKChvcGVuRWRpdG9yKSA9PiB7IGVkaXRvciA9IG9wZW5FZGl0b3IgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCd2ZXJpZmllcyB0aGUgZmlyc3QgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1zZ1RleHQgPSBcIlByZWZlciBzaW5nbGUtcXVvdGVkIHN0cmluZ3Mgd2hlbiB5b3UgZG9uJ3QgbmVlZCBcIiArXG4gICAgICAgICdzdHJpbmcgaW50ZXJwb2xhdGlvbiBvciBzcGVjaWFsIHN5bWJvbHMuIChTdHlsZS9TdHJpbmdMaXRlcmFscyknXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBsaW50KGVkaXRvcikudGhlbigobWVzc2FnZXMpID0+IHtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ2luZm8nKVxuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5leGNlcnB0KS50b0JlKG1zZ1RleHQpXG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLmZpbGUpLnRvQmUoaW52YWxpZFdpdGhVcmxQYXRoKVxuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5wb3NpdGlvbikudG9FcXVhbChbWzIsIDZdLCBbMiwgMjBdXSlcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gbWVzc2FnZXNbMF0uZGVzY3JpcHRpb24oKS50aGVuKGRlc2MgPT4gZXhwZWN0KGRlc2MpLnRvQmVUcnV0aHkoKSkpXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgaXQoJ2ZpbmRzIG5vdGhpbmcgd3Jvbmcgd2l0aCBhbiBlbXB0eSBmaWxlJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihlbXB0eVBhdGgpLnRoZW4oZWRpdG9yID0+XG4gICAgICAgIGxpbnQoZWRpdG9yKS50aGVuKG1lc3NhZ2VzID0+XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKSxcbiAgICAgICAgKSxcbiAgICAgICksXG4gICAgKVxuICB9KVxuXG4gIGl0KCdmaW5kcyBub3RoaW5nIHdyb25nIHdpdGggYSB2YWxpZCBmaWxlJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbihnb29kUGF0aCkudGhlbihlZGl0b3IgPT5cbiAgICAgICAgbGludChlZGl0b3IpLnRoZW4obWVzc2FnZXMgPT5cbiAgICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDApLFxuICAgICAgICApLFxuICAgICAgKSxcbiAgICApXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3Jlc3BlY3RzIC5ydWJ5LXZlcnNpb24gd2hlbiAucnVieWNvcC55bWwgaGFzIG5vdCBkZWZpbmVkIHJ1YnkgdmVyc2lvbicsICgpID0+IHtcbiAgICBpdCgnZmluZHMgdmlvbGF0aW9ucyB3aGVuIC5ydWJvY29wLnltbCBzZXRzIHN5bnRheCB0byBSdWJ5IDIuMicsICgpID0+IHtcbiAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ3ltbDJfMicpXSlcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHJ1YnkyM1BhdGhZbWwyMikudGhlbihlZGl0b3IgPT5cbiAgICAgICAgICBsaW50KGVkaXRvcikudGhlbihtZXNzYWdlcyA9PlxuICAgICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKSxcbiAgICAgICAgICApLFxuICAgICAgICApLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnZmluZHMgbm90aGluZyB3cm9uZyB3aXRoIGEgZmlsZSB3aGVuIC5ydWJvY29wLnltbCBkb2VzIG5vdCBvdmVycmlkZSB0aGUgUnVieSB2ZXJzaW9uJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4ocnVieTIzUGF0aCkudGhlbihlZGl0b3IgPT5cbiAgICAgICAgICBsaW50KGVkaXRvcikudGhlbihtZXNzYWdlcyA9PlxuICAgICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKSxcbiAgICAgICAgICApLFxuICAgICAgICApLFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2FsbG93cyB0aGUgdXNlciB0byBhdXRvY29ycmVjdCB0aGUgY3VycmVudCBmaWxlJywgKCkgPT4ge1xuICAgIGxldCBkb25lQ29ycmVjdGluZ1xuICAgIGNvbnN0IHRtcG9iaiA9IHRtcC5maWxlU3luYyh7IHBvc3RmaXg6ICcucmInIH0pXG4gICAgY29uc3QgY2hlY2tOb3RpZmljYXRvbiA9IChub3RpZmljYXRpb24pID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBub3RpZmljYXRpb24uZ2V0TWVzc2FnZSgpXG4gICAgICBpZiAobWVzc2FnZSA9PT0gJ0xpbnRlci1SdWJvY29wOiBObyBmaXhlcyB3ZXJlIG1hZGUnKSB7XG4gICAgICAgIGV4cGVjdChub3RpZmljYXRpb24uZ2V0VHlwZSgpKS50b0JlKCdpbmZvJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlKS50b01hdGNoKC9MaW50ZXItUnVib2NvcDogRml4ZWQgXFxkIG9mZmVuc2VzLylcbiAgICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvbi5nZXRUeXBlKCkpLnRvQmUoJ3N1Y2Nlc3MnKVxuICAgICAgfVxuICAgICAgZG9uZUNvcnJlY3RpbmcgPSB0cnVlXG4gICAgfVxuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB0cnVuY2F0ZVN5bmModG1wb2JqLm5hbWUpXG4gICAgICBkb25lQ29ycmVjdGluZyA9IGZhbHNlXG4gICAgfSlcblxuICAgIGl0KCdjb3JyZWN0cyB0aGUgYmFkIGZpbGUnLCAoKSA9PiB7XG4gICAgICB3cml0ZUZpbGVTeW5jKHRtcG9iai5uYW1lLCByZWFkRmlsZVN5bmMoaW52YWxpZFdpdGhVcmxQYXRoKSlcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHRtcG9iai5uYW1lKS50aGVuKChlZGl0b3IpID0+IHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMub25EaWRBZGROb3RpZmljYXRpb24oY2hlY2tOb3RpZmljYXRvbilcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLCAnbGludGVyLXJ1Ym9jb3A6Zml4LWZpbGUnKVxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICAgIHdhaXRzRm9yKFxuICAgICAgICAoKSA9PiBkb25lQ29ycmVjdGluZyxcbiAgICAgICAgJ05vdGlmaWNhdGlvbiB0eXBlIHNob3VsZCBiZSBjaGVja2VkJyxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoXCJkb2Vzbid0IG1vZGlmeSBhIGdvb2QgZmlsZVwiLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbihnb29kUGF0aCkudGhlbigoZWRpdG9yKSA9PiB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLm9uRGlkQWRkTm90aWZpY2F0aW9uKGNoZWNrTm90aWZpY2F0b24pXG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgJ2xpbnRlci1ydWJvY29wOmZpeC1maWxlJylcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgICB3YWl0c0ZvcihcbiAgICAgICAgKCkgPT4gZG9uZUNvcnJlY3RpbmcsXG4gICAgICAgICdOb3RpZmljYXRpb24gdHlwZSBzaG91bGQgYmUgY2hlY2tlZCcsXG4gICAgICApXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=