<template>
    <div class="amount-input">
        <span class="text">{{text}}</span>
        <div class="input-wrap">
            <span class="minus" @click="minus">-</span>
            <input type="number" v-model="count" max="99999">
            <span class="plus" @click="plus()">+</span>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'DealInputAmount',
        props: {
            text: {
              type: String,
              required: true
            },
            maxAmount: {
              type: Number,
              required: true,
            },
            model: {
                required: true
            }
        },
        data() {
            return {
                count: 0,
            }
        },
        components: {

        },
        watch: {
            count(count) {
                if (count < 0) count = 0;
                if (count > this.maxAmount) {
                    count = this.maxAmount;
                }
                this.count = +count;
                this.$emit('update:model', this.count);
            },
            maxAmount(val) {
                if (this.count > val) {
                    this.count = val;
                }
            }
        },
        methods: {
            minus() {
                this.count = +this.count - 100;
            },
            plus() {
                this.count = +this.count + 100;
            }
        }
    }
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    .amount-input {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .text {
            font-weight: 600;
            font-size: 14px;
            display: inline-block;
            padding-right: 5px;
        }
        .input-wrap {
            width: 85px;
            position: relative;
            input {
                text-align: center;
                border: none;
                width: 100%;
                font-weight: 600;
                font-size: 14px;
                background: #dcdcdc;
                border-radius: 3px;
                padding: 3px 20px;
                outline: none !important;
                -moz-appearance:textfield;
                &::-webkit-outer-spin-button,
                &::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            }
            span {
                cursor: pointer;
                position: absolute;
                border: 1px solid #959595;
                border-radius: 3px;
                width: 18px;
                height: 18px;
                font-weight: 600;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                top: 50%;
                margin-top: -9px;
                user-select: none;
                &.minus {
                    left: 2px;
                }
                &.plus {
                    right: 2px;
                }
            }
        }
    }
</style>

