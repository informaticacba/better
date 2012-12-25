// Generated by CoffeeScript 1.4.0
(function() {
  var $, get_tip, _tip;

  $ = jQuery;

  get_tip = function(_self, option) {
    return $(_self).wrapData(option.cache_key_suffix, function() {
      return new _tip(_self, option);
    });
  };

  _tip = function(_self, option) {
    $.extend(this, option);
    this.self = $(_self);
    return this;
  };

  _tip.prototype = $.extend({}, $.fn.popup.constructor.prototype, {
    get_content: function() {
      var content, title;
      title = this.self.attr('data-title');
      content = $("<div style=\"display: none; max-width: " + this.max_width + "\">\n  <div class=\"tip\">\n    " + title + "\n  </div>\n</div>");
      return content;
    }
  });

  $.fn.tip = function(option) {
    var binder, eventin, eventout;
    option = $.extend({}, $.fn.tip.defaults, option || {});
    binder = option.live ? "live" : "bind";
    eventin = option.trigger === "hover" ? "mouseenter" : "foucs";
    eventout = option.trigger === "hover" ? "mouseleave" : "blur";
    if (option.trigger.indexOf("click" === !-1)) {
      this[binder](option.trigger_name(), function() {
        get_tip(this, option).toggle();
        return false;
      });
    } else {
      this[binder](eventin, function() {
        get_tip(this, option).toggle();
        return false;
      })[binder](eventout, function() {
        get_tip(this, option).toggle();
        return false;
      });
    }
    return this;
  };

  $.fn.tip.defaults = $.extend({}, $.fn.popup.defaults, {
    cache_key_suffix: "tip",
    offset: 8,
    is_remove_if_hide: true,
    trigger: "hover",
    arrow_doc_class: "arrow-tip",
    max_width: "260px"
  });

}).call(this);
