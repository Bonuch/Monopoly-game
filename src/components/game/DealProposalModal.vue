<template>
    <div class="deal-modal">
        <div class="title">{{ $t("GAME_DIALOGS.Вам предложена сделка") }}</div>
        <div class="columns-wrap">
            <div class="col col-left">
                <div class="info">{{ $t("GAME_DIALOGS.Вы получите") }}</div>
                <div class="list">
                    <div class="scroll-wrap">
                        <div v-for="item in offerItems" class="item">
                            <img v-if="item.image" :src="item.image">
                            <div v-if="item.is_bailed" class="bailed">
                                <div class="lock">
                                    <img src="/design/game/lock.svg" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col-right">
                <div class="info">{{ $t("GAME_DIALOGS.Вы отдадите") }}</div>
                <div class="list">
                    <div class="scroll-wrap">
                        <div v-for="item in requestItems" class="item">
                            <img v-if="item.image" :src="item.image">
                            <div v-if="item.is_bailed" class="bailed">
                                <div class="lock">
                                    <img src="/design/game/lock.svg" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="total total-left">{{ $t("GAME_DIALOGS.Итого") }}: {{ offerAmountResult() }}B</div>
            <div class="total total-right">{{ $t("GAME_DIALOGS.Итого") }}: {{ requestAmountResult() }}B</div>
        </div>
        <div class="btn-wrap">
            <a @click.prevent="submit()" class="submit" href="#">{{ $t("GAME_DIALOGS.Согласиться") }}</a>
            <a @click.prevent="cancel()" class="cancel" href="#">{{ $t("GENERAL.Отменить") }}</a>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "DealModal",
    props: {
        deal: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {};
    },
    components: {},
    computed: {
        ...mapGetters([
            "gameCells",
            "gamePlayers",
        ]),
        offerItems() {
            let items = [];
            if (this.deal.offerConditions.items) {
                this.deal.offerConditions.items.forEach(item => {
                    const cell = { ...this.cellState(item) };
                    if (cell.image) {
                        // меняем ориентацию картинки на горизонтальную
                        cell.image = cell.image.replace("-v.", "-h.");
                    }
                    items.push(cell);
                });
            }
            return items;
        },
        requestItems() {
            let items = [];
            if (this.deal.requestConditions.items) {
                this.deal.requestConditions.items.forEach(item => {
                    const cell = { ...this.cellState(item) };
                    if (cell.image) {
                        // меняем ориентацию картинки на горизонтальную
                        cell.image = cell.image.replace("-v.", "-h.");
                    }
                    items.push(cell);
                });
            }
            return items;
        },
    },
    methods: {
        cancel() {
            this.$socket.client.emit("game_decline_deal", {}, (response) => {
                console.log(response);
            });
        },
        submit() {
            this.$socket.client.emit("game_accept_deal", {}, (response) => {
                console.log(response);
            });
        },
        cellState(cellId) {
            const cell = this.gameCells.find(cell => {
                if (cell.id == cellId) {
                    return cell;
                }
            });
            return cell;
        },

        offerAmountResult() {
            let amount = this.deal.offerConditions.amount;
            this.offerItems.forEach(item => {
                if (item.is_bailed) {
                    amount += item.prices.purchase_price - (item.prices.purchase_price / 100 * 60);
                } else {
                    amount += item.prices.purchase_price;
                }
            });
            return amount;
        },
        requestAmountResult() {
            let amount = this.deal.requestConditions.amount;
            this.requestItems.forEach(item => {
                if (item.is_bailed) {
                    amount += item.prices.purchase_price - (item.prices.purchase_price / 100 * 60);
                } else {
                    amount += item.prices.purchase_price;
                }
            });
            return amount;
        },
    },
    created() {
    },
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

.deal-modal {
    text-align: left;
    padding: 15px 40px 10px;
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(14px);
    max-height: 472px;
    left: 15px;
    top: 15px;
    right: 15px;
    bottom: 15px;
    z-index: 999;
    color: #000;

    .title {
        font-weight: 600;
        font-size: 18px;
        padding-bottom: 10px;
        text-align: center;
    }

    .columns-wrap {
        border-top: 1px solid #ADADAD;
        display: flex;
        flex-wrap: wrap;

        .col {
            padding: 10px;
            width: 50%;

            .info {
                padding-bottom: 10px;
                font-weight: 600;
                font-size: 14px;
                line-height: 17px;
            }

            .list {
                height: 240px;
                overflow-y: auto;
                padding-right: 7px;
                padding-top: 2px;
                margin-bottom: 10px;

                &::-webkit-scrollbar-track {
                    border-radius: 10px;
                    background-color: #ababab;
                }

                &::-webkit-scrollbar {
                    width: 4px;
                    background-color: transparent;
                }

                &::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background-color: #262c2f;
                }

                .scroll-wrap {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                }

                .item {
                    width: 48%;
                    height: 70px;
                    margin-bottom: 10px;
                    background-color: #fff;
                    position: relative;

                    & > img {
                        width: 100%;
                        height: 100%;
                    }

                    .delete {
                        position: absolute;
                        background-image: url(/design/game/close-white.svg);
                        background-repeat: no-repeat;
                        background-position: center;
                        width: 17px;
                        height: 17px;
                        top: -2px;
                        right: -4px;
                        z-index: 1;
                        cursor: pointer;
                        background-color: #473D3D;
                        border-radius: 5px;
                    }

                    &:nth-last-child(-n+2) {
                        margin-bottom: 0;
                    }

                    .bailed {
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(87, 87, 87, 0.6);

                        .lock {
                            position: absolute;
                            border-radius: 6px;
                            background-color: #473D3D;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 18px;
                            height: 18px;
                            transform: translateY(-50%);
                            top: 50%;
                            right: -4px;
                        }
                    }
                }
            }

            &-left {
                border-right: 1px solid #7E7E7E;
            }
        }

        .total {
            margin-top: 3px;
            width: 50%;
            padding: 7px 25px;
            font-weight: 600;
            font-size: 18px;
            border-top: 1px solid #ADADAD;

            &-left {
                text-align: right;
            }
        }
    }

    .btn-wrap {
        padding-top: 40px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        a {
            text-align: center;
            display: block;
            margin: 0 15px;
            font-size: 15px;
            width: 135px;
            padding: 10px;
            color: #fff;
            text-decoration: none;
            border-radius: 3px;

            &.submit {
                background: #6A1ED5;
            }

            &.cancel {
                background: #250255;
            }

            &.disabled {
                opacity: 0.38;
            }
        }
    }
}
</style>

