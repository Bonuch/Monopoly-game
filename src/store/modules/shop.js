export default {
    state: {
        shopItems: [],
        openedDice: null,
        diceModalOpen: null,
    },
    getters: {
        shopItems(state) {
            return state.shopItems
        },
        openedDice(state) {
            return state.openedDice
        }
    },
    mutations: {
        setShopItems(state, items) {
            state.shopItems = items
        },
        setOpenedDice(state, item) {
            state.openedDice = item
        }
    },
    actions: {
        shopLoadItems({ commit }, type) {
            this.$app.$socket.client.emit('shop_load_items', type, (result) => {
                if (!result.error && result.items) {
                    commit('setShopItems', result.items);
                }
            });
        },
        shopBuyItem({ commit }, { item, price_type }) {
            return new Promise(resolve => {
                this.$app.$socket.client.emit('shop_buy_item', item, price_type, (response) => {
                    resolve(response);
                })
            })
        },
        async loadDiceModel({commit, getters}, item) {
            console.log('00000000000000000', item);
            this.$app.$socket.client.emit('load_dice_model', item, (response) => {
                if (!response.error && response) {
                    console.log('000000000000', response);
                    commit('setOpenedDice', response);
                }
            });
        }
    }
};
