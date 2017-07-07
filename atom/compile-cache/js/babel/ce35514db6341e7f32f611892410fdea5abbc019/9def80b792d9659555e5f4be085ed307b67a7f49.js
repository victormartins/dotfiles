Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getElement = getElement;

// eslint-disable-next-line import/prefer-default-export

function getElement(icon) {
  var element = document.createElement('a');
  var iconElement = document.createElement('span');

  iconElement.classList.add('icon');
  iconElement.classList.add('icon-' + icon);

  element.appendChild(iconElement);
  element.appendChild(document.createTextNode(''));

  return element;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvc3RhdHVzLWJhci9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHTyxTQUFTLFVBQVUsQ0FBQyxJQUFZLEVBQWU7QUFDcEQsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUMzQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBOztBQUVsRCxhQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNqQyxhQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsV0FBUyxJQUFJLENBQUcsQ0FBQTs7QUFFekMsU0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUNoQyxTQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFaEQsU0FBTyxPQUFPLENBQUE7Q0FDZiIsImZpbGUiOiIvVXNlcnMvdmljdG9yLm1hcnRpbnMvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3N0YXR1cy1iYXIvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0XG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudChpY29uOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgY29uc3QgaWNvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcblxuICBpY29uRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpY29uJylcbiAgaWNvbkVsZW1lbnQuY2xhc3NMaXN0LmFkZChgaWNvbi0ke2ljb259YClcblxuICBlbGVtZW50LmFwcGVuZENoaWxkKGljb25FbGVtZW50KVxuICBlbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSlcblxuICByZXR1cm4gZWxlbWVudFxufVxuIl19