<template>
    <div class="page-registration">
        <div class="wrapper">
            <BaseLogo class="page-registration__logo"/>
            <h1 class="page-registration__title">{{ $t('SITE.Регистрация') }}</h1>

            <form
                method="post"
                class="page-registration__form registration"
                :class="{'registration--transparent': loader}"
                @submit.prevent="onSubmit"
            >
                <div v-if="loader" class="registration__loader">
                    <BaseLoader/>
                </div>

                <div class="registration__controls">
                    <div class="registration__item">
                        <BaseInputInteractive
                            type="text"
                            name="name"
                            id="registration-name"
                            :label="$t('SITE.Ваше имя')"
                            :error="!!(error && error.name)"
                            v-model.trim="params.name"
                            required
                        />

                        <FormError
                            v-if="error && error.name"
                            :message="error.name"
                        />
                    </div>

                    <div class="registration__item">
                        <BaseInputInteractive
                            type="email"
                            name="email"
                            id="registration-email"
                            :label="$t('SITE.Ваш email')"
                            :error="!!(error && error.email)"
                            v-model.trim="params.email"
                            required
                        />

                        <FormError
                            v-if="error && error.email"
                            :message="error.email"
                        />
                    </div>

                    <div class="registration__item">
                        <BaseInputInteractive
                            type="password"
                            name="password"
                            id="registration-password"
                            :label="$t('SITE.Ваш пароль')"
                            :error="!!(error && error.password)"
                            v-model.trim="params.password"
                            required
                        />

                        <FormError
                            v-if="error && error.password"
                            :message="error.password"
                        />
                    </div>

                    <div class="registration__item">
                        <BaseInputInteractive
                            type="password"
                            name="password_repeat"
                            id="registration-password_repeat"
                            :label="$t('USER_PROFILE.Подтверждение пароля')"
                            :error="!!(error && error.password_repeat)"
                            v-model.trim="params.password_repeat"
                            required
                        />

                        <FormError
                            v-if="error && error.password_repeat"
                            :message="error.password_repeat"
                        />
                    </div>
                </div>

                <transition name="error">
                    <FormError class="registration__error" v-if="error" :message="error"/>
                </transition>

                <BaseButton class="registration__submit" type="submit">
                    {{ $t('SITE.Зарегистрироваться') }}
                </BaseButton>
            </form>

            <SocialAuth :login="true"/>
        </div>
    </div>
</template>


<script>
    import axios from '@/helpers/axios-instance';
    import {login} from '@/helpers/auth';
    import {registerWebsocket} from '../helpers/general';
    import {mapMutations} from 'vuex';
    import BaseLogo from "../components/base/BaseLogo";
    import BaseInputInteractive from "../components/base/BaseInputInteractive";
    import FormError from "../components/base/FormError";
    import BaseButton from "../components/base/BaseButton";
    import SocialAuth from "../components/SocialAuth";
    import BaseLoader from "../components/base/BaseLoader";

    export default {
        name: 'RegistrationView',
        components: {BaseLoader, SocialAuth, BaseButton, FormError, BaseInputInteractive, BaseLogo},
        data() {
            return {
                loader: null,
                params: {
                    name: '',
                    email: '',
                    password: '',
                    password_repeat: ''
                },
                error: ''
            };
        },
        methods: {
            ...mapMutations([
                'updateToken',
                'setLoginAfterEmailConfirm'
            ]),
            resetFormFields() {
                this.params = {
                    name: null,
                    email: null,
                    password: null,
                    password_repeat: null,
                };
            },
            onSubmit() {
                this.loader = true;
                axios.post('/user-sign-up', this.params)
                    .then(response => {
                        login({username: this.params.email, password: this.params.password})
                            .then((res) => {
                                this.error = '';
                                this.updateToken(res);
                                registerWebsocket(this.$store);
                                this.loader = null;

                                this.$router.push({name: 'email-unconfirmed'});
                            })
                            .catch((error) => {
                                this.error = error;
                            });
                    })
                    .catch(error => {
                        this.loader = null;
                        this.error = error && error.response && error.response.data && error.response.data.message ? error.response.data.message : this.$t('SITE.Произошла ошибка.Попробуйте позже');
                    });
            }
        }
    }
</script>

<style scoped lang="scss">
    @keyframes show {
        0% {
            visibility: hidden;
            opacity: 0;
        }

        100% {
            visibility: visible;
            opacity: 1;
        }
    }

    * {
        box-sizing: border-box;
    }

    .page-registration {
        z-index: 1;
        min-height: 100vh;
        padding: 13vh 0;

        &:before {
            content: '';
            z-index: -1;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: url("/design/backgrounds/monobg.jpg") no-repeat center top / cover;
            //filter: blur(6px);
        }

        .wrapper {
            height: 100%;
        }

        &__logo {
            margin: 0 0 20px;
        }

        &__title {
            margin: 0 0 45px;
            color: #fff;
            font-size: 30px;
            font-weight: 600;
        }
    }

    .registration {
        position: relative;
        max-width: 460px;
        width: 100%;
        padding: 36px 26px 26px;
        margin: 0 auto 24px;
        background: rgba(0, 0, 0, 0.75);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        overflow: hidden;

        &:before {
            content: '';
            z-index: 10;
            display: none;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(50, 54, 57, 0.9);
        }

        &--transparent {
            &:before {
                display: block;
                animation: show 0.3s ease both;
            }
        }

        &__loader {
            z-index: 11;
            position: absolute;
            left: 50%;
            top: 50%;
            width: 100px;
            height: 100px;
            transform: translate(-50%, -50%);

            &::v-deep {
                .base-loader {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        &__controls {
            margin-bottom: 24px;
        }

        &__item {
            margin: 0 0 36px;

            &:last-of-type {
                margin-bottom: 0;
            }
        }

        &__error {
            margin: 0 0 20px;
        }

        &__submit {
            margin: 0;

            &::v-deep {
                .btn {
                    font-size: 18px;
                    border-radius: 30px;

                    &:hover,
                    &:active,
                    &:focus {
                        background-color: var(--color-base-blue);
                        color: #fff;
                    }
                }
            }
        }

        &__link {
            &:hover,
            &:active,
            &:focus {
                text-decoration: none;

                span {
                    color: var(--color-base-blue);
                }
            }

            span {
                display: inline;
                color: #fff;
                text-decoration: none;
                border-bottom: 1px solid;
                transition: all 0.3s ease;
            }
        }
    }

    @keyframes scale-in-ver-center {
        0% {
            transform: scaleY(0);
            opacity: 1;
        }
        100% {
            transform: scaleY(1);
            opacity: 1;
        }
    }

    .error-enter-active {
        animation: scale-in-ver-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    .error-leave-active {
        animation: scale-in-ver-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both reverse;
    }
</style>

