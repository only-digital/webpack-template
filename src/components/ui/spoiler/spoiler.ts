import { fromEvent, Subscription } from 'rxjs';
import {ComponentProps} from "@/Only/component";
import SpoilerBase from './spoiler-base';

export default class Spoiler extends SpoilerBase {
    collapseSubscription: Subscription;

    constructor(element: ComponentProps) {
        super(element);
        this.nContainer = this.getElement('content');

        this.collapseSubscription = fromEvent(this.nRoot, 'click').subscribe(this.collapse);
    }

    destroy = () => {
        // Destroy functions
        this.collapseSubscription?.unsubscribe();
    };
}
