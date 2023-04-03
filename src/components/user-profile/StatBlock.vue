<template>
    <div class="stat__block">
        <h4 class="block__label">{{ $t('KNOWLEDGE.' + cards.label) }}</h4>
        <div v-if="cards.type === 'economy'">
            <table class="stat__table">
                <thead>
                <th></th>
                <th>{{ $t("USER_STATS.Уровень")}}</th>
                <th class="w-50 tar">{{ $t("USER_STATS.Бонус")}}</th>
                </thead>
                <tbody>
                <tr v-for="row in cards.cards.A">
                    <td class="stat__name"><span class="text-shadow">{{ $t("KNOWLEDGE." + row.name) }}</span></td>
                    <td class="stat__level"><span class="text-shadow">{{ row.level }}</span></td>
                    <td class="w-50 tar" v-if="row.upgrade_value1"><span class="text-shadow">{{ $t("KNOWLEDGE." + deleteChars(row.upgrade_value1_title)) }}:
                        +{{ row.upgrade_value1 }}%</span>
                    </td>

                </tr>
                </tbody>
            </table>
            <table class="stat__table">
                <thead>
                <th></th>
                <th></th>
                <th class="tar" style="width: 33%">{{ $t("USER_STATS.Вместимость") }}</th>
                <th class="tar">{{ $t("USER_STATS.Производство в час")}}</th>
                </thead>
                <tbody>
                <tr v-for="row in cards.cards.B">
                    <td class="stat__name"><span class="text-shadow">{{ $t("KNOWLEDGE." + row.name) }}</span></td>
                    <td class="stat__level"><span class="text-shadow">{{ row.level }}</span></td>
                    <td class="tar" v-if="row.upgrade_value1"><span class="text-shadow">{{ row.upgrade_value1 }}</span></td>
                    <td class="tar" v-if="row.upgrade_value2"><span class="text-shadow">{{ row.upgrade_value2 }}</span></td>
                </tr>
                </tbody>
            </table>
            <table class="stat__table">
                <thead>
                <th></th>
                <th></th>
                <th class="tar">{{ $t("USER_STATS.Увеличение вместимости") }}</th>
                </thead>
                <tbody>
                <tr v-for="row in cards.cards.C">
                    <td class="stat__name"><span class="text-shadow">{{ $t("KNOWLEDGE." + row.name) }}</span></td>
                    <td class="stat__level"><span class="text-shadow">{{ row.level }}</span></td>
                    <td class="tar" v-if="row.upgrade_value1"><span class="text-shadow">+{{ row.upgrade_value1 }}%</span></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div v-if="cards.type === 'battle'">
            <table class="stat__table" v-if="cards.cards.A">
                <thead>
                <th></th>
                <th>{{ $t("USER_STATS.Уровень")}}</th>
                <th class="w-50 tar">{{ $t("USER_STATS.Бонус")}}</th>
                </thead>
                <tbody>
                <tr v-for="row in cards.cards.A" :key="row.name">
                    <td class="stat__name"><span class="text-shadow">{{ $t("KNOWLEDGE." + row.name) }}</span></td>
                    <td class="stat__level"><span class="text-shadow">{{ row.level }}</span></td>
                    <td class="w-50 tar" v-if="row.upgrade_value1"><span class="text-shadow">{{ row.upgrade_value1 }}</span></td>
                </tr>
                </tbody>
            </table>

            <table class="stat__table" v-if="cards.cards.B">
                <thead>
                <th></th>
                <th>{{ $t("USER_STATS.Уровень")}}</th>
                <th class="w-50 tar">{{ $t("USER_STATS.Бонус")}}</th>
                </thead>
                <tbody>
                <tr v-for="row in cards.cards.B" :key="row.name">
                    <td class="stat__name"><span class="text-shadow">{{ $t("KNOWLEDGE." + row.name) }}</span></td>
                    <td class="stat__level"><span class="text-shadow">{{ row.level }}</span></td>
                    <td class="w-50 tar" v-if="row.upgrade_value1"><span class="text-shadow">+{{ row.upgrade_value1 }}%</span></td>
                </tr>
                </tbody>
            </table>

            <table class="stat__table" v-if="cards.cards.C">
                <thead>
                <th></th>
                <th>{{ $t("USER_STATS.Уровень")}}</th>
                <th class="w-50 tar">{{ $t("USER_STATS.Бонус")}}</th>
                </thead>
                <tbody>
                <tr v-for="row in cards.cards.C" :key="row.name">
                    <td class="stat__name"><span class="text-shadow">{{ $t("KNOWLEDGE." + row.name) }}</span></td>
                    <td class="stat__level"><span class="text-shadow">{{ row.level }}</span></td>
                    <td class="w-50 tar" v-if="row.upgrade_value1"><span class="text-shadow">+{{ row.upgrade_value1 }}%</span></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div v-if="cards.type === 'protection'">
            <table class="stat__table" v-if="cards.cards.C">
                <thead>
                <th></th>
                <th>{{ $t("USER_STATS.Уровень")}}</th>
                <th class="w-50 tar">{{ $t("USER_STATS.Бонус")}}</th>
                </thead>
                <tbody>
                <tr v-for="row in cards.cards.C" :key="row.name">
                    <td class="stat__name"><span class="text-shadow">{{ $t("KNOWLEDGE." + row.name) }}</span></td>
                    <td class="stat__level"><span class="text-shadow">{{ row.level }}</span></td>
                    <td class="w-50 tar" v-if="row.upgrade_value1"><span class="text-shadow">+{{ row.upgrade_value1 }}%</span></td>
                </tr>
                </tbody>
            </table>

            <table class="stat__table" v-if="cards.cards.B">
                <thead>
                <th></th>
                <th>{{ $t("USER_STATS.Уровень")}}</th>
                <th class="w-50 tar">{{ $t("USER_STATS.Бонус")}}</th>
                </thead>
                <tbody>
                <tr v-for="row in cards.cards.B" :key="row.name">
                    <td class="stat__name"><span class="text-shadow">{{ $t("KNOWLEDGE." + row.name) }}</span></td>
                    <td class="stat__level"><span class="text-shadow">{{ row.level }}</span></td>
                    <td class="w-50 tar" v-if="row.upgrade_value1"><span class="text-shadow">-{{ row.upgrade_value1 }}%</span></td>
                </tr>
                </tbody>
            </table>

            <table class="stat__table" v-if="cards.cards.A">
                <thead>
                <th></th>
                <th>{{ $t("USER_STATS.Уровень")}}</th>
                <th class="w-50 tar">{{ $t("USER_STATS.Бонус")}}</th>
                </thead>
                <tbody>
                <tr v-for="row in cards.cards.A" :key="row.name">
                    <td class="stat__name"><span class="text-shadow">{{ $t("KNOWLEDGE." + row.name) }}</span></td>
                    <td class="stat__level"><span class="text-shadow">{{ row.level }}</span></td>
                    <td class="w-50 tar" v-if="row.upgrade_value1"><span class="text-shadow">-{{ row.upgrade_value1 }}%</span></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: "StatBlock",
    props: ["cards"],
    filters: {
        charFilt(value) {
            return value.replace("%", "");
        },
    },
    computed: {
        formattedCards() {
            const res = { ...this.cards };
            console.log(this.cards);
            for (const item of this.cards.cards) {
                if (res[item.group_type]) {
                    res[item.group_type].add(item.upgrade_value1_title, item.upgrade_value2_title);
                } else {
                    res[item.group_type] = new Set([item.upgrade_value1_title, item.upgrade_value2_title]);
                }
                res[item.group_type].delete(undefined);
            }
            console.log("----res----", res);
            return [];
        },
    },
    methods: {
        deleteChars(value) {return value.replace("%", "").trim();}
    }
};
</script>

<style scoped lang="scss">
.text-shadow {
    text-shadow: 0px 7px 7px rgba(#000000, .25);
}
.block__label {
    font-size: 24px;
    margin: 15px 0;
    text-align: left;
    text-transform: capitalize;
}
.stat {
    &__table {
        width: 100%;
        //table-layout: fixed;
        font-size: 18px;
        font-weight: 600;

        //td {
        //    text-align: left;
        //}
        th {
            padding: 10px 0;
            font-size: 14px;
            color: var(--color-gray-medium);
        }
        td {
            padding: 5px 0;
        }
        .w-50 {
            width: 50%;
        }

        .tar {
            text-align: right;
        }
    }

    &__name {
        text-align: left;
        width: 40%;
    }

    &__level {
        width: 10%;
    }
}
</style>
