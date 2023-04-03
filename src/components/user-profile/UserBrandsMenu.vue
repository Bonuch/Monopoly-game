<template>
    <ul class="custom-brands-menu">
        <li>
            <router-link class-active="active" to="/profile/brands">
                <img v-if="getIsNewCustomBrands" class="new" src="/design/icons/new-mark.svg" alt="">
                {{ $t('USER_PROFILE.Бренды') }}
            </router-link>
        </li>
        <li>
            <router-link class-active="active" to="#2">{{ $t('USER_PROFILE.Патенты') }}</router-link>
        </li>
        <li>
            <router-link class-active="active" to="#3">{{ $t('USER_PROFILE.Кубики') }}</router-link>
        </li>
        <li>
            <router-link class-active="active" to="/profile/chips">
                <img v-if="getIsNewCustomChips" class="new" src="/design/icons/new-mark.svg" alt="">
                {{ $t('USER_PROFILE.Фишки') }}
            </router-link>
        </li>
    </ul>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "UserBrandsMenu",
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters([
                'getIsNewCustomBrands',
                'getIsNewCustomChips',
            ]),
        },
        methods: {
            ...mapActions([
                'SOCKET_IS_NEW_CUSTOM_BRANDS',
                'SOCKET_IS_NEW_CUSTOM_CHIPS',
            ]),
        },
        created() {
            this.SOCKET_IS_NEW_CUSTOM_BRANDS();
            this.SOCKET_IS_NEW_CUSTOM_CHIPS();
        }
    }
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
     .custom-brands-menu {
         display: flex;
         flex-wrap: wrap;
         justify-content: center;
         list-style: none;
         background: #323639;
         box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
         margin: 0;
         font-size: 20px;
         line-height: 24px;
         padding: 0;
         a {
             display: inline-block;
             color: rgba(255, 255, 255, 0.5);
             text-decoration: none;
             padding: 13px 17px 5px 17px;
             position: relative;
             &:after {
                 content: '';
                 position: absolute;
                 width: 100%;
                 height: 3px;
                 bottom: -3px;
                 left: 0;
                 opacity: 0;
                 background-color: #7D33E4;
                 transition: 300ms;
             }
             &.active {
                 color: #fff;
                 &:after {
                     opacity: 1;
                 }
             }
             .new {
                 position: absolute;
                 width: 8px;
                 height: 8px;
                 top: 8px;
                 right: 8px;
             }
         }
     }

</style>