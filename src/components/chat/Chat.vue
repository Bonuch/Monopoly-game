<template>
    <div class="chat-wrapper">
        <div class="chat-title">{{ $t("CONTACTS.Чат") }}</div>
        <MessageList
            v-if="!showUserList"
            :alwaysScrollToBottom="alwaysScrollToBottom"
            :showTypingIndicator="showTypingIndicator"
            key="mesageListComp"
            style="height: calc(100% - 40px);"
        />
        <UserInput
            v-if="!showUserList"
            :common-chat="commonChat"
            :onSubmit="onMessageWasSent"
            :placeholder="placeholder"
            key="userInputComp"
        />
    </div>
</template>

<script>
// TODO это нужно полносьтью переписать, слишком много мелких компонентов, тяжело отслеживается логика кода
// результат переделки существующего чата. Нужно сделать по примеру private-chat

import { mapGetters, mapMutations, mapActions } from "vuex";
import MessageList from "./MessageList.vue";
import UserInput from "./UserInput.vue";
import { setAuthorization } from "@/helpers/axios-instance";
import axios from "@/helpers/axios-instance";
import uuid from "uuid/v4";

export default {
    name: "Chat",
    components: {
        MessageList,
        UserInput,
    },
    props: {
        commonChat: Boolean,
        default: false
    },
    data() {
        return {
            alwaysScrollToBottom: true,
            showUserList: false,
            showTypingIndicator: "",
            placeholder: this.$t("CONTACTS.Введите сообщение"),
            // userIsTyping: false
        };
    },
    computed: {
        ...mapGetters([
            "currentUser",
            "messages",
            "chatParticipants",
        ]),
    },
    async mounted() {
        this.setChatParticipants();
    },
    methods: {
        ...mapMutations([
            "sendMessage",
            "addChatOnlineParticipant",
            "updateCurrentUserTokens",
        ]),
        ...mapActions([
            "setChatParticipants",
            "setChatHistory",
        ]),
        onMessageWasSent(message) {
            if (this.currentUser.user_banned_in_chat) {
                return false;
            }
            const messageFormatted = {
                type: message.type,
                user: {
                    author_id: this.currentUser.uuid || null,
                    nickName: this.currentUser.username || "unknown",
                    avatar: this.currentUser.avatar || "unknown",
                },
                author: this.currentUser.user_id,
                data: message.data,
                uuid: uuid(),
            };
            this.$socket.client.emit("broadcast", messageFormatted);
            this.sendMessage(messageFormatted);
        },
    },
    destroyed() {
        // alert("CHAT DESTROY")
    },
};
</script>

<style lang="scss" scoped>
.chat-wrapper {
    display: flex;
    flex-flow: column;
    flex: 1 1 auto;
    position: relative;
    margin: 10px 15px;
    height: inherit;
    overflow: hidden;
    padding-bottom: 20px;
    @media (max-width: 1366px) {
        height: 100%;
        max-height: 550px;
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
