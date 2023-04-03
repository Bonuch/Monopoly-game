<template>

    <!-- TODO это для будущей версии, не удалять -->

    <main class="mainblock" :class="currentColorSchema">
        <Banner />

        <nav class="searchgame">
            <h2 class="title">Поиск игры</h2>
            <div class="game-type">
                <div class="label">Тип</div>
                <ul class="styled-checkers types-list">
                    <li class="item">
                        <label class="label">
                            <input class="ch-input" type="radio" value="any" v-model="gameType"/>
                            <span class="checkmark">Любая</span>
                        </label>
                    </li>
                    <li class="item">
                        <label class="label">
                            <input class="ch-input" type="radio" value="standard" v-model="gameType"/>
                            <span class="checkmark">Стандартная</span>
                        </label>
                    </li>
                    <li class="item">
                        <label class="label">
                            <input class="ch-input" type="radio" value="custom" v-model="gameType"/>
                            <span class="checkmark">Нестандартная</span>
                        </label>
                    </li>
                </ul>
            </div>
            <vue-slide-up-down :active="gameType === 'custom'" :duration="300">
                <div class="game-options">
                    <perfect-scrollbar>
                        <label v-for="opt in optionsList" class="options-item" :class="{checked: selectedGameOptions[opt.id]}">
                            <span class="img">
                                <img :src="opt.image" :title="$tt('GAME_OPTIONS.', opt.name)" />
                            </span>
                            <input type="checkbox" v-model="selectedGameOptions[opt.id]" :value="opt.id"/>
                        </label>
                    </perfect-scrollbar>
                </div>
            </vue-slide-up-down>
            <div class="players">
                <span class="label">Количество игроков</span>
                <ul class="styled-checkers players-list">
                    <li class="item">
                        <label class="label">
                            <input @change="togglePlayersCount()" class="ch-input" type="checkbox" value="0" v-model.number="selectedSlots"/>
                            <span class="checkmark">Любое</span>
                        </label>
                    </li>
                    <li class="item" v-for="num in playerOptions">
                        <label class="label">
                            <input  @change="checkPlayers()" class="ch-input" type="checkbox" :value="num" v-model.number="selectedSlots"/>
                            <span class="checkmark">{{ num }}</span>
                        </label>
                    </li>
                </ul>
            </div>
            <div class="friend">
                <div class="label">Друг в игре</div>
                <ul class="styled-checkers friend-involved">
                    <li class="item">
                        <label class="label">
                            <input class="ch-input" type="radio" value="0" v-model="friendInGame"/>
                            <span class="checkmark">Не важно</span>
                        </label>
                    </li>
                    <li class="item">
                        <label class="label">
                            <input class="ch-input" type="radio" value="1" v-model="friendInGame"/>
                            <span class="checkmark">Да</span>
                        </label>
                    </li>
                </ul>
            </div>
            <div class="game-status">
                <div class="label">Игра уже началась</div>
                <ul class="styled-checkers">
                    <li class="item">
                        <label class="label">
                            <input class="ch-input" type="radio" value="0" v-model="startedGamesOnly"/>
                            <span class="checkmark">Нет</span>
                        </label>
                    </li>
                    <li class="item">
                        <label class="label">
                            <input class="ch-input" type="radio" value="1" v-model="startedGamesOnly"/>
                            <span class="checkmark">Да</span>
                        </label>
                    </li>
                </ul>
            </div>
        </nav>

<!--        <Games ref="games"/>-->
    </main>
</template>

<script>
    import { mapGetters } from 'vuex';
    import Games from '@/components/game-lobby/GameListWidget.vue';
    import Banner from "@/components/site/Banner";
    import gameOptionsSource from '@/../config/game-options-source';

    export default {
        name: "Play",
        components: {
            Games,
            Banner
        },
        data() {
            return {
                playerOptions: [2, 3, 4, 5],
                selectedSlots: [2],
                gameType: 'any',
                friendInGame: 0,
                selectedGameOptions: {},
                startedGamesOnly: 0,
            };
        },
        computed: {
            ...mapGetters([
                'currentColorSchema'
            ]),
            optionsList() {
                const list = [];
                for (const k of Object.keys(gameOptionsSource)) {
                    list.push(gameOptionsSource[k]);
                }
                return list;
            }
        },
        mounted() {
            this.updateLobbyStatus();
        },
        methods: {
            togglePlayersCount() {
                if (this.selectedSlots.includes(0)) {
                    this.selectedSlots = [0, 2, 3, 4, 5];
                } else {
                    this.selectedSlots = [5];
                }
            },
            checkPlayers() {
                this.selectedSlots = this.selectedSlots.filter(v => v !== 0);
                if (this.selectedSlots.length === 0) {
                    this.selectedSlots = [5];
                }
                if (this.selectedSlots.length === 4) {
                    this.selectedSlots.push(0);
                }
            },
            updateLobbyStatus(callback = null) {

            }
        }
    };
</script>


<style scoped lang="scss">
    .mainblock {
        color: #000;

        .searchgame {
            padding: 10px 35px 14px;
            max-width: 460px;
            margin: 0 auto;
            width: 100%;
            background: linear-gradient(0deg, #FFFFFF, #FFFFFF), #323639;
            border: 1px solid #E6E6E6;
            border-radius: 8px;

            .title {
                font-size: 14px;
                line-height: 17px;
                font-weight: 500;
            }
            .game-type,
            .players,
            .game-status,
            .friend {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;

                .label {
                    font-size: 12px;
                    line-height: 12px;
                }
            }
            .styled-checkers {
                display: flex;
                align-items: center;
                list-style: none;
                margin: 0;
                padding: 0;

                .item {
                    .label {
                        margin: 0;

                        input {
                            display: none;
                        }
                        &.disabled {
                            span {
                                cursor: default;
                                color: rgba(0, 0, 0, 0.247);
                            }
                        }
                    }
                    .label input:checked ~ .checkmark {
                        background-color: #6A1ED5;
                        color: #fff;
                    }
                    span {
                        cursor: pointer;
                        display: block;
                        padding: 8px 10px 10px 10px;
                        font-size: 10px;
                        line-height: 12px;
                        border: 1px solid #ADACAC;
                        border-right-width: 0;
                    }
                    &:last-child {
                        span {
                            border-radius: 0 5px 5px 0;
                            border-right-width: 1px;
                        }
                    }
                    &:first-child {
                        span {
                            border-radius: 5px 0 0 5px;
                        }
                    }
                }
            }
            .game-options {
                height: 90px;
                margin: 0 0 6px 0;

                .ps {
                    height: 90px;
                    text-align: left;
                }
                .options-item {
                    display: inline-block;
                    margin: 3px;
                    padding: 0;
                    cursor: pointer;

                    .img {
                        display: inline-block;
                        position: relative;

                        img {
                            display: inline-block;
                            height: 40px;
                            width: 40px;
                        }
                    }
                    &.checked .img::before {
                        display: block;
                        position: absolute;
                        top: -1px;
                        right: 2px;
                        content: "";
                        width: 9px;
                        height: 9px;
                        background: url(/design/icons/checkbox-black.svg) left top no-repeat;
                    }
                    &:hover {
                        background-color: #f1f1f1;
                        border-radius: 4px;
                    }
                    input {
                        position: absolute;
                        opacity: 0;
                    }
                }
            }
        }

        &.dark {
            .bannner-block {
                color: #fff;
            }
            .searchgame {
                background: #323639;
                border-color: #323639;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);

                .title {
                    color: #fff;
                }
                .label {
                    color: #fff;
                }
            }
            .game-options {
                .options-item {
                    &:hover {
                        background-color: #464545;
                    }
                    &.checked .img::before {
                        background: url(/design/icons/checkbox-purple.svg) left top no-repeat;
                    }
                }
            }
        }
    }
</style>
