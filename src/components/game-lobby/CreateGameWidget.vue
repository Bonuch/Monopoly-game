<template>
    <div class="create-game-widget">

        <GameForm v-if="!gameLobbyDetails && !currentGameUuid" :setAlert="setAlert" />

        <WeeklyMutations class="weekly__mutation" v-if="!gameLobbyDetails && !currentGameUuid" :alert="alert"/>

        <GameLobby v-if="!!gameLobbyDetails || !!currentGameUuid"/>
    </div>
</template>

<script>
    import GameForm from './parts/GameForm';
    import WeeklyMutations from './parts/WeeklyMutations';
    import GameLobby from './parts/GameLobby';
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'CreateGameWidget',
        components: {
            GameForm,
            WeeklyMutations,
            GameLobby,
        },
        data() {
            return {
                alert: '',
            };
        },
        computed: {
            ...mapGetters([
                'currentGameUuid',
                'gameLobbyDetails',
            ]),
        },
        methods: {
            ...mapActions(['setGameLobbyWidget']),
            setAlert(message) {
                this.alert = message;
            }
        },
        mounted() {
            this.setGameLobbyWidget(1);
        },
        destroyed() {
            this.setGameLobbyWidget(0);
        }
    };
</script>

<style scoped lang="scss">
    $widgetWidth: 812px;

    .create-game-widget {
        display: flex;
        width: $widgetWidth;
        /*background: linear-gradient(0deg, #FFFFFF, #FFFFFF), #323639;*/
        /*border: 1px solid #E6E6E6;*/
        border-radius: 12px;
        min-height: 610px;
        margin: 40px auto;
        text-align: left;
        overflow: hidden;
        background: #323639;
        border: 1px solid #323639;
        color: #fff;
        @media only screen and (max-width: 1600px) {
            width: 710px;
        }
        @media only screen and (max-width: 1440px) {
            width: 812px;
        }
        @media only screen and (max-width: 1120px) {
            width: 500px;
        }
    }
    .weekly__mutation {
        @media only screen and (max-width: 1120px) {
            display: none;
        }
    }
</style>
