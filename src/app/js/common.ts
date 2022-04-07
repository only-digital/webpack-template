import { cookiesTypes, isCookiesTypeAllowed, setVhCssVariable } from './helpers';
import '../scss/common.scss';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import cookie from 'cookie';

require('intersection-observer');

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
fromEvent(window, 'resize')
    .pipe(debounceTime(200))
    .subscribe(() => {
        setVhCssVariable();
    });
