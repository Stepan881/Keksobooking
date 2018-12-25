'use strict';
(function () {
  var pinCopy = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var WIDTH_SMALL_PIN = 50;
  var HEIGHT_SMALL_PIN = 70;
  function renderPin(pin) {
    var pinElement = pinCopy.cloneNode(true);
    pinElement.style.left = (pin.location.x - WIDTH_SMALL_PIN) + 'px';
    pinElement.style.top = (pin.location.y - HEIGHT_SMALL_PIN) + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;
    pinElement.querySelector('img').style.pointerEvents = 'none';
    return pinElement;
  }

  function posPin() {
    var inputAddres = document.querySelector('#address');
    inputAddres.value = Math.round(parseInt(window.map.mapPinMain.style.left, 10) + (window.map.mapPinMain.offsetWidth / 2)) + ', ' + Math.round(parseInt(window.map.mapPinMain.style.top, 10) + (window.map.mapPinMain.offsetHeight + 22));
  }

  var mapPinMain = document.querySelector('.map__pin--main');
  mapPinMain.addEventListener('click', function () {
    posPin();
    if (!window.getUsers) {
      window.backend.load(window.data.onSuccess, window.data.onError);
      window.sort.clearPin();
    } else {
      window.sort.renderFilter();
    }
  });

  var map = document.querySelector('.map');
  map.addEventListener('click', function (event) {
    var classList = event.target.classList;
    if (classList.contains('map__pin') && !classList.contains('map__pin--main')) {
      getMapPin(window.getUsers);
    }
  });

  function getMapPin(data) {
    var pinAlt = event.target.querySelector('img').alt;
    for (var i = 0; i < data.length; i++) {
      if (pinAlt === data[i].offer.title) {
        window.map.popupMap.appendChild(window.map.renderPopup(data[i]));
      }
    }
    changeActivePin(event.target);
  }

  var changeActivePin = function (pin) {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
    if (activePin !== pin) {
      pin.classList.add('map__pin--active');
    }
  };

  window.pin = {
    renderPin: renderPin,
    mapPins: mapPins
  };
})();
