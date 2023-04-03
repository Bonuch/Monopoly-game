<template>
  <div class="animated-dices-container" v-show="isVisible">
    <b-container fluid style="position:relative;" no-gutters>
      <b-row>
        <b-col cols="3">
        </b-col>
        <b-col cols="6">
          <div id="animContainer" style="position:absolute;top:-85px;"></div>
        </b-col>
        <b-col cols="3">
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>

import * as PIXI from 'pixi.js'

function initPixiApp2(dice1, dice2, callback) {
  let app = new PIXI.Application(200, 200, { transparent: true });
  document.getElementById('animContainer').appendChild(app.view);
  app.stop();

  function playAnimation()
  {
      // create an array of textures from an image path
      var frames = [];
      let num1Frames = [];
      let num2Frames = [];

      for (var i = 0; i < 150; i++) {
          // magically works since the spritesheet was loaded with the pixi loader
          let padPart = String('00000' + i).slice(-5);
          var texture = PIXI.Texture.fromFrame('Ball_' + padPart + '.png');
          frames.push(texture);

          if (dice1) {
            var texture2 = PIXI.Texture.fromFrame(dice1 + '_' + padPart + '.png');
            num1Frames.push(texture2);
          }

          if (dice2) {
            var texture3 = PIXI.Texture.fromFrame(dice2 + '_' + padPart + '.png');
            num2Frames.push(texture3);
          }
      }

      // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
      var anim = new PIXI.extras.AnimatedSprite(frames);
      var num1Anim = dice1 ? new PIXI.extras.AnimatedSprite(num1Frames) : null;
      var num2Anim = dice2 ? new PIXI.extras.AnimatedSprite(num2Frames) : null;

      /*
       * An AnimatedSprite inherits all the properties of a PIXI sprite
       * so you can change its position, its anchor, mask it, etc
       */
      //anim.x = 0;
      //anim.y = 0;
      //anim.anchor.set(0.5);
      anim.animationSpeed = 1;
      //anim.animationSpeed = 3;
      anim.play();

      if (num1Anim) {
        num1Anim.animationSpeed = 0.5;
        num1Anim.x = 3;
        num1Anim.y = 22;
        num1Anim.play();
      }

      if (num2Anim) {
        num2Anim.animationSpeed = 0.5;
        num2Anim.x = 3 + 100;
        num2Anim.y = 22;
        num2Anim.play();
      }

      anim.onFrameChange = function(frame) {
        if (frame == 149) {
          anim.onFrameChange = null;
          document.getElementById('animContainer').removeChild(app.view);
          app.destroy();
          callback();
        }
      };

      app.stage.addChild(anim);

      if (num1Anim) {
        app.stage.addChild(num1Anim);
      }

      if (num2Anim) {
        app.stage.addChild(num2Anim);
      }

      app.start();
  }

  playAnimation();
}

export default {
  name: 'AnimatedDicesBall',
  data() {
    return {
      activeImageSrc: '',
      dice1: 1,
      dice2: 1,
      isVisible: false,
      areSpritesLoaded: false,
      pixiApp: null
    };
  },
  mounted() {
    // XXX
    this.isVisible = true;

    PIXI.loader
        .add('spritesheet-ball', '/dices1/spritesheet-ball.json')
        .add('spritesheet-1', '/dices1/spritesheet-1.json')
        .add('spritesheet-2', '/dices1/spritesheet-2.json')
        .add('spritesheet-3', '/dices1/spritesheet-3.json')
        .add('spritesheet-4', '/dices1/spritesheet-4.json')
        .add('spritesheet-5', '/dices1/spritesheet-5.json')
        .add('spritesheet-6', '/dices1/spritesheet-6.json')
        .load(() => {
          this.areSpritesLoaded = true;
        });
  },
  methods: {
    rollDices(dice1, dice2, callback) {
      if (this.areSpritesLoaded) {
        initPixiApp2(dice1, dice2, () => {
          callback();
        });
      } else {
        let interval;

        interval = setInterval(() => {
          if (this.areSpritesLoaded) {
            clearInterval(interval);

            initPixiApp2(dice1, dice2, () => {
              callback();
            });
          }
        }, 100);
      }
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
}

</style>
