const YA_API_URL = 'https://api-maps.yandex.ru/2.1/?lang=en_US';

const loadYandex = () => {
    return new Promise((rS) => {
        const script = document.createElement('script');
        script.src = YA_API_URL;
        script.setAttribute('type', 'text/javascript');
        document.head.append(script);
        script.onload = () => {
            if (ymaps) {
                rS(ymaps);
            } else {
                rS(false);
            }
        }
    });
}

export {loadYandex};
