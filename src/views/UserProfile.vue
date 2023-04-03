<template>
    <main class="mainblock">
        <div v-if="profilePageData && profilePageData.error">
            <div class="profile-error">{{ profilePageData.error }}</div>
        </div>
        <div v-if="profilePageData && !profilePageData.error && profilePageData.user.is_staff" class="fullprofile">
            <UserProfileSupport
                :avatar="profilePageData.user.avatar_url"
                :user-color="profilePageData.user.color"
                :user-name="profilePageData.user.fullname"
                :age="profilePageData.user.age"
                :town="profilePageData.user.town"
                :vip-ending-date="null"
                :is-vip="profilePageData.user.is_vip"
                :facebook-url="profilePageData.user.fb_url"
                :instagram-url="profilePageData.user.ins_url"
                :vkontakte-url="profilePageData.user.vk_url"
                :victories="profilePageData.user.number_of_victories"
                :items-count="profilePageData.items.length"
                :friends="profilePageData.friends"
                :is-link-to-friend="true"
                :is-banned="profilePageData.user._is_banned"
                :friend-relation-status="profilePageData.friendRelationStatus"
                :user-uuid="userUuid"
                :user-chip="null"
                :user-dice="null" />
            <div class="fullprofile__bottom">
                <div class="support__content">
                    <h3>{{ $t('instruction') }}</h3>
                    <ul>
                        <li>{{ $t('tech_guide1') }}</li>
                        <li>{{ $t('tech_guide2') }}</li>
                        <li>{{ $t('tech_guide3') }}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-else-if="profilePageData && !profilePageData.error" class="fullprofile">

            <UserProfileTop
                :avatar="profilePageData.user.avatar_url"
                :user-color="profilePageData.user.color"
                :user-name="profilePageData.user.fullname"
                :age="profilePageData.user.age"
                :town="profilePageData.user.town"
                :vip-ending-date="null"
                :is-vip="profilePageData.user.is_vip"
                :facebook-url="profilePageData.user.fb_url"
                :instagram-url="profilePageData.user.ins_url"
                :vkontakte-url="profilePageData.user.vk_url"
                :victories="profilePageData.user.number_of_victories"
                :items-count="profilePageData.items.length"
                :friends="profilePageData.friends"
                :is-link-to-friend="true"
                :is-banned="profilePageData.user._is_banned"
                :friend-relation-status="profilePageData.friendRelationStatus"
                :user-uuid="userUuid"
                :user-chip="null"
                :user-dice="null"
            />
            <UserBottomBlock class="fullprofile__bottom" :friends="profilePageData.friends"
                             :items="profilePageData.items" />
        </div>
    </main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import UserProfileTop from "../components/user-profile/UserProfileTop";
import UserBottomBlock from "../components/user-profile/UserBottomBlock";
import UserProfileSupport from "../components/user-profile/UserProfileSupport";

export default {
    name: "UserProfile",
    components: {
        UserProfileSupport,
        UserProfileTop,
        UserBottomBlock,
    },
    computed: {
        ...mapGetters([
            "currentUser",
            "profilePageData",
        ]),
        userUuid() {
            return this.$route.params.useruuid;
        },
    },
    methods: {
        ...mapActions([
            "loadProfileData",
        ]),
    },
    created() {
        if (this.userUuid === this.currentUser.uuid) {
            this.$router.push({ name: "profile" });
        } else {
            this.loadProfileData(this.userUuid);
        }

    },
    beforeRouteUpdate(to, from, next) {
        if (to.name === "user") {
            this.loadProfileData(to.params.useruuid);
        }
        next();
    },
};
</script>


<style lang="scss" scoped>
.support__content {
    padding: 32px;
    background: var(--color-background-3);
    text-align: left;
    h3 {
        color: #fff;
        font-size: 24px;
    }
    ul {
        color: #fff;
        list-style: square;
        padding-left: 20px;
    }
}
.fullprofile {
    max-width: 934px;
    padding: 30px 5% 0;

    &__bottom {
        max-width: 100%;
    }
}

.profile-error {
    margin: 100px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    padding: 40px;
    color: #333;
    font-size: 20px;
}

@media all and (min-width: 1920px) {
    .fullprofile {
        padding-top: 45px;
    }
}
</style>
