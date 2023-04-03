<template>
  <b-col>
    <b-button
      :class="diceButtonClasses()"
      v-show="$parent.shouldWeShowDiceButton() && !isCustomDice()"
      :disabled="$parent.isAnimatingDices || !canThrowDice()"
      onclick="throwDice(0);"
      variant="success"
    >
      <img :height="(isBuyFreedomButtonVisible() ? 44 : 96) * scalingFactor" style="display:block;margin:auto auto" src="/icons/main/dice_play_active.png"/>
    </b-button>
    <div v-if="isCustomDice()" v-html="customDiceHtml()">
    </div>

    <b-button
      :disabled="$parent.isAnimatingDices || !canThrowDice()"
      style="font-size:13px"
      class="half-tile-button"
      v-if="isBuyFreedomButtonVisible()"
      @click="buyFreedom()"
      variant="success"
    >
      Выкупиться
      <br/>(
      <span v-html="getFreedomPrice()"></span>
      <span style="font-family:BTC">BTC</span>)</b-button>
  </b-col>
</template>

<script>
// TODO это можно удалить
import axios from '@/helpers/axios-instance';
import { mapGetters } from "vuex";
import EventBus from '@/helpers/global-event-bus'

export default {
  data() {
    return {
      dice1: 0,
      dice2: 0,
    }
  },
  name: 'DiceButton',
  props: {
    config: {
      type: Object,
      default: null
    },
    // glowDisabled используется в кабинете игрока
    glowDisabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["currentUser", "scalingFactor"]),
  },
  methods: {
    customDiceHtml() {
      if (this.canThrowDice()) {
        if (this.isBuyFreedomButtonVisible()) {
          return this.config.half_size_html;
        } else {
          return this.config.html;
        }
      } else {
        if (this.isBuyFreedomButtonVisible()) {
          return this.config.half_size_disabled_html;
        } else {
          return this.config.disabled_html;
        }
      }
    },
    isCustomDice() {
      return Object.keys(this.config).length != 0;
    },
    diceButtonClasses() {
      let glowClass = this.canThrowDice() && !this.glowDisabled ? ' glow' : '';

      if (this.isBuyFreedomButtonVisible()) {
        return 'half-tile-button diceButton' + glowClass;
      } else {
        return 'diceButton' + glowClass;
      }
    },
    isBuyFreedomButtonVisible() {
      return this.isUserInJail() && !this.$parent.state.trade_request;
    },
    isUserInJail() {
      try {
        return this.currentUser && this.$parent.state.jail_counters[this.currentUser.user_id] > 0;
      } catch(e) {
        return false;
      }
    },
    canThrowDice() {
      return (
        this.$parent.isUserTurn() &&
        !this.$parent.state.dice_thrown &&
        !this.$parent.isSelectable &&
        !this.$parent.state.deal &&
        !this.$parent.state.payment_request
      );
    },
    throwDice() {
      this.$parent.isAnimatingDices = true;
      axios.get('/throw-dice').then(response => { // этот роут был удален, теперь это на сокетах
        this.dice1 = response.data.dice_values[0];
        this.dice2 = response.data.dice_values[1];
        this.$parent.$refs.animatedDices.rollDices(this.dice1, this.dice2, () => {
          setTimeout(() => {
            this.$parent.isAnimatingDices = false;
          }, 1000);
        });
      }).catch(() => {});
    },
    buyFreedom() {
      axios.get('/buy-freedom').then(response => {
        if (response.data.message) {
          window.alert(response.data.message);
        }
      }).catch(() => {});
    },
    getFreedomPrice() {
      return this.$parent.state.freedom_discounts[this.currentUser.user_id] ? 500 : 1000;
    },
  },
  mounted() {
    EventBus.$on('throw-dice-button', () => {
      this.throwDice();
    })
  }
}
//todo refactor, вызывается по клику по кнопкам вставляемым из бд
window.throwDice = () => {
  EventBus.$emit('throw-dice-button');
}
</script>

<style>

button.diceButton {
  width:110px;
  height:110px;
  border-radius:0;
  background-color:yellow !important;
  padding:0;
}

button.diceButton:disabled {
  background-color:#FAFAD2 !important;
  color:grey;
  opacity:1;
}

button.diceButton:disabled img {
  opacity:0.5;
}

@keyframes glowing {
  0% { background-color: yellow; }
  50% { background-color: #FF8C00; }
}

.glow:not(:hover) {
  animation: glowing 1500ms ease-in-out infinite;
}

</style>


