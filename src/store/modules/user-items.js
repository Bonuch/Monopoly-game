export default {
    state: {
        userItems: [],

    },
    getters: {
        userItems(state) {
            return state.userItems;
        },
        userItemsCount(state) {
            return state.userItems.length;
        },
    },
    mutations: {
        updateUserItems(state, items) {
            state.userItems = items;
        },
    },
    actions: {
        loadUserItems({ commit, getters }) {
            return new Promise((resolve, reject) => {
                this.$app.$socket.client.emit('get_user_items', getters.currentUser.user_id, (result) => {
                    if(result && result.error === false) {
                        commit('updateUserItems', result.items);
                        resolve();
                    } else if(result && result.error === true) {
                        reject(result.message);
                    }
                });
            });
        },
        openLootItem({ commit }, item)
        {
            return new Promise((resolve, reject) => {
                this.$app.$socket.client.emit('open_loot_item', item.id, (data) => {
                    if (data.error === false) {
                        resolve(data);
                    } else if (data && data.error === true){
                        // eslint-disable-next-line no-console
                        reject(result.message);
                    }
                });
            });
        },
    }
}
