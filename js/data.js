'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var main = document.querySelector('main');
  var popapError = document.querySelector('#error');
  var renderError = popapError.content.querySelector('.error').cloneNode(true);

  // ошибки
  function errorCode(code) {
    var cod = '';
    switch (code) {
      case 400:
        cod = 'Неверный запрос';
        break;
      case 401:
        cod = 'Пользователь не авторизован';
        break;
      case 404:
        cod = 'Ничего не найдено';
        break;
      case 500:
        cod = 'Нет соедеинения с сервером';
        break;
      default:
        cod = 'Cтатус ответа: : ' + code;
    }
    return cod;
  }


  var popupError = function (error) {
    console.log(error);
    renderError.querySelector('.error__message').textContent = errorCode(error);
    main.appendChild(renderError);

    // Закрыть попап error
    var popapClose = document.querySelector('.error');
    main.addEventListener('click', function (evt) {
      if (evt.target.className === 'error__button' || evt.target.className === 'error') {
        main.removeChild(popapClose);
      }
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        main.removeChild(popapClose);
      }
    });
  };


  var onError = function (message) {
    popupError(message);
  };

  var onSuccess = function (data) {
    // console.log(data);
    window.getUsers = data;
    var fragment = document.createDocumentFragment();
    for (var l = 0; l < window.getUsers.length; l++) {
      fragment.appendChild(window.pin.renderPin(window.getUsers[l]));
    }

    window.map.mapActiv.classList.remove('map--faded');
    window.pin.mapPins.appendChild(fragment);
    window.form.disableInput(false);
    document.querySelector('.ad-form').classList.remove('ad-form--disabled');

    var inputAddres = document.querySelector('#address');
    inputAddres.value = Math.round(parseInt(window.map.mapPinMain.style.left, 10) + (window.map.mapPinMain.offsetWidth / 2)) + ', ' + Math.round(parseInt(window.map.mapPinMain.style.top, 10) + (window.map.mapPinMain.offsetHeight + 22));

  };

  // Исходное состояние страницы
  var pinPosition = document.querySelector('.map__pin, .map__pin--main');
  var pinPositionLeft = pinPosition.style.left;
  var pinPositionTop = pinPosition.style.top;
  var mapPins = document.querySelector('.map__pins');

  var resetPage = function () {
    var form = document.querySelector('.ad-form');
    var popupMap = document.querySelector('.map__popup');
    var blockPin = document.querySelectorAll('.map__overlay ~ .map__pin');
    for (var i = 1; i < blockPin.length; i++) {
      mapPins.removeChild(blockPin[i]);
    }
    document.querySelector('.ad-form').classList.add('ad-form--disabled');
    window.map.mapActiv.classList.add('map--faded');
    form.reset();
    window.form.disableInput(true);
    pinPosition.style.left = pinPositionLeft;
    pinPosition.style.top = pinPositionTop;
    popupMap.innerHTML = '';
    console.log('resetPage');
  };

  window.data = {
    resetPage: resetPage,
    popupError: popupError,
    onError: onError,
    onSuccess: onSuccess
  };
})();
