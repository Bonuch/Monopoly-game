<template>
    <div ref="popup" class="popup-prices" :class="this.position">
        <div @click="close()" class="close"></div>
        <div class="title">
            {{cellState.type !== 'masons' ? cellState.title : $t('CELLS.Special__title')}}
            <span :style="monopolyColor()" class="line-color-monopoly"></span>
        </div>
        <div v-if="cellState.type == 'active'" class="cell-type-active">
            <div v-if="cellState.boost" class="boost">
                <span>
                    <img src="/design/game/boost-icon.svg">
                    {{ $t('GAME.Эта монополия приносит дополнительный доход') }} {{cellState.boost.percent}}% <br>
                    {{ $t('GAME.Осталось') }} {{ cellState.boost.rounds | setCase([
                        ' ' + $t('GAME.раунд'),
                        ' ' + $t('GAME.раунда'),
                        ' ' + $t('GAME.раундов')
                    ], '<') }}
                </span>
            </div>
            <div v-if="cellState.prices && !cellState.multipliers" class="head">
                <div v-if="upgradeResult.rent" class="rent">{{ $t('GAME.Аренда') }} {{upgradeResult.rent}}B</div>
                <div v-else-if="upgradeResult.income" class="income">{{ $t('GAME.Доход') }} {{upgradeResult.income}}B</div>
                <div v-else class="prices">
                    <span>{{ $t('GAME.Стоимость') }} {{cellState.prices.purchase_price}}B</span>
                    <span>{{ $t('GAME.Базовый доход') }} {{cellState.prices.basic_income}}B</span>
                    <span>{{ $t('GAME.Доход с монополии') }} {{cellState.prices.income_monopoly}}B</span>
                </div>
            </div>
            <div v-if="cellState.multipliers" class="head">
                <div v-if="cellState.owner_id" class="income">{{ $t('GAME.Множитель') }} X{{cellState.prices.income}}</div>
                <div v-else class="prices">
                    <span>{{ $t('GAME.Стоимость') }} {{cellState.prices.purchase_price}}B</span>
                    <span>{{ $t('GAME.Базовый множитель') }} X{{cellState.prices.basic_income}}</span>
                    <span>{{ $t('GAME.Множитель с монополии') }} X{{cellState.prices.income_monopoly}}</span>
                </div>
            </div>
            <div v-if="cellState.prices && cellState.prices.income_branches && cellState.monopolyName !== 'Автомобили'" class="income-upgrade">
                <h3>{{ $t('GAME.Филиалы') }}</h3>
                <div class="list">
                    <div class="label">{{ $t('GAME.Доход') }}</div>
                    <div v-for="(price, index) in cellState.prices.income_branches" class="row" :class="{active: index+1 == cellState.prices.upgrades_number}">
                        <div class="row-wrap">
                            <div class="stars">
                                <img v-if="index < 4" :title="n" v-for="n in index+1" src="/design/game/vip.svg">
                                <img v-if="index > 3" class="big-star" src="/design/game/vip.svg">
                            </div>
                            <div class="branche-price">{{price}}B</div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!cellState.multipliers" class="footer">
                <div v-if="!upgradeResult.upgrade_cell && !upgradeResult.downgrade_cell && cellState.prices" class="prices">
                    <div class="upgrade-price">{{ $t('GAME.Стоимость филиала') }} {{cellState.prices.upgrade_price}}B</div>
                    <div class="pledge-wrap">
                        <div class="pledge_price">{{ $t('GAME.Залог') }} {{cellState.prices.pledge_price}}B</div>
                        <div class="buyout_price">{{ $t('GAME.Выкуп') }} {{cellState.prices.buyout_price}}B</div>
                    </div>
                </div>
                <div class="btn-wrap" v-if="cellState.monopolyName !== 'Автомобили'">
                    <div v-if="upgradeResult.message" class="message" v-html='upgradeResult.message'></div>
                    <a v-if="upgradeResult.upgrade_cell && upgradeResult.upgrade_cell.visible"
                       class="add-branch"
                       :class="{active: upgradeResult.upgrade_cell.allowed}"
                       @click.prevent="doAction(upgradeResult.upgrade_cell, {cellId: id})"
                       href="#">
                        {{upgradeResult.upgrade_cell.label}}
                    </a>
                    <a v-if="upgradeResult.downgrade_cell && upgradeResult.downgrade_cell.visible"
                       class="delete-branch"
                       :class="{active: upgradeResult.downgrade_cell.allowed}"
                       @click.prevent="doAction(upgradeResult.downgrade_cell, {cellId: id})"
                       href="#">
                        {{upgradeResult.downgrade_cell.label}}
                    </a>
                </div>
            </div>
            <div v-else class="footer">
                <div v-if="cellState.prices" class="prices">
                    <div class="pledge-wrap">
                        <div class="pledge_price">{{ $t('GAME.Залог') }} {{cellState.prices.pledge_price}}B</div>
                        <div class="buyout_price">{{ $t('GAME.Выкуп') }} {{cellState.prices.buyout_price}}B</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="cellState.type == 'masons'" class="cell-type-masons">
            <div class="desc">
                <div class="desc-illuminati">
                    <span :style="illuminatiBg">{{ $t('GAME.Иллюминаты') }}</span> - {{ $t('GAME.описание Иллюминатов') }}
                </div>
                <br>
                <div class="desc-masons">
                    <span :style="masonsBg">{{ $t('GAME.Масоны') }}</span> - {{ $t('GAME.описание Масонов') }}
                </div>
            </div>
            <div class="footer">
                <div class="btn-wrap">
                    <div v-if="upgradeResult.message" class="message" v-html='upgradeResult.message'></div>
                    <a v-if="upgradeResult.sell_masons && upgradeResult.sell_masons.visible"
                       class="sell-masons"
                       :class="{active: upgradeResult.sell_masons.allowed}"
                       @click.prevent="doAction(upgradeResult.sell_masons, {cellId: id})"
                       href="#">
                        {{upgradeResult.sell_masons.label}}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { setCase } from '@/helpers/text';

export default {
    name: 'GameCellPrices',
    props: {
        id: {
            type: Number,
            required: true,
        },
        position: null,
    },
    data() {
      return {
        upgradeResult: {},
      }
    },
    filters: {
        setCase
    },
    computed: {
        ...mapGetters([
            'gamePlayers',
            'gameStore',
            'gameCells'
        ]),
        cellState() {
            return this.$store.getters.getCellById(this.id);
        },
        illuminatiBg() {
            if (this.cellState.illuminati_owner) {
                const owner = this.$store.getters.getPlayerById(this.cellState.illuminati_owner);
                return {
                    color: owner.background.color,
                }
            }
        },
        masonsBg() {
            if (this.cellState.masons_owner) {
                const owner = this.$store.getters.getPlayerById(this.cellState.masons_owner);
                return {
                    color: owner.background.color,
                }
            }
        },
    },
    watch: {
        upgradeResult() {
            this.$nextTick(() => {
                this.popupPosition();
            });
        },
        gamePlayers() {
            this.checkCellUpgrade();
        },
        gameStore() {
            this.checkCellUpgrade();
        },
        gameCells() {
            this.checkCellUpgrade();
        },
    },
    methods: {
        close() {
            this.$emit('toggle-upgrade-prices');
        },
        monopolyColor() {
            return `background-color: ${!!this.cellState.monopoly_color ? this.cellState.monopoly_color : '#E5E5E5'};`;
        },
        popupPosition() {
            let popup = this.$refs.popup;
            let cell = this.$parent.$refs.cell;
            let board = document.querySelector(".board-center");
            let margin = 10;

            let leftCellOffset = cell.offsetLeft + popup.offsetWidth;
            let leftBoardOffset = board.offsetLeft + board.offsetWidth;

            let topCellOffset = cell.offsetTop + popup.offsetHeight;
            let topBoardOffset = board.offsetTop + board.offsetHeight;

            if (leftCellOffset > leftBoardOffset) {
                popup.style.left = '-' + ((leftCellOffset - leftBoardOffset) + margin) + 'px';
            }

            if (board.offsetLeft > (cell.offsetLeft - margin)) {
                popup.style.left = ((board.offsetLeft - cell.offsetLeft) + margin) + 'px';
            }

            if (board.offsetTop > (cell.offsetTop - margin) && (this.position == 'left' || this.position == 'right')) {
                popup.style.top = ((cell.offsetTop - board.offsetTop) + margin) + 'px';
            }

            if (topCellOffset > topBoardOffset) {
                popup.style.top = '-' + ((topCellOffset - topBoardOffset) + margin) + 'px';
                if (this.position == 'bottom') {
                    popup.style.top = (popup.style.top - popup.offsetHeight) + 'px';
                }
            }
        },
        checkCellUpgrade() {
            this.$socket.client.emit('game_check_cell_upgrade', {cellId: this.id}, (response) => {
                this.upgradeResult = response;
            });
        },
        doAction(action, params = {}) {
            if (action.allowed) {
                const route = `game_${action.route}`;
                this.$socket.client.emit(route, params, (response) => {
                    if (action.route == 'upgrade_cell' || action.route == 'downgrade_cell') {
                        this.close();
                    }
                    if (response.error) this.$dialog.alert(response.error); // TODO переделать
                });
            }
        },
    },
    created() {
        this.checkCellUpgrade();
    },
    mounted() {
        this.popupPosition();
    },

}
</script>

<style lang="scss" scoped>
    *{
        box-sizing: border-box;
    }
    .popup-prices {
        position: absolute;
        background: #FFFFFF;
        border: 1px solid #E2E2E2;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
        border-radius: 3px;
        padding: 7px 0;
        width: 218px;
        left: 0px;
        top: 100px;
        z-index: 9999;
        color: #414141;
        &.top {
            left: 0;
            top: 135px;
        }
        &.left {
            left: 135px;
            top: 0;
        }
        &.right {
            right: 135px;
            top: 0;
        }
        &.bottom {
            top: 0;
            left: 0;
        }
    }
    .close {
        position: absolute;
        background-image: url('/design/game/close.svg');
        background-size: cover;
        width: 11px;
        height: 11px;
        top: 7px;
        right: 7px;
        z-index: 1;
        cursor: pointer;
    }
    .title {
        padding: 5px 12px 10px;
        text-align: center;
        position: relative;
        font-weight: 600;
        font-size: 18px;
        margin: 0 7px;
        .line-color-monopoly {
            position: absolute;
            left: 0;
            bottom: 0;
            height: 1px;
            width: 100%;
        }
    }
    .boost {
        font-size: 12px;
        line-height: 14px;
        text-align: center;
        border-bottom: 1px solid #E5E5E5;
        padding: 2px 0;
        span {
            position: relative;
        }
        img {
            position: absolute;
            left: -12px;
            top: 2px;
        }
    }
    .head {
        margin: 0 7px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #E5E5E5;
        .rent, .income {
            font-weight: 600;
            font-size: 18px;
        }
        .prices {
            font-size: 12px;
            line-height: 14px;
            span {
                display: block;
            }
        }
    }
    .income-upgrade {
        padding-top: 4px;
        padding-bottom: 5px;
        margin: 0 auto;
        position: relative;
        &:after {
            content: '';
            position: absolute;
            width: 146px;
            height: 1px;
            bottom: 5px;
            left: 50%;
            margin-left: -73px;
            background-color: #DFE2E7;
        }
        h3 {
            margin: 0;
            padding: 0 0 3px;
            text-align: center;
            font-weight: 600;
            font-size: 12px;
        }
        .list {
            .label {
                font-size: 11px;
                text-align: right;
                max-width: 160px;
                margin: 0 auto;
            }
            .row {
                .row-wrap {
                    display: flex;
                    max-width: 160px;
                    margin: 0 auto;
                    padding: 4px 0;
                    align-items: center;
                }
                .stars {
                    width: 70%;
                    display: flex;
                    justify-content: center;
                    img {
                        margin: 0 3px;
                        filter: drop-shadow( 0px 2px 4px rgba(0, 0, 0, 0.25));
                        height: 16px;
                    }
                    .big-star {
                        height: 23px;
                    }
                }
                .branche-price {
                    width: 30%;
                    font-size: 14px;
                    font-weight: 600;
                    text-align: right;
                }
                &.active {
                    background-color: rgba(196, 196, 196, 0.78);
                }
            }
        }
    }
    .footer {
        margin: 0 7px;
        .prices {
            font-size: 12px;
            .pledge-wrap {
                padding-top: 3px;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                .pledge_price, .buyout_price {
                    padding: 0 6px;
                }
            }
        }
        .btn-wrap {
            .message {
                font-weight: 600;
                font-size: 12px;
                line-height: 14px;
                padding-bottom: 5px;
            }
            a {
                background: #B5B5B5;
                border-radius: 3px;
                display: block;
                text-align: center;
                padding: 8px;
                font-size: 12px;
                font-weight: 600;
                color: #000;
                text-decoration: none;
                opacity: 0.4;
                transition: 300ms;
                &.add-branch {
                    margin-bottom: 5px;
                }
                &.active {
                    opacity: 1;
                    &:hover {
                        background-color: #a0a0a0;
                    }
                }
            }
        }
    }
    .cell-type-masons {
       padding: 10px;
        .desc {
            position: relative;
            padding-bottom: 10px;
            span {
                font-weight: 700;
            }
            &:after {
                content: '';
                position: absolute;
                width: 146px;
                height: 1px;
                bottom: 5px;
                left: 50%;
                margin-left: -73px;
                background-color: #DFE2E7;
            }
        }
    }
</style>
