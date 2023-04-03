<template>
    <div ref="center" class="board-center" style="color: #fff">
        <GameDice
            @animationStart="diceAnimated = true"
            @animationEnd="diceAnimated = false"
        />

        <div class="buttons-wrap" :class="{'buttons-wrap--blured': getBlur}">
            <div v-if="myActions" class="buttons">

                <!-- Взять кредит -->
                <button
                    v-if="myActions.get_credit && myActions.get_credit.visible"
                    type="button"
                    class="btn btn-img btn-credit"
                    :class="{active: myActions.get_credit.allowed}"
                    @click.prevent="doAction(myActions.get_credit)"
                    href="#"
                >
                    <img src="/design/game/btn-bg.png" alt="#">
                    <span>{{ $t('GAME.Взять кредит') }}</span>
                </button>

                <!-- Взять кредит -->
                <button
                    v-if="myActions.payout_credit && myActions.payout_credit.visible"
                    type="button"
                    class="btn btn-img btn-credit"
                    :class="{active: myActions.payout_credit.allowed}"
                    @click.prevent="doAction(myActions.payout_credit)"
                    href="#"
                >
                    <div class="credit_turns_left">{{ $t('GAME.Ходов осталось') }}: {{ myActions.payout_credit.credit_left }}</div>
                    <img src="/design/game/btn-bg.png" alt="#">
                    <span>{{ $t('GAME.Оплатить кредит') }}</span>
                </button>

                <!-- Предложить сделку -->
                <button
                    v-if="myActions.propose_deal && myActions.propose_deal.visible"
                    type="button"
                    class="btn btn-img btn-deal"
                    :class="{active: myActions.propose_deal.allowed}"
                    @click.prevent="toggleDealModal()"
                    href="#">
                    <img src="/design/game/btn-bg.png" alt="#">
                    <span>{{ myActions.propose_deal.label }}</span>
                </button>

                <!--  Заложить или выкупить поле -->
                <button
                    v-if="myActions.sell_cell && myActions.sell_cell.visible"
                    type="button"
                    class="btn btn-img btn-sell"
                    :class="{active: myActions.sell_cell.allowed}"
                    @click.prevent="toggleSellModal()"
                    href="#"
                >
                    <img src="/design/game/btn-bg.png" alt="#">
                    <span>{{ myActions.sell_cell.label }}</span>
                </button>


                <!--  Бросить кубики-->
                <button
                    v-if="myActions.throw_dices && myActions.throw_dices.visible"
                    type="button"
                    class="btn btn-img btn-dice"
                    :class="{active: myActions.throw_dices.allowed && !diceAnimated}"
                    @click.prevent="doAction(myActions.throw_dices)"
                    href="#"
                >
                    <img src="/design/game/btn-bg.png" alt="#">
                    <span>{{ myActions.throw_dices.label }}</span>
                </button>


                <div class="btn-group">
                    <!-- Покупка Клетки или Аукцион -->
                    <button type="button" v-if="myActions.cell_buying && !myActions.pay_for_request" class="btn btn-cell-buying active"
                            :disabled="myActions.pay_for_request"
                            @click.prevent="doAction(myActions.cell_buying)" href="#">{{ myActions.cell_buying.label }}
                    </button>
                    <button type="button" v-if="myActions.start_auction && !myActions.pay_for_request" class="btn btn-start-auction active"
                            :disabled="myActions.pay_for_request"
                            @click.prevent="doAction(myActions.start_auction)" href="#">
                        {{ myActions.start_auction.label }}
                    </button>

                    <!-- Покупка Иллюминатов/Массоны или Отказаться -->
                    <button type="button" v-if="myActions.municipality_buying && !myActions.pay_for_request"
                            :disabled="myActions.pay_for_request"
                            class="btn btn-municipality-buying active"
                            @click.prevent="doAction(myActions.municipality_buying)" href="#">
                        {{ myActions.municipality_buying.label }}
                    </button>
                    <button type="button" v-if="myActions.railway_buying && !myActions.pay_for_request" class="btn btn-railway-buying active"
                            :disabled="myActions.pay_for_request"
                            @click.prevent="doAction(myActions.railway_buying)" href="#">
                        {{ myActions.railway_buying.label }}
                    </button>
                    <button type="button" v-if="myActions.municipality_railway_ignore && !myActions.pay_for_request"
                            :disabled="myActions.pay_for_request"
                            class="btn btn-start-auction active"
                            @click.prevent="doAction(myActions.municipality_railway_ignore)" href="#">
                        {{ myActions.municipality_railway_ignore.label }}
                    </button>

                    <!-- Аукцион - сделать ставку или отказаться -->
                    <button type="button" v-if="myActions.auction_bid" class="btn btn-auction-bid active"
                            @click.prevent="doAction(myActions.auction_bid)" href="#">{{ myActions.auction_bid.label }}
                    </button>
                    <button type="button" v-if="myActions.ignore_auction" class="btn btn-ignore-auction active"
                            @click.prevent="doAction(myActions.ignore_auction)" href="#">
                        {{ myActions.ignore_auction.label }}
                    </button>

                    <!-- Выкуп из тюрьмы-->
                    <button type="button" v-if="myActions.buy_freedom" class="btn btn-buy-freedom active"
                            @click.prevent="doAction(myActions.buy_freedom)" href="#">{{ myActions.buy_freedom.label }}
                    </button>
                    <button type="button" v-if="myActions.get_freedom_chance && !myActions.pay_for_request" class="btn btn-get-freedom-chance"
                            :class="{active: myActions.get_freedom_chance && !diceAnimated}"
                            :disabled="myActions.pay_for_request"
                            @click.prevent="doAction(myActions.get_freedom_chance)" href="#">
                        {{ myActions.get_freedom_chance.label }}
                    </button>

                    <!-- Запрос какого-то платежа-->
                    <button type="button" v-if="myActions.pay_for_request" class="btn btn-pay-for-request active"
                            @click.prevent="doAction(myActions.pay_for_request)" href="#">
                        <span v-html="myActions.pay_for_request.label"></span>
                    </button>

                    <!-- плата налога (чужая клетка)-->
                    <button type="button" v-if="myActions.pay_tax" class="btn btn-pay-tax active"
                            :disabled="myActions.pay_for_request"
                            @click.prevent="doAction(myActions.pay_tax)" href="#">{{ myActions.pay_tax.label }}
                    </button>
                </div>
            </div>
            <div v-if="myMessage" class="messages">
                <div v-for="message in myMessage" v-bind:key="message.id" class="message" :class="message.style"
                     v-html="message.text"></div>
            </div>
        </div>

        <GameChat :blured="getBlur"/>

        <DealModal v-if="dealModal" @cancelDealModal="toggleDealModal()" key="dealModalWindow"/>
        <DealProposalModal v-if="toggleDealProposalModal" :deal="toggleDealProposalModal" key="sellDealProposalWindow"/>
        <SellModal v-if="sellModal" @cancelSellModal="toggleSellModal()" key="sellModalWindow"/>
        <ManinhatModal v-if="myActions && myActions.maninhat" :actions="myActions.maninhat" key="mainHatModalWindow"/>
        <JailOrRouletteDesktop v-if="myActions && myActions.roulette" :actions="myActions.roulette" key="jailOrRulettelWindow"/>

        <LoserModal v-if="getGameLoser" key="loserModalWindow"/>
        <WinnerModal v-if="currentPlayer && isPlayerWin" :current-player="currentPlayer || {}" key="winnerModalWindow"/>
        <WinnerModalForSpectator v-if="gameStore.finish && !getGameLoser" :finish="gameStore.finish" key="winnerModalSpecWindpw"/>
        <UserProfileModal v-if="getGameModalName === 'GameModalUserProfile'" key="userProfileModalWindow"/>
        <GameNotification/>
        <transition name="fade">
            <div class="overlay" v-if="showOverlay || isPlayerWin" key="overlayDiv"></div>
        </transition>
    </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import GameChat from '@/components/game/game-chat/GameChat.vue';
import GameDice from "./DiceBoard";
//-------------- OLD DICE ------------
//import GameDice from './GameDice';
//------------------------------------
import DealModal from "./DealModal";
import DealProposalModal from "./DealProposalModal";
import SellModal from "./SellModal";
import ManinhatModal from "./ManinhatModal";
import JailOrRouletteDesktop from "./JailOrRouletteDesktop";
import LoserModal from "./LoserModal";
import WinnerModal from "./WinnerModal";
import WinnerModalForSpectator from "./WinnerModalForSpectator";
import UserProfileModal from './modals/UserProfileModal';
import GameNotification from "./GameNotification";

export default {
    name: 'GameBoardCenter',
    components: {
        GameNotification,
        GameChat,
        GameDice,
        DealModal,
        DealProposalModal,
        SellModal,
        ManinhatModal,
        JailOrRouletteDesktop,
        LoserModal,
        WinnerModal,
        WinnerModalForSpectator,
        UserProfileModal,
    },
    props: {
        currentPlayer: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            dealModal: false,
            DealProposalModal: false,
            sellModal: false,
            manInHatModal: true,
            isPlayerWin: false,
            diceAnimated: false,
            userTurn: [],
        }
    },
    computed: {
        ...mapGetters([
            'gamePlayers',
            'gameStore',
            'currentUser',
            'getGameLoser',
            'getGameModalName',
            'getBlur',
        ]),
        myActions() {
            const actions = this.$store.getters.getPlayerById(this.currentUser.uuid);
            return actions ? actions.availableActions : null;
        },
        myMessage() {
            const player = this.$store.getters.getPlayerById(this.currentUser.uuid);
            return player ? player.message : null;
        },
        toggleDealProposalModal() {
            const deal = this.gamePlayers.filter(pl => {
                return (pl.uuid === this.currentUser.uuid);
            }).map(pl => pl.offeredDeal);
            return deal[0];
        },
        showOverlay() {
            return this.getGameLoser ||
                this.getGameModalName ||
                this.gameStore.finish && !this.getGameLoser;
        }
    },
    watch: {
        'gameStore.userTurn': function (val, old) {
            if (val === this.currentUser.uuid) {
                const switchTurn = new Audio('/samples/swoosh.ogg')
                switchTurn.play()
            }
        },
        'currentPlayer.winner': function (val, old) {
            if (val) {
               setTimeout(() => {this.isPlayerWin = true}, 3000)
            }
        },
    },
    methods: {
        ...mapMutations(['setBlur']),
        ...mapActions([
            'sendGameAction',
        ]),
        async doAction(action, params = {}) {
            console.log('GAME ACTION ROUTE', action.route)
            if (action.allowed) {
                await this.sendGameAction({route: `game_${action.route}`, params});
            } else {
                if (action.reason) this.$dialog.alert(action.reason);
            }
        },
        toggleDealModal() {
            if (this.myActions.propose_deal && this.myActions.propose_deal.allowed) {
                this.$store.commit('clearDeal');
                this.dealModal = !this.dealModal;
                this.$store.commit('setDealOpen', this.dealModal);
                this.setBlur(!this.getBlur);
            }
        },
        toggleSellModal() {
            if (this.myActions.sell_cell && this.myActions.sell_cell.allowed) {
                this.$store.commit('clearSell');
                this.sellModal = !this.sellModal;
                this.$store.commit('setSellOpen', this.sellModal);
                this.setBlur(!this.getBlur);
            }
        },
    },
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

.fade-enter-active {
    transition: opacity .6s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

.fade-leave-active {
    transition-duration: 0.9s;
}

.overlay {
    position: fixed;
    z-index: 9980;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(14px);
}

.credit_turns_left {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100% - 45px);
    font-size: 22px;
    font-weight: 600;
    color: #fff;
    background: rgba(#000, .2);
    backdrop-filter: blur(2px);
}

.board-center {
    padding: 15px;
    flex: 1;
    text-align: center;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;

    .buttons-wrap {
        width: 100%;
        height: 49%;

        &--blured {
            filter: blur(3px);
        }
    }
}
.pulseAnim {
    animation-name: pulseShadow;
    animation-duration: 1.5s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
}
.btn-get-freedom-chance.active {
    @extend .pulseAnim;
}

.btn:disabled {
    background: rgba(#fff, .5) !important;
}
.buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .btn-wrap {
        width: 145px;
    }

    .btn {
        overflow: hidden;
        border-radius: 2px;
        padding: 0;
        border: none;
        width: 145px;
        display: block;
        position: relative;
        background-color: #fff;
        text-decoration: none;
        color: #000;
        font-size: 14px;
        line-height: 15px;
        opacity: 0.5;
        cursor: default;
        margin-bottom: 10px;
        @media screen and (max-width: 1366px){
            width: 130px;
            //height: 130px;
        }
        @media screen and (max-width: 1180px){
            width: 121px;
            //height: 130px;
        }
        @media screen and (max-width: 980px){
            width: 121px;
        }
        //&:after {
        //    content: '';
        //    position: absolute;
        //    width: 100%;
        //    height: 4px;
        //    bottom: 0;
        //    left: 0;
        //    background: linear-gradient(316.55deg, #FABD2F 46%, #FA5846 111.16%), linear-gradient(180deg, #4A2996 0%, #5835B0 100%), #FFFFFF;
        //    border-radius: 0 0 5px 5px;
        //}

        &.btn-dice:after {
            background: linear-gradient(292.57deg, #FABD2F -13.04%, #FA5846 38.47%), linear-gradient(180deg, #4A2996 0%, #5835B0 100%), #FFFFFF;
        }


        &.btn-dice.active {
            @extend .pulseAnim;
        }

        &.btn-sell:after {
            background: linear-gradient(180deg, #4A2996 0%, #5835B0 100%), #FFFFFF;
        }

        &.btn-deal:after {
            background: linear-gradient(0.37deg, #971A1A -23.64%, #E6438F 242.88%), linear-gradient(180deg, #4A2996 0%, #5835B0 100%);
        }

        &.btn-cell-buying:after {
            background: linear-gradient(292.57deg, #2FFA38 -13.04%, #46FA58 38.47%), linear-gradient(180deg, #4A2996 0%, #5835B0 100%), #FFFFFF;
        }

        &.btn-start-auction:after {
            background: linear-gradient(292.57deg, #FA2F2F -13.04%, #FA5846 38.47%), #FFFFFF;
        }

        &.btn-municipality-buying:after {
            background: linear-gradient(292.57deg, #2FFA38 -13.04%, #46FA58 38.47%), linear-gradient(180deg, #4A2996 0%, #5835B0 100%), #FFFFFF;
        }

        &.btn-railway-buying:after {
            background: linear-gradient(292.57deg, #2FFA38 -13.04%, #46FA58 38.47%), linear-gradient(180deg, #4A2996 0%, #5835B0 100%), #FFFFFF;
        }

        &.btn-start-auction:after {
            background: linear-gradient(292.57deg, #FA2F2F -13.04%, #FA5846 38.47%), #FFFFFF;
        }

        &.btn-auction-bid:after {
            background: linear-gradient(292.57deg, #FA2F2F -13.04%, #FA5846 38.47%), #FFFFFF;
        }

        &.btn-ignore-auction:after {
            background: linear-gradient(292.57deg, #FA2F2F -13.04%, #FA5846 38.47%), #FFFFFF;
        }

        &.btn-pay-for-request:after {
            background: linear-gradient(292.57deg, #FA2F2F -13.04%, #FA5846 38.47%), #FFFFFF;
        }

        &.active {
            opacity: 1;
            cursor: pointer;
        }

        &.btn-img {
            border-radius: 5px;
            img {
                height: 105px;
                object-fit: cover; /* TODO удалить */
                width: 100%;
            }

            span {
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                //display: block;
                padding: 3px 10px;
                height: 40px;
                background-color: #fff;
                border-radius: 2px;
            }
            &::after {
                display: none;
            }
        }
    }

    .btn-group {
        display: flex;
        flex-wrap: wrap;
        width: 145px;
        align-content: space-between;

        @media screen and (max-width: 1366px) {
            width: 130px;
        }

        button {
            padding: 7px;
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            height: 49%;
            align-items: center;
            justify-content: center;
        }
    }
}

@keyframes pulseShadow {
    0% {
        box-shadow: 0px 0px 0px var(--color-yellow-dark);
    }
    50% {
        box-shadow: 0px 0px 20px var(--color-yellow-light);
    }
    0% {
        box-shadow: 0px 0px 0px var(--color-yellow-dark);
    }
}

.messages {
    line-height: 22px;
    text-align: center;
    font-weight: 600;
    font-size: 18px;
    padding-top: 22px;
    color: #DBD097;

    .message {
        padding-bottom: 10px;

        &.small {
            color: #FFF9DA;
        }
    }
}

.btn-pay-for-request {
    height: auto !important;
}

</style>
