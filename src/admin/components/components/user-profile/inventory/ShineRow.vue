<template>
    <div class="shine__row">
            <span v-for="item in formattedShines" :key="item.ico">
                <img :src="item.ico" alt="ico">
                {{ item.value }}
            </span>
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
.shine__row {
    display: flex;
    span {
        img{
            margin-right: 5px;
        }
        display: flex;
        margin-right: 10px;
        align-items: center;
    }
}
</style>
