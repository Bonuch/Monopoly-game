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
        name: "MessageNotify",
        mixins: [NotifyMixin]
    }
</script>

<style lang="scss" scoped>
    .message {
        @include notify-item();
    }
    .message {
        background: var(--color-background-2);
        padding: 8px;
        border-radius: 8px;
    }
</style>
