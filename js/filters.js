'use strict';

(function () {
  var mapFiltersElement = window.map.mapFiltersElement;
  var housingTypeSelectElement = mapFiltersElement.querySelector('#housing-type');
  var housingPriceSelectElement = mapFiltersElement.querySelector('#housing-price');
  var housingRoomsSelectElement = mapFiltersElement.querySelector('#housing-rooms');
  var housingGuestsSelectElement = mapFiltersElement.querySelector('#housing-guests');
  var housingFeaturesContainerElement = mapFiltersElement.querySelector('#housing-features');

  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var checkType = function (item) {
    return item.offer.type === housingTypeSelectElement.value
      || housingTypeSelectElement.value === 'any';
  };

  var checkPrice = function (item) {
    switch (housingPriceSelectElement.value) {
      case 'low':
        return item.offer.price <= LOW_PRICE;
      case 'middle':
        return item.offer.price >= LOW_PRICE && item.offer.price <= HIGH_PRICE;
      case 'high':
        return item.offer.price >= HIGH_PRICE;
      case 'any':
      default:
        return true;
    }
  };

  var checkRooms = function (item) {
    return item.offer.rooms === parseInt(housingRoomsSelectElement.value, 10)
      || housingRoomsSelectElement.value === 'any';
  };

  var checkGuests = function (item) {
    return item.offer.guests === parseInt(housingGuestsSelectElement.value, 10)
      || housingGuestsSelectElement.value === 'any';
  };

  var checkFeatures = function (item) {
    var checkedFeatureElements = Array.from(housingFeaturesContainerElement.querySelectorAll('.map__checkbox:checked'));
    return checkedFeatureElements.every(function (element) {
      return item.offer.features.includes(element.value);
    }) || !checkedFeatureElements.length;
  };

  var applyAllFilters = function (item) {
    return checkType(item) && checkPrice(item) && checkRooms(item) && checkGuests(item) && checkFeatures(item);
  };

  var formChangeHandler = function () {
    window.map.filterPins(applyAllFilters);
  };

  mapFiltersElement.addEventListener('change', formChangeHandler);
})();
