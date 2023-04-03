<template>
  <v-form ref="form" v-model="is_valid">
    <v-card>
      <v-card-title>
        <span class="headline">Новый пользователь</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-text-field v-model.trim="user.email"
                :rules="emailRules"
                required
                label="Электронная почта"
                autocomplete="off"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <v-text-field v-model.trim="user.name"
                required
                :rules="requiredRules"
                label="Логин"
                autocomplete="off"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <v-text-field v-model="user.fullname"
                required
                label="Полное имя"
                :rules="requiredRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <v-text-field v-model.trim="user.password"
                label="Пароль"
                type="password"
                autocomplete="new-password"
                :rules="requiredRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <v-text-field v-model.trim="user.password_retry"
                label="Повтор пароля"
                type="password"
                autocomplete="new-password"
                :rules="passwordRetryRules"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Отмена</v-btn>
        <v-btn color="blue darken-1" text @click="save">Создать</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: '',
        fullname: '',
        name: '',
        password: '',
        password_retry: ''
      },
      is_valid: false,
      requiredRules: [
        v => !!v.trim() || 'Обязательно для заполнения',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRetryRules: [
        v => !!v.trim() || 'Обязательно для заполнения',
        () => {
          if (this.user.password == this.user.password_retry) {
            return true
          }
          return 'Не совпадает с паролем'
        },
      ],

    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    save() {
      this.$refs.form.validate()
      
      if (this.is_valid) {
        this.$store.$app.$socket.client.emit('admin_create_user', this.user, response => {
          if (response.success) {
            this.$router.push('/admin/user/?id=' + response.uuid)
          }
          else {
            alert(response.message)
          }
        })
      }
    },
  }
};
</script>

<style>
</style>
