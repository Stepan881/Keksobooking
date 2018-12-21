'use strict';
(function () {
  var ESC_KEYCODE = 27;
  // input disabled
  var disableInput = function (onOff) {
    var inputs = document.querySelectorAll('.ad-form input');
    var selects = document.querySelectorAll('.ad-form select');
    document.querySelector('textarea').disabled = onOff;
    function inp(inpu, on) {
      for (var i = 0; i < inpu.length; i++) {
        inpu[i].disabled = on;
      }
    }
    inp(inputs, onOff);
    inp(selects, onOff);
    document.querySelector('#address').setAttribute('readonly', true);
  };
  disableInput(true);
  // поля формы
  var typeHouse = document.querySelector('#type');
  var priceHouse = document.querySelector('#price');
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');
  var capacityOption = capacity.querySelectorAll('option');

  var PriceHome = {
    'flat': 1000,
    'bungalo': 0,
    'house': 5000,
    'palace': 10000
  };

  var getPriceHouse = function (evt) {
    var value = evt.target.value;
    if (value) {
      priceHouse.min = PriceHome[value];
      priceHouse.value = PriceHome[value];
    }
  };
  var ROOMS = '100';
  var RoomGuest = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var getRoomGuest = function () {
    var value = RoomGuest[roomNumber.value];
    for (var i = 0; i < capacityOption.length; i++) {
      capacityOption[i].removeAttribute('disabled');
      if (value.indexOf(capacityOption[i].value) === -1) {
        capacityOption[i].setAttribute('disabled', true);
      }
      if (roomNumber.value === capacityOption[i].value || roomNumber.value === ROOMS) {
        capacityOption[i].selected = true;
      }
    }
  };

  typeHouse.addEventListener('change', getPriceHouse);
  roomNumber.addEventListener('change', getRoomGuest);

  var MIN_LENGHT_TITL = 30;
  // дополнительная проверка
  var title = document.querySelector('#title');
  title.addEventListener('invalid', function () {
    if (title.validity.tooShort) {
      title.setCustomValidity('Имя должно состоять минимум из 30 символов');
    } else if (title.validity.tooLong) {
      title.setCustomValidity('Имя не должно превышать 100 символов');
    } else if (title.validity.valueMissing) {
      title.setCustomValidity('Обязательное поле');
    } else {
      title.setCustomValidity('');
    }
  });

  title.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value.length < MIN_LENGHT_TITL) {
      target.setCustomValidity('Имя должно состоять минимум из 30 символов');
    } else {
      target.setCustomValidity('');
    }
  });

  // успешная отправка формы
  var main = document.querySelector('main');
  var popapSuccess = document.querySelector('#success');
  var renderSuccess = popapSuccess.content.querySelector('.success').cloneNode(true);

  var popupSuccess = function () {
    main.appendChild(renderSuccess);
    // Закрыть попап Success
    renderSuccess.addEventListener('click', function (evt) {

      if (evt.target.className === 'success') {
        main.removeChild(renderSuccess);
      }
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        main.removeChild(renderSuccess);
      }
    });
  };

  var getForm = document.querySelector('.ad-form');

  getForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(getForm), function () {
      window.data.resetPage();
      popupSuccess();
    }, function (response) {
      window.data.popupError(response);
    });
  });

  var resetBtn = document.querySelector('.ad-form__reset');
  resetBtn.addEventListener('click', function (evt) {
    evt.preventDefault();

    window.data.resetPage();
  });


  window.form = {
    title: title,
    disableInput: disableInput
  };
})();
