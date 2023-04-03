<template>
    <nav class="main-header navbar navbar-expand bg-white navbar-light border-bottom">
        <sidebar-toggle></sidebar-toggle>
        <ul class="navbar-nav ml-auto">
            <login-dropdown></login-dropdown>
        </ul>
    </nav>
</template>

<script>
    import SidebarToggle from '../sidebar/SidebarToggle.vue';
    import LoginDropdown from './LoginDropdown.vue';

    export default {
        name: 'app-header',
        components: {
            SidebarToggle, LoginDropdown
        }
    }
</script>
