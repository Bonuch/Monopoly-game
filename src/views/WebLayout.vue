<template>
    <div class="main__area">
        <ImagePreloader/>
        <Header/>

        <div class="main-layout">
            <aside class="panel-gray bar">
                <div class="bar-wrapper">
                    <AwardWidget />
                    <GameLobbyInformerWidget/>
                    <ProfileWidget/>
                    <ContactsWidget/>
                </div>
            </aside>
            <div class="flex-1 pos-rel bg-dark">
                <section class="content-view">
                    <router-view ref="view"></router-view>
                </section>
                <Footer/>
            </div>
            <div class="panel-gray bar">
                <div class="bar-wrapper" id="rightBar">
                    <BlogPreview>
                        <Notifications :popupNumber="5" :listNumber="20" bind-selector="#rightBar"/>
                    </BlogPreview>
                    <!--            <CommonChat/>-->
                    <Chat/>
                </div>
            </div>
        </div>


        <!--        <aside id="left-aside">-->
        <!--            <GameLobbyInformerWidget/>-->

        <!--            <ProfileWidget/>-->

        <!--            <ContactsWidget/>-->
        <!--        </aside>-->

        <!--        <aside id="right-aside">-->
        <!--            <Notifications :popupNumber="5" :listNumber="20"/>-->

        <!--            <BlogPreview/>-->

        <!--&lt;!&ndash;            <CommonChat/>&ndash;&gt;-->
        <!--                        <Chat/>-->
        <!--        </aside>-->
        <!--        <ShadowGround :is_mobile="false" ></ShadowGround>-->

        <!--        <div id="page-content" ref="pagecontent">-->
        <!--            <section id="content-view">-->
        <!--                <router-view ref="view"></router-view>-->
        <!--                <Footer />-->
        <!--            </section>-->
        <!--        </div>-->
        <AwardModal v-if="$store.getters.awardModalOpen"/>
    </div>
</template>

<script>
import Header from '@/components/site/Header.vue';
import Footer from '@/components/site/Footer.vue';
import Notifications from '@/components/notifications/Notifications.vue';
import ContactsWidget from '@/components/contacts-widget/ContactsWidget.vue';
import BlogPreview from '@/components/blog/BlogPreview.vue';
import Chat from '@/components/chat/Chat.vue';
import ProfileWidget from '@/components/site/ProfileWidget.vue';
import GameLobbyInformerWidget from '@/components/game-lobby/GameLobbyInformerWidget.vue';
import AwardModal from '@/components/site/Award/AwardModal.vue'
// import AwardsWidget from '@/components/site/AwardsWidget.vue';
import ImagePreloader from '@/components/site/ImagesPreloaderWrapper.vue';
import MainMixin from '@/mixins/main-mixin';
import {mapMutations, mapActions, mapGetters} from 'vuex';
import CommonChat from "@/components/common-chat/CommonChat";
import ShadowGround from "@/components/site/ShadowGround";
import AwardWidget from "../components/site/Award/AwardWidget";
// import Award from "../components/site/Award/Award";

// let activityTimer = null;

export default {
    name: 'WebLayout',
    mixins: [MainMixin],
    components: {
        AwardWidget,
        AwardModal,
        Header,
        ContactsWidget,
        BlogPreview,
        Chat,
        ProfileWidget,
        // AwardsWidget,
        ImagePreloader,
        Notifications,
        GameLobbyInformerWidget,
        Footer,
        CommonChat,
        ShadowGround
    },
    data() {
        return {
            myStatus: 'online', // away
            awayTimeout: 120, // секунд
            // lastActivity: 0,
        };
    },
    watch: {
        'lastActivityTime': function(newVal, oldVal) {
            if (this.$lastActivity.limitReached) {
                if (this.myStatus !== 'away') {
                    this.myStatus = 'away'
                    this.$socket.client.emit('update_user_status', this.myStatus);
                }
            } else  {
                if (this.myStatus !== 'online') {
                    this.myStatus = 'online'
                    this.$socket.client.emit('update_user_status', this.myStatus);
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'currentGameUuid',
            'lastActivityTime'
        ]),
    },
    mounted() {
        if (this.currentGameUuid && this.$router.history.current.path !== `/game/${this.currentGameUuid}`) {
            this.$router.push('/game/' + this.currentGameUuid);
        }
        this.loadUserInfo().then(() => {
            this.loadContactsList();
            this.loadAllPrivateChatMessages({offset: 0, limit: 40});
            this.loadUserLoot();
            this.fetchAwardList();
        }).catch(e => console.log(e));
        // отслеживание статуса пользователя
        // activityTimer = setInterval(this.checkActivity, 5000);
    },
    destroyed() {
        // clearInterval(activityTimer);
    },
    methods: {
        ...mapMutations([
            'toggleColorSchema'
        ]),
        ...mapActions([
            'logout',
            'loadContactsList',
            'loadAllPrivateChatMessages',
            'loadUserItems',
            'loadUserCurrentChip',
            'loadUserCurrentDice',
            'fetchAwardList'
        ]),
        handleActivity() {
            if (this.myStatus === 'away') {
                this.myStatus = 'online';
                this.$socket.client.emit('update_user_status', this.status);
            }
        },
        // checkActivity() {
        //     const now = Math.floor((new Date()).valueOf() / 1000);
        //     if ((now - this.lastActivity) > this.awayTimeout && this.status !== 'away') {
        //         this.status = 'away';
        //         this.$socket.client.emit('update_user_status', this.status);
        //     }
        // },
    }
};
</script>

<style scoped lang="scss">
.bg-dark {
    background: var(--color-background);
}

.pos-rel {
    position: relative;
}

.flex-1 {
    flex: 1;
}

.h-100 {
    height: 100%;
}

.main__area {
    box-sizing: border-box;
    position: relative;
}

.contact-widget-height {
    height: calc(100% + 68px + 20px);
}

.main-layout {
    box-sizing: border-box;
    display: flex;
    min-height: calc(100vh - 68px);
    justify-content: space-between;
}

.content-view {
    position: relative;
    padding-bottom: 80px;
}

.panel-gray {
    background: var(--color-background-2);
}

.bar {
    width: 446px;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 110;
    @media screen and (max-width: 1600px) {
        width: 335px;
    }
}

.bar-wrapper {
    position: sticky;
    top: 68px;
    height: calc(100vh - 68px);
    display: flex;
    flex-direction: column;
}

#page-content {
    box-sizing: border-box;
    background-color: var(--color-background);
    min-height: 100vh;

    #content-view {
        position: relative;
        min-height: 100vh;
        box-sizing: border-box;
        padding: 68px 0 100px 0;
        flex-basis: auto;
        /* TODO: remove it background: linear-gradient(0deg, #202124, #202124); */
        flex-grow: 1;
        margin: 0 446px;
        @media only screen and (max-width: 1720px) {
            margin: 0 355px;
        }
    }
}

#left-aside {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    flex-flow: column;
    padding: 68px 0 0 0;
    width: 446px;
    background: #323639;
    border: none;
    @media only screen and (max-width: 1720px) {
        width: 355px;
    }
}

#right-aside {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-flow: column;
    width: 446px;
    padding: 68px 0 0 0;
    background: #323639;
    border: none;
    min-height: 100vh;
    @media only screen and (max-width: 1720px) {
        width: 355px;
    }
}
</style>
<style lang="scss">
.open-notifications {
    .blog-title {
        color: #8D8B8B !important;
    }
}
</style>
