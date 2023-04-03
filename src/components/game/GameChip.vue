<template>
    <!--    <div class="chip" :class="`player-${player.uuid}`" :style="playerStyle()">&nbsp</div>-->
    <img v-if="player.status == 'active'"
         class="chip"
         :class="[
            `player-${player.uuid}`,
            {shadowed: isBoughtCell},
            {fade: faded},
            {playerHovered: isPlayerHoverWidget}
         ]"
         :src="player.chip"
         alt="#"
         :key="player.uuid">
</template>

<script>
import { mapGetters } from "vuex";
import play from "../../views/Play";

export default {
    name: "GameChip",
    props: {
        player: {
            type: Object,
            required: true,
        },
    },
    computed: {
        ...mapGetters([
            "gamePlayers",
            "gameCells",
            "getPlayerCardHovered",
            "currentUser",
        ]),
        pulseAnim() {
          return true
        },
        isPlayerHoverWidget() {
            return !!(this.getPlayerCardHovered && this.getPlayerCardHovered.uuid === this.player.uuid);
        },
        faded() {
            return !!(this.getPlayerCardHovered && this.getPlayerCardHovered.uuid !== this.player.uuid);
        },
        isMyTurn() {
            return this.player.status === "active";
        },
        isBoughtCell() {
            const playerPos = this.player.position;
            const cell = this.gameCells[this.player.position - 1];
            return !!cell.owner_id;
        },
    },
    watch: {
        // отслеживаем изменение позиции в данных игрока
        player(newPlayerData, prevPlayerData) {
            // если прошлая позиция не равна текущей, двигаем фишку
            if (newPlayerData.position != prevPlayerData.position || newPlayerData.status != prevPlayerData.status) {
                let timeout = 0;
                let tm1;
                let tm2;
                let tm3;


                const prevPosition = prevPlayerData.position;
                const nextPosition = newPlayerData.position;

                tm1 = setTimeout(_ => {
                    this.lastChipsPosition(prevPosition);
                    clearTimeout(tm1);
                }, 100);


                for (const cell of newPlayerData.steps) {
                    if (typeof (cell) !== "object") {
                        timeout = timeout + 100;
                        tm2 = setTimeout(_ => {
                            this.moveChip(cell, 100);
                            clearTimeout(tm2);
                        }, timeout);
                    } else {
                        tm2 = setTimeout(_ => {
                            this.moveChip(cell.id, cell.delay);
                            clearTimeout(tm2);
                        }, timeout + 100);
                        timeout = timeout + cell.delay;
                    }
                }

                timeout = timeout + 100;
                tm3 = setTimeout(_ => {
                    this.newChipsPosition(nextPosition);
                    this.updatePlayerCell(nextPosition, newPlayerData.uuid);
                    clearTimeout(tm3);
                }, timeout);
            }
        },
    },
    methods: {

        setPlayerCell(celsId, playerUuid) {
            this.$store.commit("setPlayerCellStore", { celsId: celsId, playerUuid: playerUuid });
        },

        updatePlayerCell(celsId, playerUuid) {
            this.$store.commit("updatePlayerCellStore", { celsId: celsId, playerUuid: playerUuid });
        },

        // распределяем оставшиеся фишки на прошлой клетке
        lastChipsPosition(lastCellID) {
            let playersOnCell;
            let playerInJail;

            if (lastCellID) {
                playersOnCell = this.gamePlayers.filter(player => (player.position == lastCellID && player.uuid !== this.player.uuid && player.status == "active")); // возвращает игроков lastCellID клетки. Исключаем своего пользователя, так как в стейте его позиция еще не поменялась.
                playerInJail = playersOnCell.filter(player => (player.isInJail));
                playersOnCell.forEach((player, index) => {
                    this.chipsPositioningOnCell(lastCellID, index, player, playersOnCell.length, playerInJail.length);
                });
            }
        },

        // распределяем фишки на новой клетке
        newChipsPosition(cellId) {
            let playersOnCell;
            let playerInJail;
            playersOnCell = this.gamePlayers.filter(player => (player.position == cellId && player.status == "active")); // возвращает игроков cellID клетки
            if (playersOnCell.length === 0) {
                playersOnCell.push(this.player); // добавляем своего пользователя, так как в стейте его позиция еще не поменялась
            }
            playerInJail = playersOnCell.filter(player => (player.isInJail));
            playersOnCell.forEach((player, index) => {
                this.chipsPositioningOnCell(cellId, index, player, playersOnCell.length, playerInJail.length);
            });
        },

        //перемещаем фишку на клетку
        moveChip(cellID, delay) {
            const cell = document.querySelector("#cell-" + cellID);
            const chip = document.querySelector(".player-" + this.player.uuid);

            let left = cell.offsetLeft + (cell.offsetWidth / 2) - (chip.offsetWidth / 2);
            let top = cell.offsetTop + (cell.offsetHeight / 2) - (chip.offsetHeight / 2);
            chip.style.transition = delay + "ms";
            chip.style.left = left + "px";
            chip.style.top = top + "px";
        },

        // Позиционирует фишки внутри клеток
        chipsPositioningOnCell(cellId, playerNo, player, playersNumber, playerInJail = null) {
            const sizeChips = {
                "rectangle": {
                    1: 60,
                    2: 50,
                    3: 35,
                    4: 30,
                    5: 30,
                },
                "jail": {
                    1: 60,
                    2: 30,
                    3: 30,
                    4: 30,
                    5: 30,
                },
                "square": {
                    1: 60,
                    2: 50,
                    3: 50,
                    4: 50,
                    5: 30,
                },
            };

            const cell = document.querySelector("#cell-" + cellId);
            const chip = document.querySelector(".player-" + player.uuid);

            let sizeChip;
            let offsetLeft = chip.offsetLeft;
            let offsetTop = chip.offsetTop;

            let playerInRoulette = 0;

            switch (cell.dataset.direction) {
                case "vertical":
                    sizeChip = sizeChips["rectangle"][playersNumber];
                    switch (playersNumber) {
                        case 1:
                            offsetTop = cell.offsetTop + (cell.offsetHeight / 2) - (sizeChip / 2);
                            offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2) - (sizeChip / 2);
                            break;
                        case 2:
                            offsetTop = cell.offsetTop + ((cell.offsetHeight / 2) - sizeChip) + (sizeChip * playerNo);
                            offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2) - (sizeChip / 2);
                            break;
                        case 3:
                            offsetTop = cell.offsetTop + ((cell.offsetHeight / 2) - (sizeChip * (playersNumber / 2)) + (sizeChip * playerNo));
                            offsetLeft = cell.offsetLeft;
                            if (playerNo % 2) {
                                offsetLeft = cell.offsetLeft + (cell.offsetWidth - sizeChip);
                            }
                            break;
                        case 4:
                            switch (playerNo) {
                                case 0:
                                    offsetTop = cell.offsetTop + ((cell.offsetHeight / 4) - (sizeChip / 2));
                                    offsetLeft = cell.offsetLeft;
                                    break;
                                case 1:
                                    offsetTop = cell.offsetTop + ((cell.offsetHeight / 4) - (sizeChip / 2));
                                    offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                    break;
                                case 2:
                                    offsetTop = cell.offsetTop + ((cell.offsetHeight / 4) * 3) - (sizeChip / 2);
                                    offsetLeft = cell.offsetLeft;
                                    break;
                                case 3:
                                    offsetTop = cell.offsetTop + ((cell.offsetHeight / 4) * 3) - (sizeChip / 2);
                                    offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                    break;
                            }
                            break;
                        case 5:
                            switch (playerNo) {
                                case 0:
                                    offsetTop = cell.offsetTop + ((cell.offsetHeight / 4) - (sizeChip / 2));
                                    offsetLeft = cell.offsetLeft;
                                    console.log("Игрок с индексом 0");
                                    break;
                                case 1:
                                    offsetTop = cell.offsetTop + ((cell.offsetHeight / 4) - (sizeChip / 2));
                                    offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                    break;
                                case 2:
                                    offsetTop = cell.offsetTop + ((cell.offsetHeight / 4) * 3) - (sizeChip / 2);
                                    offsetLeft = cell.offsetLeft;
                                    break;
                                case 3:
                                    offsetTop = cell.offsetTop + ((cell.offsetHeight / 4) * 3) - (sizeChip / 2);
                                    offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                    break;
                                case 4:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2) - (sizeChip / 2);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2) - (sizeChip / 2);
                                    break;
                            }
                            break;
                    }
                    chip.style.left = offsetLeft + "px";
                    chip.style.top = offsetTop + "px";
                    break;
                case "horizontal":
                    sizeChip = sizeChips["rectangle"][playersNumber];
                    switch (playersNumber) {
                        case 1:
                            offsetTop = cell.offsetTop + (cell.offsetHeight / 2) - (sizeChip / 2);
                            offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2) - (sizeChip / 2);
                            break;
                        case 2:
                            offsetLeft = cell.offsetLeft + ((cell.offsetWidth / 2) - sizeChip) + (sizeChip * playerNo);
                            offsetTop = cell.offsetTop + (cell.offsetHeight / 2) - (sizeChip / 2);
                            break;
                        case 3:
                            offsetLeft = cell.offsetLeft + ((cell.offsetWidth / 2) - (sizeChip * (playersNumber / 2)) + (sizeChip * playerNo));
                            offsetTop = cell.offsetTop;
                            if (playerNo % 2) {
                                offsetTop = cell.offsetTop + (cell.offsetHeight - sizeChip);
                            }
                            break;
                        case 4:
                            switch (playerNo) {
                                case 0:
                                    offsetLeft = cell.offsetLeft + ((cell.offsetWidth / 4) - (sizeChip / 2));
                                    offsetTop = cell.offsetTop;
                                    break;
                                case 1:
                                    offsetLeft = cell.offsetLeft + ((cell.offsetWidth / 4) - (sizeChip / 2));
                                    offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                    break;
                                case 2:
                                    offsetLeft = cell.offsetLeft + ((cell.offsetWidth / 4) * 3) - (sizeChip / 2);
                                    offsetTop = cell.offsetTop;
                                    break;
                                case 3:
                                    offsetLeft = cell.offsetLeft + ((cell.offsetWidth / 4) * 3) - (sizeChip / 2);
                                    offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                    break;
                            }
                            break;
                        case 5:
                            switch (playerNo) {
                                case 0:
                                    offsetLeft = cell.offsetLeft + ((cell.offsetWidth / 4) - (sizeChip / 2));
                                    offsetTop = cell.offsetTop;
                                    break;
                                case 1:
                                    offsetLeft = cell.offsetLeft + ((cell.offsetWidth / 4) - (sizeChip / 2));
                                    offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                    break;
                                case 2:
                                    offsetLeft = cell.offsetLeft + ((cell.offsetWidth / 4) * 3) - (sizeChip / 2);
                                    offsetTop = cell.offsetTop;
                                    break;
                                case 3:
                                    offsetLeft = cell.offsetLeft + ((cell.offsetWidth / 4) * 3) - (sizeChip / 2);
                                    offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                    break;
                                case 4:
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2) - (sizeChip / 2);
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2) - (sizeChip / 2);
                                    break;
                            }
                            break;
                    }

                    chip.style.left = offsetLeft + "px";
                    chip.style.top = offsetTop + "px";
                    break;
                case "jail":
                    playerInRoulette = playersNumber - playerInJail;
                    if (player.isInJail) {
                        sizeChip = sizeChips[cell.dataset.direction][playerInJail];
                        switch (playerInJail) {
                            case 1:
                                offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                offsetLeft = cell.offsetLeft;
                                break;
                            case 2:
                                switch (playerNo) {
                                    case 0:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - (sizeChip * 2);
                                        offsetLeft = cell.offsetLeft;
                                        break;
                                    case 1:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                        offsetLeft = cell.offsetLeft + sizeChip;
                                        break;
                                }
                                break;
                            case 3:
                                switch (playerNo) {
                                    case 0:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - (sizeChip * 2);
                                        offsetLeft = cell.offsetLeft;
                                        break;
                                    case 1:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                        offsetLeft = cell.offsetLeft + sizeChip;
                                        break;
                                    case 2:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                        offsetLeft = cell.offsetLeft;
                                        break;
                                }
                                break;
                            case 4:
                                switch (playerNo) {
                                    case 0:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - (sizeChip * 2);
                                        offsetLeft = cell.offsetLeft;
                                        break;
                                    case 1:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                        offsetLeft = cell.offsetLeft + sizeChip;
                                        break;
                                    case 2:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                        offsetLeft = cell.offsetLeft;
                                        break;
                                    case 3:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - (sizeChip * 2);
                                        offsetLeft = cell.offsetLeft + sizeChip;
                                        break;
                                }
                                break;
                            case 5:
                                switch (playerNo) {
                                    case 0:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - (sizeChip * 2);
                                        offsetLeft = cell.offsetLeft;
                                        break;
                                    case 1:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                        offsetLeft = cell.offsetLeft + sizeChip;
                                        break;
                                    case 2:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                        offsetLeft = cell.offsetLeft;
                                        break;
                                    case 3:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - (sizeChip * 3);
                                        offsetLeft = cell.offsetLeft;
                                        break;
                                    case 4:
                                        offsetTop = cell.offsetTop + cell.offsetHeight - sizeChip;
                                        offsetLeft = cell.offsetLeft + (sizeChip * 2);
                                        break;
                                }
                                break;
                        }
                    } else {
                        sizeChip = sizeChips[cell.dataset.direction][playerInRoulette];
                        switch (playerInRoulette) {
                            case 1:
                                offsetTop = cell.offsetTop;
                                offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                break;
                            case 2:
                                switch (playerNo) {
                                    case 0:
                                        offsetTop = cell.offsetTop;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - (sizeChip * 2);
                                        break;
                                    case 1:
                                        offsetTop = cell.offsetTop + sizeChip;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                        break;
                                }
                                break;
                            case 3:
                                switch (playerNo) {
                                    case 0:
                                        offsetTop = cell.offsetTop;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - (sizeChip * 2);
                                        break;
                                    case 1:
                                        offsetTop = cell.offsetTop + sizeChip;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                        break;
                                    case 2:
                                        offsetTop = cell.offsetTop;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                        break;
                                }
                                break;
                            case 4:
                                switch (playerNo) {
                                    case 0:
                                        offsetTop = cell.offsetTop;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - (sizeChip * 2);
                                        break;
                                    case 1:
                                        offsetTop = cell.offsetTop + sizeChip;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                        break;
                                    case 2:
                                        offsetTop = cell.offsetTop;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                        break;
                                    case 3:
                                        offsetTop = cell.offsetTop + sizeChip;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - (sizeChip * 2);
                                        break;
                                }
                                break;
                            case 5:
                                switch (playerNo) {
                                    case 0:
                                        offsetTop = cell.offsetTop;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - (sizeChip * 2);
                                        break;
                                    case 1:
                                        offsetTop = cell.offsetTop + sizeChip;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                        break;
                                    case 2:
                                        offsetTop = cell.offsetTop;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                        break;
                                    case 3:
                                        offsetTop = cell.offsetTop;
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - (sizeChip * 3);
                                        break;
                                    case 4:
                                        offsetTop = cell.offsetTop + (sizeChip * 2);
                                        offsetLeft = cell.offsetLeft + cell.offsetWidth - sizeChip;
                                        break;
                                }
                                break;
                        }
                    }
                    chip.style.top = offsetTop + "px";
                    chip.style.left = offsetLeft + "px";
                    break;
                case "left":
                case "right":
                    sizeChip = sizeChips["square"][playersNumber];
                    switch (playersNumber) {
                        case 1:
                            offsetLeft = (cell.offsetLeft + cell.offsetWidth / 2) - (sizeChip / 2);
                            offsetTop = (cell.offsetTop + cell.offsetHeight / 2) - (sizeChip / 2);
                            break;
                        case 2:
                            switch (playerNo) {
                                case 0:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2 - sizeChip);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2 - sizeChip);
                                    break;
                                case 1:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2);
                                    break;
                            }
                            break;
                        case 3:
                            switch (playerNo) {
                                case 0:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2 - sizeChip);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2 - sizeChip);
                                    break;
                                case 1:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2 - sizeChip / 2);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2);
                                    break;
                                case 2:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2 - sizeChip);
                                    break;
                            }
                            break;
                        case 4:
                            switch (playerNo) {
                                case 0:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2 - sizeChip);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2 - sizeChip);
                                    break;
                                case 1:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2 - sizeChip);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2);
                                    break;
                                case 2:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2 - sizeChip);
                                    break;
                                case 3:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2);
                                    break;
                            }
                            break;
                        case 5:
                            switch (playerNo) {
                                case 0:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2 - sizeChip / 2);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2 - sizeChip / 2);
                                    break;
                                case 1:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2 - sizeChip * 1.5);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2 - sizeChip * 1.5);
                                    break;
                                case 2:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2 - sizeChip - sizeChip / 2);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2 + sizeChip / 2);
                                    break;
                                case 3:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2 + sizeChip / 2);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2 - sizeChip * 1.5);
                                    break;
                                case 4:
                                    offsetTop = cell.offsetTop + (cell.offsetHeight / 2 + sizeChip / 2);
                                    offsetLeft = cell.offsetLeft + (cell.offsetWidth / 2 + sizeChip / 2);
                                    break;
                            }
                            break;
                    }
                    chip.style.top = offsetTop + "px";
                    chip.style.left = offsetLeft + "px";
                    break;
            }
            chip.style.width = sizeChip + "px";
            chip.style.height = sizeChip + "px";
        },
    },
    mounted() {
        this.newChipsPosition(this.player.position);
        this.setPlayerCell(this.player.position, this.player.uuid);
    },
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

.shadowed {
    filter: drop-shadow(0px 7px 6px #000);
}

.chip {
    width: 60px;
    height: 60px;
    position: absolute;
    /*border-radius: 50%;*/
    /*border: 2px solid #000;*/
    transition: 100ms;
    z-index: 8000;

    &.number-2 {
        width: 50px;
        height: 50px;
    }
}

.playerHovered {
    opacity: 1;
}
.fade {
    opacity: .3;
}
.pulseAnim {
    animation-name: pulseShadow;
    animation-duration: 1.5s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
}
@keyframes pulseShadow {
    0% {
        filter: drop-shadow(0px 0px 0px var(--color-yellow-dark));
    }
    50% {
        filter: drop-shadow(0px 0px 20px var(--color-yellow-light));
    }
    0% {
        filter: drop-shadow(0px 0px 0px var(--color-yellow-dark));
    }
}

</style>
