import Component, { ComponentProps, ComponentOptions } from '@/base/component';

interface ExampleOptions extends ComponentOptions {
    clickable?: string;
    text?: string;
}

/**
 *  Пример компонента с дополнительными параметрами инициализации
 *  Параметры указываются в дата-атрибутах корневого элемента
 */
export default class Example extends Component {
    options?: ExampleOptions

    constructor(element: ComponentProps, options?: ExampleOptions) {
        super(element);

        this.options = options;

        if (this.options?.clickable) {
            this.nRoot.addEventListener('click', this.clickHandler)
        }
    }

    clickHandler = () => {
        alert(this.options?.text ?? 'Example text');
    }

    destroy = () => {
        if (this.options?.clickable) {
            this.nRoot.removeEventListener('click', this.clickHandler);
        }
    }
}
