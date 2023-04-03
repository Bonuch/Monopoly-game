<template>
    <main class="mainblock">
        <NavMenuShop></NavMenuShop>
        <div class="title">
            <h1>{{ $t("SHOP.Храм") }} {{ $t("SHOP.потребления") }}</h1>
            <!--            <h3>{{ $t('SHOP.потребления') }}</h3>-->
        </div>
        <div class="shopcatalog">
            <ShopItems></ShopItems>
        </div>
<!--        <DiceModal v-if="diceModalOpen" />-->
    </main>
</template>

<script>
import NavMenuShop from "@/components/navigations/NavMenuShop";
import ShopItems from "@/components/shop/ShopItems";
import DiceModal from "../components/shop/DiceModal";

export default {
    name: "Shop",
    components: {
        DiceModal,
        NavMenuShop,
        ShopItems,
    },
    data() {
        return {
            message: "",
        };
    },
    computed: {
        isBox() {
            return this.$route.name === "shop-box";
        },
        diceModalOpen() {
            return this.$store.getters.openedDice
        }
    },
    mounted() {
        this.$store.commit("updateBackground", "/design/backgrounds/vitrazh15.jpeg");
    },
    beforeDestroy() {
        this.$store.commit("updateBackground", "");
    },
};
</script>

<style scoped lang="scss">
.mainblock {
    background-image: url("/design/backgrounds/sub-shapka.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    min-height: calc(100vh - 150px);
}

.title {
    padding: 50px 20px;
    color: white;
    position: relative;

    h1 {
        margin: 0;
    }

    @media screen and (max-width: 1600px) {
        padding: 40px 20px;
    }
    @media screen and (max-width: 1366px) {
        padding: 30px 20px;
    }

}

.title h1 {
    font-size: 60px;
    font-weight: 600;
}

.shopcatalog {
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
</style>
