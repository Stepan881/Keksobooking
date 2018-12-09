'use strict';
(function () {
  // создание Pin
  var pinCopy = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var pinImg = mapPins.getElementsByTagName('img')[0];
  var renderPin = function (pin) {
    var wizardElement = pinCopy.cloneNode(true);
    wizardElement.style.left = (pin.location.x - (pinImg.width / 2)) + 'px';
    wizardElement.style.top = (pin.location.y - (pinImg.height / 2)) + 'px';
    wizardElement.querySelector('img').src = pin.author.avatar;
    wizardElement.querySelector('img').alt = pin.offer.title;
    wizardElement.querySelector('img').style.pointerEvents = 'none';
    return wizardElement;
  };
  // Отрисовка сгенерированного пина
  var fragment = document.createDocumentFragment();
  for (var l = 0; l < window.data.users.length; l++) {
    fragment.appendChild(renderPin(window.data.users[l]));
  }

  // нажатие на pin

  document.querySelector('.map').addEventListener('click', function (event) {
    var classList = event.target.classList;
    if (classList.contains('map__pin') && !classList.contains('map__pin--main')) {
      var pinAlt = event.target.querySelector('img').alt;
      for (var count = 0; count < window.data.users.length; count++) {
        if (pinAlt === window.data.users[count].offer.title) {
          window.map.popupMap.appendChild(window.map.renderPopup(window.data.users[count]));
        }
      }

      var divElements = document.querySelectorAll('.map__pin');
      var clickedElement = null;
      var clickHandler = function (evt) {
        if (clickedElement) {
          clickedElement.classList.remove('map__pin--active');
        }
        clickedElement = evt.currentTarget;
        clickedElement.classList.add('map__pin--active');
      };

      for (var i = 0; i < divElements.length; i++) {
        divElements[i].addEventListener('click', clickHandler, true);
      }
    }
  });
  window.pin = {
    mapPins: mapPins,
    fragment: fragment
  };
})();