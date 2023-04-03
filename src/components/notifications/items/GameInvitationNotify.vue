<template>
    <div class="game-invitation">
        <div class="title" v-if="notify.title">{{ notify.title }}</div>

        <div class="players">
            <div
                v-for="(player, idx) in notify.game_options.slots"
                :key="idx"
                class="chip"
            >
                <img v-if="player" class="avatar" :title="player.fullname" :src="player.avatar" alt="#"/>
                <img v-else class="avatar empty" src="/design/demo/profiles/unknown.png" alt="#" />
            </div>
        </div>

        <div v-if="notify.game_options.options" class="rules">
            <div class="title">{{ $t('SEARCH_CREATE_GAME.Правила') }}</div>
            <ul class="list">
                <li v-for="(item, idx) in visibleNotificationsList" :key="idx">
                    <img :title="item.name" :src="item.image" alt="#" />
                </li>

                <li v-if="optionRest" class="num">
                    <span class="num">+{{optionRest}}</span>
                </li>
            </ul>
        </div>

        <div v-if="notify.answer === 0" class="actions">
            <a href="#" class="a-btn accept"
               @click.prevent="acceptGameInvitation(notify.id, notify.game_options.creator_uuid)">{{ $t('GENERAL.Войти') }}</a>
            <a href="#" class="a-btn decline"
               @click.prevent="declineGameInvitation(notify.id, notify.game_options.creator_uuid)">{{ $t('GENERAL.Отказаться') }}</a>
            <a href="#"
               class="a-btn go-to-chat"
               @click.prevent="goToChat(notify)"
               title="Начать чат"
            >
                <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.25625 12.125L13.375 6.5L0.25625 0.875L0.25 5.25L9.625 6.5L0.25 7.75L0.25625 12.125Z" fill="#A5A5A5"/>
                </svg>
            </a>
        </div>

        <div v-if="notify.status !== 0" class="actions">
            <div v-if="notify.answer === 2" class="result">{{ $t('NOTIFY.Приглашение принято') }}</div>
            <div v-if="notify.answer === 1" class="result">{{ $t('NOTIFY.Приглашение отклонено') }}</div>
        </div>
    </div>
</template>

<script>
    import NotifyMixin from '@/mixins/notify-item-mixin';
    const Notification_ANSWER_NO = 1; // @see backend/models/notification.js:89
    const Notification_ANSWER_YES = 2;
    import { mapMutations } from "vuex";

    export default {
        name: "GameInvitationNotify",
        mixins: [NotifyMixin],
        data() {
            return {
                optionRest: null,
            }
        },
        computed: {
            visibleNotificationsList() {
                let options = this.notify.game_options.options;
                return options.filter((option, index) => {
                    if (index < 6) {
                        return option;
                    }
                    if (options.length < 8) {
                        return option;
                    }
                    this.optionRest = options.length - 6;
                });
            }
        },
        methods: {
            ...mapMutations([
                'setCurrentContactUuid',
                'setContactsActiveTab',
            ]),
            acceptGameInvitation(id, creator_uuid) {
                this.hideNotification(id);
                this.notificationAnswer({ game_invite: true, id, answer: Notification_ANSWER_YES, creator_uuid });
            },
            declineGameInvitation(id, creator_uuid) {
                this.hideNotification(id);
                this.notificationAnswer({ game_invite: true, id, answer: Notification_ANSWER_NO, creator_uuid });
            },
            goToChat(notify) {
                this.hideNotification(notify.id);
                this.setCurrentContactUuid(notify.game_options.creator_uuid);
                this.setContactsActiveTab(1);
            },
        },
    }
</script>

<style lang="scss" scoped>
    .game-invitation {
        box-sizing: border-box;
        text-align: left;
        padding: 24px 24px;
        border-radius: 15px;
        background: var(--color-player-inactive);
        .title {
            font-size: 10px;
            padding-bottom: 5px;
        }
        .players {
            display: flex;
            flex-wrap: wrap;
            padding-bottom: 5px;
            img {
                width: 28px;
                height: 28px;
                border: 2px solid #000000;
                box-sizing: border-box;
                border-radius: 50%;
                margin-right: 4px;
            }
        }
        .rules {
            .list {
                list-style: none;
                display: flex;
                flex-wrap: wrap;
                margin: 0;
                padding: 0;
                li {
                    width: 28px;
                    height: 28px;
                    margin-right: 4px;
                    &:last-of-type {
                        margin-right: 0;
                    }
                    &.num {
                        background-color: #C4C4C4;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        border-radius: 8px;
                    }
                }
            }
        }
        .actions {
            padding-top: 15px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            a {
                background-color: var(--color-background-3);
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 10px;
                text-decoration: none;
                border-radius: 3px;
                &.accept {
                    background: var(--color-purple-medium);
                }
                &.accept, &.decline {
                    width: 35%;
                }
                &.go-to-chat {
                    width: 25%;
                }
            }
        }
    }
</style>
