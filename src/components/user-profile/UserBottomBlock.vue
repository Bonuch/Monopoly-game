<template>
    <div class="block">
        <div class="flex">
            <a v-if="isMyProfile" @click="openStatTab('stats')" :class="{active: activeTab == 'stats'}"><span>{{ $t("USER_PROFILE.Статистика")}}</span></a>
            <ul class="block-tabs block__padding">
                <li class="friends-tab">
                    <button type="button"
                            @click="openFriendsTab()"
                            :class="{active: activeTab == 'friends'}"> {{ $t("USER_PROFILE.Друзья") }}
                    </button>
                </li>
                <li>
                    <button type="button"
                            @click="openItemsTab('dice')"
                            :isMyProfile="isMyProfile"
                            :class="{active: activeItemsTab == 'dice'}"> {{ $t("USER_PROFILE.Кубики") }}
                    </button>
                </li>
                <li>
                    <button type="button"
                            @click="openItemsTab('game_cards')"
                            :isMyProfile="isMyProfile"
                            :class="{active: activeItemsTab == 'game_cards'}"> {{ $t("USER_PROFILE.Бренды") }}
                    </button>
                </li>
                <li>
                    <button type="button"
                            @click="openItemsTab('chips')"
                            :isMyProfile="isMyProfile"
                            :class="{active: activeItemsTab == 'chips'}"> {{ $t("USER_PROFILE.Фишки") }}
                    </button>
                </li>
                <li>
                    <button type="button"
                            @click="openItemsTab('all')"
                            :isMyProfile="isMyProfile"
                            :class="{active: activeItemsTab == 'all'}"> {{ $t("USER_PROFILE.Все предметы") }}
                        <span>{{ itemsCount }}</span>
                    </button>
                </li>
            </ul>
        </div>
        <BaseScrollbar class="content block__padding block__padding--scroll">
            <UserProfileItems v-if="activeTab === 'items'"
                              :items="items"
                              :active-type="activeItemsTab"
                              :isMyProfile="isMyProfile" />
            <UserProfileFriendsAll v-else-if="activeTab === 'friends'" :friends="friends" />
            <UserStat v-else style="min-height: 500px;"/>
        </BaseScrollbar>
    </div>
</template>

<script>
import UserProfileItems from "./UserProfileItems";
import UserProfileFriendsAll from "./UserProfileFriendsAll";
import BaseScrollbar from "@/components/base/BaseScrollbar";
import UserStat from "./UserStat";

export default {
    name: "UserBottomBlock",
    components: { BaseScrollbar, UserProfileFriendsAll, UserProfileItems, UserStat },
    data() {
        return {
            activeTab: "items",
            activeItemsTab: "all",
        };
    },
    props: {
        items: Array,
        friends: Array,
        isMyProfile: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        itemsCount() {
            return this.items ? this.items.length : 0;
        },
    },
    methods: {
        openItemsTab(type) {
            this.activeTab = "items";
            this.activeItemsTab = type;
        },
        openFriendsTab() {
            this.activeTab = "friends";
            this.activeItemsTab = null;
        },
        openStatTab() {
            this.activeTab = "stats";
            this.activeItemsTab = null
        }
    },
};
</script>

<style lang="scss" scoped>
.flex {
    display: flex;
    justify-content: space-between;

    a {
        cursor: pointer;
        outline: none;
        border: none;
        background-color: transparent;
        font-size: 12px;
        line-height: 14px;
        font-weight: 500;

        @media(min-width: 1920px) {
            font-size: 20px;
            line-height: 24px;
        }

        color: #FFF;
        opacity: .5;

        &.active {
            opacity: 1;
        }
    }
}
.block {
    box-sizing: border-box;
    position: relative;
    top: -5px;
    //max-width: 554px;
    margin: 0 auto;
    padding: 15px 5px 25px;
    border: 1px solid transparent;
    border-radius: 8px;
    background-color: #323639;

    @media(min-width: 1920px) {
        //max-width: 932px;
        padding: 15px 10px 0;
        //border-radius: 5px;
    }

    .block__padding {
        padding-left: 5px;
        padding-right: 5px;

        &--scroll {
            padding-left: 5px;
            padding-right: 5px;
        }

        @media all and (min-width: 1920px) {
            padding-left: 10px;
            padding-right: 10px;

            &--scroll {
                padding-left: 10px;
                padding-right: 10px;
            }
        }
    }

    .content {
        height: 300px;

        @media(min-width: 1920px) {
            height: 280px;
        }
    }

    .block-tabs li button {
        color: #FFF;
        opacity: .5;

        &.active {
            opacity: 1;
        }
    }

    &-tabs {
        display: flex;
        justify-content: flex-end;
        list-style: none;
        padding: 0;
        margin: 0 0 15px 0;

        @media(min-width: 1920px) {
            margin-bottom: 30px;
        }

        li {
            margin-left: 30px;

            @media(min-width: 1920px) {
                margin-left: 60px;
            }

            button {
                cursor: pointer;
                outline: none;
                border: none;
                background-color: transparent;
                font-size: 12px;
                line-height: 14px;
                font-weight: 500;

                @media(min-width: 1920px) {
                    font-size: 20px;
                    line-height: 24px;
                }
            }

            &.friends-tab {
                //margin: 0 auto 0 0;
                text-align: right;
            }
        }
    }
}
</style>
