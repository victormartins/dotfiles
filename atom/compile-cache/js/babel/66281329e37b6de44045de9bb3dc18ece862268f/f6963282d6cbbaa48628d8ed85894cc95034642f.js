Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _mixto = require('mixto');

var _mixto2 = _interopRequireDefault(_mixto);

var _main = require('../main');

var _main2 = _interopRequireDefault(_main);

var _canvasLayer = require('../canvas-layer');

var _canvasLayer2 = _interopRequireDefault(_canvasLayer);

/**
 * The `CanvasDrawer` mixin is responsible for the rendering of a `Minimap`
 * in a `canvas` element.
 *
 * This mixin is injected in the `MinimapElement` prototype, so all these
 * methods  are available on any `MinimapElement` instance.
 */
'use babel';

var CanvasDrawer = (function (_Mixin) {
  _inherits(CanvasDrawer, _Mixin);

  function CanvasDrawer() {
    _classCallCheck(this, CanvasDrawer);

    _get(Object.getPrototypeOf(CanvasDrawer.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(CanvasDrawer, [{
    key: 'initializeCanvas',

    /**
     * Initializes the canvas elements needed to perform the `Minimap` rendering.
     */
    value: function initializeCanvas() {
      /**
      * The main canvas layer where lines are rendered.
      * @type {CanvasLayer}
      */
      this.tokensLayer = new _canvasLayer2['default']();
      /**
      * The canvas layer for decorations below the text.
      * @type {CanvasLayer}
      */
      this.backLayer = new _canvasLayer2['default']();
      /**
      * The canvas layer for decorations above the text.
      * @type {CanvasLayer}
      */
      this.frontLayer = new _canvasLayer2['default']();

      if (!this.pendingChanges) {
        /**
         * Stores the changes from the text editor.
         * @type {Array<Object>}
         * @access private
         */
        this.pendingChanges = [];
      }

      if (!this.pendingBackDecorationChanges) {
        /**
         * Stores the changes from the minimap back decorations.
         * @type {Array<Object>}
         * @access private
         */
        this.pendingBackDecorationChanges = [];
      }

      if (!this.pendingFrontDecorationChanges) {
        /**
         * Stores the changes from the minimap front decorations.
         * @type {Array<Object>}
         * @access private
         */
        this.pendingFrontDecorationChanges = [];
      }
    }

    /**
     * Returns the uppermost canvas in the MinimapElement.
     *
     * @return {HTMLCanvasElement} the html canvas element
     */
  }, {
    key: 'getFrontCanvas',
    value: function getFrontCanvas() {
      return this.frontLayer.canvas;
    }

    /**
     * Attaches the canvases into the specified container.
     *
     * @param  {HTMLElement} parent the canvases' container
     * @access private
     */
  }, {
    key: 'attachCanvases',
    value: function attachCanvases(parent) {
      this.backLayer.attach(parent);
      this.tokensLayer.attach(parent);
      this.frontLayer.attach(parent);
    }

    /**
     * Changes the size of all the canvas layers at once.
     *
     * @param {number} width the new width for the three canvases
     * @param {number} height the new height for the three canvases
     * @access private
     */
  }, {
    key: 'setCanvasesSize',
    value: function setCanvasesSize(width, height) {
      this.backLayer.setSize(width, height);
      this.tokensLayer.setSize(width, height);
      this.frontLayer.setSize(width, height);
    }

    /**
     * Performs an update of the rendered `Minimap` based on the changes
     * registered in the instance.
     */
  }, {
    key: 'updateCanvas',
    value: function updateCanvas() {
      var firstRow = this.minimap.getFirstVisibleScreenRow();
      var lastRow = this.minimap.getLastVisibleScreenRow();

      this.updateTokensLayer(firstRow, lastRow);
      this.updateBackDecorationsLayers(firstRow, lastRow);
      this.updateFrontDecorationsLayers(firstRow, lastRow);

      this.pendingChanges = [];
      this.pendingBackDecorationChanges = [];
      this.pendingFrontDecorationChanges = [];

      /**
       * The first row in the last render of the offscreen canvas.
       * @type {number}
       * @access private
       */
      this.offscreenFirstRow = firstRow;
      /**
       * The last row in the last render of the offscreen canvas.
       * @type {number}
       * @access private
       */
      this.offscreenLastRow = lastRow;
    }

    /**
     * Performs an update of the tokens layer using the pending changes array.
     *
     * @param  {number} firstRow firstRow the first row of the range to update
     * @param  {number} lastRow lastRow the last row of the range to update
     * @access private
     */
  }, {
    key: 'updateTokensLayer',
    value: function updateTokensLayer(firstRow, lastRow) {
      var intactRanges = this.computeIntactRanges(firstRow, lastRow, this.pendingChanges);

      this.redrawRangesOnLayer(this.tokensLayer, intactRanges, firstRow, lastRow, this.drawLines);
    }

    /**
     * Performs an update of the back decorations layer using the pending changes
     * and the pending back decorations changes arrays.
     *
     * @param  {number} firstRow firstRow the first row of the range to update
     * @param  {number} lastRow lastRow the last row of the range to update
     * @access private
     */
  }, {
    key: 'updateBackDecorationsLayers',
    value: function updateBackDecorationsLayers(firstRow, lastRow) {
      var intactRanges = this.computeIntactRanges(firstRow, lastRow, this.pendingChanges.concat(this.pendingBackDecorationChanges));

      this.redrawRangesOnLayer(this.backLayer, intactRanges, firstRow, lastRow, this.drawBackDecorationsForLines);
    }

    /**
     * Performs an update of the front decorations layer using the pending changes
     * and the pending front decorations changes arrays.
     *
     * @param  {number} firstRow firstRow the first row of the range to update
     * @param  {number} lastRow lastRow the last row of the range to update
     * @access private
     */
  }, {
    key: 'updateFrontDecorationsLayers',
    value: function updateFrontDecorationsLayers(firstRow, lastRow) {
      var intactRanges = this.computeIntactRanges(firstRow, lastRow, this.pendingChanges.concat(this.pendingFrontDecorationChanges));

      this.redrawRangesOnLayer(this.frontLayer, intactRanges, firstRow, lastRow, this.drawFrontDecorationsForLines);
    }

    /**
     * Routine used to render changes in specific ranges for one layer.
     *
     * @param  {CanvasLayer} layer the layer to redraw
     * @param  {Array<Object>} intactRanges an array of the ranges to leave intact
     * @param  {number} firstRow firstRow the first row of the range to update
     * @param  {number} lastRow lastRow the last row of the range to update
     * @param  {Function} method the render method to use for the lines drawing
     * @access private
     */
  }, {
    key: 'redrawRangesOnLayer',
    value: function redrawRangesOnLayer(layer, intactRanges, firstRow, lastRow, method) {
      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var lineHeight = this.minimap.getLineHeight() * devicePixelRatio;

      layer.clearCanvas();

      if (intactRanges.length === 0) {
        method.call(this, firstRow, lastRow, 0);
      } else {
        for (var j = 0, len = intactRanges.length; j < len; j++) {
          var intact = intactRanges[j];

          layer.copyPartFromOffscreen(intact.offscreenRow * lineHeight, (intact.start - firstRow) * lineHeight, (intact.end - intact.start) * lineHeight);
        }
        this.drawLinesForRanges(method, intactRanges, firstRow, lastRow);
      }

      layer.resetOffscreenSize();
      layer.copyToOffscreen();
    }

    /**
     * Renders the lines between the intact ranges when an update has pending
     * changes.
     *
     * @param  {Function} method the render method to use for the lines drawing
     * @param  {Array<Object>} intactRanges the intact ranges in the minimap
     * @param  {number} firstRow the first row of the rendered region
     * @param  {number} lastRow the last row of the rendered region
     * @access private
     */
  }, {
    key: 'drawLinesForRanges',
    value: function drawLinesForRanges(method, ranges, firstRow, lastRow) {
      var currentRow = firstRow;
      for (var i = 0, len = ranges.length; i < len; i++) {
        var range = ranges[i];

        method.call(this, currentRow, range.start - 1, currentRow - firstRow);

        currentRow = range.end;
      }
      if (currentRow <= lastRow) {
        method.call(this, currentRow, lastRow, currentRow - firstRow);
      }
    }

    //     ######   #######  ##        #######  ########   ######
    //    ##    ## ##     ## ##       ##     ## ##     ## ##    ##
    //    ##       ##     ## ##       ##     ## ##     ## ##
    //    ##       ##     ## ##       ##     ## ########   ######
    //    ##       ##     ## ##       ##     ## ##   ##         ##
    //    ##    ## ##     ## ##       ##     ## ##    ##  ##    ##
    //     ######   #######  ########  #######  ##     ##  ######

    /**
     * Returns the opacity value to use when rendering the `Minimap` text.
     *
     * @return {Number} the text opacity value
     */
  }, {
    key: 'getTextOpacity',
    value: function getTextOpacity() {
      return this.textOpacity;
    }

    /**
     * Returns the default text color for an editor content.
     *
     * The color value is directly read from the `TextEditorView` computed styles.
     *
     * @return {string} a CSS color
     */
  }, {
    key: 'getDefaultColor',
    value: function getDefaultColor() {
      var color = this.retrieveStyleFromDom(['.editor'], 'color', false, true);
      return this.transparentize(color, this.getTextOpacity());
    }

    /**
     * Returns the text color for the passed-in `token` object.
     *
     * The color value is read from the DOM by creating a node structure that
     * match the token `scope` property.
     *
     * @param  {Object} token a `TextEditor` token
     * @return {string} the CSS color for the provided token
     */
  }, {
    key: 'getTokenColor',
    value: function getTokenColor(token) {
      var scopes = token.scopeDescriptor || token.scopes;
      var color = this.retrieveStyleFromDom(scopes, 'color');

      return this.transparentize(color, this.getTextOpacity());
    }

    /**
     * Returns the background color for the passed-in `decoration` object.
     *
     * The color value is read from the DOM by creating a node structure that
     * match the decoration `scope` property unless the decoration provides
     * its own `color` property.
     *
     * @param  {Decoration} decoration the decoration to get the color for
     * @return {string} the CSS color for the provided decoration
     */
  }, {
    key: 'getDecorationColor',
    value: function getDecorationColor(decoration) {
      var properties = decoration.getProperties();
      if (properties.color) {
        return properties.color;
      }

      var scopeString = properties.scope.split(/\s+/);
      return this.retrieveStyleFromDom(scopeString, 'background-color', false);
    }

    /**
     * Converts a `rgb(...)` color into a `rgba(...)` color with the specified
     * opacity.
     *
     * @param  {string} color the CSS RGB color to transparentize
     * @param  {number} [opacity=1] the opacity amount
     * @return {string} the transparentized CSS color
     * @access private
     */
  }, {
    key: 'transparentize',
    value: function transparentize(color) {
      var opacity = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

      return color.replace('rgb(', 'rgba(').replace(')', ', ' + opacity + ')');
    }

    //    ########  ########     ###    ##      ##
    //    ##     ## ##     ##   ## ##   ##  ##  ##
    //    ##     ## ##     ##  ##   ##  ##  ##  ##
    //    ##     ## ########  ##     ## ##  ##  ##
    //    ##     ## ##   ##   ######### ##  ##  ##
    //    ##     ## ##    ##  ##     ## ##  ##  ##
    //    ########  ##     ## ##     ##  ###  ###

    /**
     * Draws back decorations on the corresponding layer.
     *
     * The lines range to draw is specified by the `firstRow` and `lastRow`
     * parameters.
     *
     * @param  {number} firstRow the first row to render
     * @param  {number} lastRow the last row to render
     * @param  {number} offsetRow the relative offset to apply to rows when
     *                            rendering them
     * @access private
     */
  }, {
    key: 'drawBackDecorationsForLines',
    value: function drawBackDecorationsForLines(firstRow, lastRow, offsetRow) {
      if (firstRow > lastRow) {
        return;
      }

      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var lineHeight = this.minimap.getLineHeight() * devicePixelRatio;
      var charHeight = this.minimap.getCharHeight() * devicePixelRatio;
      var charWidth = this.minimap.getCharWidth() * devicePixelRatio;
      var decorations = this.minimap.decorationsByTypeThenRows(firstRow, lastRow);

      var _tokensLayer$getSize = this.tokensLayer.getSize();

      var canvasWidth = _tokensLayer$getSize.width;
      var canvasHeight = _tokensLayer$getSize.height;

      var renderData = {
        context: this.backLayer.context,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        lineHeight: lineHeight,
        charWidth: charWidth,
        charHeight: charHeight,
        orders: _main2['default'].getPluginsOrder()
      };

      for (var screenRow = firstRow; screenRow <= lastRow; screenRow++) {
        renderData.row = offsetRow + (screenRow - firstRow);
        renderData.yRow = renderData.row * lineHeight;
        renderData.screenRow = screenRow;

        this.drawDecorations(screenRow, decorations, renderData, {
          'line': this.drawLineDecoration,
          'highlight-under': this.drawHighlightDecoration
        });
      }

      this.backLayer.context.fill();
    }

    /**
     * Draws front decorations on the corresponding layer.
     *
     * The lines range to draw is specified by the `firstRow` and `lastRow`
     * parameters.
     *
     * @param  {number} firstRow the first row to render
     * @param  {number} lastRow the last row to render
     * @param  {number} offsetRow the relative offset to apply to rows when
     *                            rendering them
     * @access private
     */
  }, {
    key: 'drawFrontDecorationsForLines',
    value: function drawFrontDecorationsForLines(firstRow, lastRow, offsetRow) {
      if (firstRow > lastRow) {
        return;
      }

      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var lineHeight = this.minimap.getLineHeight() * devicePixelRatio;
      var charHeight = this.minimap.getCharHeight() * devicePixelRatio;
      var charWidth = this.minimap.getCharWidth() * devicePixelRatio;
      var decorations = this.minimap.decorationsByTypeThenRows(firstRow, lastRow);

      var _tokensLayer$getSize2 = this.tokensLayer.getSize();

      var canvasWidth = _tokensLayer$getSize2.width;
      var canvasHeight = _tokensLayer$getSize2.height;

      var renderData = {
        context: this.frontLayer.context,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        lineHeight: lineHeight,
        charWidth: charWidth,
        charHeight: charHeight,
        orders: _main2['default'].getPluginsOrder()
      };

      for (var screenRow = firstRow; screenRow <= lastRow; screenRow++) {
        renderData.row = offsetRow + (screenRow - firstRow);
        renderData.yRow = renderData.row * lineHeight;
        renderData.screenRow = screenRow;

        this.drawDecorations(screenRow, decorations, renderData, {
          'highlight-over': this.drawHighlightDecoration,
          'highlight-outline': this.drawHighlightOutlineDecoration
        });
      }

      renderData.context.fill();
    }

    /**
     * Draws lines on the corresponding layer.
     *
     * The lines range to draw is specified by the `firstRow` and `lastRow`
     * parameters.
     *
     * @param  {number} firstRow the first row to render
     * @param  {number} lastRow the last row to render
     * @param  {number} offsetRow the relative offset to apply to rows when
     *                            rendering them
     * @access private
     */
  }, {
    key: 'drawLines',
    value: function drawLines(firstRow, lastRow, offsetRow) {
      if (firstRow > lastRow) {
        return;
      }

      var devicePixelRatio = this.minimap.getDevicePixelRatio();
      var lines = this.getTextEditor().tokenizedLinesForScreenRows(firstRow, lastRow);
      var lineHeight = this.minimap.getLineHeight() * devicePixelRatio;
      var charHeight = this.minimap.getCharHeight() * devicePixelRatio;
      var charWidth = this.minimap.getCharWidth() * devicePixelRatio;
      var displayCodeHighlights = this.displayCodeHighlights;
      var context = this.tokensLayer.context;

      var _tokensLayer$getSize3 = this.tokensLayer.getSize();

      var canvasWidth = _tokensLayer$getSize3.width;

      var line = lines[0];
      var invisibleRegExp = this.getInvisibleRegExp(line);

      for (var i = 0, len = lines.length; i < len; i++) {
        line = lines[i];
        var yRow = (offsetRow + i) * lineHeight;
        var x = 0;

        if ((line != null ? line.tokens : void 0) != null) {
          var tokens = line.tokens;
          for (var j = 0, tokensCount = tokens.length; j < tokensCount; j++) {
            var token = tokens[j];
            var w = token.screenDelta;
            if (!token.isOnlyWhitespace()) {
              var color = displayCodeHighlights ? this.getTokenColor(token) : this.getDefaultColor();

              var value = token.value;
              if (invisibleRegExp != null) {
                value = value.replace(invisibleRegExp, ' ');
              }
              x = this.drawToken(context, value, color, x, yRow, charWidth, charHeight);
            } else {
              x += w * charWidth;
            }

            if (x > canvasWidth) {
              break;
            }
          }
        }
      }

      context.fill();
    }

    /**
     * Returns the regexp to replace invisibles substitution characters
     * in editor lines.
     *
     * @param  {TokenizedLine} line a tokenized lize to read the invisible
     *                              characters
     * @return {RegExp} the regular expression to match invisible characters
     * @access private
     */
  }, {
    key: 'getInvisibleRegExp',
    value: function getInvisibleRegExp(line) {
      if (line != null && line.invisibles != null) {
        var invisibles = [];
        if (line.invisibles.cr != null) {
          invisibles.push(line.invisibles.cr);
        }
        if (line.invisibles.eol != null) {
          invisibles.push(line.invisibles.eol);
        }
        if (line.invisibles.space != null) {
          invisibles.push(line.invisibles.space);
        }
        if (line.invisibles.tab != null) {
          invisibles.push(line.invisibles.tab);
        }

        return RegExp(invisibles.filter(function (s) {
          return typeof s === 'string';
        }).map(_underscorePlus2['default'].escapeRegExp).join('|'), 'g');
      }
    }

    /**
     * Draws a single token on the given context.
     *
     * @param  {CanvasRenderingContext2D} context the target canvas context
     * @param  {string} text the token's text content
     * @param  {string} color the token's CSS color
     * @param  {number} x the x position of the token in the line
     * @param  {number} y the y position of the line in the minimap
     * @param  {number} charWidth the width of a character in the minimap
     * @param  {number} charHeight the height of a character in the minimap
     * @return {number} the x position at the end of the token
     * @access private
     */
  }, {
    key: 'drawToken',
    value: function drawToken(context, text, color, x, y, charWidth, charHeight) {
      context.fillStyle = color;

      var chars = 0;
      for (var j = 0, len = text.length; j < len; j++) {
        var char = text[j];
        if (/\s/.test(char)) {
          if (chars > 0) {
            context.fillRect(x - chars * charWidth, y, chars * charWidth, charHeight);
          }
          chars = 0;
        } else {
          chars++;
        }
        x += charWidth;
      }
      if (chars > 0) {
        context.fillRect(x - chars * charWidth, y, chars * charWidth, charHeight);
      }
      return x;
    }

    /**
     * Draws the specified decorations for the current `screenRow`.
     *
     * The `decorations` object contains all the decorations grouped by type and
     * then rows.
     *
     * @param  {number} screenRow the screen row index for which
     *                            render decorations
     * @param  {Object} decorations the object containing all the decorations
     * @param  {Object} renderData the object containing the render data
     * @param  {Object} types an object with the type to render as key and the
     *                        render method as value
     * @access private
     */
  }, {
    key: 'drawDecorations',
    value: function drawDecorations(screenRow, decorations, renderData, types) {
      var decorationsToRender = [];

      for (var i in types) {
        decorationsToRender = decorationsToRender.concat(decorations[i] != null ? decorations[i][screenRow] || [] : []);
      }

      decorationsToRender.sort(function (a, b) {
        return (renderData.orders[a.properties.plugin] || 0) - (renderData.orders[b.properties.plugin] || 0);
      });

      if (decorationsToRender != null ? decorationsToRender.length : void 0) {
        for (var i = 0, len = decorationsToRender.length; i < len; i++) {
          types[decorationsToRender[i].properties.type].call(this, decorationsToRender[i], renderData);
        }
      }
    }

    /**
     * Draws a line decoration.
     *
     * @param  {Decoration} decoration the decoration to render
     * @param  {Object} data the data need to perform the render
     * @access private
     */
  }, {
    key: 'drawLineDecoration',
    value: function drawLineDecoration(decoration, data) {
      data.context.fillStyle = this.getDecorationColor(decoration);
      data.context.fillRect(0, data.yRow, data.canvasWidth, data.lineHeight);
    }

    /**
     * Draws a highlight decoration.
     *
     * It renders only the part of the highlight corresponding to the specified
     * row.
     *
     * @param  {Decoration} decoration the decoration to render
     * @param  {Object} data the data need to perform the render
     * @access private
     */
  }, {
    key: 'drawHighlightDecoration',
    value: function drawHighlightDecoration(decoration, data) {
      var range = decoration.getMarker().getScreenRange();
      var rowSpan = range.end.row - range.start.row;

      data.context.fillStyle = this.getDecorationColor(decoration);

      if (rowSpan === 0) {
        var colSpan = range.end.column - range.start.column;
        data.context.fillRect(range.start.column * data.charWidth, data.yRow, colSpan * data.charWidth, data.lineHeight);
      } else if (data.screenRow === range.start.row) {
        var x = range.start.column * data.charWidth;
        data.context.fillRect(x, data.yRow, data.canvasWidth - x, data.lineHeight);
      } else if (data.screenRow === range.end.row) {
        data.context.fillRect(0, data.yRow, range.end.column * data.charWidth, data.lineHeight);
      } else {
        data.context.fillRect(0, data.yRow, data.canvasWidth, data.lineHeight);
      }
    }

    /**
     * Draws a highlight outline decoration.
     *
     * It renders only the part of the highlight corresponding to the specified
     * row.
     *
     * @param  {Decoration} decoration the decoration to render
     * @param  {Object} data the data need to perform the render
     * @access private
     */
  }, {
    key: 'drawHighlightOutlineDecoration',
    value: function drawHighlightOutlineDecoration(decoration, data) {
      var bottomWidth = undefined,
          colSpan = undefined,
          width = undefined,
          xBottomStart = undefined,
          xEnd = undefined,
          xStart = undefined;
      var lineHeight = data.lineHeight;
      var charWidth = data.charWidth;
      var canvasWidth = data.canvasWidth;
      var screenRow = data.screenRow;

      var range = decoration.getMarker().getScreenRange();
      var rowSpan = range.end.row - range.start.row;
      var yStart = data.yRow;
      var yEnd = yStart + lineHeight;

      data.context.fillStyle = this.getDecorationColor(decoration);

      if (rowSpan === 0) {
        colSpan = range.end.column - range.start.column;
        width = colSpan * charWidth;
        xStart = range.start.column * charWidth;
        xEnd = xStart + width;

        data.context.fillRect(xStart, yStart, width, 1);
        data.context.fillRect(xStart, yEnd, width, 1);
        data.context.fillRect(xStart, yStart, 1, lineHeight);
        data.context.fillRect(xEnd, yStart, 1, lineHeight);
      } else if (rowSpan === 1) {
        xStart = range.start.column * data.charWidth;
        xEnd = range.end.column * data.charWidth;

        if (screenRow === range.start.row) {
          width = data.canvasWidth - xStart;
          xBottomStart = Math.max(xStart, xEnd);
          bottomWidth = data.canvasWidth - xBottomStart;

          data.context.fillRect(xStart, yStart, width, 1);
          data.context.fillRect(xBottomStart, yEnd, bottomWidth, 1);
          data.context.fillRect(xStart, yStart, 1, lineHeight);
          data.context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
        } else {
          width = canvasWidth - xStart;
          bottomWidth = canvasWidth - xEnd;

          data.context.fillRect(0, yStart, xStart, 1);
          data.context.fillRect(0, yEnd, xEnd, 1);
          data.context.fillRect(0, yStart, 1, lineHeight);
          data.context.fillRect(xEnd, yStart, 1, lineHeight);
        }
      } else {
        xStart = range.start.column * charWidth;
        xEnd = range.end.column * charWidth;
        if (screenRow === range.start.row) {
          width = canvasWidth - xStart;

          data.context.fillRect(xStart, yStart, width, 1);
          data.context.fillRect(xStart, yStart, 1, lineHeight);
          data.context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
        } else if (screenRow === range.end.row) {
          width = canvasWidth - xStart;

          data.context.fillRect(0, yEnd, xEnd, 1);
          data.context.fillRect(0, yStart, 1, lineHeight);
          data.context.fillRect(xEnd, yStart, 1, lineHeight);
        } else {
          data.context.fillRect(0, yStart, 1, lineHeight);
          data.context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
          if (screenRow === range.start.row + 1) {
            data.context.fillRect(0, yStart, xStart, 1);
          }
          if (screenRow === range.end.row - 1) {
            data.context.fillRect(xEnd, yEnd, canvasWidth - xEnd, 1);
          }
        }
      }
    }

    //    ########     ###    ##    ##  ######   ########  ######
    //    ##     ##   ## ##   ###   ## ##    ##  ##       ##    ##
    //    ##     ##  ##   ##  ####  ## ##        ##       ##
    //    ########  ##     ## ## ## ## ##   #### ######    ######
    //    ##   ##   ######### ##  #### ##    ##  ##             ##
    //    ##    ##  ##     ## ##   ### ##    ##  ##       ##    ##
    //    ##     ## ##     ## ##    ##  ######   ########  ######

    /**
     * Computes the ranges that are not affected by the current pending changes.
     *
     * @param  {number} firstRow the first row of the rendered region
     * @param  {number} lastRow the last row of the rendered region
     * @return {Array<Object>} the intact ranges in the rendered region
     * @access private
     */
  }, {
    key: 'computeIntactRanges',
    value: function computeIntactRanges(firstRow, lastRow, changes) {
      if (this.offscreenFirstRow == null && this.offscreenLastRow == null) {
        return [];
      }

      // At first, the whole range is considered intact
      var intactRanges = [{
        start: this.offscreenFirstRow,
        end: this.offscreenLastRow,
        offscreenRow: 0
      }];

      for (var i = 0, len = changes.length; i < len; i++) {
        var change = changes[i];
        var newIntactRanges = [];

        for (var j = 0, intactLen = intactRanges.length; j < intactLen; j++) {
          var range = intactRanges[j];

          if (change.end < range.start && change.screenDelta !== 0) {
            // The change is above of the range and lines are either
            // added or removed
            newIntactRanges.push({
              start: range.start + change.screenDelta,
              end: range.end + change.screenDelta,
              offscreenRow: range.offscreenRow
            });
          } else if (change.end < range.start || change.start > range.end) {
            // The change is outside the range but didn't add
            // or remove lines
            newIntactRanges.push(range);
          } else {
            // The change is within the range, there's one intact range
            // from the range start to the change start
            if (change.start > range.start) {
              newIntactRanges.push({
                start: range.start,
                end: change.start - 1,
                offscreenRow: range.offscreenRow
              });
            }
            if (change.end < range.end) {
              // The change ends within the range
              if (change.bufferDelta !== 0) {
                // Lines are added or removed, the intact range starts in the
                // next line after the change end plus the screen delta
                newIntactRanges.push({
                  start: change.end + change.screenDelta + 1,
                  end: range.end + change.screenDelta,
                  offscreenRow: range.offscreenRow + change.end + 1 - range.start
                });
              } else if (change.screenDelta !== 0) {
                // Lines are added or removed in the display buffer, the intact
                // range starts in the next line after the change end plus the
                // screen delta
                newIntactRanges.push({
                  start: change.end + change.screenDelta + 1,
                  end: range.end + change.screenDelta,
                  offscreenRow: range.offscreenRow + change.end + 1 - range.start
                });
              } else {
                // No lines are added, the intact range starts on the line after
                // the change end
                newIntactRanges.push({
                  start: change.end + 1,
                  end: range.end,
                  offscreenRow: range.offscreenRow + change.end + 1 - range.start
                });
              }
            }
          }
        }
        intactRanges = newIntactRanges;
      }

      return this.truncateIntactRanges(intactRanges, firstRow, lastRow);
    }

    /**
     * Truncates the intact ranges so that they doesn't expand past the visible
     * area of the minimap.
     *
     * @param  {Array<Object>} intactRanges the initial array of ranges
     * @param  {number} firstRow the first row of the rendered region
     * @param  {number} lastRow the last row of the rendered region
     * @return {Array<Object>} the array of truncated ranges
     * @access private
     */
  }, {
    key: 'truncateIntactRanges',
    value: function truncateIntactRanges(intactRanges, firstRow, lastRow) {
      var i = 0;
      while (i < intactRanges.length) {
        var range = intactRanges[i];

        if (range.start < firstRow) {
          range.offscreenRow += firstRow - range.start;
          range.start = firstRow;
        }

        if (range.end > lastRow) {
          range.end = lastRow;
        }

        if (range.start >= range.end) {
          intactRanges.splice(i--, 1);
        }

        i++;
      }

      return intactRanges.sort(function (a, b) {
        return a.offscreenRow - b.offscreenRow;
      });
    }
  }]);

  return CanvasDrawer;
})(_mixto2['default']);

exports['default'] = CanvasDrawer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taXhpbnMvY2FudmFzLWRyYXdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs4QkFFYyxpQkFBaUI7Ozs7cUJBQ2IsT0FBTzs7OztvQkFDUixTQUFTOzs7OzJCQUNGLGlCQUFpQjs7Ozs7Ozs7Ozs7QUFMekMsV0FBVyxDQUFBOztJQWNVLFlBQVk7WUFBWixZQUFZOztXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7O2VBQVosWUFBWTs7Ozs7O1dBSWQsNEJBQUc7Ozs7O0FBS2xCLFVBQUksQ0FBQyxXQUFXLEdBQUcsOEJBQWlCLENBQUE7Ozs7O0FBS3BDLFVBQUksQ0FBQyxTQUFTLEdBQUcsOEJBQWlCLENBQUE7Ozs7O0FBS2xDLFVBQUksQ0FBQyxVQUFVLEdBQUcsOEJBQWlCLENBQUE7O0FBRW5DLFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFOzs7Ozs7QUFNeEIsWUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUE7T0FDekI7O0FBRUQsVUFBSSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRTs7Ozs7O0FBTXRDLFlBQUksQ0FBQyw0QkFBNEIsR0FBRyxFQUFFLENBQUE7T0FDdkM7O0FBRUQsVUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRTs7Ozs7O0FBTXZDLFlBQUksQ0FBQyw2QkFBNkIsR0FBRyxFQUFFLENBQUE7T0FDeEM7S0FDRjs7Ozs7Ozs7O1dBT2MsMEJBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFBO0tBQUU7Ozs7Ozs7Ozs7V0FRcEMsd0JBQUMsTUFBTSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzdCLFVBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQy9CLFVBQUks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LE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtTQUFFOztBQUU3RCxTQUFDLEVBQUUsQ0FBQTtPQUNKOztBQUVELGFBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDakMsZUFBTyxDQUFDLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUE7T0FDdkMsQ0FBQyxDQUFBO0tBQ0g7OztTQTF3QmtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9Vc2Vycy92aWN0b3IubWFydGlucy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taXhpbnMvY2FudmFzLWRyYXdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cydcbmltcG9ydCBNaXhpbiBmcm9tICdtaXh0bydcbmltcG9ydCBNYWluIGZyb20gJy4uL21haW4nXG5pbXBvcnQgQ2FudmFzTGF5ZXIgZnJvbSAnLi4vY2FudmFzLWxheWVyJ1xuXG4vKipcbiAqIFRoZSBgQ2FudmFzRHJhd2VyYCBtaXhpbiBpcyByZXNwb25zaWJsZSBmb3IgdGhlIHJlbmRlcmluZyBvZiBhIGBNaW5pbWFwYFxuICogaW4gYSBgY2FudmFzYCBlbGVtZW50LlxuICpcbiAqIFRoaXMgbWl4aW4gaXMgaW5qZWN0ZWQgaW4gdGhlIGBNaW5pbWFwRWxlbWVudGAgcHJvdG90eXBlLCBzbyBhbGwgdGhlc2VcbiAqIG1ldGhvZHMgIGFyZSBhdmFpbGFibGUgb24gYW55IGBNaW5pbWFwRWxlbWVudGAgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc0RyYXdlciBleHRlbmRzIE1peGluIHtcbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBjYW52YXMgZWxlbWVudHMgbmVlZGVkIHRvIHBlcmZvcm0gdGhlIGBNaW5pbWFwYCByZW5kZXJpbmcuXG4gICAqL1xuICBpbml0aWFsaXplQ2FudmFzICgpIHtcbiAgICAvKipcbiAgICAqIFRoZSBtYWluIGNhbnZhcyBsYXllciB3aGVyZSBsaW5lcyBhcmUgcmVuZGVyZWQuXG4gICAgKiBAdHlwZSB7Q2FudmFzTGF5ZXJ9XG4gICAgKi9cbiAgICB0aGlzLnRva2Vuc0xheWVyID0gbmV3IENhbnZhc0xheWVyKClcbiAgICAvKipcbiAgICAqIFRoZSBjYW52YXMgbGF5ZXIgZm9yIGRlY29yYXRpb25zIGJlbG93IHRoZSB0ZXh0LlxuICAgICogQHR5cGUge0NhbnZhc0xheWVyfVxuICAgICovXG4gICAgdGhpcy5iYWNrTGF5ZXIgPSBuZXcgQ2FudmFzTGF5ZXIoKVxuICAgIC8qKlxuICAgICogVGhlIGNhbnZhcyBsYXllciBmb3IgZGVjb3JhdGlvbnMgYWJvdmUgdGhlIHRleHQuXG4gICAgKiBAdHlwZSB7Q2FudmFzTGF5ZXJ9XG4gICAgKi9cbiAgICB0aGlzLmZyb250TGF5ZXIgPSBuZXcgQ2FudmFzTGF5ZXIoKVxuXG4gICAgaWYgKCF0aGlzLnBlbmRpbmdDaGFuZ2VzKSB7XG4gICAgICAvKipcbiAgICAgICAqIFN0b3JlcyB0aGUgY2hhbmdlcyBmcm9tIHRoZSB0ZXh0IGVkaXRvci5cbiAgICAgICAqIEB0eXBlIHtBcnJheTxPYmplY3Q+fVxuICAgICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHRoaXMucGVuZGluZ0NoYW5nZXMgPSBbXVxuICAgIH1cblxuICAgIGlmICghdGhpcy5wZW5kaW5nQmFja0RlY29yYXRpb25DaGFuZ2VzKSB7XG4gICAgICAvKipcbiAgICAgICAqIFN0b3JlcyB0aGUgY2hhbmdlcyBmcm9tIHRoZSBtaW5pbWFwIGJhY2sgZGVjb3JhdGlvbnMuXG4gICAgICAgKiBAdHlwZSB7QXJyYXk8T2JqZWN0Pn1cbiAgICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAgICovXG4gICAgICB0aGlzLnBlbmRpbmdCYWNrRGVjb3JhdGlvbkNoYW5nZXMgPSBbXVxuICAgIH1cblxuICAgIGlmICghdGhpcy5wZW5kaW5nRnJvbnREZWNvcmF0aW9uQ2hhbmdlcykge1xuICAgICAgLyoqXG4gICAgICAgKiBTdG9yZXMgdGhlIGNoYW5nZXMgZnJvbSB0aGUgbWluaW1hcCBmcm9udCBkZWNvcmF0aW9ucy5cbiAgICAgICAqIEB0eXBlIHtBcnJheTxPYmplY3Q+fVxuICAgICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHRoaXMucGVuZGluZ0Zyb250RGVjb3JhdGlvbkNoYW5nZXMgPSBbXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB1cHBlcm1vc3QgY2FudmFzIGluIHRoZSBNaW5pbWFwRWxlbWVudC5cbiAgICpcbiAgICogQHJldHVybiB7SFRNTENhbnZhc0VsZW1lbnR9IHRoZSBodG1sIGNhbnZhcyBlbGVtZW50XG4gICAqL1xuICBnZXRGcm9udENhbnZhcyAoKSB7IHJldHVybiB0aGlzLmZyb250TGF5ZXIuY2FudmFzIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhlIGNhbnZhc2VzIGludG8gdGhlIHNwZWNpZmllZCBjb250YWluZXIuXG4gICAqXG4gICAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBwYXJlbnQgdGhlIGNhbnZhc2VzJyBjb250YWluZXJcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBhdHRhY2hDYW52YXNlcyAocGFyZW50KSB7XG4gICAgdGhpcy5iYWNrTGF5ZXIuYXR0YWNoKHBhcmVudClcbiAgICB0aGlzLnRva2Vuc0xheWVyLmF0dGFjaChwYXJlbnQpXG4gICAgdGhpcy5mcm9udExheWVyLmF0dGFjaChwYXJlbnQpXG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlcyB0aGUgc2l6ZSBvZiBhbGwgdGhlIGNhbnZhcyBsYXllcnMgYXQgb25jZS5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIHRoZSBuZXcgd2lkdGggZm9yIHRoZSB0aHJlZSBjYW52YXNlc1xuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IHRoZSBuZXcgaGVpZ2h0IGZvciB0aGUgdGhyZWUgY2FudmFzZXNcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBzZXRDYW52YXNlc1NpemUgKHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLmJhY2tMYXllci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpXG4gICAgdGhpcy50b2tlbnNMYXllci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpXG4gICAgdGhpcy5mcm9udExheWVyLnNldFNpemUod2lkdGgsIGhlaWdodClcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhbiB1cGRhdGUgb2YgdGhlIHJlbmRlcmVkIGBNaW5pbWFwYCBiYXNlZCBvbiB0aGUgY2hhbmdlc1xuICAgKiByZWdpc3RlcmVkIGluIHRoZSBpbnN0YW5jZS5cbiAgICovXG4gIHVwZGF0ZUNhbnZhcyAoKSB7XG4gICAgY29uc3QgZmlyc3RSb3cgPSB0aGlzLm1pbmltYXAuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KClcbiAgICBjb25zdCBsYXN0Um93ID0gdGhpcy5taW5pbWFwLmdldExhc3RWaXNpYmxlU2NyZWVuUm93KClcblxuICAgIHRoaXMudXBkYXRlVG9rZW5zTGF5ZXIoZmlyc3RSb3csIGxhc3RSb3cpXG4gICAgdGhpcy51cGRhdGVCYWNrRGVjb3JhdGlvbnNMYXllcnMoZmlyc3RSb3csIGxhc3RSb3cpXG4gICAgdGhpcy51cGRhdGVGcm9udERlY29yYXRpb25zTGF5ZXJzKGZpcnN0Um93LCBsYXN0Um93KVxuXG4gICAgdGhpcy5wZW5kaW5nQ2hhbmdlcyA9IFtdXG4gICAgdGhpcy5wZW5kaW5nQmFja0RlY29yYXRpb25DaGFuZ2VzID0gW11cbiAgICB0aGlzLnBlbmRpbmdGcm9udERlY29yYXRpb25DaGFuZ2VzID0gW11cblxuICAgIC8qKlxuICAgICAqIFRoZSBmaXJzdCByb3cgaW4gdGhlIGxhc3QgcmVuZGVyIG9mIHRoZSBvZmZzY3JlZW4gY2FudmFzLlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5vZmZzY3JlZW5GaXJzdFJvdyA9IGZpcnN0Um93XG4gICAgLyoqXG4gICAgICogVGhlIGxhc3Qgcm93IGluIHRoZSBsYXN0IHJlbmRlciBvZiB0aGUgb2Zmc2NyZWVuIGNhbnZhcy5cbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMub2Zmc2NyZWVuTGFzdFJvdyA9IGxhc3RSb3dcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhbiB1cGRhdGUgb2YgdGhlIHRva2VucyBsYXllciB1c2luZyB0aGUgcGVuZGluZyBjaGFuZ2VzIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGZpcnN0Um93IGZpcnN0Um93IHRoZSBmaXJzdCByb3cgb2YgdGhlIHJhbmdlIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGxhc3RSb3cgbGFzdFJvdyB0aGUgbGFzdCByb3cgb2YgdGhlIHJhbmdlIHRvIHVwZGF0ZVxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHVwZGF0ZVRva2Vuc0xheWVyIChmaXJzdFJvdywgbGFzdFJvdykge1xuICAgIGNvbnN0IGludGFjdFJhbmdlcyA9IHRoaXMuY29tcHV0ZUludGFjdFJhbmdlcyhmaXJzdFJvdywgbGFzdFJvdywgdGhpcy5wZW5kaW5nQ2hhbmdlcylcblxuICAgIHRoaXMucmVkcmF3UmFuZ2VzT25MYXllcih0aGlzLnRva2Vuc0xheWVyLCBpbnRhY3RSYW5nZXMsIGZpcnN0Um93LCBsYXN0Um93LCB0aGlzLmRyYXdMaW5lcylcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhbiB1cGRhdGUgb2YgdGhlIGJhY2sgZGVjb3JhdGlvbnMgbGF5ZXIgdXNpbmcgdGhlIHBlbmRpbmcgY2hhbmdlc1xuICAgKiBhbmQgdGhlIHBlbmRpbmcgYmFjayBkZWNvcmF0aW9ucyBjaGFuZ2VzIGFycmF5cy5cbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSBmaXJzdFJvdyBmaXJzdFJvdyB0aGUgZmlyc3Qgcm93IG9mIHRoZSByYW5nZSB0byB1cGRhdGVcbiAgICogQHBhcmFtICB7bnVtYmVyfSBsYXN0Um93IGxhc3RSb3cgdGhlIGxhc3Qgcm93IG9mIHRoZSByYW5nZSB0byB1cGRhdGVcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICB1cGRhdGVCYWNrRGVjb3JhdGlvbnNMYXllcnMgKGZpcnN0Um93LCBsYXN0Um93KSB7XG4gICAgY29uc3QgaW50YWN0UmFuZ2VzID0gdGhpcy5jb21wdXRlSW50YWN0UmFuZ2VzKGZpcnN0Um93LCBsYXN0Um93LCB0aGlzLnBlbmRpbmdDaGFuZ2VzLmNvbmNhdCh0aGlzLnBlbmRpbmdCYWNrRGVjb3JhdGlvbkNoYW5nZXMpKVxuXG4gICAgdGhpcy5yZWRyYXdSYW5nZXNPbkxheWVyKHRoaXMuYmFja0xheWVyLCBpbnRhY3RSYW5nZXMsIGZpcnN0Um93LCBsYXN0Um93LCB0aGlzLmRyYXdCYWNrRGVjb3JhdGlvbnNGb3JMaW5lcylcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhbiB1cGRhdGUgb2YgdGhlIGZyb250IGRlY29yYXRpb25zIGxheWVyIHVzaW5nIHRoZSBwZW5kaW5nIGNoYW5nZXNcbiAgICogYW5kIHRoZSBwZW5kaW5nIGZyb250IGRlY29yYXRpb25zIGNoYW5nZXMgYXJyYXlzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGZpcnN0Um93IGZpcnN0Um93IHRoZSBmaXJzdCByb3cgb2YgdGhlIHJhbmdlIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGxhc3RSb3cgbGFzdFJvdyB0aGUgbGFzdCByb3cgb2YgdGhlIHJhbmdlIHRvIHVwZGF0ZVxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHVwZGF0ZUZyb250RGVjb3JhdGlvbnNMYXllcnMgKGZpcnN0Um93LCBsYXN0Um93KSB7XG4gICAgY29uc3QgaW50YWN0UmFuZ2VzID0gdGhpcy5jb21wdXRlSW50YWN0UmFuZ2VzKGZpcnN0Um93LCBsYXN0Um93LCB0aGlzLnBlbmRpbmdDaGFuZ2VzLmNvbmNhdCh0aGlzLnBlbmRpbmdGcm9udERlY29yYXRpb25DaGFuZ2VzKSlcblxuICAgIHRoaXMucmVkcmF3UmFuZ2VzT25MYXllcih0aGlzLmZyb250TGF5ZXIsIGludGFjdFJhbmdlcywgZmlyc3RSb3csIGxhc3RSb3csIHRoaXMuZHJhd0Zyb250RGVjb3JhdGlvbnNGb3JMaW5lcylcbiAgfVxuXG4gIC8qKlxuICAgKiBSb3V0aW5lIHVzZWQgdG8gcmVuZGVyIGNoYW5nZXMgaW4gc3BlY2lmaWMgcmFuZ2VzIGZvciBvbmUgbGF5ZXIuXG4gICAqXG4gICAqIEBwYXJhbSAge0NhbnZhc0xheWVyfSBsYXllciB0aGUgbGF5ZXIgdG8gcmVkcmF3XG4gICAqIEBwYXJhbSAge0FycmF5PE9iamVjdD59IGludGFjdFJhbmdlcyBhbiBhcnJheSBvZiB0aGUgcmFuZ2VzIHRvIGxlYXZlIGludGFjdFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGZpcnN0Um93IGZpcnN0Um93IHRoZSBmaXJzdCByb3cgb2YgdGhlIHJhbmdlIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGxhc3RSb3cgbGFzdFJvdyB0aGUgbGFzdCByb3cgb2YgdGhlIHJhbmdlIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gbWV0aG9kIHRoZSByZW5kZXIgbWV0aG9kIHRvIHVzZSBmb3IgdGhlIGxpbmVzIGRyYXdpbmdcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICByZWRyYXdSYW5nZXNPbkxheWVyIChsYXllciwgaW50YWN0UmFuZ2VzLCBmaXJzdFJvdywgbGFzdFJvdywgbWV0aG9kKSB7XG4gICAgY29uc3QgZGV2aWNlUGl4ZWxSYXRpbyA9IHRoaXMubWluaW1hcC5nZXREZXZpY2VQaXhlbFJhdGlvKClcbiAgICBjb25zdCBsaW5lSGVpZ2h0ID0gdGhpcy5taW5pbWFwLmdldExpbmVIZWlnaHQoKSAqIGRldmljZVBpeGVsUmF0aW9cblxuICAgIGxheWVyLmNsZWFyQ2FudmFzKClcblxuICAgIGlmIChpbnRhY3RSYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBtZXRob2QuY2FsbCh0aGlzLCBmaXJzdFJvdywgbGFzdFJvdywgMClcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IGludGFjdFJhbmdlcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBjb25zdCBpbnRhY3QgPSBpbnRhY3RSYW5nZXNbal1cblxuICAgICAgICBsYXllci5jb3B5UGFydEZyb21PZmZzY3JlZW4oXG4gICAgICAgICAgaW50YWN0Lm9mZnNjcmVlblJvdyAqIGxpbmVIZWlnaHQsXG4gICAgICAgICAgKGludGFjdC5zdGFydCAtIGZpcnN0Um93KSAqIGxpbmVIZWlnaHQsXG4gICAgICAgICAgKGludGFjdC5lbmQgLSBpbnRhY3Quc3RhcnQpICogbGluZUhlaWdodFxuICAgICAgICApXG4gICAgICB9XG4gICAgICB0aGlzLmRyYXdMaW5lc0ZvclJhbmdlcyhtZXRob2QsIGludGFjdFJhbmdlcywgZmlyc3RSb3csIGxhc3RSb3cpXG4gICAgfVxuXG4gICAgbGF5ZXIucmVzZXRPZmZzY3JlZW5TaXplKClcbiAgICBsYXllci5jb3B5VG9PZmZzY3JlZW4oKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgdGhlIGxpbmVzIGJldHdlZW4gdGhlIGludGFjdCByYW5nZXMgd2hlbiBhbiB1cGRhdGUgaGFzIHBlbmRpbmdcbiAgICogY2hhbmdlcy5cbiAgICpcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IG1ldGhvZCB0aGUgcmVuZGVyIG1ldGhvZCB0byB1c2UgZm9yIHRoZSBsaW5lcyBkcmF3aW5nXG4gICAqIEBwYXJhbSAge0FycmF5PE9iamVjdD59IGludGFjdFJhbmdlcyB0aGUgaW50YWN0IHJhbmdlcyBpbiB0aGUgbWluaW1hcFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGZpcnN0Um93IHRoZSBmaXJzdCByb3cgb2YgdGhlIHJlbmRlcmVkIHJlZ2lvblxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGxhc3RSb3cgdGhlIGxhc3Qgcm93IG9mIHRoZSByZW5kZXJlZCByZWdpb25cbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkcmF3TGluZXNGb3JSYW5nZXMgKG1ldGhvZCwgcmFuZ2VzLCBmaXJzdFJvdywgbGFzdFJvdykge1xuICAgIGxldCBjdXJyZW50Um93ID0gZmlyc3RSb3dcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcmFuZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCByYW5nZSA9IHJhbmdlc1tpXVxuXG4gICAgICBtZXRob2QuY2FsbCh0aGlzLCBjdXJyZW50Um93LCByYW5nZS5zdGFydCAtIDEsIGN1cnJlbnRSb3cgLSBmaXJzdFJvdylcblxuICAgICAgY3VycmVudFJvdyA9IHJhbmdlLmVuZFxuICAgIH1cbiAgICBpZiAoY3VycmVudFJvdyA8PSBsYXN0Um93KSB7XG4gICAgICBtZXRob2QuY2FsbCh0aGlzLCBjdXJyZW50Um93LCBsYXN0Um93LCBjdXJyZW50Um93IC0gZmlyc3RSb3cpXG4gICAgfVxuICB9XG5cbiAgLy8gICAgICMjIyMjIyAgICMjIyMjIyMgICMjICAgICAgICAjIyMjIyMjICAjIyMjIyMjIyAgICMjIyMjI1xuICAvLyAgICAjIyAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICAjIyAjI1xuICAvLyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjIyMjIyMjICAgIyMjIyMjXG4gIC8vICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAjIyAgICAgICAgICMjXG4gIC8vICAgICMjICAgICMjICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgIyMgICMjICAgICMjXG4gIC8vICAgICAjIyMjIyMgICAjIyMjIyMjICAjIyMjIyMjIyAgIyMjIyMjIyAgIyMgICAgICMjICAjIyMjIyNcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgb3BhY2l0eSB2YWx1ZSB0byB1c2Ugd2hlbiByZW5kZXJpbmcgdGhlIGBNaW5pbWFwYCB0ZXh0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSB0ZXh0IG9wYWNpdHkgdmFsdWVcbiAgICovXG4gIGdldFRleHRPcGFjaXR5ICgpIHsgcmV0dXJuIHRoaXMudGV4dE9wYWNpdHkgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZWZhdWx0IHRleHQgY29sb3IgZm9yIGFuIGVkaXRvciBjb250ZW50LlxuICAgKlxuICAgKiBUaGUgY29sb3IgdmFsdWUgaXMgZGlyZWN0bHkgcmVhZCBmcm9tIHRoZSBgVGV4dEVkaXRvclZpZXdgIGNvbXB1dGVkIHN0eWxlcy5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBhIENTUyBjb2xvclxuICAgKi9cbiAgZ2V0RGVmYXVsdENvbG9yICgpIHtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMucmV0cmlldmVTdHlsZUZyb21Eb20oWycuZWRpdG9yJ10sICdjb2xvcicsIGZhbHNlLCB0cnVlKVxuICAgIHJldHVybiB0aGlzLnRyYW5zcGFyZW50aXplKGNvbG9yLCB0aGlzLmdldFRleHRPcGFjaXR5KCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGV4dCBjb2xvciBmb3IgdGhlIHBhc3NlZC1pbiBgdG9rZW5gIG9iamVjdC5cbiAgICpcbiAgICogVGhlIGNvbG9yIHZhbHVlIGlzIHJlYWQgZnJvbSB0aGUgRE9NIGJ5IGNyZWF0aW5nIGEgbm9kZSBzdHJ1Y3R1cmUgdGhhdFxuICAgKiBtYXRjaCB0aGUgdG9rZW4gYHNjb3BlYCBwcm9wZXJ0eS5cbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSB0b2tlbiBhIGBUZXh0RWRpdG9yYCB0b2tlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBDU1MgY29sb3IgZm9yIHRoZSBwcm92aWRlZCB0b2tlblxuICAgKi9cbiAgZ2V0VG9rZW5Db2xvciAodG9rZW4pIHtcbiAgICBjb25zdCBzY29wZXMgPSB0b2tlbi5zY29wZURlc2NyaXB0b3IgfHwgdG9rZW4uc2NvcGVzXG4gICAgY29uc3QgY29sb3IgPSB0aGlzLnJldHJpZXZlU3R5bGVGcm9tRG9tKHNjb3BlcywgJ2NvbG9yJylcblxuICAgIHJldHVybiB0aGlzLnRyYW5zcGFyZW50aXplKGNvbG9yLCB0aGlzLmdldFRleHRPcGFjaXR5KCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYmFja2dyb3VuZCBjb2xvciBmb3IgdGhlIHBhc3NlZC1pbiBgZGVjb3JhdGlvbmAgb2JqZWN0LlxuICAgKlxuICAgKiBUaGUgY29sb3IgdmFsdWUgaXMgcmVhZCBmcm9tIHRoZSBET00gYnkgY3JlYXRpbmcgYSBub2RlIHN0cnVjdHVyZSB0aGF0XG4gICAqIG1hdGNoIHRoZSBkZWNvcmF0aW9uIGBzY29wZWAgcHJvcGVydHkgdW5sZXNzIHRoZSBkZWNvcmF0aW9uIHByb3ZpZGVzXG4gICAqIGl0cyBvd24gYGNvbG9yYCBwcm9wZXJ0eS5cbiAgICpcbiAgICogQHBhcmFtICB7RGVjb3JhdGlvbn0gZGVjb3JhdGlvbiB0aGUgZGVjb3JhdGlvbiB0byBnZXQgdGhlIGNvbG9yIGZvclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBDU1MgY29sb3IgZm9yIHRoZSBwcm92aWRlZCBkZWNvcmF0aW9uXG4gICAqL1xuICBnZXREZWNvcmF0aW9uQ29sb3IgKGRlY29yYXRpb24pIHtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gZGVjb3JhdGlvbi5nZXRQcm9wZXJ0aWVzKClcbiAgICBpZiAocHJvcGVydGllcy5jb2xvcikgeyByZXR1cm4gcHJvcGVydGllcy5jb2xvciB9XG5cbiAgICBjb25zdCBzY29wZVN0cmluZyA9IHByb3BlcnRpZXMuc2NvcGUuc3BsaXQoL1xccysvKVxuICAgIHJldHVybiB0aGlzLnJldHJpZXZlU3R5bGVGcm9tRG9tKHNjb3BlU3RyaW5nLCAnYmFja2dyb3VuZC1jb2xvcicsIGZhbHNlKVxuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgYHJnYiguLi4pYCBjb2xvciBpbnRvIGEgYHJnYmEoLi4uKWAgY29sb3Igd2l0aCB0aGUgc3BlY2lmaWVkXG4gICAqIG9wYWNpdHkuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gY29sb3IgdGhlIENTUyBSR0IgY29sb3IgdG8gdHJhbnNwYXJlbnRpemVcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbb3BhY2l0eT0xXSB0aGUgb3BhY2l0eSBhbW91bnRcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgdHJhbnNwYXJlbnRpemVkIENTUyBjb2xvclxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHRyYW5zcGFyZW50aXplIChjb2xvciwgb3BhY2l0eSA9IDEpIHtcbiAgICByZXR1cm4gY29sb3IucmVwbGFjZSgncmdiKCcsICdyZ2JhKCcpLnJlcGxhY2UoJyknLCBgLCAke29wYWNpdHl9KWApXG4gIH1cblxuICAvLyAgICAjIyMjIyMjIyAgIyMjIyMjIyMgICAgICMjIyAgICAjIyAgICAgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICAgIyMgICAjIyAjIyAgICMjICAjIyAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAjIyAgIyMgICAjIyAgIyMgICMjICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMjIyMjIyMgICMjICAgICAjIyAjIyAgIyMgICMjXG4gIC8vICAgICMjICAgICAjIyAjIyAgICMjICAgIyMjIyMjIyMjICMjICAjIyAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICMjICAjIyAgICAgIyMgIyMgICMjICAjI1xuICAvLyAgICAjIyMjIyMjIyAgIyMgICAgICMjICMjICAgICAjIyAgIyMjICAjIyNcblxuICAvKipcbiAgICogRHJhd3MgYmFjayBkZWNvcmF0aW9ucyBvbiB0aGUgY29ycmVzcG9uZGluZyBsYXllci5cbiAgICpcbiAgICogVGhlIGxpbmVzIHJhbmdlIHRvIGRyYXcgaXMgc3BlY2lmaWVkIGJ5IHRoZSBgZmlyc3RSb3dgIGFuZCBgbGFzdFJvd2BcbiAgICogcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSBmaXJzdFJvdyB0aGUgZmlyc3Qgcm93IHRvIHJlbmRlclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGxhc3RSb3cgdGhlIGxhc3Qgcm93IHRvIHJlbmRlclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IG9mZnNldFJvdyB0aGUgcmVsYXRpdmUgb2Zmc2V0IHRvIGFwcGx5IHRvIHJvd3Mgd2hlblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJpbmcgdGhlbVxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGRyYXdCYWNrRGVjb3JhdGlvbnNGb3JMaW5lcyAoZmlyc3RSb3csIGxhc3RSb3csIG9mZnNldFJvdykge1xuICAgIGlmIChmaXJzdFJvdyA+IGxhc3RSb3cpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IGRldmljZVBpeGVsUmF0aW8gPSB0aGlzLm1pbmltYXAuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpXG4gICAgY29uc3QgbGluZUhlaWdodCA9IHRoaXMubWluaW1hcC5nZXRMaW5lSGVpZ2h0KCkgKiBkZXZpY2VQaXhlbFJhdGlvXG4gICAgY29uc3QgY2hhckhlaWdodCA9IHRoaXMubWluaW1hcC5nZXRDaGFySGVpZ2h0KCkgKiBkZXZpY2VQaXhlbFJhdGlvXG4gICAgY29uc3QgY2hhcldpZHRoID0gdGhpcy5taW5pbWFwLmdldENoYXJXaWR0aCgpICogZGV2aWNlUGl4ZWxSYXRpb1xuICAgIGNvbnN0IGRlY29yYXRpb25zID0gdGhpcy5taW5pbWFwLmRlY29yYXRpb25zQnlUeXBlVGhlblJvd3MoZmlyc3RSb3csIGxhc3RSb3cpXG4gICAgY29uc3Qge3dpZHRoOiBjYW52YXNXaWR0aCwgaGVpZ2h0OiBjYW52YXNIZWlnaHR9ID0gdGhpcy50b2tlbnNMYXllci5nZXRTaXplKClcbiAgICBjb25zdCByZW5kZXJEYXRhID0ge1xuICAgICAgY29udGV4dDogdGhpcy5iYWNrTGF5ZXIuY29udGV4dCxcbiAgICAgIGNhbnZhc1dpZHRoOiBjYW52YXNXaWR0aCxcbiAgICAgIGNhbnZhc0hlaWdodDogY2FudmFzSGVpZ2h0LFxuICAgICAgbGluZUhlaWdodDogbGluZUhlaWdodCxcbiAgICAgIGNoYXJXaWR0aDogY2hhcldpZHRoLFxuICAgICAgY2hhckhlaWdodDogY2hhckhlaWdodCxcbiAgICAgIG9yZGVyczogTWFpbi5nZXRQbHVnaW5zT3JkZXIoKVxuICAgIH1cblxuICAgIGZvciAobGV0IHNjcmVlblJvdyA9IGZpcnN0Um93OyBzY3JlZW5Sb3cgPD0gbGFzdFJvdzsgc2NyZWVuUm93KyspIHtcbiAgICAgIHJlbmRlckRhdGEucm93ID0gb2Zmc2V0Um93ICsgKHNjcmVlblJvdyAtIGZpcnN0Um93KVxuICAgICAgcmVuZGVyRGF0YS55Um93ID0gcmVuZGVyRGF0YS5yb3cgKiBsaW5lSGVpZ2h0XG4gICAgICByZW5kZXJEYXRhLnNjcmVlblJvdyA9IHNjcmVlblJvd1xuXG4gICAgICB0aGlzLmRyYXdEZWNvcmF0aW9ucyhzY3JlZW5Sb3csIGRlY29yYXRpb25zLCByZW5kZXJEYXRhLCB7XG4gICAgICAgICdsaW5lJzogdGhpcy5kcmF3TGluZURlY29yYXRpb24sXG4gICAgICAgICdoaWdobGlnaHQtdW5kZXInOiB0aGlzLmRyYXdIaWdobGlnaHREZWNvcmF0aW9uXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuYmFja0xheWVyLmNvbnRleHQuZmlsbCgpXG4gIH1cblxuICAvKipcbiAgICogRHJhd3MgZnJvbnQgZGVjb3JhdGlvbnMgb24gdGhlIGNvcnJlc3BvbmRpbmcgbGF5ZXIuXG4gICAqXG4gICAqIFRoZSBsaW5lcyByYW5nZSB0byBkcmF3IGlzIHNwZWNpZmllZCBieSB0aGUgYGZpcnN0Um93YCBhbmQgYGxhc3RSb3dgXG4gICAqIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gZmlyc3RSb3cgdGhlIGZpcnN0IHJvdyB0byByZW5kZXJcbiAgICogQHBhcmFtICB7bnVtYmVyfSBsYXN0Um93IHRoZSBsYXN0IHJvdyB0byByZW5kZXJcbiAgICogQHBhcmFtICB7bnVtYmVyfSBvZmZzZXRSb3cgdGhlIHJlbGF0aXZlIG9mZnNldCB0byBhcHBseSB0byByb3dzIHdoZW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyaW5nIHRoZW1cbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkcmF3RnJvbnREZWNvcmF0aW9uc0ZvckxpbmVzIChmaXJzdFJvdywgbGFzdFJvdywgb2Zmc2V0Um93KSB7XG4gICAgaWYgKGZpcnN0Um93ID4gbGFzdFJvdykgeyByZXR1cm4gfVxuXG4gICAgY29uc3QgZGV2aWNlUGl4ZWxSYXRpbyA9IHRoaXMubWluaW1hcC5nZXREZXZpY2VQaXhlbFJhdGlvKClcbiAgICBjb25zdCBsaW5lSGVpZ2h0ID0gdGhpcy5taW5pbWFwLmdldExpbmVIZWlnaHQoKSAqIGRldmljZVBpeGVsUmF0aW9cbiAgICBjb25zdCBjaGFySGVpZ2h0ID0gdGhpcy5taW5pbWFwLmdldENoYXJIZWlnaHQoKSAqIGRldmljZVBpeGVsUmF0aW9cbiAgICBjb25zdCBjaGFyV2lkdGggPSB0aGlzLm1pbmltYXAuZ2V0Q2hhcldpZHRoKCkgKiBkZXZpY2VQaXhlbFJhdGlvXG4gICAgY29uc3QgZGVjb3JhdGlvbnMgPSB0aGlzLm1pbmltYXAuZGVjb3JhdGlvbnNCeVR5cGVUaGVuUm93cyhmaXJzdFJvdywgbGFzdFJvdylcbiAgICBjb25zdCB7d2lkdGg6IGNhbnZhc1dpZHRoLCBoZWlnaHQ6IGNhbnZhc0hlaWdodH0gPSB0aGlzLnRva2Vuc0xheWVyLmdldFNpemUoKVxuICAgIGNvbnN0IHJlbmRlckRhdGEgPSB7XG4gICAgICBjb250ZXh0OiB0aGlzLmZyb250TGF5ZXIuY29udGV4dCxcbiAgICAgIGNhbnZhc1dpZHRoOiBjYW52YXNXaWR0aCxcbiAgICAgIGNhbnZhc0hlaWdodDogY2FudmFzSGVpZ2h0LFxuICAgICAgbGluZUhlaWdodDogbGluZUhlaWdodCxcbiAgICAgIGNoYXJXaWR0aDogY2hhcldpZHRoLFxuICAgICAgY2hhckhlaWdodDogY2hhckhlaWdodCxcbiAgICAgIG9yZGVyczogTWFpbi5nZXRQbHVnaW5zT3JkZXIoKVxuICAgIH1cblxuICAgIGZvciAobGV0IHNjcmVlblJvdyA9IGZpcnN0Um93OyBzY3JlZW5Sb3cgPD0gbGFzdFJvdzsgc2NyZWVuUm93KyspIHtcbiAgICAgIHJlbmRlckRhdGEucm93ID0gb2Zmc2V0Um93ICsgKHNjcmVlblJvdyAtIGZpcnN0Um93KVxuICAgICAgcmVuZGVyRGF0YS55Um93ID0gcmVuZGVyRGF0YS5yb3cgKiBsaW5lSGVpZ2h0XG4gICAgICByZW5kZXJEYXRhLnNjcmVlblJvdyA9IHNjcmVlblJvd1xuXG4gICAgICB0aGlzLmRyYXdEZWNvcmF0aW9ucyhzY3JlZW5Sb3csIGRlY29yYXRpb25zLCByZW5kZXJEYXRhLCB7XG4gICAgICAgICdoaWdobGlnaHQtb3Zlcic6IHRoaXMuZHJhd0hpZ2hsaWdodERlY29yYXRpb24sXG4gICAgICAgICdoaWdobGlnaHQtb3V0bGluZSc6IHRoaXMuZHJhd0hpZ2hsaWdodE91dGxpbmVEZWNvcmF0aW9uXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJlbmRlckRhdGEuY29udGV4dC5maWxsKClcbiAgfVxuICAvKipcbiAgICogRHJhd3MgbGluZXMgb24gdGhlIGNvcnJlc3BvbmRpbmcgbGF5ZXIuXG4gICAqXG4gICAqIFRoZSBsaW5lcyByYW5nZSB0byBkcmF3IGlzIHNwZWNpZmllZCBieSB0aGUgYGZpcnN0Um93YCBhbmQgYGxhc3RSb3dgXG4gICAqIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gZmlyc3RSb3cgdGhlIGZpcnN0IHJvdyB0byByZW5kZXJcbiAgICogQHBhcmFtICB7bnVtYmVyfSBsYXN0Um93IHRoZSBsYXN0IHJvdyB0byByZW5kZXJcbiAgICogQHBhcmFtICB7bnVtYmVyfSBvZmZzZXRSb3cgdGhlIHJlbGF0aXZlIG9mZnNldCB0byBhcHBseSB0byByb3dzIHdoZW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyaW5nIHRoZW1cbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkcmF3TGluZXMgKGZpcnN0Um93LCBsYXN0Um93LCBvZmZzZXRSb3cpIHtcbiAgICBpZiAoZmlyc3RSb3cgPiBsYXN0Um93KSB7IHJldHVybiB9XG5cbiAgICBjb25zdCBkZXZpY2VQaXhlbFJhdGlvID0gdGhpcy5taW5pbWFwLmdldERldmljZVBpeGVsUmF0aW8oKVxuICAgIGNvbnN0IGxpbmVzID0gdGhpcy5nZXRUZXh0RWRpdG9yKCkudG9rZW5pemVkTGluZXNGb3JTY3JlZW5Sb3dzKGZpcnN0Um93LCBsYXN0Um93KVxuICAgIGNvbnN0IGxpbmVIZWlnaHQgPSB0aGlzLm1pbmltYXAuZ2V0TGluZUhlaWdodCgpICogZGV2aWNlUGl4ZWxSYXRpb1xuICAgIGNvbnN0IGNoYXJIZWlnaHQgPSB0aGlzLm1pbmltYXAuZ2V0Q2hhckhlaWdodCgpICogZGV2aWNlUGl4ZWxSYXRpb1xuICAgIGNvbnN0IGNoYXJXaWR0aCA9IHRoaXMubWluaW1hcC5nZXRDaGFyV2lkdGgoKSAqIGRldmljZVBpeGVsUmF0aW9cbiAgICBjb25zdCBkaXNwbGF5Q29kZUhpZ2hsaWdodHMgPSB0aGlzLmRpc3BsYXlDb2RlSGlnaGxpZ2h0c1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLnRva2Vuc0xheWVyLmNvbnRleHRcbiAgICBjb25zdCB7d2lkdGg6IGNhbnZhc1dpZHRofSA9IHRoaXMudG9rZW5zTGF5ZXIuZ2V0U2l6ZSgpXG5cbiAgICBsZXQgbGluZSA9IGxpbmVzWzBdXG4gICAgY29uc3QgaW52aXNpYmxlUmVnRXhwID0gdGhpcy5nZXRJbnZpc2libGVSZWdFeHAobGluZSlcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGluZSA9IGxpbmVzW2ldXG4gICAgICBjb25zdCB5Um93ID0gKG9mZnNldFJvdyArIGkpICogbGluZUhlaWdodFxuICAgICAgbGV0IHggPSAwXG5cbiAgICAgIGlmICgobGluZSAhPSBudWxsID8gbGluZS50b2tlbnMgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgY29uc3QgdG9rZW5zID0gbGluZS50b2tlbnNcbiAgICAgICAgZm9yIChsZXQgaiA9IDAsIHRva2Vuc0NvdW50ID0gdG9rZW5zLmxlbmd0aDsgaiA8IHRva2Vuc0NvdW50OyBqKyspIHtcbiAgICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1tqXVxuICAgICAgICAgIGNvbnN0IHcgPSB0b2tlbi5zY3JlZW5EZWx0YVxuICAgICAgICAgIGlmICghdG9rZW4uaXNPbmx5V2hpdGVzcGFjZSgpKSB7XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IGRpc3BsYXlDb2RlSGlnaGxpZ2h0cyA/IHRoaXMuZ2V0VG9rZW5Db2xvcih0b2tlbikgOiB0aGlzLmdldERlZmF1bHRDb2xvcigpXG5cbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRva2VuLnZhbHVlXG4gICAgICAgICAgICBpZiAoaW52aXNpYmxlUmVnRXhwICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKGludmlzaWJsZVJlZ0V4cCwgJyAnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeCA9IHRoaXMuZHJhd1Rva2VuKGNvbnRleHQsIHZhbHVlLCBjb2xvciwgeCwgeVJvdywgY2hhcldpZHRoLCBjaGFySGVpZ2h0KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4ICs9IHcgKiBjaGFyV2lkdGhcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoeCA+IGNhbnZhc1dpZHRoKSB7IGJyZWFrIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnRleHQuZmlsbCgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcmVnZXhwIHRvIHJlcGxhY2UgaW52aXNpYmxlcyBzdWJzdGl0dXRpb24gY2hhcmFjdGVyc1xuICAgKiBpbiBlZGl0b3IgbGluZXMuXG4gICAqXG4gICAqIEBwYXJhbSAge1Rva2VuaXplZExpbmV9IGxpbmUgYSB0b2tlbml6ZWQgbGl6ZSB0byByZWFkIHRoZSBpbnZpc2libGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJzXG4gICAqIEByZXR1cm4ge1JlZ0V4cH0gdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBpbnZpc2libGUgY2hhcmFjdGVyc1xuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGdldEludmlzaWJsZVJlZ0V4cCAobGluZSkge1xuICAgIGlmICgobGluZSAhPSBudWxsKSAmJiAobGluZS5pbnZpc2libGVzICE9IG51bGwpKSB7XG4gICAgICBjb25zdCBpbnZpc2libGVzID0gW11cbiAgICAgIGlmIChsaW5lLmludmlzaWJsZXMuY3IgIT0gbnVsbCkgeyBpbnZpc2libGVzLnB1c2gobGluZS5pbnZpc2libGVzLmNyKSB9XG4gICAgICBpZiAobGluZS5pbnZpc2libGVzLmVvbCAhPSBudWxsKSB7IGludmlzaWJsZXMucHVzaChsaW5lLmludmlzaWJsZXMuZW9sKSB9XG4gICAgICBpZiAobGluZS5pbnZpc2libGVzLnNwYWNlICE9IG51bGwpIHsgaW52aXNpYmxlcy5wdXNoKGxpbmUuaW52aXNpYmxlcy5zcGFjZSkgfVxuICAgICAgaWYgKGxpbmUuaW52aXNpYmxlcy50YWIgIT0gbnVsbCkgeyBpbnZpc2libGVzLnB1c2gobGluZS5pbnZpc2libGVzLnRhYikgfVxuXG4gICAgICByZXR1cm4gUmVnRXhwKGludmlzaWJsZXMuZmlsdGVyKChzKSA9PiB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZydcbiAgICAgIH0pLm1hcChfLmVzY2FwZVJlZ0V4cCkuam9pbignfCcpLCAnZycpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERyYXdzIGEgc2luZ2xlIHRva2VuIG9uIHRoZSBnaXZlbiBjb250ZXh0LlxuICAgKlxuICAgKiBAcGFyYW0gIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGNvbnRleHQgdGhlIHRhcmdldCBjYW52YXMgY29udGV4dFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRleHQgdGhlIHRva2VuJ3MgdGV4dCBjb250ZW50XG4gICAqIEBwYXJhbSAge3N0cmluZ30gY29sb3IgdGhlIHRva2VuJ3MgQ1NTIGNvbG9yXG4gICAqIEBwYXJhbSAge251bWJlcn0geCB0aGUgeCBwb3NpdGlvbiBvZiB0aGUgdG9rZW4gaW4gdGhlIGxpbmVcbiAgICogQHBhcmFtICB7bnVtYmVyfSB5IHRoZSB5IHBvc2l0aW9uIG9mIHRoZSBsaW5lIGluIHRoZSBtaW5pbWFwXG4gICAqIEBwYXJhbSAge251bWJlcn0gY2hhcldpZHRoIHRoZSB3aWR0aCBvZiBhIGNoYXJhY3RlciBpbiB0aGUgbWluaW1hcFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGNoYXJIZWlnaHQgdGhlIGhlaWdodCBvZiBhIGNoYXJhY3RlciBpbiB0aGUgbWluaW1hcFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB4IHBvc2l0aW9uIGF0IHRoZSBlbmQgb2YgdGhlIHRva2VuXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZHJhd1Rva2VuIChjb250ZXh0LCB0ZXh0LCBjb2xvciwgeCwgeSwgY2hhcldpZHRoLCBjaGFySGVpZ2h0KSB7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvclxuXG4gICAgbGV0IGNoYXJzID0gMFxuICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSB0ZXh0Lmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBjb25zdCBjaGFyID0gdGV4dFtqXVxuICAgICAgaWYgKC9cXHMvLnRlc3QoY2hhcikpIHtcbiAgICAgICAgaWYgKGNoYXJzID4gMCkge1xuICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoeCAtIChjaGFycyAqIGNoYXJXaWR0aCksIHksIGNoYXJzICogY2hhcldpZHRoLCBjaGFySGVpZ2h0KVxuICAgICAgICB9XG4gICAgICAgIGNoYXJzID0gMFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hhcnMrK1xuICAgICAgfVxuICAgICAgeCArPSBjaGFyV2lkdGhcbiAgICB9XG4gICAgaWYgKGNoYXJzID4gMCkge1xuICAgICAgY29udGV4dC5maWxsUmVjdCh4IC0gKGNoYXJzICogY2hhcldpZHRoKSwgeSwgY2hhcnMgKiBjaGFyV2lkdGgsIGNoYXJIZWlnaHQpXG4gICAgfVxuICAgIHJldHVybiB4XG4gIH1cblxuICAvKipcbiAgICogRHJhd3MgdGhlIHNwZWNpZmllZCBkZWNvcmF0aW9ucyBmb3IgdGhlIGN1cnJlbnQgYHNjcmVlblJvd2AuXG4gICAqXG4gICAqIFRoZSBgZGVjb3JhdGlvbnNgIG9iamVjdCBjb250YWlucyBhbGwgdGhlIGRlY29yYXRpb25zIGdyb3VwZWQgYnkgdHlwZSBhbmRcbiAgICogdGhlbiByb3dzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHNjcmVlblJvdyB0aGUgc2NyZWVuIHJvdyBpbmRleCBmb3Igd2hpY2hcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyIGRlY29yYXRpb25zXG4gICAqIEBwYXJhbSAge09iamVjdH0gZGVjb3JhdGlvbnMgdGhlIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgZGVjb3JhdGlvbnNcbiAgICogQHBhcmFtICB7T2JqZWN0fSByZW5kZXJEYXRhIHRoZSBvYmplY3QgY29udGFpbmluZyB0aGUgcmVuZGVyIGRhdGFcbiAgICogQHBhcmFtICB7T2JqZWN0fSB0eXBlcyBhbiBvYmplY3Qgd2l0aCB0aGUgdHlwZSB0byByZW5kZXIgYXMga2V5IGFuZCB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICByZW5kZXIgbWV0aG9kIGFzIHZhbHVlXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZHJhd0RlY29yYXRpb25zIChzY3JlZW5Sb3csIGRlY29yYXRpb25zLCByZW5kZXJEYXRhLCB0eXBlcykge1xuICAgIGxldCBkZWNvcmF0aW9uc1RvUmVuZGVyID0gW11cblxuICAgIGZvciAobGV0IGkgaW4gdHlwZXMpIHtcbiAgICAgIGRlY29yYXRpb25zVG9SZW5kZXIgPSBkZWNvcmF0aW9uc1RvUmVuZGVyLmNvbmNhdChcbiAgICAgICAgZGVjb3JhdGlvbnNbaV0gIT0gbnVsbCA/IGRlY29yYXRpb25zW2ldW3NjcmVlblJvd10gfHwgW10gOiBbXVxuICAgICAgKVxuICAgIH1cblxuICAgIGRlY29yYXRpb25zVG9SZW5kZXIuc29ydCgoYSwgYikgPT5cbiAgICAgIChyZW5kZXJEYXRhLm9yZGVyc1thLnByb3BlcnRpZXMucGx1Z2luXSB8fCAwKSAtIChyZW5kZXJEYXRhLm9yZGVyc1tiLnByb3BlcnRpZXMucGx1Z2luXSB8fCAwKVxuICAgIClcblxuICAgIGlmIChkZWNvcmF0aW9uc1RvUmVuZGVyICE9IG51bGwgPyBkZWNvcmF0aW9uc1RvUmVuZGVyLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGRlY29yYXRpb25zVG9SZW5kZXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdHlwZXNbZGVjb3JhdGlvbnNUb1JlbmRlcltpXS5wcm9wZXJ0aWVzLnR5cGVdLmNhbGwodGhpcywgZGVjb3JhdGlvbnNUb1JlbmRlcltpXSwgcmVuZGVyRGF0YSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRHJhd3MgYSBsaW5lIGRlY29yYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSAge0RlY29yYXRpb259IGRlY29yYXRpb24gdGhlIGRlY29yYXRpb24gdG8gcmVuZGVyXG4gICAqIEBwYXJhbSAge09iamVjdH0gZGF0YSB0aGUgZGF0YSBuZWVkIHRvIHBlcmZvcm0gdGhlIHJlbmRlclxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGRyYXdMaW5lRGVjb3JhdGlvbiAoZGVjb3JhdGlvbiwgZGF0YSkge1xuICAgIGRhdGEuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmdldERlY29yYXRpb25Db2xvcihkZWNvcmF0aW9uKVxuICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCBkYXRhLnlSb3csIGRhdGEuY2FudmFzV2lkdGgsIGRhdGEubGluZUhlaWdodClcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyBhIGhpZ2hsaWdodCBkZWNvcmF0aW9uLlxuICAgKlxuICAgKiBJdCByZW5kZXJzIG9ubHkgdGhlIHBhcnQgb2YgdGhlIGhpZ2hsaWdodCBjb3JyZXNwb25kaW5nIHRvIHRoZSBzcGVjaWZpZWRcbiAgICogcm93LlxuICAgKlxuICAgKiBAcGFyYW0gIHtEZWNvcmF0aW9ufSBkZWNvcmF0aW9uIHRoZSBkZWNvcmF0aW9uIHRvIHJlbmRlclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgdGhlIGRhdGEgbmVlZCB0byBwZXJmb3JtIHRoZSByZW5kZXJcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkcmF3SGlnaGxpZ2h0RGVjb3JhdGlvbiAoZGVjb3JhdGlvbiwgZGF0YSkge1xuICAgIGNvbnN0IHJhbmdlID0gZGVjb3JhdGlvbi5nZXRNYXJrZXIoKS5nZXRTY3JlZW5SYW5nZSgpXG4gICAgY29uc3Qgcm93U3BhbiA9IHJhbmdlLmVuZC5yb3cgLSByYW5nZS5zdGFydC5yb3dcblxuICAgIGRhdGEuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmdldERlY29yYXRpb25Db2xvcihkZWNvcmF0aW9uKVxuXG4gICAgaWYgKHJvd1NwYW4gPT09IDApIHtcbiAgICAgIGNvbnN0IGNvbFNwYW4gPSByYW5nZS5lbmQuY29sdW1uIC0gcmFuZ2Uuc3RhcnQuY29sdW1uXG4gICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QocmFuZ2Uuc3RhcnQuY29sdW1uICogZGF0YS5jaGFyV2lkdGgsIGRhdGEueVJvdywgY29sU3BhbiAqIGRhdGEuY2hhcldpZHRoLCBkYXRhLmxpbmVIZWlnaHQpXG4gICAgfSBlbHNlIGlmIChkYXRhLnNjcmVlblJvdyA9PT0gcmFuZ2Uuc3RhcnQucm93KSB7XG4gICAgICBjb25zdCB4ID0gcmFuZ2Uuc3RhcnQuY29sdW1uICogZGF0YS5jaGFyV2lkdGhcbiAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCh4LCBkYXRhLnlSb3csIGRhdGEuY2FudmFzV2lkdGggLSB4LCBkYXRhLmxpbmVIZWlnaHQpXG4gICAgfSBlbHNlIGlmIChkYXRhLnNjcmVlblJvdyA9PT0gcmFuZ2UuZW5kLnJvdykge1xuICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KDAsIGRhdGEueVJvdywgcmFuZ2UuZW5kLmNvbHVtbiAqIGRhdGEuY2hhcldpZHRoLCBkYXRhLmxpbmVIZWlnaHQpXG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCBkYXRhLnlSb3csIGRhdGEuY2FudmFzV2lkdGgsIGRhdGEubGluZUhlaWdodClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRHJhd3MgYSBoaWdobGlnaHQgb3V0bGluZSBkZWNvcmF0aW9uLlxuICAgKlxuICAgKiBJdCByZW5kZXJzIG9ubHkgdGhlIHBhcnQgb2YgdGhlIGhpZ2hsaWdodCBjb3JyZXNwb25kaW5nIHRvIHRoZSBzcGVjaWZpZWRcbiAgICogcm93LlxuICAgKlxuICAgKiBAcGFyYW0gIHtEZWNvcmF0aW9ufSBkZWNvcmF0aW9uIHRoZSBkZWNvcmF0aW9uIHRvIHJlbmRlclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgdGhlIGRhdGEgbmVlZCB0byBwZXJmb3JtIHRoZSByZW5kZXJcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBkcmF3SGlnaGxpZ2h0T3V0bGluZURlY29yYXRpb24gKGRlY29yYXRpb24sIGRhdGEpIHtcbiAgICBsZXQgYm90dG9tV2lkdGgsIGNvbFNwYW4sIHdpZHRoLCB4Qm90dG9tU3RhcnQsIHhFbmQsIHhTdGFydFxuICAgIGNvbnN0IHtsaW5lSGVpZ2h0LCBjaGFyV2lkdGgsIGNhbnZhc1dpZHRoLCBzY3JlZW5Sb3d9ID0gZGF0YVxuICAgIGNvbnN0IHJhbmdlID0gZGVjb3JhdGlvbi5nZXRNYXJrZXIoKS5nZXRTY3JlZW5SYW5nZSgpXG4gICAgY29uc3Qgcm93U3BhbiA9IHJhbmdlLmVuZC5yb3cgLSByYW5nZS5zdGFydC5yb3dcbiAgICBjb25zdCB5U3RhcnQgPSBkYXRhLnlSb3dcbiAgICBjb25zdCB5RW5kID0geVN0YXJ0ICsgbGluZUhlaWdodFxuXG4gICAgZGF0YS5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZ2V0RGVjb3JhdGlvbkNvbG9yKGRlY29yYXRpb24pXG5cbiAgICBpZiAocm93U3BhbiA9PT0gMCkge1xuICAgICAgY29sU3BhbiA9IHJhbmdlLmVuZC5jb2x1bW4gLSByYW5nZS5zdGFydC5jb2x1bW5cbiAgICAgIHdpZHRoID0gY29sU3BhbiAqIGNoYXJXaWR0aFxuICAgICAgeFN0YXJ0ID0gcmFuZ2Uuc3RhcnQuY29sdW1uICogY2hhcldpZHRoXG4gICAgICB4RW5kID0geFN0YXJ0ICsgd2lkdGhcblxuICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhTdGFydCwgeVN0YXJ0LCB3aWR0aCwgMSlcbiAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCh4U3RhcnQsIHlFbmQsIHdpZHRoLCAxKVxuICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhTdGFydCwgeVN0YXJ0LCAxLCBsaW5lSGVpZ2h0KVxuICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhFbmQsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICB9IGVsc2UgaWYgKHJvd1NwYW4gPT09IDEpIHtcbiAgICAgIHhTdGFydCA9IHJhbmdlLnN0YXJ0LmNvbHVtbiAqIGRhdGEuY2hhcldpZHRoXG4gICAgICB4RW5kID0gcmFuZ2UuZW5kLmNvbHVtbiAqIGRhdGEuY2hhcldpZHRoXG5cbiAgICAgIGlmIChzY3JlZW5Sb3cgPT09IHJhbmdlLnN0YXJ0LnJvdykge1xuICAgICAgICB3aWR0aCA9IGRhdGEuY2FudmFzV2lkdGggLSB4U3RhcnRcbiAgICAgICAgeEJvdHRvbVN0YXJ0ID0gTWF0aC5tYXgoeFN0YXJ0LCB4RW5kKVxuICAgICAgICBib3R0b21XaWR0aCA9IGRhdGEuY2FudmFzV2lkdGggLSB4Qm90dG9tU3RhcnRcblxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeFN0YXJ0LCB5U3RhcnQsIHdpZHRoLCAxKVxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeEJvdHRvbVN0YXJ0LCB5RW5kLCBib3R0b21XaWR0aCwgMSlcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhTdGFydCwgeVN0YXJ0LCAxLCBsaW5lSGVpZ2h0KVxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoY2FudmFzV2lkdGggLSAxLCB5U3RhcnQsIDEsIGxpbmVIZWlnaHQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aWR0aCA9IGNhbnZhc1dpZHRoIC0geFN0YXJ0XG4gICAgICAgIGJvdHRvbVdpZHRoID0gY2FudmFzV2lkdGggLSB4RW5kXG5cbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KDAsIHlTdGFydCwgeFN0YXJ0LCAxKVxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoMCwgeUVuZCwgeEVuZCwgMSlcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KDAsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhFbmQsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgeFN0YXJ0ID0gcmFuZ2Uuc3RhcnQuY29sdW1uICogY2hhcldpZHRoXG4gICAgICB4RW5kID0gcmFuZ2UuZW5kLmNvbHVtbiAqIGNoYXJXaWR0aFxuICAgICAgaWYgKHNjcmVlblJvdyA9PT0gcmFuZ2Uuc3RhcnQucm93KSB7XG4gICAgICAgIHdpZHRoID0gY2FudmFzV2lkdGggLSB4U3RhcnRcblxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeFN0YXJ0LCB5U3RhcnQsIHdpZHRoLCAxKVxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoeFN0YXJ0LCB5U3RhcnQsIDEsIGxpbmVIZWlnaHQpXG4gICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdChjYW52YXNXaWR0aCAtIDEsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgIH0gZWxzZSBpZiAoc2NyZWVuUm93ID09PSByYW5nZS5lbmQucm93KSB7XG4gICAgICAgIHdpZHRoID0gY2FudmFzV2lkdGggLSB4U3RhcnRcblxuICAgICAgICBkYXRhLmNvbnRleHQuZmlsbFJlY3QoMCwgeUVuZCwgeEVuZCwgMSlcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KDAsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgICAgZGF0YS5jb250ZXh0LmZpbGxSZWN0KHhFbmQsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCB5U3RhcnQsIDEsIGxpbmVIZWlnaHQpXG4gICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdChjYW52YXNXaWR0aCAtIDEsIHlTdGFydCwgMSwgbGluZUhlaWdodClcbiAgICAgICAgaWYgKHNjcmVlblJvdyA9PT0gcmFuZ2Uuc3RhcnQucm93ICsgMSkge1xuICAgICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCgwLCB5U3RhcnQsIHhTdGFydCwgMSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2NyZWVuUm93ID09PSByYW5nZS5lbmQucm93IC0gMSkge1xuICAgICAgICAgIGRhdGEuY29udGV4dC5maWxsUmVjdCh4RW5kLCB5RW5kLCBjYW52YXNXaWR0aCAtIHhFbmQsIDEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyAgICAjIyMjIyMjIyAgICAgIyMjICAgICMjICAgICMjICAjIyMjIyMgICAjIyMjIyMjIyAgIyMjIyMjXG4gIC8vICAgICMjICAgICAjIyAgICMjICMjICAgIyMjICAgIyMgIyMgICAgIyMgICMjICAgICAgICMjICAgICMjXG4gIC8vICAgICMjICAgICAjIyAgIyMgICAjIyAgIyMjIyAgIyMgIyMgICAgICAgICMjICAgICAgICMjXG4gIC8vICAgICMjIyMjIyMjICAjIyAgICAgIyMgIyMgIyMgIyMgIyMgICAjIyMjICMjIyMjIyAgICAjIyMjIyNcbiAgLy8gICAgIyMgICAjIyAgICMjIyMjIyMjIyAjIyAgIyMjIyAjIyAgICAjIyAgIyMgICAgICAgICAgICAgIyNcbiAgLy8gICAgIyMgICAgIyMgICMjICAgICAjIyAjIyAgICMjIyAjIyAgICAjIyAgIyMgICAgICAgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAjIyAgIyMjIyMjICAgIyMjIyMjIyMgICMjIyMjI1xuXG4gIC8qKlxuICAgKiBDb21wdXRlcyB0aGUgcmFuZ2VzIHRoYXQgYXJlIG5vdCBhZmZlY3RlZCBieSB0aGUgY3VycmVudCBwZW5kaW5nIGNoYW5nZXMuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gZmlyc3RSb3cgdGhlIGZpcnN0IHJvdyBvZiB0aGUgcmVuZGVyZWQgcmVnaW9uXG4gICAqIEBwYXJhbSAge251bWJlcn0gbGFzdFJvdyB0aGUgbGFzdCByb3cgb2YgdGhlIHJlbmRlcmVkIHJlZ2lvblxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fSB0aGUgaW50YWN0IHJhbmdlcyBpbiB0aGUgcmVuZGVyZWQgcmVnaW9uXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgY29tcHV0ZUludGFjdFJhbmdlcyAoZmlyc3RSb3csIGxhc3RSb3csIGNoYW5nZXMpIHtcbiAgICBpZiAoKHRoaXMub2Zmc2NyZWVuRmlyc3RSb3cgPT0gbnVsbCkgJiYgKHRoaXMub2Zmc2NyZWVuTGFzdFJvdyA9PSBudWxsKSkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgLy8gQXQgZmlyc3QsIHRoZSB3aG9sZSByYW5nZSBpcyBjb25zaWRlcmVkIGludGFjdFxuICAgIGxldCBpbnRhY3RSYW5nZXMgPSBbXG4gICAgICB7XG4gICAgICAgIHN0YXJ0OiB0aGlzLm9mZnNjcmVlbkZpcnN0Um93LFxuICAgICAgICBlbmQ6IHRoaXMub2Zmc2NyZWVuTGFzdFJvdyxcbiAgICAgICAgb2Zmc2NyZWVuUm93OiAwXG4gICAgICB9XG4gICAgXVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNoYW5nZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGNoYW5nZSA9IGNoYW5nZXNbaV1cbiAgICAgIGNvbnN0IG5ld0ludGFjdFJhbmdlcyA9IFtdXG5cbiAgICAgIGZvciAobGV0IGogPSAwLCBpbnRhY3RMZW4gPSBpbnRhY3RSYW5nZXMubGVuZ3RoOyBqIDwgaW50YWN0TGVuOyBqKyspIHtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSBpbnRhY3RSYW5nZXNbal1cblxuICAgICAgICBpZiAoY2hhbmdlLmVuZCA8IHJhbmdlLnN0YXJ0ICYmIGNoYW5nZS5zY3JlZW5EZWx0YSAhPT0gMCkge1xuICAgICAgICAgIC8vIFRoZSBjaGFuZ2UgaXMgYWJvdmUgb2YgdGhlIHJhbmdlIGFuZCBsaW5lcyBhcmUgZWl0aGVyXG4gICAgICAgICAgLy8gYWRkZWQgb3IgcmVtb3ZlZFxuICAgICAgICAgIG5ld0ludGFjdFJhbmdlcy5wdXNoKHtcbiAgICAgICAgICAgIHN0YXJ0OiByYW5nZS5zdGFydCArIGNoYW5nZS5zY3JlZW5EZWx0YSxcbiAgICAgICAgICAgIGVuZDogcmFuZ2UuZW5kICsgY2hhbmdlLnNjcmVlbkRlbHRhLFxuICAgICAgICAgICAgb2Zmc2NyZWVuUm93OiByYW5nZS5vZmZzY3JlZW5Sb3dcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKGNoYW5nZS5lbmQgPCByYW5nZS5zdGFydCB8fCBjaGFuZ2Uuc3RhcnQgPiByYW5nZS5lbmQpIHtcbiAgICAgICAgICAvLyBUaGUgY2hhbmdlIGlzIG91dHNpZGUgdGhlIHJhbmdlIGJ1dCBkaWRuJ3QgYWRkXG4gICAgICAgICAgLy8gb3IgcmVtb3ZlIGxpbmVzXG4gICAgICAgICAgbmV3SW50YWN0UmFuZ2VzLnB1c2gocmFuZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlIGNoYW5nZSBpcyB3aXRoaW4gdGhlIHJhbmdlLCB0aGVyZSdzIG9uZSBpbnRhY3QgcmFuZ2VcbiAgICAgICAgICAvLyBmcm9tIHRoZSByYW5nZSBzdGFydCB0byB0aGUgY2hhbmdlIHN0YXJ0XG4gICAgICAgICAgaWYgKGNoYW5nZS5zdGFydCA+IHJhbmdlLnN0YXJ0KSB7XG4gICAgICAgICAgICBuZXdJbnRhY3RSYW5nZXMucHVzaCh7XG4gICAgICAgICAgICAgIHN0YXJ0OiByYW5nZS5zdGFydCxcbiAgICAgICAgICAgICAgZW5kOiBjaGFuZ2Uuc3RhcnQgLSAxLFxuICAgICAgICAgICAgICBvZmZzY3JlZW5Sb3c6IHJhbmdlLm9mZnNjcmVlblJvd1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNoYW5nZS5lbmQgPCByYW5nZS5lbmQpIHtcbiAgICAgICAgICAgIC8vIFRoZSBjaGFuZ2UgZW5kcyB3aXRoaW4gdGhlIHJhbmdlXG4gICAgICAgICAgICBpZiAoY2hhbmdlLmJ1ZmZlckRlbHRhICE9PSAwKSB7XG4gICAgICAgICAgICAgIC8vIExpbmVzIGFyZSBhZGRlZCBvciByZW1vdmVkLCB0aGUgaW50YWN0IHJhbmdlIHN0YXJ0cyBpbiB0aGVcbiAgICAgICAgICAgICAgLy8gbmV4dCBsaW5lIGFmdGVyIHRoZSBjaGFuZ2UgZW5kIHBsdXMgdGhlIHNjcmVlbiBkZWx0YVxuICAgICAgICAgICAgICBuZXdJbnRhY3RSYW5nZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IGNoYW5nZS5lbmQgKyBjaGFuZ2Uuc2NyZWVuRGVsdGEgKyAxLFxuICAgICAgICAgICAgICAgIGVuZDogcmFuZ2UuZW5kICsgY2hhbmdlLnNjcmVlbkRlbHRhLFxuICAgICAgICAgICAgICAgIG9mZnNjcmVlblJvdzogcmFuZ2Uub2Zmc2NyZWVuUm93ICsgY2hhbmdlLmVuZCArIDEgLSByYW5nZS5zdGFydFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGFuZ2Uuc2NyZWVuRGVsdGEgIT09IDApIHtcbiAgICAgICAgICAgICAgLy8gTGluZXMgYXJlIGFkZGVkIG9yIHJlbW92ZWQgaW4gdGhlIGRpc3BsYXkgYnVmZmVyLCB0aGUgaW50YWN0XG4gICAgICAgICAgICAgIC8vIHJhbmdlIHN0YXJ0cyBpbiB0aGUgbmV4dCBsaW5lIGFmdGVyIHRoZSBjaGFuZ2UgZW5kIHBsdXMgdGhlXG4gICAgICAgICAgICAgIC8vIHNjcmVlbiBkZWx0YVxuICAgICAgICAgICAgICBuZXdJbnRhY3RSYW5nZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IGNoYW5nZS5lbmQgKyBjaGFuZ2Uuc2NyZWVuRGVsdGEgKyAxLFxuICAgICAgICAgICAgICAgIGVuZDogcmFuZ2UuZW5kICsgY2hhbmdlLnNjcmVlbkRlbHRhLFxuICAgICAgICAgICAgICAgIG9mZnNjcmVlblJvdzogcmFuZ2Uub2Zmc2NyZWVuUm93ICsgY2hhbmdlLmVuZCArIDEgLSByYW5nZS5zdGFydFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gTm8gbGluZXMgYXJlIGFkZGVkLCB0aGUgaW50YWN0IHJhbmdlIHN0YXJ0cyBvbiB0aGUgbGluZSBhZnRlclxuICAgICAgICAgICAgICAvLyB0aGUgY2hhbmdlIGVuZFxuICAgICAgICAgICAgICBuZXdJbnRhY3RSYW5nZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IGNoYW5nZS5lbmQgKyAxLFxuICAgICAgICAgICAgICAgIGVuZDogcmFuZ2UuZW5kLFxuICAgICAgICAgICAgICAgIG9mZnNjcmVlblJvdzogcmFuZ2Uub2Zmc2NyZWVuUm93ICsgY2hhbmdlLmVuZCArIDEgLSByYW5nZS5zdGFydFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaW50YWN0UmFuZ2VzID0gbmV3SW50YWN0UmFuZ2VzXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudHJ1bmNhdGVJbnRhY3RSYW5nZXMoaW50YWN0UmFuZ2VzLCBmaXJzdFJvdywgbGFzdFJvdylcbiAgfVxuXG4gIC8qKlxuICAgKiBUcnVuY2F0ZXMgdGhlIGludGFjdCByYW5nZXMgc28gdGhhdCB0aGV5IGRvZXNuJ3QgZXhwYW5kIHBhc3QgdGhlIHZpc2libGVcbiAgICogYXJlYSBvZiB0aGUgbWluaW1hcC5cbiAgICpcbiAgICogQHBhcmFtICB7QXJyYXk8T2JqZWN0Pn0gaW50YWN0UmFuZ2VzIHRoZSBpbml0aWFsIGFycmF5IG9mIHJhbmdlc1xuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGZpcnN0Um93IHRoZSBmaXJzdCByb3cgb2YgdGhlIHJlbmRlcmVkIHJlZ2lvblxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGxhc3RSb3cgdGhlIGxhc3Qgcm93IG9mIHRoZSByZW5kZXJlZCByZWdpb25cbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn0gdGhlIGFycmF5IG9mIHRydW5jYXRlZCByYW5nZXNcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICB0cnVuY2F0ZUludGFjdFJhbmdlcyAoaW50YWN0UmFuZ2VzLCBmaXJzdFJvdywgbGFzdFJvdykge1xuICAgIGxldCBpID0gMFxuICAgIHdoaWxlIChpIDwgaW50YWN0UmFuZ2VzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcmFuZ2UgPSBpbnRhY3RSYW5nZXNbaV1cblxuICAgICAgaWYgKHJhbmdlLnN0YXJ0IDwgZmlyc3RSb3cpIHtcbiAgICAgICAgcmFuZ2Uub2Zmc2NyZWVuUm93ICs9IGZpcnN0Um93IC0gcmFuZ2Uuc3RhcnRcbiAgICAgICAgcmFuZ2Uuc3RhcnQgPSBmaXJzdFJvd1xuICAgICAgfVxuXG4gICAgICBpZiAocmFuZ2UuZW5kID4gbGFzdFJvdykgeyByYW5nZS5lbmQgPSBsYXN0Um93IH1cblxuICAgICAgaWYgKHJhbmdlLnN0YXJ0ID49IHJhbmdlLmVuZCkgeyBpbnRhY3RSYW5nZXMuc3BsaWNlKGktLSwgMSkgfVxuXG4gICAgICBpKytcbiAgICB9XG5cbiAgICByZXR1cm4gaW50YWN0UmFuZ2VzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLm9mZnNjcmVlblJvdyAtIGIub2Zmc2NyZWVuUm93XG4gICAgfSlcbiAgfVxufVxuIl19
//# sourceURL=/Users/victor.martins/.atom/packages/minimap/lib/mixins/canvas-drawer.js
