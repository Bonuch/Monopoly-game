<template>
    <div class="base-logo">
        <router-link v-if="!checkIsFront" to="/" class="base-logo__link">
            <img src="/design/logos/logo.png" alt="logo" class="base-logo__image">
        </router-link>

        <img v-else src="/design/logos/logo.png" alt="logo" class="base-logo__image">
    </div>
</template>

<script>
    export default {
        name: 'BaseLogo',
        computed: {
            checkIsFront() {
                return this.$route.path === '/';
            }
        },
    }
</script>

<style>
    .base-logo {

    }
</style>
