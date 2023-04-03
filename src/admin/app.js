import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import {routes} from './routes';
import StoreData from '@/store/store';
import App from './App.vue';
import {initialize} from '@/helpers/general';
import SlideUpDown from 'vue-slide-up-down';
import './assets/style.scss'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import vuetify from './plugins/vuetify'

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Vuetify);

Vue.component('slide-up-down', SlideUpDown);

const store = new Vuex.Store(StoreData);

const router = new VueRouter({
    routes,
    mode: 'history',
    linkActiveClass: "active",
    linkExactActiveClass: "active"
});

function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    if (!subsequentMiddleware) return context.next
    return (...parameters) => {
        context.next(...parameters);
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({ ...context, next: nextMiddleware });
    };
}

router.beforeEach((to, from, next) => {
      if (to.meta.middleware) {
          const middleware = Array.isArray(to.meta.middleware)
              ? to.meta.middleware
                  : [to.meta.middleware];

          const context = { from, next, router, to, store };

          const nextMiddleware = nextFactory(context, middleware, 1);
          return middleware[0]({ ...context, next: nextMiddleware });
      }

          return next();
    });

initialize(store, router);

export const app = new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app');

window.vueApp = app;
store.$app = app;