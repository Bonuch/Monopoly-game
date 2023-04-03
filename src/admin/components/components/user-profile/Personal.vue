<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" offset-lg="0" md="6" offset-md="3" sm="12">
        <v-container>
          <div class="text-center">
            <v-avatar size="192" style="overflow: visible;">
              <img :src="user.avatar_url" :alt="user.name">
              <v-icon v-if="user.is_vip" color="yellow" size="60" style="position: absolute; bottom: 10px; right: 10px; width: auto; height: auto; text-shadow: 1px 2px 2px black;">fa-star</v-icon>
            </v-avatar>
          </div>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn color="primary" :loading="is_uploading_avatar" id="pick-avatar" style="margin: 10px;">
                <v-icon>fa-camera</v-icon>
                &nbsp;
                Сменить аватар
              </v-btn>
              <avatar-cropper
                @uploaded="handleUploaded"
                @uploading="is_uploading_avatar = true"
                trigger="#pick-avatar"
                :upload-url="`${baseAppUrl}/api/upload-avatar`"
                :labels="{
                      submit: 'Ок',
                      cancel: 'Отмена'
                    }"
              />
              <p class="avatar-message" v-if="avatarUploadMsg">{{avatarUploadMsg}}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center">
              <BanHummer @update="update" :user="user"></BanHummer>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <v-container>

        <v-form ref="form" v-model="is_valid" >
          <v-text-field 
            v-model="user.fullname"
            required
            label="Имя"
            :rules="requiredRules"
          ></v-text-field>

          <v-text-field v-model="user.town" label="Город">
            <template v-slot:append-outer>
              <hidden-field v-model="user.hiddenFields" name="town" />
            </template>
          </v-text-field>

          <v-text-field type="number" v-model.number.trim="user.age" label="Возраст">
            <template v-slot:append-outer>
              <hidden-field v-model="user.hiddenFields" name="age" />
            </template>
          </v-text-field>

          <v-select
            :items="gender_variants"
            label="Гендер"
            item-text="title"
            item-value="id"
            v-model="user.gender"
          >
            <template v-slot:append-outer>
              <hidden-field v-model="user.hiddenFields" name="gender" />
            </template>
          </v-select>

          <v-text-field
            v-model.trim="user.name"
            required
            :rules="requiredRules"
            label="Логин"
            autocomplete="off"
          ></v-text-field>

          <v-text-field
            v-model.trim="user.email"
            :rules="emailRules"
            required
            label="Электронная почта"
            autocomplete="off"
          ></v-text-field>

          <v-text-field
            v-model.trim="user.password"
            label="Пароль"
            type="password"
            autocomplete="new-password"
          ></v-text-field>

          <v-text-field
            v-model.trim="user.password_retry"
            label="Повтор пароля"
            type="password"
            autocomplete="new-password"
            :rules="passwordRetryRules"
          ></v-text-field>

          <v-text-field v-model.trim="user.instagram_url" label="Instagram">
            <template v-slot:append-outer>
              <hidden-field v-model="user.hiddenFields" name="instagram_url" />
            </template>
          </v-text-field>

          <v-text-field v-model.trim="user.vkontakte_url" label="Vkontakte">
            <template v-slot:append-outer>
              <hidden-field v-model="user.hiddenFields" name="vkontakte_url" />
            </template>
          </v-text-field>

          <v-text-field v-model.trim="user.facebook_url" label="Facebook">
            <template v-slot:append-outer>
              <hidden-field v-model="user.hiddenFields" name="facebook_url" />
            </template>
          </v-text-field>
        </v-form>
        </v-container>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" class="text-center">
        <v-alert
          dismissible
          close-icon="fa-trash"
          dense
          :type="result.is_success ? 'success' : 'warning'"
          v-for="(result, i) in save_results"
          :key="i"
        >
          {{ result.message }}
        </v-alert>
        <v-btn color="success" :disabled="is_saving" :loading="is_saving" @click="save">Сохранить изменения</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AvatarCropper from "vue-avatar-cropper";
import HiddenField from './HiddenField.vue'
import BanHummer from './BanHummer.vue';

export default {
  components: {
    AvatarCropper,
    HiddenField,
    BanHummer
  },
  data() {
    return {
      gender_variants: [
        { title: "Мужской", id: "Male" },
        { title: "Женский", id: "Female" },
        { title: "Не указан", id: "Default" }
      ],
      baseAppUrl: null,
      avatarUploadMsg: null,
      save_results: [],
      is_saving: false,
      is_valid: false,
      is_uploading_avatar: false,
      requiredRules: [
        v => !!v.trim() || 'Обязательно для заполнения',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRetryRules: [
        () => {
          if (this.user.password == this.user.password_retry) {
            return true
          }
          return 'Не совпадает с паролем'
        },
      ],
    };
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleUploaded(resp) {
      if (!resp.error) {
        this.avatarUploadMsg = 'Для обновления аватара - нажмите "Сохранить"';
        this.user.avatar_url = resp.relative_url;
      } else {
        this.$dialog.alert(resp.error);
      }
      this.is_uploading_avatar = false
    },
    save() {
      this.$refs.form.validate()
      if (!this.is_valid) return

      this.is_saving = true
      this.$store.$app.$socket.client.emit('admin_update_user_profile', this.user, response => {
        this.is_saving = false
        this.avatarUploadMsg = '';
        this.save_results.push({
          message: response.message,
          is_success: response.success
        })
      });
    },
    update() {
      this.$emit('update')
    }
  },
  mounted() {
    this.baseAppUrl = process.env.VUE_APP_HOST;
  }
};
</script>

<style>
  .avatar-cropper-btn {
    background-color: #2196f3 !important;
    border-color: #2196f3 !important;
    color: #fff;
    border-radius: 4px;
    margin: 3px;
    padding: 10px 0;
  }
  .avatar-message {
    margin-top: 10px;
  }
</style>
