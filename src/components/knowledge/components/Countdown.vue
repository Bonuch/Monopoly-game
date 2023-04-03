<template>
    <span>{{ timer }}</span>
</template>

<script>
import moment from "moment/moment";

const momentDurationFormatSetup = require("moment-duration-format");

export default {
    name: "CountDown",
    props: [
        'deadline'
    ],
    data() {
        return {
            countdownProgress: null, // Ссылка на таймер
            progress: null, // Время до
            timer: null, // Отсчет
        }
    },
    computed: {

    },
    mounted() {
        momentDurationFormatSetup(moment)
        this.progress = new moment(this.deadline)
        if (this.getCurrentTimeDiff() > 0) {
            this.timer = new moment.duration(this.getCurrentTimeDiff()).format(this.getFormatTimeString(this.getCurrentTimeDiff()))
            this.startTimer();
        } else if (this.getCurrentTimeDiff() <= 0) {
            clearInterval(this.countdownProgress)
            this.$emit('upgradeDone')
        }
    },
    beforeDestroy() {
        this.clearCountdown(this.countdownProgress)
    },
    methods: {
        clearCountdown(timerId) {
            clearInterval(timerId)
            // this.$emit('upgradeDone')
        },
        getCurrentTimeDiff() {
            return this.progress.diff(new moment())
        },
        getFormatTimeString(diff) {
            return moment.duration(diff).days() === 0 ?
                            `h[${this.$t('KNOWLEDGE.Ч')}] m[${this.$t('KNOWLEDGE.М')}] s[${this.$t('KNOWLEDGE.С')}]`
                            :
                            `d[${this.$t('KNOWLEDGE.Д')}] h[${this.$t('KNOWLEDGE.Ч')}] m[${this.$t('KNOWLEDGE.М')}]`
        },
        startTimer() {
            // Если постоянно вызывать будет загружаться ????????
            if (this.getCurrentTimeDiff() > 0) {
                if (this.deadline) {
                    this.countdownProgress = setInterval(() => {
                        let diff = this.getCurrentTimeDiff()

                        // Мы не должны показывать отрицательное время, это криво
                        if (diff < 0) diff = 0

                        this.timer = new moment.duration(diff).format(this.getFormatTimeString(diff))
                        if (diff === 0 || diff < 0) {
                            this.clearCountdown(this.countdownProgress)
                            this.$emit('upgradeDone')
                        }
                    }, 1000)
                }
            }
        },
    },
    watch: {
        // Если используем ускорители, то значение может поменяться
        deadline() {
            this.progress = new moment(this.deadline)
        }
    }

}
</script>

<style scoped>

</style>
