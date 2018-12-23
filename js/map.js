'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var mapActiv = document.querySelector('.map');
  var windowPopup = document.querySelector('#card').content.querySelector('.popup');
  document.querySelector('.map__filters-container').insertAdjacentHTML('beforebegin', '<div class="map__popup"></div>');
  var popupMap = document.querySelector('.map__popup');

  var newPopup = windowPopup.cloneNode(true);
  var renderPopup = function (popup) {
    newPopup.querySelector('img').src = popup.author.avatar;
    newPopup.querySelector('.popup__title').textContent = popup.offer.title;
    newPopup.querySelector('.popup__text--address').textContent = popup.offer.address;
    newPopup.querySelector('.popup__text--price').textContent = popup.offer.price + '\u20BD/ночь';
    newPopup.querySelector('.popup__type').textContent = popup.offer.type;
    newPopup.querySelector('.popup__text--capacity').textContent = popup.offer.rooms + ' комнаты для ' + popup.offer.guests + ' гостей';
    newPopup.querySelector('.popup__text--time').textContent = 'Заезд после ' + popup.offer.checkin + ' выезд до ' + popup.offer.checkout;

    var featuresList = newPopup.querySelector('.popup__features');
    featuresList.textContent = '';
    if (popup.offer.features.length !== 0) {
      for (var iIcon = 0; iIcon < popup.offer.features.length; iIcon++) {
        featuresList.insertAdjacentHTML('afterbegin', '<li class="popup__feature popup__feature--' + popup.offer.features[iIcon] + '"></li>');
      }
    }

    var popupPhoto = newPopup.querySelector('.popup__photos');
    popupPhoto.textContent = '';
    for (var iPhoto = 0; iPhoto < popup.offer.photos.length; iPhoto++) {
      popupPhoto.insertAdjacentHTML('beforeend', '<img src="' + popup.offer.photos[iPhoto] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
    }
    return newPopup;
  };

  function removeClassPinActive() {
    var pin = document.querySelector('.map__pin--active');
    if (pin) {
      pin.classList.remove('map__pin--active');
    }
  }

  popupMap.addEventListener('click', function (evt) {
    if (evt.target.className === 'popup__close') {
      popupMap.innerHTML = '';
      removeClassPinActive();
    }
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      popupMap.innerHTML = '';
      removeClassPinActive();
    }
  });

  var mapPinMain = document.querySelector('.map__pin--main');

  var blockPin = document.querySelector('.map__overlay');
  var restrictionsMinY = 130 - mapPinMain.offsetHeight - 22;
  var restrictionsMaxY = 630;
  var restrictionsMinX = 0 - mapPinMain.offsetWidth / 2;
  var restrictionsMaxX = blockPin.offsetWidth - mapPinMain.offsetWidth / 2;

  var getValueInLimit = function (value, min, max) {
    if (value < min) {
      value = min;
    }
    if (value > max) {
      value = max;
    }
    return value;
  };

  var getPinCoords = function (pos) {
    pos.x = getValueInLimit(pos.x, restrictionsMinX, restrictionsMaxX);
    pos.y = getValueInLimit(pos.y, restrictionsMinY, restrictionsMaxY);
    return pos;
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      var resultCoords = {
        x: mapPinMain.offsetLeft - shift.x,
        y: mapPinMain.offsetTop - shift.y
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      getPinCoords(resultCoords);
      mapPinMain.style.top = resultCoords.y + 'px';
      mapPinMain.style.left = resultCoords.x + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.map = {
    mapPinMain: mapPinMain,
    mapActiv: mapActiv,
    renderPopup: renderPopup,
    popupMap: popupMap
  };
})();
