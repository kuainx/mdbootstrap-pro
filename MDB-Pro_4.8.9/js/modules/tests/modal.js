"use strict";

$(function () {
  'use strict';

  QUnit.module('modal test');
  QUnit.test('should do nothing', function (assert) {
    assert.expect(1);
    assert.ok($(document.body).button, 'button method is defined');
  });
  QUnit.test('should do nothing too', function (assert) {
    var $btn = $('<button class="btn" data-toggle="button">mattonit</button>');
    assert.ok(!$btn.hasClass('active'), 'btn does not have active class');
  });
});