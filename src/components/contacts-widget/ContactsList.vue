<template>
    <div class="contacts-list" ref="test">
        <div class="search">
            <input type="text" v-model="searchText" :placeholder="$t('CONTACTS.Поиск контактов')"/>
            <a href="#" @click.prevent="searchText = ''" class="clear" v-if="searchText"></a>
        </div>

        <div
            v-if="contactsNumber && contactsNumber === 0 && contactsLoading === false"
            class="info"
        >
            {{ $t('CONTACTS.У Вас пока нет контактов') }}
        </div>

        <div v-if="contactsNumber && contactsNumber === 0 && contactsLoading === true" class="info">
            {{ $t('CONTACTS.загрузка') }}
        </div>

        <div
            v-if="contacts"
            class="list"
            ref="contacts_list"
        >

                    <router-link
                        class="contact"
                        v-for="contact of filteredContacts"
                        :data-uuid="contact.uuid"
                        :key="contact.uuid"
                        :to="{ name: 'user', params: { useruuid: contact.uuid } }"
                    >
                        <div class="contact__left">
                            <div class="image">
                                <img :src="contact.avatar_url || '/design/demo/profiles/unknown.png'" :alt="contact.fullname"/>
                                <span class="status" :class="contact._status"></span>
                            </div>

                            <div class="content">
                                <div class="name">
                                    {{ contact.fullname | truncate(10) }}
                                </div>
                                <div class="status-text">{{contact._status === 'offline' ? contact._last_activity :
                                    (contact._in_a_game ? 'В игре' : '')}}
                                </div>
                            </div>
                        </div>


                        <div class="contact__buttons buttons">
                            <router-link class="open-profile" :title="$t('CONTACTS.Открыть профайл')" :to="{ name: 'user', params: { useruuid: contact.uuid } }">
                            </router-link>
                            <a class="invite"
                               :title="$t('CONTACTS.Пригласить в игру')"
                               v-if="!!gameLobbyCreator && contact._status !== 'offline' && !contact._in_a_game"
                               href="#"
                               @click.prevent="sendInvite(contact.uuid)">
                            </a>
                            <a class="messages" :title="$t('CONTACTS.Открыть диалог')" href="#" @click.prevent="openMessages(contact.uuid)"></a>
                        </div>
                    </router-link>

        </div>
    </div>
</template>

<script>
    import { truncate } from '@/helpers/text';
    import MainMixin from '@/mixins/main-mixin';
    import { mapGetters, mapActions } from 'vuex';
    import BaseScrollbar from "../base/BaseScrollbar";

    export default {
        name: 'ContactsList',
        components: {BaseScrollbar},
        mixins: [ MainMixin ],
        filters: {
            truncate,
        },
        data() {
            return {
                listHeight: null,
                searchText: '',
            };
        },
        computed: {
            ...mapGetters([
                'gameLobbyCreator',
                'contactsLoading',
                'contacts',
                'contactsNumber',
                'currentUser',
            ]),
            filteredContacts() {
                if (this.searchText && this.searchText.split(' ').join('') !== '') {
                    const result = [];

                    for (const contact of this.contacts) {
                        if (contact.fullname.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0) {
                            result.push(contact);
                        }
                    }
                    return result;
                }
                return this.contacts;
            },
        },
        methods: {
            ...mapActions([
                'inviteUserToGame',
            ]),
            openMessages(contactUuid) {
                this.$parent.openMessages(contactUuid);
            },
            sendInvite(contactUuid) {
                this.inviteUserToGame(contactUuid).then(response => {
                    this.$dialog.alert(response.error || response.message);
                });
            },
        },
    }
</script>

<style scoped lang="scss">
    .contacts-list {
        //flex: 1 1 auto;
        //position: relative;
        min-height: 100px;
        //max-height: 100vh;
        height: inherit;
        text-align: left;
        margin-bottom: 20px;

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
                background: url(/design/icons/close-dark.svg) no-repeat center center;
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
            //padding-top: 10px;
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
                position: relative;
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                text-align: left;
                text-decoration: none;

                &__left {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    margin-right: 15px;
                }

                &__buttons {
                    flex: 0 1 auto;
                    align-items: center;
                    margin-left: auto;
                }

                .image {
                    position: relative;
                    width: 60px;
                    margin-right: 7px;
                    a {
                        display: inline-block;
                    }
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
                    .status-text {
                        color: #8D8B8B;
                        font-size: 15px;
                        font-weight: 500;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }


                .buttons {
                    opacity: 0;
                    flex: 0 1 50px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding: 0 10px;
                    transition: 300ms;

                    a {
                        width: 22px;
                        height: 22px;
                        background-repeat: no-repeat;
                        background-position: center;
                        margin-right: 10px;
                    }

                    .open-profile {
                        background-image: url("/design/icons/profile-pic.svg");
                    }

                    .invite {
                        background-image: url("/design/icons/invite.svg");
                    }

                    .messages {
                        background-image: url("/design/icons/send.svg");
                        margin-right: 0;
                    }
                }
                &:hover .buttons {
                    opacity: 1;
                }
            }
        }
    }

    @media all and (max-width: 1440px) {
        .contacts-list {
            &__buttons {
                opacity: 1;
            }
        }
    }
</style>
