<template>
    <div class="custom-games-list">
        <div class="title">{{ $t('SEARCH_CREATE_GAME.Кастомные игры') }}</div>
<!--        class="list masonry"-->
        <div
             class="list ml-7"
             v-if="customGamesSearchResults.length"
             v-masonry="123"
             item-selector=".item"
             gutter="15"
        >
            <GameItem v-masonry-tile class="item" v-for="game in customGamesSearchResults" :key="game.creator_uuid"
                      :game="game"/>
        </div>
        <p class="message" v-else>
            {{ $t('SEARCH_CREATE_GAME.Сейчас никто не играет') }}
        </p>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import GameItem from '../game-search/GameItem.vue';
import Masonry from 'masonry-layout'

export default {
    name: 'GameListWidget',
    components: {
        GameItem,
    },
    computed: {
        ...mapGetters([
            'customGamesSearchResults',
        ]),
        gameSearchColumns() {
            let res = {col1: [], col2: [], col3: []}
            let colCounter = 1;
            for (const item of this.customGamesSearchResults) {
                if (colCounter > 3) colCounter = 1
                res[`col${colCounter}`].push(item)
                colCounter++;
            }
            return res
        },
    },
    methods: {
        ...mapActions(['refreshCustomGamesSearch', 'gamesSearchSpectator']),
        addSpectator() {
        }
    },
    created() {
        this.refreshCustomGamesSearch().then(response => {
            if (response.error) this.$dialog.alert(response.error);
        });
    }
};
</script>

<style scoped lang="scss">
.flex-col {
    display: flex;
    flex-direction: column;
}
.ml-7 {
    margin-left: 7px;
}
.custom-games-list {
    max-width: 800px;
    margin: 0 auto;
    @media only screen and (max-width: 1480px) {
        max-width: 528px;
    }
    @media only screen and (max-width: 1366px) {
        max-width: 800px;
    }
    @media only screen and (max-width: 1112px) {
        max-width: 540px;
    }

    .title {
        font-size: 22px;
        color: #fff;
        line-height: 22px;
        margin: 16px 0 8px 8px;
        text-align: center;
    }

    .list {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        align-content: flex-start;
        align-items: flex-start;
    }

    .message {
        margin: 20px 0 20px 8px;
        text-align: center;
        color: #fff;

        span {
            padding: 20px 50px;
            display: inline-block;
            //background: rgb(255, 255, 255);
            //background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%);
        }
    }
}
</style>
