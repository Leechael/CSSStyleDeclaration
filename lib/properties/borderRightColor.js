'use strict';

var utils = require('../utils').color;

module.exports.isValid = utils.valid;

module.exports.definition = {
    set: function (v) {
        if (utils.valid(v)) {
            this.setProperty('border-right-color', v);
        }
    },
    get: function () {
        return this.getPropertyValue('border-right-color');
    },
    enumerable: true,
    configurable: true
};
