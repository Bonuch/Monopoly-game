import { mapMutations } from 'vuex';
import axios from '@/helpers/axios-instance';

export default {
    data() {
        return {
            error: null
        }
    },
    methods: {
        ...mapMutations(['loginSuccess']),
    },
    mounted() {

        if (this.$route.query.error) {
            this.error = true;
        } else {
            axios
                .get(this.url, {
                    params: { token: this.$route.query.token }
                })
                .then(response => {
                    this.loginSuccess(response.data);

                    if (this.$route.query.redirectToProfile == "true") {
                        this.$router.push("/profile/me");
                    } else {
                        this.$router.push("/play/games");
                    }
                })
                .catch(() => {});
        }
    }
}