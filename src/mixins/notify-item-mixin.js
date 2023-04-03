import {mapActions} from 'vuex';

export default {
    props: {
        notify: {
            type: Object,
            required: true
        }
    },
    methods: {
        ...mapActions([
            'hideNotification',
            'notificationAnswer',
        ]),
    }
}