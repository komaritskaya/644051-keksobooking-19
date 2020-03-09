'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mapContainerElement = document.querySelector('.map__pins');
  var mapPinMainElement = document.querySelector('.map__pin--main');
  var mapFiltersElement = document.querySelector('.map__filters');
  var mapFiltersFieldsetElements = mapFiltersElement.querySelectorAll('input, textarea, select');

  var pins = [];
  var isActive = false;

  var MainPinInitialPosition = {
    left: mapPinMainElement.style.left,
    top: mapPinMainElement.style.top
  };

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

  var getMainPinOffsets = function () {
    var pinWidth = mapPinMainElement.offsetWidth;
    var pinHeight = isActive ? mapPinMainElement.offsetHeight + parseInt(pintailHeight, 10) : mapPinMainElement.offsetHeight;
    return {
      pinOffsetWidth: pinWidth / 2,
      pinOffsetHeight: isActive ? pinHeight : pinHeight / 2
    };
  };

  var getMainPinCoords = function () {
    return {
      x: Math.round(mapPinMainElement.offsetLeft + getMainPinOffsets().pinOffsetWidth),
      y: Math.round(mapPinMainElement.offsetTop + getMainPinOffsets().pinOffsetHeight)
    };
  };

  var dataSuccessHandler = function (newPins) {
    pins = newPins;
    updatePins(pins);
  };

  var dataErrorHandler = function (errorMessage) {
    window.message.openErrorPopup(errorMessage, activatePage);
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
    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      pin.remove();
    });
  };

  var returnMainPinToInitial = function () {
    mapPinMainElement.style.left = MainPinInitialPosition.left;
    mapPinMainElement.style.top = MainPinInitialPosition.top;
  };

  var activateMap = function () {
    mapElement.classList.remove('map--faded');
    window.utils.setFormElementsStatus(mapFiltersFieldsetElements, true);
    mapPinMainElement.removeEventListener('keydown', mapPinMainElementKeyDownHandler);
  };

  var deactivateMap = function () {
    clearPins();
    window.card.closeCard();
    mapElement.classList.add('map--faded');
    returnMainPinToInitial();
    window.utils.setFormElementsStatus(mapFiltersFieldsetElements, false);
  };

  var activatePage = function () {
    isActive = true;
    activateMap();
    window.form.activateForm();
    window.form.renderAddress(getMainPinCoords(true));
    window.data.load(dataSuccessHandler, dataErrorHandler);
  };

  var deactivatePage = function () {
    isActive = false;
    deactivateMap();
    window.form.deactivateForm();
    window.form.renderAddress(getMainPinCoords(false));
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
          mapPinMainElement.style.left = (CoordsLimit.X.MIN - getMainPinOffsets().pinOffsetWidth).toString() + 'px';
        } else if ((currentCoords.x - shift.x) > CoordsLimit.X.MAX) {
          mapPinMainElement.style.left = (CoordsLimit.X.MAX - getMainPinOffsets().pinOffsetWidth).toString() + 'px';
        } else {
          mapPinMainElement.style.left = (mapPinMainElement.offsetLeft - shift.x).toString() + 'px';
        }

        if ((currentCoords.y - shift.y) < CoordsLimit.Y.MIN) {
          mapPinMainElement.style.top = (CoordsLimit.Y.MIN - getMainPinOffsets().pinOffsetHeight).toString() + 'px';
        } else if ((currentCoords.y - shift.y) > CoordsLimit.Y.MAX) {
          mapPinMainElement.style.top = (CoordsLimit.Y.MAX - getMainPinOffsets().pinOffsetHeight).toString() + 'px';
        } else {
          mapPinMainElement.style.top = (mapPinMainElement.offsetTop - shift.y).toString() + 'px';
        }
      };

      var mouseUpHandler = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

        if (dragged) {
          var clickHandlerPreventDefault = function (clickEvt) {
            clickEvt.preventDefault();
            mapPinMainElement.removeEventListener('click', clickHandlerPreventDefault);
          };
          mapPinMainElement.addEventListener('click', clickHandlerPreventDefault);
        } else {
          if (!isActive) {
            activatePage();
            var currentCoords = getMainPinCoords();

            if (currentCoords.x < CoordsLimit.X.MIN) {
              mapPinMainElement.style.left = (CoordsLimit.X.MIN - getMainPinOffsets().pinOffsetWidth).toString() + 'px';
            } else if (currentCoords.x > CoordsLimit.X.MAX) {
              mapPinMainElement.style.left = (CoordsLimit.X.MAX - getMainPinOffsets().pinOffsetWidth).toString() + 'px';
            }

            if (currentCoords.y < CoordsLimit.Y.MIN) {
              mapPinMainElement.style.top = (CoordsLimit.Y.MIN - getMainPinOffsets().pinOffsetHeight).toString() + 'px';
            } else if (currentCoords.y > CoordsLimit.Y.MAX) {
              mapPinMainElement.style.top = (CoordsLimit.Y.MAX - getMainPinOffsets().pinOffsetHeight).toString() + 'px';
            }
          }
        }
        window.form.renderAddress(getMainPinCoords(isActive));
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    }
  };

  var mapPinMainElementKeyDownHandler = function (evt) {
    if (evt.keyCode === window.utils.ENTER_KEY) {
      activatePage();
    }
  };

  var adFormSuccessSubmitHandler = function () {
    window.message.openSuccessPopup(deactivatePage);
  };

  var adFormErrorSubmitHandler = function (errorMessage) {
    window.message.openErrorPopup(errorMessage, deactivatePage);
  };

  deactivatePage();

  mapPinMainElement.addEventListener('mousedown', mapPinMainElementMouseDownHandler);
  mapPinMainElement.addEventListener('keydown', mapPinMainElementKeyDownHandler);

  window.form.adFormElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.data.save(new FormData(window.form.adFormElement), adFormSuccessSubmitHandler, adFormErrorSubmitHandler);
  });

  window.form.resetButtonElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    deactivatePage();
  });

  window.form.resetButtonElement.addEventListener('keydown', function (evt) {
    evt.preventDefault();
    if (evt.keyCode === window.utils.ENTER_KEY) {
      deactivatePage();
    }
  });

  window.map = {
    mapFiltersElement: mapFiltersElement,
    filterPins: filterPins
  };
})();
