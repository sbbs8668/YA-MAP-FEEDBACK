const MapConfig = {
    center: [55, 37],
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
    ymaps.ready(() => {
        const yaMap = new ymaps.Map(mapContainer, MapConfig);
    })
}

export {proceedYandex};
