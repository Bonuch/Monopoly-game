export default {
    state: {
        currentGameUuid: null,
        gameStore: null,
        gameCells: null,
        gameCellsMap: null,
        gameMonopoliesMap: null,
        gamePlayers: null,
        gameDice: null,
        playersCells: [],
        deadline: null,
        gameLoser: null,
        gameModalName: null, // имя игрового модального окна
        playerCardHovered: null,
        blur: null, // блур в игровой доске
        throwParam: null,
        testThrowBlock: false,
    },
    getters: {
        currentGameUuid(state) {
            return state.currentGameUuid;
        },
        gameStore(state) {
            return state.gameStore;
        },
        gameCells(state) {
            return state.gameCells;
        },
        gamePlayers(state) {
            return state.gamePlayers;
        },
        gameDice(state) {
            return state.gameDice;
        },
        playersCells(state) {
            return state.playersCells;
        },
        deadline(state) {
            return state.deadline;
        },
        getCellById: (state) => (id) => {
            return state.gameCellsMap[id];
        },
        getPlayerById: (state) => (uuid) => {
            return state.gamePlayers.find(player => player.uuid == uuid);
        },
        getCellsByMonopolyId: (state) => (monopolyGroupId) => {
            return state.gameMonopoliesMap[monopolyGroupId] || [];
        },
        getGameLoser(state) {
            return state.gameLoser;
        },
        getPlayerCardHovered(state) {
            return state.playerCardHovered;
        },
        getGameModalName(state) {
            return state.gameModalName;
        },
        getBlur(state) {
            return state.blur;
        },
        getThrowParam(state) {
            return state.throwParam
        }
    },
    mutations: {
        setTestThrowBlock(state, data) {
            state.testThrowBlock = data
        },
        currentGameUuid(state, currentGameUuid) {
            state.currentGameUuid = currentGameUuid;
        },
        setGameStore(state, payload) {
            state.gameStore = payload;
        },
        setDefaultGameCells(state, cells) {
            state.gameCells = cells
            state.gameMonopoliesMap = cells
            state.gameCellsMap = cells
        },
        setGameCells(state, cells) {
            state.gameCells = cells;
            const cellsMap = {};
            const gameMonopoliesMap = {};
            for (const cell of state.gameCells) {
                cellsMap[cell.id] = cell;
                if (typeof (cell.group_id) !== 'undefined') {
                    if (!gameMonopoliesMap[cell.group_id]) {
                        gameMonopoliesMap[cell.group_id] = [];
                    }
                    gameMonopoliesMap[cell.group_id].push(cell);
                }
            }
            state.gameCellsMap = cellsMap;
            state.gameMonopoliesMap = gameMonopoliesMap;
        },
        setGamePlayers(state, payload) {
            state.gamePlayers = payload;
        },
        setGameDice(state, value) {
            state.gameDice = value;
        },
        playersCells(state, payload) {
            state.playersCells = [];
        },
        setGameLoser(state, value) {
            state.gameLoser = value;
        },
        setPlayerCellStore(state, payload) {
            state.playersCells.push(payload);
        },
        updatePlayerCellStore(state, payload) {
            state.playersCells.map(player => {
                if (player.playerUuid == payload.playerUuid) {
                    player.celsId = payload.celsId;
                }
                return player;
            });
        },
        setDeadline(state, payload) {
            state.deadline = payload;
        },
        updateDeadline(state, payload) {
            state.deadline = state.deadline - 1;
        },
        setPlayerCardHovered(state, hover) {
            state.playerCardHovered = hover;
        },
        setGameModalName(state, name) {
            state.gameModalName = name;
        },
        setBlur(state, blur) {
            return state.blur = blur;
        },
        setThrowParam(state, param) {
            // state.throwParam = param
            state.throwParam = {
                modelPos: param.model_pos,
                quaternion: param.quaternion,
                velocity: param.velocity,
                angularVelocity: param.angular_velocity,
            }
        }
    },
    actions: {
        updateCurrentGameUuid({commit}, currentGameUuid) {
            commit('currentGameUuid', currentGameUuid);
        },
        //todo Уждалить перед продом
        // ---------------------------------------------------------
        throwDicesTesting({state, commit}, cellId) { // todo disable for production
            if (!state.testThrowBlock) {
                commit('setTestThrowBlock', true)
                this.$app.$socket.client.emit('game_throw_dices', {cellId}, (response) => {
                    commit('setTestThrowBlock', false)
                    if (response.error) this.$app.$dialog.alert(response.error); // TODO переделать
                })
            }
        },
        // ---------------------------------------------------------
        sendGameAction({commit}, {route, params = {}}) {
            this.$app.$socket.client.emit(route, params, (response) => {
                if (response.error) this.$app.$dialog.alert(response.error); // TODO переделать
            });
        },
        SOCKET_GAME_START({commit}, payload) {
            commit('currentGameUuid', payload.gameUuid);
            commit('setGameStore', payload.state);
            commit('setGameCells', payload.cells);
            commit('setGamePlayers', payload.players);
            commit('setDeadline', payload.deadline);
            commit('playersCells', []);
            if (this.$app.$router.history.current.path !== `/game/${payload.gameUuid}`) {
                this.$app.$router.push('/game/' + payload.gameUuid);
            }
            commit('setStartingCountdown', false);
        },
        SOCKET_CURRENT_GAME_STATE({commit}, payload) {
            commit('currentGameUuid', payload.gameUuid);
            commit('setGameStore', payload.state);
            commit('setGameCells', payload.cells);
            commit('setGamePlayers', payload.players);
            commit('setDeadline', payload.deadline);
            if (this.$app.$router.history.current.path !== `/game/${payload.gameUuid}`) {
                this.$app.$router.push('/game/' + payload.gameUuid);
            }
        },
        SOCKET_UPDATE_GAME_STATE({commit}, payload) {
            if (payload.state) commit('setGameStore', payload.state);
            if (payload.cells) commit('setGameCells', payload.cells);
            if (payload.players) commit('setGamePlayers', payload.players);
            if (payload.deadline) commit('setDeadline', payload.deadline);
            if (payload.dice) commit('setGameDice', payload.dice);
            if (payload.throwParam) commit('setThrowParam', payload.throwParam);

        },
        SOCKET_GAME_START_FAILED({commit}) {
            // commit('setGameStarting', false);
        },

        SOCKET_GAME_LOSER({commit}, payload) {
            commit('setGameLoser', payload);
            commit('currentGameUuid', null);
            // commit('setGameStarting', false);
        },
        SOCKET_REMOVE_GAME({commit}) {
            commit('currentGameUuid', null);
            // commit('setGameStarting', false);
            commit('setGameStore', null);
            commit('setDefaultGameCells', null);
            commit('setGamePlayers', null);
            commit('setGameDice', null);
            commit('setDeadline', null);
            commit('setGameLoser', null);
            this.$app.$router.push({name: 'play'})
        },
    },

};
