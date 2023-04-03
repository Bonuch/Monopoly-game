<template>
    <main class="mainblock">
        <NavMenuProfile></NavMenuProfile>

        <div class="items-block">
            <div v-if="!currentUserLoot.length" class="board-center">
                <div class="text">
                    {{ $t("CUSTOMIZE_LOOT.У Вас нет боксов, которые можно открыть") }}
                    <br>
                    {{ $t("CUSTOMIZE_LOOT.Но их, например, можно купить в") }}
                    <router-link :to="{ name: 'shop'}">
                        {{ $t("CUSTOMIZE_LOOT.магазине") }}
                    </router-link>
                    .
                </div>
            </div>

            <div class="items-list">
                <LootItem style="margin: 10px" v-for="(item, index) in currentUserLoot" :key="index" :item="item" :type="item.type"
                          @open="open(item)"></LootItem>
            </div>


        </div>

        <OpenLootItemModal ref="openModal" @opened="refresh"></OpenLootItemModal>
    </main>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import NavMenuProfile from "@/components/navigations/NavMenuProfile";

import LootItem from "@/components/shop/LootItem.vue";
import OpenLootItemModal from "@/components/shop/OpenLootItemModal.vue";
import MainMixin from "@/mixins/main-mixin";

export default {
    name: "Loot",
    components: { LootItem, OpenLootItemModal, NavMenuProfile },
    mixins: [MainMixin],
    data() {
        return {
            activeType: "",
        };
    },
    mounted() {
        this.activeType = this.$route.name.replace("customize-", "");
        this.refresh();
    },
    computed: {
        ...mapGetters([
            "userItems",
            "currentUserLoot",
        ]),
    },
    watch: {
        "$route.name"(value) {
            this.activeType = this.$route.name.replace("customize-", "");
        },
    },
    methods: {
        refresh() {
            this.loadUserLoot();
            this.loadUserInfo();
        },
        open(item) {
            this.$refs.openModal.show(item);
        },
    },
};
</script>

<style lang="scss" scoped>
// TODO: может всё таки какие-то общие наборы стилей будем создавать?
.board-center {
    padding: 60px 45px;
    flex: 1;
    text-align: center;
    position: relative;

    .text {
        font-size: 18px;
        line-height: 21px;
        text-align: center;
        color: #fff;
        text-shadow: 1px 1px 2px black;
        background-color: rgba(0, 0, 0, 0.4);
        padding: 14px;
        border-radius: 4px;

        a {
            color: #a05ae6;
        }
    }

    .custom-cell-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 150px;
        margin: 0 auto;
    }
}

.items {
    &-list {
        list-style: none;
        padding: 10px;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        li {
            display: flex;
            width: 100px;
            //   height: 54px;
            justify-content: center;
            align-items: center;
            margin-bottom: 5px;
            margin-right: 10px;

            @media (min-width: 1920px) {
                width: 150px;
                // height: 80px;
                margin-right: 15px;
                margin-bottom: 15px;

                &:nth-of-type(5n) {
                    margin-right: 0;
                }
            }

            img {
                display: block;
                max-width: 50%;
                max-height: 50%;
            }
        }
    }
}
</style>
