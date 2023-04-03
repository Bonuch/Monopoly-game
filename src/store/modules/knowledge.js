export default {
    state: {
        knowledgeModal: false,
        knowledgeModalData: null,
        upgradeTimeProgress: null,
        upgradeProcessing: false,
        /**
         * Объект для быстрого поиска по knowledge (необходим для отображенияя в модальном окне)
         * Ключ {А1, ... ,АN} или другое уникальное значение
         * Значение:
         *      row: индеес строки
         *      index: индекс объекта
         * Передаем в модалку ключ
         * далее по индексам из объекта достаем данные
         * */
        knowledgeIndexes: {
            'A1': {
                row: 0, // index массива rows у объекта branch
                index: 0, // index карты
            }
        },
        knowledge: null,
    },
    getters: {
        getKnowledge(state) {
            return state.knowledge
        },
        getKnowledgeIndexes(state) {
            return state.knowledgeIndexes
        },
        getKnowledgeModal(state) {
            return state.knowledgeModal
        },
        getUpgradeProcessing(state) {
            return state.upgradeProcessing
        },
        getKnowledgeModalData(state) {
            return state.knowledgeModalData
        },
        getKnowledgeMap(state) {
            return state.knowledge._map ? state.knowledge._map : null
        },
        getUpgradeTimeProgress(state) {
            return state.upgradeTimeProgress
        }
    },
    mutations: {
        setKnowledge(state, data) {
            state.knowledge = data
        },
        setKnowledgeIndexes(state, data) {
            state.knowledgeIndexes = data
        },
        setUpgradeProcessing(state, data) {
            state.upgradeProcessing = data
        },
        setKnowledgeModal(state, data) {
            state.knowledgeModal = data
        },
        setKnowledgeModalData(state, data) {
            state.knowledgeModalData = data
        },
        setKnowledgeProgressByCode(state, branch, card_code, progress) {

        },
        setUpgradeTimeProgress(state, data) {
            state.upgradeTimeProgress = data
        },
        setCardProgressByCode(state, code) {
            /*
            * ind[0] == branch name
            * ind[1] == card colu
            * */
            const ind = state.knowledge._map[code]
            state.knowledge[ind[0]]['rows'][ind[2]][ind[1]]['is_upgrade_available'] = false
        },
    },
    actions: {
        SOCKET_UPDATE_KNOWLEDGE({ state, dispatch, commit, getters }, data) {
            commit('setKnowledge', data);
            dispatch('refreshKnowledgeModal');
        },
        removeProcessFlag({commit}) {
            commit('setUpgradeProcessing', false)
        },
        getKnowledgeCardByCode({getters}, {branch, code}) {
            return getters.getKnowledge[branch]
        },
        toggleKnowledgeModal({ state, commit, dispatch, getters }, opt=null) {
            commit('setKnowledgeModal', !state.knowledgeModal)
            if (opt && opt.branch !== null && opt.code !== null) {
                const map = getters.getKnowledgeMap[opt.code];
                const data = getters.getKnowledge[opt.branch]['rows'][map[1]][map[2]];
                commit('setKnowledgeModalData', data);
            }
        },
        refreshKnowledgeModal({ state, commit, dispatch, getters }) {
            const opt = getters.getKnowledgeModalData;
            if (opt) {
                const map = getters.getKnowledgeMap[opt.code];
                const data = getters.getKnowledge[opt.branch]['rows'][map[1]][map[2]];
                commit('setKnowledgeModalData', data);
            }
        },
        getKnowledgeModalByCode({ state, commit, dispatch, getters }, card_code) {
            if (card_code) {
                const map = getters.getKnowledgeMap[card_code];
                const data = getters.getKnowledge[map[0]]['rows'][map[1]][map[2]];
                commit('setKnowledgeModalData', data);
            }
        },
        async purchaseUpgrade({ getters, state, commit }, opt = {}) {
            if (Object.keys(opt).length > 0) {
                commit('setUpgradeProcessing', true);
                return new Promise((resolve, reject) => {
                    this.$app.$socket.client.emit('buy_knowledge_upgrade', opt, (responseData) => {
                        if (responseData.result === 'fail') {
                            reject(responseData)
                            commit('setUpgradeProcessing', false)
                            return;
                        }
                        commit('setKnowledge', responseData.branches)
                        const map = getters.getKnowledgeMap[opt.card_code]
                        const data = getters.getKnowledge[map[0]]['rows'][map[1]][map[2]]
                        commit('setKnowledgeModalData', data)
                        resolve(responseData)
                    })
                })
            }
        },
        async startUpgrade({ getters, state, commit }, opt = {}) {
            if (Object.keys(opt).length > 0) {
                return new Promise((resolve, reject) => {
                        this.$app.$socket.client.emit('start_knowledge_upgrade', opt, (responseData) => {
                            if (responseData.result !== 'fail') {
                                commit('setKnowledge', responseData.branches)
                                const map = getters.getKnowledgeMap[opt.card_code]
                                const data = getters.getKnowledge[map[0]]['rows'][map[1]][map[2]]
                                commit('setKnowledgeModalData', data)
                                resolve(responseData)
                            } else {
                                reject(responseData)
                            }
                        })

                })
            }
            return false;
        }
    },
}
