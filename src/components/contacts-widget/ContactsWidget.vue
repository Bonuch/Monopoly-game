<template>
    <div class="contacts-widget" ref="contacts_widget">
        <div class="tabs">
            <a class="tabs__item contacts-tab"
               href="#"
               @click.prevent="setContactsActiveTab(0)"
               :class="{active: (contactsActiveTab === 0)}"
            >
                {{ $t('CONTACTS.Контакты') }}
            </a>

            <a
                v-if="commonChat"
               class="tabs__item chat-tab"
                href="#"
                @click.prevent="setContactsActiveTab(2)"
                :class="{active: (contactsActiveTab === 2)}"
            >
                {{ $t('CONTACTS.Чат') }}
            </a>

            <a
                class="tabs__item messages-tab"
                href="#"
                @click.prevent="setContactsActiveTab(1); setCurrentContactUuid(null);"
                :class="{active: (contactsActiveTab === 1)}"
            >
                {{ $t('CONTACTS.Личные сообщения') }} <span class="messages-tab__count">{{ getUnreadMessagesNumber }}</span>
            </a>
        </div>

        <div class="content" ref="contacts_widget_content">
            <ContactsList v-if="contactsActiveTab === 0"/>

            <PrivateChat v-if="contactsActiveTab === 1 && currentContactUuid"/>

            <PrivateChatsList v-if="contactsActiveTab === 1 && !currentContactUuid"/>

            <Chat class="contacts-widget__chat" v-if="contactsActiveTab === 2 && commonChat" />
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import ContactsList from '@/components/contacts-widget/ContactsList.vue';
    import PrivateChatsList from '@/components/contacts-widget/PrivateChatsList.vue';
    import PrivateChat from '@/components/contacts-widget/PrivateChat.vue';
    import Chat from "../chat/Chat";

    export default {
        name: 'ContactsWidget',
        components: {
            Chat,
            ContactsList,
            PrivateChatsList,
            PrivateChat
        },
        props: {
            commonChat: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
            };
        },
        computed: {
            ...mapGetters([
                'currentContactUuid',
                'contactsActiveTab',
                'currentUser',
                'contactsNumber',
                'contacts',
                'privateChats',
            ]),
            unreadMessagesNumber() {
                let number = 0;
                for (const room of Object.keys(this.privateChats)) {
                    const pr = this.privateChats[room];
                    if (pr && pr.unreadMessagesNumber) {
                        number += pr.unreadMessagesNumber;
                    }
                }
                return number;
            },
            getUnreadMessagesNumber() {
                return this.unreadMessagesNumber > 0 ? this.unreadMessagesNumber : '';
            }
        },
        methods: {
            ...mapMutations([
                'setContactsActiveTab',
                'setCurrentContactUuid',
            ]),
            openMessages(contactUuid) {
                this.setCurrentContactUuid(contactUuid);
                this.setContactsActiveTab(1);
            },
            openChatsList() {
                this.setCurrentContactUuid(null);
                this.setContactsActiveTab(1);
            },
        },
    };
</script>

<style scoped lang="scss">
    .contacts-widget {
        //display: flex;
        //flex-flow: column;
        flex: 1 1 auto;
        height: calc(100% - 40px);
        overflow: hidden;
        .tabs {
            flex: 0 1 auto;
            display: flex;
            padding: 0 40px 10px 40px;
            text-align: left;

            &__item {
                color: #8D8B8B;
                /*-webkit-text-stroke: 0.3px black;*/
                font-size: 19px;
                font-weight: 500;
                text-decoration: none;

                &.active {
                    color: #fff;
                    /*-webkit-text-stroke-width: 0;*/
                }
            }
        }

        .contacts-tab {
            margin-right: auto;
        }

        .chat-tab {
            margin: 0 12px;
        }

        .messages-tab {
            margin-left: auto;
        }

        .content {
            //display: flex;
            //flex-flow: column;
            //flex: 1 1 auto;
            min-height: 100px;
            margin: 0 22px;
            height: inherit;
        }
    }

    @media all and (max-width: 1720px) {
        .contacts-widget {
            .tabs {
                padding: 0 22px 6px 22px;

                &__item {
                    font-size: 18px;
                }
            }

            .content {
                margin: 0 19px;
            }
        }
    }

    @media all and (max-width: 1600px) {
        .contacts-widget {
            padding-top: 15px;
            .tabs {
                padding-left: 19px;
                padding-right: 15px;

                &__item {
                    font-size: 16px;
                }
            }

            .contacts-tab {
                order: 1;
            }

            .messages-tab {
                order: 2;
                margin: 0 8px;
            }

            .chat-tab {
                order: 3;
                margin-left: auto;
                margin-right: 0;
            }

            &__chat {
                margin: 5px 0 0;

                &::v-deep {
                    .chat-title {
                        display: none;
                    }

                    .message-list {
                        top: 0;
                    }

                    .input-area {
                        //bottom: 20px;
                    }
                }
            }

            .content {
                margin-left: 15px;
                margin-right: 13px;
            }
        }
    }
</style>
