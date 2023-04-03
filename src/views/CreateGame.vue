<template>
    <main class="mainblock">

        <Banner />

        <CreateGameWidget/>

    </main>
</template>

<script>
    import Banner from '@/components/site/Banner';
    import CreateGameWidget from '@/components/game-lobby/CreateGameWidget.vue';
    import { mapGetters } from 'vuex';

    export default {
        name: 'CreateGame',
        components: {
            CreateGameWidget,
            Banner,
        },
        computed: {
            ...mapGetters(['']),
        }
    };
</script>

<style scoped lang="scss">

</style>
