import {mapGetters, mapMutations} from 'vuex';
import axios from '@/helpers/axios-instance';

export default {
    data() {
        return {
            selectedItem: {},
            items: [],
            api_url_for_items: ''
        }
    },
    computed: {
        ...mapGetters(['currentUser'])
    },
    methods: {
        ...mapMutations([
            'updateCurrentUserState',
            'updateCurrentUserLoot'
        ]),
        refresh() {
            axios
                .get(this.api_url_for_items)
                .then(response => {
                    this.items = response.data.items;
                })
                .catch(() => {});
        },
    },
    created() {
        this.refresh();
    }
}
