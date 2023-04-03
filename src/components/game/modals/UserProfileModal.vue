<template>
    <div class="modal user-profile-modal">
        <div class="modal__wrap" :class="{'modal__wrap--error': userNotFound}">
            <BaseTitle v-if="userNotFound">
                <h2>{{ $t('GAME_DIALOGS.Данный пользователь не найден') }}</h2>
            </BaseTitle>

            <template v-else>
                <UserProfileTop
                    v-if="profilePageData"
                    class="user-profile-modal__user-profile-top"
                    :avatar="profilePageData.user.avatar_url"
                    :userColor="profilePageData.user.color"
                    :userName="profilePageData.user.fullname"
                    :age="profilePageData.user.age"
                    :town="profilePageData.user.town"
                    :vipEndingDate="null"
                    :isVip="profilePageData.user.is_vip"
                    :facebookUrl="profilePageData.user.fb_url"
                    :instagramUrl="profilePageData.user.ins_url"
                    :vkontakteUrl="profilePageData.user.vk_url"
                    :victories="profilePageData.user.number_of_victories"
                    :friends="profilePageData.friends"
                    :isLinkToFriend="false"
                    :isBanned="profilePageData.user._is_banned"
                    :friendRelationStatus="profilePageData.friendRelationStatus"
                    :userUuid="profilePageData.user.uuid"
                    :userChip="null"
                    :userDice="null"
                    :userMonopoly="null"
                    :isGame="true"
                />
            </template>

            <button type="button" class="modal__close" @click="onCloseClick">{{ $t('GENERAL.Закрыть') }}</button>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import BaseTitle from "@/components/base/BaseTitle";
    import UserProfileTop from "@/components/user-profile/UserProfileTop";

    export default {
        name: 'UserProfileModal',
        components: { BaseTitle, UserProfileTop },
        data() {
            return {
                profile: null
            };
        },
        computed: {
            ...mapGetters(['profilePageData']),
            userNotFound() {
                return this.profilePageData && this.profilePageData.error;
            }
        },
        created() {
            this.profile = { ...this.profilePageData };
        },
        watch: {
            // чтобы обновлять компонент когда данные поменяются
            profilePageData: function(o, n) {
                this.profile = { ...n };
            }
        },
        methods: {
            ...mapMutations(['setGameModalName']),
            onCloseClick() {
                this.setGameModalName(null);
            },
        },
    }
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    .modal {
        z-index: 9990;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000;
        text-align: center;

        &__wrap {
            max-width: 934px;
            min-width: 600px;

            &__error {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
        }

        &__close {
            display: block;
            width: 135px;
            padding: 10px;
            margin: 25px auto 0;
            background: #6A1ED5;
            color: #fff;
            text-align: center;
            font-size: 15px;
            text-decoration: none;
            border-radius: 3px;
        }
    }

    .user-profile-modal {
        &__user-profile-top {
            &::v-deep {
                .user-profile-top__guest-button.button-1,
                .user-profile-top__guest-button.button-3 {
                    display: none;
                }
            }
        }
    }
</style>
