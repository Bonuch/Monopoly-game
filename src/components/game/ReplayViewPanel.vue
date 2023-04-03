<template lang="pug">
  div(style="position:absolute;left:0;background-color:#262c2f;padding:10px;z-index:1000;top:0;left:0;right:0;padding-top:50px;")
    b-button(:disabled="isOnLastStep()" v-show="!isPlaying" @click="play()")
      i.fas.fa-play
    b-button(@click="pause()" v-show="isPlaying")
      i.fas.fa-pause
    b-button(:disabled="replayStep == -1" @click="stop()")
      i.fas.fa-stop
    b-button(:disabled="isPlaying || isOnLastStep()" @click="nextStep()")
      i.fas.fa-step-forward
    b-button(:disabled="!gameboard() || gameboard().animationsSpeed == 1" @click="gameboard().animationsSpeed = 1") 1x
    b-button(:disabled="!gameboard() || gameboard().animationsSpeed == 0.5" @click="gameboard().animationsSpeed = 0.5") 2x
    b-button(:disabled="!gameboard() || gameboard().animationsSpeed == 0.25" @click="gameboard().animationsSpeed = 0.25") 4x
    div(style="padding-left:12px;padding-right:12px;height:100px;padding-top:30px;")
      vue-slide-bar(:min="-1" :max="replayStepsCount" v-model="replayStep" :data="sliderData()" :range="sliderRange()" @callbackRange="callbackRange" :speed="0" :tooltip-styles="{color: 'transparent'}")
</template>

<script>
import VueSlideBar from 'vue-slide-bar'

export default {
  data() {
    return {
      replayStep: -1,
      isPlaying: false,
      replayStepsCount: 0,
      replayTrades: []
    }
  },
  name: 'ReplayViewPanel',
  components: { VueSlideBar },
  methods: {
    nextStep() {
      this.replayStep++;
      this.isPlaying = true;

      this.gameboard().refresh(null, () => {
        this.isPlaying = false;
      });
    },
    gameboard() {
      return this.$parent;
    },
    stop() {
      this.replayStep = -1;
      this.isPlaying = false;
      this.gameboard().refresh();
    },
    play() {
      this.isPlaying = true;

      let callbacks = [];
      for (let i=this.replayStep;i<=this.replayStepsCount;i++) {
        callbacks.push(i);
      }

      this.$parent.iterateSequentially(callbacks, (resolve, reject, item) => {
        if (this.isPlaying) {
          this.replayStep = item;
          this.gameboard().refresh(null, () => {
            resolve();
          });
        } else {
          reject();
        }
      }, () => {
        this.isPlaying = false;
      });
    },
    pause() {
      this.isPlaying = false;
    },
    isOnLastStep() {
      return this.replayStep >= this.replayStepsCount;
    },
    callbackRange(rangeValue) {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.replayStep = rangeValue.value;
      
        this.gameboard().initialRefresh(null, () => {
          this.isPlaying = false;
        });
      }
    },
    sliderData() {
      let result = [];

      for (let i=-1;i <= this.replayStepsCount;i++) {
        result.push(i);
      }

      return result;
    },
    sliderRange() {
      let result = [];

      for (let i=-1;i <= this.replayStepsCount;i++) {
        let displayLabel = this.replayTrades.indexOf(i) != -1;
        let label = displayLabel ? i : '';
        label = 'Торг';
        result.push({ isHide: !displayLabel, value: i, label: label });
      }

      return result;
    }
  }
}
</script>


