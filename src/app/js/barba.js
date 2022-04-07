import 'core-js/stable';
import 'regenerator-runtime/runtime';
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import 'picturefill/dist/picturefill.min';
import common from '../../pages/index/index';
import { emit, isIE } from './helpers';
import 'objectFitPolyfill/dist/objectFitPolyfill.min';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

barba.use(barbaPrefetch);

barba.hooks.beforeEnter((_data) => {
    if (isIE()) {
        objectFitPolyfill();
    }
});

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

                return new Promise((resolve) =>
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
