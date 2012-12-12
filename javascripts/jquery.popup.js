// Generated by CoffeeScript 1.4.0
(function() {
  var $, cache_objects, _popup;

  $ = jQuery;

  cache_objects = [];

  _popup = function(self, option) {
    $.extend(this, option);
    this.self = $(self);
    return this;
  };

  _popup.prototype = {
    toggle: function() {
      if (this.self.is(this.except)) {
        return;
      }
      if (!this.self.hasClass('active')) {
        this.show();
        this.self.addClass('active');
      } else {
        this.hide();
        this.self.removeClass('active');
      }
      return this;
    },
    show: function() {
      var offset, temp_offset;
      this.body = this.get_content();
      offset = new util.offset(this.self, this.body, this.offset);
      temp_offset = offset[this.direction]();
      if (this.direction === "auto") {
        this.direction = temp_offset;
        temp_offset = offset[temp_offset]();
      } else {
        temp_offset;

      }
      $('#' + this.arrow_doc_id).addClass(this.direction).css(offset.arrow(this.direction));
      return this.body.css(temp_offset).show();
    },
    hide: function() {
      if (this.is_remove_if_hide) {
        this.body.remove();
      } else {
        this.body.hide();
      }
      return $('#' + this.arrow_doc_id).remove();
    },
    get_content: function() {
      var href, is_remove_if_hide;
      href = this.self.attr('href');
      if (typeof this.content === "function") {
        return this.content();
      } else if (typeof this.content === "object" && (this.content != null)) {
        return this.content;
      } else if ((href != null) && href.length > 1 && href[0] === "#") {
        is_remove_if_hide = true;
        return $(href);
      } else {
        return this.default_content();
      }
    },
    default_content: function() {
      var content, title;
      title = this.self.attr('data-title');
      content = this.self.attr('data-content');
      if (title != null) {
        title = "<div class=\"header\">" + title + "</div>";
      } else {
        title = "";
      }
      content = $("<div style=\"display: none; max-width: " + this.max_width + "\">\n  <div class=\"popup border\">\n    " + title + "\n    <div class=\"body\">\n      " + content + "\n    </div>\n  </div>\n</div>");
      $(document.body).append("<div id=\"" + this.arrow_doc_id + "\" class=\"" + this.arrow_doc_class + "\"></div>");
      content.appendTo(document.body);
      return content;
    }
  };

  $.fn.popup = function(option) {
    var binder;
    option = $.extend({}, $.fn.popup.defaults, option || {});
    binder = option.live ? "live" : "bind";
    return this[binder](option.trigger_name(), function() {
      var p;
      p = $(this).wrapData(option.cache_key_suffix, function() {
        return new _popup(this, option);
      });
      cache_objects.push(p);
      p.toggle();
      return false;
    });
  };

  $.fn.popup.defaults = {
    cache_key_suffix: "popup",
    direction: "auto",
    live: false,
    trigger: "click",
    offset: 0,
    except: '.disabled,:disabled,:animated',
    content: null,
    is_remove_if_hide: true,
    arrow_doc_id: "js-arrow-popup",
    arrow_doc_class: "arrow-popup",
    max_width: "660px",
    trigger_name: function() {
      return this.trigger + "." + this.cache_key_suffix;
    },
    after: {
      show: function() {},
      hide: function() {}
    }
  };

  $.fn.popup.constructor = _popup;

  $(document).on('click', function() {
    $.each(cache_objects, function(index, ele) {
      return ele.toggle();
    });
    return cache_objects = [];
  });

  /*
  $ = jQuery
  
  
  _popup = (self, option) ->
    $.extend(@, option)
    @self = $(self)
    @target = @_target()
    @target.appendTo(document.body)
  
    # bind event
    # binder = if @live then "live" else "bind"
    # @self[binder](@trigger+".popup", (event)=> @toggle(event))
  
    # target old offset
    to_offset = new util.offset(@self, @target, @arrow)
    @to_os = @_target_offset(to_offset)
    @to_os.width = @to_os.w
    @to_os.height = @to_os.h
    @to_os.overflow = 'hidden'
    @to_os.opacity = 0
  
    @
  
  _popup:: =
    toggle: ->
      return false if @target.is(@except) or @target.find('.popup-box').is(@except)
  
      @content = @_content()
      # bind html hide
      $(document).rebind 'click.popup', (event)=> @hide(true)
  
  
      # target new offset(contain content)
      tn_offset = new util.offset(@self, @target, @arrow, @content)
      @tn_os = @_target_offset(tn_offset)
      @tn_os.width = @tn_os.w
      @tn_os.height = @tn_os.h
      @tn_os.opacity = 1
  
      # arrow
      @tn_arrow = tn_offset.arrow(@position)
  
      # is or not target bind date self
      @isself = if @target.data('bind_data')? then @target.data('bind_data').is(@self) else true
      if @target.css('display') is 'none' or !@isself
        @show()
      else
        @hide()
      false
    show: ->
      @after.show.call(@self)
      tc_before = left: 0, top: 0
      tc_after = opacity: 1, top: 0
  
      switch @position
        when "left", "center"
          tc_before.left = @tn_os.width
          tc_after.left = 0
        when "right"
          tc_before.left = -@tn_os.width
          tc_after.left = 0
        when "top"
          tc_before.top = @tn_os.height
          tc_after.top = 0
        when "bottom"
          tc_before.top = -@tn_os.height
          tc_after.top = 0
  
      # is self
      if @isself
        @target.css(@to_os)
        $('.popup-arrow').css(@tn_arrow)
      else
        @hide()
  
      $('.popup-arrow').addClass(@position).show().animate(@tn_arrow)
      @target.show().animate(@tn_os,
        => 
          @target.find('.popup-box').css(tc_before)
          .html(@content.outerHtml()).animate(tc_after,
            => @target.css({overflow: 'visible'})))
  
      @target.data('bind_data', @self)
  
    # flag is or not self
    hide: (flag)->
      # return if @target.css('display') == 'none'
      if flag
        $(document).off 'click.popup'
  
      @after.hide.call(if @isself or flag then @self else @target.data('bind_data'))
      tc = opacity: 0
      switch @position
        when "left", "center"
          tc.left = @tn_os.width
        when "right"
          tc.left = -@tn_os.width
        when "top"
          tc.top = @tn_os.height
        when "bottom"
          tc.top = -@tn_os.height
  
      @target.css({overflow: 'hidden'}).find('.popup-box').animate(tc,
        => 
          if @isself or flag 
            $('.popup-arrow').removeClass(@position).hide()
            @target.animate(@to_os, => @target.hide()))
  
      @target.data('bind_data', null)
  
    _target_offset: (util_offset)->
      t_os = util_offset[@position]()
      # if position is auto to cal 
      if @position is 'auto'
        @position = t_os
        t_os = util_offset[@position]()
      t_os
    _target: ->
      t = $('.popup-box-outer')
      unless t[0]?
        t = $(@template) 
        $(document.body).append('<div class="popup-arrow"></div>')
      t
    _content: ->
      $(@self.attr('href'))
  
  $.fn.popup = (option) ->
    option = $.extend({}, $.fn.popup.defaults, option || {})
    binder = if option.live then "live" else "bind"
    @[binder] option.trigger + ".popup", -> 
      $(@).wrapData('popup', -> new _popup(@, option)).toggle()
  
    @
  
  $.fn.popup.defaults =
    position: "auto" # center left top right bottom
    live: false
    trigger: "click"
    arrow: 20
    duration: 1000
    except: ':animated'
    template: """<div class="popup-box-outer">
        <div class="popup-box"></div>
      </div>
      """
    after: 
      show: -> @addClass('actived')
      hide: -> @removeClass('actived')
  
  
  # bind html hide
  $(document).on 'click.popupouter', '.popup-box-outer',
    (event)-> 
      event.stopPropagation()
  */


}).call(this);
