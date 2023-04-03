<template>
    <div class="game-item" :class="{private: game.inviteOnly, smallIcons: (slotsList.length > 4)}">
        <p class="block-info">{{ $t('GENERAL.Игроки') }} <span v-if="isThisGameLobbyOwner" class="item-status">Ожидаем</span></p>
        <div class="players">
            <div class="chip" v-for="player in slotsList">
                <div v-if="player" class="inner" :data-uuid="player.uuid">
                    <img class="avatar" :title="player.fullname" :src="player.avatar"/>
                </div>
                <div v-if="!player" class="inner">
                    <div class="empty" v-if="game.inviteOnly"><img src="/design/icons/lock2-dark.svg" alt=""></div>
                    <div class="empty" v-else><i></i><span>+</span></div>
<!--                    <img class="avatar empty" title="" src="/design/demo/profiles/unknown.png"/>-->
                </div>
            </div>
        </div>
        <p class="block-info">{{ $t('SEARCH_CREATE_GAME.Правила') }}</p>
        <div v-if="rulesList.length > 0" class="rule-wrapper" :class="{alignLeft: (rulesList.length !== 4)}">

            <div class="rule-container">
                <div class="rule-item" v-for="rule in rulesList" :class="{small: (rulesList.length <= 4)}">
                    <span class="num" v-if="rule.id === '-more-'">{{ rule.description }}</span>
                    <img :title="$tt('GAME_OPTIONS.', rule.name)" :src="rule.image"/>
                </div>
            </div>
<!--            <ul class="list" :class="{small: (rulesList.length <= 4)}">-->
<!--                <li v-for="rule in rulesList">-->
<!--                    <span class="num" v-if="rule.id === '-more-'">{{ rule.description }}</span>-->
<!--                    <img :title="$tt('GAME_OPTIONS.', rule.name)" :src="rule.image"/>-->
<!--                </li>-->
<!--            </ul>-->
        </div>
        <div class="actions">
            <a v-if="joinedToGameLobby && !isThisGameLobbyOwner && isAnyGameLobbyOwner" href="#" class="a-btn join-a-game inactive"
               @click.prevent="false;"><span><i></i> {{ $t('GENERAL.Войти') }}</span></a>
            <a v-if="!joinedToGameLobby && !isThisGameLobbyOwner && !isAnyGameLobbyOwner" href="#" class="a-btn join-a-game"
               @click.prevent="joinToGame(game.creator_uuid)"><span><i></i> {{ $t('GENERAL.Войти') }}</span></a>

            <a v-if="joinedToGameLobby && !isThisGameLobbyOwner && !isAnyGameLobbyOwner" href="#" class="a-btn join-a-game" @click.prevent="leaveGame()">{{ $t('GENERAL.Выйти') }}</a>

            <a v-if="isThisGameLobbyOwner" href="#" class="a-btn join-a-game in-lobby"
               @click.prevent="enterToGame(game.creator_uuid)">{{ $t('SEARCH_CREATE_GAME.Перейти') }}</a>
        </div>
    </div>
</template>

<script>
    import gameOptionsSource from '@/../config/game-options-source';
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'GameItem',
        props: {
            game: {
                type: Object,
                required: true
            }
        },
        computed: {
            ...mapGetters([
                'currentColorSchema',
                'gameLobbyDetails',
                'currentUser',
                'gameLobbyCreator',
            ]),
            joinedToGameLobby() {
                if (this.gameLobbyDetails && this.gameLobbyDetails.players) {
                    return this.gameLobbyDetails.players.some(p => (p.uuid === this.currentUser.uuid));
                }
                return false;
            },
            isThisGameLobbyOwner() {
                if (this.gameLobbyDetails && this.gameLobbyDetails.players) {
                    return this.gameLobbyDetails.players.some(p => (p.uuid === this.game.creator_uuid));
                }
                return false;
            },
            isAnyGameLobbyOwner() {
                return !!this.gameLobbyCreator;
            },
            slotsList() {
                const slots = [];
                if (this.game.players) {
                    for (const p of this.game.players) {
                        slots.push(p);
                    }
                }
                const emptySlots = this.game.playersNumber - slots.length;
                if (emptySlots > 0) {
                    for (let i = 0; i < emptySlots; i++) {
                        slots.push(null);
                    }
                }
                return slots;
            },
            rulesList() {
                const options = this.game.options || [];
                const rulesList = [];
                for (const k of options) {
                    rulesList.push(gameOptionsSource[k]);
                }
                return rulesList;
            }
        },
        mounted() {

        },
        methods: {
            ...mapActions([
                'joinToGameLobby',
                'leaveGameLobby',
            ]),
            joinToGame(creatorUuid) {
                this.joinToGameLobby(creatorUuid).then(response => {
                    if (!response.error) {
                        if (response.redirect) {
                            this.$router.push(response.redirect);
                        }
                    } else {
                        this.$dialog.alert(response.error);
                    }
                });
            },
            enterToGame() {
                if (this.$router.history.current.path !== `/play/new-game`) {
                    this.$router.push(`/play/new-game`);
                }
            },
            leaveGame() {
                this.leaveGameLobby();
            }
        }
    }
</script>

<style scoped lang="scss">
.rule {
    //&-wrapper {
    //    margin: 0px -15px 0px -15px;
    //}
    &-container {
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        padding: 0px 11px;
        margin: 6px -4px 4px -4px;
    }
    &-item {
        box-sizing: border-box;
        width: 20%;
        margin-bottom: 2px;
        padding: 0 4px;
        &.small {
            width: 25%;
            padding: 0 8px;
        }
    }
}
.block-info {
    .item-status {
        color: #3081E1;
    }
    display: flex;
    justify-content: space-between;
    margin: 0 13px;
    color: #fff;
    font-weight: 400;
    text-align: left;
    text-shadow:
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
}
.in-lobby {
    background: #6A1ED5 !important;
}
    .game-item {
        order: 0;
        flex: 0 1 250px;
        align-self: auto;
        background-color: #323639;
        width: 250px;
        border-radius: 12px;
        box-sizing: border-box;
        margin-bottom: 20px;
        border: 1.5px solid rgba(39, 39, 39, 0.5);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.25);
        transition: .1s;
        padding: 16px 5px;

        &:hover {
            border: 1.5px solid #4F4F4F;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.25);
        }

        .title1 {
            font-weight: 300;
            font-size: 15px;
            text-align: left;
            line-height: 15px;
            margin: 7px 0 0 14px;
            color: #fff;
        }
        .players {
            text-align: center;
            display: flex;
            justify-content: left;
            margin: 0 8px;
            margin: 5px 10px 6px 10px;

            .chip {
                position: relative;
                margin: 0 5px;

                .inner {
                    display: block;
                    width: 42px;
                    height: 42px;
                    overflow: hidden;

                    .avatar {
                        display: block;
                        width: 42px;
                        border: 3px solid #000;
                        border-radius: 100px;
                        background-color: #f3f3f3;
                        box-sizing: border-box;
                    }
                    .empty {
                        width: 42px;
                        height: 42px;
                        font-size: 20px;
                        line-height: 40px;
                        border-radius: 100px;
                        background: radial-gradient(50% 50% at 50% 50%, rgba(216, 216, 216, 0) 0%, #D8D8D8 74.48%);
                        color: #fff;
                        text-align: center;
                        i {
                            display: none;
                        }
                    }
                }
            }
        }
        .rules {
            .title2 {
                font-weight: 300;
                font-size: 15px;
                color: #fff;
                text-align: left;
                margin: 2px 0 0 14px;
            }
            .list {
                list-style: none;
                margin: 9px 10px;
                //margin: 5px 0 5px 10px;
                padding: 0;
                text-align: left;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                li {
                    position: relative;
                    display: inline-block;
                    margin: 0 5px 5px 0;

                    .num {
                        font-size: 10px;
                        position: absolute;
                        top: 6px;
                        left: 8px;
                        z-index: 100;
                    }
                    img {
                        display: block;
                        height: 42px;
                        width: 42px;
                    }
                }
                &.small {
                    margin-left: 10px;
                    li {
                        margin: 0px 6px 0px 0px;
                        //margin: 9px 9px 6px 0px;
                        //margin: 0 14px 5px 0;

                        img {
                            display: block;
                            height: 42px;
                            width: 42px;
                        }
                        &:last-child {
                            margin-right: 12px;
                        }
                    }
                }
            }
            &.alignLeft {
                .list {
                    justify-content: left;
                }
            }
        }
        .actions {
            //margin-bottom: 6px;

            .a-btn {
                display: inline-block;
                width: 134px;
                background: #24202C;
                box-sizing: border-box;
                border-radius: 3px;
                line-height: 32px;
                font-size: 15px;
                color: #fff;
                text-decoration: none;
                outline: none;
                transition: .1s;
                box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.13);


                &.inactive {
                    background: rgba(36, 32, 44, 0.47);
                }
                &:hover {
                    background: #381B66;
                }
            }
        }
        &.smallIcons {
            .players {
                margin: 5px 10px 6px 10px;
                justify-content: space-between;

                .chip {
                    margin: 0;

                    .inner {
                        width: 42px;
                        height: 42px;

                        .avatar {
                            width: 42px;
                        }

                        .empty {
                            width: 42px;
                            height: 42px;
                            font-size: 20px;
                            line-height: 40px;
                        }
                    }
                }
            }
            .rules {
                .title2 {
                    margin: 10px 0 0 14px;
                }
            }
        }
        &.private {
            .actions {
                .a-btn {
                    span {
                        display: inline-block;
                        position: relative;

                        i {
                            position: absolute;
                            top: 6px;
                            left: -18px;
                            display: block;
                            height: 18px;
                            width: 14px;
                            background: url(/design/icons/lock2-dark.svg) center center no-repeat;
                        }
                    }
                }
            }
            .players {
                .chip {
                    .inner {
                        .empty {
                            border: 2.5px solid #fff;
                            box-sizing: border-box;
                            background: radial-gradient(50% 50% at 50% 50%, rgba(184, 177, 7, 0.53) 0%, #F1E817 100%);
                            span {
                                //display: none;
                            }
                            i {
                                display: inline-block;
                                height: 24px;
                                width: 18px;
                                background: url(/design/icons/lock2-dark.svg) center center no-repeat;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
