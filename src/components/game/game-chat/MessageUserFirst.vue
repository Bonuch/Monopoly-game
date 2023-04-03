<template>
    <div class="">
<!--        <div class="message-list" ref="scrollList">-->
<!--            <div class="scroll">-->
<!--                <div-->
<!--                    v-for="(message, idx) in gameMessages"-->
<!--                    :key="idx"-->
<!--                    class="message"-->
<!--                    :class="{ system: !message.senderUuid }"-->
<!--                >-->
<!--                    &lt;!&ndash;button class="ban-user" @click.prevent="banUser(message.senderUuid)"></button&ndash;&gt;-->
<!--                    &lt;!&ndash;span class="time">{{ message.createdAt }}: </span&ndash;&gt;-->
<!--                    <span v-if="message.type == 2" class="type">{{ $t("CONTACTS.Наблюдатель") }} </span>-->
<!--                    <span-->
<!--                        v-if="!!message.senderUuid"-->
<!--                        class="author-name"-->
<!--                        :style="{color: authorColor(message.senderUuid)}"-->
<!--                    >-->
<!--                    {{ message.senderName }}:-->
<!--                </span>-->

<!--                    <div v-if="!!message.senderUuid" class="content" :class="{emoji: isEmojiMessage(message.content)}">-->
<!--                        {{ filterEmojiTag(message.content) }}-->
<!--                    </div>-->
<!--                    <div v-if="!message.senderUuid" v-html="processMessage(message)" class="content"></div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
        <MessageInput :onSubmit="onSubmitMessage" :placeholder="placeholder"/>
    </div>

</template>

<script>
import { mapActions, mapGetters } from "vuex";
import MessageInput from "./MessageInput";

export default {
    name: "MessageUserFirst",
    components: { MessageInput },
    data() {
        return {
            active_tab: 0,
            placeholder: this.$t('CONTACTS.Введите сообщение'),
        }
    },
    computed: {
        ...mapGetters([
            "currentUser",
            "gamePlayers",
            "gameMessages",
            "gameCells",
        ]),
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
        changeTab(tabIndexValue) {
            this.active_tab = tabIndexValue;
        },
        scrollDown(smart = false) {
            const $scroll = this.$refs.scrollList;
            if (smart && ($scroll.scrollHeight - $scroll.scrollTop - this.containerHeight) > 60) {
                return;
            }
            $scroll.scrollTop = $scroll.scrollHeight;
        },
        banUser(uuid) {
            // todo
        },
        getPlayer(uuid) {
            const player = this.gamePlayers.filter(p => (p.uuid === uuid));
            if (player.length > 0) {
                return player[0];
            }
            return null;
        },
        getMonopoly(monopolyId) {
            return this.gameCells.find(cell => (cell.group_id == monopolyId));
        },
        authorColor(uuid) {
            const player = this.gamePlayers.filter(p => p.uuid === uuid);
            if (player.length > 0) {
                return player[0].background.color;
            }
            return "#fff";
        },
        processMessage(message) {
            let content = "<span style='color: #aaa; font-size: 10px; vertical-align: middle'>> </span>" + this.replaceMonopoly(this.replaceUuid(message.content));
            return content;
        },
        replaceUuid(message) {
            // заменяем uuid пользователя на цветное имя
            const regex = /{user=([^}]+)}/g;
            const matches = message.match(regex);
            if (matches) {
                for (let match of matches) {
                    const uuid = match.replace("{user=", "").replace("}", "");
                    const player = this.getPlayer(uuid);
                    if (player) {
                        message = message.replace(match, `<span style="color:${player.background.color}">${player.name}</span>`);
                    } else {
                        console.log('Игрок ' + uuid + ' не найден в списке игроков ( this.getPlayer(uuid) )')
                    }
                }
            }
            return message;
        },
        replaceMonopoly(message) {
            // заменяем monopolyId на цветное название
            const regex = /{monopoly=([^}]+)}/g;
            const matches = message.match(regex);
            if (matches) {
                for (let match of matches) {
                    const monopolyId = match.replace("{monopoly=", "").replace("}", "");
                    const cell = this.getMonopoly(monopolyId);
                    if (cell) {
                        const name = this.$i18n.t("CELLS." + cell.monopolyName);
                        message = message.replace(match, `<span style="color:${cell.monopoly_color}">${name}</span>`);
                    }
                }
            }
            return message;
        },
        isEmojiMessage(message) {
            return (message.indexOf("{emoji}") >= 0);
        },
        filterEmojiTag(message) {
            if (message.indexOf("{emoji}") >= 0) {
                message = message.replace(/{\/?emoji}/g, "");
            }
            return message;
        },
    },
    created() {
        this.loadGameChatHistory({gameUuid: this.$route.params.gameid});
    },
    mounted() {
        this.scrollDown(false);
    },
    updated() {
        this.scrollDown();
    },
};
</script>

<style scoped lang="scss">
.tabBlock {

    &-tabs {
        display: flex;
        padding-bottom: 30px;
        padding-left: 0;
        list-style: none;
        & li {
            margin-right: 9px;
            width: 100%;
            &:last-child {
                margin-right: 0;
            }
        }
        &::after {
            clear: both;
            content: "";
            display: table;
        }
    }

    &-tab {
        background: #202124;
        border: 1px solid #000000;
        padding: 6px;
        &:last-child {
            margin-right: 0;
        }

        &:hover,
        &:focus {
            color: green;
        }

        &.is-active {
            position: relative;
            color: green;
            z-index: 1;

            &::before {
                background-color: green;
            }

            &::after {
                background-color: #fff;
            }
        }

    }

}
.message.system {
    font-size: 14px;
}
.scroll {
    padding-top: 5px;
}
.message-list {
    box-sizing: content-box;
    background-color: transparent;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: #585858 #454545;
    font-size: 17px;
    margin-bottom: 10px;
    min-height: calc(100% - 115px);
    max-height: 150px;

    &--blured {
        filter: blur(3px);
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

    .message {
        text-align: left;
        margin-bottom: 5px;

        .content {
            display: inline-block;
            line-height: normal;
            word-break: break-word;
            font-family: 'SF UI Display', 'Noto Color Emoji', 'sans-serif';

            &.system {
                color: #00bff3;
            }

            &.emoji {
                background: transparent;
                font-size: 30px;
                color: #fac52b;
                line-height: 20px;
            }
        }

        .author-name {
            color: #000;
            font-size: 18px;
            line-height: 21px;
            font-weight: 500;
            margin-right: 5px;
        }

        .delete-message {
            background: url(/design/icons/trash-dark.svg) center center no-repeat;
            width: 11px * (9px / 11px);
        }

        .ban-user {
            background: url(/design/icons/ban-dark.svg) center center no-repeat;
            width: 11px;
        }
    }
}
</style>
