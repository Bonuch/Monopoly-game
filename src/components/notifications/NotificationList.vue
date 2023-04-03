<template>
    <BaseScrollbar class="list-wrap items" :class="{list: (position === 'list'), 'scroll-wrap': flexHeight}">
        <div v-if="notify.status === 0 || position === 'list'"
             v-for="notify of this.notifications"
             class="notification"
             :class="{opacityZero: (notify.goingHidden === 1 && position === 'top'), list: (position === 'list')}"
             :style="{top: notify.position}"
             :key="notify.id">
            <a v-if="position === 'top'" :title="$t('GENERAL.Закрыть')" href="#" class="close"
               @click.prevent="closeNotify(notify.id)"></a>
            <!--            <a v-if="position === 'list'" title="Удалить" href="#" class="remove" @click.prevent="removeNotify(notify.id)"></a>-->

            <MessageNotify v-if="notify.type === 'message'" :notify="notify" />
            <FriendInvitationNotify v-if="notify.type === 'friend-invitation'" :notify="notify" />
            <GameInvitationNotify v-if="notify.type === 'game-invitation'" :notify="notify" />
            <AwardNotify v-if="notify.type === 'weekly-award'" :notify="notify"/>
            <ErrorNotify v-if="notify.type === 'error'" :notify="notify" />
        </div>
    </BaseScrollbar>
<!--    <div class="items" :class="{list: (position === 'list')}">-->
<!--        <div v-if="notify.status === 0 || position === 'list'"-->
<!--             v-for="notify of this.notifications"-->
<!--             class="notification"-->
<!--             :class="{opacityZero: (notify.goingHidden === 1 && position === 'top'), list: (position === 'list')}"-->
<!--             :style="{top: notify.position}"-->
<!--             :key="notify.id">-->
<!--            <a v-if="position === 'top'" :title="$t('GENERAL.Закрыть')" href="#" class="close"-->
<!--               @click.prevent="closeNotify(notify.id)"></a>-->
<!--            &lt;!&ndash;            <a v-if="position === 'list'" title="Удалить" href="#" class="remove" @click.prevent="removeNotify(notify.id)"></a>&ndash;&gt;-->

<!--            <MessageNotify v-if="notify.type === 'message'" :notify="notify" />-->
<!--            <FriendInvitationNotify v-if="notify.type === 'friend-invitation'" :notify="notify" />-->
<!--            <GameInvitationNotify v-if="notify.type === 'game-invitation'" :notify="notify" />-->
<!--            <ErrorNotify v-if="notify.type === 'error'" :notify="notify" />-->
<!--        </div>-->
<!--    </div>-->
</template>

<script>
import { mapActions } from "vuex";
import MessageNotify from "./items/MessageNotify";
import FriendInvitationNotify from "./items/FriendInvitationNotify";
import GameInvitationNotify from "./items/GameInvitationNotify";
import ErrorNotify from "./items/ErrorNotify";
import BaseScrollbar from "@/components/base/BaseScrollbar";
import AwardNotify from "./items/AwardNotify";

export default {
    name: "NotificationList",
    components: { AwardNotify, ErrorNotify, GameInvitationNotify, MessageNotify, FriendInvitationNotify, BaseScrollbar },
    props: [
        "notifications",
        "position",
        'flexHeight'
    ],
    methods: {
        ...mapActions([
            "hideNotification",
            "hideNotifications",
            "removeNotification",
            "notificationAnswer",
        ]),
        closeNotify(id) {
            this.hideNotification(id);
        },
        removeNotify(id) {
            this.removeNotification(id);
        },
    },
};
</script>

<style scoped lang="scss">
.list-wrap {
  min-height: auto;
};
.items {
    position: absolute;
    top: 45px;
    left: 0;
    //background-color: #323639;
    overflow: auto;
    width: 100%;
    box-sizing: border-box;
    padding: 0 5px;

    .notification {
        position: relative;
        margin-bottom: 10px;
        //background: #323639;
        color: #fff;
        border: 1.5px solid rgba(0, 0, 0, 0.25);
        box-sizing: border-box;
        border-radius: 15px;
        z-index: 99;
        transition: opacity 1s;
        min-height: 75px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);

        &.list .friend-invitation {
            padding: 5px 15px;
        }

        &.opacityZero {
            opacity: 0;
        }

        .message {
            min-height: 76px;
            //box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.15);
        }

        .close {
            position: absolute;
            top: 6px;
            right: 8px;
            width: 10px;
            height: 10px;
            background: url(/design/icons/close-small-bright.svg);
            background-size: cover;
        }

        .remove {
            position: absolute;
            top: 6px;
            right: 10px;
            width: 10px;
            height: 10px;
            background: url(/design/icons/trash.svg) center center no-repeat;
        }
    }

    &.list {
        left: auto;
        top: auto;
        text-align: left;
        //background-color: transparent;
        padding: 0 5px;
    }

    &.dark {
        .bell {
            background: url(/design/icons/bell-dark.svg) center center no-repeat;
        }

        .notification {
            color: #000;
        }
    }
}
</style>
