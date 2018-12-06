'use strict';
(function () {

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
  var blockPinHeight = 50;
  var blockPinWidth = blockPin.clientWidth - 50;

  // рандом без повтора
  var shuffleArray = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  // рандом features
  function sliceFeatures(array) {
    return array.slice(0, getRandoMinMax(0, array.length));
  }

  // Переименования типов
  var getRenameType = function (array) {
    var index;
    var indexArray = getRandomNumber(array);
    switch (indexArray) {
      case 'flat': index = 'Квартира';
        break;
      case 'bungalo': index = 'Бунгало';
        break;
      case 'house': index = 'Дом';
        break;
      case 'palace': index = 'Дворец';
        break;
    }
    return index;
  };

  // массив объектов
  var users = [];
  function start() {
    for (var i = 0; i < USER_AVATARS.length; i++) {
      var locationX = getRandoMinMax(blockPinWidth, blockPinHeight) - 5;
      var locationY = getRandoMinMax(130, 630) - 45;
      users[i] = {
        author: {
          avatar: USER_AVATARS[i]
        },

        offer: {
          title: USER_TITLES[i],
          address: locationX + ', ' + locationY,
          price: Math.ceil(getRandoMinMax(1000, 1000000) / 1000.0) * 1000, // округляем до 1000
          type: getRenameType(USER_TYPES),
          rooms: getRandoMinMax(1, 5),
          guests: getRandoMinMax(1, 50),
          checkin: getRandomNumber(USER_CHECKIN),
          checkout: getRandomNumber(USER_CHECKOUT),
          features: sliceFeatures(shuffleArray(USER_FEATURES)),
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
  window.data = {
    users: users,
    blockPin: blockPin
  };
})();
