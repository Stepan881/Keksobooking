'use strict';
var USER_AVATARS = ['img/avatars/user01.png', 'img/avatars/user02.png', 'img/avatars/user03.png', 'img/avatars/user04.png', 'img/avatars/user05.png', 'img/avatars/user06.png', 'img/avatars/user07.png', 'img/avatars/user08.png'];
var USER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var USER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var USER_CHECKIN = ['12:00', '13:00', '14:00'];
var USER_CHECKOUT = ['12:00', '13:00', '14:00'];
var USER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var USER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

// рандом от х до х
var randoMinMax = function (min, max) {
  return Math.round(min + Math.random() * (max - min));
};

// рандом значения массива
var randonArr = function (array) {
  return array [Math.floor(Math.random() * array.length)];
};
// размер блока в котором перетаскивается метка
var BLOCK_PIN = document.querySelector('.map__overlay');
var BLOCK_PIN_HEIGHT = 200;
var BLOCK_PIN_WIDTH = BLOCK_PIN.clientWidth - 50;

// массив объектов
var userArrays = [];
for (var i = 0; i < USER_AVATARS.length; i++) {
  var locationX = randoMinMax(BLOCK_PIN_WIDTH, BLOCK_PIN_HEIGHT);
  var locationY = randoMinMax(130, 630);

  userArrays[i] = {
    author: {
      avatar: USER_AVATARS[i]
    },

    offer: {
      title: USER_TITLES[i],
      address: locationX + ', ' + locationY,
      price: randoMinMax(1000, 1000000),
      type: randonArr(USER_TYPES),
      rooms: randoMinMax(1, 5),
      guests: randoMinMax(1, 50),
      checkin: randonArr(USER_CHECKIN),
      checkout: randonArr(USER_CHECKOUT),
      features: USER_FEATURES,
      description: '',
      photos: USER_PHOTOS
    },

    location: {
      x: locationX,
      y: locationY
    }
  };
}

// Активация карты
var mapActiv = document.querySelector('.map');
mapActiv.classList.remove('map--faded');
// Берем Pin
var PIN_COPY = document.querySelector('#pin').content.querySelector('.map__pin');
// Вставляем пин
var PIN_PASTE = document.querySelector('.map__pins');

// ширина высота пина
var PIN_WIDTH = PIN_PASTE.getElementsByTagName('img')[0].width / 2;
var PIN_HEIGHT = PIN_PASTE.getElementsByTagName('img')[0].height / 2;

// дом шаблон
var renderPin = function (pin) {
  var wizardElement = PIN_COPY.cloneNode(true);
  wizardElement.style.left = (pin.location.x - PIN_WIDTH) + 'px';
  wizardElement.style.top = (pin.location.y - PIN_HEIGHT) + 'px';
  wizardElement.querySelector('img').src = pin.author.avatar;
  wizardElement.querySelector('img').alt = pin.offer.title;
  return wizardElement;
};

// Отрисовка сгенерированного пина
var fragment = document.createDocumentFragment();
for (var l = 0; l < userArrays.length; l++) {
  fragment.appendChild(renderPin(userArrays[l]));
}
PIN_PASTE.appendChild(fragment);

/*
по клику на пин ( type="button" class="map__pin" ),
открывается модальное окно template id="card" перед class="map__filters-container" container__popup
закрыть модалку type="button" class="popup__close"
*/

// Вырезаем окно попапа
var POPUP = document.querySelector('#card').content.querySelector('.popup');
// Подготовка места для попапа
document.querySelector('.map__filters-container').insertAdjacentHTML('beforebegin', '<div class="map__popup"></div>');
var popupMap = document.querySelector('.map__popup');
// вставляем попап
popupMap.appendChild(POPUP);

/*
  Поиск всех .map__pin
  клик вызывает попап с данными масива
*/
var temp = document.querySelectorAll('.map__pin:not(.map__pin--main)');

for (var q = 0; q < temp.length; q++) {
  temp[q].addEventListener('click', function (evt) {
    evt.preventDefault();

  });
}

