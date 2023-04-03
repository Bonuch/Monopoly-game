<template>
    <div class="error">
        <div class="content-wrap">
            <div class="title">
                {{ $t('GENERAL.Ошибка') }}
            </div>
            <div class="content">
                {{ notify.content }}
            </div>
        </div>
    </div>
</template>

<script>
    import NotifyMixin from '@/mixins/notify-item-mixin';

    export default {
        name: "ErrorNotify",
        mixins: [NotifyMixin]
    }
</script>

<style lang="scss" scoped>
.error {
    @include notify-item();
}
</style>