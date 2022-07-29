import { Subscription } from 'rxjs';
import Component, {ComponentProps} from "@/base/component";
import { emit, resize } from '@/helpers/common';

export default class SpoilerBase extends Component {
    nContainer: HTMLElement | undefined;
    resizeSubscription: Subscription | null;

    constructor(element: ComponentProps) {
        super(element);
        this.resizeSubscription = null;
        this.nContainer = this.getElement('content')!;
    }

    collapse = (e: Event) => {
        if ((<HTMLElement>e.target).closest('a')) return;
        emit('spoiler:toggle');
        this.nRoot.classList.toggle('show');
        this.toggle(this.nRoot.classList.contains('show'));
    };

    toggle = (isOpen: boolean) => {
        if (isOpen) {
            this.nRoot.classList.add('show');
            if (this.nContainer) this.setHeight(`${this.nContainer.scrollHeight}px`);
            this.resizeSubscription = resize(this.resizeHandler);
        } else {
            this.resizeSubscription?.unsubscribe();
            this.setHeight('');
            this.nRoot.classList.remove('show');
            this.resizeSubscription = null;
        }
    };

    setHeight = (value: string) => {
        if (this.nContainer) this.nContainer.style.maxHeight = value;
    };

    resizeHandler = () => {
        if (this.nContainer) {
            this.setHeight(`${this.nContainer.scrollHeight}px`);
        }
    };

    destroy = () => {
        // Destroy functions
    };
}
