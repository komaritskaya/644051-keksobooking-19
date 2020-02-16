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
  };

  window.error = {
    openErrorPopup: openErrorPopup
  };
})();

