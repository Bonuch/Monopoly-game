<template>
    <div>
        <v-navigation-drawer :clipped="true" v-model="drawer" fixed app color="#272727">
            <v-list>
                <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title" />
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar :clipped-left="true" fixed app>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer">
                <v-icon>fa-bars</v-icon>
            </v-app-bar-nav-icon>

            <v-toolbar-title v-if="$route.meta && $route.meta.title" v-text="$route.meta.title" />
            <v-toolbar-title v-else v-text="title" />
            <v-spacer />

            <v-btn icon @click="logoutByMenu">
                <v-icon>fa-sign-out</v-icon>
            </v-btn>
        </v-app-bar>
        <v-main>
            <v-container>
                <router-view></router-view>
            </v-container>
        </v-main>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    components: {},
    data() {
        return {
            drawer: true,
            fixed: true,
            items: [
                {
                    icon: "fa-tachometer",
                    title: "Мониторинг",
                    to: "/admin",
                },
                {
                    icon: "fa-users",
                    title: "Пользователи",
                    to: "/admin/users",
                },
                {
                    icon: "fa-mortar-board",
                    title: "Знания",
                    to: "/admin/knowledges",
                },
                {
                    icon: "fa-puzzle-piece",
                    title: "Игровые значения",
                    to: "/admin/game-values",
                },
                {
                    icon: "fa-newspaper-o",
                    title: "Блог и новости",
                    to: "/admin/blog",
                },
                {
                    icon: "fa-bandcamp",
                    title: "Сияние",
                    to: "/admin/shines",
                },
                {
                    icon: "fa-language",
                    title: "Переводы",
                    to: "/admin/translations",
                },
            ],
            miniVariant: false,
            title: "Монополия - Администрирование",
        };
    },
    methods: {
        ...mapActions(["logout"]),

        logoutByMenu() {
            this.logout();
            // TODO: опять же, закрыл костылём баг разлогина. Приходится релоадить страницу
            // this.$router.push('/admin/login');
            window.location.replace("/admin/login");
        },
    },
};
</script>
