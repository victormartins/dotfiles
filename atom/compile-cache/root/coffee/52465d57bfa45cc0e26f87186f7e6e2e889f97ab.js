(function() {
  var SelectListView;

  SelectListView = require("atom-select-list");

  module.exports = {
    init: function(flowRegistry) {
      this.flowRegistry = flowRegistry;
      this.selectListView = new SelectListView({
        emptyMessage: 'No flows in the registry.',
        itemsClassList: ['mark-active'],
        items: [],
        filterKeyForItem: function(item) {
          return item.title + item.description;
        },
        elementForItem: (function(_this) {
          return function(item) {
            var element, html;
            element = document.createElement('li');
            if (item.flow === _this.currentFlow) {
              element.classList.add('active');
            }
            html = "<b>" + item.title + "</b>";
            if (item.description) {
              html += "<b>:</b> " + item.description;
            }
            element.innerHTML = html;
            return element;
          };
        })(this),
        didConfirmSelection: (function(_this) {
          return function(item) {
            _this.cancel();
            return _this.flowRegistry.selectFlow(item.code);
          };
        })(this),
        didCancelSelection: (function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this)
      });
      return this.selectListView.element.classList.add('flow-list');
    },
    dispose: function() {
      this.cancel();
      return this.selectListView.destroy();
    },
    cancel: function() {
      if (this.panel != null) {
        this.panel.destroy();
      }
      this.panel = null;
      this.currentFlow = null;
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        return this.previouslyFocusedElement = null;
      }
    },
    attach: function() {
      this.previouslyFocusedElement = document.activeElement;
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this.selectListView
        });
      }
      this.selectListView.focus();
      return this.selectListView.reset();
    },
    toggle: function() {
      var code, flow, flows, ref;
      if (this.panel != null) {
        return this.cancel();
      } else {
        this.currentFlow = this.flowRegistry.flow;
        flows = [];
        ref = this.flowRegistry.flows;
        for (code in ref) {
          flow = ref[code];
          flows.push({
            code: code,
            flow: flow,
            title: flow.title ? flow.title : code,
            description: flow.description
          });
        }
        this.selectListView.update({
          items: flows
        });
        return this.attach();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zL2RvdGZpbGVzL2F0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvZmxvdy1saXN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsa0JBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxJQUFBLEVBQU0sU0FBQyxZQUFEO01BQ0osSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLGNBQUQsR0FBc0IsSUFBQSxjQUFBLENBQWU7UUFDbkMsWUFBQSxFQUFjLDJCQURxQjtRQUVuQyxjQUFBLEVBQWdCLENBQUMsYUFBRCxDQUZtQjtRQUduQyxLQUFBLEVBQU8sRUFINEI7UUFJbkMsZ0JBQUEsRUFBa0IsU0FBQyxJQUFEO2lCQUFVLElBQUksQ0FBQyxLQUFMLEdBQWEsSUFBSSxDQUFDO1FBQTVCLENBSmlCO1FBS25DLGNBQUEsRUFBZ0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxJQUFEO0FBQ2QsZ0JBQUE7WUFBQSxPQUFBLEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkI7WUFDVixJQUFHLElBQUksQ0FBQyxJQUFMLEtBQWEsS0FBQyxDQUFBLFdBQWpCO2NBQ0UsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQixDQUFzQixRQUF0QixFQURGOztZQUVBLElBQUEsR0FBTyxLQUFBLEdBQU0sSUFBSSxDQUFDLEtBQVgsR0FBaUI7WUFDeEIsSUFBMEMsSUFBSSxDQUFDLFdBQS9DO2NBQUEsSUFBQSxJQUFRLFdBQUEsR0FBWSxJQUFJLENBQUMsWUFBekI7O1lBQ0EsT0FBTyxDQUFDLFNBQVIsR0FBb0I7bUJBQ3BCO1VBUGM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTG1CO1FBYW5DLG1CQUFBLEVBQXFCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsSUFBRDtZQUNuQixLQUFDLENBQUEsTUFBRCxDQUFBO21CQUNBLEtBQUMsQ0FBQSxZQUFZLENBQUMsVUFBZCxDQUF5QixJQUFJLENBQUMsSUFBOUI7VUFGbUI7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBYmM7UUFnQm5DLGtCQUFBLEVBQW9CLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ2xCLEtBQUMsQ0FBQSxNQUFELENBQUE7VUFEa0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBaEJlO09BQWY7YUFtQnRCLElBQUMsQ0FBQSxjQUFjLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQyxDQUFzQyxXQUF0QztJQXJCSSxDQUFOO0lBdUJBLE9BQUEsRUFBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLE1BQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsT0FBaEIsQ0FBQTtJQUZPLENBdkJUO0lBMkJBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBRyxrQkFBSDtRQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBLEVBREY7O01BRUEsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUNULElBQUMsQ0FBQSxXQUFELEdBQWU7TUFDZixJQUFHLElBQUMsQ0FBQSx3QkFBSjtRQUNFLElBQUMsQ0FBQSx3QkFBd0IsQ0FBQyxLQUExQixDQUFBO2VBQ0EsSUFBQyxDQUFBLHdCQUFELEdBQTRCLEtBRjlCOztJQUxNLENBM0JSO0lBb0NBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBQyxDQUFBLHdCQUFELEdBQTRCLFFBQVEsQ0FBQztNQUNyQyxJQUFPLGtCQUFQO1FBQ0UsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQyxJQUFBLEVBQU0sSUFBQyxDQUFBLGNBQVI7U0FBN0IsRUFEWDs7TUFFQSxJQUFDLENBQUEsY0FBYyxDQUFDLEtBQWhCLENBQUE7YUFDQSxJQUFDLENBQUEsY0FBYyxDQUFDLEtBQWhCLENBQUE7SUFMTSxDQXBDUjtJQTJDQSxNQUFBLEVBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxJQUFHLGtCQUFIO2VBQ0UsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURGO09BQUEsTUFBQTtRQUdFLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQVksQ0FBQztRQUM3QixLQUFBLEdBQVE7QUFDUjtBQUFBLGFBQUEsV0FBQTs7VUFDRSxLQUFLLENBQUMsSUFBTixDQUFXO1lBQ1QsSUFBQSxFQUFNLElBREc7WUFFVCxJQUFBLEVBQU0sSUFGRztZQUdULEtBQUEsRUFBVSxJQUFJLENBQUMsS0FBUixHQUFtQixJQUFJLENBQUMsS0FBeEIsR0FBbUMsSUFIakM7WUFJVCxXQUFBLEVBQWEsSUFBSSxDQUFDLFdBSlQ7V0FBWDtBQURGO1FBT0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxNQUFoQixDQUF1QjtVQUFDLEtBQUEsRUFBTyxLQUFSO1NBQXZCO2VBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQWJGOztJQURNLENBM0NSOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsiU2VsZWN0TGlzdFZpZXcgPSByZXF1aXJlIFwiYXRvbS1zZWxlY3QtbGlzdFwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgaW5pdDogKGZsb3dSZWdpc3RyeSkgLT5cbiAgICBAZmxvd1JlZ2lzdHJ5ID0gZmxvd1JlZ2lzdHJ5XG4gICAgQHNlbGVjdExpc3RWaWV3ID0gbmV3IFNlbGVjdExpc3RWaWV3KHtcbiAgICAgIGVtcHR5TWVzc2FnZTogJ05vIGZsb3dzIGluIHRoZSByZWdpc3RyeS4nLFxuICAgICAgaXRlbXNDbGFzc0xpc3Q6IFsnbWFyay1hY3RpdmUnXSxcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIGZpbHRlcktleUZvckl0ZW06IChpdGVtKSAtPiBpdGVtLnRpdGxlICsgaXRlbS5kZXNjcmlwdGlvbixcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiAoaXRlbSkgPT5cbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2xpJ1xuICAgICAgICBpZiBpdGVtLmZsb3cgaXMgQGN1cnJlbnRGbG93XG4gICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkICdhY3RpdmUnXG4gICAgICAgIGh0bWwgPSBcIjxiPiN7aXRlbS50aXRsZX08L2I+XCJcbiAgICAgICAgaHRtbCArPSBcIjxiPjo8L2I+ICN7aXRlbS5kZXNjcmlwdGlvbn1cIiBpZiBpdGVtLmRlc2NyaXB0aW9uXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbFxuICAgICAgICBlbGVtZW50XG4gICAgICBkaWRDb25maXJtU2VsZWN0aW9uOiAoaXRlbSkgPT5cbiAgICAgICAgQGNhbmNlbCgpXG4gICAgICAgIEBmbG93UmVnaXN0cnkuc2VsZWN0RmxvdyBpdGVtLmNvZGVcbiAgICAgIGRpZENhbmNlbFNlbGVjdGlvbjogKCkgPT5cbiAgICAgICAgQGNhbmNlbCgpXG4gICAgfSlcbiAgICBAc2VsZWN0TGlzdFZpZXcuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmbG93LWxpc3QnKVxuXG4gIGRpc3Bvc2U6IC0+XG4gICAgQGNhbmNlbCgpXG4gICAgQHNlbGVjdExpc3RWaWV3LmRlc3Ryb3koKVxuXG4gIGNhbmNlbDogLT5cbiAgICBpZiBAcGFuZWw/XG4gICAgICBAcGFuZWwuZGVzdHJveSgpXG4gICAgQHBhbmVsID0gbnVsbFxuICAgIEBjdXJyZW50RmxvdyA9IG51bGxcbiAgICBpZiBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50XG4gICAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKClcbiAgICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBudWxsXG5cbiAgYXR0YWNoOiAtPlxuICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgaWYgbm90IEBwYW5lbD9cbiAgICAgIEBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe2l0ZW06IEBzZWxlY3RMaXN0Vmlld30pXG4gICAgQHNlbGVjdExpc3RWaWV3LmZvY3VzKClcbiAgICBAc2VsZWN0TGlzdFZpZXcucmVzZXQoKVxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAcGFuZWw/XG4gICAgICBAY2FuY2VsKClcbiAgICBlbHNlXG4gICAgICBAY3VycmVudEZsb3cgPSBAZmxvd1JlZ2lzdHJ5LmZsb3dcbiAgICAgIGZsb3dzID0gW11cbiAgICAgIGZvciBjb2RlLCBmbG93IG9mIEBmbG93UmVnaXN0cnkuZmxvd3NcbiAgICAgICAgZmxvd3MucHVzaCh7XG4gICAgICAgICAgY29kZTogY29kZSxcbiAgICAgICAgICBmbG93OiBmbG93LFxuICAgICAgICAgIHRpdGxlOiBpZiBmbG93LnRpdGxlIHRoZW4gZmxvdy50aXRsZSBlbHNlIGNvZGUsXG4gICAgICAgICAgZGVzY3JpcHRpb246IGZsb3cuZGVzY3JpcHRpb25cbiAgICAgICAgfSlcbiAgICAgIEBzZWxlY3RMaXN0Vmlldy51cGRhdGUoe2l0ZW1zOiBmbG93c30pXG4gICAgICBAYXR0YWNoKClcbiJdfQ==
