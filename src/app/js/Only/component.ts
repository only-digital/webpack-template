import { REDUCE_MOTION } from '@/variables/common';

export type ComponentProps<T = HTMLElement> = {
    name: string;
    component: T;
};

namespace Only {
    abstract class Component {
        nRoot: HTMLElement;
        nRootName: string;

        constructor({ name, component }: ComponentProps) {
            this.nRoot = component;
            this.nRootName = name;
        }

        observe = (target: HTMLElement = this.nRoot, animateThreshold = 0) => {
            if (REDUCE_MOTION) {
                this.nRoot.classList.add('animate');
                return;
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
                },
            );

            observer.observe(target);
        };

        onAnimate = () => {

        };

        getElement = <T extends HTMLElement>(name: string): T | null => {
            return this.nRoot.querySelector(`.${this.nRootName}__${name}`);
        };

        getElements = <T extends HTMLElement>(name: string): T[] => {
            return Array.from(this.nRoot.querySelectorAll(`.${this.nRootName}__${name}`));
        };

        destroy = () => {

        };
    }
}

