<template>
    <div class="site-notifications dark" :class="{ 'game-mode': gameMode }" v-click-outside="onClickOutside">
        <a v-if="allNotifications.length > 0"
           class="trash"
           :title="$t('NOTIFY.Удалить уведомления')"
           :class="{visible: this.hiddenOpened}"
           href="#"
           @click.prevent="clearList"></a>
        <a v-if="allNotifications.length > 0"
           class="bell"
           :title="hiddenOpened ? $t('NOTIFY.Скрыть уведомления') : $t('NOTIFY.Показать уведомления')"
           :class="{opened: this.hiddenOpened, active: (!this.hiddenOpened && this.hasOutdated)}"
           href="#"
           @click.prevent="toggleList"></a>
        <NotificationList v-if="!hiddenOpened" position="top" :notifications="visibleNotifications" />
        <!-- positioned absolute -->
        <div v-if="hiddenOpened" class="hiddenList">
            <NotificationList position="list" :flex-height="true" :notifications="allNotifications" /><!-- positioned inline -->
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import NotificationList from "./NotificationList";
import BaseScrollbar from "@/components/base/BaseScrollbar";

export default {
    name: "Notifications",
    components: {
        BaseScrollbar,
        NotificationList,
    },
    props: {
        gameMode: {
            type: Boolean,
            default: false,
        },
        bindSelector: {
            type: String,
            required: true,
        },
        popupNumber: {
            type: Number,
            required: false,
            default: 5,
        },
        listNumber: {
            type: Number,
            required: false,
            default: 20,
        },
        messageHeight: {
            type: Number,
            required: false,
            default: 78,
        },
        errorHeight: {
            type: Number,
            required: false,
            default: 78,
        },
        gameInviteHeight: {
            type: Number,
            required: false,
            default: 150,
        },
        contactInviteHeight: {
            type: Number,
            required: false,
            default: 78,
        },
    },
    data() {
        return {
            hiddenOpened: false,
        };
    },
    mounted() {
        setInterval(this.hideNotifications, 1000);
    },
    computed: {
        ...mapGetters([
            "notifications",
        ]),
        hasOutdated() {
            let number = 0;
            for (const n of this.notifications) {
                if (n.status > 0 && n.status < 10) number++;
            }
            return number;
        },
        visibleNotifications() {
            let limit = this.popupNumber;
            const visible = [];
            for (const n of this.notifications) {
                if (n.status === 0) {
                    visible.push(n);
                    if ((limit--) < 0) break;
                }
            }

            return visible;
        },
        allNotifications() {
            let limit = this.listNumber;
            const items = [];
            for (const n of this.notifications) {
                if (n.status < 10) {
                    n.position = "auto";
                    items.push(n);
                    if ((limit--) < 0) break;
                }
            }
            return items;
        },
    },
    methods: {
        ...mapActions([
            "hideNotification",
            "hideNotifications",
            "removeAllNotifications",
        ]),
        toggleList() {
            let element = document.querySelector(this.bindSelector);
            element.classList.toggle("open-notifications");
            this.hiddenOpened = !this.hiddenOpened;
        },
        clearList() {
            this.removeAllNotifications();
            this.hiddenOpened = false;
        },
        onClickOutside() {
            if (this.hiddenOpened) {
                this.hiddenOpened = false;
            }
        },
    },
};
</script>

<style scoped lang="scss">
.site-notifications {
    text-align: left;
    //position: absolute;
    //top: 85px;
    display: flex;
    flex: 1;
    z-index: 999;
    left: 8px;
    width: calc(100% - 30px);

    &.game-mode {
        justify-content: flex-end;
        width: calc(100% - 10px);
        top: 10px;
    }

    .bell, .trash {
        //position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        top: 0;
        right: 10px;
        width: 14px;
        height: 14px;
    }

    .bell {
        background: url(/design/icons/bell-dark.svg) center center no-repeat;

        &.opened {
            background: url(/design/icons/bell-opened-dark.svg) center center no-repeat;
        }

        &.active {
            background: url(/design/icons/bell-active-dark.svg) center center no-repeat;
        }
    }

    .trash {
        right: 35px;
        background: url(/design/icons/trash-dark.svg) center center no-repeat;

        &.visible {
            display: inline-block;
        }
    }

    .hiddenList {
        position: absolute;
        top: 45px;
        left: 0;
        width: 100%;
        height: auto;
        min-height: 260px;
        background-color: #323639;
        padding-bottom: 5px;

        &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: calc(100% - 15px);
            height: 1px;
            background-color: #707070;
        }
    }

    .scroll-wrap {
        height: calc(100vh - 120px);
        padding-right: 5px;
    }
}
</style>
