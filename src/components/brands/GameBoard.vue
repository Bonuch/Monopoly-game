<template>
    <div>
        <div class="geme-panel">
            <div class="top-row">
                <div class="cell-wrap cell-corner cell-corner-left">
                    <GameCell :id="1" position="top" direction="left"/>
                </div>
                <div v-for="id in [2,3,4,5,6,7,8,9,10]" class="cell-wrap">
                    <GameCell :id="id" position="top" direction="vertical"/>
                </div>
                <div class="cell-wrap cell-corner cell-corner-right">
                    <GameCell :id="11" position="top" direction="right"/>
                </div>
            </div>
            <div class="center-row">
                <div class="cells-wrap cells-left">
                    <div v-for="id in [40,39,38,37,36,35,34,33,32]" class="cell-wrap">
                        <GameCell :id="id" position="left" direction="horizontal"/>
                    </div>
                </div>

                <game-board-center/>

                <div class="cells-wrap cells-right">
                    <div v-for="id in [12,13,14,15,16,17,18,19,20]" class="cell-wrap">
                        <GameCell :id="id" position="right" direction="horizontal"/>
                    </div>
                </div>
            </div>
            <div class="bottom-row">
                <div class="cell-wrap cell-corner cell-corner-left">
                    <GameCell :id="31" position="bottom" direction="right"/>
                </div>
                <div v-for="id in [30,29,28,27,26,25,24,23,22]" class="cell-wrap">
                    <GameCell :id="id" position="bottom" direction="vertical"/>
                </div>
                <div class="cell-wrap cell-corner cell-corner-right">
                    <GameCell :id="21" position="bottom" direction="left"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import GameCell from './GameCell.vue';
    import GameBoardCenter from './GameBoardCenter.vue';
    // import GameChip from './GameChip.vue';
    // import { mapGetters } from 'vuex';
    // import GameCellPrices from "./GameCellPrices";

    export default {
        name: "GameBoard",
        components: {
            GameCell,
            GameBoardCenter,
        },
        data() {
            return {

            }
        },
        computed: {
            // ...mapGetters([
            //     'gamePlayers',
            //     'gameStore',
            //     'currentUser',
            // ]),
            // myActions() {
            //     const actions = this.gamePlayers.filter(pl => {
            //         return (pl.uuid === this.currentUser.uuid);
            //     }).map(pl => pl.availableActions);
            //     return actions[0] || [];
            // },
        },
        methods: {
            // doAction(action, params = {}) {
            //     console.log('ACTION: ', action, params);
            //     const route = `game_${action.route}`;
            //     this.showSelect(action);
            //     this.$socket.client.emit(route, params, (response) => {
            //         if (response.error) this.$dialog.alert(response.error); // TODO переделать
            //     });
            // },
            // showSelect(action) {
            //     const ref = `id_${action.route}`;
            //     if (this.$refs[ref] && this.$refs[ref].length > 0) {
            //         const elem = this.$refs[ref][0];
            //         if (elem.style.display === 'none') {
            //             elem.style.display = '';
            //         } else {
            //             elem.style.display = 'none';
            //         }
            //     }
            // },
        },
    };
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
    .geme-panel {
        width: 960px;
        height: 960px;
        margin: 0 auto;
        padding: 28px;
        position: relative;
    }
    .center-row {
        display: flex;
        .cells-wrap {
            display: flex;
            width: 125px;
            flex-wrap: wrap;
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
        }
    }
    .top-row, .bottom-row {
        display: flex;
        justify-content: space-between;
        .cell-wrap {
            width: 70px;
            height: 125px;
            margin: 0 1.5px;
        }
        .cell-corner {
            width: 125px;
            height: 125px;
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
