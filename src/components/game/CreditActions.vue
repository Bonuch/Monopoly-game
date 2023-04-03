<template>
  <b-col v-if="getCreditVisible() || returnCreditVisible()">
    <b-button v-if="getCreditVisible()" class="tile-button" :disabled="$parent.isAnimatingDices || $parent.isSelectable || !$parent.isUserTurn() || creditDisabled() || $parent.state.confirmation" @click="getCredit()"><div style="white-space:normal" v-html="creditText()"></div></b-button>
    <b-button v-if="returnCreditVisible()" class="tile-button white-space-normal padding-0-5px font-size-13px" :disabled="$parent.isAnimatingDices || $parent.isSelectable || !$parent.isUserTurn() || creditDisabled() || $parent.state.confirmation" @click="returnCredit()">вернуть кредит<br/><span v-html="creditReturnText()"></span></b-button>
  </b-col>
</template>

<script>
import { mapGetters } from "vuex";
import axios from '@/helpers/axios-instance';

export default {
  name: 'CreditActions',
  computed: {
    ...mapGetters(["currentUser"]),
  },
  methods: {

    getCreditVisible() {
      try {
        return !this.$parent.state.options.nocredits && this.$parent.state.credit_counters[this.currentUser.user_id] == 0;
      } catch(e) {
        return false;
      }
    },

    returnCreditVisible() {
      try {
        if (this.$parent.state.options.nocredits) {
          return false;
        }

        if (this.getCreditVisible()) {
          return false;
        }

        if (this.$parent.state.credit_counters[this.currentUser.user_id] > 1) {
          return true;
        }

        if (this.$parent.state.credit_counters == 1) {
          return !this.$parent.state.deal;
        }

      } catch(e) {
        return false;
      }
    },

    creditDisabled() {
      try {
        return this.$parent.state.credit_blocked_counters[this.currentUser.user_id] > 0;
      } catch(e) {
        return true;
      }
    },

    creditText() {
      let cnt = this.$parent.state.credit_blocked_counters[this.currentUser.user_id];
      return cnt > 0 ? 'кредит доступен<br/>через ' + cnt + ' ходов' : 'взять кредит<br/>&nbsp;&nbsp;&nbsp;5000 <span style="font-family:BTC">BTC</span><br/><i class="fas fa-money-bill-alt"></i>';
    },

    getCredit() {
      axios.get('/get-credit').then(response => {
        if (response.data.message) {
          window.alert(response.data.message);
        }
      }).catch(() => {});
    },

    creditReturnText() {
      let cnt = this.$parent.state.credit_counters[this.currentUser.user_id];
      return cnt > 0 ? ' (до возврата еще ' + cnt + ' ходов)' : '';
    },

    returnCredit() {
      axios.get('/return-credit').then(response => {
        if (response.data.message) {
          window.alert(response.data.message);
        }
      }).catch(() => {});
    },
  }
}
</script>


