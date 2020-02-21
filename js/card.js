'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mapFiltersContainerElement = document.querySelector('.map__filters-container');
  var cardTemplateElement = document.querySelector('#card');

  var getRoomsText = function (number) {
    if (number % 10 === 1) {
      return number.toString() + ' комната';
    } else if (number % 10 > 1 && number % 10 < 5) {
      return number.toString() + ' комнаты';
    } else {
      return number.toString() + ' комнат';
    }
  }

  var getGuestsText = function (number) {
    if (number % 10 === 1) {
      return 'для ' + number.toString() + ' гостя';
    } else {
      return 'для ' + number.toString() + ' гостей';
    }
  }

  var renderCard = function (item) {
    var cardElement = cardTemplateElement.content.cloneNode(true);
    console.log(cardElement);
    var featuresParentElement = cardElement.querySelector('.popup__features');
    console.log(featuresParentElement);
    var featuresFragmentElement = document.createDocumentFragment();
    var photosParentElement = document.querySelector('.popup__photos');
    var photosFragmentElement = document.createDocumentFragment();

    cardElement.querySelector('.popup__avatar').src = item.author.avatar;
    cardElement.querySelector('.popup__title').textContent = item.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = item.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = item.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = item.offer.type;
    cardElement.querySelector('.popup__text--capacity').textContent =
    getRoomsText(item.offer.rooms) + ' ' + getGuestsText(item.offer.guests);
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = item.offer.description;

    // window.utils.removeChildren(featuresParentElement);
    // item.offer.features.forEach(function (feature) {
    //   var featuresItemElement = document.createElement('li');
    //   featuresItemElement.classList.add('popup__feature');
    //   featuresItemElement.classList.add('popup__feature--' + feature);
    //   featuresFragmentElement.appendChild(featuresItemElement);
    // });
    // featuresParentElement.appendChild(featuresFragmentElement);

    // window.utils.removeChildren(photosParentElement);
    // item.offer.photos.forEach(function (photo) {
    //   var photosItemElement = document.createElement('img');
    //   photosItemElement.classList.add('popup__photo');
    //   photosItemElement.width = '45';
    //   photosItemElement.height = '40';
    //   photosItemElement.alt = 'Фотография жилья';
    //   photosItemElement.src = photo;
    //   photosFragmentElement.appendChild(photosItemElement);
    // });
    // photosParentElement.appendChild(photosFragmentElement);

    mapElement.insertBefore(cardElement, mapFiltersContainerElement);
  };

  window.card = {
    renderCard: renderCard
  };
})();
