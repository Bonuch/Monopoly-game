<template>
    <div class="loser-modal">
        <div class="wrap">
            <h2>{{ $t("GAME_DIALOGS.Вы проиграли") }}!</h2>
            <div class="xp" v-if="getGameLoser.xp">
                <p class="xp__amount">{{ $t("GAME_DIALOGS.Вам начислено xp") }}: {{ getGameLoser.xp }}</p>
                <ShineRow :shines="getGameLoser.shinesForUser" />
                <div v-if="getGameLoser.prize">
                    <p class="bonus__title">{{ $t("GAME_DIALOGS.Бонус") }}:</p>
                    <div class="loot__bonus">
                        <div class="bonus__row" v-for="item in getGameLoser.prize">
                            <!--                        <span class="bonus__item-title">{{ item.title }}</span>-->
                            <ShineRow v-if="item.type==='money'" no-title
                                      :shines="item.money | formatShines "></ShineRow>
                            <div class="bonus__item__wrapper" v-else>
                                <p class="bonus__item"><img :src="item.image" :title="item.title" alt="#" /></p>
                            </div>
                        </div>
                        <p class="bonus__tips">{{ $t("GAME_DIALOGS.Бонусные предметы были помещены в инвентарь") }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="btn-wrap">
            <button v-if="!getGameLoser.finishGame" @click="watch()" class="watch">{{ $t("GAME_DIALOGS.Наблюдать") }}
            </button>
            <button @click="SOCKET_REMOVE_GAME()" class="close">{{ $t("GENERAL.Выйти") }}</button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ShineRow from "./ShineRow";

export default {
    name: "LoserModal",
    filters: {
        formatShines(val) {
            const formated = { ...val };
            delete formated.bucks;
            return formated;
        },
    },
    components: { ShineRow },
    data() {
        return {};
    },
    computed: {
        ...mapGetters([
            "getGameLoser",
        ]),
        showShines() {
            if (this.getGameLoser.shinesForUser) {
                let sum = 0;
                for (const key in this.getGameLoser.shinesForUser) {
                    sum += this.getGameLoser.shinesForUser[key]
                }
                if (sum > 0) {
                    return true;
                }
            }
            return false
        },
    },
    methods: {
        ...mapActions([
            "SOCKET_REMOVE_GAME",
        ]),
        watch() {
            this.$store.commit("setGameLoser", null);
            this.$socket.client.emit('stay_to_spectate', {
                gameId: this.$route.params.gameid
            }, async (data) => {
                console.log(data);
            })
        },
        async leaveGame() {
            await this.SOCKET_REMOVE_GAME();
            await this.$router.push({ name: "play" });
        },
    },
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

.bonus__title {
    margin-bottom: 0;
}

.loot__bonus {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}

.bonus__row {
    margin: 0;
}

.bonus__item-title {
    font-size: 18px;
    text-align: center;
    display: block;
}

.bonus__tips {
    font-size: 14px;
    text-align: center;
    width: 100%;
}

.bonus__item {
    margin: 0;
    text-align: center;

    img {
        margin-top: 5px;
        width: 50px;
        height: 50px;
        border-radius: 6px;
    }
}

.bonus__item__wrapper {
    display: inline-block;
}

.loser-modal {
    z-index: 10001;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 500px;
    //height: 300px;
    padding: 18px 10px;
    margin-top: -150px;
    margin-left: -250px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(14px);
    color: #000;
    text-align: center;
    transition: all 0.65s ease;
    border-radius: 6px;

    .wrap {
        //height: 200px;
    }

    h2 {
        font-size: 30px;
        //padding-bottom: 20px;
    }

    .xp {
        font-size: 22px;

        &__amount {
            margin: 0;
        }
    }

    .btn-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .close, .watch {
            text-align: center;
            display: block;
            margin: 0 auto;
            font-size: 15px;
            width: 135px;
            padding: 10px;
            color: #fff;
            text-decoration: none;
            border-radius: 3px;
            background: #6A1ED5;
        }
    }
}
</style>
