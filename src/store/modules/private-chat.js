import axios from "axios";

const PrivateMessage_STATUS_VIEWED = 1; // @see backend/models/private-message.js

export default {
    state: {
        privateChats: {
            // чаты
        },
        currentContactUuid: null,
        contactsActiveTab: 0,
    },
    getters: {
        currentContactUuid(state) {
            return state.currentContactUuid;
        },
        contactsActiveTab(state) {
            return state.contactsActiveTab;
        },
        privateChats(state) {
            return state.privateChats;
        },
        privateChatsNumber(state) {
            return Object.keys(state.privateChats).length;
        },
    },
    mutations: {
        setCurrentContactUuid(state, uuid) {
            state.currentContactUuid = uuid;
        },
        setContactsActiveTab(state, index) {
            state.contactsActiveTab = index;
        },
        updatePrivateMessages(state, data) {
            const rooms = { ...state.privateChats };
            rooms[data.contact.uuid] = data;
            state.privateChats = rooms;
        },
        removePrivateMessage(state, message) {
            const uuid = message.contactUuid;
            const rooms = { ...state.privateChats };
            if (rooms[uuid]) {
                rooms[uuid].messages = rooms[uuid].messages.filter(m => (m.id !== message.id));
            }
            state.privateChats = rooms;
        },
        updatePrivateMessageState(state, message) {
            const uuid = message.contactUuid;
            const rooms = { ...state.privateChats };
            if (rooms[uuid]) {
                rooms[uuid].messages = rooms[uuid].messages.map(m => {
                    if (m.id === message.id) {
                        m.status = PrivateMessage_STATUS_VIEWED;
                    }
                    return m;
                });
            }
            state.privateChats = rooms;
        },
        updateRoomState(state, payload) {
            const rooms = { ...state.privateChats };
            if (rooms[payload.contactUuid]) {
                rooms[payload.contactUuid].is_muted = payload.is_muted || 0;
                rooms[payload.contactUuid].is_banned = payload.is_banned || 0;
                rooms[payload.contactUuid].iam_banned = payload.iam_banned || 0;
            }
            state.privateChats = rooms;
        },
        removeRoom(state, contactUuid) {
            const rooms = { ...state.privateChats };
            delete rooms[contactUuid];
            state.privateChats = rooms;
        },
    },
    actions: {
        // # Requests
        async sendMessageFiles({}, {files, users}) {
            const formData = new FormData()
            for (let i = 0; i < files.length; i++) {
                formData.append('files[' + i + ']', files[i])
            }
            console.log('--- form data ---', formData, files);
            formData.append('sender', users.sender)
            formData.append('receiver', users.receiver)
            await axios.post('/messages/files', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        },
        loadAllPrivateChatMessages(context, options = {}) {
            this.$app.$socket.client.emit('private_chat_messages', options);
        },
        loadPrivateChatMessages(context, options) {
            return new Promise(resolve => {
                if (!options.contactUuid) return resolve(false);
                this.$app.$socket.client.emit('private_chat_messages', options, (privateRoom) => {
                    if (privateRoom) {
                        context.commit('updatePrivateMessages', privateRoom);
                    }
                    return resolve(true);
                });
            });
        },
        sendPrivateMessage(context, data) {
            return this.$app.$socket.client.emit('private_chat_send_message', data);
        },
        setMessageWasRead({ commit }, message) {
            this.$app.$socket.client.emit('private_chat_read_message', message);
            commit('updatePrivateMessageState', message);
        },
        removeDialogue(context, contactUuid) {
            this.$app.$socket.client.emit('private_chat_remove_dialogue', contactUuid, (contactUuid) => {
                if (contactUuid) context.commit('removeRoom', contactUuid);
            });
        },
        removePrivateMessage(context, data) {
            this.$app.$socket.client.emit('private_chat_remove_message', data);
        },
        muteUserOfTheRoom({ commit }, data) {
            return new Promise(resolve => {
                this.$app.$socket.client.emit('private_chat_mute_user', data, (result) => {
                    if (result) {
                        commit('updateRoomState', result);
                    }
                    return resolve(true);
                });
            });
        },
        banUserOfTheRoom({ commit }, data) {
            this.$app.$socket.client.emit('ban_user', data, result => {
                if(result && !result.error) {
                    commit('updateRoomState', {
                        contactUuid: data.targetUuid,
                        is_banned: result.status,
                    });
                    commit('updateProfilePageUserData', {
                        uuid: data.targetUuid,
                        _is_banned: result.status
                    });
                }
            });
        },
        // # Responses
        SOCKET_LOAD_PRIVATE_ROOM({ commit }, privateRoom) {
            commit('updatePrivateMessages', privateRoom);
        },
        SOCKET_REMOVE_PRIVATE_ROOM({ commit }, message) {
            commit('removePrivateMessage', message)
        }
    }
};
