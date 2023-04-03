<template>
    <div class="main__area" @mousemove="handleActivity">
<!--        <ImagePreloader/>-->
        <Header/>

        <div class="main-layout">
            <aside class="panel-gray bar">
                <div class="bar-wrapper">
                    <GameLobbyInformerWidget/>
                    <ProfileWidget/>
                    <NotificationsMobile :popupNumber="3" :listNumber="8"/>
                    <ContactsWidget commonChat/>
                </div>
                <div class="pos-rel">
                    <div class="panel-open__button">
                        <a href="#" class=""><img src="/design/icons/panel_icon.svg" alt="" height="20px" /></a>
                    </div>
                </div>
            </aside>
            <div class="flex-1 pos-rel bg-dark">
                <section class="content-view">
                    <router-view ref="view"></router-view>
                </section>
                <Footer />
            </div>
<!--            <div class="panel-gray bar">-->
<!--                <Notifications :popupNumber="5" :listNumber="20"/>-->

<!--                <BlogPreview/>-->

<!--                &lt;!&ndash;            <CommonChat/>&ndash;&gt;-->
<!--                <Chat/>-->
<!--            </div>-->
        </div>
        <ImagePreloader/>

<!--        <Header/>-->

<!--        <aside id="left-aside">-->
<!--            <GameLobbyInformerWidget/>-->

<!--            <ProfileWidget/>-->

<!--            <NotificationsMobile :popupNumber="3" :listNumber="8"/>-->

<!--            <ContactsWidget :commonChat="true"/>-->
<!--        </aside>-->

<!--        <ShadowGround :is_mobile="true"></ShadowGround>-->
<!--        <div id="page-content" ref="pagecontent">-->
<!--            <section id="content-view">-->
<!--                <router-view ref="view"></router-view>-->
<!--                <Footer/>-->
<!--            </section>-->
<!--        </div>-->

    </div>
</template>

<script>

// It used for screen which less than 1366px

import Header from '@/components/site/Header.vue';
import Footer from '@/components/site/Footer.vue';
import NotificationsMobile from '@/components/notifications/NotificationsMobile.vue';
import ContactsWidget from '@/components/contacts-widget/ContactsWidget.vue';
import BlogPreview from '@/components/blog/BlogPreview.vue';
import Chat from '@/components/chat/Chat.vue';
import ProfileWidget from '@/components/site/ProfileWidget.vue';
import GameLobbyInformerWidget from '@/components/game-lobby/GameLobbyInformerWidget.vue';
import AwardsWidget from '@/components/site/AwardsWidget.vue';
import ImagePreloader from '@/components/site/ImagesPreloaderWrapper.vue';
import MainMixin from '@/mixins/main-mixin';
import {mapGetters, mapMutations, mapActions} from 'vuex';
import ShadowGround from "@/components/site/ShadowGround";


let activityTimer = null;

export default {
    name: 'WebLayout',
    mixins: [MainMixin],
    components: {
        Header,
        ShadowGround,
        ContactsWidget,
        BlogPreview,
        Chat,
        ProfileWidget,
        AwardsWidget,
        ImagePreloader,
        NotificationsMobile,
        GameLobbyInformerWidget,
        Footer
    },
    data() {
        return {
            myStatus: 'online', // away
            awayTimeout: 120, // секунд
            lastActivity: 0,
        };
    },
    computed: {
        ...mapGetters([
            'currentUser',
            'contacts',
            'currentGameUuid',
        ]),
        isShopPath() {
            return this.$route.matched.some(({name}) => name === 'shop');
        }
    },
    mounted() {
        if (this.currentGameUuid && this.$router.history.current.path !== `/game/${this.currentGameUuid}`) {
            this.$router.push('/game/' + this.currentGameUuid);
        }
        this.loadUserInfo().then(() => {
            this.loadContactsList();
            this.loadAllPrivateChatMessages({offset: 0, limit: 40});
            this.loadUserLoot();
        }).catch(e => console.log(e));
        // отслеживание статуса пользователя
        activityTimer = setInterval(this.checkActivity, 5000);
    },
    destroyed() {
        clearInterval(activityTimer);
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
            'loadUserCurrentDice'
        ]),
        handleActivity() {
            this.lastActivity = Math.floor((new Date()).valueOf() / 1000);
            if (this.status === 'away') {
                this.status = 'online';
                this.$socket.client.emit('update_user_status', this.status);
            }
        },
        checkActivity() {
            const now = Math.floor((new Date()).valueOf() / 1000);
            if ((now - this.lastActivity) > this.awayTimeout && this.status !== 'away') {
                this.status = 'away';
                this.$socket.client.emit('update_user_status', this.status);
            }
        },
    }
};
</script>

<style scoped lang="scss">
.pt-15 {
    padding-top: 15px;
}
.panel-open__button {
    position: fixed;
    display: none;
    left: 0px;
    top: 50%;
    z-index: 50;
    background: var(--color-background-2);
    border-radius: 0px 25px 25px 0px;
    a {

        padding: 13px 5px 13px 8px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        transition: .2s;
        img {
            height: 20px;
            max-width: 40px;
        }
        &:hover {
            padding: 13px 5px 13px 15px;
        }
    }
    //@media screen and (max-width: 834px) {
    //    display: block;
    //}
}
.bg-dark {
    background: var(--color-background);
}
.flex-1 {
    flex: 1;
}
.pos-rel {
    position: relative;
}

.w-100 {
    width: 100%;
}

.h-100 {
    height: 100%;
}

.main__area {
    box-sizing: border-box;
    position: relative;
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
    @media screen and (max-width: 1024px){
        padding-bottom: 50px;
    }
}

.panel-gray {
    background: var(--color-background-2);
}

.bar {
    //width: 446px;
    width: 355px;
    position: relative;
    display: flex;
    position: relative;
    flex-direction: column;
    @media screen and (max-width: 768px) {
        width: 325px;
    }
    //.bar-wrapper {
    //    @media screen and (max-width: 834px) {
    //        width: 0px;
    //        //width: 292px;
    //    }
    //}
    &.active {
        width: 292px;
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
        min-height: 100vh;
        box-sizing: border-box;
        position: relative;
        padding: 68px 0 100px 0;
        flex-basis: auto;
        /* TODO: remove it - background: linear-gradient(0deg, #202124, #202124); */
        flex-grow: 1;
        margin: 0 0 0 335px;
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
    width: 335px;
    background: #323639;
    border: none;
}
</style>
