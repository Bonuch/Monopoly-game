<template>
    <v-card>
        <v-tabs
            v-model="tab"
            background-color="grey-darken-3 accent-4"
            class="tab__container"
            centered
            dark
            icons-and-text
        >
            <v-tab v-for="item in navigation" :to="{name: 'translator', params: {
                trGroup: item.group
            }}">
                {{ item.label }}
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-card>
                <router-view></router-view>
            </v-card>
        </v-tabs-items>
    </v-card>
</template>

<script>

export default {
    name: "Translations",
    // comments: { FieldTranslate, GameTranslate, ShineTranslate, ShopTranslate},
    data() {
        return {
            tab: null,
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            navigation: null,
        };
    },
    methods: {
        getComponentName(group_name) {
            const name = {
                shop: "shopTranslate",
                game: "gameTranslate",
                system: "systemTranslate",
                ui: "uiTranslate",
            };
            return { name: name[group_name] };
        },
        async fetchTranslationGroup() {

            await this.$store.$app.$socket.client.emit("get_translate_navigation", {
                type: this.translation_type,
            }, async response => {
                this.navigation = response;
                await this.$router.push({
                    name: "translator", params: {
                        trGroup: this.navigation[0].group,
                    },
                });
            });
        },
    },
    computed: {
        activeComponent() {
            return this.componentMap[this.tab];
        },
    },
    async created() {
        try {
            await this.fetchTranslationGroup();
            console.log("LLLLLLL", this.navigation);
            await this.$router.push({
                name: "translator", params: {
                    trGroup: this.navigation[0].group,
                },
            });
        } catch (e) {
            console.log("some error", e);
        }
    },
};
</script>

<style scoped lang="scss">
.tab__item {
    color: #fff;
}

.tab__container {
}

::v-deep {
    .v-tab--active {
        color: #fff;
    }

    .v-tab {
        color: #fff;
    }
}
</style>
