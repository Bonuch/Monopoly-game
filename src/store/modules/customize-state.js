
export default {
    state: {
        brandCells: [],
        activeCellId: null,
        customImages: [],
        hoverImage: null,
        isNewCustomBrands: false,
        chips: [],
        isNewCustomChips: false,
        dice: [],
        isNewCustomDice: false,
    },
    getters: {
        getBrandCells(state) {
            return state.brandCells;
        },
        getBrandCellById: (state) => (id) => {
            return state.brandCells.find(cell => cell.id == id);
        },
        getActiveCellId(state) {
            return state.activeCellId;
        },
        getCustomImages(state) {
            return state.customImages;
        },
        getHoverImage(state) {
            return state.hoverImage;
        },
        getIsNewCustomBrands(state) {
            return state.isNewCustomBrands;
        },
        getChips(state) {
            return state.chips;
        },
        getIsNewCustomChips(state) {
            return state.isNewCustomChips;
        },
        getDice(state) {
            return state.dice;
        },
        getIsNewCustomDice(state) {
            return state.isNewCustomDice;
        },

        // getCellsByMonopolyId: (state) => (monopolyId) => {
        //     return state.gameCells.filter(cell => cell.group_id == monopolyId);
        // },
    },
    mutations: {
        setBrandCells(state, payload) {
            state.brandCells = payload;
        },
        setActiveCellId(state, payload) {
            state.activeCellId = payload;
        },
        setCustomImages(state, payload) {
            state.customImages = payload;
        },
        setHoverImage(state, payload) {
            state.hoverImage = payload;
        },
        setIsNewCustomBrands(state, payload) {
            state.isNewCustomBrands = payload;
        },
        setChips(state, payload) {
            state.chips = payload;
        },
        setIsNewCustomChips(state, payload) {
            state.isNewCustomChips = payload;
        },
        setDice(state, payload) {
            state.dice = payload;
        },
        setIsNewCustomDice(state, payload) {
            state.isNewCustomDice = payload;
        },
    },
    actions: {
        clearActiveCell({commit}, payload) {
            commit('setActiveCellId', null);
            commit('setCustomImages', []);
            commit('setHoverImage', null);
        },
        SOCKET_cells_for_customization({commit}, payload) {
            this.$app.$socket.client.emit('get_cells_for_customization', {}, (response) => {
                if (response.cells) {
                    commit('setBrandCells', response.cells);
                }
            });
        },
        SOCKET_CELL_CUSTOM_IMAGES({commit}, payload) {
            this.$app.$socket.client.emit('cell_custom_images', payload, (response) => {
                if (response.images) {
                    commit('setCustomImages', response.images);
                }
            });
        },
        SOCKET_SET_ACTIVE_IMAGE_CELL({commit}, payload) {
            this.$app.$socket.client.emit('set_active_image_cell', {cellId: payload.cellId, userImageId: payload.userImageId}, (response) => {
                if (response.cells) {
                    commit('setBrandCells', response.cells);
                    commit('setActiveCellId', null);
                    commit('setCustomImages', []);
                    commit('setHoverImage', null);
                }
            });
        },
        SOCKET_DELETE_NEW_MARK_BRANDS({commit}, payload) {
            this.$app.$socket.client.emit('delete_new_mark_brands', {userImageId: payload}, (response) => {
                if (response.cells) {
                    commit('setBrandCells', response.cells);
                }
            });
        },
        SOCKET_IS_NEW_CUSTOM_BRANDS({commit}, payload) {
            this.$app.$socket.client.emit('is_new_custom_brands', {},(response) => {
                if (response.result) {
                    commit('setIsNewCustomBrands', response.result);
                }
            });
        },
        SOCKET_UPDATE_IS_NEW_CUSTOM_BRANDS({commit}, payload) {
            commit('setIsNewCustomBrands', payload);
        },
        SOCKET_GET_CHIPS_FOR_CUSTOMIZATION({commit}, payload) {
            this.$app.$socket.client.emit('get_chips_for_customization', {}, (response) => {
                if (response.chips) {
                    commit('setChips', response.chips);
                }
            });
        },
        SOCKET_SET_ACTIVE_CHIP({commit}, payload) {
            this.$app.$socket.client.emit('set_active_chip', {chipId: payload.chipId}, (response) => {
                if (response.chips) {
                    commit('setChips', response.chips);
                }
            });
        },
        SOCKET_IS_NEW_CUSTOM_CHIPS({commit}, payload) {
            this.$app.$socket.client.emit('is_new_custom_chips', {},(response) => {
                if (response.result) {
                    commit('setIsNewCustomChips', response.result);
                }
            });
        },
        SOCKET_DELETE_NEW_MARK_CHIPS({commit}, payload) {
            this.$app.$socket.client.emit('delete_new_mark_chips', {},(response) => {
                if (response) {
                    commit('setIsNewCustomChips', response.result);
                }
            });
        },
        SOCKET_GET_DICE_FOR_CUSTOMIZATION({commit}, payload) {
            this.$app.$socket.client.emit('get_dice_for_customization', {}, (response) => {
                if (response.dice) {
                    commit('setDice', response.dice);
                }
            });
        },
        SOCKET_SET_ACTIVE_DICE({commit}, payload) {
            this.$app.$socket.client.emit('set_active_dice', {diceId: payload.diceId}, (response) => {
                if (response.dice) {
                    commit('setDice', response.dice);
                }
            });
        },
        SOCKET_IS_NEW_CUSTOM_DICE({commit}, payload) {
            this.$app.$socket.client.emit('is_new_custom_dice', {},(response) => {
                if (response.result) {
                    commit('setIsNewCustomDice', response.result);
                }
            });
        },
        SOCKET_DELETE_NEW_MARK_DICE({commit}, payload) {
            this.$app.$socket.client.emit('delete_new_mark_dice', {},(response) => {
                if (response) {
                    commit('setIsNewCustomDice', response.result);
                }
            });
        },
    },

};
