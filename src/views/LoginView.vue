<template>
    <div class="page-registration">
        <div class="wrapper">
            <BaseLogo class="page-registration__logo" />
            <h1 class="page-registration__title">{{ $t("USER_PROFILE.Логин") }}</h1>
            <div class="alert alert-success" v-if="loginAfterEmailConfirm">
                {{ $t("SITE.Ваш e-mail подтвержден") }}.
                {{ $t("SITE.Войдите, чтобы продолжить") }}.
            </div>

            <form
                class="page-registration__form registration"
                method="post"
                @submit.prevent="onSubmit"
            >
                <div class="registration__controls">
                    <div class="registration__item">
                        <BaseInputInteractive
                            type="email"
                            name="email"
                            id="registration-email"
                            label="Email"
                            v-model.trim="email"
                            required
                        />
                    </div>

                    <div class="registration__item">
                        <BaseInputInteractive
                            type="password"
                            name="password"
                            id="registration-password"
                            :label="$t('USER_PROFILE.Пароль')"
                            v-model.trim="password"
                            required
                        />
                    </div>
                </div>

                <transition name="error">
                    <FormError class="registration__error" v-if="error" :message="error" />
                </transition>

                <BaseButton class="registration__submit" type="submit">
                    {{ $t("GENERAL.Войти") }}
                </BaseButton>
            </form>

            <SocialAuth :login="false" />

            <div class="free__accounts"><span>{{ $t("AUTH.REGISTRATION_LIMIT") }} {{ regLimit }}</span></div>
        </div>
    </div>
</template>

<script>
import { login, confirmLogin } from "@/helpers/auth";
import { registerWebsocket } from "@/helpers/general";
import { mapGetters, mapMutations } from "vuex";
import { setAuthorization } from "@/helpers/axios-instance";
import axios from "@/helpers/axios-instance";
import SocialAuth from "@/components/SocialAuth";
import BaseInputInteractive from "@/components/base/BaseInputInteractive";
import BaseLogo from "@/components/base/BaseLogo";
import BaseButton from "@/components/base/BaseButton";
import FormError from "../components/base/FormError";

export default {
    name: "login-view",
    components: {
        FormError,
        SocialAuth,
        BaseInputInteractive,
        BaseLogo,
        BaseButton,
    },
    data() {
        return {
            email: "",
            password: "",
            error: "",
            regLimit: null,
        };
    },
    computed: {
        ...mapGetters(["loginAfterEmailConfirm"]),
    },
    methods: {
        ...mapMutations([
            "setLoginAfterEmailConfirm",
            "loginSuccess",
            "updateToken",
        ]),
        onSubmit() {
            login({ username: this.email, password: this.password })
                .then((res) => {
                    this.error = "";
                    this.updateToken(res);
                    registerWebsocket(this.$store);

                    if (this.loginAfterEmailConfirm) {
                        this.$router.push({ name: "profile-settings" });
                    } else {
                        this.$router.push({ name: "play" });
                    }
                })
                .catch((error) => {
                    this.error = error;
                });
        },
        vk_token() {
            axios.get("/auth/vkontakte/get-token", { params: { token: this.$route.query.vk_token } })
                .then((res) => {
                    setAuthorization(res.data.accessToken);
                    this.updateToken(res.data);
                    registerWebsocket(this.$store);
                    this.$router.push({ name: "play" });
                })
                .catch((err) => {
                    this.error = this.$t("SITE.Что-то пошло не так");
                });
        },
        facebook_token() {
            axios.get("/auth/facebook/get-token", { params: { token: this.$route.query.facebook_token } })
                .then((res) => {
                    setAuthorization(res.data.accessToken);
                    this.updateToken(res.data);
                    registerWebsocket(this.$store);
                    this.$router.push({ name: "play" });
                })
                .catch((err) => {
                    this.error = this.$t("SITE.Что-то пошло не так");
                });
        },
        async getRegistrationLimit() {
            const { data } = await axios.get("/registrationlimit");
            this.regLimit = data.available;
        },
    },
    async created() {
        if (this.$route.query.vk_token) {
            this.vk_token();
        }
        if (this.$route.query.facebook_token) {
            this.facebook_token();
        }

        await this.getRegistrationLimit();
    },
};
</script>


<style scoped lang="scss">
* {
    box-sizing: border-box;
}

.free__accounts {
    span {
        margin: auto;
        margin-top: 20px;
        width: 350px;
        display: block;
        border-radius: 8px;
        background: rgba(#ffda26, .5);
        backdrop-filter: blur(15px);
        padding: 10px 25px;
    }
}

.page-registration {
    z-index: 1;
    padding: 13vh 0;
    min-height: 100vh;

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
