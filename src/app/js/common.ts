import 'core-js/stable';
import '../scss/common.scss';
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import common from '@/pages/index/index';
import {emit, resize} from '@/helpers/common';
import { cookiesTypes, setVhCssVariable } from '@/helpers/common';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import cookie from 'cookie';

// SVG
const requireAll = (r: __WebpackModuleApi.RequireContext) => r.keys().forEach(r);
requireAll(require.context('../../assets/icons', true, /\.svg$/));

if (window.gtag) {
    window.gtag('consent', 'update', {
        analytics_storage:
            cookie.parse(document.cookie)[cookiesTypes.acceptAnalytics] === 'ok'
                ? 'granted'
                : 'denied',
        ad_storage:
            cookie.parse(document.cookie)[cookiesTypes.acceptAds] === 'ok' ? 'granted' : 'denied',
    });
}

setVhCssVariable();
resize(setVhCssVariable);

barba.use(barbaPrefetch);

barba.hooks.beforeEnter((_data) => {});

barba.hooks.afterEnter((_data) => {});

barba.hooks.before((_data) => {});

barba.init({
    timeout: 500000,
    prefetchIgnore: '/bitrix',
    prevent: ({ el }) => el?.id?.indexOf('bx') !== -1 || el?.classList.contains('no-barba'),
    views: [common],
    requestError: (trigger, action, url, response) => false,
    transitions: [
        {
            name: 'opacity-transition',
            leave({ current: { container } }) {
                container.style.position = 'absolute';
                container.style.top = '0';
                container.style.left = '0';

                return new Promise<void>((resolve) =>
                    setTimeout(() => {
                        container.remove();
                        resolve();
                    }, 500)
                );
            },
            enter(data) {
                setTimeout(() => emit('page-transition'), 400);
                return new Promise((resolve) => setTimeout(resolve, 500));
            },
        },
        {
            name: 'self',
            enter() {
                setTimeout(() => emit('page-transition'), 51);
            },
        },
    ],
});
