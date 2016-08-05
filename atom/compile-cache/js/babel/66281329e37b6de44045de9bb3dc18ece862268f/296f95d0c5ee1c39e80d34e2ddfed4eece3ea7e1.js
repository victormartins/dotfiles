Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mixto = require('mixto');

var _mixto2 = _interopRequireDefault(_mixto);

var _atom = require('atom');

var _decoration2 = require('../decoration');

var _decoration3 = _interopRequireDefault(_decoration2);

/**
 * The mixin that provides the decorations API to the minimap editor
 * view.
 *
 * This mixin is injected into the `Minimap` prototype, so every methods defined
 * in this file will be available on any `Minimap` instance.
 */
'use babel';

var DecorationManagement = (function (_Mixin) {
  _inherits(DecorationManagement, _Mixin);

  function DecorationManagement() {
    _classCallCheck(this, DecorationManagement);

    _get(Object.getPrototypeOf(DecorationManagement.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DecorationManagement, [{
    key: 'initializeDecorations',

    /**
     * Initializes the decorations related properties.
     */
    value: function initializeDecorations() {
      if (this.emitter == null) {
        /**
         * The minimap emitter, lazily created if not created yet.
         * @type {Emitter}
         * @access private
         */
        this.emitter = new _atom.Emitter();
      }

      /**
       * A map with the decoration id as key and the decoration as value.
       * @type {Object}
       * @access private
       */
      this.decorationsById = {};
      /**
       * The decorations stored in an array indexed with their marker id.
       * @type {Object}
       * @access private
       */
      this.decorationsByMarkerId = {};
      /**
       * The subscriptions to the markers `did-change` event indexed using the
       * marker id.
       * @type {Object}
       * @access private
       */
      this.decorationMarkerChangedSubscriptions = {};
      /**
       * The subscriptions to the markers `did-destroy` event indexed using the
       * marker id.
       * @type {Object}
       * @access private
       */
      this.decorationMarkerDestroyedSubscriptions = {};
      /**
       * The subscriptions to the decorations `did-change-properties` event
       * indexed using the decoration id.
       * @type {Object}
       * @access private
       */
      this.decorationUpdatedSubscriptions = {};
      /**
       * The subscriptions to the decorations `did-destroy` event indexed using
       * the decoration id.
       * @type {Object}
       * @access private
       */
      this.decorationDestroyedSubscriptions = {};
    }

    /**
     * Returns all the decorations registered in the current `Minimap`.
     *
     * @return {Array<Decoration>} all the decorations in this `Minimap`
     */
  }, {
    key: 'getDecorations',
    value: function getDecorations() {
      var decorations = this.decorationsById;
      var results = [];

      for (var id in decorations) {
        results.push(decorations[id]);
      }

      return results;
    }

    /**
     * Registers an event listener to the `did-add-decoration` event.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                               event is triggered.
     *                                               the callback will be called
     *                                               with an event object with
     *                                               the following properties:
     * - marker: the marker object that was decorated
     * - decoration: the decoration object that was created
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidAddDecoration',
    value: function onDidAddDecoration(callback) {
      return this.emitter.on('did-add-decoration', callback);
    }

    /**
     * Registers an event listener to the `did-remove-decoration` event.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                               event is triggered.
     *                                               the callback will be called
     *                                               with an event object with
     *                                               the following properties:
     * - marker: the marker object that was decorated
     * - decoration: the decoration object that was created
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidRemoveDecoration',
    value: function onDidRemoveDecoration(callback) {
      return this.emitter.on('did-remove-decoration', callback);
    }

    /**
     * Registers an event listener to the `did-change-decoration` event.
     *
     * This event is triggered when the marker targeted by the decoration
     * was changed.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                               event is triggered.
     *                                               the callback will be called
     *                                               with an event object with
     *                                               the following properties:
     * - marker: the marker object that was decorated
     * - decoration: the decoration object that was created
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeDecoration',
    value: function onDidChangeDecoration(callback) {
      return this.emitter.on('did-change-decoration', callback);
    }

    /**
     * Registers an event listener to the `did-change-decoration-range` event.
     *
     * This event is triggered when the marker range targeted by the decoration
     * was changed.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                               event is triggered.
     *                                               the callback will be called
     *                                               with an event object with
     *                                               the following properties:
     * - marker: the marker object that was decorated
     * - decoration: the decoration object that was created
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeDecorationRange',
    value: function onDidChangeDecorationRange(callback) {
      return this.emitter.on('did-change-decoration-range', callback);
    }

    /**
     * Registers an event listener to the `did-update-decoration` event.
     *
     * This event is triggered when the decoration itself is modified.
     *
     * @param  {function(decoration:Decoration):void} callback a function to call
     *                                                         when the event is
     *                                                         triggered
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidUpdateDecoration',
    value: function onDidUpdateDecoration(callback) {
      return this.emitter.on('did-update-decoration', callback);
    }

    /**
     * Returns the decoration with the passed-in id.
     *
     * @param  {number} id the decoration id
     * @return {Decoration} the decoration with the given id
     */
  }, {
    key: 'decorationForId',
    value: function decorationForId(id) {
      return this.decorationsById[id];
    }

    /**
     * Returns all the decorations that intersect the passed-in row range.
     *
     * @param  {number} startScreenRow the first row of the range
     * @param  {number} endScreenRow the last row of the range
     * @return {Array<Decoration>} the decorations that intersect the passed-in
     *                             range
     */
  }, {
    key: 'decorationsForScreenRowRange',
    value: function decorationsForScreenRowRange(startScreenRow, endScreenRow) {
      var decorationsByMarkerId = {};
      var markers = this.findMarkers({
        intersectsScreenRowRange: [startScreenRow, endScreenRow]
      });

      for (var i = 0, len = markers.length; i < len; i++) {
        var marker = markers[i];
        var decorations = this.decorationsByMarkerId[marker.id];

        if (decorations != null) {
          decorationsByMarkerId[marker.id] = decorations;
        }
      }

      return decorationsByMarkerId;
    }

    /**
     * Returns the decorations that intersects the passed-in row range
     * in a structured way.
     *
     * At the first level, the keys are the available decoration types.
     * At the second level, the keys are the row index for which there
     * are decorations available. The value is an array containing the
     * decorations that intersects with the corresponding row.
     *
     * @return {Object} the decorations grouped by type and then rows
     * @property {Object} line all the line decorations by row
     * @property {Array<Decoration>} line[row] all the line decorations
     *                                    at a given row
     * @property {Object} highlight-under all the highlight-under decorations
     *                                    by row
     * @property {Array<Decoration>} highlight-under[row] all the highlight-under
     *                                    decorations at a given row
     * @property {Object} highlight-over all the highlight-over decorations
     *                                    by row
     * @property {Array<Decoration>} highlight-over[row] all the highlight-over
     *                                    decorations at a given row
     * @property {Object} highlight-outine all the highlight-outine decorations
     *                                    by row
     * @property {Array<Decoration>} highlight-outine[row] all the
     *                                    highlight-outine decorations at a given
     *                                    row
     */
  }, {
    key: 'decorationsByTypeThenRows',
    value: function decorationsByTypeThenRows() {
      if (this.decorationsByTypeThenRowsCache != null) {
        return this.decorationsByTypeThenRowsCache;
      }

      var cache = {};
      for (var id in this.decorationsById) {
        var decoration = this.decorationsById[id];
        var range = decoration.marker.getScreenRange();
        var type = decoration.getProperties().type;

        if (cache[type] == null) {
          cache[type] = {};
        }

        for (var row = range.start.row, len = range.end.row; row <= len; row++) {
          if (cache[type][row] == null) {
            cache[type][row] = [];
          }

          cache[type][row].push(decoration);
        }
      }

      /**
       * The grouped decorations cache.
       * @type {Object}
       * @access private
       */
      this.decorationsByTypeThenRowsCache = cache;
      return cache;
    }

    /**
     * Invalidates the decoration by screen rows cache.
     */
  }, {
    key: 'invalidateDecorationForScreenRowsCache',
    value: function invalidateDecorationForScreenRowsCache() {
      this.decorationsByTypeThenRowsCache = null;
    }

    /**
     * Adds a decoration that tracks a `Marker`. When the marker moves,
     * is invalidated, or is destroyed, the decoration will be updated to reflect
     * the marker's state.
     *
     * @param  {Marker} marker the marker you want this decoration to follow
     * @param  {Object} decorationParams the decoration properties
     * @param  {string} decorationParams.type the decoration type in the following
     *                                        list:
     * - __line__: Fills the line background with the decoration color.
     * - __highlight__: Renders a colored rectangle on the minimap. The highlight
     *   is rendered above the line's text.
     * - __highlight-over__: Same as __highlight__.
     * - __highlight-under__: Renders a colored rectangle on the minimap. The
     *   highlight is rendered below the line's text.
     * - __highlight-outline__: Renders a colored outline on the minimap. The
     *   highlight box is rendered above the line's text.
     * @param  {string} [decorationParams.class] the CSS class to use to retrieve
     *                                        the background color of the
     *                                        decoration by building a scop
     *                                        corresponding to
     *                                        `.minimap .editor <your-class>`
     * @param  {string} [decorationParams.scope] the scope to use to retrieve the
     *                                        decoration background. Note that if
     *                                        the `scope` property is set, the
     *                                        `class` won't be used.
     * @param  {string} [decorationParams.color] the CSS color to use to render
     *                                           the decoration. When set, neither
     *                                           `scope` nor `class` are used.
     * @param  {string} [decorationParams.plugin] the name of the plugin that
     *                                            created this decoration. It'll
     *                                            be used to order the decorations
     *                                            on the same layer and that are
     *                                            overlapping. If the parameter is
     *                                            omitted the Minimap will attempt
     *                                            to infer the plugin origin from
     *                                            the path of the caller function.
     * @return {Decoration} the created decoration
     * @emits  {did-add-decoration} when the decoration is created successfully
     * @emits  {did-change} when the decoration is created successfully
     */
  }, {
    key: 'decorateMarker',
    value: function decorateMarker(marker, decorationParams) {
      var _this = this;

      if (this.destroyed || marker == null) {
        return;
      }

      var id = marker.id;

      if (decorationParams.type === 'highlight') {
        decorationParams.type = 'highlight-over';
      }

      var type = decorationParams.type;
      var plugin = decorationParams.plugin;

      if (plugin == null) {
        decorationParams.plugin = this.getOriginatorPackageName();
      }

      if (decorationParams.scope == null && decorationParams['class'] != null) {
        var cls = decorationParams['class'].split(' ').join('.');
        decorationParams.scope = '.minimap .' + cls;
      }

      if (this.decorationMarkerDestroyedSubscriptions[id] == null) {
        this.decorationMarkerDestroyedSubscriptions[id] = marker.onDidDestroy(function () {
          _this.removeAllDecorationsForMarker(marker);
        });
      }

      if (this.decorationMarkerChangedSubscriptions[id] == null) {
        this.decorationMarkerChangedSubscriptions[id] = marker.onDidChange(function (event) {
          var decorations = _this.decorationsByMarkerId[id];

          _this.invalidateDecorationForScreenRowsCache();

          if (decorations != null) {
            for (var i = 0, len = decorations.length; i < len; i++) {
              var _decoration = decorations[i];
              _this.emitter.emit('did-change-decoration', {
                marker: marker,
                decoration: _decoration,
                event: event
              });
            }
          }
          var oldStart = event.oldTailScreenPosition;
          var oldEnd = event.oldHeadScreenPosition;
          var newStart = event.newTailScreenPosition;
          var newEnd = event.newHeadScreenPosition;

          if (oldStart.row > oldEnd.row) {
            var _ref = [oldEnd, oldStart];
            oldStart = _ref[0];
            oldEnd = _ref[1];
          }
          if (newStart.row > newEnd.row) {
            var _ref2 = [newEnd, newStart];
            newStart = _ref2[0];
            newEnd = _ref2[1];
          }

          var rangesDiffs = _this.computeRangesDiffs(oldStart, oldEnd, newStart, newEnd);

          for (var i = 0, len = rangesDiffs.length; i < len; i++) {
            var _rangesDiffs$i = _slicedToArray(rangesDiffs[i], 2);

            var start = _rangesDiffs$i[0];
            var end = _rangesDiffs$i[1];

            _this.emitRangeChanges(type, {
              start: start,
              end: end
            }, 0);
          }
        });
      }

      var decoration = new _decoration3['default'](marker, this, decorationParams);

      if (this.decorationsByMarkerId[id] == null) {
        this.decorationsByMarkerId[id] = [];
      }

      this.decorationsByMarkerId[id].push(decoration);
      this.decorationsById[decoration.id] = decoration;

      if (this.decorationUpdatedSubscriptions[decoration.id] == null) {
        this.decorationUpdatedSubscriptions[decoration.id] = decoration.onDidChangeProperties(function (event) {
          _this.emitDecorationChanges(type, decoration);
        });
      }

      this.decorationDestroyedSubscriptions[decoration.id] = decoration.onDidDestroy(function () {
        _this.removeDecoration(decoration);
      });

      this.emitDecorationChanges(type, decoration);
      this.emitter.emit('did-add-decoration', {
        marker: marker,
        decoration: decoration
      });

      return decoration;
    }
  }, {
    key: 'getOriginatorPackageName',
    value: function getOriginatorPackageName() {
      var line = new Error().stack.split('\n')[3];
      var filePath = line.split('(')[1].replace(')', '');
      var re = new RegExp(atom.packages.getPackageDirPaths().join('|') + _underscorePlus2['default'].escapeRegExp(_path2['default'].sep));
      var plugin = filePath.replace(re, '').split(_path2['default'].sep)[0].replace(/minimap-|-minimap/, '');
      return plugin.indexOf(_path2['default'].sep) < 0 ? plugin : undefined;
    }

    /**
     * Given two ranges, it returns an array of ranges representing the
     * differences between them.
     *
     * @param  {number} oldStart the row index of the first range start
     * @param  {number} oldEnd the row index of the first range end
     * @param  {number} newStart the row index of the second range start
     * @param  {number} newEnd the row index of the second range end
     * @return {Array<Object>} the array of diff ranges
     * @access private
     */
  }, {
    key: 'computeRangesDiffs',
    value: function computeRangesDiffs(oldStart, oldEnd, newStart, newEnd) {
      var diffs = [];

      if (oldStart.isLessThan(newStart)) {
        diffs.push([oldStart, newStart]);
      } else if (newStart.isLessThan(oldStart)) {
        diffs.push([newStart, oldStart]);
      }

      if (oldEnd.isLessThan(newEnd)) {
        diffs.push([oldEnd, newEnd]);
      } else if (newEnd.isLessThan(oldEnd)) {
        diffs.push([newEnd, oldEnd]);
      }

      return diffs;
    }

    /**
     * Emits a change in the `Minimap` corresponding to the
     * passed-in decoration.
     *
     * @param  {string} type the type of decoration that changed
     * @param  {Decoration} decoration the decoration for which emitting an event
     * @access private
     */
  }, {
    key: 'emitDecorationChanges',
    value: function emitDecorationChanges(type, decoration) {
      if (decoration.marker.displayBuffer.isDestroyed()) {
        return;
      }

      this.invalidateDecorationForScreenRowsCache();

      var range = decoration.marker.getScreenRange();
      if (range == null) {
        return;
      }

      this.emitRangeChanges(type, range, 0);
    }

    /**
     * Emits a change for the specified range.
     *
     * @param  {string} type the type of decoration that changed
     * @param  {Object} range the range where changes occured
     * @param  {number} [screenDelta] an optional screen delta for the
     *                                change object
     * @access private
     */
  }, {
    key: 'emitRangeChanges',
    value: function emitRangeChanges(type, range, screenDelta) {
      var startScreenRow = range.start.row;
      var endScreenRow = range.end.row;
      var lastRenderedScreenRow = this.getLastVisibleScreenRow();
      var firstRenderedScreenRow = this.getFirstVisibleScreenRow();

      if (screenDelta == null) {
        screenDelta = lastRenderedScreenRow - firstRenderedScreenRow - (endScreenRow - startScreenRow);
      }

      var changeEvent = {
        start: startScreenRow,
        end: endScreenRow,
        screenDelta: screenDelta,
        type: type
      };

      this.emitter.emit('did-change-decoration-range', changeEvent);
    }

    /**
     * Removes a `Decoration` from this minimap.
     *
     * @param  {Decoration} decoration the decoration to remove
     * @emits  {did-change} when the decoration is removed
     * @emits  {did-remove-decoration} when the decoration is removed
     */
  }, {
    key: 'removeDecoration',
    value: function removeDecoration(decoration) {
      if (decoration == null) {
        return;
      }

      var marker = decoration.marker;
      var subscription = undefined;

      delete this.decorationsById[decoration.id];

      subscription = this.decorationUpdatedSubscriptions[decoration.id];
      if (subscription != null) {
        subscription.dispose();
      }

      subscription = this.decorationDestroyedSubscriptions[decoration.id];
      if (subscription != null) {
        subscription.dispose();
      }

      delete this.decorationUpdatedSubscriptions[decoration.id];
      delete this.decorationDestroyedSubscriptions[decoration.id];

      var decorations = this.decorationsByMarkerId[marker.id];
      if (!decorations) {
        return;
      }

      this.emitDecorationChanges(decoration.getProperties().type, decoration);

      var index = decorations.indexOf(decoration);
      if (index > -1) {
        decorations.splice(index, 1);

        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });

        if (decorations.length === 0) {
          this.removedAllMarkerDecorations(marker);
        }
      }
    }

    /**
     * Removes all the decorations registered for the passed-in marker.
     *
     * @param  {Marker} marker the marker for which removing its decorations
     * @emits  {did-change} when a decoration have been removed
     * @emits  {did-remove-decoration} when a decoration have been removed
     */
  }, {
    key: 'removeAllDecorationsForMarker',
    value: function removeAllDecorationsForMarker(marker) {
      if (marker == null) {
        return;
      }

      var decorations = this.decorationsByMarkerId[marker.id];
      if (!decorations) {
        return;
      }

      for (var i = 0, len = decorations.length; i < len; i++) {
        var decoration = decorations[i];

        this.emitDecorationChanges(decoration.getProperties().type, decoration);
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
      }

      this.removedAllMarkerDecorations(marker);
    }

    /**
     * Performs the removal of a decoration for a given marker.
     *
     * @param  {Marker} marker the marker for which removing decorations
     * @access private
     */
  }, {
    key: 'removedAllMarkerDecorations',
    value: function removedAllMarkerDecorations(marker) {
      if (marker == null) {
        return;
      }

      this.decorationMarkerChangedSubscriptions[marker.id].dispose();
      this.decorationMarkerDestroyedSubscriptions[marker.id].dispose();

      delete this.decorationsByMarkerId[marker.id];
      delete this.decorationMarkerChangedSubscriptions[marker.id];
      delete this.decorationMarkerDestroyedSubscriptions[marker.id];
    }

    /**
     * Removes all the decorations that was created in the current `Minimap`.
     */
  }, {
    key: 'removeAllDecorations',
    value: function removeAllDecorations() {
      for (var id in this.decorationMarkerChangedSubscriptions) {
        this.decorationMarkerChangedSubscriptions[id].dispose();
      }

      for (var id in this.decorationMarkerDestroyedSubscriptions) {
        this.decorationMarkerDestroyedSubscriptions[id].dispose();
      }

      for (var id in this.decorationUpdatedSubscriptions) {
        this.decorationUpdatedSubscriptions[id].dispose();
      }

      for (var id in this.decorationDestroyedSubscriptions) {
        this.decorationDestroyedSubscriptions[id].dispose();
      }

      for (var id in this.decorationsById) {
        this.decorationsById[id].destroy();
      }

      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      this.decorationDestroyedSubscriptions = {};
    }
  }]);

  return DecorationManagement;
})(_mixto2['default']);

exports['default'] = DecorationManagement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taXhpbnMvZGVjb3JhdGlvbi1tYW5hZ2VtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBRWMsaUJBQWlCOzs7O29CQUNkLE1BQU07Ozs7cUJBQ0wsT0FBTzs7OztvQkFDSCxNQUFNOzsyQkFDTCxlQUFlOzs7Ozs7Ozs7OztBQU50QyxXQUFXLENBQUE7O0lBZVUsb0JBQW9CO1lBQXBCLG9CQUFvQjs7V0FBcEIsb0JBQW9COzBCQUFwQixvQkFBb0I7OytCQUFwQixvQkFBb0I7OztlQUFwQixvQkFBb0I7Ozs7OztXQUtqQixpQ0FBRztBQUN2QixVQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFOzs7Ozs7QUFNeEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO09BQzdCOzs7Ozs7O0FBT0QsVUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUE7Ozs7OztBQU16QixVQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFBOzs7Ozs7O0FBTy9CLFVBQUksQ0FBQyxvQ0FBb0MsR0FBRyxFQUFFLENBQUE7Ozs7Ozs7QUFPOUMsVUFBSSxDQUFDLHNDQUFzQyxHQUFHLEVBQUUsQ0FBQTs7Ozs7OztBQU9oRCxVQUFJLENBQUMsOEJBQThCLEdBQUcsRUFBRSxDQUFBOzs7Ozs7O0FBT3hDLFVBQUksQ0FBQyxnQ0FBZ0MsR0FBRyxFQUFFLENBQUE7S0FDM0M7Ozs7Ozs7OztXQU9jLDBCQUFHO0FBQ2hCLFVBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUE7QUFDdEMsVUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFBOztBQUVoQixXQUFLLElBQUksRUFBRSxJQUFJLFdBQVcsRUFBRTtBQUFFLGVBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7T0FBRTs7QUFFN0QsYUFBTyxPQUFP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LEdBQUcsRUFBRSxDQUFBO0FBQzlDLFVBQUksQ0FBQyxzQ0FBc0MsR0FBRyxFQUFFLENBQUE7QUFDaEQsVUFBSSxDQUFDLDhCQUE4QixHQUFHLEVBQUUsQ0FBQTtBQUN4QyxVQUFJLENBQUMsZ0NBQWdDLEdBQUcsRUFBRSxDQUFBO0tBQzNDOzs7U0F6bEJrQixvQkFBb0I7OztxQkFBcEIsb0JBQW9CIiwiZmlsZSI6Ii9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taXhpbnMvZGVjb3JhdGlvbi1tYW5hZ2VtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBNaXhpbiBmcm9tICdtaXh0bydcbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnYXRvbSdcbmltcG9ydCBEZWNvcmF0aW9uIGZyb20gJy4uL2RlY29yYXRpb24nXG5cbi8qKlxuICogVGhlIG1peGluIHRoYXQgcHJvdmlkZXMgdGhlIGRlY29yYXRpb25zIEFQSSB0byB0aGUgbWluaW1hcCBlZGl0b3JcbiAqIHZpZXcuXG4gKlxuICogVGhpcyBtaXhpbiBpcyBpbmplY3RlZCBpbnRvIHRoZSBgTWluaW1hcGAgcHJvdG90eXBlLCBzbyBldmVyeSBtZXRob2RzIGRlZmluZWRcbiAqIGluIHRoaXMgZmlsZSB3aWxsIGJlIGF2YWlsYWJsZSBvbiBhbnkgYE1pbmltYXBgIGluc3RhbmNlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWNvcmF0aW9uTWFuYWdlbWVudCBleHRlbmRzIE1peGluIHtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIGRlY29yYXRpb25zIHJlbGF0ZWQgcHJvcGVydGllcy5cbiAgICovXG4gIGluaXRpYWxpemVEZWNvcmF0aW9ucyAoKSB7XG4gICAgaWYgKHRoaXMuZW1pdHRlciA9PSBudWxsKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBtaW5pbWFwIGVtaXR0ZXIsIGxhemlseSBjcmVhdGVkIGlmIG5vdCBjcmVhdGVkIHlldC5cbiAgICAgICAqIEB0eXBlIHtFbWl0dGVyfVxuICAgICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIG1hcCB3aXRoIHRoZSBkZWNvcmF0aW9uIGlkIGFzIGtleSBhbmQgdGhlIGRlY29yYXRpb24gYXMgdmFsdWUuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRlY29yYXRpb25zQnlJZCA9IHt9XG4gICAgLyoqXG4gICAgICogVGhlIGRlY29yYXRpb25zIHN0b3JlZCBpbiBhbiBhcnJheSBpbmRleGVkIHdpdGggdGhlaXIgbWFya2VyIGlkLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWQgPSB7fVxuICAgIC8qKlxuICAgICAqIFRoZSBzdWJzY3JpcHRpb25zIHRvIHRoZSBtYXJrZXJzIGBkaWQtY2hhbmdlYCBldmVudCBpbmRleGVkIHVzaW5nIHRoZVxuICAgICAqIG1hcmtlciBpZC5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGVjb3JhdGlvbk1hcmtlckNoYW5nZWRTdWJzY3JpcHRpb25zID0ge31cbiAgICAvKipcbiAgICAgKiBUaGUgc3Vic2NyaXB0aW9ucyB0byB0aGUgbWFya2VycyBgZGlkLWRlc3Ryb3lgIGV2ZW50IGluZGV4ZWQgdXNpbmcgdGhlXG4gICAgICogbWFya2VyIGlkLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZWNvcmF0aW9uTWFya2VyRGVzdHJveWVkU3Vic2NyaXB0aW9ucyA9IHt9XG4gICAgLyoqXG4gICAgICogVGhlIHN1YnNjcmlwdGlvbnMgdG8gdGhlIGRlY29yYXRpb25zIGBkaWQtY2hhbmdlLXByb3BlcnRpZXNgIGV2ZW50XG4gICAgICogaW5kZXhlZCB1c2luZyB0aGUgZGVjb3JhdGlvbiBpZC5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGVjb3JhdGlvblVwZGF0ZWRTdWJzY3JpcHRpb25zID0ge31cbiAgICAvKipcbiAgICAgKiBUaGUgc3Vic2NyaXB0aW9ucyB0byB0aGUgZGVjb3JhdGlvbnMgYGRpZC1kZXN0cm95YCBldmVudCBpbmRleGVkIHVzaW5nXG4gICAgICogdGhlIGRlY29yYXRpb24gaWQuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRlY29yYXRpb25EZXN0cm95ZWRTdWJzY3JpcHRpb25zID0ge31cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCB0aGUgZGVjb3JhdGlvbnMgcmVnaXN0ZXJlZCBpbiB0aGUgY3VycmVudCBgTWluaW1hcGAuXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5PERlY29yYXRpb24+fSBhbGwgdGhlIGRlY29yYXRpb25zIGluIHRoaXMgYE1pbmltYXBgXG4gICAqL1xuICBnZXREZWNvcmF0aW9ucyAoKSB7XG4gICAgbGV0IGRlY29yYXRpb25zID0gdGhpcy5kZWNvcmF0aW9uc0J5SWRcbiAgICBsZXQgcmVzdWx0cyA9IFtdXG5cbiAgICBmb3IgKGxldCBpZCBpbiBkZWNvcmF0aW9ucykgeyByZXN1bHRzLnB1c2goZGVjb3JhdGlvbnNbaWRdKSB9XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1hZGQtZGVjb3JhdGlvbmAgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGV2ZW50Ok9iamVjdCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggYW4gZXZlbnQgb2JqZWN0IHdpdGhcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBtYXJrZXI6IHRoZSBtYXJrZXIgb2JqZWN0IHRoYXQgd2FzIGRlY29yYXRlZFxuICAgKiAtIGRlY29yYXRpb246IHRoZSBkZWNvcmF0aW9uIG9iamVjdCB0aGF0IHdhcyBjcmVhdGVkXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQWRkRGVjb3JhdGlvbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtYWRkLWRlY29yYXRpb24nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtcmVtb3ZlLWRlY29yYXRpb25gIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIGFuIGV2ZW50IG9iamVjdCB3aXRoXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gbWFya2VyOiB0aGUgbWFya2VyIG9iamVjdCB0aGF0IHdhcyBkZWNvcmF0ZWRcbiAgICogLSBkZWNvcmF0aW9uOiB0aGUgZGVjb3JhdGlvbiBvYmplY3QgdGhhdCB3YXMgY3JlYXRlZFxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZFJlbW92ZURlY29yYXRpb24gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXJlbW92ZS1kZWNvcmF0aW9uJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1kZWNvcmF0aW9uYCBldmVudC5cbiAgICpcbiAgICogVGhpcyBldmVudCBpcyB0cmlnZ2VyZWQgd2hlbiB0aGUgbWFya2VyIHRhcmdldGVkIGJ5IHRoZSBkZWNvcmF0aW9uXG4gICAqIHdhcyBjaGFuZ2VkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIGFuIGV2ZW50IG9iamVjdCB3aXRoXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gbWFya2VyOiB0aGUgbWFya2VyIG9iamVjdCB0aGF0IHdhcyBkZWNvcmF0ZWRcbiAgICogLSBkZWNvcmF0aW9uOiB0aGUgZGVjb3JhdGlvbiBvYmplY3QgdGhhdCB3YXMgY3JlYXRlZFxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZURlY29yYXRpb24gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1kZWNvcmF0aW9uJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1kZWNvcmF0aW9uLXJhbmdlYCBldmVudC5cbiAgICpcbiAgICogVGhpcyBldmVudCBpcyB0cmlnZ2VyZWQgd2hlbiB0aGUgbWFya2VyIHJhbmdlIHRhcmdldGVkIGJ5IHRoZSBkZWNvcmF0aW9uXG4gICAqIHdhcyBjaGFuZ2VkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIGFuIGV2ZW50IG9iamVjdCB3aXRoXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gbWFya2VyOiB0aGUgbWFya2VyIG9iamVjdCB0aGF0IHdhcyBkZWNvcmF0ZWRcbiAgICogLSBkZWNvcmF0aW9uOiB0aGUgZGVjb3JhdGlvbiBvYmplY3QgdGhhdCB3YXMgY3JlYXRlZFxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZURlY29yYXRpb25SYW5nZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWRlY29yYXRpb24tcmFuZ2UnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtdXBkYXRlLWRlY29yYXRpb25gIGV2ZW50LlxuICAgKlxuICAgKiBUaGlzIGV2ZW50IGlzIHRyaWdnZXJlZCB3aGVuIHRoZSBkZWNvcmF0aW9uIGl0c2VsZiBpcyBtb2RpZmllZC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZGVjb3JhdGlvbjpEZWNvcmF0aW9uKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGxcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIHRoZSBldmVudCBpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJlZFxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZFVwZGF0ZURlY29yYXRpb24gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1kZWNvcmF0aW9uJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGVjb3JhdGlvbiB3aXRoIHRoZSBwYXNzZWQtaW4gaWQuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gaWQgdGhlIGRlY29yYXRpb24gaWRcbiAgICogQHJldHVybiB7RGVjb3JhdGlvbn0gdGhlIGRlY29yYXRpb24gd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICovXG4gIGRlY29yYXRpb25Gb3JJZCAoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5kZWNvcmF0aW9uc0J5SWRbaWRdXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbGwgdGhlIGRlY29yYXRpb25zIHRoYXQgaW50ZXJzZWN0IHRoZSBwYXNzZWQtaW4gcm93IHJhbmdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHN0YXJ0U2NyZWVuUm93IHRoZSBmaXJzdCByb3cgb2YgdGhlIHJhbmdlXG4gICAqIEBwYXJhbSAge251bWJlcn0gZW5kU2NyZWVuUm93IHRoZSBsYXN0IHJvdyBvZiB0aGUgcmFuZ2VcbiAgICogQHJldHVybiB7QXJyYXk8RGVjb3JhdGlvbj59IHRoZSBkZWNvcmF0aW9ucyB0aGF0IGludGVyc2VjdCB0aGUgcGFzc2VkLWluXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW5nZVxuICAgKi9cbiAgZGVjb3JhdGlvbnNGb3JTY3JlZW5Sb3dSYW5nZSAoc3RhcnRTY3JlZW5Sb3csIGVuZFNjcmVlblJvdykge1xuICAgIGxldCBkZWNvcmF0aW9uc0J5TWFya2VySWQgPSB7fVxuICAgIGxldCBtYXJrZXJzID0gdGhpcy5maW5kTWFya2Vycyh7XG4gICAgICBpbnRlcnNlY3RzU2NyZWVuUm93UmFuZ2U6IFtzdGFydFNjcmVlblJvdywgZW5kU2NyZWVuUm93XVxuICAgIH0pXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbWFya2Vycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IG1hcmtlciA9IG1hcmtlcnNbaV1cbiAgICAgIGxldCBkZWNvcmF0aW9ucyA9IHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkW21hcmtlci5pZF1cblxuICAgICAgaWYgKGRlY29yYXRpb25zICE9IG51bGwpIHtcbiAgICAgICAgZGVjb3JhdGlvbnNCeU1hcmtlcklkW21hcmtlci5pZF0gPSBkZWNvcmF0aW9uc1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWNvcmF0aW9uc0J5TWFya2VySWRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZWNvcmF0aW9ucyB0aGF0IGludGVyc2VjdHMgdGhlIHBhc3NlZC1pbiByb3cgcmFuZ2VcbiAgICogaW4gYSBzdHJ1Y3R1cmVkIHdheS5cbiAgICpcbiAgICogQXQgdGhlIGZpcnN0IGxldmVsLCB0aGUga2V5cyBhcmUgdGhlIGF2YWlsYWJsZSBkZWNvcmF0aW9uIHR5cGVzLlxuICAgKiBBdCB0aGUgc2Vjb25kIGxldmVsLCB0aGUga2V5cyBhcmUgdGhlIHJvdyBpbmRleCBmb3Igd2hpY2ggdGhlcmVcbiAgICogYXJlIGRlY29yYXRpb25zIGF2YWlsYWJsZS4gVGhlIHZhbHVlIGlzIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlXG4gICAqIGRlY29yYXRpb25zIHRoYXQgaW50ZXJzZWN0cyB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIHJvdy5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgZGVjb3JhdGlvbnMgZ3JvdXBlZCBieSB0eXBlIGFuZCB0aGVuIHJvd3NcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IGxpbmUgYWxsIHRoZSBsaW5lIGRlY29yYXRpb25zIGJ5IHJvd1xuICAgKiBAcHJvcGVydHkge0FycmF5PERlY29yYXRpb24+fSBsaW5lW3Jvd10gYWxsIHRoZSBsaW5lIGRlY29yYXRpb25zXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXQgYSBnaXZlbiByb3dcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IGhpZ2hsaWdodC11bmRlciBhbGwgdGhlIGhpZ2hsaWdodC11bmRlciBkZWNvcmF0aW9uc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5IHJvd1xuICAgKiBAcHJvcGVydHkge0FycmF5PERlY29yYXRpb24+fSBoaWdobGlnaHQtdW5kZXJbcm93XSBhbGwgdGhlIGhpZ2hsaWdodC11bmRlclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY29yYXRpb25zIGF0IGEgZ2l2ZW4gcm93XG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBoaWdobGlnaHQtb3ZlciBhbGwgdGhlIGhpZ2hsaWdodC1vdmVyIGRlY29yYXRpb25zXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnkgcm93XG4gICAqIEBwcm9wZXJ0eSB7QXJyYXk8RGVjb3JhdGlvbj59IGhpZ2hsaWdodC1vdmVyW3Jvd10gYWxsIHRoZSBoaWdobGlnaHQtb3ZlclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY29yYXRpb25zIGF0IGEgZ2l2ZW4gcm93XG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBoaWdobGlnaHQtb3V0aW5lIGFsbCB0aGUgaGlnaGxpZ2h0LW91dGluZSBkZWNvcmF0aW9uc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5IHJvd1xuICAgKiBAcHJvcGVydHkge0FycmF5PERlY29yYXRpb24+fSBoaWdobGlnaHQtb3V0aW5lW3Jvd10gYWxsIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodC1vdXRpbmUgZGVjb3JhdGlvbnMgYXQgYSBnaXZlblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1xuICAgKi9cbiAgZGVjb3JhdGlvbnNCeVR5cGVUaGVuUm93cyAoKSB7XG4gICAgaWYgKHRoaXMuZGVjb3JhdGlvbnNCeVR5cGVUaGVuUm93c0NhY2hlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmRlY29yYXRpb25zQnlUeXBlVGhlblJvd3NDYWNoZVxuICAgIH1cblxuICAgIGxldCBjYWNoZSA9IHt9XG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5kZWNvcmF0aW9uc0J5SWQpIHtcbiAgICAgIGxldCBkZWNvcmF0aW9uID0gdGhpcy5kZWNvcmF0aW9uc0J5SWRbaWRdXG4gICAgICBsZXQgcmFuZ2UgPSBkZWNvcmF0aW9uLm1hcmtlci5nZXRTY3JlZW5SYW5nZSgpXG4gICAgICBsZXQgdHlwZSA9IGRlY29yYXRpb24uZ2V0UHJvcGVydGllcygpLnR5cGVcblxuICAgICAgaWYgKGNhY2hlW3R5cGVdID09IG51bGwpIHsgY2FjaGVbdHlwZV0gPSB7fSB9XG5cbiAgICAgIGZvciAobGV0IHJvdyA9IHJhbmdlLnN0YXJ0LnJvdywgbGVuID0gcmFuZ2UuZW5kLnJvdzsgcm93IDw9IGxlbjsgcm93KyspIHtcbiAgICAgICAgaWYgKGNhY2hlW3R5cGVdW3Jvd10gPT0gbnVsbCkgeyBjYWNoZVt0eXBlXVtyb3ddID0gW10gfVxuXG4gICAgICAgIGNhY2hlW3R5cGVdW3Jvd10ucHVzaChkZWNvcmF0aW9uKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBncm91cGVkIGRlY29yYXRpb25zIGNhY2hlLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZWNvcmF0aW9uc0J5VHlwZVRoZW5Sb3dzQ2FjaGUgPSBjYWNoZVxuICAgIHJldHVybiBjYWNoZVxuICB9XG5cbiAgLyoqXG4gICAqIEludmFsaWRhdGVzIHRoZSBkZWNvcmF0aW9uIGJ5IHNjcmVlbiByb3dzIGNhY2hlLlxuICAgKi9cbiAgaW52YWxpZGF0ZURlY29yYXRpb25Gb3JTY3JlZW5Sb3dzQ2FjaGUgKCkge1xuICAgIHRoaXMuZGVjb3JhdGlvbnNCeVR5cGVUaGVuUm93c0NhY2hlID0gbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBkZWNvcmF0aW9uIHRoYXQgdHJhY2tzIGEgYE1hcmtlcmAuIFdoZW4gdGhlIG1hcmtlciBtb3ZlcyxcbiAgICogaXMgaW52YWxpZGF0ZWQsIG9yIGlzIGRlc3Ryb3llZCwgdGhlIGRlY29yYXRpb24gd2lsbCBiZSB1cGRhdGVkIHRvIHJlZmxlY3RcbiAgICogdGhlIG1hcmtlcidzIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtNYXJrZXJ9IG1hcmtlciB0aGUgbWFya2VyIHlvdSB3YW50IHRoaXMgZGVjb3JhdGlvbiB0byBmb2xsb3dcbiAgICogQHBhcmFtICB7T2JqZWN0fSBkZWNvcmF0aW9uUGFyYW1zIHRoZSBkZWNvcmF0aW9uIHByb3BlcnRpZXNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBkZWNvcmF0aW9uUGFyYW1zLnR5cGUgdGhlIGRlY29yYXRpb24gdHlwZSBpbiB0aGUgZm9sbG93aW5nXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6XG4gICAqIC0gX19saW5lX186IEZpbGxzIHRoZSBsaW5lIGJhY2tncm91bmQgd2l0aCB0aGUgZGVjb3JhdGlvbiBjb2xvci5cbiAgICogLSBfX2hpZ2hsaWdodF9fOiBSZW5kZXJzIGEgY29sb3JlZCByZWN0YW5nbGUgb24gdGhlIG1pbmltYXAuIFRoZSBoaWdobGlnaHRcbiAgICogICBpcyByZW5kZXJlZCBhYm92ZSB0aGUgbGluZSdzIHRleHQuXG4gICAqIC0gX19oaWdobGlnaHQtb3Zlcl9fOiBTYW1lIGFzIF9faGlnaGxpZ2h0X18uXG4gICAqIC0gX19oaWdobGlnaHQtdW5kZXJfXzogUmVuZGVycyBhIGNvbG9yZWQgcmVjdGFuZ2xlIG9uIHRoZSBtaW5pbWFwLiBUaGVcbiAgICogICBoaWdobGlnaHQgaXMgcmVuZGVyZWQgYmVsb3cgdGhlIGxpbmUncyB0ZXh0LlxuICAgKiAtIF9faGlnaGxpZ2h0LW91dGxpbmVfXzogUmVuZGVycyBhIGNvbG9yZWQgb3V0bGluZSBvbiB0aGUgbWluaW1hcC4gVGhlXG4gICAqICAgaGlnaGxpZ2h0IGJveCBpcyByZW5kZXJlZCBhYm92ZSB0aGUgbGluZSdzIHRleHQuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gW2RlY29yYXRpb25QYXJhbXMuY2xhc3NdIHRoZSBDU1MgY2xhc3MgdG8gdXNlIHRvIHJldHJpZXZlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNvcmF0aW9uIGJ5IGJ1aWxkaW5nIGEgc2NvcFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3JyZXNwb25kaW5nIHRvXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAubWluaW1hcCAuZWRpdG9yIDx5b3VyLWNsYXNzPmBcbiAgICogQHBhcmFtICB7c3RyaW5nfSBbZGVjb3JhdGlvblBhcmFtcy5zY29wZV0gdGhlIHNjb3BlIHRvIHVzZSB0byByZXRyaWV2ZSB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdGlvbiBiYWNrZ3JvdW5kLiBOb3RlIHRoYXQgaWZcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGBzY29wZWAgcHJvcGVydHkgaXMgc2V0LCB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGNsYXNzYCB3b24ndCBiZSB1c2VkLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFtkZWNvcmF0aW9uUGFyYW1zLmNvbG9yXSB0aGUgQ1NTIGNvbG9yIHRvIHVzZSB0byByZW5kZXJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGRlY29yYXRpb24uIFdoZW4gc2V0LCBuZWl0aGVyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBzY29wZWAgbm9yIGBjbGFzc2AgYXJlIHVzZWQuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gW2RlY29yYXRpb25QYXJhbXMucGx1Z2luXSB0aGUgbmFtZSBvZiB0aGUgcGx1Z2luIHRoYXRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZWQgdGhpcyBkZWNvcmF0aW9uLiBJdCdsbFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmUgdXNlZCB0byBvcmRlciB0aGUgZGVjb3JhdGlvbnNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uIHRoZSBzYW1lIGxheWVyIGFuZCB0aGF0IGFyZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxhcHBpbmcuIElmIHRoZSBwYXJhbWV0ZXIgaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9taXR0ZWQgdGhlIE1pbmltYXAgd2lsbCBhdHRlbXB0XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBpbmZlciB0aGUgcGx1Z2luIG9yaWdpbiBmcm9tXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgcGF0aCBvZiB0aGUgY2FsbGVyIGZ1bmN0aW9uLlxuICAgKiBAcmV0dXJuIHtEZWNvcmF0aW9ufSB0aGUgY3JlYXRlZCBkZWNvcmF0aW9uXG4gICAqIEBlbWl0cyAge2RpZC1hZGQtZGVjb3JhdGlvbn0gd2hlbiB0aGUgZGVjb3JhdGlvbiBpcyBjcmVhdGVkIHN1Y2Nlc3NmdWxseVxuICAgKiBAZW1pdHMgIHtkaWQtY2hhbmdlfSB3aGVuIHRoZSBkZWNvcmF0aW9uIGlzIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XG4gICAqL1xuICBkZWNvcmF0ZU1hcmtlciAobWFya2VyLCBkZWNvcmF0aW9uUGFyYW1zKSB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkIHx8IG1hcmtlciA9PSBudWxsKSB7IHJldHVybiB9XG5cbiAgICBsZXQge2lkfSA9IG1hcmtlclxuXG4gICAgaWYgKGRlY29yYXRpb25QYXJhbXMudHlwZSA9PT0gJ2hpZ2hsaWdodCcpIHtcbiAgICAgIGRlY29yYXRpb25QYXJhbXMudHlwZSA9ICdoaWdobGlnaHQtb3ZlcidcbiAgICB9XG5cbiAgICBjb25zdCB7dHlwZSwgcGx1Z2lufSA9IGRlY29yYXRpb25QYXJhbXNcblxuICAgIGlmIChwbHVnaW4gPT0gbnVsbCkge1xuICAgICAgZGVjb3JhdGlvblBhcmFtcy5wbHVnaW4gPSB0aGlzLmdldE9yaWdpbmF0b3JQYWNrYWdlTmFtZSgpXG4gICAgfVxuXG4gICAgaWYgKGRlY29yYXRpb25QYXJhbXMuc2NvcGUgPT0gbnVsbCAmJiBkZWNvcmF0aW9uUGFyYW1zWydjbGFzcyddICE9IG51bGwpIHtcbiAgICAgIGxldCBjbHMgPSBkZWNvcmF0aW9uUGFyYW1zWydjbGFzcyddLnNwbGl0KCcgJykuam9pbignLicpXG4gICAgICBkZWNvcmF0aW9uUGFyYW1zLnNjb3BlID0gYC5taW5pbWFwIC4ke2Nsc31gXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVjb3JhdGlvbk1hcmtlckRlc3Ryb3llZFN1YnNjcmlwdGlvbnNbaWRdID09IG51bGwpIHtcbiAgICAgIHRoaXMuZGVjb3JhdGlvbk1hcmtlckRlc3Ryb3llZFN1YnNjcmlwdGlvbnNbaWRdID1cbiAgICAgIG1hcmtlci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICB0aGlzLnJlbW92ZUFsbERlY29yYXRpb25zRm9yTWFya2VyKG1hcmtlcilcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVjb3JhdGlvbk1hcmtlckNoYW5nZWRTdWJzY3JpcHRpb25zW2lkXSA9PSBudWxsKSB7XG4gICAgICB0aGlzLmRlY29yYXRpb25NYXJrZXJDaGFuZ2VkU3Vic2NyaXB0aW9uc1tpZF0gPVxuICAgICAgbWFya2VyLm9uRGlkQ2hhbmdlKChldmVudCkgPT4ge1xuICAgICAgICBsZXQgZGVjb3JhdGlvbnMgPSB0aGlzLmRlY29yYXRpb25zQnlNYXJrZXJJZFtpZF1cblxuICAgICAgICB0aGlzLmludmFsaWRhdGVEZWNvcmF0aW9uRm9yU2NyZWVuUm93c0NhY2hlKClcblxuICAgICAgICBpZiAoZGVjb3JhdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBkZWNvcmF0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IGRlY29yYXRpb24gPSBkZWNvcmF0aW9uc1tpXVxuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtZGVjb3JhdGlvbicsIHtcbiAgICAgICAgICAgICAgbWFya2VyOiBtYXJrZXIsXG4gICAgICAgICAgICAgIGRlY29yYXRpb246IGRlY29yYXRpb24sXG4gICAgICAgICAgICAgIGV2ZW50OiBldmVudFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9sZFN0YXJ0ID0gZXZlbnQub2xkVGFpbFNjcmVlblBvc2l0aW9uXG4gICAgICAgIGxldCBvbGRFbmQgPSBldmVudC5vbGRIZWFkU2NyZWVuUG9zaXRpb25cbiAgICAgICAgbGV0IG5ld1N0YXJ0ID0gZXZlbnQubmV3VGFpbFNjcmVlblBvc2l0aW9uXG4gICAgICAgIGxldCBuZXdFbmQgPSBldmVudC5uZXdIZWFkU2NyZWVuUG9zaXRpb25cblxuICAgICAgICBpZiAob2xkU3RhcnQucm93ID4gb2xkRW5kLnJvdykge1xuICAgICAgICAgIFtvbGRTdGFydCwgb2xkRW5kXSA9IFtvbGRFbmQsIG9sZFN0YXJ0XVxuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdTdGFydC5yb3cgPiBuZXdFbmQucm93KSB7XG4gICAgICAgICAgW25ld1N0YXJ0LCBuZXdFbmRdID0gW25ld0VuZCwgbmV3U3RhcnRdXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmFuZ2VzRGlmZnMgPSB0aGlzLmNvbXB1dGVSYW5nZXNEaWZmcyhcbiAgICAgICAgICBvbGRTdGFydCwgb2xkRW5kLFxuICAgICAgICAgIG5ld1N0YXJ0LCBuZXdFbmRcbiAgICAgICAgKVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSByYW5nZXNEaWZmcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGxldCBbc3RhcnQsIGVuZF0gPSByYW5nZXNEaWZmc1tpXVxuICAgICAgICAgIHRoaXMuZW1pdFJhbmdlQ2hhbmdlcyh0eXBlLCB7XG4gICAgICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IGVuZFxuICAgICAgICAgIH0sIDApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IGRlY29yYXRpb24gPSBuZXcgRGVjb3JhdGlvbihtYXJrZXIsIHRoaXMsIGRlY29yYXRpb25QYXJhbXMpXG5cbiAgICBpZiAodGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWRbaWRdID09IG51bGwpIHtcbiAgICAgIHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkW2lkXSA9IFtdXG4gICAgfVxuXG4gICAgdGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWRbaWRdLnB1c2goZGVjb3JhdGlvbilcbiAgICB0aGlzLmRlY29yYXRpb25zQnlJZFtkZWNvcmF0aW9uLmlkXSA9IGRlY29yYXRpb25cblxuICAgIGlmICh0aGlzLmRlY29yYXRpb25VcGRhdGVkU3Vic2NyaXB0aW9uc1tkZWNvcmF0aW9uLmlkXSA9PSBudWxsKSB7XG4gICAgICB0aGlzLmRlY29yYXRpb25VcGRhdGVkU3Vic2NyaXB0aW9uc1tkZWNvcmF0aW9uLmlkXSA9XG4gICAgICBkZWNvcmF0aW9uLm9uRGlkQ2hhbmdlUHJvcGVydGllcygoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0RGVjb3JhdGlvbkNoYW5nZXModHlwZSwgZGVjb3JhdGlvbilcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5kZWNvcmF0aW9uRGVzdHJveWVkU3Vic2NyaXB0aW9uc1tkZWNvcmF0aW9uLmlkXSA9XG4gICAgZGVjb3JhdGlvbi5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy5yZW1vdmVEZWNvcmF0aW9uKGRlY29yYXRpb24pXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdERlY29yYXRpb25DaGFuZ2VzKHR5cGUsIGRlY29yYXRpb24pXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1hZGQtZGVjb3JhdGlvbicsIHtcbiAgICAgIG1hcmtlcjogbWFya2VyLFxuICAgICAgZGVjb3JhdGlvbjogZGVjb3JhdGlvblxuICAgIH0pXG5cbiAgICByZXR1cm4gZGVjb3JhdGlvblxuICB9XG5cbiAgZ2V0T3JpZ2luYXRvclBhY2thZ2VOYW1lICgpIHtcbiAgICBjb25zdCBsaW5lID0gbmV3IEVycm9yKCkuc3RhY2suc3BsaXQoJ1xcbicpWzNdXG4gICAgY29uc3QgZmlsZVBhdGggPSBsaW5lLnNwbGl0KCcoJylbMV0ucmVwbGFjZSgnKScsICcnKVxuICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChcbiAgICAgIGF0b20ucGFja2FnZXMuZ2V0UGFja2FnZURpclBhdGhzKCkuam9pbignfCcpICsgXy5lc2NhcGVSZWdFeHAocGF0aC5zZXApXG4gICAgKVxuICAgIGNvbnN0IHBsdWdpbiA9IGZpbGVQYXRoLnJlcGxhY2UocmUsICcnKS5zcGxpdChwYXRoLnNlcClbMF0ucmVwbGFjZSgvbWluaW1hcC18LW1pbmltYXAvLCAnJylcbiAgICByZXR1cm4gcGx1Z2luLmluZGV4T2YocGF0aC5zZXApIDwgMCA/IHBsdWdpbiA6IHVuZGVmaW5lZFxuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIHR3byByYW5nZXMsIGl0IHJldHVybnMgYW4gYXJyYXkgb2YgcmFuZ2VzIHJlcHJlc2VudGluZyB0aGVcbiAgICogZGlmZmVyZW5jZXMgYmV0d2VlbiB0aGVtLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IG9sZFN0YXJ0IHRoZSByb3cgaW5kZXggb2YgdGhlIGZpcnN0IHJhbmdlIHN0YXJ0XG4gICAqIEBwYXJhbSAge251bWJlcn0gb2xkRW5kIHRoZSByb3cgaW5kZXggb2YgdGhlIGZpcnN0IHJhbmdlIGVuZFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IG5ld1N0YXJ0IHRoZSByb3cgaW5kZXggb2YgdGhlIHNlY29uZCByYW5nZSBzdGFydFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IG5ld0VuZCB0aGUgcm93IGluZGV4IG9mIHRoZSBzZWNvbmQgcmFuZ2UgZW5kXG4gICAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59IHRoZSBhcnJheSBvZiBkaWZmIHJhbmdlc1xuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGNvbXB1dGVSYW5nZXNEaWZmcyAob2xkU3RhcnQsIG9sZEVuZCwgbmV3U3RhcnQsIG5ld0VuZCkge1xuICAgIGxldCBkaWZmcyA9IFtdXG5cbiAgICBpZiAob2xkU3RhcnQuaXNMZXNzVGhhbihuZXdTdGFydCkpIHtcbiAgICAgIGRpZmZzLnB1c2goW29sZFN0YXJ0LCBuZXdTdGFydF0pXG4gICAgfSBlbHNlIGlmIChuZXdTdGFydC5pc0xlc3NUaGFuKG9sZFN0YXJ0KSkge1xuICAgICAgZGlmZnMucHVzaChbbmV3U3RhcnQsIG9sZFN0YXJ0XSlcbiAgICB9XG5cbiAgICBpZiAob2xkRW5kLmlzTGVzc1RoYW4obmV3RW5kKSkge1xuICAgICAgZGlmZnMucHVzaChbb2xkRW5kLCBuZXdFbmRdKVxuICAgIH0gZWxzZSBpZiAobmV3RW5kLmlzTGVzc1RoYW4ob2xkRW5kKSkge1xuICAgICAgZGlmZnMucHVzaChbbmV3RW5kLCBvbGRFbmRdKVxuICAgIH1cblxuICAgIHJldHVybiBkaWZmc1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIGEgY2hhbmdlIGluIHRoZSBgTWluaW1hcGAgY29ycmVzcG9uZGluZyB0byB0aGVcbiAgICogcGFzc2VkLWluIGRlY29yYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdHlwZSB0aGUgdHlwZSBvZiBkZWNvcmF0aW9uIHRoYXQgY2hhbmdlZFxuICAgKiBAcGFyYW0gIHtEZWNvcmF0aW9ufSBkZWNvcmF0aW9uIHRoZSBkZWNvcmF0aW9uIGZvciB3aGljaCBlbWl0dGluZyBhbiBldmVudFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGVtaXREZWNvcmF0aW9uQ2hhbmdlcyAodHlwZSwgZGVjb3JhdGlvbikge1xuICAgIGlmIChkZWNvcmF0aW9uLm1hcmtlci5kaXNwbGF5QnVmZmVyLmlzRGVzdHJveWVkKCkpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuaW52YWxpZGF0ZURlY29yYXRpb25Gb3JTY3JlZW5Sb3dzQ2FjaGUoKVxuXG4gICAgbGV0IHJhbmdlID0gZGVjb3JhdGlvbi5tYXJrZXIuZ2V0U2NyZWVuUmFuZ2UoKVxuICAgIGlmIChyYW5nZSA9PSBudWxsKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLmVtaXRSYW5nZUNoYW5nZXModHlwZSwgcmFuZ2UsIDApXG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgYSBjaGFuZ2UgZm9yIHRoZSBzcGVjaWZpZWQgcmFuZ2UuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdHlwZSB0aGUgdHlwZSBvZiBkZWNvcmF0aW9uIHRoYXQgY2hhbmdlZFxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJhbmdlIHRoZSByYW5nZSB3aGVyZSBjaGFuZ2VzIG9jY3VyZWRcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbc2NyZWVuRGVsdGFdIGFuIG9wdGlvbmFsIHNjcmVlbiBkZWx0YSBmb3IgdGhlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2Ugb2JqZWN0XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZW1pdFJhbmdlQ2hhbmdlcyAodHlwZSwgcmFuZ2UsIHNjcmVlbkRlbHRhKSB7XG4gICAgbGV0IHN0YXJ0U2NyZWVuUm93ID0gcmFuZ2Uuc3RhcnQucm93XG4gICAgbGV0IGVuZFNjcmVlblJvdyA9IHJhbmdlLmVuZC5yb3dcbiAgICBsZXQgbGFzdFJlbmRlcmVkU2NyZWVuUm93ID0gdGhpcy5nZXRMYXN0VmlzaWJsZVNjcmVlblJvdygpXG4gICAgbGV0IGZpcnN0UmVuZGVyZWRTY3JlZW5Sb3cgPSB0aGlzLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpXG5cbiAgICBpZiAoc2NyZWVuRGVsdGEgPT0gbnVsbCkge1xuICAgICAgc2NyZWVuRGVsdGEgPSAobGFzdFJlbmRlcmVkU2NyZWVuUm93IC0gZmlyc3RSZW5kZXJlZFNjcmVlblJvdykgLVxuICAgICAgICAgICAgICAgICAgICAoZW5kU2NyZWVuUm93IC0gc3RhcnRTY3JlZW5Sb3cpXG4gICAgfVxuXG4gICAgbGV0IGNoYW5nZUV2ZW50ID0ge1xuICAgICAgc3RhcnQ6IHN0YXJ0U2NyZWVuUm93LFxuICAgICAgZW5kOiBlbmRTY3JlZW5Sb3csXG4gICAgICBzY3JlZW5EZWx0YTogc2NyZWVuRGVsdGEsXG4gICAgICB0eXBlOiB0eXBlXG4gICAgfVxuXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtZGVjb3JhdGlvbi1yYW5nZScsIGNoYW5nZUV2ZW50KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBgRGVjb3JhdGlvbmAgZnJvbSB0aGlzIG1pbmltYXAuXG4gICAqXG4gICAqIEBwYXJhbSAge0RlY29yYXRpb259IGRlY29yYXRpb24gdGhlIGRlY29yYXRpb24gdG8gcmVtb3ZlXG4gICAqIEBlbWl0cyAge2RpZC1jaGFuZ2V9IHdoZW4gdGhlIGRlY29yYXRpb24gaXMgcmVtb3ZlZFxuICAgKiBAZW1pdHMgIHtkaWQtcmVtb3ZlLWRlY29yYXRpb259IHdoZW4gdGhlIGRlY29yYXRpb24gaXMgcmVtb3ZlZFxuICAgKi9cbiAgcmVtb3ZlRGVjb3JhdGlvbiAoZGVjb3JhdGlvbikge1xuICAgIGlmIChkZWNvcmF0aW9uID09IG51bGwpIHsgcmV0dXJuIH1cblxuICAgIGxldCBtYXJrZXIgPSBkZWNvcmF0aW9uLm1hcmtlclxuICAgIGxldCBzdWJzY3JpcHRpb25cblxuICAgIGRlbGV0ZSB0aGlzLmRlY29yYXRpb25zQnlJZFtkZWNvcmF0aW9uLmlkXVxuXG4gICAgc3Vic2NyaXB0aW9uID0gdGhpcy5kZWNvcmF0aW9uVXBkYXRlZFN1YnNjcmlwdGlvbnNbZGVjb3JhdGlvbi5pZF1cbiAgICBpZiAoc3Vic2NyaXB0aW9uICE9IG51bGwpIHsgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKSB9XG5cbiAgICBzdWJzY3JpcHRpb24gPSB0aGlzLmRlY29yYXRpb25EZXN0cm95ZWRTdWJzY3JpcHRpb25zW2RlY29yYXRpb24uaWRdXG4gICAgaWYgKHN1YnNjcmlwdGlvbiAhPSBudWxsKSB7IHN1YnNjcmlwdGlvbi5kaXNwb3NlKCkgfVxuXG4gICAgZGVsZXRlIHRoaXMuZGVjb3JhdGlvblVwZGF0ZWRTdWJzY3JpcHRpb25zW2RlY29yYXRpb24uaWRdXG4gICAgZGVsZXRlIHRoaXMuZGVjb3JhdGlvbkRlc3Ryb3llZFN1YnNjcmlwdGlvbnNbZGVjb3JhdGlvbi5pZF1cblxuICAgIGxldCBkZWNvcmF0aW9ucyA9IHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkW21hcmtlci5pZF1cbiAgICBpZiAoIWRlY29yYXRpb25zKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLmVtaXREZWNvcmF0aW9uQ2hhbmdlcyhkZWNvcmF0aW9uLmdldFByb3BlcnRpZXMoKS50eXBlLCBkZWNvcmF0aW9uKVxuXG4gICAgbGV0IGluZGV4ID0gZGVjb3JhdGlvbnMuaW5kZXhPZihkZWNvcmF0aW9uKVxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBkZWNvcmF0aW9ucy5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtcmVtb3ZlLWRlY29yYXRpb24nLCB7XG4gICAgICAgIG1hcmtlcjogbWFya2VyLFxuICAgICAgICBkZWNvcmF0aW9uOiBkZWNvcmF0aW9uXG4gICAgICB9KVxuXG4gICAgICBpZiAoZGVjb3JhdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlZEFsbE1hcmtlckRlY29yYXRpb25zKG1hcmtlcilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgdGhlIGRlY29yYXRpb25zIHJlZ2lzdGVyZWQgZm9yIHRoZSBwYXNzZWQtaW4gbWFya2VyLlxuICAgKlxuICAgKiBAcGFyYW0gIHtNYXJrZXJ9IG1hcmtlciB0aGUgbWFya2VyIGZvciB3aGljaCByZW1vdmluZyBpdHMgZGVjb3JhdGlvbnNcbiAgICogQGVtaXRzICB7ZGlkLWNoYW5nZX0gd2hlbiBhIGRlY29yYXRpb24gaGF2ZSBiZWVuIHJlbW92ZWRcbiAgICogQGVtaXRzICB7ZGlkLXJlbW92ZS1kZWNvcmF0aW9ufSB3aGVuIGEgZGVjb3JhdGlvbiBoYXZlIGJlZW4gcmVtb3ZlZFxuICAgKi9cbiAgcmVtb3ZlQWxsRGVjb3JhdGlvbnNGb3JNYXJrZXIgKG1hcmtlcikge1xuICAgIGlmIChtYXJrZXIgPT0gbnVsbCkgeyByZXR1cm4gfVxuXG4gICAgbGV0IGRlY29yYXRpb25zID0gdGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWRbbWFya2VyLmlkXVxuICAgIGlmICghZGVjb3JhdGlvbnMpIHsgcmV0dXJuIH1cblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBkZWNvcmF0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IGRlY29yYXRpb24gPSBkZWNvcmF0aW9uc1tpXVxuXG4gICAgICB0aGlzLmVtaXREZWNvcmF0aW9uQ2hhbmdlcyhkZWNvcmF0aW9uLmdldFByb3BlcnRpZXMoKS50eXBlLCBkZWNvcmF0aW9uKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1yZW1vdmUtZGVjb3JhdGlvbicsIHtcbiAgICAgICAgbWFya2VyOiBtYXJrZXIsXG4gICAgICAgIGRlY29yYXRpb246IGRlY29yYXRpb25cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5yZW1vdmVkQWxsTWFya2VyRGVjb3JhdGlvbnMobWFya2VyKVxuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIHRoZSByZW1vdmFsIG9mIGEgZGVjb3JhdGlvbiBmb3IgYSBnaXZlbiBtYXJrZXIuXG4gICAqXG4gICAqIEBwYXJhbSAge01hcmtlcn0gbWFya2VyIHRoZSBtYXJrZXIgZm9yIHdoaWNoIHJlbW92aW5nIGRlY29yYXRpb25zXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgcmVtb3ZlZEFsbE1hcmtlckRlY29yYXRpb25zIChtYXJrZXIpIHtcbiAgICBpZiAobWFya2VyID09IG51bGwpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuZGVjb3JhdGlvbk1hcmtlckNoYW5nZWRTdWJzY3JpcHRpb25zW21hcmtlci5pZF0uZGlzcG9zZSgpXG4gICAgdGhpcy5kZWNvcmF0aW9uTWFya2VyRGVzdHJveWVkU3Vic2NyaXB0aW9uc1ttYXJrZXIuaWRdLmRpc3Bvc2UoKVxuXG4gICAgZGVsZXRlIHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkW21hcmtlci5pZF1cbiAgICBkZWxldGUgdGhpcy5kZWNvcmF0aW9uTWFya2VyQ2hhbmdlZFN1YnNjcmlwdGlvbnNbbWFya2VyLmlkXVxuICAgIGRlbGV0ZSB0aGlzLmRlY29yYXRpb25NYXJrZXJEZXN0cm95ZWRTdWJzY3JpcHRpb25zW21hcmtlci5pZF1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCB0aGUgZGVjb3JhdGlvbnMgdGhhdCB3YXMgY3JlYXRlZCBpbiB0aGUgY3VycmVudCBgTWluaW1hcGAuXG4gICAqL1xuICByZW1vdmVBbGxEZWNvcmF0aW9ucyAoKSB7XG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5kZWNvcmF0aW9uTWFya2VyQ2hhbmdlZFN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuZGVjb3JhdGlvbk1hcmtlckNoYW5nZWRTdWJzY3JpcHRpb25zW2lkXS5kaXNwb3NlKClcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmRlY29yYXRpb25NYXJrZXJEZXN0cm95ZWRTdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLmRlY29yYXRpb25NYXJrZXJEZXN0cm95ZWRTdWJzY3JpcHRpb25zW2lkXS5kaXNwb3NlKClcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmRlY29yYXRpb25VcGRhdGVkU3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5kZWNvcmF0aW9uVXBkYXRlZFN1YnNjcmlwdGlvbnNbaWRdLmRpc3Bvc2UoKVxuICAgIH1cblxuICAgIGZvciAobGV0IGlkIGluIHRoaXMuZGVjb3JhdGlvbkRlc3Ryb3llZFN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuZGVjb3JhdGlvbkRlc3Ryb3llZFN1YnNjcmlwdGlvbnNbaWRdLmRpc3Bvc2UoKVxuICAgIH1cblxuICAgIGZvciAobGV0IGlkIGluIHRoaXMuZGVjb3JhdGlvbnNCeUlkKSB7XG4gICAgICB0aGlzLmRlY29yYXRpb25zQnlJZFtpZF0uZGVzdHJveSgpXG4gICAgfVxuXG4gICAgdGhpcy5kZWNvcmF0aW9uc0J5SWQgPSB7fVxuICAgIHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkID0ge31cbiAgICB0aGlzLmRlY29yYXRpb25NYXJrZXJDaGFuZ2VkU3Vic2NyaXB0aW9ucyA9IHt9XG4gICAgdGhpcy5kZWNvcmF0aW9uTWFya2VyRGVzdHJveWVkU3Vic2NyaXB0aW9ucyA9IHt9XG4gICAgdGhpcy5kZWNvcmF0aW9uVXBkYXRlZFN1YnNjcmlwdGlvbnMgPSB7fVxuICAgIHRoaXMuZGVjb3JhdGlvbkRlc3Ryb3llZFN1YnNjcmlwdGlvbnMgPSB7fVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/victor.martins/.atom/packages/minimap/lib/mixins/decoration-management.js
