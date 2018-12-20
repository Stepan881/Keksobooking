'use strict';
(function () {
  // создание Pin
  var pinCopy = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var pinImg = mapPins.getElementsByTagName('img')[0];
  var renderPin = function (pin) {
    var pinElement = pinCopy.cloneNode(true);
    pinElement.style.left = (pin.location.x - (pinImg.width / 2)) + 'px';
    pinElement.style.top = (pin.location.y - (pinImg.height / 2)) + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;
    pinElement.querySelector('img').style.pointerEvents = 'none';
    return pinElement;
  };

  // нажатие на pin
  document.querySelector('.map__pin, .map__pin--main').addEventListener('click', function () {
    if (!window.getUsers) {
      window.backend.load(window.data.onSuccess, window.data.onError);
      window.sort.clearPin();
    }
    // click - отрисовать пины');
    var inputAddres = document.querySelector('#address');
    inputAddres.value = Math.round(parseInt(window.map.mapPinMain.style.left, 10) + (window.map.mapPinMain.offsetWidth / 2)) + ', ' + Math.round(parseInt(window.map.mapPinMain.style.top, 10) + (window.map.mapPinMain.offsetHeight + 22));
    window.map.mapActiv.classList.remove('map--faded');
    window.sort.renderFilter();
  });

  document.querySelector('.map').addEventListener('click', function (event) {
    var classList = event.target.classList;

    if (classList.contains('map__pin') && !classList.contains('map__pin--main')) {
      var pinAlt = event.target.querySelector('img').alt;
      var i;
      for (i = 0; i < window.getUsers.length; i++) {
        if (pinAlt === window.getUsers[i].offer.title) {
          window.map.popupMap.appendChild(window.map.renderPopup(window.getUsers[i]));
        }
      }

      var divElements = document.querySelectorAll('.map__pin');
      var clickedElement = null;
      var clickHandler = function (evt) {
        // исправить клики

        if (clickedElement) {
          clickedElement.classList.remove('map__pin--active');
        }
        clickedElement = evt.currentTarget;
        clickedElement.classList.add('map__pin--active');
      };

      for (i = 0; i < divElements.length; i++) {
        divElements[i].addEventListener('click', clickHandler, true);
      }
    }
  });
  window.pin = {
    renderPin: renderPin,
    mapPins: mapPins
  };
})();
