import ymaps from 'ya';
import loader from "../templates/loader.html";

import { setMap } from './old-reviews.js';
import {mapContainerClickEventHandler} from "./new-review.js";
import {mapContainerDoubleClickEventHandler} from "./new-review.js";

const presetLocation = {
  coords: {
    latitude: 35.65858,
    longitude: 139.74544,
  }
};

const loaderContainer = document.createElement('div');
const createMapContainer = () => {
  const mapContainer = document.createElement('div');
  mapContainer.classList.add('ya-map-container');
  loaderContainer.innerHTML = loader;
  document.body.append(mapContainer);
  document.body.append(loaderContainer);
  return mapContainer;
}
const mapContainer = createMapContainer();

const current = (location) => {
  run(location);
}
const preset = () => {
  run(presetLocation);
}
const loadYandex = () => {
  ymaps.ready(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(current, preset);
    } else {
      preset();
    }
  })
}

const run =  (location) => {

  const mapConfig = {
    zoom: 10,
    controls: [],
    center: [location.coords.latitude, location.coords.longitude],
  }

  document.querySelector('.loader').parentNode.remove();
  const map = new ymaps.Map(mapContainer, mapConfig, {
    yandexMapDisablePoiInteractivity: true
  });

  setMap(map, ymaps);

  mapContainer.addEventListener('click', mapContainerClickEventHandler);
  mapContainer.addEventListener('dblclick', mapContainerDoubleClickEventHandler);

}

export { loadYandex };
