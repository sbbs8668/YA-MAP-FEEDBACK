/*require("html-loader!../src/templates/review-container.html");*/
import reviewHTML from '../templates/review-container.html';

const LEFT = 'left';
const RIGHT = 'right';
const TOP = 'top';
const BOTTOM = 'bottom';
const REVIEW_FORM_CLASS = 'review-form';
const CLOSE_BUTTON_CLASS = 'review-close';
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

const isEscapeKey = (ev) => ev.key === 'Escape';
const emptyReviewForm = () => {
    [...reviewForm.elements].forEach((formElement) => {
        formElement.value = '';
    });
}

const showReviewContainer = (x, y) => {
    reviewContainer.style.removeProperty('top');
    reviewContainer.style.removeProperty('bottom');
    reviewContainer.style.removeProperty('left');
    reviewContainer.style.removeProperty('right');

    const xPosition = window.innerWidth / 2 > x ? LEFT : RIGHT;
    const yPosition = window.innerHeight / 2 > y ? TOP : BOTTOM;
    const xPositionValue = xPosition === RIGHT ? `${window.innerWidth - x}px` : `${x}px`;
    const yPositionValue = yPosition === BOTTOM ? `${window.innerHeight - y}px` : `${y}px`;

    reviewContainer.style.setProperty(xPosition, xPositionValue);
    reviewContainer.style.setProperty(yPosition, yPositionValue);

    reviewContainer.classList.remove('display-none');

    document.addEventListener('keydown', documentKeydownHandler);
    reviewContainerCloseButton.addEventListener('click', reviewContainerCloseButtonClickHandler);
}
const hideReviewContainer = () => {
    emptyReviewForm();
    reviewContainer.classList.add('display-none');
    mapContainer.addEventListener('click', mapContainerClickHandler);
    document.removeEventListener('keydown', documentKeydownHandler);
    reviewContainerCloseButton.removeEventListener('click', reviewContainerCloseButtonClickHandler);
}

const mapContainerClickHandler = (ev) => {
    hideReviewContainer();
    showReviewContainer(ev.clientX, ev.clientY);
}
const reviewContainerCloseButtonClickHandler = () => {
    hideReviewContainer();
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
