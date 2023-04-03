<template>
  <div class="game-wrapper">
    <div class="game-item">
      <div class="title1">{{ $t("GENERAL.Игроки") }}</div>
      <!--            <div v-for="(item, key, index) in data" :key="index">-->
      <div class="players">
        <div class="chip" v-for="(player, index) in data.players" :key="index">
          <div v-if="player" class="inner" :data-uuid="index">
            <img class="avatar" :title="player.fullname" :src="player.avatar"/>
          </div>
        </div>
      </div>
      <div class="rules">
        <div class="title2">{{ $t("SEARCH_CREATE_GAME.Правила") }}</div>
        <ul class="list">
          <li v-for="rule in data.options">
            <img :title="getMutationIcons[rule].name" :src="getMutationIcons[rule].image"/>
          </li>
        </ul>
      </div>
      <div class="actions">
        <router-link class="a-btn join-a-game" :to="{name: 'game', params: {gameid: data.gameUuid}}">{{ $t("GAMES_SPECTRATOR.Смотреть") }}</router-link>
      </div>
      <!--            </div>-->
      <!--      <div v-for="(item, key, index) in data" :key="index">-->
      <!--        <div class="players">-->
      <!--          <div class="chip" v-for="(player, index) in item.players" :key="index">-->
      <!--            <div v-if="player" class="inner" :data-uuid="index">-->
      <!--              &lt;!&ndash;            {{ player }}&ndash;&gt;-->
      <!--              <img class="avatar" :title="player.fullname" :src="player.avatar"/>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="rules">-->
      <!--          <div class="title2">Правила</div>-->
      <!--          <ul class="list">-->
      <!--            <li v-for="rule in item.options">-->
      <!--              <img :title="rule.name" :src="rule.image"/>zz-->
      <!--            </li>-->
      <!--          </ul>-->
      <!--        </div>-->
      <!--        <div class="actions">-->
      <!--          <router-link class="a-btn join-a-game" :to="{name: 'game', params: {gameid: key}}">смотреть</router-link>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "ReplayCard",
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
  computed: {
    ...mapGetters([
      'getMutationIcons'
    ])
  }
}
</script>

<style scoped lang="scss">
.game-wrapper {
  padding: 10px;
  //order: 1;
  flex: 0 1 33.3%;
}

.game-item {
  //order: 1;
  //flex: 1 1;
  align-self: auto;
  background-color: #323639;
  //width: 252px;
  border-radius: 12px;
  box-sizing: border-box;
  margin-bottom: 20px;
  border: 1.5px solid rgba(39, 39, 39, 0.5);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.25);

  &:hover {
    border: 1.5px solid #4F4F4F;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.25);
  }

  .title1 {
    font-weight: 300;
    font-size: 15px;
    text-align: left;
    line-height: 15px;
    margin: 7px 0 0 14px;
    color: #fff;
  }

  .players {
    text-align: center;
    display: flex;
    justify-content: left;
    padding: 5px 5px 2px 5px;

    .chip {
      position: relative;
      margin: 0 5px;

      .inner {
        display: block;
        width: 50px;
        height: 50px;
        overflow: hidden;

        .avatar {
          display: block;
          width: 50px;
          border: 3px solid #000;
          border-radius: 100px;
          background-color: #f3f3f3;
          box-sizing: border-box;
        }

        .empty {
          width: 50px;
          height: 50px;
          border-radius: 100px;
          background: radial-gradient(50% 50% at 50% 50%, rgba(216, 216, 216, 0) 0%, #D8D8D8 74.48%);
          color: #fff;
          text-align: center;
          font-size: 26px;
          line-height: 45px;

          i {
            display: none;
          }
        }
      }
    }
  }

  .rules {
    .title2 {
      font-weight: 300;
      font-size: 15px;
      color: #fff;
      text-align: left;
      margin: 2px 0 0 14px;
    }

    .list {
      list-style: none;
      margin: 5px 0 5px 10px;
      padding: 0;
      text-align: left;
      display: flex;
      flex-wrap: wrap;
      //justify-content: space-between;

      li {
        position: relative;
        display: inline-block;
        margin: 0 5px 5px 0;

        .num {
          font-size: 10px;
          position: absolute;
          top: 6px;
          left: 8px;
          z-index: 100;
        }

        img {
          display: block;
          height: 32px;
        }
      }

      &.small {
        margin-left: 12px;

        li {
          margin: 0 14px 5px 0;

          img {
            display: block;
            height: 45px;
            width: 45px;
          }

          &:last-child {
            margin-right: 12px;
          }
        }
      }
    }

    &.alignLeft {
      .list {
        justify-content: left;
      }
    }
  }

  .actions {
    margin-bottom: 6px;

    .a-btn {
      display: inline-block;
      width: 134px;
      background: #24202C;
      box-sizing: border-box;
      border-radius: 3px;
      line-height: 32px;
      font-size: 15px;
      color: #fff;
      text-decoration: none;
      outline: none;

      &.inactive {
        background: rgba(36, 32, 44, 0.47);
      }
    }
  }

  &.smallIcons {
    .players {
      padding: 5px 10px 2px 10px;
      justify-content: space-between;

      .chip {
        margin: 0;

        .inner {
          width: 42px;
          height: 42px;

          .avatar {
            width: 42px;
          }

          .empty {
            width: 42px;
            height: 42px;
            font-size: 20px;
            line-height: 40px;
          }
        }
      }
    }

    .rules {
      .title2 {
        margin: 10px 0 0 14px;
      }
    }
  }

  &.private {
    .actions {
      .a-btn {
        span {
          display: inline-block;
          position: relative;

          i {
            position: absolute;
            top: 6px;
            left: -18px;
            display: block;
            height: 18px;
            width: 14px;
            background: url(/design/icons/lock2-dark.svg) center center no-repeat;
          }
        }
      }
    }

    .players {
      .chip {
        .inner {
          .empty {
            border: 2.5px solid #fff;
            box-sizing: border-box;
            background: radial-gradient(50% 50% at 50% 50%, rgba(184, 177, 7, 0.53) 0%, #F1E817 100%);

            span {
              display: none;
            }

            i {
              display: inline-block;
              height: 24px;
              width: 18px;
              background: url(/design/icons/lock2-dark.svg) center center no-repeat;
            }
          }
        }
      }
    }
  }
}
</style>
