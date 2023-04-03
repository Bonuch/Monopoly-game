<template>
    <div>
        <div class="value__wrapper">
            <v-text-field
                class="value__input"
                style="padding-top: 0px; margin-right: 5px;"
                v-for="(factor, index) in values"
                v-model="values[index]"
                :title="`значение при владении ${index} поля`"
                min="1"
                type="number"
                label="Базовое значение"
                required
                single-line
                hide-details
            ></v-text-field>
        </div>
        <p class="block">Сияния в час за владение:</p>
        <div>
            <ul>
                <li v-for="(factor, index) in values">
                    {{ index }} {{ fieldSuffix(index) }}:
                    {{ baseFactor * values[index] }}
                </li>
            </ul>
        </div>
    </div>

</template>

<script>
export default {
    name: "ShineValues",
    props: {
        values: [Array, null],
        baseFactor: [Number, String, null],
    },
    methods: {
        fieldSuffix(value) {
            if (value === 1) {
                return "полем";
            }
            return "полями";
        },
    },
};
</script>

<style scoped lang="scss">
.value__wrapper {
    display: flex;
}

.value__input {
    width: 50px;
}
</style>
