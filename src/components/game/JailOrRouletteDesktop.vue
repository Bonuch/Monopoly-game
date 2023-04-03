<template>
  <div class="roulette-modal">
    <div class="cartridges-wrap">
    <div class="cartridges">
      <img class="roulette-img" src="/design/game/russianroulette.png"/>
      <span v-for="index in 6"
            class="cartridge"
            :class="cartridgeClass(index)"
            @mouseover="showBullets(index)"
            @mouseout="showBullets(selectedBullets)"
            @click="selectBullets(index)">
        <img :style="bulletImageStyle(index)" src="/design/game/bullet.png"/>
      </span>
    </div>
    </div>
    <div class="content">
      <div class="title">{{ $t('GAME_DIALOGS.Выберите количество патронов') }}</div>
      <div class="desc" v-html="bulletsCountHint()"></div>
      <div class="btn-wrap">
        <button v-if="actions.play.visible" class="submit" @click="doAction(actions.play, { bullets: selectedBullets})" :class="{disabled: !selectedBullets}">{{ $t('GAME_DIALOGS.Мне повезет') }}</button>
        <button v-if="actions.cancel.visible"  class="cancel" @click="doAction(actions.cancel)">{{ $t('GAME_DIALOGS.Отказаться от игры') }}</button>
      </div>
    </div>
  </div>
</template>

<script>

  import { mapActions } from 'vuex';

export default {
  name: 'JailOrRouletteDesktop',
  props: {
    actions: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      showBulletsCounter: 0,
      selectedBullets: 0
    }
  },
  methods: {
    ...mapActions([
      'sendGameAction',
    ]),
    cartridgeClass(index) {
      return `cartridge-${index}`
    },

    showBullets(count) {
      this.showBulletsCounter = count > 5 ? 5 : count;
    },
    bulletImageStyle(cnt) {
      if (this.showBulletsCounter >= cnt) {
        return {opacity: 1};
      }
      return {opacity: 0};
    },
    bulletsCountHint() {
      if (this.selectedBullets) {
        return this.$t('GAME_DIALOGS.Вы выбрали') + ' ' + this.selectedBullets + ' ' + this.$t('GAME_DIALOGS.патронов')
          + '<br/>' + this.$t('GAME_DIALOGS.Выигрыш составит') + ' ' + (this.selectedBullets * 1000) + '<span style="font-family:BTC">BTC</span><br/>'
          + this.$t('GAME_DIALOGS.Проигрыш - выбываете из игры');
      }
      return '(' + this.$t('GAME_DIALOGS.пока не выбрали') + ')';
    },
    selectBullets(count) {
      this.selectedBullets = count > 5 ? 5 : count;
    },
    doAction(action, params = {}) {
      if (action.allowed) {
        this.sendGameAction({route: `game_${action.route}`, params});
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .roulette-modal {
    padding: 18px 10px;
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(14px);
    height: 270px;
    left: 15px;
    top: 15px;
    right: 15px;
    bottom: 15px;
    z-index: 999;
    color: #000;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .cartridges-wrap {
    width: 210px;
    height: 210px;
      @media screen and (max-width: 1366px){
          width: 155px;
          height: 155px;
      }
  }
  .cartridges {
    width:300px;
    height:300px;
    position:relative;
    transform:scale(0.7);
    transform-origin:left top;
      @media screen and (max-width: 1366px){
          width: 210px;
          height: 210px;
      }
    .cartridge {
      cursor: pointer;
      position: absolute;
      z-index: 1;
        @media screen and (max-width: 1366px){
            transform: scale(0.68);
        }
      &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-image: url('/design/game/bullet.png');
        -webkit-background-size: cover;
        background-size: cover;
        z-index: -1;
        animation: glowingBullet 1500ms ease-in-out infinite;
      }
      &-1 {
        left: 119px;
        top: 47px;
          @media screen and (max-width: 1366px){
              left: 74px;
              top: 22px;
          }
      }
      &-2 {
        left: 185px;
        top: 84px;
          @media screen and (max-width: 1366px){
              left: 121px;
              top: 49px;
          }
      }
      &-3 {
        left: 185px;
        top: 162px;
          @media screen and (max-width: 1366px){
              left: 121px;
              top: 104px;
          }
      }
      &-4 {
        left: 118px;
        top: 200px;
          @media screen and (max-width: 1366px) {
              left: 74px;
              top: 131px;
          }
      }
      &-5 {
        left: 54px;
        top: 161px;
          @media screen and (max-width: 1366px){
              left: 28px;
              top: 104px;
          }
      }
      &-6 {
        left: 54px;
        top: 84px;
        &:after {
          animation: glowingBulletDisable 1500ms infinite ease-in-out;
        }
      }
    }
  }
  .content {
    flex: 1 0 auto;
    .title {
      font-size: 20px;
      font-weight: 600;
      padding-bottom: 15px;
    }
    .desc {
      font-size: 14px;
      padding-bottom: 30px;
      line-height: normal;
      min-height: 60px;
    }
    .btn-wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
      button {
        border: none;
        text-align: center;
        display: block;
        margin: 0 10px;
        font-size: 15px;
        width: 165px;
        padding: 10px;
        color: #fff;
        text-decoration: none;
        border-radius: 3px;

        &.submit {
          background: #6A1ED5;
        }
        &.cancel {
          background: #250255;
        }
        &.disabled {
          opacity: 0.38;
        }
      }
    }
  }

  @keyframes glowingBullet {
    0% { opacity: 0; }
    50% { opacity: 0.5; }
    100% { opacity: 0; }
  }

  @keyframes glowingBulletDisable {
    0% { opacity: 0; }
    100% { opacity: 0; }
  }

</style>
