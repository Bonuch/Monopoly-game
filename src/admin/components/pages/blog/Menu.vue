<template>
  <v-card>
    <v-card-title>
      Пункты меню в блоге
      <v-spacer></v-spacer>
      <v-btn
        class="mx-2"
        fab
        dark
        small
        color="primary"
        title="Новый пункт"
        @click="openDialog"
      >
        <v-icon dark>
          fa-plus
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
      hide-default-footer
      :loading="is_loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:item.title="{ item }">
        <a @click="editItem(item)">
          {{ item.title }}
        </a>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="editItem(item)" icon color="primary" dark>
          <v-icon>fa-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.url="{ item }">
        <a target="blank" :href="'/content/?url=' + item.article.url">
          /?url={{ item.article.url }}
        </a>
      </template>
    </v-data-table>

    <v-dialog v-model="is_dialog" max-width="590">
      <v-card v-if="editMenu">
        <v-card-title class="headline">
          Пункт меню «{{ editMenu.title }}»
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="is_valid" >

            <v-row>
              <v-col>
                <v-text-field 
                  v-model="editMenu.title"
                  required
                  :rules="requiredRules"
                  label="Заголовок меню"
                  maxlength="255"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-select
                  v-model="editMenu.article_id"
                  :items="articles"
                  item-text="title"
                  item-value="id"
                  label="Ведёт на статью..."
                  persistent-hint
                  :rules="requiredSelectRules"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field 
                  type="number"
                  v-model.number="editMenu.order_index"
                  required
                  label="Порядок следования"
                ></v-text-field>
              </v-col>
            </v-row>

          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="!!editMenu.id" :disabled="is_saving" text color="red darken-1" @click="removeMenu">
            Удалть
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="is_saving" color="warning darken-1" @click="hideDialog">
            Отмена
          </v-btn>
          <v-btn :loading="is_saving" color="green darken-1" @click="save()">
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
      is_valid: true,
      is_loading: false,
      is_dialog: false,
      is_saving: false,
      items: [],
      articles: [],
      headers: [
        { text: 'Заголовок', value: 'title' },
        { text: 'Статья', value: 'article.title' },
        { text: 'Адрес', value: 'url' },
        { text: '', value: 'actions', sortable: false, align: 'right' },
      ],
      requiredRules: [
        v => !!v.trim() || 'Обязательно для заполнения',
      ],
      requiredSelectRules: [
        v => !!v || 'Обязательно для заполнения',
      ],
      editMenu: null
    }
  },
  methods: {
    load() {
      this.is_loading = true
      this.$store.$app.$socket.client.emit('admin_blog_menu', null, response => {
        console.log('response', response)
        this.items = response.menus;
        this.articles = response.articles;
        this.is_loading = false
      });
    },
    editItem(item) {
      this.editMenu = JSON.parse(JSON.stringify(item))
      this.is_dialog = true
    },
    openDialog() {
      this.editMenu = {
        title: '',
        article_id: null
      }
      this.is_dialog = true
    },
    hideDialog() {
      this.editMenu = null
      this.is_dialog = false
    },
    removeMenu() {
      if(confirm('Уверены, что хотите удалить пункт меню?')) {
        this.$store.$app.$socket.client.emit('admin_remove_blog_menu', this.editMenu, response => {
          if (response.status) {
            this.load()
            this.hideDialog()
          } else {
            alert('Не удалось удалить')
          }
        });
      }
    },
    save() {
      this.$refs.form.validate()

      if (!this.is_valid) {
        alert('Не заполнены обязательные поля')
        return false
      }

      this.is_saving = true
      this.$store.$app.$socket.client.emit('admin_save_blog_menu', this.editMenu, response => {
        console.log('response', response)
        this.is_saving = false
        if (response.status) {
          this.load()
          this.hideDialog()
        } else {
          alert('Не удалось сохранить')
        }
      });


    }
  },
  mounted() {
    this.load()
  }
}
</script>

<style scoped>
  a {
    text-decoration: none;
    color: #68b5f5 !important;
  }
  a:hover {
    text-decoration: underline;
  }
</style>