export default {
    state: {
        gameList: [],
        playersNumber: [],
        mutations: [],
        filters: {
            playersNumber: [],
            isAnyPlayers: false,
        },
        updateMark: false,
        newGames: [],
        // test: "empty",
    },
    getters: {
        getGamesList(state) {
            return state.gameList
        },
        isWatchList(state) {
            return state.updateMark
        },
        getUpdateMark(state) {
            return state.updateMark
        },
        getNewGames(state) {
            return state.newGames
        },
        getFilters(state) {
            return state.filters
        },
        getFilterPlayers(state){
            return state.playersNumber
        },
        getFilterIsAny(state){
            return state.filters.isAnyPlayers
        },
        getMutations(state){
            return state.mutations
        }
    },
    mutations: {
        setGamesList(state, payload) {
            state.gameList = payload
        },
        setGameOnline(state, data) {
            state.updateMark = data
        },
        setUpdateMark(state, data) {
            state.updateMark = data
        },
        setNewGames(state, data) {
            state.newGames.push(data.new_game_uuid)
        },
        setClearNewGames(state) {
            state.newGames = []
        },
        setFilters(state, data) {
            state.filters = data
        },
        setPlayers(state, data){
            state.playersNumber = data
        },
        setFilterIsAny(state, data){
            state.filters.isAnyPlayers = data
        },
        setMutations(state, data){
            state.mutations = data
        }
    },
    // TODO добавить в стейт фильтры к-во игроков и передавать в запрос
    // TODO вызов апдейта при удалении игры
    actions: {
        SOCKET_UPDATE_GAME_LIST({state, dispatch, commit}, data) {
            commit('setUpdateMark', data.updated)
            // проверить роут
            // переимениовать роут
            // есои роут == страница просмотров то вызываем getWatchList() с параметрам если не равен то ничего не делать
            // console.log(`ROUTER PATH: ${this.$app.$route.name}`)
            if (this.$app.$route.name === 'watch') {
                dispatch('getWatchList')
            }
            // commit('setNewGames', data.new_game_uuid)
        },
        getWatchList({state, commit}) {
            // console.log(`ROUTER PATH: ${this.$app.$route.name === 'watch'}`)
            return new Promise(resolve => {
                // TODO опции
                this.$app.$socket.client.emit('games_list', {
                    numberPlayers: state.playersNumber,
                    mutations: state.mutations.map(el => el.toLowerCase()).sort(),
                }, (responseData) => {
                    if (!responseData.error) {
                        commit('setGamesList', responseData.games);
                    }
                    resolve(responseData);
                });
            });
        },
    }
}
