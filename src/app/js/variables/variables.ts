export const BREAKPOINTS = {
    XS: 375,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1440,
    FHD: 1920,
};

export const IS_REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const IS_TOUCH_DEVICE = 'ontouchstart' in document;
