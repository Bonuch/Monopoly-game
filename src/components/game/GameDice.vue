<template>
    <div>
        <div id="canvas"></div>
    </div>
</template>

<script>

import * as TEAL from '@/helpers/teal';
import {dicePlugin} from '@/helpers/dice';
import {mapGetters} from 'vuex';

export default {
    name: 'GameDice',
    data() {
        return {
            images: {},
        }
    },
    computed: {
        ...mapGetters([
            'gameDice',
            'gamePlayers',
            'gameStore',
        ]),
    },
    watch: {
        gameDice(val) {
            this.diceStart(val);
            console.log("DICEVAL", val)
        },
    },
    methods: {
        diceStart(dice) {

            let canvas = document.querySelector('#canvas');
            let box = new $t.dice.dice_box(canvas, {w: 500, h: 500});
            let set = '2d6'; //количество кубиков и тип
            // const userTurn2 = this.gameStore.dice_user_id;
            let userTurn = null;

            if (this.gameStore.fake_should_turn) {
                userTurn = this.gameStore.fake_should_turn;
            } else {
                userTurn = this.gameStore.userTurn;
            }
            const user = this.$store.getters.getPlayerById(userTurn)
            console.log(user.name)

            const image = this.images[userTurn];
            // $t.dice.use_true_random = false;
            $t.dice.dice_bg_url = image;

            function before_roll(vectors, notation, callback) {
                callback(dice);
                canvas.style.opacity = '1';
                canvas.style.visibility = 'visible';
            }

            function notation_getter() {
                return $t.dice.parse_notation(set);
            }

            function after_roll(notation, result) {

            }

            box.start_throw(notation_getter, before_roll, after_roll);

            setTimeout(() => {
                canvas.innerHTML = "";
                canvas.style.opacity = '0';
                canvas.style.visibility = 'hidden';
                box = null
            }, 2500);
        },
        preloadImages() {
            const players = this.gamePlayers;
            for (const player of players) {
                const image = new Image();
                image.src = player.dice;
                console.log("PLAYERINFO", player)
                this.images[player.uuid] = image;
            }

        }
    },
    mounted() {
        this.preloadImages();
    }
}
</script>

<style lang="scss" scoped>
#canvas {
    position: absolute;
    z-index: 9999;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    visibility: hidden;
    background-color: rgba(38, 44, 47, 0.5);
    transition: 300ms;
}
</style>
