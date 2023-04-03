<template>
  <v-card>
    <v-card-title>
      Игровые значения
      <v-spacer></v-spacer>
      <v-text-field
        style="padding-top: 0px; margin-right: 5px;"
        v-model="search"
        append-icon="fa-search"
        label="Поиск по названию"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
      :page.sync="page"
      hide-default-footer
      :loading="is_loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:item.base_value="{ item }">
        <span>
          {{ item.base_value }}
          {{ item.unit_sign }}
        </span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="manageUser(item)" icon color="primary" dark>
          <v-icon>fa-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
        prev-icon="fa-angle-left"
        next-icon="fa-angle-right"
      ></v-pagination>
    </div>

    <v-dialog v-model="is_dialog" max-width="390">
      <v-card v-if="selected_item">
        <v-card-title>
          Изменить значение
        </v-card-title>
        <v-card-text>
          <v-form ref="dialogForm" @submit.prevent="save">
            <v-text-field
              :rules="valueRules"
              :label="selected_item.name"
              v-model="selected_item.base_value"
              :suffix="selected_item.unit_sign"  
              autofocus
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="is_dialog = false">
            Отмена
          </v-btn>
          <v-btn color="blue darken-1" text @click="save">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      is_loading: false,
      page: 1,
      pageCount: 1,
      search: '',
      items: [],
      headers: [
        { text: 'Название', value: 'name' },
        { text: 'Описание', value: 'description' },
        { text: 'Базовое значение', value: 'base_value' },
        { text: '', value: 'actions', sortable: false, align: 'right' },
      ],

      is_dialog: false,
      selected_item: null,
      base_selected_item: null,
      valueRules: [ v => !!v || 'Поле обязательно для заполнения' ],
    }
  },
  methods: {
    load() {
      this.is_loading = true
      this.$store.$app.$socket.client.emit('admin_get_game_values', { page: this.page, search: this.search }, response => {
        this.items = response.data.rows;
        this.pageCount = Math.ceil(response.data.count / 10)
        this.is_loading = false
      });
    },
    manageUser(game_value) {
      this.selected_item = JSON.parse(JSON.stringify(game_value))
      this.base_selected_item = game_value
      this.is_dialog = true
    },
    save() {
      if (this.$refs.dialogForm.validate()) {
        this.is_loading = true
        this.$store.$app.$socket.client.emit('admin_save_game_value', this.selected_item, response => {
          this.base_selected_item.base_value = this.selected_item.base_value
          this.is_loading = false
          this.is_dialog = false
        });
      }
    }
  },
  watch: {
    page() {
      this.load()
    },
    search() {
      this.page = 1
      this.load()
    }
  },
  mounted() {
    this.load()
  }
}
</script>
