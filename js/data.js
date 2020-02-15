'use strict';

(function () {
  var ADS_NUMBER = 8;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var TIME_OPTIONS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var DESCRIPTIONS = [
    'Не проходите мимо!',
    'Бронируйте!',
    'Ждем вас!'
  ];

  var mapContainerElement = document.querySelector('.map__pins');
  var maxX = mapContainerElement.offsetWidth;

  var generateItems = function (count) {
    var items = [];
    for (var i = 0; i < count; i++) {
      var location = {
        x: window.utils.getRandomInt(0, maxX),
        y: window.utils.getRandomInt(MIN_Y, MAX_Y)
      };
      var item = {
        'author': {
          'avatar': 'img/avatars/user0' + window.utils.getRandomInt(1, 8) + '.png',
        },
        'offer': {
          'title': 'Предложение ' + (i + 1).toString(),
          'address': location.x.toString() + ', ' + location.y.toString(),
          'price': window.utils.getRandomInt(1000, 50000),
          'type': window.utils.getSingleRandomItemFromArray(TYPES),
          'rooms': window.utils.getRandomInt(1, 5),
          'guests': window.utils.getRandomInt(1, 10),
          'checkin': window.utils.getSingleRandomItemFromArray(TIME_OPTIONS),
          'checkout': window.utils.getSingleRandomItemFromArray(TIME_OPTIONS),
          'features': window.utils.getMultipleRandomItemsFromArray(FEATURES),
          'description': window.utils.getSingleRandomItemFromArray(DESCRIPTIONS),
          'photos': window.utils.getMultipleRandomItemsFromArray(PHOTOS)
        },
        'location': location
      };
      items.push(item);
    }
    return items;
  };

  window.data = {
    ADS_NUMBER: ADS_NUMBER,

    generateItems: generateItems
  };
})();
