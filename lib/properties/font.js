'use strict';

var parsers = require('../parsers');
var TYPES = require('../parsers').TYPES;
var valueType = require('../parsers').valueType;
var shorthandParser = require('../parsers').shorthandParser;
var shorthandSetter = require('../parsers').shorthandSetter;
var shorthandGetter = require('../parsers').shorthandGetter;

var shorthand_for = {
    'font-style': require('./fontStyle'),
    'font-variant': require('./fontVariant'),
    'font-weight': require('./fontWeight'),
    'font-size': require('./fontSize'),
    'line-height': require('./lineHeight'),
    'font-family': require('./fontFamily')
};

var static_fonts = ['caption', 'icon', 'menu', 'message-box', 'small-caption', 'status-bar', 'inherit'];

var splitRegex = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(normal|italic|oblique|inherit))?)(?=(?:(?:[-a-z]+\s*){0,2}(normal|small-caps|inherit))?)(?=(?:(?:[-a-z]+\s*){0,2}(normal|inherit|bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(?:normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?(?:\s*([.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\"\sa-z]+?)\s*$/i

module.exports.isValid = function isValid(v) {
    return (shorthandParser(v, shorthand_for) !== undefined) ||
        (valueType(v) === TYPES.KEYWORD && static_fonts.indexOf(v.toLowerCase()) !== -1);
};

module.exports.definition = {
    set: function (v) {
        // @see {http://stackoverflow.com/questions/10135697/regex-to-parse-any-css-font}
        var parts = splitRegex.exec(v)
        if (parts) {
            this['font-style'] = parts[1];
            this['font-variant'] = parts[2];
            this['font-weight'] = parts[3];
            this['font-size'] = parts[4];
            this['line-height'] = parts[5];
            this['font-family'] = parts[6];
            this.setProperty('font', v);
        }
    },
    get: shorthandGetter('background', shorthand_for),
    enumerable: true,
    configurable: true
};
