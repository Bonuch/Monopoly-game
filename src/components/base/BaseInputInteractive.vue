<template>
    <div class="base-input"
         :class="[groupSelectors, {'base-input--disabled': disabled, 'focused': isFocused}]">
        <label
            v-if="label"
            :for="id"
            class="base-input__label"
            :class="[
                labelSelectors,
                {'base-input__label--active': labelActive || value},
                {'base-input__label--focused': isFocused},
            ]"
        >
            {{ label }}
        </label>

        <input
            :id="id"
            class="base-input__input"
            :class="[
                inputSelectors,
                 {'base-input__input--filled': inputFilled || value},
                 {'base-input__input--error': error},
                ]"
            v-bind="$attrs"
            :value="value"
            :disabled="disabled"
            @focus="isFocused = true"
            v-on="listeners"
        >
    </div>
</template>

<script>
export default {
    name: 'BaseInputInteractive',
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
        disabled: Boolean,
    },
    inheritAttrs: false,
    data() {
        return {
            labelActive: null,
            inputFilled: null,
            isFocused: null,
        }
    },
    methods: {
        updateValue(event) {
            this.$emit('input', event.target.value)
        },
        onBlur() {
            this.$emit('blur');
            this.isFocused = false
            if (!this.value) {
                this.labelActive = false
            } else {
                this.inputFilled = true
            }
        },
        onFocus() {
            this.$emit('focus');
            this.labelActive = true
            this.inputFilled = false
        }
    },
    computed: {
        listeners() {
            return {
                ...this.$listeners,
                input: this.updateValue,
                blur: this.onBlur,
                focus: this.onFocus
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.no-absolute-pos {
    position: relative !important;
}

.personal-info {
    label  {
        font-size: 12px;
        color: var(--color-white-50);
    }

    .base-input__label--focused {
        color: var(--color-purple-light);
    }

    input {
    }
}



.personal-info__input {
    margin-top: 10px;
    padding: 0 30px 0 0;
}

@keyframes labelActive {
    from {
        color: #fff;
        font-size: 14px;
        transform: translateY(0);
    }
    to {
        font-size: 12px;
        transform: translateY(-24px);
    }
}



.base-input {
    position: relative;
    box-sizing: border-box;
    transition: .1s;

    & * {
        box-sizing: border-box;
    }
    &.focused {
        border-color: var(--color-purple-light);
    }
    &__input,
    &__input::placeholder,
    &__label {
        color: var(--color-gray-200);
        font-weight: 600;
        font-size: 18px;
        transition: .1s;
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
            border-color: var(--color-green-500);
        }

        &--no-border {
            border-bottom: 0;
        }

        &--border-dark {
            border-bottom: 1px solid #202124;
        }

        &--filled {
            border-color: var(--color-green-500);
        }

        &--error {
            border-bottom-color: var(--color-danger);
        }

        &--disabled {
            pointer-events: none;
            tab-index: -1;
        }
    }

    &__label {
        position: absolute;
        left: 0;

        &--active {
            animation: labelActive 0.3s ease both;
        }
    }
}
</style>
