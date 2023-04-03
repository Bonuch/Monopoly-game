<template>
  <div class="winner-modal">
      <div class="wrap">
          <h2>{{ $t('GAME_DIALOGS.Игра окончена') }}!</h2>
          <div class="winner">
              {{ $t('GAME_DIALOGS.Победитель') }} <span :style="{color: finish.winnerColor}">{{finish.winnerName}}</span>
          </div>
      </div>

      <div class="btn-wrap">
          <button @click.prevent="leaveGame" class="close">{{ $t('SEARCH_CREATE_GAME.Покинуть игру') }}</button>
      </div>
  </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        name: 'WinnerModalForSpectator',
        data() {
            return {
            }
        },
        props: {
            finish: {
                type: Object,
                required: true,
            }
        },
        components: {},
        computed: {
            ...mapGetters([
            ]),
        },
        methods: {
            ...mapActions([
                'SOCKET_REMOVE_GAME',
            ]),
            async leaveGame() {
                await this.SOCKET_REMOVE_GAME();
                await this.$router.push({name: 'play'});
            }
        },
    }
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    .winner-modal {
        position: absolute;
        z-index: 10001;
        padding: 18px 10px;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(14px);
        width: 500px;
        height: 300px;
        top: 50%;
        left: 50%;
        margin-top: -150px;
        margin-left: -250px;
        color: #000;
        text-align: center;

        .wrap {
            height: 200px;
        }
        h2 {
            font-size: 30px;
            padding-bottom: 20px;
        }
        .winner {
            font-size: 22px;
        }
        .close {
            text-align: center;
            display: block;
            margin: 0 auto;
            font-size: 15px;
            width: 135px;
            padding: 10px;
            color: #fff;
            text-decoration: none;
            border-radius: 3px;
            background: #6A1ED5;
        }
    }
</style>
