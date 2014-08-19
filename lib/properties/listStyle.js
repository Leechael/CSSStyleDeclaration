'use strict';

var shorthandParser = require('../parsers').shorthandParser;
var shorthandSetter = require('../parsers').shorthandSetter;
var shorthandGetter = require('../parsers').shorthandGetter;

var shorthand_for = {
    'list-style-type': require('./listStyleType'),
    'list-style-position': require('./listStylePosition'),
    'list-style-image': require('./listStyleImage')
};

module.exports.isValid = function isValid(v) {
    return shorthandParser(v, shorthand_for) !== undefined;
}

module.exports.definition = {
    set: shorthandSetter('list-style', shorthand_for),
    get: shorthandGetter('list-style', shorthand_for),
    enumerable: true,
    configurable: true
};
