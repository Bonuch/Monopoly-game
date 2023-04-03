<template>
    <div class="btn-container">
        <button
            v-on="$listeners"
            v-bind="$attrs"
            class="btn"
            :class="buttonClass"
        >
            <slot/>
        </button>
    </div>
</template>

<script>
    export default {
        name: 'BaseButton',
        inheritAttrs: false,
        props: {
            buttonClass: {
                type: String
            }
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .btn {
        display: inline-block;
        padding: 6px 25px 9px;
        background-color: var(--color-gray-100);
        color: #000;
        text-align: center;
        font-weight: 600;
        font-size: 20px;
        border: 0;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover,
        &:active,
        &:focus {
            color: var(--color-purple);
        }

        &--transparent {
            background-color: transparent;
            color: var(--color-gray-200);
        }
    }
</style>
