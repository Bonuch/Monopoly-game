<template>
    <div class="game-notification" :class="{visible}">
        <h2>{{ $t("NOTIFY.your_turn") }}</h2>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "GameNotification",
    data() {
        return {
            visible: false,
            visiblityTimer: null,
        }
    },
    computed: {
        ...mapGetters([
            'gameStore',
            'currentUser'
        ]),
    },
    watch: {
        'gameStore.userTurn':  function (val, old) {
            if (val === this.currentUser.uuid) {
                this.visible = true
                this.startCountdown()
                // const switchTurn = new Audio('/samples/swoosh.ogg')
                // switchTurn.play()
            }
        }
    },
    methods: {
        startCountdown() {
            this.visiblityTimer = setTimeout(() => {
                this.visible = false
                this.visiblityTimer = null
            }, 2000)
        }
    }
};
</script>

<style lang="scss" scoped>
.game {
    &-notification {
        position: fixed;
        background: rgba(#003300, .5);
        width: 100%;
        height: 100%;
        display: none;
        justify-content: center;
        align-items: center;
        left: 0;
        top: 0;
        z-index: 100000;
        backdrop-filter: blur(5px);

        &.visible {
            display: flex;
            animation-name: fadeOut;
            animation-duration: 2s;
            animation-fill-mode: backwards;
        }
    }
}
@keyframes fadeOut {
    0% {opacity: 1;}
    100% {
        opacity: 0;
        display: none;
    }
}
</style>
