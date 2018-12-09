'use strict';
(function () {

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
  var getPriceHouse = function (evt) {
    var value = evt.target.value;
    switch (value) {
      case 'flat':
        priceHouse.min = 1000;
        priceHouse.value = 1000;
        break;
      case 'bungalo':
        priceHouse.min = 0;
        priceHouse.value = 0;
        break;
      case 'house':
        priceHouse.min = 5000;
        priceHouse.value = 5000;
        break;
      case 'palace':
        priceHouse.min = 10000;
        priceHouse.value = 10000;
        break;
    }
  };

  var getRoom = function (evt) {
    var value = evt.target.value;
    switch (value) {
      case '1':
        capacityOption[0].disabled = true;
        capacityOption[1].disabled = true;
        capacityOption[2].disabled = false;
        capacityOption[2].selected = true;
        capacityOption[3].disabled = true;
        break;
      case '2':
        capacityOption[0].disabled = true;
        capacityOption[1].disabled = false;
        capacityOption[2].disabled = false;
        capacityOption[2].selected = true;
        capacityOption[3].disabled = true;
        break;
      case '3':
        capacityOption[0].disabled = false;
        capacityOption[1].disabled = false;
        capacityOption[2].disabled = false;
        capacityOption[2].selected = true;
        capacityOption[3].disabled = true;
        break;
      case '100':
        capacityOption[0].disabled = false;
        capacityOption[1].disabled = false;
        capacityOption[2].disabled = false;
        capacityOption[3].disabled = true;
        capacityOption[3].selected = true;
        break;
    }
  };
  typeHouse.addEventListener('change', getPriceHouse);
  roomNumber.addEventListener('change', getRoom);

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
    if (target.value.length < 30) {
      target.setCustomValidity('Имя должно состоять минимум из 30 символов');
    } else {
      target.setCustomValidity('');
    }
  });
  window.form = {
    disableInput: disableInput
  };
})();
