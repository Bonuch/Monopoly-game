<template>
    <div class="lootbox">
<!--        {{ item }}-->
        <img width="120" :src="item.image" />
        <!--    <img v-if="type == 'box'" width="80" src="/design/shop/box.png"/>-->
        <!--    <img v-if="type == 'relic'" height="100" src="/design/shop/vase.png"/>-->
<!--        <p class="lootbox__title">{{ $t("SHOP." + item.title) }}</p>-->
        <p class="lootbox__title">{{ item.title.title }}</p>
        <div class="button__wrapper">
            <button class="modal-button ok" @click="open">{{ $t("LOOT.Открыть") }}</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "LootItem",
    props: {
        type: null,
        item: null,
    },
    data() {
        return {
            is_opening: false,
        };
    },
    methods: {
        open() {
            this.is_opening = true;
            this.$emit("open", null);
        },
    },
};
</script>
<style>
.lootbox {
    padding-top: 10px;
    padding-bottom: 30px;
    position: relative;
    /*height: 110px;*/
    width: 100px;
    border-radius: 3px;
    background: #323639;
    color: white;
    cursor: pointer;
    box-shadow: 7px 7px 5px -5px rgba(0, 0, 0, 0.8);
}

.lootbox img {
    max-width: 70%;
    height: auto;
    max-height: 70px;
}

.lootbox__title {
    font-size: 14px;
    padding: 0 5px;
}

.button__wrapper {
    position: absolute;
    left: 0;
    bottom: 10px;
    width: 100%;
    height: 30px;
}

.lootbox button {
    width: 90px;
    margin: 5px;
    height: 25px;
    background: #323639;
    border: solid 1px #232629;
    border-radius: 3px;
    color: white;
    cursor: pointer;
}

.lootbox button:hover {
    background: #7D33E4;
    border: solid 1px #6D23d4;
}

</style>
