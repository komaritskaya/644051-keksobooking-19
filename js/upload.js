'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var AVATAR_WIDTH = 40;
  var AVATAR_HEIGHT = 44;
  var PHOTO_WIDTH = 70;
  var PHOTO_HEIGHT = 70;

  var userAvatarUploaderElement = document.querySelector('.ad-form__field input[type=file]');
  var userAvatarPreviewElement = document.querySelector('.ad-form-header__preview');
  var photoUploaderElement = document.querySelector('.ad-form__upload input[type=file]');
  var photoPreviewElement = document.querySelector('.ad-form__photo');

  var uploadPicture = function (uploaderElement, previewParentElement, width, height) {
    var file = uploaderElement.files[0];

    if (file) {
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (type) {
        return fileName.endsWith(type);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          var newPreviewElement = document.createElement('img');
          newPreviewElement.style.width = width.toString() + 'px';
          newPreviewElement.style.height = height.toString() + 'px';
          newPreviewElement.src = reader.result;
          window.utils.removeChildren(previewParentElement);
          previewParentElement.appendChild(newPreviewElement);
        });

        reader.readAsDataURL(file);
      }
    };
  };

  userAvatarUploaderElement.addEventListener('change', function () {
    uploadPicture(userAvatarUploaderElement, userAvatarPreviewElement, AVATAR_WIDTH, AVATAR_HEIGHT);
  });

  photoUploaderElement.addEventListener('change', function () {
    uploadPicture(photoUploaderElement, photoPreviewElement, PHOTO_WIDTH, PHOTO_HEIGHT);
  });
})();
