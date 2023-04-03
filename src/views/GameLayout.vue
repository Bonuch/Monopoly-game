<template>
    <div
        v-if="playersState && cellsState"
        class="game-wrap"
    >
        <div class="block-players game-wrap__item" :class="{mobile: isMobileWidth}">
            <template v-if="!isMobileWidth">
                <UserProfileWidget v-for="player in playersList" :key="player.uuid"
                                   :player="player" />
            </template>
            <template v-else>
                <UserProfileMobileWidget v-for="player in playersList" :key="player.uuid+'mob'"
                                         :player="player" />
            </template>

        </div>

        <GameBoard
            class="game-wrap__item game-wrap__board"
            ref="gameboard"
            :current-player="currentPlayer || {}"
        />

        <!--        здесь будет правый блок -->
        <div id="right-aside" class="game-wrap__item game-wrap__right">
            <Notifications :popupNumber="5" :listNumber="10" :gameMode="true" bind-selector="#right-aside" />
            <br>
            <br>
            <button v-if="gameStore.spectator" @click="exitGame()">
                {{ $t("GENERAL.Выйти") }}
            </button>
        </div>
        <div class="bugreport">
            <a href="#" @click="openBugModal" class="btn__bugreport"><i class="fas fa-bug"></i><span v-if="!isMobileWidth">я нашел баг</span></a>
            <BugModal
                v-if="bugModal"
                @closeBugModal="bugModal = false"
            />
        </div>
    </div>


</template>

<script>
import { mapGetters, mapActions } from "vuex";
import GameBoard from "@/components/game/GameBoard.vue";
import UserProfileWidget from "@/components/game/UserProfileWidget.vue";
import UserProfileMobileWidget from "@/components/game/UserProfileMobileWidget";
import WinnerModal from "@/components/game/WinnerModal.vue";
import LoserModal from "@/components/game/LoserModal.vue";
import WinnerModalForSpectator from "@/components/game/WinnerModalForSpectator.vue";
import Notifications from "@/components/notifications/Notifications.vue";
import BugModal from "../components/game/BugModal";

let activityTimer = null;

export default {
    name: "GameLayout",
    components: {
        Notifications,
        GameBoard,
        UserProfileWidget,
        UserProfileMobileWidget,
        WinnerModal,
        LoserModal,
        WinnerModalForSpectator,
        BugModal,
    },
    data() {
        return {
            myStatus: "online", // away
            awayTimeout: 120, // секунд
            lastActivity: 0,
            bugModal: false,
        };
    },
    computed: {
        ...mapGetters([
            "gameStore",
            "currentUser",
            "getGameLoser",
            "gamePlayers",
            "isMobileWidth",
        ]),
        // сортируем массив игроков по очередности хода
        playersList() {
            const result = [];
            let currentUserIndex = this.gamePlayers.findIndex(p => {
                return p.uuid === this.currentUser.uuid;
            });
            result.push(...this.gamePlayers.slice(currentUserIndex, this.gamePlayers.length));
            result.push(...this.gamePlayers.slice(0, currentUserIndex));
            return result;
        },
        playersState() {
            return this.$store.getters.gamePlayers;
        },
        cellsState() {
            return this.$store.getters.gameCells;
        },
        currentPlayer() {
            return this.$store.getters.getPlayerById(this.currentUser.uuid);
        },
    },
    methods: {
        ...mapActions([
            "loadProfileData",
            "SOCKET_REMOVE_GAME",
        ]),
        exitGame() {
            this.$router.push("/play/games");
            this.SOCKET_REMOVE_GAME();
            this.$socket.client.emit("leave_spectate", {
                gameId: this.$route.params.gameid,
            }, (data) => {
            });
        },
        openBugModal() {
            this.bugModal = true;
        },
    },

    mounted() {
        // отслеживание статуса пользователя
        activityTimer = setInterval(this.checkActivity, 5000);
        if (!this.gameStore) {
            this.$socket.client.emit("check_game", this.$route.params.gameid);
        }
    },
    checkActivity() {
        const now = Math.floor((new Date()).valueOf() / 1000);
        if ((now - this.lastActivity) > this.awayTimeout && this.status !== "away") {
            this.status = "away";
            this.$socket.client.emit("update_user_status", this.status);
        }
    },
    destroyed() {
        clearInterval(activityTimer);
    },
};
</script>

<style lang="scss">
.btn__bugreport {
    text-decoration: none;

    i {
        margin-right: 5px;
    }
}

.main {
    background-color: #262c2f;
    color: white;
}

.game-wrap {
    padding-top: 10px;
    display: flex;
    justify-content: space-around;
    height: 100vh;
    box-sizing: border-box;
    //justify-content: space-between;
    //flex-wrap: wrap;
    @media screen and (max-width: 1366px) {
        flex-wrap: wrap;
    }
    @media screen and (max-width: 980px) {
        height: 0;
    }
    &__board {
        flex: 1;
        @media screen and (max-width: 1366px) {
            order: -1;
            //margin: auto;
            flex: 1 0 100%;
        }
        @media screen and (max-width: 1180px) {
            order: -1;
            margin-top: 20px;
            //margin: auto;
        }
    }

    &__right {
        flex: 1;
        position: relative;
        min-width: 130px;
        @media screen and (max-width: 1366px) {
            position: absolute;
            right: 0;
            min-width: 250px;
        }
        @media screen and (max-width: 1180px) {
            max-width: 250px;
            order: 2;
        }
    }

    &__item {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}

.block-players {
    padding-top: 28px;
    padding-right: 10px;
    flex: 1;
    @media screen and (max-width: 1366px) {
        order: 1;
    }
    @media screen and (max-width: 1180px) {
        order: 1;
    }

    &.mobile {
        position: absolute;
        left: 0;
        justify-content: center;

        @media screen and (max-width: 980px) {
            order: 1;
            top: 0;
            position: relative;
            flex-direction: row;
            margin-top: 20px;
            margin-bottom: 10px;
        }
    }
}


button {
    border: none;
    padding: 0;
    margin: 0;
    outline: none;
    cursor: pointer;
}

.site-notifications {
    .hiddenList {
        background: none !important;

        &:after {
            display: none !important;
        }
    }

    .items {
        background: none !important;
    }
}

.bugreport {
    position: absolute;
    display: block;
    height: 50px;
    top: 50px;
    right: 0px;
    background: var(--color-background-3);
    border-radius: 5px 0 0 5px;
    z-index: 1000;

    @media screen and (max-width: 1180px) {
        margin-bottom: 0;
        margin-right: 7px;
        border-radius: 12px 12px 0 0;
        position: absolute;
        flex-direction: row;
        bottom: 0;
        top: unset;
    }

    a {
        display: block;
        padding: 15px;
        color: #fff;
    }
}
</style>
