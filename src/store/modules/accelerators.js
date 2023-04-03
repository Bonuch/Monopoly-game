// Contacts (friends)

export default {
    state: {
        acceleratorsToUse: {
            amount: null,
            duration: null,
            knowledge_id: null,
        },
        acceleratorsItems: null
    },
    getters: {
        getAcceleratorsToUse(state) {
            return state.acceleratorsToUse
        },
        getAcceleratorsShopItems(state) {
            return state.acceleratorsItems
        }

    },
    mutations: {
        setAcceleratorsToUse(state, accelerator) {
            state.acceleratorsToUse.amount = accelerator.amount
            state.acceleratorsToUse.duration = accelerator.duration
        },
        clearAcceleratorState(state) {
            state.acceleratorsToUse = {
                amount: null,
                duration: null,
                knowledge_id: null,
            }
        },
        clearShopItemState(state) {
            state.acceleratorsItems = null
        },
        setAcceleratorsItems(state, payload) {
            state.acceleratorsItems = payload
        }
    },
    actions: {
        async fetchAcceleratorItems({commit}) {
            await this.$app.$socket.client.emit('get_modal_available_accelerators', null, (response) => {
                if (response) {
                    commit('setAcceleratorsItems', response.accelerators)
                }
            });
        },
    }
};
