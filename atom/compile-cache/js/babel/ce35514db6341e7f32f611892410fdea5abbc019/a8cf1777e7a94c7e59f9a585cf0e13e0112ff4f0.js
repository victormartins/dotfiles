function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libElement = require('../lib/element');

var _libElement2 = _interopRequireDefault(_libElement);

describe('Element', function () {
  var element = undefined;

  beforeEach(function () {
    element = new _libElement2['default']();
    spyOn(element, 'setTooltip').andCallThrough();
    spyOn(element, 'setBusy').andCallThrough();
  });
  afterEach(function () {
    element.dispose();
  });

  it('sets a title properly', function () {
    element.update(['Hello'], []);
    expect(element.setBusy).toHaveBeenCalledWith(true);
    expect(element.setTooltip).toHaveBeenCalledWith('<strong>Current:</strong><br>Hello');
  });
  it('escapes the given texts', function () {
    element.update(['<div>'], []);
    expect(element.setBusy).toHaveBeenCalledWith(true);
    expect(element.setTooltip).toHaveBeenCalledWith('<strong>Current:</strong><br>&lt;div&gt;');
  });
  it('shows idle message when nothing is provided', function () {
    element.update([], []);
    expect(element.setBusy).toHaveBeenCalledWith(false);
    expect(element.setTooltip).toHaveBeenCalledWith('Idle');
  });
  it('shows only history when current is not present', function () {
    element.update([], [{ title: 'Yo', duration: '1m' }]);
    expect(element.setBusy).toHaveBeenCalledWith(false);
    expect(element.setTooltip).toHaveBeenCalledWith('<strong>History:</strong><br>Yo (1m)');
  });
  it('shows both history and current when both are present', function () {
    element.update(['Hey'], [{ title: 'Yo', duration: '1m' }]);
    expect(element.setBusy).toHaveBeenCalledWith(true);
    expect(element.setTooltip).toHaveBeenCalledWith('<strong>History:</strong><br>Yo (1m)<br><strong>Current:</strong><br>Hey');
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9zcGVjL2VsZW1lbnQtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzswQkFFb0IsZ0JBQWdCOzs7O0FBRXBDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsWUFBVztBQUM3QixNQUFJLE9BQU8sWUFBQSxDQUFBOztBQUVYLFlBQVUsQ0FBQyxZQUFXO0FBQ3BCLFdBQU8sR0FBRyw2QkFBYSxDQUFBO0FBQ3ZCLFNBQUssQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDN0MsU0FBSyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtHQUMzQyxDQUFDLENBQUE7QUFDRixXQUFTLENBQUMsWUFBVztBQUNuQixXQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7R0FDbEIsQ0FBQyxDQUFBOztBQUVGLElBQUUsQ0FBQyx1QkFBdUIsRUFBRSxZQUFXO0FBQ3JDLFdBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUM3QixVQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2xELFVBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsb0JBQW9CLENBQUMsb0NBQW9DLENBQUMsQ0FBQTtHQUN0RixDQUFDLENBQUE7QUFDRixJQUFFLENBQUMseUJBQXlCLEVBQUUsWUFBVztBQUN2QyxXQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDN0IsVUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNsRCxVQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLDBDQUEwQyxDQUFDLENBQUE7R0FDNUYsQ0FBQyxDQUFBO0FBQ0YsSUFBRSxDQUFDLDZDQUE2QyxFQUFFLFlBQVc7QUFDM0QsV0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDdEIsVUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNuRCxVQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFBO0dBQ3hELENBQUMsQ0FBQTtBQUNGLElBQUUsQ0FBQyxnREFBZ0QsRUFBRSxZQUFXO0FBQzlELFdBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDckQsVUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNuRCxVQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLHNDQUFzQyxDQUFDLENBQUE7R0FDeEYsQ0FBQyxDQUFBO0FBQ0YsSUFBRSxDQUFDLHNEQUFzRCxFQUFFLFlBQVc7QUFDcEUsV0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDMUQsVUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNsRCxVQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLDBFQUEwRSxDQUFDLENBQUE7R0FDNUgsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9zcGVjL2VsZW1lbnQtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBFbGVtZW50IGZyb20gJy4uL2xpYi9lbGVtZW50J1xuXG5kZXNjcmliZSgnRWxlbWVudCcsIGZ1bmN0aW9uKCkge1xuICBsZXQgZWxlbWVudFxuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgZWxlbWVudCA9IG5ldyBFbGVtZW50KClcbiAgICBzcHlPbihlbGVtZW50LCAnc2V0VG9vbHRpcCcpLmFuZENhbGxUaHJvdWdoKClcbiAgICBzcHlPbihlbGVtZW50LCAnc2V0QnVzeScpLmFuZENhbGxUaHJvdWdoKClcbiAgfSlcbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgIGVsZW1lbnQuZGlzcG9zZSgpXG4gIH0pXG5cbiAgaXQoJ3NldHMgYSB0aXRsZSBwcm9wZXJseScsIGZ1bmN0aW9uKCkge1xuICAgIGVsZW1lbnQudXBkYXRlKFsnSGVsbG8nXSwgW10pXG4gICAgZXhwZWN0KGVsZW1lbnQuc2V0QnVzeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICBleHBlY3QoZWxlbWVudC5zZXRUb29sdGlwKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnPHN0cm9uZz5DdXJyZW50Ojwvc3Ryb25nPjxicj5IZWxsbycpXG4gIH0pXG4gIGl0KCdlc2NhcGVzIHRoZSBnaXZlbiB0ZXh0cycsIGZ1bmN0aW9uKCkge1xuICAgIGVsZW1lbnQudXBkYXRlKFsnPGRpdj4nXSwgW10pXG4gICAgZXhwZWN0KGVsZW1lbnQuc2V0QnVzeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICBleHBlY3QoZWxlbWVudC5zZXRUb29sdGlwKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnPHN0cm9uZz5DdXJyZW50Ojwvc3Ryb25nPjxicj4mbHQ7ZGl2Jmd0OycpXG4gIH0pXG4gIGl0KCdzaG93cyBpZGxlIG1lc3NhZ2Ugd2hlbiBub3RoaW5nIGlzIHByb3ZpZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgZWxlbWVudC51cGRhdGUoW10sIFtdKVxuICAgIGV4cGVjdChlbGVtZW50LnNldEJ1c3kpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlKVxuICAgIGV4cGVjdChlbGVtZW50LnNldFRvb2x0aXApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdJZGxlJylcbiAgfSlcbiAgaXQoJ3Nob3dzIG9ubHkgaGlzdG9yeSB3aGVuIGN1cnJlbnQgaXMgbm90IHByZXNlbnQnLCBmdW5jdGlvbigpIHtcbiAgICBlbGVtZW50LnVwZGF0ZShbXSwgW3sgdGl0bGU6ICdZbycsIGR1cmF0aW9uOiAnMW0nIH1dKVxuICAgIGV4cGVjdChlbGVtZW50LnNldEJ1c3kpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlKVxuICAgIGV4cGVjdChlbGVtZW50LnNldFRvb2x0aXApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCc8c3Ryb25nPkhpc3Rvcnk6PC9zdHJvbmc+PGJyPllvICgxbSknKVxuICB9KVxuICBpdCgnc2hvd3MgYm90aCBoaXN0b3J5IGFuZCBjdXJyZW50IHdoZW4gYm90aCBhcmUgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xuICAgIGVsZW1lbnQudXBkYXRlKFsnSGV5J10sIFt7IHRpdGxlOiAnWW8nLCBkdXJhdGlvbjogJzFtJyB9XSlcbiAgICBleHBlY3QoZWxlbWVudC5zZXRCdXN5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKVxuICAgIGV4cGVjdChlbGVtZW50LnNldFRvb2x0aXApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCc8c3Ryb25nPkhpc3Rvcnk6PC9zdHJvbmc+PGJyPllvICgxbSk8YnI+PHN0cm9uZz5DdXJyZW50Ojwvc3Ryb25nPjxicj5IZXknKVxuICB9KVxufSlcbiJdfQ==