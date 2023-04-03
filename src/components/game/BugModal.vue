<template>
    <div class="bug__modal">
        <div class="message__container">
            <a href="#" class="close__modal" @click.prevent="$emit('closeBugModal')"><i class="fas fa-times"></i></a>
            <PrivateChat v-if="currentSupport" :inGame="true" />
        </div>
    </div>
</template>

<script>
import PrivateChat from "../contacts-widget/PrivateChat";
import { mapGetters, mapMutations } from "vuex";

export default {
    name: "BugModal",
    components: {PrivateChat},
    data() {
        return {
            currentSupport: null
        }
    },
    computed: {
        ...mapGetters(["currentContactUuid"])
    },
    async mounted() {
        await this.$socket.client.emit('game_get_support_contact', {}, (res) => {
            this.currentSupport = res.contactUuid
            this.openMessages()
        })
    },
    beforeDestroy() {
        this.setCurrentContactUuid(null);
    },
    methods: {
        ...mapMutations([
            'setContactsActiveTab',
            'setCurrentContactUuid',
        ]),
        openMessages() {
            console.log('open modal', this.currentSupport);
            this.setCurrentContactUuid(this.currentSupport);
            this.setContactsActiveTab(1);
        },
    }
};
</script>

<style scoped lang="scss">
.bug__modal {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0,0,0, .6);
    z-index: 10000;
}
.message__container {
    background: var(--color-background-2);
    position: relative;
    width: 600px;
    height: 400px;
    padding: 5px 15px;
    box-sizing: border-box;
    border-radius: 7px;
    overflow: hidden;
}
.close__modal {
    color: #fff;
    z-index: 100000;
    position: absolute;
    text-decoration: none;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 8px;
    height: 8px;
    background-color: var(--color-background);
    right: 0px;
    top: 0px;
}
::v-deep {
    .contact__buttons {
        display: none;
        visibility: hidden;
    }
    .divider {
        display: none;
    }
    .private-chat {
        .input-area {
            //padding: 0 15px;
            .buttons {
                //font-size: 14px;
                bottom: 5px;
            }
        }
    }
}
</style>
