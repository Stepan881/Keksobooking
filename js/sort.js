'use strict';
(function () {
  var MAX_PIN = 5;
  var ANY_VALUE = 'any';
  var DEBOUNCE = 500;
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelector('#housing-features');
  var housingFeaturesConditioner = housingFeatures.querySelectorAll('input');

  var PriceBound = {
    low: {
      MIN: 0,
      MAX: 10000
    },
    middle: {
      MIN: 10000,
      MAX: 50000
    },
    high: {
      MIN: 50000,
      MAX: Infinity
    },
    any: {
      MIN: 0,
      MAX: Infinity
    }
  };

  function clearPin() {
    var mapPin = document.querySelector('.map__pins');
    var pinBtn = mapPin.querySelectorAll('button[type="button"]');
    for (var i = 0; i < pinBtn.length; i++) {
      if (pinBtn[i]) {
        var pin = document.querySelector('.map__pin--active');
        if (pin) {
          pin.classList.remove('map__pin--active');
        }
        mapPin.removeChild(pinBtn[i]);
        document.querySelector('.map__popup').innerHTML = '';
      }
    }
  }

  var RoomBound = {
    1: 1,
    2: 2,
    3: 3,
    any: Infinity
  };

  var GuestBound = {
    2: 2,
    1: 1,
    0: 0,
    any: Infinity
  };

  function render() {
    clearPin();

    var filterType = window.getUsers.filter(function (array) {
      if (housingType.options[housingType.selectedIndex].value === ANY_VALUE) {
        return array.offer.type;
      }
      return array.offer.type === housingType.options[housingType.selectedIndex].value;
    });

    var filterPrice = filterType.filter(function (array) {
      if (housingPrice.options[housingPrice.selectedIndex].value === housingPrice.value) {
        return array.offer.price > PriceBound[housingPrice.value].MIN &&
        array.offer.price < PriceBound[housingPrice.value].MAX;
      }
      return array;
    });

    var filterRoom = filterPrice.filter(function (array) {
      if (housingRooms.options[housingRooms.selectedIndex].value === housingRooms.value &&
        housingRooms.options[housingRooms.selectedIndex].value !== ANY_VALUE) {
        return array.offer.rooms === RoomBound[housingRooms.value];
      }
      return array;
    });

    var filterGuest = filterRoom.filter(function (array) {
      if (housingGuests.options[housingGuests.selectedIndex].value === housingGuests.value &&
      housingGuests.options[housingGuests.selectedIndex].value !== ANY_VALUE) {
        return array.offer.guests === GuestBound[housingGuests.value];
      }
      return array;
    });

    var featuresConditioner = filterGuest.filter(function (array) {
      for (i = 0; i < housingFeaturesConditioner.length; i++) {
        if (housingFeaturesConditioner[i].checked &&
          array.offer.features.indexOf(housingFeaturesConditioner[i].value) === -1) {
          return false;
        }
      }
      return array;
    });

    var fragment = document.createDocumentFragment();
    for (i = 0; i < featuresConditioner.length; i++) {
      if (i < MAX_PIN) {
        fragment.appendChild(window.pin.renderPin(featuresConditioner[i]));
      }
    }
    window.map.mapActiv.classList.remove('map--faded');
    window.pin.mapPins.appendChild(fragment);
    window.form.disableInput(false);
    document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  }

  var lastTimeout;
  function renderFilter() {

    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      render();
    }, DEBOUNCE);
    document.removeEventListener('keydown', window.map.closeMapByEscHandler);
  }

  housingType.addEventListener('change', renderFilter);
  housingPrice.addEventListener('change', renderFilter);
  housingRooms.addEventListener('change', renderFilter);
  housingGuests.addEventListener('change', renderFilter);
  for (var i = 0; i < housingFeaturesConditioner.length; i++) {
    housingFeaturesConditioner[i].addEventListener('change', renderFilter);
  }

  window.sort = {
    renderFilter: renderFilter,
    clearPin: clearPin,
    render: render
  };
})();
