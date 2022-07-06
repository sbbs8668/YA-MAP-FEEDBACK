/*require("html-loader!../src/templates/review-container.html");*/
import reviewHTML from '../templates/review-container.html';
const reviewContainer = document.createElement('div');
reviewContainer.innerHTML = reviewHTML;

const MapConfig = {
    center: [35.65858, 139.74544],
    zoom: 10,
}
const createMapContainer = () => {
    const mapContainer = document.createElement('div');
    mapContainer.classList.add('ya-map-container');
    document.body.append(mapContainer);
    return mapContainer;
}

const proceedYandex = (ymaps) => {
    const mapContainer = createMapContainer();
    if (ymaps) {
        ymaps.ready(() => {
            const yaMap = new ymaps.Map(mapContainer, MapConfig);
        })
    }
}

export {proceedYandex};
