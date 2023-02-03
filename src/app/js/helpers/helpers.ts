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
 * @param options - Дополнительные настройки для события resize
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
 * @description Ожидание определенного количества времени перед продолжением выполнения скрипта
 * @param timeMS - Время ожидания в миллисекундах
 * @return Promise
 * @example
 * wait(500).then(someFunction)
 */
export const wait = async (timeMS: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, timeMS));
}

/**
 * @description Добавляет сторонний скрипт на страницу и позволяет выполнить действие после его загрузки или в случае ошибки
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
 * @description Проверка на браузер Safari
 */
export const isSafari = (): boolean => {
    return !!~navigator.userAgent.indexOf('Safari') && !~navigator.userAgent.indexOf('Chrome');
};

/**
 * @description Проверка значения на допустимую дату
 * @param date - Предполагаемое значение типа Date
 */
export const isValidDate = (date: unknown) => date instanceof Date && !isNaN(date.getTime());

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
 * @description Находит элементы input c type="hidden" и сохраняет их данные в переданный объект FormData
 * @param formData - объект FormData, куда будут сохранены данные
 * @param target - HTMLElement, в котором будут найдены все input c type="hidden"
 * @deprecated
 */
export const collectHiddenInputs = (formData: FormData, target: HTMLElement) => {
    const inputs: HTMLInputElement[] = Array.from(target.querySelectorAll('input[type="hidden"]'));
    inputs.forEach(({ name, value }) => formData.append(name, value));
};

/**
 * @description Создает и вызывает кастомное событие
 * @param name - название события
 * @param data - данные, связанные с событием, будут доступны через event.detail
 * @param element - элемент, на котором вызывается событие, по умолчанию - document
 * @param shouldBubble - всплытие события - по умолчанию false
 */
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

/**
 * @description Добавляет слушатель события на элемент
 * @param name - название события
 * @param handler - функция - обработчик события
 * @param element - элемент, на который устанавливается слушатель события, по умолчанию - document
 */
export const listen = (
    name: string,
    handler: (e?: CustomEvent) => void,
    element: Document | Element = document
) => {
    element.addEventListener(name, handler as EventListener);
};

/**
 * @description Удаляет слушатель события с элемента
 * @param name - название события
 * @param handler - функция - обработчик события
 * @param element - элемент, с которого удаляется слушатель события, по умолчанию - document
 */
export const unlisten = (
    name: string,
    handler: (e?: CustomEvent) => void,
    element: Document | Element = document
) => {
    element.removeEventListener(name, handler as EventListener);
};

/** @todo Возможно работу с cookie стоит вынести в отдельный файл */
export enum cookiesTypes {
    acceptAnalytics = 'acceptAnalytics',
    acceptSocial = 'acceptSocial',
    acceptAds = 'acceptAds',
}

/**
 * @description Проверяет, что использование переданного cookie разрешено(cookie присутствует и имеет значение "ok")
 * @param cookieType - проверяемый cookie (из enum cookiesTypes)
 * @return true, если использование переданного cookie разрешено, иначе false
 */
export const isCookiesTypeAllowed = (cookieType: cookiesTypes) =>
    !!cookie.parse(document.cookie)[cookiesTypes[cookieType]];

/**
 * @description Сохраняет переданный cookie и обновляет разрешения для Google tag(ad_storage, analytics_storage) и Яндекс метрики
 * @param cookieType - сохраняемый cookie (из enum cookiesTypes)
 * @param consented - true- согласие на использование cookie, false - запрет
 */
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

