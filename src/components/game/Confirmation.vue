<template>
  <b-col>
    <b-button class="half-tile-button font-size-13px" v-if="$parent.state.confirmation.type == 'chance'" @click="acceptConfirmation()" variant="success"><i class="fas fa-check"></i> Согласен</b-button>
    <b-button class="half-tile-button font-size-13px" v-if="$parent.state.confirmation.type == 'chance'" @click="declineConfirmation()" variant="danger"><i class="fas fa-ban"></i> Не согласен</b-button>
    <b-button style="background-color:yellow" class="tile-button" :disabled="!$parent.isUserTurn()" v-if="$parent.state.confirmation.type == 'fairtrades'" @click="declineConfirmation()" variant="warning">Передать ход дальше</b-button>
  </b-col>
</template>

<script>
  import axios from '@/helpers/axios-instance';

export default {
  data() {
    return {};
  },
  name: "Confirmation",
  methods: {
    acceptConfirmation() {
      axios
        .get("/accept-confirmation")
        .then(response => {
          if (response.data.message) {
            window.alert(response.data.message);
          }
        })
        .catch(() => {});
    },

    declineConfirmation() {
      axios
        .get("/decline-confirmation")
        .then(response => {
          if (response.data.message) {
            window.alert(response.data.message);
          }
        })
        .catch(() => {});
    }
  }
};
</script>



