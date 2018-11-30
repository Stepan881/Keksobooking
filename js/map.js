'use strict';
var USER_AVATARS = ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'];
var USER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var USER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var USER_CHECKIN = ['12:00', '13:00', '14:00'];
var USER_CHECKOUT = ['12:00', '13:00', '14:00'];
var USER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var USER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

// рандом от х до х
var getRandoMinMax = function (min, max) {
  return Math.round(min + Math.random() * (max - min));
};

// рандом значения массива
var getRandomNumber = function (elements) {
  return elements [Math.floor(Math.random() * elements.length)];
};
// размер блока в котором перетаскивается метка
var blockPin = document.querySelector('.map__overlay');
var blockPinHeight = 200;
var blockPinWidth = blockPin.clientWidth - 50;

// массив объектов
var users = [];
function start() {
  for (var i = 0; i < USER_AVATARS.length; i++) {
    var locationX = getRandoMinMax(blockPinWidth, blockPinHeight);
    var locationY = getRandoMinMax(130, 630);

    users[i] = {
      author: {
        avatar: USER_AVATARS[i]
      },

      offer: {
        title: USER_TITLES[i],
        address: locationX + ', ' + locationY,
        price: Math.ceil(getRandoMinMax(1000, 1000000) / 1000.0) * 1000, // округляем до 1000
        type: getRandomNumber(USER_TYPES),
        rooms: getRandoMinMax(1, 5),
        guests: getRandoMinMax(1, 50),
        checkin: getRandomNumber(USER_CHECKIN),
        checkout: getRandomNumber(USER_CHECKOUT),
        features: USER_FEATURES,
        description: '',
        photos: shuffleArray(USER_PHOTOS)
      },

      location: {
        x: locationX,
        y: locationY
      }
    };
  }
}
start();
// Активация карты
var mapActiv = document.querySelector('.map');
mapActiv.classList.remove('map--faded');
// Берем Pin
var pinCopy = document.querySelector('#pin').content.querySelector('.map__pin');
// Вставляем пин
var mapPins = document.querySelector('.map__pins');

// ширина высота пина
var pinImg = mapPins.getElementsByTagName('img')[0];
// дом шаблон
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
for (var l = 0; l < users.length; l++) {
  fragment.appendChild(renderPin(users[l]));
}
mapPins.appendChild(fragment);

// Вырезаем окно попапа
var windowPopup = document.querySelector('#card').content.querySelector('.popup');
// Подготовка места для попапа
document.querySelector('.map__filters-container').insertAdjacentHTML('beforebegin', '<div class="map__popup"></div>');
var popupMap = document.querySelector('.map__popup');
// вставляем попап
// popupMap.appendChild(windowPopup);

document.querySelector('.map').addEventListener('click', function (event) {
  // console.log(event.target);  то на что кликнули
  var classList = event.target.classList;
  if (classList.contains('map__pin') && !classList.contains('map__pin--main')) {
    var pinAlt = event.target.querySelector('img').alt;

    // отрисовать попап на странице
    renderPopupByTitle(pinAlt);
  }
});

/*                          */
// ф-ция поиска массива
var renderPopupByTitle = function (pinAlt) {
  for (var count = 0; count < users.length; count++) {
    if (pinAlt === users[count].offer.title) {
      popupMap.appendChild(renderPopup(users[count]));
    }
  }
};

var renderPopup = function (popup) {
  var newPopup = windowPopup.cloneNode(true);
  newPopup.querySelector('img').src = popup.author.avatar;
  newPopup.querySelector('.popup__title').textContent = popup.offer.title;
  newPopup.querySelector('.popup__text--price').textContent = popup.offer.price + '\u20BD';
  newPopup.querySelector('.popup__text--price').insertAdjacentHTML('beforeend', '<span>/ночь</span>');
  newPopup.querySelector('.popup__type').textContent = popup.offer.type;
  newPopup.querySelector('.popup__text--capacity').textContent = popup.offer.rooms + ' комнаты для ' + popup.offer.guests + ' гостей';
  newPopup.querySelector('.popup__text--time').textContent = 'Заезд после ' + popup.offer.checkin + ' выезд до ' + popup.offer.checkout;
  var popupPhoto = newPopup.querySelector('.popup__photos');
  var elem = popupPhoto.querySelector('img');
  elem.parentNode.removeChild(elem);
  for (var z = 0; z < USER_PHOTOS.length; z++) {
    popupPhoto.insertAdjacentHTML('beforeend', '<img src="' + USER_PHOTOS[z] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
  }
  return newPopup;
};

// рандом без повтора
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
