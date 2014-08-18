'use strict';

var parsers = require('../parsers');

module.exports.definition = {
    set: parsers.implicitSetter('margin', '', parsers.isValidLength, parsers.parseLength),
    get: function () {
        return this.getPropertyValue('margin');
    },
    enumerable: true,
    configurable: true
};
