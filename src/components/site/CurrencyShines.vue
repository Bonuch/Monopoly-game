<template>
    <div class='currency-shines' :class="{visible: this.$store.getters.getKnowledgeModal}">
        <div class='currency-container' v-for='(value, key, index) in shines' :key='key'>
            <img class='cristal' :src='imageUrls[index]' alt='#' />
            <span class='money-dollars'
                  :title='value'>{{ value | currency }}</span>
        </div>
        <div class='currency-container'>
            <img class='cristal' src='/design/icons/currencies/black21.png' alt='' />
            <span class='money-dollars'
                  :title='userBucks'>{{ userBucks | currency }}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CurrencyShines',
    props: ['currentUser', 'shineValues'],
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
        }
    },
    filters: {
        currency(value) {
            if (value) {
                const currency = parseInt(value);
                if (currency >= 1000000000) {
                    return `${(value / 1000000000).toFixed(1)}B`;
                }
                if (currency >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                }
                if (currency >= 10000) {
                    return `${(value / 1000).toFixed(1)}K`;
                }
                return value;
            }
            return 0;
        },

    },
    computed: {
        shines() {
            if (this.currentUser && this.currentUser.balance) {
                const res = {
                    shine1: this.currentUser.balance.shine1 || 0,
                    shine2: this.currentUser.balance.shine2 || 0,
                    shine3: this.currentUser.balance.shine3 || 0,
                    shine4: this.currentUser.balance.shine4 || 0,
                    shine5: this.currentUser.balance.shine5 || 0,
                };
                return res;
            }
            if (this.shineValues) {
                return {
                    shine1: this.shineValues.shine1 || 0,
                    shine2: this.shineValues.shine2 || 0,
                    shine3: this.shineValues.shine3 || 0,
                    shine4: this.shineValues.shine4 || 0,
                    shine5: this.shineValues.shine5 || 0,
                }
            }
            return null;
        },
        userBucks() {
            if (this.currentUser && this.currentUser.balance) {
                return this.currentUser.balance.balance_bucks
            }
            return 0
        },
    }
}
</script>
<style scoped lang="scss">
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
        margin-right: 5px;
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
            margin-right: 10px;
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
.cristal {
    height: 19px;

    &--shine {
        @extend .cristal;
        fill: #fff;
    }
}
</style>
