'use strict';
(function () {
  var TIMEOUT = 5000;
  var URL_GET = 'https://js.dump.academy/keksobooking/data';
  var URL_POST = 'https://js.dump.academy/keksobooking';
  var SUCCESS = 200;

  function request(params) {
    var url = params.url;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS) {
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

  function load(onSuccess, onError) {
    request({
      url: URL_GET,
      type: 'GET',
      onSuccess: onSuccess,
      onError: onError
    });
  }

  function upload(data, onSuccess, onError) {
    request({
      url: URL_POST,
      type: 'POST',
      onSuccess: onSuccess,
      onError: onError,
      data: data
    });
  }

  window.backend = {
    load: load,
    upload: upload
  };
})();
