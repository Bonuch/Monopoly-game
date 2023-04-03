<template>
    <div class="private-chat">
        <div class="divider"></div>
        <div class="contact">
            <router-link
                class="contact__left"
                :to="{ name: 'user', params: { useruuid: contact.uuid } }"
                :title="$t('CONTACTS.Посмотреть профиль')"
            >
                <div class="photo" :style="{ borderColor: contact.borderColor }">
                    <img :src="contact.avatarUrl" alt="#" />
                </div>

                <div class="status" :class="contact.onlineStatus"></div>
                <div class="status-text">
                    {{ contact.onlineStatus === "offline" ? contact.lastActivity : (contact.inGame ? $t("CONTACTS.В игре") : "")
                    }}
                </div>
                <div class="name">
                    {{ contact.fullName | truncate(10) }}
                </div>
            </router-link>

            <div class="contact__buttons buttons">
                <a class="go-back" title="К диалогам" href="#" @click.prevent="goBack"></a>
                <router-link :title="$t('CONTACTS.Открыть профайл')" class="open-profile"
                             :to="{ name: 'user', params: { useruuid: contact.uuid } }">
                </router-link>
                <a class="invite"
                   :title="$t('CONTACTS.Пригласить в игру')"
                   v-if="!!gameLobbyCreator && contact.lastActivity !== 'offline' && !contact.inGame"
                   href="#"
                   @click.prevent="sendInvite(contact.uuid)"></a>
                <a class="mute" :title="$t('CONTACTS.Не получать сообщения (mute)')"
                   :class="{muted: (this.is_muted > 0)}" href="#" @click.prevent="muteUser(contact.uuid)"></a>
                <a class="ban" :title="$t('CONTACTS.Забанить')" :class="{banned: (this.is_banned > 0)}" href="#"
                   @click.prevent="banUser(contact.uuid)"></a>
            </div>
        </div>
        <div class="messages" :class="{firefox: this.firefox}" ref="messages_list">
            <div class="scroll">
                <!--                {{ this.messages }}-->
                <div v-for="message of this.messages"
                     class="message"
                     :class="{ mine: (currentUser.uuid === message.senderUuid) }"
                     :key="message.id"
                >
                    <!--div class="name" v-if="currentUser.uuid !== message.senderUuid">
                        {{ message.senderName }}
                    </div-->
                    <div v-if="message.file_info" class="text">
                        <a v-for="image in message.file_info"
                           :href="image.origin"
                           target="_blank"
                           :key="image.origin"
                        >
                            <img :src="image.thumb" alt="#">
                        </a>
                    </div>
                    <!--  сообщение от контакта                  -->
                    <div v-if="message.status === 0 && !message.file_info && currentUser.uuid !== message.senderUuid"
                         class="text new"
                         :class="{emoji: isEmoji(message)}"
                         v-observe-visibility="(isVisible) => { messageViewed(isVisible, message); }"
                         @mouseover="messageViewed(true, message)">
                        <!--                        {{ message.content }}-->
                        {{ filterEmojiTag(message.content) }}
                    </div>
                    <!--  мои сообщения                  -->
                    <div v-if="(message.status > 0 || currentUser.uuid === message.senderUuid) && !message.file_info"
                         class="text"
                         :class="{emoji: isEmoji(message)}">
                        <!-- TODO - @contextmenu.prevent.stop="openContextMenu($event, message)   -->
                        {{ filterEmojiTag(message.content) }}
                    </div>
                </div>
            </div>
        </div>
        <div class="input-area">
            <div class="image-upload__preview" ref="imageUploadPreview">
                <div class="preview__container" v-for="(image, index) in previewImages">
                    <div class="preview__wrapper">
                        <img :src="image.src" alt="#" width="50px" height="50px">
                    </div>
                    <a href="#" class="preview__delete" @click.prevent="deletePreviewImage(index)">X</a>
                </div>
            </div>
            <div v-if="is_banned || iam_banned" class="ban-message">
                {{ is_banned ? $t("CONTACTS.Вы забанили собеседника") : contact.fullName + " " + $t("CONTACTS.забанил Вас")
                }}
            </div>

            <textarea v-if="!iam_banned && !is_banned"
                      ref="inputMessage"
                      class="input"
                      maxlength="100"
                      :placeholder="$t('CONTACTS.Введите сообщение')"
                      @keydown="onInputKeyDown"></textarea>
            <div v-if="!iam_banned && !is_banned" class="buttons">
                <a href="#" :title="$t('CONTACTS.Отправить изображение')" class="send-image"
                   @click.prevent="attachImage"></a>
                <a href="#" :title="$t('CONTACTS.Смайлы')" class="insert-smile" @click.prevent="emojiOpened = true"></a>
                <a href="#" :title="$t('CONTACTS.Отправить (Enter)')" class="send-text"
                   @click.prevent="sendMessage"></a>
                <input type="file" accept=".jpg,.jpeg,.png" class="hide" ref="fileUploadInput"
                       v-on:change="handleFileUpload()" multiple>
            </div>
            <EmojiPicker v-if="emojiOpened" :onEmojiPicked="onEmojiPicked" :onBlur="() => emojiOpened = false" />
        </div>
        <!--        <vue-simple-context-menu-->
        <!--            :elementId="'messageMenu'"-->
        <!--            :options="contextMenuOptions"-->
        <!--            :ref="'messageContextMenu'"-->
        <!--            @option-clicked="clickedContextMenu">-->
        <!--        </vue-simple-context-menu>-->
    </div>
</template>

<script>
import EmojiPicker from "./EmojiPicker/EmojiPicker.vue";
import { truncate } from "@/helpers/text";
import { mapActions, mapGetters } from "vuex";

const STATUS_VIEWED = 1;

export default {
    name: "PrivateChat",
    components: {
        EmojiPicker,
    },
    props: {
        inGame: {
            required: false,
        },
    },
    data() {
        return {
            emojiOpened: false,
            searchDialogue: "",
            firefox: false,
            scrollTop: 0,
            file: [],
            contextMenuOptions: [
                {
                    name: this.$t("CONTACTS.Удалить"),
                    slug: "remove",
                },
            ],
        };
    },
    filters: {
        truncate,
    },
    computed: {
        ...mapGetters([
            "currentContactUuid",
            "currentUser",
            "privateChats",
            "gameLobbyCreator",
            "currentGameUuid",
        ]),
        chat() {
            return this.privateChats[this.currentContactUuid] || null;
        },
        contact() {
            return this.chat ? this.chat.contact : {};
        },
        messages() {
            return this.chat ? this.chat.messages : [];
        },
        is_muted() {
            return this.chat ? this.chat.is_muted : 0;
        },
        is_banned() {
            return this.chat ? this.chat.is_banned : 0;
        },
        iam_banned() {
            return this.chat ? this.chat.iam_banned : 0;
        },
        previewImages() {
            if (this.file.length === 0) {
                return this.file;
            }
            const res = [];
            for (const file of this.file) {
                res.push({
                    src: window.URL.createObjectURL(file),
                });
            }
            return res;
        },
    },
    methods: {
        ...mapActions([
            "sendPrivateMessage",
            "loadPrivateChatMessages",
            "setMessageWasRead",
            "removePrivateMessage",
            "muteUserOfTheRoom",
            "banUserOfTheRoom",
            "inviteUserToGame",
            "sendMessageFiles",
        ]),

        openContextMenu(event, message) {
            if (message.senderUuid === this.currentUser.uuid) {
                this.$refs.messageContextMenu.showMenu(event, message);
            }

            let messages = document.querySelector(".private-chat");
            let messageMenu = document.querySelector("#messageMenu");
            let messagesOffsetTop = messages.getBoundingClientRect().top;

            if ((messageMenu.offsetHeight + event.pageY) >= window.innerHeight) {
                messageMenu.style.top = ((event.pageY - messagesOffsetTop) - messageMenu.offsetHeight + 2) + "px";
            } else {
                messageMenu.style.top = ((event.pageY - messagesOffsetTop) - 2) + "px";
            }

        },

        clickedContextMenu(data) {
            switch (data.option.slug) {
                case "remove":
                    this.removePrivateMessage({
                        message_id: data.item.id,
                    }).then(_ => {
                    });
                    break;
                case "edit":

                    // TODO

                    break;
            }
        },

        onEmojiPicked(emoji) {
            const text = this.$refs.inputMessage.value;
            if (text.split(" ").join("") !== "") {
                const caretPosition = this.$refs.inputMessage.selectionStart;
                const start = text.substring(0, caretPosition);
                const end = text.substring(caretPosition, text.length);
                this.$refs.inputMessage.value = start + " " + emoji + " " + end;
            } else {
                this.sendPrivateMessage({
                    text: "<emoji>" + emoji + "</emoji>",
                    contactUuid: this.contact.uuid,
                });
            }
        },

        onInputKeyDown(e) {
            if (e.keyCode && e.keyCode === 13) {
                this.sendMessage();
                e.preventDefault();
            } else if (e.keyCode && e.keyCode === 27) {
                this.$refs.inputMessage.value = "";
                e.preventDefault();
            }
        },

        sendMessage() {
            let messageText = this.$refs.inputMessage.value;
            if (messageText.split(" ").join("") !== "" || this.file.length > 0) {
                const prePayload = {
                    text: messageText.replace("\n", ""),
                    contactUuid: this.contact.uuid,
                };
                if (this.currentGameUuid) {
                    prePayload["game_uuid"] = this.currentGameUuid;
                }
                this.sendPrivateMessage(prePayload).then(async data => {
                    if (this.file.length > 0) {
                        await this.sendMessageFiles({
                            files: this.file,
                            users: {
                                sender: this.currentUser.uuid,
                                receiver: this.contact.uuid,
                            },
                        }).then(_ => {
                            const fileLen = this.file.length;
                            for (let i = 0; i < fileLen; i++) {
                                window.URL.revokeObjectURL(this.file.pop().index);
                            }
                            this.fetchPrivateMessages();

                            // this.loadPrivateChatMessages({ contactUuid: this.currentContactUuid }).then(ok => {
                            //     if (ok) this.scrollDown();
                            // });
                        });
                    }
                });
                this.$refs.inputMessage.value = "";
            }
        },

        messageViewed(isVisible, message) {
            if (isVisible) {
                setTimeout(() => {
                    this.setMessageWasRead({
                        id: message.id,
                        contactUuid: message.senderUuid, // отметка о прочитанном сообщении относится только к сообщениям контакта, так что senderUuid в данном случае это uuid контакта
                        status: STATUS_VIEWED,
                    });
                }, 800);
            }
        },

        attachImage() {
            console.log("attachImage", this.$refs.fileUploadInput);
            this.$refs.fileUploadInput.click();
        },

        deletePreviewImage(fileIndex) {
            console.log(fileIndex);
            const file = this.file[fileIndex];
            window.URL.revokeObjectURL(file.src);
            this.file.splice(fileIndex, 1);
        },

        async handleFileUpload() {
            const allowedExt = new Set([
                "image/jpeg",
                "image/png",
            ]);
            for (let i = 0; i < this.$refs.fileUploadInput.files.length; i++) {
                const file = this.$refs.fileUploadInput.files[i];
                if (allowedExt.has(file.type)) {
                    this.file.push(file);
                }
            }
        },

        goBack() {
            this.$parent.openChatsList();
        },

        muteUser(contactUuid) {
            this.muteUserOfTheRoom({ contactUuid }).then(ok => {
                if (ok) this.scrollDown();
            });
        },

        banUser(contactUuid) {
            this.banUserOfTheRoom({ targetUuid: contactUuid, status: (this.is_banned ? 0 : 1) });
        },

        isEmoji(message) {
            return message.content.indexOf("<emoji>") >= 0;
        },

        filterEmojiTag(content) {
            return content.replace(/\<\/?emoji\>/g, "");
        },

        scrollDown(smart = false) {
            const $scroll = this.$refs.messages_list;

            if (smart && ($scroll.scrollHeight - $scroll.scrollTop - $scroll.offsetHeight) > 80) {
                return;
            }
            $scroll.scrollTop = $scroll.scrollHeight;
        },

        sendInvite(contactUuid) {
            this.inviteUserToGame(contactUuid).then(response => {
                this.$dialog.alert(response.error || response.message);
            });
        },
        fetchPrivateMessages() {
            this.loadPrivateChatMessages({ contactUuid: this.currentContactUuid }).then(ok => {
                if (ok) this.scrollDown();
            });
        }
    },
    mounted() {
        // микрохак для firefox
        if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
            this.firefox = true;
        }
        // обновляем данные на всякий случай
        // this.loadPrivateChatMessages({ contactUuid: this.currentContactUuid }).then(ok => {
        //     if (ok) this.scrollDown();
        // });
        this.fetchPrivateMessages();

        this.scrollDown();
        // autofocus
        this.$nextTick(() => this.$refs.inputMessage.focus());
    },
    updated() {
        this.scrollDown(true);
    },
};
</script>

<style scoped lang="scss">
* {
    box-sizing: border-box;
}

.hide {
    display: none;
}

.image-upload__preview {
    display: flex;
    flex-wrap: wrap;
}

.preview__delete {
    position: absolute;
    right: 0px;
    top: -3px;
    font-size: 15px;
    z-index: 10;
    text-align: center;
    text-decoration: none;
    color: #fff;
    opacity: .8;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background-color: #1B1B1B;
}

.preview__container {
    //padding: 5px;
    position: relative;
    width: 50px;
    height: 50px;
    padding: 2px;

    .preview__wrapper {
        overflow: hidden;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        border: 2px solid transparent;
        border-radius: 5px;
    }

    img {

        transition: .2s;
        object-fit: contain;
        height: 100%;
        width: unset;
        max-width: unset;
    }

    &:hover {
        .preview__wrapper {
            border: 2px solid var(--color-purple-medium);
        }
    }
}

.private-chat {
    flex: 1 1 auto;
    position: relative;
    min-height: 100px;
    text-align: left;
    height: 100%;
    display: flex;
    flex-direction: column;

    .divider {
        height: 2px;
        background: #E8E7E7;
        margin: 2px 0 6px 0;
    }

    .contact {
        position: relative;
        height: 50px;
        display: flex;
        align-items: center;

        &__left {
            flex: 1;
            display: flex;
            align-items: center;
            margin-right: 15px;
        }

        &__buttons {
            flex: 0 1 auto;
            margin-left: auto;
        }

        .photo {
            height: 40px;
            width: 40px;
            overflow: hidden;
            border: 2px solid #000;
            border-radius: 100px;
            background-color: #fff;
        }

        .status {
            position: absolute;
            top: 40px;
            left: 40px;
            height: 6px;
            width: 6px;
            border: none;
            border-radius: 100px;
            background: #fff;

            &.online {
                background: #15E82A;
            }

            &.away {
                background: #e8e400;
            }

            &.offline {
                background: #dbd7e8;
            }
        }

        .name {
            position: absolute;
            top: 18px;
            left: 54px;
            font-size: 16px;
            font-weight: 500;
            color: #fff;
        }

        .status-text {
            position: absolute;
            top: 32px;
            left: 54px;
            color: #fff;
            font-size: 11px;
        }

        .buttons {
            display: flex;
            align-items: center;

            a {
                height: 16px;
                margin-left: 10px;
                background-size: contain;

                &:last-of-type {
                    margin-right: 0;
                }
            }

            .go-back {
                background: url("/design/icons/return.svg") center center no-repeat;
                width: 16px * (12px / 10px);
            }

            .open-profile {
                background: url("/design/icons/profile-pic.svg") center center no-repeat;
                width: 16px * (18px / 14px);
            }

            .invite {
                background: url("/design/icons/invite.svg") center center no-repeat;
                width: 16px * (16px / 14px);
            }

            .mute {
                background: url("/design/icons/mute.svg") center center no-repeat;
                width: 16px * (13px / 11px);

                &.muted {
                    background: url("/design/icons/mute_active.svg") center center no-repeat;
                }
            }

            .ban {
                background: url("/design/icons/ban.svg") center center no-repeat;
                width: 16px;

                &.banned {
                    background: url("/design/icons/ban-active.svg") center center no-repeat;
                }
            }
        }
    }

    .messages {
        //position: absolute;
        //top: 60px;
        //bottom: 56px;
        left: 0;
        right: 0;
        padding-right: 10px;
        overflow: auto;
        scrollbar-width: none;
        flex: 1;

        // пока закомментировал, у меня в фф наоборот из за этого паддинга скачки
        /*&.firefox {*/
        /*    padding-right: 16px;*/
        /*}*/

        &:hover {
            scrollbar-width: thin;
            scrollbar-color: #585858 #454545;
        }

        &.firefox:hover {
            padding-right: 10px;
        }

        &::-webkit-scrollbar-track {
            border-radius: 10px;
            background-color: #454545;
        }

        &::-webkit-scrollbar {
            width: 9px;
            background-color: transparent;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background-color: #585858;
        }
        .scroll {
            display: flex;
            flex-direction: column;
            min-height: 100%;
        }
        .message {
            margin: 2px 60px 6px 10px;
            &:first-child {
                margin-top: auto;
            }
            &.mine {
                margin: 2px 10px 6px 60px;
                text-align: right;
                &:first-child {
                    margin-top: auto;
                }
            }

            .name {
                font-size: 10px;
                color: #555;
                padding-left: 4px;
            }

            .text {
                display: inline-block;
                padding: 6px 10px;
                border-radius: 8px;
                font-size: 12px;
                background: #24202C;
                color: #fff;
                max-width: 210px;
                overflow: hidden;
                /* These are technically the same, but use both */
                overflow-wrap: break-word;
                word-wrap: break-word;
                -ms-word-break: break-all;
                /* This is the dangerous one in WebKit, as it breaks things wherever */
                word-break: break-all;
                /* Instead use this non-standard one: */
                word-break: break-word;
                /* Adds a hyphen where the word breaks, if supported (No Blink) */
                -ms-hyphens: auto;
                -moz-hyphens: auto;
                -webkit-hyphens: auto;
                hyphens: auto;
                font-family: 'SF UI Display', 'Noto Color Emoji', 'sans-serif';

                &.new {
                    border-left: 2px solid #9baecc;
                }

                &.emoji {
                    background: transparent;
                    font-size: 30px;
                    color: #fac52b;
                    line-height: 20px;
                }
            }
        }
    }

    .input-area {
        position: relative;
        //bottom: 20px;
        //left: 0;
        //right: 0;
        //height: 32px;

        .ban-message {
            height: 40px;
            text-align: center;
            background: #fbd6d6;
            line-height: 40px;
            border-radius: 4px;
        }

        .input {
            width: 100%;
            border: none;
            border-radius: 100px;
            height: 40px;
            padding: 10px 84px 0 10px;
            outline: none;
            overflow: hidden;
            resize: none;
            box-sizing: border-box;
            background: #24202C;
            color: #fff;
            font-size: 17px;
            font-family: 'SF UI Display', 'Noto Color Emoji', 'sans-serif';

            &::placeholder {
                color: #999;
                font-size: 17px;
                font-weight: 700;
            }
        }

        .buttons {
            position: absolute;
            //top: 11px;
            bottom: 11px;
            right: 10px;

            a {
                display: inline-block;
                height: 16px;
                margin-left: 10px;
            }

            .send-image {
                background: url(/design/icons/send-image.svg) center center no-repeat;
                background-size: contain;
                width: 16px;
            }

            .insert-smile {
                background: url(/design/icons/smile.svg) center center no-repeat;
                background-size: contain;
                width: 16px;
            }

            .send-text {
                background: url(/design/icons/send.svg) center center no-repeat;
                background-size: contain;
                width: 16px * (18px / 14px);
            }
        }
    }
}
</style>
