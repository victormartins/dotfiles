Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.$range = $range;
exports.$file = $file;
exports.copySelection = copySelection;
exports.getPathOfMessage = getPathOfMessage;
exports.getActiveTextEditor = getActiveTextEditor;
exports.getEditorsMap = getEditorsMap;
exports.filterMessages = filterMessages;
exports.filterMessagesByRangeOrPoint = filterMessagesByRangeOrPoint;
exports.openFile = openFile;
exports.visitMessage = visitMessage;
exports.openExternally = openExternally;
exports.sortMessages = sortMessages;
exports.sortSolutions = sortSolutions;
exports.applySolution = applySolution;

var _atom = require('atom');

var _electron = require('electron');

var severityScore = {
  error: 3,
  warning: 2,
  info: 1
};

exports.severityScore = severityScore;
var severityNames = {
  error: 'Error',
  warning: 'Warning',
  info: 'Info'
};
exports.severityNames = severityNames;
var WORKSPACE_URI = 'atom://linter-ui-default';

exports.WORKSPACE_URI = WORKSPACE_URI;

function $range(message) {
  return message.version === 1 ? message.range : message.location.position;
}

function $file(message) {
  return message.version === 1 ? message.filePath : message.location.file;
}

function copySelection() {
  var selection = getSelection();
  if (selection) {
    atom.clipboard.write(selection.toString());
  }
}

function getPathOfMessage(message) {
  return atom.project.relativizePath($file(message) || '')[1];
}

function getActiveTextEditor() {
  var paneItem = atom.workspace.getCenter().getActivePaneItem();
  return atom.workspace.isTextEditor(paneItem) ? paneItem : null;
}

function getEditorsMap(editors) {
  var editorsMap = {};
  var filePaths = [];
  for (var entry of editors.editors) {
    var filePath = entry.textEditor.getPath();
    if (editorsMap[filePath]) {
      editorsMap[filePath].editors.push(entry);
    } else {
      editorsMap[filePath] = {
        added: [],
        removed: [],
        editors: [entry]
      };
      filePaths.push(filePath);
    }
  }
  return { editorsMap: editorsMap, filePaths: filePaths };
}

function filterMessages(messages, filePath) {
  var severity = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  var filtered = [];
  messages.forEach(function (message) {
    if ((filePath === null || $file(message) === filePath) && (!severity || message.severity === severity)) {
      filtered.push(message);
    }
  });
  return filtered;
}

function filterMessagesByRangeOrPoint(messages, filePath, rangeOrPoint) {
  var filtered = [];
  var expectedRange = rangeOrPoint.constructor.name === 'Point' ? new _atom.Range(rangeOrPoint, rangeOrPoint) : _atom.Range.fromObject(rangeOrPoint);
  messages.forEach(function (message) {
    var file = $file(message);
    var range = $range(message);
    if (file && range && file === filePath && range.intersectsWith(expectedRange)) {
      filtered.push(message);
    }
  });
  return filtered;
}

function openFile(file, position) {
  var options = {};
  options.searchAllPanes = true;
  if (position) {
    options.initialLine = position.row;
    options.initialColumn = position.column;
  }
  atom.workspace.open(file, options);
}

function visitMessage(message) {
  var reference = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var messageFile = undefined;
  var messagePosition = undefined;
  if (reference) {
    if (message.version !== 2) {
      console.warn('[Linter-UI-Default] Only messages v2 are allowed in jump to reference. Ignoring');
      return;
    }
    if (!message.reference || !message.reference.file) {
      console.warn('[Linter-UI-Default] Message does not have a valid reference. Ignoring');
      return;
    }
    messageFile = message.reference.file;
    messagePosition = message.reference.position;
  } else {
    var messageRange = $range(message);
    messageFile = $file(message);
    if (messageRange) {
      messagePosition = messageRange.start;
    }
  }
  if (messageFile) {
    openFile(messageFile, messagePosition);
  }
}

function openExternally(message) {
  if (message.version === 2 && message.url) {
    _electron.shell.openExternal(message.url);
  }
}

function sortMessages(sortInfo, rows) {
  var sortColumns = {};

  sortInfo.forEach(function (entry) {
    sortColumns[entry.column] = entry.type;
  });

  return rows.slice().sort(function (a, b) {
    if (sortColumns.severity) {
      var multiplyWith = sortColumns.severity === 'asc' ? 1 : -1;
      var severityA = severityScore[a.severity];
      var severityB = severityScore[b.severity];
      if (severityA !== severityB) {
        return multiplyWith * (severityA > severityB ? 1 : -1);
      }
    }
    if (sortColumns.linterName) {
      var multiplyWith = sortColumns.linterName === 'asc' ? 1 : -1;
      var sortValue = a.severity.localeCompare(b.severity);
      if (sortValue !== 0) {
        return multiplyWith * sortValue;
      }
    }
    if (sortColumns.file) {
      var multiplyWith = sortColumns.file === 'asc' ? 1 : -1;
      var fileA = getPathOfMessage(a);
      var fileALength = fileA.length;
      var fileB = getPathOfMessage(b);
      var fileBLength = fileB.length;
      if (fileALength !== fileBLength) {
        return multiplyWith * (fileALength > fileBLength ? 1 : -1);
      } else if (fileA !== fileB) {
        return multiplyWith * fileA.localeCompare(fileB);
      }
    }
    if (sortColumns.line) {
      var multiplyWith = sortColumns.line === 'asc' ? 1 : -1;
      var rangeA = $range(a);
      var rangeB = $range(b);
      if (rangeA && !rangeB) {
        return 1;
      } else if (rangeB && !rangeA) {
        return -1;
      } else if (rangeA && rangeB) {
        if (rangeA.start.row !== rangeB.start.row) {
          return multiplyWith * (rangeA.start.row > rangeB.start.row ? 1 : -1);
        }
        if (rangeA.start.column !== rangeB.start.column) {
          return multiplyWith * (rangeA.start.column > rangeB.start.column ? 1 : -1);
        }
      }
    }

    return 0;
  });
}

function sortSolutions(solutions) {
  return solutions.slice().sort(function (a, b) {
    return b.priority - a.priority;
  });
}

function applySolution(textEditor, version, solution) {
  if (solution.apply) {
    solution.apply();
    return true;
  }
  var range = version === 1 ? solution.range : solution.position;
  var currentText = version === 1 ? solution.oldText : solution.currentText;
  var replaceWith = version === 1 ? solution.newText : solution.replaceWith;
  if (currentText) {
    var textInRange = textEditor.getTextInBufferRange(range);
    if (currentText !== textInRange) {
      console.warn('[linter-ui-default] Not applying fix because text did not match the expected one', 'expected', currentText, 'but got', textInRange);
      return false;
    }
  }
  textEditor.setTextInBufferRange(range, replaceWith);
  return true;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRXNCLE1BQU07O3dCQUNOLFVBQVU7O0FBS3pCLElBQU0sYUFBYSxHQUFHO0FBQzNCLE9BQUssRUFBRSxDQUFDO0FBQ1IsU0FBTyxFQUFFLENBQUM7QUFDVixNQUFJLEVBQUUsQ0FBQztDQUNSLENBQUE7OztBQUVNLElBQU0sYUFBYSxHQUFHO0FBQzNCLE9BQUssRUFBRSxPQUFPO0FBQ2QsU0FBTyxFQUFFLFNBQVM7QUFDbEIsTUFBSSxFQUFFLE1BQU07Q0FDYixDQUFBOztBQUNNLElBQU0sYUFBYSxHQUFHLDBCQUEwQixDQUFBOzs7O0FBRWhELFNBQVMsTUFBTSxDQUFDLE9BQXNCLEVBQVc7QUFDdEQsU0FBTyxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFBO0NBQ3pFOztBQUNNLFNBQVMsS0FBSyxDQUFDLE9BQXNCLEVBQVc7QUFDckQsU0FBTyxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFBO0NBQ3hFOztBQUNNLFNBQVMsYUFBYSxHQUFHO0FBQzlCLE1BQU0sU0FBUyxHQUFHLFlBQVksRUFBRSxDQUFBO0FBQ2hDLE1BQUksU0FBUyxFQUFFO0FBQ2IsUUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7R0FDM0M7Q0FDRjs7QUFDTSxTQUFTLGdCQUFnQixDQUFDLE9BQXNCLEVBQVU7QUFDL0QsU0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFB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RyxPQUFPLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQTtBQUMzRSxNQUFJLFdBQVcsRUFBRTtBQUNmLFFBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMxRCxRQUFJLFdBQVcsS0FBSyxXQUFXLEVBQUU7QUFDL0IsYUFBTyxDQUFDLElBQUksQ0FBQyxrRkFBa0YsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUNqSixhQUFPLEtBQUssQ0FBQTtLQUNiO0dBQ0Y7QUFDRCxZQUFVLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQ25ELFNBQU8sSUFBSSxDQUFBO0NBQ1oiLCJmaWxlIjoiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgc2hlbGwgfSBmcm9tICdlbGVjdHJvbidcbmltcG9ydCB0eXBlIHsgUG9pbnQsIFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgRWRpdG9ycyBmcm9tICcuL2VkaXRvcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgY29uc3Qgc2V2ZXJpdHlTY29yZSA9IHtcbiAgZXJyb3I6IDMsXG4gIHdhcm5pbmc6IDIsXG4gIGluZm86IDEsXG59XG5cbmV4cG9ydCBjb25zdCBzZXZlcml0eU5hbWVzID0ge1xuICBlcnJvcjogJ0Vycm9yJyxcbiAgd2FybmluZzogJ1dhcm5pbmcnLFxuICBpbmZvOiAnSW5mbycsXG59XG5leHBvcnQgY29uc3QgV09SS1NQQUNFX1VSSSA9ICdhdG9tOi8vbGludGVyLXVpLWRlZmF1bHQnXG5cbmV4cG9ydCBmdW5jdGlvbiAkcmFuZ2UobWVzc2FnZTogTGludGVyTWVzc2FnZSk6ID9PYmplY3Qge1xuICByZXR1cm4gbWVzc2FnZS52ZXJzaW9uID09PSAxID8gbWVzc2FnZS5yYW5nZSA6IG1lc3NhZ2UubG9jYXRpb24ucG9zaXRpb25cbn1cbmV4cG9ydCBmdW5jdGlvbiAkZmlsZShtZXNzYWdlOiBMaW50ZXJNZXNzYWdlKTogP3N0cmluZyB7XG4gIHJldHVybiBtZXNzYWdlLnZlcnNpb24gPT09IDEgPyBtZXNzYWdlLmZpbGVQYXRoIDogbWVzc2FnZS5sb2NhdGlvbi5maWxlXG59XG5leHBvcnQgZnVuY3Rpb24gY29weVNlbGVjdGlvbigpIHtcbiAgY29uc3Qgc2VsZWN0aW9uID0gZ2V0U2VsZWN0aW9uKClcbiAgaWYgKHNlbGVjdGlvbikge1xuICAgIGF0b20uY2xpcGJvYXJkLndyaXRlKHNlbGVjdGlvbi50b1N0cmluZygpKVxuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UGF0aE9mTWVzc2FnZShtZXNzYWdlOiBMaW50ZXJNZXNzYWdlKTogc3RyaW5nIHtcbiAgcmV0dXJuIGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aCgkZmlsZShtZXNzYWdlKSB8fCAnJylbMV1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3RpdmVUZXh0RWRpdG9yKCk6ID9UZXh0RWRpdG9yIHtcbiAgY29uc3QgcGFuZUl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gIHJldHVybiBhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IocGFuZUl0ZW0pID8gcGFuZUl0ZW0gOiBudWxsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFZGl0b3JzTWFwKGVkaXRvcnM6IEVkaXRvcnMpOiB7IGVkaXRvcnNNYXA6IE9iamVjdCwgZmlsZVBhdGhzOiBBcnJheTxzdHJpbmc+IH0ge1xuICBjb25zdCBlZGl0b3JzTWFwID0ge31cbiAgY29uc3QgZmlsZVBhdGhzID0gW11cbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlZGl0b3JzLmVkaXRvcnMpIHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IGVudHJ5LnRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgaWYgKGVkaXRvcnNNYXBbZmlsZVBhdGhdKSB7XG4gICAgICBlZGl0b3JzTWFwW2ZpbGVQYXRoXS5lZGl0b3JzLnB1c2goZW50cnkpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVkaXRvcnNNYXBbZmlsZVBhdGhdID0ge1xuICAgICAgICBhZGRlZDogW10sXG4gICAgICAgIHJlbW92ZWQ6IFtdLFxuICAgICAgICBlZGl0b3JzOiBbZW50cnldLFxuICAgICAgfVxuICAgICAgZmlsZVBhdGhzLnB1c2goZmlsZVBhdGgpXG4gICAgfVxuICB9XG4gIHJldHVybiB7IGVkaXRvcnNNYXAsIGZpbGVQYXRocyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJNZXNzYWdlcyhtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4sIGZpbGVQYXRoOiA/c3RyaW5nLCBzZXZlcml0eTogP3N0cmluZyA9IG51bGwpOiBBcnJheTxMaW50ZXJNZXNzYWdlPiB7XG4gIGNvbnN0IGZpbHRlcmVkID0gW11cbiAgbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgaWYgKChmaWxlUGF0aCA9PT0gbnVsbCB8fCAkZmlsZShtZXNzYWdlKSA9PT0gZmlsZVBhdGgpICYmICghc2V2ZXJpdHkgfHwgbWVzc2FnZS5zZXZlcml0eSA9PT0gc2V2ZXJpdHkpKSB7XG4gICAgICBmaWx0ZXJlZC5wdXNoKG1lc3NhZ2UpXG4gICAgfVxuICB9KVxuICByZXR1cm4gZmlsdGVyZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQobWVzc2FnZXM6IFNldDxMaW50ZXJNZXNzYWdlPiB8IEFycmF5PExpbnRlck1lc3NhZ2U+LCBmaWxlUGF0aDogc3RyaW5nLCByYW5nZU9yUG9pbnQ6IFBvaW50IHwgUmFuZ2UpOiBBcnJheTxMaW50ZXJNZXNzYWdlPiB7XG4gIGNvbnN0IGZpbHRlcmVkID0gW11cbiAgY29uc3QgZXhwZWN0ZWRSYW5nZSA9IHJhbmdlT3JQb2ludC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnUG9pbnQnID8gbmV3IFJhbmdlKHJhbmdlT3JQb2ludCwgcmFuZ2VPclBvaW50KSA6IFJhbmdlLmZyb21PYmplY3QocmFuZ2VPclBvaW50KVxuICBtZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBmaWxlID0gJGZpbGUobWVzc2FnZSlcbiAgICBjb25zdCByYW5nZSA9ICRyYW5nZShtZXNzYWdlKVxuICAgIGlmIChmaWxlICYmIHJhbmdlICYmIGZpbGUgPT09IGZpbGVQYXRoICYmIHJhbmdlLmludGVyc2VjdHNXaXRoKGV4cGVjdGVkUmFuZ2UpKSB7XG4gICAgICBmaWx0ZXJlZC5wdXNoKG1lc3NhZ2UpXG4gICAgfVxuICB9KVxuICByZXR1cm4gZmlsdGVyZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5GaWxlKGZpbGU6IHN0cmluZywgcG9zaXRpb246ID9Qb2ludCkge1xuICBjb25zdCBvcHRpb25zID0ge31cbiAgb3B0aW9ucy5zZWFyY2hBbGxQYW5lcyA9IHRydWVcbiAgaWYgKHBvc2l0aW9uKSB7XG4gICAgb3B0aW9ucy5pbml0aWFsTGluZSA9IHBvc2l0aW9uLnJvd1xuICAgIG9wdGlvbnMuaW5pdGlhbENvbHVtbiA9IHBvc2l0aW9uLmNvbHVtblxuICB9XG4gIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZSwgb3B0aW9ucylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZpc2l0TWVzc2FnZShtZXNzYWdlOiBMaW50ZXJNZXNzYWdlLCByZWZlcmVuY2U6IGJvb2xlYW4gPSBmYWxzZSkge1xuICBsZXQgbWVzc2FnZUZpbGVcbiAgbGV0IG1lc3NhZ2VQb3NpdGlvblxuICBpZiAocmVmZXJlbmNlKSB7XG4gICAgaWYgKG1lc3NhZ2UudmVyc2lvbiAhPT0gMikge1xuICAgICAgY29uc29sZS53YXJuKCdbTGludGVyLVVJLURlZmF1bHRdIE9ubHkgbWVzc2FnZXMgdjIgYXJlIGFsbG93ZWQgaW4ganVtcCB0byByZWZlcmVuY2UuIElnbm9yaW5nJylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoIW1lc3NhZ2UucmVmZXJlbmNlIHx8ICFtZXNzYWdlLnJlZmVyZW5jZS5maWxlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMaW50ZXItVUktRGVmYXVsdF0gTWVzc2FnZSBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgcmVmZXJlbmNlLiBJZ25vcmluZycpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbWVzc2FnZUZpbGUgPSBtZXNzYWdlLnJlZmVyZW5jZS5maWxlXG4gICAgbWVzc2FnZVBvc2l0aW9uID0gbWVzc2FnZS5yZWZlcmVuY2UucG9zaXRpb25cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBtZXNzYWdlUmFuZ2UgPSAkcmFuZ2UobWVzc2FnZSlcbiAgICBtZXNzYWdlRmlsZSA9ICRmaWxlKG1lc3NhZ2UpXG4gICAgaWYgKG1lc3NhZ2VSYW5nZSkge1xuICAgICAgbWVzc2FnZVBvc2l0aW9uID0gbWVzc2FnZVJhbmdlLnN0YXJ0XG4gICAgfVxuICB9XG4gIGlmIChtZXNzYWdlRmlsZSkge1xuICAgIG9wZW5GaWxlKG1lc3NhZ2VGaWxlLCBtZXNzYWdlUG9zaXRpb24pXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5FeHRlcm5hbGx5KG1lc3NhZ2U6IExpbnRlck1lc3NhZ2UpOiB2b2lkIHtcbiAgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMiAmJiBtZXNzYWdlLnVybCkge1xuICAgIHNoZWxsLm9wZW5FeHRlcm5hbChtZXNzYWdlLnVybClcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc29ydE1lc3NhZ2VzKHNvcnRJbmZvOiBBcnJheTx7IGNvbHVtbjogc3RyaW5nLCB0eXBlOiAnYXNjJyB8ICdkZXNjJyB9Piwgcm93czogQXJyYXk8TGludGVyTWVzc2FnZT4pOiBBcnJheTxMaW50ZXJNZXNzYWdlPiB7XG4gIGNvbnN0IHNvcnRDb2x1bW5zIDoge1xuICAgIHNldmVyaXR5PzogJ2FzYycgfCAnZGVzYycsXG4gICAgbGludGVyTmFtZT86ICdhc2MnIHwgJ2Rlc2MnLFxuICAgIGZpbGU/OiAnYXNjJyB8ICdkZXNjJyxcbiAgICBsaW5lPzogJ2FzYycgfCAnZGVzYydcbiAgfSA9IHt9XG5cbiAgc29ydEluZm8uZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuICAgIHNvcnRDb2x1bW5zW2VudHJ5LmNvbHVtbl0gPSBlbnRyeS50eXBlXG4gIH0pXG5cbiAgcmV0dXJuIHJvd3Muc2xpY2UoKS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBpZiAoc29ydENvbHVtbnMuc2V2ZXJpdHkpIHtcbiAgICAgIGNvbnN0IG11bHRpcGx5V2l0aCA9IHNvcnRDb2x1bW5zLnNldmVyaXR5ID09PSAnYXNjJyA/IDEgOiAtMVxuICAgICAgY29uc3Qgc2V2ZXJpdHlBID0gc2V2ZXJpdHlTY29yZVthLnNldmVyaXR5XVxuICAgICAgY29uc3Qgc2V2ZXJpdHlCID0gc2V2ZXJpdHlTY29yZVtiLnNldmVyaXR5XVxuICAgICAgaWYgKHNldmVyaXR5QSAhPT0gc2V2ZXJpdHlCKSB7XG4gICAgICAgIHJldHVybiBtdWx0aXBseVdpdGggKiAoc2V2ZXJpdHlBID4gc2V2ZXJpdHlCID8gMSA6IC0xKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc29ydENvbHVtbnMubGludGVyTmFtZSkge1xuICAgICAgY29uc3QgbXVsdGlwbHlXaXRoID0gc29ydENvbHVtbnMubGludGVyTmFtZSA9PT0gJ2FzYycgPyAxIDogLTFcbiAgICAgIGNvbnN0IHNvcnRWYWx1ZSA9IGEuc2V2ZXJpdHkubG9jYWxlQ29tcGFyZShiLnNldmVyaXR5KVxuICAgICAgaWYgKHNvcnRWYWx1ZSAhPT0gMCkge1xuICAgICAgICByZXR1cm4gbXVsdGlwbHlXaXRoICogc29ydFZhbHVlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzb3J0Q29sdW1ucy5maWxlKSB7XG4gICAgICBjb25zdCBtdWx0aXBseVdpdGggPSBzb3J0Q29sdW1ucy5maWxlID09PSAnYXNjJyA/IDEgOiAtMVxuICAgICAgY29uc3QgZmlsZUEgPSBnZXRQYXRoT2ZNZXNzYWdlKGEpXG4gICAgICBjb25zdCBmaWxlQUxlbmd0aCA9IGZpbGVBLmxlbmd0aFxuICAgICAgY29uc3QgZmlsZUIgPSBnZXRQYXRoT2ZNZXNzYWdlKGIpXG4gICAgICBjb25zdCBmaWxlQkxlbmd0aCA9IGZpbGVCLmxlbmd0aFxuICAgICAgaWYgKGZpbGVBTGVuZ3RoICE9PSBmaWxlQkxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbXVsdGlwbHlXaXRoICogKGZpbGVBTGVuZ3RoID4gZmlsZUJMZW5ndGggPyAxIDogLTEpXG4gICAgICB9IGVsc2UgaWYgKGZpbGVBICE9PSBmaWxlQikge1xuICAgICAgICByZXR1cm4gbXVsdGlwbHlXaXRoICogZmlsZUEubG9jYWxlQ29tcGFyZShmaWxlQilcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNvcnRDb2x1bW5zLmxpbmUpIHtcbiAgICAgIGNvbnN0IG11bHRpcGx5V2l0aCA9IHNvcnRDb2x1bW5zLmxpbmUgPT09ICdhc2MnID8gMSA6IC0xXG4gICAgICBjb25zdCByYW5nZUEgPSAkcmFuZ2UoYSlcbiAgICAgIGNvbnN0IHJhbmdlQiA9ICRyYW5nZShiKVxuICAgICAgaWYgKHJhbmdlQSAmJiAhcmFuZ2VCKSB7XG4gICAgICAgIHJldHVybiAxXG4gICAgICB9IGVsc2UgaWYgKHJhbmdlQiAmJiAhcmFuZ2VBKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfSBlbHNlIGlmIChyYW5nZUEgJiYgcmFuZ2VCKSB7XG4gICAgICAgIGlmIChyYW5nZUEuc3RhcnQucm93ICE9PSByYW5nZUIuc3RhcnQucm93KSB7XG4gICAgICAgICAgcmV0dXJuIG11bHRpcGx5V2l0aCAqIChyYW5nZUEuc3RhcnQucm93ID4gcmFuZ2VCLnN0YXJ0LnJvdyA/IDEgOiAtMSlcbiAgICAgICAgfVxuICAgICAgICBpZiAocmFuZ2VBLnN0YXJ0LmNvbHVtbiAhPT0gcmFuZ2VCLnN0YXJ0LmNvbHVtbikge1xuICAgICAgICAgIHJldHVybiBtdWx0aXBseVdpdGggKiAocmFuZ2VBLnN0YXJ0LmNvbHVtbiA+IHJhbmdlQi5zdGFydC5jb2x1bW4gPyAxIDogLTEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMFxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc29ydFNvbHV0aW9ucyhzb2x1dGlvbnM6IEFycmF5PE9iamVjdD4pOiBBcnJheTxPYmplY3Q+IHtcbiAgcmV0dXJuIHNvbHV0aW9ucy5zbGljZSgpLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlTb2x1dGlvbih0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yLCB2ZXJzaW9uOiAxIHwgMiwgc29sdXRpb246IE9iamVjdCk6IGJvb2xlYW4ge1xuICBpZiAoc29sdXRpb24uYXBwbHkpIHtcbiAgICBzb2x1dGlvbi5hcHBseSgpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCByYW5nZSA9IHZlcnNpb24gPT09IDEgPyBzb2x1dGlvbi5yYW5nZSA6IHNvbHV0aW9uLnBvc2l0aW9uXG4gIGNvbnN0IGN1cnJlbnRUZXh0ID0gdmVyc2lvbiA9PT0gMSA/IHNvbHV0aW9uLm9sZFRleHQgOiBzb2x1dGlvbi5jdXJyZW50VGV4dFxuICBjb25zdCByZXBsYWNlV2l0aCA9IHZlcnNpb24gPT09IDEgPyBzb2x1dGlvbi5uZXdUZXh0IDogc29sdXRpb24ucmVwbGFjZVdpdGhcbiAgaWYgKGN1cnJlbnRUZXh0KSB7XG4gICAgY29uc3QgdGV4dEluUmFuZ2UgPSB0ZXh0RWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgIGlmIChjdXJyZW50VGV4dCAhPT0gdGV4dEluUmFuZ2UpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2xpbnRlci11aS1kZWZhdWx0XSBOb3QgYXBwbHlpbmcgZml4IGJlY2F1c2UgdGV4dCBkaWQgbm90IG1hdGNoIHRoZSBleHBlY3RlZCBvbmUnLCAnZXhwZWN0ZWQnLCBjdXJyZW50VGV4dCwgJ2J1dCBnb3QnLCB0ZXh0SW5SYW5nZSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuICB0ZXh0RWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlLCByZXBsYWNlV2l0aClcbiAgcmV0dXJuIHRydWVcbn1cbiJdfQ==