import "./css.css";

import {loadYandex} from './yandex/load.js';
import {proceedYandex} from './yandex/proceed.js';

loadYandex().then((ymaps) => {
    proceedYandex(ymaps);
})
