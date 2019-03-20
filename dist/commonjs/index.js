"use strict";

var _smartbanner = _interopRequireDefault(require("./smartbanner.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var smartbanner;
window.addEventListener('load', function () {
  smartbanner = new _smartbanner.default();
  smartbanner.publish();
});