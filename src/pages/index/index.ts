import { ITransitionData } from '@barba/core/dist/core/src/defs';
import { getComponent, getComponents } from '../../app/js/component';
import { emit } from '../../app/js/helpers';
import Spoiler from '../../components/ui/spoiler/spoiler';

export default {
    namespace: 'common',
    async beforeEnter({ next: { container, url } }: ITransitionData) {
        try {
            emit('barba:new-page', container);

            const pageNamespace = container.getAttribute('data-page-namespace');

            // this.nHeader = new Header(getComponent('header'), container);

            if (getComponent('spoiler', container).component)
                getComponents('spoiler', container).map((component) => new Spoiler(component));
        } catch (e) {
            console.log(e);
        }
    },
    beforeLeave() {
        this.nHeader.destroy();
    },

    afterLeave() {},
};
