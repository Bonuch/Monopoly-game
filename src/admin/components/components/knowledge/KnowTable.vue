<template>
  <v-card>
    <DialogEditor :cell="cell_data" :is_open.sync="is_dialog_open" />

    <v-data-table
      :headers="headers"
      :items="upgrades"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:item.level="{ item }">
        <span>
          level {{ item.level }}
        </span>
      </template>
      <template v-slot:item.upgrade_value1="{ item }">
        <LabelEditor @open="open($event)"
          :value="item.upgrade_value1"
          :data="item"
          data_path="upgrade_value1"
          label="Величина 1"
        />
      </template>
      <template v-slot:item.upgrade_value2="{ item }">
        <LabelEditor @open="open($event)"
          :value="item.upgrade_value2"
          :data="item"
          data_path="upgrade_value2"
          label="Величина 2"
        />
      </template>
      <template v-slot:item.puissance="{ item }">
        <LabelEditor @open="open($event)"
          :value="item.puissance"
          :data="item"
          data_path="puissance"
          label="Величие"
        />
      </template>
      <template v-slot:item.cost_upgrade.bucks="{ item }">
        <LabelEditor @open="open($event)"
          :value="item.cost_upgrade.bucks"
          :data="item"
          data_path="cost_upgrade.bucks"
          label="Бабосы"
        />
      </template>
      <template v-slot:item.cost_upgrade.shine.shine1="{ item }">
        <span>
          <LabelEditor @open="open($event)"
            :value="item.cost_upgrade.shine.shine1"
            :data="item"
            data_path="cost_upgrade.shine.shine1"
            label="Сияние 1"
          />
          <span style="color: grey;">|</span>
          <LabelEditor @open="open($event)"
            :value="item.cost_upgrade.shine.shine2"
            :data="item"
            data_path="cost_upgrade.shine.shine2"
            label="Сияние 2"
          />
          <span style="color: grey;">|</span>
          <LabelEditor @open="open($event)"
            :value="item.cost_upgrade.shine.shine3"
            :data="item"
            data_path="cost_upgrade.shine.shine3"
            label="Сияние 3"
          />
          <span style="color: grey;">|</span>
          <LabelEditor @open="open($event)"
            :value="item.cost_upgrade.shine.shine4"
            :data="item"
            data_path="cost_upgrade.shine.shine4"
            label="Сияние 4"
          />
          <span style="color: grey;">|</span>
          <LabelEditor @open="open($event)"
            :value="item.cost_upgrade.shine.shine5"
            :data="item"
            data_path="cost_upgrade.shine.shine5"
            label="Сияние 5"
          />
        </span>
      </template>
      <template v-slot:item.cost_upgrade.special.sp1="{ item }">
        <span>
          <LabelEditor @open="open($event)"
            :value="item.cost_upgrade.special.sp1"
            :data="item"
            data_path="cost_upgrade.special.sp1"
            label="Спецресурс 1"
          />
          <span style="color: grey;">|</span>
          <LabelEditor @open="open($event)"
            :value="item.cost_upgrade.special.sp2"
            :data="item"
            data_path="cost_upgrade.special.sp2"
            label="Спецресурс 2"
          />
        </span>
      </template>
    </v-data-table>
    <v-row style="margin: 20px;">
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
  </v-card>
</template>

<script>
import LabelEditor from "./LabelEditor.vue";
import DialogEditor from "./DialogEditor.vue";
export default {
  components: {
    LabelEditor,
    DialogEditor
  },
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
      is_dialog_open: false,
      cell_data: null,
      headers: [
        { text: 'Уровень', value: 'level' },
        { text: 'Величина 1', value: 'upgrade_value1' },
        { text: 'Величина 2', value: 'upgrade_value2' },
        { text: 'Величие', value: 'puissance' },
        { text: 'Бабосы', value: 'cost_upgrade.bucks' },
        { text: 'Сияние', value: 'cost_upgrade.shine.shine1' },
        { text: 'Спецресурс', value: 'cost_upgrade.special.sp1' },
      ],

    }
  },
  methods: {
    open(cell) {
      this.cell_data = cell
      this.is_dialog_open = true
    },
    save() {
      this.is_saving = true
      this.$store.$app.$socket.client.emit('admin_save_upgrade_table', this.upgrades, response => {
        this.is_saving = false
      });
    }
  }
}
</script>
