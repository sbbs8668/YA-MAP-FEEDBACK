import { hidePlaceMark, showPlaceMark } from './old-reviews.js';
import { showFeedbackedPlaceMarks } from './old-reviews.js';

import reviewHTML from "../templates/review-container.html";

const LEFT = 'left';
const RIGHT = 'right';
const TOP = 'top';
const BOTTOM = 'bottom';

const REVIEW_FORM_CLASS = 'review-form';
const CLOSE_BUTTON_CLASS = 'review-close';
const SUBMIT_BUTTON_CLASS = 'review-submit';
const DISPLAY_NONE_CLASS = 'display-none';
const OLD_REVIEWS_CONTAINER_CLASS = 'old-reviews-container';
const REVIEW_CONFIRM_CLASS = 'reviews-confirm';
const REVIEW_CONFIRM_TEXT = {
    0: 'Your feedback has been successfully added!',
    1: 'Let\'s review more places!',
};
const REVIEW_CONFIRM_SHOW_LENGTH = 5000;

const reviewData = {
    placeX: '',
    placeY: '',
    name: '',
    place: '',
    feedback: '',
}

const isEscapeKey = (ev) => ev.key === 'Escape';

const createReviewContainer = () => {
    const reviewContainer = document.createElement('div');
    reviewContainer.innerHTML = reviewHTML;
    reviewContainer.classList.add('review-container');
    reviewContainer.classList.add(DISPLAY_NONE_CLASS);
    document.body.append(reviewContainer);
    return reviewContainer;
}
const reviewContainer = createReviewContainer();
const oldReviewsContainer = reviewContainer.querySelector(`.${OLD_REVIEWS_CONTAINER_CLASS}`);

const getReviewContainer = () => {
    return reviewContainer;
}

const reviewForm = document.querySelector(`.${REVIEW_FORM_CLASS}`);
const reviewContainerCloseButton = document.querySelector(`.${CLOSE_BUTTON_CLASS}`);
const reviewContainerSubmitButton = document.querySelector(`.${SUBMIT_BUTTON_CLASS}`);

const showConfirmMessage = () => {
    const div = document.createElement('div');
    const text1 = div.cloneNode();
    const text2 = div.cloneNode();
    div.classList.add(REVIEW_CONFIRM_CLASS);
    text1.textContent = REVIEW_CONFIRM_TEXT[0];
    text2.textContent = REVIEW_CONFIRM_TEXT[1];
    div.append(text1);
    div.append(text2);
    document.body.append(div);
    setTimeout(() => {
        div.remove();
    }, REVIEW_CONFIRM_SHOW_LENGTH);
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
            if (reviewForm.elements[emptyFieldName]) {
                reviewForm.elements[emptyFieldName].classList.add('input-error');
            }
        });
    } else {
        const placeX = reviewData.placeX;
        const placeY = reviewData.placeY;
        const name = reviewData.name;
        const place = reviewData.place;
        const feedback = reviewData.feedback;
        const timestamp = Math.floor(Date.now() / 1000);
        const newReviewData = JSON.parse(localStorage.getItem('reviewData')) || [];
        newReviewData.push({
            placeX,
            placeY,
            name,
            place,
            feedback,
            timestamp
        });

        /*send the review data to server*/
        localStorage.setItem('reviewData', JSON.stringify(newReviewData));
        hidePlaceMark();
        hideReviewContainer();
        showFeedbackedPlaceMarks();
        showConfirmMessage();
    }
}

const emptyReviewData = () => {
    reviewData.name = '';
    reviewData.place = '';
    reviewData.feedback = '';
}
const recordReviewData = (input) => {
    /*remove error class if left after empty value validation*/
    input.classList.remove('input-error');
    reviewData[input.name] = input.value;
}

const emptyReviewForm = () => {
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
    emptyReviewData();
}
const hideOldReviewContainer = () => {
    oldReviewsContainer.parentNode.classList.add(DISPLAY_NONE_CLASS);
    oldReviewsContainer.innerHTML = '';
}
const hideReviewContainer = () => {
    reviewContainer.classList.add(DISPLAY_NONE_CLASS);
    emptyReviewForm();
    document.removeEventListener('keydown', documentKeydownHandler);
}
const showReviewContainer = (x, y) => {

    const xPosition = window.innerWidth / 2 > x ? LEFT : RIGHT;
    const yPosition = window.innerHeight / 2 > y ? TOP : BOTTOM;

    /*move away from the placemark*/
    xPosition === RIGHT ?  x -= 8 : x += 8;
    yPosition === BOTTOM ?  y -= 8 : y += 8;

    const xPositionValue = xPosition === RIGHT ? `${window.innerWidth - x}px` : `${x}px`;
    const yPositionValue = yPosition === BOTTOM ? `${window.innerHeight - y}px` : `${y}px`;

    reviewContainer.style.setProperty(xPosition, xPositionValue);
    reviewContainer.style.setProperty(yPosition, yPositionValue);

    document.addEventListener('keydown', documentKeydownHandler);
    reviewContainerCloseButton.addEventListener('click', reviewContainerCloseButtonClickHandler);

    /*add events to reviewFormFields*/
    reviewForm.elements['name'].addEventListener('input', reviewFormElementsInputEventHandler);
    reviewForm.elements['place'].addEventListener('input', reviewFormElementsInputEventHandler);
    reviewForm.elements['feedback'].addEventListener('input', reviewFormElementsInputEventHandler);

    reviewContainerSubmitButton.addEventListener('click', reviewContainerSubmitButtonClickEventHandler);

    reviewContainer.classList.remove(DISPLAY_NONE_CLASS);
}

const recordMapCoordinates = (coords) => {
    reviewData.placeX = coords[0];
    reviewData.placeY = coords[1];
}

const documentKeydownHandler = (ev) => {
    if(isEscapeKey(ev)) {
        hidePlaceMark();
        hideReviewContainer();
    }
}

const mapContainerClickEventHandler = (ev) => {
    hideOldReviewContainer();
    hideReviewContainer();
    showReviewContainer(ev.clientX, ev.clientY);
    showPlaceMark(reviewData.placeX, reviewData.placeY);
}
const reviewContainerCloseButtonClickHandler = () => {
    hidePlaceMark();
    hideReviewContainer();
}
const reviewFormElementsInputEventHandler = (ev) => {
    recordReviewData(ev.currentTarget);
}
const reviewContainerSubmitButtonClickEventHandler = () => {
    proceedReview();
}

const createMapContainer = () => {
    const mapContainer = document.createElement('div');
    mapContainer.classList.add('ya-map-container');
    document.body.append(mapContainer);
    return mapContainer;
}
const mapContainer = createMapContainer();
mapContainer.addEventListener('click', mapContainerClickEventHandler);

export { recordMapCoordinates };
export { showReviewContainer, hideReviewContainer, getReviewContainer};
