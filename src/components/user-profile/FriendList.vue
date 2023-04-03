<template>
    <div class="fullprofile__friends">
<!--        <span class="fullprofile__friends-value">{{ friendsCount | setCase([-->
<!--                        $t('USER_PROFILE.Друг'),-->
<!--                        $t('USER_PROFILE.Друга'),-->
<!--                        $t('USER_PROFILE.Друзей')-->
<!--                    ], '<') }}</span>-->
        <div class="fullprofile__friends-wrapper">
            <ul
                v-if="firstFriends.length"
                class="fullprofile__friends-list fullprofile__friends-list--first"
            >
                <li
                    v-for="(friend, index) in firstFriends"
                    :key="index"
                    class="fullprofile__friends-item fullprofile__friends-item--big"
                >
                    <UserProfileFriendsItem
                        :uuid="friend.uuid"
                        :color="friend._color"
                        :avatar="friend.avatar_url"
                        :fullname="friend.fullname"
                        :isLink="isLink"
                    />
                </li>
            </ul>

            <ul class="fullprofile__friends-list fullprofile__friends-list--second" v-if="secondFriends.length">
                <li
                    v-for="(friend, index) in secondFriends"
                    :key="index"
                    :class="{'user-profile-friends-item__link--last' : index === 2 }"
                    class="fullprofile__friends-item fullprofile__friends-item--small"
                >
                    <UserProfileFriendsItem
                        :uuid="friend.uuid"
                        :color="friend._color"
                        :avatar="friend.avatar_url"
                        :isLink="isLink"
                    />
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {setCase} from '@/helpers/text';
    import UserProfileFriendsItem from "./UserProfileFriendsItem";

    export default {
        name: "UserProfileFriends",
        components: {UserProfileFriendsItem},
        filters: {
            setCase,
        },
        props: {
            friends: {
                type: Array,
                default: function () {
                    return []
                }
            },
            isLink: Boolean,
        },
        computed: {
            firstFriends() {
                return this.friends.slice(0, window.innerWidth > 1024 ? 3 : 2);
            },
            secondFriends() {
                return this.friends.slice(3, 5);
            },
            friendsCount() {
                return this.friends.length
            }
        }
    }
</script>

<style lang="scss" scoped>
    .fullprofile {
        &__friends {
            text-align: right;
            margin-top: 40px;
            //margin-bottom: 15px;

            @media(max-width: 1920px) {
                //margin-bottom: 24px;
            }

            &-wrapper {
                display: flex;
                justify-content: flex-end;
            }

            &-value {
                display: block;
                font-size: 14px;
                line-height: 17px;
                font-weight: 500;
                color: #fff;
                margin-bottom: 5px;

                @media(min-width: 1920px) {
                    font-size: 24px;
                    line-height: 28px;
                }
            }

            &-list {
                display: flex;
                list-style: none;
                margin: 0;
                padding: 0;

                &--first {
                    margin-right: 10px;

                    @media(min-width: 1920px) {
                        margin-right: 20px;
                    }
                }

                &--second {
                    padding-top: 38px;
                }
            }

            &-item {
                overflow: hidden;
                display: block;
                width: 74px;
                margin-right: 6px;

                &:last-of-type {
                    margin-right: 0;
                }

                &--small {
                    width: 36px;
                    margin-right: 0;

                    &:nth-of-type(2) {
                        margin-left: -10px;
                    }

                    &:nth-of-type(3) {
                        margin-left: -10px;
                    }
                }

                &--last {
                    width: 24px;
                }
            }
        }
    }

    @media (min-width: 1441px) and (max-width: 1540px) {
        .fullprofile__friends {
            &-item {
                &--big {
                    width: 66px;
                }
            }
        }
    }
</style>
