<template>
    <div class="deal-modal">
        <div class="title">{{ $t('GAME_DIALOGS.Составление договора') }}</div>
        <div class="columns-wrap">
            <div class="col col-left">
                <div class="info">{{ $t('GAME_DIALOGS.Кликните на свои поля чтобы предложить их') }}</div>
                <div class="list">
                    <div class="scroll-wrap">
                        <div v-for="item in offerItems" class="item" :key="item.id">
                            <img v-if="item.image" :src="item.image" alt="#">
                            <span @click="offerDeleteCell(item.id)" class="delete"></span>
                            <div v-if="item.is_bailed" class="bailed">
                                <div class="lock">
                                    <img src="/design/game/lock.svg" alt="#">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DealInputAmount :model.sync="offerAmount" :max-amount="maxOfferInput"
                                 :text="$t('GAME_DIALOGS.Предложить денег')"/>
            </div>
            <div class="col col-right">
                <div v-if="!dealUser" class="info" key="dealUserModalWindowTip">
                    {{ $t('GAME_DIALOGS.Кликните на поля или на карточку игрока что бы запросить обмен') }}
                </div>
                <div v-if="!!dealUser" class="info" key="dealUserModalWindow">{{ $t('GAME_DIALOGS.Обмен с') }}
                    {{ dealUser.name }}
                </div>
                <div class="list">
                    <div class="scroll-wrap">
                        <div v-for="item in requestItems" class="item" :key="item.id">
                            <img v-if="item.image" :src="item.image" alt="#">
                            <span @click="requestDeleteCell(item.id)" class="delete"></span>
                            <div v-if="item.is_bailed" class="bailed">
                                <div class="lock">
                                    <img src="/design/game/lock.svg" alt="#">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DealInputAmount :model.sync="requestAmount" :max-amount="requestBalance"
                                 :text="$t('GAME_DIALOGS.Запросить денег')"/>
            </div>
            <div class="total total-left">{{ $t('GAME_DIALOGS.Итого') }}: {{ offerAmountResult }}B</div>
            <div class="total total-right">{{ $t('GAME_DIALOGS.Итого') }}: {{ requestAmountResult }}B</div>
        </div>
        <div class="warding">
            <div v-if="dealAmountVlidator" class="warding-wrap" key="dealAmmountValidator">
                {{ $t('GAME_DIALOGS.Итоговые суммы слишком различаются') }} <br>
                <span v-if="this.offerAmountResult > this.requestAmountResult">
                  {{ $t('GAME_DIALOGS.Уменьшите сумму слева хотя бы до') }}
                  {{ dealAmountVlidator.requestDifference }}
                  {{ $t('GAME_DIALOGS.или увеличте правую хотя бы до') }}
                  {{ dealAmountVlidator.offerDifference }}B
              </span>
                <span v-else>
                  {{ $t('GAME_DIALOGS.Увеличте сумму слева хотя бы до') }}
                  {{ dealAmountVlidator.offerDifference }}
                  {{ $t('GAME_DIALOGS.или уменьшите правую хотя бы до') }}
                  {{ dealAmountVlidator.requestDifference }}B
              </span>
            </div>
        </div>
        <div class="btn-wrap">
            <button @click.prevent="submit()" class="submit" :class="[{disabled: !submitActive}]" href="#">
                {{ $t('GENERAL.Отправить') }}
            </button>
            <button @click.prevent="cancel()" class="cancel" href="#">{{ $t('GENERAL.Отменить') }}</button>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import DealInputAmount from "./DealInputAmount";


export default {
    name: 'DealModal',
    data() {
        return {
            offerAmount: 0,
            maxOfferInput: 0,
            requestAmount: 0,
            submitActive: false,
        }
    },
    components: {DealInputAmount},
    computed: {
        ...mapGetters([
            'dealState',
            'gameCells',
            'gamePlayers',
            'currentUser',
        ]),
        offerItems() {
            let items = [];
            if (this.dealState.offerConditions.items) {
                this.dealState.offerConditions.items.forEach(item => {
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
        requestItems() {
            let items = [];
            if (this.dealState.requestConditions.items) {
                this.dealState.requestConditions.items.forEach(item => {
                    const cell = {...this.cellState(item)};
                    console.log(cell)
                    if (cell.image) {
                        // меняем ориентацию картинки на горизонтальную
                        cell.image = cell.image.replace('-v.', '-h.');
                    }
                    items.push(cell);
                });
            }
            return items;
        },
        offerAmountResult() {
            this.$store.commit('updateOfferAmount', this.offerAmount);
            let amount = this.offerAmount;
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
            this.$store.commit('updateRequestAmount', this.requestAmount);
            let amount = this.requestAmount;
            this.requestItems.forEach(item => {
                if (item.is_bailed) {
                    amount += item.prices.purchase_price - (item.prices.purchase_price / 100 * 60);
                } else {
                    amount += item.prices.purchase_price;
                }
            });
            return amount;
        },
        requestBalance() {
            const player = this.dealUser;
            return player ? player.balance : 0;
        },
        dealAmountVlidator() {
            this.submitActive = false;
            const maxRequestAmount = this.offerAmountResult * 1.5;
            const maxOfferAmount = this.requestAmountResult * 1.5;
            if (this.offerAmountResult > maxOfferAmount) {
                return {
                    offerDifference: this.differenceCalculation(this.offerAmountResult, this.requestAmountResult),
                    requestDifference: maxOfferAmount,
                }
            }
            if (this.requestAmountResult > maxRequestAmount) {
                return {
                    offerDifference: this.differenceCalculation(this.requestAmountResult, this.offerAmountResult),
                    requestDifference: maxRequestAmount,
                }
            }
            if (this.requestAmountResult && this.offerAmountResult) {
                this.submitActive = true;
            }
            return false;
        },
        dealUser() {
            return this.getPlayer(this.dealState.userId);
        },
    },
    methods: {
        cancel() {
            this.$emit('cancelDealModal');
        },
        submit() {
            if (this.submitActive) {
                this.$socket.client.emit('game_propose_deal', {
                    userId: this.dealState.userId,
                    offerConditions: {
                        items: this.dealState.offerConditions.items,
                        amount: this.dealState.offerConditions.amount,
                    },
                    requestConditions: {
                        items: this.dealState.requestConditions.items,
                        amount: this.dealState.requestConditions.amount,
                    }
                }, (response) => {
                    this.$emit('cancelDealModal');
                });
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
        offerDeleteCell(cellId) {
            this.$store.commit('toggleDealOfferItems', cellId);
        },
        requestDeleteCell(cellId) {
            this.$store.commit('toggleDealRequestItems', cellId);
            if (!this.dealState.requestConditions.items.length) {
                this.$store.commit('setDealUserId', null);
            }
        },
        getPlayer(uuid) {
            const player = this.gamePlayers.find(player => {
                return (player.uuid == uuid);
            });
            return player || false;
        },
        offerBalance() {
            const player = this.getPlayer(this.currentUser.uuid);
            this.maxOfferInput = player ? player.balance : 0;
        },
        differenceCalculation(a, b) {
            const x = (((a * 2) - (b * 3)) / 3) + b;
            return Math.ceil(x);
        }
    },
    created() {
        this.offerBalance();
    },
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

.deal-modal {
    z-index: 999;
    position: absolute;
    left: 15px;
    right: 15px;
    bottom: 15px;
    height: 512px;
    padding: 15px 40px 10px;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(14px);
    color: #000;
    text-align: left;
    top: 50%;
    transform: translateY(-50%);

    @media screen and (max-width: 1366px){
        height: 530px;
    }

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
                min-height: 44px;
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
                    //justify-content: space-between;
                }

                .item {
                    //width: 48%;
                    width: 70px;
                    height: 70px;
                    margin-bottom: 10px;
                    background-color: #fff;
                    position: relative;
                    margin-right: 10px;

                    & > img {
                        object-fit: contain;
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

        button {
            border: none;
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

