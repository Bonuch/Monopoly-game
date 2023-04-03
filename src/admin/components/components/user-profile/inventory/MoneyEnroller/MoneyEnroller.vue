<template>
    <v-form v-model="is_money_valid" ref="dialogForm">
        <v-card>
            <v-card-title class="headline">
                        <span v-if="operationType === 'give'" class="primary--text">
                            Начисление денег
                        </span>
                <span v-else class="red--text">Изъятие денег</span>
            </v-card-title>
            <v-card-text>
                <p v-if="operationType === 'give'">Дать пользователю «{{ user.name }}»
                    денег?</p>
                <p v-else>Забрать деньги у пользователя «{{ user.name }}»?</p>
                <v-radio-group label="Укажите валюту:" v-model="selected_currency" column>
                    <v-radio v-for="currency in currencies"
                             :key="currency.name"
                             :value="currency"
                    >
                        <template v-slot:label>
                            <v-icon>{{ currency.icon }}</v-icon>
                            &nbsp;
                            {{ currency.title }}
                        </template>
                    </v-radio>
                    <div v-if="selected_currency && selected_currency.name === 'shines'">
                        <div class="shine__form">
                            <div class="shine__item" v-for="shine in selected_currency.shine_list">
                                <p>{{ shine.title }}
                                    <v-text-field
                                        label="количество"
                                        v-model="shine_values[`${shine.name}`]"
                                        :rules="money_rules"
                                        hide-details="auto"
                                    ></v-text-field>
                                </p>
                            </div>
                        </div>
                    </div>
                </v-radio-group>
                <v-text-field
                    v-if="selected_currency && selected_currency.name !== 'shines'"
                    label="Сумма"
                    v-model="money_value"
                    :rules="money_rules"
                    type="number"
                    hide-details="auto"
                ></v-text-field>
                <a @click="takeAllMoney" v-if="operationType === 'take'">Забрать
                    всё!</a>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :disabled="is_money_pocessing" color="warning darken-1" @click="$emit('decline')">
                    Отмена
                </v-btn>
                <v-btn :loading="is_money_pocessing" color="green darken-1" @click="changeMoney">
                    Подтвердить
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>
export default {
    name: "MoneyEnroller",
    props: {
        operationType: String,
        user: Object,
    },
    data() {
        return {
            is_money_pocessing: false,
            selected_currency: null,
            is_money_valid: true,
            shine_values: {
                shine1: null,
                shine2: null,
                shine3: null,
                shine4: null,
                shine5: null,
            },
            money_value: 100,
            money_rules: [
                value => parseInt(value) > 0 || "Должна быть положительным целым чистом"
            ],

            currencies: [
                { name: "balance_bucks", title: "Доллар", icon: "fa-dollar" },
                {
                    name: "shines", title: "Сияния", icon: "fa-btc", shine_list: [
                        { name: "shine1", title: "Сияние 1" },
                        { name: "shine2", title: "Сияние 2" },
                        { name: "shine3", title: "Сияние 3" },
                        { name: "shine4", title: "Сияние 4" },
                        { name: "shine5", title: "Сияние 5" },
                    ],
                },
            ],
        };
    },
    methods: {
        takeAllMoney() {
            if (this.selected_currency.name == "balance_bucks") {
                this.money_value = this.user.UserBalance.balance_bucks;
            }
            if (this.selected_currency.name == "shines") {
                for (const key of Object.keys(this.shine_values)) {
                    this.shine_values[key] = this.user.UserBalance[key]
                }
            }
        },
        hideMoneyDialog() {
            this.is_money_dialog = false;
        },
        async changeMoney() {
            if (this.$refs.dialogForm.validate()) {
                this.is_money_pocessing = true;
                const options = {
                    user_uuid: this.user.uuid,
                    currency: this.selected_currency.name,
                    action: this.operationType,
                    value: this.selected_currency.name === 'shines' ? this.shine_values : this.money_value
                    // money: this.operationType == "give" ?
                    //     parseInt(this.money_value) : -parseInt(this.money_value),
                };
                await this.$store.$app.$socket.client.emit("admin_change_money", options, response => {
                    if (response.success) {
                        this.is_money_pocessing = false;
                        this.$emit('saved')
                    }
                });
            }
        },
    },
};
</script>

<style scoped>

</style>
