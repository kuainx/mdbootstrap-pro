"use strict";

var WOW;

(function ($) {
  WOW = function WOW() {
    return {
      init: function init() {
        var animationName = [];
        var $selector = $('.wow');
        var defaultOffset = 100;
        var once = 1;

        function mdbWow() {
          var windowHeight = window.innerHeight;
          var scroll = window.scrollY;
          $selector.each(function () {
            var $this = $(this);
            var index = $this.index('.wow');
            var iteration = $this.data('wow-iteration');
            var duration = $this.data('wow-duration');
            var delay = $this.data('wow-delay');
            var removeTime = $this.css('animation-duration').slice(0, -1) * 1000;

            if ($this.css('visibility') === 'visible') {
              return;
            }

            if (windowHeight + scroll - defaultOffset > getOffset(this) && scroll < getOffset(this) || windowHeight + scroll - defaultOffset > getOffset(this) + $this.height() && scroll < getOffset(this) + $this.height() || windowHeight + scroll === $(document).height() && getOffset(this) + defaultOffset > $(document).height()) {
              if (delay) {
                delay = $this.data('wow-delay').slice(0, -1);
                removeTime += $this.data('wow-delay') ? $this.data('wow-delay').slice(0, -1) * 1000 : false;
              }

              if (duration) {
                duration = $this.data('wow-duration').slice(0, -1);
                removeTime = $this.css('animation-duration').slice(0, -1) * 1000 + $this.data('wow-duration').slice(0, -1) * 1000;
              }

              setTimeout(function () {
                return $this.removeClass('animated');
              }, removeTime);
              $this.addClass('animated');
              $this.css({
                visibility: 'visible',
                'animation-name': animationName[index],
                'animation-iteration-count': iteration ? iteration : 1,
                'animation-duration': duration ? duration : false,
                'animation-delay': delay ? "".concat(delay, "s") : false
              });
            }
          });
        }

        function appear() {
          $selector.each(function () {
            var $this = $(this);
            var index = $this.index('.wow');
            var iteration = $this.data('wow-iteration');
            var duration = $this.data('wow-duration');
            var delay = $this.data('wow-delay');
            delay = delay ? $this.data('wow-delay').slice(0, -1) : false;
            $this.addClass('animated');
            $this.css({
              visibility: 'visible',
              'animation-name': animationName[index],
              'animation-iteration-count': iteration ? iteration : 1,
              'animation-duration': duration ? duration : false,
              'animation-delay': delay ? "".concat(delay, "s") : false
            });
          });
        }

        function hide() {
          var windowHeight = window.innerHeight;
          var scroll = window.scrollY;
          $('.wow.animated').each(function () {
            var $this = $(this);

            if (windowHeight + scroll - defaultOffset > getOffset(this) && scroll > getOffset(this) + defaultOffset || windowHeight + scroll - defaultOffset < getOffset(this) && scroll < getOffset(this) + defaultOffset || getOffset(this) + $this.height > $(document).height() - defaultOffset) {
              $this.removeClass('animated');
              $this.css({
                'animation-name': 'none',
                visibility: 'hidden'
              });
            }
          });
          mdbWow();
          once--;
        }

        function getOffset(elem) {
          var box = elem.getBoundingClientRect();
          var body = document.body;
          var docEl = document.documentElement;
          var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
          var clientTop = docEl.clientTop || body.clientTop || 0;
          var top = box.top + scrollTop - clientTop;
          return Math.round(top);
        }

        $selector.each(function () {
          var $this = $(this);
          animationName[$this.index('.wow')] = $this.css('animation-name');
          $this.css({
            visibility: 'hidden',
            'animation-name': 'none'
          });
        });
        $(window).scroll(function () {
          return once ? hide() : mdbWow();
        });
        appear();
      }
    };
  };

  return WOW;
})(jQuery);