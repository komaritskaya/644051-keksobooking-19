'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';
  var statusCode = {
    OK: 200
  };
  var TIMEOUT = 10000;

  var load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === statusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Ошибка ' + xhr.status + ': ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open('GET', URL);
    xhr.send();
  };

  window.data = {
    load: load,
  };
})();
