'use strict';

var parsers = require('./parsers');

/**
 * For color value validating and parsing.
 */
function parse_color (v) {
    var parsed = parsers.parseColor(v),
        valid;
    if (parsed !== undefined) {
        return parsed;
    }
    valid = (
        (parsers.valueType(v) === parsers.TYPES.KEYWORD)
        && (
            v.toLowerCase() === 'transparent'
            || v.toLowerCase() === 'inherit'
        )
    );
    return valid ? v : undefined;
};

function valid_color (v) {
    return parse_color(v) !== undefined;
};

module.exports.color = {
    parse: parse_color,
    valid: valid_color
};

