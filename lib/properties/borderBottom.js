'use strict';

var shorthandParser = require('../parsers').shorthandParser;

var shorthand_for = {
    'border-bottom-width': require('./borderBottomWidth'),
    'border-bottom-style': require('./borderBottomStyle'),
    'border-bottom-color': require('./borderBottomColor')
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
        this.setProperty('border-bottom', v);
    },
    get: function () {
        return this.getPropertyValue('border-bottom');
    },
    enumerable: true,
    configurable: true
};
