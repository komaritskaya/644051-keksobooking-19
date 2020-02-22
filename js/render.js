'use strict';

(function () {
  var MAX_ADS_COUNT = 5;

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var pinTemplateElement = document.querySelector('#pin');
  var mapContainerElement = document.querySelector('.map__pins');


  var renderSinglePin = function (item) {
    var itemElement = pinTemplateElement.content.cloneNode(true);
    var pinBtn = itemElement.querySelector('.map__pin');
    var pinImg = itemElement.querySelector('img');
    pinBtn.style.left = (item.location.x - PIN_WIDTH / 2).toString() + 'px';
    pinBtn.style.top = (item.location.y - PIN_HEIGHT).toString() + 'px';
    pinImg.src = item.author.avatar;
    pinImg.alt = item.offer.title;
    pinBtn.addEventListener('click', function () {
      window.card.renderCard(item);
    });
    pinBtn.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.utils.ENTER_KEY) {
        window.card.renderCard(item);
      }
    });
    return itemElement;
  };

  var renderPins = function (pins) {
    var takeNumber = pins.length > MAX_ADS_COUNT ? MAX_ADS_COUNT : pins.length;
    var fragment = document.createDocumentFragment();
    pins.slice(0, takeNumber).forEach(function (pin) {
      fragment.appendChild(renderSinglePin(pin));
    });
    mapContainerElement.appendChild(fragment);
  };

  window.render = {
    renderPins: renderPins
  };
})();
