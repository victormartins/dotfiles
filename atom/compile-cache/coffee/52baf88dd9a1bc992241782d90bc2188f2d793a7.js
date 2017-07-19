(function() {
  var Yard;

  Yard = require('../lib/yard');

  describe("Yard", function() {
    var activationPromise, buffer, editor, ref, workspaceElement;
    ref = [], workspaceElement = ref[0], activationPromise = ref[1], editor = ref[2], buffer = ref[3];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      activationPromise = atom.packages.activatePackage('yard');
      return waitsForPromise(function() {
        return atom.workspace.open().then(function(o) {
          editor = o;
          return buffer = editor.buffer;
        });
      });
    });
    return describe("when the yard:create event is triggered", function() {
      describe("for single line method", function() {
        beforeEach(function() {
          editor.insertText("class UndocumentedClass\n  def undocumented_method(param1, param2=3)\n    'The method is not documented!'\n  end\nend\n");
          editor.getLastCursor().setBufferPosition([2, 0]);
          return atom.commands.dispatch(workspaceElement, 'yard:create');
        });
        return it("writes a default YARD doc", function() {
          var expected_output, output;
          expected_output = "class UndocumentedClass\n  # Description of method\n  #\n  # @param [Type] param1 describe param1\n  # @param [Type] param2=3 describe param2=3\n  # @return [Type] description of returned object\n  def undocumented_method(param1, param2=3)\n    'The method is not documented!'\n  end\nend";
          output = buffer.getText();
          return expect(output).toContain(expected_output);
        });
      });
      return describe("for multiline method", function() {
        beforeEach(function() {
          editor.insertText("class UndocumentedClass\n  def undocumented_multiline_method(param1, param2 = 3, opts = {})\n    'Not documented!'\n    'Noot documented!'\n    'Noooot documented!!!'\n  end\nend\n");
          editor.getLastCursor().setBufferPosition([4, 0]);
          return atom.commands.dispatch(workspaceElement, 'yard:create');
        });
        return it("writes a default YARD doc", function() {
          var expected_output, output;
          expected_output = "class UndocumentedClass\n  # Description of method\n  #\n  # @param [Type] param1 describe param1\n  # @param [Type] param2 = 3 describe param2 = 3\n  # @param [Type] opts = {} describe opts = {}\n  # @return [Type] description of returned object\n  def undocumented_multiline_method(param1, param2 = 3, opts = {})\n    'Not documented!'\n    'Noot documented!'\n    'Noooot documented!!!'\n  end\nend";
          output = buffer.getText();
          return expect(output).toContain(expected_output);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL3lhcmQvc3BlYy95YXJkLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVI7O0VBRVAsUUFBQSxDQUFTLE1BQVQsRUFBaUIsU0FBQTtBQUNmLFFBQUE7SUFBQSxNQUF3RCxFQUF4RCxFQUFDLHlCQUFELEVBQW1CLDBCQUFuQixFQUFzQyxlQUF0QyxFQUE4QztJQUU5QyxVQUFBLENBQVcsU0FBQTtNQUNULGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEI7TUFDbkIsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLE1BQTlCO2FBRXBCLGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsU0FBQyxDQUFEO1VBQ3pCLE1BQUEsR0FBUztpQkFDVCxNQUFBLEdBQVMsTUFBTSxDQUFDO1FBRlMsQ0FBM0I7TUFEYyxDQUFoQjtJQUpTLENBQVg7V0FTQSxRQUFBLENBQVMseUNBQVQsRUFBb0QsU0FBQTtNQUNsRCxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQTtRQUNqQyxVQUFBLENBQVcsU0FBQTtVQUNULE1BQU0sQ0FBQyxVQUFQLENBQWtCLHlIQUFsQjtVQVFBLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxpQkFBdkIsQ0FBeUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUF6QztpQkFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGFBQXpDO1FBVlMsQ0FBWDtlQVlBLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBO0FBQzlCLGNBQUE7VUFBQSxlQUFBLEdBQWtCO1VBV2xCLE1BQUEsR0FBUyxNQUFNLENBQUMsT0FBUCxDQUFBO2lCQUNULE1BQUEsQ0FBTyxNQUFQLENBQWMsQ0FBQyxTQUFmLENBQXlCLGVBQXpCO1FBYjhCLENBQWhDO01BYmlDLENBQW5DO2FBNEJBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO1FBQy9CLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsTUFBTSxDQUFDLFVBQVAsQ0FBa0Isc0xBQWxCO1VBVUEsTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLGlCQUF2QixDQUF5QyxDQUFDLENBQUQsRUFBRyxDQUFILENBQXpDO2lCQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsYUFBekM7UUFaUyxDQUFYO2VBY0EsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUE7QUFDOUIsY0FBQTtVQUFBLGVBQUEsR0FBa0I7VUFjbEIsTUFBQSxHQUFTLE1BQU0sQ0FBQyxPQUFQLENBQUE7aUJBQ1QsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLFNBQWYsQ0FBeUIsZUFBekI7UUFoQjhCLENBQWhDO01BZitCLENBQWpDO0lBN0JrRCxDQUFwRDtFQVplLENBQWpCO0FBRkEiLCJzb3VyY2VzQ29udGVudCI6WyJZYXJkID0gcmVxdWlyZSAnLi4vbGliL3lhcmQnXG5cbmRlc2NyaWJlIFwiWWFyZFwiLCAtPlxuICBbd29ya3NwYWNlRWxlbWVudCwgYWN0aXZhdGlvblByb21pc2UsIGVkaXRvciwgYnVmZmVyXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgYWN0aXZhdGlvblByb21pc2UgPSBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgneWFyZCcpXG4gICAgIyBPcGVuIGEgc2FtcGxlIFJ1YnkgY2xhc3MgZmlsZVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigpLnRoZW4gKG8pIC0+XG4gICAgICAgIGVkaXRvciA9IG9cbiAgICAgICAgYnVmZmVyID0gZWRpdG9yLmJ1ZmZlclxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgeWFyZDpjcmVhdGUgZXZlbnQgaXMgdHJpZ2dlcmVkXCIsIC0+XG4gICAgZGVzY3JpYmUgXCJmb3Igc2luZ2xlIGxpbmUgbWV0aG9kXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiXCJcIlxuICAgICAgICAgIGNsYXNzIFVuZG9jdW1lbnRlZENsYXNzXG4gICAgICAgICAgICBkZWYgdW5kb2N1bWVudGVkX21ldGhvZChwYXJhbTEsIHBhcmFtMj0zKVxuICAgICAgICAgICAgICAnVGhlIG1ldGhvZCBpcyBub3QgZG9jdW1lbnRlZCEnXG4gICAgICAgICAgICBlbmRcbiAgICAgICAgICBlbmRcblxuICAgICAgICBcIlwiXCJcbiAgICAgICAgZWRpdG9yLmdldExhc3RDdXJzb3IoKS5zZXRCdWZmZXJQb3NpdGlvbihbMiwwXSlcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCB3b3Jrc3BhY2VFbGVtZW50LCAneWFyZDpjcmVhdGUnXG5cbiAgICAgIGl0IFwid3JpdGVzIGEgZGVmYXVsdCBZQVJEIGRvY1wiLCAtPlxuICAgICAgICBleHBlY3RlZF9vdXRwdXQgPSBcIlwiXCJjbGFzcyBVbmRvY3VtZW50ZWRDbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgRGVzY3JpcHRpb24gb2YgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgQHBhcmFtIFtUeXBlXSBwYXJhbTEgZGVzY3JpYmUgcGFyYW0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBAcGFyYW0gW1R5cGVdIHBhcmFtMj0zIGRlc2NyaWJlIHBhcmFtMj0zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBAcmV0dXJuIFtUeXBlXSBkZXNjcmlwdGlvbiBvZiByZXR1cm5lZCBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWYgdW5kb2N1bWVudGVkX21ldGhvZChwYXJhbTEsIHBhcmFtMj0zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1RoZSBtZXRob2QgaXMgbm90IGRvY3VtZW50ZWQhJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIG91dHB1dCA9IGJ1ZmZlci5nZXRUZXh0KClcbiAgICAgICAgZXhwZWN0KG91dHB1dCkudG9Db250YWluKGV4cGVjdGVkX291dHB1dClcblxuICAgIGRlc2NyaWJlIFwiZm9yIG11bHRpbGluZSBtZXRob2RcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJcIlwiXG4gICAgICAgICAgY2xhc3MgVW5kb2N1bWVudGVkQ2xhc3NcbiAgICAgICAgICAgIGRlZiB1bmRvY3VtZW50ZWRfbXVsdGlsaW5lX21ldGhvZChwYXJhbTEsIHBhcmFtMiA9IDMsIG9wdHMgPSB7fSlcbiAgICAgICAgICAgICAgJ05vdCBkb2N1bWVudGVkISdcbiAgICAgICAgICAgICAgJ05vb3QgZG9jdW1lbnRlZCEnXG4gICAgICAgICAgICAgICdOb29vb3QgZG9jdW1lbnRlZCEhISdcbiAgICAgICAgICAgIGVuZFxuICAgICAgICAgIGVuZFxuXG4gICAgICAgIFwiXCJcIlxuICAgICAgICBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLnNldEJ1ZmZlclBvc2l0aW9uKFs0LDBdKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICd5YXJkOmNyZWF0ZSdcblxuICAgICAgaXQgXCJ3cml0ZXMgYSBkZWZhdWx0IFlBUkQgZG9jXCIsIC0+XG4gICAgICAgIGV4cGVjdGVkX291dHB1dCA9IFwiXCJcImNsYXNzIFVuZG9jdW1lbnRlZENsYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBEZXNjcmlwdGlvbiBvZiBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBAcGFyYW0gW1R5cGVdIHBhcmFtMSBkZXNjcmliZSBwYXJhbTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIEBwYXJhbSBbVHlwZV0gcGFyYW0yID0gMyBkZXNjcmliZSBwYXJhbTIgPSAzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBAcGFyYW0gW1R5cGVdIG9wdHMgPSB7fSBkZXNjcmliZSBvcHRzID0ge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIEByZXR1cm4gW1R5cGVdIGRlc2NyaXB0aW9uIG9mIHJldHVybmVkIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZiB1bmRvY3VtZW50ZWRfbXVsdGlsaW5lX21ldGhvZChwYXJhbTEsIHBhcmFtMiA9IDMsIG9wdHMgPSB7fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdOb3QgZG9jdW1lbnRlZCEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnTm9vdCBkb2N1bWVudGVkISdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdOb29vb3QgZG9jdW1lbnRlZCEhISdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICBvdXRwdXQgPSBidWZmZXIuZ2V0VGV4dCgpXG4gICAgICAgIGV4cGVjdChvdXRwdXQpLnRvQ29udGFpbihleHBlY3RlZF9vdXRwdXQpXG4iXX0=
