<template>
  <div>
    <!-- {{log_events}} -->
    <!-- <span v-if="log_events">{{log_events.length}}</span> -->
    <v-data-table
      v-if="log_events"
      :headers="headers"
      :items="log_events"
      class="elevation-1"
      :page.sync="page"
      hide-default-footer
      :loading="is_loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:item.created_at="{ item }">
        <span>
          {{ datetimeFormat(item.created_at) }}
        </span>
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
  </div>
</template>

<script>
import moment from "moment"
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      log_events: null,
      page: 1,
      pageCount: 1,
      is_loading: true,
      headers: [
        { text: 'Дата и время', value: 'created_at' },
        { text: 'Описание', value: 'text' },
      ],
    }
  },
  methods: {
    loadLog() {
      this.is_loading = true
      let options = {
        uuid: this.user.uuid,
        page: this.page
      }
      this.$store.$app.$socket.client.emit('admin_user_loot_log', options, response => {
        this.log_events = response.data.rows
        this.pageCount = Math.ceil(response.data.count / 10)
        this.is_loading = false
      })
    },
    datetimeFormat(datetime) {
      return moment(datetime).format('DD.MM.YYYY HH:mm')
    },
  },
  mounted() {
    this.loadLog()
  },
  watch: {
    page() {
      this.loadLog()
    },
  }
}
</script>
