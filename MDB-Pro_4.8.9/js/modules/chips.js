"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function ($) {
  $(document).on('click', '.chip .close', function () {
    var $this = $(this);

    if ($this.closest('.chips').data('initialized')) {
      return;
    }

    $this.closest('.chip').remove();
  });

  var MaterialChip =
  /*#__PURE__*/
  function () {
    function MaterialChip(chips, options) {
      _classCallCheck(this, MaterialChip);

      this.chips = chips;
      this.$document = $(document);
      this.options = options;
      this.eventsHandled = false;
      this.ulWrapper = $('<ul class="chip-ul z-depth-1" tabindex="0"></ul>');
      this.defaultOptions = {
        data: [],
        dataChip: [],
        placeholder: '',
        secondaryPlaceholder: ''
      };
      this.selectors = {
        chips: '.chips',
        chip: '.chip',
        input: 'input',
        delete: '.fas',
        selectedChip: '.selected'
      };
      this.keyCodes = {
        enter: 13,
        backspace: 8,
        delete: 46,
        arrowLeft: 37,
        arrowRight: 39,
        comma: 188
      };
      this.init();
    }

    _createClass(MaterialChip, [{
      key: "init",
      value: function init() {
        var _this = this;

        this.optionsDataStatement();
        this.assignOptions();
        this.chips.each(function (index, element) {
          var $this = $(element);

          if ($this.data('initialized')) {
            return;
          }

          var options = $this.data('options');

          if (!options.data || !Array.isArray(options.data)) {
            options.data = [];
          }

          $this.data('chips', options.data);
          $this.data('index', index);
          $this.data('initialized', true);
          $this.attr('tabindex', 0);

          if (!$this.hasClass(_this.selectors.chips)) {
            $this.addClass('chips');
          }

          _this.renderChips($this);
        });

        if (!this.eventsHandled) {
          this.handleEvents();
          this.eventsHandled = true;
        }

        return this;
      }
    }, {
      key: "optionsDataStatement",
      value: function optionsDataStatement() {
        if (this.options === 'data') {
          return this.chips.data('chips');
        }

        if (this.options === 'options') {
          return this.chips.data('options');
        }

        return true;
      }
    }, {
      key: "assignOptions",
      value: function assignOptions() {
        this.chips.data('options', $.extend({}, this.defaultOptions, this.options));
      }
    }, {
      key: "handleEvents",
      value: function handleEvents() {
        this.handleSelecorChips();
        this.handleBlurInput();
        this.handleSelectorChip();
        this.handleDocumentKeyDown();
        this.handleDocumentFocusIn();
        this.handleDocumentFocusOut();
        this.handleDocumentKeyDownChipsInput();
        this.handleDocumentClickChipsDelete();
        this.inputKeyDown();
        this.renderedLiClick();
        this.dynamicInputChanges();
      }
    }, {
      key: "handleSelecorChips",
      value: function handleSelecorChips() {
        var _this2 = this;

        this.$document.on('click', this.selectors.chips, function (e) {
          return $(e.target).find(_this2.selectors.input).focus().addClass('active');
        });
      }
    }, {
      key: "handleBlurInput",
      value: function handleBlurInput() {
        var _this3 = this;

        this.$document.on('blur', this.selectors.chips, function (e) {
          setTimeout(function () {
            return _this3.ulWrapper.removeClass('active').hide();
          }, 100);
          $(e.target).removeClass('active');
          $('.chip.selected').removeClass('selected');
        });
      }
    }, {
      key: "handleSelectorChip",
      value: function handleSelectorChip() {
        this.chips.on('click', '.chip', function () {
          $('.chip.selected').not(this).removeClass('selected');
          $(this).toggleClass('selected');
        });
      }
    }, {
      key: "handleDocumentKeyDown",
      value: function handleDocumentKeyDown() {
        var _this4 = this;

        this.chips.on('keydown', function (e) {
          var $selectedChip = _this4.$document.find(_this4.selectors.chip + _this4.selectors.selectedChip);

          var $chipsWrapper = $selectedChip.closest(_this4.selectors.chips);
          var siblingsLength = $selectedChip.siblings(_this4.selectors.chip).length;

          if (!$selectedChip.length) {
            return;
          }

          var backspacePressed = e.which === _this4.keyCodes.backspace;
          var deletePressed = e.which === _this4.keyCodes.delete;
          var leftArrowPressed = e.which === _this4.keyCodes.arrowLeft;
          var rightArrowPressed = e.which === _this4.keyCodes.arrowRight;

          if (backspacePressed || deletePressed) {
            e.preventDefault();

            _this4.deleteSelectedChip($chipsWrapper, $selectedChip, siblingsLength);
          } else if (leftArrowPressed) {
            _this4.selectLeftChip($chipsWrapper, $selectedChip);
          } else if (rightArrowPressed) {
            _this4.selectRightChip($chipsWrapper, $selectedChip, siblingsLength);
          }
        });
      }
    }, {
      key: "handleDocumentFocusIn",
      value: function handleDocumentFocusIn() {
        var _this5 = this;

        var $chipsInput;
        var $chips = this.chips;

        if ($chips.hasClass('chips-autocomplete')) {
          $chipsInput = $chips.children().children('input');
        } else {
          $chipsInput = $chips.children('input');
        }

        $chipsInput.on('click', function (e) {
          var $target = $(e.target);
          $target.closest(_this5.selectors.chips).addClass('focus');
          $(_this5.selectors.chip).removeClass('selected');
          $target.addClass('active');
        });
      }
    }, {
      key: "handleDocumentFocusOut",
      value: function handleDocumentFocusOut() {
        var _this6 = this;

        this.chips.on('focusout', 'input', function (e) {
          return $(e.target).closest(_this6.selectors.chips).removeClass('focus');
        });
      }
    }, {
      key: "handleDocumentKeyDownChipsInput",
      value: function handleDocumentKeyDownChipsInput() {
        var _this7 = this;

        this.chips.on('keydown', 'input', function (e) {
          var $target = $(e.target);
          var $chips = _this7.chips;
          var $chipsWrapper = $target.closest(_this7.selectors.chips);
          var chipsIndex = $chipsWrapper.data('index');
          var chipsLength = $chipsWrapper.children(_this7.selectors.chip).length;
          var enterPressed = e.which === _this7.keyCodes.enter;
          var commaPressed = e.which === _this7.keyCodes.comma;
          var leftArrowPressed = e.which === _this7.keyCodes.arrowLeft;
          var backspacePressed = e.which === _this7.keyCodes.backspace;

          if ((enterPressed || commaPressed) && !_this7.ulWrapper.find('li').hasClass('selected')) {
            e.preventDefault();

            _this7.addChip(chipsIndex, {
              tag: $target.val()
            }, $chipsWrapper);

            $target.val('');
            return;
          }

          var leftArrowOrDeletePressed = e.keyCode === _this7.keyCodes.arrowLeft || e.keyCode === _this7.keyCodes.delete;
          var isValueEmpty = $target.val() === '';

          if (leftArrowOrDeletePressed && isValueEmpty && chipsLength) {
            _this7.selectChip(chipsIndex, chipsLength - 1, $chipsWrapper);
          }

          if (isValueEmpty && $(_this7.selectors.input).hasClass('active')) {
            if (leftArrowPressed) {
              _this7.selectChip(chipsIndex, chipsLength - 1, $chipsWrapper);
            }
          } else {
            $chips.find('.chip').removeClass('selected');
          }

          var $thisChips = $chips.find('.chip-position-wrapper').children('.chip');
          var $thisChipsLast = $chips.find('.chip-position-wrapper .chip').last().index();

          if (isValueEmpty && backspacePressed && (!$thisChips.hasClass('selected') || !$chips.find('.chip').hasClass('selected')) && $chips.hasClass('chips') && !$chips.hasClass('chips-initial') && !$chips.hasClass('chips-placeholder')) {
            _this7.deleteChip($chipsWrapper.data('index'), $thisChipsLast, $chipsWrapper);
          }

          if (isValueEmpty && backspacePressed && !$chips.find('.chip').hasClass('selected') && $chips.hasClass('chips') && ($chips.hasClass('chips-initial') || $chips.hasClass('chips-placeholder'))) {
            _this7.deleteChip($chipsWrapper.data('index'), $thisChipsLast, $chipsWrapper);
          }
        });
      }
    }, {
      key: "handleDocumentClickChipsDelete",
      value: function handleDocumentClickChipsDelete() {
        var _this8 = this;

        this.chips.on('click', '.chip .fas', function (e) {
          var $target = $(e.target);
          var $chip = $target.parent($(_this8.chips));
          var $chipsWrapper;

          if ($chip.parents().eq(1).hasClass('chips-autocomplete')) {
            $chipsWrapper = $chip.parents().eq(1);
          } else if (!$chip.parent().hasClass('chips-autocomplete') && !$chip.parents().eq(1).hasClass('chips-autocomplete')) {
            $chipsWrapper = $chip.parents().eq(0);
          } else if ($chip.parent().hasClass('chips-initial') && $chip.parent().hasClass('chips-autocomplete')) {
            $chipsWrapper = $chip.parents().eq(0);
          }

          _this8.deleteChip($chipsWrapper.data('index'), $chip.index(), $chipsWrapper);

          $chipsWrapper.find('input').focus();
        });
      }
    }, {
      key: "inputKeyDown",
      value: function inputKeyDown() {
        var _this9 = this;

        var $ulWrapper = this.ulWrapper;
        var dataChip = this.options.dataChip;
        var $thisChips = this.chips;
        var $input = $thisChips.children('.chip-position-wrapper').children('input');
        $input.on('keyup', function (e) {
          var $inputValue = $input.val();
          $ulWrapper.empty();

          if ($inputValue.length) {
            for (var item in dataChip) {
              if (dataChip[item].toLowerCase().includes($inputValue.toLowerCase())) {
                $thisChips.children('.chip-position-wrapper').append($ulWrapper.append($("<li>".concat(dataChip[item], "</li>"))));
              }
            }
          }

          if (e.which === _this9.keyCodes.enter) {
            $ulWrapper.empty();
            $ulWrapper.remove();
          }

          $inputValue.length === 0 ? $ulWrapper.removeClass('active').hide() : $ulWrapper.addClass('active').show();
        });
      }
    }, {
      key: "dynamicInputChanges",
      value: function dynamicInputChanges() {
        var dataChip = this.options.dataChip;

        if (dataChip !== undefined) {
          this.chips.children('.chip-position-wrapper').children('input').on('change', function (e) {
            var $targetVal = $(e.target).val();

            if (!dataChip.includes($targetVal)) {
              dataChip.push($targetVal);
              dataChip.sort();
            }
          });
        }
      }
    }, {
      key: "renderedLiClick",
      value: function renderedLiClick() {
        var _this10 = this;

        this.chips.on('click', 'li', function (e) {
          e.preventDefault();
          var $target = $(e.target);
          var $chipsWrapper = $target.closest($(_this10.selectors.chips));
          var chipsIndex = $chipsWrapper.data('index');

          _this10.addChip(chipsIndex, {
            tag: $target.text()
          }, $chipsWrapper);

          _this10.chips.children('.chip-position-wrapper').children('input').val('');

          _this10.ulWrapper.remove();
        });
      }
    }, {
      key: "deleteSelectedChip",
      value: function deleteSelectedChip($chipsWrapper, $selectedChip, siblingsLength) {
        var chipsIndex = $chipsWrapper.data('index');
        var chipIndex = $selectedChip.index();
        this.deleteChip(chipsIndex, chipIndex, $chipsWrapper);
        var selectIndex = null;

        if (chipIndex < siblingsLength - 1) {
          selectIndex = chipIndex;
        } else if (chipIndex === siblingsLength || chipIndex === siblingsLength - 1) {
          selectIndex = siblingsLength - 1;
        }

        if (selectIndex < 0) {
          selectIndex = null;
        }

        if (selectIndex !== null) {
          this.selectChip(chipsIndex, selectIndex, $chipsWrapper);
        }

        if (!siblingsLength) {
          $chipsWrapper.find('input').focus();
        }
      }
    }, {
      key: "selectLeftChip",
      value: function selectLeftChip($chipsWrapper, $selectedChip) {
        var chipIndex = $selectedChip.index() - 1;

        if (chipIndex < 0) {
          return;
        }

        $(this.selectors.chip).removeClass('selected');
        this.selectChip($chipsWrapper.data('index'), chipIndex, $chipsWrapper);
      }
    }, {
      key: "selectRightChip",
      value: function selectRightChip($chipsWrapper, $selectedChip, siblingsLength) {
        var chipIndex = $selectedChip.index() + 1;
        $(this.selectors.chip).removeClass('selected');

        if (chipIndex > siblingsLength) {
          $chipsWrapper.find('input').focus();
          return;
        }

        this.selectChip($chipsWrapper.data('index'), chipIndex, $chipsWrapper);
      }
    }, {
      key: "renderChips",
      value: function renderChips($chipsWrapper) {
        var _this11 = this;

        var html = '';
        $chipsWrapper.data('chips').forEach(function (elem) {
          html += _this11.getSingleChipHtml(elem);
        });

        if ($chipsWrapper.hasClass('chips-autocomplete')) {
          html += '<span class="chip-position-wrapper position-relative"><input class="input" placeholder=""></span>';
        } else {
          html += '<input class="input" placeholder="">';
        }

        $chipsWrapper.html(html);
        this.setPlaceholder($chipsWrapper);
      }
    }, {
      key: "getSingleChipHtml",
      value: function getSingleChipHtml(elem) {
        if (!elem.tag) {
          return '';
        }

        var html = "<div class=\"chip\">".concat(elem.tag);

        if (elem.image) {
          html += " <img src=\"".concat(elem.image, "\"> ");
        }

        html += '<i class="close fas fa-times"></i>';
        html += '</div>';
        return html;
      }
    }, {
      key: "setPlaceholder",
      value: function setPlaceholder($chips) {
        var options = $chips.data('options');

        if ($chips.data('chips').length && options.placeholder) {
          $chips.find('input').prop('placeholder', options.placeholder);
        } else if (!$chips.data('chips').length && options.secondaryPlaceholder) {
          $chips.find('input').prop('placeholder', options.secondaryPlaceholder);
        }
      }
    }, {
      key: "isValid",
      value: function isValid($chipsWrapper, elem) {
        var chips = $chipsWrapper.data('chips');

        for (var i = 0; i < chips.length; i++) {
          if (chips[i].tag === elem.tag) {
            return false;
          }
        }

        return elem.tag !== '';
      }
    }, {
      key: "addChip",
      value: function addChip(chipsIndex, elem, $chipsWrapper) {
        if (!this.isValid($chipsWrapper, elem)) {
          return;
        }

        var $chipHtml = $(this.getSingleChipHtml(elem));
        $chipsWrapper.data('chips').push(elem);

        if ($chipsWrapper.hasClass('chips-autocomplete') && $chipsWrapper.hasClass('chips-initial') && $chipsWrapper.find('.chip').length > 0) {
          $chipHtml.insertAfter($chipsWrapper.find('.chip').last());
        } else {
          $chipHtml.insertBefore($chipsWrapper.find('input'));
        }

        $chipsWrapper.trigger('chip.add', elem);
        this.setPlaceholder($chipsWrapper);
      }
    }, {
      key: "deleteChip",
      value: function deleteChip(chipsIndex, chipIndex, $chipsWrapper) {
        var chip = $chipsWrapper.data('chips')[chipIndex];
        $chipsWrapper.find('.chip').eq(chipIndex).remove();
        $chipsWrapper.data('chips').splice(chipIndex, 1);
        $chipsWrapper.trigger('chip.delete', chip);
        this.setPlaceholder($chipsWrapper);
      }
    }, {
      key: "selectChip",
      value: function selectChip(chipsIndex, chipIndex, $chipsWrapper) {
        var $chip = $chipsWrapper.find('.chip').eq(chipIndex);

        if ($chip && $chip.hasClass('selected') === false) {
          $chip.addClass('selected');
          $chipsWrapper.trigger('chip.select', $chipsWrapper.data('chips')[chipIndex]);
        }
      }
    }, {
      key: "getChipsElement",
      value: function getChipsElement(index, $chipsWrapper) {
        return $chipsWrapper.eq(index);
      }
    }]);

    return MaterialChip;
  }();

  $.fn.materialChip = function (options) {
    return this.each(function () {
      new MaterialChip($(this), options);
    });
  };
})(jQuery);