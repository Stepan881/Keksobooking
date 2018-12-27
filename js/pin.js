'use strict';
(function () {
  var pinCopy = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var WIDTH_SMALL_PIN = 50;
  var HEIGHT_SMALL_PIN = 70;
  function renderPin(pin) {
    var pinElement = pinCopy.cloneNode(true);
    pinElement.style.left = (pin.location.x - WIDTH_SMALL_PIN / 2) + 'px';
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
  var btnFormSubmit = document.querySelector('.ad-form__submit');
  function pinGenerationClickHandler() {
    posPin();
    if (!window.getUsers) {
      window.backend.load(window.data.onSuccess, window.data.onError);
      window.sort.clearPin();
      btnFormSubmit.disabled = false;
    } else {
      window.sort.renderFilter();
      btnFormSubmit.disabled = false;
    }

  }

  var mapPinMain = document.querySelector('.map__pin--main');
  mapPinMain.addEventListener('click', pinGenerationClickHandler);

  function popupTogglerClickHandler(evt) {
    var classList = evt.target.classList;

    if (classList.contains('map__pin') && !classList.contains('map__pin--main')) {
      getMapPin(window.getUsers, evt);
      var popupClose = document.querySelector('.popup__close');

      popupClose.addEventListener('click', window.map.closeMapBtnClickHandler);
      document.addEventListener('keydown', window.map.closeMapByEscHandler);

    }
  }

  function getMapPin(data, evt) {
    var pinAlt = evt.target.querySelector('img').alt;
    for (var i = 0; i < data.length; i++) {
      if (pinAlt === data[i].offer.title) {
        window.map.popupMap.appendChild(window.map.renderPopup(data[i]));
      }
    }
    changeActivePin(evt.target);
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
    popupTogglerClickHandler: popupTogglerClickHandler,
    renderPin: renderPin,
    mapPins: mapPins
  };
})();
