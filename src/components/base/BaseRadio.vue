<template>
    <div class="base-radio" :class="groupSelectors">
        <input
            type="radio"
            :id="id"
            class="base-radio__input"
            v-bind="$attrs"
            :value="value"
            :radio-value="radioValue"
            v-on="listeners"
        >

        <label
            :for="id"
            class="base-radio__label transition-03"
            :class="[
                labelSelectors,
                {'base-radio__label--active': value === radioValue}
            ]"
        >
            {{ label }}
        </label>
    </div>

</template>

<script>
export default {
    name: "BaseRadio",
    props: {
        id: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: ''
        },
        value: [String, Number],
        radioValue: [String, Number],
        groupSelectors: [String, Array],
        labelSelectors: [String, Array],
    },
    inheritAttrs: false,
    methods: {
        updateValue(event) {
            this.$emit('input', this.radioValue)
        }
    },
    computed: {
        listeners() {
            return {
                ...this.$listeners,
                input: this.updateValue
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.rounded {
    border-radius: 37px !important;
    padding: 7px 12px;
    margin-right: 10px;
    font-size: 15px !important;
}

.base-radio {
    position: relative;

    &:hover,
    &:focus {
        label {
            color: var(--color-purple);
        }
    }

    &__input {
        display: none;
    }

    &__label {
        //width: 24px;
        //height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        color: #fff;
        font-weight: 600;
        font-size: 20px;
        border: 1px solid var(--color-background);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    &__input &:checked ~ .base-radio__label,
    &__label--active {
        background-color: var(--color-purple-light);
        color: var(--color-white);
        border: 1px solid var(--color-purple-light);
    }
}
</style>
