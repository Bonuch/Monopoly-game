<template>
  <div>
    <v-progress-linear
      :active="is_loading"
      :indeterminate="is_loading"
      absolute
      top
      color="deep-purple accent-4"
    ></v-progress-linear>
    <v-container fluid v-if="knowledge">
      <v-row dense>
        <v-col cols="12" md="4" sm="12">
          <v-container>
            <div class="text-center">
              <v-img
                style="display: inline-block;"
                :src="knowledge.image"
                max-height="270"
                max-width="150"
              >
              </v-img>
            </div>
            <v-row>
              <v-col cols="12" class="text-center">
                <v-btn color="deep-purple accent-4" :loading="is_uploading_photo" id="pick-avatar" style="margin: 10px;">
                  <v-icon>fa-camera</v-icon>
                  &nbsp;
                  Сменить
                </v-btn>
                <avatar-cropper
                  @uploaded="handleUploaded"
                  @uploading="is_uploading_photo = true"
                  trigger="#pick-avatar"
                  :upload-url="`${baseAppUrl}/api/upload-photo`"
                  :labels="{
                        submit: 'Ок',
                        cancel: 'Отмена'
                      }"
                />
                <v-btn @click="saveInfo" color="success" :loading="is_saving" style="margin: 10px;">
                  <v-icon>fa-save</v-icon>
                  &nbsp;
                  Сохранить
                </v-btn>
                <p class="avatar-message" v-if="avatarUploadMsg">{{avatarUploadMsg}}</p>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12" md="8" sm="12">
          <v-container>
            <v-form ref="form" v-model="is_valid" >
              <small v-if="isNotTranslated('KNOWLEDGE', [knowledge.name])">
                <em class="warning--text">* Отсутствует перевод в локализации</em>
              </small>
              <v-text-field 
                v-model="knowledge.name"
                required
                label="Название"
              ></v-text-field>
              <!-- <v-text-field 
                v-model="knowledge.description_title"
                required
                label="Заголовок описания"
              ></v-text-field> -->
              <small v-if="isNotTranslated('KNOWLEDGE', [knowledge.description_text])">
                <em class="warning--text">* Отсутствует перевод в локализации</em>
              </small>

              <v-textarea
                outlined
                class="mt-1"
                v-prepend-icon="fa-language"
                name="input-7-1"
                label="Описание"
                v-model="knowledge.description_text"
              ></v-textarea>

              <div v-if="isNotTranslated('KNOWLEDGE', [knowledge.upgrade_value1_title])">
                <small>
                  <em class="warning--text">
                    {{ knowledge.upgrade_value1_title }}
                  </em>
                 - отсутствует перевод
                </small>
              </div>

              <div v-if="isNotTranslated('KNOWLEDGE', [knowledge.upgrade_value2_title])">
                <small>
                  <em class="warning--text">
                    {{ knowledge.upgrade_value1_title }}
                  </em>
                 - отсутствует перевод
                </small>
              </div>

            </v-form>
          </v-container>
        </v-col>
      </v-row>
    </v-container>

    <v-card-title>
      Улучшения
    </v-card-title>

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

    <v-tabs-items v-model="tab">
      <v-tab-item key="form">
        <KnowForm v-if="!!knowledge && !!upgrades"
          :knowledge="knowledge"
          :upgrades="upgrades"
        />
      </v-tab-item>
      <v-tab-item key="table">
        <KnowTable v-if="!!knowledge && !!upgrades"
          :knowledge="knowledge"
          :upgrades="upgrades"
        />
      </v-tab-item>
    </v-tabs-items>


  </div>
</template>

<script>
  import AvatarCropper from "vue-avatar-cropper";
  import KnowForm from "../components/knowledge/KnowForm.vue";
  import KnowTable from "../components/knowledge/KnowTable.vue";
  import LocaleCheckMixin from '../../mixins/LocaleCheck.js';

  export default {
    mixins: [LocaleCheckMixin],
    components: {
      AvatarCropper,
      KnowForm,
      KnowTable
    },
    data() {
      return {
        id: null,
        knowledge: null,
        upgrades: null,
        // selected_level: null,

        is_loading: true,
        baseAppUrl: null,
        avatarUploadMsg: null,
        save_results: [],
        is_saving: false,
        is_valid: false,
        is_uploading_photo: false,

        tab: null,
        tab_items: [
          { tab: 'form', title: 'Форма' },
          { tab: 'table', title: 'Таблица' },
        ]

      };
    },
    methods: {
      load() {
        this.is_loading = true
        this.$store.$app.$socket.client.emit('admin_get_knowledge', { id: this.id }, response => {
          this.knowledge = response.knowledge
          this.upgrades = response.upgrades
          this.is_loading = false
        });
      },
      handleUploaded(resp) {
        if (!resp.error) {
          this.avatarUploadMsg = 'Не забудьте сохранить фото';
          this.knowledge.image = resp.relative_url;
        } else {
          this.$dialog.alert(resp.error);
        }
        this.is_uploading_photo = false
      },
      saveInfo() {
        this.is_saving = true
        this.$store.$app.$socket.client.emit('admin_save_info_knowledge', this.knowledge, response => {
          this.is_saving = false
          this.avatarUploadMsg = ''
        });
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.load()
      this.baseAppUrl = process.env.VUE_APP_HOST;
    },
  }
</script>
