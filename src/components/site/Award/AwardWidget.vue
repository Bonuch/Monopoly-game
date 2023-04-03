<template>
    <div>
        <a v-if="!gameLobbyDetails || gameLobbyWidget" @click='openAwardModal()' href="#" class="weekly__award__container">
            <img src="/design/awards/prize.png" alt="#">{{ $t('AWARDS.посмотреть награды') }}</a>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "AwardWidget",
    computed: {
        ...mapGetters([
            'gameLobbyWidget',
            'gameLobbyDetails'
        ]),
    },
    methods: {
        openAwardModal() {
            this.$store.commit('awardModalOpen', true)
        }
    }
};
</script>

<style scoped lang="scss">
.weekly__award__container {
    height: 30px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-decoration: none;
    //background: rgba(#000, .1);

    img {
        height: 30px;
        margin-right: 5px;
    }
}
</style>
