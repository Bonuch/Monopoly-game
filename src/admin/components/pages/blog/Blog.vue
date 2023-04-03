<template>
<div>
  <v-card>
    <v-card-title>
      Статьи и новости в блоге
      <v-spacer></v-spacer>
      <v-text-field
        style="padding-top: 0px; margin-right: 5px;"
        v-model="search"
        append-icon="fa-search"
        label="Поиск по названию"
        single-line
        hide-details
      ></v-text-field>
      <v-btn
        class="mx-2"
        fab
        dark
        small
        color="primary"
        title="Новая статья"
        to="/admin/blog/article"
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
      :page.sync="page"
      hide-default-footer
      :loading="is_loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:item.title="{ item }">
        <router-link :to="'/admin/blog/article/?id=' + item.id">
          {{ item.title }}
        </router-link>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="editArticle(item)" icon color="primary" dark>
          <v-icon>fa-pencil</v-icon>
        </v-btn>

        <v-icon v-if="item.show_in_feed" title="Попадает в ленту новостей на сайте">fa-eye</v-icon>
        <v-icon v-else color="grey" title="Скрыт из ленты новостей">fa-eye-slash</v-icon>

      </template>
      <template v-slot:item.url="{ item }">
        <a target="blank" :href="'/content/?url=' + item.url">
          /?url={{ item.url }}
        </a>
      </template>
      <template v-slot:item.tags="{ item }">
        <div>
        <v-chip v-for="tag in item.tags" :key="tag" class="ma-2" x-small>
          {{ tag }}
        </v-chip>
        </div>
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
    <v-container>
      <v-row>
        <v-col>
          Дополнительно:
          <ul>
            <li>
              <router-link to="/admin/blog/menu">Управление пунктами меню</router-link>
            </li>
            <li>
              <router-link to="/admin/blog/slider">Управление слайдером</router-link>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</div>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      is_loading: false,
      page: 1,
      pageCount: 1,
      search: '',
      items: [],
      headers: [
        { text: 'Заголовок', value: 'title' },
        { text: 'Теги', value: 'tags' },
        { text: 'Адрес на сайте', value: 'url' },
        { text: 'Дата', value: 'created_at' },
        { text: '', value: 'actions', sortable: false, align: 'right' },
      ],
    }
  },
  methods: {
    load() {
      this.is_loading = true
      this.$store.$app.$socket.client.emit('admin_articles', { page: this.page, search: this.search }, response => {
        this.items = response.data.rows;
        this.pageCount = Math.ceil(response.data.count / 10)
        this.is_loading = false
      });
    },
    editArticle(item) {
      this.$router.push('/admin/blog/article/?id=' + item.id)
    },
    dateFormat(date) {
      return moment(date).format('DD.MM.YYYY HH:mm')
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

<style scoped>
  a {
    text-decoration: none;
    color: #68b5f5 !important;
  }
  a:hover {
    text-decoration: underline;
  }
</style>