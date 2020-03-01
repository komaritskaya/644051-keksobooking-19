'use strict';

(function () {
  var ERROR_FIELD_STYLE = 'border-color: red;';

  var adFormElement = document.querySelector('.ad-form');
  var resetButtonElement = adFormElement.querySelector('.ad-form__reset');
  var adFormFieldsetElements = adFormElement.querySelectorAll('input, textarea, select');
  var titleInputElement = adFormElement.querySelector('#title');
  var addressInputElement = adFormElement.querySelector('#address');
  var priceInputElement = adFormElement.querySelector('#price');
  var roomNumberSelectElement = adFormElement.querySelector('#room_number');
  var typeSelectElement = adFormElement.querySelector('#type');
  var capacitySelectElement = adFormElement.querySelector('#capacity');
  var timeinSelectElement = adFormElement.querySelector('#timein');
  var timeoutSelectElement = adFormElement.querySelector('#timeout');

  var renderAddress = function (coords) {
    addressInputElement.value = coords.x + ', ' + coords.y;
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

  var resetForm = function () {
    adFormElement.reset();
    adFormFieldsetElements.forEach(function (element) {
      element.style.border = null;
    });
  };

  var activateForm = function () {
    adFormElement.classList.remove('ad-form--disabled');
    window.utils.setFormElementsStatus(adFormFieldsetElements, true);
    validateAllFields();
  };

  var deactivateForm = function () {
    resetForm();
    adFormElement.classList.add('ad-form--disabled');
    window.utils.setFormElementsStatus(window.form.adFormFieldsetElements, false);
  };

  adFormElement.addEventListener('change', formChangeHandler);
  adFormElement.addEventListener('input', formInputHandler);

  window.form = {
    adFormElement: adFormElement,
    resetButtonElement: resetButtonElement,
    renderAddress: renderAddress,
    activateForm: activateForm,
    deactivateForm: deactivateForm
  };
})();
