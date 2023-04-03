<template>
    <div class="friend-invitation">
        <div class="content-wrap">
            <div class="title" v-if="notify.title">{{ notify.title }}</div>
            <div class="content">{{ notify.content }}</div>
            <a v-if="notify.status === 0" href="#" class="a-btn" @click.prevent="addFriend()">{{ $t('GAME_DIALOGS.Принять') }}</a>
        </div>

        <img class="notify-img" v-if="notify.image" :src="notify.image" alt="#">
    </div>
</template>

<script>
    import NotifyMixin from '@/mixins/notify-item-mixin';
    import { mapGetters, mapActions } from "vuex";

    export default {
        name: "FriendInvitationNotify",
        mixins: [NotifyMixin],
        computed: {
            ...mapGetters([
                'profilePageData'
            ]),
        },
        methods: {
            ...mapActions([
                'loadProfileData'
            ]),
            addFriend() {
                // здесь мы отправляем запрос на тот же роут, на который шлются приглашения в друзья. Он работает для обоих типов запросов
                this.hideNotification(this.notify.id);
                this.$socket.client.emit('send_invitation_to_friends', this.notify.sender_uuid, (result) => {
                    // после добавления в друзья, сервер сам вышлет новые списки друзей обоим пользователям
                    this.$dialog.alert(this.$t('GAME_DIALOGS.Заявка в друзья принята'));
                    // обновляем страницу профайла пользователя, если она открыта
                    if (this.profilePageData && this.profilePageData.user) {
                        this.loadProfileData(this.profilePageData.user.uuid);
                    }
                });
            },
        }
    }
</script>

<style scoped lang="scss">
.friend-invitation {
    @include notify-item();
}
</style>
