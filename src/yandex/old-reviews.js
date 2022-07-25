import { recordMapCoordinates } from './new-review.js';
import { showReviewContainer, hideReviewContainer, getReviewContainer } from './new-review.js';

const MAX_ZOOM = 21;
const CLUSTER_SIZE = 512;
const OLD_REVIEWS_CONTAINER_CLASS = 'old-reviews-container';
const DISPLAY_NONE_CLASS = 'display-none';

const appData = {
    map: '',
    ymaps: '',
    placeMarks: [],
    feedbackedPlaceMarks: [],
    previousReviews: [],
    objectManager: '',
    oldReviews: [],
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
    placeMark.events.add("click", function(){
        appData.map.setZoom(appData.map.getZoom() + 2);
    });
    appData.map.geoObjects.add(placeMark);
    appData.placeMarks.push(placeMark);
}

const getOldReviewTemplate = () => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    const timestampDiv = div.cloneNode();
    timestampDiv.classList.add('old-timestamp-place-div');
    const namePlaceDiv = div.cloneNode();
    namePlaceDiv.classList.add('old-name-place-div');
    const nameSpan = span.cloneNode();
    nameSpan.classList.add('old-name-span');
    const placeSpan = span.cloneNode();
    placeSpan.classList.add('old-place-span');
    const feedbackDiv = div.cloneNode();
    feedbackDiv.classList.add('old-feedback-div');
    const oldReview = div.cloneNode();
    return { nameSpan, placeSpan, namePlaceDiv, timestampDiv, feedbackDiv, oldReview};
}
const emptyOldReviewsContainer = () => {
    const reviewsContainer = getReviewContainer();
    const oldReviewsContainer = reviewsContainer.querySelector(`.${OLD_REVIEWS_CONTAINER_CLASS}`)
    oldReviewsContainer.innerHTML = '';
    return oldReviewsContainer;
}
const getOldReviewsContainer = () => emptyOldReviewsContainer();
const fillReviewsContainer = () => {
    const oldReviewsContainer = getOldReviewsContainer();
    const oldReviewTemplate = getOldReviewTemplate();
    appData.oldReviews.sort((a, b) => {
        a.timestamp = a.timestamp || 0;
        b.timestamp = b.timestamp || 0;
        return b.timestamp - a.timestamp;
    });
    appData.oldReviews.forEach((oldReview) => {
        const nameNode = oldReviewTemplate.nameSpan.cloneNode();
        nameNode.textContent = oldReview.name;
        const placeNode = oldReviewTemplate.placeSpan.cloneNode();
        placeNode.textContent = oldReview.place;
        const timestampDivNode = oldReviewTemplate.timestampDiv.cloneNode();
        if (oldReview.timestamp) {
            timestampDivNode.textContent = new Date(oldReview.timestamp * 1000).toISOString().slice(0, 19).replace('T', ' ');
        }
        const feedbackNode = oldReviewTemplate.feedbackDiv.cloneNode();
        feedbackNode.textContent = oldReview.feedback;

        const namePlaceDivNode = oldReviewTemplate.namePlaceDiv.cloneNode();
        namePlaceDivNode.append(nameNode);
        namePlaceDivNode.append(placeNode);
        const oldReviewNode = oldReviewTemplate.oldReview.cloneNode();
        oldReviewNode.append(namePlaceDivNode);
        oldReviewNode.append(timestampDivNode);
        oldReviewNode.append(feedbackNode);
        oldReviewsContainer.append(oldReviewNode);
    });
    oldReviewsContainer.parentNode.classList.remove(DISPLAY_NONE_CLASS);
    setTimeout(()=>{
        showReviewContainer();
    }, 1);
}

const reviewPlaceMarkClickHandler = (ev) => {
    if (appData.map.getZoom() < MAX_ZOOM / 1.4) {
        setTimeout(() => {
            hideReviewContainer();
            hidePlaceMark();
            appData.map.setCenter(ev.get('coords'));
            appData.map.setZoom(appData.map.getZoom() + 4);
        });
    } else {
        recordMapCoordinates(ev.get('coords'));
        appData.oldReviews = [];
        appData.oldReviews.push(appData.objectManager.objects.getById(ev.get('objectId')).content);
        setTimeout(()=>{
            fillReviewsContainer();
        });
    }
}
const reviewClusterClickHandler = (ev) => {
    recordMapCoordinates(ev.get('coords'));
    if (appData.map.getZoom() === MAX_ZOOM) {
        appData.oldReviews = [];
        [...appData.objectManager.clusters.getById(ev.get('objectId')).features].forEach((feature) => {
            appData.oldReviews.push(feature.content);
        });
        setTimeout(()=>{
            fillReviewsContainer();
        })
    } else {
        setTimeout(() => {
            hideReviewContainer();
            hidePlaceMark();
        });
    }
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
                timestamp: previousReview.timestamp,
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
