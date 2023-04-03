<template>
    <div
        ref="cell"
        class="cell"
        :data-monopoly_group_id="cellState.group_id"
        :id="`cell-${id}`"
        :class="[
                cellPosition,
                {disabled: cellOpacity},
                {disabled: cellOpacityDealProposalModal},
                {disabled: isHoveredPlayerCard},
                {active: cellState.type === 'active'}
            ]"
        :data-direction="direction"
        :style="cellBgColor"
        @click="toggleCell()"
    >
        <div v-if="cellState.price_label" class="cell-price">
            <span v-if="cellState.multipliers && cellState.owner_id">X{{cellState.price_label}}</span>
            <span v-else>
                <img class="boost" v-if="cellState.boost" src="/design/game/boost-icon.svg">
                {{cellState.price_label}}B
            </span>
        </div>
        <div v-if="cellState.monopoly_color" :style="`background-color: ${this.cellState.monopoly_color}`" class="cell-color"></div>
        <div class="bg__image__wrapper">
            <img v-if="cellState.image" :src="cellState.image" alt="#" class="bg-img" v-click-outside="hideUpgradePrices" @click="showUpgradePrices">
        </div>
        <div v-if="cellState.is_bailed || cellState.block" class="bailed">
            <div class="lock" :class="{animated: !cellState.block && cellState.is_bailed < 4 && cellOwner.uuid == currentUser.uuid}">
                <img src="/design/game/lock.svg" alt="">
                <span v-if="cellState.is_bailed && cellOwner.uuid == currentUser.uuid">{{cellState.is_bailed}}</span>
                <span v-if="cellState.block && cellOwner.uuid == currentUser.uuid">{{cellState.block}}</span>
            </div>
        </div>

        <div v-if="cellState.prices && cellState.prices.upgrades_number && !cellState.is_bailed" class="upgrade" :class="position">
            <div v-if="cellState.prices.upgrades_number < 5" class="upgrade-wrap">
                <img v-for="(upgrade, index) in cellState.prices.upgrades_number" src="/design/game/vip.svg" alt="#" :key="index">
            </div>
            <div v-else class="upgrade-wrap">
                <img class="big-star" src="/design/game/vip.svg" alt="#">
            </div>
        </div>

        <game-cell-prices v-if="upgradePricesVisibility" @toggle-upgrade-prices="hideUpgradePrices" :position="position" :id="id"/>
        <span v-if="upgradePricesVisibility" :class="direction" class="game-cell-prices-arrow"></span>

        <!-- debug -->
        <button class="debug-throw-dices" v-if="myActions && myActions.throw_dices && myActions.throw_dices.visible && myActions.throw_dices.allowed" @click="throwDebugDices(id)">Testing: <br>Go to this cell</button>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import GameCellPrices from "./GameCellPrices";
import ClickOutside from 'vue-click-outside';
import { pSBC } from '@/helpers/psbc.js';

export default {
    name: 'GameCell',
    components: {GameCellPrices},
    props: {
        id: {
            type: Number,
            required: true,
        },
        position: null,
        direction: null,
    },
    data() {
        return {
            upgradePricesVisibility: false,
        }
    },
    computed: {
        ...mapGetters([
            'currentUser',
            'gamePlayers',
            'dealState',
            'sellState',
            'maninhatState',
            'getPlayerCardHovered',
            'isDealOpen',
            'isSellOpened'
        ]),
        isHoveredPlayerCard() {
            if (!this.getPlayerCardHovered) {
                return false
            }
            if (!this.cellOwner) {
                return true
            }
            return this.getPlayerCardHovered.uuid !== this.cellOwner.uuid
        },
        cellPosition() {
            return `cell-${this.position}`;
        },
        cellState() {
            return this.$store.getters.getCellById(this.id);
        },
        cellBgColor() {
            if (this.cellState.type == 'masons') {
                return {
                    background: this.cellMasonsBgColor() + "88",
                }
            }
            let outCol = !!this.cellOwner ? this.cellOwner.background.color : '#fff';
            outCol = pSBC(0.22, outCol, false, true)
            return {
                backgroundColor: outCol,
            }
        },
        cellOwner() {
            for (const pl of this.gamePlayers) { // ownedCells
                if (pl.ownedCells.includes(parseInt(this.id))) {
                    return pl;
                }
            }
            return null;
        },
        cellOpacity() {
            let disabled = false;

            if (this.dealState.opened) {
                if (!this.cellOwner) {
                    disabled = true;
                }

                if (this.cellState.block) {
                    disabled = true;
                }

                const monopolies = this.$store.getters.getCellsByMonopolyId(this.cellState.group_id);
                if (monopolies.find(cell => { return cell.prices && cell.prices.upgrades_number && cell.group_id !== 0})) {
                    disabled = true;
                }

                if (this.dealState.userId && this.cellOwner) {
                    if ((this.dealState.userId !== this.cellOwner.uuid)
                        && (this.cellOwner.uuid !== this.currentUser.uuid)) {
                        disabled = true;
                    }
                }
            }

            if (this.sellState.opened) {
                if (!this.cellOwner) {
                    disabled = true;
                }

                if (this.cellState.block) {
                    disabled = true;
                }

                const monopolies = this.$store.getters.getCellsByMonopolyId(this.cellState.group_id);

                if (monopolies.find(cell => { return cell.prices && cell.prices.upgrades_number && cell.group_id !== 0})) {
                    disabled = true;
                }

                if (this.cellOwner && this.cellOwner.uuid !== this.currentUser.uuid) {
                    disabled = true;
                }
            }

            if (this.maninhatState.maninhat && this.maninhatState.monopoly_id) {
                if (this.cellState.group_id !== this.maninhatState.monopoly_id) {
                    disabled = true;
                }
            }

            return disabled;
        },
        checkDealProposalModal() {
            const deal = this.gamePlayers.filter(pl => {
                return (pl.uuid === this.currentUser.uuid);
            }).map(pl => pl.offeredDeal);
            return deal[0];
        },
        cellOpacityDealProposalModal() {
            let disabled = false;
            if (this.checkDealProposalModal) {
                const items = this.checkDealProposalModal.offerConditions.items.concat(this.checkDealProposalModal.requestConditions.items);
                let index = items.indexOf(this.id);
                if (index === -1) {
                    disabled = true;
                }
            }
            return disabled;
        },
        myActions() {
            const actions = this.$store.getters.getPlayerById(this.currentUser.uuid);
            return actions ? actions.availableActions : null;
        }
    },
    methods: {
        ...mapActions([
            'throwDicesTesting',
        ]),
        async throwDebugDices(id) {
            console.log('mya act throw', this.myActions.throw_dices.allowed)
            if (this.myActions && this.myActions.throw_dices.allowed && !this.isDealOpen && !this.isSellOpened) {
                await this.throwDicesTesting(id)
            }
        },
        showUpgradePrices() {
            if (!this.dealState.opened && !this.sellState.opened && (this.cellState.type == 'active' || this.cellState.type == 'masons') && !this.maninhatState.boost) {
                this.upgradePricesVisibility = !this.upgradePricesVisibility;
            }
        },
        hideUpgradePrices () {
            this.upgradePricesVisibility = false;
        },
        toggleCell() {
            //Добавляем в сделку
            const monopolies = this.$store.getters.getCellsByMonopolyId(this.cellState.group_id);
            const cellsUpgrade = monopolies.find(cell => (cell.prices && cell.prices.upgrades_number && cell.group_id !== 0));
            if (this.dealState.opened && this.cellOwner  && !cellsUpgrade && !this.cellState.block) {
                if (!this.dealState.userId && (this.cellOwner.uuid !== this.currentUser.uuid)) {
                    this.$store.commit('setDealUserId', this.cellOwner.uuid);
                }
                if (this.dealState.userId === this.cellOwner.uuid) {
                    this.$store.commit('toggleDealRequestItems', this.id);
                }
                if (this.cellOwner.uuid == this.currentUser.uuid) {
                    this.$store.commit('toggleDealOfferItems', this.id);
                }
                if (!this.dealState.requestConditions.items.length && this.currentUser.uuid != this.cellOwner.uuid) {
                    this.$store.commit('setDealUserId', null);
                }
            }
            //Добавляем в залог
            if (this.sellState.opened && this.cellOwner && this.cellOwner.uuid == this.currentUser.uuid &&  !cellsUpgrade && !this.cellState.block) {
                if (this.cellState.is_bailed) {
                    this.$store.commit('toggleSellBuyItems', this.id);
                } else {
                    this.$store.commit('toggleSellSellItems', this.id);
                }
            }
            //Добавляем в BOOST
            if (this.maninhatState.boost && this.cellOwner && this.cellOwner.uuid == this.currentUser.uuid && this.cellOwner.monopolies.includes(this.cellState.group_id)) {
                this.$store.commit('setBoostMonopolyId', this.cellState.group_id);
            }
        },
        cellMasonsBgColor() {
            let illuminatiColor = '#fff';
            let masonsColor = '#fff';

            if (this.cellState.illuminati_owner) {
                const illuminatiOwner = this.$store.getters.getPlayerById(this.cellState.illuminati_owner);
                illuminatiColor = illuminatiOwner.background.color;
            }

            if (this.cellState.masons_owner) {
                const masonsOwner = this.$store.getters.getPlayerById(this.cellState.masons_owner);
                masonsColor = masonsOwner.background.color;
            }

            return `radial-gradient(ellipse at center, ${masonsColor} 0%, ${masonsColor} 25%, ${illuminatiColor} 25%, ${illuminatiColor} 100%) center 15px`
        },

    },
    mounted() {
        this.popupItem = this.$el
    },
    directives: {
        ClickOutside
    }

}
</script>

<style lang="scss" scoped>
    *{
        box-sizing: border-box;
    }
    .cell {
        user-select: none;
        width: 100%;
        height: 100%;
        background-color: #fff;
        position: relative;
        transition: 300ms;
        border-radius: 5px;
        transition: .2s;
        img:hover {
            transform: scale(1.1);
            filter: drop-shadow(0px 3px 6px rgba(#000, .2));
        }
        &.disabled, &.hover-disabled {
            opacity: 0.5;
        }
        &.active {
            cursor: pointer;
        }
        .new {
            position: absolute;
            width: 8px;
            height: 8px;
            top: 1px;
            right: 1px;
        }
        .bg-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transition: 300ms;
        }
        .cell-color {
            position: absolute;
            width: 100%;
            height: 5px;
            background-color: #888383;
            border-radius: 5px;
        }
        .cell-price {
            width: 100%;
            height: 28px;
            position: absolute;
            background-color: #B8B3B3;
            font-size: 17px;
            color: #000;
            padding: 3px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;

            @media screen and (max-width: 1366px) {
                font-size: 14px;
            }

            span {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .owner {
            position: absolute;
            z-index: 100;
            width: 10px;
            height: 10px;

            &.vertical.top {
                width: 100%;
                bottom: -10px;
            }
            &.vertical.bottom {
                width: 100%;
                top: -10px;
            }
            &.horizontal.left {
                height: 100%;
                right: -10px;
            }
            &.horizontal.right {
                height: 100%;
                left: -10px;
            }
        }
        .game-cell-prices-arrow {
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
            z-index: 9999;
        }
        .bailed {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(87, 87, 87, 0.6);
            z-index: 999;
            .lock {
                position: absolute;
                border-radius: 6px;
                background-color: #473D3D;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 14px;
                color: #fff;
                flex-wrap: wrap;
            }
        }
        &-corner {
            .cell {
                img {
                    border-radius: 5px;
                }
            }
        }
        &-top {
            border-radius: 5px;
            &.active {border-radius: 0px 0 5px 5px;}
            .cell-price {
                top: -28px;
                border-radius: 5px 5px 0 0;
            }

            .cell-color {
                bottom: -9px;
                left: 0;
            }
            .game-cell-prices-arrow {
                border-width: 0 5px 10px 5px;
                border-color: transparent transparent #fff transparent;
                bottom: -12px;
                left: 50%;
                margin-left: -5px;
                &.left {
                    border-width: 0 6px 15px 6px;
                    transform: rotate(-45deg);
                    left: auto;
                    margin-left: 0;
                    right: -16px;
                    bottom: -16px;
                }
                &.right {
                    border-width: 0 6px 15px 6px;
                    transform: rotate(45deg);
                    margin-left: 0;
                    left: -16px;
                    bottom: -16px;
                }
            }
            .bailed .lock {
                width: fit-content;
                height: 20px;
                transform: translateX(-50%) translateY(50%);
                left: 50%;
                bottom: 0;
                padding: 0 4px;
                span {
                    padding-left: 2px;
                }
                &.animated {
                    -webkit-animation: jump_top 5s infinite cubic-bezier(.4,0.01,.6,.99);
                }
            }
        }

        &-left {
            border-radius: 5px;
            &.active {border-radius: 0px 5px 5px 0;}
            .cell-price {
                width: 28px;
                height: 100%;
                left: -28px;
                border-radius: 5px 0 0 5px;
                span {
                    transform: rotateZ(-90deg);
                }
            }

            .cell-color {
                right: -9px;
                top: 0;
                width: 5px;
                height: 100%;
            }
            .game-cell-prices-arrow {
                border-width: 5px 10px 5px 0;
                border-color: transparent #fff transparent transparent;
                right: -13px;
                top: 50%;
                margin-top: -5px;
            }
            .bailed .lock {
                width: 20px;
                height: fit-content;
                transform: translateX(50%) translateY(-50%);
                top: 50%;
                right: 0;
                padding: 4px 0;
                span {
                    padding-top: 2px;
                }
                &.animated {
                    -webkit-animation: jump_left_right 5s infinite cubic-bezier(.4,0.01,.6,.99);
                }
            }
        }

        &-right {
            border-radius: 5px;
            &.active {border-radius: 5px 0 0 5px};
            .cell-price {
                width: 28px;
                height: 100%;
                right: -28px;
                border-radius: 0 5px 5px 0;
                span {
                    transform: rotateZ(90deg);
                }
            }

            .cell-color {
                left: -9px;
                top: 0;
                width: 5px;
                height: 100%;
            }
            .game-cell-prices-arrow {
                border-width: 5px 0 5px 10px;
                border-color: transparent transparent transparent #fff;
                left: -13px;
                top: 50%;
                margin-top: -5px;
            }
            .bailed .lock {
                width: 20px;
                height: fit-content;
                transform: translateX(-50%) translateY(-50%);
                top: 50%;
                left: 0;
                padding: 4px 0;
                span {
                    padding-top: 2px;
                }
                &.animated {
                    -webkit-animation: jump_left_right 5s infinite cubic-bezier(.4,0.01,.6,.99);
                }
            }
        }

        &-bottom {
            border-radius: 5px;
            &.active {border-radius: 5px 5px 0 0};
            .cell-price {
                bottom: -28px;
                border-radius: 0 0 5px 5px;
            }

            .cell-color {
                top: -9px;
                left: 0;
            }
            .game-cell-prices-arrow {
                border-width: 10px 5px 0 5px;
                border-color: #fff transparent transparent transparent;
                top: -12px;
                left: 50%;
                margin-left: -5px;
                &.left {
                    border-width: 15px 6px 0 6px;
                    transform: rotate(-45deg);
                    margin-left: 0;
                    left: -17px;
                    top: -17px;
                }
                &.right {
                    border-width: 15px 6px 0 6px;
                    transform: rotate(45deg);
                    left: auto;
                    margin-left: 0;
                    right: -17px;
                    top: -17px;
                }
            }
            .bailed .lock {
                width: fit-content;
                height: 20px;
                transform: translateX(-50%) translateY(-50%);
                left: 50%;
                top: 0;
                padding: 0 4px;
                span {
                    padding-left: 2px;
                }
                &.animated {
                    -webkit-animation: jump_bottom 5s infinite cubic-bezier(.4,0.01,.6,.99);
                }
            }
        }

        .upgrade {
            z-index: 1;
            position: absolute;
            z-index: 99;
            .upgrade-wrap {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                align-content: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                .big-star {
                    width: 28px;
                    height: 28px;
                }
                img {
                    -webkit-filter: drop-shadow(0px 2px 5px rgba(0, 0, 0, 1));
                    filter: drop-shadow(0px 2px 5px rgba(0, 0, 0, 1));
                }
            }
            &.top {
                width: 100%;
                bottom: -11px;
                height: 28px;
                left: 0;
            }
            &.bottom {
                width: 100%;
                height: 28px;
                top: -11px;
                left: 0;
            }
            &.left {
                width: 28px;
                height: 100%;
                right: -11px;
                top: 0;
            }
            &.right {
                height: 100%;
                width: 28px;
                left: -11px;
                top: 0;
            }
        }

        .debug-throw-dices {
            display: none;
            position: absolute;
            z-index: 1000;
            left: 2px;
            bottom: 2px;
            font-size: 10px;
            background: orange;
            border: none;
            border-radius: 2px;
            width: 66px;
        }
        &:hover .debug-throw-dices {
            display: block;
        }
    }
    @-webkit-keyframes jump_top {
        0% {
            bottom: 0;
        }
        5% {
            bottom: -10px;
        }
        10% {
            bottom: 0;
        }
        15% {
            bottom: -10px;
        }
        20% {
            bottom: 0;
        }
        100% {
            bottom: 0;
        }
    };
    @-webkit-keyframes jump_bottom {
        0% {
            top: 0;
        }
        5% {
            top: -10px;
        }
        10% {
            top: 0;
        }
        15% {
            top: -10px;
        }
        20% {
            top: 0;
        }
        100% {
            top: 0;
        }
    };
    @-webkit-keyframes jump_left_right {
        0% {
            top: 50%;
        }
        5% {
            top: 40%;
        }
        10% {
            top: 50%;
        }
        15% {
            top: 40%;
        }
        20% {
            top: 50%;
        }
        100% {
            top: 50%;
        }
    };
    .bg__image__wrapper {
        border-radius: 6px;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
