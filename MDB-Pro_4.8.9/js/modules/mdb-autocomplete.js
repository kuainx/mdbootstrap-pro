"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function ($) {
  var inputData = {};
  var dataColor = '';
  var buttonCloseColor = '';
  var buttonCloseBlurColor = '#ced4da';
  var inputFocus = '1px solid #4285f4';
  var inputBlur = '1px solid #ced4da';
  var inputFocusShadow = '0 1px 0 0 #4285f4';
  var inputBlurShadow = '';
  var enterCharCode = 13;
  var arrowUpCharCode = 38;
  var arrowDownCharCode = 40;
  var count = -1;
  var nextScrollHeight = -45;

  var mdbAutocomplete =
  /*#__PURE__*/
  function () {
    function mdbAutocomplete(input, options) {
      _classCallCheck(this, mdbAutocomplete);

      this.defaults = {
        data: inputData,
        dataColor: dataColor,
        closeColor: buttonCloseColor,
        closeBlurColor: buttonCloseBlurColor,
        inputFocus: inputFocus,
        inputBlur: inputBlur,
        inputFocusShadow: inputFocusShadow,
        inputBlurShadow: inputBlurShadow
      };
      this.$input = input;
      this.options = this.assignOptions(options);
      this.$clearButton = $('.mdb-autocomplete-clear');
      this.$autocompleteWrap = $('<ul class="mdb-autocomplete-wrap"></ul>');
      this.init();
    }

    _createClass(mdbAutocomplete, [{
      key: "init",
      value: function init() {
        this.setData();
        this.inputFocus();
        this.inputBlur();
        this.inputKeyupData();
        this.inputLiClick();
        this.clearAutocomplete();
      }
    }, {
      key: "assignOptions",
      value: function assignOptions(options) {
        return $.extend({}, this.defaults, options);
      }
    }, {
      key: "setData",
      value: function setData() {
        if (Object.keys(this.options.data).length) {
          this.$autocompleteWrap.insertAfter(this.$input);
        }
      }
    }, {
      key: "inputFocus",
      value: function inputFocus() {
        var _this = this;

        this.$input.on('focus', function () {
          _this.$input.css('border-bottom', _this.options.inputFocus);

          _this.$input.css('box-shadow', _this.options.inputFocusShadow);
        });
      }
    }, {
      key: "inputBlur",
      value: function inputBlur() {
        var _this2 = this;

        this.$input.on('blur', function () {
          _this2.$input.css('border-bottom', _this2.options.inputBlur);

          _this2.$input.css('box-shadow', _this2.options.inputBlurShadow);
        });
      }
    }, {
      key: "inputKeyupData",
      value: function inputKeyupData() {
        var _this3 = this;

        this.$input.on('keyup', function (e) {
          if (e.which === enterCharCode) {
            if (!_this3.options.data.includes(_this3.$input.val())) {
              _this3.options.data.push(_this3.$input.val());
            }

            _this3.$autocompleteWrap.find('.selected').trigger('click');

            _this3.$autocompleteWrap.empty();

            _this3.inputBlur();

            count = -1;
            nextScrollHeight = -45;
            return count;
          }

          var $inputValue = _this3.$input.val();

          _this3.$autocompleteWrap.empty();

          if ($inputValue.length) {
            for (var item in _this3.options.data) {
              if (_this3.options.data[item].toLowerCase().indexOf($inputValue.toLowerCase()) !== -1) {
                var option = $("<li>".concat(_this3.options.data[item], "</li>"));

                _this3.$autocompleteWrap.append(option);
              }
            }

            var $ulList = _this3.$autocompleteWrap;

            var $ulItems = _this3.$autocompleteWrap.find('li');

            var nextItemHeight = $ulItems.eq(count).outerHeight();
            var previousItemHeight = $ulItems.eq(count - 1).outerHeight();

            if (e.which === arrowDownCharCode) {
              if (count > $ulItems.length - 2) {
                count = -1;
                $ulItems.scrollTop(0);
                nextScrollHeight = -45;
                return;
              } else {
                count++;
              }

              nextScrollHeight += nextItemHeight;
              $ulList.scrollTop(nextScrollHeight);
              $ulItems.eq(count).addClass('selected');
            } else if (e.which === arrowUpCharCode) {
              if (count < 1) {
                count = $ulItems.length;
                $ulList.scrollTop($ulList.prop('scrollHeight'));
                nextScrollHeight = $ulList.prop('scrollHeight') - nextItemHeight;
              } else {
                count--;
              }

              nextScrollHeight -= previousItemHeight;
              $ulList.scrollTop(nextScrollHeight);
              $ulItems.eq(count).addClass('selected');
            }

            if ($inputValue.length === 0) {
              _this3.$clearButton.css('visibility', 'hidden');
            } else {
              _this3.$clearButton.css('visibility', 'visible');
            }

            _this3.$autocompleteWrap.children().css('color', _this3.options.dataColor);
          } else {
            _this3.$clearButton.css('visibility', 'hidden');
          }
        });
      }
    }, {
      key: "inputLiClick",
      value: function inputLiClick() {
        var _this4 = this;

        this.$autocompleteWrap.on('click', 'li', function (e) {
          e.preventDefault();

          _this4.$input.val($(e.target).text());

          _this4.$autocompleteWrap.empty();
        });
      }
    }, {
      key: "clearAutocomplete",
      value: function clearAutocomplete() {
        var _this5 = this;

        this.$clearButton.on('click', function (e) {
          count = -1;
          nextScrollHeight = -45;
          e.preventDefault();
          var $this = $(e.currentTarget);
          $this.parent().find('.mdb-autocomplete').val('');
          $this.css('visibility', 'hidden');

          _this5.$autocompleteWrap.empty();

          $this.parent().find('label').removeClass('active');
        });
      }
    }, {
      key: "changeSVGcolors",
      value: function changeSVGcolors() {
        var _this6 = this;

        if (this.$input.hasClass('mdb-autocomplete')) {
          this.$input.on('click keyup', function (e) {
            e.preventDefault();
            $(e.target).parent().find('.mdb-autocomplete-clear').find('svg').css('fill', _this6.options.closeColor);
          });
          this.$input.on('blur', function (e) {
            e.preventDefault();
            $(e.target).parent().find('.mdb-autocomplete-clear').find('svg').css('fill', _this6.options.closeBlurColor);
          });
        }
      }
    }]);

    return mdbAutocomplete;
  }();

  $.fn.mdbAutocomplete = function (options) {
    return this.each(function () {
      new mdbAutocomplete($(this), options);
    });
  };
})(jQuery);