<template>
    <IllustratedModal ref="modalDialog" v-if="item"
        :image_url="item.image_url"
        :is_state_success="local_state == states.Success"
        :is_state_failure="local_state == states.Failure"
        :is_state_ask="local_state == states.Ask"
        :is_disabled="is_processing"
        :accept_label="$t('SHOP.Купить')"
        :cancel_label="$t('GENERAL.Отказаться')"
        @ok="buyItem(item, price_type)"
    >
        <span v-if="local_state == states.Ask">
            {{ $t('SHOP.Вы действительно хотите купить') }}
            {{ $tt('SHOP.', item.title) }} {{ $t('SHOP.за') }}
            {{ price_type == 'bucks' ? item.price_bucks + '$' : item.price_crypto + 'BTC' }}?
        </span>
        <span v-else-if="local_state == states.Failure">
            {{ $t('SHOP.Не удалось купить предмет') }}: {{ message }}
        </span>
        <span v-else-if="local_state == states.Success">
            {{ $t('SHOP.Вы успешно купили') }} {{ $tt('SHOP.', item.title) }}
            <br>
            {{ $t('SHOP.Купленные предметы можно использовать в') }}
            <router-link :to="{ name: 'profile'}">{{ $t('SHOP.меню профиля') }}</router-link>,
            {{ $t('SHOP.выбрав соответсвующий пункт вверху страницы') }}
        </span>
    </IllustratedModal>
</template>

<script>
    import axios from '@/helpers/axios-instance';
    import EventBus from '@/helpers/global-event-bus'
    import MainMixin from '@/mixins/main-mixin';
    import { mapActions } from 'vuex';
    import IllustratedModal from '@/components/notifications/IllustratedModal.vue'

    export default {
        name: "ShopBuyItemModal",
        components: { IllustratedModal },
        mixins: [MainMixin],
        data() {
            return {
                states: {
                    Ask: 'Ask',
                    Failure: 'Failure',
                    Success: 'Success'
                },
                item: null,
                local_state: '',
                price_type: '',
                message: '',
                is_processing: false
            }
        },
        methods: {
            ...mapActions([
                'shopBuyItem',
                'loadUserItems',
            ]),
            buyDialog (item, price_type) {
                this.local_state = this.states.Ask
                this.item = item
                this.price_type = price_type
                this.$nextTick(() => {
                    this.$refs.modalDialog.show()
                })
            },
            hide () {
                this.$refs.modalDialog.hide()
                this.item = null
            },
            handleBackground(event) {
                if(event.target.className == 'modal-background') {
                    this.hide()
                }
            },
            buyItem(item, price_type) {
                this.is_processing = true
                this.shopBuyItem({ item, price_type }).then(response => {
                    if (response.success) {
                        this.local_state = this.states.Success
                        this.loadUserItems();
                        this.loadUserInfo();
                        this.loadUserLoot();
                        // download from https://freesound.org/people/FunWithSound/sounds/456965/
                        var audio = new Audio('/samples/short-success.mp3');
                        audio.play();

                        this.$emit('purchaseCompleted');
                    } else {
                        this.message = response.message ? response.message : this.$t('SHOP.Покупка не удалась')
                        this.local_state = this.states.Failure
                    }
                    this.is_processing = false;
                }).catch((response) => {
                    console.log('Ошибка', response)
                });
            }
        },
    }
</script>
