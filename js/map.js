'use strict';
var ESC_KEYCODE = 27;
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

// Активация карты
var mapActiv = document.querySelector('.map');

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
for (var l = 0; l < users.length; l++) {
  fragment.appendChild(renderPin(users[l]));
}

// попап
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
  } else {
    newPopup.querySelector('.popup__features').style.display = 'none';
  }

  var popupPhoto = newPopup.querySelector('.popup__photos');
  popupPhoto.textContent = '';
  for (var iPhoto = 0; iPhoto < popup.offer.photos.length; iPhoto++) {
    popupPhoto.insertAdjacentHTML('beforeend', '<img src="' + popup.offer.photos[iPhoto] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
  }
  return newPopup;
};

// нажатие на pin
document.querySelector('.map').addEventListener('click', function (event) {
  var classList = event.target.classList;
  if (classList.contains('map__pin') && !classList.contains('map__pin--main')) {
    var pinAlt = event.target.querySelector('img').alt;
    for (var count = 0; count < users.length; count++) {
      if (pinAlt === users[count].offer.title) {
        popupMap.appendChild(renderPopup(users[count]));
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

// input disabled
var inpitDisable = function (onOff) {
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
inpitDisable(true);

// Активация карты по клику на пин
var mapPinMain = document.querySelector('.map__pin--main');
mapPinMain.addEventListener('click', function () {
  mapActiv.classList.remove('map--faded');
  mapPins.appendChild(fragment);
  inpitDisable(false);
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');

  var inputAddres = document.querySelector('#address');
  inputAddres.value = Math.round(parseInt(mapPinMain.style.left, 10) + (mapPinMain.offsetWidth / 2)) + ', ' + Math.round(parseInt(mapPinMain.style.top, 10) + (mapPinMain.offsetHeight + 22));
});

// закрыть попап
popupMap.addEventListener('click', function (evt) {
  if (evt.target.className === 'popup__close') {
    popupMap.innerHTML = '';
  }
});
document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    popupMap.innerHTML = '';
  }
});

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
  if (value === '1') {
    capacityOption[0].disabled = true;
    capacityOption[1].disabled = true;
    capacityOption[2].disabled = false;
    capacityOption[2].selected = true;
    capacityOption[3].disabled = true;
  } else if (value === '2') {
    capacityOption[0].disabled = true;
    capacityOption[1].disabled = false;
    capacityOption[2].disabled = false;
    capacityOption[2].selected = true;
    capacityOption[3].disabled = true;
  } else if (value === '3') {
    capacityOption[0].disabled = false;
    capacityOption[1].disabled = false;
    capacityOption[2].disabled = false;
    capacityOption[2].selected = true;
    capacityOption[3].disabled = true;
  } else if (value === '100') {
    capacityOption[0].disabled = false;
    capacityOption[1].disabled = false;
    capacityOption[2].disabled = false;
    capacityOption[3].disabled = true;
    capacityOption[3].selected = true;
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

// следующее задание //
// ограничения пина
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

// перетаскивание пина
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
