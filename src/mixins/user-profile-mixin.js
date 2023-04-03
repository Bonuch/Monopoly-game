import {mapGetters} from "vuex";

export default {
    data() {
        return {};
    },
    computed: {
        ...mapGetters([
            'currentUser'
        ]),
        profileBackgroundClass() {
            if (!this.currentUser) {
                return '';
            }
            switch (this.currentUser.gender) {
                case "Male":
                    return 'background__male';
                case "Female":
                    return 'background__female';
                default:
                    return 'background__default';
            }
        }
    },
    methods: {}
}