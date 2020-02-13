'use strict';

var mapElement = document.querySelector('.map');
var mapContainerElement = document.querySelector('.map__pins');
var mapPinMainElement = document.querySelector('.map__pin--main');
var adFormElement = document.querySelector('.ad-form');
var adFormFieldsetElements = adFormElement.querySelectorAll('input, textarea, select');
var mapFiltersElement = document.querySelector('.map__filters');
var mapFiltersFieldsetElements = mapFiltersElement.querySelectorAll('input, textarea, select');
var titleInputElement = adFormElement.querySelector('#title');
var priceInputElement = adFormElement.querySelector('#price');
var roomNumberSelectElement = adFormElement.querySelector('#room_number');
var typeSelectElement = adFormElement.querySelector('#type');
var capacitySelectElement = adFormElement.querySelector('#capacity');
var timeinSelectElement = adFormElement.querySelector('#timein');
var timeoutSelectElement = adFormElement.querySelector('#timeout');
var pinTemplateElement = document.querySelector('#pin');

var MAIN_MOUSE_BTN = 0;
var ENTER_KEY = 13;

var ERROR_FIELD_STYLE = 'border-color: red;';

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

var maxX = mapContainerElement.offsetWidth;

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
        'avatar': 'img/avatars/user0' + getRandomInt(1, 8) + '.png',
      },
      'offer': {
        'title': 'Предложение ' + (i + 1).toString(),
        'address': location.x.toString() + ', ' + location.y.toString(),
        'price': getRandomInt(1000, 50000),
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

var renderAllPins = function (arr) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(renderSinglePin(arr[i]));
  }
  mapContainerElement.appendChild(fragment);
};

var setFormElementsStatus = function (collection, status) {
  for (var i = 0; i < collection.length; i++) {
    collection[i].disabled = !status;
  }
};

var activateMap = function () {
  mapElement.classList.remove('map--faded');
  renderAddress(getMainPinCoords(true));
  adFormElement.classList.remove('ad-form--disabled');
  setFormElementsStatus(mapFiltersFieldsetElements, true);
  setFormElementsStatus(adFormFieldsetElements, true);
  renderAllPins(generateItems(ADS_NUMBER));
  validateAllFields();
  mapPinMainElement.removeEventListener('mousedown', mapPinMainElementClickHandler);
  mapPinMainElement.removeEventListener('keydown', mapPinMainElementKeydownHandler);
};

var deactivateMap = function () {
  mapElement.classList.add('map--faded');
  renderAddress(getMainPinCoords(false));
  adFormElement.classList.add('ad-form--disabled');
  setFormElementsStatus(mapFiltersFieldsetElements, false);
  setFormElementsStatus(adFormFieldsetElements, false);
};

var getMainPinCoords = function (isActive) {
  if (isActive) {
    var pintailHeight = window.getComputedStyle(mapPinMainElement, '::after').getPropertyValue('height');
    return {
      x: Math.round(mapPinMainElement.offsetLeft + mapPinMainElement.offsetWidth / 2),
      y: Math.round(mapPinMainElement.offsetTop + mapPinMainElement.offsetHeight + parseInt(pintailHeight, 10))
    };
  } else {
    return {
      x: Math.round(mapPinMainElement.offsetLeft + mapPinMainElement.offsetWidth / 2),
      y: Math.round(mapPinMainElement.offsetTop + mapPinMainElement.offsetHeight / 2)
    };
  }
};

var renderAddress = function (coords) {
  adFormElement.querySelector('#address').value = coords.x + ', ' + coords.y;
};

var checkTitleValidity = function () {
  if (titleInputElement.validity.valueMissing) {
    titleInputElement.setCustomValidity('Необходимо ввести заголовок');
  } else if (titleInputElement.validity.tooShort || titleInputElement.validity.tooLong) {
    titleInputElement.setCustomValidity('Необходимо ввести от 30 до 100 символов');
  } else {
    titleInputElement.setCustomValidity('');
  }
};

var getMinPrice = function (propertyType) {
  switch (propertyType) {
    case 'flat':
      return 1000;
    case 'house':
      return 5000;
    case 'palace':
      return 10000;
    case 'bungalo':
    default:
      return 0;
  }
};

var checkPriceValidity = function () {
  var priceValue = parseInt(priceInputElement.value, 10);
  if (priceInputElement.validity.valueMissing) {
    priceInputElement.setCustomValidity('Необходимо указать цену');
  } else if (priceInputElement.validity.rangeOverflow) {
    priceInputElement.setCustomValidity('Максимальная цена - 1 000 000 руб.');
  } else if (priceValue < getMinPrice(typeSelectElement.value)) {
    priceInputElement.setCustomValidity(
        'Минимальная цена - '
        + getMinPrice(typeSelectElement.value).toString()
        + ' руб.'
    );
  } else {
    priceInputElement.setCustomValidity('');
  }
};

var checkCapacityValidity = function () {
  var roomsNumber = parseInt(roomNumberSelectElement.value, 10);
  var guestsNumber = parseInt(capacitySelectElement.value, 10);
  if (guestsNumber > roomsNumber) {
    capacitySelectElement.setCustomValidity('Слишком много гостей :(');
  } else if (roomsNumber !== 100 && guestsNumber === 0) {
    capacitySelectElement.setCustomValidity('Этот вариант только для гостей');
  } else if (roomsNumber === 100 && guestsNumber !== 0) {
    capacitySelectElement.setCustomValidity('Этот вариант не для гостей');
  } else {
    capacitySelectElement.setCustomValidity('');
  }
};

var validateAllFields = function () {
  checkTitleValidity();
  checkCapacityValidity();
  checkPriceValidity();
};

var formChangeHandler = function (evt) {
  if (evt.target === roomNumberSelectElement || evt.target === capacitySelectElement) {
    checkCapacityValidity();
    setErrorStyle(capacitySelectElement);
  }
  if (evt.target === typeSelectElement) {
    priceInputElement.placeholder = getMinPrice(typeSelectElement.value);
  }
  if (evt.target === timeinSelectElement) {
    timeoutSelectElement.value = timeinSelectElement.value;
  }
  if (evt.target === timeoutSelectElement) {
    timeinSelectElement.value = timeoutSelectElement.value;
  }
};

var formInputHandler = function (evt) {
  checkPriceValidity();
  checkTitleValidity();
  setErrorStyle(evt.target);
};

var setErrorStyle = function (element) {
  if (!element.validity.valid) {
    element.style = ERROR_FIELD_STYLE;
  } else {
    element.style.border = null;
  }
};

var mapPinMainElementClickHandler = function (evt) {
  if (evt.button === MAIN_MOUSE_BTN) {
    activateMap();
  }
};

var mapPinMainElementKeydownHandler = function (evt) {
  if (evt.keyCode === ENTER_KEY) {
    activateMap();
  }
};

deactivateMap();

adFormElement.addEventListener('change', formChangeHandler);
adFormElement.addEventListener('input', formInputHandler);

mapPinMainElement.addEventListener('mousedown', mapPinMainElementClickHandler);
mapPinMainElement.addEventListener('keydown', mapPinMainElementKeydownHandler);
