<template>
    <div class='progressbar'>
        <div
            class='bar'
            :style="{ width: progress_value + '%' }"
        />
        <transition name='fade'>
            <div v-if='progressAfter && progressAfter.duration' class='progress progress-after'
                 :style='{width: calcProgressAfter + "%"}'>
            </div>
        </transition>
        <div class='stat'>
            <span class='current'>{{ progress_value | formatProgress }}</span>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'TimeProgress',
    filters: {
        formatProgress(value) {
            return `${parseInt(value)} %`;
        },
    },
    props: {
        progress: {
            type: Number,
            required: true,
        },
        total_time: {
            type: Number,
            required: true,
        },
        finish_time: {
            type: [Number, String, Date],
            required: true,
        },
        progressAfter: {
            required: false,
            type: Object,
        },
    },
    data() {
        return {
            progress_value: 0,
            timer: null,
        };
    },
    computed: {
        calcProgressAfter() {
            const timePassed = parseInt(this.total_time) / 100 * this.progress_value;
            const afterProg = this.progressAfter.duration;
            const boostTime = moment.duration(afterProg * this.progressAfter.amount);
            const res = (timePassed + boostTime) / this.total_time * 100 >= 100 ? 100 : (timePassed + boostTime) / this.total_time * 100;
            return res ? res : 0;
        },
    },
    mounted() {
        this.progress_value = this.progress;
        this.timer = setInterval(() => {
            this.updateProgress();
        }, 1000);
        this.updateProgress();
    },
    methods: {
        updateProgress() {
            const remainSeconds = moment(this.finish_time).unix() - moment().unix();
            let progress_value = 100 - Math.round((remainSeconds / (this.total_time / 100)) * 100) / 100;
            if (progress_value > 100) progress_value = 100;
            this.progress_value = progress_value;
            this.$store.commit('setUpgradeTimeProgress', progress_value);
        },
    },
    destroyed() {
        clearInterval(this.timer);
    },
};
</script>

<style lang='scss' scoped>

.progressbar {
    width: 100%;
    height: 30px;
    background: #1C1C2F;
    border-radius: 3px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .bar {
        position: absolute;
        width: 105px;
        height: 30px;
        left: 0;
        background: linear-gradient(90deg, #E91A1A 0%, rgba(255, 214, 0, 0.92) 110.24%);
        border-radius: 3px;
        transition: linear 1s;
        z-index: 2;
    }

    .progress.progress-after {
        @extend .bar;
        background: rgba(255, 214, 0, 0.4);
        transition: .5s;
        z-index: 1;
    }
}

.stat {
    position: absolute;
    width: 100%;
    z-index: 3;

    .current {
        margin-right: 5px;
    }

    .modify {
        color: #F5CD3F;
    }
}

.fade-enter-active {
    transition: .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
}

</style>
