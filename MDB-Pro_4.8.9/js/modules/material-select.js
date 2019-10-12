"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function ($) {
  var MaterialSelect =
  /*#__PURE__*/
  function () {
    function MaterialSelect($nativeSelect, options) {
      _classCallCheck(this, MaterialSelect);

      this.$nativeSelect = $nativeSelect;
      this.defaults = {
        destroy: false,
        nativeID: null,
        BSsearchIn: false,
        BSinputText: false,
        fasClasses: '',
        farClasses: '',
        fabClasses: '',
        copyClassesOption: false,
        language: {
          active: false,
          pl: {
            selectAll: 'Wybierz wszystko',
            optionsSelected: 'wybranych opcji'
          },
          in: {
            selectAll: 'Pilih semuanya',
            optionsSelected: 'opsi yang dipilih'
          },
          fr: {
            selectAll: 'Tout choisir',
            optionsSelected: 'options sélectionnées'
          },
          ge: {
            selectAll: 'Wähle alles aus',
            optionsSelected: 'ausgewählte Optionen'
          },
          ar: {
            selectAll: 'اختر كل شيء',
            optionsSelected: 'الخيارات المحددة'
          }
        }
      };
      this.options = this.assignOptions(options);
      this.isMultiple = Boolean(this.$nativeSelect.attr('multiple'));
      this.isSearchable = Boolean(this.$nativeSelect.attr('searchable'));
      this.isRequired = Boolean(this.$nativeSelect.attr('required'));
      this.isEditable = Boolean(this.$nativeSelect.attr('editable'));
      this.selectAllLabel = Boolean(this.$nativeSelect.attr('selectAllLabel')) ? this.$nativeSelect.attr('selectAllLabel') : 'Select all';
      this.optionsSelectedLabel = Boolean(this.$nativeSelect.attr('optionsSelectedLabel')) ? this.$nativeSelect.attr('optionsSelectedLabel') : 'options selected';
      this.keyboardActiveClass = Boolean(this.$nativeSelect.attr('keyboardActiveClass')) ? this.$nativeSelect.attr('keyboardActiveClass') : 'heavy-rain-gradient';
      this.uuid = this.options.nativeID !== null && this.options.nativeID !== '' && this.options.nativeID !== undefined && typeof this.options.nativeID === 'string' ? this.options.nativeID : this._randomUUID();
      this.$selectWrapper = $('<div class="select-wrapper"></div>');
      this.$materialOptionsList = $("<ul id=\"select-options-".concat(this.uuid, "\" class=\"dropdown-content select-dropdown w-100 ").concat(this.isMultiple ? 'multiple-select-dropdown' : '', "\"></ul>"));
      this.$materialSelectInitialOption = $nativeSelect.find('option:selected').text() || $nativeSelect.find('option:first').text() || '';
      this.$nativeSelectChildren = this.$nativeSelect.children('option, optgroup');
      this.$materialSelect = $("<input type=\"text\" class=\"".concat(this.options.BSinputText ? 'browser-default custom-select multi-bs-select select-dropdown form-control' : 'select-dropdown form-control', "\" ").concat(!this.options.validate && 'readonly="true"', " required=\"").concat(this.options.validate ? 'true' : 'false', "\" ").concat(this.$nativeSelect.is(' :disabled') ? 'disabled' : '', " data-activates=\"select-options-").concat(this.uuid, "\" value=\"\"/>"));
      this.$dropdownIcon = this.options.BSinputText ? '' : $('<span class="caret">&#9660;</span>');
      this.$searchInput = null;
      this.$toggleAll = $("<li class=\"select-toggle-all\"><span><input type=\"checkbox\" class=\"form-check-input\"><label>".concat(this.selectAllLabel, "</label></span></li>"));
      this.$addOptionBtn = $('<i class="select-add-option fas fa-plus"></i>');
      this.mainLabel = this.$nativeSelect.next('.mdb-main-label');
      this.$validFeedback = $("<div class=\"valid-feedback\">".concat(this.options.validFeedback || 'Good choice', "</div>"));
      this.$invalidFeedback = $("<div class=\"invalid-feedback\">".concat(this.options.invalidFeedback || 'Bad choice', "</div>"));
      this.valuesSelected = [];
      this.keyCodes = {
        tab: 9,
        esc: 27,
        enter: 13,
        arrowUp: 38,
        arrowDown: 40
      };
      MaterialSelect.mutationObservers = [];
    }

    _createClass(MaterialSelect, [{
      key: "assignOptions",
      value: function assignOptions(newOptions) {
        return $.extend({}, this.defaults, newOptions);
      }
    }, {
      key: "init",
      value: function init() {
        var alreadyInitialized = Boolean(this.$nativeSelect.data('select-id'));

        if (alreadyInitialized) {
          this._removeMaterialWrapper();
        }

        if (this.options.destroy) {
          var $btnSave = this.$nativeSelect.parent().find('button.btn-save').length ? this.$nativeSelect.parent().find('button.btn-save') : false;
          this.$nativeSelect.data('select-id', null).removeClass('initialized');
          this.$nativeSelect.parent().append($btnSave);
          return;
        }

        if (this.options.BSsearchIn || this.options.BSinputText) {
          this.$selectWrapper.addClass(this.$nativeSelect.attr('class').split(' ').filter(function (el) {
            return el !== 'md-form';
          }).join(' ')).css({
            marginTop: '1.5rem',
            marginBottom: '1.5rem'
          });
        } else {
          this.$selectWrapper.addClass(this.$nativeSelect.attr('class'));
        }

        this.$nativeSelect.data('select-id', this.uuid);
        var sanitizedLabelHtml = this.$materialSelectInitialOption.replace(/"/g, '&quot;').replace(/  +/g, ' ').trim();
        this.mainLabel.length === 0 ? this.$materialSelect.val(sanitizedLabelHtml) : this.mainLabel.text();
        this.renderMaterialSelect();
        this.bindEvents();

        if (this.isRequired) {
          this.enableValidation();
        }

        if (this.options.language.active && this.$toggleAll) {
          if (this.options.language.pl) {
            this.$toggleAll.find('label').text(this.options.language.pl.selectAll ? this.options.language.pl.selectAll : this.defaults.language.pl.selectAll);
          }

          if (this.options.language.fr) {
            this.$toggleAll.find('label').text(this.options.language.fr.selectAll ? this.options.language.fr.selectAll : this.defaults.language.fr.selectAll);
          }

          if (this.options.language.ge) {
            this.$toggleAll.find('label').text(this.options.language.ge.selectAll ? this.options.language.ge.selectAll : this.defaults.language.ge.selectAll);
          }

          if (this.options.language.ar) {
            this.$toggleAll.find('label').text(this.options.language.ar.selectAll ? this.options.language.ar.selectAll : this.defaults.language.ar.selectAll);
          }

          if (this.options.language.in) {
            this.$toggleAll.find('label').text(this.options.language.in.selectAll ? this.options.language.in.selectAll : this.defaults.language.in.selectAll);
          }
        }

        if (this.$materialSelect.hasClass('custom-select') && this.$materialSelect.hasClass('select-dropdown')) {
          this.$materialSelect.css({
            display: 'inline-block',
            width: '100%',
            height: 'calc(1.5em + .75rem + 2px)',
            padding: '.375rem 1.75rem .375rem .75rem',
            fontSize: '1rem',
            lineHeight: '1.5',
            backgroundColor: '#fff',
            border: '1px solid #ced4da'
          });
        }
      }
    }, {
      key: "_removeMaterialWrapper",
      value: function _removeMaterialWrapper() {
        var currentUuid = this.$nativeSelect.data('select-id');
        this.$nativeSelect.parent().find('span.caret').remove();
        this.$nativeSelect.parent().find('input').remove();
        this.$nativeSelect.unwrap();
        $("ul#select-options-".concat(currentUuid)).remove();
      }
    }, {
      key: "renderMaterialSelect",
      value: function renderMaterialSelect() {
        var _this = this;

        this.$nativeSelect.before(this.$selectWrapper);
        this.appendDropdownIcon();
        this.appendValidation();
        this.appendMaterialSelect();
        this.appendMaterialOptionsList();
        this.appendNativeSelect();
        this.appendSaveSelectButton();

        if (!this.$nativeSelect.is(':disabled')) {
          this.$materialSelect.dropdown({
            hover: false,
            closeOnClick: false
          });
        }

        if (this.$nativeSelect.data('inherit-tabindex') !== false) {
          this.$materialSelect.attr('tabindex', this.$nativeSelect.attr('tabindex'));
        }

        if (this.isMultiple) {
          this.$nativeSelect.find('option:selected:not(:disabled)').each(function (i, element) {
            var index = element.index;

            _this._toggleSelectedValue(index);

            _this.$materialOptionsList.find('li:not(.optgroup):not(.select-toggle-all)').eq(index).find(':checkbox').prop('checked', true);
          });
        } else {
          var preselectedOption = this.$nativeSelect.find('option[selected]');
          var index = preselectedOption.index();

          if (preselectedOption.attr('disabled') !== 'disabled' && index >= 0) {
            this._toggleSelectedValue(index);

            this.$materialOptionsList.find('li').eq(index).addClass('active');
          }
        }

        this.$nativeSelect.addClass('initialized');

        if (this.options.BSinputText) {
          this.mainLabel.css('top', '-7px');
        }
      }
    }, {
      key: "appendDropdownIcon",
      value: function appendDropdownIcon() {
        if (this.$nativeSelect.is(':disabled')) {
          this.$dropdownIcon.addClass('disabled');
        }

        this.$selectWrapper.append(this.$dropdownIcon);
      }
    }, {
      key: "appendValidation",
      value: function appendValidation() {
        if (this.options.validate) {
          this.$validFeedback.insertAfter(this.$selectWrapper);
          this.$invalidFeedback.insertAfter(this.$selectWrapper);
        }
      }
    }, {
      key: "appendMaterialSelect",
      value: function appendMaterialSelect() {
        this.$selectWrapper.append(this.$materialSelect);
      }
    }, {
      key: "appendMaterialOptionsList",
      value: function appendMaterialOptionsList() {
        if (this.isSearchable) {
          this.appendSearchInputOption();
        }

        if (this.isEditable && this.isSearchable) {
          this.appendAddOptionBtn();
        }

        this.buildMaterialOptions();

        if (this.isMultiple) {
          this.appendToggleAllCheckbox();
        }

        this.$selectWrapper.append(this.$materialOptionsList);
      }
    }, {
      key: "appendNativeSelect",
      value: function appendNativeSelect() {
        this.$nativeSelect.appendTo(this.$selectWrapper);
      }
    }, {
      key: "appendSearchInputOption",
      value: function appendSearchInputOption() {
        var placeholder = this.$nativeSelect.attr('searchable');

        if (this.options.BSsearchIn) {
          this.$searchInput = $("<span class=\"search-wrap ml-2\"><div class=\"mt-0\"><input type=\"text\" class=\"search mb-2 w-100 d-block select-default\" tabindex=\"-1\" placeholder=\"".concat(placeholder, "\"></div></span>"));
        } else {
          this.$searchInput = $("<span class=\"search-wrap ml-2\"><div class=\"md-form mt-0\"><input type=\"text\" class=\"search w-100 d-block\" tabindex=\"-1\" placeholder=\"".concat(placeholder, "\"></div></span>"));
        }

        this.$materialOptionsList.append(this.$searchInput);
        this.$searchInput.on('click', function (e) {
          e.stopPropagation();
        });
      }
    }, {
      key: "appendAddOptionBtn",
      value: function appendAddOptionBtn() {
        this.$searchInput.append(this.$addOptionBtn);
        this.$addOptionBtn.on('click', this.addNewOption.bind(this));
      }
    }, {
      key: "addNewOption",
      value: function addNewOption() {
        var val = this.$searchInput.find('input').val();
        var $newOption = $("<option value=\"".concat(val.toLowerCase(), "\" selected>").concat(val, "</option>")).prop('selected', true);

        if (!this.isMultple) {
          this.$nativeSelectChildren.each(function (index, option) {
            $(option).attr('selected', false);
          });
        }

        ;
        this.$nativeSelect.append($newOption);
      }
    }, {
      key: "appendToggleAllCheckbox",
      value: function appendToggleAllCheckbox() {
        var firstOption = this.$materialOptionsList.find('li').first();

        if (firstOption.hasClass('disabled') && firstOption.find('input').prop('disabled')) {
          firstOption.after(this.$toggleAll);
        } else {
          this.$materialOptionsList.find('li').first().before(this.$toggleAll);
        }
      }
    }, {
      key: "appendSaveSelectButton",
      value: function appendSaveSelectButton() {
        this.$selectWrapper.parent().find('button.btn-save').appendTo(this.$materialOptionsList);
      }
    }, {
      key: "buildMaterialOptions",
      value: function buildMaterialOptions() {
        var _this2 = this;

        this.$nativeSelectChildren.each(function (index, option) {
          var $this = $(option);

          if ($this.is('option')) {
            _this2.buildSingleOption($this, _this2.isMultiple ? 'multiple' : '');
          } else if ($this.is('optgroup')) {
            var $materialOptgroup = $("<li class=\"optgroup\"><span>".concat($this.attr('label'), "</span></li>"));

            _this2.$materialOptionsList.append($materialOptgroup);

            var $optgroupOptions = $this.children('option');
            $optgroupOptions.each(function (index, optgroupOption) {
              _this2.buildSingleOption($(optgroupOption), 'optgroup-option');
            });
          }
        });
      }
    }, {
      key: "buildSingleOption",
      value: function buildSingleOption($nativeSelectChild, type) {
        var disabled = $nativeSelectChild.is(':disabled') ? 'disabled' : '';
        var optgroupClass = type === 'optgroup-option' ? 'optgroup-option' : '';
        var iconUrl = $nativeSelectChild.data('icon');
        var fas = $nativeSelectChild.data('fas') ? "<i class=\"fa-pull-right m-2 fas fa-".concat($nativeSelectChild.data('fas'), " ").concat([...this.options.fasClasses].join(''), "\"></i> ") : '';
        var far = $nativeSelectChild.data('far') ? "<i class=\"fa-pull-right m-2 far fa-".concat($nativeSelectChild.data('far'), " ").concat([...this.options.farClasses].join(''), "\"></i> ") : '';
        var fab = $nativeSelectChild.data('fab') ? "<i class=\"fa-pull-right m-2 fab fa-".concat($nativeSelectChild.data('fab'), " ").concat([...this.options.fabClasses].join(''), "\"></i> ") : '';
        var classes = $nativeSelectChild.attr('class');
        var iconHtml = iconUrl ? "<img alt=\"\" src=\"".concat(iconUrl, "\" class=\"").concat(classes, "\">") : '';
        var checkboxHtml = this.isMultiple ? "<input type=\"checkbox\" class=\"form-check-input\" ".concat(disabled, "/><label></label>") : '';
        this.$materialOptionsList.append($("<li class=\"".concat(disabled, " ").concat(optgroupClass, " ").concat(this.options.copyClassesOption ? classes : '', " \">").concat(iconHtml, "<span class=\"filtrable\">").concat(checkboxHtml, " ").concat($nativeSelectChild.html(), " ").concat(fas, " ").concat(far, " ").concat(fab, "</span></li>")));
      }
    }, {
      key: "enableValidation",
      value: function enableValidation() {
        this.$nativeSelect.css({
          position: 'absolute',
          top: '1rem',
          left: '0',
          height: '0',
          width: '0',
          opacity: '0',
          padding: '0',
          'pointer-events': 'none'
        });

        if (this.$nativeSelect.attr('style').indexOf('inline!important') === -1) {
          this.$nativeSelect.attr('style', "".concat(this.$nativeSelect.attr('style'), " display: inline!important;"));
        }

        this.$nativeSelect.attr('tabindex', -1);
        this.$nativeSelect.data('inherit-tabindex', false);
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {
        var _this3 = this;

        var config = {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        };
        var observer = new MutationObserver(this._onMutationObserverChange.bind(this));
        observer.observe(this.$nativeSelect.get(0), config);
        observer.customId = this.uuid;
        observer.customStatus = 'observing';
        MaterialSelect.clearMutationObservers();
        MaterialSelect.mutationObservers.push(observer);
        var $saveSelectBtn = this.$nativeSelect.parent().find('button.btn-save');
        $saveSelectBtn.on('click', this._onSaveSelectBtnClick.bind(this));
        this.$materialSelect.on('focus', this._onMaterialSelectFocus.bind(this));
        this.$materialSelect.on('click', this._onMaterialSelectClick.bind(this));
        this.$materialSelect.on('blur', this._onMaterialSelectBlur.bind(this));
        this.$materialSelect.on('keydown', this._onMaterialSelectKeydown.bind(this));
        this.$toggleAll.on('click', this._onToggleAllClick.bind(this));
        this.$materialOptionsList.on('mousedown', this._onEachMaterialOptionMousedown.bind(this));
        this.$materialOptionsList.find('li:not(.optgroup)').not(this.$toggleAll).each(function (materialOptionIndex, materialOption) {
          $(materialOption).on('click', _this3._onEachMaterialOptionClick.bind(_this3, materialOptionIndex, materialOption));
        });

        if (!this.isMultiple && this.isSearchable) {
          this.$materialOptionsList.find('li').on('click', this._onSingleMaterialOptionClick.bind(this));
        }

        if (this.isSearchable) {
          this.$searchInput.find('.search').on('keyup', this._onSearchInputKeyup.bind(this));
        }

        $('html').on('click', this._onHTMLClick.bind(this));
      }
    }, {
      key: "_onMutationObserverChange",
      value: function _onMutationObserverChange(mutationsList) {
        mutationsList.forEach(function (mutation) {
          var $select = $(mutation.target).closest('select');

          if ($select.data('stop-refresh') !== true && (mutation.type === 'childList' || mutation.type === 'attributes' && $(mutation.target).is('option'))) {
            MaterialSelect.clearMutationObservers();
            $select.materialSelect({
              destroy: true
            });
            $select.materialSelect();
          }
        });
      }
    }, {
      key: "_onSaveSelectBtnClick",
      value: function _onSaveSelectBtnClick() {
        $('input.multi-bs-select').trigger('close');
        this.$materialOptionsList.hide();
        this.$materialSelect.removeClass('active');
      }
    }, {
      key: "_onEachMaterialOptionClick",
      value: function _onEachMaterialOptionClick(materialOptionIndex, materialOption, e) {
        e.stopPropagation();
        var $this = $(materialOption);

        if ($this.hasClass('disabled') || $this.hasClass('optgroup')) {
          return;
        }

        var selected = true;

        if (this.isMultiple) {
          $this.find('input[type="checkbox"]').prop('checked', function (index, oldPropertyValue) {
            return !oldPropertyValue;
          });
          var hasOptgroup = Boolean(this.$nativeSelect.find('optgroup').length);
          var thisIndex = this._isToggleAllPresent() ? $this.index() - 1 : $this.index();

          if (this.isSearchable && hasOptgroup) {
            selected = this._toggleSelectedValue(thisIndex - $this.prevAll('.optgroup').length - 1);
          } else if (this.isSearchable) {
            selected = this._toggleSelectedValue(thisIndex - 1);
          } else if (hasOptgroup) {
            selected = this._toggleSelectedValue(thisIndex - $this.prevAll('.optgroup').length);
          } else {
            selected = this._toggleSelectedValue(thisIndex);
          }

          if (this._isToggleAllPresent()) {
            this._updateToggleAllOption();
          }

          this.$materialSelect.trigger('focus');
        } else {
          this.$materialOptionsList.find('li').removeClass('active');
          $this.toggleClass('active');
          this.$materialSelect.val($this.text().replace(/  +/g, ' ').trim());
          this.$materialSelect.trigger('close');
        }

        this._selectSingleOption($this);

        this.$nativeSelect.data('stop-refresh', true);
        this.$nativeSelect.find('option').eq(materialOptionIndex).prop('selected', selected);
        this.$nativeSelect.removeData('stop-refresh');

        this._triggerChangeOnNativeSelect();

        if (this.mainLabel.prev().find('input').hasClass('select-dropdown')) {
          if (this.mainLabel.prev().find('input.select-dropdown').val().length > 0) {
            this.mainLabel.addClass('active');
          }
        }

        if (typeof this.options === 'function') {
          this.options();
        }

        if ($this.hasClass('li-added')) {
          this.$materialOptionsList.append(this.buildSingleOption($this, ''));
        }
      }
    }, {
      key: "_escapeKeyboardActiveOptions",
      value: function _escapeKeyboardActiveOptions() {
        var _this4 = this;

        this.$materialOptionsList.find('li').each(function (i, el) {
          $(el).removeClass(_this4.keyboardActiveClass);
        });
      }
    }, {
      key: "_triggerChangeOnNativeSelect",
      value: function _triggerChangeOnNativeSelect() {
        var keyboardEvt = new KeyboardEvent('change', {
          bubbles: true,
          cancelable: true
        });
        this.$nativeSelect.get(0).dispatchEvent(keyboardEvt);
      }
    }, {
      key: "_onMaterialSelectFocus",
      value: function _onMaterialSelectFocus(e) {
        var $this = $(e.target);

        if ($('ul.select-dropdown').not(this.$materialOptionsList.get(0)).is(':visible')) {
          $('input.select-dropdown').trigger('close');
        }

        this.mainLabel.addClass('active');

        if (!this.$materialOptionsList.is(':visible')) {
          $this.trigger('open', ['focus']);
          var label = $this.val();
          var $selectedOption = this.$materialOptionsList.find('li').filter(function () {
            return $(this).text().toLowerCase() === label.toLowerCase();
          })[0];

          this._selectSingleOption($selectedOption);
        }

        if (!this.isMultiple) {
          this.mainLabel.addClass('active');
        }

        $(document).find('input.select-dropdown').each(function (i, el) {
          return $(el).val().length <= 0;
        }).parent().next('.mdb-main-label').filter(function (i, el) {
          return $(el).prev().find('input.select-dropdown').val().length <= 0 && !$(el).prev().find('input.select-dropdown').hasClass('active');
        }).removeClass('active');
      }
    }, {
      key: "_onMaterialSelectClick",
      value: function _onMaterialSelectClick(e) {
        this.mainLabel.addClass('active');
        e.stopPropagation();
      }
    }, {
      key: "_onMaterialSelectBlur",
      value: function _onMaterialSelectBlur(e) {
        var $this = $(e);

        if (!this.isMultiple && !this.isSearchable) {
          $this.trigger('close');
        }

        this.$materialOptionsList.find('li.selected').removeClass('selected');
      }
    }, {
      key: "_onSingleMaterialOptionClick",
      value: function _onSingleMaterialOptionClick() {
        this.$materialSelect.trigger('close');
      }
    }, {
      key: "_onEachMaterialOptionMousedown",
      value: function _onEachMaterialOptionMousedown(e) {
        var option = e.target;

        if ($('.modal-content').find(this.$materialOptionsList).length) {
          if (option.scrollHeight > option.offsetHeight) {
            e.preventDefault();
          }
        }
      }
    }, {
      key: "_onHTMLClick",
      value: function _onHTMLClick(e) {
        if (!$(e.target).closest("#select-options-".concat(this.uuid)).length && !$(e.target).hasClass('mdb-select') && $("#select-options-".concat(this.uuid)).hasClass('active')) {
          this.$materialSelect.trigger('close');

          if (!this.$materialSelect.val().length > 0) {
            this.mainLabel.removeClass('active');
          }
        }

        if (this.isSearchable && this.$searchInput !== null && this.$materialOptionsList.hasClass('active')) {
          this.$materialOptionsList.find('.search-wrap input.search').focus();
        }
      }
    }, {
      key: "_onToggleAllClick",
      value: function _onToggleAllClick(e) {
        var _this5 = this;

        var checkbox = $(this.$toggleAll).find('input[type="checkbox"]').first();
        var state = !$(checkbox).prop('checked');
        $(checkbox).prop('checked', state);
        this.$materialOptionsList.find('li:not(.optgroup):not(.select-toggle-all)').each(function (materialOptionIndex, materialOption) {
          var $optionCheckbox = $(materialOption).find('input[type="checkbox"]');

          if (state && $optionCheckbox.is(':checked') || !state && !$optionCheckbox.is(':checked') || $(materialOption).is(':hidden') || $(materialOption).is('.disabled')) {
            return;
          }

          $optionCheckbox.prop('checked', state);

          _this5.$nativeSelect.find('option').eq(materialOptionIndex).prop('selected', state);

          if (state) {
            $(materialOption).removeClass('active');
          } else {
            $(materialOption).addClass('active');
          }

          _this5._toggleSelectedValue(materialOptionIndex);

          _this5._selectOption(materialOption);

          _this5._setValueToMaterialSelect();
        });
        this.$nativeSelect.data('stop-refresh', true);

        this._triggerChangeOnNativeSelect();

        this.$nativeSelect.removeData('stop-refresh');
        e.stopPropagation();
      }
    }, {
      key: "_onMaterialSelectKeydown",
      value: function _onMaterialSelectKeydown(e) {
        var $this = $(e.target);
        var isTab = e.which === this.keyCodes.tab;
        var isEsc = e.which === this.keyCodes.esc;
        var isEnter = e.which === this.keyCodes.enter;
        var isEnterWithShift = isEnter && e.shiftKey;
        var isArrowUp = e.which === this.keyCodes.arrowUp;
        var isArrowDown = e.which === this.keyCodes.arrowDown;
        var isMaterialSelectVisible = this.$materialOptionsList.is(':visible');

        if (isTab) {
          this._handleTabKey($this);

          return;
        } else if (isArrowDown && !isMaterialSelectVisible) {
          $this.trigger('open');
          return;
        } else if (isEnter && !isMaterialSelectVisible) {
          return;
        }

        e.preventDefault();

        if (isEnterWithShift) {
          this._handleEnterWithShiftKey($this);
        } else if (isEnter) {
          this._handleEnterKey($this);
        } else if (isArrowDown) {
          this._handleArrowDownKey();
        } else if (isArrowUp) {
          this._handleArrowUpKey();
        } else if (isEsc) {
          this._handleEscKey($this);
        } else {
          this._handleLetterKey(e);
        }
      }
    }, {
      key: "_handleTabKey",
      value: function _handleTabKey(materialSelect) {
        this._handleEscKey(materialSelect);
      }
    }, {
      key: "_handleEnterWithShiftKey",
      value: function _handleEnterWithShiftKey(materialSelect) {
        if (!this.isMultiple) {
          this._handleEnterKey(materialSelect);
        } else {
          this.$toggleAll.trigger('click');
        }
      }
    }, {
      key: "_handleEnterKey",
      value: function _handleEnterKey(materialSelect) {
        var $activeOption = this.$materialOptionsList.find('li.selected:not(.disabled)');
        $activeOption.trigger('click').addClass('active');

        if (!this.isMultiple) {
          $(materialSelect).trigger('close');
        }
      }
    }, {
      key: "_handleArrowDownKey",
      value: function _handleArrowDownKey() {
        var _this6 = this;

        var $availableOptions = this.$materialOptionsList.find('li:visible').not('.disabled, .select-toggle-all');
        var $firstOption = this.$materialOptionsList.find('li:visible').not('.disabled, .select-toggle-all').first();
        var $lastOption = this.$materialOptionsList.find('li:visible').not('.disabled, .select-toggle-all').last();
        var anySelected = this.$materialOptionsList.find('li.selected').length > 0;
        var $currentOption = anySelected ? this.$materialOptionsList.find('li.selected').first() : $firstOption;
        var $nextOption = $currentOption.next('li:visible:not(.disabled, .select-toggle-all)');
        var $activeOption = $nextOption;
        $availableOptions.each(function (key, el) {
          if ($(el).hasClass(_this6.keyboardActiveClass)) {
            $nextOption = $availableOptions.eq(key + 1);
            $activeOption = $availableOptions.eq(key);
          }
        });
        var $matchedMaterialOption = $currentOption.is($lastOption) || !anySelected ? $currentOption : $nextOption;

        this._selectSingleOption($matchedMaterialOption);

        this._escapeKeyboardActiveOptions();

        if (!$matchedMaterialOption.find('input').is(':checked')) {
          $matchedMaterialOption.removeClass(this.keyboardActiveClass);
        }

        if (!$activeOption.hasClass('selected') && !$activeOption.find('input').is(':checked') && this.isMultiple) {
          $activeOption.removeClass('active', this.keyboardActiveClass);
        }

        $matchedMaterialOption.addClass(this.keyboardActiveClass);

        if ($matchedMaterialOption.position()) {
          this.$materialOptionsList.scrollTop(this.$materialOptionsList.scrollTop() + $matchedMaterialOption.position().top);
        }
      }
    }, {
      key: "_handleArrowUpKey",
      value: function _handleArrowUpKey() {
        var _this7 = this;

        var $availableOptions = this.$materialOptionsList.find('li:visible').not('.disabled, .select-toggle-all');
        var $firstOption = this.$materialOptionsList.find('li:visible').not('.disabled, .select-toggle-all').first();
        var $lastOption = this.$materialOptionsList.find('li:visible').not('.disabled, .select-toggle-all').last();
        var anySelected = this.$materialOptionsList.find('li.selected').length > 0;
        var $currentOption = anySelected ? this.$materialOptionsList.find('li.selected').first() : $lastOption;
        var $prevOption = $currentOption.prev('li:visible:not(.disabled, .select-toggle-all)');
        var $activeOption = $prevOption;
        $availableOptions.each(function (key, el) {
          if ($(el).hasClass(_this7.keyboardActiveClass)) {
            $prevOption = $availableOptions.eq(key - 1);
            $activeOption = $availableOptions.eq(key);
          }
        });
        var $matchedMaterialOption = $currentOption.is($firstOption) || !anySelected ? $currentOption : $prevOption;

        this._selectSingleOption($matchedMaterialOption);

        this._escapeKeyboardActiveOptions();

        if (!$matchedMaterialOption.find('input').is(':checked')) {
          $matchedMaterialOption.removeClass(this.keyboardActiveClass);
        }

        if (!$activeOption.hasClass('selected') && !$activeOption.find('input').is(':checked') && this.isMultiple) {
          $activeOption.removeClass('active', this.keyboardActiveClass);
        }

        $matchedMaterialOption.addClass(this.keyboardActiveClass);

        if ($matchedMaterialOption.position()) {
          this.$materialOptionsList.scrollTop(this.$materialOptionsList.scrollTop() + $matchedMaterialOption.position().top);
        }
      }
    }, {
      key: "_handleEscKey",
      value: function _handleEscKey(materialSelect) {
        this._escapeKeyboardActiveOptions();

        $(materialSelect).trigger('close');
      }
    }, {
      key: "_handleLetterKey",
      value: function _handleLetterKey(e) {
        var _this8 = this;

        this._escapeKeyboardActiveOptions();

        if (this.isSearchable) {
          var isLetter = e.which > 46 && e.which < 91;
          var isNumber = e.which > 93 && e.which < 106;
          var isBackspace = e.which === 8;
          if (isLetter || isNumber) this.$searchInput.find('input').val(e.key).focus();
          if (isBackspace) this.$searchInput.find('input').val('').focus();
        } else {
          var filterQueryString = '';
          var letter = String.fromCharCode(e.which).toLowerCase();
          var nonLetters = Object.keys(this.keyCodes).map(function (key) {
            return _this8.keyCodes[key];
          });
          var isLetterSearchable = letter && nonLetters.indexOf(e.which) === -1;

          if (isLetterSearchable) {
            filterQueryString += letter;
            var $matchedMaterialOption = this.$materialOptionsList.find('li').filter(function (index, element) {
              return $(element).text().toLowerCase().includes(filterQueryString);
            }).first();

            if (!this.isMultiple) {
              this.$materialOptionsList.find('li').removeClass('active');
            }

            $matchedMaterialOption.addClass('active');

            this._selectSingleOption($matchedMaterialOption);
          }
        }
      }
    }, {
      key: "_onSearchInputKeyup",
      value: function _onSearchInputKeyup(e) {
        var $this = $(e.target);
        var isTab = e.which === this.keyCodes.tab;
        var isEsc = e.which === this.keyCodes.esc;
        var isEnter = e.which === this.keyCodes.enter;
        var isEnterWithShift = isEnter && e.shiftKey;
        var isArrowUp = e.which === this.keyCodes.arrowUp;
        var isArrowDown = e.which === this.keyCodes.arrowDown;

        if (isArrowDown || isTab || isEsc || isArrowUp) {
          this.$materialSelect.focus();

          this._handleArrowDownKey();

          return;
        }

        var $ul = $this.closest('ul');
        var searchValue = $this.val();
        var $options = $ul.find('li span.filtrable');
        var isOptionInList = false;
        $options.each(function () {
          var $option = $(this);

          if (typeof this.outerHTML === 'string') {
            var liValue = this.textContent.toLowerCase();

            if (liValue.includes(searchValue.toLowerCase())) {
              $option.show().parent().show();
            } else {
              $option.hide().parent().hide();
            }

            if (liValue.trim() === searchValue.toLowerCase()) {
              isOptionInList = true;
            }
          }
        });

        if (isEnter) {
          if (this.isEditable && !isOptionInList) {
            this.addNewOption();
            return;
          }

          if (isEnterWithShift) {
            this._handleEnterWithShiftKey($this);
          }

          this.$materialSelect.trigger('open');
          return;
        }

        if (searchValue && this.isEditable && !isOptionInList) {
          this.$addOptionBtn.show();
        } else {
          this.$addOptionBtn.hide();
        }

        this._updateToggleAllOption();
      }
    }, {
      key: "_isToggleAllPresent",
      value: function _isToggleAllPresent() {
        return this.$materialOptionsList.find(this.$toggleAll).length;
      }
    }, {
      key: "_updateToggleAllOption",
      value: function _updateToggleAllOption() {
        var $allOptionsButToggleAll = this.$materialOptionsList.find('li').not('.select-toggle-all, .disabled, :hidden').find('[type=checkbox]');
        var $checkedOptionsButToggleAll = $allOptionsButToggleAll.filter(':checked');
        var isToggleAllChecked = this.$toggleAll.find('[type=checkbox]').is(':checked');

        if ($checkedOptionsButToggleAll.length === $allOptionsButToggleAll.length && !isToggleAllChecked) {
          this.$toggleAll.find('[type=checkbox]').prop('checked', true);
        } else if ($checkedOptionsButToggleAll.length < $allOptionsButToggleAll.length && isToggleAllChecked) {
          this.$toggleAll.find('[type=checkbox]').prop('checked', false);
        }
      }
    }, {
      key: "_toggleSelectedValue",
      value: function _toggleSelectedValue(optionIndex) {
        var selectedValueIndex = this.valuesSelected.indexOf(optionIndex);
        var isSelected = selectedValueIndex !== -1;

        if (!isSelected) {
          this.valuesSelected.push(optionIndex);
        } else {
          this.valuesSelected.splice(selectedValueIndex, 1);
        }

        this.$materialOptionsList.find('li:not(.optgroup):not(.select-toggle-all)').eq(optionIndex).toggleClass('active');
        this.$nativeSelect.find('option').eq(optionIndex).prop('selected', !isSelected);

        this._setValueToMaterialSelect();

        return !isSelected;
      }
    }, {
      key: "_selectSingleOption",
      value: function _selectSingleOption(newOption) {
        this.$materialOptionsList.find('li.selected').removeClass('selected');

        this._selectOption(newOption);
      }
    }, {
      key: "_selectOption",
      value: function _selectOption(newOption) {
        var option = $(newOption);
        option.addClass('selected');
      }
    }, {
      key: "_setValueToMaterialSelect",
      value: function _setValueToMaterialSelect() {
        var _this9 = this;

        var value = '';
        var optionsSelected = this.optionsSelectedLabel;
        var itemsCount = this.valuesSelected.length;

        if (this.options.language.active && this.$toggleAll) {
          if (this.options.language.pl) {
            optionsSelected = this.options.language.pl.optionsSelected ? this.options.language.pl.optionsSelected : this.defaults.language.pl.optionsSelected;
          } else if (this.options.language.fr) {
            optionsSelected = this.options.language.fr.optionsSelected ? this.options.language.fr.optionsSelected : this.defaults.language.fr.optionsSelected;
          } else if (this.options.language.ge) {
            optionsSelected = this.options.language.ge.optionsSelected ? this.options.language.ge.optionsSelected : this.defaults.language.ge.optionsSelected;
          } else if (this.options.language.ar) {
            optionsSelected = this.options.language.ar.optionsSelected ? this.options.language.ar.optionsSelected : this.defaults.language.ar.optionsSelected;
          } else if (this.options.language.in) {
            optionsSelected = this.options.language.in.optionsSelected ? this.options.language.in.optionsSelected : this.defaults.language.in.optionsSelected;
          }
        }

        this.valuesSelected.map(function (el) {
          return value += ", ".concat(_this9.$nativeSelect.find('option').eq(el).text().replace(/  +/g, ' ').trim());
        });
        itemsCount >= 5 ? value = "".concat(itemsCount, " ").concat(optionsSelected) : value = value.substring(2);
        value.length === 0 && this.mainLabel.length === 0 ? value = this.$nativeSelect.find('option:disabled').eq(0).text() : null;
        value.length > 0 && !this.options.BSinputText ? this.mainLabel.addClass('active ') : this.mainLabel.removeClass('active');
        this.options.BSinputText ? this.mainLabel.css('top', '-7px') : null;
        this.$nativeSelect.siblings("".concat(this.options.BSinputText ? 'input.multi-bs-select' : 'input.select-dropdown')).val(value);
      }
    }, {
      key: "_randomUUID",
      value: function _randomUUID() {
        var d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
        });
      }
    }], [{
      key: "clearMutationObservers",
      value: function clearMutationObservers() {
        MaterialSelect.mutationObservers.forEach(function (observer) {
          observer.disconnect();
          observer.customStatus = 'stopped';
        });
      }
    }]);

    return MaterialSelect;
  }();

  $.fn.materialSelect = function (callback) {
    $(this).not('.browser-default').not('.custom-select').each(function () {
      var materialSelect = new MaterialSelect($(this), callback);
      materialSelect.init();
    });
  };

  $.fn.material_select = $.fn.materialSelect;

  (function (originalVal) {
    $.fn.val = function (value) {
      if (!arguments.length) {
        return originalVal.call(this);
      }

      if (this.data('stop-refresh') !== true && this.hasClass('mdb-select') && this.hasClass('initialized')) {
        MaterialSelect.clearMutationObservers();
        this.materialSelect({
          destroy: true
        });
        var ret = originalVal.call(this, value);
        this.materialSelect();
        return ret;
      }

      return originalVal.call(this, value);
    };
  })($.fn.val);
})(jQuery);

$('select').siblings('input.select-dropdown', 'input.multi-bs-select').on('mousedown', function (e) {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    if (e.clientX >= e.target.clientWidth || e.clientY >= e.target.clientHeight) {
      e.preventDefault();
    }
  }
});