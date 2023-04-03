// Notifications

import { dynamicSort } from '@/helpers/array';

/* @see backend/models/notification.js:77 */
const Notification_STATUS_NEW = 0;
const Notification_STATUS_HIDDEN = 1;
const Notification_STATUS_VIEWED = 2;
const Notification_STATUS_REMOVED = 10;

const Notifications_LIMIT = 20;

export default {
    state: {
        notifications: [

        ],
    },
    getters: {
        notificationsNumber(state) {
            return state.notifications.length;
        },
        notifications(state) {
            return state.notifications;
        }
    },
    mutations: {
        // перезаписывает все ууведомления в хранилище
        updateNotifications(state, notifications) {
            notifications = notifications.map(notification => {
                const now = new Date();
                notification.hideAt = now.setSeconds(now.getSeconds() + notification.timeout);
                notification.goingHidden = 0;
                notification.created_at = new Date(notification.created_at);
                return notification;
            });
            state.notifications = notifications.sort(dynamicSort('-created_at'));
        },
        // добавляет новое уведомление
        setNotification(state, notification) {
            let notifications = state.notifications;
            const now = new Date();
            notification.hideAt = now.setSeconds(now.getSeconds() + notification.timeout);
            notification.goingHidden = 0;
            notification.created_at = new Date(notification.created_at);
            notifications.push(notification);
            notifications = notifications.sort(dynamicSort('-created_at'));
            if (notifications.length > Notifications_LIMIT) {
                notifications = notifications.slice(0, Notifications_LIMIT);
            }
            state.notifications = notifications;
        },
        // обновляет статусы уведомлений
        updateNotification(state, notification) {
            state.notifications = state.notifications.map((n) => {
                if (n.id === notification.id) {
                    n.status = notification.status || n.status;
                    n.answer = notification.answer || n.answer;
                }
                return n;
            });
        },
        // скрывает видимые уведомления по n.hideAt
        hideNotifications(state, callback) {
            const now = new Date();
            state.notifications = state.notifications.map((n) => {
                if (n.status === Notification_STATUS_NEW && n.hideAt < now) {
                    if (n.goingHidden === 0) {
                        // сначала ставим статус для анимации скрытия
                        n.goingHidden = 1;
                    } else {
                        // а затем меняем статус на скрытое
                        n.status = Notification_STATUS_HIDDEN;
                        callback(n.id, Notification_STATUS_HIDDEN);
                    }
                }
                return n;
            });
        }
    },
    actions: {
        // # Requests
        // отправляет ответ на сервер из нотификации с вопросом
        notificationAnswer({ commit }, payload) {
            if (payload.game_invite) {
                this.$app.$socket.client.emit('gamelobby_invite_answered', {
                    id: payload.id,
                    answer: payload.answer,
                    creator_uuid: payload.creator_uuid,
                }, data => {
                    if (data.notification) {
                        commit('updateNotification', data.notification);
                    }
                    if (data.redirectToLobby && this.$app.$router.history.current.path !== '/play/new-game') {
                        this.$app.$router.push('/play/new-game');
                    }
                });
            }
        },
        hideNotification({ commit }, id) {
            // прямая смена статуса
            // сначала обновляем на сервере
            this.$app.$socket.client.emit('notification_set_status', {
                id,
                status: Notification_STATUS_VIEWED,
            }, notification => {
                // затем обновляем в state
                commit('updateNotification', notification);
            });
        },
        removeNotification({ commit }, id) {
            this.$app.$socket.client.emit('notification_set_status', {
                id,
                status: Notification_STATUS_REMOVED,
            }, notification => {
                commit('updateNotification', notification);
            });
        },
        removeAllNotifications(context) {
            this.$app.$socket.client.emit('notification_remove_all');
        },
        hideNotifications(context) {
            // мы не вызываем мутацию до тех пор, пока не убедимся, что есть претенденты на скрытие.
            // Иначе происходит слишком много обновлений хранилища
            const now = new Date();
            for (const n of context.state.notifications) {
                if (n.status === Notification_STATUS_NEW && n.hideAt < now) {
                    context.commit('hideNotifications', (id, status) => {
                        this.$app.$socket.client.emit('notification_set_status', {
                            id,
                            status
                        }, _ => null);
                    });
                    break;
                }
            }
        },
        // # Responses
        // непрочитанные нотификации
        SOCKET_REFRESH_NOTIFICATIONS({ commit }, payload) {
            commit('updateNotifications', payload);
        },
        SOCKET_notification({ commit }, notification) {
            commit('setNotification', notification);
        },
    }
};
