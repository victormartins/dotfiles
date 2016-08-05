Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _atomUtils = require('atom-utils');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

var _decoratorsElement = require('./decorators/element');

var _decoratorsElement2 = _interopRequireDefault(_decoratorsElement);

var _mixinsDomStylesReader = require('./mixins/dom-styles-reader');

var _mixinsDomStylesReader2 = _interopRequireDefault(_mixinsDomStylesReader);

var _mixinsCanvasDrawer = require('./mixins/canvas-drawer');

var _mixinsCanvasDrawer2 = _interopRequireDefault(_mixinsCanvasDrawer);

var _minimapQuickSettingsElement = require('./minimap-quick-settings-element');

var _minimapQuickSettingsElement2 = _interopRequireDefault(_minimapQuickSettingsElement);

'use babel';

var SPEC_MODE = atom.inSpecMode();

/**
 * Public: The MinimapElement is the view meant to render a {@link Minimap}
 * instance in the DOM.
 *
 * You can retrieve the MinimapElement associated to a Minimap
 * using the `atom.views.getView` method.
 *
 * Note that most interactions with the Minimap package is done through the
 * Minimap model so you should never have to access MinimapElement
 * instances.
 *
 * @example
 * let minimapElement = atom.views.getView(minimap)
 */

var MinimapElement = (function () {
  function MinimapElement() {
    _classCallCheck(this, _MinimapElement);
  }

  _createClass(MinimapElement, [{
    key: 'createdCallback',

    //    ##     ##  #######   #######  ##    ##  ######
    //    ##     ## ##     ## ##     ## ##   ##  ##    ##
    //    ##     ## ##     ## ##     ## ##  ##   ##
    //    ######### ##     ## ##     ## #####     ######
    //    ##     ## ##     ## ##     ## ##  ##         ##
    //    ##     ## ##     ## ##     ## ##   ##  ##    ##
    //    ##     ##  #######   #######  ##    ##  ######

    /**
     * DOM callback invoked when a new MinimapElement is created.
     *
     * @access private
     */
    value: function createdCallback() {
      var _this = this;

      // Core properties

      /**
       * @access private
       */
      this.minimap = undefined;
      /**
       * @access private
       */
      this.editorElement = undefined;
      /**
       * @access private
       */
      this.width = undefined;
      /**
       * @access private
       */
      this.height = undefined;

      // Subscriptions

      /**
       * @access private
       */
      this.subscriptions = new _atom.CompositeDisposable();
      /**
       * @access private
       */
      this.visibleAreaSubscription = undefined;
      /**
       * @access private
       */
      this.quickSettingsSubscription = undefined;
      /**
       * @access private
       */
      this.dragSubscription = undefined;
      /**
       * @access private
       */
      this.openQuickSettingSubscription = undefined;

      // Configs

      /**
      * @access private
      */
      this.displayMinimapOnLeft = false;
      /**
      * @access private
      */
      this.minimapScrollIndicator = undefined;
      /**
      * @access private
      */
      this.displayMinimapOnLeft = undefined;
      /**
      * @access private
      */
      this.displayPluginsControls = undefined;
      /**
      * @access private
      */
      this.textOpacity = undefined;
      /**
      * @access private
      */
      this.displayCodeHighlights = undefined;
      /**
      * @access private
      */
      this.adjustToSoftWrap = undefined;
      /**
      * @access private
      */
      this.useHardwareAcceleration = undefined;
      /**
      * @access private
      */
      this.absoluteMode = undefined;

      // Elements

      /**
       * @access private
       */
      this.shadowRoot = undefined;
      /**
       * @access private
       */
      this.visibleArea = undefined;
      /**
       * @access private
       */
      this.controls = undefined;
      /**
       * @access private
       */
      this.scrollIndicator = undefined;
      /**
       * @access private
       */
      this.openQuickSettings = undefined;
      /**
       * @access private
       */
      this.quickSettingsElement = undefined;

      // States

      /**
      * @access private
      */
      this.attached = undefined;
      /**
      * @access private
      */
      this.attachedToTextEditor = undefined;
      /**
      * @access private
      */
      this.standAlone = undefined;
      /**
       * @access private
       */
      this.wasVisible = undefined;

      // Other

      /**
       * @access private
       */
      this.offscreenFirstRow = undefined;
      /**
       * @access private
       */
      this.offscreenLastRow = undefined;
      /**
       * @access private
       */
      this.frameRequested = undefined;
      /**
       * @access private
       */
      this.flexBasis = undefined;

      this.initializeContent();

      return this.observeConfig({
        'minimap.displayMinimapOnLeft': function minimapDisplayMinimapOnLeft(displayMinimapOnLeft) {
          _this.displayMinimapOnLeft = displayMinimapOnLeft;

          _this.updateMinimapFlexPosition();
        },

        'minimap.minimapScrollIndicator': function minimapMinimapScrollIndicator(minimapScrollIndicator) {
          _this.minimapScrollIndicator = minimapScrollIndicator;

          if (_this.minimapScrollIndicator && !(_this.scrollIndicator != null) && !_this.standAlone) {
            _this.initializeScrollIndicator();
          } else if (_this.scrollIndicator != null) {
            _this.disposeScrollIndicator();
          }

          if (_this.attached) {
            _this.requestUpdate();
          }
        },

        'minimap.displayPluginsControls': function minimapDisplayPluginsControls(displayPluginsControls) {
          _this.displayPluginsControls = displayPluginsControls;

          if (_this.displayPluginsControls && !(_this.openQuickSettings != null) && !_this.standAlone) {
            _this.initializeOpenQuickSettings();
          } else if (_this.openQuickSettings != null) {
            _this.disposeOpenQuickSettings();
          }
        },

        'minimap.textOpacity': function minimapTextOpacity(textOpacity) {
          _this.textOpacity = textOpacity;

          if (_this.attached) {
            _this.requestForcedUpdate();
          }
        },

        'minimap.displayCodeHighlights': function minimapDisplayCodeHighlights(displayCodeHighlights) {
          _this.displayCodeHighlights = displayCodeHighlights;

          if (_this.attached) {
            _this.requestForcedUpdate();
          }
        },

        'minimap.smoothScrolling': function minimapSmoothScrolling(smoothScrolling) {
          _this.smoothScrolling = smoothScrolling;

          if (_this.attached) {
            if (!_this.smoothScrolling) {
              _this.backLayer.canvas.style.cssText = '';
              _this.tokensLayer.canvas.style.cssText = '';
              _this.frontLayer.canvas.style.cssText = '';
            } else {
              _this.requestUpdate();
            }
          }
        },

        'minimap.adjustMinimapWidthToSoftWrap': function minimapAdjustMinimapWidthToSoftWrap(adjustToSoftWrap) {
          _this.adjustToSoftWrap = adjustToSoftWrap;

          if (_this.attached) {
            _this.measureHeightAndWidth();
          }
        },

        'minimap.useHardwareAcceleration': function minimapUseHardwareAcceleration(useHardwareAcceleration) {
          _this.useHardwareAcceleration = useHardwareAcceleration;

          if (_this.attached) {
            _this.requestUpdate();
          }
        },

        'minimap.absoluteMode': function minimapAbsoluteMode(absoluteMode) {
          _this.absoluteMode = absoluteMode;

          return _this.classList.toggle('absolute', _this.absoluteMode);
        },

        'editor.preferredLineLength': function editorPreferredLineLength() {
          if (_this.attached) {
            _this.measureHeightAndWidth();
          }
        },

        'editor.softWrap': function editorSoftWrap() {
          if (_this.attached) {
            _this.requestUpdate();
          }
        },

        'editor.softWrapAtPreferredLineLength': function editorSoftWrapAtPreferredLineLength() {
          if (_this.attached) {
            _this.requestUpdate();
          }
        }
      });
    }

    /**
     * DOM callback invoked when a new MinimapElement is attached to the DOM.
     *
     * @access private
     */
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      var _this2 = this;

      this.subscriptions.add(atom.views.pollDocument(function () {
        _this2.pollDOM();
      }));
      this.measureHeightAndWidth();
      this.updateMinimapFlexPosition();
      this.attached = true;
      this.attachedToTextEditor = this.parentNode === this.getTextEditorElementRoot();

      /*
        We use `atom.styles.onDidAddStyleElement` instead of
        `atom.themes.onDidChangeActiveThemes`.
        Why? Currently, The style element will be removed first, and then re-added
        and the `change` event has not be triggered in the process.
      */
      this.subscriptions.add(atom.styles.onDidAddStyleElement(function () {
        _this2.invalidateDOMStylesCache();
        _this2.requestForcedUpdate();
      }));

      this.subscriptions.add(this.subscribeToMediaQuery());
    }

    /**
     * DOM callback invoked when a new MinimapElement is detached from the DOM.
     *
     * @access private
     */
  }, {
    key: 'detachedCallback',
    value: function detachedCallback() {
      this.attached = false;
    }

    //       ###    ######## ########    ###     ######  ##     ##
    //      ## ##      ##       ##      ## ##   ##    ## ##     ##
    //     ##   ##     ##       ##     ##   ##  ##       ##     ##
    //    ##     ##    ##       ##    ##     ## ##       #########
    //    #########    ##       ##    ######### ##       ##     ##
    //    ##     ##    ##       ##    ##     ## ##    ## ##     ##
    //    ##     ##    ##       ##    ##     ##  ######  ##     ##

    /**
     * Returns whether the MinimapElement is currently visible on screen or not.
     *
     * The visibility of the minimap is defined by testing the size of the offset
     * width and height of the element.
     *
     * @return {boolean} whether the MinimapElement is currently visible or not
     */
  }, {
    key: 'isVisible',
    value: function isVisible() {
      return this.offsetWidth > 0 || this.offsetHeight > 0;
    }

    /**
     * Attaches the MinimapElement to the DOM.
     *
     * The position at which the element is attached is defined by the
     * `displayMinimapOnLeft` setting.
     *
     * @param  {HTMLElement} [parent] the DOM node where attaching the minimap
     *                                element
     */
  }, {
    key: 'attach',
    value: function attach(parent) {
      if (this.attached) {
        return;
      }
      (parent || this.getTextEditorElementRoot()).appendChild(this);
    }

    /**
     * Detaches the MinimapElement from the DOM.
     */
  }, {
    key: 'detach',
    value: function detach() {
      if (!this.attached || this.parentNode == null) {
        return;
      }
      this.parentNode.removeChild(this);
    }

    /**
     * Toggles the minimap left/right position based on the value of the
     * `displayMinimapOnLeft` setting.
     *
     * @access private
     */
  }, {
    key: 'updateMinimapFlexPosition',
    value: function updateMinimapFlexPosition() {
      this.classList.toggle('left', this.displayMinimapOnLeft);
    }

    /**
     * Destroys this MinimapElement
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      this.subscriptions.dispose();
      this.detach();
      this.minimap = null;
    }

    //     ######   #######  ##    ## ######## ######## ##    ## ########
    //    ##    ## ##     ## ###   ##    ##    ##       ###   ##    ##
    //    ##       ##     ## ####  ##    ##    ##       ####  ##    ##
    //    ##       ##     ## ## ## ##    ##    ######   ## ## ##    ##
    //    ##       ##     ## ##  ####    ##    ##       ##  ####    ##
    //    ##    ## ##     ## ##   ###    ##    ##       ##   ###    ##
    //     ######   #######  ##    ##    ##    ######## ##    ##    ##

    /**
     * Creates the content of the MinimapElement and attaches the mouse control
     * event listeners.
     *
     * @access private
     */
  }, {
    key: 'initializeContent',
    value: function initializeContent() {
      var _this3 = this;

      this.initializeCanvas();

      this.shadowRoot = this.createShadowRoot();
      this.attachCanvases(this.shadowRoot);

      this.createVisibleArea();
      this.createControls();

      this.subscriptions.add(this.subscribeTo(this, {
        'mousewheel': function mousewheel(e) {
          if (!_this3.standAlone) {
            _this3.relayMousewheelEvent(e);
          }
        }
      }));

      this.subscriptions.add(this.subscribeTo(this.getFrontCanvas(), {
        'mousedown': function mousedown(e) {
          _this3.canvasPressed(_this3.extractMouseEventData(e));
        },
        'touchstart': function touchstart(e) {
          _this3.canvasPressed(_this3.extractTouchEventData(e));
        }
      }));
    }

    /**
     * Initializes the visible area div.
     *
     * @access private
     */
  }, {
    key: 'createVisibleArea',
    value: function createVisibleArea() {
      var _this4 = this;

      if (this.visibleArea) {
        return;
      }

      this.visibleArea = document.createElement('div');
      this.visibleArea.classList.add('minimap-visible-area');
      this.shadowRoot.appendChild(this.visibleArea);
      this.visibleAreaSubscription = this.subscribeTo(this.visibleArea, {
        'mousedown': function mousedown(e) {
          _this4.startDrag(_this4.extractMouseEventData(e));
        },
        'touchstart': function touchstart(e) {
          _this4.startDrag(_this4.extractTouchEventData(e));
        }
      });

      this.subscriptions.add(this.visibleAreaSubscription);
    }

    /**
     * Removes the visible area div.
     *
     * @access private
     */
  }, {
    key: 'removeVisibleArea',
    value: function removeVisibleArea() {
      if (!this.visibleArea) {
        return;
      }

      this.subscriptions.remove(this.visibleAreaSubscription);
      this.visibleAreaSubscription.dispose();
      this.shadowRoot.removeChild(this.visibleArea);
      delete this.visibleArea;
    }

    /**
     * Creates the controls container div.
     *
     * @access private
     */
  }, {
    key: 'createControls',
    value: function createControls() {
      if (this.controls || this.standAlone) {
        return;
      }

      this.controls = document.createElement('div');
      this.controls.classList.add('minimap-controls');
      this.shadowRoot.appendChild(this.controls);
    }

    /**
     * Removes the controls container div.
     *
     * @access private
     */
  }, {
    key: 'removeControls',
    value: function removeControls() {
      if (!this.controls) {
        return;
      }

      this.shadowRoot.removeChild(this.controls);
      delete this.controls;
    }

    /**
     * Initializes the scroll indicator div when the `minimapScrollIndicator`
     * settings is enabled.
     *
     * @access private
     */
  }, {
    key: 'initializeScrollIndicator',
    value: function initializeScrollIndicator() {
      if (this.scrollIndicator || this.standAlone) {
        return;
      }

      this.scrollIndicator = document.createElement('div');
      this.scrollIndicator.classList.add('minimap-scroll-indicator');
      this.controls.appendChild(this.scrollIndicator);
    }

    /**
     * Disposes the scroll indicator div when the `minimapScrollIndicator`
     * settings is disabled.
     *
     * @access private
     */
  }, {
    key: 'disposeScrollIndicator',
    value: function disposeScrollIndicator() {
      if (!this.scrollIndicator) {
        return;
      }

      this.controls.removeChild(this.scrollIndicator);
      delete this.scrollIndicator;
    }

    /**
     * Initializes the quick settings openener div when the
     * `displayPluginsControls` setting is enabled.
     *
     * @access private
     */
  }, {
    key: 'initializeOpenQuickSettings',
    value: function initializeOpenQuickSettings() {
      var _this5 = this;

      if (this.openQuickSettings || this.standAlone) {
        return;
      }

      this.openQuickSettings = document.createElement('div');
      this.openQuickSettings.classList.add('open-minimap-quick-settings');
      this.controls.appendChild(this.openQuickSettings);

      this.openQuickSettingSubscription = this.subscribeTo(this.openQuickSettings, {
        'mousedown': function mousedown(e) {
          e.preventDefault();
          e.stopPropagation();

          if (_this5.quickSettingsElement != null) {
            _this5.quickSettingsElement.destroy();
            _this5.quickSettingsSubscription.dispose();
          } else {
            _this5.quickSettingsElement = new _minimapQuickSettingsElement2['default']();
            _this5.quickSettingsElement.setModel(_this5);
            _this5.quickSettingsSubscription = _this5.quickSettingsElement.onDidDestroy(function () {
              _this5.quickSettingsElement = null;
            });

            var _getFrontCanvas$getBoundingClientRect = _this5.getFrontCanvas().getBoundingClientRect();

            var _top = _getFrontCanvas$getBoundingClientRect.top;
            var left = _getFrontCanvas$getBoundingClientRect.left;
            var right = _getFrontCanvas$getBoundingClientRect.right;

            _this5.quickSettingsElement.style.top = _top + 'px';
            _this5.quickSettingsElement.attach();

            if (_this5.displayMinimapOnLeft) {
              _this5.quickSettingsElement.style.left = right + 'px';
            } else {
              _this5.quickSettingsElement.style.left = left - _this5.quickSettingsElement.clientWidth + 'px';
            }
          }
        }
      });
    }

    /**
     * Disposes the quick settings openener div when the `displayPluginsControls`
     * setting is disabled.
     *
     * @access private
     */
  }, {
    key: 'disposeOpenQuickSettings',
    value: function disposeOpenQuickSettings() {
      if (!this.openQuickSettings) {
        return;
      }

      this.controls.removeChild(this.openQuickSettings);
      this.openQuickSettingSubscription.dispose();
      delete this.openQuickSettings;
    }

    /**
     * Returns the target `TextEditor` of the Minimap.
     *
     * @return {TextEditor} the minimap's text editor
     */
  }, {
    key: 'getTextEditor',
    value: function getTextEditor() {
      return this.minimap.getTextEditor();
    }

    /**
     * Returns the `TextEditorElement` for the Minimap's `TextEditor`.
     *
     * @return {TextEditorElement} the minimap's text editor element
     */
  }, {
    key: 'getTextEditorElement',
    value: function getTextEditorElement() {
      if (this.editorElement) {
        return this.editorElement;
      }

      this.editorElement = atom.views.getView(this.getTextEditor());
      return this.editorElement;
    }

    /**
     * Returns the root of the `TextEditorElement` content.
     *
     * This method is mostly used to ensure compatibility with the `shadowDom`
     * setting.
     *
     * @return {HTMLElement} the root of the `TextEditorElement` content
     */
  }, {
    key: 'getTextEditorElementRoot',
    value: function getTextEditorElementRoot() {
      var editorElement = this.getTextEditorElement();

      if (editorElement.shadowRoot) {
        return editorElement.shadowRoot;
      } else {
        return editorElement;
      }
    }

    /**
     * Returns the root where to inject the dummy node used to read DOM styles.
     *
     * @param  {boolean} shadowRoot whether to use the text editor shadow DOM
     *                              or not
     * @return {HTMLElement} the root node where appending the dummy node
     * @access private
     */
  }, {
    key: 'getDummyDOMRoot',
    value: function getDummyDOMRoot(shadowRoot) {
      if (shadowRoot) {
        return this.getTextEditorElementRoot();
      } else {
        return this.getTextEditorElement();
      }
    }

    //    ##     ##  #######  ########  ######## ##
    //    ###   ### ##     ## ##     ## ##       ##
    //    #### #### ##     ## ##     ## ##       ##
    //    ## ### ## ##     ## ##     ## ######   ##
    //    ##     ## ##     ## ##     ## ##       ##
    //    ##     ## ##     ## ##     ## ##       ##
    //    ##     ##  #######  ########  ######## ########

    /**
     * Returns the Minimap for which this MinimapElement was created.
     *
     * @return {Minimap} this element's Minimap
     */
  }, {
    key: 'getModel',
    value: function getModel() {
      return this.minimap;
    }

    /**
     * Defines the Minimap model for this MinimapElement instance.
     *
     * @param  {Minimap} minimap the Minimap model for this instance.
     * @return {Minimap} this element's Minimap
     */
  }, {
    key: 'setModel',
    value: function setModel(minimap) {
      var _this6 = this;

      this.minimap = minimap;
      this.subscriptions.add(this.minimap.onDidChangeScrollTop(function () {
        _this6.requestUpdate();
      }));
      this.subscriptions.add(this.minimap.onDidChangeScrollLeft(function () {
        _this6.requestUpdate();
      }));
      this.subscriptions.add(this.minimap.onDidDestroy(function () {
        _this6.destroy();
      }));
      this.subscriptions.add(this.minimap.onDidChangeConfig(function () {
        if (_this6.attached) {
          return _this6.requestForcedUpdate();
        }
      }));

      this.subscriptions.add(this.minimap.onDidChangeStandAlone(function () {
        _this6.setStandAlone(_this6.minimap.isStandAlone());
        _this6.requestUpdate();
      }));

      this.subscriptions.add(this.minimap.onDidChange(function (change) {
        _this6.pendingChanges.push(change);
        _this6.requestUpdate();
      }));

      this.subscriptions.add(this.minimap.onDidChangeDecorationRange(function (change) {
        var type = change.type;

        if (type === 'line' || type === 'highlight-under') {
          _this6.pendingBackDecorationChanges.push(change);
        } else {
          _this6.pendingFrontDecorationChanges.push(change);
        }
        _this6.requestUpdate();
      }));

      this.subscriptions.add(_main2['default'].onDidChangePluginOrder(function () {
        _this6.requestForcedUpdate();
      }));

      this.setStandAlone(this.minimap.isStandAlone());

      if (this.width != null && this.height != null) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }

      return this.minimap;
    }

    /**
     * Sets the stand-alone mode for this MinimapElement.
     *
     * @param {boolean} standAlone the new mode for this MinimapElement
     */
  }, {
    key: 'setStandAlone',
    value: function setStandAlone(standAlone) {
      this.standAlone = standAlone;

      if (this.standAlone) {
        this.setAttribute('stand-alone', true);
        this.disposeScrollIndicator();
        this.disposeOpenQuickSettings();
        this.removeControls();
        this.removeVisibleArea();
      } else {
        this.removeAttribute('stand-alone');
        this.createVisibleArea();
        this.createControls();
        if (this.minimapScrollIndicator) {
          this.initializeScrollIndicator();
        }
        if (this.displayPluginsControls) {
          this.initializeOpenQuickSettings();
        }
      }
    }

    //    ##     ## ########  ########     ###    ######## ########
    //    ##     ## ##     ## ##     ##   ## ##      ##    ##
    //    ##     ## ##     ## ##     ##  ##   ##     ##    ##
    //    ##     ## ########  ##     ## ##     ##    ##    ######
    //    ##     ## ##        ##     ## #########    ##    ##
    //    ##     ## ##        ##     ## ##     ##    ##    ##
    //     #######  ##        ########  ##     ##    ##    ########

    /**
     * Requests an update to be performed on the next frame.
     */
  }, {
    key: 'requestUpdate',
    value: function requestUpdate() {
      var _this7 = this;

      if (this.frameRequested) {
        return;
      }

      this.frameRequested = true;
      requestAnimationFrame(function () {
        _this7.update();
        _this7.frameRequested = false;
      });
    }

    /**
     * Requests an update to be performed on the next frame that will completely
     * redraw the minimap.
     */
  }, {
    key: 'requestForcedUpdate',
    value: function requestForcedUpdate() {
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      this.requestUpdate();
    }

    /**
     * Performs the actual MinimapElement update.
     *
     * @access private
     */
  }, {
    key: 'update',
    value: function update() {
      if (!(this.attached && this.isVisible() && this.minimap)) {
        return;
      }
      var minimap = this.minimap;
      minimap.enableCache();
      var canvas = this.getFrontCanvas();

      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var visibleAreaLeft = minimap.getTextEditorScaledScrollLeft();
      var visibleAreaTop = minimap.getTextEditorScaledScrollTop() - minimap.getScrollTop();
      var visibleWidth = Math.min(canvas.width / devicePixelRatio, this.width);

      if (this.adjustToSoftWrap && this.flexBasis) {
        this.style.flexBasis = this.flexBasis + 'px';
      } else {
        this.style.flexBasis = null;
      }

      if (SPEC_MODE) {
        this.applyStyles(this.visibleArea, {
          width: visibleWidth + 'px',
          height: minimap.getTextEditorScaledHeight() + 'px',
          top: visibleAreaTop + 'px',
          left: visibleAreaLeft + 'px'
        });
      } else {
        this.applyStyles(this.visibleArea, {
          width: visibleWidth + 'px',
          height: minimap.getTextEditorScaledHeight() + 'px',
          transform: this.makeTranslate(visibleAreaLeft, visibleAreaTop)
        });
      }

      this.applyStyles(this.controls, { width: visibleWidth + 'px' });

      var canvasTop = minimap.getFirstVisibleScreenRow() * minimap.getLineHeight() - minimap.getScrollTop();

      var canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += ' ' + this.makeScale(1 / devicePixelRatio);
      }

      if (this.smoothScrolling) {
        if (SPEC_MODE) {
          this.applyStyles(this.backLayer.canvas, { top: canvasTop + 'px' });
          this.applyStyles(this.tokensLayer.canvas, { top: canvasTop + 'px' });
          this.applyStyles(this.frontLayer.canvas, { top: canvasTop + 'px' });
        } else {
          this.applyStyles(this.backLayer.canvas, { transform: canvasTransform });
          this.applyStyles(this.tokensLayer.canvas, { transform: canvasTransform });
          this.applyStyles(this.frontLayer.canvas, { transform: canvasTransform });
        }
      }

      if (this.minimapScrollIndicator && minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }

      if (this.scrollIndicator != null) {
        var minimapScreenHeight = minimap.getScreenHeight();
        var indicatorHeight = minimapScreenHeight * (minimapScreenHeight / minimap.getHeight());
        var indicatorScroll = (minimapScreenHeight - indicatorHeight) * minimap.getScrollRatio();

        if (SPEC_MODE) {
          this.applyStyles(this.scrollIndicator, {
            height: indicatorHeight + 'px',
            top: indicatorScroll + 'px'
          });
        } else {
          this.applyStyles(this.scrollIndicator, {
            height: indicatorHeight + 'px',
            transform: this.makeTranslate(0, indicatorScroll)
          });
        }

        if (!minimap.canScroll()) {
          this.disposeScrollIndicator();
        }
      }

      this.updateCanvas();
      minimap.clearCache();
    }

    /**
     * Defines whether to render the code highlights or not.
     *
     * @param {Boolean} displayCodeHighlights whether to render the code
     *                                        highlights or not
     */
  }, {
    key: 'setDisplayCodeHighlights',
    value: function setDisplayCodeHighlights(displayCodeHighlights) {
      this.displayCodeHighlights = displayCodeHighlights;
      if (this.attached) {
        this.requestForcedUpdate();
      }
    }

    /**
     * Polling callback used to detect visibility and size changes.
     *
     * @access private
     */
  }, {
    key: 'pollDOM',
    value: function pollDOM() {
      var visibilityChanged = this.checkForVisibilityChange();
      if (this.isVisible()) {
        if (!this.wasVisible) {
          this.requestForcedUpdate();
        }

        this.measureHeightAndWidth(visibilityChanged, false);
      }
    }

    /**
     * A method that checks for visibility changes in the MinimapElement.
     * The method returns `true` when the visibility changed from visible to
     * hidden or from hidden to visible.
     *
     * @return {boolean} whether the visibility changed or not since the last call
     * @access private
     */
  }, {
    key: 'checkForVisibilityChange',
    value: function checkForVisibilityChange() {
      if (this.isVisible()) {
        if (this.wasVisible) {
          return false;
        } else {
          this.wasVisible = true;
          return this.wasVisible;
        }
      } else {
        if (this.wasVisible) {
          this.wasVisible = false;
          return true;
        } else {
          this.wasVisible = false;
          return this.wasVisible;
        }
      }
    }

    /**
     * A method used to measure the size of the MinimapElement and update internal
     * components based on the new size.
     *
     * @param  {boolean} visibilityChanged did the visibility changed since last
     *                                     measurement
     * @param  {[type]} [forceUpdate=true] forces the update even when no changes
     *                                     were detected
     * @access private
     */
  }, {
    key: 'measureHeightAndWidth',
    value: function measureHeightAndWidth(visibilityChanged) {
      var forceUpdate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!this.minimap) {
        return;
      }

      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var wasResized = this.width !== this.clientWidth || this.height !== this.clientHeight;

      this.height = this.clientHeight;
      this.width = this.clientWidth;
      var canvasWidth = this.width;

      if (this.minimap != null) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }

      if (wasResized || visibilityChanged || forceUpdate) {
        this.requestForcedUpdate();
      }

      if (!this.isVisible()) {
        return;
      }

      if (wasResized || forceUpdate) {
        if (this.adjustToSoftWrap) {
          var lineLength = atom.config.get('editor.preferredLineLength');
          var softWrap = atom.config.get('editor.softWrap');
          var softWrapAtPreferredLineLength = atom.config.get('editor.softWrapAtPreferredLineLength');
          var width = lineLength * this.minimap.getCharWidth();

          if (softWrap && softWrapAtPreferredLineLength && lineLength && width <= this.width) {
            this.flexBasis = width;
            canvasWidth = width;
          } else {
            delete this.flexBasis;
          }
        } else {
          delete this.flexBasis;
        }

        var canvas = this.getFrontCanvas();
        if (canvasWidth !== canvas.width || this.height !== canvas.height) {
          this.setCanvasesSize(canvasWidth * devicePixelRatio, (this.height + this.minimap.getLineHeight()) * devicePixelRatio);
        }
      }
    }

    //    ######## ##     ## ######## ##    ## ########  ######
    //    ##       ##     ## ##       ###   ##    ##    ##    ##
    //    ##       ##     ## ##       ####  ##    ##    ##
    //    ######   ##     ## ######   ## ## ##    ##     ######
    //    ##        ##   ##  ##       ##  ####    ##          ##
    //    ##         ## ##   ##       ##   ###    ##    ##    ##
    //    ########    ###    ######## ##    ##    ##     ######

    /**
     * Helper method to register config observers.
     *
     * @param  {Object} configs={} an object mapping the config name to observe
     *                             with the function to call back when a change
     *                             occurs
     * @access private
     */
  }, {
    key: 'observeConfig',
    value: function observeConfig() {
      var configs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      for (var config in configs) {
        this.subscriptions.add(atom.config.observe(config, configs[config]));
      }
    }

    /**
     * Callback triggered when the mouse is pressed on the MinimapElement canvas.
     *
     * @param  {number} y the vertical coordinate of the event
     * @param  {boolean} isLeftMouse was the left mouse button pressed?
     * @param  {boolean} isMiddleMouse was the middle mouse button pressed?
     * @access private
     */
  }, {
    key: 'canvasPressed',
    value: function canvasPressed(_ref) {
      var y = _ref.y;
      var isLeftMouse = _ref.isLeftMouse;
      var isMiddleMouse = _ref.isMiddleMouse;

      if (this.minimap.isStandAlone()) {
        return;
      }
      if (isLeftMouse) {
        this.canvasLeftMousePressed(y);
      } else if (isMiddleMouse) {
        this.canvasMiddleMousePressed(y);

        var _visibleArea$getBoundingClientRect = this.visibleArea.getBoundingClientRect();

        var _top2 = _visibleArea$getBoundingClientRect.top;
        var height = _visibleArea$getBoundingClientRect.height;

        this.startDrag({ y: _top2 + height / 2, isLeftMouse: false, isMiddleMouse: true });
      }
    }

    /**
     * Callback triggered when the mouse left button is pressed on the
     * MinimapElement canvas.
     *
     * @param  {MouseEvent} e the mouse event object
     * @param  {number} e.pageY the mouse y position in page
     * @param  {HTMLElement} e.target the source of the event
     * @access private
     */
  }, {
    key: 'canvasLeftMousePressed',
    value: function canvasLeftMousePressed(y) {
      var _this8 = this;

      var deltaY = y - this.getBoundingClientRect().top;
      var row = Math.floor(deltaY / this.minimap.getLineHeight()) + this.minimap.getFirstVisibleScreenRow();

      var textEditor = this.minimap.getTextEditor();

      var scrollTop = row * textEditor.getLineHeightInPixels() - this.minimap.getTextEditorHeight() / 2;

      if (atom.config.get('minimap.scrollAnimation')) {
        var from = this.minimap.getTextEditorScrollTop();
        var to = scrollTop;
        var step = function step(now) {
          return _this8.minimap.setTextEditorScrollTop(now);
        };
        var duration = atom.config.get('minimap.scrollAnimationDuration');
        this.animate({ from: from, to: to, duration: duration, step: step });
      } else {
        this.minimap.setTextEditorScrollTop(scrollTop);
      }
    }

    /**
     * Callback triggered when the mouse middle button is pressed on the
     * MinimapElement canvas.
     *
     * @param  {MouseEvent} e the mouse event object
     * @param  {number} e.pageY the mouse y position in page
     * @access private
     */
  }, {
    key: 'canvasMiddleMousePressed',
    value: function canvasMiddleMousePressed(y) {
      var _getBoundingClientRect = this.getBoundingClientRect();

      var offsetTop = _getBoundingClientRect.top;

      var deltaY = y - offsetTop - this.minimap.getTextEditorScaledHeight() / 2;

      var ratio = deltaY / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());

      this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    }

    /**
     * A method that relays the `mousewheel` events received by the MinimapElement
     * to the `TextEditorElement`.
     *
     * @param  {MouseEvent} e the mouse event object
     * @access private
     */
  }, {
    key: 'relayMousewheelEvent',
    value: function relayMousewheelEvent(e) {
      if (this.minimap.scrollIndependentlyOnMouseWheel()) {
        this.minimap.onMouseWheel(e);
      } else {
        this.getTextEditorElement().component.onMouseWheel(e);
      }
    }

    /**
     * A method that extracts data from a `MouseEvent` which can then be used to
     * process clicks and drags of the minimap.
     *
     * Used together with `extractTouchEventData` to provide a unified interface
     * for `MouseEvent`s and `TouchEvent`s.
     *
     * @param  {MouseEvent} mouseEvent the mouse event object
     * @access private
     */
  }, {
    key: 'extractMouseEventData',
    value: function extractMouseEventData(mouseEvent) {
      return {
        x: mouseEvent.pageX,
        y: mouseEvent.pageY,
        isLeftMouse: mouseEvent.which === 1,
        isMiddleMouse: mouseEvent.which === 2
      };
    }

    /**
     * A method that extracts data from a `TouchEvent` which can then be used to
     * process clicks and drags of the minimap.
     *
     * Used together with `extractMouseEventData` to provide a unified interface
     * for `MouseEvent`s and `TouchEvent`s.
     *
     * @param  {TouchEvent} touchEvent the touch event object
     * @access private
     */
  }, {
    key: 'extractTouchEventData',
    value: function extractTouchEventData(touchEvent) {
      // Use the first touch on the target area. Other touches will be ignored in
      // case of multi-touch.
      var touch = touchEvent.changedTouches[0];

      return {
        x: touch.pageX,
        y: touch.pageY,
        isLeftMouse: true, // Touch is treated like a left mouse button click
        isMiddleMouse: false
      };
    }

    /**
     * Subscribes to a media query for device pixel ratio changes and forces
     * a repaint when it occurs.
     *
     * @return {Disposable} a disposable to remove the media query listener
     * @access private
     */
  }, {
    key: 'subscribeToMediaQuery',
    value: function subscribeToMediaQuery() {
      var _this9 = this;

      var query = 'screen and (-webkit-min-device-pixel-ratio: 1.5)';
      var mediaQuery = window.matchMedia(query);
      var mediaListener = function mediaListener(e) {
        _this9.requestForcedUpdate();
      };
      mediaQuery.addListener(mediaListener);

      return new _atom.Disposable(function () {
        mediaQuery.removeListener(mediaListener);
      });
    }

    //    ########    ####    ########
    //    ##     ##  ##  ##   ##     ##
    //    ##     ##   ####    ##     ##
    //    ##     ##  ####     ##     ##
    //    ##     ## ##  ## ## ##     ##
    //    ##     ## ##   ##   ##     ##
    //    ########   ####  ## ########

    /**
     * A method triggered when the mouse is pressed over the visible area that
     * starts the dragging gesture.
     *
     * @param  {number} y the vertical coordinate of the event
     * @param  {boolean} isLeftMouse was the left mouse button pressed?
     * @param  {boolean} isMiddleMouse was the middle mouse button pressed?
     * @access private
     */
  }, {
    key: 'startDrag',
    value: function startDrag(_ref2) {
      var _this10 = this;

      var y = _ref2.y;
      var isLeftMouse = _ref2.isLeftMouse;
      var isMiddleMouse = _ref2.isMiddleMouse;

      if (!this.minimap) {
        return;
      }
      if (!isLeftMouse && !isMiddleMouse) {
        return;
      }

      var _visibleArea$getBoundingClientRect2 = this.visibleArea.getBoundingClientRect();

      var top = _visibleArea$getBoundingClientRect2.top;

      var _getBoundingClientRect2 = this.getBoundingClientRect();

      var offsetTop = _getBoundingClientRect2.top;

      var dragOffset = y - top;

      var initial = { dragOffset: dragOffset, offsetTop: offsetTop };

      var mousemoveHandler = function mousemoveHandler(e) {
        return _this10.drag(_this10.extractMouseEventData(e), initial);
      };
      var mouseupHandler = function mouseupHandler(e) {
        return _this10.endDrag();
      };

      var touchmoveHandler = function touchmoveHandler(e) {
        return _this10.drag(_this10.extractTouchEventData(e), initial);
      };
      var touchendHandler = function touchendHandler(e) {
        return _this10.endDrag();
      };

      document.body.addEventListener('mousemove', mousemoveHandler);
      document.body.addEventListener('mouseup', mouseupHandler);
      document.body.addEventListener('mouseleave', mouseupHandler);

      document.body.addEventListener('touchmove', touchmoveHandler);
      document.body.addEventListener('touchend', touchendHandler);
      document.body.addEventListener('touchcancel', touchendHandler);

      this.dragSubscription = new _atom.Disposable(function () {
        document.body.removeEventListener('mousemove', mousemoveHandler);
        document.body.removeEventListener('mouseup', mouseupHandler);
        document.body.removeEventListener('mouseleave', mouseupHandler);

        document.body.removeEventListener('touchmove', touchmoveHandler);
        document.body.removeEventListener('touchend', touchendHandler);
        document.body.removeEventListener('touchcancel', touchendHandler);
      });
    }

    /**
     * The method called during the drag gesture.
     *
     * @param  {number} y the vertical coordinate of the event
     * @param  {boolean} isLeftMouse was the left mouse button pressed?
     * @param  {boolean} isMiddleMouse was the middle mouse button pressed?
     * @param  {number} initial.dragOffset the mouse offset within the visible
     *                                     area
     * @param  {number} initial.offsetTop the MinimapElement offset at the moment
     *                                    of the drag start
     * @access private
     */
  }, {
    key: 'drag',
    value: function drag(_ref3, initial) {
      var y = _ref3.y;
      var isLeftMouse = _ref3.isLeftMouse;
      var isMiddleMouse = _ref3.isMiddleMouse;

      if (!this.minimap) {
        return;
      }
      if (!isLeftMouse && !isMiddleMouse) {
        return;
      }
      var deltaY = y - initial.offsetTop - initial.dragOffset;

      var ratio = deltaY / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());

      this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    }

    /**
     * The method that ends the drag gesture.
     *
     * @access private
     */
  }, {
    key: 'endDrag',
    value: function endDrag() {
      if (!this.minimap) {
        return;
      }
      this.dragSubscription.dispose();
    }

    //     ######   ######   ######
    //    ##    ## ##    ## ##    ##
    //    ##       ##       ##
    //    ##        ######   ######
    //    ##             ##       ##
    //    ##    ## ##    ## ##    ##
    //     ######   ######   ######

    /**
     * Applies the passed-in styles properties to the specified element
     *
     * @param  {HTMLElement} element the element onto which apply the styles
     * @param  {Object} styles the styles to apply
     * @access private
     */
  }, {
    key: 'applyStyles',
    value: function applyStyles(element, styles) {
      if (!element) {
        return;
      }

      var cssText = '';
      for (var property in styles) {
        cssText += property + ': ' + styles[property] + '; ';
      }

      element.style.cssText = cssText;
    }

    /**
     * Returns a string with a CSS translation tranform value.
     *
     * @param  {number} [x = 0] the x offset of the translation
     * @param  {number} [y = 0] the y offset of the translation
     * @return {string} the CSS translation string
     * @access private
     */
  }, {
    key: 'makeTranslate',
    value: function makeTranslate() {
      var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (this.useHardwareAcceleration) {
        return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      } else {
        return 'translate(' + x + 'px, ' + y + 'px)';
      }
    }

    /**
     * Returns a string with a CSS scaling tranform value.
     *
     * @param  {number} [x = 0] the x scaling factor
     * @param  {number} [y = 0] the y scaling factor
     * @return {string} the CSS scaling string
     * @access private
     */
  }, {
    key: 'makeScale',
    value: function makeScale() {
      var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments.length <= 1 || arguments[1] === undefined ? x : arguments[1];
      return (function () {
        if (this.useHardwareAcceleration) {
          return 'scale3d(' + x + ', ' + y + ', 1)';
        } else {
          return 'scale(' + x + ', ' + y + ')';
        }
      }).apply(this, arguments);
    }

    /**
     * A method that return the current time as a Date.
     *
     * That method exist so that we can mock it in tests.
     *
     * @return {Date} the current time as Date
     * @access private
     */
  }, {
    key: 'getTime',
    value: function getTime() {
      return new Date();
    }

    /**
     * A method that mimic the jQuery `animate` method and used to animate the
     * scroll when clicking on the MinimapElement canvas.
     *
     * @param  {Object} param the animation data object
     * @param  {[type]} param.from the start value
     * @param  {[type]} param.to the end value
     * @param  {[type]} param.duration the animation duration
     * @param  {[type]} param.step the easing function for the animation
     * @access private
     */
  }, {
    key: 'animate',
    value: function animate(_ref4) {
      var _this11 = this;

      var from = _ref4.from;
      var to = _ref4.to;
      var duration = _ref4.duration;
      var step = _ref4.step;

      var progress = undefined;
      var start = this.getTime();

      var swing = function swing(progress) {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      };

      var update = function update() {
        if (!_this11.minimap) {
          return;
        }

        var passed = _this11.getTime() - start;
        if (duration === 0) {
          progress = 1;
        } else {
          progress = passed / duration;
        }
        if (progress > 1) {
          progress = 1;
        }
        var delta = swing(progress);
        step(from + (to - from) * delta);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      update();
    }
  }], [{
    key: 'registerViewProvider',

    /**
     * The method that registers the MinimapElement factory in the
     * `atom.views` registry with the Minimap model.
     */
    value: function registerViewProvider(Minimap) {
      atom.views.addViewProvider(Minimap, function (model) {
        var element = new MinimapElement();
        element.setModel(model);
        return element;
      });
    }
  }]);

  var _MinimapElement = MinimapElement;
  MinimapElement = (0, _decoratorsInclude2['default'])(_mixinsDomStylesReader2['default'], _mixinsCanvasDrawer2['default'], _atomUtils.EventsDelegation, _atomUtils.AncestorsMethods)(MinimapElement) || MinimapElement;
  MinimapElement = (0, _decoratorsElement2['default'])('atom-text-editor-minimap')(MinimapElement) || MinimapElement;
  return MinimapElement;
})();

exports['default'] = MinimapElement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taW5pbWFwLWVsZW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFOEMsTUFBTTs7eUJBQ0gsWUFBWTs7b0JBQzVDLFFBQVE7Ozs7aUNBQ0wsc0JBQXNCOzs7O2lDQUN0QixzQkFBc0I7Ozs7cUNBQ2QsNEJBQTRCOzs7O2tDQUMvQix3QkFBd0I7Ozs7MkNBQ1Qsa0NBQWtDOzs7O0FBVDFFLFdBQVcsQ0FBQTs7QUFXWCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JkLGNBQWM7V0FBZCxjQUFjOzs7O2VBQWQsY0FBYzs7Ozs7Ozs7Ozs7Ozs7OztXQTJCakIsMkJBQUc7Ozs7Ozs7O0FBTWpCLFVBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBOzs7O0FBSXhCLFVBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFBOzs7O0FBSTlCLFVBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFBOzs7O0FBSXRCLFVBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFBOzs7Ozs7O0FBT3ZCLFVBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7Ozs7QUFJOUMsVUFBSSxDQUFDLHVCQUF1QixHQUFHLFNBQVMsQ0FBQTs7OztBQUl4QyxVQUFJLENBQUMseUJBQXlCLEdBQUcsU0FBUyxDQUFBOzs7O0FBSTFDLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUE7Ozs7QUFJakMsVUFBSSxDQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQTs7Ozs7OztBQU83QyxVQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFBOzs7O0FBSWpDLFVBQUksQ0FBQyxzQkFBc0IsR0FBRyxTQUFTLENBQUE7Ozs7QUFJdkMsVUFBSSxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQTs7OztBQUlyQyxVQUFJLENB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R0FBRyxJQUFJLENBQUEsR0FBSSxLQUFLLENBQUMsQ0FBQTs7QUFFaEMsWUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFO0FBQUUsK0JBQXFCLENBQUMsTUFBTSxDQUFDLENBQUE7U0FBRTtPQUNwRCxDQUFBOztBQUVELFlBQU0sRUFBRSxDQUFBO0tBQ1Q7Ozs7Ozs7O1dBOXRDMkIsOEJBQUMsT0FBTyxFQUFFO0FBQ3BDLFVBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssRUFBRTtBQUNuRCxZQUFJLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFBO0FBQ2xDLGVBQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDdkIsZUFBTyxPQUFPLENBQUE7T0FDZixDQUFDLENBQUE7S0FDSDs7O3dCQVprQixjQUFjO0FBQWQsZ0JBQWMsR0FEbEMsa0tBQTBFLENBQ3RELGNBQWMsS0FBZCxjQUFjO0FBQWQsZ0JBQWMsR0FGbEMsb0NBQVEsMEJBQTBCLENBQUMsQ0FFZixjQUFjLEtBQWQsY0FBYztTQUFkLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taW5pbWFwLWVsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge0V2ZW50c0RlbGVnYXRpb24sIEFuY2VzdG9yc01ldGhvZHN9IGZyb20gJ2F0b20tdXRpbHMnXG5pbXBvcnQgTWFpbiBmcm9tICcuL21haW4nXG5pbXBvcnQgaW5jbHVkZSBmcm9tICcuL2RlY29yYXRvcnMvaW5jbHVkZSdcbmltcG9ydCBlbGVtZW50IGZyb20gJy4vZGVjb3JhdG9ycy9lbGVtZW50J1xuaW1wb3J0IERPTVN0eWxlc1JlYWRlciBmcm9tICcuL21peGlucy9kb20tc3R5bGVzLXJlYWRlcidcbmltcG9ydCBDYW52YXNEcmF3ZXIgZnJvbSAnLi9taXhpbnMvY2FudmFzLWRyYXdlcidcbmltcG9ydCBNaW5pbWFwUXVpY2tTZXR0aW5nc0VsZW1lbnQgZnJvbSAnLi9taW5pbWFwLXF1aWNrLXNldHRpbmdzLWVsZW1lbnQnXG5cbmNvbnN0IFNQRUNfTU9ERSA9IGF0b20uaW5TcGVjTW9kZSgpXG5cbi8qKlxuICogUHVibGljOiBUaGUgTWluaW1hcEVsZW1lbnQgaXMgdGhlIHZpZXcgbWVhbnQgdG8gcmVuZGVyIGEge0BsaW5rIE1pbmltYXB9XG4gKiBpbnN0YW5jZSBpbiB0aGUgRE9NLlxuICpcbiAqIFlvdSBjYW4gcmV0cmlldmUgdGhlIE1pbmltYXBFbGVtZW50IGFzc29jaWF0ZWQgdG8gYSBNaW5pbWFwXG4gKiB1c2luZyB0aGUgYGF0b20udmlld3MuZ2V0Vmlld2AgbWV0aG9kLlxuICpcbiAqIE5vdGUgdGhhdCBtb3N0IGludGVyYWN0aW9ucyB3aXRoIHRoZSBNaW5pbWFwIHBhY2thZ2UgaXMgZG9uZSB0aHJvdWdoIHRoZVxuICogTWluaW1hcCBtb2RlbCBzbyB5b3Ugc2hvdWxkIG5ldmVyIGhhdmUgdG8gYWNjZXNzIE1pbmltYXBFbGVtZW50XG4gKiBpbnN0YW5jZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGxldCBtaW5pbWFwRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhtaW5pbWFwKVxuICovXG5AZWxlbWVudCgnYXRvbS10ZXh0LWVkaXRvci1taW5pbWFwJylcbkBpbmNsdWRlKERPTVN0eWxlc1JlYWRlciwgQ2FudmFzRHJhd2VyLCBFdmVudHNEZWxlZ2F0aW9uLCBBbmNlc3RvcnNNZXRob2RzKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWluaW1hcEVsZW1lbnQge1xuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHRoYXQgcmVnaXN0ZXJzIHRoZSBNaW5pbWFwRWxlbWVudCBmYWN0b3J5IGluIHRoZVxuICAgKiBgYXRvbS52aWV3c2AgcmVnaXN0cnkgd2l0aCB0aGUgTWluaW1hcCBtb2RlbC5cbiAgICovXG4gIHN0YXRpYyByZWdpc3RlclZpZXdQcm92aWRlciAoTWluaW1hcCkge1xuICAgIGF0b20udmlld3MuYWRkVmlld1Byb3ZpZGVyKE1pbmltYXAsIGZ1bmN0aW9uIChtb2RlbCkge1xuICAgICAgbGV0IGVsZW1lbnQgPSBuZXcgTWluaW1hcEVsZW1lbnQoKVxuICAgICAgZWxlbWVudC5zZXRNb2RlbChtb2RlbClcbiAgICAgIHJldHVybiBlbGVtZW50XG4gICAgfSlcbiAgfVxuXG4gIC8vICAgICMjICAgICAjIyAgIyMjIyMjIyAgICMjIyMjIyMgICMjICAgICMjICAjIyMjIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAjIyAgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyMgIyMgICMjICAgIyNcbiAgLy8gICAgIyMjIyMjIyMjICMjICAgICAjIyAjIyAgICAgIyMgIyMjIyMgICAgICMjIyMjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgIyMgICAgICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgICMjICAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgICMjIyMjIyMgICAjIyMjIyMjICAjIyAgICAjIyAgIyMjIyMjXG5cbiAgLyoqXG4gICAqIERPTSBjYWxsYmFjayBpbnZva2VkIHdoZW4gYSBuZXcgTWluaW1hcEVsZW1lbnQgaXMgY3JlYXRlZC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjcmVhdGVkQ2FsbGJhY2sgKCkge1xuICAgIC8vIENvcmUgcHJvcGVydGllc1xuXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5taW5pbWFwID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5lZGl0b3JFbGVtZW50ID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy53aWR0aCA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gdW5kZWZpbmVkXG5cbiAgICAvLyBTdWJzY3JpcHRpb25zXG5cbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy52aXNpYmxlQXJlYVN1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucXVpY2tTZXR0aW5nc1N1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZHJhZ1N1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMub3BlblF1aWNrU2V0dGluZ1N1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZFxuXG4gICAgLy8gQ29uZmlnc1xuXG4gICAgLyoqXG4gICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAqL1xuICAgIHRoaXMuZGlzcGxheU1pbmltYXBPbkxlZnQgPSBmYWxzZVxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLm1pbmltYXBTY3JvbGxJbmRpY2F0b3IgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy5kaXNwbGF5TWluaW1hcE9uTGVmdCA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLmRpc3BsYXlQbHVnaW5zQ29udHJvbHMgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy50ZXh0T3BhY2l0eSA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLmRpc3BsYXlDb2RlSGlnaGxpZ2h0cyA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLmFkanVzdFRvU29mdFdyYXAgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy51c2VIYXJkd2FyZUFjY2VsZXJhdGlvbiA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLmFic29sdXRlTW9kZSA9IHVuZGVmaW5lZFxuXG4gICAgLy8gRWxlbWVudHNcblxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc2hhZG93Um9vdCA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMudmlzaWJsZUFyZWEgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbnRyb2xzID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zY3JvbGxJbmRpY2F0b3IgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLm9wZW5RdWlja1NldHRpbmdzID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5xdWlja1NldHRpbmdzRWxlbWVudCA9IHVuZGVmaW5lZFxuXG4gICAgLy8gU3RhdGVzXG5cbiAgICAvKipcbiAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICovXG4gICAgdGhpcy5hdHRhY2hlZCA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgKi9cbiAgICB0aGlzLmF0dGFjaGVkVG9UZXh0RWRpdG9yID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAqL1xuICAgIHRoaXMuc3RhbmRBbG9uZSA9IHVuZGVmaW5lZFxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMud2FzVmlzaWJsZSA9IHVuZGVmaW5lZFxuXG4gICAgLy8gT3RoZXJcblxuICAgIC8qKlxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMub2Zmc2NyZWVuRmlyc3RSb3cgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLm9mZnNjcmVlbkxhc3RSb3cgPSB1bmRlZmluZWRcbiAgICAvKipcbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmZyYW1lUmVxdWVzdGVkID0gdW5kZWZpbmVkXG4gICAgLyoqXG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5mbGV4QmFzaXMgPSB1bmRlZmluZWRcblxuICAgIHRoaXMuaW5pdGlhbGl6ZUNvbnRlbnQoKVxuXG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZUNvbmZpZyh7XG4gICAgICAnbWluaW1hcC5kaXNwbGF5TWluaW1hcE9uTGVmdCc6IChkaXNwbGF5TWluaW1hcE9uTGVmdCkgPT4ge1xuICAgICAgICB0aGlzLmRpc3BsYXlNaW5pbWFwT25MZWZ0ID0gZGlzcGxheU1pbmltYXBPbkxlZnRcblxuICAgICAgICB0aGlzLnVwZGF0ZU1pbmltYXBGbGV4UG9zaXRpb24oKVxuICAgICAgfSxcblxuICAgICAgJ21pbmltYXAubWluaW1hcFNjcm9sbEluZGljYXRvcic6IChtaW5pbWFwU2Nyb2xsSW5kaWNhdG9yKSA9PiB7XG4gICAgICAgIHRoaXMubWluaW1hcFNjcm9sbEluZGljYXRvciA9IG1pbmltYXBTY3JvbGxJbmRpY2F0b3JcblxuICAgICAgICBpZiAodGhpcy5taW5pbWFwU2Nyb2xsSW5kaWNhdG9yICYmICEodGhpcy5zY3JvbGxJbmRpY2F0b3IgIT0gbnVsbCkgJiYgIXRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNjcm9sbEluZGljYXRvcigpXG4gICAgICAgIH0gZWxzZSBpZiAoKHRoaXMuc2Nyb2xsSW5kaWNhdG9yICE9IG51bGwpKSB7XG4gICAgICAgICAgdGhpcy5kaXNwb3NlU2Nyb2xsSW5kaWNhdG9yKClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7IHRoaXMucmVxdWVzdFVwZGF0ZSgpIH1cbiAgICAgIH0sXG5cbiAgICAgICdtaW5pbWFwLmRpc3BsYXlQbHVnaW5zQ29udHJvbHMnOiAoZGlzcGxheVBsdWdpbnNDb250cm9scykgPT4ge1xuICAgICAgICB0aGlzLmRpc3BsYXlQbHVnaW5zQ29udHJvbHMgPSBkaXNwbGF5UGx1Z2luc0NvbnRyb2xzXG5cbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheVBsdWdpbnNDb250cm9scyAmJiAhKHRoaXMub3BlblF1aWNrU2V0dGluZ3MgIT0gbnVsbCkgJiYgIXRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZU9wZW5RdWlja1NldHRpbmdzKClcbiAgICAgICAgfSBlbHNlIGlmICgodGhpcy5vcGVuUXVpY2tTZXR0aW5ncyAhPSBudWxsKSkge1xuICAgICAgICAgIHRoaXMuZGlzcG9zZU9wZW5RdWlja1NldHRpbmdzKClcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgJ21pbmltYXAudGV4dE9wYWNpdHknOiAodGV4dE9wYWNpdHkpID0+IHtcbiAgICAgICAgdGhpcy50ZXh0T3BhY2l0eSA9IHRleHRPcGFjaXR5XG5cbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoZWQpIHsgdGhpcy5yZXF1ZXN0Rm9yY2VkVXBkYXRlKCkgfVxuICAgICAgfSxcblxuICAgICAgJ21pbmltYXAuZGlzcGxheUNvZGVIaWdobGlnaHRzJzogKGRpc3BsYXlDb2RlSGlnaGxpZ2h0cykgPT4ge1xuICAgICAgICB0aGlzLmRpc3BsYXlDb2RlSGlnaGxpZ2h0cyA9IGRpc3BsYXlDb2RlSGlnaGxpZ2h0c1xuXG4gICAgICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7IHRoaXMucmVxdWVzdEZvcmNlZFVwZGF0ZSgpIH1cbiAgICAgIH0sXG5cbiAgICAgICdtaW5pbWFwLnNtb290aFNjcm9sbGluZyc6IChzbW9vdGhTY3JvbGxpbmcpID0+IHtcbiAgICAgICAgdGhpcy5zbW9vdGhTY3JvbGxpbmcgPSBzbW9vdGhTY3JvbGxpbmdcblxuICAgICAgICBpZiAodGhpcy5hdHRhY2hlZCkge1xuICAgICAgICAgIGlmICghdGhpcy5zbW9vdGhTY3JvbGxpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuYmFja0xheWVyLmNhbnZhcy5zdHlsZS5jc3NUZXh0ID0gJydcbiAgICAgICAgICAgIHRoaXMudG9rZW5zTGF5ZXIuY2FudmFzLnN0eWxlLmNzc1RleHQgPSAnJ1xuICAgICAgICAgICAgdGhpcy5mcm9udExheWVyLmNhbnZhcy5zdHlsZS5jc3NUZXh0ID0gJydcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0VXBkYXRlKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgICdtaW5pbWFwLmFkanVzdE1pbmltYXBXaWR0aFRvU29mdFdyYXAnOiAoYWRqdXN0VG9Tb2Z0V3JhcCkgPT4ge1xuICAgICAgICB0aGlzLmFkanVzdFRvU29mdFdyYXAgPSBhZGp1c3RUb1NvZnRXcmFwXG5cbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoZWQpIHsgdGhpcy5tZWFzdXJlSGVpZ2h0QW5kV2lkdGgoKSB9XG4gICAgICB9LFxuXG4gICAgICAnbWluaW1hcC51c2VIYXJkd2FyZUFjY2VsZXJhdGlvbic6ICh1c2VIYXJkd2FyZUFjY2VsZXJhdGlvbikgPT4ge1xuICAgICAgICB0aGlzLnVzZUhhcmR3YXJlQWNjZWxlcmF0aW9uID0gdXNlSGFyZHdhcmVBY2NlbGVyYXRpb25cblxuICAgICAgICBpZiAodGhpcy5hdHRhY2hlZCkgeyB0aGlzLnJlcXVlc3RVcGRhdGUoKSB9XG4gICAgICB9LFxuXG4gICAgICAnbWluaW1hcC5hYnNvbHV0ZU1vZGUnOiAoYWJzb2x1dGVNb2RlKSA9PiB7XG4gICAgICAgIHRoaXMuYWJzb2x1dGVNb2RlID0gYWJzb2x1dGVNb2RlXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnYWJzb2x1dGUnLCB0aGlzLmFic29sdXRlTW9kZSlcbiAgICAgIH0sXG5cbiAgICAgICdlZGl0b3IucHJlZmVycmVkTGluZUxlbmd0aCc6ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoZWQpIHsgdGhpcy5tZWFzdXJlSGVpZ2h0QW5kV2lkdGgoKSB9XG4gICAgICB9LFxuXG4gICAgICAnZWRpdG9yLnNvZnRXcmFwJzogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hdHRhY2hlZCkgeyB0aGlzLnJlcXVlc3RVcGRhdGUoKSB9XG4gICAgICB9LFxuXG4gICAgICAnZWRpdG9yLnNvZnRXcmFwQXRQcmVmZXJyZWRMaW5lTGVuZ3RoJzogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hdHRhY2hlZCkgeyB0aGlzLnJlcXVlc3RVcGRhdGUoKSB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBET00gY2FsbGJhY2sgaW52b2tlZCB3aGVuIGEgbmV3IE1pbmltYXBFbGVtZW50IGlzIGF0dGFjaGVkIHRvIHRoZSBET00uXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgYXR0YWNoZWRDYWxsYmFjayAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLnZpZXdzLnBvbGxEb2N1bWVudCgoKSA9PiB7IHRoaXMucG9sbERPTSgpIH0pKVxuICAgIHRoaXMubWVhc3VyZUhlaWdodEFuZFdpZHRoKClcbiAgICB0aGlzLnVwZGF0ZU1pbmltYXBGbGV4UG9zaXRpb24oKVxuICAgIHRoaXMuYXR0YWNoZWQgPSB0cnVlXG4gICAgdGhpcy5hdHRhY2hlZFRvVGV4dEVkaXRvciA9IHRoaXMucGFyZW50Tm9kZSA9PT0gdGhpcy5nZXRUZXh0RWRpdG9yRWxlbWVudFJvb3QoKVxuXG4gICAgLypcbiAgICAgIFdlIHVzZSBgYXRvbS5zdHlsZXMub25EaWRBZGRTdHlsZUVsZW1lbnRgIGluc3RlYWQgb2ZcbiAgICAgIGBhdG9tLnRoZW1lcy5vbkRpZENoYW5nZUFjdGl2ZVRoZW1lc2AuXG4gICAgICBXaHk/IEN1cnJlbnRseSwgVGhlIHN0eWxlIGVsZW1lbnQgd2lsbCBiZSByZW1vdmVkIGZpcnN0LCBhbmQgdGhlbiByZS1hZGRlZFxuICAgICAgYW5kIHRoZSBgY2hhbmdlYCBldmVudCBoYXMgbm90IGJlIHRyaWdnZXJlZCBpbiB0aGUgcHJvY2Vzcy5cbiAgICAqL1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5zdHlsZXMub25EaWRBZGRTdHlsZUVsZW1lbnQoKCkgPT4ge1xuICAgICAgdGhpcy5pbnZhbGlkYXRlRE9NU3R5bGVzQ2FjaGUoKVxuICAgICAgdGhpcy5yZXF1ZXN0Rm9yY2VkVXBkYXRlKClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5zdWJzY3JpYmVUb01lZGlhUXVlcnkoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBET00gY2FsbGJhY2sgaW52b2tlZCB3aGVuIGEgbmV3IE1pbmltYXBFbGVtZW50IGlzIGRldGFjaGVkIGZyb20gdGhlIERPTS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkZXRhY2hlZENhbGxiYWNrICgpIHtcbiAgICB0aGlzLmF0dGFjaGVkID0gZmFsc2VcbiAgfVxuXG4gIC8vICAgICAgICMjIyAgICAjIyMjIyMjIyAjIyMjIyMjIyAgICAjIyMgICAgICMjIyMjIyAgIyMgICAgICMjXG4gIC8vICAgICAgIyMgIyMgICAgICAjIyAgICAgICAjIyAgICAgICMjICMjICAgIyMgICAgIyMgIyMgICAgICMjXG4gIC8vICAgICAjIyAgICMjICAgICAjIyAgICAgICAjIyAgICAgIyMgICAjIyAgIyMgICAgICAgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAgICAjIyAgICAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMjIyMjIyMjXG4gIC8vICAgICMjIyMjIyMjIyAgICAjIyAgICAgICAjIyAgICAjIyMjIyMjIyMgIyMgICAgICAgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAgICAjIyAgICAgICAjIyAgICAjIyAgICAgIyMgIyMgICAgIyMgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAgICAjIyAgICAgICAjIyAgICAjIyAgICAgIyMgICMjIyMjIyAgIyMgICAgICMjXG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciB0aGUgTWluaW1hcEVsZW1lbnQgaXMgY3VycmVudGx5IHZpc2libGUgb24gc2NyZWVuIG9yIG5vdC5cbiAgICpcbiAgICogVGhlIHZpc2liaWxpdHkgb2YgdGhlIG1pbmltYXAgaXMgZGVmaW5lZCBieSB0ZXN0aW5nIHRoZSBzaXplIG9mIHRoZSBvZmZzZXRcbiAgICogd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgZWxlbWVudC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGUgTWluaW1hcEVsZW1lbnQgaXMgY3VycmVudGx5IHZpc2libGUgb3Igbm90XG4gICAqL1xuICBpc1Zpc2libGUgKCkgeyByZXR1cm4gdGhpcy5vZmZzZXRXaWR0aCA+IDAgfHwgdGhpcy5vZmZzZXRIZWlnaHQgPiAwIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhlIE1pbmltYXBFbGVtZW50IHRvIHRoZSBET00uXG4gICAqXG4gICAqIFRoZSBwb3NpdGlvbiBhdCB3aGljaCB0aGUgZWxlbWVudCBpcyBhdHRhY2hlZCBpcyBkZWZpbmVkIGJ5IHRoZVxuICAgKiBgZGlzcGxheU1pbmltYXBPbkxlZnRgIHNldHRpbmcuXG4gICAqXG4gICAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBbcGFyZW50XSB0aGUgRE9NIG5vZGUgd2hlcmUgYXR0YWNoaW5nIHRoZSBtaW5pbWFwXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50XG4gICAqL1xuICBhdHRhY2ggKHBhcmVudCkge1xuICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7IHJldHVybiB9XG4gICAgKHBhcmVudCB8fCB0aGlzLmdldFRleHRFZGl0b3JFbGVtZW50Um9vdCgpKS5hcHBlbmRDaGlsZCh0aGlzKVxuICB9XG5cbiAgLyoqXG4gICAqIERldGFjaGVzIHRoZSBNaW5pbWFwRWxlbWVudCBmcm9tIHRoZSBET00uXG4gICAqL1xuICBkZXRhY2ggKCkge1xuICAgIGlmICghdGhpcy5hdHRhY2hlZCB8fCB0aGlzLnBhcmVudE5vZGUgPT0gbnVsbCkgeyByZXR1cm4gfVxuICAgIHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIG1pbmltYXAgbGVmdC9yaWdodCBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgdmFsdWUgb2YgdGhlXG4gICAqIGBkaXNwbGF5TWluaW1hcE9uTGVmdGAgc2V0dGluZy5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICB1cGRhdGVNaW5pbWFwRmxleFBvc2l0aW9uICgpIHtcbiAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2xlZnQnLCB0aGlzLmRpc3BsYXlNaW5pbWFwT25MZWZ0KVxuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoaXMgTWluaW1hcEVsZW1lbnRcbiAgICovXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLmRldGFjaCgpXG4gICAgdGhpcy5taW5pbWFwID0gbnVsbFxuICB9XG5cbiAgLy8gICAgICMjIyMjIyAgICMjIyMjIyMgICMjICAgICMjICMjIyMjIyMjICMjIyMjIyMjICMjICAgICMjICMjIyMjIyMjXG4gIC8vICAgICMjICAgICMjICMjICAgICAjIyAjIyMgICAjIyAgICAjIyAgICAjIyAgICAgICAjIyMgICAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMjIyAgIyMgICAgIyMgICAgIyMgICAgICAgIyMjIyAgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICAgIyMgICAgICMjICMjICMjICMjICAgICMjICAgICMjIyMjIyAgICMjICMjICMjICAgICMjXG4gIC8vICAgICMjICAgICAgICMjICAgICAjIyAjIyAgIyMjIyAgICAjIyAgICAjIyAgICAgICAjIyAgIyMjIyAgICAjI1xuICAvLyAgICAjIyAgICAjIyAjIyAgICAgIyMgIyMgICAjIyMgICAgIyMgICAgIyMgICAgICAgIyMgICAjIyMgICAgIyNcbiAgLy8gICAgICMjIyMjIyAgICMjIyMjIyMgICMjICAgICMjICAgICMjICAgICMjIyMjIyMjICMjICAgICMjICAgICMjXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIE1pbmltYXBFbGVtZW50IGFuZCBhdHRhY2hlcyB0aGUgbW91c2UgY29udHJvbFxuICAgKiBldmVudCBsaXN0ZW5lcnMuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgaW5pdGlhbGl6ZUNvbnRlbnQgKCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZUNhbnZhcygpXG5cbiAgICB0aGlzLnNoYWRvd1Jvb3QgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKVxuICAgIHRoaXMuYXR0YWNoQ2FudmFzZXModGhpcy5zaGFkb3dSb290KVxuXG4gICAgdGhpcy5jcmVhdGVWaXNpYmxlQXJlYSgpXG4gICAgdGhpcy5jcmVhdGVDb250cm9scygpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuc3Vic2NyaWJlVG8odGhpcywge1xuICAgICAgJ21vdXNld2hlZWwnOiAoZSkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgICAgIHRoaXMucmVsYXlNb3VzZXdoZWVsRXZlbnQoZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnN1YnNjcmliZVRvKHRoaXMuZ2V0RnJvbnRDYW52YXMoKSwge1xuICAgICAgJ21vdXNlZG93bic6IChlKSA9PiB7IHRoaXMuY2FudmFzUHJlc3NlZCh0aGlzLmV4dHJhY3RNb3VzZUV2ZW50RGF0YShlKSkgfSxcbiAgICAgICd0b3VjaHN0YXJ0JzogKGUpID0+IHsgdGhpcy5jYW52YXNQcmVzc2VkKHRoaXMuZXh0cmFjdFRvdWNoRXZlbnREYXRhKGUpKSB9XG4gICAgfSkpXG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIHZpc2libGUgYXJlYSBkaXYuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY3JlYXRlVmlzaWJsZUFyZWEgKCkge1xuICAgIGlmICh0aGlzLnZpc2libGVBcmVhKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLnZpc2libGVBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLnZpc2libGVBcmVhLmNsYXNzTGlzdC5hZGQoJ21pbmltYXAtdmlzaWJsZS1hcmVhJylcbiAgICB0aGlzLnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQodGhpcy52aXNpYmxlQXJlYSlcbiAgICB0aGlzLnZpc2libGVBcmVhU3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpYmVUbyh0aGlzLnZpc2libGVBcmVhLCB7XG4gICAgICAnbW91c2Vkb3duJzogKGUpID0+IHsgdGhpcy5zdGFydERyYWcodGhpcy5leHRyYWN0TW91c2VFdmVudERhdGEoZSkpIH0sXG4gICAgICAndG91Y2hzdGFydCc6IChlKSA9PiB7IHRoaXMuc3RhcnREcmFnKHRoaXMuZXh0cmFjdFRvdWNoRXZlbnREYXRhKGUpKSB9XG4gICAgfSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy52aXNpYmxlQXJlYVN1YnNjcmlwdGlvbilcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSB2aXNpYmxlIGFyZWEgZGl2LlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHJlbW92ZVZpc2libGVBcmVhICgpIHtcbiAgICBpZiAoIXRoaXMudmlzaWJsZUFyZWEpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUodGhpcy52aXNpYmxlQXJlYVN1YnNjcmlwdGlvbilcbiAgICB0aGlzLnZpc2libGVBcmVhU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIHRoaXMuc2hhZG93Um9vdC5yZW1vdmVDaGlsZCh0aGlzLnZpc2libGVBcmVhKVxuICAgIGRlbGV0ZSB0aGlzLnZpc2libGVBcmVhXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgY29udHJvbHMgY29udGFpbmVyIGRpdi5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjcmVhdGVDb250cm9scyAoKSB7XG4gICAgaWYgKHRoaXMuY29udHJvbHMgfHwgdGhpcy5zdGFuZEFsb25lKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLmNvbnRyb2xzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLmNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ21pbmltYXAtY29udHJvbHMnKVxuICAgIHRoaXMuc2hhZG93Um9vdC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGNvbnRyb2xzIGNvbnRhaW5lciBkaXYuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgcmVtb3ZlQ29udHJvbHMgKCkge1xuICAgIGlmICghdGhpcy5jb250cm9scykgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5zaGFkb3dSb290LnJlbW92ZUNoaWxkKHRoaXMuY29udHJvbHMpXG4gICAgZGVsZXRlIHRoaXMuY29udHJvbHNcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgc2Nyb2xsIGluZGljYXRvciBkaXYgd2hlbiB0aGUgYG1pbmltYXBTY3JvbGxJbmRpY2F0b3JgXG4gICAqIHNldHRpbmdzIGlzIGVuYWJsZWQuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgaW5pdGlhbGl6ZVNjcm9sbEluZGljYXRvciAoKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsSW5kaWNhdG9yIHx8IHRoaXMuc3RhbmRBbG9uZSkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5zY3JvbGxJbmRpY2F0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuc2Nyb2xsSW5kaWNhdG9yLmNsYXNzTGlzdC5hZGQoJ21pbmltYXAtc2Nyb2xsLWluZGljYXRvcicpXG4gICAgdGhpcy5jb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLnNjcm9sbEluZGljYXRvcilcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlcyB0aGUgc2Nyb2xsIGluZGljYXRvciBkaXYgd2hlbiB0aGUgYG1pbmltYXBTY3JvbGxJbmRpY2F0b3JgXG4gICAqIHNldHRpbmdzIGlzIGRpc2FibGVkLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGRpc3Bvc2VTY3JvbGxJbmRpY2F0b3IgKCkge1xuICAgIGlmICghdGhpcy5zY3JvbGxJbmRpY2F0b3IpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuY29udHJvbHMucmVtb3ZlQ2hpbGQodGhpcy5zY3JvbGxJbmRpY2F0b3IpXG4gICAgZGVsZXRlIHRoaXMuc2Nyb2xsSW5kaWNhdG9yXG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIHF1aWNrIHNldHRpbmdzIG9wZW5lbmVyIGRpdiB3aGVuIHRoZVxuICAgKiBgZGlzcGxheVBsdWdpbnNDb250cm9sc2Agc2V0dGluZyBpcyBlbmFibGVkLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGluaXRpYWxpemVPcGVuUXVpY2tTZXR0aW5ncyAoKSB7XG4gICAgaWYgKHRoaXMub3BlblF1aWNrU2V0dGluZ3MgfHwgdGhpcy5zdGFuZEFsb25lKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLm9wZW5RdWlja1NldHRpbmdzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLm9wZW5RdWlja1NldHRpbmdzLmNsYXNzTGlzdC5hZGQoJ29wZW4tbWluaW1hcC1xdWljay1zZXR0aW5ncycpXG4gICAgdGhpcy5jb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLm9wZW5RdWlja1NldHRpbmdzKVxuXG4gICAgdGhpcy5vcGVuUXVpY2tTZXR0aW5nU3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpYmVUbyh0aGlzLm9wZW5RdWlja1NldHRpbmdzLCB7XG4gICAgICAnbW91c2Vkb3duJzogKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICBpZiAoKHRoaXMucXVpY2tTZXR0aW5nc0VsZW1lbnQgIT0gbnVsbCkpIHtcbiAgICAgICAgICB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50LmRlc3Ryb3koKVxuICAgICAgICAgIHRoaXMucXVpY2tTZXR0aW5nc1N1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50ID0gbmV3IE1pbmltYXBRdWlja1NldHRpbmdzRWxlbWVudCgpXG4gICAgICAgICAgdGhpcy5xdWlja1NldHRpbmdzRWxlbWVudC5zZXRNb2RlbCh0aGlzKVxuICAgICAgICAgIHRoaXMucXVpY2tTZXR0aW5nc1N1YnNjcmlwdGlvbiA9IHRoaXMucXVpY2tTZXR0aW5nc0VsZW1lbnQub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucXVpY2tTZXR0aW5nc0VsZW1lbnQgPSBudWxsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGxldCB7dG9wLCBsZWZ0LCByaWdodH0gPSB0aGlzLmdldEZyb250Q2FudmFzKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50LnN0eWxlLnRvcCA9IHRvcCArICdweCdcbiAgICAgICAgICB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50LmF0dGFjaCgpXG5cbiAgICAgICAgICBpZiAodGhpcy5kaXNwbGF5TWluaW1hcE9uTGVmdCkge1xuICAgICAgICAgICAgdGhpcy5xdWlja1NldHRpbmdzRWxlbWVudC5zdHlsZS5sZWZ0ID0gKHJpZ2h0KSArICdweCdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5xdWlja1NldHRpbmdzRWxlbWVudC5zdHlsZS5sZWZ0ID0gKGxlZnQgLSB0aGlzLnF1aWNrU2V0dGluZ3NFbGVtZW50LmNsaWVudFdpZHRoKSArICdweCdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIERpc3Bvc2VzIHRoZSBxdWljayBzZXR0aW5ncyBvcGVuZW5lciBkaXYgd2hlbiB0aGUgYGRpc3BsYXlQbHVnaW5zQ29udHJvbHNgXG4gICAqIHNldHRpbmcgaXMgZGlzYWJsZWQuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZGlzcG9zZU9wZW5RdWlja1NldHRpbmdzICgpIHtcbiAgICBpZiAoIXRoaXMub3BlblF1aWNrU2V0dGluZ3MpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuY29udHJvbHMucmVtb3ZlQ2hpbGQodGhpcy5vcGVuUXVpY2tTZXR0aW5ncylcbiAgICB0aGlzLm9wZW5RdWlja1NldHRpbmdTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgZGVsZXRlIHRoaXMub3BlblF1aWNrU2V0dGluZ3NcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0YXJnZXQgYFRleHRFZGl0b3JgIG9mIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtUZXh0RWRpdG9yfSB0aGUgbWluaW1hcCdzIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yICgpIHsgcmV0dXJuIHRoaXMubWluaW1hcC5nZXRUZXh0RWRpdG9yKCkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGV4dEVkaXRvckVsZW1lbnRgIGZvciB0aGUgTWluaW1hcCdzIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHJldHVybiB7VGV4dEVkaXRvckVsZW1lbnR9IHRoZSBtaW5pbWFwJ3MgdGV4dCBlZGl0b3IgZWxlbWVudFxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvckVsZW1lbnQgKCkge1xuICAgIGlmICh0aGlzLmVkaXRvckVsZW1lbnQpIHsgcmV0dXJuIHRoaXMuZWRpdG9yRWxlbWVudCB9XG5cbiAgICB0aGlzLmVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5nZXRUZXh0RWRpdG9yKCkpXG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yRWxlbWVudFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvb3Qgb2YgdGhlIGBUZXh0RWRpdG9yRWxlbWVudGAgY29udGVudC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgbW9zdGx5IHVzZWQgdG8gZW5zdXJlIGNvbXBhdGliaWxpdHkgd2l0aCB0aGUgYHNoYWRvd0RvbWBcbiAgICogc2V0dGluZy5cbiAgICpcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9IHRoZSByb290IG9mIHRoZSBgVGV4dEVkaXRvckVsZW1lbnRgIGNvbnRlbnRcbiAgICovXG4gIGdldFRleHRFZGl0b3JFbGVtZW50Um9vdCAoKSB7XG4gICAgbGV0IGVkaXRvckVsZW1lbnQgPSB0aGlzLmdldFRleHRFZGl0b3JFbGVtZW50KClcblxuICAgIGlmIChlZGl0b3JFbGVtZW50LnNoYWRvd1Jvb3QpIHtcbiAgICAgIHJldHVybiBlZGl0b3JFbGVtZW50LnNoYWRvd1Jvb3RcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGVkaXRvckVsZW1lbnRcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcm9vdCB3aGVyZSB0byBpbmplY3QgdGhlIGR1bW15IG5vZGUgdXNlZCB0byByZWFkIERPTSBzdHlsZXMuXG4gICAqXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IHNoYWRvd1Jvb3Qgd2hldGhlciB0byB1c2UgdGhlIHRleHQgZWRpdG9yIHNoYWRvdyBET01cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvciBub3RcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9IHRoZSByb290IG5vZGUgd2hlcmUgYXBwZW5kaW5nIHRoZSBkdW1teSBub2RlXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZ2V0RHVtbXlET01Sb290IChzaGFkb3dSb290KSB7XG4gICAgaWYgKHNoYWRvd1Jvb3QpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFRleHRFZGl0b3JFbGVtZW50Um9vdCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFRleHRFZGl0b3JFbGVtZW50KClcbiAgICB9XG4gIH1cblxuICAvLyAgICAjIyAgICAgIyMgICMjIyMjIyMgICMjIyMjIyMjICAjIyMjIyMjIyAjI1xuICAvLyAgICAjIyMgICAjIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjI1xuICAvLyAgICAjIyMjICMjIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjI1xuICAvLyAgICAjIyAjIyMgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyMjIyMgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgICMjIyMjIyMgICMjIyMjIyMjICAjIyMjIyMjIyAjIyMjIyMjI1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBNaW5pbWFwIGZvciB3aGljaCB0aGlzIE1pbmltYXBFbGVtZW50IHdhcyBjcmVhdGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtNaW5pbWFwfSB0aGlzIGVsZW1lbnQncyBNaW5pbWFwXG4gICAqL1xuICBnZXRNb2RlbCAoKSB7IHJldHVybiB0aGlzLm1pbmltYXAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHRoZSBNaW5pbWFwIG1vZGVsIGZvciB0aGlzIE1pbmltYXBFbGVtZW50IGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtNaW5pbWFwfSBtaW5pbWFwIHRoZSBNaW5pbWFwIG1vZGVsIGZvciB0aGlzIGluc3RhbmNlLlxuICAgKiBAcmV0dXJuIHtNaW5pbWFwfSB0aGlzIGVsZW1lbnQncyBNaW5pbWFwXG4gICAqL1xuICBzZXRNb2RlbCAobWluaW1hcCkge1xuICAgIHRoaXMubWluaW1hcCA9IG1pbmltYXBcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMubWluaW1hcC5vbkRpZENoYW5nZVNjcm9sbFRvcCgoKSA9PiB7XG4gICAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5taW5pbWFwLm9uRGlkQ2hhbmdlU2Nyb2xsTGVmdCgoKSA9PiB7XG4gICAgICB0aGlzLnJlcXVlc3RVcGRhdGUoKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5taW5pbWFwLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLmRlc3Ryb3koKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5taW5pbWFwLm9uRGlkQ2hhbmdlQ29uZmlnKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7IHJldHVybiB0aGlzLnJlcXVlc3RGb3JjZWRVcGRhdGUoKSB9XG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMubWluaW1hcC5vbkRpZENoYW5nZVN0YW5kQWxvbmUoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGFuZEFsb25lKHRoaXMubWluaW1hcC5pc1N0YW5kQWxvbmUoKSlcbiAgICAgIHRoaXMucmVxdWVzdFVwZGF0ZSgpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMubWluaW1hcC5vbkRpZENoYW5nZSgoY2hhbmdlKSA9PiB7XG4gICAgICB0aGlzLnBlbmRpbmdDaGFuZ2VzLnB1c2goY2hhbmdlKVxuICAgICAgdGhpcy5yZXF1ZXN0VXBkYXRlKClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5taW5pbWFwLm9uRGlkQ2hhbmdlRGVjb3JhdGlvblJhbmdlKChjaGFuZ2UpID0+IHtcbiAgICAgIGNvbnN0IHt0eXBlfSA9IGNoYW5nZVxuICAgICAgaWYgKHR5cGUgPT09ICdsaW5lJyB8fCB0eXBlID09PSAnaGlnaGxpZ2h0LXVuZGVyJykge1xuICAgICAgICB0aGlzLnBlbmRpbmdCYWNrRGVjb3JhdGlvbkNoYW5nZXMucHVzaChjaGFuZ2UpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBlbmRpbmdGcm9udERlY29yYXRpb25DaGFuZ2VzLnB1c2goY2hhbmdlKVxuICAgICAgfVxuICAgICAgdGhpcy5yZXF1ZXN0VXBkYXRlKClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoTWFpbi5vbkRpZENoYW5nZVBsdWdpbk9yZGVyKCgpID0+IHtcbiAgICAgIHRoaXMucmVxdWVzdEZvcmNlZFVwZGF0ZSgpXG4gICAgfSkpXG5cbiAgICB0aGlzLnNldFN0YW5kQWxvbmUodGhpcy5taW5pbWFwLmlzU3RhbmRBbG9uZSgpKVxuXG4gICAgaWYgKHRoaXMud2lkdGggIT0gbnVsbCAmJiB0aGlzLmhlaWdodCAhPSBudWxsKSB7XG4gICAgICB0aGlzLm1pbmltYXAuc2V0U2NyZWVuSGVpZ2h0QW5kV2lkdGgodGhpcy5oZWlnaHQsIHRoaXMud2lkdGgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubWluaW1hcFxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN0YW5kLWFsb25lIG1vZGUgZm9yIHRoaXMgTWluaW1hcEVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RhbmRBbG9uZSB0aGUgbmV3IG1vZGUgZm9yIHRoaXMgTWluaW1hcEVsZW1lbnRcbiAgICovXG4gIHNldFN0YW5kQWxvbmUgKHN0YW5kQWxvbmUpIHtcbiAgICB0aGlzLnN0YW5kQWxvbmUgPSBzdGFuZEFsb25lXG5cbiAgICBpZiAodGhpcy5zdGFuZEFsb25lKSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnc3RhbmQtYWxvbmUnLCB0cnVlKVxuICAgICAgdGhpcy5kaXNwb3NlU2Nyb2xsSW5kaWNhdG9yKClcbiAgICAgIHRoaXMuZGlzcG9zZU9wZW5RdWlja1NldHRpbmdzKClcbiAgICAgIHRoaXMucmVtb3ZlQ29udHJvbHMoKVxuICAgICAgdGhpcy5yZW1vdmVWaXNpYmxlQXJlYSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdzdGFuZC1hbG9uZScpXG4gICAgICB0aGlzLmNyZWF0ZVZpc2libGVBcmVhKClcbiAgICAgIHRoaXMuY3JlYXRlQ29udHJvbHMoKVxuICAgICAgaWYgKHRoaXMubWluaW1hcFNjcm9sbEluZGljYXRvcikgeyB0aGlzLmluaXRpYWxpemVTY3JvbGxJbmRpY2F0b3IoKSB9XG4gICAgICBpZiAodGhpcy5kaXNwbGF5UGx1Z2luc0NvbnRyb2xzKSB7IHRoaXMuaW5pdGlhbGl6ZU9wZW5RdWlja1NldHRpbmdzKCkgfVxuICAgIH1cbiAgfVxuXG4gIC8vICAgICMjICAgICAjIyAjIyMjIyMjIyAgIyMjIyMjIyMgICAgICMjIyAgICAjIyMjIyMjIyAjIyMjIyMjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAgICMjICMjICAgICAgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAgIyMgICMjICAgIyMgICAgICMjICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyMjIyMjIyAgIyMgICAgICMjICMjICAgICAjIyAgICAjIyAgICAjIyMjIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAgICAjIyAgICAgIyMgIyMjIyMjIyMjICAgICMjICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgICAgIyMgICAgICMjICMjICAgICAjIyAgICAjIyAgICAjI1xuICAvLyAgICAgIyMjIyMjIyAgIyMgICAgICAgICMjIyMjIyMjICAjIyAgICAgIyMgICAgIyMgICAgIyMjIyMjIyNcblxuICAvKipcbiAgICogUmVxdWVzdHMgYW4gdXBkYXRlIHRvIGJlIHBlcmZvcm1lZCBvbiB0aGUgbmV4dCBmcmFtZS5cbiAgICovXG4gIHJlcXVlc3RVcGRhdGUgKCkge1xuICAgIGlmICh0aGlzLmZyYW1lUmVxdWVzdGVkKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLmZyYW1lUmVxdWVzdGVkID0gdHJ1ZVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICB0aGlzLmZyYW1lUmVxdWVzdGVkID0gZmFsc2VcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3RzIGFuIHVwZGF0ZSB0byBiZSBwZXJmb3JtZWQgb24gdGhlIG5leHQgZnJhbWUgdGhhdCB3aWxsIGNvbXBsZXRlbHlcbiAgICogcmVkcmF3IHRoZSBtaW5pbWFwLlxuICAgKi9cbiAgcmVxdWVzdEZvcmNlZFVwZGF0ZSAoKSB7XG4gICAgdGhpcy5vZmZzY3JlZW5GaXJzdFJvdyA9IG51bGxcbiAgICB0aGlzLm9mZnNjcmVlbkxhc3RSb3cgPSBudWxsXG4gICAgdGhpcy5yZXF1ZXN0VXBkYXRlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyB0aGUgYWN0dWFsIE1pbmltYXBFbGVtZW50IHVwZGF0ZS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICB1cGRhdGUgKCkge1xuICAgIGlmICghKHRoaXMuYXR0YWNoZWQgJiYgdGhpcy5pc1Zpc2libGUoKSAmJiB0aGlzLm1pbmltYXApKSB7IHJldHVybiB9XG4gICAgbGV0IG1pbmltYXAgPSB0aGlzLm1pbmltYXBcbiAgICBtaW5pbWFwLmVuYWJsZUNhY2hlKClcbiAgICBsZXQgY2FudmFzID0gdGhpcy5nZXRGcm9udENhbnZhcygpXG5cbiAgICBjb25zdCBkZXZpY2VQaXhlbFJhdGlvID0gdGhpcy5taW5pbWFwLmdldERldmljZVBpeGVsUmF0aW8oKVxuICAgIGxldCB2aXNpYmxlQXJlYUxlZnQgPSBtaW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRTY3JvbGxMZWZ0KClcbiAgICBsZXQgdmlzaWJsZUFyZWFUb3AgPSBtaW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRTY3JvbGxUb3AoKSAtIG1pbmltYXAuZ2V0U2Nyb2xsVG9wKClcbiAgICBsZXQgdmlzaWJsZVdpZHRoID0gTWF0aC5taW4oY2FudmFzLndpZHRoIC8gZGV2aWNlUGl4ZWxSYXRpbywgdGhpcy53aWR0aClcblxuICAgIGlmICh0aGlzLmFkanVzdFRvU29mdFdyYXAgJiYgdGhpcy5mbGV4QmFzaXMpIHtcbiAgICAgIHRoaXMuc3R5bGUuZmxleEJhc2lzID0gdGhpcy5mbGV4QmFzaXMgKyAncHgnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3R5bGUuZmxleEJhc2lzID0gbnVsbFxuICAgIH1cblxuICAgIGlmIChTUEVDX01PREUpIHtcbiAgICAgIHRoaXMuYXBwbHlTdHlsZXModGhpcy52aXNpYmxlQXJlYSwge1xuICAgICAgICB3aWR0aDogdmlzaWJsZVdpZHRoICsgJ3B4JyxcbiAgICAgICAgaGVpZ2h0OiBtaW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQoKSArICdweCcsXG4gICAgICAgIHRvcDogdmlzaWJsZUFyZWFUb3AgKyAncHgnLFxuICAgICAgICBsZWZ0OiB2aXNpYmxlQXJlYUxlZnQgKyAncHgnXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFwcGx5U3R5bGVzKHRoaXMudmlzaWJsZUFyZWEsIHtcbiAgICAgICAgd2lkdGg6IHZpc2libGVXaWR0aCArICdweCcsXG4gICAgICAgIGhlaWdodDogbWluaW1hcC5nZXRUZXh0RWRpdG9yU2NhbGVkSGVpZ2h0KCkgKyAncHgnLFxuICAgICAgICB0cmFuc2Zvcm06IHRoaXMubWFrZVRyYW5zbGF0ZSh2aXNpYmxlQXJlYUxlZnQsIHZpc2libGVBcmVhVG9wKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmFwcGx5U3R5bGVzKHRoaXMuY29udHJvbHMsIHt3aWR0aDogdmlzaWJsZVdpZHRoICsgJ3B4J30pXG5cbiAgICBsZXQgY2FudmFzVG9wID0gbWluaW1hcC5nZXRGaXJzdFZpc2libGVTY3JlZW5Sb3coKSAqIG1pbmltYXAuZ2V0TGluZUhlaWdodCgpIC0gbWluaW1hcC5nZXRTY3JvbGxUb3AoKVxuXG4gICAgbGV0IGNhbnZhc1RyYW5zZm9ybSA9IHRoaXMubWFrZVRyYW5zbGF0ZSgwLCBjYW52YXNUb3ApXG4gICAgaWYgKGRldmljZVBpeGVsUmF0aW8gIT09IDEpIHtcbiAgICAgIGNhbnZhc1RyYW5zZm9ybSArPSAnICcgKyB0aGlzLm1ha2VTY2FsZSgxIC8gZGV2aWNlUGl4ZWxSYXRpbylcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zbW9vdGhTY3JvbGxpbmcpIHtcbiAgICAgIGlmIChTUEVDX01PREUpIHtcbiAgICAgICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLmJhY2tMYXllci5jYW52YXMsIHt0b3A6IGNhbnZhc1RvcCArICdweCd9KVxuICAgICAgICB0aGlzLmFwcGx5U3R5bGVzKHRoaXMudG9rZW5zTGF5ZXIuY2FudmFzLCB7dG9wOiBjYW52YXNUb3AgKyAncHgnfSlcbiAgICAgICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLmZyb250TGF5ZXIuY2FudmFzLCB7dG9wOiBjYW52YXNUb3AgKyAncHgnfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYXBwbHlTdHlsZXModGhpcy5iYWNrTGF5ZXIuY2FudmFzLCB7dHJhbnNmb3JtOiBjYW52YXNUcmFuc2Zvcm19KVxuICAgICAgICB0aGlzLmFwcGx5U3R5bGVzKHRoaXMudG9rZW5zTGF5ZXIuY2FudmFzLCB7dHJhbnNmb3JtOiBjYW52YXNUcmFuc2Zvcm19KVxuICAgICAgICB0aGlzLmFwcGx5U3R5bGVzKHRoaXMuZnJvbnRMYXllci5jYW52YXMsIHt0cmFuc2Zvcm06IGNhbnZhc1RyYW5zZm9ybX0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWluaW1hcFNjcm9sbEluZGljYXRvciAmJiBtaW5pbWFwLmNhblNjcm9sbCgpICYmICF0aGlzLnNjcm9sbEluZGljYXRvcikge1xuICAgICAgdGhpcy5pbml0aWFsaXplU2Nyb2xsSW5kaWNhdG9yKClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY3JvbGxJbmRpY2F0b3IgIT0gbnVsbCkge1xuICAgICAgbGV0IG1pbmltYXBTY3JlZW5IZWlnaHQgPSBtaW5pbWFwLmdldFNjcmVlbkhlaWdodCgpXG4gICAgICBsZXQgaW5kaWNhdG9ySGVpZ2h0ID0gbWluaW1hcFNjcmVlbkhlaWdodCAqIChtaW5pbWFwU2NyZWVuSGVpZ2h0IC8gbWluaW1hcC5nZXRIZWlnaHQoKSlcbiAgICAgIGxldCBpbmRpY2F0b3JTY3JvbGwgPSAobWluaW1hcFNjcmVlbkhlaWdodCAtIGluZGljYXRvckhlaWdodCkgKiBtaW5pbWFwLmdldFNjcm9sbFJhdGlvKClcblxuICAgICAgaWYgKFNQRUNfTU9ERSkge1xuICAgICAgICB0aGlzLmFwcGx5U3R5bGVzKHRoaXMuc2Nyb2xsSW5kaWNhdG9yLCB7XG4gICAgICAgICAgaGVpZ2h0OiBpbmRpY2F0b3JIZWlnaHQgKyAncHgnLFxuICAgICAgICAgIHRvcDogaW5kaWNhdG9yU2Nyb2xsICsgJ3B4J1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hcHBseVN0eWxlcyh0aGlzLnNjcm9sbEluZGljYXRvciwge1xuICAgICAgICAgIGhlaWdodDogaW5kaWNhdG9ySGVpZ2h0ICsgJ3B4JyxcbiAgICAgICAgICB0cmFuc2Zvcm06IHRoaXMubWFrZVRyYW5zbGF0ZSgwLCBpbmRpY2F0b3JTY3JvbGwpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGlmICghbWluaW1hcC5jYW5TY3JvbGwoKSkgeyB0aGlzLmRpc3Bvc2VTY3JvbGxJbmRpY2F0b3IoKSB9XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVDYW52YXMoKVxuICAgIG1pbmltYXAuY2xlYXJDYWNoZSgpXG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyB3aGV0aGVyIHRvIHJlbmRlciB0aGUgY29kZSBoaWdobGlnaHRzIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIHtCb29sZWFufSBkaXNwbGF5Q29kZUhpZ2hsaWdodHMgd2hldGhlciB0byByZW5kZXIgdGhlIGNvZGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0cyBvciBub3RcbiAgICovXG4gIHNldERpc3BsYXlDb2RlSGlnaGxpZ2h0cyAoZGlzcGxheUNvZGVIaWdobGlnaHRzKSB7XG4gICAgdGhpcy5kaXNwbGF5Q29kZUhpZ2hsaWdodHMgPSBkaXNwbGF5Q29kZUhpZ2hsaWdodHNcbiAgICBpZiAodGhpcy5hdHRhY2hlZCkgeyB0aGlzLnJlcXVlc3RGb3JjZWRVcGRhdGUoKSB9XG4gIH1cblxuICAvKipcbiAgICogUG9sbGluZyBjYWxsYmFjayB1c2VkIHRvIGRldGVjdCB2aXNpYmlsaXR5IGFuZCBzaXplIGNoYW5nZXMuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgcG9sbERPTSAoKSB7XG4gICAgbGV0IHZpc2liaWxpdHlDaGFuZ2VkID0gdGhpcy5jaGVja0ZvclZpc2liaWxpdHlDaGFuZ2UoKVxuICAgIGlmICh0aGlzLmlzVmlzaWJsZSgpKSB7XG4gICAgICBpZiAoIXRoaXMud2FzVmlzaWJsZSkgeyB0aGlzLnJlcXVlc3RGb3JjZWRVcGRhdGUoKSB9XG5cbiAgICAgIHRoaXMubWVhc3VyZUhlaWdodEFuZFdpZHRoKHZpc2liaWxpdHlDaGFuZ2VkLCBmYWxzZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBtZXRob2QgdGhhdCBjaGVja3MgZm9yIHZpc2liaWxpdHkgY2hhbmdlcyBpbiB0aGUgTWluaW1hcEVsZW1lbnQuXG4gICAqIFRoZSBtZXRob2QgcmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgdmlzaWJpbGl0eSBjaGFuZ2VkIGZyb20gdmlzaWJsZSB0b1xuICAgKiBoaWRkZW4gb3IgZnJvbSBoaWRkZW4gdG8gdmlzaWJsZS5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGUgdmlzaWJpbGl0eSBjaGFuZ2VkIG9yIG5vdCBzaW5jZSB0aGUgbGFzdCBjYWxsXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY2hlY2tGb3JWaXNpYmlsaXR5Q2hhbmdlICgpIHtcbiAgICBpZiAodGhpcy5pc1Zpc2libGUoKSkge1xuICAgICAgaWYgKHRoaXMud2FzVmlzaWJsZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMud2FzVmlzaWJsZSA9IHRydWVcbiAgICAgICAgcmV0dXJuIHRoaXMud2FzVmlzaWJsZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy53YXNWaXNpYmxlKSB7XG4gICAgICAgIHRoaXMud2FzVmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLndhc1Zpc2libGUgPSBmYWxzZVxuICAgICAgICByZXR1cm4gdGhpcy53YXNWaXNpYmxlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgbWV0aG9kIHVzZWQgdG8gbWVhc3VyZSB0aGUgc2l6ZSBvZiB0aGUgTWluaW1hcEVsZW1lbnQgYW5kIHVwZGF0ZSBpbnRlcm5hbFxuICAgKiBjb21wb25lbnRzIGJhc2VkIG9uIHRoZSBuZXcgc2l6ZS5cbiAgICpcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gdmlzaWJpbGl0eUNoYW5nZWQgZGlkIHRoZSB2aXNpYmlsaXR5IGNoYW5nZWQgc2luY2UgbGFzdFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZWFzdXJlbWVudFxuICAgKiBAcGFyYW0gIHtbdHlwZV19IFtmb3JjZVVwZGF0ZT10cnVlXSBmb3JjZXMgdGhlIHVwZGF0ZSBldmVuIHdoZW4gbm8gY2hhbmdlc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZXJlIGRldGVjdGVkXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgbWVhc3VyZUhlaWdodEFuZFdpZHRoICh2aXNpYmlsaXR5Q2hhbmdlZCwgZm9yY2VVcGRhdGUgPSB0cnVlKSB7XG4gICAgaWYgKCF0aGlzLm1pbmltYXApIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IGRldmljZVBpeGVsUmF0aW8gPSB0aGlzLm1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpXG4gICAgbGV0IHdhc1Jlc2l6ZWQgPSB0aGlzLndpZHRoICE9PSB0aGlzLmNsaWVudFdpZHRoIHx8IHRoaXMuaGVpZ2h0ICE9PSB0aGlzLmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNsaWVudEhlaWdodFxuICAgIHRoaXMud2lkdGggPSB0aGlzLmNsaWVudFdpZHRoXG4gICAgbGV0IGNhbnZhc1dpZHRoID0gdGhpcy53aWR0aFxuXG4gICAgaWYgKCh0aGlzLm1pbmltYXAgIT0gbnVsbCkpIHsgdGhpcy5taW5pbWFwLnNldFNjcmVlbkhlaWdodEFuZFdpZHRoKHRoaXMuaGVpZ2h0LCB0aGlzLndpZHRoKSB9XG5cbiAgICBpZiAod2FzUmVzaXplZCB8fCB2aXNpYmlsaXR5Q2hhbmdlZCB8fCBmb3JjZVVwZGF0ZSkgeyB0aGlzLnJlcXVlc3RGb3JjZWRVcGRhdGUoKSB9XG5cbiAgICBpZiAoIXRoaXMuaXNWaXNpYmxlKCkpIHsgcmV0dXJuIH1cblxuICAgIGlmICh3YXNSZXNpemVkIHx8IGZvcmNlVXBkYXRlKSB7XG4gICAgICBpZiAodGhpcy5hZGp1c3RUb1NvZnRXcmFwKSB7XG4gICAgICAgIGxldCBsaW5lTGVuZ3RoID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3IucHJlZmVycmVkTGluZUxlbmd0aCcpXG4gICAgICAgIGxldCBzb2Z0V3JhcCA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLnNvZnRXcmFwJylcbiAgICAgICAgbGV0IHNvZnRXcmFwQXRQcmVmZXJyZWRMaW5lTGVuZ3RoID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3Iuc29mdFdyYXBBdFByZWZlcnJlZExpbmVMZW5ndGgnKVxuICAgICAgICBsZXQgd2lkdGggPSBsaW5lTGVuZ3RoICogdGhpcy5taW5pbWFwLmdldENoYXJXaWR0aCgpXG5cbiAgICAgICAgaWYgKHNvZnRXcmFwICYmIHNvZnRXcmFwQXRQcmVmZXJyZWRMaW5lTGVuZ3RoICYmIGxpbmVMZW5ndGggJiYgd2lkdGggPD0gdGhpcy53aWR0aCkge1xuICAgICAgICAgIHRoaXMuZmxleEJhc2lzID0gd2lkdGhcbiAgICAgICAgICBjYW52YXNXaWR0aCA9IHdpZHRoXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuZmxleEJhc2lzXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmZsZXhCYXNpc1xuICAgICAgfVxuXG4gICAgICBsZXQgY2FudmFzID0gdGhpcy5nZXRGcm9udENhbnZhcygpXG4gICAgICBpZiAoY2FudmFzV2lkdGggIT09IGNhbnZhcy53aWR0aCB8fCB0aGlzLmhlaWdodCAhPT0gY2FudmFzLmhlaWdodCkge1xuICAgICAgICB0aGlzLnNldENhbnZhc2VzU2l6ZShcbiAgICAgICAgICBjYW52YXNXaWR0aCAqIGRldmljZVBpeGVsUmF0aW8sXG4gICAgICAgICAgKHRoaXMuaGVpZ2h0ICsgdGhpcy5taW5pbWFwLmdldExpbmVIZWlnaHQoKSkgKiBkZXZpY2VQaXhlbFJhdGlvXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyAgICAjIyMjIyMjIyAjIyAgICAgIyMgIyMjIyMjIyMgIyMgICAgIyMgIyMjIyMjIyMgICMjIyMjI1xuICAvLyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMjICAgIyMgICAgIyMgICAgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICAgIyMgICAgICMjICMjICAgICAgICMjIyMgICMjICAgICMjICAgICMjXG4gIC8vICAgICMjIyMjIyAgICMjICAgICAjIyAjIyMjIyMgICAjIyAjIyAjIyAgICAjIyAgICAgIyMjIyMjXG4gIC8vICAgICMjICAgICAgICAjIyAgICMjICAjIyAgICAgICAjIyAgIyMjIyAgICAjIyAgICAgICAgICAjI1xuICAvLyAgICAjIyAgICAgICAgICMjICMjICAgIyMgICAgICAgIyMgICAjIyMgICAgIyMgICAgIyMgICAgIyNcbiAgLy8gICAgIyMjIyMjIyMgICAgIyMjICAgICMjIyMjIyMjICMjICAgICMjICAgICMjICAgICAjIyMjIyNcblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0byByZWdpc3RlciBjb25maWcgb2JzZXJ2ZXJzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZ3M9e30gYW4gb2JqZWN0IG1hcHBpbmcgdGhlIGNvbmZpZyBuYW1lIHRvIG9ic2VydmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggdGhlIGZ1bmN0aW9uIHRvIGNhbGwgYmFjayB3aGVuIGEgY2hhbmdlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY2N1cnNcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBvYnNlcnZlQ29uZmlnIChjb25maWdzID0ge30pIHtcbiAgICBmb3IgKGxldCBjb25maWcgaW4gY29uZmlncykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKGNvbmZpZywgY29uZmlnc1tjb25maWddKSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdHJpZ2dlcmVkIHdoZW4gdGhlIG1vdXNlIGlzIHByZXNzZWQgb24gdGhlIE1pbmltYXBFbGVtZW50IGNhbnZhcy5cbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSB5IHRoZSB2ZXJ0aWNhbCBjb29yZGluYXRlIG9mIHRoZSBldmVudFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBpc0xlZnRNb3VzZSB3YXMgdGhlIGxlZnQgbW91c2UgYnV0dG9uIHByZXNzZWQ/XG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGlzTWlkZGxlTW91c2Ugd2FzIHRoZSBtaWRkbGUgbW91c2UgYnV0dG9uIHByZXNzZWQ/XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY2FudmFzUHJlc3NlZCAoe3ksIGlzTGVmdE1vdXNlLCBpc01pZGRsZU1vdXNlfSkge1xuICAgIGlmICh0aGlzLm1pbmltYXAuaXNTdGFuZEFsb25lKCkpIHsgcmV0dXJuIH1cbiAgICBpZiAoaXNMZWZ0TW91c2UpIHtcbiAgICAgIHRoaXMuY2FudmFzTGVmdE1vdXNlUHJlc3NlZCh5KVxuICAgIH0gZWxzZSBpZiAoaXNNaWRkbGVNb3VzZSkge1xuICAgICAgdGhpcy5jYW52YXNNaWRkbGVNb3VzZVByZXNzZWQoeSlcbiAgICAgIGxldCB7dG9wLCBoZWlnaHR9ID0gdGhpcy52aXNpYmxlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgdGhpcy5zdGFydERyYWcoe3k6IHRvcCArIGhlaWdodCAvIDIsIGlzTGVmdE1vdXNlOiBmYWxzZSwgaXNNaWRkbGVNb3VzZTogdHJ1ZX0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRyaWdnZXJlZCB3aGVuIHRoZSBtb3VzZSBsZWZ0IGJ1dHRvbiBpcyBwcmVzc2VkIG9uIHRoZVxuICAgKiBNaW5pbWFwRWxlbWVudCBjYW52YXMuXG4gICAqXG4gICAqIEBwYXJhbSAge01vdXNlRXZlbnR9IGUgdGhlIG1vdXNlIGV2ZW50IG9iamVjdFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGUucGFnZVkgdGhlIG1vdXNlIHkgcG9zaXRpb24gaW4gcGFnZVxuICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZS50YXJnZXQgdGhlIHNvdXJjZSBvZiB0aGUgZXZlbnRcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjYW52YXNMZWZ0TW91c2VQcmVzc2VkICh5KSB7XG4gICAgbGV0IGRlbHRhWSA9IHkgLSB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICAgIGxldCByb3cgPSBNYXRoLmZsb29yKGRlbHRhWSAvIHRoaXMubWluaW1hcC5nZXRMaW5lSGVpZ2h0KCkpICsgdGhpcy5taW5pbWFwLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpXG5cbiAgICBsZXQgdGV4dEVkaXRvciA9IHRoaXMubWluaW1hcC5nZXRUZXh0RWRpdG9yKClcblxuICAgIGxldCBzY3JvbGxUb3AgPSByb3cgKiB0ZXh0RWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpIC0gdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JIZWlnaHQoKSAvIDJcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ21pbmltYXAuc2Nyb2xsQW5pbWF0aW9uJykpIHtcbiAgICAgIGxldCBmcm9tID0gdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JTY3JvbGxUb3AoKVxuICAgICAgbGV0IHRvID0gc2Nyb2xsVG9wXG4gICAgICBsZXQgc3RlcCA9IChub3cpID0+IHRoaXMubWluaW1hcC5zZXRUZXh0RWRpdG9yU2Nyb2xsVG9wKG5vdylcbiAgICAgIGxldCBkdXJhdGlvbiA9IGF0b20uY29uZmlnLmdldCgnbWluaW1hcC5zY3JvbGxBbmltYXRpb25EdXJhdGlvbicpXG4gICAgICB0aGlzLmFuaW1hdGUoe2Zyb206IGZyb20sIHRvOiB0bywgZHVyYXRpb246IGR1cmF0aW9uLCBzdGVwOiBzdGVwfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5taW5pbWFwLnNldFRleHRFZGl0b3JTY3JvbGxUb3Aoc2Nyb2xsVG9wKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0cmlnZ2VyZWQgd2hlbiB0aGUgbW91c2UgbWlkZGxlIGJ1dHRvbiBpcyBwcmVzc2VkIG9uIHRoZVxuICAgKiBNaW5pbWFwRWxlbWVudCBjYW52YXMuXG4gICAqXG4gICAqIEBwYXJhbSAge01vdXNlRXZlbnR9IGUgdGhlIG1vdXNlIGV2ZW50IG9iamVjdFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGUucGFnZVkgdGhlIG1vdXNlIHkgcG9zaXRpb24gaW4gcGFnZVxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGNhbnZhc01pZGRsZU1vdXNlUHJlc3NlZCAoeSkge1xuICAgIGxldCB7dG9wOiBvZmZzZXRUb3B9ID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGxldCBkZWx0YVkgPSB5IC0gb2Zmc2V0VG9wIC0gdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQoKSAvIDJcblxuICAgIGxldCByYXRpbyA9IGRlbHRhWSAvICh0aGlzLm1pbmltYXAuZ2V0VmlzaWJsZUhlaWdodCgpIC0gdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQoKSlcblxuICAgIHRoaXMubWluaW1hcC5zZXRUZXh0RWRpdG9yU2Nyb2xsVG9wKHJhdGlvICogdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JNYXhTY3JvbGxUb3AoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG1ldGhvZCB0aGF0IHJlbGF5cyB0aGUgYG1vdXNld2hlZWxgIGV2ZW50cyByZWNlaXZlZCBieSB0aGUgTWluaW1hcEVsZW1lbnRcbiAgICogdG8gdGhlIGBUZXh0RWRpdG9yRWxlbWVudGAuXG4gICAqXG4gICAqIEBwYXJhbSAge01vdXNlRXZlbnR9IGUgdGhlIG1vdXNlIGV2ZW50IG9iamVjdFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHJlbGF5TW91c2V3aGVlbEV2ZW50IChlKSB7XG4gICAgaWYgKHRoaXMubWluaW1hcC5zY3JvbGxJbmRlcGVuZGVudGx5T25Nb3VzZVdoZWVsKCkpIHtcbiAgICAgIHRoaXMubWluaW1hcC5vbk1vdXNlV2hlZWwoZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5nZXRUZXh0RWRpdG9yRWxlbWVudCgpLmNvbXBvbmVudC5vbk1vdXNlV2hlZWwoZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBtZXRob2QgdGhhdCBleHRyYWN0cyBkYXRhIGZyb20gYSBgTW91c2VFdmVudGAgd2hpY2ggY2FuIHRoZW4gYmUgdXNlZCB0b1xuICAgKiBwcm9jZXNzIGNsaWNrcyBhbmQgZHJhZ3Mgb2YgdGhlIG1pbmltYXAuXG4gICAqXG4gICAqIFVzZWQgdG9nZXRoZXIgd2l0aCBgZXh0cmFjdFRvdWNoRXZlbnREYXRhYCB0byBwcm92aWRlIGEgdW5pZmllZCBpbnRlcmZhY2VcbiAgICogZm9yIGBNb3VzZUV2ZW50YHMgYW5kIGBUb3VjaEV2ZW50YHMuXG4gICAqXG4gICAqIEBwYXJhbSAge01vdXNlRXZlbnR9IG1vdXNlRXZlbnQgdGhlIG1vdXNlIGV2ZW50IG9iamVjdFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGV4dHJhY3RNb3VzZUV2ZW50RGF0YSAobW91c2VFdmVudCkge1xuICAgIHJldHVybiB7XG4gICAgICB4OiBtb3VzZUV2ZW50LnBhZ2VYLFxuICAgICAgeTogbW91c2VFdmVudC5wYWdlWSxcbiAgICAgIGlzTGVmdE1vdXNlOiBtb3VzZUV2ZW50LndoaWNoID09PSAxLFxuICAgICAgaXNNaWRkbGVNb3VzZTogbW91c2VFdmVudC53aGljaCA9PT0gMlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIG1ldGhvZCB0aGF0IGV4dHJhY3RzIGRhdGEgZnJvbSBhIGBUb3VjaEV2ZW50YCB3aGljaCBjYW4gdGhlbiBiZSB1c2VkIHRvXG4gICAqIHByb2Nlc3MgY2xpY2tzIGFuZCBkcmFncyBvZiB0aGUgbWluaW1hcC5cbiAgICpcbiAgICogVXNlZCB0b2dldGhlciB3aXRoIGBleHRyYWN0TW91c2VFdmVudERhdGFgIHRvIHByb3ZpZGUgYSB1bmlmaWVkIGludGVyZmFjZVxuICAgKiBmb3IgYE1vdXNlRXZlbnRgcyBhbmQgYFRvdWNoRXZlbnRgcy5cbiAgICpcbiAgICogQHBhcmFtICB7VG91Y2hFdmVudH0gdG91Y2hFdmVudCB0aGUgdG91Y2ggZXZlbnQgb2JqZWN0XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZXh0cmFjdFRvdWNoRXZlbnREYXRhICh0b3VjaEV2ZW50KSB7XG4gICAgLy8gVXNlIHRoZSBmaXJzdCB0b3VjaCBvbiB0aGUgdGFyZ2V0IGFyZWEuIE90aGVyIHRvdWNoZXMgd2lsbCBiZSBpZ25vcmVkIGluXG4gICAgLy8gY2FzZSBvZiBtdWx0aS10b3VjaC5cbiAgICBsZXQgdG91Y2ggPSB0b3VjaEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdXG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogdG91Y2gucGFnZVgsXG4gICAgICB5OiB0b3VjaC5wYWdlWSxcbiAgICAgIGlzTGVmdE1vdXNlOiB0cnVlLCAvLyBUb3VjaCBpcyB0cmVhdGVkIGxpa2UgYSBsZWZ0IG1vdXNlIGJ1dHRvbiBjbGlja1xuICAgICAgaXNNaWRkbGVNb3VzZTogZmFsc2VcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyB0byBhIG1lZGlhIHF1ZXJ5IGZvciBkZXZpY2UgcGl4ZWwgcmF0aW8gY2hhbmdlcyBhbmQgZm9yY2VzXG4gICAqIGEgcmVwYWludCB3aGVuIGl0IG9jY3Vycy5cbiAgICpcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHJlbW92ZSB0aGUgbWVkaWEgcXVlcnkgbGlzdGVuZXJcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBzdWJzY3JpYmVUb01lZGlhUXVlcnkgKCkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gJ3NjcmVlbiBhbmQgKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMS41KSdcbiAgICBjb25zdCBtZWRpYVF1ZXJ5ID0gd2luZG93Lm1hdGNoTWVkaWEocXVlcnkpXG4gICAgY29uc3QgbWVkaWFMaXN0ZW5lciA9IChlKSA9PiB7IHRoaXMucmVxdWVzdEZvcmNlZFVwZGF0ZSgpIH1cbiAgICBtZWRpYVF1ZXJ5LmFkZExpc3RlbmVyKG1lZGlhTGlzdGVuZXIpXG5cbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgbWVkaWFRdWVyeS5yZW1vdmVMaXN0ZW5lcihtZWRpYUxpc3RlbmVyKVxuICAgIH0pXG4gIH1cblxuICAvLyAgICAjIyMjIyMjIyAgICAjIyMjICAgICMjIyMjIyMjXG4gIC8vICAgICMjICAgICAjIyAgIyMgICMjICAgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAgICMjIyMgICAgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAgIyMjIyAgICAgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgIyMgIyMgIyMgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICMjICAgIyMgICAgICMjXG4gIC8vICAgICMjIyMjIyMjICAgIyMjIyAgIyMgIyMjIyMjIyNcblxuICAvKipcbiAgICogQSBtZXRob2QgdHJpZ2dlcmVkIHdoZW4gdGhlIG1vdXNlIGlzIHByZXNzZWQgb3ZlciB0aGUgdmlzaWJsZSBhcmVhIHRoYXRcbiAgICogc3RhcnRzIHRoZSBkcmFnZ2luZyBnZXN0dXJlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHkgdGhlIHZlcnRpY2FsIGNvb3JkaW5hdGUgb2YgdGhlIGV2ZW50XG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGlzTGVmdE1vdXNlIHdhcyB0aGUgbGVmdCBtb3VzZSBidXR0b24gcHJlc3NlZD9cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gaXNNaWRkbGVNb3VzZSB3YXMgdGhlIG1pZGRsZSBtb3VzZSBidXR0b24gcHJlc3NlZD9cbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBzdGFydERyYWcgKHt5LCBpc0xlZnRNb3VzZSwgaXNNaWRkbGVNb3VzZX0pIHtcbiAgICBpZiAoIXRoaXMubWluaW1hcCkgeyByZXR1cm4gfVxuICAgIGlmICghaXNMZWZ0TW91c2UgJiYgIWlzTWlkZGxlTW91c2UpIHsgcmV0dXJuIH1cblxuICAgIGxldCB7dG9wfSA9IHRoaXMudmlzaWJsZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBsZXQge3RvcDogb2Zmc2V0VG9wfSA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIGxldCBkcmFnT2Zmc2V0ID0geSAtIHRvcFxuXG4gICAgbGV0IGluaXRpYWwgPSB7ZHJhZ09mZnNldCwgb2Zmc2V0VG9wfVxuXG4gICAgbGV0IG1vdXNlbW92ZUhhbmRsZXIgPSAoZSkgPT4gdGhpcy5kcmFnKHRoaXMuZXh0cmFjdE1vdXNlRXZlbnREYXRhKGUpLCBpbml0aWFsKVxuICAgIGxldCBtb3VzZXVwSGFuZGxlciA9IChlKSA9PiB0aGlzLmVuZERyYWcoKVxuXG4gICAgbGV0IHRvdWNobW92ZUhhbmRsZXIgPSAoZSkgPT4gdGhpcy5kcmFnKHRoaXMuZXh0cmFjdFRvdWNoRXZlbnREYXRhKGUpLCBpbml0aWFsKVxuICAgIGxldCB0b3VjaGVuZEhhbmRsZXIgPSAoZSkgPT4gdGhpcy5lbmREcmFnKClcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlSGFuZGxlcilcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZXVwSGFuZGxlcilcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBtb3VzZXVwSGFuZGxlcilcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdG91Y2htb3ZlSGFuZGxlcilcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdG91Y2hlbmRIYW5kbGVyKVxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0b3VjaGVuZEhhbmRsZXIpXG5cbiAgICB0aGlzLmRyYWdTdWJzY3JpcHRpb24gPSBuZXcgRGlzcG9zYWJsZShmdW5jdGlvbiAoKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlbW92ZUhhbmRsZXIpXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZXVwSGFuZGxlcilcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIG1vdXNldXBIYW5kbGVyKVxuXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRvdWNobW92ZUhhbmRsZXIpXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdG91Y2hlbmRIYW5kbGVyKVxuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRvdWNoZW5kSGFuZGxlcilcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgY2FsbGVkIGR1cmluZyB0aGUgZHJhZyBnZXN0dXJlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHkgdGhlIHZlcnRpY2FsIGNvb3JkaW5hdGUgb2YgdGhlIGV2ZW50XG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGlzTGVmdE1vdXNlIHdhcyB0aGUgbGVmdCBtb3VzZSBidXR0b24gcHJlc3NlZD9cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gaXNNaWRkbGVNb3VzZSB3YXMgdGhlIG1pZGRsZSBtb3VzZSBidXR0b24gcHJlc3NlZD9cbiAgICogQHBhcmFtICB7bnVtYmVyfSBpbml0aWFsLmRyYWdPZmZzZXQgdGhlIG1vdXNlIG9mZnNldCB3aXRoaW4gdGhlIHZpc2libGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGluaXRpYWwub2Zmc2V0VG9wIHRoZSBNaW5pbWFwRWxlbWVudCBvZmZzZXQgYXQgdGhlIG1vbWVudFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIHRoZSBkcmFnIHN0YXJ0XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZHJhZyAoe3ksIGlzTGVmdE1vdXNlLCBpc01pZGRsZU1vdXNlfSwgaW5pdGlhbCkge1xuICAgIGlmICghdGhpcy5taW5pbWFwKSB7IHJldHVybiB9XG4gICAgaWYgKCFpc0xlZnRNb3VzZSAmJiAhaXNNaWRkbGVNb3VzZSkgeyByZXR1cm4gfVxuICAgIGxldCBkZWx0YVkgPSB5IC0gaW5pdGlhbC5vZmZzZXRUb3AgLSBpbml0aWFsLmRyYWdPZmZzZXRcblxuICAgIGxldCByYXRpbyA9IGRlbHRhWSAvICh0aGlzLm1pbmltYXAuZ2V0VmlzaWJsZUhlaWdodCgpIC0gdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JTY2FsZWRIZWlnaHQoKSlcblxuICAgIHRoaXMubWluaW1hcC5zZXRUZXh0RWRpdG9yU2Nyb2xsVG9wKHJhdGlvICogdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3JNYXhTY3JvbGxUb3AoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHRoYXQgZW5kcyB0aGUgZHJhZyBnZXN0dXJlLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGVuZERyYWcgKCkge1xuICAgIGlmICghdGhpcy5taW5pbWFwKSB7IHJldHVybiB9XG4gICAgdGhpcy5kcmFnU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICB9XG5cbiAgLy8gICAgICMjIyMjIyAgICMjIyMjIyAgICMjIyMjI1xuICAvLyAgICAjIyAgICAjIyAjIyAgICAjIyAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgICAjIyAgICAgICAjI1xuICAvLyAgICAjIyAgICAgICAgIyMjIyMjICAgIyMjIyMjXG4gIC8vICAgICMjICAgICAgICAgICAgICMjICAgICAgICMjXG4gIC8vICAgICMjICAgICMjICMjICAgICMjICMjICAgICMjXG4gIC8vICAgICAjIyMjIyMgICAjIyMjIyMgICAjIyMjIyNcblxuICAvKipcbiAgICogQXBwbGllcyB0aGUgcGFzc2VkLWluIHN0eWxlcyBwcm9wZXJ0aWVzIHRvIHRoZSBzcGVjaWZpZWQgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCB0aGUgZWxlbWVudCBvbnRvIHdoaWNoIGFwcGx5IHRoZSBzdHlsZXNcbiAgICogQHBhcmFtICB7T2JqZWN0fSBzdHlsZXMgdGhlIHN0eWxlcyB0byBhcHBseVxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGFwcGx5U3R5bGVzIChlbGVtZW50LCBzdHlsZXMpIHtcbiAgICBpZiAoIWVsZW1lbnQpIHsgcmV0dXJuIH1cblxuICAgIGxldCBjc3NUZXh0ID0gJydcbiAgICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBzdHlsZXMpIHtcbiAgICAgIGNzc1RleHQgKz0gYCR7cHJvcGVydHl9OiAke3N0eWxlc1twcm9wZXJ0eV19OyBgXG4gICAgfVxuXG4gICAgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gY3NzVGV4dFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgd2l0aCBhIENTUyB0cmFuc2xhdGlvbiB0cmFuZm9ybSB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbeCA9IDBdIHRoZSB4IG9mZnNldCBvZiB0aGUgdHJhbnNsYXRpb25cbiAgICogQHBhcmFtICB7bnVtYmVyfSBbeSA9IDBdIHRoZSB5IG9mZnNldCBvZiB0aGUgdHJhbnNsYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgQ1NTIHRyYW5zbGF0aW9uIHN0cmluZ1xuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIG1ha2VUcmFuc2xhdGUgKHggPSAwLCB5ID0gMCkge1xuICAgIGlmICh0aGlzLnVzZUhhcmR3YXJlQWNjZWxlcmF0aW9uKSB7XG4gICAgICByZXR1cm4gYHRyYW5zbGF0ZTNkKCR7eH1weCwgJHt5fXB4LCAwKWBcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoJHt4fXB4LCAke3l9cHgpYFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHdpdGggYSBDU1Mgc2NhbGluZyB0cmFuZm9ybSB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbeCA9IDBdIHRoZSB4IHNjYWxpbmcgZmFjdG9yXG4gICAqIEBwYXJhbSAge251bWJlcn0gW3kgPSAwXSB0aGUgeSBzY2FsaW5nIGZhY3RvclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBDU1Mgc2NhbGluZyBzdHJpbmdcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBtYWtlU2NhbGUgKHggPSAwLCB5ID0geCkge1xuICAgIGlmICh0aGlzLnVzZUhhcmR3YXJlQWNjZWxlcmF0aW9uKSB7XG4gICAgICByZXR1cm4gYHNjYWxlM2QoJHt4fSwgJHt5fSwgMSlgXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgc2NhbGUoJHt4fSwgJHt5fSlgXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgbWV0aG9kIHRoYXQgcmV0dXJuIHRoZSBjdXJyZW50IHRpbWUgYXMgYSBEYXRlLlxuICAgKlxuICAgKiBUaGF0IG1ldGhvZCBleGlzdCBzbyB0aGF0IHdlIGNhbiBtb2NrIGl0IGluIHRlc3RzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtEYXRlfSB0aGUgY3VycmVudCB0aW1lIGFzIERhdGVcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBnZXRUaW1lICgpIHsgcmV0dXJuIG5ldyBEYXRlKCkgfVxuXG4gIC8qKlxuICAgKiBBIG1ldGhvZCB0aGF0IG1pbWljIHRoZSBqUXVlcnkgYGFuaW1hdGVgIG1ldGhvZCBhbmQgdXNlZCB0byBhbmltYXRlIHRoZVxuICAgKiBzY3JvbGwgd2hlbiBjbGlja2luZyBvbiB0aGUgTWluaW1hcEVsZW1lbnQgY2FudmFzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtIHRoZSBhbmltYXRpb24gZGF0YSBvYmplY3RcbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbS5mcm9tIHRoZSBzdGFydCB2YWx1ZVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHBhcmFtLnRvIHRoZSBlbmQgdmFsdWVcbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbS5kdXJhdGlvbiB0aGUgYW5pbWF0aW9uIGR1cmF0aW9uXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcGFyYW0uc3RlcCB0aGUgZWFzaW5nIGZ1bmN0aW9uIGZvciB0aGUgYW5pbWF0aW9uXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgYW5pbWF0ZSAoe2Zyb20sIHRvLCBkdXJhdGlvbiwgc3RlcH0pIHtcbiAgICBsZXQgcHJvZ3Jlc3NcbiAgICBsZXQgc3RhcnQgPSB0aGlzLmdldFRpbWUoKVxuXG4gICAgbGV0IHN3aW5nID0gZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICByZXR1cm4gMC41IC0gTWF0aC5jb3MocHJvZ3Jlc3MgKiBNYXRoLlBJKSAvIDJcbiAgICB9XG5cbiAgICBsZXQgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLm1pbmltYXApIHsgcmV0dXJuIH1cblxuICAgICAgbGV0IHBhc3NlZCA9IHRoaXMuZ2V0VGltZSgpIC0gc3RhcnRcbiAgICAgIGlmIChkdXJhdGlvbiA9PT0gMCkge1xuICAgICAgICBwcm9ncmVzcyA9IDFcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2dyZXNzID0gcGFzc2VkIC8gZHVyYXRpb25cbiAgICAgIH1cbiAgICAgIGlmIChwcm9ncmVzcyA+IDEpIHsgcHJvZ3Jlc3MgPSAxIH1cbiAgICAgIGxldCBkZWx0YSA9IHN3aW5nKHByb2dyZXNzKVxuICAgICAgc3RlcChmcm9tICsgKHRvIC0gZnJvbSkgKiBkZWx0YSlcblxuICAgICAgaWYgKHByb2dyZXNzIDwgMSkgeyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKSB9XG4gICAgfVxuXG4gICAgdXBkYXRlKClcbiAgfVxufVxuIl19
//# sourceURL=/Users/victor.martins/.atom/packages/minimap/lib/minimap-element.js
