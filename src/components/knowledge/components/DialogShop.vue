<template>
    <div class='dialog__shop'>
        <transition name='fade'>
            <div class='shop__container' v-if='!cartOpen'>
                <transition-group name='list' tag='div' style='display: flex; flex-wrap: wrap;
    justify-content: center;'>
                    <div
                        v-for='(item, index) in shopItems'
                        :key='item.id'
                        class='shop__item'
                    >

                        <p class='item__title'>{{ item.title }}</p>
                        <div class='shop__item__container'>
                            <img class='item__image' :src='item.image_url' alt=''>
                            <span
                                v-if='item.amount > 0'
                                class='item__amount'
                            >
                        x{{ item.amount }}
                    </span>
                            <span
                                v-else
                                class='item__amount'
                                :title='item.price_bucks'
                            >
                        <img
                            class='item__currency'
                            src='/design/icons/currencies/black21.png'
                            alt=''
                        >
                        {{ item.price_bucks | currency }}
                    </span>

                            <div v-if='item.amount > 0' class='item__btn__wrapper'>
                                <a class='item__btn use' href='#'
                                   @click.prevent='runAccelerator(index)'>{{ $t('SHOP.применить') }}</a>
                                <a class='item__btn add' @click.prevent='openCart(index, "use")'>+</a>
                            </div>
                            <div v-else class='item__btn__wrapper'>
                                <a  class='item__btn buy' href='#' @click.prevent='buyAccelerator(index)'
                                   @mouseover='showFutureProgress(index)'
                                   @mouseleave='clearAcceleratorState'>{{ $t('SHOP.купить и применить') }}</a>
                                <a class='item__btn add' @click.prevent='openCart(index, "buy")'>+</a>
                            </div>

                        </div>
                    </div>
                </transition-group>
            </div>
        </transition>
        <transition name='fade'>
            <ShopCart
                v-if='cartOpen'
                :type='cartType'
                :cart-data='cartData'
                :knowledge-id='knowledgeId'
                :fast-buy='fastBuy'
                @cartClose='closeCart()'
                @accelerated='updateFinishTime'
                @itemPurchased='fetchData'
                @error='catchError'
            />
        </transition>
    </div>
</template>

<script>
import ShopCart from './ShopCart';
import 'vue-slider-component/theme/default.css';
import { mapMutations } from 'vuex';

export default {
    name: 'DialogShop',
    components: { ShopCart },
    props: {
        knowledgeId: {
            required: true,
            type: Number,
        },
        cardCode: {
            required: true,
            type: String,
        },
    },
    filters: {
        currency(value) {
            const currency = parseInt(value);
            if (currency >= 1000000000) {
                return `${(value / 1000000000).toFixed(1)}B`;
            }
            if (currency >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`;
            }
            if (currency >= 1000) {
                return `${(value / 1000).toFixed(1)}K`;
            }
            return value;
        },
    },
    data() {
        return {
            shopItems: null,
            item_amount: 1,
            max_amount: 1200,
            cartType: 'buy',
            cartOpen: false,
            cartData: null,
            fastBuy: false,
        };
    },

    async created() {
        await this.fetchData();
    },
    methods: {
        ...mapMutations(['setKnowledgeFinishAt', 'setAcceleratorsToUse', 'clearAcceleratorState']),
        async fetchData() {
            await this.$store.$app.$socket.client.emit('get_modal_available_accelerators', null, (response) => {
                if (response) {
                    this.shopItems = response.accelerators;
                }
            });
        },
        showFutureProgress(item_index) {
            this.setAcceleratorsToUse({
                amount: 1,
                duration: this.shopItems[item_index].duration,
            });
        },
        catchError(error) {
            this.$emit('error', error);
        },
        openCart(item_index, type, fastBuy = false) {
            this.cartType = type;
            this.fastBuy = fastBuy;
            this.cartOpen = true;
            this.cartData = this.shopItems[item_index];
        },
        closeCart() {
            this.cartOpen = false;
        },
        updateFinishTime(finish_time) {
            console.log("------ acelerated ", finish_time);
            this.$emit('accelerated', finish_time);
            this.closeCart();
        },
        async runAccelerator(item_index) {
            this.cartData = this.shopItems[item_index];
            console.log('CARD DATA ', this.cartData);
            const options = {
                item_id: this.cartData.thing_id,
                amount: 1,
                knowledge_id: this.knowledgeId,
            };
            if (options && options.amount > 0) {
                try {
                    await this.$store.$app.$socket.client.emit('use_accelerators', options, async response => {
                        if (response && response.success) {
                            await this.fetchData();
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
        async buyAccelerator(item_index) {
            this.cartData = this.shopItems[item_index];
            const options = {
                item_id: this.cartData.id,
                amount: 1,
                knowledge_id: this.knowledgeId,
            };
            if (options && options.amount > 0) {
                try {
                    await this.$store.$app.$socket.client.emit('buy_accelerators', options, async response => {
                        if (response && response.success) {
                            // await this.fetchData()
                            this.$emit('accelerated', response.progress_finish_at);
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
    },
};
</script>

<style scoped lang='scss'>
.list-enter-active, .list-leave-active {
    transition: all 1s;
}

.list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */
{
    opacity: 0;
    transform: translateY(30px);
}

.fade-enter-active {
    transition: .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */
{
    opacity: 0;
}

.dialog__shop {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
}


.shop__item__container {
    display: flex;
    align-items: center;
}

.shop__container {
    display: flex;
    padding: 20px;
    flex-wrap: wrap;
    justify-content: center;
}

.item__title {
    text-align: left;
    margin-bottom: 10px;
}

::v-deep {
    .custom-dot {
        width: 60px;
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


.shop__item {
    //display: flex;
    //align-items: center;
    margin: 0px 15px 10px 15px;

    .item__image {
        width: 50px;
        height: 50px;
        border-radius: 3px;
    }

    .item__amount {
        padding: 0 15px;
        display: flex;
        align-items: center;
        width: 60px;
        justify-content: center;
    }

    .item__currency {

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
    width: 110px;
    text-align: center;
    font-weight: 600;
    transition: .2s;

    &__wrapper {
        display: flex;
    }

    &.use {
        width: 140px;
    }

    &.buy {
        background-color: var(--color-yellow-dark);
        color: var(--color-background-3);
        width: 140px;
        border-radius: 3px 0px 0px 3px;

        &:hover {
            background: var(--color-yellow-light);
        }
    }

    &.add {
        width: 30px;
        padding: 10px 0px;
        border-radius: 0 3px 3px 0;
        display: flex;
        justify-content: center;
        align-items: center;

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
