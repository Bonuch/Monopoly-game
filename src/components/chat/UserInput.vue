<template>
    <div class="input-area">
        <textarea class="input"
            tabIndex="0"
            @keydown="onInputKeyDown"
            :placeholder="placeholder"
            ref="inputMessage"
            v-model="messageText"
        ></textarea>
        <div class="buttons">
            <a v-if="commonChat" href="#" :title="$t('CONTACTS.Отправить изображение')" class="send-image" @click.prevent="attachImage"></a>
            <a href="#" :title="$t('CONTACTS.Смайлы')" class="insert-smile" @click.prevent="emojiOpened = true"></a>
            <a href="#" :title="$t('CONTACTS.Отправить (Enter)')" class="send-text" @click.prevent="sendMessage"></a>
        </div>
        <EmojiPicker v-if="emojiOpened" :onEmojiPicked="onEmojiPicked" :onBlur="() => emojiOpened = false"/>
    </div>
</template>


<script>
    import EmojiPicker from './EmojiPicker/EmojiPicker.vue';
    import IconCross from "./components/icons/IconCross.vue";
    import IconOk from "./components/icons/IconOk.vue";
    import IconSend from "./components/icons/IconSend.vue";
    import { mapGetters } from 'vuex';

    export default {
        components: {
            EmojiPicker,
            IconCross,
            IconOk,
            IconSend
        },
        props: {
            icons: {
                type: Object,
                required: false,
                default: function () {
                    return {}
                }
            },
            onSubmit: {
                type: Function,
                required: true
            },
            placeholder: {
                type: String,
                default: 'Write a reply'
            },
            commonChat: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                emojiOpened: false,
                messageText: '',
            }
        },
        methods: {
            onInputKeyDown(e) {
                if (e.keyCode && e.keyCode === 13) {
                    this.sendMessage();
                    e.preventDefault();
                } else if (e.keyCode && e.keyCode === 27) {
                    this.messageText = '';
                    e.preventDefault();
                }
            },

            sendMessage() {
                const text = this.messageText;
                if (text.split(' ').join('') !== '') {
                    this.messageText = '';
                    this.onSubmit({
                        author: 'me',
                        type: 'text',
                        data: { text }
                    });
                }
            },

            attachImage() {
                console.log('attachImage');
            },

            onEmojiPicked(emoji) {
                const text = this.messageText;
                if (text.split(' ').join('') !== '') {
                    const caretPosition = this.$refs.inputMessage.selectionStart;
                    const start = text.substring(0, caretPosition);
                    const end = text.substring(caretPosition, text.length);
                    this.messageText = start + ' ' + emoji + ' ' + end;
                } else {
                    this.onSubmit({
                        author: 'me',
                        type: 'emoji',
                        data: { emoji }
                    })
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .input-area {
        //position: absolute;
        //bottom: 78px;
        left: 0;
        right: 0;
        height: 32px;
        z-index: 100;
        position: relative;

        .ban-message {
            height: 40px;
            text-align: center;
            background: #fbd6d6;
            line-height: 40px;
            border-radius: 4px;
        }
        .input {
            width: 100%;
            border: none;
            border-radius: 100px;
            height: 40px;
            padding: 10px 84px 0 20px;
            outline: none;
            overflow: hidden;
            resize: none;
            box-sizing: border-box;
            background: #24202C;
            color: #fff;
            font-size: 17px;
            font-family: 'SF UI Display', 'Noto Color Emoji', 'sans-serif';
            &::placeholder {
                color: #999;
                font-size: 17px;
                font-weight: 700;
                @media (max-width: 1415px) {
                    font-size: 12px;
                }
            }
        }
        .buttons {
            position: absolute;
            top: 11px;
            right: 10px;

            a {
                display: inline-block;
                height: 16px;
                margin-left: 10px;
            }
            .send-image {
                background: url(/design/icons/send-image.svg) center center no-repeat;
                background-size: contain;
                width: 16px;
            }
            .insert-smile {
                background: url(/design/icons/smile.svg) center center no-repeat;
                background-size: contain;
                width: 16px;
            }
            .send-text {
                background: url(/design/icons/send.svg) center center no-repeat;
                background-size: contain;
                width: 16px * (18px / 14px);
            }
        }
    }
</style>
