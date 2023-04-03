<template>
    <div>
        <Header/>
        <Sidebar/>
        <div class="content-wrapper" style="min-height: 933px;">
            <title-header></title-header>
            <div class="content">
                <success-messages></success-messages>
                <error-messages></error-messages>
                <router-view></router-view>
            </div>
            <!-- /.content -->
        </div>
        <Footer/>
    </div>
</template>

<script>
    import Header from './Header.vue';
    import TitleHeader from './TitleHeader.vue';
    import Sidebar from '../sidebar/Sidebar.vue';
    import SuccessMessages from './SuccessMessages.vue';
    import ErrorMessages from './ErrorMessages.vue';
    import Footer from './Footer.vue';

    export default {
        name: 'main-layout',
        components: {
            Header, TitleHeader, Sidebar, SuccessMessages, ErrorMessages, Footer
        }
    }
</script>

<style scoped>

</style>