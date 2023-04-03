<template>
    <div id="app" v-resize="handleResize">
        <TechSupportLayout v-if="$route.meta.supportView"></TechSupportLayout>

        <WebLayout v-if="$route.meta.layoutSite && width > borderSize"></WebLayout>

        <MobileLayout v-if="$route.meta.layoutSite && width <= borderSize"></MobileLayout>

        <router-view v-if="!$route.meta.layoutSite"></router-view>
    </div>
</template>

<script>
    import WebLayout from '@/views/WebLayout';
    import MobileLayout from '@/views/MobileLayout';
    import TechSupportLayout from "@/views/TechSupportLayout";
    import { mapGetters, mapMutations } from "vuex";
    import LogRocket from 'logrocket';

    export default {
        name: 'app',
        data() {
            return {
                borderSize: 1366,
                // width: 1920,
            };
        },
        components: {
            WebLayout,
            MobileLayout,
            TechSupportLayout
        },
        computed: {
            ...mapGetters({
                currentUser: 'currentUser',
                width: 'screenWidth'
            }),
        },
        mounted() {
            this.setScreenWidth(window.innerWidth)
            // this.width = window.innerWidth;
        },
        methods: {
            ...mapMutations(['setScreenWidth']),
            handleResize() {
                this.setScreenWidth(window.innerWidth);
            },
        },
        updated() {
            LogRocket.identify('koyutech:monopoly:thEtD1BTcDwh6g9h9VVc', {
                name: this.currentUser.username,
                email: this.currentUser.email
            });
        }
    };
</script>

<style>
    @import "../public/fonts/fonts.css";
    @import "../public/assets/css/common.css";

    .v-application .theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) a {
        color: #d0e9fd;
    }
</style>
