<template>
    <div class="deal-modal">
        <div class="title">{{ $t('GAME_DIALOGS.Заложить или выкупить поле') }}</div>
        <div class="columns-wrap">
            <div class="col col-left">
                <div class="info">{{ $t('GAME_DIALOGS.Кликните на свои не заложенные поля что бы заложить их') }}</div>
                <div class="list">
                    <div class="scroll-wrap">
                        <div v-for="item in sellItems" class="item">
                            <img v-if="item.image" :src="item.image">
                            <span @click="sellDeleteSell(item.id)" class="delete"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col-right">
                <div class="info">{{ $t('GAME_DIALOGS.Кликните на свои заложенные поля что бы выкупить их') }}</div>
                <div class="list">
                    <div class="scroll-wrap">
                        <div v-for="item in buyItems" class="item">
                            <img v-if="item.image" :src="item.image">
                            <span @click="buyDeleteSell(item.id)" class="delete"></span>
                            <div v-if="item.is_bailed" class="bailed">
                                <div class="lock">
                                    <img src="/design/game/lock.svg" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="total total-left">{{ $t('GAME_DIALOGS.Вы получите') }}: {{sellAmountResult}}B</div>
            <div class="total total-right">{{ $t('GAME_DIALOGS.Вы отдадите') }}: {{buyAmountResult}}B</div>
        </div>
        <div class="warding">
            <div v-if="wardingAmount" class="warding-wrap">
                {{ $t('GAME_DIALOGS.Недостаточно денег для выкупа') }}
            </div>
        </div>
        <div class="btn-wrap">
            <a @click.prevent="submit()" class="submit" href="#">{{ $t('GENERAL.Отправить') }}</a>
            <a @click.prevent="cancel()" class="cancel" href="#">{{ $t('GENERAL.Отменить') }}</a>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        name: 'SellModal',
        data() {
            return {
                submitActive: false,
            }
        },
        components: {},
        computed: {
            ...mapGetters([
                'sellState',
                'gameCells',
                'gamePlayers',
                'currentUser',
            ]),
            sellItems() {
                let items = [];
                if (this.sellState.sellItems) {
                    this.sellState.sellItems.forEach(item => {
                        const cell = {...this.cellState(item)};
                        if (cell.image) {
                            // меняем ориентацию картинки на горизонтальную
                            cell.image = cell.image.replace('-v.', '-h.');
                        }
                        items.push(cell);
                    });
                }
                return items;
            },
            buyItems() {
                let items = [];
                if (this.sellState.buyItems) {
                    this.sellState.buyItems.forEach(item => {
                        const cell = {...this.cellState(item)};
                        if (cell.image) {
                            // меняем ориентацию картинки на горизонтальную
                            cell.image = cell.image.replace('-v.', '-h.');
                        }
                        items.push(cell);
                    });
                }
                return items;
            },
            sellAmountResult() {
                let amount = 0;
                this.sellItems.forEach(item => {

                    console.log('item', item);

                    const price = item.prices ? item.prices.purchase_price : item.price;
                    amount += price / 100 * 50;
                });
                return amount;
            },
            buyAmountResult() {
                let amount = 0;
                this.buyItems.forEach(item => {
                    const price = item.prices ? item.prices.purchase_price : item.price;
                    amount += price / 100 * 60;
                });
                return amount;
            },
            requestBalance() {
                return this.getPlayerBalance(this.dealState.userId);
            },
            wardingAmount() {
                this.submitActive = false;
                let amount = this.getPlayerBalance(this.currentUser.uuid) + this.sellAmountResult;
                if (amount < this.buyAmountResult) {
                    this.submitActive = true;
                    return true;
                }
                return false;
            },
        },
        methods: {
            cancel() {
                this.$emit('cancelSellModal');
            },
            submit() {
                if (!this.submitActive) {
                    if (this.sellState.sellItems.length) {
                        this.$socket.client.emit('game_bail_cell', this.sellState.sellItems, (response) => {
                            if (this.sellState.buyItems.length) {
                                this.$socket.client.emit('game_redeem_cell', this.sellState.buyItems, (response) => {
                                    this.$emit('cancelSellModal');
                                });
                            } else {
                                this.$emit('cancelSellModal');
                            }

                        });

                    } else if (this.sellState.buyItems.length) {
                        this.$socket.client.emit('game_redeem_cell', this.sellState.buyItems, (response) => {
                            this.$emit('cancelSellModal');
                        });
                    }



                }
            },
            cellState(cellId) {
                const cell = this.gameCells.find(cell => {
                    if (cell.id == cellId) {
                        return cell;
                    }
                });
                return cell;
            },
            sellDeleteSell(cellId) {
                this.$store.commit('toggleSellSellItems', cellId);
            },
            buyDeleteSell(cellId) {
                this.$store.commit('toggleSellBuyItems', cellId);
            },
            getPlayerBalance(uuid) {
                const player = this.gamePlayers.find(player => {
                    if (player.uuid == uuid) {
                        return player.balance
                    }
                });
                return player ? player.balance : 0;
            },
        },
        created() {
        }
    }
</script>
<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
    .deal-modal {
        text-align: left;
        padding: 15px 40px 10px;
        position: absolute;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(14px);
        max-height: 490px;
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
                        &>img {
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
        .warding {
            height: 40px;
            font-size: 14px;
            line-height: 17px;
            .warding-wrap {
                position: relative;
                &:after {
                    content: '';
                    position: absolute;
                    width: 13px;
                    height: 11px;
                    top: 0;
                    left: -16px;
                    background-image: url('/design/game/warding-icon.svg');
                    background-size: cover;
                }
            }
        }
        .btn-wrap {
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
