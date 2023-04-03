<template lang="pug">
  b-col
    b-button(:class="railwayButtonClass()" v-if="isRailwayAvailableToBuy()" @click="buyRailway()" variant="success") Купить железную дорогу
    b-button(:class="municipalityButtonClass()" v-if="isMunicipalityAvailableToBuy()" @click="buyMunicipality()" variant="warning") Купить муниципалитет
    b-button(:class="cancelButtonClass()" @click="$parent.passMove()" variant="danger")
      i.fas.fa-ban Отказаться
</template>

<script>
    import axios from '@/helpers/axios-instance';

export default {
  name: "RailwayMunicipalityChoice",
  methods: {
    isRailwayAvailableToBuy() {
      return this.$parent.state.railway_counter == 0;
    },
    isMunicipalityAvailableToBuy() {
      return this.$parent.state.municipality_counter == 0;
    },
    buyRailway() {
      axios
        .get("/buy-railway")
        .then(response => {
          if (response.data.message) {
            window.alert(response.data.message);
          }
        })
        .catch(() => {});
    },
    buyMunicipality() {
      axios
        .get("/buy-municipality")
        .then(response => {
          if (response.data.message) {
            window.alert(response.data.message);
          }
        })
        .catch(() => {});
    },
    railwayButtonClass() {
      if (this.$parent.state.municipality_counter == 0) {
        return "railway-buy-button fourth-tile-button font-size-13px white-space-normal padding-0-3px";
      } else {
        return "two-thirds-container font-size-13px white-space-normal padding-0-3px";
      }
    },
    municipalityButtonClass() {
      if (this.$parent.state.railway_counter == 0) {
        return "third-tile-button font-size-13px white-space-normal padding-0-3px";
      } else {
        return "two-thirds-container font-size-13px white-space-normal padding-0-3px";
      }
    },
    cancelButtonClass() {
      if (
        this.$parent.state.municipality_counter == 0 &&
        this.$parent.state.railway_counter == 0
      ) {
        return "fourth-tile-button small-text-button white-space-normal";
      } else {
        return "third-tile-button small-text-button white-space-normal";
      }
    }
  }
};
</script>

<style scoped>
button.railway-buy-button {
  height: 45.9px !important;
}
</style>
