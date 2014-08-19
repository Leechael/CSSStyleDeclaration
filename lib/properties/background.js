'use strict';

var shorthandParser = require('../parsers').shorthandParser;
var shorthandGetter = require('../parsers').shorthandGetter;
var dashedToCamelCase = require('../parsers').dashedToCamelCase;

var shorthand_for = {
    'background-color': require('./backgroundColor'),
    'background-image': require('./backgroundImage'),
    'background-repeat': require('./backgroundRepeat'),
    'background-attachment': require('./backgroundAttachment'),
    'background-position': require('./backgroundPosition')
};

var REGEX = /^(?:((?:[a-z]+(?=\s*))|#[0-9a-f]{6}|#[0-9a-f]{3}|rgba?\((?:\d{1,3},\s*){2,3}(?:\d{1,3}|[\.0-9]+)\))?\s*)?(?:(url\([^)]+\))\s*)?(?:((?:[a-z]+(?=\s*))|#[0-9a-f]{6}|#[0-9a-f]{3}|rgba?\((?:\d{1,3},\s*){2,3}(?:\d{1,3}|[\.0-9]+)\))?\s*)?(?:\s+(space|round|(?:no-)?repeat(?:-(?:x|y))?)?\s*)?(?:\s*((?:(?:[.\d]+(?:\%|in|[cem]m|ex|p[ctx])|top|bottom|center|middle|left|right)\s*){1,2})\s*)?(scroll|fixed|local|inherit)?$/

module.exports.isValid = function isValid(v) {
    return shorthandParser(v, shorthand_for) !== undefined;
};

module.exports.definition = {
    set: function (v) {
        var parts = REGEX.exec(v);
        if (parts) {
            if (parts[1]) {
                this['background-color'] = parts[1]
            } else if (parts[3]) {
                this['background-color'] = parts[3]
            }

            this['background-image'] = parts[2]
            this['background-repeat'] = parts[4]
            if (parts[5]) {
                this['background-position'] = parts[5].trim()
            }
            this['background-attachment'] = parts[6]
        }
        this.setProperty('background', v);
    },

    get: shorthandGetter('background', shorthand_for),
    enumerable: true,
    configurable: true
};
