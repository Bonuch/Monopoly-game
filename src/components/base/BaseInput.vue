<template>
    <div class="base-input" :class="groupSelectors">
        <label
            v-if="label"
            :for="id"
            class="base-input__label"
            :class="labelSelectors"
        >
            {{ label }}
        </label>

        <input
            :id="id"
            class="base-input__input"
            :class="[inputSelectors, {'base-input__input--error': error}]"
            v-bind="$attrs"
            @input="updateValue"
            :value="value"
            v-on="listeners"
        >
    </div>
</template>

<script>
    export default {
        name: 'BaseInput',
        props: {
            label: {
                type: String,
                default: null
            },
            id: String,
            groupSelectors: [String, Array, Object],
            labelSelectors: [String, Array, Object],
            inputSelectors: [String, Array, Object],
            error: {
                type: Boolean,
                default: false,
            },
            value: [String, Number],
        },
        inheritAttrs: false,
        methods: {
            updateValue(event) {
                this.$emit('input', event.target.value)
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
    * {
        box-sizing: border-box;
    }

    .base-input {
        &__input,
        &__input::placeholder,
        &__label {
            color: var(--color-gray-200);
            font-weight: 600;
            font-size: 18px;
        }

        &__input {
            display: block;
            width: 100%;
            background-color: transparent;
            border: 0;
            border-bottom: 1px solid var(--color-purple);
            outline: none;
            transition: all 0.3s ease;

            &:hover,
            &:focus,
            &:active {

            }

            &--error {
                border-color: var(--color-danger);
            }
        }
    }
</style>
