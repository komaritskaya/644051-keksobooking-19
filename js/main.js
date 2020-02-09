'use strict';

// 1. Генерация массива JS-объектов со случайными данными

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
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var map = document.querySelector('.map');
var mapContainer = document.querySelector('.map__pins');
var maxX = mapContainer.offsetWidth;

var getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomBool = function () {
  return Math.random() < 0.5;
};

var getSingleRandomItemFromArray = function (arr) {
  var index = getRandomInt(0, arr.length - 1);
  return arr[index];
};

var getMultipleRandomItemsFromArray = function (arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (getRandomBool()) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
};

var generateItems = function (count) {
  var items = [];
  for (var i = 0; i < count; i++) {
    var location = {
      x: getRandomInt(0, maxX),
      y: getRandomInt(MIN_Y, MAX_Y)
    };
    var item = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1).toString() + '.png',
      },
      'offer': {
        'title': 'Предложение ' + (i + 1).toString(),
        'address': location.x.toString() + ', ' + location.y.toString(),
        'price': getRandomInt(1, 5) * 10000,
        'type': getSingleRandomItemFromArray(TYPES),
        'rooms': getRandomInt(1, 5),
        'guests': getRandomInt(1, 10),
        'checkin': getSingleRandomItemFromArray(TIME_OPTIONS),
        'checkout': getSingleRandomItemFromArray(TIME_OPTIONS),
        'features': getMultipleRandomItemsFromArray(FEATURES),
        'description': getSingleRandomItemFromArray(DESCRIPTIONS),
        'photos': getMultipleRandomItemsFromArray(PHOTOS)
      },
      'location': location
    };
    items.push(item);
  }
  return items;
};

// 2. Переключение карты в активное состояние

map.classList.remove('map--faded');

// 3. Создание DOM-элементов, соответствующих меткам карты, и заполнение их данными из массива

var pinTemplate = document.querySelector('#pin');

var renderSinglePin = function (item) {
  var itemNode = pinTemplate.content.cloneNode(true);
  var pinBtn = itemNode.querySelector('.map__pin');
  var pinImg = itemNode.querySelector('img');
  pinBtn.style.left = (item.location.x - PIN_WIDTH / 2).toString() + 'px';
  pinBtn.style.top = (item.location.y - PIN_HEIGHT).toString() + 'px';
  pinImg.src = item.author.avatar;
  pinImg.alt = item.offer.title;
  return itemNode;
};

var renderAllPins = function (arr) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(renderSinglePin(arr[i]));
  }
  mapContainer.appendChild(fragment);
};

renderAllPins(generateItems(ADS_NUMBER));
