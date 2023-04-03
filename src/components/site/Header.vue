<template>
    <header class='header' :class="{'header-custom-w': $route.path === '/profile/brands'}" ref='header' v-scroll='handleScroll' v-resize='handleResize'>
        <div class='top'>
            <div class='logo'>
                <router-link class='logo-link' :to="{name: 'play'}"></router-link>
            </div>

            <HeaderMenu refs='menubutton' />

            <div class='info' v-if='currentUser'>
                <div class='inner'>
                    <CurrencyShines :currentUser="currentUser"/>
                    <button class='settings' @click.prevent='toggleDropdownSettings'></button>
                    <div class='settings-dropdown' v-if='settingsDropdownVisible'>
                        <ul class='dropdown-items'>
                            <li>
                                <router-link class='profile-settings' :to="{name: 'profile-settings'}">
                                    <img :src="'/design/icons/gears-dark.svg'" alt='' />
                                    {{ $t('SITE.Настройки') }}
                                </router-link>
                            </li>
                            <li>
                                <a class='exit-action' href='#' @click.prevent='doLogout()'>{{ $t('GENERAL.Выйти')
                                    }}</a>
                            </li>
                        </ul>
                        <a class='close' href='#' @click.prevent='closeDropdownSettings'></a>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import HeaderMenu from '@/components/navigations/HeaderMenu.vue';
import MainMixin from '@/mixins/main-mixin';
import CurrencyShines from "./CurrencyShines";
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Header',
    mixins: [MainMixin],
    components: {
        HeaderMenu,
        CurrencyShines,
    },
    computed: {
        ...mapGetters([
            'currentUser',
            'contacts',
        ]),
        // shines() {
        //     if (this.currentUser && this.currentUser.balance) {
        //         const res = {
        //             shine1: this.currentUser.balance.shine1 || 0,
        //             shine2: this.currentUser.balance.shine2 || 0,
        //             shine3: this.currentUser.balance.shine3 || 0,
        //             shine4: this.currentUser.balance.shine4 || 0,
        //             shine5: this.currentUser.balance.shine5 || 0,
        //         };
        //         return res;
        //     }
        //     return null;
        // },
        // userBucks() {
        //     if (this.currentUser && this.currentUser.balance) {
        //         return this.currentUser.balance.balance_bucks
        //     }
        //     return 0
        // },
    },
    filters: {
        // currency(value) {
        //     if (value) {
        //         const currency = parseInt(value);
        //         if (currency >= 1000000000) {
        //             return `${(value / 1000000000).toFixed(1)}B`;
        //         }
        //         if (currency >= 1000000) {
        //             return `${(value / 1000000).toFixed(1)}M`;
        //         }
        //         if (currency >= 10000) {
        //             return `${(value / 1000).toFixed(1)}K`;
        //         }
        //         return value;
        //     }
        //     return 0;
        // },
    },
    data() {
        return {
            settingsDropdownVisible: false,
            isCurrencyVisible: false,
            imageUrls: [
                '/design/icons/currencies/green.png', // Shine 1
                '/design/icons/currencies/yellow.png', // Shine 2
                '/design/icons/currencies/purple.png', // Shine 3
                '/design/icons/currencies/blue.png', // Shine 4
                '/design/icons/currencies/red.png', // Shine 5
            ],
            shine: {
                shine1: 20,
                shine2: 30,
                shine3: 50,
                shine4: 10,
                shine5: 5,
            },
        };
    },
    mounted() {
        console.log(this.currentUser);
    },
    methods: {
        ...mapActions([
            'logout',
        ]),
        toggleDropdownSettings() {
            this.settingsDropdownVisible = !this.settingsDropdownVisible;
        },
        toggleDropdownCurrency() {
            this.isCurrencyVisible = !this.isCurrencyVisible;
        },
        closeDropdownBalance() {
            this.isCurrencyVisible = false;
        },
        closeDropdown() {
            this.settingsDropdownVisible = false;
            this.isCurrencyVisible = false;
        },
        closeDropdownSettings() {
            this.settingsDropdownVisible = false;
        },
        handleScroll() {
            this.closeDropdown();
        },
        handleResize() {
            this.closeDropdown();
        },
        async doLogout() {
            console.log('doLogout');
            await this.logout();
            await this.$router.push('/login');
        },
    },
};
</script>

<style lang='scss' scoped>
@mixin header_dropdown($pos_top, $pos_right) {
    position: fixed;
    top: $pos_top;
    right: $pos_right;
    height: auto;
    width: auto;
    min-width: 140px;
    background: #282C2E;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    padding: 10px 10px 20px 10px;
    z-index: 100;
    box-shadow: 0px 2px 2px 0px rgba(255, 255, 255, 0.2);
}

.currency-container {
    margin-right: 6px;
    display: flex;
    align-items: center;
    &:last-child {
        margin-right: 0;
    }
    span {
        font-weight: 600;
        font-size: 14px;
    }

    img {
        max-width: unset;
    }

    @media screen and (max-width: 1440px){
        flex-basis: 33%;
        margin-right: 0;
        span {
            font-size: 12px;
            font-weight: 600;
        }
        img {
            width: 10px;
            height: 10px !important;
        }
    }
}
.currency-shines {
    display: flex;
    flex-wrap: nowrap;
    //width: 350px;
    //margin-right: 15px;
    @media screen and (max-width: 1440px){
        //width: 140px;
        flex-wrap: wrap;
        margin-right: 0px;
    }
}
.currency-classic {
    display: flex;
    flex-wrap: nowrap;
    @media screen and (max-width: 1440px){
        flex-wrap: wrap;
        width: 60px;
    }
}
.close {
    position: absolute;
    bottom: 6px;
    left: 0;
    display: block;
    width: 100%;
    height: 16px;
    border: 0;
    background: url(/design/icons/close-dark.svg) no-repeat center center;
}

.header {
    position: sticky;
    z-index: 1000;
    height: 68px;
    top: 0;
    display: block;
    width: 100%;
    background: #323639;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);

    .top {
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 68px;
        border: none;

        .logo {
            flex-basis: 20%;
            min-width: 300px;
            margin-top: 3px;
            box-sizing: border-box;
            @media only screen and (max-width: 1366px) {
                min-width: 100px;
                flex-basis: 10%;
            }

            .logo-link {
                width: 50px;
                height: 50px;
                margin-left: 27px;
                display: block;
                background: url(/design/logos/logo.png) no-repeat center center;
                background-size: contain;
                @media only screen and (max-width: 1440px) {
                    margin-left: 15px;
                }
            }
        }

        .currency-button {
            display: block;
            width: 24px;
            height: 24px;
            border: 0;
            background: url(/design/icons/diamonds.svg) no-repeat center center;
            background-size: 32px 32px;
            padding: 0;
            margin: 0 0 0 4px;
        }

        .currency-dropdown {
            @include header_dropdown(53px, 60px);

            .dropdown-items {
                list-style: none;
                margin: 0;
                padding: 0;

                li {
                    font-size: 14px;
                    display: flex;
                    padding: 3px 0;
                    align-items: center;
                    text-align: left;
                }
            }
        }

        .info {
            display: flex;
            flex-basis: 20%;
            min-width: 300px;
            align-items: center;
            justify-content: flex-end;
            padding-right: 22px;
            margin-top: 2px;
            box-sizing: border-box;
            @media only screen and (max-width: 1440px) {
                padding-right: 15px;
            }
            @media only screen and (max-width: 1366px) {
                min-width: 270px;
            }
            @media only screen and (max-width: 768px) {
                min-width: 215px;
            }

            .inner {
                display: flex;
                width: auto;
                align-items: center;
                justify-content: normal;
                padding: 6px 6px 6px 12px;
                border-radius: 50px;
                font-size: 16px;
                background: #282C2E;
                color: #fff;

                .cristal {
                    height: 19px;

                    &--shine {
                        @extend .cristal;
                        fill: #fff;
                    }
                }

                @media screen and (max-width: 1440px) {
                    width: 179px;
                }



                //
                //.money-dollars, .money-bitcoin {
                //  font-size: 20px;
                //}

                .settings {
                    display: block;
                    width: 36px;
                    height: 24px;
                    border: 0;
                    background: url(/design/icons/settings-dark.svg) no-repeat center center;
                    padding: 0;
                    margin: 0 0 0 4px;
                }

                .settings-dropdown {
                    @include header_dropdown(53px, 36px);

                    .dropdown-items {
                        list-style: none;
                        margin: 0;
                        padding: 0;

                        > li {
                            margin: 0;
                            padding: 0;
                            text-align: left;
                            padding-bottom: 10px;

                            > a {
                                /*color: #000;*/
                                color: #fff;
                                font-size: 14px;
                                text-decoration: none;
                                outline: none;

                                > img {
                                    height: 16px;
                                    margin-right: 5px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
@media only screen and (max-width: 1330px) {
    .header-custom-w {
        width: 1315px;
    }
}
@media only screen and (max-width: 768px) {
    .header-custom-w {
        width: 1286px;
    }
}
</style>

