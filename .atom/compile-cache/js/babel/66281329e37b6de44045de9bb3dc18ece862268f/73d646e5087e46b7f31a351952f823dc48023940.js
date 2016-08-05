Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

var _mixinsDecorationManagement = require('./mixins/decoration-management');

var _mixinsDecorationManagement2 = _interopRequireDefault(_mixinsDecorationManagement);

var _adaptersLegacyAdapter = require('./adapters/legacy-adapter');

var _adaptersLegacyAdapter2 = _interopRequireDefault(_adaptersLegacyAdapter);

var _adaptersStableAdapter = require('./adapters/stable-adapter');

var _adaptersStableAdapter2 = _interopRequireDefault(_adaptersStableAdapter);

'use babel';

var nextModelId = 1;

/**
 * The Minimap class is the underlying model of a <MinimapElement>.
 * Most manipulations of the minimap is done through the model.
 *
 * Any Minimap instance is tied to a `TextEditor`.
 * Their lifecycle follow the one of their target `TextEditor`, so they are
 * destroyed whenever their `TextEditor` is destroyed.
 */

var Minimap = (function () {
  /**
   * Creates a new Minimap instance for the given `TextEditor`.
   *
   * @param  {Object} options an object with the new Minimap properties
   * @param  {TextEditor} options.textEditor the target text editor for
   *                                         the minimap
   * @param  {boolean} [options.standAlone] whether this minimap is in
   *                                        stand-alone mode or not
   * @param  {number} [options.width] the minimap width in pixels
   * @param  {number} [options.height] the minimap height in pixels
   * @throws {Error} Cannot create a minimap without an editor
   */

  function Minimap() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, _Minimap);

    if (!options.textEditor) {
      throw new Error('Cannot create a minimap without an editor');
    }

    /**
     * The Minimap's text editor.
     *
     * @type {TextEditor}
     * @access private
     */
    this.textEditor = options.textEditor;
    /**
     * The stand-alone state of the current Minimap.
     *
     * @type {boolean}
     * @access private
     */
    this.standAlone = options.standAlone;
    /**
     * The width of the current Minimap.
     *
     * @type {number}
     * @access private
     */
    this.width = options.width;
    /**
     * The height of the current Minimap.
     *
     * @type {number}
     * @access private
     */
    this.height = options.height;
    /**
     * The id of the current Minimap.
     *
     * @type {Number}
     * @access private
     */
    this.id = nextModelId++;
    /**
     * The events emitter of the current Minimap.
     *
     * @type {Emitter}
     * @access private
     */
    this.emitter = new _atom.Emitter();
    /**
     * The Minimap's subscriptions.
     *
     * @type {CompositeDisposable}
     * @access private
     */
    this.subscriptions = new _atom.CompositeDisposable();
    /**
     * The adapter object leverage the access to several properties from
     * the `TextEditor`/`TextEditorElement` to support the different APIs
     * between different version of Atom.
     *
     * @type {Object}
     * @access private
     */
    this.adapter = null;
    /**
     * The char height of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.charHeight = null;
    /**
     * The char height from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configCharHeight = null;
    /**
     * The char width of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.charWidth = null;
    /**
     * The char width from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configCharWidth = null;
    /**
     * The interline of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.interline = null;
    /**
     * The interline from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configInterline = null;
    /**
     * The devicePixelRatioRounding of the current Minimap, will be
     * `undefined` unless `setDevicePixelRatioRounding` is called.
     *
     * @type {boolean}
     * @access private
     */
    this.devicePixelRatioRounding = null;
    /**
     * The devicePixelRatioRounding from the package's configuration.
     * Will be overriden by the instance value.
     *
     * @type {boolean}
     * @access private
     */
    this.configDevicePixelRatioRounding = null;
    /**
    /**
     * A boolean value to store whether this Minimap have been destroyed or not.
     *
     * @type {boolean}
     * @access private
     */
    this.destroyed = false;
    /**
     * A boolean value to store whether the `scrollPastEnd` setting is enabled
     * or not.
     *
     * @type {boolean}
     * @access private
     */
    this.scrollPastEnd = false;

    this.initializeDecorations();

    if (atom.views.getView(this.textEditor).getScrollTop != null) {
      this.adapter = new _adaptersStableAdapter2['default'](this.textEditor);
    } else {
      this.adapter = new _adaptersLegacyAdapter2['default'](this.textEditor);
    }

    if (this.standAlone) {
      /**
       * When in stand-alone mode, a Minimap doesn't scroll and will use this
       * value instead.
       *
       * @type {number}
       * @access private
       */
      this.scrollTop = 0;
    }

    var subs = this.subscriptions;
    subs.add(atom.config.observe('editor.scrollPastEnd', function (scrollPastEnd) {
      _this.scrollPastEnd = scrollPastEnd;
      _this.adapter.scrollPastEnd = _this.scrollPastEnd;
      _this.emitter.emit('did-change-config');
    }));
    subs.add(atom.config.observe('minimap.charHeight', function (configCharHeight) {
      _this.configCharHeight = configCharHeight;
      _this.emitter.emit('did-change-config');
    }));
    subs.add(atom.config.observe('minimap.charWidth', function (configCharWidth) {
      _this.configCharWidth = configCharWidth;
      _this.emitter.emit('did-change-config');
    }));
    subs.add(atom.config.observe('minimap.interline', function (configInterline) {
      _this.configInterline = configInterline;
      _this.emitter.emit('did-change-config');
    }));
    // cdprr is shorthand for configDevicePixelRatioRounding
    subs.add(atom.config.observe('minimap.devicePixelRatioRounding', function (cdprr) {
      _this.configDevicePixelRatioRounding = cdprr;
      _this.emitter.emit('did-change-config');
    }));

    subs.add(this.adapter.onDidChangeScrollTop(function () {
      if (!_this.standAlone) {
        _this.emitter.emit('did-change-scroll-top', _this);
      }
    }));
    subs.add(this.adapter.onDidChangeScrollLeft(function () {
      if (!_this.standAlone) {
        _this.emitter.emit('did-change-scroll-left', _this);
      }
    }));

    subs.add(this.textEditor.onDidChange(function (changes) {
      _this.emitChanges(changes);
    }));
    subs.add(this.textEditor.onDidDestroy(function () {
      _this.destroy();
    }));

    /*
    FIXME Some changes occuring during the tokenization produces
    ranges that deceive the canvas rendering by making some
    lines at the end of the buffer intact while they are in fact not,
    resulting in extra lines appearing at the end of the minimap.
    Forcing a whole repaint to fix that bug is suboptimal but works.
    */
    subs.add(this.textEditor.displayBuffer.onDidTokenize(function () {
      _this.emitter.emit('did-change-config');
    }));
  }

  /**
   * Destroys the model.
   */

  _createClass(Minimap, [{
    key: 'destroy',
    value: function destroy() {
      if (this.destroyed) {
        return;
      }

      this.removeAllDecorations();
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.textEditor = null;
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      this.destroyed = true;
    }

    /**
     * Returns `true` when this `Minimap` has benn destroyed.
     *
     * @return {boolean} whether this Minimap has been destroyed or not
     */
  }, {
    key: 'isDestroyed',
    value: function isDestroyed() {
      return this.destroyed;
    }

    /**
     * Registers an event listener to the `did-change` event.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                                event is triggered.
     *                                                the callback will be called
     *                                                with an event object with
     *                                                the following properties:
     * - start: The change's start row number
     * - end: The change's end row number
     * - screenDelta: the delta in buffer rows between the versions before and
     *   after the change
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChange',
    value: function onDidChange(callback) {
      return this.emitter.on('did-change', callback);
    }

    /**
     * Registers an event listener to the `did-change-config` event.
     *
     * @param  {function():void} callback a function to call when the event
     *                                    is triggered.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeConfig',
    value: function onDidChangeConfig(callback) {
      return this.emitter.on('did-change-config', callback);
    }

    /**
     * Registers an event listener to the `did-change-scroll-top` event.
     *
     * The event is dispatched when the text editor `scrollTop` value have been
     * changed or when the minimap scroll top have been changed in stand-alone
     * mode.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeScrollTop',
    value: function onDidChangeScrollTop(callback) {
      return this.emitter.on('did-change-scroll-top', callback);
    }

    /**
     * Registers an event listener to the `did-change-scroll-left` event.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeScrollLeft',
    value: function onDidChangeScrollLeft(callback) {
      return this.emitter.on('did-change-scroll-left', callback);
    }

    /**
     * Registers an event listener to the `did-change-stand-alone` event.
     *
     * This event is dispatched when the stand-alone of the current Minimap
     * is either enabled or disabled.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeStandAlone',
    value: function onDidChangeStandAlone(callback) {
      return this.emitter.on('did-change-stand-alone', callback);
    }

    /**
     * Registers an event listener to the `did-destroy` event.
     *
     * This event is dispatched when this Minimap have been destroyed. It can
     * occurs either because the {@link destroy} method have been called on the
     * Minimap or because the target text editor have been destroyed.
     *
     * @param  {function():void} callback a function to call when the event
     *                                    is triggered.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }

    /**
     * Returns `true` when the current Minimap is a stand-alone minimap.
     *
     * @return {boolean} whether this Minimap is in stand-alone mode or not.
     */
  }, {
    key: 'isStandAlone',
    value: function isStandAlone() {
      return this.standAlone;
    }

    /**
     * Sets the stand-alone mode for this minimap.
     *
     * @param {boolean} standAlone the new state of the stand-alone mode for this
     *                             Minimap
     * @emits {did-change-stand-alone} if the stand-alone mode have been toggled
     *        on or off by the call
     */
  }, {
    key: 'setStandAlone',
    value: function setStandAlone(standAlone) {
      if (standAlone !== this.standAlone) {
        this.standAlone = standAlone;
        this.emitter.emit('did-change-stand-alone', this);
      }
    }

    /**
     * Returns the `TextEditor` that this minimap represents.
     *
     * @return {TextEditor} this Minimap's text editor
     */
  }, {
    key: 'getTextEditor',
    value: function getTextEditor() {
      return this.textEditor;
    }

    /**
     * Returns the height of the `TextEditor` at the Minimap scale.
     *
     * @return {number} the scaled height of the text editor
     */
  }, {
    key: 'getTextEditorScaledHeight',
    value: function getTextEditorScaledHeight() {
      return this.adapter.getHeight() * this.getVerticalScaleFactor();
    }

    /**
     * Returns the `TextEditor` scroll top value at the Minimap scale.
     *
     * @return {number} the scaled scroll top of the text editor
     */
  }, {
    key: 'getTextEditorScaledScrollTop',
    value: function getTextEditorScaledScrollTop() {
      return this.adapter.getScrollTop() * this.getVerticalScaleFactor();
    }

    /**
     * Returns the `TextEditor` scroll left value at the Minimap scale.
     *
     * @return {number} the scaled scroll left of the text editor
     */
  }, {
    key: 'getTextEditorScaledScrollLeft',
    value: function getTextEditorScaledScrollLeft() {
      return this.adapter.getScrollLeft() * this.getHorizontalScaleFactor();
    }

    /**
     * Returns the `TextEditor` maximum scroll top value.
     *
     * When the `scrollPastEnd` setting is enabled, the method compensate the
     * extra scroll by removing the same height as added by the editor from the
     * final value.
     *
     * @return {number} the maximum scroll top of the text editor
     */
  }, {
    key: 'getTextEditorMaxScrollTop',
    value: function getTextEditorMaxScrollTop() {
      return this.adapter.getMaxScrollTop();
    }

    /**
     * Returns the `TextEditor` scroll top value.
     *
     * @return {number} the scroll top of the text editor
     */
  }, {
    key: 'getTextEditorScrollTop',
    value: function getTextEditorScrollTop() {
      return this.adapter.getScrollTop();
    }

    /**
     * Sets the scroll top of the `TextEditor`.
     *
     * @param {number} scrollTop the new scroll top value
     */
  }, {
    key: 'setTextEditorScrollTop',
    value: function setTextEditorScrollTop(scrollTop) {
      this.adapter.setScrollTop(scrollTop);
    }

    /**
     * Returns the `TextEditor` scroll left value.
     *
     * @return {number} the scroll left of the text editor
     */
  }, {
    key: 'getTextEditorScrollLeft',
    value: function getTextEditorScrollLeft() {
      return this.adapter.getScrollLeft();
    }

    /**
     * Returns the height of the `TextEditor`.
     *
     * @return {number} the height of the text editor
     */
  }, {
    key: 'getTextEditorHeight',
    value: function getTextEditorHeight() {
      return this.adapter.getHeight();
    }

    /**
     * Returns the `TextEditor` scroll as a value normalized between `0` and `1`.
     *
     * When the `scrollPastEnd` setting is enabled the value may exceed `1` as the
     * maximum scroll value used to compute this ratio compensate for the extra
     * height in the editor. **Use {@link getCapedTextEditorScrollRatio} when
     * you need a value that is strictly between `0` and `1`.**
     *
     * @return {number} the scroll ratio of the text editor
     */
  }, {
    key: 'getTextEditorScrollRatio',
    value: function getTextEditorScrollRatio() {
      return this.adapter.getScrollTop() / (this.getTextEditorMaxScrollTop() || 1);
    }

    /**
     * Returns the `TextEditor` scroll as a value normalized between `0` and `1`.
     *
     * The returned value will always be strictly between `0` and `1`.
     *
     * @return {number} the scroll ratio of the text editor strictly between
     *                  0 and 1
     */
  }, {
    key: 'getCapedTextEditorScrollRatio',
    value: function getCapedTextEditorScrollRatio() {
      return Math.min(1, this.getTextEditorScrollRatio());
    }

    /**
     * Returns the height of the whole minimap in pixels based on the `minimap`
     * settings.
     *
     * @return {number} the height of the minimap
     */
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.textEditor.getScreenLineCount() * this.getLineHeight();
    }

    /**
     * Returns the width of the whole minimap in pixels based on the `minimap`
     * settings.
     *
     * @return {number} the width of the minimap
     */
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.textEditor.getMaxScreenLineLength() * this.getCharWidth();
    }

    /**
     * Returns the height the Minimap content will take on screen.
     *
     * When the Minimap height is greater than the `TextEditor` height, the
     * `TextEditor` height is returned instead.
     *
     * @return {number} the visible height of the Minimap
     */
  }, {
    key: 'getVisibleHeight',
    value: function getVisibleHeight() {
      return Math.min(this.getScreenHeight(), this.getHeight());
    }

    /**
     * Returns the height the minimap should take once displayed, it's either
     * the height of the `TextEditor` or the provided `height` when in stand-alone
     * mode.
     *
     * @return {number} the total height of the Minimap
     */
  }, {
    key: 'getScreenHeight',
    value: function getScreenHeight() {
      if (this.isStandAlone()) {
        if (this.height != null) {
          return this.height;
        } else {
          return this.getHeight();
        }
      } else {
        return this.adapter.getHeight();
      }
    }

    /**
     * Returns the width the whole Minimap will take on screen.
     *
     * @return {number} the width of the Minimap when displayed
     */
  }, {
    key: 'getVisibleWidth',
    value: function getVisibleWidth() {
      return Math.min(this.getScreenWidth(), this.getWidth());
    }

    /**
     * Returns the width the Minimap should take once displayed, it's either the
     * width of the Minimap content or the provided `width` when in standAlone
     * mode.
     *
     * @return {number} the Minimap screen width
     */
  }, {
    key: 'getScreenWidth',
    value: function getScreenWidth() {
      if (this.isStandAlone() && this.width != null) {
        return this.width;
      } else {
        return this.getWidth();
      }
    }

    /**
     * Sets the preferred height and width when in stand-alone mode.
     *
     * This method is called by the <MinimapElement> for this Minimap so that
     * the model is kept in sync with the view.
     *
     * @param {number} height the new height of the Minimap
     * @param {number} width the new width of the Minimap
     */
  }, {
    key: 'setScreenHeightAndWidth',
    value: function setScreenHeightAndWidth(height, width) {
      this.height = height;
      this.width = width;
    }

    /**
     * Returns the vertical scaling factor when converting coordinates from the
     * `TextEditor` to the Minimap.
     *
     * @return {number} the Minimap vertical scaling factor
     */
  }, {
    key: 'getVerticalScaleFactor',
    value: function getVerticalScaleFactor() {
      return this.getLineHeight() / this.textEditor.getLineHeightInPixels();
    }

    /**
     * Returns the horizontal scaling factor when converting coordinates from the
     * `TextEditor` to the Minimap.
     *
     * @return {number} the Minimap horizontal scaling factor
     */
  }, {
    key: 'getHorizontalScaleFactor',
    value: function getHorizontalScaleFactor() {
      return this.getCharWidth() / this.textEditor.getDefaultCharWidth();
    }

    /**
     * Returns the height of a line in the Minimap in pixels.
     *
     * @return {number} a line's height in the Minimap
     */
  }, {
    key: 'getLineHeight',
    value: function getLineHeight() {
      return this.getCharHeight() + this.getInterline();
    }

    /**
     * Returns the width of a character in the Minimap in pixels.
     *
     * @return {number} a character's width in the Minimap
     */
  }, {
    key: 'getCharWidth',
    value: function getCharWidth() {
      if (this.charWidth != null) {
        return this.charWidth;
      } else {
        return this.configCharWidth;
      }
    }

    /**
     * Sets the char width for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} charWidth the new width of a char in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setCharWidth',
    value: function setCharWidth(charWidth) {
      this.charWidth = Math.floor(charWidth);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the height of a character in the Minimap in pixels.
     *
     * @return {number} a character's height in the Minimap
     */
  }, {
    key: 'getCharHeight',
    value: function getCharHeight() {
      if (this.charHeight != null) {
        return this.charHeight;
      } else {
        return this.configCharHeight;
      }
    }

    /**
     * Sets the char height for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} charHeight the new height of a char in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setCharHeight',
    value: function setCharHeight(charHeight) {
      this.charHeight = Math.floor(charHeight);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the height of an interline in the Minimap in pixels.
     *
     * @return {number} the interline's height in the Minimap
     */
  }, {
    key: 'getInterline',
    value: function getInterline() {
      if (this.interline != null) {
        return this.interline;
      } else {
        return this.configInterline;
      }
    }

    /**
     * Sets the interline height for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} interline the new height of an interline in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setInterline',
    value: function setInterline(interline) {
      this.interline = Math.floor(interline);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the status of devicePixelRatioRounding in the Minimap.
     *
     * @return {boolean} the devicePixelRatioRounding status in the Minimap
     */
  }, {
    key: 'getDevicePixelRatioRounding',
    value: function getDevicePixelRatioRounding() {
      if (this.devicePixelRatioRounding != null) {
        return this.devicePixelRatioRounding;
      } else {
        return this.configDevicePixelRatioRounding;
      }
    }

    /**
     * Sets the devicePixelRatioRounding status for this Minimap.
     * This value will override the value from the config for this instance only.
     * A `did-change-config` event is dispatched.
     *
     * @param {boolean} devicePixelRatioRounding the new status of
     *                                           devicePixelRatioRounding
     *                                           in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setDevicePixelRatioRounding',
    value: function setDevicePixelRatioRounding(devicePixelRatioRounding) {
      this.devicePixelRatioRounding = devicePixelRatioRounding;
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the devicePixelRatio in the Minimap in pixels.
     *
     * @return {number} the devicePixelRatio in the Minimap
     */
  }, {
    key: 'getDevicePixelRatio',
    value: function getDevicePixelRatio() {
      return this.getDevicePixelRatioRounding() ? Math.floor(devicePixelRatio) : devicePixelRatio;
    }

    /**
     * Returns the index of the first visible row in the Minimap.
     *
     * @return {number} the index of the first visible row
     */
  }, {
    key: 'getFirstVisibleScreenRow',
    value: function getFirstVisibleScreenRow() {
      return Math.floor(this.getScrollTop() / this.getLineHeight());
    }

    /**
     * Returns the index of the last visible row in the Minimap.
     *
     * @return {number} the index of the last visible row
     */
  }, {
    key: 'getLastVisibleScreenRow',
    value: function getLastVisibleScreenRow() {
      return Math.ceil((this.getScrollTop() + this.getScreenHeight()) / this.getLineHeight());
    }

    /**
     * Returns the current scroll of the Minimap.
     *
     * The Minimap can scroll only when its height is greater that the height
     * of its `TextEditor`.
     *
     * @return {number} the scroll top of the Minimap
     */
  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      if (this.standAlone) {
        return this.scrollTop;
      } else {
        return Math.abs(this.getCapedTextEditorScrollRatio() * this.getMaxScrollTop());
      }
    }

    /**
     * Sets the minimap scroll top value when in stand-alone mode.
     *
     * @param {number} scrollTop the new scroll top for the Minimap
     * @emits {did-change-scroll-top} if the Minimap's stand-alone mode is enabled
     */
  }, {
    key: 'setScrollTop',
    value: function setScrollTop(scrollTop) {
      this.scrollTop = scrollTop;
      if (this.standAlone) {
        this.emitter.emit('did-change-scroll-top', this);
      }
    }

    /**
     * Returns the maximum scroll value of the Minimap.
     *
     * @return {number} the maximum scroll top for the Minimap
     */
  }, {
    key: 'getMaxScrollTop',
    value: function getMaxScrollTop() {
      return Math.max(0, this.getHeight() - this.getScreenHeight());
    }

    /**
     * Returns `true` when the Minimap can scroll.
     *
     * @return {boolean} whether this Minimap can scroll or not
     */
  }, {
    key: 'canScroll',
    value: function canScroll() {
      return this.getMaxScrollTop() > 0;
    }

    /**
     * Delegates to `TextEditor#getMarker`.
     *
     * @access private
     */
  }, {
    key: 'getMarker',
    value: function getMarker(id) {
      return this.textEditor.getMarker(id);
    }

    /**
     * Delegates to `TextEditor#findMarkers`.
     *
     * @access private
     */
  }, {
    key: 'findMarkers',
    value: function findMarkers(o) {
      try {
        return this.textEditor.findMarkers(o);
      } catch (error) {
        return [];
      }
    }

    /**
     * Delegates to `TextEditor#markBufferRange`.
     *
     * @access private
     */
  }, {
    key: 'markBufferRange',
    value: function markBufferRange(range) {
      return this.textEditor.markBufferRange(range);
    }

    /**
     * Emits a change events with the passed-in changes as data.
     *
     * @param  {Object} changes a change to dispatch
     * @access private
     */
  }, {
    key: 'emitChanges',
    value: function emitChanges(changes) {
      this.emitter.emit('did-change', changes);
    }

    /**
     * Enables the cache at the adapter level to avoid consecutive access to the
     * text editor API during a render phase.
     *
     * @access private
     */
  }, {
    key: 'enableCache',
    value: function enableCache() {
      this.adapter.enableCache();
    }

    /**
     * Disable the adapter cache.
     *
     * @access private
     */
  }, {
    key: 'clearCache',
    value: function clearCache() {
      this.adapter.clearCache();
    }
  }]);

  var _Minimap = Minimap;
  Minimap = (0, _decoratorsInclude2['default'])(_mixinsDecorationManagement2['default'])(Minimap) || Minimap;
  return Minimap;
})();

exports['default'] = Minimap;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taW5pbWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTJDLE1BQU07O2lDQUM3QixzQkFBc0I7Ozs7MENBQ1QsZ0NBQWdDOzs7O3FDQUN4QywyQkFBMkI7Ozs7cUNBQzFCLDJCQUEyQjs7OztBQU5yRCxXQUFXLENBQUE7O0FBUVgsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFBOzs7Ozs7Ozs7OztJQVdFLE9BQU87Ozs7Ozs7Ozs7Ozs7O0FBYWQsV0FiTyxPQUFPLEdBYUM7OztRQUFkLE9BQU8seURBQUcsRUFBRTs7OztBQUN2QixRQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtBQUN2QixZQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUE7S0FDN0Q7Ozs7Ozs7O0FBUUQsUUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFBOzs7Ozs7O0FBT3BDLFFBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQTs7Ozs7OztBQU9wQyxRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUE7Ozs7Ozs7QUFPMUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFBOzs7Ozs7O0FBTzVCLFFBQUksQ0FBQyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUE7Ozs7Ozs7QUFPdkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBOzs7Ozs7O0FBTzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7Ozs7Ozs7OztBQVM5QyxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTs7Ozs7Ozs7QUFRbkIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7Ozs7Ozs7O0FBUXRCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUE7Ozs7Ozs7O0FBUTVCLFFB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TzNDLHFCQUFDLENBQUMsRUFBRTtBQUNkLFVBQUk7QUFDRixlQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQ3RDLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxlQUFPLEVBQUUsQ0FBQTtPQUNWO0tBQ0Y7Ozs7Ozs7OztXQU9lLHlCQUFDLEtBQUssRUFBRTtBQUFFLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUE7S0FBRTs7Ozs7Ozs7OztXQVE3RCxxQkFBQyxPQUFPLEVBQUU7QUFBRSxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUE7S0FBRTs7Ozs7Ozs7OztXQVF0RCx1QkFBRztBQUFFLFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7S0FBRTs7Ozs7Ozs7O1dBT2xDLHNCQUFHO0FBQUUsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQTtLQUFFOzs7aUJBL3lCeEIsT0FBTztBQUFQLFNBQU8sR0FEM0IsNEVBQTZCLENBQ1QsT0FBTyxLQUFQLE9BQU87U0FBUCxPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvVXNlcnMvdmljdG9yLm1hcnRpbnMvLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBpbmNsdWRlIGZyb20gJy4vZGVjb3JhdG9ycy9pbmNsdWRlJ1xuaW1wb3J0IERlY29yYXRpb25NYW5hZ2VtZW50IGZyb20gJy4vbWl4aW5zL2RlY29yYXRpb24tbWFuYWdlbWVudCdcbmltcG9ydCBMZWdhY3lBZGF0ZXIgZnJvbSAnLi9hZGFwdGVycy9sZWdhY3ktYWRhcHRlcidcbmltcG9ydCBTdGFibGVBZGFwdGVyIGZyb20gJy4vYWRhcHRlcnMvc3RhYmxlLWFkYXB0ZXInXG5cbmxldCBuZXh0TW9kZWxJZCA9IDFcblxuLyoqXG4gKiBUaGUgTWluaW1hcCBjbGFzcyBpcyB0aGUgdW5kZXJseWluZyBtb2RlbCBvZiBhIDxNaW5pbWFwRWxlbWVudD4uXG4gKiBNb3N0IG1hbmlwdWxhdGlvbnMgb2YgdGhlIG1pbmltYXAgaXMgZG9uZSB0aHJvdWdoIHRoZSBtb2RlbC5cbiAqXG4gKiBBbnkgTWluaW1hcCBpbnN0YW5jZSBpcyB0aWVkIHRvIGEgYFRleHRFZGl0b3JgLlxuICogVGhlaXIgbGlmZWN5Y2xlIGZvbGxvdyB0aGUgb25lIG9mIHRoZWlyIHRhcmdldCBgVGV4dEVkaXRvcmAsIHNvIHRoZXkgYXJlXG4gKiBkZXN0cm95ZWQgd2hlbmV2ZXIgdGhlaXIgYFRleHRFZGl0b3JgIGlzIGRlc3Ryb3llZC5cbiAqL1xuQGluY2x1ZGUoRGVjb3JhdGlvbk1hbmFnZW1lbnQpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaW5pbWFwIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgTWluaW1hcCBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zIGFuIG9iamVjdCB3aXRoIHRoZSBuZXcgTWluaW1hcCBwcm9wZXJ0aWVzXG4gICAqIEBwYXJhbSAge1RleHRFZGl0b3J9IG9wdGlvbnMudGV4dEVkaXRvciB0aGUgdGFyZ2V0IHRleHQgZWRpdG9yIGZvclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIG1pbmltYXBcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gW29wdGlvbnMuc3RhbmRBbG9uZV0gd2hldGhlciB0aGlzIG1pbmltYXAgaXMgaW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmQtYWxvbmUgbW9kZSBvciBub3RcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbb3B0aW9ucy53aWR0aF0gdGhlIG1pbmltYXAgd2lkdGggaW4gcGl4ZWxzXG4gICAqIEBwYXJhbSAge251bWJlcn0gW29wdGlvbnMuaGVpZ2h0XSB0aGUgbWluaW1hcCBoZWlnaHQgaW4gcGl4ZWxzXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBDYW5ub3QgY3JlYXRlIGEgbWluaW1hcCB3aXRob3V0IGFuIGVkaXRvclxuICAgKi9cbiAgY29uc3RydWN0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICghb3B0aW9ucy50ZXh0RWRpdG9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgYSBtaW5pbWFwIHdpdGhvdXQgYW4gZWRpdG9yJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgTWluaW1hcCdzIHRleHQgZWRpdG9yLlxuICAgICAqXG4gICAgICogQHR5cGUge1RleHRFZGl0b3J9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy50ZXh0RWRpdG9yID0gb3B0aW9ucy50ZXh0RWRpdG9yXG4gICAgLyoqXG4gICAgICogVGhlIHN0YW5kLWFsb25lIHN0YXRlIG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnN0YW5kQWxvbmUgPSBvcHRpb25zLnN0YW5kQWxvbmVcbiAgICAvKipcbiAgICAgKiBUaGUgd2lkdGggb2YgdGhlIGN1cnJlbnQgTWluaW1hcC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy53aWR0aCA9IG9wdGlvbnMud2lkdGhcbiAgICAvKipcbiAgICAgKiBUaGUgaGVpZ2h0IG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHRcbiAgICAvKipcbiAgICAgKiBUaGUgaWQgb2YgdGhlIGN1cnJlbnQgTWluaW1hcC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5pZCA9IG5leHRNb2RlbElkKytcbiAgICAvKipcbiAgICAgKiBUaGUgZXZlbnRzIGVtaXR0ZXIgb2YgdGhlIGN1cnJlbnQgTWluaW1hcC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtFbWl0dGVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICAvKipcbiAgICAgKiBUaGUgTWluaW1hcCdzIHN1YnNjcmlwdGlvbnMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Q29tcG9zaXRlRGlzcG9zYWJsZX1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgLyoqXG4gICAgICogVGhlIGFkYXB0ZXIgb2JqZWN0IGxldmVyYWdlIHRoZSBhY2Nlc3MgdG8gc2V2ZXJhbCBwcm9wZXJ0aWVzIGZyb21cbiAgICAgKiB0aGUgYFRleHRFZGl0b3JgL2BUZXh0RWRpdG9yRWxlbWVudGAgdG8gc3VwcG9ydCB0aGUgZGlmZmVyZW50IEFQSXNcbiAgICAgKiBiZXR3ZWVuIGRpZmZlcmVudCB2ZXJzaW9uIG9mIEF0b20uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuYWRhcHRlciA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgY2hhciBoZWlnaHQgb2YgdGhlIGN1cnJlbnQgTWluaW1hcCwgd2lsbCBiZSBgdW5kZWZpbmVkYCB1bmxlc3NcbiAgICAgKiBgc2V0Q2hhcldpZHRoYCBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY2hhckhlaWdodCA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgY2hhciBoZWlnaHQgZnJvbSB0aGUgcGFja2FnZSdzIGNvbmZpZ3VyYXRpb24uIFdpbGwgYmUgb3ZlcnJpZGVuXG4gICAgICogYnkgdGhlIGluc3RhbmNlIHZhbHVlLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbmZpZ0NoYXJIZWlnaHQgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGNoYXIgd2lkdGggb2YgdGhlIGN1cnJlbnQgTWluaW1hcCwgd2lsbCBiZSBgdW5kZWZpbmVkYCB1bmxlc3NcbiAgICAgKiBgc2V0Q2hhcldpZHRoYCBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY2hhcldpZHRoID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBjaGFyIHdpZHRoIGZyb20gdGhlIHBhY2thZ2UncyBjb25maWd1cmF0aW9uLiBXaWxsIGJlIG92ZXJyaWRlblxuICAgICAqIGJ5IHRoZSBpbnN0YW5jZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jb25maWdDaGFyV2lkdGggPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGludGVybGluZSBvZiB0aGUgY3VycmVudCBNaW5pbWFwLCB3aWxsIGJlIGB1bmRlZmluZWRgIHVubGVzc1xuICAgICAqIGBzZXRDaGFyV2lkdGhgIGlzIGNhbGxlZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5pbnRlcmxpbmUgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGludGVybGluZSBmcm9tIHRoZSBwYWNrYWdlJ3MgY29uZmlndXJhdGlvbi4gV2lsbCBiZSBvdmVycmlkZW5cbiAgICAgKiBieSB0aGUgaW5zdGFuY2UgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY29uZmlnSW50ZXJsaW5lID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgb2YgdGhlIGN1cnJlbnQgTWluaW1hcCwgd2lsbCBiZVxuICAgICAqIGB1bmRlZmluZWRgIHVubGVzcyBgc2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nYCBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIGZyb20gdGhlIHBhY2thZ2UncyBjb25maWd1cmF0aW9uLlxuICAgICAqIFdpbGwgYmUgb3ZlcnJpZGVuIGJ5IHRoZSBpbnN0YW5jZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY29uZmlnRGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nID0gbnVsbFxuICAgIC8qKlxuICAgIC8qKlxuICAgICAqIEEgYm9vbGVhbiB2YWx1ZSB0byBzdG9yZSB3aGV0aGVyIHRoaXMgTWluaW1hcCBoYXZlIGJlZW4gZGVzdHJveWVkIG9yIG5vdC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2VcbiAgICAvKipcbiAgICAgKiBBIGJvb2xlYW4gdmFsdWUgdG8gc3RvcmUgd2hldGhlciB0aGUgYHNjcm9sbFBhc3RFbmRgIHNldHRpbmcgaXMgZW5hYmxlZFxuICAgICAqIG9yIG5vdC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc2Nyb2xsUGFzdEVuZCA9IGZhbHNlXG5cbiAgICB0aGlzLmluaXRpYWxpemVEZWNvcmF0aW9ucygpXG5cbiAgICBpZiAoYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMudGV4dEVkaXRvcikuZ2V0U2Nyb2xsVG9wICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYWRhcHRlciA9IG5ldyBTdGFibGVBZGFwdGVyKHRoaXMudGV4dEVkaXRvcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGFwdGVyID0gbmV3IExlZ2FjeUFkYXRlcih0aGlzLnRleHRFZGl0b3IpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgLyoqXG4gICAgICAgKiBXaGVuIGluIHN0YW5kLWFsb25lIG1vZGUsIGEgTWluaW1hcCBkb2Vzbid0IHNjcm9sbCBhbmQgd2lsbCB1c2UgdGhpc1xuICAgICAgICogdmFsdWUgaW5zdGVhZC5cbiAgICAgICAqXG4gICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2Nyb2xsVG9wID0gMFxuICAgIH1cblxuICAgIGxldCBzdWJzID0gdGhpcy5zdWJzY3JpcHRpb25zXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnZWRpdG9yLnNjcm9sbFBhc3RFbmQnLCAoc2Nyb2xsUGFzdEVuZCkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxQYXN0RW5kID0gc2Nyb2xsUGFzdEVuZFxuICAgICAgdGhpcy5hZGFwdGVyLnNjcm9sbFBhc3RFbmQgPSB0aGlzLnNjcm9sbFBhc3RFbmRcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5jaGFySGVpZ2h0JywgKGNvbmZpZ0NoYXJIZWlnaHQpID0+IHtcbiAgICAgIHRoaXMuY29uZmlnQ2hhckhlaWdodCA9IGNvbmZpZ0NoYXJIZWlnaHRcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5jaGFyV2lkdGgnLCAoY29uZmlnQ2hhcldpZHRoKSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ0NoYXJXaWR0aCA9IGNvbmZpZ0NoYXJXaWR0aFxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICB9KSlcbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdtaW5pbWFwLmludGVybGluZScsIChjb25maWdJbnRlcmxpbmUpID0+IHtcbiAgICAgIHRoaXMuY29uZmlnSW50ZXJsaW5lID0gY29uZmlnSW50ZXJsaW5lXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICAgIC8vIGNkcHJyIGlzIHNob3J0aGFuZCBmb3IgY29uZmlnRGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgICdtaW5pbWFwLmRldmljZVBpeGVsUmF0aW9Sb3VuZGluZycsXG4gICAgICAoY2RwcnIpID0+IHtcbiAgICAgICAgdGhpcy5jb25maWdEZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgPSBjZHByclxuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgICAgfVxuICAgICkpXG5cbiAgICBzdWJzLmFkZCh0aGlzLmFkYXB0ZXIub25EaWRDaGFuZ2VTY3JvbGxUb3AoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnN0YW5kQWxvbmUpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcCcsIHRoaXMpXG4gICAgICB9XG4gICAgfSkpXG4gICAgc3Vicy5hZGQodGhpcy5hZGFwdGVyLm9uRGlkQ2hhbmdlU2Nyb2xsTGVmdCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zY3JvbGwtbGVmdCcsIHRoaXMpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICBzdWJzLmFkZCh0aGlzLnRleHRFZGl0b3Iub25EaWRDaGFuZ2UoKGNoYW5nZXMpID0+IHtcbiAgICAgIHRoaXMuZW1pdENoYW5nZXMoY2hhbmdlcylcbiAgICB9KSlcbiAgICBzdWJzLmFkZCh0aGlzLnRleHRFZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHsgdGhpcy5kZXN0cm95KCkgfSkpXG5cbiAgICAvKlxuICAgIEZJWE1FIFNvbWUgY2hhbmdlcyBvY2N1cmluZyBkdXJpbmcgdGhlIHRva2VuaXphdGlvbiBwcm9kdWNlc1xuICAgIHJhbmdlcyB0aGF0IGRlY2VpdmUgdGhlIGNhbnZhcyByZW5kZXJpbmcgYnkgbWFraW5nIHNvbWVcbiAgICBsaW5lcyBhdCB0aGUgZW5kIG9mIHRoZSBidWZmZXIgaW50YWN0IHdoaWxlIHRoZXkgYXJlIGluIGZhY3Qgbm90LFxuICAgIHJlc3VsdGluZyBpbiBleHRyYSBsaW5lcyBhcHBlYXJpbmcgYXQgdGhlIGVuZCBvZiB0aGUgbWluaW1hcC5cbiAgICBGb3JjaW5nIGEgd2hvbGUgcmVwYWludCB0byBmaXggdGhhdCBidWcgaXMgc3Vib3B0aW1hbCBidXQgd29ya3MuXG4gICAgKi9cbiAgICBzdWJzLmFkZCh0aGlzLnRleHRFZGl0b3IuZGlzcGxheUJ1ZmZlci5vbkRpZFRva2VuaXplKCgpID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgfSkpXG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveXMgdGhlIG1vZGVsLlxuICAgKi9cbiAgZGVzdHJveSAoKSB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLnJlbW92ZUFsbERlY29yYXRpb25zKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMudGV4dEVkaXRvciA9IG51bGxcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKVxuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKClcbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoaXMgYE1pbmltYXBgIGhhcyBiZW5uIGRlc3Ryb3llZC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGlzIE1pbmltYXAgaGFzIGJlZW4gZGVzdHJveWVkIG9yIG5vdFxuICAgKi9cbiAgaXNEZXN0cm95ZWQgKCkgeyByZXR1cm4gdGhpcy5kZXN0cm95ZWQgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlYCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aCBhbiBldmVudCBvYmplY3Qgd2l0aFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBzdGFydDogVGhlIGNoYW5nZSdzIHN0YXJ0IHJvdyBudW1iZXJcbiAgICogLSBlbmQ6IFRoZSBjaGFuZ2UncyBlbmQgcm93IG51bWJlclxuICAgKiAtIHNjcmVlbkRlbHRhOiB0aGUgZGVsdGEgaW4gYnVmZmVyIHJvd3MgYmV0d2VlbiB0aGUgdmVyc2lvbnMgYmVmb3JlIGFuZFxuICAgKiAgIGFmdGVyIHRoZSBjaGFuZ2VcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2UgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2UtY29uZmlnYCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZXZlbnRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcyB0cmlnZ2VyZWQuXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlQ29uZmlnIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtY29uZmlnJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1zY3JvbGwtdG9wYCBldmVudC5cbiAgICpcbiAgICogVGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQgd2hlbiB0aGUgdGV4dCBlZGl0b3IgYHNjcm9sbFRvcGAgdmFsdWUgaGF2ZSBiZWVuXG4gICAqIGNoYW5nZWQgb3Igd2hlbiB0aGUgbWluaW1hcCBzY3JvbGwgdG9wIGhhdmUgYmVlbiBjaGFuZ2VkIGluIHN0YW5kLWFsb25lXG4gICAqIG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKG1pbmltYXA6TWluaW1hcCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjdXJyZW50IE1pbmltYXAgaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzZWQgYXMgYXJndW1lbnQgdG9cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlU2Nyb2xsVG9wIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcCcsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2Utc2Nyb2xsLWxlZnRgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihtaW5pbWFwOk1pbmltYXApOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY3VycmVudCBNaW5pbWFwIGlzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VkIGFzIGFyZ3VtZW50IHRvXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZVNjcm9sbExlZnQgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1zY3JvbGwtbGVmdCcsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2Utc3RhbmQtYWxvbmVgIGV2ZW50LlxuICAgKlxuICAgKiBUaGlzIGV2ZW50IGlzIGRpc3BhdGNoZWQgd2hlbiB0aGUgc3RhbmQtYWxvbmUgb2YgdGhlIGN1cnJlbnQgTWluaW1hcFxuICAgKiBpcyBlaXRoZXIgZW5hYmxlZCBvciBkaXNhYmxlZC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24obWluaW1hcDpNaW5pbWFwKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGN1cnJlbnQgTWluaW1hcCBpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NlZCBhcyBhcmd1bWVudCB0b1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VTdGFuZEFsb25lIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2Utc3RhbmQtYWxvbmUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtZGVzdHJveWAgZXZlbnQuXG4gICAqXG4gICAqIFRoaXMgZXZlbnQgaXMgZGlzcGF0Y2hlZCB3aGVuIHRoaXMgTWluaW1hcCBoYXZlIGJlZW4gZGVzdHJveWVkLiBJdCBjYW5cbiAgICogb2NjdXJzIGVpdGhlciBiZWNhdXNlIHRoZSB7QGxpbmsgZGVzdHJveX0gbWV0aG9kIGhhdmUgYmVlbiBjYWxsZWQgb24gdGhlXG4gICAqIE1pbmltYXAgb3IgYmVjYXVzZSB0aGUgdGFyZ2V0IHRleHQgZWRpdG9yIGhhdmUgYmVlbiBkZXN0cm95ZWQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGV2ZW50XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgdHJpZ2dlcmVkLlxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZERlc3Ryb3kgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBjdXJyZW50IE1pbmltYXAgaXMgYSBzdGFuZC1hbG9uZSBtaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIHRoaXMgTWluaW1hcCBpcyBpbiBzdGFuZC1hbG9uZSBtb2RlIG9yIG5vdC5cbiAgICovXG4gIGlzU3RhbmRBbG9uZSAoKSB7IHJldHVybiB0aGlzLnN0YW5kQWxvbmUgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdGFuZC1hbG9uZSBtb2RlIGZvciB0aGlzIG1pbmltYXAuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RhbmRBbG9uZSB0aGUgbmV3IHN0YXRlIG9mIHRoZSBzdGFuZC1hbG9uZSBtb2RlIGZvciB0aGlzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNaW5pbWFwXG4gICAqIEBlbWl0cyB7ZGlkLWNoYW5nZS1zdGFuZC1hbG9uZX0gaWYgdGhlIHN0YW5kLWFsb25lIG1vZGUgaGF2ZSBiZWVuIHRvZ2dsZWRcbiAgICogICAgICAgIG9uIG9yIG9mZiBieSB0aGUgY2FsbFxuICAgKi9cbiAgc2V0U3RhbmRBbG9uZSAoc3RhbmRBbG9uZSkge1xuICAgIGlmIChzdGFuZEFsb25lICE9PSB0aGlzLnN0YW5kQWxvbmUpIHtcbiAgICAgIHRoaXMuc3RhbmRBbG9uZSA9IHN0YW5kQWxvbmVcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXN0YW5kLWFsb25lJywgdGhpcylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHRoYXQgdGhpcyBtaW5pbWFwIHJlcHJlc2VudHMuXG4gICAqXG4gICAqIEByZXR1cm4ge1RleHRFZGl0b3J9IHRoaXMgTWluaW1hcCdzIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yICgpIHsgcmV0dXJuIHRoaXMudGV4dEVkaXRvciB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgYFRleHRFZGl0b3JgIGF0IHRoZSBNaW5pbWFwIHNjYWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY2FsZWQgaGVpZ2h0IG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjYWxlZEhlaWdodCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRIZWlnaHQoKSAqIHRoaXMuZ2V0VmVydGljYWxTY2FsZUZhY3RvcigpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHNjcm9sbCB0b3AgdmFsdWUgYXQgdGhlIE1pbmltYXAgc2NhbGUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjYWxlZCBzY3JvbGwgdG9wIG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjYWxlZFNjcm9sbFRvcCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRTY3JvbGxUb3AoKSAqIHRoaXMuZ2V0VmVydGljYWxTY2FsZUZhY3RvcigpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHNjcm9sbCBsZWZ0IHZhbHVlIGF0IHRoZSBNaW5pbWFwIHNjYWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY2FsZWQgc2Nyb2xsIGxlZnQgb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2NhbGVkU2Nyb2xsTGVmdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRTY3JvbGxMZWZ0KCkgKiB0aGlzLmdldEhvcml6b250YWxTY2FsZUZhY3RvcigpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIG1heGltdW0gc2Nyb2xsIHRvcCB2YWx1ZS5cbiAgICpcbiAgICogV2hlbiB0aGUgYHNjcm9sbFBhc3RFbmRgIHNldHRpbmcgaXMgZW5hYmxlZCwgdGhlIG1ldGhvZCBjb21wZW5zYXRlIHRoZVxuICAgKiBleHRyYSBzY3JvbGwgYnkgcmVtb3ZpbmcgdGhlIHNhbWUgaGVpZ2h0IGFzIGFkZGVkIGJ5IHRoZSBlZGl0b3IgZnJvbSB0aGVcbiAgICogZmluYWwgdmFsdWUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG1heGltdW0gc2Nyb2xsIHRvcCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JNYXhTY3JvbGxUb3AgKCkgeyByZXR1cm4gdGhpcy5hZGFwdGVyLmdldE1heFNjcm9sbFRvcCgpIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHNjcm9sbCB0b3AgdmFsdWUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjcm9sbCB0b3Agb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2Nyb2xsVG9wICgpIHsgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRTY3JvbGxUb3AoKSB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNjcm9sbCB0b3Agb2YgdGhlIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNjcm9sbFRvcCB0aGUgbmV3IHNjcm9sbCB0b3AgdmFsdWVcbiAgICovXG4gIHNldFRleHRFZGl0b3JTY3JvbGxUb3AgKHNjcm9sbFRvcCkgeyB0aGlzLmFkYXB0ZXIuc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcCkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIGxlZnQgdmFsdWUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjcm9sbCBsZWZ0IG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjcm9sbExlZnQgKCkgeyByZXR1cm4gdGhpcy5hZGFwdGVyLmdldFNjcm9sbExlZnQoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBoZWlnaHQgb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9ySGVpZ2h0ICgpIHsgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRIZWlnaHQoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgYXMgYSB2YWx1ZSBub3JtYWxpemVkIGJldHdlZW4gYDBgIGFuZCBgMWAuXG4gICAqXG4gICAqIFdoZW4gdGhlIGBzY3JvbGxQYXN0RW5kYCBzZXR0aW5nIGlzIGVuYWJsZWQgdGhlIHZhbHVlIG1heSBleGNlZWQgYDFgIGFzIHRoZVxuICAgKiBtYXhpbXVtIHNjcm9sbCB2YWx1ZSB1c2VkIHRvIGNvbXB1dGUgdGhpcyByYXRpbyBjb21wZW5zYXRlIGZvciB0aGUgZXh0cmFcbiAgICogaGVpZ2h0IGluIHRoZSBlZGl0b3IuICoqVXNlIHtAbGluayBnZXRDYXBlZFRleHRFZGl0b3JTY3JvbGxSYXRpb30gd2hlblxuICAgKiB5b3UgbmVlZCBhIHZhbHVlIHRoYXQgaXMgc3RyaWN0bHkgYmV0d2VlbiBgMGAgYW5kIGAxYC4qKlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY3JvbGwgcmF0aW8gb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2Nyb2xsUmF0aW8gKCkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsVG9wKCkgLyAodGhpcy5nZXRUZXh0RWRpdG9yTWF4U2Nyb2xsVG9wKCkgfHwgMSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIGFzIGEgdmFsdWUgbm9ybWFsaXplZCBiZXR3ZWVuIGAwYCBhbmQgYDFgLlxuICAgKlxuICAgKiBUaGUgcmV0dXJuZWQgdmFsdWUgd2lsbCBhbHdheXMgYmUgc3RyaWN0bHkgYmV0d2VlbiBgMGAgYW5kIGAxYC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2Nyb2xsIHJhdGlvIG9mIHRoZSB0ZXh0IGVkaXRvciBzdHJpY3RseSBiZXR3ZWVuXG4gICAqICAgICAgICAgICAgICAgICAgMCBhbmQgMVxuICAgKi9cbiAgZ2V0Q2FwZWRUZXh0RWRpdG9yU2Nyb2xsUmF0aW8gKCkge1xuICAgIHJldHVybiBNYXRoLm1pbigxLCB0aGlzLmdldFRleHRFZGl0b3JTY3JvbGxSYXRpbygpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgd2hvbGUgbWluaW1hcCBpbiBwaXhlbHMgYmFzZWQgb24gdGhlIGBtaW5pbWFwYFxuICAgKiBzZXR0aW5ncy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaGVpZ2h0IG9mIHRoZSBtaW5pbWFwXG4gICAqL1xuICBnZXRIZWlnaHQgKCkge1xuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KCkgKiB0aGlzLmdldExpbmVIZWlnaHQoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIG9mIHRoZSB3aG9sZSBtaW5pbWFwIGluIHBpeGVscyBiYXNlZCBvbiB0aGUgYG1pbmltYXBgXG4gICAqIHNldHRpbmdzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB3aWR0aCBvZiB0aGUgbWluaW1hcFxuICAgKi9cbiAgZ2V0V2lkdGggKCkge1xuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3IuZ2V0TWF4U2NyZWVuTGluZUxlbmd0aCgpICogdGhpcy5nZXRDaGFyV2lkdGgoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCB0aGUgTWluaW1hcCBjb250ZW50IHdpbGwgdGFrZSBvbiBzY3JlZW4uXG4gICAqXG4gICAqIFdoZW4gdGhlIE1pbmltYXAgaGVpZ2h0IGlzIGdyZWF0ZXIgdGhhbiB0aGUgYFRleHRFZGl0b3JgIGhlaWdodCwgdGhlXG4gICAqIGBUZXh0RWRpdG9yYCBoZWlnaHQgaXMgcmV0dXJuZWQgaW5zdGVhZC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgdmlzaWJsZSBoZWlnaHQgb2YgdGhlIE1pbmltYXBcbiAgICovXG4gIGdldFZpc2libGVIZWlnaHQgKCkge1xuICAgIHJldHVybiBNYXRoLm1pbih0aGlzLmdldFNjcmVlbkhlaWdodCgpLCB0aGlzLmdldEhlaWdodCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCB0aGUgbWluaW1hcCBzaG91bGQgdGFrZSBvbmNlIGRpc3BsYXllZCwgaXQncyBlaXRoZXJcbiAgICogdGhlIGhlaWdodCBvZiB0aGUgYFRleHRFZGl0b3JgIG9yIHRoZSBwcm92aWRlZCBgaGVpZ2h0YCB3aGVuIGluIHN0YW5kLWFsb25lXG4gICAqIG1vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHRvdGFsIGhlaWdodCBvZiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0U2NyZWVuSGVpZ2h0ICgpIHtcbiAgICBpZiAodGhpcy5pc1N0YW5kQWxvbmUoKSkge1xuICAgICAgaWYgKHRoaXMuaGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRIZWlnaHQoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldEhlaWdodCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIHRoZSB3aG9sZSBNaW5pbWFwIHdpbGwgdGFrZSBvbiBzY3JlZW4uXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHdpZHRoIG9mIHRoZSBNaW5pbWFwIHdoZW4gZGlzcGxheWVkXG4gICAqL1xuICBnZXRWaXNpYmxlV2lkdGggKCkge1xuICAgIHJldHVybiBNYXRoLm1pbih0aGlzLmdldFNjcmVlbldpZHRoKCksIHRoaXMuZ2V0V2lkdGgoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3aWR0aCB0aGUgTWluaW1hcCBzaG91bGQgdGFrZSBvbmNlIGRpc3BsYXllZCwgaXQncyBlaXRoZXIgdGhlXG4gICAqIHdpZHRoIG9mIHRoZSBNaW5pbWFwIGNvbnRlbnQgb3IgdGhlIHByb3ZpZGVkIGB3aWR0aGAgd2hlbiBpbiBzdGFuZEFsb25lXG4gICAqIG1vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIE1pbmltYXAgc2NyZWVuIHdpZHRoXG4gICAqL1xuICBnZXRTY3JlZW5XaWR0aCAoKSB7XG4gICAgaWYgKHRoaXMuaXNTdGFuZEFsb25lKCkgJiYgdGhpcy53aWR0aCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy53aWR0aFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRXaWR0aCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHByZWZlcnJlZCBoZWlnaHQgYW5kIHdpZHRoIHdoZW4gaW4gc3RhbmQtYWxvbmUgbW9kZS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSA8TWluaW1hcEVsZW1lbnQ+IGZvciB0aGlzIE1pbmltYXAgc28gdGhhdFxuICAgKiB0aGUgbW9kZWwgaXMga2VwdCBpbiBzeW5jIHdpdGggdGhlIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgdGhlIG5ldyBoZWlnaHQgb2YgdGhlIE1pbmltYXBcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHRoZSBuZXcgd2lkdGggb2YgdGhlIE1pbmltYXBcbiAgICovXG4gIHNldFNjcmVlbkhlaWdodEFuZFdpZHRoIChoZWlnaHQsIHdpZHRoKSB7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2ZXJ0aWNhbCBzY2FsaW5nIGZhY3RvciB3aGVuIGNvbnZlcnRpbmcgY29vcmRpbmF0ZXMgZnJvbSB0aGVcbiAgICogYFRleHRFZGl0b3JgIHRvIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBNaW5pbWFwIHZlcnRpY2FsIHNjYWxpbmcgZmFjdG9yXG4gICAqL1xuICBnZXRWZXJ0aWNhbFNjYWxlRmFjdG9yICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRMaW5lSGVpZ2h0KCkgLyB0aGlzLnRleHRFZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBob3Jpem9udGFsIHNjYWxpbmcgZmFjdG9yIHdoZW4gY29udmVydGluZyBjb29yZGluYXRlcyBmcm9tIHRoZVxuICAgKiBgVGV4dEVkaXRvcmAgdG8gdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIE1pbmltYXAgaG9yaXpvbnRhbCBzY2FsaW5nIGZhY3RvclxuICAgKi9cbiAgZ2V0SG9yaXpvbnRhbFNjYWxlRmFjdG9yICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDaGFyV2lkdGgoKSAvIHRoaXMudGV4dEVkaXRvci5nZXREZWZhdWx0Q2hhcldpZHRoKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgYSBsaW5lIGluIHRoZSBNaW5pbWFwIGluIHBpeGVscy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSBhIGxpbmUncyBoZWlnaHQgaW4gdGhlIE1pbmltYXBcbiAgICovXG4gIGdldExpbmVIZWlnaHQgKCkgeyByZXR1cm4gdGhpcy5nZXRDaGFySGVpZ2h0KCkgKyB0aGlzLmdldEludGVybGluZSgpIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2lkdGggb2YgYSBjaGFyYWN0ZXIgaW4gdGhlIE1pbmltYXAgaW4gcGl4ZWxzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IGEgY2hhcmFjdGVyJ3Mgd2lkdGggaW4gdGhlIE1pbmltYXBcbiAgICovXG4gIGdldENoYXJXaWR0aCAoKSB7XG4gICAgaWYgKHRoaXMuY2hhcldpZHRoICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJXaWR0aFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25maWdDaGFyV2lkdGhcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY2hhciB3aWR0aCBmb3IgdGhpcyBNaW5pbWFwLiBUaGlzIHZhbHVlIHdpbGwgb3ZlcnJpZGUgdGhlXG4gICAqIHZhbHVlIGZyb20gdGhlIGNvbmZpZyBmb3IgdGhpcyBpbnN0YW5jZSBvbmx5LiBBIGBkaWQtY2hhbmdlLWNvbmZpZ2BcbiAgICogZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNoYXJXaWR0aCB0aGUgbmV3IHdpZHRoIG9mIGEgY2hhciBpbiB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2UtY29uZmlnfSB3aGVuIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkXG4gICAqL1xuICBzZXRDaGFyV2lkdGggKGNoYXJXaWR0aCkge1xuICAgIHRoaXMuY2hhcldpZHRoID0gTWF0aC5mbG9vcihjaGFyV2lkdGgpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgYSBjaGFyYWN0ZXIgaW4gdGhlIE1pbmltYXAgaW4gcGl4ZWxzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IGEgY2hhcmFjdGVyJ3MgaGVpZ2h0IGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRDaGFySGVpZ2h0ICgpIHtcbiAgICBpZiAodGhpcy5jaGFySGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJIZWlnaHRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnQ2hhckhlaWdodFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjaGFyIGhlaWdodCBmb3IgdGhpcyBNaW5pbWFwLiBUaGlzIHZhbHVlIHdpbGwgb3ZlcnJpZGUgdGhlXG4gICAqIHZhbHVlIGZyb20gdGhlIGNvbmZpZyBmb3IgdGhpcyBpbnN0YW5jZSBvbmx5LiBBIGBkaWQtY2hhbmdlLWNvbmZpZ2BcbiAgICogZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNoYXJIZWlnaHQgdGhlIG5ldyBoZWlnaHQgb2YgYSBjaGFyIGluIHRoZSBNaW5pbWFwXG4gICAqIEBlbWl0cyB7ZGlkLWNoYW5nZS1jb25maWd9IHdoZW4gdGhlIHZhbHVlIGlzIGNoYW5nZWRcbiAgICovXG4gIHNldENoYXJIZWlnaHQgKGNoYXJIZWlnaHQpIHtcbiAgICB0aGlzLmNoYXJIZWlnaHQgPSBNYXRoLmZsb29yKGNoYXJIZWlnaHQpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgYW4gaW50ZXJsaW5lIGluIHRoZSBNaW5pbWFwIGluIHBpeGVscy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaW50ZXJsaW5lJ3MgaGVpZ2h0IGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRJbnRlcmxpbmUgKCkge1xuICAgIGlmICh0aGlzLmludGVybGluZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcmxpbmVcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnSW50ZXJsaW5lXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGludGVybGluZSBoZWlnaHQgZm9yIHRoaXMgTWluaW1hcC4gVGhpcyB2YWx1ZSB3aWxsIG92ZXJyaWRlIHRoZVxuICAgKiB2YWx1ZSBmcm9tIHRoZSBjb25maWcgZm9yIHRoaXMgaW5zdGFuY2Ugb25seS4gQSBgZGlkLWNoYW5nZS1jb25maWdgXG4gICAqIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnRlcmxpbmUgdGhlIG5ldyBoZWlnaHQgb2YgYW4gaW50ZXJsaW5lIGluIHRoZSBNaW5pbWFwXG4gICAqIEBlbWl0cyB7ZGlkLWNoYW5nZS1jb25maWd9IHdoZW4gdGhlIHZhbHVlIGlzIGNoYW5nZWRcbiAgICovXG4gIHNldEludGVybGluZSAoaW50ZXJsaW5lKSB7XG4gICAgdGhpcy5pbnRlcmxpbmUgPSBNYXRoLmZsb29yKGludGVybGluZSlcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHN0YXR1cyBvZiBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgaW4gdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHRoZSBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgc3RhdHVzIGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXREZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgKCkge1xuICAgIGlmICh0aGlzLmRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXZpY2VQaXhlbFJhdGlvUm91bmRpbmdcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnRGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyBzdGF0dXMgZm9yIHRoaXMgTWluaW1hcC5cbiAgICogVGhpcyB2YWx1ZSB3aWxsIG92ZXJyaWRlIHRoZSB2YWx1ZSBmcm9tIHRoZSBjb25maWcgZm9yIHRoaXMgaW5zdGFuY2Ugb25seS5cbiAgICogQSBgZGlkLWNoYW5nZS1jb25maWdgIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIHRoZSBuZXcgc3RhdHVzIG9mXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZ1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbiB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2UtY29uZmlnfSB3aGVuIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkXG4gICAqL1xuICBzZXREZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgKGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZykge1xuICAgIHRoaXMuZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nID0gZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZXZpY2VQaXhlbFJhdGlvIGluIHRoZSBNaW5pbWFwIGluIHBpeGVscy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgZGV2aWNlUGl4ZWxSYXRpbyBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0RGV2aWNlUGl4ZWxSYXRpbyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nKClcbiAgICAgID8gTWF0aC5mbG9vcihkZXZpY2VQaXhlbFJhdGlvKVxuICAgICAgOiBkZXZpY2VQaXhlbFJhdGlvXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IHZpc2libGUgcm93IGluIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgdmlzaWJsZSByb3dcbiAgICovXG4gIGdldEZpcnN0VmlzaWJsZVNjcmVlblJvdyAoKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5nZXRTY3JvbGxUb3AoKSAvIHRoaXMuZ2V0TGluZUhlaWdodCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBsYXN0IHZpc2libGUgcm93IGluIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBpbmRleCBvZiB0aGUgbGFzdCB2aXNpYmxlIHJvd1xuICAgKi9cbiAgZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3cgKCkge1xuICAgIHJldHVybiBNYXRoLmNlaWwoXG4gICAgICAodGhpcy5nZXRTY3JvbGxUb3AoKSArIHRoaXMuZ2V0U2NyZWVuSGVpZ2h0KCkpIC8gdGhpcy5nZXRMaW5lSGVpZ2h0KClcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBzY3JvbGwgb2YgdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIFRoZSBNaW5pbWFwIGNhbiBzY3JvbGwgb25seSB3aGVuIGl0cyBoZWlnaHQgaXMgZ3JlYXRlciB0aGF0IHRoZSBoZWlnaHRcbiAgICogb2YgaXRzIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2Nyb2xsIHRvcCBvZiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0U2Nyb2xsVG9wICgpIHtcbiAgICBpZiAodGhpcy5zdGFuZEFsb25lKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY3JvbGxUb3BcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1hdGguYWJzKFxuICAgICAgICB0aGlzLmdldENhcGVkVGV4dEVkaXRvclNjcm9sbFJhdGlvKCkgKiB0aGlzLmdldE1heFNjcm9sbFRvcCgpXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1pbmltYXAgc2Nyb2xsIHRvcCB2YWx1ZSB3aGVuIGluIHN0YW5kLWFsb25lIG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzY3JvbGxUb3AgdGhlIG5ldyBzY3JvbGwgdG9wIGZvciB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcH0gaWYgdGhlIE1pbmltYXAncyBzdGFuZC1hbG9uZSBtb2RlIGlzIGVuYWJsZWRcbiAgICovXG4gIHNldFNjcm9sbFRvcCAoc2Nyb2xsVG9wKSB7XG4gICAgdGhpcy5zY3JvbGxUb3AgPSBzY3JvbGxUb3BcbiAgICBpZiAodGhpcy5zdGFuZEFsb25lKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgdGhpcylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWF4aW11bSBzY3JvbGwgdmFsdWUgb2YgdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG1heGltdW0gc2Nyb2xsIHRvcCBmb3IgdGhlIE1pbmltYXBcbiAgICovXG4gIGdldE1heFNjcm9sbFRvcCAoKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KDAsIHRoaXMuZ2V0SGVpZ2h0KCkgLSB0aGlzLmdldFNjcmVlbkhlaWdodCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIE1pbmltYXAgY2FuIHNjcm9sbC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGlzIE1pbmltYXAgY2FuIHNjcm9sbCBvciBub3RcbiAgICovXG4gIGNhblNjcm9sbCAoKSB7IHJldHVybiB0aGlzLmdldE1heFNjcm9sbFRvcCgpID4gMCB9XG5cbiAgLyoqXG4gICAqIERlbGVnYXRlcyB0byBgVGV4dEVkaXRvciNnZXRNYXJrZXJgLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGdldE1hcmtlciAoaWQpIHsgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5nZXRNYXJrZXIoaWQpIH1cblxuICAvKipcbiAgICogRGVsZWdhdGVzIHRvIGBUZXh0RWRpdG9yI2ZpbmRNYXJrZXJzYC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBmaW5kTWFya2VycyAobykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLmZpbmRNYXJrZXJzKG8pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxlZ2F0ZXMgdG8gYFRleHRFZGl0b3IjbWFya0J1ZmZlclJhbmdlYC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBtYXJrQnVmZmVyUmFuZ2UgKHJhbmdlKSB7IHJldHVybiB0aGlzLnRleHRFZGl0b3IubWFya0J1ZmZlclJhbmdlKHJhbmdlKSB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIGEgY2hhbmdlIGV2ZW50cyB3aXRoIHRoZSBwYXNzZWQtaW4gY2hhbmdlcyBhcyBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGNoYW5nZXMgYSBjaGFuZ2UgdG8gZGlzcGF0Y2hcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBlbWl0Q2hhbmdlcyAoY2hhbmdlcykgeyB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZScsIGNoYW5nZXMpIH1cblxuICAvKipcbiAgICogRW5hYmxlcyB0aGUgY2FjaGUgYXQgdGhlIGFkYXB0ZXIgbGV2ZWwgdG8gYXZvaWQgY29uc2VjdXRpdmUgYWNjZXNzIHRvIHRoZVxuICAgKiB0ZXh0IGVkaXRvciBBUEkgZHVyaW5nIGEgcmVuZGVyIHBoYXNlLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGVuYWJsZUNhY2hlICgpIHsgdGhpcy5hZGFwdGVyLmVuYWJsZUNhY2hlKCkgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIHRoZSBhZGFwdGVyIGNhY2hlLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGNsZWFyQ2FjaGUgKCkgeyB0aGlzLmFkYXB0ZXIuY2xlYXJDYWNoZSgpIH1cblxufVxuIl19
//# sourceURL=/Users/victor.martins/.atom/packages/minimap/lib/minimap.js
