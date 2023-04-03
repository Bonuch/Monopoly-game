<template lang="pug">
  b-col
    b-button.half-tile-button.small-text-button(v-if="userCanBetOnActive()" @click="placeABet()" variant="success")
      | Сделать ставку
      br
      b
        span(v-html="$parent.state.first_move_auction.price + 50")
          span(style="font-family:BTC") BTC
    b-button.half-tile-button.small-text-button(v-if="userCanBetOnActive()" @click="ignoreFirstMoveRight()" variant="danger")
      i.fas.fa-ban Отказаться
</template>

<script>
import { mapGetters } from 'vuex';
import axios from '@/helpers/axios-instance';

export default {
  name: "FirstMoveAuction",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
  methods: {
    userCanBetOnActive() {
      let userid = this.$parent.state.first_move_auction.last_bet_user;
      let ids = [];

      for (let i = 0; i < this.$parent.state.active_user_ids.length; i++) {
        if (
          this.$parent.state.first_move_auction.ignores.indexOf(
            this.$parent.state.active_user_ids[i]
          ) == -1 ||
          this.$parent.state.active_user_ids[i] == userid
        ) {
          ids.push(this.$parent.state.active_user_ids[i]);
        }
      }

      let index = ids.indexOf(userid);
      let betTurnUser = ids[index + 1] ? ids[index + 1] : ids[0];

      return betTurnUser == this.currentUser.user_id;
    },
    zeroBets() {
      return this.$parent.state.first_move_auction.price == 100;
    },
    auctionStarted() {
      return true;
    },
    lastBetUserName() {
      return this.$parent.userTitle(
        this.$parent.state.buy_auction.last_bet_user
      );
    },
    buyActive() {
      axios
        .get("/buy-active")
        .then(response => {
          if (response.data.message) {
            window.alert(response.data.message);
          }
        })
        .catch(() => {});
    },
    placeABet() {
      axios
        .get("/place-a-bet-for-first-move")
        .then(response => {
          if (response.data.message) {
            window.alert(response.data.message);
          }
        })
        .catch(() => {});
    },
    ignoreFirstMoveRight() {
      axios
        .get("/ignore-first-move-right")
        .then(() => {})
        .catch(() => {});
    }
  }
};
</script>


