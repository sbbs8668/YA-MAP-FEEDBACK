import ymaps from 'ya';

import { setMap } from './old-reviews.js';

const mapConfig = {
    center: [35.65858, 139.74544],
    zoom: 10,
    controls: [],
}
const mapContainer = document.querySelector('.ya-map-container');

const loadYandex = () => {
    ymaps.ready(() => {
        const map = new ymaps.Map(mapContainer, mapConfig, {
            yandexMapDisablePoiInteractivity: true
        });
        setMap(map, ymaps);
    })
}

export { loadYandex };
