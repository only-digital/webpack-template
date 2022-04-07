import { prefersReducedMotion } from './helpers';

export type ComponentProps<T = HTMLElement> = {
    name: string;
    component: T;
};

class Component {
    nRoot: HTMLElement;

    nRootName: string;

    destroy: () => void;

    constructor({ name, component }: ComponentProps) {
        this.nRoot = component;
        this.nRootName = name;
    }

    observe = (target: HTMLElement = this.nRoot, animateThreshold = 0) => {
        if (prefersReducedMotion()) {
            this.nRoot.classList.add('animate');
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(({ intersectionRatio, boundingClientRect }) => {
                    if (intersectionRatio > animateThreshold) {
                        this.nRoot.classList.add('animate');
                        this.onAnimate();
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: [0, 0.0001, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            }
        );

        observer.observe(target);
    };

    onAnimate = () => {};

    getElement = (name: string): HTMLElement =>
        this.nRoot.querySelector(`.${this.nRootName}__${name}`);

    getElements = (name: string): HTMLElement[] =>
        Array.from(this.nRoot.querySelectorAll(`.${this.nRootName}__${name}`));
}

export const getComponent = (
    name: string,
    target: Document | HTMLElement = document
): ComponentProps => ({
    name,
    component: target.querySelector(`.${name}`),
});

export const getComponents = (
    name: string,
    target: Document | HTMLElement = document
): ComponentProps[] =>
    Array.from(target.querySelectorAll(`.${name}`)).map((component: HTMLElement) => ({
        name,
        component,
    }));

export default Component;
