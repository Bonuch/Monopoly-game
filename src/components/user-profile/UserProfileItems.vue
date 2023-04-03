<template>
    <div class="items-block">
        <ul v-if="isItemsNotEmpty" class="items-list">
            <li v-for="(item, index) of choosenItems"
                    :key="index"
                    class="items-list__item">
                <img :src="item.image" :alt="item.title">
            </li>
        </ul>
        <div v-else class="no-items">
            <h3 v-if="isMyProfile">
                {{ $t('USER_PROFILE.Предметы отсутствуют') }}.
                {{ $t('USER_PROFILE.Вы можете приобрести их') }}&nbsp;
                <router-link class="items-block__link" to="/shop">{{ $t('USER_PROFILE.в храме') }}</router-link>
            </h3>
            <h3 v-if="!isMyProfile">
                {{ $t('USER_PROFILE.Предметы отсутствуют') }}.
            </h3>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserProfileItems",
        props: {
            items: {
                type: Array,
                required: true
            },
            activeType: {
                type: String,
                default: "all"
            },
            isMyProfile: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            choosenItems() {
                return this.items.filter(
                    item => (this.activeType == 'all' || item._type == this.activeType)
                );
            },
            isItemsNotEmpty() {
                return this.choosenItems.length > 0;
            }
        },
    }
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    .items {
        &-block {
            &__link {
                display: inline;
                color: var(--color-base-blue);
                text-decoration: none;
                transition: border-color, color 0.3s ease;
                border-bottom: 1px solid;

                &:hover,
                &:focus,
                &:active {
                    border-bottom-color: transparent;
                    color: var(--color-purple);
                }
            }
        }

        &-list {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            padding: 10px 0 0 0;
            margin: 0;

            &__item {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 19%;
                height: 92px;
                margin-right: 1%;
                margin-bottom: 15px;
                filter: drop-shadow(0px 6px 6px rgba(#000, .25));

                &:nth-child(5n) {
                    margin-right: 0;
                }

                img {
                    display: block;
                    max-width: 100%;
                    max-height: 100%;
                }
            }
        }
    }
    .no-items {
        margin-top: 40px;

        h3 {
            color: #fff;
        }
    }
</style>
