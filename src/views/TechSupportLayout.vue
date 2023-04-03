<template>
    <div class="main__area">
        <ImagePreloader/>
        <Header/>
        <TicketView></TicketView>
        <router-view></router-view>
        <Footer/>
    </div>
</template>

<script>
import ImagePreloader from '@/components/site/ImagesPreloaderWrapper.vue';
import Header from '@/components/site/Header.vue';
import Footer from "@/components/site/Footer";
import TicketView from '@/views/TicketView.vue'
import { mapActions } from "vuex";
import MainMixin from '@/mixins/main-mixin';

export default {
    name: "TechSupportLayout",
    components: { ImagePreloader, Header, Footer, TicketView },


    mixins: [MainMixin],
    mounted() {
        this.loadUserInfo().then(() => {
            this.loadContactsList();
            this.loadAllPrivateChatMessages({offset: 0, limit: 40});
            this.loadUserLoot();
        }).catch(e => console.log(e));
    },
    methods: {
        ...mapActions([
            'logout',
            'loadContactsList',
            'loadAllPrivateChatMessages',
            'loadUserItems',
            'loadUserCurrentChip',
            'loadUserCurrentDice'
        ]),
    }
};
</script>

<style scoped lang="scss">
.main__area {
    box-sizing: border-box;
    position: relative;
    min-height: 100vh;
    background: var(--color-background);
}
</style>
