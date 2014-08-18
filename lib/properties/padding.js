'use strict';

var parsers = require('../parsers');

module.exports.definition = {
    set: parsers.implicitSetter('padding', '', parsers.isValidLength, parsers.parseLength),
    get: function () {
        return this.getPropertyValue('padding');
    },
    enumerable: true,
    configurable: true
};
