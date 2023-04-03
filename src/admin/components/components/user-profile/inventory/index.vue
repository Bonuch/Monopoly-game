<template>
  <v-container>

    <v-expansion-panels v-model="panel" accordion>

      <v-expansion-panel :key="0">
        <v-expansion-panel-header expand-icon="fa-angle-down">Деньги и статус</v-expansion-panel-header>
        <v-expansion-panel-content>
          <General :user="user"></General>
          <GiveVipAndMoney :user="user" @update="update"></GiveVipAndMoney>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel :key="1">
        <v-expansion-panel-header expand-icon="fa-angle-down">Лутбоксы</v-expansion-panel-header>
        <v-expansion-panel-content>
          <Loot :user="user"></Loot>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel :key="2">
        <v-expansion-panel-header expand-icon="fa-angle-down">Предметы в наличии</v-expansion-panel-header>
        <v-expansion-panel-content>
          <Items :user="user"></Items>
        </v-expansion-panel-content>
      </v-expansion-panel>

<!--      <v-expansion-panel :key="3">-->
<!--        <v-expansion-panel-header expand-icon="fa-angle-down">Лог действий с предметами</v-expansion-panel-header>-->
<!--          <v-expansion-panel-content>-->
<!--            <Log ref="logger" :user="user"></Log>-->
<!--          </v-expansion-panel-content>-->
<!--      </v-expansion-panel>-->
    </v-expansion-panels>



  </v-container>
</template>

<script>
import General from './General.vue'
import GiveVipAndMoney from './GiveVipAndMoney.vue'
import Loot from './Loot.vue'
import Items from './Items.vue'
import Log from './Log.vue'

export default {
  components: {
    General,
    GiveVipAndMoney,
    Loot,
    Items,
    Log
  },
  data() {
    return {
      panel: 0
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    update() {
      this.$emit('update')
    }
  },
  watch: {
    panel() {
      if (this.panel == "3") {
        this.$refs.logger.loadLog()
      }
    }
  }
}
</script>

<style scoped>
  .v-list-item--two-line .v-list-item__icon {
      margin-bottom: 12px;
  }
</style>
