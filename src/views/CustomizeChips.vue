<template>
    <main class="mainblock">
        <NavMenuProfile></NavMenuProfile>
        <div class="chips-wrap">
            <CustomChip v-for="chip in getChips"  v-bind:key="chip.id" :chip="chip"></CustomChip>
        </div>
    </main>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import NavMenuProfile from "@/components/navigations/NavMenuProfile";
    import CustomChip from '@/components/chips/CustomChip.vue';

    export default {
        name: "CustomChips",
        components: {CustomChip, NavMenuProfile},
        data() {
            return {
            };
        },
        computed: {
            ...mapGetters([
                'getChips'
            ]),
        },
        methods: {
            ...mapActions([
                'SOCKET_GET_CHIPS_FOR_CUSTOMIZATION',
            ]),
        },
        created() {
            this.SOCKET_GET_CHIPS_FOR_CUSTOMIZATION();
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
    .chips-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 86px 20px 40px;
    }
</style>
