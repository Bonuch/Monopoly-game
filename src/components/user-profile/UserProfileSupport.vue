<!--<i18n>-->
<!--{-->
<!--    "en": {"message": {"tech_descr": "Для того чтобы сообщить о проблеме или задать вопрос, нажмите на кнопку написать"}},-->
<!--    "ru": {"message": {"tech_descr": "Для того чтобы сообщить о проблеме или задать вопрос, нажмите на кнопку написать"}}-->
<!--}-->
<!--</i18n>-->

<template>
    <div class='user-profile-top'>
        <div class='user-profile-top__inner'>
            <div
                class='user-profile-top__avatar'
                :style="{ backgroundImage: 'url(' + avatar + ')' }"
            >
                <div class='user-profile-top__avatar__gradient'></div>
            </div>
<!--            <div class='user-profile-top__persona-bg'></div>-->
            <div class='user-profile-top__persona'>
                <div class='user-profile-top__persona-info' style="text-align: left">
                    <h2 class="staff_name">{{ userName }}<sup class="check_mark"><i class="fa fa-check"></i></sup></h2>
                    <p class="staff_descr">{{ $t('tech_descr') }}</p>
                    <button
                        type='button'
                        class='user-profile-top__guest-button button-3 user-profile-top__guest-button__message'
                        :disabled='isBanned'
                        @click='sendMessage()'
                    >
                        {{ $t('CONTACTS.Написать') }}
                    </button>
<!--                    <UserProfileShortInfo-->
<!--                        :fullname='userName'-->
<!--                        :age='age'-->
<!--                        :town='town'-->
<!--                    />-->

<!--                    <UserProfileSocial-->
<!--                        :is-vip='isVip'-->
<!--                        :facebook-url='facebookUrl'-->
<!--                        :instagram-url='instagramUrl'-->
<!--                        :vkontakte-url='vkontakteUrl'-->
<!--                    />-->
                </div>
            </div>

            <div class='user-profile-top__info'>
<!--                <UserProfileSettingsLink v-if='isMyProfile && !isGame' />-->
<!--                <ProfileShortStats :victories='victories' :friends='friends.length' :items='itemsCount' />-->
                <!--                <UserProfileVictories :victories="victories"/>-->
                <!--                <UserProfileVictories :victories='itemsCount' text=''/>-->
<!--                <FriendList :friends='friends' :isLink='isLinkToFriend' />-->
<!--                <UserProfileVip v-if='currentUser && currentUser.is_vip' class='user-profile-top__vip'-->
<!--                                :message='currentUser.vip_finish_time' />-->

                <div v-if='!isMyProfile' class='user-profile-top__guest-buttons'>

                </div>

<!--                <UserProfileGameItems-->
<!--                    :userColor='userColor'-->
<!--                    :dice-item='userDice'-->
<!--                    :chip-item='userChip'-->
<!--                />-->
            </div>
        </div>
    </div>
</template>

<script>
import UserProfileShortInfo from './UserProfileShortInfo';
import UserProfileSocial from './UserProfileSocial';
import UserProfileVictories from './UserProfileVictories';
import FriendList from './FriendList';
import UserProfileGameItems from './UserProfileGameItems';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import UserProfileVip from './UserProfileVip';
import UserProfileSettingsLink from './UserProfileSettingsLink';
import UserProfileItems from './UserProfileItems';
import ProfileShortStats from './ProfileShortStats';


export default {
    name: "UserProfileSupport",
    components: {
        ProfileShortStats,
        UserProfileItems,
        UserProfileSettingsLink,
        UserProfileVip,
        UserProfileGameItems,
        FriendList,
        UserProfileVictories,
        UserProfileSocial,
        UserProfileShortInfo,
    },
    props: {
        avatar: {
            type: String,
            required: true,
        },
        userColor: String,
        userName: String,
        age: Number,
        town: String,
        isVip: Boolean,
        vipEndingDate: String,
        facebookUrl: String,
        instagramUrl: String,
        vkontakteUrl: String,
        victories: Number,
        friends: {
            type: Array,
            default: function() {
                return [];
            },
        },
        isLinkToFriend: {
            type: Boolean,
            required: true,
        },
        isBanned: Boolean,
        friendRelationStatus: String,
        itemsCount: {
            type: Number,
        },
        userUuid: {
            type: String,
            required: true,
        },
        userChip: Object,
        userDice: Object,
        isGame: Boolean,
    },
    computed: {
        ...mapGetters(['currentUser']),
        isMyProfile() {
            return this.userUuid === this.currentUser.uuid;
        },
        isFriend() {
            return this.friendRelationStatus === 'added';
        },
        isFriendRequestSent() {
            return this.friendRelationStatus === 'sent';
        },
    },
    methods: {
        ...mapMutations([
            'setCurrentContactUuid',
            'setContactsActiveTab',
        ]),
        ...mapActions([
            'banUserOfTheRoom',
            'loadProfileData',
            'loadContactsList',
        ]),
        sendMessage() {
            this.setCurrentContactUuid(this.userUuid);
            this.setContactsActiveTab(1);
        },
        addFriend() {
            this.$socket.client.emit('send_invitation_to_friends', this.userUuid, (result) => {
                if (!result.error) {
                    this.loadProfileData(this.userUuid);
                    this.$dialog.alert(this.$t('CONTACTS.Заявка в друзья отправлена'));
                } else {
                    this.$dialog.alert(result.error);
                }
            });
        },
        removeFriend() {
            this.$dialog
                .confirm(this.$t('CONTACTS.Удалить') + ` ${this.userName} ` + this.$t('CONTACTS.из друзей') + '?')
                .then((dialog) => {
                    this.$socket.client.emit('delete_from_friends', this.userUuid, (result) => {
                        this.loadProfileData(this.userUuid);
                        this.loadContactsList();

                        if (result.message) {
                            this.$dialog.alert(result.message);
                        }
                    });
                })
                .catch(function() {
                    console.log('Clicked on cancel');
                });
        },
        banUser(status) {
            this.banUserOfTheRoom({ targetUuid: this.userUuid, status });
        },
    },
};
</script>

<style scoped lang="scss">
.check_mark {
    font-size: 16px;
    margin-left: 5px;
    color: var(--color-purple-medium);
}
.staff_name {
    color: #fff;
    font-weight: bold;
    font-size: 36px;
    margin-bottom: 0;
    text-align: left;
}
.staff_descr {
    margin-top: 0;
    text-align: left;
    color: #fff;
}
.user-profile-top__avatar__gradient {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.62) 100%);
}
.user-profile-top {
    box-sizing: border-box;
    overflow: hidden;

    &__inner {
        position: relative;
        min-height: 215px;
        border-radius: 3px;
        overflow: hidden;
        display: flex;
        flex-direction: row;
    }

    &__avatar {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        background-size: cover;
        background-repeat: no-repeat;
        z-index: 1;
    }

    &__persona {
        position: relative;
        z-index: 3;
        display: flex;
        align-items: flex-end;
        width: 42%;

        &-bg {
            display: block;
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            background-image: url("/design/profile/profile-bg.jpeg");
            background-repeat: no-repeat;
            background-size: 100%;
            z-index: 5;
            transform: translateX(42%) skewX(-20deg);
            box-shadow: -4px 0px 4px rgba(0, 0, 0, 0.4);
            border-radius: 3px;
        }

        &-info {
            padding: 10px;
        }
    }

    &__vip {
        margin-top: 40px;
    }

    &-persona-info {
        z-index: 1;
        position: relative;

        &:after {
            content: '';
            position: absolute;
            width: 500px;
            height: 100%;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0) 2.04%, rgba(0, 0, 0, 0.5) 88.82%);
            z-index: -1;
            left: 0;
            top: 0;
        }
    }

    &__info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        position: relative;
        z-index: 6;
        width: 58%;
        padding: 50px 30px 30px 50px;
        text-align: left;
    }

    &__guest {
        &-buttons {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
        }

        &-button {
            width: 80px;
            height: 20px;
            padding: 3px 10px;
            margin-right: 20px;
            background-color: transparent;
            color: #fff;
            font-size: 10px;
            line-height: 12px;
            text-align: center;
            border: none;
            //border: 1px solid var(--color-blue-medium);
            //text-shadow: -1px -1px 0 #000,
            //1px -1px 0 #000,
            //-1px 1px 0 #000,
            //1px 1px 0 #000;
            background: var(--purple-dark);
            border-radius: 5px;
            outline: none;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover,
            &:focus,
            &:active {
                background-color: var(--color-blue-medium);
                border-color: var(--color-blue-medium);
            }

            &:disabled {
                cursor: pointer;
                opacity: 0.8;
            }

            &__friend--sent {
                pointer-events: none;
                width: 100px;
                padding-left: 1px;
                padding-right: 1px;
            }

            &__message {
                margin-right: 0;
            }
        }
    }
}

@media all and (min-width: 1920px) {
    .user-profile-top {
        border-radius: 8px 8px 0 0;
        &__inner {
            //min-height: 505px;
            border-radius: 5px;
        }

        &__info {
            padding: 85px 32px 32px 80px;
        }

        &__persona {
            &-info {
                padding: 32px;
                //padding: 20px 25px;
            }
        }

        &__guest {
            &-button {
                width: 132px;
                height: 34px;
                box-sizing: border-box;
                font-size: 17px;
                line-height: 20px;
                padding: 5px;
                border-width: 2px;

                &__friend--sent {
                    width: 176px;
                    padding: 5px;
                }
            }
        }
    }
}
</style>
