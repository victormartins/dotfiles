'use babel';

function computeWordDiff(oldText, newText) {
  var addedWords = [];
  var removedWords = [];

  if (oldText && newText) {
    // defensive fix for #60
    var JsDiff = require('diff');
    var wordDiff = JsDiff.diffWordsWithSpace(oldText, newText);

    // split into two lists: added + removed
    wordDiff.forEach(function (part) {
      if (part.added) {
        part.changed = true;
        addedWords.push(part);
      } else if (part.removed) {
        part.changed = true;
        removedWords.push(part);
      } else {
        addedWords.push(part);
        removedWords.push(part);
      }
    });
  }

  return {
    addedWords: addedWords,
    removedWords: removedWords
  };
}

module.exports = {
  computeWordDiff: computeWordDiff
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy9kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC10aW1lLW1hY2hpbmUvbm9kZV9tb2R1bGVzL3NwbGl0LWRpZmYvbGliL2NvbXB1dGUtd29yZC1kaWZmLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7QUFFWixTQUFTLGVBQWUsQ0FBQyxPQUFlLEVBQUUsT0FBZSxFQUFZO0FBQ25FLE1BQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUNwQixNQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7O0FBRXRCLE1BQUksT0FBTyxJQUFJLE9BQU8sRUFBRTs7QUFDdEIsUUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLFFBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7OztBQUczRCxZQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3ZCLFVBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLGtCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3ZCLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLG9CQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3pCLE1BQU07QUFDTCxrQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QixvQkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUN6QjtLQUNGLENBQUMsQ0FBQztHQUNKOztBQUVELFNBQU87QUFDTCxjQUFVLEVBQVYsVUFBVTtBQUNWLGdCQUFZLEVBQVosWUFBWTtHQUNiLENBQUM7Q0FDSDs7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YsaUJBQWUsRUFBZixlQUFlO0NBQ2hCLENBQUMiLCJmaWxlIjoiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9ub2RlX21vZHVsZXMvc3BsaXQtZGlmZi9saWIvY29tcHV0ZS13b3JkLWRpZmYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZnVuY3Rpb24gY29tcHV0ZVdvcmREaWZmKG9sZFRleHQ6IHN0cmluZywgbmV3VGV4dDogc3RyaW5nKTogV29yZERpZmYge1xuICB2YXIgYWRkZWRXb3JkcyA9IFtdO1xuICB2YXIgcmVtb3ZlZFdvcmRzID0gW107XG5cbiAgaWYgKG9sZFRleHQgJiYgbmV3VGV4dCkgeyAvLyBkZWZlbnNpdmUgZml4IGZvciAjNjBcbiAgICB2YXIgSnNEaWZmID0gcmVxdWlyZSgnZGlmZicpO1xuICAgIHZhciB3b3JkRGlmZiA9IEpzRGlmZi5kaWZmV29yZHNXaXRoU3BhY2Uob2xkVGV4dCwgbmV3VGV4dCk7XG5cbiAgICAvLyBzcGxpdCBpbnRvIHR3byBsaXN0czogYWRkZWQgKyByZW1vdmVkXG4gICAgd29yZERpZmYuZm9yRWFjaChwYXJ0ID0+IHtcbiAgICAgIGlmIChwYXJ0LmFkZGVkKSB7XG4gICAgICAgIHBhcnQuY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIGFkZGVkV29yZHMucHVzaChwYXJ0KTtcbiAgICAgIH0gZWxzZSBpZiAocGFydC5yZW1vdmVkKSB7XG4gICAgICAgIHBhcnQuY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIHJlbW92ZWRXb3Jkcy5wdXNoKHBhcnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWRkZWRXb3Jkcy5wdXNoKHBhcnQpO1xuICAgICAgICByZW1vdmVkV29yZHMucHVzaChwYXJ0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYWRkZWRXb3JkcyxcbiAgICByZW1vdmVkV29yZHMsXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb21wdXRlV29yZERpZmZcbn07XG4iXX0=