<template>
  <v-card>
    <v-card-title>
      Слайдер в шапке блога
      <v-spacer></v-spacer>
      <v-btn
        class="mx-2"
        fab
        dark
        small
        color="primary"
        title="Новое фото"
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
      <template v-slot:item.photo="{ item }">
        <v-avatar class="user-avatar my-1">
          <img
            :src="item.photo"
            :alt="item.title"
          >
        </v-avatar>
      </template>
    </v-data-table>

    <v-dialog v-model="is_dialog" max-width="590">
      <v-card v-if="editPhoto">
        <v-card-title class="headline">
          Фото слайдера «{{ editPhoto.title }}»
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="is_valid" >
            <v-row>
              <v-col>
                <v-text-field 
                  v-model="editPhoto.title"
                  required
                  :rules="requiredRules"
                  label="Название для админа"
                  maxlength="255"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <Upload v-model="editPhoto.photo"
                  :api_url="`${baseAppUrl}/api/upload-photo?folder=slider`"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="!!editPhoto.id" :disabled="is_saving" text color="red darken-1" @click="removeMenu">
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
import Upload from "../../components/Upload.vue";
export default {
  components: {
    Upload
  },
  data() {
    return {
      is_valid: true,
      is_loading: false,
      is_dialog: false,
      is_saving: false,
      items: [],
      headers: [
        { text: 'Фото', value: 'photo' },
        { text: 'Название', value: 'title' },
        { text: '', value: 'actions', sortable: false, align: 'right' },
      ],
      requiredRules: [
        v => !!v.trim() || 'Обязательно для заполнения',
      ],
      editPhoto: null,
      baseAppUrl: null,
    }
  },
  methods: {
    load() {
      this.is_loading = true
      this.$store.$app.$socket.client.emit('admin_blog_slider', null, response => {
        console.log('response', response)
        this.items = response.data;
        this.is_loading = false
      });
    },
    editItem(item) {
      this.editPhoto = JSON.parse(JSON.stringify(item))
      this.is_dialog = true
    },
    openDialog() {
      this.editPhoto = {
        title: '',
        photo: ''
      }
      this.is_dialog = true
    },
    hideDialog() {
      this.editPhoto = null
      this.is_dialog = false
    },
    removeMenu() {
      if(confirm('Уверены, что хотите удалить фото?')) {
        this.$store.$app.$socket.client.emit('admin_remove_blog_slider', this.editPhoto, response => {
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
      this.$store.$app.$socket.client.emit('admin_save_blog_slider', this.editPhoto, response => {
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
    this.baseAppUrl = process.env.VUE_APP_HOST;
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