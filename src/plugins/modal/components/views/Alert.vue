<template>
    <div class="modal" :class="colorSchema">
        <div class="message">
            {{ message }}
        </div>
        <div class="button-wrapper">
            <button type="button" @click="acceptModal()">{{ okBtnText }}</button>
        </div>
    </div>
</template>

<script>
import DialogMixin from "../../js/mixins/dialog-mixin";

export default {
    mixins: [DialogMixin]
};
</script>

<style lang="scss" scoped>
    .modal {
        position: absolute;
        top: 50%;
        right: 50%;
        transform: translate(50%,-50%);
        height: 140px;
        width: 300px;
        border-radius: 12px;
        z-index: 9999;

        &.bright {
            color: #2c3e50;
            background-color: #fff;
            border: 2px solid #E6E6E6;
        }

        &.dark {
            color: #fff;
            background-color: #323639;
            border: 1px solid #323639;
        }

        .message {
            padding: 20px 10px;
        }

        .button-wrapper {
            width: 100%;
            position: absolute;
            bottom: 10px;

            button {
                display: inline-block;
                background-color: #E9E9E9;
                font-size: 10px;
                width: 80px;
                height: 24px;
                border-radius: 2px;
                color: #000;
                outline: none;
                line-height: 24px;
                text-decoration: none;
            }
        }
    }
</style>
