<template>
  <v-row dense class="mt-5">
    <v-col cols="12" :md="local_value ? 8 : 12">
      <v-file-input
        accept="image/*"
        :label="label"
        @change="onFileChange"
        @click:clear="removeImage"
        :loading="is_processing"
      ></v-file-input>
      <v-btn v-if="local_value" @click="removeImage" text >Удалить фото</v-btn>
    </v-col>
    <v-col v-if="local_value" cols="12" md="4">
      <v-img :src="local_value" />
    </v-col>
  </v-row>
</template>

<script>

import axios from '@/helpers/axios-instance';

export default {
  data: () => ({
    local_value: '',
    is_processing: false,
  }),
  props: {
    value: {
      type: String,
      default: ''
    },
    api_url: {
      type: String,
      default: '/images/upload/'
    },
    label: {
      type: String,
      default: 'Загрузить фото'
    },
  },
  watch: {
    value() {
      this.local_value = this.value
    }
  },
  methods: {
    onFileChange(files) {
      console.log('files', files)
      if (!files)
        return;
      this.submitFile(files);
    },
    submitFile (file) {
      var component = this
      component.is_processing = true
      let formData = new FormData()

      formData.append('file', file)
      var headers = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      axios.post(component.api_url, formData, headers)
        .then(function (response) {
          console.log('SUCCESS!!', response)
          component.local_value = response.data.relative_url
          component.$emit('input', response.data.relative_url)
          component.is_processing = false
        })
        .catch(function (error) {
          console.log('FAILURE!!', error)
          component.is_processing = false
          alert('Не удалось загрузить файл')
          
        })
    },
    removeImage: function (e) {
      var app = this
      app.local_value = '';
      app.$emit('input', '')
    }
  },
  mounted () {
    this.local_value = this.value
  }
}
</script>
<style>

</style>
