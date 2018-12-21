'use strict';
(function () {

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

    xhr.timeout = 10000;
    xhr.open(params.type, url, true);
    xhr.send(params.data ? params.data : undefined);
  }

  var load = function (onSuccess, onError) {
    request({
      url: 'https://js.dump.academy/keksobooking/data',
      type: 'GET',
      onSuccess: onSuccess,
      onError: onError
    });
  };

  var upload = function (data, onSuccess, onError) {
    request({
      url: 'https://js.dump.academy/keksobooking',
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
