'use strict';

(function () {
  var openErrorPopup = function (errorMessage, callback) {
    var errorTemplateElement = document.querySelector('#error');
    var errorPopupElement = errorTemplateElement.content.cloneNode(true);
    var errorPopupTextElement = errorPopupElement.querySelector('.error__message');
    var errorPopupBtnElement = errorPopupElement.querySelector('.error__button');
    errorPopupTextElement.textContent = errorMessage;
    errorPopupBtnElement.textContent = 'Попробовать снова';
    document.querySelector('main').appendChild(errorPopupElement);
    errorPopupBtnElement.addEventListener('click', function () {
      document.querySelector('main').removeChild(document.querySelector('.error'));
      callback();
    });
    errorPopupBtnElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.utils.ENTER_KEY) {
        document.querySelector('main').removeChild(document.querySelector('.error'));
        callback();
      }
    });
  };

  var openSuccessPopup = function (callback) {
    var successTemplateElement = document.querySelector('#success');
    var successPopupElement = successTemplateElement.content.cloneNode(true);
    document.querySelector('main').appendChild(successPopupElement);

    var escPressHandler = function (evt) {
      if (evt.keyCode === window.utils.ESC_KEY) {
        document.querySelector('main').removeChild(document.querySelector('.success'));
        document.removeEventListener('keydown', escPressHandler);
        callback();
      }
    };

    document.addEventListener('keydown', escPressHandler);
  };

  window.message = {
    openErrorPopup: openErrorPopup,
    openSuccessPopup: openSuccessPopup
  };
})();

