/*********************************************************************
 * This is a fork from the CSS Style Declaration part of
 * https://github.com/NV/CSSOM
 ********************************************************************/
"use strict";
var CSSOM = require('cssom');

var camelToDashed = require('./parsers').camelToDashed;

/**
 * @constructor
 * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration
 */
var CSSStyleDeclaration = function CSSStyleDeclaration() {
    this._values = {};
    this._importants = {};
    this._length = 0;
};
CSSStyleDeclaration.prototype = {
    constructor: CSSStyleDeclaration,

    /**
     *
     * @param {string} name
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-getPropertyValue
     * @return {string} the value of the property if it has been explicitly set for this declaration block.
     * Returns the empty string if the property has not been set.
     */
    getPropertyValue: function (name) {
        return this._values[name] || "";
    },

    /**
     *
     * @param {string} name
     * @param {string} value
     * @param {string} [priority=null] "important" or null
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-setProperty
     */
    setProperty: function (name, value, priority) {
        if (value === undefined) {
            return;
        }
        if (value === null || value === '') {
            this.removeProperty(name);
            return;
        }
        if (this._values[name]) {
            // Property already exist. Overwrite it.
            var index = Array.prototype.indexOf.call(this, name);
            if (index < 0) {
                this[this._length] = name;
                this._length++;
            }
        } else {
            // New property.
            this[this._length] = name;
            this._length++;
        }
        this._values[name] = value;
        this._importants[name] = priority;
    },

    /**
     *
     * @param {string} name
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-removeProperty
     * @return {string} the value of the property if it has been explicitly set for this declaration block.
     * Returns the empty string if the property has not been set or the property name does not correspond to a known CSS property.
     */
    removeProperty: function (name) {
        if (!this._values.hasOwnProperty(name)) {
            return "";
        }
        var index = Array.prototype.indexOf.call(this, name);
        if (index < 0) {
            return "";
        }
        var prevValue = this._values[name];
        delete this._values[name];

        // That's what WebKit and Opera do
        Array.prototype.splice.call(this, index, 1);

        // That's what Firefox does
        //this[index] = ""

        return prevValue;
    },


    /**
     *
     * @param {String} name
     */
    getPropertyPriority: function (name) {
        return this._importants[name] || "";
    },


    getPropertyCSSValue: function () {
        //FIXME
        return;
    },

    /**
     *   element.style.overflow = "auto"
     *   element.style.getPropertyShorthand("overflow-x")
     *   -> "overflow"
     */
    getPropertyShorthand: function () {
        //FIXME
        return;
    },

    isPropertyImplicit: function () {
        //FIXME
        return;
    },

    /**
     *   http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-item
     */
    item: function (index) {
        index = parseInt(index, 10);
        if (index < 0 || index >= this._length) {
            return '';
        }
        return this[index];
    }
};

Object.defineProperties(CSSStyleDeclaration.prototype, {
    cssText: {
        get: function () {
            var properties = [];
            var i;
            var name;
            var value;
            var priority;
            for (i = 0; i < this._length; i++) {
                name = this[i];
                value = this.getPropertyValue(name);
                priority = this.getPropertyPriority(name);
                if (priority !== '') {
                    priority = " !" + priority;
                }
                properties.push([name, ': ', value, priority, ';'].join(''));
            }
            return properties.join(' ');
        },
        set: function (value) {
            var i;
            this._values = {};
            Array.prototype.splice.call(this, 0, this._length);
            this._importants = {};
            var dummyRule = CSSOM.parse('#bogus{' + value + '}').cssRules[0].style;
            var rule_length = dummyRule.length;
            var name;
            for (i = 0; i < rule_length; ++i) {
                name = dummyRule[i];
                this.setProperty(dummyRule[i], dummyRule.getPropertyValue(name), dummyRule.getPropertyPriority(name));
            }
        },
        enumerable: true,
        configurable: true
    },
    parentRule: {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    },
    length: {
        get: function () { return this._length; },
        /**
         * This deletes indices if the new length is less then the current
         * length. If the new length is more, it does nothing, the new indices
         * will be undefined until set.
         **/
        set: function (value) {
            var i;
            for (i = value; i < this._length; i++) {
                delete this[i];
            }
            this._length = value;
        },
        enumerable: true,
        configurable: true
    }
});

var Definition = function (property, definition) {
    this.get = function () {
        Object.defineProperty(this, property, definition);
        return this[property];
    };

    this.set = function (v) {
        Object.defineProperty(this, property, definition);
        this[property] = v;
    };

    this.enumerable = true;
    this.configurable = true;
};

function define(property, module) {
    var dashed = camelToDashed(property);
    Object.defineProperty(CSSStyleDeclaration.prototype, property, new Definition(property, module.definition));
    Object.defineProperty(CSSStyleDeclaration.prototype, dashed, new Definition(property, module.definition));
}


/*
 *
 * http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSS2Properties
 */

define('azimuth', require('./properties/azimuth.js'));
define('background', require('./properties/background.js'));
define('backgroundAttachment', require('./properties/backgroundAttachment.js'));
define('backgroundColor', require('./properties/backgroundColor.js'));
define('backgroundImage', require('./properties/backgroundImage.js'));
define('backgroundPosition', require('./properties/backgroundPosition.js'));
define('backgroundRepeat', require('./properties/backgroundRepeat.js'));
define('border', require('./properties/border.js'));
define('borderBottom', require('./properties/borderBottom.js'));
define('borderBottomColor', require('./properties/borderBottomColor.js'));
define('borderBottomStyle', require('./properties/borderBottomStyle.js'));
define('borderBottomWidth', require('./properties/borderBottomWidth.js'));
define('borderCollapse', require('./properties/borderCollapse.js'));
define('borderColor', require('./properties/borderColor.js'));
define('borderLeft', require('./properties/borderLeft.js'));
define('borderLeftColor', require('./properties/borderLeftColor.js'));
define('borderLeftStyle', require('./properties/borderLeftStyle.js'));
define('borderLeftWidth', require('./properties/borderLeftWidth.js'));
define('borderRadius', require('./properties/borderRadius.js'));
define('borderRight', require('./properties/borderRight.js'));
define('borderRightColor', require('./properties/borderRightColor.js'));
define('borderRightStyle', require('./properties/borderRightStyle.js'));
define('borderRightWidth', require('./properties/borderRightWidth.js'));
define('borderSpacing', require('./properties/borderSpacing.js'));
define('borderStyle', require('./properties/borderStyle.js'));
define('borderTop', require('./properties/borderTop.js'));
define('borderTopColor', require('./properties/borderTopColor.js'));
define('borderTopStyle', require('./properties/borderTopStyle.js'));
define('borderTopWidth', require('./properties/borderTopWidth.js'));
define('borderWidth', require('./properties/borderWidth.js'));
define('bottom', require('./properties/bottom.js'));
define('captionSide', require('./properties/captionSide.js'));
define('clear', require('./properties/clear.js'));
define('clip', require('./properties/clip.js'));
define('color', require('./properties/color.js'));
define('content', require('./properties/content.js'));
define('counterIncrement', require('./properties/counterIncrement.js'));
define('counterReset', require('./properties/counterReset.js'));
define('cssFloat', require('./properties/cssFloat.js'));
define('cue', require('./properties/cue.js'));
define('cueAfter', require('./properties/cueAfter.js'));
define('cueBefore', require('./properties/cueBefore.js'));
define('cursor', require('./properties/cursor.js'));
define('direction', require('./properties/direction.js'));
define('display', require('./properties/display.js'));
define('elevation', require('./properties/elevation.js'));
define('emptyCells', require('./properties/emptyCells.js'));
define('font', require('./properties/font.js'));
define('fontFamily', require('./properties/fontFamily.js'));
define('fontSize', require('./properties/fontSize.js'));
define('fontSizeAdjust', require('./properties/fontSizeAdjust.js'));
define('fontStretch', require('./properties/fontStretch.js'));
define('fontStyle', require('./properties/fontStyle.js'));
define('fontVariant', require('./properties/fontVariant.js'));
define('fontWeight', require('./properties/fontWeight.js'));
define('height', require('./properties/height.js'));
define('left', require('./properties/left.js'));
define('letterSpacing', require('./properties/letterSpacing.js'));
define('lineHeight', require('./properties/lineHeight.js'));
define('listStyle', require('./properties/listStyle.js'));
define('listStyleImage', require('./properties/listStyleImage.js'));
define('listStylePosition', require('./properties/listStylePosition.js'));
define('listStyleType', require('./properties/listStyleType.js'));
define('margin', require('./properties/margin.js'));
define('marginBottom', require('./properties/marginBottom.js'));
define('marginLeft', require('./properties/marginLeft.js'));
define('marginRight', require('./properties/marginRight.js'));
define('marginTop', require('./properties/marginTop.js'));
define('markerOffset', require('./properties/markerOffset.js'));
define('marks', require('./properties/marks.js'));
define('maxHeight', require('./properties/maxHeight.js'));
define('maxWidth', require('./properties/maxWidth.js'));
define('minHeight', require('./properties/minHeight.js'));
define('minWidth', require('./properties/minWidth.js'));
define('opacity', require('./properties/opacity.js'));
define('orphans', require('./properties/orphans.js'));
define('outline', require('./properties/outline.js'));
define('outlineColor', require('./properties/outlineColor.js'));
define('outlineOffset', require('./properties/outlineOffset.js'));
define('outlineStyle', require('./properties/outlineStyle.js'));
define('outlineWidth', require('./properties/outlineWidth.js'));
define('overflow', require('./properties/overflow.js'));
define('padding', require('./properties/padding.js'));
define('paddingBottom', require('./properties/paddingBottom.js'));
define('paddingLeft', require('./properties/paddingLeft.js'));
define('paddingRight', require('./properties/paddingRight.js'));
define('paddingTop', require('./properties/paddingTop.js'));
define('page', require('./properties/page.js'));
define('pageBreakAfter', require('./properties/pageBreakAfter.js'));
define('pageBreakBefore', require('./properties/pageBreakBefore.js'));
define('pageBreakInside', require('./properties/pageBreakInside.js'));
define('pause', require('./properties/pause.js'));
define('pauseAfter', require('./properties/pauseAfter.js'));
define('pauseBefore', require('./properties/pauseBefore.js'));
define('pitch', require('./properties/pitch.js'));
define('pitchRange', require('./properties/pitchRange.js'));
define('playDuring', require('./properties/playDuring.js'));
define('position', require('./properties/position.js'));
define('quotes', require('./properties/quotes.js'));
define('richness', require('./properties/richness.js'));
define('right', require('./properties/right.js'));
define('size', require('./properties/size.js'));
define('speak', require('./properties/speak.js'));
define('speakHeader', require('./properties/speakHeader.js'));
define('speakNumeral', require('./properties/speakNumeral.js'));
define('speakPunctuation', require('./properties/speakPunctuation.js'));
define('speechRate', require('./properties/speechRate.js'));
define('stress', require('./properties/stress.js'));
define('tableLayout', require('./properties/tableLayout.js'));
define('textAlign', require('./properties/textAlign.js'));
define('textDecoration', require('./properties/textDecoration.js'));
define('textIndent', require('./properties/textIndent.js'));
define('textShadow', require('./properties/textShadow.js'));
define('textTransform', require('./properties/textTransform.js'));
define('top', require('./properties/top.js'));
define('unicodeBidi', require('./properties/unicodeBidi.js'));
define('verticalAlign', require('./properties/verticalAlign.js'));
define('visibility', require('./properties/visibility.js'));
define('voiceFamily', require('./properties/voiceFamily.js'));
define('volume', require('./properties/volume.js'));
define('whiteSpace', require('./properties/whiteSpace.js'));
define('widows', require('./properties/widows.js'));
define('width', require('./properties/width.js'));
define('wordSpacing', require('./properties/wordSpacing.js'));
define('zIndex', require('./properties/zIndex.js'));

exports.CSSStyleDeclaration = CSSStyleDeclaration;
