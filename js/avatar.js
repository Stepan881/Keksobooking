'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var imageAvatar = document.querySelector('.ad-form__field').querySelector('.ad-form-header__input');
  var loadImageAvatar = document.querySelector('.ad-form-header__preview').querySelector('img');

  imageAvatar.addEventListener('change', function () {
    var file = imageAvatar.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        loadImageAvatar.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  var image = document.querySelector('.ad-form__upload');
  var imageHome = image.querySelector('.ad-form__input');
  imageHome.addEventListener('change', function () {
    var file = imageHome.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        image.insertAdjacentHTML('afterend', '<div class="ad-form__photo ad-form__photo-reset" ><img src="'
        + reader.result + '" alt="Фотографии жилья" width="70" height="70"></div>');
      });

      reader.readAsDataURL(file);
    }
  });
})();
