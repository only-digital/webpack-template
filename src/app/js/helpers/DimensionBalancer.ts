import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { resize } from '@/helpers/helpers';

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
