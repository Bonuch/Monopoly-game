'use strict'

import DialogComponent from '../components/dialog.vue'
import { DIALOG_TYPES, DEFAULT_OPTIONS } from './constants'
import Vue from 'vue'

let Index = function (Vue, data) {
    this.Vue = Vue;
    this.mounted = false;
    // this._component = {};
    this.$root = {};
    this.globalOptions = {...DEFAULT_OPTIONS, ...data.options};
    this.store = data.store;
    this.mountIfNotMounted();
};

Index.prototype.mountIfNotMounted = function () {
    if (this.mounted === true) {
        return
    }

    this.$root = (() => {
        let DialogConstructor = this.Vue.extend(DialogComponent);
        let node = document.createElement('div');
        document.querySelector('body').appendChild(node);

        let Vm = new DialogConstructor();

        return Vm.$mount(node)
    })();

    this.mounted = true
};

Index.prototype.destroy = function () {
    if (this.mounted === true) {
        this.$root.destroyDialog();

        let elem = this.$root.$el;
        this.$root.$destroy();
        this.$root.$off();
        elem.remove();
        this.mounted = false;
    }
}

Index.prototype.alert = function (message = null, options = {}) {
    message && (options.message = message);
    return this.open(DIALOG_TYPES.ALERT, options);
}

Index.prototype.confirm = function (message = null, options = {}) {
    message && (options.message = message);
    return this.open(DIALOG_TYPES.CONFIRM, options);
}

Index.prototype.open = function (type, localOptions = {}) {
    this.mountIfNotMounted();
    // this.store.commit({...this.globalOptions, ...localOptions})
    return new Promise((resolve, reject) => {
        localOptions.window = type;
        localOptions.promiseResolver = resolve;
        localOptions.promiseRejecter = reject;
        localOptions.colorScheme = this.store.getters.currentColorSchema
        //add options and obj vuex
        this.$root.commit({...this.globalOptions, ...localOptions});
    })
}

Index.install = function (Vue, options) {
    const dialog = new Index(Vue, options);

    Object.defineProperties(Vue.prototype, {
        $dialog: {
            get () {
                return dialog
            }
        }
    })
}

export default Index;
