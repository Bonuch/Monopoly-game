<template>
    <div class="progressbar">
        <div
            v-if="progress"
            class="bar"
            :style="{width: isFinite(progress) ? progress + '%': 100 + '%'}"
        />
        <div
            v-else
            class="bar"
            :style="{width: barProgressValue + '%'}"
        />
        <div class="stat">
            <span class="current">{{ checkCurrentStat }}</span>
            <span v-if="stats.next && stats.next !== 'null'" class="modify">+{{ stats.next }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "Progress",
    props: {
        max: Number,
        current: Number,
        stats: Object,
        isPercent: Boolean,
        progress: Number,
    },
    computed: {
        checkCurrentStat() {
            return this.stats.current !== "null" || !this.stats.current ? this.stats.current : 0
        },
        barProgressValue() {
            let value = this.checkCurrentStat / this.max * 100
            if (value > 100) value = 100
            return value
        }
    },
    data() {
        return {}
    },
}
</script>

<style lang="scss" scoped>

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
    }
}

.stat {
    position: absolute;
    width: 100%;

    .current {
        margin-right: 5px;
    }

    .modify {
        color: var(--color-yellow-dark);
    }
}

</style>
