'use strict';

var LIST_STYLE_TYPES = ['disc', 'circle', 'square', 'decimal', 'decimal-leading-zero', 'lower-roman', 'upper-roman', 'lower-greek', 'lower-latin', 'upper-latin', 'armenian', 'georgian', 'lower-alpha', 'upper-alpha', 'none', 'inherit'];

module.exports.isValid = function isValid(v) {
    return LIST_STYLE_TYPES.indexOf(v.toLowerCase()) !== -1;
};

module.exports.definition = {
    set: function (v) {
        this.setProperty('list-style-type', v);
    },
    get: function () {
        return this.getPropertyValue('list-style-type');
    },
    enumerable: true,
    configurable: true
};
