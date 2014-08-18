'use strict';

var shorthandParser = require('../parsers').shorthandParser;

var shorthand_for = {
    'border-left-width': require('./borderLeftWidth'),
    'border-left-style': require('./borderLeftStyle'),
    'border-left-color': require('./borderLeftColor')
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
        this.setProperty('border-left', v);
    },
    get: function () {
        return this.getPropertyValue('border-left');
    },
    enumerable: true,
    configurable: true
};
