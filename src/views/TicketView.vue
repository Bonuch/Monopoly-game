<template>
    <div class="ticket">
        <h1 class="ticket__title">Техническая поддержка</h1>
<!--        <ticket-form></ticket-form>-->
        <div class="messenger">
            <div class="messenger__contact__list">
                <div class="contact__list__wrapper">
                    <private-chats-list></private-chats-list>
                </div>

            </div>
            <div class="messenger__contact__messages">
                <div class="message__list__wrapper">
                    <private-chat v-if="chat"></private-chat>
                    <div v-else class="blank__messages">
                        <h2>выберете чат</h2>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import PrivateChat from "@/components/contacts-widget/PrivateChat";
import PrivateChatsList from "@/components/contacts-widget/PrivateChatsList";
import { mapGetters, mapMutations } from "vuex";
// import PrivateChatsList from "../components/contacts-widget/PrivateChatsList";
// import TicketForm from "@/components/bugreports/TicketForm";

export default {
    components: { PrivateChatsList, PrivateChat },
    name: "TicketView",
    computed: {
        ...mapGetters([
            "currentContactUuid",
            "contactsActiveTab",
            "currentUser",
            "contactsNumber",
            "contacts",
            "privateChats",
        ]),
        chat() {
            return this.privateChats[this.currentContactUuid] || null;
        },
    },
    methods: {
        ...mapMutations([
            "setContactsActiveTab",
            "setCurrentContactUuid",
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
* {
    box-sizing: border-box;
}
.ticket {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--color-white);
    &__title {
        text-align: center;
        width: 100%;
    }
}
.messenger {
    display: flex;
    height: calc(100vh - 240px);
    width: 90%;
    background: var(--color-background-2);
    border-radius: 7px;
    &__contact__list {
        flex: .3;
    }
    &__contact__messages {
        flex: .7;
    }
}
.contact__list__wrapper {
    border-radius: 7px 0px 0px 7px;
    padding: 15px;
    background: darken(#323639, 5);
    height: 100%;
}
.message__list__wrapper {
    border-radius: 7px 0px 0px 7px;
    //background: darken(#323639, 5);
    height: 100%;
}

.blank__messages {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

::v-deep {
    .chats-list {
        width: 100%;
        .search {
            input {
                font-size: 14px;
            }
        }
        .contact {
            .image {
                width: 50px !important;
            }
        }
    }
    .private-chat {
        //padding: 5px 15px 15px 15px;
        //width: 100%;
        .contact {
            padding: 5px 15px;
            background: darken(#323639, 4);
        }
        .input-area {
            padding: 0 15px;
            .input {
                font-size: 14px;
            }
        }
        .messages {
            padding: 15px 0px 15px 15px;
            .message {
                margin-left: 0px;
            }
        }
    }
    .divider {
        display: none;
    }
    .messages {
    }
}
</style>
