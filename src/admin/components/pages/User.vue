<template>
  <div>
    <v-progress-linear
      :active="is_loading"
      :indeterminate="is_loading"
      absolute
      bottom
      color="deep-purple accent-4"
    ></v-progress-linear>
    <v-tabs
      fixed-tabs
      background-color="deep-purple accent-4"
        center-active
        dark
      v-model="tab"
      color="white"
    >
      <v-tab v-for="item in tab_items" :key="item.tab">
        {{ item.title }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-if="user" v-model="tab">
      <v-tab-item key="personal">
        <Personal :user="user" @update="load"></Personal>
      </v-tab-item>
      <v-tab-item key="items">
        <Inventory :user="user" @update="load"></Inventory>
      </v-tab-item>
      <v-tab-item key="chats">
        <Chats :user="user" @update="load"></Chats>
      </v-tab-item>
    </v-tabs-items>
    <!-- {{ user }} -->
  </div>
</template>

<script>

import Personal from "../components/user-profile/Personal.vue";
import Inventory from "../components/user-profile/inventory/index.vue";
import Chats from "../components/user-profile/Chats.vue";

export default {
  components: {
    Personal,
    Inventory,
    Chats
  },
  data() {
    return {
      id: null,
      user: null,
      is_loading: false,
      selection: 1,
      tab: null,
      tab_items: [
        { tab: 'personal', title: 'Персональная информация' },
        { tab: 'items', title: 'Инвентарь' },
        { tab: 'chats', title: 'Чаты' },
      ]
    }
  },
  methods: {
    load() {
      this.is_loading = true
      this.$store.$app.$socket.client.emit('admin_get_user', { uuid: this.id }, response => {
        let user = response.user;
        user.level = response.level
        user.friends = response.friends
        user.items = response.items
        if (user.hiddenFields == null) {
          user.hiddenFields = ''
        }
        this.user = user
        this.is_loading = false
      });
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.load()
  }
}
</script>

<style>

</style>
