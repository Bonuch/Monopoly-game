<template>
    <div class="message" :class="[currentColorSchema, {'self': currentUser.uuid === getUserUuid}]">
        <div class="message-content"
             :class="{ system: message.type === 'system', self: currentUser.uuid === getUserUuid }">
            <ul class="moder-action-list" v-if="moderPermissions && !userIsMorderOrAdmin(user)">
                <li>
                    <button class="delete-message" @click.prevent="deleteMessage(message)"></button>
                </li>
                <li v-if="currentUser.user_id != user.id">
                    <button class="ban-user" @click.prevent="banUser(user)"></button>
                </li>
            </ul>
            <slot name="user-avatar" :message="message" :user="user"
                  v-if="currentUser.uuid !== getUserUuid && $vnode.key === 0 || sameAuthor">
                <ul class="profile__dropdown">
                    <li class="profile__item" v-if="currentUser.uuid !== getUserUuid">
                        <router-link

                            class="message__user__actions author-profile-link"
                            :to="{ name: 'user', params: { useruuid: getUserUuid } }"
                        >
                            <img v-if="avatar" class="avatar-message" :src="avatar" alt="#"><span class="author-name"
                                                                                         ref="authorName">{{ authorName
                            }}: </span>
                        </router-link>
                        <ul class="message__menu">
                            <li @click.prevent="copyName(user)">Скопировать имя</li>
                            <li>
                                <router-link :to="{ name: 'user', params: { useruuid: getUserUuid } }">Перейти в
                                    профиль
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <li class="profile__item" v-else>
                        <router-link
                            class="author-profile-link"
                            to="/profile/me"
                        >
                            <span class="author-name">{{ authorName }}</span>
                        </router-link>
                    </li>


                </ul>
            </slot>
            <!-- типы сообщений -->
            <div v-if="message.type === 'text'" class="message-text msg" :class="{'self': currentUser.uuid === getUserUuid}">
                <div class="message-text-content">
                    <p class="message-text-paragraph" v-html="messageText"></p>
                    <span class="message_date">{{ messageDate }}</span>
                </div>
            </div>
            <div v-else-if="message.type === 'emoji'" class="message-emoji msg" :class="{'self': currentUser.uuid === getUserUuid}">
                {{ message.data.emoji }}
            </div>
            <div v-else-if="message.type === 'system'" class="message-system msg" :class="{'self': currentUser.uuid === getUserUuid}">
                {{ message.data.text }}
                {{ message.date }}
                <p v-if="message.data.meta" class="message-meta">
                    {{ data.meta }}
                </p>
            </div>

        </div>
    </div>
</template>

<script>
import axios from "@/helpers/axios-instance";
import IconBase from "./components/IconBase.vue";
import IconEdit from "./components/icons/IconEdit.vue";
import escapeGoat from "escape-goat";
import Autolinker from "autolinker";
import msgdown from "msgdown";
import { mapGetters, mapMutations } from "vuex";

const moment = require("moment");

export default {
    data() {
        return {};
    },
    components: {
        IconBase,
        IconEdit,
    },
    props: {
        message: {
            type: Object,
            required: true,
        },
        user: {
            type: Object,
            required: true,
        },
    },
    methods: {
        ...mapMutations([
            "removeMessage",
        ]),
        copyName(name) {
            const el = document.createElement("textarea");
            el.value = name.nickName;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        },
        deleteMessage(message) {
            const confirm = window.confirm(this.$t("CONTACTS.Удалить сообщение?"));
            if (confirm) {
                this.$socket.client.emit("removeMessage", message.uuid);
                this.removeMessage(message.uuid);
            }
        },
        banUser(user) {
            const confirm = window.confirm($t("CONTACTS.Забанить") + ` ${user.name}?`);

            if (confirm) {
                axios.post("/ban-user-in-chat", {
                    user_id: user.id,
                    initiator_id: this.currentUser.user_id,
                    chat_id: 1,
                }).then(res => {
                    window.alert(`${user.name} ` + $t("CONTACTS.забанен!"));
                    this.$socket.client.emit("banUser", user.id, res.data.finish_time);
                }).catch(err => {
                    console.log(err.response);
                    if (err.response.status === 400) {
                        window.alert(err.response.data.message);
                    }
                });
            }
        },
        muteUser(user) {

        },
        userIsMorderOrAdmin(user) {
            return user.role === "moderator" || user.role === "admin";
        },
    },
    computed: {
        ...mapGetters([
            "currentColorSchema",
            "currentUser",
            "messages",
        ]),
        avatar() {
            return this.user.avatar === 'unknown' ? null : this.user.avatar
        },
        sameAuthor() {
            return this.messages[this.$vnode.key - 1] &&
                this.messages[this.$vnode.key - 1].user.author_id !== this.getUserUuid;
        },
        messageDate() {
            moment.locale("ru");
            return new moment(this.message.date).format("LT");
        },
        authorName() {
            return this.user.nickName;
        },
        getUserUuid() {
            return this.user.author_id;
        },
        moderPermissions() {
            return this.currentUser && (this.currentUser.role === "moderator" || this.currentUser.role === "admin");
        },
        messageText() {
            const escaped = escapeGoat.escape(this.message.data.text);
            return Autolinker.link(msgdown(escaped), {
                className: "chatLink",
                truncate: {
                    length: 50,
                    location: "smart",
                },
            });
        },
    },
};
</script>
<style scoped lang="scss">

.msg {
    .self {

    }
}

.message-text-paragraph {
    margin: 0;
    padding: 0;
}

.profile__dropdown {
    padding: 0px;
    margin: 0px;
    //position: relative;
    .profile__item {
        position: relative;
        display: inline-block;
        padding: 5px 0;
    }

    .profile__item:hover {
        .message__menu {
            display: block;
        }
    }
}

.avatar-message {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 5px;
}

.message_date {
    display: inline-block;
    float: right;
    font-size: 12px;
    opacity: .5;
}

.message__user__actions {
    position: relative;
}

.message__menu {
    list-style: none;
    display: none;
    position: absolute;
    top: 30px;
    left: 0;
    padding: 0;
    min-width: 100px;
    color: #fff;
    background: var(--color-base-gray);
    z-index: 100;
    border-radius: 5px;

    &:hover {
        display: block;
    }

    li {
        display: block;
        width: 180px;
        padding: 5px 5px;
        font-size: 18px;
        text-transform: lowercase;
        cursor: pointer;

        &:hover {
            background: darken(#5c6367, 20);
        }

        a {
            color: #fff;
            text-decoration: none;
        }
    }

    &::after {
        display: block;
        position: absolute;
        background: var(--color-base-gray);
        content: "";
        width: 10px;
        height: 10px;
        left: 10px;
        top: -4px;
        z-index: -10;
        border-radius: 2px;
        transform: rotate(45deg);
    }
}

.message {
    text-align: left;
    padding-bottom: 5px;

    .message-content {
        $picHeight: 11px;
        display: flex;
        position: relative;
        flex-direction: column;
        font-family: 'SF UI Display', 'Noto Color Emoji', 'sans-serif';

        &.self {
            justify-content: flex-end;
            align-items: flex-end;
            //margin-right: 15px;

            .message-text-content {
                background: darken(#5c6367, 5);
            }
        }

        .message-text-content {
            background: #4A4A4A;
        }

        &.system {
            justify-content: center;
        }

        .author-profile-link {
            display: flex;
            align-items: center;
            text-decoration: none;

            &:hover,
            &:active,
            &:focus {
                .author-name {
                    color: var(--color-base-blue);
                }
            }
        }

        .author-name {
            margin-right: 5px;
            color: #000;
            font-size: 18px;
            line-height: 21px;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        a.chatLink {
            color: inherit !important;
        }

        .message-text {
            color: #000;
            font-family: 'SF UI Display', 'Noto Color Emoji', 'sans-serif';

            &-content {
                font-size: 17px;
                line-height: 21px;
                white-space: pre-wrap;
                margin: 0;
                padding: 5px 10px;
                border-radius: 5px;
                margin-right: 7px;
                position: relative;
                display: inline-block;
                word-break: break-all;

                &::after {
                    position: absolute;
                    content: "";
                    display: block;
                    left: 0;
                    top: 0;
                }
            }
        }

        .message-emoji {
            //background: transparent;
            margin-right: 3px;
            font-size: 32px;
            color: #fac52b;
            line-height: 32px;
            font-family: 'SF UI Display', 'Noto Color Emoji', 'sans-serif';
        }

        .message-system {
            color: #a8b9e8;
            padding: 8px 20px;
            border-radius: 6px;
            font-weight: 300;
            font-size: 12px;
            line-height: 1.2;
            white-space: pre-wrap;
            -webkit-font-smoothing: subpixel-antialiased;
            font-style: italic;
            opacity: .55;

            .meta {
                font-size: xx-small;
                margin-bottom: 0;
                margin-top: 5px;
                opacity: .5;
                text-align: center;
            }
        }

        .moder-action-list {
            display: inline-block;
            list-style: none;
            padding: 0;
            margin: 0 2px 0 0;

            li {
                display: inline-block;

                button {
                    display: inline-block;
                    border: none;
                    height: $picHeight;
                    background-size: contain;
                    margin-right: 2px;
                }

                .delete-message {
                    background: url(/design/icons/trash-bright.svg) center center no-repeat;
                    width: $picHeight * (9px / 11px);
                }

                .ban-user {
                    background: url(/design/icons/ban-bright.svg) center center no-repeat;
                    width: $picHeight;
                }
            }
        }
    }

    &.dark {
        .delete-message {
            background: url(/design/icons/trash-dark.svg) center center no-repeat;
        }

        .ban-user {
            background: url(/design/icons/ban-dark.svg) center center no-repeat;
        }

        .message-text {
            color: #fff;
        }

        .author-name {
            color: #fff;
        }
    }
}
</style>
