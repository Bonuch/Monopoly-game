<template>
    <ul class="user-profile-friends-all">
        <li
            v-for="friend of friends"
            :key="friend.id"
            class="user-profile-friends-all__item"
        >
            <router-link
                v-if="friend.uuid === currentUser.uuid"
                to="/profile/me"
                class="user-profile-friends-all__link"
            >
                <div class="img-wrap" :style="{ borderColor: friend._color }">
                    <img :src="friend.avatar_url || '/design/demo/profiles/unknown.png'" alt="#">
                </div>
                <span class="user-profile-friends-all__text">{{ friend.fullname }}</span>
            </router-link>

            <router-link
                v-else
                :to="{ name: 'user', params: { useruuid: friend.uuid } }"
                class="user-profile-friends-all__link"
            >
                <div class="img-wrap" :style="{ borderColor: friend._color }">
                    <img :src="friend.avatar_url || '/design/demo/profiles/unknown.png'" alt="#">
                </div>
                <span class="user-profile-friends-all__text">{{ friend.fullname }}</span>
            </router-link>
        </li>
    </ul>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "UserProfileFriendsAll",
        props: {
            friends: Array
        },
        computed: {
            ...mapGetters(['currentUser']),
        }
    }
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    .user-profile-friends-all {
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        margin: -20px 0 0 0;
        padding: 0;

        &__item {
            width: 12.28%;
            margin: 20px 2% 0 0;

            &:nth-of-type(7n) {
                margin-right: 0;
            }
        }

        &__link {
            display: block;
            text-decoration: none;
        }

        &__text {
            display: block;
            text-align: center;
            font-weight: 600;
            font-size: 16px;
            line-height: 19px;
            color: #fff;
        }

        .img-wrap {
            overflow: hidden;
            border: 3px solid transparent;
            margin-bottom: 10px;
            border-radius: 50%;

            img {
                display: block;
                width: 100%;
                max-width: 100%;
                max-height: 100%;
                margin: 0;
            }
        }
    }

    @media all and (min-width: 1920px) {
        .user-profile-friends-all {
            margin-top: -30px;

            &__item {
                margin-top: 30px;
            }
        }
    }
</style>
