import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, pluck } from 'rxjs/operators';
import Swiper from 'swiper';
import cookie from 'cookie';
import { BREAKPOINTS, DEBOUNCE_INTERVAL_MS, MAX_SEARCH_HISTORY } from '@/variables/variables';
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

/* --- Дальше старое --- */

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

export const isTouchDevice = (): boolean => 'ontouchstart' in document;

export const getDeviceType = () => {
    if (window.matchMedia(`(min-width: ${BREAKPOINTS.LG}px)`).matches) {
        return 'desktop';
    }
    if (window.matchMedia(`(min-width: ${BREAKPOINTS.MD}px)`).matches) {
        return 'tablet';
    }
    return 'mobile';
};

export const onChangeDevice = (
    desktopCallback: () => void,
    mobileCallback: () => void,
    desktopMinWidth = BREAKPOINTS.LG,
): Subscription => {
    if (window.innerWidth < desktopMinWidth) {
        mobileCallback();
    } else {
        desktopCallback();
    }

    let prevWidth = window.innerWidth;

    return fromEvent(window, 'resize')
        .pipe(debounceTime(DEBOUNCE_INTERVAL_MS), pluck('target', 'innerWidth'))
        .subscribe((currentWidth: unknown) => {
            if (typeof currentWidth === 'number') {
                if (currentWidth < desktopMinWidth && prevWidth >= desktopMinWidth) {
                    mobileCallback();
                } else if (currentWidth >= desktopMinWidth && prevWidth < desktopMinWidth) {
                    desktopCallback();
                }
                prevWidth = currentWidth;
            }
        });
};

let scrollableContainer = document.querySelector('[data-barba="container"]') as HTMLElement;
listen('barba:new-page', (e?: CustomEvent) => {
    scrollableContainer = e?.detail;
});
export const getPageScrollContainer = (): HTMLElement | null => scrollableContainer;

export const getHistorySearch = (): string[] => {
    const historyFromCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('searchHistory='))
        ?.split('=')[1];
    return historyFromCookie ? JSON.parse(historyFromCookie) : [];
};

export const addSearchHistory = (value: string) => {
    const currentHistory = getHistorySearch();
    if (currentHistory.find((item) => item === value)) return;

    if (currentHistory.length >= MAX_SEARCH_HISTORY) {
        currentHistory.shift();
    }
    currentHistory.push(value);
    document.cookie = `searchHistory=${JSON.stringify(currentHistory)}`;
};

export type MapPosition = {
    lat: number;
    long: number;
};

export enum Dimension {
    width = 'width',
    height = 'height',
}
export class DimensionBalancer {
    dimension: Dimension;

    nodes: HTMLElement[];

    resizeSubscription: Subscription | undefined;

    constructor(
        dimension: Dimension = Dimension.height,
        nodes: HTMLElement[] = [],
        breakpoint = 768
    ) {
        this.update = this.update.bind(this);
        this.dimension = dimension;
        this.nodes = nodes;
        this.update();

        if (breakpoint) {
            resize({
                desktop: this.initDesktop,
                mobile: this.initMobile
            }, { breakpoint, initial: true });
        } else {
            fromEvent(window, 'resize').pipe(debounceTime(200)).subscribe(this.update);
        }
    }

    initDesktop = () => {
        this.resizeSubscription = fromEvent(window, 'resize')
            .pipe(debounceTime(200))
            .subscribe(this.update);
    };

    initMobile = () => {
        this.resizeSubscription?.unsubscribe();
        this.resetDimensions();
    };

    resetDimensions = () => {
        this.nodes.forEach((node) => {
            node.style[this.dimension] = '';
        });
    };

    update() {
        const maxDimension =
            Math.max(
                ...this.nodes.map((node) => {
                    node.style[this.dimension] = 'auto';
                    const style = getComputedStyle(node);
                    return this.dimension === Dimension.height
                        ? node.offsetHeight -
                              parseFloat(style.paddingTop) -
                              parseFloat(style.paddingBottom)
                        : node.offsetWidth;
                })
            ) + 1;
        this.nodes.forEach((node) => {
            node.style[this.dimension] = `${maxDimension}px`;
        });
    }
}

export const swiperTabNavigationFix = (keycode: number, swiper: Swiper) => {
    if (swiper && keycode === 9) {
        setTimeout(() => {
            [...Object.values(swiper.slides)].slice(0, -1).forEach((slide, i) => {
                if (
                    slide.contains(document.activeElement) ||
                    slide.isSameNode(document.activeElement)
                ) {
                    console.log('passed', slide);
                    swiper.$el[0].scrollLeft = 0;
                    swiper.$el[0].scrollIntoView();
                    swiper.$wrapperEl[0].scrollLeft = 0;
                    swiper.slideTo(i);
                }
            });
        }, 0);
    }
};

/**
 * Add a URL parameter (or changing it if it already exists)
 * IE not supported URLSearchParams and URL
 * Returned new URL
 * @param key    string  the key to set
 * @param value   string  value
 * @example addUrlParam('foo', 'bar')
 */
export const addUrlParamIE = (key: string, value: string) => {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);

    let { search } = location;
    const param = `${key}=${value}`;
    const regex = new RegExp(`(&|\\?)${key}=[^\&]*`);

    search = search.replace(regex, `$1${param}`);

    if (!search.match(regex)) {
        search += (search.length > 0 ? '&' : '?') + param;
    }

    return location.origin + location.pathname + search;
};

/**
 * Get URL parameter
 * IE not supported URLSearchParams and URL
 * Returned parameter value if exist, else null
 * @param name    string  the key to get
 * @example "example.com?param1=name&param2=&id=6"
 * getUrlParamIE('param1');  // name
 * getUrlParamIE('id');      // 6
 * getUrlParamIE('param2');  // null
 */
export const getUrlParamIE = (name: string) => {
    const results = new RegExp(`[\?&]${name}=([^&#]*)`).exec(location.href);
    if (results == null) {
        return null;
    }

    return decodeURI(results[1]);
};

export const changeVisibility = (el: HTMLElement[] | HTMLElement, makeVisible = true) => {
    if (!Array.isArray(el)) {
        el.style.visibility = makeVisible ? 'visible' : 'hidden';
        return;
    }

    el.forEach((element) => {
        element.style.visibility = makeVisible ? 'visible' : 'hidden';
    });
};

export const htmlDecode = (input: string) =>
    DOMParser && input
        ? new DOMParser().parseFromString(input, 'text/html').documentElement.textContent
        : input;

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

export const isOverflowed = (element: HTMLElement) =>
    element.clientHeight + (isIe() ? 1 : 0) < element.scrollHeight;

export const isVisible = (
    element: HTMLElement,
    container: HTMLElement | null = getPageScrollContainer()
) => {
    if (!element || !container) return;

    const el = element.getBoundingClientRect();

    if (!isElementInViewport(el)) return false;

    const parent = container.getBoundingClientRect();

    return (
        el.bottom >= parent.top &&
        el.right >= parent.left &&
        el.top <= parent.bottom &&
        el.left <= parent.right
    );
};

export const isElementInViewport = (rect: DOMRect) =>
    !(
        rect.bottom < 0 ||
        rect.right < 0 ||
        rect.left > window.innerWidth ||
        rect.top > window.innerHeight
    );
