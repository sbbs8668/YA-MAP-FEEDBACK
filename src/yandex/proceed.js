/*require("html-loader!../src/templates/review-container.html");*/
import reviewHTML from '../templates/review-container.html';

const LEFT = 'left';
const RIGHT = 'right';
const TOP = 'top';
const BOTTOM = 'bottom';
const REVIEW_FORM_CLASS = 'review-form';
const CLOSE_BUTTON_CLASS = 'review-close';
const SUBMIT_BUTTON_CLASS = 'review-submit';
const MapConfig = {
    center: [35.65858, 139.74544],
    zoom: 10,
}
const reviewData = {
    placeX: '',
    placeY: '',
    name: '',
    place: '',
    feedback: '',
}

const createMapContainer = () => {
    const mapContainer = document.createElement('div');
    mapContainer.classList.add('ya-map-container');
    document.body.append(mapContainer);
    return mapContainer;
}
const mapContainer = createMapContainer();

const createReviewContainer = () => {
    const reviewContainer = document.createElement('div');
    reviewContainer.innerHTML = reviewHTML;
    reviewContainer.classList.add('review-container');
    reviewContainer.classList.add('display-none');
    document.body.append(reviewContainer);
    return reviewContainer;
}
const reviewContainer = createReviewContainer();
const reviewForm = document.querySelector(`.${REVIEW_FORM_CLASS}`);
const reviewContainerCloseButton = document.querySelector(`.${CLOSE_BUTTON_CLASS}`);
const reviewContainerSubmitButton = document.querySelector(`.${SUBMIT_BUTTON_CLASS}`);

const isEscapeKey = (ev) => ev.key === 'Escape';

const emptyReviewForm = () => {

    reviewContainer.classList.add('display-none');

    reviewContainer.style.removeProperty('top');
    reviewContainer.style.removeProperty('bottom');
    reviewContainer.style.removeProperty('left');
    reviewContainer.style.removeProperty('right');

    [...reviewForm.elements].forEach((formElement) => {
        formElement.value = '';
        formElement.removeEventListener('input', reviewFormElementsInputEventHandler);
        /*remove error class if left after empty value validation*/
        formElement.classList.remove('input-error');
    });

    reviewContainerCloseButton.removeEventListener('click', reviewContainerCloseButtonClickHandler);
    reviewContainerSubmitButton.removeEventListener('click', reviewContainerSubmitButtonClickEventHandler);

    /*empty review data*/
    recordReviewData();
}
const recordReviewData = (input = false) => {
    if (!input) {
        reviewData.placeX = '';
        reviewData.placeY = '';
        reviewData.name = '';
        reviewData.place = '';
        reviewData.feedback = '';
    } else {
        /*remove error class if left after empty value validation*/
        input.classList.remove('input-error');
        reviewData[input.name] = input.value;
    }
}
const proceedReview = () => {
    /*validate review data*/
    const emptyFields = [];
    for (const reviewFieldName in reviewData) {
        if (!reviewData[reviewFieldName]) {
            emptyFields.push(reviewFieldName);
        }
    }
    if (emptyFields.length) {
        emptyFields.forEach((emptyFieldName) => {
            reviewForm.elements[emptyFieldName].classList.add('input-error');
        });
    } else {
        console.log(reviewData);
        /*send the review data to server*/
    }
}

const showReviewContainer = (x, y) => {

    const xPosition = window.innerWidth / 2 > x ? LEFT : RIGHT;
    const yPosition = window.innerHeight / 2 > y ? TOP : BOTTOM;
    const xPositionValue = xPosition === RIGHT ? `${window.innerWidth - x}px` : `${x}px`;
    const yPositionValue = yPosition === BOTTOM ? `${window.innerHeight - y}px` : `${y}px`;

    reviewContainer.style.setProperty(xPosition, xPositionValue);
    reviewContainer.style.setProperty(yPosition, yPositionValue);

    reviewContainer.classList.remove('display-none');

    document.addEventListener('keydown', documentKeydownHandler);
    reviewContainerCloseButton.addEventListener('click', reviewContainerCloseButtonClickHandler);

    /*record place position*/
    reviewData.placeX = x;
    reviewData.placeY = y;

    /*add events to reviewFormFields*/
    reviewForm.elements['name'].addEventListener('input', reviewFormElementsInputEventHandler);
    reviewForm.elements['place'].addEventListener('input', reviewFormElementsInputEventHandler);
    reviewForm.elements['feedback'].addEventListener('input', reviewFormElementsInputEventHandler);

    reviewContainerSubmitButton.addEventListener('click', reviewContainerSubmitButtonClickEventHandler);
}
const hideReviewContainer = () => {
    emptyReviewForm();
    mapContainer.addEventListener('click', mapContainerClickHandler);
    document.removeEventListener('keydown', documentKeydownHandler);
}

const mapContainerClickHandler = (ev) => {
    hideReviewContainer();
    showReviewContainer(ev.clientX, ev.clientY);
}
const reviewFormElementsInputEventHandler = (ev) => {
    recordReviewData(ev.currentTarget);
}
const reviewContainerCloseButtonClickHandler = () => {
    hideReviewContainer();
}
const reviewContainerSubmitButtonClickEventHandler = () => {
    proceedReview();
}
const documentKeydownHandler = (ev) => {
    if(isEscapeKey(ev)) {
        hideReviewContainer();
    }
}

const proceedYandex = (ymaps) => {
    if (ymaps) {
        ymaps.ready(() => {
            const yaMap = new ymaps.Map(mapContainer, MapConfig);
            mapContainer.addEventListener('click', mapContainerClickHandler);
        })
    }
}

export {proceedYandex};
