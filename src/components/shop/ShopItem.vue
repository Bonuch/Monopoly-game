<template>
    <div class="shop-item">
        <div class="item-content">
            <div class="content-image-container">
                <img :src="item.image_url" style="max-height:84px">
            </div>
            <div>
                        <span class="shopcatalog__item-placeholder-text">
                            {{ item.title }}
<!--                            {{ $tt('SHOP.', item.title) }}-->
                        </span>
            </div>
        </div>
        <div class="item-actions">
            <button class="dollar"
                    v-if="item.price_bucks && !item.was_bought"
                    @click="askBuyItem(item, 'bucks')"
            >
                {{ item.price_bucks }}<img src="/design/icons/currencies/black21.png" alt="">
            </button>
            <label class="label" v-if="item.was_bought">
                {{ $t('SHOP.Куплено') }}
            </label>
        </div>
    </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
    name: "ShopItem",
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    methods: {
        ...mapActions([
            'shopLoadItems',
        ]),
        askBuyItem(item, currency) {
            this.selectedItem = item
            this.is_show_modal = true
            this.$emit('buyButtonClick', {
                item,
                currency
            })
            // this.$refs.buyModal.buyDialog(item, currency)
        },
        onPurchaseCompleted() {
            let value = this.$route.name.replace('shop-', '');
            this.shopLoadItems(value);
        }
    },
}
</script>

<style scoped lang="scss">
.content-image-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.shop-item {
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 5px;
    border: 2px solid var(--color-background-2);
    width: 150px;
    height: 200px;
    margin: 0px 10px 15px 10px;
    position: relative;
    box-shadow: 0px 6px 4px rgba(0, 0, 0, 0.16);
    transition: transform .9s;
    transition: .1s;
    display: flex;
    flex-direction: column;

    &:hover img {
        transition: .1s;
        -webkit-filter: drop-shadow(5px 1px 7px rgba(125, 0, 255, 0.5));
        filter: drop-shadow(5px 1px 7px rgba(125, 0, 255, 0.5));
        transform: scale(1.1)

    }

    .item-content {
        height: calc(100% - 30px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        color: #ddd;

        span {
            font-weight: bold;
        }
    }

    .item-actions {
        box-sizing: border-box;

        button {
            //position: absolute;
            bottom: 0;
            width: 100%;
            background: #323639;
            border: none;
            color: white;
            cursor: pointer;
            padding: 10px 20px;

            &:focus {
                outline: none !important;
            }

            &::-moz-focus-inner {
                border: 0;
            }

            &:not(:only-child) {
                width: 50%;
            }

            &:only-child {
                /* background-color: red !important; */
                border-radius: 0 0 3px 3px;
            }

            &:not(:only-child):first-child {
                border-right: solid 1px darken(#323639, 4);
                border-bottom-left-radius: 3px;
            }

            &:not(:only-child):last-child {
                border-bottom-right-radius: 3px;
            }

            &:not(:only-child) {
                width: 50%;
            }

            &.dollar {
                display: flex;
                align-items: center;
                justify-content: center;
                left: 0;

                img {
                    margin-left: 5px;
                    position: relative;
                    top: -1px;
                }
            }

            &.bitcoin {
                right: 0;
            }

            &.dollar:hover {
                background: #16964B;
            }

            &.bitcoin:hover {
                background: #4B1696;
            }
        }

        .label {
            box-sizing: border-box;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: var(--color-purple-medium);
            border: none;
            color: white;
            cursor: pointer;
            padding: 10px 20px;
        }
    }
}
</style>
