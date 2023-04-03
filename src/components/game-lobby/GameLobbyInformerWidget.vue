<template>
    <div v-if="!!gameLobbyDetails && !gameLobbyWidget && !currentGameUuid" class="game-lobby-informer" :class="currentColorSchema">
        <div v-if="!gameStarting" class="title">
            {{ $t('SEARCH_CREATE_GAME.Новая игра') }}
            <span class="timer">{{ timeFormatted }}</span>
        </div>
        <div v-if="gameStarting" class="title">
            {{ $t('SEARCH_CREATE_GAME.Старт игры') }}
            <span class="timer">{{ gameStarting }}</span>
        </div>

        <div class="players-slots">
            <div v-if="slotsList.length > 0" class="players">
                <div class="chip" v-for="player in slotsList">
                    <div v-if="player" class="inner" :data-uuid="player.uuid">
                        <img class="crown" v-if="player.uuid == gameLobbyDetails.creator_uuid" :src="'/design/icons/crown-'+currentColorSchema+'.svg'" alt=""/>
                        <router-link class="open-profile" :title="$t('SEARCH_CREATE_GAME.Открыть профайл')" :to="{ name: 'user', params: { userid: player.id } }">
                            <img class="avatar" :title="player.fullname" :src="player.avatar"/>
                        </router-link>
                    </div>
                    <div v-if="!player" class="inner">
                        <img class="avatar empty" title="" src="/design/demo/profiles/unknown.png"/>
                    </div>
                </div>
                <div v-if="!!gameLobbyCreator && !gameStarting && !currentGameUuid" class="ctl-btn">
                    <a href="#" class="cancel" @click.prevent="handleCancelGame" :title="$t('GENERAL.Отменить игры')">
                        <img :src="'/design/icons/cancel-'+currentColorSchema+'.svg'" alt="" />
                    </a>
                </div>
                <div v-if="!gameLobbyCreator && !gameStarting && !currentGameUuid" class="ctl-btn">
                    <a href="#" class="exit" @click.prevent="handleLeave" :title="$t('SEARCH_CREATE_GAME.Покинуть игру')">
                        <img :src="'/design/icons/exit-'+currentColorSchema+'.svg'" alt="" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import { mapGetters, mapActions } from 'vuex';

    let timer = null;

    export default {
        name: 'GameLobbyInformerWidget',
        components: {

        },
        data() {
            return {
                timeFormatted: '0:00',
                timeToStart: 10,
            };
        },
        computed: {
            ...mapGetters([
                'currentUser',
                'currentColorSchema',
                'gameLobbyCreator',
                'gameLobbyDetails',
                'currentGameUuid',
                'gameLobbyWidget',
                'gameStarting',
            ]),
            slotsList() {
                const slots = [];
                if (this.gameLobbyDetails && this.gameLobbyDetails.players) {
                    for (const p of this.gameLobbyDetails.players) {
                        slots.push(p);
                    }
                }
                const emptySlots = this.gameLobbyDetails.playersNumber - slots.length;
                if (emptySlots > 0) {
                    for (let i = 0; i < emptySlots; i++) {
                        slots.push(null);
                    }
                }
                return slots;
            },
        },
        methods: {
            ...mapActions([
                'cancelCreateGame',
                'leaveGameLobby',
            ]),
            pushTimer() {
                if (!this.gameLobbyDetails) {
                    clearInterval(timer);
                    return;
                }
                const now = moment(new Date()).utc().unix();
                const createdAt = moment(this.gameLobbyDetails.created_at).utc().unix();
                const time = now - createdAt;
                if (time < 3600) {
                    this.timeFormatted = moment.unix(time).utc().format("mm:ss");
                } else {
                    this.timeFormatted = moment.unix(time).utc().format("HH:mm:ss");
                }
            },
            initTimer() {
                if (!this.currentGameUuid) {
                    clearInterval(timer);
                    if (this.gameLobbyDetails && this.gameLobbyDetails.created_at) {
                        this.pushTimer();
                        timer = setInterval(this.pushTimer, 1000);
                    }
                }
            },
            handleCancelGame() {
                clearInterval(timer);
                this.cancelCreateGame();
            },
            handleLeave() {
                clearInterval(timer);
                this.leaveGameLobby().then(response => {
                    if (response.error) this.$dialog.alert(response.error);
                });
            }
        },
        mounted() {
            this.initTimer();
        },
        updated() {
            this.initTimer();
        }
    };
</script>

<style scoped lang="scss">
    $widgetWidth: 300px;

    .game-lobby-informer {
        padding: 10px 0 0 0;

        .title {
            font-size: 12px;
            color: #000;
        }
        .players-slots {
            width: 100%;
            padding: 4px 20px;

            .players {
                $innerPadding: 2px;
                $picSize: ($widgetWidth / 10);
                $picBorderWidth: 1px;

                margin: 0;
                padding: 0;
                text-align: center;
                display: flex;
                justify-content: center;

                .chip {
                    position: relative;

                    .inner {
                        padding: $innerPadding;
                        .crown {
                            $crownSize: 20px;
                            position: absolute;
                            top: -8px;
                            left: (($picSize + ($innerPadding * 2)) / 2) - (($crownSize / 2) - $picBorderWidth);
                            height: $crownSize;
                        }
                        .open-profile {
                            outline: none;
                            text-decoration: none;
                        }
                        .avatar {
                            display: block;
                            width: $picSize;
                            height: $picSize;
                            background-color: #f3f3f3;
                            border: $picBorderWidth solid #000;
                            border-radius: ($picSize / 2);

                            &.empty {
                                border: none;
                            }
                        }
                    }
                }
                .ctl-btn {
                    a {
                        display: block;
                        padding: $innerPadding + 3px;

                        img {
                            display: block;
                            width: $picSize - 6px;
                            height: $picSize - 6px;
                            box-sizing: content-box;
                        }
                    }
                }
            }
        }
        .timer {

        }

        &.dark {
            .title {
                color: #fff;
            }
            .players-slots {
                .players {
                    .chip {
                        .inner {
                            .name {
                                color: #fff;
                            }
                            .avatar:not(.empty) {
                                border: 2px solid #a9a9a9;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
