<template>
    <div class="daily-awards" :class="currentColorSchema">
        <div class="title">{{ $t('SITE.Заходите каждый день, чтобы получить награды') }}!</div>
        <ul class="awards">
            <li class="award">
                <span class="item award-1" :class="{done: (award.row >= 1), next: (award.row === 0 || award.row === 7)}">
                    <i></i>
                </span>
            </li>
            <li class="award">
                <span class="item award-2" :class="{done: (award.row >= 2), next: award.row === 1}">
                    <i></i>
                </span>
            </li>
            <li class="award">
                <span class="item award-3" :class="{done: (award.row >= 3), next: award.row === 2}">
                    <i></i>
                </span>
            </li>
            <li class="award">
                <span class="item award-4" :class="{done: (award.row >= 4), next: award.row === 3}">
                    <i></i>
                </span>
            </li>
            <li class="award">
                <span class="item award-5" :class="{done: (award.row >= 5), next: award.row === 4}">
                    <i></i>
                </span>
            </li>
            <li class="award">
                <span class="item award-6" :class="{done: (award.row >= 6), next: award.row === 5}">
                    <i></i>
                </span>
            </li>
            <li class="award">
                <span class="item award-7" :class="{done: (award.row >= 7), next: award.row === 6}">
                    <i></i>
                </span>
            </li>
        </ul>
        <button class="get-btn" v-if="award.today && button" @click="proceedDailyAwards">
            {{ $t('SITE.Получить') }}
        </button>
        <div class="wait" v-if="secondsToNewAward > 0">{{ $t('SITE.Получить через') }} {{ timerToNewAward }}</div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import moment from 'moment';

    let timer = null;

    export default {
        data() {
            return {
                button: true,
                secondsToNewAward: 0
            };
        },
        computed: {
            ...mapGetters([
                'currentColorSchema',
                'currentUser',
                'dailyAward',
            ]),
            award() {
                return this.dailyAward || {
                    time: 0, // время следующего получения награды
                    row: 0, // порядковый номер награды
                    today: true, // true, если сегодня награда еще не была получена
                }
            },
            timerToNewAward() {
                return moment.unix(this.secondsToNewAward).utc().format("HH:mm:ss");
            }
        },
        mounted() {
            // request awards
            this.loadDailyAwards();
            this.startTimer();
        },
        updated() {
            this.button = true;
        },
        methods: {
            ...mapActions([
                'loadDailyAwards',
                'getDailyAward',
            ]),
            startTimer() {
                const now = moment.utc().unix();
                const nextAwardTime = this.award.time;
                if(nextAwardTime > now) {
                    this.secondsToNewAward = (nextAwardTime - now);
                    clearInterval(timer);
                    timer = setInterval(() => {
                        this.secondsToNewAward--;
                        if (this.secondsToNewAward <= 0) clearInterval(timer);
                    }, 1000);
                }
            },
            proceedDailyAwards() {
                this.button = false;
                this.getDailyAward(_ => {
                    this.startTimer();
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .daily-awards {
        padding-top: 4px;

        .title {
            font-size: 12px;
            line-height: 14px;
            color: #000;
            text-align: center;
            font-weight: 500;
        }
        .awards {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            justify-content: center;
            align-items: center;
            list-style: none;
            margin: 4px 0 0 0;
            padding: 0;

            .award {
                margin: 0 14px;
                padding: 0;

                .item {
                    position: relative;
                    display: inline-block;
                    width: 42px;
                    height: 42px;
                    border: 1px solid #CCCCCC;
                    box-sizing: border-box;
                    opacity: 0.5;

                    &.next {
                        opacity: 1;
                        width: 50px;
                        height: 50px;
                        border: 1px solid #CC3737;
                    }
                    /* TODO изображения подарков нужно будет брать из конфига, сейчас они временно прописаны тут /backend/services/awards-service.js:6 */
                    &.award-1 {
                        background: url(/design/daily-awards/1th-award-briefcase.png) center center no-repeat;
                        background-size: contain;
                    }
                    &.award-2 {
                        background: url(/design/daily-awards/2th-award-100usd.png) center center no-repeat;
                        background-size: contain;
                    }
                    &.award-3 {
                        background: url(/design/daily-awards/3th-award-3-briefcase.png) center center no-repeat;
                        background-size: contain;
                    }
                    &.award-4 {
                        background: url(/design/daily-awards/4th-award-300usd.png) center center no-repeat;
                        background-size: contain;
                    }
                    &.award-5 {
                        background: url(/design/daily-awards/5th-award-wooden-box.png) center center no-repeat;
                        background-size: contain;
                    }
                    &.award-6 {
                        background: url(/design/daily-awards/6th-award-100b.png) center center no-repeat;
                        background-size: contain;
                    }
                    &.award-7 {
                        background: url(/design/daily-awards/7th-award-totem.png) center center no-repeat;
                        background-size: contain;
                    }
                    i {
                        display: none;
                    }
                    &.done {
                        i {
                            display: block;
                            position: absolute;
                            top: 1px;
                            right: 1px;
                            height: 9px;
                            width: 9px;
                            background: #fff url(/design/icons/checkbox-bright.svg) no-repeat center center;
                            background-size: cover;
                        }
                    }
                }
            }
        }
        &.dark {
            .title {
                color: #fff;
            }
            .awards .award .item {
                border: 1px solid #757272;
                &.done {
                    i {
                        border: 1px solid #C6BFBF;
                        background: #323639 url(/design/icons/checkbox-dark.svg) no-repeat center center;
                        background-size: cover;
                    }
                }
            }
        }
        .get-btn {
            width: 91px;
            height: 22px;
            background: #EFEFEF;
            border: 1px solid #E5E5E5;
            box-sizing: border-box;
            border-radius: 2px;
            font-size: 10px;
            color: #000;
        }
    }
</style>
