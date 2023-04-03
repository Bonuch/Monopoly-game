<template>
    <div v-on:mouseover="UserMouseover"
         v-on:mouseleave="UserMouseleave"
         @click="click()"
         class="image">
        <img :src="image.imageUrl.replace('-v.', '-h.')" class="bg-img" :alt="image.title">
        <div v-if="!image.exist" class="blocked">
            <img src="/design/game/lock-black.svg">
        </div>
        <img v-if="image.is_new" class="new" src="/design/icons/new-mark.svg" alt="">
        <img v-if="image.active" class="active" src="/design/icons/active-custom-cell-image.svg" alt="">
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'CustomImage',
    props: {
        image: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {}
    },
    computed: {

    },
    methods: {
        ...mapActions([
            'SOCKET_SET_ACTIVE_IMAGE_CELL',
            'SOCKET_DELETE_NEW_MARK_BRANDS',
        ]),
        UserMouseover: function() {
            this.$store.commit('setHoverImage', this.image.imageUrl);
        },
        UserMouseleave: function() {
            this.$store.commit('setHoverImage', null);
        },
        click: function () {
            if (this.image.exist) {
                this.SOCKET_SET_ACTIVE_IMAGE_CELL({cellId: this.image.cellId, userImageId: this.image.userImageId});
            }
        }
    },
    mounted() {
        if (this.image.is_new) {
            this.SOCKET_DELETE_NEW_MARK_BRANDS(this.image.userImageId);
        }
    }

}
</script>

<style lang="scss" scoped>
    *{
        box-sizing: border-box;
    }
    .image {
        width: 120px;
        height: 67px;
        margin-bottom: 11px;
        background-color: #fff;
        position: relative;
        cursor: pointer;
        border-radius: 5px;
        transition: .2s;
        &:hover {
            transform: scale(1.15);
            //height: 77px;
        }
        .bg-img {
            width: 100%;
            height: 100%;
        }
        &.default {
            order: -2;
        }
        &.exist {
            order: -1;
        }
    }
    .new {
        position: absolute;
        width: 8px;
        height: 8px;
        top: 1px;
        right: 1px;
        transition: 300ms;
    }
    .active {
        position: absolute;
        width: 23px;
        height: 23px;
        top: -2px;
        right: -2px;
    }
    .blocked {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
        top: 0;
        left: 0;
        img {
            position: absolute;
            z-index: 1;
            top: 1px;
            right: 1px;
            width: 16px;
            height: 19px;
        }
    }
</style>
