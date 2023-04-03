<template>
    <main class='mainblock'>
        <NavMenuProfile></NavMenuProfile>

        <form class='profile' method="post" enctype="multipart/form-data" @submit.prevent="onSubmit">
            <div class='profile__head'>
                <h1 class='title'>
                    <img class='' src='/design/profile/fingerprint.svg' alt='#'>
                    <span class=''>{{ $t('USER_PROFILE.Персональная информация') }}</span>
                </h1>
                <div class='controls'>
                    <button href='' class='save' type="submit">{{ $t('GENERAL.Сохранить') }}</button>
                    <button href='' class='cancel' @click="onResetBtnClick">{{ $t('GENERAL.Отменить') }}</button>
                </div>
            </div>

            <div class='avatar profile-col'>
                <div class='profile__avatar'>
                    <img class='avatar__image' v-if='userAvatar' :src='userAvatar' alt='#'>

                </div>
                <div>
                    <button type='button' id='pick-avatar' class='avatar__upload'><i class='fas fa-camera'></i>{{
                            $t('USER_PROFILE.Сменить аватар')
                        }}
                    </button>
                    <avatar-cropper
                        :uploadHeaders="{
                            Authorization: 'Bearer ' + tokens.accessToken
                        }"
                        @uploaded='handleUploaded'
                        trigger='#pick-avatar'
                        :upload-url='`${baseAppUrl}/api/upload-avatar`'
                        :labels="{submit: 'Ок', cancel: $t('GENERAL.Отменить')}"
                    />
                </div>
            </div>
            <div class='profile-col flex-1 no-padding'>
                <section class='profile-row'>
                    <h4 class='row__title'>{{ $t('USER_PROFILE.Основное') }}</h4>
                    <div class='profile__info'>
                        <!--                        <InputGroup-->
                        <!--                            groupName="fullname"-->
                        <!--                            :groupLabel="$t('USER_PROFILE.Имя')">-->

                        <!--                        </InputGroup>-->
                        <div class='input__group'>
                            <BaseInputInteractive
                                type='text'
                                name='fullname'
                                labelSelectors='no-absolute-pos personal-info'
                                groupSelectors='personal-info'
                                inputSelectors='base-input__input--no-border personal-info__input'
                                id='profile-form-fullname'
                                class='border-dark flex-1 padding-bottom-10'
                                :label="$t('USER_PROFILE.Имя')"
                                :error='!!(errors && errors.fullname)'
                                v-model.trim='fullname'
                                @input="validate($event, 'fullname')"
                                required
                            />

                            <FormError
                                class='pos-absolute'
                                v-if='errors && errors.fullname'
                                :message='errors.fullname'
                            />

                        </div>
                        <div class='input__group'>
                            <BaseInputInteractive
                                type='text'
                                name='town'
                                class='border-dark flex-1 padding-bottom-10'
                                id='profile-form-town'
                                labelSelectors='no-absolute-pos personal-info'
                                groupSelectors='personal-info'
                                inputSelectors='base-input__input--no-border personal-info__input'
                                :label="$t('USER_PROFILE.Город')"
                                :error='!!(errors && errors.town)'
                                v-model.trim='town'
                                @input="validate($event, 'town')"
                            />

                            <FormError
                                class='pos-absolute'
                                v-if='errors && errors.town'
                                :message='errors.town'
                            />
                            <UserProfileVisibilityToggler
                                class='profile-form__item-visibility'
                                :hidden-fields='hiddenFields'
                                prop-name='town'
                                v-on:visibility-toggle='onVisibilityToggle'
                            />
                        </div>
                        <div class='input__group'>
                            <BaseInputInteractive
                                type='number'
                                name='age'
                                id='profile-form-age'
                                class='border-dark flex-1 padding-bottom-10'
                                labelSelectors='no-absolute-pos personal-info'
                                groupSelectors='personal-info'
                                inputSelectors='base-input__input--no-border personal-info__input'
                                :label="$t('USER_PROFILE.Возраст')"
                                :min='0'
                                :error='!!(errors && errors.age)'
                                v-model.number.trim='age'
                                @input="validate($event, 'age')"
                            />

                            <FormError
                                v-if='errors && errors.age'
                                class='pos-absolute'
                                :message='errors.age'
                            />

                            <UserProfileVisibilityToggler
                                class='profile-form__item-visibility'
                                :hidden-fields='hiddenFields'
                                prop-name='age'
                                v-on:visibility-toggle='onVisibilityToggle'
                            />
                        </div>

                        <div class='input__group'>
                            <p class='profile-form-radio__text gender'>{{ $t('USER_PROFILE.Гендер') }}</p>
                            <BaseRadio
                                id='profile-form-male'
                                name='profile-form-gender'
                                labelSelectors='rounded'
                                :label="$t('USER_PROFILE.Мужской')"
                                class='profile__gender__input'
                                radio-value='Male'
                                v-model.trim='gender'
                            />

                            <BaseRadio
                                id='profile-form-female'
                                name='profile-form-gender'
                                labelSelectors='rounded'
                                :label="$t('USER_PROFILE.Женский')"
                                class='profile__gender__input'
                                radio-value='Female'
                                v-model.trim='gender'
                            />

                            <BaseRadio
                                id='profile-form-d'
                                name='profile-form-gender'
                                labelSelectors='rounded'

                                :label="$t('USER_PROFILE.Другое')"
                                class='profile__gender__input'
                                radio-value='D'
                                v-model.trim='gender'
                            />
                        </div>
                    </div>
                </section>
                <section class='profile-row'>
                    <h4 class='row__title'>{{ $t('USER_PROFILE.Безопасность') }}</h4>
                    <div class='profile__info'>
                        <div class='input__group'>
                            <BaseInputInteractive
                                type='text'
                                name='name'
                                labelSelectors='no-absolute-pos personal-info'
                                groupSelectors='personal-info'
                                inputSelectors='base-input__input--no-border personal-info__input'
                                class='border-dark flex-1 padding-bottom-10'
                                id='profile-form-name'
                                autocomplete='no'
                                :label="$t('USER_PROFILE.Логин')"
                                v-model='name'
                                :disabled='true'
                            />
                        </div>
                        <div class='input__group'>
                            <BaseInputInteractive
                                type='email'
                                name='email'
                                labelSelectors='no-absolute-pos personal-info'
                                groupSelectors='personal-info'
                                inputSelectors='base-input__input--no-border personal-info__input'
                                class='border-dark flex-1 padding-bottom-10'
                                id='profile-form-email'
                                :label="$t('USER_PROFILE.EMAIL')"
                                autocomplete='off'
                                :error='!!(errors && errors.email)'
                                @input="validate($event, 'email')"
                                v-model.trim='email'
                                required
                            />
                            <FormError
                                v-if='errors && errors.email'
                                :message='errors.email'
                            />
                        </div>
                        <div class='input__group'>
                            <BaseInputInteractive
                                type='password'
                                name='password'
                                labelSelectors='no-absolute-pos personal-info'
                                groupSelectors='personal-info'
                                inputSelectors='base-input__input--no-border personal-info__input'
                                class='border-dark flex-1 padding-bottom-10'
                                id='profile-form-password'
                                autocomplete='new-password'
                                :label="$t('USER_PROFILE.Пароль')"
                                @blur='checkPassword'
                                :error='!!(errors && errors.password)'
                                v-model.trim='password'
                            />

                            <FormError
                                v-if='errors && errors.password'
                                class='pos-absolute'
                                :message='errors.password'
                            />
                        </div>
                        <div class='input__group'>
                            <BaseInputInteractive
                                type='password'
                                name='passwordAccepted'
                                labelSelectors='no-absolute-pos personal-info'
                                groupSelectors='personal-info'
                                inputSelectors='base-input__input--no-border personal-info__input'
                                class='border-dark flex-1 padding-bottom-10'
                                id='profile-form-passwordAccepted'
                                :label="$t('USER_PROFILE.Подтверждение пароля')"
                                autocomplete='new-password'
                                :error='!!(errors && errors.passwordAccepted)'
                                @blur='checkPassword'
                                v-model.trim='passwordAccepted'
                            />

                            <FormError
                                v-if='errors && errors.passwordAccepted'
                                class='pos-absolute'
                                :message='errors.passwordAccepted'
                            />

                        </div>


                    </div>

                </section>
                <section class='profile-row'>
                    <h4 class='row__title'>{{ $t('USER_PROFILE.Социальные') }}</h4>
                    <div class='profile__info'>
                        <div class='input__group'>
                            <BaseInputInteractive
                                type='text'
                                name='instagram'
                                labelSelectors='no-absolute-pos personal-info'
                                groupSelectors='personal-info'
                                inputSelectors='base-input__input--no-border personal-info__input'
                                class='border-dark flex-1 padding-bottom-10'
                                id='profile-form-instagram'
                                label='Instagram'
                                v-model.trim='instagram_url'
                            />

                            <UserProfileVisibilityToggler
                                class='profile-form__item-visibility'
                                :hidden-fields='hiddenFields'
                                prop-name='Инстаграм'
                                v-on:visibility-toggle='onVisibilityToggle'
                            />

                        </div>
                        <div class='input__group'>
                            <BaseInputInteractive
                                type='text'
                                name='vk'
                                labelSelectors='no-absolute-pos personal-info'
                                groupSelectors='personal-info'
                                inputSelectors='base-input__input--no-border personal-info__input'
                                class='border-dark flex-1 padding-bottom-10'
                                id='profile-form-vk'
                                :label="$t('USER_PROFILE.Вконтакте')"
                                v-model.trim='vkontakte_url'
                            />

                            <UserProfileVisibilityToggler
                                class='profile-form__item-visibility'
                                :hidden-fields='hiddenFields'
                                prop-name='vkontakte_url'
                                v-on:visibility-toggle='onVisibilityToggle'
                            />

                        </div>
                        <div class='input__group'>
                            <BaseInputInteractive
                                type='text'
                                name='facebook'
                                labelSelectors='no-absolute-pos personal-info'
                                groupSelectors='personal-info'
                                inputSelectors='base-input__input--no-border personal-info__input'
                                class='border-dark flex-1 padding-bottom-10'
                                id='profile-form-facebook'
                                label='Facebook'
                                v-model.trim='facebook_url'
                            />

                            <UserProfileVisibilityToggler
                                class='profile-form__item-visibility'
                                :hidden-fields='hiddenFields'
                                prop-name='facebook_url'
                                v-on:visibility-toggle='onVisibilityToggle'
                            />

                        </div>
                    </div>
                </section>
                <section class='profile-row'>
                    <h4 class='row__title'>{{ $t('USER_PROFILE.Язык') }}</h4>
                    <div class='profile__info'>
                        <div class='input__group'>
                            <BaseRadio
                                id='profile-form-language-en'
                                name='profile-form-language'
                                labelSelectors='rounded'
                                label='🇺🇸'
                                class='profile__gender__input'
                                radio-value='en'
                                v-model.trim='language'
                            />

                            <BaseRadio
                                id='profile-form-language-ru'
                                name='profile-form-language'
                                labelSelectors='rounded'
                                label='🇷🇺'
                                class='profile__gender__input'
                                radio-value='ru'
                                v-model.trim='language'
                            />
                        </div>
                    </div>
                </section>
            </div>
        </form>
    </main>
</template>

<script>
import i18n from '../i18n';
import { mapGetters, mapActions } from 'vuex';
import NavMenuProfile from '@/components/navigations/NavMenuProfile';
import BaseInputInteractive from '@/components/base/BaseInputInteractive';
import FormError from '@/components/base/FormError';
import BaseRadio from '@/components/base/BaseRadio';
import BaseButton from '@/components/base/BaseButton';
import UserProfileVisibilityToggler from '@/components/user-profile/UserProfileVisibilityToggler';
import AvatarCropper from 'vue-avatar-cropper';
import InputGroup from '@/components/base/inputs/InputGroup';

export default {
    name: 'EditUserProfile',
    components: {
        UserProfileVisibilityToggler,
        BaseButton,
        BaseRadio,
        InputGroup,
        FormError,
        BaseInputInteractive,
        NavMenuProfile,
        AvatarCropper,
    },
    data() {
        return {
            fullname: null,
            gender: null,
            name: null,
            town: null,
            age: null,
            email: null,
            password: null,
            passwordAccepted: null,
            instagram_url: null,
            vkontakte_url: null,
            facebook_url: null,
            hiddenFields: [],
            userAvatar: null,
            errors: {},
            baseAppUrl: null,
            avatarUploadMsg: null,
            language: null,
        };
    },
    computed: {
        ...mapGetters(['currentUser', 'tokens']),
        hasErrors() {
            return Object.keys(this.errors).length > 0;
        },
    },
    methods: {
        ...mapActions(['updateProfileData', 'updateProfileAvatar']),
        onVisibilityToggle(val, propName) {
            if (!val) {
                this.hiddenFields.push(propName);
            } else {
                this.hiddenFields.forEach((item, idx) => {
                    if (item === propName) {
                        this.$delete(this.hiddenFields, idx);
                    }
                });
            }
        },

        onResetBtnClick() {
            this.userAvatar = null;
            this.avatarUploadMsg = null;
            this.$router.push({ name: 'profile' });
        },

        isEmpty(val) {
            return val === '';
        },

        checkPassword(val) {
            const msg = this.$t('USER_PROFILE.Пароли не совпадают');

            if (!this.isEmpty(val) && this.password !== this.passwordAccepted) {
                this.$set(this.errors, 'password', msg);
                this.$set(this.errors, 'passwordAccepted', msg);
            } else {
                this.$delete(this.errors, 'password');
                this.$delete(this.errors, 'passwordAccepted');
            }
        },

        validate(val, name) {
            const msg = this.$t('USER_PROFILE.Заполните поле');

            if (this.isEmpty(val)) {
                this.$set(this.errors, name, msg);
            } else {
                this.$delete(this.errors, name);
            }
        },

        // addAuthHeader(form, request, response) {
        //     request.open(request.method, request.url, true)
        //     request.setRequestHeader('Authorization', 'Bearer ' + this.tokens.accessToken)
        //     request.send()
        //     console.log('FORM', form);
        //     console.log('TOKENS', this.tokens);
        //     console.log('request headers', request.method, request.url, request.headers);
        //     console.log('REQ', request);
        //     console.log('response', response);
        // },

        handleUploaded(resp) {
            if (!resp.error) {
                this.avatarUploadMsg = this.$t('USER_PROFILE.Для обновления аватара - нажмите Сохранить');
                this.userAvatar = resp.relative_url;
            } else {
                this.$dialog.alert(resp.error);
            }
        },

        async onSubmit() {
            try {
                if (this.hasErrors) {
                    throw new Error(this.$t('USER_PROFILE.Исправьте поля с ошибками'));
                }

                const data = {
                    fullname: this.fullname,
                    town: this.town,
                    age: this.age,
                    gender: this.gender,
                    email: this.email,
                    instagram_url: this.instagram_url,
                    vkontakte_url: this.vkontakte_url,
                    facebook_url: this.facebook_url,
                    language: this.language,
                };

                // меняем аватар
                if (this.userAvatar) {
                    this.avatarUploadMsg = null;
                    data.avatar_url = this.userAvatar;
                }

                // изменяем пароль, если ввели
                if (this.password) {
                    data.password = this.password;
                }

                // добавляем скрытые поля, если заданы
                if (this.hiddenFields) {
                    data.hiddenFields = this.hiddenFields.join(',');
                }

                await this.updateProfileData(data);
            } catch (e) {
                console.log(`Ошибка при сохранении формы: ${e}`);
            }
        },
    },
    created() {
        this.userAvatar = this.currentUser.avatar;
        this.fullname = this.currentUser.username ? this.currentUser.username : null;
        this.town = this.currentUser.town ? this.currentUser.town : null;
        this.age = this.currentUser.age ? this.currentUser.age : null;
        this.gender = this.currentUser.gender ? this.currentUser.gender : null;
        this.name = this.currentUser.login ? this.currentUser.login : null;
        this.email = this.currentUser.email ? this.currentUser.email : null;
        this.instagram_url = this.currentUser.instagram_url ? this.currentUser.instagram_url : null;
        this.vkontakte_url = this.currentUser.vkontakte_url ? this.currentUser.vkontakte_url : null;
        this.facebook_url = this.currentUser.facebook_url ? this.currentUser.facebook_url : null;
        this.hiddenFields = this.currentUser.hiddenFields ? this.currentUser.hiddenFields : [];
        this.language = this.currentUser.language ? this.currentUser.language : null;
    },
    mounted() {
        this.baseAppUrl = process.env.VUE_APP_HOST;
    },
    // watch: {
    //     language() {
    //         i18n.change(this.language);
    //     },
    // },
};
</script>

<style lang='scss' scoped>

.profile-form-radio__text {
    &.gender {
        margin-bottom: 0;
    }
}

.profile__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    flex-basis: 100%;


    .title {
        margin: 0;
        display: flex;
        align-items: center;

        img {
            width: 25px;
            height: 25px;
        }

        span {
            padding-left: 16px;
            color: #fff;
            font-size: 22px;
            font-weight: 600;
        }
    }
}

.BaseButton {
    padding: 7px 24px;
    color: #fff;
    background: var(--color-background-3);
    display: block;
    text-align: center;
    text-decoration: none;
    font-size: 15px;
    border-radius: 3px;
    border: none;
    outline: none;
}

.controls {
    display: flex;

    .save {
        @extend .BaseButton;
        background: var(--color-purple-medium);
    }

    .cancel {
        margin-left: 16px;
        @extend .BaseButton;
    }
}

.profile-col {
    padding-right: 42px;
    margin-top: 50px;

    &:last-child {
        padding: 0;
    }
}

.no-padding {
    padding: 0;
}

.avatar {
    width: 180px;
    padding-right: 42px;

    @media screen and (max-width: 1600px){
        width: 160px;;
    }

    @media screen and (max-width: 1440px){
        width: 120px;
    }

    @media screen and (max-width: 1024px) {
        width: 100%;
        padding-right: 0;
    }

    .profile__avatar {
        img {
            width: 180px;
            height: 180px;
            border-radius: 4px;
            @media screen and (max-width: 1600px){
                width: 160px;
                height: 160px;
            }

            @media screen and (max-width: 1440px){
                width: 120px;
                height: 120px;
            }
            @media screen and (max-width: 1024px) {
                width: 100%;
                height: 300px;
                object-fit: cover;
            }
        }
    }

    .avatar__upload {
        i {
            margin-right: 12px;
        }

        margin: 20px 0 0 0;
        padding: 5px 10px;
        text-decoration: none;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--color-gray-dark);
        width: 100%;
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
    }
}

.flex-1 {
    flex: 1;
}

.border-dark {
    border-bottom: 1px solid #202124;
}

.profile-row {
    width: 100%;

    .row__title {
        margin: 0 0 30px 0;
        color: var(--color-gray-dark);
        font-size: 18px;
        font-weight: 600;
    }

    .profile__info {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .input__group {
            //flex: 1;
            display: flex;
            align-items: center;
            width: calc(50% - 20px);
            //flex-basis: 50%;
            position: relative;
            margin-bottom: 30px;
            flex-wrap: wrap;
            @media screen and (max-width: 1024px) {
                width: 100%;
            }
        }
    }
}

.group__label {
    position: relative;
}

.pos-absolute {
    position: absolute;
    bottom: 10px;
    right: 0px;

    &.form-control__errors--rect {
        padding: 5px 10px;
        background: var(--color-red-light);
        border-radius: 5px;
    }

    .form-control__errors-text {
        h4 {
            color: var(--color-red-light) !important;
        }
    }
}

.padding-bottom-10 {
    padding-bottom: 10px;
}

.profile__gender__input {
    margin-top: 10px;
    label {
        padding: 7px 12px !important;
    }
}

.profile {
    box-sizing: border-box;
    padding: 35px 45px;
    border-radius: 8px;
    text-align: left;
    background: var(--color-background-2);
    margin: 20px auto;
    display: flex;
    flex-wrap: wrap;
    width: 996px;

    @media screen and (max-width: 1600px){
        width: 870px;
        padding: 25px 35px;
    }

    @media screen and (max-width: 1440px){
        padding: 15px 25px;
        width: 720px;
    }

    @media screen and (max-width: 1024px) {
        width: 100%;
    }

    &-title {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        margin-bottom: 85px;

        &__image {
            margin-right: 8px;
        }

        &__text {
            font-weight: 600;
            font-size: 30px;
            color: #fff;
        }
    }

    &-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        &__left {
            flex: 0 1 350px;
            margin-right: 25px;
        }

        &__right {
            flex: 1;
            max-width: 300px;
            display: flex;
            flex-direction: column;
        }
    }

    &-form {
        &__item {
            position: relative;
            max-width: 320px;
            margin-bottom: 42px;

            &-radio {
                display: flex;
                align-items: center;

                &:last-child {
                    margin-right: 0;
                }
            }

            &-visibility {
                position: absolute;
                //top: 50%;
                right: 0;
                bottom: -4px;
                //right: -26px;
                transform: translateY(-50%);
            }

            &:last-child {
                margin-bottom: 0;
            }
        }

        &-radio {
            &__text {
                margin-right: 40px;
                font-weight: 600;
                font-size: 12px;
                display: block;
                flex-basis: 100%;
                color: var(--color-gray-200);
            }

            &__item {
                margin-right: 20px;

                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }

    &-avatar {
        &__image {
            box-sizing: border-box;
            width: 100%;
            margin-bottom: 12px;
            object-fit: cover;
            border-radius: 4px;
        }

        &__message {
            color: #fff;
            text-align: center;
        }

        &__button {
            display: block;
            width: 100%;
            padding: 0;
            background-color: transparent;
            text-align: center;
            border-radius: 0;

            &-text {
                font-size: 20px;
                font-weight: 600;
                color: var(--color-gray-200);
                border-bottom: 1px solid;
                transition: all 0.3s ease;
            }

            &:hover,
            &:active,
            &:focus {
                .profile-avatar__button-text {
                    border-color: transparent;
                }
            }
        }
    }

    &-controls {
        margin-top: auto;

        &__buttons {
            display: flex;
            justify-content: space-between;
        }
    }

    &-buttons {
        &__item {
            max-width: 120px;

            &::v-deep {
                .btn {
                    font-weight: 400;
                    font-size: 15px;
                }
            }
        }
    }

    &-message {
        text-align: center;

        &__text {
            margin-bottom: 16px;

            span {
                display: inline;
                padding-bottom: 2px;
                color: #fff;
                font-size: 16px;
                text-align: center;
                border-bottom: 1px solid;
            }
        }

        &__button {
            display: inline-block;
            padding: 6px 10px 9px;
            margin-left: auto;
            margin-right: auto;
            background-color: #fff;
            text-align: center;
            font-size: 15px;
            border-radius: 3px;
        }
    }
}
</style>
