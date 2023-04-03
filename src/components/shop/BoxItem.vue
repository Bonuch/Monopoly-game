<template>
    <div class="box-item">
        <div class="item-content">
            <div class="title__container">
                <span class="shopcatalog__item-placeholder-text">
                    {{ item.title }}
<!--                    {{ $tt('SHOP.', item.title) }}-->
                </span>
            </div>
            <div class="image__container">
                <img :src="item.image_url" style="max-height:97px">
            </div>
            <div v-if="item.description" class="box__description">
                <p>{{ $t('SHOP.Содержимое') }}</p>
                <p>{{ item.description }}</p>
<!--                <ul class="box-include__list">-->
<!--                    <li>Item 1</li>-->
<!--                    <li>Item 2</li>-->
<!--                    <li>Item 3</li>-->
<!--                </ul>-->
            </div>
        </div>
        <div class="item-actions">
            <button class="dollar"
                    v-if="item.price_bucks && !item.was_bought"
                    @click="askBuyItem(item, 'bucks')"
            >
                {{ item.price_bucks }}<img src="/design/icons/currencies/black21.png" alt="#">
            </button>
            <!--        <button class="bitcoin"-->
            <!--                v-if="item.price_crypto && !item.was_bought"-->
            <!--                @click="askBuyItem(item, 'crypto')"-->
            <!--        >-->
            <!--            {{ item.price_crypto }}B-->
            <!--        </button>-->
            <div class="label" v-if="item.was_bought">
                {{ $t('SHOP.Куплено') }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "BoxItem",
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    methods: {
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
    }
}
</script>

<style scoped lang="scss">
.box__description {
    width: 100%;

    p {
        text-align: left;
        font-size: 16px;
        font-weight: 600;
    }
}

.box-include__list {
    margin: 0;
    padding: 0;
    list-style: none;
    text-align: left;

    li {
        padding: 0;
        margin: 0;
        color: #797979;
    }
}

.title__container {
    min-height: 40px;
}

.box-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 5px;
    border: 2px solid var(--color-background-2);
    width: 264px;
    //height: 200px;
    margin: 0 10px 15px 10px;
    position: relative;
    box-shadow: 0px 6px 4px rgba(0, 0, 0, 0.16);
    transition: transform .9s;
    transition: .1s;

    &:hover img {
        transition: .1s;
        -webkit-filter: drop-shadow(5px 1px 7px rgba(125, 0, 255, 0.5));
        filter: drop-shadow(5px 1px 7px rgba(125, 0, 255, 0.5));
        transform: scale(1.1)

    }

    .item-content {
        //height: calc(100% - 30px);
        padding: 20px;
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
        display: flex;
        position: relative;
        bottom: 0;
        button {
            display: block;
            bottom: 0;
            width: 100%;
            background: #323639;
            border: none;
            color: white;
            cursor: pointer;
            padding: 10px 20px;
            font-weight: 600;
            font-size: 16px;

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
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 25px;
            background: #989b9c;
            color: white;
            cursor: default;
            line-height: 24px;
            border-radius: 0 0 5px 5px;
        }
    }
}
</style>
