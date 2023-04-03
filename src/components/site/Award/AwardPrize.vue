<template>
    <Modal class="award__modal">
        <AwardHeader
            :title="'ежедневные награды'"
            :description="'Заходите каждый день и получайте призы'" />
        <AwardList />
    </Modal>
</template>

<script>
import Modal from "./Modal";
import AwardHeader from "./AwardHeader";
import AwardList from "./AwardList";

export default {
    name: "AwardPrize",
    components: {
        AwardList,
        AwardHeader,
        Modal,
    },
};
</script>

<style scoped>

</style>
