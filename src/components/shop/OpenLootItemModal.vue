<template>
    <div>
        <IllustratedModal
            v-if="lootitem"
            ref="openModal"
            :image_url="imageUrl"
            :is_jumping="!is_processing && !is_opened"
            :is_rotation="is_processing"
            :is_disabled="is_processing"
            :is_state_ask="!is_opened"
            :is_state_success="is_opened"
            @ok="open"
        >
            <span v-if="!is_processing && !is_opened">{{ questionText }}</span>
            <span class="box__description" v-if="!is_processing && !is_opened">{{ boxDescription }}</span>
            <span v-else-if="is_processing && !is_opened">{{ $t("LOOT.Открываем") }}</span>
            <div v-else-if="!is_processing && is_opened" style="text-align: left;">
                <p>{{ $t("LOOT.Получены предметы") }}:</p>
                <div class="loot_items__container">
                    <div class="loot__item" v-for="(item, index) in openedLootItems" :key="index">
                        <p style="display: flex; align-items: center; justify-content: space-between">
                            <span class="item__item"><img class="item__image" :src="item.image" alt="#">{{ item.title }}</span>
                            <span class="item__price" v-if="item.sold">
                                {{ item.sold }}
                                <img
                                    src="/design/icons/currencies/black21.png"
                                    alt="">
                            </span>
                        </p>
                        <p v-if="item.money">
                            <CurrencyShines :shine-values="item.money" />
                        </p>
                        <p v-if="item.sold" class="sold__row">{{ $t('SHOP.у вас уже есть этот предмет, вы получаете баксы') }}</p>
                    </div>
                </div>
            </div>
        </IllustratedModal>
    </div>
</template>

<script>
import CurrencyShines from "../site/CurrencyShines";
import { mapGetters, mapActions } from "vuex";
import IllustratedModal from "@/components/notifications/IllustratedModal.vue";

export default {
    name: "OpenLootItemModal",
    data() {
        return {
            lootitem: null,
            openedLootItems: [],
            is_processing: false,
            is_opened: false,
        };
    },
    components: {
        CurrencyShines,
        IllustratedModal,
    },
    methods: {
        ...mapActions([
            "openLootItem",
        ]),
        extractShines(item) {
            currencies = {};
        },
        show(item) {
            this.is_processing = false;
            this.is_opened = false;
            this.openedLootItems = [];
            this.lootitem = item;
            this.$nextTick(() => {
                this.$refs.openModal.show();
            });
        },
        open() {
            this.is_processing = true;
            this.openLootItem(this.lootitem).then(response => {
                this.openedLootItems = response.items;
                setTimeout(() => {
                    this.$emit("opened", this.lootitem);
                    this.is_processing = false;
                    this.is_opened = true;
                    // download from https://freesound.org/people/elliotlp/sounds/277311/
                    var audio = new Audio("/samples/open-toolbox.mp3");
                    audio.play();
                }, 1000);
            });
        },
    },
    computed: {
        imageUrl() {
            if (!this.lootitem) return "";
            if (!this.is_opened && this.is_processing) {
                return "/design/shop/wheel-fortune.png";
            } else {
                return this.lootitem.image;
                // switch (this.lootitem.type) {
                //     case "case":
                //         return "/design/shop/briefcase.png";
                //     case "box":
                //         return "/design/shop/box.png";
                //     case "relic":
                //         return "/design/shop/vase.png";
                //     default:
                //         break;
                // }
            }
        },
        questionText() {
            if (!this.lootitem) return "";
            return this.$t("LOOT.Вы хотите открыть?") + " " +this.lootitem.title.title;
            // switch (this.lootitem.type) {
            //     case "case":
            //         return this.$t("LOOT.Открыть портфель?");
            //     case "box":
            //         return this.$t("LOOT.Открыть коробку?");
            //     case "relic":
            //         return this.$t("LOOT.Открыть реликвию?");
            //     default:
            //         break;
            // }
        },
        boxDescription() {
            if (!this.lootitem) return "";
            return this.lootitem.title.description;
        },
    },
};
</script>

<style lang="scss" scoped>
.loot_item__container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}

.loot_item {
    display: flex;
    width: 100%;
    align-items: center;


}

.item__image {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border-radius: 50%;
}

img.gameitem {
    width: 37px;
    margin-bottom: -10px;
    margin-right: 5px;
}

.box__description {
    margin-top: 10px;
    font-size: 14px;
}

.sold__row {
    display: flex;
    align-items: center;
}
.item__item {
    align-items: center;
    justify-content: center;
    display: flex;
}
.item__price {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        margin-left: 5px;
    }
}
</style>
