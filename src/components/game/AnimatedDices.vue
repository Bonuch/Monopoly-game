<template>
  <div>
    <div class="animated-dices-container" v-show="isVisible">
      <b-container fluid style="position:relative;" no-gutters>
        <b-row>
          <b-col cols="6" class="leftDice">
            <dice
              :angle="lAngle"
              :faces="Number(dicesSettings.faces)"
              :color="dicesSettings.color"
              :firstColor="dicesSettings.firstColor"
              :backgroundColor="dicesSettings.backgroundColor"
              :frameColor="dicesSettings.frameColor"
            ></dice>
          </b-col>
          <b-col cols="6" class="rightDice">
            <dice
              :angle="Number(rAngle)"
              :faces="Number(dicesSettings.faces)"
              :color="dicesSettings.color"
              :firstColor="dicesSettings.firstColor"
              :backgroundColor="dicesSettings.backgroundColor"
              :frameColor="dicesSettings.frameColor"
            ></dice>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
  name: 'AnimatedDices',
  data() {
    return {
      dice1: 1,
      dice2: 1,
      lAngle: 0,
      rAngle: 0,
      dicesSettings: {
        faces: 6,
        color: '#000000',
        firstColor: '#000000',
        backgroundColor: '#FFFFFF', // transparent
        frameColor: '#000000',
      },
      lButtonSequence: [1],
      rButtonSequence: [1],
      anim: {
        lIndex: 0,
        rIndex: 0
      },
      isVisible: false,
      hideTimeout: null
    };
  },
  mounted() {
  },
  methods: {
    rollDices(dice1, dice2, callback) {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }

      this.isVisible = true;
      this.dice1 = dice1;
      this.dice2 = dice2;

      this.animateLeftDice(dice1, () => {
        setTimeout(() => {
          callback();

          this.hideTimeout = setTimeout(() => {
            this.isVisible = false;
            this.hideTimeout = null;
          }, 1000);
        }, 500);
      });
      this.animateRightDice(dice2);
    },
    genRandomIntsSequence(length, disableNum) {
      let result = [];

      while (result.length < length) {
        let rand = getRandomInt(1, 6);

        if (rand != result[result.length - 1] && (result.length < 2 || rand != result[result.length - 2]) && rand != disableNum) {
          result.push(rand);
        }
      }

      return result;
    },
    animateLeftDice(dice, callback) {
      let intv; 

      this.lButtonSequence = this.genRandomIntsSequence(4, dice);
      this.lButtonSequence.push(dice);
      this.anim.lIndex = 0;

      intv = setInterval(() => {
        this.lAngle = this.lButtonSequence[this.anim.lIndex];
        this.anim.lIndex += 1;

        if (this.anim.lIndex >= this.lButtonSequence.length) {
          clearInterval(intv);
          callback();
        }
      }, 300);
    },
    animateRightDice(dice) {
      let intv; 

      this.rButtonSequence = this.genRandomIntsSequence(4, dice);
      this.rButtonSequence.push(dice);
      this.anim.rIndex = 0;

      intv = setInterval(() => {
        this.rAngle = this.rButtonSequence[this.anim.rIndex];
        this.anim.rIndex += 1;

        if (this.anim.rIndex >= this.rButtonSequence.length) {
          clearInterval(intv);
        }
      }, 300);
    },
  }
};
</script>

<style>
svg.dice-face {
  background-image:url(/free-wood-texture-24.jpg);
}
</style>

<style scoped>
.container {
  display: inline-block;
  padding: 30px;
  perspective: 500px;
}

.container .dice {
  transition: transform .2s ease-in-out;
}

.leftDice  .dice {
  float:right;
  margin-right:20px;
  margin-top:-20px;
}

.rightDice .dice {
  margin-left:20px;
  margin-top:20px;
}

.animated-dices-container {
  transform:scale(1.5);
}
</style>
