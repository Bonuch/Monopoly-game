<template>
  <b-col v-if="$parent.isOnEnemyCell()">
    <b-button v-if="!userDoesNotHaveMoneyForTax() && !ableToBargain()" class="tile-button padding-0-5px" :disabled="$parent.isAnimatingDices || $parent.state.trade_request" @click="payTax()" variant="success"><span v-html="$parent.currentCellTaxValue()"></span>&nbsp;<span style="font-family:BTC">BTC</span><br/>Оплатить<br/><i class="fas fa-money-bill-alt"></i></b-button>
    <b-button v-if="!!userDoesNotHaveMoneyForTax() == !ableToBargain()" class="half-tile-button padding-0-5px font-size-13px" :disabled="$parent.isAnimatingDices || $parent.state.trade_request" @click="payTax()" variant="success">Оплатить<br/><i class="fas fa-money-bill-alt"></i>&nbsp;<span v-html="$parent.currentCellTaxValue()"></span>&nbsp;<span style="font-family:BTC">BTC</span></b-button>
    <b-button v-if="userDoesNotHaveMoneyForTax() && ableToBargain()" class="third-tile-button padding-0-5px" :disabled="$parent.isAnimatingDices || $parent.state.trade_request" @click="payTax()" variant="success"><i class="fas fa-money-bill-alt"></i> Оплатить</b-button>
    <b-button v-bind:class="bargainButtonClass()" :disabled="$parent.state.trade_request" v-if="ableToBargain()" @click="requestTrade()" variant="success">торговаться<br/>({{$parent.state.bargain_counters[currentUser.user_id]}} попытки)</b-button>
    <b-button :disabled="$parent.isAnimatingDices" :class="surrendButtonClass()" v-if="userDoesNotHaveMoneyForTax()" @click="$parent.surrend()" variant="danger"><i class="fas fa-skull"></i> Сдаться</b-button>
  </b-col>
</template>

<script>
  import axios from '@/helpers/axios-instance';
import { mapGetters } from "vuex";

export default {
  data() {
    return {
    }
  },
  name: 'TaxButtons',
  computed: {
    ...mapGetters(["currentUser"]),
  },
  methods: {
    userDoesNotHaveMoneyForTax() {
      let pos = this.$parent.state.positions[this.currentUser.user_id];
      let cell = this.$parent.$children.filter((child) => child.$options.name == 'Gamecell' && child.id == pos)[0];
      return this.$parent.state.balances[this.currentUser.user_id] < cell.getFieldTaxPrice();
    },
    ableToBargain() {
      return this.$parent.state.options.leniency && this.$parent.state.bargain_counters[this.currentUser.user_id] > 0;
    },
    payTax() {
      axios.get('/pay-tax').then(response => {
        if (response.data.message) {
          window.alert(response.data.message);
        }
      }).catch(() => {});
    },
    surrendButtonClass() {
      if (this.ableToBargain()) {
        return 'third-tile-button padding-0-5px';
      } else {
        return 'half-tile-button padding-0-5px';
      }
    },
    bargainButtonClass() {
      if (this.userDoesNotHaveMoneyForTax()) {
        return 'third-tile-button font-size-13px white-space-normal padding-0-5px';
      } else {
        return 'half-tile-button font-size-13px white-space-normal padding-0-5px';
      }
    },
    requestTrade() {
      let sum = prompt('Введите сумму которую предлагаете оплатить вместо ' + this.$parent.currentCellTaxValue() + ' минимальная сумма 1000 BTC');

      if (!sum) {
        alert('Запрос отменен');
        return;
      }

      sum = parseInt(sum);

      if (!sum) {
        alert('Повторите попытку и введите только цифры');
        return;
      }

      if (sum < 1000) {
        alert('Повторите попытку и введите число больше 1000');
        return;
      }

      axios.get('/request-trade', { params: { sum: sum } }).then(response => {
        if (response.data.message) {
          window.alert(response.data.message);
        }
      }).catch(() => {});
    },
  }
}
</script>



