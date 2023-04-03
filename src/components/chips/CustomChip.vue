<template>
    <div class="chip" :class="chip.type">
        <img v-if="chip.is_new" class="new" src="/design/icons/new-mark.svg" alt="#">
        <div class="bg-chip">
            <img :src="chip.image" :alt="chip.title">
        </div>
        <button type="button" v-if="chip.active" class="active">{{ $t('USER_PROFILE.Применено') }}</button>
        <button type="button" v-else @click="click()">{{ $t('USER_PROFILE.Применить') }}</button>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'CustomChip',
    props: {
        chip: {
            type: Object,
            required: true,
        },
    },
    methods: {
        ...mapActions([
            'SOCKET_SET_ACTIVE_CHIP',
            'SOCKET_DELETE_NEW_MARK_CHIPS',
            'loadUserInfo',
        ]),
        click: function () {
            this.SOCKET_SET_ACTIVE_CHIP({chipId: this.chip.id});
            this.loadUserInfo();
        }
    },
    mounted() {
        if (this.chip.is_new) {
            this.SOCKET_DELETE_NEW_MARK_CHIPS();
        }
    }

}
</script>

<style lang="scss" scoped>
    *{
        box-sizing: border-box;
    }
    .chip {
        border-radius: 18px;
        margin: 0 32px 64px;
        background-color: #000;
        overflow: hidden;
        position: relative;
        &.default {
            order: 1;
        }
        &.custom {
            order: 2;
        }
    }
    .new {
        position: absolute;
        width: 8px;
        height: 8px;
        top: 10px;
        right: 10px;
        transition: 300ms;
    }
    .bg-chip {
        width: 262px;
        height: 262px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    button {
        outline: none;
        border: none;
        margin: 0;
        padding: 14px;
        background-color: #323639;
        width: 100%;
        font-size: 24px;
        color: #fff;
        cursor: pointer;
        &.active {
            background-color: var(--color-purple-medium);
            cursor: default;
        }
    }
</style>
