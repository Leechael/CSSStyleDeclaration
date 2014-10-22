'use strict';

var utils = require('../utils').color;
var implicitSetter = require('../parsers').implicitSetter;

module.exports.isValid = utils.valid;

module.exports.definition = {
    set: implicitSetter('border', 'color', utils.valid, utils.parse),
    get: function () {
        return this.getPropertyValue('border-color');
    },
    enumerable: true,
    configurable: true
};
