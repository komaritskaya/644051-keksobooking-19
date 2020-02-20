'use strict';

(function () {
  var ADS_COUNT = 5;

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
    return itemElement;
  };

  window.render = function (arr) {
    var takeNumber = arr.length > ADS_COUNT ? ADS_COUNT : arr.length;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < takeNumber; i++) {
      fragment.appendChild(renderSinglePin(arr[i]));
    }
    mapContainerElement.appendChild(fragment);
  };
})();
