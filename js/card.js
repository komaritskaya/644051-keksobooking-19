'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mapFiltersContainerElement = document.querySelector('.map__filters-container');
  var cardTemplateElement = document.querySelector('#card');

  var propertyTypeMap = {
    'house': 'Дом',
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'palace': 'Дворец'
  };

  var getRoomsText = function (number) {
    if (number % 10 === 1) {
      return number.toString() + ' комната';
    } else if (number % 10 > 1 && number % 10 < 5) {
      return number.toString() + ' комнаты';
    } else {
      return number.toString() + ' комнат';
    }
  };

  var getGuestsText = function (number) {
    if (number % 10 === 1) {
      return 'для ' + number.toString() + ' гостя';
    } else {
      return 'для ' + number.toString() + ' гостей';
    }
  };

  var renderCard = function (item) {
    closeCard();
    var cardElement = cardTemplateElement.content.cloneNode(true);
    var featuresParentElement = cardElement.querySelector('.popup__features');
    var featuresFragmentElement = document.createDocumentFragment();
    var photosParentElement = cardElement.querySelector('.popup__photos');
    var photosFragmentElement = document.createDocumentFragment();

    cardElement.querySelector('.popup__avatar').src = item.author.avatar;
    cardElement.querySelector('.popup__title').textContent = item.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = item.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = item.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = propertyTypeMap[item.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent =
    getRoomsText(item.offer.rooms) + ' ' + getGuestsText(item.offer.guests);
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = item.offer.description;

    window.utils.removeChildren(featuresParentElement);
    item.offer.features.forEach(function (feature) {
      var featuresItemElement = document.createElement('li');
      featuresItemElement.classList.add('popup__feature');
      featuresItemElement.classList.add('popup__feature--' + feature);
      featuresFragmentElement.appendChild(featuresItemElement);
    });
    featuresParentElement.appendChild(featuresFragmentElement);

    window.utils.removeChildren(photosParentElement);
    item.offer.photos.forEach(function (photo) {
      var photosItemElement = document.createElement('img');
      photosItemElement.classList.add('popup__photo');
      photosItemElement.style.width = '45px';
      photosItemElement.style.height = '40px';
      photosItemElement.alt = 'Фотография жилья';
      photosItemElement.src = photo;
      photosFragmentElement.appendChild(photosItemElement);
    });
    photosParentElement.appendChild(photosFragmentElement);

    cardElement.querySelector('.popup__close').addEventListener('click', function () {
      closeCard();
    });
    cardElement.querySelector('.popup__close').addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.utils.ENTER_KEY) {
        closeCard();
      }
    });
    document.addEventListener('keydown', escPressHandler);

    mapElement.insertBefore(cardElement, mapFiltersContainerElement);
  };

  var escPressHandler = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEY) {
      closeCard();
    }
  };

  var closeCard = function () {
    var card = document.querySelector('.map__card');
    if (card) {
      card.remove();
      document.removeEventListener('keydown', escPressHandler);
    }
  };

  window.card = {
    renderCard: renderCard,
    closeCard: closeCard
  };
})();
