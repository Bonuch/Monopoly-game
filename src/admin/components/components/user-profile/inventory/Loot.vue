<template>
    <v-container>
        <v-card-title style="justify-content: space-between;">
            Лутбоксы (открываемые предметы):
            <v-btn text color="primary" @click="openLootDialog">
                <v-icon small>fa-plus</v-icon>&nbsp;
                Дать лутбокс
            </v-btn>
        </v-card-title>
        <v-progress-linear
            :active="!user_loot"
            :indeterminate="!user_loot"
            top
            color="deep-purple accent-4"
        ></v-progress-linear>

        <v-row v-if="user_loot">
            <v-col v-for="loot in user_loot" cols="12" md="4">
                <v-card>
                    <v-list>
                        <v-list-item two-line>
                            <v-list-item-icon>
                                <v-avatar color="#455A6455">
                                    <img :src="loot.image" style="padding: 10px; border-radius: 0;">
                                </v-avatar>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title style="margin-bottom: 5px;">
                                    <v-icon small>fa-cube</v-icon>
                                    x {{ loot.total_count }} шт
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ loot.title }}
                                    <!--                                    <small>({{ loot.opened_count }} открыто)</small>-->
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="is_loot_dialog" max-width="390">
            <v-card>
                <v-card-title class="headline">
                    <span>Раздача лутбоксов</span>
                </v-card-title>
                <v-card-text v-if="user_loot">
                    <v-form v-model="dialog.is_valid" ref="dialogForm">
                        <p>Пользователю «{{ user.name }}»</p>

                        <v-radio-group v-model="dialog.operation_type" column>
                            <v-radio label="Дать" :value="OPERATION_TYPES.give"></v-radio>
                            <v-radio label="Забрать" :value="OPERATION_TYPES.take"></v-radio>
                        </v-radio-group>

                        <v-radio-group label="Предмет:" v-model="dialog.loot_box_type"
                                       v-if="dialog.operation_type === 1" column>
                            <v-radio v-for="loot_category in available_loot"
                                     :key="loot_category.item_id"
                                     :label="loot_category.title"
                                     :title="loot_category.description"
                                     :value="loot_category"
                            ></v-radio>
                        </v-radio-group>

                        <div v-if="!dialog.loot_box_type && !(user_loot.length > 0)">
                            Предметы отсутствуют
                        </div>
                        <div v-else>
                            <v-radio-group label="Предмет:" v-model="dialog.loot_box_type"
                                           v-if="dialog.operation_type === 2 && user_loot.length > 0" column>
                                <v-radio v-for="loot_category in user_loot"
                                         :key="loot_category.item_id"
                                         :label="loot_category.title"
                                         :title="loot_category.description"
                                         :value="loot_category"
                                ></v-radio>
                            </v-radio-group>
                        </div>

                        <v-text-field
                            v-if="dialog.loot_box_type"
                            label="Количество: "
                            v-model="dialog.count"
                            :rules="loot_rules"
                            hide-details="auto"
                        ></v-text-field>
                    </v-form>

                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="is_change_pocessing" color="warning darken-1" @click="closeLootDialog()">
                        Отмена
                    </v-btn>
                    <v-btn :loading="is_change_pocessing" :disabled="!dialog.loot_box_type" color="green darken-1" @click="changeLoot()">
                        Подтвердить
                    </v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
export default {
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            user_loot: null,
            is_loot_dialog: false,
            is_change_pocessing: false,
            available_loot: null,
            OPERATION_TYPES: {
                give: 1,    //"Дать",
                take: 2,    //"Забрать",
            },
            dialog: {
                operation_type: null,
                loot_box_type: null,
                count: 1,
                is_valid: true,
            },
            loot_rules: [
                value => parseInt(value) > 0 || "Должно быть положительным целым чистом",
                value => this.checkUserLoot() || "Не может быть больше имеющигося у пользователя количества",
            ],

        };
    },
    methods: {
        loadUserLoot() {
            this.$store.$app.$socket.client.emit("admin_get_user_loot", this.user.uuid, response => {
                console.log("response", response);
                this.user_loot = response.loot;
                this.available_loot = response.available_loot;
            });
        },
        checkUserLoot() {
            if (this.dialog.operation_type == this.OPERATION_TYPES.give) {
                return true;
            }
            for (let i = 0; i < this.user_loot.length; i++) {
                if (this.dialog.loot_box_type.total_count < parseInt(this.dialog.count)) {
                    return false;
                }
            }
            return true;
        },
        openLootDialog() {
            if (!this.dialog.operation_type) {
                this.dialog.operation_type = this.OPERATION_TYPES.give;
            }
            if (!this.dialog.loot_box_type) {
                this.dialog.loot_box_type = this.user_loot[0] ? this.user_loot[0].type : null;
            }
            this.is_loot_dialog = true;
            this.is_change_pocessing = false;
        },
        closeLootDialog() {
            this.is_loot_dialog = false;
        },
        changeLoot() {
            if (this.$refs.dialogForm.validate()) {
                this.is_change_pocessing = true;
                const options = {
                    user_id: parseInt(this.user.id),
                    count: parseInt(this.dialog.count),
                    item: this.dialog.loot_box_type,
                    operation_type: parseInt(this.dialog.operation_type),
                };
                // const options = {
                //     user_uuid: this.user_uuid,
                //     type: this.dialog.loot_box_type,
                //     count: this.dialog.operation_type == this.OPERATION_TYPES.give ?
                //         parseInt(this.dialog.count) : -parseInt(this.dialog.count),
                // };

                this.$store.$app.$socket.client.emit("admin_change_user_loot", options, response => {
                    console.log(response);
                    this.is_change_pocessing = false;
                    this.loadUserLoot();
                });
            }
        },
    },
    mounted() {
        this.loadUserLoot();
    },
};
</script>
