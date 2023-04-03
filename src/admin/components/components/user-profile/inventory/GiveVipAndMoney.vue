<template>
    <v-row align="center" justify="space-around">

        <v-btn v-if="user.is_vip" @click="showVip" text color="red darken-1">
            <v-icon small>fa-star-half-o</v-icon>&nbsp;
            <span>Забрать VIP</span>
        </v-btn>
        <v-btn v-else @click="showVip" text color="warning">
            <v-icon small>fa-star</v-icon>&nbsp;
            <span>Выдать VIP</span>
        </v-btn>

        <v-btn text color="primary" @click="showMoneyDialog('give')">
            <v-icon small>fa-dollar</v-icon>
            /
            <v-icon small>fa-btc</v-icon>&nbsp;
            Дать денег
        </v-btn>
        <v-btn text color="error" @click="showMoneyDialog('take')">
            <v-icon small>fa-dollar</v-icon>
            /
            <v-icon small>fa-btc</v-icon>&nbsp;
            Забрать деньги
        </v-btn>
        <v-dialog v-model="is_vip_dialog" max-width="390">
            <v-card>
                <v-card-title class="headline">
                    <span v-if="user.is_vip">Лишение VIP статуса</span>
                    <span v-else>Выдать VIP статус</span>
                </v-card-title>
                <v-card-text v-if="user.is_vip">
                    <p>Действительно хотите преждевременно лишить пользователя «{{ user.name }}» VIP статуса?</p>
                    <p v-if="user.vip_finish_time">Текущий статус истекает: {{ cutDatetime(user.vip_finish_time) }}</p>
                </v-card-text>
                <v-card-text v-else>
                    <p>Выдать пользователю «{{ user.name }}» VIP статус?</p>

                    <v-radio-group label="Срок:" v-model="selected_vip_duration" column>
                        <v-radio v-for="duration in vip_durations"
                                 :key="duration.name"
                                 :label="duration.name"
                                 :value="duration"
                        ></v-radio>
                    </v-radio-group>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="is_vip_pocessing" color="warning darken-1" @click="hideVip">
                        Отмена
                    </v-btn>
                    <v-btn :loading="is_vip_pocessing" color="green darken-1" @click="changeVip(!user.is_vip)">
                        Подтвердить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="is_money_dialog" max-width="390">
            <MoneyEnroller :operationType="operationType" :user="user" @decline="hideMoneyDialog" @saved="updateData"/>
        </v-dialog>
    </v-row>
</template>

<script>
import MoneyEnroller from "./MoneyEnroller/MoneyEnroller";
export default {
    components: { MoneyEnroller },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            is_vip_dialog: false,
            is_vip_pocessing: false,
            is_money_valid: true,
            selected_vip_duration: null,
            operationType: null,
            vip_durations: [
                {
                    name: "Неделя",
                    count: 1,
                    period: "week",
                },
                {
                    name: "Месяц",
                    count: 1,
                    period: "month",
                },
            ],
            is_money_dialog: false,
            money_operation_type: null,

            money_operation_types: {
                give: "Дать",
                take: "Забрать",
            },

            currencies: [
                { name: "balance_bucks", title: "Доллар", icon: "fa-dollar" },
                {
                    name: "shines", title: "Сияния", icon: "fa-btc", shine_list: [
                        { name: "shine_1", title: "Сияние 1" },
                        { name: "shine_2", title: "Сияние 2" },
                        { name: "shine_3", title: "Сияние 3" },
                        { name: "shine_4", title: "Сияние 4" },
                        { name: "shine_5", title: "Сияние 5" },
                    ],
                },
                // { name: 'balance_crypto', title: 'Биткоин', icon: 'fa-btc' },
            ],

            selected_currency: null,
            is_money_pocessing: false,
            money_value: 100,
        };
    },
    methods: {
        showVip() {
            if (!this.selected_vip_duration) {
                this.selected_vip_duration = this.vip_durations[0];
            }
            this.is_vip_dialog = true;
        },
        hideVip() {
            this.is_vip_dialog = false;
        },
        cutDatetime(datetime) {
            if (datetime.indexOf("T") > -1) {
                return datetime.substr(0, datetime.indexOf("T"));
            }
            return datetime;
        },
        changeVip(is_giving) {
            this.is_vip_pocessing = true;
            const options = {
                user_uuid: this.user.uuid,
                is_giving: is_giving,
                duration: this.selected_vip_duration,
            };
            this.$store.$app.$socket.client.emit("admin_change_vip", options, response => {
                this.user.is_vip = response.is_vip;
                this.user.vip_finish_time = response.vip_finish_time;
                this.is_vip_pocessing = false;
                this.hideVip();
            });
        },
        showMoneyDialog(operation_type) {
            this.operationType = operation_type;
            // if (!this.selected_currency) {
            //     this.selected_currency = this.currencies[0];
            // }
            this.is_money_dialog = true;
        },
        checkUserMoney() {
            if (this.money_operation_type == this.money_operation_types.give) {
                return true;
            }
            if (this.selected_currency.name == "balance_bucks" &&
                this.user.balance_bucks < parseInt(this.money_value)
            ) {
                return false;
            }
            if (this.selected_currency.name == "balance_crypto" &&
                this.user.balance_crypto < parseInt(this.money_value)
            ) {
                return false;
            }
            return true;
        },
        takeAllMoney() {
            if (this.selected_currency.name == "balance_bucks") {
                this.money_value = this.user.balance_bucks;
            }
            if (this.selected_currency.name == "balance_crypto") {
                this.money_value = this.user.balance_crypto;
            }
        },
        hideMoneyDialog() {
            this.is_money_dialog = false;
        },
        updateData() {
            this.$emit("update");
            this.is_money_pocessing = false;
            this.hideMoneyDialog();
        },
        changeMoney() {
            if (this.$refs.dialogForm.validate()) {
                this.is_money_pocessing = true;
                const options = {
                    user_uuid: this.user.uuid,
                    currency: this.selected_currency.name,
                    money: this.money_operation_type == this.money_operation_types.give ?
                        parseInt(this.money_value) : -parseInt(this.money_value),
                };
                this.$store.$app.$socket.client.emit("admin_change_money", options, response => {
                    this.$emit("update");
                    this.is_money_pocessing = false;
                    this.hideMoneyDialog();
                });
            }
        },
    },
};
</script>
