<template>
    <div class="game-lobby">
        <h3 v-if="!currentGameUuid && !gameStarting">
            {{ $t('SEARCH_CREATE_GAME.Новая игра') }}
            <span v-if="timeFormatted" class="timer">{{ $t('SEARCH_CREATE_GAME.Ожидание остальных участников') }}&nbsp;&nbsp;&nbsp;<b>{{ timeFormatted }}</b></span>
        </h3>
        <h3 v-if="!!gameStarting">
            {{ $t('SEARCH_CREATE_GAME.Старт игры') }}
        </h3>
        <h3 v-if="!!currentGameUuid && !gameStarting">
            {{ $t('SEARCH_CREATE_GAME.Эта игра уже началась, переходим в игру') }}
        </h3>

        <div class="players-slots">
            <div class="title">{{ $t('SEARCH_CREATE_GAME.Участники') }}</div>
            <div v-if="slotsList.length > 0" class="players">
                <div class="palyer" v-for="player in slotsList">
                    <div v-if="player" class="inner" :data-uuid="player.uuid">
                        <img class="crown" v-if="player.uuid == gameLobbyDetails.creator_uuid" :src="'/design/icons/crown-dark.svg'" alt="#"/>
                        <a href="#"
                            v-if="((startingCountdown > 2 && gameStarting == true) || gameStarting == false) && !!gameLobbyCreator && player.uuid !== gameLobbyDetails.creator_uuid"
                            class="exclude"
                            @click.prevent="handleExclude(player.uuid)"
                            :title="$t('SEARCH_CREATE_GAME.Исключить')"
                        >
                            <img src="/design/icons/cancel-dark.svg" alt="#"/>
                        </a>
                        <router-link class="open-profile" :title="$t('SEARCH_CREATE_GAME.Открыть профайл')" :to="{ name: 'user', params: { useruuid: player.uuid } }">
                            <img class="avatar" :title="player.fullname" :src="player.avatar" alt="#"/>
                            <div class="name">{{ player.fullname }}</div>
                        </router-link>
                    </div>
                    <div v-if="!player" class="inner">
                        <img class="avatar empty" src="/design/demo/profiles/unknown.png" alt="#"/>
                        <div class="empty-label">{{ $t('SEARCH_CREATE_GAME.Свободно') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="(!currentGameUuid || !!gameStarting) && rulesList.length > 0" class="rules">
            <div class="title">{{ $t('SEARCH_CREATE_GAME.Дополнительные правила') }}</div>
            <perfect-scrollbar>
                <ul class="list">
                    <li v-for="item in rulesList">
                        <img :title="$tt('GAME_OPTIONS.', item.name)" :src="item.image" alt="#"/>
                    </li>
                </ul>
            </perfect-scrollbar>
        </div>

        <div v-if="!!gameStarting" id="game-countdown" class="_play">
            <span class="seconds">{{startingCountdown}}</span>
        </div>

        <div class="button" v-if="!currentGameUuid && ((startingCountdown > 2 && gameStarting == true) || gameStarting == false)">
            <a v-if="!!gameLobbyCreator" class="cancel-game" href="#" @click.prevent="handleCancelGame">{{ $t('GENERAL.Отменить') }}</a>
            <a v-if="!gameLobbyCreator" class="cancel-game" href="#" @click.prevent="handleLeave">{{ $t('SEARCH_CREATE_GAME.Покинуть') }}</a>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import gameOptionsSource from '@/../config/game-options-source';
    import moment from 'moment';

    let timer = null;

    export default {
        name: 'GameLobby',
        data() {
            return {
                timeFormatted: null
            };
        },
        computed: {
            ...mapGetters([
                'currentUser',
                'gameLobbyCreator',
                'gameLobbyDetails',
                'gameStarting',
                'startingCountdown',
                'currentGameUuid'
            ]),
            slotsList() {
                const slots = [];
                if (this.gameLobbyDetails && this.gameLobbyDetails.players && this.gameLobbyDetails.playersNumber) {
                    for (const p of this.gameLobbyDetails.players) {
                        slots.push(p);
                    }
                    const emptySlots = this.gameLobbyDetails.playersNumber - slots.length;
                    if (emptySlots > 0) {
                        for (let i = 0; i < emptySlots; i++) {
                            slots.push(null);
                        }
                    }
                }
                return slots;
            },
            rulesList() {
                const options = this.gameLobbyDetails ? (this.gameLobbyDetails.options || []) : [];
                const items = [];
                for (const k of options) {
                    items.push(gameOptionsSource[k]);
                }
                return items;
            }
        },
        methods: {
            ...mapActions([
                'cancelCreateGame',
                'setGameStarted',
                'excludePlayer',
                'leaveGameLobby',
            ]),
            pushTimer() {
                if (!this.gameLobbyDetails || !!this.currentGameUuid) {
                    clearInterval(timer);
                    return;
                }
                const now = moment(new Date()).utc().unix();
                const time = now - this.gameLobbyDetails.created_at;
                if (time < 3600) {
                    this.timeFormatted = moment.unix(time).utc().format("mm:ss");
                } else {
                    this.timeFormatted = moment.unix(time).utc().format("HH:mm:ss");
                }
            },
            initTimer() {
                if (!this.currentGameUuid && this.gameStarting === false && this.gameLobbyDetails !== null && this.gameLobbyDetails.created_at) {
                    clearInterval(timer);
                    this.pushTimer();
                    timer = setInterval(this.pushTimer, 1000);
                }
            },
            handleCancelGame() {
                // todo отменить можно до тех пор, пока счетчик не ниже 3с
                clearInterval(timer);
                this.cancelCreateGame();
            },
            handleExclude(uuid) {
                this.excludePlayer(uuid).then(response => {
                    if (response.error) this.$dialog.alert(response.error);
                });
            },
            handleLeave() {
                clearInterval(timer);
                this.leaveGameLobby().then(response => {
                    if (response.error) this.$dialog.alert(response.error);
                });
            }
        },
        watch: {
            gameLobbyDetails: function(o, n) {
                if (n.countdown) {
                    // начался обратный отсчет
                    this.timeFormatted = null;
                    clearInterval(timer);
                    const element = document.getElementById('game-countdown');
                    element && element.classList.add('play');
                }
            }
        },
        mounted() {
            if (!!this.currentGameUuid) {
                this.timeFormatted = null;
                clearInterval(timer);
                // если игра уже запущена, просто перекидываем на страницу игры
                this.$router.push('/game/' + this.currentGameUuid);
            } else {
                this.initTimer();
            }
        },
        updated() {
            this.initTimer();
        }
    };
</script>

<style scoped lang="scss">
    @keyframes scale-in-center {
        0% {
            transform: scale(0.2);
            opacity: 0.5;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    $widgetWidth: 812px;

    .game-lobby {
        flex-basis: $widgetWidth;
        padding: 12px 20px;
        position: relative;

        h3 {
            font-size: 14px;
            line-height: 14px;
            margin-bottom: 8px;
            color: #fff;

            .timer {
                float: right;
                color: #fff;
                font-size: 12px;

                b {
                    color: #7D33E4;
                }
            }
        }
        .players-slots {
            .title {
                font-size: 13px;
                color: #fff;
                text-align: center;
                margin: 20px 0 10px 0;
            }
            .players {
                display: flex;
                justify-content: space-around;
                margin: 0;
                padding: 0;
                text-align: center;

                .palyer {
                    $innerPadding: 10px;
                    $picSize: ($widgetWidth - 40px) / 8;
                    $picBorderWidth: 2px;
                    position: relative;

                    .inner {
                        padding: $innerPadding;
                        border-radius: 4px;
                        border: 2px solid #24202C;

                        .crown {
                            $crownSize: 20px;
                            position: absolute;
                            top: -8px;
                            left: (($picSize + ($innerPadding * 2)) / 2) - (($crownSize / 2) - $picBorderWidth);
                            height: $crownSize;
                        }
                        .exclude {
                            $btnSize: $picSize / 3;
                            display: block;
                            position: absolute;
                            bottom: -6px;
                            right: -6px;
                            height: $btnSize;
                            width: $btnSize;

                            img {
                                background-color: #fff;
                                border-radius: $btnSize;
                            }
                        }
                        .open-profile {
                            outline: none;
                            text-decoration: none;
                        }
                        .name {
                            font-size: 12px;
                            font-weight: 500;
                            color: #fff;
                        }
                        .empty-label {
                            font-size: 12px;
                            font-weight: 500;
                            color: #bdbdbd;
                        }
                        .avatar {
                            display: block;
                            width: $picSize;
                            background-color: #f3f3f3;
                            border-radius: ($picSize / 2);
                            margin-bottom: 6px;
                            border: 2px solid #a9a9a9;

                            &.empty {
                                border: none;
                            }
                        }
                    }
                }
            }
        }
        .rules {
            height: 120px;

            .ps {
                height: 120px;
            }
            .title {
                font-size: 13px;
                color: #fff;
                text-align: center;
                margin: 20px 0 10px 0;
            }
            .list {
                list-style: none;
                margin: 0;
                padding: 0;
                text-align: center;

                li {
                    display: inline-block;
                    margin: 0 5px;

                    img {
                        height: 52px;
                    }
                }
            }
        }
        .dots {
            text-align: center;
        }
        .button {
            position: absolute;
            bottom: 22px;
            left: 0;
            right: 0;
            text-align: center;

            .create-game, .cancel-game {
                display: inline-block;
                background-color: #E9E9E9;
                font-size: 10px;
                width: 80px;
                height: 25px;
                border-radius: 2px;
                color: #000;
                outline: none;
                line-height: 25px;
                text-decoration: none;
            }
        }

        #game-countdown {
            position: absolute;
            left: 50%;
            margin-left: -50px;
            text-align: center;
            top: 44%;
            width: 100px;
            height: 100px;
            color: #d04646;
            background-color: transparent;
            display: flex;
            align-items: center;
            justify-content: center;

            &.play .seconds {
                font-size: 70px;
                line-height: 1.2;
                font-weight: 600;
                text-shadow:
                     -1px -1px 0 #fff,
                     1px -1px 0 #fff,
                     -1px 1px 0 #fff,
                     1px 1px 0 #fff;
                 // -webkit-text-stroke: 1px #fff;
                // animation: animation-name animation-duration animation-timing-function animation-delay animation-iteration-count animation-direction;
                // animation: scale-in-center 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both infinite;
                animation: scale-in-center 1s ease-out both infinite;
                // animation: scale-in-center 1s ease-out none 1;
            }
        }
    }
</style>
