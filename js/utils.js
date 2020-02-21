'use strict';

(function () {
  var MAIN_MOUSE_BTN = 0;
  var ENTER_KEY = 13;

  var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getRandomBool = function () {
    return Math.random() < 0.5;
  };

  var getSingleRandomItemFromArray = function (arr) {
    var index = getRandomInt(0, arr.length - 1);
    return arr[index];
  };

  var getMultipleRandomItemsFromArray = function (arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (getRandomBool()) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  };

  var removeChildren = function (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  window.utils = {
    MAIN_MOUSE_BTN: MAIN_MOUSE_BTN,
    ENTER_KEY: ENTER_KEY,

    getRandomInt: getRandomInt,
    getSingleRandomItemFromArray: getSingleRandomItemFromArray,
    getMultipleRandomItemsFromArray: getMultipleRandomItemsFromArray,
    removeChildren: removeChildren
  };
})();
