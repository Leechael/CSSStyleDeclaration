/*********************************************************************
 * These are commonly used parsers for CSS Values they take a string *
 * to parse and return a string after it's been converted, if needed *
 ********************************************************************/
'use strict';

exports.TYPES = {
    INTEGER: 1,
    NUMBER: 2,
    LENGTH: 3,
    PERCENT: 4,
    URL: 5,
    COLOR: 6,
    STRING: 7,
    ANGLE: 8,
    KEYWORD: 9,
    NULL_OR_EMPTY_STR: 10
};

/*jslint regexp: true*/
// rough regular expressions
var integerRegEx = /^[\-+]?[0-9]+$/;
var numberRegEx = /^[\-+]?[0-9]*\.[0-9]+$/;
var lengthRegEx = /^(0|[\-+]?[0-9]?\.?[0-9]+(in|cm|em|mm|pt|pc|px))$/;
var percentRegEx = /^[\-+]?[0-9]?\.?[0-9]+%$/;
var urlRegEx = /^url\(\s*([^\)]*)\s*\)$/;
var stringRegEx = /^("[^"]*"|'[^']*')$/;
var colorRegEx1 = /^#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]([0-9a-fA-F][0-9a-fA-F][0-9a-fA-F])?$/;
var colorRegEx2 = /^rgb\(([^\)]*)\)$/;
var colorRegEx3 = /^rgba\(([^\)]*)\)$/;
var angleRegEx = /^([\-+]?[0-9]?\.?[0-9]+)(deg|grad|rad)$/;
/*jslint regexp: false*/

// This will return one of the above types based on the passed in string
exports.valueType = function valueType(val) {
    if (val === '' || val === null) {
        return exports.TYPES.NULL_OR_EMPTY_STR;
    }
    if (typeof val === 'number') {
        val = val.toString();
    }

    if (typeof val !== 'string') {
        return undefined;
    }

    if (integerRegEx.test(val)) {
        return exports.TYPES.INTEGER;
    }
    if (numberRegEx.test(val)) {
        return exports.TYPES.NUMBER;
    }
    if (lengthRegEx.test(val)) {
        return exports.TYPES.LENGTH;
    }
    if (percentRegEx.test(val)) {
        return exports.TYPES.PERCENT;
    }
    if (urlRegEx.test(val)) {
        return exports.TYPES.URL;
    }
    if (stringRegEx.test(val)) {
        return exports.TYPES.STRING;
    }
    if (angleRegEx.test(val)) {
        return exports.TYPES.ANGLE;
    }
    if (colorRegEx1.test(val)) {
        return exports.TYPES.COLOR;
    }
    var res = colorRegEx2.exec(val);
    var parts;
    if (res !== null) {
        parts = res[1].split(/\s*,\s*/);
        if (parts.length !== 3) {
            return undefined;
        }
        if (parts.every(percentRegEx.test.bind(percentRegEx)) || parts.every(integerRegEx.test.bind(integerRegEx))) {
            return exports.TYPES.COLOR;
        }
        return undefined;
    }
    res = colorRegEx3.exec(val);
    if (res !== null) {
        parts = res[1].split(/\s*,\s*/);
        if (parts.length !== 4) {
            return undefined;
        }
        if (parts.slice(0, 3).every(percentRegEx.test.bind(percentRegEx)) || parts.every(integerRegEx.test.bind(integerRegEx))) {
            if (numberRegEx.test(parts[3])) {
                return exports.TYPES.COLOR;
            }
        }
        return undefined;
    }

    // could still be a color, one of the standard keyword colors
    val = val.toLowerCase();
    switch (val) {
    case 'maroon':
    case 'red':
    case 'orange':
    case 'yellow':
    case 'olive':
    case 'purple':
    case 'fuchsia':
    case 'white':
    case 'lime':
    case 'green':
    case 'navy':
    case 'blue':
    case 'aqua':
    case 'teal':
    case 'black':
    case 'silver':
    case 'gray':
        // the following are deprecated in CSS3
    case 'activeborder':
    case 'activecaption':
    case 'appworkspace':
    case 'background':
    case 'buttonface':
    case 'buttonhighlight':
    case 'buttonshadow':
    case 'buttontext':
    case 'captiontext':
    case 'graytext':
    case 'highlight':
    case 'highlighttext':
    case 'inactiveborder':
    case 'inactivecaption':
    case 'inactivecaptiontext':
    case 'infobackground':
    case 'infotext':
    case 'menu':
    case 'menutext':
    case 'scrollbar':
    case 'threeddarkshadow':
    case 'threedface':
    case 'threedhighlight':
    case 'threedlightshadow':
    case 'threedshadow':
    case 'window':
    case 'windowframe':
    case 'windowtext':
        return exports.TYPES.COLOR;
    default:
        return exports.TYPES.KEYWORD;
    }
};

exports.parseInteger = function parseInteger(val) {
    var type = exports.valueType(val);
    if (type === exports.TYPES.NULL_OR_EMPTY_STR) {
        return val;
    }
    if (type !== exports.TYPES.INTEGER) {
        return undefined;
    }
    return String(parseInt(val, 10));
};

exports.parseNumber = function parseNumber(val) {
    var type = exports.valueType(val);
    if (type === exports.TYPES.NULL_OR_EMPTY_STR) {
        return val;
    }
    if (type !== exports.TYPES.NUMBER) {
        return undefined;
    }
    return String(parseFloat(val));
};

exports.parseLength = function parseLength(val) {
    if (val === 0 || val === '0') {
        return '0px';
    }
    var type = exports.valueType(val);
    if (type === exports.TYPES.NULL_OR_EMPTY_STR) {
        return val;
    }
    if (type !== exports.TYPES.LENGTH) {
        return undefined;
    }
    return val;
};

exports.parsePercent = function parsePercent(val) {
    if (val === 0 || val === '0') {
        return '0%';
    }
    var type = exports.valueType(val);
    if (type === exports.TYPES.NULL_OR_EMPTY_STR) {
        return val;
    }
    if (type !== exports.TYPES.PERCENT) {
        return undefined;
    }
    return val;
};

// either a length or a percent
exports.parseMeasurement = function parseMeasurement(val) {
    var length = exports.parseLength(val);
    if (length !== undefined) {
        return length;
    }
    return exports.parsePercent(val);
};

exports.parseUrl = function parseUrl(val) {
    var type = exports.valueType(val);
    if (type === exports.TYPES.NULL_OR_EMPTY_STR) {
        return val;
    }
    var res = urlRegEx.exec(val);
    // does it match the regex?
    if (!res) {
        return undefined;
    }
    var str = res[1];
    // if it starts with single or double quotes, does it end with the same?
    if ((str[1] === '"' || str[1] === "'") && str[1] !== str[str.length - 1]) {
        return undefined;
    }
    if (str[1] === '"' || str[1] === "'") {
        str = str.substr(1, -1);
    }

    var i;
    for (i = 0; i < str.length; i++) {
        switch (str[i]) {
        case '(':
        case ')':
        case ' ':
        case '\t':
        case '\n':
        case "'":
        case '"':
            return undefined;
        case '\\':
            i++;
            break;
        }
    }
    return 'url(' + str + ')';
};

exports.parseString = function parseString(val) {
    var type = exports.valueType(val);
    if (type === exports.TYPES.NULL_OR_EMPTY_STR) {
        return val;
    }
    if (type !== exports.TYPES.STRING) {
        return undefined;
    }
    var i;
    for (i = 1; i < val.length - 1; i++) {
        switch (val[i]) {
        case val[0]:
            return undefined;
        case '\\':
            i++;
            while (i < val.length - 1 && /[0-9A-Fa-f]/.test(val[i])) {
                i++;
            }
            break;
        }
    }
    if (i >= val.length) {
        return undefined;
    }
    return val;
};

exports.parseColor = function parseColor(val) {
    var type = exports.valueType(val);
    if (type === exports.TYPES.NULL_OR_EMPTY_STR) {
        return val;
    }
    var red, green, blue, alpha = 1;
    var parts;
    var res = colorRegEx1.exec(val);
    // is it #aaa or #ababab
    if (res) {
        var hex = val.substr(1);
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        red = parseInt(hex.substr(0, 2), 16);
        green = parseInt(hex.substr(2, 2), 16);
        blue = parseInt(hex.substr(4, 2), 16);
        return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    }

    res = colorRegEx2.exec(val);
    if (res) {
        parts = res[1].split(/\s*,\s*/);
        if (parts.length !== 3) {
            return undefined;
        }
        if (parts.every(percentRegEx.test.bind(percentRegEx))) {
            red = Math.floor(parseFloat(parts[0].slice(0, -1)) * 255 / 100);
            green = Math.floor(parseFloat(parts[1].slice(0, -1)) * 255 / 100);
            blue = Math.floor(parseFloat(parts[2].slice(0, -1)) * 255 / 100);
        } else if (parts.every(integerRegEx.test.bind(integerRegEx))) {
            red = parseInt(parts[0], 10);
            green = parseInt(parts[1], 10);
            blue = parseInt(parts[2], 10);
        } else {
            return undefined;
        }
        red = Math.min(255, Math.max(0, red));
        green = Math.min(255, Math.max(0, green));
        blue = Math.min(255, Math.max(0, blue));
        return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    }

    res = colorRegEx3.exec(val);
    if (res) {
        parts = res[1].split(/\s*,\s*/);
        if (parts.length !== 4) {
            return undefined;
        }
        if (parts.slice(0, 3).every(percentRegEx.test.bind(percentRegEx))) {
            red = Math.floor(parseFloat(parts[0].slice(0, -1)) * 255 / 100);
            green = Math.floor(parseFloat(parts[1].slice(0, -1)) * 255 / 100);
            blue = Math.floor(parseFloat(parts[2].slice(0, -1)) * 255 / 100);
            alpha = parseFloat(parts[3]);
        } else if (parts.slice(0, 3).every(integerRegEx.test.bind(integerRegEx))) {
            red = parseInt(parts[0], 10);
            green = parseInt(parts[1], 10);
            blue = parseInt(parts[2], 10);
            alpha = parseFloat(parts[3]);
        } else {
            return undefined;
        }
        if (isNaN(alpha)) {
            alpha = 1;
        }
        red = Math.min(255, Math.max(0, red));
        green = Math.min(255, Math.max(0, green));
        blue = Math.min(255, Math.max(0, blue));
        alpha = Math.min(1, Math.max(0, alpha));
        if (alpha === 1) {
            return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
        }
        return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
    }

    if (type === exports.TYPES.COLOR) {
        return val;
    }
    return undefined;
};

exports.parseAngle = function parseAngle(val) {
    var type = exports.valueType(val);
    if (type === exports.TYPES.NULL_OR_EMPTY_STR) {
        return val;
    }
    if (type !== exports.TYPES.ANGLE) {
        return undefined;
    }
    var res = angleRegEx.exec(val);
    var flt = parseFloat(res[1]);
    if (res[2] === 'rad') {
        flt *= 180 / Math.PI;
    } else if (res[2] === 'grad') {
        flt *= 360 / 400;
    }

    while (flt < 0) {
        flt += 360;
    }
    while (flt > 360) {
        flt -= 360;
    }
    return flt + 'deg';
};

exports.parseKeyword = function parseKeyword(val, valid_keywords) {
    var type = exports.valueType(val);
    if (type === exports.TYPES.NULL_OR_EMPTY_STR) {
        return val;
    }
    if (type !== exports.TYPES.KEYWORD) {
        return undefined;
    }
    val = val.toString().toLowerCase();
    var i;
    for (i = 0; i < valid_keywords.length; i++) {
        if (valid_keywords[i].toLowerCase() === val) {
            return valid_keywords[i];
        }
    }
    return undefined;
};

// utility to translate from border-width to borderWidth
var dashedToCamelCase = exports.dashedToCamelCase = function (dashed) {
    var i;
    var camel = '';
    var nextCap = false;
    for (i = 0; i < dashed.length; i++) {
        if (dashed[i] !== '-') {
            camel += nextCap ? dashed[i].toUpperCase() : dashed[i];
            nextCap = false;
        } else {
            nextCap = true;
        }
    }
    return camel;
};

var is_space = /\s/;
var opening_deliminators = ['"', '\'', '('];
var closing_deliminators = ['"', '\'', ')'];
// this splits on whitespace, but keeps quoted and parened parts together
var getParts = function (str) {
    var deliminator_stack = [];
    var length = str.length;
    var i;
    var parts = [];
    var current_part = '';
    var opening_index;
    var closing_index;
    for (i = 0; i < length; i++) {
        opening_index = opening_deliminators.indexOf(str[i]);
        closing_index = closing_deliminators.indexOf(str[i]);
        if (is_space.test(str[i])) {
            if (deliminator_stack.length === 0) {
                parts.push(current_part);
                current_part = '';
            } else {
                current_part += str[i];
            }
        } else {
            if (str[i] === '\\') {
                i++;
                current_part += str[i];
            } else {
                current_part += str[i];
                if (closing_index !== -1 && closing_index === deliminator_stack[deliminator_stack.length - 1]) {
                    deliminator_stack.pop();
                } else if (opening_index !== -1) {
                    deliminator_stack.push(opening_index);
                }
            }
        }
    }
    if (current_part !== '') {
        parts.push(current_part);
    }
    return parts;
};

/*
 * this either returns undefined meaning that it isn't valid
 * or returns an object where the keys are dashed short
 * hand properties and the values are the values to set
 * on them
 */
exports.shorthandParser = function parse(v, shorthand_for) {
    var type = exports.valueType(v);
    if (type === exports.TYPES.NULL_OR_EMPTY_STR) {
        return v;
    }

    if (typeof v === 'number') {
        v = v.toString();
    }

    if (typeof v !== 'string') {
        return undefined;
    }

    if (v.toLowerCase() === 'inherit') {
        return {};
    }
    var parts = getParts(v);
    var valid = true;
    var obj = {};
    parts.forEach(function (part) {
        var part_valid = false;
        Object.keys(shorthand_for).forEach(function (property) {
            if (shorthand_for[property].isValid(part)) {
                part_valid = true;
                obj[property] = part;
            }
        });
        valid = valid && part_valid;
    });
    if (!valid) {
        return undefined;
    }
    return obj;
};

exports.shorthandSetter = function (property, shorthand_for) {
    return function (v) {
        var obj = exports.shorthandParser(v, shorthand_for);
        if (obj === undefined) {
            return;
        }
        Object.keys(obj).forEach(function (subprop) {
            // in case subprop is an implicit property, this will clear
            // *its* subpropertiesX
            var camel = dashedToCamelCase(subprop);
            this[camel] = obj[subprop];
            // in case it gets translated into something else (0 -> 0px)
            obj[subprop] = this[camel];
            this.removeProperty(subprop);
            this._values[subprop] = obj[subprop];
        }, this);
        Object.keys(shorthand_for).forEach(function (subprop) {
            if (!obj.hasOwnProperty(subprop)) {
                this.removeProperty(subprop);
                delete this._values[subprop];
            }
        }, this);
        this.setProperty(property, v);
    };
};

exports.shorthandGetter = function (property, shorthand_for) {
    return function () {
        if (this._values[property] !== undefined) {
            return this.getPropertyValue(property);
        }
        return Object.keys(shorthand_for).map(function (subprop) {
            return this.getPropertyValue(subprop);
        }, this).filter(function (value) {
            return value !== '';
        }).join(' ');
    };
};

// isValid(){1,4} | inherit
// if one, it applies to all
// if two, the first applies to the top and bottom, and the second to left and right
// if three, the first applies to the top, the second to left and right, the third bottom
// if four, top, right, bottom, left
exports.implicitSetter = function (property_before, property_after, isValid, parser) {
    property_after = property_after || '';
    if (property_after !== '') {
        property_after = '-' + property_after;
    }

    return function (v) {
        if (typeof v === 'number') {
            v = v.toString();
        }
        if (typeof v !== 'string') {
            return undefined;
        }
        if (v.toLowerCase() === 'inherit') {
            return this.setProperty(property_before + property_after, v);
        }
        var parts = getParts(v);
        if (parts.length < 1 || parts.length > 4) {
            return undefined;
        }

        if (!parts.every(isValid)) {
            return undefined;
        }

        this.setProperty(property_before + property_after, parser(v));

        this.removeProperty(property_before + '-top' + property_after);
        this.removeProperty(property_before + '-right' + property_after);
        this.removeProperty(property_before + '-bottom' + property_after);
        this.removeProperty(property_before + '-left' + property_after);
        switch (parts.length) {
        case 1:
            this._values[property_before + '-top' + property_after] = parser(parts[0]);
            this._values[property_before + '-right' + property_after] = parser(parts[0]);
            this._values[property_before + '-bottom' + property_after] = parser(parts[0]);
            this._values[property_before + '-left' + property_after] = parser(parts[0]);
            return v;
        case 2:
            this._values[property_before + '-top' + property_after] = parser(parts[0]);
            this._values[property_before + '-right' + property_after] = parser(parts[1]);
            this._values[property_before + '-bottom' + property_after] = parser(parts[0]);
            this._values[property_before + '-left' + property_after] = parser(parts[1]);
            return v;
        case 3:
            this._values[property_before + '-top' + property_after] = parser(parts[0]);
            this._values[property_before + '-right' + property_after] = parser(parts[1]);
            this._values[property_before + '-bottom' + property_after] = parser(parts[2]);
            this._values[property_before + '-left' + property_after] = parser(parts[1]);
            return v;
        case 4:
            this._values[property_before + '-top' + property_after] = parser(parts[0]);
            this._values[property_before + '-right' + property_after] = parser(parts[1]);
            this._values[property_before + '-bottom' + property_after] = parser(parts[2]);
            this._values[property_before + '-left' + property_after] = parser(parts[3]);
            return v;
        }
    };
};

var camel_to_dashed = /[A-Z]/g;
/*jslint regexp: true*/
var first_segment = /^\([^\-]\)-/;
/*jslint regexp: false*/
var vendor_prefixes = ['o', 'moz', 'ms', 'webkit'];
exports.camelToDashed = function (camel_case) {
    var match;
    var dashed = camel_case.replace(camel_to_dashed, '-$&').toLowerCase();
    match = dashed.match(first_segment);
    if (match && vendor_prefixes.indexOf(match[1]) !== -1) {
        dashed = '-' + dashed;
    }
    return dashed;
};


exports.isValidLength = function (v) {
    return (exports.parseLength(v) !== undefined);
}
