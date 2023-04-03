<template>
  <v-container>
    <v-card-title style="justify-content: space-between;">
      Предметы в наличии:
      <v-btn @click="openDialogItems" text color="primary">
        <v-icon small>fa-plus</v-icon>&nbsp;
        Дать предмет
      </v-btn>
    </v-card-title>

    <v-row v-if="user_items && !user_items.length">
      <v-col cols="12" style="text-align: center;">

          <v-chip class="ma-2" color="warning">
            Пока нет предметов
          </v-chip>

      </v-col>
    </v-row>

    <v-row v-if="user_items">
      <v-col v-for="item in user_items" :key="item.id" cols="12" md="4">
        <v-card>
          <v-list >
            <v-list-item two-line>
              <v-list-item-icon v-if="item.image">
                <v-avatar size="50" tile color="#455A6455">
                  <img :src="item.image">
                </v-avatar>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title :style="calcStyle(item)">
                  {{ item.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ itemTypeTitle(item._type) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          </v-card>
      </v-col>
    </v-row>


    <v-dialog v-model="is_items_dialog" fullscreen>
      <v-card>
        <v-card-title class="headline">
          <span>Раздача предметов</span>
          <v-spacer></v-spacer>
          <v-btn color="warning darken-1" @click="closeDialog()">
            Закрыть
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-subheader>
                <h3 class="mt-5">Пользователю «{{ user.name }}»</h3>
              </v-subheader>
            </v-col>
            <v-col>
              <v-select
                label="Категория"
                item-text="title"
                item-value="type"
                v-model="dialog.category"
                :items="ITEM_TYPES"
                @input="search"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                label="Класс предмета"
                item-text="title"
                item-value="level"
                v-model="dialog.level"
                :items="LEVEL_TYPES"
                @input="search"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="dialog.q"
                hide-details="auto"
                append-icon="fa-search"
                label="Поиск по названию"
                @input="search"
            ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-progress-linear
              :active="is_loading"
              :indeterminate="is_loading"
              top
              color="deep-purple accent-4"
            ></v-progress-linear>
            <v-col v-for="(item, index) in search_items" :key="index" cols="12" md="4">
              <v-card>
                <v-list >
                  <v-list-item two-line>
                    <v-list-item-icon v-if="item.image">
                      <v-avatar size="50" tile color="#455A6455">
                        <img :src="item.image">
                      </v-avatar>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title :style="calcStyle(item)">
                        {{ item.title }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ itemTypeTitle(item.type) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <span v-if="item.message">{{ item.message }}</span>
                      <v-icon v-else-if="item.is_processing" class="fa-fw" color="indigo accent-3">fa-spinner fa-pulse</v-icon>
                      <v-btn v-else @click="giveItem(item)" icon title="Отдать пользователю">
                        <v-icon color="grey lighten-1">fa-exchange</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>

import Vue from 'vue'

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      user_items: null,
      search_items: [],
      is_items_dialog: false,
      is_loading: true,
      dialog: {
        q: '',
        level: 1,
        category: null
      },
      ITEM_TYPES: [
        { title: 'Буст поля', type: 'gameboost' },
        { title: 'Кубик', type: 'gamedice' },
        { title: 'Фишка', type: 'gamechip' },
        { title: 'Бренд', type: 'game_cards' }
      ],
      LEVEL_TYPES: [
        { level: 1, title: 'Низкий' },
        { level: 2, title: 'Средний' },
        { level: 3, title: 'Высокий' },
        { level: 4, title: 'Специальный' },
        { level: 5, title: 'Элитный' },
      ]
    }
  },
  methods: {
    loadUserItems() {
      this.$store.$app.$socket.client.emit('admin_get_user_items', this.user.uuid, response => {
        this.user_items = response.items
      })
    },
    openDialogItems() {
      if (!this.dialog.category) {
        this.dialog.category = this.ITEM_TYPES[0].type
      }
      this.is_items_dialog = true
      this.search();
    },
    search() {
      this.is_loading = true
      Vue.nextTick(() => {
        this.$store.$app.$socket.client.emit('seach_game_items', this.dialog, response => {
          this.search_items = response.items
          setTimeout(() => {
            this.is_loading = false
          }, 500);
        })
      })
    },
    calcStyle(item) {
      let style = ''
      if (item.color) {
        style = style + 'color: ' + item.color + '; '
      }
      return style
    },
    itemTypeTitle(type) {
      const t = this.ITEM_TYPES.find(x => x.type == type)
      return t ? t.title : type
    },
    giveItem(item) {
      const options = {
        item: item,
        user_uuid: this.user.uuid
      }

      Vue.set(item, 'is_processing', true)

      this.$store.$app.$socket.client.emit('admin_give_user_item', options, response => {
        Vue.set(item, 'is_processing', false)
        Vue.set(item, 'message', response.message)
        Vue.set(item, 'is_success', response.success)
      })
    },
    closeDialog() {
      this.is_items_dialog = false
      this.loadUserItems()
    }
  },
  mounted() {
    this.loadUserItems()
  }
}
</script>
