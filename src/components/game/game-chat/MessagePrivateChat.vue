<!--<template>-->
<!--    <div class="users">-->
<!--        <div-->
<!--            class="users-list"-->
<!--            v-for="tab in playersChatUsers"-->
<!--            :key="tab"-->
<!--            :class="['tab-button', { active: currentTab === tab }]"-->
<!--            @click="currentTab = tab"-->
<!--        >-->
<!--            {{ tab }}-->
<!--        </div>-->
<!--        <component :is="currentTabComponent" class="tab"></component>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--import { mapGetters } from "vuex";-->
<!--import MessageList from "../game-chat/MessageList";-->

<!--export default {-->
<!--    name: "MessagePrivateChat",-->
<!--    components: {-->
<!--        MessageList,-->

<!--    },-->
<!--    data() {-->
<!--        return {-->
<!--            currentTab: "MessageList",-->
<!--            allUsers: "Чат",-->
<!--        };-->
<!--    },-->
<!--    computed: {-->
<!--        ...mapGetters([-->
<!--            "currentUser",-->
<!--            "gamePlayers",-->
<!--            "gameMessages",-->
<!--            "gameCells",-->
<!--        ]),-->
<!--        playersChatUsers() {-->
<!--            const players = this.gamePlayers.map(item => item.name);-->
<!--            console.log(this.allUsers);-->
<!--            return [this.allUsers, ...players];-->
<!--        },-->
<!--        currentTabComponent: function() {-->
<!--            return this.currentTab;-->
<!--        },-->
<!--    },-->
<!--};-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--.users {-->
<!--    display: flex;-->
<!--    padding-bottom: 30px;-->

<!--    &-list {-->
<!--        background: #202124;-->
<!--        border: 1px solid #000000;-->
<!--        padding: 6px;-->
<!--        margin-right: 9px;-->
<!--        width: 100%;-->

<!--        &:last-child {-->
<!--            margin-right: 0;-->
<!--        }-->
<!--    }-->
<!--}-->
<!--</style>-->
