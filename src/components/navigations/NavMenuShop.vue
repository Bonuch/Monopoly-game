<template>
    <ul class="nav-menu-shop">
        <li v-for="item in items"
            :key="item.key"
            @click="navigate(path(item))"
            :class="{ 'active': active(path(item)) }"
        >
            <router-link :to="{ name: item.name }">
                {{ item.title }}
            </router-link>
        </li>
    </ul>
</template>

<script>
export default {
    data() {
        return {
            items: [
                {
                    title: this.$t('USER_PROFILE.Наборы'),
                    name: 'shop'
                },
                {
                    title: this.$t('USER_PROFILE.Боксы'),
                    name: 'shop-box'
                },
                {
                    title: this.$t('USER_PROFILE.Бренды'),
                    name: 'shop-brand'
                    // link: '/profile/brands',
                    // condition: this.getIsNewCustomBrands,
                    // img: '/design/icons/new-mark.svg',
                },
                {
                    title: this.$t('USER_PROFILE.Кубики'),
                    name: 'shop-dice'
                },
                {
                    title: this.$t('USER_PROFILE.Фишки'),
                    name: 'shop-chip'
                },
                {
                    title: this.$t('USER_PROFILE.Ускорители'),
                    name: 'shop-accelerator'
                },
            ]
        };
    },
    methods: {
        path (item) {
            return '/' + item.name.replace('-', '/')
        },
        navigate (path) {
            this.$router.push({path: path});
        },
        active (input) {
            if (this.$route.name == 'shop') {
                return input == '/shop'
            }
            if (input == '/shop') return false

            const paths = Array.isArray(input) ? input : [input];
            return paths.some(path => {
                return this.$route.path.indexOf(path) === 0
            })
        }
    },
}
</script>


<style scoped lang="scss">
    a {
        outline: none;
    }
    .nav-menu-shop {
        z-index: 1;
        display: flex;
        flex-flow: row;
        height: 40px;
        width: 100%;
        background:#323639;
        -webkit-box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
        margin: 0;
        list-style: none;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        position: relative;
        padding: 0;

        li {
            align-items: center;
            position: relative;
            -webkit-box-sizing: content-box;
            box-sizing: content-box;
            padding: 0px 20px;
            line-height: 40px;
            cursor: pointer;
            &.active, &:hover {
                a {
                    color: #fff;
                }
                &::after {
                    content: "";
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background:#7D33E4;
                    opacity: 1;
                    -webkit-transition: opacity 0.2s ease;
                    transition: opacity 0.2s ease;
                }
            }
            a {
                color: #8D8B8B;
                font-size: 17px;
                font-weight: 500;
                text-decoration: none;
            }
            &:hover {
                background-color: #fff1;
            }
        }
    }

</style>



