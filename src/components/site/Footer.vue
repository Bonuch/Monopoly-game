<template>
    <footer class="footer">
        <router-link class="logo" tag="a" :to="{name: 'play'}">
            <img src="/design/logos/logo.png" alt=""/>
        </router-link>
        <nav class="footer_nav">
            <router-link class="link" to="#">{{ $t('SEARCH_CREATE_GAME.Правила') }}</router-link>
            <router-link class="link" to="#">{{ $t('SITE.Сообщить о проблеме') }}</router-link>
            <router-link class="link" to="#">{{ $t('SITE.Предложения и отзывы') }}</router-link>
        </nav>
<!--        <div class="center wide">-->
<!--            <div class="awards">-->
<!--                <AwardsWidget ref="awards"/>-->
<!--            </div>-->
<!--        </div>-->
        <div class="footer__socials">
            <a class="item" :href="instagram" title="">
                <img src="/design/icons/socials/instagram_gray.svg" alt="">
            </a>
            <a class="item" :href="facebook" title="">
                <img src="/design/icons/socials/facebook_gray.svg" alt="">
            </a>
            <a class="item" :href="vk" title="">
                <img src="/design/icons/socials/vk_gray.svg" alt="">
            </a>
        </div>
        <!--        <div class="left wide">-->
        <!--            <router-link class="logo-link" tag="a" :to="{name: 'play'}"></router-link>-->
        <!--            <nav>-->
        <!--                <ul>-->
        <!--                    <li>-->
        <!--                        <router-link class="link" to="#">{{ $t('SEARCH_CREATE_GAME.Правила') }}</router-link>-->
        <!--                    </li>-->
        <!--                    <li>-->
        <!--                        <router-link class="link" to="#">{{ $t('SITE.Сообщить о проблеме') }}</router-link>-->
        <!--                    </li>-->
        <!--                    <li>-->
        <!--                        <router-link class="link" to="#">{{ $t('SITE.Предложения и отзывы') }}</router-link>-->
        <!--                    </li>-->
        <!--                </ul>-->
        <!--            </nav>-->
        <!--        </div>-->
        <!--        <div class="center wide">-->
        <!--            <div class="awards">-->
        <!--                <AwardsWidget ref="awards"/>-->
        <!--            </div>-->
        <!--        </div>-->
        <!--        <div class="right wide">-->
        <!--            <div class="socials">-->
        <!--                <a class="social" :href="instagram" title="">-->
        <!--                    <img src="/design/icons/socials/instagram_gray.svg" alt="">-->
        <!--                </a>-->
        <!--                <a class="social" :href="facebook" title="">-->
        <!--                    <img src="/design/icons/socials/facebook_gray.svg" alt="">-->
        <!--                </a>-->
        <!--                <a class="social" :href="vk" title="">-->
        <!--                    <img src="/design/icons/socials/vk_gray.svg" alt="">-->
        <!--                </a>-->
        <!--            </div>-->
        <!--        </div>-->
        <!--        <div class="center narrow">-->
        <!--            <nav>-->
        <!--                <ul>-->
        <!--                    <li>-->
        <!--                        <router-link class="link" to="#">{{ $t('SEARCH_CREATE_GAME.Правила') }}</router-link>-->
        <!--                    </li>-->
        <!--                    <li>-->
        <!--                        <router-link class="link" to="#">{{ $t('SITE.Сообщить о проблеме') }}</router-link>-->
        <!--                    </li>-->
        <!--                    <li>-->
        <!--                        <router-link class="logo-link" tag="a" :to="{name: 'play'}"></router-link>-->
        <!--                    </li>-->
        <!--                    <li>-->
        <!--                        <router-link class="link" to="#">{{ $t('SITE.Предложения и отзывы') }}</router-link>-->
        <!--                    </li>-->
        <!--                    <li class="socials social-item">-->
        <!--                        <a class="social" :href="instagram" title="">-->
        <!--                            <img src="/design/icons/socials/new-instagram.svg" alt="">-->
        <!--                        </a>-->
        <!--                        <a class="social" :href="facebook" title="">-->
        <!--                            <img src="/design/icons/socials/new-facebook.svg" alt="">-->
        <!--                        </a>-->
        <!--                        <a class="social" :href="vk" title="">-->
        <!--                            <img src="/design/icons/socials/new-vk.svg" alt="">-->
        <!--                        </a>-->
        <!--                    </li>-->
        <!--                </ul>-->
        <!--            </nav>-->
        <!--        </div>-->
    </footer>
</template>

<script>
import AwardsWidget from '@/components/site/AwardsWidget.vue';
import MainMixin from '@/mixins/main-mixin';
import {mapGetters, mapMutations, mapActions} from 'vuex';

export default {
    name: 'Footer',
    mixins: [MainMixin],
    components: {
        AwardsWidget,
    },
    data() {
        return {
            facebook: process.env.VUE_APP_SOCIALS_FB,
            instagram: process.env.VUE_APP_SOCIALS_INSTAGRAM,
            vk: process.env.VUE_APP_SOCIALS_VK
        };
    },
    computed: {
        ...mapGetters([
            'currentUser',
            'contacts',
        ])
    },
    mounted() {

    },
    methods: {}
};
</script>

<style lang="scss" scoped>
.footer {
    box-sizing: border-box;
    background: var(--color-background-2);
    display: flex;
    //width: 100%;
    width: calc(100% - 892px);
    padding: 10px 25px;
    position: fixed;
    z-index: 100;
    //justify-content: space-between;
    align-items: center;
    bottom: 0;
    @media screen and (max-width: 1700px) {
        width: 55%;
    }
    @media screen and (max-width: 1600px) {
        width: calc(100% - 670px);
    }
    @media screen and (max-width: 1440px) {
        width: 62%;
    }
    @media screen and (max-width: 1366px) {
        width: 74%;
    }
    @media screen and (max-width: 1190px) {
        width: 70%;
    }
    @media screen and (max-width: 1024px) {
        max-width: 669px;
    }
    @media screen and (max-width: 880px) {
        justify-content: flex-start !important;
    }
    .logo {
        width: 60px;
        height: 60px;
    }
    &_nav {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        text-align: left;
        .link {
            &:first-child {
                margin-top: 0;
            }

            margin-top: 4px;
            //margin-left: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 10px;
            color: var(--color-white);

        }
        @media screen and (max-width: 1024px){
            flex-direction: row;
            .link {
                margin: 0 0 0 8px;
            }
        }
    }

    &__socials {
        display: flex;
        align-items: center;
        margin-left: auto;
        @media screen and (max-width: 1700px) {
            margin-left: 55%;
        }
        @media screen and (max-width: 1440px) {
            margin-left: 57%;
        }
        //@media screen and (max-width: 1366px) {
        //    margin-left: 60%;
        //}
        @media screen and (max-width: 1190px) {
            margin-left: 51%;
        }
        .item {
            text-align: center;
            box-sizing: border-box;
            height: 26px;
            width: 26px;
            margin-left: 8px;
            border-radius: 50%;
            padding: 5px;
            background: var(--color-background-social);
            @media screen and (max-width: 1024px){
                height: 22px;
                width: 22px;
                padding: 3px;
            }
        }
        @media screen and (max-width: 1024px){
            margin-left:  20px;
        }
    }
    @media screen and (max-width: 1024px){
        justify-content: center;
        .logo {
            width: 32px;
            height: 32px;
        }
        background: var(--color-background);
    }
}

.socials {
    margin: 27px 46px 0 0;
    text-align: right;
    display: flex;
    justify-content: flex-end;

    .social {
        display: flex;
        align-items: center;
        height: 23px;
        padding: 6.5px;
        margin-left: 10px;
        box-sizing: border-box;
        //padding: 5px;
        //align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #1B1B1B;
        text-decoration: none;

        &.instagram {
            width: 23px;
            background: url(/design/icons/instagram.png) center center no-repeat;
            background-size: cover;
        }

        &.facebook {
            width: 14px;
            background: url(/design/icons/facebook.png) center center no-repeat;
            background-size: cover;
        }

        &.vk {
            width: 39px;
            background: url(/design/icons/vk.png) center center no-repeat;
            background-size: cover;
        }
    }
}

#footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    transition: height 0.1s ease;
    width: 100%;
    height: 78px;
    overflow: hidden;
    z-index: 100;
    border-top: none;
    background: #323639;
    box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.1);
    @media only screen and (max-width: 1440px) {
        background: transparent;
        box-shadow: none;
        height: 50px;
    }

    .left.wide {
        position: relative;
        flex-basis: 300px;
        text-align: left;
        display: flex;
        @media only screen and (max-width: 1440px) {
            display: none;
        }

        .logo-link {
            flex-basis: 76px;
            margin: 8px 0 0 11px;
            width: 62px;
            height: 62px;
            background: url(/design/logos/logo.png) no-repeat center center;
            background-size: contain;
        }

        nav {
            flex: 1;
            display: inline-block;
            margin: 16px 0 0 0;

            ul {
                list-style: none;
                margin: 0;
                padding: 0;

                li {
                    margin: 0;
                    padding: 0 0 3px 0;

                    .link {
                        font-size: 10px;
                        line-height: 14px;
                        text-decoration: none;
                        color: #fff;
                    }
                }
            }
        }
    }

    .center.wide {
        flex: 1;
        @media only screen and (max-width: 1440px) {
            display: none;
        }
    }

    .right.wide {
        flex-basis: 300px;
        @media only screen and (max-width: 1440px) {
            display: none;
        }


    }

    .narrow {
        display: none;
        @media only screen and (max-width: 1440px) {
            display: block;
            flex: 1;
        }

        nav {
            width: 100%;
            display: flex;
            flex-direction: row;
            margin: 6px 0 0 0;

            ul {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                list-style: none;
                margin: 0;
                padding: 0;

                li {
                    flex: 0 1 auto;
                    display: inline-block;
                    margin: 0 5px;
                    padding: 0 0 0 0;

                    .link {
                        font-size: 10px;
                        line-height: 14px;
                        text-decoration: none;
                        color: #fff;
                    }

                    .logo-link {
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        background: url(/design/logos/logo.png) no-repeat center center;
                        background-size: contain;
                    }
                }

                .socials {

                    .social {
                        display: inline-block;
                        height: 18px;
                        margin-right: 6px;

                        &.instagram {
                            width: 18px;
                            background: url(/design/icons/instagram.png) center center no-repeat;
                            background-size: cover;
                        }

                        &.facebook {
                            width: 10px;
                            background: url(/design/icons/facebook.png) center center no-repeat;
                            background-size: cover;
                        }

                        &.vk {
                            width: 29px;
                            background: url(/design/icons/vk.png) center center no-repeat;
                            background-size: cover;
                        }
                    }
                }
            }
        }
    }
}
</style>

