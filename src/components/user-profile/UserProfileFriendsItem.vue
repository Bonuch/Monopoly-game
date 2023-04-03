<template>
    <div
        class="user-profile-friends-item"
        @click="onItemClick"
    >
        <div
            class="user-profile-friends-item__link"
            :style="{ borderColor: color }"
        >
            <img v-if="avatar" class="user-profile-friends-item__photo" :src="avatar" alt="#"/>
        </div>

        <div v-if="fullname" class="user-profile-friends-item__name">{{ fullname }}</div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";

    export default {
        name: "UserProfileFriendsItem",
        props: {
            uuid: String,
            color: String,
            avatar: String,
            fullname: String,
            isLink: {
                type: Boolean,
                required: true,
            },
        },
        computed: {
          ...mapGetters(['currentUser']),
        },
        methods: {
            ...mapActions([
                'loadProfileData'
            ]),
            onItemClick() {
                if (this.isLink) {
                    // когда вне игры, обычный роутинг
                    if (this.currentUser.uuid === this.uuid) {
                        this.$router.push('/profile/me');
                    } else {
                        this.$router.push({name: 'user', params: {useruuid: this.uuid}});
                    }
                } else {
                    // когда в игре, передаем uuid пользователя и следим за этим значением на странице GameLayout
                    this.loadProfileData(this.uuid);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    .user-profile-friends-item {
        &__link {
            display: flex;
            justify-content: center;
            align-items: center;
            border-style: solid;
            border-width: 3px;
            border-radius: 100%;
            overflow: hidden;
            background-color: #340e50;
            transition: border-color 0.3s ease;
            cursor: pointer;

            &:hover,
            &:active,
            &:focus {
                border-color: var(--color-base-blue) !important;
            }
        }

        &__name {
            display: block;
            margin-top: 2px;
            text-align: center;
            font-size: 16px;
            line-height: 1.1;
            color: #fff;
            text-decoration: none;
        }

        &__photo {
            display: block;
            max-width: 100%;
            max-height: 100%;
        }
    }

    @media all and (min-width: 1920px) {
        .user-profile-friends-item {
            &__link {
                border-width: 3px;
            }
        }
    }
</style>
