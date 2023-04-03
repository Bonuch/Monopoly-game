<template>
  <b-col>
    <div>
      <b-button v-if="!surrendButtonVisible()" class="tile-button" :disabled="$parent.isAnimatingDices || isNotEnoughPotentialMoney" @click="payForRequest()" variant="success"><span v-html="$parent.state.payment_request.sum"></span> <span style="font-family:BTC">BTC</span><br/>Оплатить<br/><i class="fas fa-money-bill-alt"></i></b-button>
      <b-button v-if="surrendButtonVisible()" class="half-tile-button" style="line-height:14px" :disabled="$parent.isAnimatingDices || isNotEnoughPotentialMoney" @click="payForRequest()" variant="success">Оплатить<br/><i class="fas fa-money-bill-alt"></i>&nbsp;<span v-html="$parent.state.payment_request.sum"></span>&nbsp;<span style="font-family:BTC">BTC</span></b-button>
      <b-button :disabled="$parent.isAnimatingDices" class="half-tile-button" v-if="surrendButtonVisible()" @click="$parent.surrend()" variant="danger"><i class="fas fa-skull"></i> Сдаться</b-button>
    </div>
  </b-col>
</template>

<script>
  import axios from '@/helpers/axios-instance';
import { mapGetters } from "vuex";

export default {
  name: 'PaymentChoice',
  data() {
    return {
      isNotEnoughPotentialMoney: false,
      needsMoreThan90PotentialMoney: false,
      noMoneyOnBalance: false,
      moneyOk: true
    }
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
  methods: {
    updateRenderVars() {
      let flags = this.getRenderFlags();

      Object.keys(flags).forEach((key) => {
        this[key] = flags[key];
      });
    },
    getRenderFlags() {
      let flags = {};
      let money = this.getPotentialMoney(this.$parent.state, this.currentUser.user_id);

      if (money < this.$parent.state.payment_request.sum) {
        flags.noMoneyOnBalance = false;
        flags.moneyOk = false;
        flags.needsMoreThan90PotentialMoney = false;
        flags.isNotEnoughPotentialMoney = true;
      } else if (this.$parent.state.payment_request.sum >= money * 0.9 && this.$parent.state.payment_request.sum > this.$parent.state.balances[this.currentUser.user_id]) {
        flags.noMoneyOnBalance = false;
        flags.moneyOk = false;
        flags.needsMoreThan90PotentialMoney = true;
        flags.isNotEnoughPotentialMoney = false;
      } else if (this.$parent.state.payment_request.sum > this.$parent.state.balances[this.currentUser.user_id]) {
        flags.noMoneyOnBalance = true;
        flags.moneyOk = false;
        flags.needsMoreThan90PotentialMoney = false;
        flags.isNotEnoughPotentialMoney = false;
      } else {
        flags.noMoneyOnBalance = false;
        flags.moneyOk = true;
        flags.needsMoreThan90PotentialMoney = false;
        flags.isNotEnoughPotentialMoney = false;
      }

      return flags;
    },
    payForRequest() {
      axios.get('/pay-for-request').then(response => {
        if (response.data.message) {
          window.alert(response.data.message);
        }
      }).catch(() => {});
    },
    notEnoughMoneyMessageShow() {
      return this.$parent.state.balances[this.currentUser.user_id] < this.$parent.state.payment_request.sum;
    },
    // Is almost a copy of method from backend side
    getPotentialMoney(state, userId) {
      let money = state.balances[userId];

      money += state.actives[userId].reduce((sum, activeId) => {
        if (state.cells[activeId].is_bailed) {
          return sum;
        } else if (state.cells[activeId].prices) {
          return sum + (state.cells[activeId].stars_count || 0) * (state.cells[activeId].prices.upgrade || 0) + parseInt(state.cells[activeId].price) * 0.5;
        } else {
          window.console.log('Potential money unhandled case', activeId);
        }
      }, 0);

      if (!state.options.nocredits && !state.credit_counters[userId] && !state.credit_blocked_counters[userId]) {
        money += 5000;
      }

      if (state.railway_counter && state.railway_owner == userId) {
        money += 700;
      }

      return money;
    },
    surrendButtonVisible() {
      return this.isNotEnoughPotentialMoney || this.needsMoreThan90PotentialMoney;
    }
  }
}
</script>


