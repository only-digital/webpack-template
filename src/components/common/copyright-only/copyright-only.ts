import Component, { ComponentProps, ComponentOptions } from '@/base/component';

interface CopyrightOnlyOptions extends ComponentOptions {

}

export default class CopyrightOnly extends Component {
    constructor(element: ComponentProps, options?: CopyrightOnlyOptions) {
        super(element);
    }

    destroy = () => {
        // Destroy function
    }
}
