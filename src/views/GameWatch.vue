<template>
  <div class="page-replays">
    <Banner/>

    <div class="games-spectator">
      <WatchFilter :title="$t('GAMES_SPECTRATOR.Игры для наблюдения')" />
      <div class="games-spectator__list" v-if="hasGames">
        <WatchCard
          v-for="(item, index) in getGamesList"
          :key="index"
          :data="item"
        />
      </div>
      <p v-else>{{ $t('GAMES_SPECTRATOR.Активных игр - нет') }}</p>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import Banner from "@/components/site/Banner";
import BaseTitle from "../components/base/BaseTitle";
import GameItem from "@/components/game-search/GameItem.vue";
import WatchCard from "@/components/watch/WatchCard";
import BaseButton from "@/components/base/BaseButton";
import WatchFilter from "@/components/watch/WatchFilter";

export default {
  name: 'GameWatch',
  components: {
    BaseTitle,
    Banner,
    GameItem,
    WatchCard,
    BaseButton,
    WatchFilter,
  },
  data() {
    return {
      /**
       * Получаем список активных игр из хранилища
       * создаем в this свойсвто updateTimer чтобы при destroyed() очистить таймер
       * */
      timer: null,
      gameListCounter: 0,
    }
  },
  computed: {
    ...mapGetters([
      'getGamesList',
      'getUpdateMark',
      'getFilters',
      'getFilterPlayers',
      'getMutations'
    ]),
    hasGames() {
      return this.getGamesList && this.getGamesList.length;
    },


  },
  watch: {
    getFilterPlayers: function (oldVal, newVal) {
      this.updateList()
    },
    getMutations: function (oldVal, newVal){
      this.updateList()
    }
  },
  mounted() {
    this.updateList();
  },
  destroyed() {
    clearInterval(this.timer)
  },

  updated() {

  },

  methods: {
    ...mapActions([
      'getWatchList',
    ]),
    ...mapMutations([
      'setUpdateMark'
    ]),
    async updateList(){
      await this.getWatchList()
    },
  },

};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.filters__wrapper{
  display: flex;
}

.games-spectator {
  max-width: 800px;
  margin: 0 auto;
  color: #fff;

  &__title {
    padding: 0;
    margin: 0;
    color: #fff;
    font-size: 22px;
    line-height: 1;
    font-weight: 500;
  }

  &__list {
    overflow: hidden;
    position: relative;
    left: -1.5%;
    width: 103%;
    display: flex;
    //justify-content: space-between;
    flex-wrap: wrap;
    margin: 12px auto;
  }

  &-item {
    flex: 0 1 33%;
    padding: 20px;
    margin: 0 1.5% 24px;
    background-color: #323639;
    border: 1.5px solid rgba(39, 39, 39, 0.5);
    border-radius: 12px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease;

    &:hover {
      border-color: #4F4F4F;
    }

    &__title {
      margin: 0 0 12px;
      font-size: 16px;
      line-height: 1.2;
      color: #fff;
    }

    &__link {
      text-decoration: none;

      &:hover,
      &:active,
      &:focus {
        span {
          border-bottom-color: transparent;
        }
      }

      span {
        display: inline-block;
        color: #fff;
        font-size: 16px;
        font-weight: 700;
        border-bottom: 1px solid;
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
