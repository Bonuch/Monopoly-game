<template>
    <div class='knowledge__wrapper' @click='callModal(item.code)' :code='item.code'>
        <!--  <div class="knowledge__wrapper" @click="callModal">-->
        <span
            v-for='(card_pos, index) in lineAngle'
            :key='index'
            class='card__line'
            :class='{active: isAvailable}'
            :style="{transform: 'rotate('+ card_pos.angle + 'deg)', width: card_pos.width + 'px'}"
        >
    </span>
        <div class='knowledge__card'>
            <div class='card__image'>
                <img src='/design/knowledge/Rectangle_placeholder.png' alt='#' width='165' height='165'>
                <div class='timer__container' v-if='item.progress_finish_at' :key='item.code + item.name'>
                    <div class='timer_wrapper'></div>
                    <span class='timer'><i class='far fa-clock'></i> <CountDown
                        :deadline='item.progress_finish_at' /></span>
                </div>
            </div>
            <div class='card__description'>
                <p class='card__name'>{{ $tt('KNOWLEDGE.', name) }}</p>
                <div class='card__progress'>
                    <p class='progressbar__title'>{{ $t('KNOWLEDGE.Открыто') }} {{ curentLevel }}/{{ maxLevel }}</p>
                    <div class='progressbar' :class="{'unavailable': !item.is_upgrade_available}">
                        <div class='bar' :style='{width: progressCalc}'></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import moment from 'moment/moment';
import CountDown from './Countdown';

const momentDurationFormatSetup = require('moment-duration-format');


export default {
    name: 'RadianceCard',
    components: { CountDown },
    props: {
        curentLevel: Number,
        name: String,
        image: String,
        child: Array,
        maxLevel: Number,
        item: Object,
    },
    data() {
        return {
            coord: null,
            lineAngle: [],
            lineWidth: [],
            isHover: false,
        };
    },
    computed: {
        progressCalc() {
            return this.curentLevel / this.maxLevel * 100 + '%';
        },
        isAvailable() {
            return this.item.is_upgrade_available;
        },
        upgradeTime() {
            const formatString = moment.duration(this.item.upgrade_time, 'seconds').days() === 0 ? 'h[Ч] m[М] s[С]' : 'd[Д] h[Ч] m[М]';
            return moment.duration(this.item.upgrade_time, 'seconds').format(formatString);
        },
    },
    mounted() {
        this.onInit();
    },
    destroyed() {

    },
    methods: {
        ...mapActions([
            'toggleKnowledgeModal',
        ]),
        hoverCard() {
            console.log('hovered');
            this.isHover = !this.isHover;
        },
        onInit() {
            this.getCoordOnInit();
        },

        getCoordOnInit() {
            const $elem = this.$el;
            if ($elem) {
                this.coord = $elem.getBoundingClientRect();
                // Перебираем зависимости
                for (const elem of this.child) {
                    const $parent_elem = document.getElementById('card_' + elem);
                    if ($parent_elem) {
                        const parentCord = $parent_elem.getBoundingClientRect();
                        const tempObj = {};
                        tempObj['angle'] = this.getAngle(parentCord);
                        tempObj['width'] = this.calcWith(parentCord, tempObj.angle);
                        this.lineAngle.push(tempObj);
                    }
                }
            }
        },
        getAngle(domElem) {
            if (domElem) {
                return Math.atan2(domElem.y - this.coord.y, domElem.x - this.coord.x) * 180 / Math.PI;
            }
        },
        calcWith(parentNode) {
            return Math.abs(Math.sqrt((this.coord.x - parentNode.x) ** 2 + (this.coord.y - parentNode.y) ** 2));
        },
        callModal(code) {
            this.toggleKnowledgeModal({ branch: this.$route.params.branch, code: code });
        },
    },

};
</script>

<style lang='scss' scoped>

.timer {
    position: absolute;
}

.timer__container {
    position: absolute;
    justify-content: center;
    align-items: center;
    display: flex;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.timer_wrapper {
    width: 100%;
    height: 100%;
    background: black;
    opacity: .5;
}

.knowledge__wrapper:hover {
    & > .card__line {
        filter: grayscale(0);

        &::after {
            opacity: 1;
        }
    }
}


.card__line {
    filter: grayscale(0.7);
    transition: .2s;

    &::after {
        transition: .2s;
        opacity: 0;
        display: block;
        content: "";
        height: 0px;
        width: 100%;
        top: 50%;
        position: absolute;
        box-shadow: 0 0 50px 10px #F9E88E;
    }

    &.active {
        filter: grayscale(0);

        &::after {
            opacity: 1;
        }
    }
}

//.unavailable {
//    filter: grayscale(0.9);
//}

.edge__container {
    position: relative;
}

.knowledge__wrapper {
    position: relative;
    display: flex;

    .left {
        justify-content: flex-start;
    }

    .center {
        justify-content: center;
    }

    .right {
        justify-content: flex-end;
    }
}

.knowledge__card {
    box-sizing: border-box;
    border-radius: 5px;
    border: 2px solid #4F4F4F;
    padding: 16px 12px;
    width: 165px;
    //height: 250px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, .25);
    background: var(--color-background-2);
    color: #fff;
    position: relative;
    z-index: 100;
    display: flex;
    flex-direction: column;
    transition: .2s;

    &:hover {
        cursor: pointer;
        //box-shadow: 0 0 50px #FD2144;
        //animation: shine 1s forwards;
    }


}

@keyframes shine {
    0% {
        box-shadow: 0 0 0 #CD480E;
    }
    100% {
        box-shadow: 0 0 100px #CD480E;
    }
}

.card {
    &__image {
        position: relative;
        border-radius: 5px;
        padding: 0 4px;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            border-radius: 5px;

        }
    }

    &__line {
        background: url("/design/knowledge/transparent-white-line-text-font-5d94042b98fd24.png");
        display: block;
        width: 170px;
        height: 30px;
        position: absolute;
        transform-origin: left;
        left: 48%;
    }

    &__name {
        padding: 0;
        margin-top: 0;
        margin-bottom: 15px;
        font-weight: 600px;
    }

    &__description {
        padding: 15px 0 0 0;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    &__progress {
        margin-top: auto;
        border-radius: 5px;
    }
}

.progressbar {
    width: 100%;
    background: #fff;
    height: 10px;
    position: relative;
    border-radius: 5px;

    &.unavailable {
        .bar {
            background: var(--color-gray-dark);
        }
    }

    .bar {
        position: absolute;
        background: linear-gradient(90deg, #E91A1A 0%, rgba(255, 214, 0, 0.92) 110.24%);
        //width: 30%;
        height: 100%;
        border-radius: 5px;
    }

    &__title {
        padding: 0;
        margin: 0 0 10px 0px;
        color: #8D8B8B;
        font-size: 11px;
    }
}
</style>
