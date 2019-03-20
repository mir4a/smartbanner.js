function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import OptionParser from './optionparser.js';
import Detector from './detector.js';
import Bakery from './bakery.js';
var DEFAULT_PLATFORMS = 'android,ios';
var datas = {
  originalTop: 'data-smartbanner-original-top',
  originalMarginTop: 'data-smartbanner-original-margin-top'
};

function handleExitClick(event, self) {
  self.exit();
  event.preventDefault();
}

function handleJQueryMobilePageLoad(event) {
  if (!this.positioningDisabled) {
    setContentPosition(event.data.height);
  }
}

function addEventListeners(self) {
  var closeIcon = document.querySelector('.js_smartbanner__exit');
  closeIcon.addEventListener('click', function (event) {
    return handleExitClick(event, self);
  });

  if (Detector.jQueryMobilePage()) {
    $(document).on('pagebeforeshow', self, handleJQueryMobilePageLoad);
  }
}

function removeEventListeners() {
  if (Detector.jQueryMobilePage()) {
    $(document).off('pagebeforeshow', handleJQueryMobilePageLoad);
  }
}

function setContentPosition(value) {
  var wrappers = Detector.wrapperElement();

  for (var i = 0, l = wrappers.length, wrapper; i < l; i++) {
    wrapper = wrappers[i];

    if (Detector.jQueryMobilePage()) {
      if (wrapper.getAttribute(datas.originalTop)) {
        continue;
      }

      var top = parseFloat(getComputedStyle(wrapper).top);
      wrapper.setAttribute(datas.originalTop, isNaN(top) ? 0 : top);
      wrapper.style.top = value + 'px';
    } else {
      if (wrapper.getAttribute(datas.originalMarginTop)) {
        continue;
      }

      var margin = parseFloat(getComputedStyle(wrapper).marginTop);
      wrapper.setAttribute(datas.originalMarginTop, isNaN(margin) ? 0 : margin);
      wrapper.style.marginTop = value + 'px';
    }
  }
}

function restoreContentPosition() {
  var wrappers = Detector.wrapperElement();

  for (var i = 0, l = wrappers.length, wrapper; i < l; i++) {
    wrapper = wrappers[i];

    if (Detector.jQueryMobilePage() && wrapper.getAttribute(datas.originalTop)) {
      wrapper.style.top = wrapper.getAttribute(datas.originalTop) + 'px';
    } else if (wrapper.getAttribute(datas.originalMarginTop)) {
      wrapper.style.marginTop = wrapper.getAttribute(datas.originalMarginTop) + 'px';
    }
  }
}

var SmartBanner =
/*#__PURE__*/
function () {
  function SmartBanner() {
    _classCallCheck(this, SmartBanner);

    var parser = new OptionParser();
    this.options = parser.parse();
    this.platform = Detector.platform();
  } // DEPRECATED. Will be removed.


  _createClass(SmartBanner, [{
    key: "publish",
    value: function publish() {
      if (Object.keys(this.options).length === 0) {
        throw new Error('No options detected. Please consult documentation.');
      }

      if (Bakery.baked) {
        return false;
      } // User Agent was explicetely excluded by defined excludeUserAgentRegex


      if (this.userAgentExcluded) {
        return false;
      } // User agent was neither included by platformEnabled,
      // nor by defined includeUserAgentRegex


      if (!(this.platformEnabled || this.userAgentIncluded)) {
        return false;
      }

      var bannerDiv = document.createElement('div');
      document.querySelector('body').appendChild(bannerDiv);
      bannerDiv.outerHTML = this.html;

      if (!this.positioningDisabled) {
        setContentPosition(this.height);
      }

      addEventListeners(this);
    }
  }, {
    key: "exit",
    value: function exit() {
      removeEventListeners();

      if (!this.positioningDisabled) {
        restoreContentPosition();
      }

      var banner = document.querySelector('.js_smartbanner');
      document.querySelector('body').removeChild(banner);
      Bakery.bake(this.hideTtl, this.hidePath);
    }
  }, {
    key: "originalTop",
    get: function get() {
      var wrapper = Detector.wrapperElement()[0];
      return parseFloat(wrapper.getAttribute(datas.originalTop));
    } // DEPRECATED. Will be removed.

  }, {
    key: "originalTopMargin",
    get: function get() {
      var wrapper = Detector.wrapperElement()[0];
      return parseFloat(wrapper.getAttribute(datas.originalMarginTop));
    }
  }, {
    key: "priceSuffix",
    get: function get() {
      if (this.platform === 'ios') {
        return this.options.priceSuffixApple;
      } else if (this.platform === 'android') {
        return this.options.priceSuffixGoogle;
      }

      return '';
    }
  }, {
    key: "icon",
    get: function get() {
      if (this.platform === 'android') {
        return this.options.iconGoogle;
      } else {
        return this.options.iconApple;
      }
    }
  }, {
    key: "buttonUrl",
    get: function get() {
      if (this.platform === 'android') {
        return this.options.buttonUrlGoogle;
      } else if (this.platform === 'ios') {
        return this.options.buttonUrlApple;
      }

      return '#';
    }
  }, {
    key: "html",
    get: function get() {
      var modifier = !this.options.customDesignModifier ? this.platform : this.options.customDesignModifier;
      return "<div class=\"smartbanner smartbanner--".concat(modifier, " js_smartbanner\">\n      <a href=\"javascript:void();\" class=\"smartbanner__exit js_smartbanner__exit\"></a>\n      <div class=\"smartbanner__icon\" style=\"background-image: url(").concat(this.icon, ");\"></div>\n      <div class=\"smartbanner__info\">\n        <div>\n          <div class=\"smartbanner__info__title\">").concat(this.options.title, "</div>\n          <div class=\"smartbanner__info__author\">").concat(this.options.author, "</div>\n          <div class=\"smartbanner__info__price\">").concat(this.options.price).concat(this.priceSuffix, "</div>\n        </div>\n      </div>\n      <a href=\"").concat(this.buttonUrl, "\" target=\"_blank\" class=\"smartbanner__button\"><span class=\"smartbanner__button__label\">").concat(this.options.button, "</span></a>\n    </div>");
    }
  }, {
    key: "height",
    get: function get() {
      var height = document.querySelector('.js_smartbanner').offsetHeight;
      return height !== undefined ? height : 0;
    }
  }, {
    key: "platformEnabled",
    get: function get() {
      var enabledPlatforms = this.options.enabledPlatforms || DEFAULT_PLATFORMS;
      return enabledPlatforms && enabledPlatforms.replace(/\s+/g, '').split(',').indexOf(this.platform) !== -1;
    }
  }, {
    key: "positioningDisabled",
    get: function get() {
      return this.options.disablePositioning === 'true';
    }
  }, {
    key: "userAgentExcluded",
    get: function get() {
      if (!this.options.excludeUserAgentRegex) {
        return false;
      }

      return Detector.userAgentMatchesRegex(this.options.excludeUserAgentRegex);
    }
  }, {
    key: "userAgentIncluded",
    get: function get() {
      if (!this.options.includeUserAgentRegex) {
        return false;
      }

      return Detector.userAgentMatchesRegex(this.options.includeUserAgentRegex);
    }
  }, {
    key: "hideTtl",
    get: function get() {
      return this.options.hideTtl ? parseInt(this.options.hideTtl) : false;
    }
  }, {
    key: "hidePath",
    get: function get() {
      return this.options.hidePath ? this.options.hidePath : '/';
    }
  }]);

  return SmartBanner;
}();

export { SmartBanner as default };