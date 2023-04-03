<template>
    <div>
        <p v-if="!noTitle">{{ $t("GAME_DIALOGS.Получено сияний") }}:</p>
        <p>
            <span v-for="item in formattedShines" :key="item.ico">
                <img :src="item.ico" alt="ico">
                {{ item.value }}
            </span>
        </p>
    </div>
</template>

<script>
export default {
    name: "ShineRow",
    props: {
        shines: {
            type: Object,
            required: true,
        },
        noTitle: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            shineIconMap: {
                shine1: "/design/icons/currencies/green.png",
                shine2: "/design/icons/currencies/yellow.png",
                shine3: "/design/icons/currencies/purple.png",
                shine4: "/design/icons/currencies/blue.png",
                shine5: "/design/icons/currencies/red.png",
            },
        };
    },
    computed: {
        formattedShines() {
            const formatted = [];
            for (const item in this.shines) {
                formatted.push({
                    value: this.shines[item],
                    ico: this.shineIconMap[item],
                });
            }
            return formatted;
        },
    },
};
</script>

<style lang="scss" scoped>
p {
    margin: 10px 0;
}
</style>
