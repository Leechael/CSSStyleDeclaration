'use strict';

var shorthandParser = require('../parsers').shorthandParser;

var shorthand_for = {
    'border-right-width': require('./borderRightWidth'),
    'border-right-style': require('./borderRightStyle'),
    'border-right-color': require('./borderRightColor')
};

var isValid = module.exports.isValid = function isValid(v) {
    return shorthandParser(v, shorthand_for) !== undefined;
};

module.exports.definition = {
    set: function (v) {
        var obj = shorthandParser(v, shorthand_for);
        if (obj === undefined) {
            return;
        }
        Object.keys(obj).forEach(function (property) {
            this._values[property] = obj[property];
        }, this);
        this.setProperty('border-right', v);
    },
    get: function () {
        return this.getPropertyValue('border-right');
    },
    enumerable: true,
    configurable: true
};
