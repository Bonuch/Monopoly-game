<template>
    <div class='shop__cart' v-if='cartData'>
        <p>{{ cartData.title }}</p>
        <div class='shop__amount'><span>{{ $t("SHOP.Количество") }}</span>
            <div class='amount__value'>
                <input
                    v-model='item_amount'
                    type='number'
                    :max='type === "boost" ? cartData.amount: maxAllowedAccelerators'
                    min='0'
                > / {{ type === 'boost' ? cartData.amount : maxAllowedAccelerators }}
            </div>
        </div>
        <VueSlider
            v-model='item_amount'
            :min='0'
            :max='type === "boost" ? cartData.amount : maxAllowedAccelerators'
            :height='7'
            class='shop__slider'
        >
            <template v-slot:tooltip='{ value }'>
                <div class='custom-tooltip'><span>{{ value }}</span></div>
            </template>
            <template v-slot:dot>
                <img
                    :src='type === "boost" ? "/design/icons/rectangle-placeholder.png" : "/design/icons/currencies/black21.png"'
                    class='custom-dot' />
            </template>
        </VueSlider>
        <div class='shop__total' v-if='type === "buy"'>
            <span>Стоимость:</span>
            <div class='total__value'>{{ item_amount * cartData.price_bucks }}</div>
        </div>
        <p class='shop__actions'>
            <a v-if='type === "buy"' class='item__btn buy' href='#'
               @click.prevent='buyAccelerator()'>{{ $t('SHOP.купить и применить') }}</a>
            <a v-else class='item__btn buy' href='#' @click.prevent='runAccelerator()'>{{ $t('SHOP.применить')
                }}</a>
            <a class='item__btn' href='#' @click.prevent='cartClose()'>{{ $t("SHOP.отмена") }}</a>
        </p>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import { mapActions, mapGetters, mapMutations } from 'vuex';

const moment = require('moment');

export default {
    name: 'ShopCart',
    components: { VueSlider },
    props: {
        type: {
            type: String,
            required: true,
        },
        cartData: {
            type: Object || null,
            required: true,
        },
        knowledgeId: {
            type: Number,
            required: true,
        },
        fastBuy: {
            type: Boolean,
            required: false
        }
    },
    data() {
        return {
            shopItems: null,
            item_amount: 0,
            max_amount: 1200,
        };
    },
    computed: {
        ...mapGetters({ currentKnowledge: 'getKnowledgeModalData', currentProgress: 'getUpgradeTimeProgress' }),
        maxAllowedAccelerators() {
            console.log("-0-0-0-0-0-0-", this.cartData);
            const amount = Math.ceil((this.currentKnowledge.upgrade_time - this.currentKnowledge.upgrade_time * (this.currentProgress / 100)) / this.cartData.duration)
            console.log('total time', this.currentKnowledge.upgrade_time);
            console.log('progress', this.currentProgress);
            console.log('accelerator price', this.cartData.duration);
            console.log((this.currentKnowledge.upgrade_time - this.currentKnowledge.upgrade_time * (this.currentProgress / 100)) / this.cartData.duration);
            return amount > 0 ? amount : 1;
        },

    },
    destroyed() {
        this.clearAcceleratorState();
    },
    watch: {
        item_amount(value) {
            this.setAcceleratorsToUse({
                amount: value,
                duration: this.cartData.duration,
            });
        },
        fastBuy(value) {
            if (value) {
                this.buyAccelerator()
            }
        }
    },
    methods: {
        ...mapMutations(['setAcceleratorsToUse', 'clearAcceleratorState']),
        ...mapActions([
            'loadUserInfo',
        ]),
        cartClose() {
            this.$emit('cartClose');
        },
        async runAccelerator() {
            console.log(this.cartData);
            const options = {
                item_id: this.cartData.thing_id,
                amount: parseInt(this.item_amount),
                knowledge_id: this.knowledgeId,
            };
            if (options && options.amount > 0) {
                try {
                    await this.$store.$app.$socket.client.emit('use_accelerators', options, async response => {
                        if (response && response.success) {
                            this.cartData.amount -= this.item_amount;
                            this.item_amount = 0;
                            this.$emit('accelerated', response.finish_at);
                        } else {
                            if (response.message) {
                                this.$emit('error', response.message);
                                return;
                            }
                            this.$emit('error', 'unknown error');
                        }
                    });
                } catch (e) {
                    this.$emit('error', e.message);
                }

            }
        },
        async buyAccelerator() {
            const options = {
                item_id: this.cartData.id,
                amount: !this.fastBuy ? parseInt(this.item_amount): 1,
                knowledge_id: this.knowledgeId
            };
            if (options && options.amount > 0) {
                try {
                    await this.$store.$app.$socket.client.emit('buy_accelerators', options, async response => {
                        if (response && response.success) {
                            // await this.runAccelerator();
                            this.$emit('accelerated', response.finish_at);
                            // this.$emit('itemPurchased');
                            await this.loadUserInfo();
                            this.cartClose();
                        } else {
                            if (response.message) {
                                // this.$emit('error', response.message)
                                this.$emit('error', response.message);
                                return;
                            }
                            this.$emit('error', 'unknown error');
                        }
                    });
                } catch (e) {
                    this.$emit('error', e.message);
                }

            }
        },
    },
};
</script>

<style scoped lang='scss'>
.shop__cart {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.shop__slider {
    width: 70% !important;
}

::v-deep {
    .custom-dot {
        width: 60px;
        filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.16));
    }


    .vue-slider-dot {
        width: 20px !important;
        height: 20px !important;
    }

    .vue-slider-process {
        background-color: var(--color-purple-medium);
    }

    .custom-tooltip {
        padding: 1px 10px;
        background: var(--color-purple-medium);
        position: relative;
        border-radius: 3px;
        box-shadow: 0px 6px 4px rgba(0, 0, 0, 0.16);
        z-index: 20;

        &::after {
            position: absolute;
            display: block;
            background: var(--color-purple-medium);
            width: 10px;
            height: 10px;
            border-radius: 0px 0px 2px 0;
            content: '';
            z-index: -1;
            left: 50%;
            bottom: -5px;
            transform: translateX(-50%) rotate(45deg);
        }

        span {
            z-index: 10;
        }
    }
}

.shop__actions {
    display: flex;
}

.shop__amount {
    display: flex;
    justify-content: space-between;
    width: 70%;

    .amount__value {
        input {
            width: 50px;
            background-color: var(--color-background-3);
            border: none;
            color: #fff;
            font-size: 16px;
            padding: 5px 10px;
        }
    }
}

.shop__total {
    display: flex;
    justify-content: flex-end;
    width: 70%;

    .total__value {
        margin-left: 15px;
    }
}

.item__btn {
    box-sizing: border-box;
    color: #fff;
    text-decoration: none;
    background: var(--color-background-3);
    padding: 10px 15px;
    font-size: 15px;
    border-radius: 3px 0 0 3px;
    width: 140px;
    text-align: center;
    font-weight: 600;
    transition: .2s;
    display: flex;
    justify-content: center;
    align-items: center;

    &:last-child {
        margin-left: 15px;
    }

    &.buy {
        background-color: var(--color-yellow-dark);
        color: var(--color-background-3);
        border-radius: 3px;

        &:hover {
            background: var(--color-yellow-light);
        }
    }

    &.add {
        width: 30px;
        padding: 10px 0px;
        border-radius: 0 3px 3px 0;

        &:hover {
            color: var(--color-background-3);
            background: var(--color-yellow-dark);
        }
    }

    &:hover {
        background: var(--color-gray-dark);
    }
}
</style>
