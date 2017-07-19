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

    /**
     * When in stand-alone or independent scrolling mode, this value can be used
     * instead of the computed scroll.
     *
     * @type {number}
     * @access private
     */
    this.scrollTop = 0;

    var subs = this.subscriptions;
    var configSubscription = this.subscribeToConfig();

    subs.add(configSubscription);

    subs.add(this.textEditor.onDidChangeGrammar(function () {
      subs.remove(configSubscription);
      configSubscription.dispose();

      configSubscription = _this.subscribeToConfig();
      subs.add(configSubscription);
    }));

    subs.add(this.adapter.onDidChangeScrollTop(function () {
      if (!_this.standAlone && !_this.ignoreTextEditorScroll) {
        _this.updateScrollTop();
        _this.emitter.emit('did-change-scroll-top', _this);
      }

      if (_this.ignoreTextEditorScroll) {
        _this.ignoreTextEditorScroll = false;
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
     * Registers to the config changes for the current editor scope.
     *
     * @return {Disposable} the disposable to dispose all the registered events
     * @access private
     */
  }, {
    key: 'subscribeToConfig',
    value: function subscribeToConfig() {
      var _this2 = this;

      var subs = new _atom.CompositeDisposable();
      var opts = { scope: this.textEditor.getRootScopeDescriptor() };

      subs.add(atom.config.observe('editor.scrollPastEnd', opts, function (scrollPastEnd) {
        _this2.scrollPastEnd = scrollPastEnd;
        _this2.adapter.scrollPastEnd = _this2.scrollPastEnd;
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.charHeight', opts, function (configCharHeight) {
        _this2.configCharHeight = configCharHeight;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.charWidth', opts, function (configCharWidth) {
        _this2.configCharWidth = configCharWidth;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.interline', opts, function (configInterline) {
        _this2.configInterline = configInterline;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.independentMinimapScroll', opts, function (independentMinimapScroll) {
        _this2.independentMinimapScroll = independentMinimapScroll;
        _this2.updateScrollTop();
      }));
      subs.add(atom.config.observe('minimap.scrollSensitivity', opts, function (scrollSensitivity) {
        _this2.scrollSensitivity = scrollSensitivity;
      }));
      // cdprr is shorthand for configDevicePixelRatioRounding
      subs.add(atom.config.observe('minimap.devicePixelRatioRounding', opts, function (cdprr) {
        _this2.configDevicePixelRatioRounding = cdprr;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));

      return subs;
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
      var ignoreTextEditorScroll = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.ignoreTextEditorScroll = ignoreTextEditorScroll;
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
      this.updateScrollTop();
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
     * Returns true when the `independentMinimapScroll` setting have been enabled.
     *
     * @return {boolean} whether the minimap can scroll independently
     */
  }, {
    key: 'scrollIndependentlyOnMouseWheel',
    value: function scrollIndependentlyOnMouseWheel() {
      return this.independentMinimapScroll;
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
      return this.standAlone || this.independentMinimapScroll ? this.scrollTop : this.getScrollTopFromEditor();
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
      this.scrollTop = Math.max(0, Math.min(this.getMaxScrollTop(), scrollTop));

      if (this.standAlone || this.independentMinimapScroll) {
        this.emitter.emit('did-change-scroll-top', this);
      }
    }

    /**
     * Returns the minimap scroll as a ration between 0 and 1.
     *
     * @return {number} the minimap scroll ratio
     */
  }, {
    key: 'getScrollRatio',
    value: function getScrollRatio() {
      return this.getScrollTop() / this.getMaxScrollTop();
    }

    /**
     * Updates the scroll top value with the one computed from the text editor
     * when the minimap is in the independent scrolling mode.
     *
     * @access private
     */
  }, {
    key: 'updateScrollTop',
    value: function updateScrollTop() {
      if (this.independentMinimapScroll) {
        this.setScrollTop(this.getScrollTopFromEditor());
        this.emitter.emit('did-change-scroll-top', this);
      }
    }

    /**
     * Returns the scroll top as computed from the text editor scroll top.
     *
     * @return {number} the computed scroll top value
     */
  }, {
    key: 'getScrollTopFromEditor',
    value: function getScrollTopFromEditor() {
      return Math.abs(this.getCapedTextEditorScrollRatio() * this.getMaxScrollTop());
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
     * Updates the minimap scroll top value using a mouse event when the
     * independent scrolling mode is enabled
     *
     * @param  {MouseEvent} event the mouse wheel event
     * @access private
     */
  }, {
    key: 'onMouseWheel',
    value: function onMouseWheel(event) {
      if (!this.canScroll()) {
        return;
      }

      var wheelDeltaY = event.wheelDeltaY;

      var previousScrollTop = this.getScrollTop();
      var updatedScrollTop = previousScrollTop - Math.round(wheelDeltaY * this.scrollSensitivity);

      event.preventDefault();
      this.setScrollTop(updatedScrollTop);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taW5pbWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTJDLE1BQU07O2lDQUM3QixzQkFBc0I7Ozs7MENBQ1QsZ0NBQWdDOzs7O3FDQUN4QywyQkFBMkI7Ozs7cUNBQzFCLDJCQUEyQjs7OztBQU5yRCxXQUFXLENBQUE7O0FBUVgsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFBOzs7Ozs7Ozs7OztJQVdFLE9BQU87Ozs7Ozs7Ozs7Ozs7O0FBYWQsV0FiTyxPQUFPLEdBYUM7OztRQUFkLE9BQU8seURBQUcsRUFBRTs7OztBQUN2QixRQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtBQUN2QixZQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUE7S0FDN0Q7Ozs7Ozs7O0FBUUQsUUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFBOzs7Ozs7O0FBT3BDLFFBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQTs7Ozs7OztBQU9wQyxRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUE7Ozs7Ozs7QUFPMUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFBOzs7Ozs7O0FBTzVCLFFBQUksQ0FBQyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUE7Ozs7Ozs7QUFPdkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBOzs7Ozs7O0FBTzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7Ozs7Ozs7OztBQVM5QyxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTs7Ozs7Ozs7QUFRbkIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7Ozs7Ozs7O0FBUXRCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUE7Ozs7Ozs7O0FBUTVCLFFB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QyxDQUFBOztBQUU3RixXQUFLLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDdEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0tBQ3BDOzs7Ozs7Ozs7V0FPUyxtQkFBQyxFQUFFLEVBQUU7QUFBRSxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0tBQUU7Ozs7Ozs7OztXQU8zQyxxQkFBQyxDQUFDLEVBQUU7QUFDZCxVQUFJO0FBQ0YsZUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUN0QyxDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2QsZUFBTyxFQUFFLENBQUE7T0FDVjtLQUNGOzs7Ozs7Ozs7V0FPZSx5QkFBQyxLQUFLLEVBQUU7QUFBRSxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQUU7Ozs7Ozs7Ozs7V0FRN0QscUJBQUMsT0FBTyxFQUFFO0FBQUUsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0tBQUU7Ozs7Ozs7Ozs7V0FRdEQsdUJBQUc7QUFBRSxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFBO0tBQUU7Ozs7Ozs7OztXQU9sQyxzQkFBRztBQUFFLFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUE7S0FBRTs7O2lCQWw1QnhCLE9BQU87QUFBUCxTQUFPLEdBRDNCLDRFQUE2QixDQUNULE9BQU8sS0FBUCxPQUFPO1NBQVAsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL1VzZXJzL3ZpY3Rvci5tYXJ0aW5zLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgaW5jbHVkZSBmcm9tICcuL2RlY29yYXRvcnMvaW5jbHVkZSdcbmltcG9ydCBEZWNvcmF0aW9uTWFuYWdlbWVudCBmcm9tICcuL21peGlucy9kZWNvcmF0aW9uLW1hbmFnZW1lbnQnXG5pbXBvcnQgTGVnYWN5QWRhdGVyIGZyb20gJy4vYWRhcHRlcnMvbGVnYWN5LWFkYXB0ZXInXG5pbXBvcnQgU3RhYmxlQWRhcHRlciBmcm9tICcuL2FkYXB0ZXJzL3N0YWJsZS1hZGFwdGVyJ1xuXG5sZXQgbmV4dE1vZGVsSWQgPSAxXG5cbi8qKlxuICogVGhlIE1pbmltYXAgY2xhc3MgaXMgdGhlIHVuZGVybHlpbmcgbW9kZWwgb2YgYSA8TWluaW1hcEVsZW1lbnQ+LlxuICogTW9zdCBtYW5pcHVsYXRpb25zIG9mIHRoZSBtaW5pbWFwIGlzIGRvbmUgdGhyb3VnaCB0aGUgbW9kZWwuXG4gKlxuICogQW55IE1pbmltYXAgaW5zdGFuY2UgaXMgdGllZCB0byBhIGBUZXh0RWRpdG9yYC5cbiAqIFRoZWlyIGxpZmVjeWNsZSBmb2xsb3cgdGhlIG9uZSBvZiB0aGVpciB0YXJnZXQgYFRleHRFZGl0b3JgLCBzbyB0aGV5IGFyZVxuICogZGVzdHJveWVkIHdoZW5ldmVyIHRoZWlyIGBUZXh0RWRpdG9yYCBpcyBkZXN0cm95ZWQuXG4gKi9cbkBpbmNsdWRlKERlY29yYXRpb25NYW5hZ2VtZW50KVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWluaW1hcCB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IE1pbmltYXAgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyBhbiBvYmplY3Qgd2l0aCB0aGUgbmV3IE1pbmltYXAgcHJvcGVydGllc1xuICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSBvcHRpb25zLnRleHRFZGl0b3IgdGhlIHRhcmdldCB0ZXh0IGVkaXRvciBmb3JcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBtaW5pbWFwXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IFtvcHRpb25zLnN0YW5kQWxvbmVdIHdoZXRoZXIgdGhpcyBtaW5pbWFwIGlzIGluXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kLWFsb25lIG1vZGUgb3Igbm90XG4gICAqIEBwYXJhbSAge251bWJlcn0gW29wdGlvbnMud2lkdGhdIHRoZSBtaW5pbWFwIHdpZHRoIGluIHBpeGVsc1xuICAgKiBAcGFyYW0gIHtudW1iZXJ9IFtvcHRpb25zLmhlaWdodF0gdGhlIG1pbmltYXAgaGVpZ2h0IGluIHBpeGVsc1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gQ2Fubm90IGNyZWF0ZSBhIG1pbmltYXAgd2l0aG91dCBhbiBlZGl0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcbiAgICBpZiAoIW9wdGlvbnMudGV4dEVkaXRvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbWluaW1hcCB3aXRob3V0IGFuIGVkaXRvcicpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIE1pbmltYXAncyB0ZXh0IGVkaXRvci5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtUZXh0RWRpdG9yfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMudGV4dEVkaXRvciA9IG9wdGlvbnMudGV4dEVkaXRvclxuICAgIC8qKlxuICAgICAqIFRoZSBzdGFuZC1hbG9uZSBzdGF0ZSBvZiB0aGUgY3VycmVudCBNaW5pbWFwLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zdGFuZEFsb25lID0gb3B0aW9ucy5zdGFuZEFsb25lXG4gICAgLyoqXG4gICAgICogVGhlIHdpZHRoIG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoXG4gICAgLyoqXG4gICAgICogVGhlIGhlaWdodCBvZiB0aGUgY3VycmVudCBNaW5pbWFwLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0XG4gICAgLyoqXG4gICAgICogVGhlIGlkIG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBuZXh0TW9kZWxJZCsrXG4gICAgLyoqXG4gICAgICogVGhlIGV2ZW50cyBlbWl0dGVyIG9mIHRoZSBjdXJyZW50IE1pbmltYXAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RW1pdHRlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgLyoqXG4gICAgICogVGhlIE1pbmltYXAncyBzdWJzY3JpcHRpb25zLlxuICAgICAqXG4gICAgICogQHR5cGUge0NvbXBvc2l0ZURpc3Bvc2FibGV9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIC8qKlxuICAgICAqIFRoZSBhZGFwdGVyIG9iamVjdCBsZXZlcmFnZSB0aGUgYWNjZXNzIHRvIHNldmVyYWwgcHJvcGVydGllcyBmcm9tXG4gICAgICogdGhlIGBUZXh0RWRpdG9yYC9gVGV4dEVkaXRvckVsZW1lbnRgIHRvIHN1cHBvcnQgdGhlIGRpZmZlcmVudCBBUElzXG4gICAgICogYmV0d2VlbiBkaWZmZXJlbnQgdmVyc2lvbiBvZiBBdG9tLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmFkYXB0ZXIgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGNoYXIgaGVpZ2h0IG9mIHRoZSBjdXJyZW50IE1pbmltYXAsIHdpbGwgYmUgYHVuZGVmaW5lZGAgdW5sZXNzXG4gICAgICogYHNldENoYXJXaWR0aGAgaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNoYXJIZWlnaHQgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGNoYXIgaGVpZ2h0IGZyb20gdGhlIHBhY2thZ2UncyBjb25maWd1cmF0aW9uLiBXaWxsIGJlIG92ZXJyaWRlblxuICAgICAqIGJ5IHRoZSBpbnN0YW5jZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jb25maWdDaGFySGVpZ2h0ID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBjaGFyIHdpZHRoIG9mIHRoZSBjdXJyZW50IE1pbmltYXAsIHdpbGwgYmUgYHVuZGVmaW5lZGAgdW5sZXNzXG4gICAgICogYHNldENoYXJXaWR0aGAgaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNoYXJXaWR0aCA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgY2hhciB3aWR0aCBmcm9tIHRoZSBwYWNrYWdlJ3MgY29uZmlndXJhdGlvbi4gV2lsbCBiZSBvdmVycmlkZW5cbiAgICAgKiBieSB0aGUgaW5zdGFuY2UgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY29uZmlnQ2hhcldpZHRoID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBpbnRlcmxpbmUgb2YgdGhlIGN1cnJlbnQgTWluaW1hcCwgd2lsbCBiZSBgdW5kZWZpbmVkYCB1bmxlc3NcbiAgICAgKiBgc2V0Q2hhcldpZHRoYCBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaW50ZXJsaW5lID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBpbnRlcmxpbmUgZnJvbSB0aGUgcGFja2FnZSdzIGNvbmZpZ3VyYXRpb24uIFdpbGwgYmUgb3ZlcnJpZGVuXG4gICAgICogYnkgdGhlIGluc3RhbmNlIHZhbHVlLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbmZpZ0ludGVybGluZSA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIG9mIHRoZSBjdXJyZW50IE1pbmltYXAsIHdpbGwgYmVcbiAgICAgKiBgdW5kZWZpbmVkYCB1bmxlc3MgYHNldERldmljZVBpeGVsUmF0aW9Sb3VuZGluZ2AgaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyBmcm9tIHRoZSBwYWNrYWdlJ3MgY29uZmlndXJhdGlvbi5cbiAgICAgKiBXaWxsIGJlIG92ZXJyaWRlbiBieSB0aGUgaW5zdGFuY2UgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbmZpZ0RldmljZVBpeGVsUmF0aW9Sb3VuZGluZyA9IG51bGxcbiAgICAvKipcbiAgICAvKipcbiAgICAgKiBBIGJvb2xlYW4gdmFsdWUgdG8gc3RvcmUgd2hldGhlciB0aGlzIE1pbmltYXAgaGF2ZSBiZWVuIGRlc3Ryb3llZCBvciBub3QuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlXG4gICAgLyoqXG4gICAgICogQSBib29sZWFuIHZhbHVlIHRvIHN0b3JlIHdoZXRoZXIgdGhlIGBzY3JvbGxQYXN0RW5kYCBzZXR0aW5nIGlzIGVuYWJsZWRcbiAgICAgKiBvciBub3QuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnNjcm9sbFBhc3RFbmQgPSBmYWxzZVxuXG4gICAgdGhpcy5pbml0aWFsaXplRGVjb3JhdGlvbnMoKVxuXG4gICAgaWYgKGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLnRleHRFZGl0b3IpLmdldFNjcm9sbFRvcCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmFkYXB0ZXIgPSBuZXcgU3RhYmxlQWRhcHRlcih0aGlzLnRleHRFZGl0b3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRhcHRlciA9IG5ldyBMZWdhY3lBZGF0ZXIodGhpcy50ZXh0RWRpdG9yKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZW4gaW4gc3RhbmQtYWxvbmUgb3IgaW5kZXBlbmRlbnQgc2Nyb2xsaW5nIG1vZGUsIHRoaXMgdmFsdWUgY2FuIGJlIHVzZWRcbiAgICAgKiBpbnN0ZWFkIG9mIHRoZSBjb21wdXRlZCBzY3JvbGwuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc2Nyb2xsVG9wID0gMFxuXG4gICAgY29uc3Qgc3VicyA9IHRoaXMuc3Vic2NyaXB0aW9uc1xuICAgIGxldCBjb25maWdTdWJzY3JpcHRpb24gPSB0aGlzLnN1YnNjcmliZVRvQ29uZmlnKClcblxuICAgIHN1YnMuYWRkKGNvbmZpZ1N1YnNjcmlwdGlvbilcblxuICAgIHN1YnMuYWRkKHRoaXMudGV4dEVkaXRvci5vbkRpZENoYW5nZUdyYW1tYXIoKCkgPT4ge1xuICAgICAgc3Vicy5yZW1vdmUoY29uZmlnU3Vic2NyaXB0aW9uKVxuICAgICAgY29uZmlnU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuXG4gICAgICBjb25maWdTdWJzY3JpcHRpb24gPSB0aGlzLnN1YnNjcmliZVRvQ29uZmlnKClcbiAgICAgIHN1YnMuYWRkKGNvbmZpZ1N1YnNjcmlwdGlvbilcbiAgICB9KSlcblxuICAgIHN1YnMuYWRkKHRoaXMuYWRhcHRlci5vbkRpZENoYW5nZVNjcm9sbFRvcCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc3RhbmRBbG9uZSAmJiAhdGhpcy5pZ25vcmVUZXh0RWRpdG9yU2Nyb2xsKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsVG9wKClcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcCcsIHRoaXMpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmlnbm9yZVRleHRFZGl0b3JTY3JvbGwpIHtcbiAgICAgICAgdGhpcy5pZ25vcmVUZXh0RWRpdG9yU2Nyb2xsID0gZmFsc2VcbiAgICAgIH1cbiAgICB9KSlcbiAgICBzdWJzLmFkZCh0aGlzLmFkYXB0ZXIub25EaWRDaGFuZ2VTY3JvbGxMZWZ0KCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zdGFuZEFsb25lKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXNjcm9sbC1sZWZ0JywgdGhpcylcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIHN1YnMuYWRkKHRoaXMudGV4dEVkaXRvci5vbkRpZENoYW5nZSgoY2hhbmdlcykgPT4ge1xuICAgICAgdGhpcy5lbWl0Q2hhbmdlcyhjaGFuZ2VzKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKHRoaXMudGV4dEVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4geyB0aGlzLmRlc3Ryb3koKSB9KSlcblxuICAgIC8qXG4gICAgRklYTUUgU29tZSBjaGFuZ2VzIG9jY3VyaW5nIGR1cmluZyB0aGUgdG9rZW5pemF0aW9uIHByb2R1Y2VzXG4gICAgcmFuZ2VzIHRoYXQgZGVjZWl2ZSB0aGUgY2FudmFzIHJlbmRlcmluZyBieSBtYWtpbmcgc29tZVxuICAgIGxpbmVzIGF0IHRoZSBlbmQgb2YgdGhlIGJ1ZmZlciBpbnRhY3Qgd2hpbGUgdGhleSBhcmUgaW4gZmFjdCBub3QsXG4gICAgcmVzdWx0aW5nIGluIGV4dHJhIGxpbmVzIGFwcGVhcmluZyBhdCB0aGUgZW5kIG9mIHRoZSBtaW5pbWFwLlxuICAgIEZvcmNpbmcgYSB3aG9sZSByZXBhaW50IHRvIGZpeCB0aGF0IGJ1ZyBpcyBzdWJvcHRpbWFsIGJ1dCB3b3Jrcy5cbiAgICAqL1xuICAgIHN1YnMuYWRkKHRoaXMudGV4dEVkaXRvci5kaXNwbGF5QnVmZmVyLm9uRGlkVG9rZW5pemUoKCkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICB9KSlcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyB0aGUgbW9kZWwuXG4gICAqL1xuICBkZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMucmVtb3ZlQWxsRGVjb3JhdGlvbnMoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgdGhpcy50ZXh0RWRpdG9yID0gbnVsbFxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpXG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKVxuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhpcyBgTWluaW1hcGAgaGFzIGJlbm4gZGVzdHJveWVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIHRoaXMgTWluaW1hcCBoYXMgYmVlbiBkZXN0cm95ZWQgb3Igbm90XG4gICAqL1xuICBpc0Rlc3Ryb3llZCAoKSB7IHJldHVybiB0aGlzLmRlc3Ryb3llZCB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2VgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihldmVudDpPYmplY3QpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIGFuIGV2ZW50IG9iamVjdCB3aXRoXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIHN0YXJ0OiBUaGUgY2hhbmdlJ3Mgc3RhcnQgcm93IG51bWJlclxuICAgKiAtIGVuZDogVGhlIGNoYW5nZSdzIGVuZCByb3cgbnVtYmVyXG4gICAqIC0gc2NyZWVuRGVsdGE6IHRoZSBkZWx0YSBpbiBidWZmZXIgcm93cyBiZXR3ZWVuIHRoZSB2ZXJzaW9ucyBiZWZvcmUgYW5kXG4gICAqICAgYWZ0ZXIgdGhlIGNoYW5nZVxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1jb25maWdgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbigpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBldmVudFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzIHRyaWdnZXJlZC5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VDb25maWcgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1jb25maWcnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlLXNjcm9sbC10b3BgIGV2ZW50LlxuICAgKlxuICAgKiBUaGUgZXZlbnQgaXMgZGlzcGF0Y2hlZCB3aGVuIHRoZSB0ZXh0IGVkaXRvciBgc2Nyb2xsVG9wYCB2YWx1ZSBoYXZlIGJlZW5cbiAgICogY2hhbmdlZCBvciB3aGVuIHRoZSBtaW5pbWFwIHNjcm9sbCB0b3AgaGF2ZSBiZWVuIGNoYW5nZWQgaW4gc3RhbmQtYWxvbmVcbiAgICogbW9kZS5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24obWluaW1hcDpNaW5pbWFwKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGN1cnJlbnQgTWluaW1hcCBpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NlZCBhcyBhcmd1bWVudCB0b1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VTY3JvbGxUb3AgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1zY3JvbGwtbGVmdGAgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKG1pbmltYXA6TWluaW1hcCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjdXJyZW50IE1pbmltYXAgaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzZWQgYXMgYXJndW1lbnQgdG9cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlU2Nyb2xsTGVmdCAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXNjcm9sbC1sZWZ0JywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZS1zdGFuZC1hbG9uZWAgZXZlbnQuXG4gICAqXG4gICAqIFRoaXMgZXZlbnQgaXMgZGlzcGF0Y2hlZCB3aGVuIHRoZSBzdGFuZC1hbG9uZSBvZiB0aGUgY3VycmVudCBNaW5pbWFwXG4gICAqIGlzIGVpdGhlciBlbmFibGVkIG9yIGRpc2FibGVkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihtaW5pbWFwOk1pbmltYXApOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY3VycmVudCBNaW5pbWFwIGlzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VkIGFzIGFyZ3VtZW50IHRvXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZVN0YW5kQWxvbmUgKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1zdGFuZC1hbG9uZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1kZXN0cm95YCBldmVudC5cbiAgICpcbiAgICogVGhpcyBldmVudCBpcyBkaXNwYXRjaGVkIHdoZW4gdGhpcyBNaW5pbWFwIGhhdmUgYmVlbiBkZXN0cm95ZWQuIEl0IGNhblxuICAgKiBvY2N1cnMgZWl0aGVyIGJlY2F1c2UgdGhlIHtAbGluayBkZXN0cm95fSBtZXRob2QgaGF2ZSBiZWVuIGNhbGxlZCBvbiB0aGVcbiAgICogTWluaW1hcCBvciBiZWNhdXNlIHRoZSB0YXJnZXQgdGV4dCBlZGl0b3IgaGF2ZSBiZWVuIGRlc3Ryb3llZC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgZXZlbnRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcyB0cmlnZ2VyZWQuXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkRGVzdHJveSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyB0byB0aGUgY29uZmlnIGNoYW5nZXMgZm9yIHRoZSBjdXJyZW50IGVkaXRvciBzY29wZS5cbiAgICpcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gdGhlIGRpc3Bvc2FibGUgdG8gZGlzcG9zZSBhbGwgdGhlIHJlZ2lzdGVyZWQgZXZlbnRzXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgc3Vic2NyaWJlVG9Db25maWcgKCkge1xuICAgIGNvbnN0IHN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgY29uc3Qgb3B0cyA9IHtzY29wZTogdGhpcy50ZXh0RWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKX1cblxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2VkaXRvci5zY3JvbGxQYXN0RW5kJywgb3B0cywgKHNjcm9sbFBhc3RFbmQpID0+IHtcbiAgICAgIHRoaXMuc2Nyb2xsUGFzdEVuZCA9IHNjcm9sbFBhc3RFbmRcbiAgICAgIHRoaXMuYWRhcHRlci5zY3JvbGxQYXN0RW5kID0gdGhpcy5zY3JvbGxQYXN0RW5kXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ21pbmltYXAuY2hhckhlaWdodCcsIG9wdHMsIChjb25maWdDaGFySGVpZ2h0KSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ0NoYXJIZWlnaHQgPSBjb25maWdDaGFySGVpZ2h0XG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ21pbmltYXAuY2hhcldpZHRoJywgb3B0cywgKGNvbmZpZ0NoYXJXaWR0aCkgPT4ge1xuICAgICAgdGhpcy5jb25maWdDaGFyV2lkdGggPSBjb25maWdDaGFyV2lkdGhcbiAgICAgIHRoaXMudXBkYXRlU2Nyb2xsVG9wKClcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5pbnRlcmxpbmUnLCBvcHRzLCAoY29uZmlnSW50ZXJsaW5lKSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ0ludGVybGluZSA9IGNvbmZpZ0ludGVybGluZVxuICAgICAgdGhpcy51cGRhdGVTY3JvbGxUb3AoKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICB9KSlcbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdtaW5pbWFwLmluZGVwZW5kZW50TWluaW1hcFNjcm9sbCcsIG9wdHMsIChpbmRlcGVuZGVudE1pbmltYXBTY3JvbGwpID0+IHtcbiAgICAgIHRoaXMuaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsID0gaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsXG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5zY3JvbGxTZW5zaXRpdml0eScsIG9wdHMsIChzY3JvbGxTZW5zaXRpdml0eSkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxTZW5zaXRpdml0eSA9IHNjcm9sbFNlbnNpdGl2aXR5XG4gICAgfSkpXG4gICAgLy8gY2RwcnIgaXMgc2hvcnRoYW5kIGZvciBjb25maWdEZXZpY2VQaXhlbFJhdGlvUm91bmRpbmdcbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgJ21pbmltYXAuZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nJyxcbiAgICAgIG9wdHMsXG4gICAgICAoY2RwcnIpID0+IHtcbiAgICAgICAgdGhpcy5jb25maWdEZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgPSBjZHByclxuICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgICB9XG4gICAgKSlcblxuICAgIHJldHVybiBzdWJzXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgY3VycmVudCBNaW5pbWFwIGlzIGEgc3RhbmQtYWxvbmUgbWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGlzIE1pbmltYXAgaXMgaW4gc3RhbmQtYWxvbmUgbW9kZSBvciBub3QuXG4gICAqL1xuICBpc1N0YW5kQWxvbmUgKCkgeyByZXR1cm4gdGhpcy5zdGFuZEFsb25lIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3RhbmQtYWxvbmUgbW9kZSBmb3IgdGhpcyBtaW5pbWFwLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHN0YW5kQWxvbmUgdGhlIG5ldyBzdGF0ZSBvZiB0aGUgc3RhbmQtYWxvbmUgbW9kZSBmb3IgdGhpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2Utc3RhbmQtYWxvbmV9IGlmIHRoZSBzdGFuZC1hbG9uZSBtb2RlIGhhdmUgYmVlbiB0b2dnbGVkXG4gICAqICAgICAgICBvbiBvciBvZmYgYnkgdGhlIGNhbGxcbiAgICovXG4gIHNldFN0YW5kQWxvbmUgKHN0YW5kQWxvbmUpIHtcbiAgICBpZiAoc3RhbmRBbG9uZSAhPT0gdGhpcy5zdGFuZEFsb25lKSB7XG4gICAgICB0aGlzLnN0YW5kQWxvbmUgPSBzdGFuZEFsb25lXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zdGFuZC1hbG9uZScsIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCB0aGF0IHRoaXMgbWluaW1hcCByZXByZXNlbnRzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtUZXh0RWRpdG9yfSB0aGlzIE1pbmltYXAncyB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvciAoKSB7IHJldHVybiB0aGlzLnRleHRFZGl0b3IgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIGBUZXh0RWRpdG9yYCBhdCB0aGUgTWluaW1hcCBzY2FsZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2NhbGVkIGhlaWdodCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQgKCkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0SGVpZ2h0KCkgKiB0aGlzLmdldFZlcnRpY2FsU2NhbGVGYWN0b3IoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgdG9wIHZhbHVlIGF0IHRoZSBNaW5pbWFwIHNjYWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY2FsZWQgc2Nyb2xsIHRvcCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY2FsZWRTY3JvbGxUb3AgKCkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsVG9wKCkgKiB0aGlzLmdldFZlcnRpY2FsU2NhbGVGYWN0b3IoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgbGVmdCB2YWx1ZSBhdCB0aGUgTWluaW1hcCBzY2FsZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2NhbGVkIHNjcm9sbCBsZWZ0IG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjYWxlZFNjcm9sbExlZnQgKCkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsTGVmdCgpICogdGhpcy5nZXRIb3Jpem9udGFsU2NhbGVGYWN0b3IoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBtYXhpbXVtIHNjcm9sbCB0b3AgdmFsdWUuXG4gICAqXG4gICAqIFdoZW4gdGhlIGBzY3JvbGxQYXN0RW5kYCBzZXR0aW5nIGlzIGVuYWJsZWQsIHRoZSBtZXRob2QgY29tcGVuc2F0ZSB0aGVcbiAgICogZXh0cmEgc2Nyb2xsIGJ5IHJlbW92aW5nIHRoZSBzYW1lIGhlaWdodCBhcyBhZGRlZCBieSB0aGUgZWRpdG9yIGZyb20gdGhlXG4gICAqIGZpbmFsIHZhbHVlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBtYXhpbXVtIHNjcm9sbCB0b3Agb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yTWF4U2Nyb2xsVG9wICgpIHsgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRNYXhTY3JvbGxUb3AoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgdG9wIHZhbHVlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY3JvbGwgdG9wIG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjcm9sbFRvcCAoKSB7IHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsVG9wKCkgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzY3JvbGwgdG9wIG9mIHRoZSBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzY3JvbGxUb3AgdGhlIG5ldyBzY3JvbGwgdG9wIHZhbHVlXG4gICAqL1xuICBzZXRUZXh0RWRpdG9yU2Nyb2xsVG9wIChzY3JvbGxUb3AsIGlnbm9yZVRleHRFZGl0b3JTY3JvbGwgPSBmYWxzZSkge1xuICAgIHRoaXMuaWdub3JlVGV4dEVkaXRvclNjcm9sbCA9IGlnbm9yZVRleHRFZGl0b3JTY3JvbGxcbiAgICB0aGlzLmFkYXB0ZXIuc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIGxlZnQgdmFsdWUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjcm9sbCBsZWZ0IG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjcm9sbExlZnQgKCkgeyByZXR1cm4gdGhpcy5hZGFwdGVyLmdldFNjcm9sbExlZnQoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBoZWlnaHQgb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9ySGVpZ2h0ICgpIHsgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRIZWlnaHQoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgYXMgYSB2YWx1ZSBub3JtYWxpemVkIGJldHdlZW4gYDBgIGFuZCBgMWAuXG4gICAqXG4gICAqIFdoZW4gdGhlIGBzY3JvbGxQYXN0RW5kYCBzZXR0aW5nIGlzIGVuYWJsZWQgdGhlIHZhbHVlIG1heSBleGNlZWQgYDFgIGFzIHRoZVxuICAgKiBtYXhpbXVtIHNjcm9sbCB2YWx1ZSB1c2VkIHRvIGNvbXB1dGUgdGhpcyByYXRpbyBjb21wZW5zYXRlIGZvciB0aGUgZXh0cmFcbiAgICogaGVpZ2h0IGluIHRoZSBlZGl0b3IuICoqVXNlIHtAbGluayBnZXRDYXBlZFRleHRFZGl0b3JTY3JvbGxSYXRpb30gd2hlblxuICAgKiB5b3UgbmVlZCBhIHZhbHVlIHRoYXQgaXMgc3RyaWN0bHkgYmV0d2VlbiBgMGAgYW5kIGAxYC4qKlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY3JvbGwgcmF0aW8gb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2Nyb2xsUmF0aW8gKCkge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsVG9wKCkgLyAodGhpcy5nZXRUZXh0RWRpdG9yTWF4U2Nyb2xsVG9wKCkgfHwgMSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvcmAgc2Nyb2xsIGFzIGEgdmFsdWUgbm9ybWFsaXplZCBiZXR3ZWVuIGAwYCBhbmQgYDFgLlxuICAgKlxuICAgKiBUaGUgcmV0dXJuZWQgdmFsdWUgd2lsbCBhbHdheXMgYmUgc3RyaWN0bHkgYmV0d2VlbiBgMGAgYW5kIGAxYC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2Nyb2xsIHJhdGlvIG9mIHRoZSB0ZXh0IGVkaXRvciBzdHJpY3RseSBiZXR3ZWVuXG4gICAqICAgICAgICAgICAgICAgICAgMCBhbmQgMVxuICAgKi9cbiAgZ2V0Q2FwZWRUZXh0RWRpdG9yU2Nyb2xsUmF0aW8gKCkge1xuICAgIHJldHVybiBNYXRoLm1pbigxLCB0aGlzLmdldFRleHRFZGl0b3JTY3JvbGxSYXRpbygpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgd2hvbGUgbWluaW1hcCBpbiBwaXhlbHMgYmFzZWQgb24gdGhlIGBtaW5pbWFwYFxuICAgKiBzZXR0aW5ncy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaGVpZ2h0IG9mIHRoZSBtaW5pbWFwXG4gICAqL1xuICBnZXRIZWlnaHQgKCkge1xuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3IuZ2V0U2NyZWVuTGluZUNvdW50KCkgKiB0aGlzLmdldExpbmVIZWlnaHQoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIG9mIHRoZSB3aG9sZSBtaW5pbWFwIGluIHBpeGVscyBiYXNlZCBvbiB0aGUgYG1pbmltYXBgXG4gICAqIHNldHRpbmdzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB3aWR0aCBvZiB0aGUgbWluaW1hcFxuICAgKi9cbiAgZ2V0V2lkdGggKCkge1xuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3IuZ2V0TWF4U2NyZWVuTGluZUxlbmd0aCgpICogdGhpcy5nZXRDaGFyV2lkdGgoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCB0aGUgTWluaW1hcCBjb250ZW50IHdpbGwgdGFrZSBvbiBzY3JlZW4uXG4gICAqXG4gICAqIFdoZW4gdGhlIE1pbmltYXAgaGVpZ2h0IGlzIGdyZWF0ZXIgdGhhbiB0aGUgYFRleHRFZGl0b3JgIGhlaWdodCwgdGhlXG4gICAqIGBUZXh0RWRpdG9yYCBoZWlnaHQgaXMgcmV0dXJuZWQgaW5zdGVhZC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgdmlzaWJsZSBoZWlnaHQgb2YgdGhlIE1pbmltYXBcbiAgICovXG4gIGdldFZpc2libGVIZWlnaHQgKCkge1xuICAgIHJldHVybiBNYXRoLm1pbih0aGlzLmdldFNjcmVlbkhlaWdodCgpLCB0aGlzLmdldEhlaWdodCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCB0aGUgbWluaW1hcCBzaG91bGQgdGFrZSBvbmNlIGRpc3BsYXllZCwgaXQncyBlaXRoZXJcbiAgICogdGhlIGhlaWdodCBvZiB0aGUgYFRleHRFZGl0b3JgIG9yIHRoZSBwcm92aWRlZCBgaGVpZ2h0YCB3aGVuIGluIHN0YW5kLWFsb25lXG4gICAqIG1vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHRvdGFsIGhlaWdodCBvZiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0U2NyZWVuSGVpZ2h0ICgpIHtcbiAgICBpZiAodGhpcy5pc1N0YW5kQWxvbmUoKSkge1xuICAgICAgaWYgKHRoaXMuaGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRIZWlnaHQoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmdldEhlaWdodCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIHRoZSB3aG9sZSBNaW5pbWFwIHdpbGwgdGFrZSBvbiBzY3JlZW4uXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHdpZHRoIG9mIHRoZSBNaW5pbWFwIHdoZW4gZGlzcGxheWVkXG4gICAqL1xuICBnZXRWaXNpYmxlV2lkdGggKCkge1xuICAgIHJldHVybiBNYXRoLm1pbih0aGlzLmdldFNjcmVlbldpZHRoKCksIHRoaXMuZ2V0V2lkdGgoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3aWR0aCB0aGUgTWluaW1hcCBzaG91bGQgdGFrZSBvbmNlIGRpc3BsYXllZCwgaXQncyBlaXRoZXIgdGhlXG4gICAqIHdpZHRoIG9mIHRoZSBNaW5pbWFwIGNvbnRlbnQgb3IgdGhlIHByb3ZpZGVkIGB3aWR0aGAgd2hlbiBpbiBzdGFuZEFsb25lXG4gICAqIG1vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIE1pbmltYXAgc2NyZWVuIHdpZHRoXG4gICAqL1xuICBnZXRTY3JlZW5XaWR0aCAoKSB7XG4gICAgaWYgKHRoaXMuaXNTdGFuZEFsb25lKCkgJiYgdGhpcy53aWR0aCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy53aWR0aFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRXaWR0aCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHByZWZlcnJlZCBoZWlnaHQgYW5kIHdpZHRoIHdoZW4gaW4gc3RhbmQtYWxvbmUgbW9kZS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSA8TWluaW1hcEVsZW1lbnQ+IGZvciB0aGlzIE1pbmltYXAgc28gdGhhdFxuICAgKiB0aGUgbW9kZWwgaXMga2VwdCBpbiBzeW5jIHdpdGggdGhlIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgdGhlIG5ldyBoZWlnaHQgb2YgdGhlIE1pbmltYXBcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHRoZSBuZXcgd2lkdGggb2YgdGhlIE1pbmltYXBcbiAgICovXG4gIHNldFNjcmVlbkhlaWdodEFuZFdpZHRoIChoZWlnaHQsIHdpZHRoKSB7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmVydGljYWwgc2NhbGluZyBmYWN0b3Igd2hlbiBjb252ZXJ0aW5nIGNvb3JkaW5hdGVzIGZyb20gdGhlXG4gICAqIGBUZXh0RWRpdG9yYCB0byB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgTWluaW1hcCB2ZXJ0aWNhbCBzY2FsaW5nIGZhY3RvclxuICAgKi9cbiAgZ2V0VmVydGljYWxTY2FsZUZhY3RvciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGluZUhlaWdodCgpIC8gdGhpcy50ZXh0RWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaG9yaXpvbnRhbCBzY2FsaW5nIGZhY3RvciB3aGVuIGNvbnZlcnRpbmcgY29vcmRpbmF0ZXMgZnJvbSB0aGVcbiAgICogYFRleHRFZGl0b3JgIHRvIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBNaW5pbWFwIGhvcml6b250YWwgc2NhbGluZyBmYWN0b3JcbiAgICovXG4gIGdldEhvcml6b250YWxTY2FsZUZhY3RvciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2hhcldpZHRoKCkgLyB0aGlzLnRleHRFZGl0b3IuZ2V0RGVmYXVsdENoYXJXaWR0aCgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIGEgbGluZSBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gYSBsaW5lJ3MgaGVpZ2h0IGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRMaW5lSGVpZ2h0ICgpIHsgcmV0dXJuIHRoaXMuZ2V0Q2hhckhlaWdodCgpICsgdGhpcy5nZXRJbnRlcmxpbmUoKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIG9mIGEgY2hhcmFjdGVyIGluIHRoZSBNaW5pbWFwIGluIHBpeGVscy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSBhIGNoYXJhY3RlcidzIHdpZHRoIGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRDaGFyV2lkdGggKCkge1xuICAgIGlmICh0aGlzLmNoYXJXaWR0aCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFyV2lkdGhcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnQ2hhcldpZHRoXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNoYXIgd2lkdGggZm9yIHRoaXMgTWluaW1hcC4gVGhpcyB2YWx1ZSB3aWxsIG92ZXJyaWRlIHRoZVxuICAgKiB2YWx1ZSBmcm9tIHRoZSBjb25maWcgZm9yIHRoaXMgaW5zdGFuY2Ugb25seS4gQSBgZGlkLWNoYW5nZS1jb25maWdgXG4gICAqIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjaGFyV2lkdGggdGhlIG5ldyB3aWR0aCBvZiBhIGNoYXIgaW4gdGhlIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLWNvbmZpZ30gd2hlbiB0aGUgdmFsdWUgaXMgY2hhbmdlZFxuICAgKi9cbiAgc2V0Q2hhcldpZHRoIChjaGFyV2lkdGgpIHtcbiAgICB0aGlzLmNoYXJXaWR0aCA9IE1hdGguZmxvb3IoY2hhcldpZHRoKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIGEgY2hhcmFjdGVyIGluIHRoZSBNaW5pbWFwIGluIHBpeGVscy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSBhIGNoYXJhY3RlcidzIGhlaWdodCBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0Q2hhckhlaWdodCAoKSB7XG4gICAgaWYgKHRoaXMuY2hhckhlaWdodCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFySGVpZ2h0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0NoYXJIZWlnaHRcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY2hhciBoZWlnaHQgZm9yIHRoaXMgTWluaW1hcC4gVGhpcyB2YWx1ZSB3aWxsIG92ZXJyaWRlIHRoZVxuICAgKiB2YWx1ZSBmcm9tIHRoZSBjb25maWcgZm9yIHRoaXMgaW5zdGFuY2Ugb25seS4gQSBgZGlkLWNoYW5nZS1jb25maWdgXG4gICAqIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjaGFySGVpZ2h0IHRoZSBuZXcgaGVpZ2h0IG9mIGEgY2hhciBpbiB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2UtY29uZmlnfSB3aGVuIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkXG4gICAqL1xuICBzZXRDaGFySGVpZ2h0IChjaGFySGVpZ2h0KSB7XG4gICAgdGhpcy5jaGFySGVpZ2h0ID0gTWF0aC5mbG9vcihjaGFySGVpZ2h0KVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIGFuIGludGVybGluZSBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGludGVybGluZSdzIGhlaWdodCBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0SW50ZXJsaW5lICgpIHtcbiAgICBpZiAodGhpcy5pbnRlcmxpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJsaW5lXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0ludGVybGluZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBpbnRlcmxpbmUgaGVpZ2h0IGZvciB0aGlzIE1pbmltYXAuIFRoaXMgdmFsdWUgd2lsbCBvdmVycmlkZSB0aGVcbiAgICogdmFsdWUgZnJvbSB0aGUgY29uZmlnIGZvciB0aGlzIGluc3RhbmNlIG9ubHkuIEEgYGRpZC1jaGFuZ2UtY29uZmlnYFxuICAgKiBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gaW50ZXJsaW5lIHRoZSBuZXcgaGVpZ2h0IG9mIGFuIGludGVybGluZSBpbiB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2UtY29uZmlnfSB3aGVuIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkXG4gICAqL1xuICBzZXRJbnRlcmxpbmUgKGludGVybGluZSkge1xuICAgIHRoaXMuaW50ZXJsaW5lID0gTWF0aC5mbG9vcihpbnRlcmxpbmUpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdGF0dXMgb2YgZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIGluIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0aGUgZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIHN0YXR1cyBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nICgpIHtcbiAgICBpZiAodGhpcy5kZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0RldmljZVBpeGVsUmF0aW9Sb3VuZGluZ1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgc3RhdHVzIGZvciB0aGlzIE1pbmltYXAuXG4gICAqIFRoaXMgdmFsdWUgd2lsbCBvdmVycmlkZSB0aGUgdmFsdWUgZnJvbSB0aGUgY29uZmlnIGZvciB0aGlzIGluc3RhbmNlIG9ubHkuXG4gICAqIEEgYGRpZC1jaGFuZ2UtY29uZmlnYCBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyB0aGUgbmV3IHN0YXR1cyBvZlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmdcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW4gdGhlIE1pbmltYXBcbiAgICogQGVtaXRzIHtkaWQtY2hhbmdlLWNvbmZpZ30gd2hlbiB0aGUgdmFsdWUgaXMgY2hhbmdlZFxuICAgKi9cbiAgc2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIChkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcpIHtcbiAgICB0aGlzLmRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyA9IGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZ1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGV2aWNlUGl4ZWxSYXRpbyBpbiB0aGUgTWluaW1hcCBpbiBwaXhlbHMuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGRldmljZVBpeGVsUmF0aW8gaW4gdGhlIE1pbmltYXBcbiAgICovXG4gIGdldERldmljZVBpeGVsUmF0aW8gKCkge1xuICAgIHJldHVybiB0aGlzLmdldERldmljZVBpeGVsUmF0aW9Sb3VuZGluZygpXG4gICAgICA/IE1hdGguZmxvb3IoZGV2aWNlUGl4ZWxSYXRpbylcbiAgICAgIDogZGV2aWNlUGl4ZWxSYXRpb1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCB2aXNpYmxlIHJvdyBpbiB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IHZpc2libGUgcm93XG4gICAqL1xuICBnZXRGaXJzdFZpc2libGVTY3JlZW5Sb3cgKCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2V0U2Nyb2xsVG9wKCkgLyB0aGlzLmdldExpbmVIZWlnaHQoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbGFzdCB2aXNpYmxlIHJvdyBpbiB0aGUgTWluaW1hcC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaW5kZXggb2YgdGhlIGxhc3QgdmlzaWJsZSByb3dcbiAgICovXG4gIGdldExhc3RWaXNpYmxlU2NyZWVuUm93ICgpIHtcbiAgICByZXR1cm4gTWF0aC5jZWlsKFxuICAgICAgKHRoaXMuZ2V0U2Nyb2xsVG9wKCkgKyB0aGlzLmdldFNjcmVlbkhlaWdodCgpKSAvIHRoaXMuZ2V0TGluZUhlaWdodCgpXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSB3aGVuIHRoZSBgaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsYCBzZXR0aW5nIGhhdmUgYmVlbiBlbmFibGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIHRoZSBtaW5pbWFwIGNhbiBzY3JvbGwgaW5kZXBlbmRlbnRseVxuICAgKi9cbiAgc2Nyb2xsSW5kZXBlbmRlbnRseU9uTW91c2VXaGVlbCAoKSB7IHJldHVybiB0aGlzLmluZGVwZW5kZW50TWluaW1hcFNjcm9sbCB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgc2Nyb2xsIG9mIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBUaGUgTWluaW1hcCBjYW4gc2Nyb2xsIG9ubHkgd2hlbiBpdHMgaGVpZ2h0IGlzIGdyZWF0ZXIgdGhhdCB0aGUgaGVpZ2h0XG4gICAqIG9mIGl0cyBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjcm9sbCB0b3Agb2YgdGhlIE1pbmltYXBcbiAgICovXG4gIGdldFNjcm9sbFRvcCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhbmRBbG9uZSB8fCB0aGlzLmluZGVwZW5kZW50TWluaW1hcFNjcm9sbFxuICAgICAgPyB0aGlzLnNjcm9sbFRvcFxuICAgICAgOiB0aGlzLmdldFNjcm9sbFRvcEZyb21FZGl0b3IoKVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1pbmltYXAgc2Nyb2xsIHRvcCB2YWx1ZSB3aGVuIGluIHN0YW5kLWFsb25lIG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzY3JvbGxUb3AgdGhlIG5ldyBzY3JvbGwgdG9wIGZvciB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcH0gaWYgdGhlIE1pbmltYXAncyBzdGFuZC1hbG9uZSBtb2RlIGlzIGVuYWJsZWRcbiAgICovXG4gIHNldFNjcm9sbFRvcCAoc2Nyb2xsVG9wKSB7XG4gICAgdGhpcy5zY3JvbGxUb3AgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih0aGlzLmdldE1heFNjcm9sbFRvcCgpLCBzY3JvbGxUb3ApKVxuXG4gICAgaWYgKHRoaXMuc3RhbmRBbG9uZSB8fCB0aGlzLmluZGVwZW5kZW50TWluaW1hcFNjcm9sbCkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcCcsIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1pbmltYXAgc2Nyb2xsIGFzIGEgcmF0aW9uIGJldHdlZW4gMCBhbmQgMS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbWluaW1hcCBzY3JvbGwgcmF0aW9cbiAgICovXG4gIGdldFNjcm9sbFJhdGlvICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTY3JvbGxUb3AoKSAvIHRoaXMuZ2V0TWF4U2Nyb2xsVG9wKClcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBzY3JvbGwgdG9wIHZhbHVlIHdpdGggdGhlIG9uZSBjb21wdXRlZCBmcm9tIHRoZSB0ZXh0IGVkaXRvclxuICAgKiB3aGVuIHRoZSBtaW5pbWFwIGlzIGluIHRoZSBpbmRlcGVuZGVudCBzY3JvbGxpbmcgbW9kZS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICB1cGRhdGVTY3JvbGxUb3AgKCkge1xuICAgIGlmICh0aGlzLmluZGVwZW5kZW50TWluaW1hcFNjcm9sbCkge1xuICAgICAgdGhpcy5zZXRTY3JvbGxUb3AodGhpcy5nZXRTY3JvbGxUb3BGcm9tRWRpdG9yKCkpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgdGhpcylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc2Nyb2xsIHRvcCBhcyBjb21wdXRlZCBmcm9tIHRoZSB0ZXh0IGVkaXRvciBzY3JvbGwgdG9wLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBjb21wdXRlZCBzY3JvbGwgdG9wIHZhbHVlXG4gICAqL1xuICBnZXRTY3JvbGxUb3BGcm9tRWRpdG9yICgpIHtcbiAgICByZXR1cm4gTWF0aC5hYnMoXG4gICAgICB0aGlzLmdldENhcGVkVGV4dEVkaXRvclNjcm9sbFJhdGlvKCkgKiB0aGlzLmdldE1heFNjcm9sbFRvcCgpXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1heGltdW0gc2Nyb2xsIHZhbHVlIG9mIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBtYXhpbXVtIHNjcm9sbCB0b3AgZm9yIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRNYXhTY3JvbGxUb3AgKCkge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCB0aGlzLmdldEhlaWdodCgpIC0gdGhpcy5nZXRTY3JlZW5IZWlnaHQoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBNaW5pbWFwIGNhbiBzY3JvbGwuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhpcyBNaW5pbWFwIGNhbiBzY3JvbGwgb3Igbm90XG4gICAqL1xuICBjYW5TY3JvbGwgKCkgeyByZXR1cm4gdGhpcy5nZXRNYXhTY3JvbGxUb3AoKSA+IDAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBtaW5pbWFwIHNjcm9sbCB0b3AgdmFsdWUgdXNpbmcgYSBtb3VzZSBldmVudCB3aGVuIHRoZVxuICAgKiBpbmRlcGVuZGVudCBzY3JvbGxpbmcgbW9kZSBpcyBlbmFibGVkXG4gICAqXG4gICAqIEBwYXJhbSAge01vdXNlRXZlbnR9IGV2ZW50IHRoZSBtb3VzZSB3aGVlbCBldmVudFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIG9uTW91c2VXaGVlbCAoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuY2FuU2Nyb2xsKCkpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IHt3aGVlbERlbHRhWX0gPSBldmVudFxuICAgIGNvbnN0IHByZXZpb3VzU2Nyb2xsVG9wID0gdGhpcy5nZXRTY3JvbGxUb3AoKVxuICAgIGNvbnN0IHVwZGF0ZWRTY3JvbGxUb3AgPSBwcmV2aW91c1Njcm9sbFRvcCAtIE1hdGgucm91bmQod2hlZWxEZWx0YVkgKiB0aGlzLnNjcm9sbFNlbnNpdGl2aXR5KVxuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuc2V0U2Nyb2xsVG9wKHVwZGF0ZWRTY3JvbGxUb3ApXG4gIH1cblxuICAvKipcbiAgICogRGVsZWdhdGVzIHRvIGBUZXh0RWRpdG9yI2dldE1hcmtlcmAuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZ2V0TWFya2VyIChpZCkgeyByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLmdldE1hcmtlcihpZCkgfVxuXG4gIC8qKlxuICAgKiBEZWxlZ2F0ZXMgdG8gYFRleHRFZGl0b3IjZmluZE1hcmtlcnNgLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGZpbmRNYXJrZXJzIChvKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3IuZmluZE1hcmtlcnMobylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlbGVnYXRlcyB0byBgVGV4dEVkaXRvciNtYXJrQnVmZmVyUmFuZ2VgLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIG1hcmtCdWZmZXJSYW5nZSAocmFuZ2UpIHsgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5tYXJrQnVmZmVyUmFuZ2UocmFuZ2UpIH1cblxuICAvKipcbiAgICogRW1pdHMgYSBjaGFuZ2UgZXZlbnRzIHdpdGggdGhlIHBhc3NlZC1pbiBjaGFuZ2VzIGFzIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gY2hhbmdlcyBhIGNoYW5nZSB0byBkaXNwYXRjaFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGVtaXRDaGFuZ2VzIChjaGFuZ2VzKSB7IHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlJywgY2hhbmdlcykgfVxuXG4gIC8qKlxuICAgKiBFbmFibGVzIHRoZSBjYWNoZSBhdCB0aGUgYWRhcHRlciBsZXZlbCB0byBhdm9pZCBjb25zZWN1dGl2ZSBhY2Nlc3MgdG8gdGhlXG4gICAqIHRleHQgZWRpdG9yIEFQSSBkdXJpbmcgYSByZW5kZXIgcGhhc2UuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZW5hYmxlQ2FjaGUgKCkgeyB0aGlzLmFkYXB0ZXIuZW5hYmxlQ2FjaGUoKSB9XG5cbiAgLyoqXG4gICAqIERpc2FibGUgdGhlIGFkYXB0ZXIgY2FjaGUuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY2xlYXJDYWNoZSAoKSB7IHRoaXMuYWRhcHRlci5jbGVhckNhY2hlKCkgfVxuXG59XG4iXX0=
//# sourceURL=/Users/victor.martins/.atom/packages/minimap/lib/minimap.js