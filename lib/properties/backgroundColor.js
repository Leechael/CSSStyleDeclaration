'use strict';

var utils = require('../utils').color;

module.exports.isValid = utils.valid;

module.exports.definition = {
    set: function (v) {
        var parsed = utils.parse(v);
        if (parsed === undefined) {
            return;
        }
        this.setProperty('background-color', parsed);
    },
    get: function () {
        return this.getPropertyValue('background-color');
    },
    enumerable: true,
    configurable: true
};
