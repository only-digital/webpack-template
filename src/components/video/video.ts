import { Subscription } from 'rxjs';
import Component, { ComponentProps } from '../../app/js/component';
import { getDeviceType, onChangeDevice } from '../../app/js/helpers';

export default class Video extends Component {
    changeDeviceSubscription: Subscription;

    nRoot: HTMLVideoElement;

    constructor(element: ComponentProps) {
        super(element);

        if (getDeviceType() === 'desktop' && this.nRoot.hasAttribute('data-src'))
            this.nRoot.setAttribute('src', this.nRoot.getAttribute('data-src'));
        this.changeDeviceSubscription = onChangeDevice(this.initDesktop, this.initMobile);
    }

    play = () => this.nRoot.play();

    pause = () => this.nRoot.pause();

    initMobile = (): void => {};

    initDesktop = (): void => {
        if (this.nRoot.hasAttribute('data-src'))
            this.nRoot.setAttribute('src', this.nRoot.getAttribute('data-src'));
    };

    destroy = (): void => {
        this.changeDeviceSubscription.unsubscribe();
    };
}