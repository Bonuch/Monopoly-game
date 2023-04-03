<template>
    <router-link :to="{name: 'profile-settings'}" class="settings">

    </router-link>
</template>

<script>
    export default {
        name: "UserProfileSettingsLink"
    }
</script>

<style lang="scss" scoped>
    .settings {
        position: absolute;
        top: 10px;
        right: 13px;
        width: 19px;
        height: 19px;
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url("/design/icons/profile/settings.svg");

        @media(min-width: 1920px) {
            width: 34px;
            height: 34px;
        }
    }
</style>