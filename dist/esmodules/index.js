import SmartBanner from './smartbanner.js';
var smartbanner;
window.addEventListener('load', function () {
  smartbanner = new SmartBanner();
  smartbanner.publish();
});