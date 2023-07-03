import Component, { ComponentProps } from '@/base/component';

type ExampleOptions = {
    clickable?: string;
    text?: string;
}

/**
 *  Пример компонента с дополнительными параметрами инициализации
 *  Параметры указываются в дата-атрибутах корневого элемента
 */
export default class Example extends Component<HTMLElement, ExampleOptions> {
    constructor(element: ComponentProps<HTMLElement>) {
        super(element);

        if (this.options.clickable) {
            this.nRoot.addEventListener('click', this.clickHandler)
        }
    }

    clickHandler = () => {
        alert(this.options.text ?? 'Example text');
    }

    destroy() {
        if (this.options.clickable) {
            this.nRoot.removeEventListener('click', this.clickHandler);
        }
    }
}
