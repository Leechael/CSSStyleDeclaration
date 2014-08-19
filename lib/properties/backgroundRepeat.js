'use strict';

var parsers = require('../parsers');

var parse = function parse(v) {
    if (v && parsers.valueType(v) === parsers.TYPES.KEYWORD) {
        v = v.toLowerCase();
        if (v === 'repeat' || v === 'repeat-x' || v === 'repeat-y' || v === 'no-repeat' || v === 'inherit') {
            return v;
        }
    }
    return undefined;
};

module.exports.isValid = function isValid(v) {
    return parse(v) !== undefined;
};

module.exports.definition = {
    set: function (v) {
        this.setProperty('background-repeat', parse(v));
    },
    get: function () {
        return this.getPropertyValue('background-repeat');
    },
    enumerable: true,
    configurable: true
};
