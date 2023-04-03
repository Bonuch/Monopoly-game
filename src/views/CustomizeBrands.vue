<template>
    <main class="mainblock">
        <NavMenuProfile></NavMenuProfile>
        <div class="game-wrap">
            <GameBoard ref="gameboard"/>
        </div>
    </main>
</template>

<script>
    import GameBoard from '@/components/brands/GameBoard.vue';
    import { mapActions } from 'vuex';
    import NavMenuProfile from '@/components/navigations/NavMenuProfile';

    export default {
        name: 'CustomizeBrands',
        components: { GameBoard,  NavMenuProfile },
        data() {
            return {
            };
        },
        methods: {
            ...mapActions([
                'SOCKET_cells_for_customization',
            ]),
        },
        created() {
            this.SOCKET_cells_for_customization();
        }

    };
</script>

<style lang="scss">
    .main {
        background-color:#262c2f;
        color:white;
    }
    .game-wrap {
        padding-top: 10px;
        display: flex;
        justify-content: space-around;
    }
    .block-players {
        padding-top: 28px;
    }
    button {
        border: none;
        padding: 0;
        margin: 0;
        outline: none;
        cursor: pointer;
    }
</style>
