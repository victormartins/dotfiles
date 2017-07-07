function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndieRegistry = require('../lib/indie-registry');

var _libIndieRegistry2 = _interopRequireDefault(_libIndieRegistry);

var _common = require('./common');

describe('IndieRegistry', function () {
  var indieRegistry = undefined;

  beforeEach(function () {
    indieRegistry = new _libIndieRegistry2['default']();
  });
  afterEach(function () {
    indieRegistry.dispose();
  });

  it('triggers observe with existing and new delegates', function () {
    var observeCalled = 0;
    indieRegistry.register({ name: 'Chi' }, 2);
    indieRegistry.observe(function () {
      observeCalled++;
    });
    expect(observeCalled).toBe(1);
    indieRegistry.register({ name: 'Ping' }, 2);
    expect(observeCalled).toBe(2);
    indieRegistry.register({ name: 'Pong' }, 2);
    expect(observeCalled).toBe(3);
  });
  it('removes delegates from registry as soon as they are dispose', function () {
    expect(indieRegistry.delegates.size).toBe(0);
    var delegate = indieRegistry.register({ name: 'Chi' }, 2);
    expect(indieRegistry.delegates.size).toBe(1);
    delegate.dispose();
    expect(indieRegistry.delegates.size).toBe(0);
  });
  it('triggers update as delegates are updated', function () {
    var timesUpdated = 0;
    indieRegistry.onDidUpdate(function () {
      timesUpdated++;
    });
    expect(timesUpdated).toBe(0);
    var delegate = indieRegistry.register({ name: 'Panda' }, 2);
    expect(timesUpdated).toBe(0);
    delegate.setAllMessages([(0, _common.getMessage)()]);
    expect(timesUpdated).toBe(1);
    delegate.setAllMessages([(0, _common.getMessage)()]);
    expect(timesUpdated).toBe(2);
    delegate.dispose();
    delegate.setAllMessages([(0, _common.getMessage)()]);
    expect(timesUpdated).toBe(2);
  });
  it('passes on version correctly to the delegates', function () {
    expect(indieRegistry.register({ name: 'Ola' }, 2).version).toBe(2);
    expect(indieRegistry.register({ name: 'Hello' }, 1).version).toBe(1);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9pbmRpZS1yZWdpc3RyeS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O2dDQUUwQix1QkFBdUI7Ozs7c0JBQ3RCLFVBQVU7O0FBRXJDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBVztBQUNuQyxNQUFJLGFBQWEsWUFBQSxDQUFBOztBQUVqQixZQUFVLENBQUMsWUFBVztBQUNwQixpQkFBYSxHQUFHLG1DQUFtQixDQUFBO0dBQ3BDLENBQUMsQ0FBQTtBQUNGLFdBQVMsQ0FBQyxZQUFXO0FBQ25CLGlCQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7R0FDeEIsQ0FBQyxDQUFBOztBQUVGLElBQUUsQ0FBQyxrREFBa0QsRUFBRSxZQUFXO0FBQ2hFLFFBQUksYUFBYSxHQUFHLENBQUMsQ0FBQTtBQUNyQixpQkFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUMxQyxpQkFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFXO0FBQy9CLG1CQUFhLEVBQUUsQ0FBQTtLQUNoQixDQUFDLENBQUE7QUFDRixVQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzdCLGlCQUFhLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzNDLFVBQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDN0IsaUJBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDM0MsVUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUM5QixDQUFDLENBQUE7QUFDRixJQUFFLENBQUMsNkRBQTZELEVBQUUsWUFBVztBQUMzRSxVQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUMsUUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUMzRCxVQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUMsWUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2xCLFVBQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUM3QyxDQUFDLENBQUE7QUFDRixJQUFFLENBQUMsMENBQTBDLEVBQUUsWUFBVztBQUN4RCxRQUFJLFlBQVksR0FBRyxDQUFDLENBQUE7QUFDcEIsaUJBQWEsQ0FBQyxXQUFXLENBQUMsWUFBVztBQUNuQyxrQkFBWSxFQUFFLENBQUE7S0FDZixDQUFDLENBQUE7QUFDRixVQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVCLFFBQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDN0QsVUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM1QixZQUFRLENBQUMsY0FBYyxDQUFDLENBQUMseUJBQVksQ0FBQyxDQUFDLENBQUE7QUFDdkMsVUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM1QixZQUFRLENBQUMsY0FBYyxDQUFDLENBQUMseUJBQVksQ0FBQyxDQUFDLENBQUE7QUFDdkMsVUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM1QixZQUFRLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDbEIsWUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLHlCQUFZLENBQUMsQ0FBQyxDQUFBO0FBQ3ZDLFVBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7R0FDN0IsQ0FBQyxDQUFBO0FBQ0YsSUFBRSxDQUFDLDhDQUE4QyxFQUFFLFlBQVc7QUFDNUQsVUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2xFLFVBQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUNyRSxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2luZGllLXJlZ2lzdHJ5LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgSW5kaWVSZWdpc3RyeSBmcm9tICcuLi9saWIvaW5kaWUtcmVnaXN0cnknXG5pbXBvcnQgeyBnZXRNZXNzYWdlIH0gZnJvbSAnLi9jb21tb24nXG5cbmRlc2NyaWJlKCdJbmRpZVJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XG4gIGxldCBpbmRpZVJlZ2lzdHJ5XG5cbiAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICBpbmRpZVJlZ2lzdHJ5ID0gbmV3IEluZGllUmVnaXN0cnkoKVxuICB9KVxuICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XG4gICAgaW5kaWVSZWdpc3RyeS5kaXNwb3NlKClcbiAgfSlcblxuICBpdCgndHJpZ2dlcnMgb2JzZXJ2ZSB3aXRoIGV4aXN0aW5nIGFuZCBuZXcgZGVsZWdhdGVzJywgZnVuY3Rpb24oKSB7XG4gICAgbGV0IG9ic2VydmVDYWxsZWQgPSAwXG4gICAgaW5kaWVSZWdpc3RyeS5yZWdpc3Rlcih7IG5hbWU6ICdDaGknIH0sIDIpXG4gICAgaW5kaWVSZWdpc3RyeS5vYnNlcnZlKGZ1bmN0aW9uKCkge1xuICAgICAgb2JzZXJ2ZUNhbGxlZCsrXG4gICAgfSlcbiAgICBleHBlY3Qob2JzZXJ2ZUNhbGxlZCkudG9CZSgxKVxuICAgIGluZGllUmVnaXN0cnkucmVnaXN0ZXIoeyBuYW1lOiAnUGluZycgfSwgMilcbiAgICBleHBlY3Qob2JzZXJ2ZUNhbGxlZCkudG9CZSgyKVxuICAgIGluZGllUmVnaXN0cnkucmVnaXN0ZXIoeyBuYW1lOiAnUG9uZycgfSwgMilcbiAgICBleHBlY3Qob2JzZXJ2ZUNhbGxlZCkudG9CZSgzKVxuICB9KVxuICBpdCgncmVtb3ZlcyBkZWxlZ2F0ZXMgZnJvbSByZWdpc3RyeSBhcyBzb29uIGFzIHRoZXkgYXJlIGRpc3Bvc2UnLCBmdW5jdGlvbigpIHtcbiAgICBleHBlY3QoaW5kaWVSZWdpc3RyeS5kZWxlZ2F0ZXMuc2l6ZSkudG9CZSgwKVxuICAgIGNvbnN0IGRlbGVnYXRlID0gaW5kaWVSZWdpc3RyeS5yZWdpc3Rlcih7IG5hbWU6ICdDaGknIH0sIDIpXG4gICAgZXhwZWN0KGluZGllUmVnaXN0cnkuZGVsZWdhdGVzLnNpemUpLnRvQmUoMSlcbiAgICBkZWxlZ2F0ZS5kaXNwb3NlKClcbiAgICBleHBlY3QoaW5kaWVSZWdpc3RyeS5kZWxlZ2F0ZXMuc2l6ZSkudG9CZSgwKVxuICB9KVxuICBpdCgndHJpZ2dlcnMgdXBkYXRlIGFzIGRlbGVnYXRlcyBhcmUgdXBkYXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGxldCB0aW1lc1VwZGF0ZWQgPSAwXG4gICAgaW5kaWVSZWdpc3RyeS5vbkRpZFVwZGF0ZShmdW5jdGlvbigpIHtcbiAgICAgIHRpbWVzVXBkYXRlZCsrXG4gICAgfSlcbiAgICBleHBlY3QodGltZXNVcGRhdGVkKS50b0JlKDApXG4gICAgY29uc3QgZGVsZWdhdGUgPSBpbmRpZVJlZ2lzdHJ5LnJlZ2lzdGVyKHsgbmFtZTogJ1BhbmRhJyB9LCAyKVxuICAgIGV4cGVjdCh0aW1lc1VwZGF0ZWQpLnRvQmUoMClcbiAgICBkZWxlZ2F0ZS5zZXRBbGxNZXNzYWdlcyhbZ2V0TWVzc2FnZSgpXSlcbiAgICBleHBlY3QodGltZXNVcGRhdGVkKS50b0JlKDEpXG4gICAgZGVsZWdhdGUuc2V0QWxsTWVzc2FnZXMoW2dldE1lc3NhZ2UoKV0pXG4gICAgZXhwZWN0KHRpbWVzVXBkYXRlZCkudG9CZSgyKVxuICAgIGRlbGVnYXRlLmRpc3Bvc2UoKVxuICAgIGRlbGVnYXRlLnNldEFsbE1lc3NhZ2VzKFtnZXRNZXNzYWdlKCldKVxuICAgIGV4cGVjdCh0aW1lc1VwZGF0ZWQpLnRvQmUoMilcbiAgfSlcbiAgaXQoJ3Bhc3NlcyBvbiB2ZXJzaW9uIGNvcnJlY3RseSB0byB0aGUgZGVsZWdhdGVzJywgZnVuY3Rpb24oKSB7XG4gICAgZXhwZWN0KGluZGllUmVnaXN0cnkucmVnaXN0ZXIoeyBuYW1lOiAnT2xhJyB9LCAyKS52ZXJzaW9uKS50b0JlKDIpXG4gICAgZXhwZWN0KGluZGllUmVnaXN0cnkucmVnaXN0ZXIoeyBuYW1lOiAnSGVsbG8nIH0sIDEpLnZlcnNpb24pLnRvQmUoMSlcbiAgfSlcbn0pXG4iXX0=