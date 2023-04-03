<template>
    <div v-if="show" class="modal-wrapper" @keypress.esc="close">
        <component
                   :is="modalComponent"
                   :color-schema="colorSchema"
                   :options="options"
                   @close="close">
        </component>
        <div class="modal-overlay" @click="close"></div>
    </div>
</template>

<script>
    import Alert from './views/Alert.vue'
    import Confirm from './views/Confirm.vue'
    import {DIALOG_TYPES} from '../js/constants'

    export default {
        components: {Alert},
        data() {
            return {
                options: null,
                // store: null,
                show: false
            }
        },
        computed: {
            colorSchema() {
                // return this.$store.getters.currentColorSchema ?? null;
                // return this.store ? this.store.getters.currentColorSchema : null
                return this.options.colorScheme ? this.options.colorScheme : null;
            },
            modalComponent(){
                switch (this.options.window) {
                    case DIALOG_TYPES.ALERT:
                        return Alert;

                    case DIALOG_TYPES.CONFIRM:
                        return Confirm;
                }
            }
        },
        methods: {
            commit(options){
                this.options = options;
                console.log('------------ from coommit', options, 'theme---------', this.colorSchema);
                // this.store = store;
                this.show = true;
            },
            destroyDialog(){
                this.options.promiseRejecter()
                this.options = null
                // this.store = null
            },
            proceed(){
                this.options.promiseResolver()
                this.close()
            },
            close(){
                this.show = false
            }
        },

    }
</script>

<style lang="scss" scoped>
    .modal {
        &-wrapper {
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            z-index: 9999;
        }

        &-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.1);
            z-index: 9998;
        }
    }
</style>
