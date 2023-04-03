export default {
    state: {
        customGamesSearchResults: [],
        standardGameSearchTime: null,
        standardGameSearch: 0,
        standardGameSearchOptions: {
            players: [5]
        },
        gamesSpectator: [],
    },
    getters: {
        customGamesSearchResults(state) {
            return state.customGamesSearchResults;
        },
        standardGameSearchOptions(state) {
            return state.standardGameSearchOptions;
        },
        standardGameSearch(state) {
            return state.standardGameSearch;
        },
        standardGameSearchTime(state) {
            return state.standardGameSearchTime;
        },

        getGamesSpectator(state) {
            return state.gamesSpectator;
        },

    },
    mutations: {
        standardGameSearchOptions(state, options) {
            state.standardGameSearchOptions = options;
        },
        standardGameSearch(state, status) {
            state.standardGameSearch = status;
        },
        standardGameSearchTime(state, time) {
            state.standardGameSearchTime = time;
        },
        customGamesSearchResults(state, items) {
            state.customGamesSearchResults = items;
        },
        updateSearchResults(state, lobby) {
            // найти в результатах поиска это лобби и обновить его данные
            const items = [];
            for (const item of state.customGamesSearchResults) {
                if (item.creator_uuid === lobby.creator_uuid) {
                    items.push(lobby);
                } else {
                    items.push(item);
                }
            }
            state.customGamesSearchResults = items;
        },
        setGamesSpectator(state, items) {
            state.gamesSpectator = items;
        },
    },
    actions: {
        clearStandardGameSearchOptions({commit}){
            commit('standardGameSearchOptions', {
                players: [5]
            })
        },
        updateStandardGameSearchOptions({ commit }, values) {
            commit('standardGameSearchOptions', values);
        },
        updateStandardGameSearchTime({ commit }, time) {
            commit('standardGameSearchTime', time);
        },
        // REQUESTS
        startStandardGameSearch(context) {
            const options = context.state.standardGameSearchOptions;
            return new Promise(resolve => {
                this.$app.$socket.client.emit('start_standard_game_search', options, (responseData) => {
                    if (!responseData.error) {
                        context.commit('standardGameSearch', responseData.status);
                        context.commit('standardGameSearchTime', responseData.time);
                        if (responseData.lobby) {
                            context.commit('gameLobbyCreator', 0);
                            context.commit('gameLobbyDetails', responseData.lobby);
                        }
                    }
                    resolve(responseData);
                });
            });
        },
        stopStandardGameSearch(context) {
            return new Promise(resolve => {
                this.$app.$socket.client.emit('stop_standard_game_search', true, (responseData) => {
                    if (!responseData.error) {
                        context.commit('standardGameSearch', responseData.status);
                        context.commit('standardGameSearchTime', responseData.time);
                    }
                    resolve(responseData);
                });
            });
        },
        refreshCustomGamesSearch({ commit }) {
            return new Promise(resolve => {
                this.$app.$socket.client.emit('search_custom_games', true, (responseData) => {
                    if (!responseData.error) {
                        commit('customGamesSearchResults', responseData.games);
                    }
                    resolve(responseData);
                });
            });
        },
        joinToGameLobby(context, creator_uuid) {
            return new Promise((resolve) => {
                this.$app.$socket.client.emit('join_gamelobby', { creator_uuid }, (responseData) => {
                    resolve(responseData);
                });
            });
        },
        // RESPONSES
        // сбрасывает статус поиска игры по запросу с сервера (игра найдена)
        SOCKET_UPDATE_SEARCH_STANDARD_GAME({ commit }, queue) {
            commit('standardGameSearchTime', queue.time);
            commit('standardGameSearch', queue.status);
            commit('standardGameSearchOptions', queue.searchOpt)
            if (queue.redirectToLobby) {
                this.$app.$router.push('/play/new-game');
            }
        },
        // обновление списка custom игр (lobby) в выдаче пользователей
        SOCKET_UPDATE_SEARCH_CUSTOM_GAMES({ commit }, games) {
            commit('customGamesSearchResults', games);
        },
        // обновленная информация о каком-то одном lobby в поиске игр
        SOCKET_UPDATED_GAME_LOBBY({ commit }, lobby) {
            commit('updateSearchResults', lobby);
        },

        // Список игр для просмотра
        // SOCKET_GAME_WATCH_LIST({commit}, payload){
        //     commit('setGamesSpectator', payload)
        // },

        //TODO Удалить
        gamesSearchSpectator({ commit }) {
            return new Promise(resolve => {
                this.$app.$socket.client.emit('games_spectator',  {
                    gameUuid: 123, numberPlayers: 2, options: []
                }, (responseData) => {
                    if (!responseData.error) {
                        commit('setGamesSpectator', responseData.games);
                    }
                    resolve(responseData);
                });
            });
        },
    }
};
