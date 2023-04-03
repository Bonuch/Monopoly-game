<template>
    <div id="emailConfirm">
        <div class="container">
            <div class="card mt-5">
                <div class="card-body">
                    <span v-if="!isLoaded">{{ $t('SITE.Проверка') }}...</span>
                    <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
                        {{ errorMessage }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from '@/helpers/axios-instance';
    import { mapGetters, mapMutations } from 'vuex';
    import { setAuthorization } from '@/helpers/axios-instance';
    import {registerWebsocket} from "../helpers/general";

    export default {
        name: "ConfirmEmailView",
        data() {
            return {
                errorMessage: '',
                isLoaded: false
            }
        },
        computed: {
            ...mapGetters([
                'isLoggedIn'
            ])
        },
        methods: {
            ...mapMutations([
                'currentUser',
                'setLoginAfterEmailConfirm',
                'acceptEmailConfirmation',
                'updateToken',
                'logout'
            ]),
            confirmEmail(email_token) {
                this.isLoaded = false;
                axios.post('/confirm-email', {
                    email_token: email_token
                }).then(res => {
                    this.isLoaded = true;
                    if (res.data.message) {
                        this.errorMessage = res.data.message;
                        setTimeout(() => {
                            this.logout();
                            this.$router.push({name: 'login'});
                        }, 5000);
                    } else {
                        this.errorMessage = '';

                        this.updateToken(res.data);
                        registerWebsocket(this.$store);

                        if (res.data.accessToken) {
                            setAuthorization(res.data.accessToken);
                            this.$router.push({name: 'profile-settings'});
                        } else {
                            this.logout();
                            this.$router.push({name: 'login'});
                        }

                    }
                }).catch((err) => {
                    this.logout();
                    this.$router.push({name: 'login'});
                });

            }
        },
        created() {
            const email_token = this.$route.query.key;
            this.confirmEmail(email_token);
        }
    }
</script>

<style scoped>
    #emailConfirm {
        font-size: 18px;
        line-height: 22px;
    }
</style>
