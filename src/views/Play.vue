<template>
    <main class="mainblock">
        <Banner />

        <StandardGameSearchForm />

        <GameListWidget />
    </main>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import StandardGameSearchForm from '@/components/game-search/StandardGameSearchForm.vue';
    import GameListWidget from '@/components/game-search/GameListWidget.vue';
    import Banner from '@/components/site/Banner';

    export default {
        name: 'Play',
        components: {
            StandardGameSearchForm,
            GameListWidget,
            Banner
        },
        data() {
            return {};
        },
        mounted() {
          this.loadMutationIcons()
        },
      created() {
        },
        computed: {
            ...mapGetters([
                'currentGameUuid',
                'gameLobbyCreator',
                'gameLobbyDetails',
            ])
        },
        methods: {
          ...mapActions([
            'loadMutationIcons'
          ]),
        }
    };
</script>

<style scoped lang="scss">
    .mainblock {
        color: #000;
    }
</style>
