'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mapContainerElement = document.querySelector('.map__pins');
  var mapPinMainElement = document.querySelector('.map__pin--main');
  var mapFiltersElement = document.querySelector('.map__filters');
  var mapFiltersFieldsetElements = mapFiltersElement.querySelectorAll('input, textarea, select');

  var pins = [];
  var isActive = false;

  var CoordsLimit = {
    X: {
      MIN: 0,
      MAX: mapContainerElement.offsetWidth
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  };

  var pintailHeight = window.getComputedStyle(mapPinMainElement, '::after').getPropertyValue('height');
  var pinWidth = mapPinMainElement.offsetWidth;
  var pinHeight = isActive ? mapPinMainElement.offsetHeight + parseInt(pintailHeight, 10) : mapPinMainElement.offsetHeight;
  var pinOffsetWidth = pinWidth / 2;
  var pinOffsetHeight = isActive ? pinHeight : pinHeight / 2;

  var getMainPinCoords = function () {
    return {
      x: Math.round(mapPinMainElement.offsetLeft + pinOffsetWidth),
      y: Math.round(mapPinMainElement.offsetTop + pinOffsetHeight)
    };
  };

  var dataSuccessHandler = function (newPins) {
    pins = newPins;
    updatePins(pins);
  };

  var dataErrorHandler = function (errorMessage) {
    window.error.openErrorPopup(errorMessage, activateMap);
  };

  var filterPins = function (callback) {
    var filteredPins = pins.filter(function (pin) {
      return callback(pin);
    });
    updatePins(filteredPins);
  };

  var updatePins = function (newPins) {
    clearPins();
    window.render.renderPins(newPins);
  };

  var clearPins = function () {
    mapContainerElement.childNodes.forEach(function (node) {
      if (node !== mapPinMainElement) {
        mapContainerElement.removeChild(node);
      }
    });
  };

  var setFormElementsStatus = function (collection, status) {
    for (var i = 0; i < collection.length; i++) {
      collection[i].disabled = !status;
    }
  };

  var activateMap = function () {
    mapElement.classList.remove('map--faded');
    isActive = true;
    window.form.renderAddress(getMainPinCoords());
    window.form.adFormElement.classList.remove('ad-form--disabled');
    setFormElementsStatus(mapFiltersFieldsetElements, true);
    setFormElementsStatus(window.form.adFormFieldsetElements, true);
    window.data.load(dataSuccessHandler, dataErrorHandler);
    window.form.validateAllFields();
    mapPinMainElement.removeEventListener('keydown', mapPinMainElementKeyDownHandler);
  };

  var deactivateMap = function () {
    mapElement.classList.add('map--faded');
    isActive = false;
    window.form.renderAddress(getMainPinCoords());
    window.form.adFormElement.classList.add('ad-form--disabled');
    setFormElementsStatus(mapFiltersFieldsetElements, false);
    setFormElementsStatus(window.form.adFormFieldsetElements, false);
  };

  var mapPinMainElementMouseDownHandler = function (evt) {
    if (evt.button === window.utils.MAIN_MOUSE_BTN) {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var dragged = false;

      var mouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();
        dragged = true;

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        var currentCoords = getMainPinCoords();

        if ((currentCoords.x - shift.x) < CoordsLimit.X.MIN) {
          mapPinMainElement.style.left = (CoordsLimit.X.MIN - pinOffsetWidth).toString() + 'px';
        } else if ((currentCoords.x - shift.x) > CoordsLimit.X.MAX) {
          mapPinMainElement.style.left = (CoordsLimit.X.MAX - pinOffsetWidth).toString() + 'px';
        } else {
          mapPinMainElement.style.left = (mapPinMainElement.offsetLeft - shift.x).toString() + 'px';
        }

        if ((currentCoords.y - shift.y) < CoordsLimit.Y.MIN) {
          mapPinMainElement.style.top = (CoordsLimit.Y.MIN - pinOffsetHeight).toString() + 'px';
        } else if ((currentCoords.y - shift.y) > CoordsLimit.Y.MAX) {
          mapPinMainElement.style.top = (CoordsLimit.Y.MAX - pinOffsetHeight).toString() + 'px';
        } else {
          mapPinMainElement.style.top = (mapPinMainElement.offsetTop - shift.y).toString() + 'px';
        }
      };

      var mouseUpHandler = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

        if (dragged) {
          var onClickPreventDefault = function (clickEvt) {
            clickEvt.preventDefault();
            mapPinMainElement.removeEventListener('click', onClickPreventDefault);
          };
          mapPinMainElement.addEventListener('click', onClickPreventDefault);
        } else {
          if (!isActive) {
            activateMap();
          }
        }
        window.form.renderAddress(getMainPinCoords());
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    }
  };

  var mapPinMainElementKeyDownHandler = function (evt) {
    if (evt.keyCode === window.utils.ENTER_KEY) {
      activateMap();
    }
  };

  deactivateMap();

  mapPinMainElement.addEventListener('mousedown', mapPinMainElementMouseDownHandler);
  mapPinMainElement.addEventListener('keydown', mapPinMainElementKeyDownHandler);

  window.map = {
    mapFiltersElement: mapFiltersElement,
    filterPins: filterPins
  };
})();
