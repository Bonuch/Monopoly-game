<template>
    <div class="chats-list">
        <div class="search">
            <input type="text" v-model="searchDialogue" :placeholder="$t('CONTACTS.Поиск диалогов')"/>
            <a href="#" @click.prevent="searchDialogue = ''" class="clear" v-if="searchDialogue"></a>
        </div>

        <div class="info" v-if="chatsNumber === 0">{{ $t('CONTACTS.У Вас пока нет диалогов') }}</div>

        <div class="list">
            <div class="scroll" v-if="chatsNumber > 0">
                <div
                    class="contact"
                    v-for="room of filteredRooms"
                    :key="room.contact.uuid"
                >
                    <div
                        class="contact__left"
                        @click.prevent="openMessages(room.contact.uuid)"
                    >
                        <div class="image">
                            <img :src="room.contact.avatarUrl" :alt="room.contact.fullName"/>
                            <span class="status" :class="room.contact.onlineStatus"></span>
                        </div>

                        <div class="content">
                            <div class="name">
                                <a class="link" href="#" @click.prevent="openMessages(room.contact.uuid)">{{ room.contact.fullName | truncate(10) }}</a>
                            </div>
                            <div class="last-message">{{ room.lastMessage }}</div>
                        </div>
                    </div>

                    <div class="contact__buttons buttons">
                        <span class="bandle-counter" v-if="room.unreadMessagesNumber > 0">
                            <b class="num" :title="room.unreadMessagesNumber | setCase([
                                $t('CONTACTS.сообщение'),
                                $t('CONTACTS.сообщения'),
                                $t('CONTACTS.сообщений')], '<')"
                            >
                                {{ room.unreadMessagesNumber }}
                            </b>
                        </span>
                        <a class="remove" :title="$t('CONTACTS.Удалить диалог')" href="#" @click.prevent="remove(room.contact.uuid)"></a>
                        <!--                        <a class="messages" title="Открыть диалог" href="#" @click.prevent="openMessages(room.contact.uuid)"></a>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { truncate, setCase } from '@/helpers/text';
    import { mapActions, mapGetters } from 'vuex';

    export default {
        name: 'PrivateChatsList',
        components: {

        },
        filters: {
            truncate,
            setCase
        },
        data() {
            return {
                searchDialogue: '',
                firefox: false,
            };
        },
        computed: {
            ...mapGetters([
                'privateChats',
                'currentUser',
            ]),
            chatsNumber() {
                let number = 0;
                for (const room of Object.keys(this.privateChats)) {
                    if (this.privateChats[room].messages.length > 0 || this.privateChats[room].is_muted > 0) {
                        number++;
                    }
                }
                return number;
            },
            filteredRooms() {
                const search = this.searchDialogue.toLowerCase();
                const rooms = [];
                for (const room of Object.keys(this.privateChats)) {
                    const roomData = this.privateChats[room];
                    if (roomData.messages.length > 0 || roomData.is_muted > 0) {
                        if (search.split(' ').join('') !== '') {
                            if (roomData.contact.fullName.toLowerCase().indexOf(search) >= 0 || roomData.lastMessage.toLowerCase().indexOf(search) >= 0) {
                                rooms.push(roomData);
                            }
                        } else {
                            rooms.push(roomData);
                        }
                    }
                }
                return rooms;
            }
        },
        methods: {
            ...mapActions([
                'removeDialogue',
            ]),
            remove(contactUuid) {
                this.removeDialogue(contactUuid);
            },
            openMessages(contactUuid) {
                this.$parent.openMessages(contactUuid);
            },
        },
    };
</script>

<style scoped lang="scss">
    .chats-list {
        flex: 1 1 auto;
        position: relative;
        height: inherit;
        min-height: 100px;

        .search {
            position: relative;
            text-align: center;
            box-sizing: border-box;
            padding-bottom: 20px;
            .clear {
                position: absolute;
                top: 11px;
                right: 16px;
                display: block;
                width: 16px;
                height: 16px;
                border: 0;
                background: url("/design/icons/close-dark.svg") no-repeat center center;
            }

            input {
                width: 100%;
                height: 40px;
                border-radius: 40px;
                border: none;
                outline: none;
                padding: 0 14px;
                box-sizing: border-box;
                background-color: #24202C;
                color: #fff;
                font-size: 18px;

                &::placeholder {
                    color: #8D8B8B;
                }
            }
        }

        .info {
            padding: 10px;
            text-align: center;
            font-size: 10px;
            color: #8D8B8B;
        }

        .list {
            //position: absolute;
            //left: 0;
            //top: 44px;
            //right: -12px;
            //bottom: 12px;
            //max-height: calc(100vh - 68px - 200px - 40px);
            overflow: auto;
            scrollbar-width: none;
            height: inherit;
            &:hover {
                scrollbar-width: thin;
                scrollbar-color: #585858 #454545;
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

            .contact {
                text-align: left;
                position: relative;
                display: flex;
                align-items: center;
                margin-bottom: 12px;

                &__left {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    margin-right: 15px;
                    cursor: pointer;
                }

                &__buttons {
                    flex: 0 1 auto;
                    margin-left: auto;
                }

                .image {
                    position: relative;
                    width: 60px;
                    margin-right: 7px;

                    img {
                        border-radius: 50%;
                        border: 3px solid #000000;
                        box-sizing: border-box;
                        background-color: #C4C4C4;
                    }

                    .status {
                        position: absolute;
                        height: 6px;
                        width: 6px;
                        right: 0;
                        bottom: 0;
                        border-radius: 50%;
                        background-color: #fff;
                        &.online {
                            background-color: #15E82A;
                        }

                        &.away {
                            background-color: #e8e400;
                        }

                        &.offline {
                            background-color: #dbd7e8;
                        }
                    }
                }

                .content {
                    flex: 1;
                    width: 0;

                    .name {
                        font-size: 18px;
                        font-weight: 500;
                        color: #fff;
                        padding: 5px 0;
                        a {
                            text-decoration: none;
                            color: #fff;
                        }
                    }

                    .last-message {
                        color: #8D8B8B;
                        font-size: 15px;
                        font-weight: 500;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-family: 'SF UI Display', 'Noto Color Emoji', 'sans-serif';
                    }
                }


                .buttons {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding: 0 10px;

                    a, span {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-position: center;
                    }

                    .remove {
                        background-image: url("/design/icons/trash-bright.svg");
                    }

                    .bandle-counter {
                        margin-top: 4px;
                        margin-right: 10px;
                        background-image: url("/design/icons/bandle.svg");
                        text-align: center;

                        .num {
                            color: #fff;
                            font-size: 11px;
                            font-weight: normal;
                        }
                    }

                    /*.messages {*/
                    /*    background: url(/design/icons/send.svg) center center no-repeat;*/
                    /*    background-size: contain;*/
                    /*    width: 16px * (18px / 14px);*/
                    /*}*/
                }
            }
        }
    }
</style>
