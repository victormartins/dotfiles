(function() {
  var throttle;

  throttle = require("lodash.throttle");

  module.exports = {
    setCanvasRenderer: function(canvasRenderer) {
      return this.canvas = canvasRenderer;
    },
    enable: function() {
      return this.canvas.enable();
    },
    disable: function() {
      return this.canvas.destroy();
    },
    onChangePane: function(editor, editorElement) {
      this.canvas.resetCanvas();
      if (editor) {
        return this.canvas.setupCanvas(editor, editorElement);
      }
    },
    onNewCursor: function(cursor) {
      return cursor.spawn = throttle(this.canvas.spawn.bind(this.canvas), 25, {
        trailing: false
      });
    },
    onInput: function(cursor, screenPosition, input, data) {
      return cursor.spawn(cursor, screenPosition, input, data['size']);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvcGx1Z2luL3Bvd2VyLWNhbnZhcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVI7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGlCQUFBLEVBQW1CLFNBQUMsY0FBRDthQUNqQixJQUFDLENBQUEsTUFBRCxHQUFVO0lBRE8sQ0FBbkI7SUFHQSxNQUFBLEVBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFBO0lBRE8sQ0FIVDtJQU1BLE9BQUEsRUFBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUE7SUFETyxDQU5UO0lBU0EsWUFBQSxFQUFjLFNBQUMsTUFBRCxFQUFTLGFBQVQ7TUFDWixJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBQTtNQUNBLElBQTZDLE1BQTdDO2VBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQW9CLE1BQXBCLEVBQTRCLGFBQTVCLEVBQUE7O0lBRlksQ0FUZDtJQWFBLFdBQUEsRUFBYSxTQUFDLE1BQUQ7YUFDWCxNQUFNLENBQUMsS0FBUCxHQUFlLFFBQUEsQ0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFkLENBQW1CLElBQUMsQ0FBQSxNQUFwQixDQUFULEVBQXNDLEVBQXRDLEVBQTBDO1FBQUEsUUFBQSxFQUFVLEtBQVY7T0FBMUM7SUFESixDQWJiO0lBZ0JBLE9BQUEsRUFBUyxTQUFDLE1BQUQsRUFBUyxjQUFULEVBQXlCLEtBQXpCLEVBQWdDLElBQWhDO2FBQ1AsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFiLEVBQXFCLGNBQXJCLEVBQXFDLEtBQXJDLEVBQTRDLElBQUssQ0FBQSxNQUFBLENBQWpEO0lBRE8sQ0FoQlQ7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJ0aHJvdHRsZSA9IHJlcXVpcmUgXCJsb2Rhc2gudGhyb3R0bGVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHNldENhbnZhc1JlbmRlcmVyOiAoY2FudmFzUmVuZGVyZXIpIC0+XG4gICAgQGNhbnZhcyA9IGNhbnZhc1JlbmRlcmVyXG5cbiAgZW5hYmxlOiAgLT5cbiAgICBAY2FudmFzLmVuYWJsZSgpXG5cbiAgZGlzYWJsZTogLT5cbiAgICBAY2FudmFzLmRlc3Ryb3koKVxuXG4gIG9uQ2hhbmdlUGFuZTogKGVkaXRvciwgZWRpdG9yRWxlbWVudCkgLT5cbiAgICBAY2FudmFzLnJlc2V0Q2FudmFzKClcbiAgICBAY2FudmFzLnNldHVwQ2FudmFzIGVkaXRvciwgZWRpdG9yRWxlbWVudCBpZiBlZGl0b3JcblxuICBvbk5ld0N1cnNvcjogKGN1cnNvcikgLT5cbiAgICBjdXJzb3Iuc3Bhd24gPSB0aHJvdHRsZSBAY2FudmFzLnNwYXduLmJpbmQoQGNhbnZhcyksIDI1LCB0cmFpbGluZzogZmFsc2VcblxuICBvbklucHV0OiAoY3Vyc29yLCBzY3JlZW5Qb3NpdGlvbiwgaW5wdXQsIGRhdGEpIC0+XG4gICAgY3Vyc29yLnNwYXduIGN1cnNvciwgc2NyZWVuUG9zaXRpb24sIGlucHV0LCBkYXRhWydzaXplJ11cbiJdfQ==
