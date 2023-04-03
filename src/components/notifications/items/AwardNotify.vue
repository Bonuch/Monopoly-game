<template>
    <div class="message">
        <img class="notify-img" v-if="notify.image" :src="notify.image" alt="" />
        <div class="content-wrap">
            <div class="title">
            </div>
            <div class="title" v-if="notify.title">
                {{ notify.title }}
            </div>
            <div class="content">
                {{ notify.content }}
            </div>
        </div>

    </div>

</template>

<script>
import NotifyMixin from '@/mixins/notify-item-mixin'

export default {
    name: "AwardNotify",
    mixins: [NotifyMixin]
}
</script>

<style lang="scss" scoped>
.message {
    @include notify-item();
}
.message {
    //background: rgba(#ec8d3f, .2);
    $opLvl: .1;
    background: linear-gradient(354deg, rgba(#6a1ed5, $opLvl), rgba(#fed700, $opLvl), rgba(#6a1ed5, $opLvl));
    background-size: 2000px;
    backdrop-filter: blur(10px);
    padding: 8px;
    border-radius: 8px;
    .notify-img {
        background-color: unset;
        object-fit: contain;
        border-radius: 6px;
        filter: drop-shadow(0px 5px 5px rgba(#000, .5));
    }
}
</style>
