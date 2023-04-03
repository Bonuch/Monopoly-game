<template>
    <div v-if="currentUser" class="profile-card" :class="[profileBackgroundClass, isPlayerInLoby ? 'inLobby' : '']">
        <div class="profile-info">
            <div class="profile-data user_additional">
                <div class="profile-image" :style="{ borderColor: currentUser.color }">
                    <router-link to="/profile/me">
                        <img class="profile-photo" :src="currentUser.avatar" alt="#"/>
                    </router-link>
                </div>
                <div class="profile-socials" v-if="isHaveSocialLink">
                    <div class="social-item">
                        <a v-if="currentUser.instagram_url"
                           class="social instagram"
                           :href="currentUser.instagram_url"
                           title="instagram"
                           target="_blank">
                            <img src="/design/icons/socials/new-instagram.svg" alt="">
                        </a>
                    </div>
                    <div class="social-item">
                        <a v-if="currentUser.facebook_url"
                           class="social instagram"
                           :href="currentUser.facebook_url"
                           title="instagram"
                           target="_blank">
                            <img src="/design/icons/socials/new-facebook.svg" alt="">
                        </a>
                    </div>
                    <div class="social-item">
                        <a v-if="currentUser.vkontakte_url"
                           class="social instagram"
                           :href="currentUser.vkontakte_url"
                           title="instagram"
                           target="_blank">
                            <img src="/design/icons/socials/new-vk.svg" alt="">
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="profile-info w-100">
                <p class="info-name">
                    {{ currentUser.username | truncate(16) }}
                    <img v-if="currentUser.is_vip" src="/design/icons/star.svg" alt="#"/>
                </p>

                <p class="info-city-n-age">
                    <span class="city-span" v-if="currentUser.town">{{ currentUser.town | truncate(20) }}</span>
                    <span class="age-span" v-if="currentUser.age">{{ formattedAge }}</span>
                </p>

                <div class="info-level-progress blank__space">
<!--                    <p class="progress-level">-->
<!--                        {{ $t('USER_PROFILE.Уровень') }} {{ currentUser.level }}-->
<!--                    </p>-->
<!--                    <div class="xp-progress">-->
<!--                        <div class="value" :style="{ width: currentUser.level_percent + '%' }">-->

<!--                        </div>-->
<!--                    </div>-->
                </div>
                <div class="profile-game-info">
                    <div class="detail">
                        <i class="icon cup-small"></i>
                        <p>{{ $t('USER_PROFILE.Могущество') }}
                            <span>{{ currentUser.puissance }}</span>
                        </p>
                    </div>

                    <div v-if="contactsNumber" class="detail">
                        <i class="icon users-small"></i>
                        <p>{{
                                contactsNumber | setCase([
                                    $t('USER_PROFILE.Друг'),
                                    $t('USER_PROFILE.Друга'),
                                    $t('USER_PROFILE.Друзей')
                                ])
                            }}
                            <span>{{ contactsNumber }}</span>
                        </p>
                    </div>



                    <div class="detail">
                        <i class="icon cup-small"></i>
                        <p>{{
                                currentUser.number_of_victories | setCase([
                                    $t('USER_PROFILE.Победа'),
                                    $t('USER_PROFILE.Победы'),
                                    $t('USER_PROFILE.Побед')
                                ])
                            }}
                            <span>{{ currentUser.number_of_victories }}</span>
                        </p>
                    </div>

                    <div class="detail">
                        <i class="icon dice-small"></i>
                        <p>{{
                                userItemsCount | setCase([
                                    $t('USER_PROFILE.Предмет'),
                                    $t('USER_PROFILE.Предмета'),
                                    $t('USER_PROFILE.Предметов')
                                ])
                            }}
                            <span>{{ userItemsCount }}</span>
                        </p>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import {setCase, truncate} from '@/helpers/text';
import UserProfileMixin from '@/mixins/user-profile-mixin';
import {mapGetters, mapActions} from 'vuex';

export default {
    name: 'ProfileWidget',
    mixins: [UserProfileMixin],
    components: {},
    filters: {
        truncate,
        setCase,
    },
    data() {
        return {};
    },
    computed: {
        ...mapGetters([
            'userItemsCount',
            'contactsNumber',
            'gameLobbyDetails',
            'currentGameUuid',
            'gameLobbyWidget',
        ]),
        formattedAge() {
            const age = this.currentUser.age
            const translateKey = ['года', 'год', 'лет']
            let n1 = age % 10;
            if (n1 > 1 && n1 < 5) {
                return `${age} ${this.$t(`USER_PROFILE.${translateKey[0]}`)}`;
            }
            if (n1 == 1) {
                return `${age} ${this.$t(`USER_PROFILE.${translateKey[1]}`)}`;
            }
            return `${age} ${this.$t(`USER_PROFILE.${translateKey[2]}`)}`
        },
        isHaveSocialLink() {
            const socialsFieldsName = ['vkontakte_url', 'facebook_url', 'instagram_url']
            return this.contains(this.currentUser, socialsFieldsName)
        },
        isPlayerInLoby() {
            return !!this.gameLobbyDetails && !this.gameLobbyWidget && !this.currentGameUuid
        }
    },
    mounted() {
        this.refreshUserExperience();
    },
    methods: {
        ...mapActions([
            'refreshUserExperience',
        ]),
        contains(searchInObject, array) {
            for (const item of array) {
                if (searchInObject.hasOwnProperty(item) && searchInObject[item] !== null) {
                    return true
                }
            }
        },
    }
};
</script>

<style scoped lang="scss">
.w-100 {
    width: 100%;
}
.mt-25 {
    margin-top: 25px;
}

.flex-align-center {
    align-items: center;
}

.info-level-progress {
    p {
        margin-bottom: 6px !important;
        color: #fff;
    }

    margin-bottom: 12px;
}

.detail {
    p {
        margin-bottom: 0 !important;
    }
}

.profile {
    &-card {
        display: flex;
        flex-direction: row;
        position: relative;
        //min-height: 220px;
        border-radius: 10px;
        padding: 25px;
        margin: 0px 20px 40px 20px;
        background: #C4C4C4 linear-gradient(0deg, #202124, #202124);
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.12);

        &.background__female {
            background: url("/design/profile/profile-bg.jpeg") center center no-repeat;
            background-size: cover;
        }

        &.background__male {
            background: url("/design/profile/profile-bg.jpeg") center center no-repeat;
            background-size: cover;
        }

        &.background__default {
            background: url("/design/profile/profile-bg.jpeg") center center no-repeat;
            background-size: cover;
        }

        @media screen and (max-width: 1600px) {
            margin: 0;
            border-radius: 0;
        }
    }

    &-image {
        margin-right: 25px;
        width: 96px;
        height: 96px;
        border: 3px solid #32EB66;
        border-radius: 100px;
        background-color: #C4C4C4;
        box-sizing: border-box;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        overflow: hidden;

        @media screen and (max-width: 1600px) {
            width: 82px;
            height: 82px;
        }
        @media screen and (max-width: 1024px) {
            width: 64px;
            height: 64px;
        }
    }

    &-data {
        display: flex;
        flex-direction: column;

        &.user_additional {
            height: 100%;
            justify-content: space-between;
        }

        //width: 100%;
    }

    &-user-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        box-sizing: border-box;
    }

    &-info {
        &.info {
            width: 100%;
        }

        p {
            margin: 0;
            text-align: left;
            margin-bottom: 12px;
        }

        .info {
            &-name {
                color: #fff;
                font-weight: 600;
                font-size: 18px;
            }

            &-city-n-age {
                color: #FFFFFF99;
                font-size: 14px;

                .city-span {
                    margin-right: 8px;
                }
            }

            &-level {
                color: #fff;
                font-weight: 600;
            }
        }
    }

    &-socials {
        width: 96px;
        margin-right: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 7px;
        @media screen and (max-width: 1600px) {
            width: 82px;
        }
        @media screen and (max-width: 1024px) {
            width: 64px;
            flex-direction: column;
            justify-content: center;
            margin-bottom: 0;
        }

        .social-item {
            margin-right: 9px;

            @media screen and (max-width: 1024px) {
                margin-right: 0;
                margin-bottom: 7px;
                &:last-child {
                    margin-bottom: 0;
                }
            }

            &:last-child {
                margin-right: 0;
            }

            a {
                box-sizing: border-box;
                padding: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: var(--color-background-social);
                width: 32px;
                height: 32px;
                text-decoration: none;
                @media screen and (max-width: 1600px) {
                    width: 22px;
                    height: 22px;
                }
            }
        }
        .social-item:last-child {
            margin-right: 0px;
        }
    }

    &-game-info {
        flex: 1;
        display: flex;
        justify-content: space-around;

        p {
            color: #FFFFFF99;
            font-size: 14px;

            span {
                color: #fff;
                font-size: 18px;
                margin-top: 8px;
                display: block;
                text-align: center;
            }
        }
    }
}

.inLobby {
    margin: 0 20px 40px 20px;
    @media screen and (max-width: 1600px){
        margin: 0 0 40px 0;
    }
}

.additional-info__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;

    .level {
        color: #fff;
    }
}

.xp-progress {
    position: relative;
    height: 8px;
    width: 100%;
    background-color: #fff;
    border-radius: 4.5px;

    .value {
        position: absolute;
        top: 0;
        left: 0;
        height: 8px;
        border-radius: 4.5px;
        /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#e72043+0,f0e93a+100 */
        background: #e72043; /* Old browsers */
        background: -moz-linear-gradient(left, #e72043 0%, #f0e93a 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(left, #e72043 0%, #f0e93a 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to right, #e72043 0%, #f0e93a 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#e72043', endColorstr='#f0e93a', GradientType=1); /* IE6-9 */
    }
}

#profile-widget {
    flex: 0 1 220px;
    position: relative;
    min-height: 220px;
    border-radius: 10px;
    margin: 40px 20px 40px 20px;
    box-sizing: border-box;
    background: #C4C4C4 linear-gradient(0deg, #202124, #202124);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.12);

    @media only screen and (max-width: 1720px) {
        flex: 0 1 175px;
        min-height: 175px;
        margin: 40px 18px 60px 18px;
    }

    @media only screen and (max-width: 1600px) {
        flex: 0 1 210px;
        margin: 0;
        min-height: 210px;
        border-radius: 0;
    }

    @media only screen and (max-width: 1360px) {
        flex: 0 1 210px;
        margin: 0;
        min-height: 210px;
        border-radius: 0;
    }

    @media only screen and (max-height: 700px) {
        flex: 0 1 95px;
        min-height: 95px;
    }
    @media only screen and (max-height: 700px) and (min-width: 1720px) {
        flex: 0 1 95px;
        min-height: 95px;
        margin: 0 0 30px 0;
        border-radius: 0;
    }

    &.background__female {
        background: url("/design/profile/profile-bg.jpeg") center center no-repeat;
        background-size: cover;
    }

    &.background__male {
        background: url("/design/profile/profile-bg.jpeg") center center no-repeat;
        background-size: cover;
    }

    &.background__default {
        background: url("/design/profile/profile-bg.jpeg") center center no-repeat;
        background-size: cover;
    }

    .about {
        position: relative;

        .photo {
            position: absolute;
            top: 20px;
            left: 28px;
            width: 98px;
            height: 98px;
            border: 3px solid #32EB66;
            border-radius: 100px;
            background-color: #C4C4C4;
            box-sizing: border-box;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
            overflow: hidden;

            &:hover,
            &:focus,
            &:active {
                transition: border-color 0.3s ease;
                border-color: var(--color-base-blue) !important;
            }

            .profile-photo {
                width: 100%;
                height: 100%;
            }

            @media only screen and (max-width: 1720px) {
                top: 11px;
                left: 14px;
                height: 96px;
                width: 96px;
            }
            @media only screen and (max-width: 1600px) {
                top: 47px;
                left: 33px;
                height: 85px;
                width: 85px;
            }
            @media only screen and (max-height: 700px) {
                top: 5px;
                left: 33px;
            }
            @media only screen and (max-height: 700px) and (min-width: 1720px) {
                top: 5px;
                left: 30px;
                height: 85px;
                width: 85px;
            }
        }

        .info {
            position: absolute;
            top: 36px;
            left: 134px;
            width: 220px;
            height: 64px;
            text-align: left;
            @media only screen and (max-width: 1720px) {
                top: 32px;
                left: 130px;
                width: 175px;
                height: 64px;
            }
            @media only screen and (max-width: 1600px) {
                top: 68px;
                left: 128px;
            }
            @media only screen and (max-height: 700px) {
                top: 14px;
                left: 126px;
            }

            .name {
                color: #fff;
                font-size: 21px;
                margin-bottom: 0;
                font-weight: 600;
                @media only screen and (max-width: 1720px) {
                    font-size: 20px;
                    font-weight: 500;
                    margin-bottom: 10px;
                }

                img {
                    position: relative;
                    top: 1px;
                }
            }

            .city-n-age {
                font-size: 15px;
                color: #fff;
                font-weight: 500;
                //margin-bottom: 15px;
                @media only screen and (max-width: 1720px) {
                    font-size: 12px;
                    line-height: 12px;
                }
                @media only screen and (max-height: 700px) {
                    display: none;
                }
            }

            .socials {
                display: flex;
                align-items: center;
                //margin-bottom: 10px;
                @media only screen and (max-height: 700px) {
                    display: none;
                }

                .social {
                    margin-right: 8px;
                    opacity: 0.8;
                    transition: all 0.3s ease;

                    &:hover,
                    &:focus,
                    &:active {
                        opacity: 1;
                    }

                    &:last-child {
                        margin-right: 0;
                    }

                    svg {
                        width: 16px;
                        height: 16px;
                        fill: #f5f5f5;
                    }
                }
            }

            .level-container {
                position: relative;
                width: 100%;
                text-align: right;
                @media only screen and (max-height: 700px) {
                    margin-top: 20px;
                }

                .level {
                    position: absolute;
                    top: -16px;
                    right: 0;
                    font-size: 15px;
                    font-weight: 500;
                    line-height: 12px;
                    color: #fff;
                    @media only screen and (max-width: 1720px) {
                        top: -18px;
                        font-size: 13px;
                    }
                    @media only screen and (max-height: 700px) {
                        top: -15px;
                    }
                }


            }
        }
    }

    .details {
        position: absolute;
        bottom: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        width: 100%;
        @media only screen and (max-width: 1720px) {
            bottom: 5px;
        }
        @media only screen and (max-height: 700px) {
            left: 125px;
            bottom: 12px;
            width: 176px;
        }

        .detail {
            flex: 1;
            text-align: center;

            .icon {
                display: none;
            }

            p, span {
                font-weight: 600;
                color: #fff;
                font-size: 18px;
                line-height: 24px;
                margin: 0;
                -webkit-text-stroke: 0.2px black;
                @media only screen and (max-width: 1720px) {
                    font-size: 16px;
                    line-height: 20px;
                    font-weight: 500;
                }
            }

            @media only screen and (max-height: 700px) {
                p {
                    display: none;
                }
                span {
                    font-size: 16px;
                    line-height: 16px;
                    font-weight: 400;
                }
                .icon {
                    display: inline-block;
                    height: 11px;
                    margin-right: 2px;

                    &.users-small {
                        background: url("/design/icons/users-small.svg") center center no-repeat;
                        width: 18px;
                    }

                    &.cup-small {
                        background: url("/design/icons/cup-small.svg") center center no-repeat;
                        width: 9px;
                    }

                    &.dice-small {
                        background: url("/design/icons/dice-small.svg") center center no-repeat;
                        width: 11px;
                    }
                }
            }
        }
    }
}
.blank__space {
    height: 30px;
    width: 100%;
}
</style>
