import { Subscription } from "rxjs";
import Component, { ComponentProps } from "@/base/component";
import { getDeviceType, onChangeDevice } from "@/helpers/common";

export default class Video extends Component {
    changeDeviceSubscription: Subscription;

    constructor(element: ComponentProps) {
        super(element);

        if (
            getDeviceType() === 'desktop' &&
            this.nRoot.getAttribute('desktop')
        )
            this.nRoot.setAttribute('desktop', <string>this.nRoot.getAttribute('data-src'));
        this.changeDeviceSubscription = onChangeDevice(
            this.initDesktop,
            this.initMobile
        );
    }

    play = () => (<HTMLVideoElement>this.nRoot).play();

    pause = () => (<HTMLVideoElement>this.nRoot).pause();

    initMobile = (): void => {};

    initDesktop = (): void => {
        if (this.nRoot.getAttribute('data-src'))
            this.nRoot.setAttribute('src', <string>this.nRoot.getAttribute('data-src'));
    };

    destroy = (): void => {
        this.changeDeviceSubscription.unsubscribe();
    };
}
