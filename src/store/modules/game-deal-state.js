
export default {
    state: {
        opened: false,
        userId: null,
        offerConditions: {
            items: [],
            amount: 0,
        },
        requestConditions: {
            items: [],
            amount: 0,
        }
    },
    getters: {
        dealState(state) {
            return state;
        },
        isDealOpen(state) {
            return state.opened
        }
    },
    mutations: {
        setDealOpen(state, payload) {
            state.opened = payload;
        },
        setDealUserId(state, payload) {
            state.userId = payload;
        },
        clearDeal(state) {
            state.userId = false;
            state.offerConditions.items = [];
            state.offerConditions.amount = 0;
            state.requestConditions.items = [];
            state.requestConditions.amount = 0;
        },
        toggleDealOfferItems(state, cellId) {
            let index = state.offerConditions.items.indexOf(cellId);
            if (index === -1) {
                state.offerConditions.items.push(cellId);
            } else {
                state.offerConditions.items.splice(index, 1);
            }
        },
        toggleDealRequestItems(state, cellId) {
            let index = state.requestConditions.items.indexOf(cellId);
            if (index === -1) {
                state.requestConditions.items.push(cellId);
            } else {
                state.requestConditions.items.splice(index, 1);
            }
        },
        updateOfferAmount(state, amount) {
            state.offerConditions.amount = amount;
        },
        updateRequestAmount(state, amount) {
            state.requestConditions.amount = amount;
        }

    },
    actions: {

    },

};
