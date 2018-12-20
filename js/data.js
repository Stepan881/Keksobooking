'use strict';
(function () {
  var MAX_PIN = 5;
  var ESC_KEYCODE = 27;
  var main = document.querySelector('main');
  var popapError = document.querySelector('#error');
  var renderError = popapError.content.querySelector('.error').cloneNode(true);

  // ошибки
  var ErrorCode = {
    400: 'Неверный запрос',
    401: 'Пользователь не авторизован',
    404: 'Ничего не найдено',
    500: 'Нет соедеинения с сервером',
    undefined: 'Повторите попытку позднее'
  };

  var popupError = function (error) {
    renderError.querySelector('.error__message').textContent = ErrorCode[error];
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
    // сортировка массива DATA
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < MAX_PIN; i++) {
      fragment.appendChild(window.pin.renderPin(window.getUsers[i]));
    }
    // console.log(window.getUsers);
    window.map.mapActiv.classList.remove('map--faded');
    window.pin.mapPins.appendChild(fragment);
    window.form.disableInput(false);
    document.querySelector('.ad-form').classList.remove('ad-form--disabled');
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
  };

  window.data = {
    resetPage: resetPage,
    popupError: popupError,
    onError: onError,
    onSuccess: onSuccess
  };
})();
