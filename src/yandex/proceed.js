import reviewHTML from '../templates/review-container.html';

const LEFT = 'left';
const RIGHT = 'right';
const TOP = 'top';
const BOTTOM = 'bottom';
const REVIEW_FORM_CLASS = 'review-form';
const CLOSE_BUTTON_CLASS = 'review-close';
const SUBMIT_BUTTON_CLASS = 'review-submit';
const reviewData = {
    placeX: '',
    placeY: '',
    name: '',
    place: '',
    feedback: '',
    map: '',
    ymaps: '',
}

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
        const newReviewData = JSON.parse(localStorage.getItem('reviewData')) || [];
        newReviewData.push({
            placeX,
            placeY,
            name,
            place,
            feedback,
        });

        /*send the review data to server*/
        localStorage.setItem('reviewData',
            JSON.stringify(newReviewData)
        );
        console.log(JSON.parse(localStorage.getItem('reviewData')));
    }
}

const recordMapCoordinates = (coords) => {
    reviewData.placeX = coords[0];
    reviewData.placeY = coords[1];
}
const hidePlaceMark = () => {
    reviewData.map.geoObjects.removeAll();
}
const showPlaceMark = () => {
    hidePlaceMark();
    const placeMark = new reviewData.ymaps.Placemark([reviewData.placeX, reviewData.placeY], null, {preset: 'islands#darkGreenCircleDotIcon'});
    reviewData.map.geoObjects.add(placeMark);
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

    reviewContainer.classList.remove('display-none');

    document.addEventListener('keydown', documentKeydownHandler);
    reviewContainerCloseButton.addEventListener('click', reviewContainerCloseButtonClickHandler);

    /*add events to reviewFormFields*/
    reviewForm.elements['name'].addEventListener('input', reviewFormElementsInputEventHandler);
    reviewForm.elements['place'].addEventListener('input', reviewFormElementsInputEventHandler);
    reviewForm.elements['feedback'].addEventListener('input', reviewFormElementsInputEventHandler);

    reviewContainerSubmitButton.addEventListener('click', reviewContainerSubmitButtonClickEventHandler);
}
const hideReviewContainer = () => {
    emptyReviewForm();
    document.removeEventListener('keydown', documentKeydownHandler);
}

const reviewFormElementsInputEventHandler = (ev) => {
    recordReviewData(ev.currentTarget);
}
const reviewContainerCloseButtonClickHandler = () => {
    hidePlaceMark();
    hideReviewContainer();
}
const reviewContainerSubmitButtonClickEventHandler = () => {
    proceedReview();
}
const documentKeydownHandler = (ev) => {
    if(isEscapeKey(ev)) {
        hidePlaceMark();
        hideReviewContainer();
    }
}

const mapContainerClickHandler = (ev) => {
    hideReviewContainer();
    showReviewContainer(ev.clientX, ev.clientY);
}

const setMap = (map, ymaps) => {
    reviewData.map = map;
    reviewData.ymaps = ymaps;
    reviewData.map.events.add('click', (ev) => {
        recordMapCoordinates(ev.get('coords'));
        showPlaceMark();
    });
}

export { mapContainerClickHandler };
export { setMap };

