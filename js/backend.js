'use strict';
(function () {
  var TIMEOUT = 10000;
  var URL_GET = 'https://js.dump.academy/keksobooking/data';
  var URL_POST = 'https://js.dump.academy/keksobooking';
  function request(params) {
    var url = params.url;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        params.onSuccess(xhr.response);
      } else {
        params.onError(xhr.status);
      }
    });

    xhr.addEventListener('error', function () {
      params.onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      params.onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    xhr.open(params.type, url, true);
    xhr.send(params.data ? params.data : undefined);
  }

  var load = function (onSuccess, onError) {
    request({
      url: URL_GET,
      type: 'GET',
      onSuccess: onSuccess,
      onError: onError
    });
  };

  var upload = function (data, onSuccess, onError) {
    request({
      url: URL_POST,
      type: 'POST',
      onSuccess: onSuccess,
      onError: onError,
      data: data
    });
  };

  window.backend = {
    load: load,
    upload: upload
  };
})();
