'use strict';
(function () {
  var MIN_LENGHT_TITL = 30;
  var ESC_KEYCODE = 27;
  var ROOMS = '100';
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
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
    document.querySelector('#address').readOnly = true;
  };

  disableInput(true);
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

  function changePriceHouseHandler(evt) {
    var value = evt.target.value;
    if (value) {
      priceHouse.min = PriceHome[value];
      priceHouse.placeholder = PriceHome[value];
    }
  }

  var RoomGuest = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  function changeRoomGuestHandler() {
    var value = RoomGuest[roomNumber.value];
    for (var i = 0; i < capacityOption.length; i++) {
      capacityOption[i].disabled = false;
      if (value.indexOf(capacityOption[i].value) === -1) {
        capacityOption[i].disabled = true;
      }
      if (roomNumber.value === capacityOption[i].value || roomNumber.value === ROOMS) {
        capacityOption[i].selected = true;
      }
    }
  }

  typeHouse.addEventListener('change', changePriceHouseHandler);
  roomNumber.addEventListener('change', changeRoomGuestHandler);

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

  var main = document.querySelector('main');
  var successClone = document.querySelector('#success');
  var successElement = successClone.content.querySelector('.success').cloneNode(true);
  function popupSuccess() {
    main.appendChild(successElement);
    main.addEventListener('click', closeOverlayClickHandler);
    document.addEventListener('keydown', closeOverlayByEscHandler);
  }

  function closeOverlayClickHandler(evt) {
    if (evt.target.className === 'success') {
      main.removeChild(successElement);
      main.removeEventListener('click', closeOverlayClickHandler);
      document.removeEventListener('keydown', closeOverlayByEscHandler);
    }
  }

  function closeOverlayByEscHandler(evt) {
    var success = document.querySelector('.success');
    if ((evt.keyCode === ESC_KEYCODE) && (success)) {
      main.removeChild(successElement);
      document.removeEventListener('keydown', closeOverlayByEscHandler);
      main.removeEventListener('click', closeOverlayClickHandler);
    }
  }

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

  function changeTimeHandler(evt) {
    timeIn.value = evt.target.value;
    timeOut.value = evt.target.value;
  }

  timeIn.addEventListener('change', changeTimeHandler);
  timeOut.addEventListener('change', changeTimeHandler);

  window.form = {
    RoomGuest: RoomGuest,
    title: title,
    disableInput: disableInput
  };
})();
