import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import cookie from 'cookie';
import { BREAKPOINTS } from '@/variables/variables';
import {ComponentProps} from "@/base/component";
import {ResizeCallback, ResizeOptions} from "@/types/index";

/**
 * @description Функция для поиска HTML-элемента и генерации объекта, который необходим конструктору класса Component
 * @param name - Имя css-класса корневого элемента
 * @param target - Элемент, внутри которого будет происходить поиск
 * @return Объект с именем и корневым HTML-элементом
 */
export const getComponent = <T extends HTMLElement>(
    name: string,
    target: Document | HTMLElement = document
): ComponentProps<T> | null => {
    const component = target.querySelector<T>(`.${name}`)
    return component ? { name, component } : null
};

/**
 * @description Функция для поиска массива HTML-элементов и генерации массива объектов, которые необходимы конструктору класса Component
 * @param name - Имя css-класса корневого элемента
 * @param target - Элемент, внутри которого будет происходить поиск
 * @return Массив объектов с именем и корневым HTML-элементом
 */
export const getComponents = <T extends HTMLElement>(
    name: string,
    target: Document | HTMLElement = document
): ComponentProps<T>[] => {
    return Array.from(target.querySelectorAll<T>(`.${name}`)).map((component) => ({
        name,
        component,
    }));
}

/**
 * @description Подписка на событие resize окна браузера
 * @param callback - обработчик события resize (может быть функцией или объектом из двух функций, отдельно для десктоп и мобилки)
 * @param options - Дополнительные настройки для события resize ()
 */

export const resize = (callback: ResizeCallback, options: ResizeOptions = {}) => {
    options.debounce = options.debounce ?? 300;
    options.breakpoint = options.breakpoint ?? BREAKPOINTS.LG;
    let resizeCallback: VoidFunction;
    if ('call' in callback) {
        resizeCallback = () => callback(window);
    } else {
        resizeCallback = () => matchesBreakpoint(options.breakpoint!)
            ? callback.desktop(window)
            : callback.mobile(window);
    }
    if (options.initial) resizeCallback();
    return fromEvent(window, 'resize')
        .pipe(debounceTime(options.debounce))
        .subscribe(resizeCallback);
}

/**
 * Добавляет сторонний скрипт на страницу и позволяет выполнить действие после его загрузки или в случае ошибки
 * @param src - расположение скрипта
 * @return Promise
 */
export const loadScript = (src: string) => {
    return new Promise((resolve, reject) => {
        const injectedScript = document.querySelector(`script[src='${src}']`) as HTMLScriptElement;
        if (injectedScript) {
            injectedScript.onload = resolve;
            injectedScript.onerror = reject;
            return;
        }

        const scriptElement = document.createElement('script');
        scriptElement.onload = resolve;
        scriptElement.onerror = reject;
        scriptElement.type = 'text/javascript';
        scriptElement.src = src;
        document.body.appendChild(scriptElement);
    });
}

/**
 * @description Проверка на Internet Explorer 11
 */
export const isIe = () => {
    const agent = window.navigator.userAgent;
    const msie = agent.indexOf('MSIE ');

    return msie > -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
};

/**
 * @description Установка css-переменной --vh
 * @description Переменная --vh используется в основном в мобильных устройствах
 */
export const setVhCssVariable = (): void => {
    const vh = document.documentElement.clientHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

/**
 * @description Проверка размеров окна на соответствие указанному брейкпоинту
 * @param breakpoint
 */
export const matchesBreakpoint = (breakpoint: number) => {
    return window.matchMedia(`(min-width: ${breakpoint}px)`).matches;
}

/**
 * Дальше старое
 * @todo Надо разобрать и описать
 */

export enum cookiesTypes {
    acceptAnalytics = 'acceptAnalytics',
    acceptSocial = 'acceptSocial',
    acceptAds = 'acceptAds',
}

export const collectHiddenInputs = (formData: FormData, target: HTMLElement) => {
    const inputs: HTMLInputElement[] = Array.from(target.querySelectorAll('input[type="hidden"]'));
    inputs.forEach(({ name, value }) => formData.append(name, value));
};

export const emit = (
    name: string,
    data?: any,
    element: Document | HTMLElement = document,
    shouldBubble = false
) => {
    let evt;
    if (typeof CustomEvent === 'function') {
        evt = new CustomEvent(name, {
            detail: data,
            bubbles: shouldBubble,
        });
    } else {
        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(name, shouldBubble, false, data);
    }
    element.dispatchEvent(evt);
};

export const listen = (
    name: string,
    handler: (e?: CustomEvent) => void,
    element: Document | Element = document
) => {
    element.addEventListener(name, handler as EventListener);
};

export const unlisten = (
    name: string,
    handler: (e?: CustomEvent) => void,
    element: Document | Element = document
) => {
    element.removeEventListener(name, handler as EventListener);
};

export const isCookiesTypeAllowed = (cookieType: cookiesTypes) =>
    !!cookie.parse(document.cookie)[cookiesTypes[cookieType]];

export const cookieTypeConsentHandler = (cookieType: cookiesTypes, consented: boolean) => {
    document.cookie = cookie.serialize(cookieType, consented ? 'ok' : 'no', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 5,
    });

    switch (cookieType) {
        case cookiesTypes.acceptAds:
            if (window.gtag) {
                window.gtag('consent', 'update', {
                    ad_storage: consented ? 'granted' : 'denied',
                });
            }
            break;
        case cookiesTypes.acceptAnalytics:
            (window as { [key: string]: any })[
                `disableYaCounter${document.body.dataset.yaMetrikaId}`
            ] = consented;

            if (window.gtag) {
                window.gtag('consent', 'update', {
                    analytics_storage: consented ? 'granted' : 'denied',
                });
            }
            break;
        case cookiesTypes.acceptSocial:
            // vk, fb - social-posts
            // youtube - video-player
            break;
        default:
            break;
    }
};

export const isValidDate = (date: unknown) => date instanceof Date && !isNaN(date.getTime());
