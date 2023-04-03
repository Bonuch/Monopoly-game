

export default {
    state: {
        gameMessages: [],
        gameChatParticipants: []
    },
    getters: {
        gameMessages(state) {
            return state.gameMessages
        },
        gameChatParticipants(state) {
            return state.gameChatParticipants
        }
    },
    mutations: {
        addGameMessage(state, message) {
            state.gameMessages.push(message)
        },
        setGameChatHistory(state, history) {
            state.gameMessages = history;
        }
    },
    actions: {
        SOCKET_NEW_GAME_MESSAGE({ commit }, message) {
            commit('addGameMessage', message);
        },
        SOCKET_SET_MUTE_USER({ commit }, playerUuid) {
            commit('setMuteUser', playerUuid);
        },
        sendGameMessage({ commit }, payload) {
            this.$app.$socket.client.emit('game_chat_send_message', payload, (result) => {
                // nothing needed here
            });
        },
        loadGameChatHistory({ commit }, payload) {
            this.$app.$socket.client.emit('game_chat_load_history', payload, (result) => {
                if (!result.error && result.history) {
                    commit('setGameChatHistory', result.history);
                }
            });
        }
    }
};
