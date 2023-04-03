<template>
    <div class="profile-choosen-items">
        <ul>
            <li>
                <img :src="chipImage" alt="#">
                <span class="title">{{ $t('USER_PROFILE.Фишка') }}</span>
            </li>
            <li>
                <img :src="diceImage" alt="#">
                <span class="title">{{ $t('USER_PROFILE.Кубик') }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "UserProfileGameItems",
        props: {
            userColor: String,
            monopolyItem: Object,
            diceItem: Object,
            chipItem: Object,
        },
        computed: {
            diceImage() {
                return this.diceItem ? this.diceItem.image : '/design/items/dices/default.png';
            },
            chipImage() {
                return this.chipItem ? this.chipItem.image : '/design/items/chips/chip-default-blue.png';
            },
        },
    }
</script>

<style lang="scss" scoped>
    .profile-choosen-items {
        width: 100%;
        margin-top: 40px;
        margin-bottom: 30px;
        ul {
            display: flex;
            justify-content: flex-end;
            list-style: none;
            padding: 0;
            margin: 0;

            li {
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                //margin-right: 16px;
                margin-bottom: 0;
                text-align: center;
                //border-bottom: 8px sprofile-choosen-itemsolid transparent;

                &:last-of-type {
                    margin-right: 0;
                }

                @media(min-width: 1920px) {
                    border-width: 14px;
                    margin-bottom: 0;
                    //margin-right: 16px;
                }

                img {
                    display: block;
                    height: 64px;
                    width: 118px;
                    object-fit: contain;
                    //height: 100%;
                    //max-width: 100%;
                    //max-height: 64px;

                    //@media(min-width: 1920px) {
                    //    max-height: 64px;
                    //}
                }

                span {
                    margin-top: 6px;
                    color: #fff;
                    font-size: 16px;
                    font-weight: 600;

                    @media(min-width: 1920px) {
                        font-size: 17px;
                        line-height: 20px;
                    }
                }
            }
        }
    }
</style>
