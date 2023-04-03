// Contacts (friends)

export default {
    state: {
        contacts: [],
        contactsLoading: true,
    },
    getters: {
        contactsNumber(state) {
            return state.contacts.length;
        },
        contacts(state) {
            return state.contacts;
        },
        contactsLoading(state) {
            return state.contactsLoading;
        }
    },
    mutations: {
        // обновляет список контактов
        updateContacts(state, contacts) {
            state.contacts = contacts;
            state.contactsLoading = false;
        },
        // обновляет online statuses одного из контактов
        updateContactStatus(state, payload) {
            const contacts = state.contacts.map(v => {
                return v;
            });
            for (const k in contacts) {
                if (contacts[k].id === payload.user_id) {
                    contacts[k]._status = payload.status;
                    if (payload.last_activity) {
                        contacts[k]._last_activity = payload.last_activity;
                    }
                    if (payload.in_a_game) {
                        contacts[k]._in_a_game = payload.in_a_game;
                    }
                    break;
                }
            }
            state.contacts = contacts;
        },
    },
    actions: {
        // # Requests
        // запрос списка контактов
        loadContactsList({ commit }) {
            return new Promise((resolve) => {
                this.$app.$socket.client.emit('contacts_load', {}, function(contacts) {
                    commit('updateContacts', contacts);
                    resolve();
                });
            });
        },
        // # Responses
        // присылает информацию о том, что у некоего пользователя сменился онлайн статус
        SOCKET_REFRESH_USER_STATUS({ commit }, payload) {
            commit('updateContactStatus', payload);
        },
        // обновление списка контактов по некому событию
        SOCKET_REFRESH_CONTACTS_LIST({ commit }, payload) {
            commit('updateContacts', payload);
        },
    }
};
