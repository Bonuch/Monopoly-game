import Vue from 'vue';
import VueSocketIO from 'vue-socket.io-extended';
import io from 'socket.io-client';
import axios from '@/helpers/axios-instance';
import { setAuthorization } from '@/helpers/axios-instance';
import jwtPayloadDecoder from "jwt-payload-decoder";
import moment from "moment";


export function initialize(store, router)
{
    isUserAuthRouterHook(store, router);
    isEmailConfirmedRouterHook(store, router);
    if (store.getters.accessToken) {
        // TODO не думаю, что это лучшее место для подключения сокетов, нужно проверсти анализ
        setAuthorization(store.getters.accessToken);
        registerWebsocket(store);
    }
    return null;
}

export function registerWebsocket(store)
{
    console.log('register websockets');
    if (store.$app && store.$app.$socket) {
        updateWebsocketAuth(store);
    }
    const ioInstance = io(process.env.VUE_APP_HOST + '?token=' + store.getters.accessToken, {
        reconnection: true,
        reconnectionDelay: 500,
        maxReconnectionAttempts: Infinity
    });
    ioInstance.io.on('packet', function(packet) {
        if (!packet.data)  return;
        if (typeof(packet.data[0]) !== 'string')  return;
        const type = 'SOCKET_' + packet.data[0];
        const payload = packet.data[1] || null;
        if (store._actions[type]) {
            //console.log('SOCKET: ', type, payload);
            store.dispatch(type, payload);
        }
    });
    // мне пришлось отключить эту хрень,
    // так как привязка store происходит с запазданием и часть данных
    // отправленных с сервера сразу после подключения просто ухоядт в небытие,
    // не достигая vuex.
    // это капец, тысячи пакетов на любой вкус, и ты все равно вынужден писать велосипед, потому что пакеты гавно лагающее
    if (!(store.$app && store.$app.$socket)) {
        Vue.use(VueSocketIO, ioInstance, {
            store,
            // actionPrefix: 'SOCKET_', // keep prefix in uppercase
            // eventToActionTransformer: (actionName) => actionName // cancel camel case
        });
    }
}

export function updateWebsocketAuth(store, reconnectWithRefreshToken = false)
{
    console.log('reconnect sockets...');
    let query = 'token=' + store.getters.accessToken;
    if (reconnectWithRefreshToken) {
        query = query + '&refreshtoken=' + store.getters.refreshToken;
    }

    store.$app.$socket.client.disconnect();

    store.$app.$socket.client.query = query;
    store.$app.$socket.client.io.opts.query = query;
    store.$app.$socket.client.io.uri = process.env.VUE_APP_HOST + '?' + query;

    store.$app.$socket.client.connect();
    // if (reconnectWithRefreshToken) {
    //     store.$app.$socket.client.disconnect();
    //     store.$app.$socket.client.connect();
    // }
}

function isUserAuthRouterHook(store, router) {
    router.beforeEach((to, from, next) => {
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
        const isLoggedIn = store.getters.accessToken;
        const isStaffUser = store.getters.isStaffUser;

        if(requiresAuth && !isLoggedIn) {
            next('/login');
        } else if((to.meta.supportView && !isStaffUser) && isLoggedIn){
            next('/');
        } else if((to.path == '/login' || to.path == '/registration') && isLoggedIn) {
            next('/');
        } else {
            next();
        }
    });
}


// function isUserTechSupportRouterHook(store, router) {
//     router.beforeEach((to, from, next) => {
//         const requiresAuth = to.matched.some(record => record.meta.support);
//         const isLoggedIn = store.getters.accessToken;
//         // const isStaff = store.getters.isTechSupportUser;
//
//         if(requiresAuth && !isLoggedIn) {
//             next('/');
//         } else if((to.path == '/login' || to.path == '/registration') && isLoggedIn) {
//             next('/');
//         } else {
//             next();
//         }
//     });
// }


function isEmailConfirmedRouterHook(store, router) {
    router.beforeEach((to, from, next) => {
        const requiresEmailConfirm = to.matched.some(record => record.meta.requiresEmailConfirm);
        const currentUser = store.getters.currentUser;
        syncEmailConfirmation(store).then( () => {
            if(requiresEmailConfirm && currentUser.email && !currentUser.email_confirmed) {
                next('/email-unconfirmed');
            } else if(to.path == '/email-unconfirmed' && currentUser.email && currentUser.email_confirmed) {
                next('/');
            } else {
                next();
            }
        }).catch( (err) => {
            console.log(err);
            // next('/email-unconfirmed');
        });
    });
}


function syncEmailConfirmation(store) {
    return new Promise((resolve, reject) => {
        const currentUser = store.getters.currentUser;
        if (currentUser.email && !currentUser.email_confirmed) {
            axios.get('/check-email-confirm', {
                params: {
                    email: currentUser.email
                }
            }).then((response) => {
                const result = Boolean(response.data.result);
                if (result) {
                    store.commit('acceptEmailConfirmation');
                }
                resolve();
            }).catch(() => {
                reject();
            });
        } else {
            resolve();
        }
    });
}
