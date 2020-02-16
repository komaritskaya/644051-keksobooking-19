'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mapContainerElement = document.querySelector('.map__pins');
  var mapPinMainElement = document.querySelector('.map__pin--main');
  var mapFiltersElement = document.querySelector('.map__filters');
  var mapFiltersFieldsetElements = mapFiltersElement.querySelectorAll('input, textarea, select');

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

  var dataSuccessHandler = function (arr) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arr.length; i++) {
      fragment.appendChild(window.pin.renderSinglePin(arr[i]));
    }
    mapContainerElement.appendChild(fragment);
  };

  var dataErrorHandler = function (errorMessage) {
    window.error.openErrorPopup(errorMessage, activateMap);
  };

  var setFormElementsStatus = function (collection, status) {
    for (var i = 0; i < collection.length; i++) {
      collection[i].disabled = !status;
    }
  };

  var activateMap = function () {
    mapElement.classList.remove('map--faded');
    window.form.renderAddress(getMainPinCoords(true));
    window.form.adFormElement.classList.remove('ad-form--disabled');
    setFormElementsStatus(mapFiltersFieldsetElements, true);
    setFormElementsStatus(window.form.adFormFieldsetElements, true);
    window.data.load(dataSuccessHandler, dataErrorHandler);
    window.form.validateAllFields();
    mapPinMainElement.removeEventListener('mousedown', mapPinMainElementClickHandler);
    mapPinMainElement.removeEventListener('keydown', mapPinMainElementKeydownHandler);
  };

  var deactivateMap = function () {
    mapElement.classList.add('map--faded');
    window.form.renderAddress(getMainPinCoords(false));
    window.form.adFormElement.classList.add('ad-form--disabled');
    setFormElementsStatus(mapFiltersFieldsetElements, false);
    setFormElementsStatus(window.form.adFormFieldsetElements, false);
  };

  var mapPinMainElementClickHandler = function (evt) {
    if (evt.button === window.utils.MAIN_MOUSE_BTN) {
      activateMap();
    }
  };

  var mapPinMainElementKeydownHandler = function (evt) {
    if (evt.keyCode === window.utils.ENTER_KEY) {
      activateMap();
    }
  };

  deactivateMap();

  mapPinMainElement.addEventListener('mousedown', mapPinMainElementClickHandler);
  mapPinMainElement.addEventListener('keydown', mapPinMainElementKeydownHandler);

  window.map = {
    mapContainerElement: mapContainerElement
  };
})();