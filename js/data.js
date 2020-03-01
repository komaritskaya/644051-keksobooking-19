'use strict';

(function () {
  var URL_GET = 'https://js.dump.academy/keksobooking/data';
  var URL_SET = 'https://js.dump.academy/keksobooking/';
  var StatusCode = {
    OK: 200
  };
  var TIMEOUT = 10000;

  var handleRequest = function (method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
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

    xhr.open(method, url);
    if (method === 'POST') {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  var load = function (onSuccess, onError) {
    handleRequest('GET', URL_GET, onSuccess, onError);
  };

  var save = function (data, onSuccess, onError) {
    handleRequest('POST', URL_SET, onSuccess, onError, data);
  };

  window.data = {
    load: load,
    save: save
  };
})();
