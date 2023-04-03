import moment from 'moment';
import axios from "axios";

export default {
    state: {
        gameStarting: false,
        startingCountdown: 10,
        gameLobbyWidget: 0,
        gameWeeklyMutation: {},
        gameLobbyCreator: 0, // я создал игру
        gameLobbyDetails: null,
        // Example_gameLobbyDetails: {
        //     "creator_uuid": "efed3e8c-d5f0-4353-a0d0-df04e4cf16aa",
        //     "players": [{"id": 2, "uuid": "efed3e8c-d5f0-4353-a0d0-df04e4cf16aa", "fullname": "Test 2", "avatar": "https://..."}, {/*...*/}],
        //     "inviteOnly": false,
        //     "playersNumber": 5,
        //     "options": ["leniency", "sale", "takeover", "firstmoveright"],
        //     "created_at": "2019-09-23T14:39:38.428Z",
        //      "countdown": false || "2019-09-23T14:39:38.428Z",
        // },
    },
    getters: {
        startingCountdown(state) {
            return state.startingCountdown;
        },
        gameStarting(state) {
            return state.gameStarting;
        },
        gameLobbyWidget(state) {
            return state.gameLobbyWidget;
        },
        gameWeeklyMutation(state) {
            return state.gameWeeklyMutation;
        },
        gameLobbyCreator(state) {
            return state.gameLobbyCreator;
        },
        gameLobbyDetails(state) {
            return state.gameLobbyDetails;
        },
    },
    mutations: {
        setStartingCountdown(state, timeout) {
            state.startingCountdown = timeout;
        },
        setGameStarting(state, status) {
            state.gameStarting = status;
        },
        setGameLobbyWidget(state, status) {
            state.gameLobbyWidget = status;
        },
        updateWeeklyMutations(state, mutations) {
            state.gameWeeklyMutation = mutations;
        },
        gameLobbyCreator(state, status) {
            state.gameLobbyCreator = status;
        },
        gameLobbyDetails(state, details) {
            state.gameLobbyDetails = details;
        },
        leaveTheGameLobby(state, uuid) {
            // проверить, что текущий uuid совпадает с покидаемым
            if (state.gameLobbyDetails.creator_uuid === uuid) {
                state.gameLobbyCreator = 0;
                state.gameLobbyDetails = null;
                state.gameStarting = false;
                state.startingCountdown = 10;
            }
        }
    },
    actions: {
        setGameLobbyWidget({commit}, status) {
            commit('setGameLobbyWidget', status);
        },

        // REQUESTS
        getWeeklyMutations({ commit }, data = {}) {
            this.$app.$socket.client.emit('game_weekly_mutations', data, (mutations) => {
                commit('updateWeeklyMutations', mutations);
            });
        },
        startCreateGame({ commit }, gameOptions) {
            return new Promise(resolve => {
                this.$app.$socket.client.emit('create_gamelobby', gameOptions, (response) => {
                    if (!response.error) {
                        commit('gameLobbyCreator', 1);
                        commit('gameLobbyDetails', response);
                    }
                    resolve(response);
                });
            });
        },
        cancelCreateGame({ commit }) {
            this.$app.$socket.client.emit('cancel_gamelobby', {}, _ => {
                commit('gameLobbyCreator', 0);
                commit('gameLobbyDetails', null);
            });
        },
        excludePlayer({ commit }, uuid) {
            return new Promise(resolve => {
                this.$app.$socket.client.emit('exclude_from_gamelobby', {player_uuid: uuid}, (response) => {
                    resolve(response);
                });
            });
        },
        leaveGameLobby({ commit }) {
            return new Promise(resolve => {
                this.$app.$socket.client.emit('leave_gamelobby', {}, (response) => {
                    if (!response.error) {
                        commit('gameLobbyCreator', 0);
                        commit('gameLobbyDetails', null);
                        commit('setGameStarting', false);
                    }
                    resolve(response);
                });
            });
        },
        inviteUserToGame({ commit }, uuid) {
            return new Promise(resolve => {
                this.$app.$socket.client.emit('invite_to_gamelobby', { user_uuid: uuid }, (response) => {
                    resolve(response);
                });
            });
        },

        // RESPONSES
        // присылает данные game lobby при подключении к сокету
        SOCKET_CURRENT_GAME_LOBBY({ commit }, payload) {
            commit('gameLobbyDetails', payload.currentGameLobby);
            commit('gameLobbyCreator', payload.creator);
        },
        // оповещение об изменении публичной игры (game lobby), чтобы обновить у пользователей в результатах поиска
        SOCKET_UPDATE_GAME_LOBBY({ commit, getters }, payload) {
            commit('gameLobbyDetails', payload);
            // обратный отсчет игры
            if (payload && payload.countdown) {
                commit('setStartingCountdown', payload.countdown);
                commit('setGameStarting', true);
            } else {
                commit('setGameStarting', false);
                commit('setStartingCountdown', 10);
            }
            if (payload) {
                if (getters.currentUser.uuid === payload.creator_uuid) {
                    commit('gameLobbyCreator', 1);
                } else {
                    commit('gameLobbyCreator', 0);
                }
                commit('standardGameSearch', 0);
                commit('standardGameSearchTime', null);
                if (this.$app.$router.history.current.path !== '/play/new-game') {
                    this.$app.$router.push('/play/new-game');
                }
            }
        },
        SOCKET_LEAVE_LOBBY({ commit }, lobbyUuid) {
            commit('leaveTheGameLobby', lobbyUuid);
        },
    }
};
