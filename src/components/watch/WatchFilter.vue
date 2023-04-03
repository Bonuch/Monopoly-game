<template>
  <div class="filter__wrapper">
    <h1 class="page__title">{{ title }}</h1>
    <div class="search-game">
      <div class="players-wrapper">
      <span class="text">
        {{ $t("GAMES_SPECTRATOR.кол-во игроков") }}
      </span>
        <ul class="players-list">
          <li class="players-item">
            <label class="label" :class="{active: checkedAll}">
              <input
                v-model="playersNumber"
                class="check-players"
                value="2"
                type="checkbox"
                :disabled="checkedAll"
              >
              <span class="checkmark">2</span>
            </label>
          </li>
          <li class="players-item">
            <label class="label" :class="{active: checkedAll}">
              <input
                v-model="playersNumber"
                class="check-players"
                value="3"
                type="checkbox"
                :disabled="checkedAll"
              >
              <span class="checkmark">3</span>
            </label>
          </li>
          <li class="players-item">
            <label class="label" :class="{active: checkedAll}">
              <input
                v-model="playersNumber"
                class="check-players"
                value="4"
                type="checkbox"
                :disabled="checkedAll"
              >
              <span class="checkmark">4</span>
            </label>
          </li>
          <li class="players-item">
            <label class="label" :class="{active: checkedAll}">
              <input
                v-model="playersNumber"
                class="check-players"
                value="5"
                type="checkbox"
                :disabled="checkedAll"
              >
              <span class="checkmark">5</span>
            </label>
          </li>
        </ul>
      </div>
      <div class="option__wrapper">
        <div class="option__container">
          <div
            class="option__item"
            v-for="opt in getMutationIcons"
            :key="opt.id"
          >
            <div class="img">
              <label :title="opt.title">
                <input class="option__checkbox" type="checkbox" v-model="mutations" :value="opt.id">
                <img :src="opt.image"/>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations, mapState} from 'vuex';
// import gameOptionsSource from '@/../config/game-options-source';

export default {
  name: "WatchFilters",
  props: {
    title: {
      default: 'unknown title',
      type: String,
    }
  },
  data() {
    return {
      playersNumber: null,
      mutations: null,
    }
  },
  computed: {
    checkedAll() {
      return this.isAnyPlayers
    },
    ...mapGetters([
      'getFilterPlayers',
      'getMutationIcons',
    ]),
  },
  watch: {
    playersNumber() {
      this.setPlayers(this.playersNumber)
    },
    mutations() {
      this.setMutations(this.mutations)
    }
  },
  methods: {
    ...mapMutations([
      'setPlayers',
      'setMutations'
    ]),
    createFilterObj() {
      return {
        playersNumber: this.playersNumber,
      }
    }
  },
  mounted() {
    this.playersNumber = this.$store.getters.getFilterPlayers
    this.mutations = this.$store.getters.getMutations
  }
}
</script>


<style scoped lang="scss">
.page__title{
  padding: 0;
  margin: 0 0 15px 0;
  color: #fff;
  font-size: 22px;
  line-height: 1;
  font-weight: 500;
}
.filter__wrapper{
  margin: 0 auto;
  background: #323639;
  border-color: #323639;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 16px 56px;
  @media only screen and (max-width: 1720px) {
    padding: 16px 20px;
    max-width: 560px;
  }
  @media only screen and (max-width: 1600px) {
    max-width: 684px;
  }
}
.option {
  &__wrapper {
    width: 70%;
  }

  &__container {
    display: flex;
    flex-wrap: wrap;
  }

  &__item {
    width: 30px;
    height: 30px;
    padding: 5px;

    img {
      filter: grayscale(1);

      &.active {
        filter: grayscale(0);
      }
    }

    &:hover label {
      img {
        animation: fillColor .2s forwards;
      }
    }

    //flex: 1 1 30px;
  }

  &__checkbox {
    display: none;

    &:checked ~ img {
      filter: grayscale(0);
    }
  }
}

@keyframes fillColor {
  0% {
    filter: grayscale(1);
  }
  100% {
    filter: grayscale(0);
  }
}

.search-game {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  //max-width: 684px;



  .title {
    font-size: 22px;
    line-height: 22px;
    font-weight: 500;
    margin: 0 0 10px 0;
    padding: 0;
    color: #fff;
  }

  .active {
    span {
      background-color: #6A1ED5;
    }
  }

  .players-wrapper {
    padding-right: 15px;
    width: 30%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-content: flex-start;

    .text {
      font-size: 16px;
      line-height: 16px;
      color: #fff;
    }

    .players-list {
      display: flex;
      align-items: center;
      list-style: none;
      //margin: 0;
      margin-top: 15px;
      padding: 0;

      .players-item {
        .label {
          margin: 0;

          input {
            display: none;
          }

          &.disabled {
            span {
              cursor: default;
              color: #dad9db;
              background: #7b7b7b;
            }
          }
        }

        .label input:checked ~ .checkmark {
          background-color: #6A1ED5;
        }

        span {
          cursor: pointer;
          display: block;
          padding: 10px 13px 10px 13px;
          font-size: 15px;
          line-height: 15px;
          border: 1px solid #ADACAC;
          border-right-width: 0;
          color: #fff;
          font-weight: 300;
        }

        &:first-child {
          span {
            border-radius: 5px 0 0 5px;
            border-right-width: 1px;
            border-right: none;
          }
        }

        &:last-child {
          span {
            border-radius: 0 5px 5px 0;
            border-right-width: 1px;
          }
        }

        .players-btn {
          font-size: 15px;
          line-height: 15px;
          font-weight: 300;
          background-color: transparent;
          border: 1px solid #ADACAC;
          border-radius: 5px 0 0 5px;
          border-right-width: 0;
          padding: 10px 24px 10px 20px;
          color: #fff;
          cursor: pointer;

          &.active {
            background-color: #6A1ED5;
            color: #fff;
          }

          &:disabled {
            cursor: default;
            color: #dad9db;
            background: #7b7b7b;
          }
        }
      }
    }

    .find-btn {
      width: 136px;

      .search-game-btn {
        display: inline-block;
        width: 136px;
        height: 38px;
        background: #24202C;
        box-sizing: border-box;
        border-radius: 3px;
        font-size: 16px;
        line-height: 16px;
        border: 0;
        font-weight: 400;
      }

      .search-game-btn:disabled:hover,
      .search-game-btn[disabled]:hover {
        cursor: default;
      }

      button {
        color: #fff;
        background: #24202C;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.14);
        border-color: #dad9db;
      }
    }
  }
}
</style>
