<template>
    <div class="chat-wrapper">
        <div class="users">
            <div class="users-tabs">
                <div
                    v-for="(tab, indexIdx) in playersChatUsers"
                    :key="indexIdx"
                    class="users-list"
                    :class="['tab-button', { active: currentTab === tab }]"
                    @click="currentTab = tab.component"
                >
                    {{ tab.name }}
                </div>
            </div>
            <div class="users-chat">
                <keep-alive>
                    <component
                        :is="currentTabComponent"
                        class="tab"
                        :class="{'message-list--blured': blured}"
                    ></component>
                </keep-alive>
                <!--            <MessageList :class="{'message-list&#45;&#45;blured': blured}" />-->
<!--                <MessageInput :onSubmit="onSubmitMessage" :placeholder="placeholder" />-->
            </div>

        </div>
    </div>
</template>

<script>
    import MessageList from './MessageList.vue'
    import MessageInput from './MessageInput.vue'
    import { mapGetters, mapActions } from 'vuex';
import MessageUserFirst from './MessageUserFirst'

    export default {
        name: 'GameChat',
        components: {
            MessageList,
            MessageInput,
            MessageUserFirst
        },
        props: {
            blured: Boolean,
        },
        data() {
            return {
                alwaysScrollToBottom: true,
                placeholder: this.$t('CONTACTS.Введите сообщение'),
                currentTab: "MessageList",
                allUsers: { name:"Чат", component:"MessageList"},
            }
        },
        computed: {
            ...mapGetters([
                'currentUser',
                "gamePlayers",
                "gameMessages",
            ]),
            playersChatUsers() {
                this.gamePlayers.forEach(item => {
                    return item.component = 'MessageUserFirst';
                })
                return [this.allUsers,...this.gamePlayers];
            },
            currentTabComponent: function() {
                return this.currentTab;
            },
        },
        methods: {
            ...mapActions([
                'sendGameMessage',
                'loadGameChatHistory',
            ]),
            onSubmitMessage(message) {
                this.sendGameMessage({
                    message: message.text,
                    gameUuid: this.$route.params.gameid
                });
            },
        },
        created() {
            this.loadGameChatHistory({gameUuid: this.$route.params.gameid});
        },
    }
</script>

<style lang="scss" scoped>
.users {
    display: flex;
    flex-direction: column;
    &-tabs {
        display: flex;
        padding-bottom: 30px;
    }
    &-chat {
        display: flex;
        flex-flow: column;
        flex: 1 1 auto;
    }
    &-list {
        background: #202124;
        border: 1px solid #000000;
        padding: 6px;
        margin-right: 9px;
        width: 100%;

        &:last-child {
            margin-right: 0;
        }
    }
}
    .chat-wrapper {
        width: 100%;
        height: 49%;
        max-height: 350px;
        display: flex;
        flex-flow: column;
        flex: 1 1 auto;
        position: relative;
        padding: 0 7px;

        @media screen and (max-width: 1366px) {
            max-height: 274px;
        }

        .chat-title {
            display: block;
            text-align: left;
            font-size: 22px;
            line-height: 22px;
            font-weight: 500;
            color: #fff;
            margin-bottom: 12px;
        }
    }
</style>
