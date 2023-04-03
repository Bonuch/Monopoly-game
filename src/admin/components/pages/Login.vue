<template>
  <v-layout column justify-center align-center>
    <v-card
      v-show="!is_processing && !is_loading"
      max-width="500"
      min-width="350"
    >
        <div class="login-logo">
          <a href="/"><img class="img" src="/design/logos/logo.png"/></a>
        </div>
      <v-container>
        <form ref="credentials" action="/admin/" @submit.prevent="authenticate">
          <v-text-field
            v-model="credentials.username"
            :rules="emailRules"
            label="Email"
            :error-messages="error"
            required
            autofocus
          ></v-text-field>

          <v-text-field
            v-model="credentials.password"
            label="Password"
            type="password"
            required
            :error="!!error"
          ></v-text-field>

          <v-btn
            type="submit"
            @click="authenticate"
            :disabled="is_processing"
            color="success"
            class="mr-4"
          >Login</v-btn>
        </form>
      </v-container>
    </v-card>
  </v-layout>
</template>

<script>
import { login } from "@/helpers/auth";
import {registerWebsocket} from '@/helpers/general';
import {mapGetters, mapMutations, mapActions} from 'vuex';

export default {
  name: "login",
  data() {
    return {
      credentials: {
        username: "",
        password: ""
      },
      error: null,
      is_loading: false,
      is_processing: false,
      emailRules: [
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    };
  },
  methods: {
    ...mapMutations(['updateToken']),
    ...mapActions(['loadUserInfo', 'SOCKET_REFRESH_TOKEN_REQUEIRED', 'logout']),
    authenticate() {
      this.$store.dispatch("login");

      login(this.credentials)
        .then(res => {
          this.error = '';
            this.updateToken(res);
            registerWebsocket(this.$store);

            this.loadUserInfo().then((e) => {
              if (this.$store.state.currentUser.role == 'Administrator') {
                this.$router.push({ path: "/admin/" });
              } else {
                this.error = 'Доступ только для администратора'
                this.logout()
                
                // TODO: костыль. Исправляет баг, когда после логина не_админом админ не может зайти
                // Не могу понять в чём дело, отчасти из-за того, что за сокетом на бэкенде сохраняется модель пользователя.
                // Но походу не только в этом дело
                setTimeout(() => {
                  window.location.reload()
                }, 1500);
              }
            })
        })
        .catch(error => {
          this.error = error
        });
    }
  },
  computed: {
    authError() {
      return this.$store.getters.authError;
    }
  }
};
</script>

<style lang="scss" scoped>
    .container {
        padding-top: 0;
    }
    .error {
      text-align: center;
      color: red;
    }
    .login-logo {
        text-align: center;
        margin-top: 14px;

        a {
            display: inline-block;
        }
        .img {
            height: 60px;
            display: inline-block;
        }
    }
</style>
