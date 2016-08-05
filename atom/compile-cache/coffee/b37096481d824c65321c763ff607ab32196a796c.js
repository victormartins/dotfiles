(function() {
  var Beautifier, Beautifiers, Languages, beautifiers, isWindows, _;

  Beautifiers = require("../src/beautifiers");

  beautifiers = new Beautifiers();

  Beautifier = require("../src/beautifiers/beautifier");

  Languages = require('../src/languages/');

  _ = require('lodash');

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("Atom-Beautify", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        return activationPromise;
      });
    });
    return describe("Beautifiers", function() {
      return describe("Beautifier::run", function() {
        var beautifier;
        beautifier = null;
        beforeEach(function() {
          return beautifier = new Beautifier();
        });
        it("should error when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, p;
            p = beautifier.run("program", []);
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true);
              expect(v.code).toBe("CommandNotFound");
              expect(v.description).toBe(void 0, 'Error should not have a description.');
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        it("should error with help description when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, help, p;
            help = {
              link: "http://test.com",
              program: "test-program",
              pathOption: "Lang - Test Program Path"
            };
            p = beautifier.run("program", [], {
              help: help
            });
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true);
              expect(v.code).toBe("CommandNotFound");
              expect(v.description).not.toBe(null);
              expect(v.description.indexOf(help.link)).not.toBe(-1);
              expect(v.description.indexOf(help.program)).not.toBe(-1);
              expect(v.description.indexOf(help.pathOption)).not.toBe(-1, "Error should have a description.");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        it("should error with Windows-specific help description when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, help, p, terminal, whichCmd;
            help = {
              link: "http://test.com",
              program: "test-program",
              pathOption: "Lang - Test Program Path"
            };
            beautifier.isWindows = true;
            terminal = 'CMD prompt';
            whichCmd = "where.exe";
            p = beautifier.run("program", [], {
              help: help
            });
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true);
              expect(v.code).toBe("CommandNotFound");
              expect(v.description).not.toBe(null);
              expect(v.description.indexOf(help.link)).not.toBe(-1);
              expect(v.description.indexOf(help.program)).not.toBe(-1);
              expect(v.description.indexOf(help.pathOption)).not.toBe(-1, "Error should have a description.");
              expect(v.description.indexOf(terminal)).not.toBe(-1, "Error should have a description including '" + terminal + "' in message.");
              expect(v.description.indexOf(whichCmd)).not.toBe(-1, "Error should have a description including '" + whichCmd + "' in message.");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        if (!isWindows) {
          return it("should error with Mac/Linux-specific help description when beautifier's program not found", function() {
            expect(beautifier).not.toBe(null);
            expect(beautifier instanceof Beautifier).toBe(true);
            return waitsForPromise({
              shouldReject: true
            }, function() {
              var cb, help, p, terminal, whichCmd;
              help = {
                link: "http://test.com",
                program: "test-program",
                pathOption: "Lang - Test Program Path"
              };
              beautifier.isWindows = false;
              terminal = "Terminal";
              whichCmd = "which";
              p = beautifier.run("program", [], {
                help: help
              });
              expect(p).not.toBe(null);
              expect(p instanceof beautifier.Promise).toBe(true);
              cb = function(v) {
                expect(v).not.toBe(null);
                expect(v instanceof Error).toBe(true);
                expect(v.code).toBe("CommandNotFound");
                expect(v.description).not.toBe(null);
                expect(v.description.indexOf(help.link)).not.toBe(-1);
                expect(v.description.indexOf(help.program)).not.toBe(-1);
                expect(v.description.indexOf(terminal)).not.toBe(-1, "Error should have a description including '" + terminal + "' in message.");
                expect(v.description.indexOf(whichCmd)).not.toBe(-1, "Error should have a description including '" + whichCmd + "' in message.");
                return v;
              };
              p.then(cb, cb);
              return p;
            });
          });
        }
      });
    });
  });

  describe("Languages", function() {
    var languages;
    languages = null;
    beforeEach(function() {
      return languages = new Languages();
    });
    return describe("Languages::namespace", function() {
      return it("should verify that multiple languages do not share the same namespace", function() {
        var namespaceGroups, namespaceOverlap, namespacePairs;
        namespaceGroups = _.groupBy(languages.languages, "namespace");
        namespacePairs = _.toPairs(namespaceGroups);
        namespaceOverlap = _.filter(namespacePairs, function(_arg) {
          var group, namespace;
          namespace = _arg[0], group = _arg[1];
          return group.length > 1;
        });
        console.log('namespaces', namespaceGroups, namespacePairs, namespaceOverlap);
        return expect(namespaceOverlap.length).toBe(0, "Language namespaces are overlapping.\nNamespaces are unique: only one language for each namespace.\n" + _.map(namespaceOverlap, function(_arg) {
          var group, namespace;
          namespace = _arg[0], group = _arg[1];
          return "- '" + namespace + "': Check languages " + (_.map(group, 'name').join(', ')) + " for using namespace '" + namespace + "'.";
        }).join('\n'));
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3BlYy9hdG9tLWJlYXV0aWZ5LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxvQkFBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWtCLElBQUEsV0FBQSxDQUFBLENBRGxCLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLCtCQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBSkosQ0FBQTs7QUFBQSxFQVlBLFNBQUEsR0FBWSxPQUFPLENBQUMsUUFBUixLQUFvQixPQUFwQixJQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBWixLQUFzQixRQURaLElBRVYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFaLEtBQXNCLE1BZHhCLENBQUE7O0FBQUEsRUFnQkEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBRXhCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUdULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsWUFBQSx1QkFBQTtBQUFBLFFBQUEsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCLENBQXBCLENBQUE7QUFBQSxRQUVBLElBQUEsR0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLGVBQS9CLENBRlAsQ0FBQTtBQUFBLFFBR0EsSUFBSSxDQUFDLFdBQUwsQ0FBQSxDQUhBLENBQUE7QUFPQSxlQUFPLGlCQUFQLENBUmM7TUFB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

//# sourceURL=/Users/victor.martins/.atom/packages/atom-beautify/spec/atom-beautify-spec.coffee
