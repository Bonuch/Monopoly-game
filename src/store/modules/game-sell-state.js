
export default {
    state: {
        opened: false,
        sellItems: [],
        buyItems: [],
    },
    getters: {
        sellState(state) {
            return state;
        },
        isSellOpened(state) {
            return state.opened
        }
    },
    mutations: {
        setSellOpen(state, payload) {
            state.opened = payload;
        },
        clearSell(state) {
            state.userId = false;
            state.sellItems = [],
            state.buyItems = []
        },
        toggleSellSellItems(state, cellId) {
            let index = state.sellItems.indexOf(cellId);
            if (index === -1) {
                state.sellItems.push(cellId);
            } else {
                state.sellItems.splice(index, 1);
            }
        },
        toggleSellBuyItems(state, cellId) {
            let index = state.buyItems.indexOf(cellId);
            if (index === -1) {
                state.buyItems.push(cellId);
            } else {
                state.buyItems.splice(index, 1);
            }
        },
    },
    actions: {

    },

};
