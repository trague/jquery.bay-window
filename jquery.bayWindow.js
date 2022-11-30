/*!
 * jquery.bayWindow 0.0.1 (https://github.com/trague/jquery.bayWindow)
 * Author: zhao wenZheng
 *
 * Licensed under MIT (https://github.com/craftpip/jquery-confirm/blob/master/LICENSE)
 */

// requestAnimationFrame polyfill
(function () {
  "use strict";

  // ie <= 8
  if (!Date.now)
    Date.now = function () {
      return new Date().getTime();
    };

  // ie <= 9
  var vendors = ["webkit", "moz"];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vp + "CancelAnimationFrame"] ||
      window[vp + "CancelRequestAnimationFrame"];
  }
  if (
    /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
    !window.requestAnimationFrame ||
    !window.cancelAnimationFrame
  ) {
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
      var now = Date.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function () {
        callback((lastTime = nextTime));
      }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
})();

(function (factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    // CommonJS
    factory(require("jquery"));
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  var BAY_WINDOW_DATA_KEY = "bayWindow";
  // ie <= 9, 是否兼容transform
  var SUPPORT_TRANSFORM = "transform" in document.documentElement.style;

  $.extend({
    /**
     * 创建飘窗html元素，因为飘窗插件本身并不依赖此方法，所以独立出静态方法
     * @param {} options 同 settings
     * @returns $bayWindow
     */
    createBayWindowElement: function (options) {
      var settings = {
        id: "jsBayWindow", // 元素ID
        height: "130px", // 高度
        width: "230px", // 宽度
        src: "", // 图片src
        href: "", // 跳转链接
      };
      $.extend(settings, options || {});
      // prettier-ignore
      var imageWrapStyle = "display: block; height: " + settings.height + "; width: " + settings.width + ";";
      // prettier-ignore
      var html = [
        '<div id="' + settings.id + '" style="position: fixed; ">',
        '  <a href="' + settings.href + '" style="' + imageWrapStyle + '">',
        '    <img src="' + settings.src +'" style="display: block; height: 100%; width: 100%" />',
        '  </a>',
        '  <a class="jsBayWindowClose" href="javascript:;" style="display: block; width: 36px; text-align: center; margin-left: auto; font-size: 12px;color: #000;background-color: #fff;line-height: 20px;">关闭</a>',
        '</div>',
      ].join("");

      var $bayWindow = $(html);
      $("body").append($bayWindow);
      $bayWindow.find(".jsBayWindowClose").on("click", function () {
        var bayWindow = $bayWindow.data(BAY_WINDOW_DATA_KEY);
        if (bayWindow) {
          bayWindow.destroy();
        }
      });
      return $bayWindow;
    },
  });

  /**
   * 飘窗类
   * @param {*} element dom元素
   * @param {*} options 同BayWindow.DEFAULTS
   */
  var BayWindow = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, BayWindow.DEFAULTS, options);
    this.isToLeft = false; // 是否向左运动
    this.isToTop = false; // 是否向上运动
    // this.stepLength = 1; // 每次移动距离
    this.timeoutId; // setTimout返回值
    this.top = this.options.startTop; // css top
    this.left = this.options.startLeft; // css left
    this.lastTime = 0;

    this.$element.css({
      position: "fixed",
      top: SUPPORT_TRANSFORM ? 0 : this.top,
      left: SUPPORT_TRANSFORM ? 0 : this.left,
      cursor: "pointer",
      transform: SUPPORT_TRANSFORM
        ? "translate(" + this.left + "px," + this.top + "px)"
        : "",
      zIndex: this.options.zIndex,
    });

    this.$element.hover(this.stop.bind(this), this.run.bind(this));
  };

  BayWindow.DEFAULTS = {
    // speed: 16.7, // 运动间隔时
    stepLength: 1, // 每16.7ms移动的距离
    startTop: 10000, // x轴起始坐标， 默认从底部向上运动
    startLeft: 0, // y轴起始坐标
    zIndex: 10, // css z-index
  };

  BayWindow.prototype._nextStep = function (stepLength) {
    stepLength = stepLength || 1;
    var winWidth = $(window).width() - this.$element.width() - 10;
    var winHeight = $(window).height() - this.$element.height() - 10;

    // 向左运动，要减小left值
    this.left += (this.isToLeft ? -1 : 1) * stepLength;
    if (this.left >= winWidth) {
      this.left = winWidth;
      this.isToLeft = true;
    } else if (this.left <= 0) {
      this.left = 0;
      this.isToLeft = false;
    }

    // 向上运动，要减小top值
    this.top += (this.isToTop ? -1 : 1) * stepLength;
    if (this.top >= winHeight) {
      this.top = winHeight;
      this.isToTop = true;
    } else if (this.top <= 0) {
      this.top = 0;
      this.isToTop = false;
    }
    
    if (SUPPORT_TRANSFORM) {
      this.$element.css({
        transform: "translate(" + this.left + "px," + this.top + "px)",
      });
    } else {
      this.$element.css({
        left: this.left,
        top: this.top,
      });
    }
  };

  BayWindow.prototype.run = function (e) {
    var stepLength = this.options.stepLength;
    var timeSpace = e - this.lastTime;
    this.lastTime = e;

    // 小于16，说明是高刷屏，按倍数计算
    // 大于16，即使大很多，也按16.7计算
    if (timeSpace && timeSpace < 16) {
      stepLength = ((timeSpace / 16.7) * stepLength).toFixed(2);
    }
    this._nextStep(stepLength);
    this.timeoutId = requestAnimationFrame(this.run.bind(this));
  };

  /**
   * 停止运动
   */
  BayWindow.prototype.stop = function () {
    cancelAnimationFrame(this.timeoutId);
  };

  /**
   * 停止运动，删除元素
   */
  BayWindow.prototype.destroy = function () {
    this.stop();
    this.$element.remove();
  };

  /**
   *
   * @param {string | options} option string: BayWindow的方法名 | BayWindow.DEFAULTS
   * @returns this
   */
  $.fn.bayWindow = function (option) {
    if (!option) {
      option = {};
    }
    return this.each(function () {
      var $this = $(this);
      var data = $this.data(BAY_WINDOW_DATA_KEY);
      var options = typeof option === "object" ? option : {};
      var method = typeof option === "string" ? option : "run";

      if (data) data.stop();
      data = new BayWindow(this, options);
      $this.data(BAY_WINDOW_DATA_KEY, data);
      data[method]();
    });
  };
});
