
export default {
    state: {
        maninhat: false,
        boost: false,
        block: false,
        freedomForPlayer: false,
        monopoly_id: null,
        revision: false,
        revision_type: null,
    },
    getters: {
        maninhatState(state) {
            return state;
        },
    },
    mutations: {
        setManinhat(state, payload) {
            state.maninhat = payload;
        },
        setManinhatBoost(state, payload) {
            state.boost = payload;
        },
        setManinhatBlock(state, payload) {
            state.block = payload;
        },
        setManinhatFreedomForPlayer(state, payload) {
            state.freedomForPlayer = payload;
        },
        setManinhatMonopolyId(state, payload) {
            state.monopoly_id = payload;
        },
        setManinhatRevision(state, payload) {
            state.revision = payload;
        },
        setManinhatRevisionType(state, payload) {
            state.revision_type = payload;
        },
        clearManinhatState(state) {
            state.maninhat = false;
            state.boost = false;
            state.block = false;
            state.freedomForPlayer = false;
            state.monopoly_id = null;
            state.revision = false;
            state.revision_type = null;
            state.revision_id = null;
        },
    },
    actions: {

    },

};
