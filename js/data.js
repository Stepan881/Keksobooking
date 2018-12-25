'use strict';
(function () {
  var MAX_PIN = 5;
  var ESC_KEYCODE = 27;
  var main = document.querySelector('main');
  var errorElement = document.querySelector('#error').content.querySelector('.error');
  var AVATAR_FORM_DEFAULT = document.querySelector('.ad-form-header__preview').querySelector('img');
  var AVATAR_FORM_DEFAULT_SRC = AVATAR_FORM_DEFAULT.src;
  var ErrorCode = {
    400: 'Неверный запрос',
    401: 'Пользователь не авторизован',
    404: 'Ничего не найдено',
    500: 'Нет соедеинения с сервером',
    undefined: 'Повторите попытку позднее'
  };

  function popupError(error) {
    errorElement.querySelector('.error__message').textContent = ErrorCode[error] || error;
    main.appendChild(errorElement);
  }

  main.addEventListener('click', function (evt) {
    if (evt.target.className === 'error__button' || evt.target.className === 'error') {
      var renderPopapError = main.querySelector('.error');
      main.removeChild(renderPopapError);
    }
  });

  document.addEventListener('keydown', function (evt) {
    var classError = document.querySelector('.error');
    if ((evt.keyCode === ESC_KEYCODE) && (classError)) {
      var renderPopapError = main.querySelector('.error');
      main.removeChild(renderPopapError);
    }
  });


  function onError(message) {
    popupError(message);
  }

  function onSuccess(data) {
    window.getUsers = data;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < MAX_PIN; i++) {
      fragment.appendChild(window.pin.renderPin(window.getUsers[i]));
    }

    window.map.mapActiv.classList.remove('map--faded');
    window.pin.mapPins.appendChild(fragment);
    window.form.disableInput(false);
    document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  }

  var pinPosition = document.querySelector('.map__pin, .map__pin--main');
  var pinPositionLeft = pinPosition.style.left;
  var pinPositionTop = pinPosition.style.top;
  var mapPins = document.querySelector('.map__pins');

  function resetPage() {
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

    AVATAR_FORM_DEFAULT.src = AVATAR_FORM_DEFAULT_SRC;
    var photoContainer = document.querySelector('.ad-form__photo-container');
    var formPhoto = document.querySelectorAll('.ad-form__photo-reset');
    for (i = 0; i < formPhoto.length; i++) {
      photoContainer.removeChild(formPhoto[i]);
    }
  }

  window.data = {
    resetPage: resetPage,
    popupError: popupError,
    onError: onError,
    onSuccess: onSuccess
  };
})();
