<template>
    <div class="message-list" ref="scrollList" @scroll="loadOnScrollTop()">
        <div
            class="scroll"
        >
            <button v-if="haveNewMessage" key="loadOldMessages" @click="loadOldMessages()" class="more__message">ЕЩЕ
            </button>
            <Message v-for="(message, idx) in messages"
                     :message="message"
                     :user="message.user"
                     :key="idx">
                <template v-slot:user-avatar="scopedProps">
                    <slot name="user-avatar" :user="scopedProps.user" :message="scopedProps.message"></slot>
                </template>

                <template v-slot:text-message-body="scopedProps">
                    <slot name="text-message-body" :message="scopedProps.message" :messageText="scopedProps.messageText"
                          :messageColors="scopedProps.messageColors" :me="scopedProps.me">
                    </slot>
                </template>

                <template v-slot:text-message-toolbox="scopedProps">
                    <slot name="text-message-toolbox" :message="scopedProps.message" :me="scopedProps.me"></slot>
                </template>
            </Message>
<!--            <div class="message-date-group"><span>Today</span></div>-->
        </div>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import Message from './Message.vue';

export default {
    name: 'MessageList',
    components: {
        Message
    },
    props: {
        alwaysScrollToBottom: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            previousSender: null,
            scroll: null,
            scrollPos: null,
            a: false,
            scroll_height: 0,
            scrollTimeout: null,

        }
    },
    computed: {
        ...mapGetters([
            'currentUser',
            'messages',
            'chatParticipants',
            'haveNewMessage'
        ])
    },
    // async created() {
    //     await this.setChatHistory()
    // },
    async mounted() {
        try {
            await this.setChatHistory()
            this.scrollDown()
            this.scroll = this.$refs.scrollList
        } catch (e) {

        }
        // console.log("before scroll mount")
        // console.log("1", this.$refs.scrollList.scrollHeight, this.$refs.scrollList.clientHeight)
        // // this.scrollDown()
        // console.log("after scroll mount")
    },
    updated() {
        this.scrollDown(true);
    },
    methods: {
        ...mapActions([
            'fetchOldCommonMessages',
            'setChatHistory'
        ]),
        userScroll(evt) {
            // console.log(evt)
        },
        setScroll(height=0){
            this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight - height
            this.scroll_height = 0;
            this.a = false;
        },
        scrollDown(smart = false) {
            const $scroll = this.$refs.scrollList;
            // console.log($scroll, ($scroll.scrollHeight - $scroll.scrollTop - $scroll.offsetHeight))
            // console.log("ofset heigth")
            if (this.a) {
                this.setScroll(this.scroll_height)
                return;
            }
            if (smart && ($scroll.scrollHeight - $scroll.scrollTop - $scroll.offsetHeight) > 500) {
                return;
            }
            // console.log('SCROLL SMART FALSE')
            // this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight - this.scroll_height
            this.setScroll()
            // console.log("CURRENT SCROLL HEIGHT!", $scroll.scrollHeight)
        },
        profile(author) {
            const profile = this.chatParticipants.find(profile => profile.id === author);
            return profile || {imageUrl: '', name: ''}
        },
        loadOnScrollTop() {
            this.scroll_height = this.$refs.scrollList.scrollTop;
            // console.log("SCROLL TOP", this.scroll.scrollTop)
            clearTimeout(this.scrollTimeout)
            this.scrollTimeout = setTimeout(() => {
                if (this.scroll.scrollTop < 500) {
                    this.loadOldMessages()
                }
            }, 300)
        },
        async loadOldMessages() {
            try {
                this.scroll_height = this.$refs.scrollList.scrollHeight - this.$refs.scrollList.scrollTop
                await this.fetchOldCommonMessages(this.messages[0].date)
                this.a = true
            } catch (e) {

            }
        },
    }
}
</script>

<style scoped lang="scss">
.more__message {
    padding: 5px 15px;
    background: #5c6367;
    border-radius: 10px;
    color: #fff;
}

.message-date-group {
    color: #fff;
    text-transform: uppercase;
    font-size: 12px;
    padding: 15px 5px;
    margin-bottom: 5px;
}

.message-list {
    box-sizing: border-box;
    height: calc(100% - 40px);
    width: 100%;
    background-color: #323639;
    overflow: auto;
    scrollbar-width: none;
    font-size: 17px;
    height: calc(100% - 40px);

    &:hover {
        scrollbar-width: thin;
        scrollbar-color: #585858 #454545;
    }

    &::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: #454545;
    }
    &::-webkit-scrollbar {
        width: 9px;
        background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #585858;
    }
}
</style>
