<template>
    <div class="search-game">
        <h2 class="title">{{ $t('SEARCH_CREATE_GAME.Стандартная игра') }}</h2>
        <div class="players-wrapper">
            <span class="text">{{ $t('SEARCH_CREATE_GAME.Количество игроков') }}</span>
            <ul class="players-list">
                <li class="players-item">
                    <button class="players-btn"
                        :class="{ active: isCheckedAll }"
                        type="button"
                        @click.prevent="togglePlayersNumber"
                        :disabled="!!standardGameSearch">
                        {{ $t('SEARCH_CREATE_GAME.Любое') }}
                    </button>
                </li>
                <li class="players-item">
                    <label class="label" :class="{ disabled: standardGameSearch }">
                        <input class="players-btn"
                           type="checkbox"
                           :value="num"
                           v-model="players2"
                           @change="handlePlayersNumber"
                           :disabled="!!standardGameSearch"/>
                        <span class="checkmark">2</span>
                    </label>
                </li>
                <li class="players-item">
                    <label class="label" :class="{ disabled: standardGameSearch }">
                        <input class="players-btn"
                           type="checkbox"
                           :value="num"
                           v-model="players3"
                           @change="handlePlayersNumber"
                           :disabled="!!standardGameSearch"/>
                        <span class="checkmark">3</span>
                    </label>
                </li>
                <li class="players-item">
                    <label class="label" :class="{ disabled: standardGameSearch }">
                        <input class="players-btn"
                           type="checkbox"
                           :value="num"
                           v-model="players4"
                           @change="handlePlayersNumber"
                           :disabled="!!standardGameSearch"/>
                        <span class="checkmark">4</span>
                    </label>
                </li>
                <li class="players-item">
                    <label class="label" :class="{ disabled: standardGameSearch }">
                        <input class="players-btn"
                           type="checkbox"
                           :value="num"
                           v-model="players5"
                           @change="handlePlayersNumber"
                           :disabled="!!standardGameSearch"/>
                        <span class="checkmark">5</span>
                    </label>
                </li>
            </ul>
            <div v-if="isCanSearchGame" class="find-btn">
                <button key="btn1" v-if="!!this.standardGameSearch" class="search-game-btn search" type="button" @click.prevent="cancelSearch()">
                    {{ $t('SEARCH_CREATE_GAME.Идет поиск') }} ({{ timeFormatted }})
                </button>
                <button key="btn2" v-if="!this.standardGameSearch" class="search-game-btn" type="button" @click.prevent="handleStartSearch()">
                    {{ $t('SEARCH_CREATE_GAME.Найти игру!') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
/*
* Поменять num на к-во человек от (0, 5)
* Num Заглушка для checkbox
* */

    import moment from 'moment';
    import { mapGetters, mapActions } from 'vuex';

    let timer = null;

    export default {
        name: 'StandardGameSearchForm',
        data() {
            return {
                timeFormatted: '0:00',
                players2: false,
                players3: false,
                players4: false,
                players5: true,
                num: false,
            };
        },
        watch: {
            standardGameSearch: function (newValue, oldValue) {
                if (newValue == 1) {
                    this.initTimer();
                } else {
                    clearInterval(timer);
                }
            }
        },
        computed: {
            ...mapGetters([
                'currentGameUuid',
                'gameLobbyDetails',
                'standardGameSearchOptions',  // опции поиска: { "players": [ 4 ] } - на четверых игроков только
                'standardGameSearch',  // true|false - идет поиск стандартной игры или нет
                'standardGameSearchTime',  // время начала поиска
                'gameLobbyCreator'
            ]),
            selectedTypes: {
                get() {
                    return this.standardGameSearchOptions.players;
                },
                set(players) {
                    this.updateStandardGameSearchOptions({
                        players,
                    })
                }
            },
            isCheckedAll() {
                const selected = [ this.players2, this.players3, this.players4, this.players5 ];
                return selected.every(v => (v === true));
            },
            isnotCheckedAny() {
                const selected = [ this.players2, this.players3, this.players4, this.players5 ];
                return selected.every(v => (v === false));
            },
            isCanSearchGame() {
                return !this.gameLobbyDetails;
            }
        },
        methods: {
            ...mapActions([
                'updateStandardGameSearchOptions',
                'stopStandardGameSearch',
                'startStandardGameSearch',
                'updateStandardGameSearchTime',
                'updateCurrentGameUuid',
                'clearStandardGameSearchOptions'
            ]),
            pushTimer() {
                if (!this.standardGameSearch) {
                    clearInterval(timer);
                    return;
                }
                const now = moment(new Date()).utc().unix();
                const createdAt = moment(this.standardGameSearchTime).utc().unix();
                const time = now - createdAt;
                if (time < 3600) {
                    this.timeFormatted = moment.unix(time).utc().format("mm:ss");
                } else {
                    this.timeFormatted = moment.unix(time).utc().format("HH:mm:ss");
                }
            },
            initTimer() {
                if (this.standardGameSearch) {
                    clearInterval(timer);
                    if (this.standardGameSearchTime) {
                        this.pushTimer();
                        timer = setInterval(this.pushTimer, 1000);
                        if (this.standardGameSearchOptions) {
                            for (const pos of this.standardGameSearchOptions.players) {
                                this['players' + pos] = true
                            }
                        }
                    }
                }
            },
            handleStartSearch() {
                this.updateSelectedTypes();
                this.startStandardGameSearch().then(response => {
                    if (response.error) this.$dialog.alert(response.error);
                    if (response.redirect) {
                        this.$nextTick(() => {
                            this.$router.push(response.redirect);
                            this.clearStandardGameSearchOptions();
                            this.timeFormatted = '0:00';
                        });
                    }
                }).catch((err) => {
                    console.log(err, "ERROR");
                });
            },
            cancelSearch() {
                clearInterval(timer);
                this.stopStandardGameSearch().then(response => {
                    if (response.error) {
                        this.$dialog.alert(response.error);
                    } else {
                        this.$nextTick(() => {
                            this.timeFormatted = '0:00';
                        });
                    }
                });
            },
            handlePlayersNumber(e) {
                if (this.isnotCheckedAny) {
                    this.$nextTick(() => { // ядро не успевает поменять состояние элемента (не замечает, что произошли изменения данных)
                        this.players5 = true;
                        this.updateSelectedTypes();
                    });
                } else {
                    this.updateSelectedTypes();
                }
            },
            togglePlayersNumber() {
                if (this.isCheckedAll) {
                    this.players2 = false;
                    this.players3 = false;
                    this.players4 = false;
                } else {
                    this.players2 = true;
                    this.players3 = true;
                    this.players4 = true;
                }
                this.players5 = true;
                this.updateSelectedTypes();
            },
            updateSelectedTypes() {
                this.selectedTypes = [
                    this.players2 === true ? 2 : null,
                    this.players3 === true ? 3 : null,
                    this.players4 === true ? 4 : null,
                    this.players5 === true ? 5 : null
                ].filter(v => v);
            },
            retrieveSelectedTypes() {
                if (this.standardGameSearchTime) {
                    if (this.selectedTypes) {
                        for (let i = 2; i <=5; i++) {
                            this['players' + i] = this.selectedTypes.includes(i)
                        }
                    }
                }
            }
        },
        destroy() {
          clearInterval(timer);
        },
        mounted() {
            this.initTimer();
            this.retrieveSelectedTypes();
        },
    };
</script>


<style scoped lang="scss">
    .search-game {
        box-sizing: border-box;
        padding: 16px 56px 22px 36px;
        max-width: 684px;
        margin: 0 auto;
        background: #323639;
        border-color: #323639;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        @media only screen and (max-width: 1720px) {
            padding: 16px 20px 22px 20px;
            max-width: 560px;
        }
        @media only screen and (max-width: 1440px) {
            max-width: 684px;
        }
        @media only screen and (max-width: 1024px) {
            max-width: 540px;
        }
        /*@media only screen and (max-width: 1112px) {*/
        /*    width: 540px;*/
        /*    padding: 16px 15px 22px 15px;*/
        /*}*/

        .title {
            font-size: 22px;
            line-height: 22px;
            font-weight: 500;
            margin: 0 0 10px 0;
            padding: 0;
            color: #fff;
        }

        .players-wrapper {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .text {
                font-size: 16px;
                line-height: 16px;
                color: #fff;
            }
            .players-list {
                display: flex;
                align-items: center;
                list-style: none;
                margin: 0;
                padding: 0;

                .players-item {
                    .label {
                        margin: 0;

                        input {
                            display: none;
                        }
                        &.disabled {
                            span {
                                cursor: default;
                                color: #dad9db;
                                background: #7b7b7b;
                            }
                        }
                    }
                    .label input:checked ~ .checkmark {
                        background-color: #6A1ED5;
                    }
                    span {
                        cursor: pointer;
                        display: block;
                        padding: 10px 13px 10px 13px;
                        font-size: 15px;
                        line-height: 15px;
                        border: 1px solid #ADACAC;
                        border-right-width: 0;
                        color: #fff;
                        font-weight: 300;
                    }
                    &:last-child {
                        span {
                            border-radius: 0 5px 5px 0;
                            border-right-width: 1px;
                        }
                    }
                    .players-btn {
                        font-size: 15px;
                        line-height: 15px;
                        font-weight: 300;
                        background-color: transparent;
                        border: 1px solid #ADACAC;
                        border-radius: 5px 0 0 5px;
                        border-right-width: 0;
                        padding: 10px 24px 10px 20px;
                        color: #fff;
                        cursor: pointer;

                        &.active {
                            background-color: #6A1ED5;
                            color: #fff;
                        }
                        &:disabled {
                            cursor: default;
                            color: #dad9db;
                            background: #7b7b7b;
                        }
                    }
                }
            }
            .find-btn {
                width: 144px;

                .search-game-btn {
                    display: inline-block;
                    cursor: pointer;
                    padding: 0 10px;
                    height: 38px;
                    background: #24202C;
                    box-sizing: border-box;
                    border-radius: 3px;
                    font-size: 16px;
                    line-height: 16px;
                    border: 0;
                    font-weight: 400;
                }
                .search-game-btn:disabled:hover,
                .search-game-btn[disabled]:hover {
                    cursor: default;
                }
                button {
                    color: #fff;
                    background: #24202C;
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.14);
                    border-color: #dad9db;
                }
            }
        }
    }
</style>
