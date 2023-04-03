import axios from '@/helpers/axios-instance';

//TODO REFACTOR

export default {
    state: {
        messages: [],
        chatParticipants: [],
        haveNewMessage: true,
    },
    getters: {
        messages(state) {
            // console.log("Message", state.messages)
            return state.messages
        },
        chatParticipants(state) {
            // console.log("CHAT PARTICIPANT", state.chatParticipants)
            return state.chatParticipants
        },
        haveNewMessage(state) {
            return state.haveNewMessage
        }
    },
    mutations: {
        sendMessage(state, message) {
            state.messages.push(message)
        },
        setHaveNewMessage (state, data) {
            state.haveNewMessage = data
        },
        removeMessage(state, uuid) {
            state.messages = state.messages.filter((message) => {
                if(message.uuid != uuid) {
                    return message;
                }
            });
        },
        //TODO обновлять список при регистрации новых пользователей, изменения никнеймов пользователей
        setChatParticipants(state, users) {
            state.chatParticipants = users
        },
        setChatHistory(state, messages) {
            // console.log(messages)
            let messagesFormatted = messages.map((message) => {
                let messageFormatted =  {
                    uuid: message.uuid,
                    type: message.type,
                    author: message.AuthorId || message.author,
                    user: {
                        author_id: message.user?.author_id || message.Author.uuid || null,
                        nickName: message.user?.nickName || message.Author.fullname || "unknown",
                        avatar: message.user?.avatar || message.Author.avatar_url || "unknown",
                    },
                    date: message.createdAt || message.date,
                    data: {
                        // type: message.type,
                        text: message.message || message.data.text
                    }
                };
                if (message.type == "emoji") {
                    messageFormatted.data['emoji'] = message.message || message.data.text
                }
                // messageFormatted.data[message.type] = message.type;
                // console.log("FORMATED", messageFormatted)
                return messageFormatted;
            });
            // console.log("FORMATED MESSAGES", messagesFormatted)
            state.messages = messagesFormatted;
        }
    },
    actions: {
        SOCKET_SEND_MESSAGE(context, message) {
            // console.log("MSGS FROM:", message)
            context.commit('sendMessage', message)
        },
        SOCKET_REMOVE_MESSAGE(context, uuid) {
            context.commit('removeMessage', uuid)
        },
        SOCKET_SET_MUTE_USER(context) {
            context.commit('setMuteUser')
        },
        setChatParticipants(context) {
            // this.$app.$socket.client.emit('common_chat_users_list', {}, response => {
            //     context.commit('setChatParticipants', response.users);
            // });
        },
        setChatHistory(context) {
            return new Promise(resolve => {
                this.$app.$socket.client.emit('common_chat_messages_list', {}, (response) => {
                    if (response) {
                        context.commit('setChatHistory', response.messages);
                        if (response.messages.length < 20) {
                            context.commit("setHaveNewMessage", false)
                        }
                    }
                    return resolve(true);
                });
            });
        },
        /**
         * Подгрузка сообщений с ссрвера
         * @param {string} lastDate - date последнего сообшения
         */
        fetchOldCommonMessages({ commit, getters }, lastDate) {
            if (getters.haveNewMessage) {
                return new Promise(resolve => {
                    this.$app.$socket.client.emit('common_chat_load_old', lastDate, response => {
                        if (response.messages.length > 0 ) {
                            let tempArr = []
                            tempArr.push(...response.messages)
                            tempArr = tempArr.concat(getters.messages)
                            commit('setChatHistory', tempArr)
                            if (response.messages.length < 20) {
                                commit("setHaveNewMessage", false)
                            }
                        }
                    });
                    return resolve(true)
                })
            }
        },
    }
};
