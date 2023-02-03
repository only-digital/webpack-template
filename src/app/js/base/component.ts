import { IS_REDUCE_MOTION } from '@/variables/variables';

export type ComponentProps<T = HTMLElement> = {
    name: string;
    component: T;
};

export interface ComponentObserveOptions extends IntersectionObserverInit {
    animateThreshold?: number;
}

export interface ComponentOptions {
    component: string;
}

const defaultObserveOptions: ComponentObserveOptions = {
    rootMargin: '10px',
    threshold: [0, 0.0001, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    animateThreshold: 0
}

/**
 * @description Базовый класс для работы с компонентами
 */
abstract class Component {
    /** Корневой элемент компонента */
    public nRoot: HTMLElement;
    /** Имя корневого элемента */
    public nRootName: string;

    protected constructor({name, component}: ComponentProps) {
        this.nRoot = component;
        this.nRootName = name;
    }

    /**
     * @description Поиск внутреннего элемента компонента в соответствии с правилами наименования элементов
     * @param name - имя класса элемента после символов "__"
     * @return HTMLElement
     * @example
     * this.getElement('button');
     */
    protected getElement = <T extends HTMLElement>(name: string): T | undefined => {
        return this.nRoot.querySelector<T>(`.${this.nRootName}__${name}`) ?? undefined;
    };

    /**
     * @description Поиск внутренних элементов компонента в соответствии с правилами наименования элементов
     * @param name - имя класса элемента после символов "__"
     * @return HTMLElement[] - массив элементов с соответствующим классом, найденных внутри компонента
     * @example
     * this.getElements('button');
     */
    protected getElements = <T extends HTMLElement>(name: string): T[] => {
        return Array.from(this.nRoot.querySelectorAll(`.${this.nRootName}__${name}`));
    };

    /**
     * @description Отслеживание вхождения компонента в область видимости с помощью IntersectionObserver
     * @param target - целевой элемент, который будет отслеживаться
     * @param options - дополнительные параметры инициализации IntersectionObserver
     */
    public observe = (target = this.nRoot, options = defaultObserveOptions) => {
        if (IS_REDUCE_MOTION) {
            this.onIntersection();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(({intersectionRatio}) => {
                    if (intersectionRatio > options.animateThreshold!) {
                        this.onIntersection();
                        observer.disconnect();
                    }
                });
            },
            options,
        );

        observer.observe(target);
    };

    public onIntersection = () => {
        this.nRoot.classList.add('animate');
    };

    public destroy = () => {

    };
}

export default Component;
