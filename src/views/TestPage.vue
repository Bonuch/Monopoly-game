<template>
    <Dice2dRender ref="dice2d"/>
</template>

<script>
import Dice2dRender from "../components/game/Dice2dRender";
export default {
    name: "TestPage",
    components: { Dice2dRender },
    mounted() {
        this.$refs.dice2d.rollDices(5, 5)
    }
};
</script>

<style scoped>

</style>
