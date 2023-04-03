import "core-js/stable";
import "regenerator-runtime/runtime";

// import './helpers/bootstrap';
import Vue from "vue";
import i18n, { i18nServer, loadLanguageAsync } from "./i18n";

import { ObserveVisibility } from "vue-observe-visibility";
import vClickOutside from "v-click-outside";
import "./helpers/vue-directives";
import VueRouter from "vue-router";
import Vuex from "vuex";
import { routes } from "./routes";

import mainStore from "./store/store";
import contactsStore from "./store/modules/contacts";
import gameSearchStore from "./store/modules/game-search";
import gameLobbyStore from "./store/modules/game-lobby";
import privateChatStore from "./store/modules/private-chat";
import commonChatStore from "./store/modules/chat";
import notificationsStore from "./store/modules/notifications";
import gameStateStore from "./store/modules/game-state";
import gameDealStore from "./store/modules/game-deal-state";
import gameSellStore from "./store/modules/game-sell-state";
import gameManinhatStore from "./store/modules/game-maninhat-state";
import gameChatStore from "./store/modules/game-chat";
import shopStore from "./store/modules/shop";
import userItemsStore from "./store/modules/user-items";
import customizeStore from "./store/modules/customize-state";
import gameWatchStore from "./store/modules/game-watch";
import knowledgeStore from "./store/modules/knowledge";
import Accelerators from "./store/modules/accelerators";

import { initialize } from "./helpers/general";

import PerfectScrollbar from "vue2-perfect-scrollbar";
import VueSimpleContextMenu from "vue-simple-context-menu";
import slideUpDown from "vue-slide-up-down";
import ModalPlugin from "./plugins/modal/js/index";

import App from "./App.vue";
import VueScrollTo from "vue-scrollto";
import Dice from "vue-dice-component";

import "vue-simple-context-menu/dist/vue-simple-context-menu.css";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import "vue-dice-component/lib/dice.css";
import "./assets/scss/style.scss";

import { VueMasonryPlugin } from "vue-masonry";

import VueMeta from 'vue-meta'

import LogRocket from "logrocket";
import LastActivity from "./plugins/last-activity";

LogRocket.init("9zl0zs/mp");

Vue.config.devtools = (process.env.NODE_ENV === "development");
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueScrollTo);
Vue.use(Dice);
Vue.use(PerfectScrollbar);
Vue.directive("observe-visibility", ObserveVisibility);
Vue.component("vue-slide-up-down", slideUpDown);
Vue.component("vue-simple-context-menu", VueSimpleContextMenu);
Vue.use(VueMasonryPlugin);
Vue.use(vClickOutside);
Vue.use(i18nServer);
Vue.use(VueMeta, {
    refreshOnceOnNavigation: true
});

const store = new Vuex.Store(mainStore);
store.registerModule("notifications", notificationsStore);
store.registerModule("contacts", contactsStore);
store.registerModule("game-search", gameSearchStore);
store.registerModule("game-lobby", gameLobbyStore);
store.registerModule("chat", commonChatStore);
store.registerModule("private-chat", privateChatStore);
store.registerModule("game-chat", gameChatStore);
store.registerModule("shop", shopStore);
store.registerModule("game-state-store", gameStateStore);
store.registerModule("game-deal-store", gameDealStore);
store.registerModule("game-sell-store", gameSellStore);
store.registerModule("game-maninhat-store", gameManinhatStore);
store.registerModule("user-items", userItemsStore);
store.registerModule("customize-store", customizeStore);
store.registerModule("game-watch", gameWatchStore);
store.registerModule("knowledge", knowledgeStore);
store.registerModule("accelerators", Accelerators);



Vue.use(LastActivity, { store, limit: 180 })

const router = new VueRouter({
    routes,
    mode: "history",
    linkActiveClass: "active",
    linkExactActiveClass: "active",
});

const lang = store.getters.currentUser.language || "en"

// loadLanguageAsync(lang).then(() => {
//
//
//     // window.vueApp = app;
// })

loadLanguageAsync(lang).then(() => {
    initialize(store, router);
    const app = new Vue({
        sockets: {
            connect: function() {
                //console.log('SOCKET CONNECTED');
            },
        },
        metaInfo: () => ({
            title: i18n.t('SITE.app_name'),
            titleTemplate: `%s | ${i18n.t('SITE.after_title')}`,
            htmlAttrs: {
                lang: 'en',
                amp: undefined
            },
        }),
        computed: {
            siteTitle: () => this.$i18n.t("SITE.app_name")
        },
        async beforeCreate() {
            await loadLanguageAsync(lang);
        },
        created: async function() {
            const lang = this.$store.getters.currentUser.language || "en";
            // await loadLanguageAsync(lang);
        },
        destroyed: function() {

        },
        router,
        store,
        i18n,
        render: h => h(App),
    }).$mount("#app");
    store.$app = app;

    Vue.use(ModalPlugin, {
        options: {},
        store: store,
    });

});

// export const app = new Vue({
//     sockets: {
//         connect: function() {
//             //console.log('SOCKET CONNECTED');
//         },
//     },
//     created: async function() {
//         const lang = this.$store.getters.currentUser.language || "en";
//         await loadLanguageAsync(lang);
//     },
//     destroyed: function() {
//
//     },
//     router,
//     store,
//     i18n,
//     render: h => h(App),
// }).$mount("#app");
//
//
// store.$app = app;
// window.vueApp = app;
