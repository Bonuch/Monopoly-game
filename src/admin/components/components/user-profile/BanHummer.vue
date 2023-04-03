<template>
  <div>
    <v-btn v-if="!user.is_banned" color="red" @click="openBanDialog();">
      <v-icon>fa-gavel</v-icon>
      &nbsp;
      Забанить пользователя
    </v-btn>
    <span v-else>
      <v-alert dense outlined type="error">
        {{ banInfo() }}
      </v-alert>
      <v-btn color="warning" @click="clearBan();">
        <v-icon>fa-gavel</v-icon>
        &nbsp;
        Отменить бан
      </v-btn>
    </span>
    <v-dialog v-model="is_ban_dialog" max-width="590">
      <v-card>
        <v-card-title class="headline">
          Забанить пользователя «{{ user.name }}»
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-date-picker :disabled="is_ban_forever" color="indigo" v-model="ban_date"></v-date-picker>
            </v-col>
            <v-col>
              <v-textarea label="Причина:" v-model="ban_reason"></v-textarea>
              <v-checkbox label="Забанить навсегда" v-model="is_ban_forever"></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="is_ban_pocessing" color="warning darken-1" @click="hideBanDialog">
            Отмена
          </v-btn>
          <v-btn :loading="is_ban_pocessing" color="green darken-1" @click="setBan()">
            Подтвердить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      is_ban_dialog: false,
      is_ban_pocessing: false,
      ban_date: moment().add(1, 'days').format('YYYY-MM-DD'),
      is_ban_forever: false,
      ban_reason: ''
    }
  },
  methods: {
    openBanDialog() {
      this.is_ban_dialog = true
    },
    hideBanDialog() {
      this.is_ban_dialog = false
    },
    setBan() {
      let options = {
        uuid: this.user.uuid,
        game_id: null,
        is_forever: this.is_ban_forever,
        reason: this.ban_reason,
        date: this.ban_date
      }
      this.$store.$app.$socket.client.emit('admin_ban_user', options, response => {
        if (response.success) {
          this.$emit('update')
          this.hideBanDialog()
        }
      })
    },
    clearBan() {
      this.$store.$app.$socket.client.emit('admin_clear_ban', this.user.uuid, response => {
        if (response.success) {
          this.$emit('update')
        }
      })
    },
    banInfo() {
      let info = 'Забанен '
      if (this.user.ban_finish_time) {
        info += 'до ' + moment(this.user.ban_finish_time).format('DD.MM.YYYY')
      } else {
        info += 'навсегда'
      }
      if (this.user.ban_reason) {
        info += ' Причина: ' + this.user.ban_reason
      }
      return info
    }
  }
}
</script>
