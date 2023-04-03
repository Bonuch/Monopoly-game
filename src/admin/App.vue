<template>
    <v-app>
        <component :is="layout">
            <router-view />
        </component>
    </v-app>
</template>

<script>
import Main from "./components/layouts/Main.vue";

const default_layout = "div";

export default {
    name: "app",
    components: {
        Main,
    },
    computed: {
        layout() {
            if (this.$route.meta.emptyLayout) {
                return default_layout;
            }
            if (this.$route.meta.layout) {
                return this.$route.meta.layout;
            }
            return Main;
        },
    },
};
</script>
