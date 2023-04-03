<template>
    <div class="left">
        <h3>{{ $t('SEARCH_CREATE_GAME.Новая игра') }}</h3>

        <div class="options-line">
            <span class="label w1">{{ $t('SEARCH_CREATE_GAME.Количество игроков') }}</span>
            <span class="options">
                <label v-for="k in playersNumber" class="players-checkbox" :class="[optionsPlayers === k ? 'checked' : '', {disabled: !!gameLobbyDetails}]">
                    <input class="checkbox" type="radio" name="players" :value="k" v-model.number="optionsPlayers" :disabled="!!gameLobbyDetails"/>
                    <i>{{ k }}</i>
                </label>
            </span>
        </div>
        <div class="options-line" v-if="hasMutations">
            <span class="label">{{ $t('SEARCH_CREATE_GAME.Мутация недели') }} <i title="Тут будет подсказка">?</i></span>
            <span class="options">
                <label class="switcher" :class="[isWeeklyMutation ? 'yes' : 'no', {disabled: !!gameLobbyDetails}]">
                    <input type="checkbox" name="isWeeklyMutation" value="isWeeklyMutation" v-model.boolean="isWeeklyMutation" :disabled="!!gameLobbyDetails"/>
                </label>
            </span>
        </div>
        <div class="options-line">
            <span class="label">{{ $t('SEARCH_CREATE_GAME.Только по приглашению') }}</span>
            <span class="options">
                <label class="switcher" :class="[inviteOnly ? 'yes' : 'no', {lock: !currentUser.is_vip, disabled: !!gameLobbyDetails}]">
                    <input type="checkbox" name="invite" value="invite" v-model.boolean="inviteOnly" :disabled="!currentUser.is_vip || !!gameLobbyDetails"/>
                </label>
            </span>
        </div>
        <div class="options-line">
            <span class="label">{{ $t('SEARCH_CREATE_GAME.Дополнительные правила') }}</span>
            <span class="options">
                <label class="switcher" :class="[addRules ? 'yes' : 'no', {lock: !currentUser.is_vip, disabled: !!gameLobbyDetails}]">
                    <input @change="toggleGameOptions" type="checkbox" name="addRules" value="addRules" v-model.number="addRules" :disabled="!currentUser.is_vip || !!gameLobbyDetails"/>
                </label>
            </span>
        </div>
        <vue-slide-up-down :active="addRules" :duration="300">
            <div class="game-options">
                <perfect-scrollbar>
                    <label v-for="opt in optionsList" class="options-item" :class="{checked: selectedGameOptions[opt.id], disabled: !!gameLobbyDetails}">
                        <span class="img">
                            <img :src="opt.image" />
                        </span>
                        <span class="info">
                            <span class="name">{{ $tt('GAME_OPTIONS.', opt.name) }}</span>
                            <span class="description">{{ $tt('GAME_OPTIONS.', opt.description) }}.</span>
                            <input @change="checkRequirements" type="checkbox" v-model="selectedGameOptions[opt.id]" :value="opt.id" :disabled="!!gameLobbyDetails"/>
                        </span>
                    </label>
                </perfect-scrollbar>
            </div>
        </vue-slide-up-down>
        <div class="dots" v-if="addRules"><img src="/design/icons/dots-more.svg" alt=""/></div>
        <div class="button" v-if="!currentGameUuid">
            <a v-if="!gameLobbyDetails" class="create-game" href="#" @click.prevent="handleCreateGame" title="">{{ $t('SEARCH_CREATE_GAME.Создать') }}</a>
            <a v-if="!!gameLobbyDetails && !!gameLobbyCreator" class="cancel-game" href="#" @click.prevent="handleCancelGame" title="">{{ $t('GENERAL.Отменить') }}</a>
        </div>
        <div class="no-vip-message" v-if="!currentUser.is_vip">
            *&nbsp;&nbsp;<img src="/design/icons/lock-dark.svg" alt=""/>&nbsp;&nbsp;{{ $t('SEARCH_CREATE_GAME.Доступно только Премиум аккаунтам') }}
        </div>
    </div>
</template>

<script>
    import gameOptionsSource from '@/../config/game-options-source';
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'GameForm',
        props: {
            setAlert: {
                type: Function,
                required: true,
            }
        },
        data() {
            return {
                playersNumber: [2, 3, 4, 5],
                isWeeklyMutation: false,
                addRules: false,
                optionsPlayers: 5,
                inviteOnly: false,
                selectedGameOptions: {},
                alert: ''
            };
        },
        computed: {
            ...mapGetters([
                'currentUser',
                'gameWeeklyMutation',
                'gameLobbyCreator',
                'gameLobbyDetails',
                'currentGameUuid',
            ]),
            hasMutations() {
                return (this.gameWeeklyMutation.mutationsList && this.gameWeeklyMutation.mutationsList.length > 0);
            },
            optionsList() {
                const list = [];
                for (const k of Object.keys(gameOptionsSource)) {
                    list.push(gameOptionsSource[k]);
                }
                return list;
            }
        },
        methods: {
            ...mapActions([
                'getWeeklyMutations',
                'startCreateGame',
                'cancelCreateGame',
                'setGameStarted'
            ]),
            toggleGameOptions() {
                if (!this.addRules) {
                    this.selectedGameOptions = {};
                }
            },
            checkRequirements() {
                console.log(this.selectedGameOptions);
                let alerts = '';
                for (const opt of Object.keys(this.selectedGameOptions)) {
                    const option = gameOptionsSource[opt];
                    if (this.selectedGameOptions[opt] === true && option.requires) {
                        for (const rq of option.requires) {
                            if (this.selectedGameOptions[rq] !== true) {
                                alerts += option.alert + "\n";
                            }
                        }
                    }
                }
                this.setAlert(alerts);
            },
            handleCreateGame() {
                const options = [];
                for (const opt of Object.keys(this.selectedGameOptions)) {
                    options.push(opt);
                }
                // добавляем недельную мутацию, если выбрана
                if (this.isWeeklyMutation && this.hasMutations) {
                    for (const opt of this.gameWeeklyMutation.mutationsList) {
                        options.push(opt.id);
                    }
                }
                this.startCreateGame({
                    playersNumber: this.optionsPlayers,
                    options,
                    inviteOnly: this.inviteOnly,
                }).then(response => {
                    if (response.error) {
                        this.$dialog.alert(response.error);
                    }
                });
            },
            handleCancelGame() {
                this.cancelCreateGame();
            }
        }
    };
</script>

<style scoped lang="scss">
    $widgetWidth: 812px;

    .left {
        flex-basis: ($widgetWidth / 2);
        padding: 12px 6px 6px 20px;
        position: relative;
        color: #fff;

        @media screen and (max-width: 1120px) {
            flex-basis: 100%;
        }

        h3 {
            margin: 0;
            font-size: 22px;
            line-height: 26px;
            margin-bottom: 20px;
        }
        .options-line {
            display: flex;
            align-items: center;
            margin: 5px 0 16px 0;

            .label {
                display: inline-block;
                font-size: 16px;
                flex-basis: 210px;
                margin-right: 2px;

                &.w1 {
                    flex-basis: inherit;
                    margin-right: 10px;
                }
                i {
                    display: inline-block;
                    font-style: normal;
                    font-size: 8px;
                    line-height: 10px;
                    background-color: #909090;
                    color: #fff;
                    width: 10px;
                    text-align: center;
                    border-radius: 5px;
                    cursor: default;
                }
            }
            .options {
                display: inline-block;
                font-size: 11px;
                line-height: 13px;

                .players-checkbox {
                    position: relative;
                    display: inline-block;
                    font-size: 15px;
                    line-height: 30px;
                    width: 30px;
                    height: 30px;
                    background: #fff;
                    border: 0.8px solid #ADACAC;
                    box-sizing: border-box;
                    border-radius: 10px;
                    margin: 0 10px 0 0;
                    color: #000;
                    cursor: pointer;
                    .checkbox {
                        margin: 0;
                        width: 30px;
                        height: 30px;
                        opacity: 0;
                    }
                    i {
                        position: absolute;
                        display: inline-block;
                        top: 0;
                        left: 0;
                        font-size: 15px;
                        line-height: 30px;
                        width: 30px;
                        height: 30px;
                        text-align: center;
                        font-style: normal;
                    }
                    &.checked {
                        background: #6A1ED5;
                        color: #fff;
                    }
                }

                .switcher {
                    display: block;
                    position: relative;
                    margin: 0;
                    width: 45px;
                    height: 23px;
                    background: #D5D5D5;
                    color: #000;
                    border-radius: 15px;
                    cursor: pointer;

                    input {
                        opacity: 0;
                        position: absolute;
                    }
                    &::before {
                        transition: left 250ms;
                        z-index: 100;
                    }
                    &::after {
                        transition: left 250ms;
                        z-index: 99;
                    }
                    &.yes::before {
                        display: block;
                        position: absolute;
                        content: "";
                        top: 3px;
                        left: 25px;
                        height: 17px;
                        width: 17px;
                        border-radius: 50%;
                        background: #F9E88E;
                    }
                    &.yes::after {
                        display: block;
                        content: "yes";
                        position: absolute;
                        top: 5px;
                        left: 5px;
                        font-size: 12px;
                    }
                    &.no::before {
                        display: block;
                        position: absolute;
                        content: "";
                        top: 3px;
                        left: 3px;
                        height: 17px;
                        width: 17px;
                        border-radius: 50%;
                        background: #F9E88E;
                        &.lock {
                            background: #F9E88E url(/design/icons/lock.svg) center center no-repeat;
                        }
                    }
                    &.no::after {
                        display: block;
                        content: "no";
                        position: absolute;
                        top: 5px;
                        left: 22px;
                        font-size: 12px;
                    }
                    &.yes.lock:before,
                    &.no.lock:before {
                        background: #F9E88E url(/design/icons/lock.svg) center center no-repeat;
                    }
                }
            }
        }
        .game-options {
            height: 280px;
            transition: .2s;

            .ps {
                height: 280px;
            }
            .options-item {
                display: flex;
                margin: 0 18px 10px 0;
                padding: 0;
                cursor: pointer;
                transition: .5s;

                .img {
                    position: relative;
                    flex: 0 1 60px;
                    margin-right: 7px;
                    height: 60px;
                    transition: .1s;

                    img {
                        transition: .1s;
                        width: 100%;
                        height: 100%;
                    }
                }
                &.checked .img::before {
                    display: block;
                    position: absolute;
                    top: -1px;
                    right: 2px;
                    content: "";
                    width: 12px;
                    height: 12px;
                    background: url(/design/icons/checkbox-purple.svg) left top no-repeat;
                    background-size: contain;
                }
                &:hover {
                    img {
                        filter: drop-shadow(0px 6px 6px rgba(#000, 0.5));
                        transform: scale(1.05);
                        //box-shadow: 0px 6px 6px rgba(#000, 0.5);
                    }
                    .info {
                        text-shadow: 0px 6px 6px rgba(255, 255, 255, 0.25);
                    }
                    //background-color: #464545;
                    //border-radius: 4px;
                }
                &.disabled {
                    cursor: not-allowed;
                }
                .info {
                    flex: 1;
                    transition: .1s;

                    span {
                        display: block;
                    }
                    .name {
                        margin-top: 2px;
                        font-size: 15px;
                        font-weight: 500;
                        padding-bottom: 5px;
                    }
                    .description {
                        font-size: 14px;
                        line-height: 15px;
                    }
                    input {
                        position: absolute;
                        opacity: 0;
                    }
                }
            }
        }
        .dots {
            text-align: center;
            img {
                width: 20px;
            }
        }
        .button {
            position: absolute;
            bottom: 38px;
            left: 0;
            right: 0;
            text-align: center;

            .create-game, .cancel-game {
                display: inline-block;
                background-color: #E9E9E9;
                font-size: 15px;
                min-width: 120px;
                border-radius: 2px;
                box-sizing: border-box;
                padding: 9px 5px;
                color: #000;
                outline: none;
                text-decoration: none;
            }
        }
        .no-vip-message {
            position: absolute;
            bottom: 4px;
            left: 10px;
            font-size: 12px;
            color: #B6B6B6;
        }
        .disabled {
            cursor: not-allowed;
        }
    }
</style>
