<template>
    <div>
        <div class="shop-items__container" v-if="shopItems && simpleItem">
            <ShopItem v-for="(item, key) in shopItems" :key="key" :item="item"
                      @buyButtonClick="buyButtonClickListener" />
        </div>
        <div class="shop-items__container" v-else-if="shopItems && isBoxData">
            <BoxItem v-for="(item, key) in shopItems" :key="key" :item="item"
                     @buyButtonClick="buyButtonClickListener" />
        </div>
        <div class="shop-items__container" v-else-if="shopItems && shopType === 'shop-dice'">
            <ShopItem v-for="(item, key) in shopItems" :key="key" :item="item"
                      @buyButtonClick="buyButtonClickListener" />
        </div>
        <ShopBuyItemModal ref="buyModal" @purchaseCompleted="onPurchaseCompleted"></ShopBuyItemModal>
    </div>
</template>

<script>
import ShopMixin from "@/mixins/shop-mixin";
import ShopBuyItemModal from "@/components/shop/ShopBuyItemModal.vue";
import ShopItem from "./ShopItem";
import BoxItem from "./BoxItem";
import { mapGetters, mapActions } from "vuex";

export default {
    name: "ShopItems",
    components: { ShopBuyItemModal, ShopItem, BoxItem },
    // TODO: почистить эти миксины от axios и прочего неактуального
    mixins: [ShopMixin],
    props: {
        // isBoxData: {
        //     type: Boolean,
        //     default: false
        // }
    },
    data() {
        return {
            is_show_modal: false,
            selectedItem: null,
        };
    },
    computed: {
        ...mapGetters([
            "shopItems",
        ]),
        simpleItem() {
            const special = ["shop-box", "shop-dice"];
            return !special.includes(this.shopType);
        },
        isBoxData() {
            return this.shopType === "shop-box";
        },
        shopType() {
            return this.$route.name;
        },
    },
    watch: {
        "$route.name"(value) {
            value = value.replace("shop-", "");
            this.shopLoadItems(value);
        },
    },
    methods: {
        ...mapActions([
            "shopLoadItems",
        ]),
        buyButtonClickListener(event) {
            this.$refs.buyModal.buyDialog(event.item, event.currency);
        },
        onPurchaseCompleted() {
            let value = this.$route.name.replace("shop-", "");
            this.shopLoadItems(value);
        },
    },
    created() {
        let value = this.$route.name.replace("shop-", "");
        this.shopLoadItems(value);
    },
};
</script>

<style scoped lang="scss">
.shop-items__container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
}
</style>
