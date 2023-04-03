<template>
<div>
  <v-dialog v-model="is_open_local" max-width="390">
    <v-card v-if="cell">
      <v-card-title>
        Изменить значение
      </v-card-title>
      <v-card-text>
        <v-form ref="dialogForm" @submit.prevent="update">
          <v-text-field
            :rules="numberRules"
            :label="cell.label"
            v-model="cell.value"
            autofocus
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="is_open_local = false">
          Отмена
        </v-btn>
        <v-btn color="blue darken-1" text @click="update">
          Подтвердить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
export default {
  props: {
    is_open: {
      type: Boolean,
      required: true
    },
    cell: {
      type: Object,
      default: null
    }
    // label: {
    //   type: String,
    //   default: ''
    // },
    // value: {
    //   type: [Number, String],
    //   default: ''
    // },
  },
  data() {
    return {
      is_open_local: false,
      numberRules: [
        v => (v !== '') || 'Обязательно для заполнения',
        v => (v !== '' && !RegExp(/[^0-9]/g).test(v)) || 'Допустимо только числовое значение',
      ]
    }
  },
  methods: {
    update() {
      if (this.$refs.dialogForm.validate()) {
        this.setByPath(this.cell.data, this.cell.data_path, this.cell.value)
        this.$emit('update', this.cell)
        this.hide()
      }
    },
    hide() {
      this.is_open_local = false
    },
    // Хитрая установка дочернего свойства объекта. Эх, не перемудрил ли я...
    setByPath(obj, path, value) {
      let levels = path.split('.')
      let subObj = obj
      while(levels.length > 1) {
        const level = levels.splice(0, 1)[0]
        subObj = subObj[level]
      }
      const last_level = levels.splice(0, 1)[0]
      subObj[last_level] = value
    }
  },
  watch: {
    is_open() {
      this.is_open_local = this.is_open
    },
    is_open_local() {
      this.$emit('update:is_open', this.is_open_local)
    }
  }
}
</script>
