<template>
    <div class="maninhat-modal">
        <BaseScrollbar class="wrap">
            <!--      <div class="wrap">-->
            <div v-if="!maninhatState.maninhat" class="actions">

                <!-- Детский труд-->
                <div v-if="actions.boost && actions.boost.visible" class="action" @click="pickBoost()">
                    <img src="/design/game/maninhat-actions.jpeg" :alt="$t('GAME_DIALOGS.Нанять детский труд')">
                    <div class="content">
                        <div class="title">{{ actions.boost.label }}</div>
                        <div class="desc">{{ actions.boost.desc }}</div>
                    </div>
                    <div class="footer">
                        <!--                      <div :class="{disabled: !actions.boost.allowed}" class="price">{{actions.boost.price}}В</div>-->
                        <div v-if="actions.boost.message" class="warding">{{ actions.boost.message }}</div>
                    </div>
                </div>

                <!-- Отправить проверку-->
                <div v-if="actions.revision && actions.revision.visible" class="action" @click="setRevision()">
                    <img src="/design/game/maninhat-actions.jpeg" :alt="$t('GAME_DIALOGS.Нанять детский труд')">
                    <div class="content">
                        <div class="title">{{ actions.revision.label }}</div>
                        <div class="desc">{{ actions.revision.desc }}</div>
                    </div>
                    <div class="footer">
                        <div :class="{disabled: !actions.revision.allowed}" class="price">
                            {{ actions.revision.price }}В
                        </div>
                    </div>
                </div>

                <!-- Подкупить судью-->
                <div v-if="actions.bribe && actions.bribe.visible" class="action" @click="doAction(actions.bribe)">
                    <img src="/design/game/maninhat-actions.jpeg" :alt="$t('GAME_DIALOGS.Нанять детский труд')">
                    <div class="content">
                        <div class="title">{{ actions.bribe.label }}</div>
                        <div class="desc">{{ actions.bribe.desc }}</div>
                    </div>
                    <div class="footer">
                        <div :class="{disabled: !actions.bribe.allowed}" class="price">{{ actions.bribe.price }}В</div>
                        <div v-if="actions.bribe.message" class="warding">{{ actions.bribe.message }}</div>
                    </div>
                </div>

                <!-- Получить скидку на выход из тюрьмы-->
                <div v-if="actions.freedom_discount && actions.freedom_discount.visible" class="action"
                     @click="doAction(actions.freedom_discount)">
                    <img src="/design/game/maninhat-actions.jpeg" :alt="$t('GAME_DIALOGS.Нанять детский труд')">
                    <div class="content">
                        <div class="title">{{ actions.freedom_discount.label }}</div>
                        <div class="desc">{{ actions.freedom_discount.desc }}</div>
                    </div>
                    <div class="footer">
                        <div v-if="actions.freedom_discount.message" class="warding">
                            {{ actions.freedom_discount.message }}
                        </div>
                    </div>
                </div>

                <!-- Купить иммунитет от проверок -->
                <div v-if="actions.buy_revision_immunity && actions.buy_revision_immunity.visible" class="action"
                     @click="doAction(actions.buy_revision_immunity)">
                    <img src="/design/game/maninhat-actions.jpeg" :alt="$t('GAME_DIALOGS.Нанять детский труд')">
                    <div class="content">
                        <div class="title">{{ actions.buy_revision_immunity.label }}</div>
                        <div class="desc">{{ actions.buy_revision_immunity.desc }}</div>
                    </div>
                    <div class="footer">
                        <div :class="{disabled: !actions.buy_revision_immunity.allowed}" class="price">
                            {{ actions.buy_revision_immunity.price }}В
                        </div>
                        <div v-if="actions.buy_revision_immunity.message" class="warding">
                            {{ actions.buy_revision_immunity.message }}
                        </div>
                    </div>
                </div>

                <!-- Выкупить игрока из тюрьмы -->
                <div v-if="actions.buy_freedom_for_player && actions.buy_freedom_for_player.visible" class="action"
                     @click="buyFreedomForPlayer()">
                    <img src="/design/game/maninhat-actions.jpeg" :alt="$t('GAME_DIALOGS.Нанять детский труд')">
                    <div class="content">
                        <div class="title">{{ actions.buy_freedom_for_player.label }}</div>
                        <div class="desc">{{ actions.buy_freedom_for_player.desc }}</div>
                    </div>
                    <div class="footer">
                        <div :class="{disabled: !actions.buy_freedom_for_player.allowed}" class="price">
                            {{ actions.buy_freedom_for_player.price }}В
                        </div>
                        <div v-if="actions.buy_freedom_for_player.message" class="warding">
                            {{ actions.buy_freedom_for_player.message }}
                        </div>
                    </div>
                </div>

                <!-- Заблокировать на 3 дня -->
                <div v-if="actions.block_monopoly && actions.block_monopoly.visible" class="action"
                     @click="pickBlockMonopoly()">
                    <img src="/design/game/maninhat-actions.jpeg" :alt="$t('GAME_DIALOGS.Нанять детский труд')">
                    <div class="content">
                        <div class="title">{{ actions.block_monopoly.label }}</div>
                        <div class="desc">{{ actions.block_monopoly.desc }}</div>
                    </div>
                    <div class="footer">
                        <div :class="{disabled: !actions.block_monopoly.allowed}" class="price">
                            {{ actions.block_monopoly.price }}В
                        </div>
                        <div v-if="actions.block_monopoly.message" class="warding">
                            {{ actions.block_monopoly.message }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p class="mt-0"><a class="go__back" @click.prevent="goBack"><i class="fas fa-arrow-left"></i>{{ $t("GAME_DIALOGS.назад") }}</a></p>
                <div v-if="maninhatState.boost" class="monopolies">
                    <h2>{{ $t("GAME_DIALOGS.Выберите монополию") }}</h2>
                    <div v-for="cell in myMonopolies()" class="item"
                         v-on:mouseover="btnMonopolyMouseover(cell.group_id)"
                         v-on:mouseleave="btnMonopolyMouseover(null)">
                        <div class="color">{{ $t("CELLS."+cell.colorName) }} <br> {{ cell.prices.upgrade_price }}B</div>
                        <span class="row" :style="{backgroundColor: cell.monopoly_color}"></span>
                        <div @click="doAction(actions.boost, {monopolyId: cell.group_id})" class="btn">
                            {{ $t("GAME_DIALOGS.Выбрать") }}
                        </div>
                    </div>
                </div>

                <div v-if="maninhatState.block" class="monopolies">
                    <h2>{{ $t("GAME_DIALOGS.Выберите монополию") }}</h2>
                    <div v-for="cell in opponentsMomopolies()" class="item"
                         v-on:mouseover="btnMonopolyMouseover(cell.group_id)"
                         v-on:mouseleave="btnMonopolyMouseover(null)">
                        <div class="color">{{ cell.colorName }}</div>
                        <span class="row" :style="{backgroundColor: cell.monopoly_color}"></span>
                        <div @click="doAction(actions.block_monopoly, {monopolyId: cell.group_id})" class="btn">
                            {{ $t("GAME_DIALOGS.Выбрать") }}
                        </div>
                    </div>
                </div>

                <div v-if="maninhatState.freedomForPlayer" class="monopolies">
                    <h2>{{ $t("GAME_DIALOGS.Выберите игрока") }}</h2>
                    <div v-for="player in getPlayersInJail()" class="item">
                        <div class="color">{{ player.name }}</div>
                        <span class="row" :style="{backgroundColor: player.background.color}"></span>
                        <div @click="doAction(actions.buy_freedom_for_player, {playerUuid: player.uuid})" class="btn">
                            {{ $t("GAME_DIALOGS.Выбрать") }}
                        </div>
                    </div>
                </div>

                <!-- Окна для выбова проверки -->
                <div v-if="maninhatState.revision && !maninhatState.revision_type" class="monopolies">
                    <h2>{{ $t("GAME_DIALOGS.Выберите когда игроку отправить проверку") }}</h2>
                    <div class="item">
                        <div class="color">{{ $t("GAME_DIALOGS.Сейчас") }}</div>
                        <span class="row" :style="{backgroundColor: '#A8FF00'}"></span>
                        <div @click="setRevisionType('now')" class="btn">{{ $t("GAME_DIALOGS.Выбрать") }}</div>
                    </div>
                    <div class="item">
                        <div class="color">{{ $t("GAME_DIALOGS.Когда попадет на") }} <br>
                            {{ $t("GAME_DIALOGS.поле шанс") }}
                        </div>
                        <span class="row" :style="{backgroundColor: '#DD006D'}"></span>
                        <div @click="setRevisionType('later')" class="btn">{{ $t("GAME_DIALOGS.Выбрать") }}</div>
                    </div>
                </div>

                <div v-if="maninhatState.revision_type" class="monopolies">
                    <h2>{{ $t("GAME_DIALOGS.Выберите игрока которому отправить проверку") }}</h2>
                    <div v-for="player in getPlayersForRevision()" class="item">
                        <div class="color">{{ player.name }}</div>
                        <span class="row" :style="{backgroundColor: player.background.color}"></span>
                        <div
                            @click="doAction(actions.revision, {playerUuid: player.uuid, type: maninhatState.revision_type})"
                            class="btn">{{ $t("GAME_DIALOGS.Выбрать") }}
                        </div>
                    </div>
                </div>
            </div>
        </BaseScrollbar>
        <button v-if="actions.cancel && actions.cancel.visible" @click="doAction(actions.cancel)" class="cancel"
                href="#">{{ actions.cancel.label }}
        </button> <!--//Отказаться-->
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import BaseScrollbar from "../base/BaseScrollbar";

export default {
    name: "ManinhatModal",
    data() {
        return {};
    },
    props: {
        actions: {
            type: Object,
            required: true,
        },
    },
    components: { BaseScrollbar },
    computed: {
        ...mapGetters([
            "maninhatState",
            "currentUser",
            "gameCells",
            "gamePlayers",
        ]),
    },
    methods: {
        doAction(action, params = {}) {
            if (action.allowed) {
                console.log("ACTION: ", action, params);
                const route = `game_${action.route}`;
                this.$socket.client.emit(route, params, (response) => {
                    if (response.error) this.$dialog.alert(response.error); // TODO переделать
                });
                this.$store.commit("clearManinhatState");
                this.$emit("cancelManInHatModal");
            }
        },
        setManinhat(val) {
            this.$store.commit("setManinhat", val);
        },
        goBack() {
            this.setManinhat(false);
        },
        pickBoost() {
            if (this.actions.boost.allowed) {
                this.setManinhat(true);
                this.$store.commit("setManinhatBoost", true);
            }
        },
        pickBlockMonopoly() {
            if (this.actions.block_monopoly.allowed) {
                this.setManinhat(true);
                this.$store.commit("setManinhatBlock", true);
            }
        },
        setRevision() {
            this.setManinhat(true);
            this.$store.commit("setManinhatRevision", true);
        },
        setRevisionType(type) {
            this.$store.commit("setManinhatRevisionType", type);
        },
        myMonopolies() {
            const player = this.$store.getters.getPlayerById(this.currentUser.uuid);
            const monopolies = [];
            player.monopolies.forEach(mId => {
                const cell = this.gameCells.find(cell => (cell.group_id == mId && !cell.boost));
                if (cell) {
                    monopolies.push(cell);
                }
            });
            return monopolies;
        },
        opponentsMomopolies() {
            const monopolies = [];
            this.gamePlayers.forEach(player => {
                if (player.uuid != this.currentUser.uuid) {
                    player.monopolies.forEach(mId => {
                        const cell = this.gameCells.find(cell => (cell.group_id == mId && !cell.block));
                        if (cell) {
                            monopolies.push(cell);
                        }
                    });
                }
            });
            return monopolies;
        },
        btnMonopolyMouseover(monopolyId) {
            this.$store.commit("setManinhatMonopolyId", monopolyId);
        },
        buyFreedomForPlayer() {
            if (this.actions.buy_freedom_for_player.count > 1) {
                this.setManinhat(true);
                this.$store.commit("setManinhatFreedomForPlayer", true);
            } else {
                this.doAction(this.actions.buy_freedom_for_player);
            }
        },
        getPlayersInJail() {
            return this.gamePlayers.filter(p => p.isInJail);
        },
        getPlayersForRevision() {
            return this.gamePlayers.filter(p => p.uuid !== this.currentUser.uuid);
        },
    },
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

.maninhat-modal {
    text-align: left;
    padding: 18px 10px;
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(14px);
    max-height: 625px;
    left: 15px;
    top: 15px;
    right: 15px;
    bottom: 15px;
    z-index: 999;
    color: #000;

    &:after {
        content: '';
        position: absolute;
        width: 80%;
        height: 80%;
        background-image: url('/design/game/anonymous-logo.png');
        opacity: 0.2;
        left: 10%;
        top: 10%;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        z-index: -1;
    }

    .wrap {
        height: 555px;
    }

    .cancel {
        text-align: center;
        display: block;
        margin: 0 auto;
        margin-top: 7px;
        font-size: 15px;
        width: 135px;
        padding: 10px;
        color: #fff;
        text-decoration: none;
        border-radius: 3px;
        background: #6A1ED5;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        color: #fff;

        .action {
            cursor: pointer;
            width: 140px;
            background: #323639;
            box-shadow: 0px 2.5px 2.5px rgba(0, 0, 0, 0.25);
            border-radius: 5px;
            margin-bottom: 15px;
            overflow: hidden;

            img {
                display: block;
            }
        }

        .content {
            padding: 5px 8px 1px;
        }

        .title {
            padding-bottom: 5px;
            font-weight: 600;
            font-size: 13px;
            line-height: 17px;
            min-height: 40px;
        }

        .desc {
            font-size: 12px;
            line-height: 14px;
            padding-bottom: 2px;
            min-height: 45px;
        }

        .footer {
            padding: 3px;
            min-height: 33px;
            border-top: 1px solid #4A4A4A;
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            .price {
                width: 100%;
                font-weight: 600;
                font-size: 14px;
                line-height: 14px;
                text-align: center;

                &.disabled {
                    color: #7D7D7D;
                }
            }

            .warding {
                width: 100%;
                text-align: center;
                color: #CBC7C7;
                font-size: 10px;
                line-height: 10px;
            }
        }
    }

    .monopolies {
        display: flex;
        flex-wrap: wrap;
        color: #fff;
        font-weight: 600;

        h2 {
            width: 100%;
            text-align: center;
            font-weight: 600;
            font-size: 24px;
            padding-bottom: 15px;
            color: #000;
            margin: 0;
            line-height: 29px;
        }

        .item {
            background-color: #323639;
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
            border-radius: 5px;
            width: 140px;
            margin-right: 14px;
            cursor: default;
            margin-bottom: 40px;

            &:nth-of-type(4n) {
                margin-right: 0;
            }

            .color {
                font-size: 13px;
                height: 68px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }

            .row {
                width: 100%;
                display: block;
                height: 5px;
            }

            .btn {
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 31px;
                cursor: pointer;
            }
        }
    }
}
.go__back {
    cursor: pointer;
    font-size: 14px;
    i {
        font-size: 12px;
        margin-right: 5px;
    }
}
.mt-0 {
    margin-top: 0;
}
</style>

