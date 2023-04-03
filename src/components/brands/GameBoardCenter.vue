<template>
    <div ref="center" class="board-center" style="color: #fff">
        <div class="text">
            {{ $t('USER_PROFILE.Что бы сменить бренд') }}
            <br>
            {{ $t('USER_PROFILE.Этот выбранный бренд будет отображаться') }}
        </div>
        <div class="custom-cell-wrap">
            <CustomImage v-for="image in getCustomImages" key="image.id" :image="image"></CustomImage>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import CustomImage from "./CustomImage";

    export default {
        name: 'GameBoardCenter',
        components: {
            CustomImage,
        },
        data() {
            return {
                dealModal: false,
                DealProposalModal: false,
                sellModal: false,
                manInHatModal: true,
            }
        },
        computed: {
            ...mapGetters([
                'getCustomImages'
            ]),
        },
        methods: {

        },
        mounted() {

        }
    }
</script>

<style lang="scss" scoped>
    *{
        box-sizing: border-box;
    }
    .board-center {
        padding: 60px 45px;
        flex: 1;
        text-align: center;
        position: relative;

        .text {
            font-size: 18px;
            line-height: 21px;
            text-align: center;
            color: #fff;
            background-color: rgba(0,0,0,0.4);
            padding: 14px;
            border-radius: 4px;
        }
        .custom-cell-wrap {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            width: 150px;
            margin: 0 auto;
        }
    }
</style>
