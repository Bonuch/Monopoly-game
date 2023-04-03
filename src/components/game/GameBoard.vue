<template>
    <div>
        <div class="game-panel">
            <div class="top-row">
                <div class="cell-wrap cell-corner cell-corner-left">
                    <GameCell :id="1" position="top" direction="left"/>
                </div>
                <div v-for="id in [2,3,4,5,6,7,8,9,10]" class="cell-wrap" :key="id">
                    <GameCell :id="id" position="top" direction="vertical"/>
                </div>
                <div class="cell-wrap cell-corner cell-corner-right">
                    <GameCell :id="11" position="top" direction="jail"/>
                </div>
            </div>
            <div class="center-row">
                <div class="cells-wrap cells-left">
                    <div v-for="id in [40,39,38,37,36,35,34,33,32]" class="cell-wrap" :key="id">
                        <GameCell :id="id" position="left" direction="horizontal"/>
                    </div>
                </div>

                <GameBoardCenter :current-player="currentPlayer"/>

                <div class="cells-wrap cells-right">
                    <div v-for="id in [12,13,14,15,16,17,18,19,20]" class="cell-wrap" :key="id">
                        <GameCell :id="id" position="right" direction="horizontal"/>
                    </div>
                </div>
            </div>
            <div class="bottom-row">
                <div class="cell-wrap cell-corner cell-corner-left">
                    <GameCell :id="31" position="bottom" direction="right"/>
                </div>
                <div v-for="id in [30,29,28,27,26,25,24,23,22]" class="cell-wrap" :key="id">
                    <GameCell :id="id" position="bottom" direction="vertical"/>
                </div>
                <div class="cell-wrap cell-corner cell-corner-right">
                    <GameCell :id="21" position="bottom" direction="left"/>
                </div>
            </div>
            <GameChip
                v-if="gamePlayers"
                v-for="player in gamePlayers"
                :key="player.uuid"
                :player="player"
                :class="{'game-panel__chips--disabled': getPlayerCardHovered, 'hovered': bloomPlayerChip}"
            />
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import GameCell from './GameCell.vue';
import GameBoardCenter from './GameBoardCenter.vue';
import GameChip from './GameChip.vue';

export default {
    name: "GameBoard",
    data() {
        return {
            dice1: null,
            dice2: null,
        }
    },
    props: {
        currentPlayer: {
            type: Object,
            required: true,
        },
    },
    components: {
        GameCell,
        GameChip,
        GameBoardCenter,
    },
    computed: {
        ...mapGetters([
            'gamePlayers',
            'gameStore',
            'currentUser',
            'getPlayerCardHovered'
        ]),
        myActions() {
            const actions = this.gamePlayers.filter(pl => {
                return (pl.uuid === this.currentUser.uuid);
            }).map(pl => pl.availableActions);
            return actions[0] || [];
        },
        bloomPlayerChip() {
            return !!(this.getPlayerCardHovered && this.getPlayerCardHovered.uuid === this.currentUser.uuid);
        }
    },
    methods: {
        doAction(action, params = {}) {
            console.log('ACTION: ', action, params);
            const route = `game_${action.route}`;
            this.showSelect(action);
            this.$socket.client.emit(route, params, (response) => {
                if (response.error) this.$dialog.alert(response.error); // TODO переделать
            });
        },
        showSelect(action) {
            const ref = `id_${action.route}`;
            if (this.$refs[ref] && this.$refs[ref].length > 0) {
                const elem = this.$refs[ref][0];
                if (elem.style.display === 'none') {
                    elem.style.display = '';
                } else {
                    elem.style.display = 'none';
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

.game-panel {
    width: 960px;
    height: 960px;
    margin: 0 auto;
    padding: 28px;
    position: relative;

    @media screen and (max-width: 1366px){
        width: 835px;
        height: 835px;
    }
    @media screen and (max-width: 1180px){
        width: 790px;
        height: 790px;
        position: absolute;
        right: 20px;
    }
    @media screen and (max-width: 980px){
        //width: 96%;
        height: 790px;
        position: relative;
        right: 0;
        margin: 0 auto;
    }
    &__chips {
        &--disabled {
            &::v-deep {
                .chip {
                    opacity: 0.3;
                }
            }
        }
    }
}

.center-row {
    display: flex;

    .cells-wrap {
        display: flex;
        width: 125px;
        flex-wrap: wrap;


        @media screen and (max-width: 1366px){
            width: 100px;
        }
    }

    .cells-left {
        padding-right: 1.5px;
    }

    .cells-right {
        padding-left: 1.5px;
    }

    .cell-wrap {
        width: 100%;
        height: 70px;
        margin: 1.5px 0;

        @media screen and (max-width: 1366px){
            height: 60px;
        }
    }
}

.top-row, .bottom-row {
    display: flex;
    justify-content: space-between;

    .cell-wrap {
        width: 70px;
        height: 125px;
        margin: 0 1.5px;

        @media screen and (max-width: 1366px){
            width: 60px;
            height: 100px;
        }

    }

    .cell-corner {
        width: 125px;
        height: 125px;

        @media screen and (max-width: 1366px){
            width: 100px;
            height: 100px;
        }
    }
}

.top-row {
    margin-bottom: 1.5px;

    .cell-corner {
        &-left {
            margin: 0 1.5px 0 0;
        }

        &-right {
            margin: 0 0 0 1.5px;
        }
    }
}

.bottom-row {
    margin-top: 1.5px;

    .cell-corner {
        &-left {
            margin: 0 1.5px 0 0;
        }

        &-right {
            margin: 0 0 0 1.5px;
        }
    }
}
</style>
