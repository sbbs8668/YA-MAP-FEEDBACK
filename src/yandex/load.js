import ymaps from 'ya';
import { mapContainerClickHandler } from './proceed.js';
import { setMap } from './proceed.js';

const mapConfig = {
    center: [35.65858, 139.74544],
    zoom: 10,
    controls: [],
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
        const map = new ymaps.Map(createMapContainer(), mapConfig, {
            yandexMapDisablePoiInteractivity: true
        });
        setMap(map, ymaps);
    })
}

export { loadYandex };
