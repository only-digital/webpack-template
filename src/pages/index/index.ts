import { ITransitionData } from '@barba/core/dist/core/src/defs';
import { emit } from '@/helpers/helpers';

export default {
    namespace: 'common',
    async beforeEnter({ next: { container, url } }: ITransitionData) {
        try {
            emit('barba:new-page', container);

        } catch (e) {
            console.error(e);
        }
    },
    beforeLeave() {

    },

    afterLeave() {},
};
