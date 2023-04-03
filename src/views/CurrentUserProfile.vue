<template>
    <main class="mainblock">
        <NavMenuProfile />
        <div class="fullprofile">
            <UserProfileTop
                :avatar="currentUser.avatar"
                :user-color="currentUser.color"
                :user-name="currentUser.username"
                :age="currentUser.age"
                :town="currentUser.town"
                vip-ending-date="23.09.2020"
                :is-vip="currentUser.is_vip"
                :facebook-url="currentUser.facebook_url"
                :instagram-url="currentUser.instagram_url"
                :vkontakte-url="currentUser.vkontakte_url"
                :victories="currentUser.number_of_victories"
                :friends="contacts"
                :is-link-to-friend="true"
                :is-banned="currentUser._is_banned"
                :friend-relation-status="currentUser.friendRelationStatus"
                :user-uuid="currentUser.uuid"
                :user-chip="currentUser.activeChip"
                :user-dice="currentUser.activeDice"
                class="current-profile__top"
            />
            <UserBottomBlock class="fullprofile__bottom"
                :friends="contacts"
                :items="currentUser.items"
                :isMyProfile="true"
            />
        </div>
    </main>
</template>

<script>
    import { mapGetters } from "vuex";
    import NavMenuProfile from "@/components/navigations/NavMenuProfile";
    import UserProfileTop from "@/components/user-profile/UserProfileTop";
    import UserBottomBlock from "@/components/user-profile/UserBottomBlock"

    export default {
        name: "CurrentUserProfile",
        components: {
            NavMenuProfile,
            UserProfileTop,
            UserBottomBlock,
        },
        computed: {
            ...mapGetters(['currentUser', 'contacts', 'userItems']),
        },
    };
</script>

<style lang="scss" scoped>
    .fullprofile {
        max-width: 934px;
        padding: 30px 5% 0;
        margin: auto;

        &__bottom {
            max-width: 100%;
        }
    }

    .current-profile__top {
        &::v-deep {
            .user-profile-top__guest-buttons {
                display: none;
            }
        }
    }

    @media all and (min-width: 1920px) {
        .fullprofile {
            padding-top: 45px;
        }
    }
</style>
