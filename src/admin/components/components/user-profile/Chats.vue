<template>
  <v-container class="chat-container">
    <v-row>
      <v-col cols="12" md="12" class="text-center">
        <BanHummer @update="update" :user="user"></BanHummer>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <v-card tile class="mx-auto">
          <v-alert v-if="chats && !chats.length" >
            Пользователь не обменивался приватными сообщениями
          </v-alert>
          <v-list nav>
            <v-list-item-group v-model="select_user_index" color="primary">
              <v-list-item v-for="chat in chats" :key="chat.id" two-line>
                <v-list-item-icon>
                  <v-avatar class="user-avatar">
                    <img :src="chat.avatar_url">
                  </v-avatar>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ chat.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ chat.count }} сообщений</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="8" v-if="select_user">
        <v-progress-linear
          :active="!messages"
          :indeterminate="!messages"
          top
          color="deep-purple accent-4"
        ></v-progress-linear>
        <div v-if="messages">
          <v-alert v-for="message in messages"
            :key="message.id"
            :class="{'alert-right':isGeneral(message.sender_id)}"
            dense
            outlined
            prominent
            :border="isGeneral(message.sender_id) ? 'right' : 'left'"
          >
            <template v-slot:append v-if="isGeneral(message.sender_id)" >
              <v-avatar style="margin: 0 10px;">
                <img :src="user.avatar_url">
              </v-avatar>
            </template>
            <template v-slot:prepend v-else >
              <v-avatar class="naviganed" @click="toUserProfile">
                <img :src="select_user.avatar_url">
              </v-avatar>
            </template>
            {{ message.content }}
            <p>
              <small><em>{{ datetimeFormat(message.created_at) }}</em></small>
            </p>
          </v-alert>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BanHummer from './BanHummer.vue';
import moment from "moment"
import Vue from 'vue'

export default {
  components: {
    BanHummer
  },
  data() {
    return {
      messages: null,
      chats: [],
      select_user_index: null,
      select_user: null
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    loadChats() {
      this.$store.$app.$socket.client.emit('admin_user_private_chats', this.user.uuid, response => {
        this.chats = response.chats
      })
    },
    loadChatOneUser(chat_id) {
      this.messages = null
      let options = {
        user_id_1: this.user.id,
        user_id_2: chat_id,
      }
      this.$store.$app.$socket.client.emit('admin_get_chat_messages', options, response => {
        this.messages = response.messages
      })
    },
    isGeneral(user_id) {
      return this.user.id == user_id
    },
    update() {
      this.$emit('update')
    },
    toUserProfile() {
      this.$router.push('/admin/users')
      Vue.nextTick(() => {
        this.$router.push('/admin/user/?id=' + this.select_user.uuid)
      })
    },
    datetimeFormat(datetime) {
      return moment(datetime).format('DD.MM.YYYY HH:mm')
    },
  },
  watch: {
    select_user_index() {
      this.select_user = this.chats[this.select_user_index]
      if (this.select_user) {
        this.loadChatOneUser(this.select_user.id)
      } else {
        this.messages = null
      }
    }
  },
  mounted() {
    this.loadChats()
  }
}
</script>

<style scoped>
  .v-list-item--two-line .v-list-item__icon {
      margin-bottom: 12px;
  }

</style>
<style>
  .alert-right .v-alert__content {
    text-align: right !important;
  }
  .chat-container {
    max-height: calc(-150px + 100vh);
    min-height: calc(-150px + 100vh);
    overflow-y: auto;
  }
  .naviganed {
    cursor: pointer;
    margin: 0 10px;
  }
  .naviganed:hover {
    border: solid 2px #2196f3;
  }
</style>
