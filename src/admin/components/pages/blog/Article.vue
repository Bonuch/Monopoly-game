<template>
    <div>
        <v-progress-linear
            :active="is_loading"
            :indeterminate="is_loading"
            absolute
            top
            color="deep-purple accent-4"
        ></v-progress-linear>
        <v-form ref="form" v-model="is_valid">
            <v-container fluid v-if="article">
                <v-row dense class="mt-5">
                    <v-col cols="12">
                        <v-text-field
                            v-model="article.title"
                            required
                            :rules="requiredRules"
                            label="Заголовок статьи"
                            maxlength="255"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense class="mt-5">
                    <v-col cols="12">
                        <v-text-field
                            v-model="article.url"
                            required
                            :rules="requiredRules"
                            label="Адрес на сайте"
                            maxlength="255"
                        >
                            <template v-slot:append>
                                <v-btn @click="urlFromTitle" text>Из заголовка</v-btn>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row dense class="mt-5">
                    <v-col cols="12">
                        <label>Содержимое статьи</label>
                        <vue-editor
                            v-model="article.content"
                            class="mt-1"
                        ></vue-editor>
                    </v-col>
                </v-row>
                <v-row dense class="mt-5">
                    <v-col cols="12">
                        <!-- <label>Загрузка фото</label> -->
                        <Upload v-model="article.photo"
                                :api_url="`${baseAppUrl}/api/upload-photo?folder=articles`"
                        />
                    </v-col>
                </v-row>
                <v-row dense class="mt-5">
                    <v-col cols="12">
                        <Tags v-if="tags"
                              v-model="article.tags"
                              label="Теги к статье"
                              :tags="tags"
                        />
                    </v-col>
                </v-row>
                <v-row dense class="mt-5">
                    <v-col cols="12">
                        <Tags v-if="tags"
                              v-model="article.keywords"
                              label="Ключевые слова (SEO)"
                              :tags="tags"
                        />
                    </v-col>
                </v-row>
                <v-row dense class="mt-5">
                    <v-col cols="12">
                        <v-textarea
                            outlined
                            class="mt-1"
                            name="input-7-1"
                            label="Описание для поисковиков (SEO)"
                            v-model="article.description"
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-row dense class="mt-5">
                    <v-col>
                        <v-switch v-model="article.show_in_top"
                                  label="Показывать в верхнем блоке главной страницы"
                        >

                        </v-switch>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-switch v-model="article.show_in_feed"
                                  label="Показывать в основной ленте на сайте"
                        >

                        </v-switch>
                        <small v-if="!article.show_in_feed"><em>
                            * Страница не будет отображаться в ленте новостей. Вы можете например привязать её к одному из пунктов меню.    
                        </em></small>
                    </v-col>
                </v-row>
                <v-row dense class="mt-5">
                    <v-col cols="12">
                        <v-btn color="success"
                               :disabled="is_saving"
                               :loading="is_saving"
                               @click="save"
                               class="mr-1"
                        >
                            Сохранить изменения
                        </v-btn>
                        <v-btn color="info"
                               @click="back"
                               text
                        >
                            К списку статей
                        </v-btn>
                        <v-btn color="red"
                               @click="removeArticle"
                               v-if="!!article.id"
                               text
                               style="float: right;"
                        >
                            Удалить статью
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import Vue from 'vue'
import {VueEditor} from "vue2-editor";
import Tags from "../../components/article/Tags.vue";
import Upload from "../../components/Upload.vue";
import {transliterate as tr} from 'transliteration';

export default {
    components: {
        VueEditor,
        Tags,
        Upload
    },
    data() {
        return {
            id: null,
            article: null,
            is_loading: true,
            baseAppUrl: null,
            avatarUploadMsg: null,
            save_results: [],
            is_saving: false,
            is_valid: false,
            is_uploading_photo: false,
            is_changed: false,
            tags: null,
            requiredRules: [
                v => !!v.trim() || 'Обязательно для заполнения',
            ],
        };
    },
    methods: {
        load() {
            this.is_loading = true
            this.$store.$app.$socket.client.emit('admin_get_article', {id: this.id}, response => {
                this.article = response.article
                this.article.tags = this.article.tags.map(item => item.word)
                this.tags = response.tags
          this.is_loading = false
                Vue.nextTick(() => {
                    this.is_changed = false
                })
            });
        },
        create() {
            this.article = {
                id: null,
                title: '',
                url: '',
                content: '',
                photo: '',
                keywords: [],
                tags: [],
                description: '',
                views_count: 0,
                show_in_top: false,
                show_in_feed: true,
            }
            this.is_loading = false
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
        save() {
            this.$refs.form.validate()

            if (!this.is_valid) {
                alert('Не заполнены обязательные поля')
                return false
            }

            this.is_saving = true
            this.$store.$app.$socket.client.emit('admin_save_article', this.article, response => {
                this.article.id = this.id
                this.is_saving = false
                this.avatarUploadMsg = ''
                Vue.nextTick(() => {
                    this.is_changed = false
                })
            });

            return true
        },
        back() {
            if (this.is_changed) {
                if (confirm('Сохранить изменения?')) {
                    if (!this.save()) {
                        return
                    }
                }
            }
            this.$router.push({path: '/admin/blog'})
        },
        removeArticle() {
            if (confirm('Уверены что хотите удалить статью?')) {
                this.$store.$app.$socket.client.emit('admin_remove_article', this.article, response => {
                    Vue.nextTick(() => {
                        this.is_changed = false
                        this.back();
                    })
                });
            }
        },
        urlFromTitle() {
            const re = /['@#&\[\]"#$%^&*()_!^:;'/.,~|\\/><?{}+\-_=]/g;
            this.article.url = tr(this.article.title).replace(re, '').replace(/ /g, '-').toLowerCase()
        }
    },
    mounted() {
        this.id = this.$route.query.id
        if (!!this.id) {
            this.load()
        } else {
            this.create()
        }
        this.baseAppUrl = process.env.VUE_APP_HOST;
    },
    watch: {
        article: {
            handler() {
                this.is_changed = true
            },
            deep: true
        }
    }
}
</script>

<style lang="scss">
.ql-toolbar svg > * {
    stroke: #fffb !important;;
}

.ql-toolbar .ql-picker > span {
    stroke: #fffb !important;
}

.ql-header.ql-picker {
    color: #fffb !important;
}

.ql-image {
    display: none !important;
}
.quillWrapper .ql-snow.ql-toolbar{
    position: sticky;
    top: 65px;
    background: #000;
    z-index: 1;
}
</style>
