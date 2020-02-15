'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var pinTemplateElement = document.querySelector('#pin');

  var renderSinglePin = function (item) {
    var itemElement = pinTemplateElement.content.cloneNode(true);
    var pinBtn = itemElement.querySelector('.map__pin');
    var pinImg = itemElement.querySelector('img');
    pinBtn.style.left = (item.location.x - PIN_WIDTH / 2).toString() + 'px';
    pinBtn.style.top = (item.location.y - PIN_HEIGHT).toString() + 'px';
    pinImg.src = item.author.avatar;
    pinImg.alt = item.offer.title;
    return itemElement;
  };

  window.pin = {
    renderSinglePin: renderSinglePin
  };
})();
