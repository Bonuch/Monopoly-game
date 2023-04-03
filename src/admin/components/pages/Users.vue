<template>
  <div>
    <v-card>
      <v-card-title>
        Зарегистрированные пользователи
        <v-spacer></v-spacer>
        <v-text-field
          style="padding-top: 0px; margin-right: 5px;"
          v-model="search"
          append-icon="fa-search"
          label="Поиск: логин, имя или email"
          single-line
          hide-details
        ></v-text-field>
        <v-dialog
          v-model="is_dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">

            <v-btn
              class="mx-2"
              fab
              dark
              small
              v-bind="attrs"
              v-on="on"
              color="primary"
            >
              <v-icon dark>
                fa-user-plus
              </v-icon>
            </v-btn>
          </template>
          <CreateUser @close="is_dialog=false" />
        </v-dialog>

      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="users"
        class="elevation-1"
        :page.sync="page"
        hide-default-footer
        :loading="is_loading"
        loading-text="Loading... Please wait"
      >
        <template v-slot:item.avatar="{ item }">
          <v-avatar class="user-avatar" @click="manageUser(item)">
            <img
              :src="item.avatar_url"
              :alt="item.name"
            >
          </v-avatar>
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
    </v-card>
  </div>
</template>

<script>

import CreateUser from "../components/user-profile/CreateUser.vue";

export default {
  name: 'Users',
  components: {
    CreateUser
  },
  data() {
    return {
      is_dialog: false,
      is_loading: false,
      page: 1,
      pageCount: 1,
      search: '',
      users: [],
      headers: [
          { text: 'Пользователь', value: 'avatar' },
          {
            text: 'Город',
            align: 'start',
            sortable: true,
            value: 'town',
          },
          { text: 'Баланс $', value: 'balance_bucks' },
          { text: 'Баланс BTC', value: 'balance_crypto' },
          { text: '', value: 'actions', sortable: false, align: 'right' },
        ],
    }
  },
  methods: {
    load() {
      this.is_loading = true
      this.$store.$app.$socket.client.emit('admin_find_users', { page: this.page, search: this.search }, response => {
        this.users = response.data.rows;
        this.pageCount = Math.ceil(response.data.count / 10)
        this.is_loading = false
      });
    },
    manageUser(user) {
      this.$router.push('/admin/user/?id=' + user.uuid)
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
  .user-avatar {
    cursor: pointer;
  }
  .user-avatar:hover {
    border: solid 2px #2196f3;
  }
  a.v-link {
    color: #1989fa !important;
    font-weight: bold;
  }
  a.v-link:hover {
    color: #aad9ff !important;
    text-decoration: underline !important;
  }
</style>
