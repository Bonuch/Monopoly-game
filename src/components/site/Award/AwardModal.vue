<template>
    <Modal class="award__modal" :btn-title="btnTitle">
        <AwardHeader
            :title="$t('AWARDS.ежедневные награды')"
            :description="$t('AWARDS.Заходите каждый день и получайте призы')" />
        <AwardList @awardAvailable="btnTitle = $t('AWARDS.ЗАБРАТЬ НАГРАДУ')" />
    </Modal>
</template>

<script>
import Modal from "./Modal";
import AwardHeader from "./AwardHeader";
import AwardList from "./AwardList";

export default {
    name: "AwardModal",
    components: {
        AwardList,
        AwardHeader,
        Modal,
    },
    data() {
        return {
            awardList: [],
            btnTitle: this.$t('GENERAL.Закрыть'),
        };
    },
    // async mounted() {
    //     await this.$socket.client.emit("load_weekly_awards", {}, (data) => {
    //         if (!data.err) {
    //             this.awardList.push(...data);
    //         }
    //     });
    // },
    methods: {
        closeModal() {
            this.$store.commit("awardModalOpen", false);
        },
    },
};
</script>

<style scoped lang="scss">
//::v-deep {
//    .base-loader {
//        display: flex;
//        justify-content: center;
//        height: 80px;
//    }
//    #base-loader-loading {
//        width: 100px;
//        margin: 0;
//    }
//}
</style>
