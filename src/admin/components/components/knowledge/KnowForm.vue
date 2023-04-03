<template>
  <v-card>
    <v-form ref="knowForm" v-model="is_valid">
      <v-container fluid v-if="upgrades">
        <v-row>
          <v-col>
            <v-select
              v-model="selected_level"
              :items="upgrades"
              item-text="level"
              label="Уровень знания"
              persistent-hint
              return-object
            ></v-select>
          </v-col>
        </v-row>
        <div  v-if="editing_level">
          <v-row>
            <v-col cols="12" md="4">
              <span>Величина улучшенного значения</span>
              <v-text-field 
                v-model="editing_level.upgrade_value1"
                :rules="numberRules"
                :label="knowledge.upgrade_value1_title"
                :suffix="knowledge.upgrade_value2_unit"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <span>Величина дополнительного значения</span>
              <v-text-field 
                v-model="editing_level.upgrade_value2"
                :rules="numberRules"
                :label="knowledge.upgrade_value2_title"
                :suffix="knowledge.upgrade_value2_unit"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <span>Могущество</span>
              <v-text-field 
                v-model="editing_level.puissance"
                :rules="numberRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <h3>Цены</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field 
                v-model="editing_level.cost_upgrade.bucks"
                :rules="numberRules"
                label="Цена за бабосы"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3">
              <v-text-field
                :rules="numberRules"
                v-model="editing_level.cost_upgrade.shine.shine1"
                label="Цена сияние 1"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field required
                :rules="numberRules"
                v-model="editing_level.cost_upgrade.shine.shine2"
                label="Цена сияние 2"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field required
                :rules="numberRules"
                v-model="editing_level.cost_upgrade.shine.shine3"
                label="Цена сияние 3"
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field required
                :rules="numberRules"
                v-model="editing_level.cost_upgrade.shine.shine4"
                label="Цена сияние 4"
              ></v-text-field>
            </v-col>
            <v-col md="3">
              <v-text-field required
                :rules="numberRules"
                v-model="editing_level.cost_upgrade.shine.shine5"
                label="Цена сияние 5"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6">
              <v-text-field required
                :rules="numberRules"
                v-model="editing_level.cost_upgrade.special.sp1"
                label="Спецресурс 1"
              ></v-text-field>
            </v-col>
            <v-col md="6">
              <v-text-field required
                :rules="numberRules"
                v-model="editing_level.cost_upgrade.special.sp2"
                label="Спецресурс 2"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-center">
              <v-btn
                color="success" 
                :disabled="is_saving"
                :loading="is_saving"
                @click="save"
              >
                Сохранить изменения
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    knowledge: {
      type: Object,
      required: true
    },
    upgrades: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      is_saving: false,
      is_valid: true,
      selected_level: null,
      editing_level: null,
      numberRules: [
        v => (v !== '') || 'Обязательно для заполнения',
        v => (v !== '' && !RegExp(/[^0-9]/g).test(v)) || 'Допустимо только числовое значение',
      ]
    }
  },
  methods: {
    save() {
      if(this.$refs.knowForm.validate()) {
        this.is_saving = true
        this.$store.$app.$socket.client.emit('admin_save_upgrade_level', this.editing_level, response => {
          this.is_saving = false
          for (key in this.editing_level) {
            this.selected_level[key] = this.editing_level[key]
          }
        });
      }
    },
    selectLevel() {
      if (typeof this.selected_level.cost_upgrade === 'string') {
        this.selected_level.cost_upgrade = JSON.parse(this.selected_level.cost_upgrade)
      }
      this.editing_level = JSON.parse(JSON.stringify(this.selected_level))
    }
  },
  mounted() {
    this.selected_level = this.upgrades.length ? this.upgrades[0] : null
    this.selectLevel()
  },
  watch: {
    selected_level() {
      this.selectLevel()
    }
  }

}
</script>
