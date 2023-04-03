<template>
    <div v-if="cellState"
         ref="cell" class="cell"
         :id="`cell-${id}`"
         :class="[cellPosition, {disabled: cellOpacity}, {active: cellState.type == 'active'}]"
         :data-direction="direction"
         @click="toggleCell">
        <div v-if="cellState.price_label" class="cell-price"><span>{{cellState.price_label}}B</span></div>
        <div v-if="cellState.monopoly_color" :style="`background-color: ${this.cellState.monopoly_color}`" class="cell-color"></div>
        <img v-if="cellState.image" :src="cellImage" class="bg-img">
        <img v-if="cellState.newImage" class="new" src="/design/icons/new-mark.svg" alt="">

        <div v-if="cellState.type == 'active'" class="upgrade" :class="position">
            <div class="upgrade-wrap">
                <img class="big-star" src="/design/game/vip.svg">
            </div>
        </div>

    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'GameCell',
    // components: {GameCellPrices},
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
            'getHoverImage',
            'getActiveCellId'
        ]),
        cellPosition() {
            return `cell-${this.position}`;
        },
        cellState() {
            return this.$store.getters.getBrandCellById(this.id);
        },
        cellOpacity() {
            let disabled = false;
            const cellId = this.getActiveCellId;
            if (cellId && cellId != this.cellState.id) {
                disabled = true
            }
            return disabled;
        },
        cellImage() {
            if (this.getHoverImage && this.getActiveCellId == this.cellState.id) {
                return this.getHoverImage;
            }
            return this.cellState.image;
        },
    },
    methods: {
        ...mapActions([
            'SOCKET_CELL_CUSTOM_IMAGES',
            'clearActiveCell',
        ]),
        toggleCell() {
            if (this.cellState.type != 'active') {
                this.clearActiveCell();
                return;
            }

            const thisCellId = this.cellState.id;
            const activeCellId = this.getActiveCellId;

            if (activeCellId && activeCellId == thisCellId) {
                this.clearActiveCell();
                return;
            }

            this.$store.commit('setActiveCellId', thisCellId);
            this.SOCKET_CELL_CUSTOM_IMAGES(thisCellId);

        },

    },

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
</style>
