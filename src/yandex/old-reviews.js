import { recordMapCoordinates } from './new-review.js';
import { hideReviewContainer } from './new-review.js';

const MAX_ZOOM = 21;
const CLUSTER_SIZE = 256;
const appData = {
    map: '',
    ymaps: '',
    placeMarks: [],
    feedbackedPlaceMarks: [],
    previousReviews: [],
    objectManager: '',
}

const hidePlaceMark = () => {
    appData.placeMarks.forEach((placeMark) => {
        appData.map.geoObjects.remove(placeMark);
    })
    appData.placeMarks = [];
}
const showPlaceMark = (x, y) => {
    hidePlaceMark();
    const placeMark = new appData.ymaps.Placemark([x, y], null, {preset: 'islands#darkGreenCircleDotIcon'});
    appData.map.geoObjects.add(placeMark);
    appData.placeMarks.push(placeMark);
}

const reviewPlaceMarkClickHandler = (ev) => {
    setTimeout(() => {
        hideReviewContainer();
        hidePlaceMark();
    });
    console.log(appData.objectManager.objects.getById(ev.get('objectId')).content);
}
const reviewClusterClickHandler = (ev) => {
    setTimeout(() => {
        hideReviewContainer();
        hidePlaceMark();
    });
    console.log(appData.objectManager.clusters.getById(ev.get('objectId')).features);
}

const initCluster = () => {
    if (appData.objectManager) {
        appData.objectManager.removeAll();
        appData.objectManager = null;
    }
    appData.objectManager = new appData.ymaps.ObjectManager({
        clusterize: true,
        gridSize: CLUSTER_SIZE,
        clusterHasBalloon: false,
    });
    appData.objectManager.objects.options.set({
        preset: 'islands#redCircleDotIcon',
    });
    appData.map.geoObjects.add(appData.objectManager);

    appData.objectManager.add({type: "FeatureCollection",  "features": appData.feedbackedPlaceMarks});

    appData.objectManager.objects.events.add('click', reviewPlaceMarkClickHandler);
    appData.objectManager.clusters.events.add('click', reviewClusterClickHandler);
}

const removeFeedbackedPlaceMarks = () => {
    appData.feedbackedPlaceMarks.forEach((feedbackedPlaceMark) => {
        appData.map.geoObjects.remove(feedbackedPlaceMark);
    });
}
const showFeedbackedPlaceMarks = () => {
    removeFeedbackedPlaceMarks();
    appData.feedbackedPlaceMarks = [];
    const previousReviews = JSON.parse(localStorage.getItem('reviewData')) || [];
    previousReviews.forEach((previousReview, index) => {
        const feedbackedPlaceMark = {
            type: "Feature",
            id: `id${index}`,
            geometry: {
                type: "Point",
                preset: 'islands#redCircleDotIcon',
                coordinates: [previousReview.placeX, previousReview.placeY]
            },
            properties: {
                hintContent: `${previousReview.name} ${previousReview.place}`
            },
            content: {
                feedback: previousReview.feedback,
                name: previousReview.name,
                place: previousReview.place,
            }
        }
        appData.feedbackedPlaceMarks.push(feedbackedPlaceMark);
    })
    initCluster();
}

const setMap = (map, ymaps) => {
    appData.map = map;
    appData.ymaps = ymaps;
    appData.map.events.add('click', (ev) => {
        recordMapCoordinates(ev.get('coords'));
    });
    showFeedbackedPlaceMarks();
}

export { setMap };
export { hidePlaceMark, showPlaceMark };
export { showFeedbackedPlaceMarks };
