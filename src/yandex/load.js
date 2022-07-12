/*const YA_API_URL = 'https://api-maps.yandex.ru/2.1/?lang=en_US';*/

import ymaps from 'ya';
import {mapContainerClickHandler} from './proceed.js';

const mapConfig = {
    center: [35.65858, 139.74544],
    zoom: 10,
}
const createMapContainer = () => {
    const mapContainer = document.createElement('div');
    mapContainer.classList.add('ya-map-container');
    document.body.append(mapContainer);
    mapContainer.addEventListener('click', mapContainerClickHandler);
    return mapContainer;
}
const loadYandex = () => {
    ymaps.ready(() => {
        new ymaps.Map(createMapContainer(), mapConfig);
    })
}

export {loadYandex};
