<template>
    <main class="mainblock">
        <NavMenuProfile />
        <div class="dice-wrap">
            <CustomDice v-for="dice in getDice"  v-bind:key="dice.id" :dice="dice" />
        </div>
    </main>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import NavMenuProfile from "@/components/navigations/NavMenuProfile";
    import CustomDice from '@/components/dice/CustomDice.vue';

    export default {
        name: "CustomChips",
        components: {CustomDice, NavMenuProfile},
        computed: {
            ...mapGetters([
                'getDice'
            ]),
        },
        methods: {
            ...mapActions([
                'SOCKET_GET_DICE_FOR_CUSTOMIZATION',
            ]),
        },
        created() {
            this.SOCKET_GET_DICE_FOR_CUSTOMIZATION();
        },
    };
</script>

<style lang="scss">
    .main {
        background-color:#262c2f;
        color:white;
    }
    button {
        border: none;
        padding: 0;
        margin: 0;
        outline: none;
        cursor: pointer;
    }
    .dice-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 86px 20px 40px;
    }
</style>
