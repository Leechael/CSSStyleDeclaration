'use strict';


var VALID_LIST_STYLE_POSITIONS = ['inside', 'outside', 'inherit'];

module.exports.isValid = function isValid(v) {
    return VALID_LIST_STYLE_POSITIONS.indexOf(v.toLowerCase()) !== -1;
};

module.exports.definition = {
    set: function (v) {
        this.setProperty('list-style-position', v);
    },
    get: function () {
        return this.getPropertyValue('list-style-position');
    },
    enumerable: true,
    configurable: true
};
