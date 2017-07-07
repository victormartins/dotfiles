(function() {
  describe("changing case", function() {
    var activationPromise, editorVariants, ref, workspaceView;
    ref = [], workspaceView = ref[0], activationPromise = ref[1];
    beforeEach(function() {
      return runs(function() {
        workspaceView = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceView);
        return activationPromise = atom.packages.activatePackage('change-case');
      });
    });
    editorVariants = {
      'mini text editor': function() {
        var editor, editorElement, eventDispatcher;
        workspaceView.innerHTML = "<atom-text-editor mini>";
        editorElement = workspaceView.firstChild;
        editor = editorElement.getModel();
        eventDispatcher = editorElement.querySelector('.hidden-input');
        return Promise.resolve({
          editor: editor,
          eventDispatcher: eventDispatcher
        });
      },
      'normal text editor': function() {
        return atom.workspace.open('sample.js').then(function() {
          var editor, editorElement, eventDispatcher;
          editor = atom.workspace.getActiveTextEditor();
          editorElement = atom.views.getView(editor);
          eventDispatcher = editorElement;
          return {
            editor: editor,
            eventDispatcher: eventDispatcher
          };
        });
      }
    };
    return Object.keys(editorVariants).forEach(function(editorName) {
      var getEditor;
      getEditor = editorVariants[editorName];
      return describe("for " + editorName, function() {
        var editor, eventDispatcher, ref1;
        ref1 = [], editor = ref1[0], eventDispatcher = ref1[1];
        beforeEach(function() {
          waitsForPromise(function() {
            return getEditor().then(function(options) {
              return editor = options.editor, eventDispatcher = options.eventDispatcher, options;
            });
          });
          return runs(function() {
            editor.selectAll();
            return editor.backspace();
          });
        });
        describe("when empty editor", function() {
          return it("should do nothing", function() {
            editor.setText('');
            atom.commands.dispatch(eventDispatcher, 'change-case:camel');
            waitsForPromise(function() {
              return activationPromise;
            });
            return expect(editor.getText()).toBe('');
          });
        });
        describe("when text is selected", function() {
          return it("should camelcase selected text", function() {
            editor.setText('WorkspaceView');
            editor.moveToBottom();
            editor.selectToTop();
            editor.selectAll();
            atom.commands.dispatch(eventDispatcher, 'change-case:camel');
            waitsForPromise(function() {
              return activationPromise;
            });
            return expect(editor.getText()).toBe('workspaceView');
          });
        });
        describe("when text with more than one word is selected", function() {
          return it("should camelcase selected text", function() {
            editor.setText('the quick brown fox jumps over the lazy dog');
            editor.moveToBottom();
            editor.selectToTop();
            editor.selectAll();
            atom.commands.dispatch(eventDispatcher, 'change-case:camel');
            waitsForPromise(function() {
              return activationPromise;
            });
            return expect(editor.getText()).toBe('theQuickBrownFoxJumpsOverTheLazyDog');
          });
        });
        describe("when text selection is empty", function() {
          it("should change case of the word nearest to the cursor", function() {
            editor.setText('workspaceView');
            atom.commands.dispatch(eventDispatcher, 'change-case:upper');
            waitsForPromise(function() {
              return activationPromise;
            });
            return expect(editor.getText()).toBe('WORKSPACEVIEW');
          });
          return it("should select the word nearest to the cursor", function() {
            editor.setText('workspaceView');
            atom.commands.dispatch(eventDispatcher, 'change-case:upper');
            waitsForPromise(function() {
              return activationPromise;
            });
            return expect(editor.getSelectedText()).toBe('WORKSPACEVIEW');
          });
        });
        describe("when selected text length changes after changing its case", function() {
          return it("should modify selection range to fit new text", function() {
            editor.setText('workspace.view');
            editor.selectAll();
            atom.commands.dispatch(eventDispatcher, 'change-case:upper');
            waitsForPromise(function() {
              return activationPromise;
            });
            expect(editor.getSelectedText()).toBe('WORKSPACE.VIEW');
            atom.commands.dispatch(eventDispatcher, 'change-case:camel');
            expect(editor.getSelectedText()).toBe('workspaceView');
            atom.commands.dispatch(eventDispatcher, 'change-case:dot');
            return expect(editor.getSelectedText()).toBe('workspace.view');
          });
        });
        return describe("when there are multiple selections", function() {
          it("should change case of each selection", function() {
            editor.setText('the quick brown fox\njumps over the lazy dog');
            editor.selectAll();
            editor.splitSelectionsIntoLines();
            atom.commands.dispatch(eventDispatcher, 'change-case:camel');
            waitsForPromise(function() {
              return activationPromise;
            });
            expect(editor.lineTextForBufferRow(0)).toContain('theQuickBrownFox');
            return expect(editor.lineTextForBufferRow(1)).toContain('jumpsOverTheLazyDog');
          });
          return it("should undo/redo changes in batch", function() {
            editor.setText('the quick brown fox\njumps over the lazy dog');
            editor.selectAll();
            editor.splitSelectionsIntoLines();
            atom.commands.dispatch(eventDispatcher, 'change-case:camel');
            waitsForPromise(function() {
              return activationPromise;
            });
            expect(editor.lineTextForBufferRow(0)).toContain('theQuickBrownFox');
            expect(editor.lineTextForBufferRow(1)).toContain('jumpsOverTheLazyDog');
            editor.undo();
            expect(editor.lineTextForBufferRow(0)).toContain('the quick brown fox');
            expect(editor.lineTextForBufferRow(1)).toContain('jumps over the lazy dog');
            editor.redo();
            expect(editor.lineTextForBufferRow(0)).toContain('theQuickBrownFox');
            return expect(editor.lineTextForBufferRow(1)).toContain('jumpsOverTheLazyDog');
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2NoYW5nZS1jYXNlL3NwZWMvY2hhbmdlLWNhc2Utc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBO0FBQ3hCLFFBQUE7SUFBQSxNQUFxQyxFQUFyQyxFQUFDLHNCQUFELEVBQWdCO0lBRWhCLFVBQUEsQ0FBVyxTQUFBO2FBQ1QsSUFBQSxDQUFLLFNBQUE7UUFDSCxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEI7UUFDaEIsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsYUFBcEI7ZUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsYUFBOUI7TUFIakIsQ0FBTDtJQURTLENBQVg7SUFNQSxjQUFBLEdBQ0U7TUFBQSxrQkFBQSxFQUFvQixTQUFBO0FBQ2xCLFlBQUE7UUFBQSxhQUFhLENBQUMsU0FBZCxHQUEwQjtRQUMxQixhQUFBLEdBQWdCLGFBQWEsQ0FBQztRQUM5QixNQUFBLEdBQVMsYUFBYSxDQUFDLFFBQWQsQ0FBQTtRQUNULGVBQUEsR0FBa0IsYUFBYSxDQUFDLGFBQWQsQ0FBNEIsZUFBNUI7ZUFDbEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0I7VUFBQyxRQUFBLE1BQUQ7VUFBUyxpQkFBQSxlQUFUO1NBQWhCO01BTGtCLENBQXBCO01BTUEsb0JBQUEsRUFBc0IsU0FBQTtlQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsV0FBcEIsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxTQUFBO0FBQ3BDLGNBQUE7VUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1VBQ1QsYUFBQSxHQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIs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LG9CQUFQLENBQTRCLENBQTVCLENBQVAsQ0FBc0MsQ0FBQyxTQUF2QyxDQUFpRCxrQkFBakQ7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUE1QixDQUFQLENBQXNDLENBQUMsU0FBdkMsQ0FBaUQscUJBQWpEO1VBdEJzQyxDQUF4QztRQWY2QyxDQUEvQztNQW5FNEIsQ0FBOUI7SUFIa0MsQ0FBcEM7RUF2QndCLENBQTFCO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJkZXNjcmliZSBcImNoYW5naW5nIGNhc2VcIiwgLT5cbiAgW3dvcmtzcGFjZVZpZXcsIGFjdGl2YXRpb25Qcm9taXNlXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHJ1bnMgLT5cbiAgICAgIHdvcmtzcGFjZVZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZVZpZXcpXG4gICAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdjaGFuZ2UtY2FzZScpXG5cbiAgZWRpdG9yVmFyaWFudHMgPVxuICAgICdtaW5pIHRleHQgZWRpdG9yJzogLT5cbiAgICAgIHdvcmtzcGFjZVZpZXcuaW5uZXJIVE1MID0gXCI8YXRvbS10ZXh0LWVkaXRvciBtaW5pPlwiXG4gICAgICBlZGl0b3JFbGVtZW50ID0gd29ya3NwYWNlVmlldy5maXJzdENoaWxkXG4gICAgICBlZGl0b3IgPSBlZGl0b3JFbGVtZW50LmdldE1vZGVsKClcbiAgICAgIGV2ZW50RGlzcGF0Y2hlciA9IGVkaXRvckVsZW1lbnQucXVlcnlTZWxlY3RvcignLmhpZGRlbi1pbnB1dCcpXG4gICAgICBQcm9taXNlLnJlc29sdmUoe2VkaXRvciwgZXZlbnREaXNwYXRjaGVyfSlcbiAgICAnbm9ybWFsIHRleHQgZWRpdG9yJzogLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS5qcycpLnRoZW4gLT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgICAgICBldmVudERpc3BhdGNoZXIgPSBlZGl0b3JFbGVtZW50XG4gICAgICAgIHtlZGl0b3IsIGV2ZW50RGlzcGF0Y2hlcn1cblxuICBPYmplY3Qua2V5cyhlZGl0b3JWYXJpYW50cykuZm9yRWFjaCAoZWRpdG9yTmFtZSkgLT5cbiAgICBnZXRFZGl0b3IgPSBlZGl0b3JWYXJpYW50c1tlZGl0b3JOYW1lXVxuXG4gICAgZGVzY3JpYmUgXCJmb3IgI3tlZGl0b3JOYW1lfVwiLCAtPlxuICAgICAgW2VkaXRvciwgZXZlbnREaXNwYXRjaGVyXSA9IFtdXG5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgZ2V0RWRpdG9yKCkudGhlbiAob3B0aW9ucykgLT5cbiAgICAgICAgICAgIHtlZGl0b3IsIGV2ZW50RGlzcGF0Y2hlcn0gPSBvcHRpb25zXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGVkaXRvci5zZWxlY3RBbGwoKVxuICAgICAgICAgIGVkaXRvci5iYWNrc3BhY2UoKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gZW1wdHkgZWRpdG9yXCIsIC0+XG4gICAgICAgIGl0IFwic2hvdWxkIGRvIG5vdGhpbmdcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dCAnJ1xuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZXZlbnREaXNwYXRjaGVyLCAnY2hhbmdlLWNhc2U6Y2FtZWwnKVxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhY3RpdmF0aW9uUHJvbWlzZVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcnXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0ZXh0IGlzIHNlbGVjdGVkXCIsIC0+XG4gICAgICAgIGl0IFwic2hvdWxkIGNhbWVsY2FzZSBzZWxlY3RlZCB0ZXh0XCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldFRleHQgJ1dvcmtzcGFjZVZpZXcnXG4gICAgICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICAgICAgZWRpdG9yLnNlbGVjdFRvVG9wKClcbiAgICAgICAgICBlZGl0b3Iuc2VsZWN0QWxsKClcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGV2ZW50RGlzcGF0Y2hlciwgJ2NoYW5nZS1jYXNlOmNhbWVsJylcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYWN0aXZhdGlvblByb21pc2VcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnd29ya3NwYWNlVmlldydcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRleHQgd2l0aCBtb3JlIHRoYW4gb25lIHdvcmQgaXMgc2VsZWN0ZWRcIiwgLT5cbiAgICAgICAgaXQgXCJzaG91bGQgY2FtZWxjYXNlIHNlbGVjdGVkIHRleHRcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dCAndGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZydcbiAgICAgICAgICBlZGl0b3IubW92ZVRvQm90dG9tKClcbiAgICAgICAgICBlZGl0b3Iuc2VsZWN0VG9Ub3AoKVxuICAgICAgICAgIGVkaXRvci5zZWxlY3RBbGwoKVxuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZXZlbnREaXNwYXRjaGVyLCAnY2hhbmdlLWNhc2U6Y2FtZWwnKVxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhY3RpdmF0aW9uUHJvbWlzZVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICd0aGVRdWlja0Jyb3duRm94SnVtcHNPdmVyVGhlTGF6eURvZydcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRleHQgc2VsZWN0aW9uIGlzIGVtcHR5XCIsIC0+XG4gICAgICAgIGl0IFwic2hvdWxkIGNoYW5nZSBjYXNlIG9mIHRoZSB3b3JkIG5lYXJlc3QgdG8gdGhlIGN1cnNvclwiLCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0ICd3b3Jrc3BhY2VWaWV3J1xuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZXZlbnREaXNwYXRjaGVyLCAnY2hhbmdlLWNhc2U6dXBwZXInKVxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhY3RpdmF0aW9uUHJvbWlzZVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdXT1JLU1BBQ0VWSUVXJ1xuXG4gICAgICAgIGl0IFwic2hvdWxkIHNlbGVjdCB0aGUgd29yZCBuZWFyZXN0IHRvIHRoZSBjdXJzb3JcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dCAnd29ya3NwYWNlVmlldydcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGV2ZW50RGlzcGF0Y2hlciwgJ2NoYW5nZS1jYXNlOnVwcGVyJylcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYWN0aXZhdGlvblByb21pc2VcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0JlICdXT1JLU1BBQ0VWSUVXJ1xuXG4gICAgICBkZXNjcmliZSBcIndoZW4gc2VsZWN0ZWQgdGV4dCBsZW5ndGggY2hhbmdlcyBhZnRlciBjaGFuZ2luZyBpdHMgY2FzZVwiLCAtPlxuICAgICAgICBpdCBcInNob3VsZCBtb2RpZnkgc2VsZWN0aW9uIHJhbmdlIHRvIGZpdCBuZXcgdGV4dFwiLCAtPlxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0ICd3b3Jrc3BhY2UudmlldydcbiAgICAgICAgICBlZGl0b3Iuc2VsZWN0QWxsKClcblxuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZXZlbnREaXNwYXRjaGVyLCAnY2hhbmdlLWNhc2U6dXBwZXInKVxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhY3RpdmF0aW9uUHJvbWlzZVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KCkpLnRvQmUgJ1dPUktTUEFDRS5WSUVXJ1xuXG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChldmVudERpc3BhdGNoZXIsICdjaGFuZ2UtY2FzZTpjYW1lbCcpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSkudG9CZSAnd29ya3NwYWNlVmlldydcblxuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZXZlbnREaXNwYXRjaGVyLCAnY2hhbmdlLWNhc2U6ZG90JylcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0JlICd3b3Jrc3BhY2UudmlldydcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZXJlIGFyZSBtdWx0aXBsZSBzZWxlY3Rpb25zXCIsIC0+XG4gICAgICAgIGl0IFwic2hvdWxkIGNoYW5nZSBjYXNlIG9mIGVhY2ggc2VsZWN0aW9uXCIsIC0+XG4gICAgICAgICAgZWRpdG9yLnNldFRleHQgJycnXG4gICAgICAgICAgdGhlIHF1aWNrIGJyb3duIGZveFxuICAgICAgICAgIGp1bXBzIG92ZXIgdGhlIGxhenkgZG9nXG4gICAgICAgICAgJycnXG4gICAgICAgICAgZWRpdG9yLnNlbGVjdEFsbCgpXG4gICAgICAgICAgZWRpdG9yLnNwbGl0U2VsZWN0aW9uc0ludG9MaW5lcygpXG5cbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGV2ZW50RGlzcGF0Y2hlciwgJ2NoYW5nZS1jYXNlOmNhbWVsJylcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYWN0aXZhdGlvblByb21pc2VcblxuICAgICAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMCkpLnRvQ29udGFpbiAndGhlUXVpY2tCcm93bkZveCdcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDEpKS50b0NvbnRhaW4gJ2p1bXBzT3ZlclRoZUxhenlEb2cnXG5cbiAgICAgICAgaXQgXCJzaG91bGQgdW5kby9yZWRvIGNoYW5nZXMgaW4gYmF0Y2hcIiwgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dCAnJydcbiAgICAgICAgICB0aGUgcXVpY2sgYnJvd24gZm94XG4gICAgICAgICAganVtcHMgb3ZlciB0aGUgbGF6eSBkb2dcbiAgICAgICAgICAnJydcbiAgICAgICAgICBlZGl0b3Iuc2VsZWN0QWxsKClcbiAgICAgICAgICBlZGl0b3Iuc3BsaXRTZWxlY3Rpb25zSW50b0xpbmVzKClcblxuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZXZlbnREaXNwYXRjaGVyLCAnY2hhbmdlLWNhc2U6Y2FtZWwnKVxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhY3RpdmF0aW9uUHJvbWlzZVxuXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygwKSkudG9Db250YWluICd0aGVRdWlja0Jyb3duRm94J1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMSkpLnRvQ29udGFpbiAnanVtcHNPdmVyVGhlTGF6eURvZydcblxuICAgICAgICAgIGVkaXRvci51bmRvKClcblxuICAgICAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMCkpLnRvQ29udGFpbiAndGhlIHF1aWNrIGJyb3duIGZveCdcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDEpKS50b0NvbnRhaW4gJ2p1bXBzIG92ZXIgdGhlIGxhenkgZG9nJ1xuXG4gICAgICAgICAgZWRpdG9yLnJlZG8oKVxuXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygwKSkudG9Db250YWluICd0aGVRdWlja0Jyb3duRm94J1xuICAgICAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMSkpLnRvQ29udGFpbiAnanVtcHNPdmVyVGhlTGF6eURvZydcbiJdfQ==
