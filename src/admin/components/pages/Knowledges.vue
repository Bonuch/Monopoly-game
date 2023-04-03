<template>
  <v-card>
    <v-card-title>
      Все возможные знания
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
      <template v-slot:item.avatar="{ item }">
        <v-avatar size="40" class="user-avatar" @click="manageUser(item)">
          <img
            :src="item.image"
            :alt="item.name"
          >
        </v-avatar>
        &nbsp;
        <v-icon v-if="isNotTranslated('KNOWLEDGE', [item.name, item.description_text, item.upgrade_value1_title, item.upgrade_value2_title])"
          title="Нет перевода в системе"
          class="warning--text"
        >fa-language</v-icon>
        &nbsp;
        <a class="v-link" @click="manageUser(item)" >{{item.name}}</a>
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
    <v-container>
      <a class="v-link warning--text" >
        <small>
          <em>
            <v-icon
              title="Нет перевода в системе"
              class="warning--text"
            >fa-language</v-icon>
            - означает, что не хватает перевода, хранятся в frontend/locales/ в секции KNOWLEDGE
          </em>
        </small>
      </a>
    </v-container>

  </v-card>
</template>

<script>
import LocaleCheckMixin from '../../mixins/LocaleCheck.js';

export default {
  mixins: [LocaleCheckMixin],
  data() {
    return {
      is_loading: false,
      page: 1,
      pageCount: 1,
      search: '',
      items: [],
      headers: [
        { text: 'Код', value: 'code', width: "80px" },
        { text: 'Направление', value: 'branch', width: "180px" },
        { text: 'Название', value: 'avatar' },
        { text: '', value: 'actions', sortable: false, align: 'right' },
      ],
    }
  },
  methods: {
    load() {
      this.is_loading = true
      this.$store.$app.$socket.client.emit('admin_knowledges', { page: this.page, search: this.search }, response => {
        this.items = response.data.rows;
        this.pageCount = Math.ceil(response.data.count / 10)
        this.is_loading = false
      });
    },
    manageUser(knowledge) {
      this.$router.push('/admin/knowledge/?id=' + knowledge.id)
    },
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
