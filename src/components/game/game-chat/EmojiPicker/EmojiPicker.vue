<template>
    <div class="sc-emoji-picker"
        tabIndex="0"
        @blur="onBlur"
        ref="domNode">
        <div class="sc-emoji-picker--content">
            <div v-for="category in emojiData" class="sc-emoji-picker--category" :key="category.name">
                <div class="sc-emoji-picker--category-title">{{category.name}}</div>
                <span class="sc-emoji-picker--emoji"
                    v-for="emoji in category.emojis"
                    :key="emoji"
                    @click="emojiClicked(emoji)">
                    {{emoji}}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import EmojiConvertor from 'emoji-js';
    import emojiData from './emojies';

    export default {
        data() {
            return {
                emojiData,
                emojiConvertor: new EmojiConvertor()
            }
        },
        props: {
            onBlur: {
                type: Function,
                required: true
            },
            onEmojiPicked: {
                type: Function,
                required: true
            }
        },
        methods: {
            emojiClicked(emoji) {
                this.onEmojiPicked(emoji);
                this.$refs.domNode.blur();
            }
        },
        mounted() {
            const elem = this.$refs.domNode;
            elem.style.opacity = 0;
            window.requestAnimationFrame(() => {
                elem.style.transition = 'opacity 350ms';
                elem.style.opacity = 1
            });
            this.$refs.domNode.focus();
            this.emojiConvertor.init_env();
        }
    }
</script>

<style scoped lang="scss">
    .sc-emoji-picker {
        position: absolute;
        bottom: 40px;
        right: -5px;
        width: 270px;
        padding: 2px;
        max-height: 280px;
        -webkit-box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.4);
        -moz-box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.4);
        box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.4);
        background: #fff;
        border-radius: 3px;
        outline: none;

        &:after {
            content: "";
            width: 14px;
            height: 14px;
            background: white;
            position: absolute;
            bottom: -6px;
            right: 50px;
            transform: rotate(45deg);
            border-radius: 2px;
            -webkit-box-shadow: 2px 2px 2px 0px rgba(0,0,0,0.3);
            -moz-box-shadow: 2px 2px 2px 0px rgba(0,0,0,0.3);
            box-shadow: 2px 2px 2px 0px rgba(0,0,0,0.3);
        }
        .sc-emoji-picker--content {
            overflow: auto;
            overflow-x: hidden;
            width: 100%;
            max-height: 265px;
            box-sizing: border-box;

            .sc-emoji-picker--category {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                .sc-emoji-picker--category-title {
                    width: 100%;
                    color: #000;
                    font-weight: 200;
                    font-size: 13px;
                    margin: 6px 0 4px 8px;
                    letter-spacing: 1px;
                    font-weight: 400;
                }
                .sc-emoji-picker--emoji {
                    font-family: 'SF UI Display', 'Noto Color Emoji', 'sans-serif';
                    color: #8D8B8B;
                    margin: 5px;
                    width: 25px;
                    line-height: 30px;
                    text-align: center;
                    cursor: pointer;
                    vertical-align: middle;
                    font-size: 28px;
                    transition: transform 60ms ease-out, -webkit-transform 60ms ease-out;
                }

                .sc-emoji-picker--emoji:hover {
                    transform: scale(1.4);
                }
            }
        }
    }
</style>
