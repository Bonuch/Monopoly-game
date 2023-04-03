<template>
  <b-col v-if="isVisible()">
    <b-button :disabled="$parent.isAnimatingDices" class="two-thirds-container small-text-button" v-if="$parent.userCanBetOnActive()" @click="placeABet()" variant="success">
<span v-html="fieldTitle()"></span><br/>
<i class="fas fa-check"></i> Ставка <b><span v-html="$parent.state.buy_auction.price + 100"></span>&nbsp;<span style="font-family:BTC">BTC</span></b></b-button>
    <b-button :disabled="$parent.isAnimatingDices" class="two-thirds-container small-text-button" v-if="!auctionStarted() && $parent.isUserTurn()" @click="buyActive()" variant="success"><i class="fas fa-check"></i> Купить актив<br/><span v-html="getActivePrice()"></span>&nbsp;<span style="font-family:BTC">BTC</span></b-button>
    <b-button :disabled="$parent.isAnimatingDices" class="third-tile-button small-text-button" v-if="(!auctionStarted() && $parent.isUserTurn()) || $parent.userCanBetOnActive()" @click="ignoreActive()" variant="danger"><i class="fas fa-ban"></i> Отказаться</b-button>

    <div class="small-text blink" v-if="auctionStarted() && !$parent.userCanBetOnActive()" style="height:110px;width:110px;display:table;"><div style="display:table-cell;vertical-align:middle;">Проходит аукцион по полю <b v-html="fieldTitle()"></b></div></div>
  </b-col>
</template>

<script>
import { mapGetters } from "vuex";
import axios from '@/helpers/axios-instance';

export default {
  data() {
    return {};
  },
  name: 'ActiveBuyChoices',
  computed: {
    ...mapGetters(["currentUser"]),
  },
  methods: {
    auctionStarted() {
      return this.$parent.state.buy_auction.active;
    },
    fieldTitle() {
      return this.$parent.state.cells[this.$parent.state.buy_auction.active].title;
    },
    lastBetUserName() {
      return this.$parent.userTitle(this.$parent.state.buy_auction.last_bet_user);
    },
    buyActive() {
      axios.get('/buy-active').then(response => {
        if (response.data.message) {
          window.alert(response.data.message);
        }
      }).catch(() => {});
    },
    placeABet() {
      axios.get('/place-a-bet').then(response => {
        if (response.data.message) {
          window.alert(response.data.message);
        }
      }).catch(() => {});
    },
    ignoreActive() {
      axios.get('/ignore-active').then(() => {
      }).catch(() => {});
    },
    isVisible() {
      if (this.auctionStarted()) {
        return true;
      }

      if (this.$parent.userCanBetOnActive()) {
        return true;
      }
      
      if (this.$parent.participatedInAuction()) {
        return true;
      }

      if (this.$parent.isOnFreeActiveCell()) {
        return true;
      }
    },
    getActivePrice() {
      let pos = this.$parent.state.positions[this.currentUser.user_id];
      return this.$parent.state.cells[pos].price;
    }
  }
}
</script>

<style>

@-webkit-keyframes neon3 {
  0%, 70% {
    text-shadow: 0 0 0px #FFDD1B, 0 0 0px #FFDD1B, 0 0 0px #FFDD1B, 0 0 0px #FFDD1B, 0 0 0px #FFDD1B;
  }

  90%, 100% {
    text-shadow: 0 0 5px #FFDD1B, 0 0 9px #FFDD1B, 0 0 10px #FFDD1B, 0 0 12px #FFDD1B, 0 0 18px #FFDD1B;
  }
}

.blink {
  color: yellow;
  -webkit-animation: neon3 2s ease-in-out infinite alternate;
  -moz-animation: neon3 2s ease-in-out infinite alternate;
  animation: neon3 2s ease-in-out infinite alternate;
}

</style>
