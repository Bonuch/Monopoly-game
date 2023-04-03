<template>
    <div class="modal" @click.self="closeModal()">
        <div class="modal__dialog scale-up-center" :class="{'dataChange': isDataChange}" v-if="cardInfo">
            <div class="balance__info">
                <p class="info__wrapper"><CurrencyShines :currentUser="userData"/></p>
            </div>
            <BaseScrollbar class="modal__scroll">
                <div class="modal__section">
                    <div class="header__content">
                        <a href="#" class="modal__control" @click.prevent="closeModal()"><img
                            src="/design/icons/modal_close_dark.svg" alt="#"></a>
                        <div class="header__image">
                            <img class="header__image" :src="cardInfo.image" alt="#">
                        </div>
                        <h3 class="description__header"><span
                            class="">{{ $t("KNOWLEDGE." + cardInfo.name) }}</span></h3>
                        <p class="name_progress">
                            <span class="">
                                {{ $t("KNOWLEDGE.Уровень") }} {{ cardInfo.level }} {{ $t("KNOWLEDGE.из")
                                }} {{ cardInfo.max_level }}
                            </span>
                        </p>
                        <p class="header__text"><span>{{ cardInfo.description_text }}</span>
                        </p>
                    </div>
                </div>
                <transition name="fade">
                    <div class="modal__section body"
                         v-if="cardInfo.is_upgrade_available && cardInfo.cost_upgrade">
                        <div class="body__head">
                            <h3 class="header">{{ $t("KNOWLEDGE.Стоимость апгрейда до") }}
                                {{ cardInfo.level !== cardInfo.max_level ? cardInfo.level + 1 : cardInfo.max_level
                                }}
                                {{ $t("KNOWLEDGE.уровня") }}
                            </h3>
                            <div class="currencies" v-if="cardInfo.cost_upgrade">
                            <span class="currency"
                                  v-for="(value, key, index) in cardInfo.cost_upgrade.shine" :key="key"
                                  :title="value">
                                <img :src="imageUrls[index]" alt="#">
                                {{ value | currency }}
                            </span>
                            </div>
                        </div>
                        <hr />

                        <div class="flex">
                            <div class="upgrade__container"
                                 v-if="cardInfo.cost_upgrade && cardInfo.cost_upgrade.bucks">
                                <p class="cost-title">{{ $t("KNOWLEDGE.Апгрейд за Баблос") }}</p>

                                <div class="cost-container">
                                            <span class="upgrade-cost">
                                                <img src="/design/icons/currencies/black21.png" alt="">
                                                {{ cardInfo.cost_upgrade.bucks }}
                                            </span>
                                    <a
                                        class="upgrade-cost__btn-yellow"
                                        :class="{'unactive': isProcess}"
                                        href="#"
                                        v-if="cardInfo.is_upgrade_available"
                                        @click.prevent="buyUpgrade()"
                                    >{{ $t("KNOWLEDGE.Изучить") }}</a>
                                </div>
                            </div>
                            <div class="upgrade__container">
                                <p class="cost-title">{{ $t("KNOWLEDGE.Апгрейд за сияние") }}</p>
                                <div class="cost-container">
                                            <span class="upgrade-cost">
                                                <i class="far fa-clock"></i>
                                                {{ upgradeTime }}
                                            </span>

                                    <a class="upgrade-cost__btn"
                                       href="#"
                                       v-if="cardInfo.is_upgrade_available"
                                       @click.prevent="upgrade('shine')"
                                    >
                                        {{ $t("KNOWLEDGE.Изучить") }}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="cardInfo.progress_finish_at" class="modal__body flex__center-all flex-col">
                        <p>
                            {{ $t("KNOWLEDGE.Осталось до завершения") }}:
                            <CountDown :deadline="cardInfo.progress_finish_at"
                                       @upgradeDone="upgradeDoneHandler" />
                        </p>
                        <div class="progress__container">
                            <TimeProgress
                                :progress="cardInfo.progress"
                                :total_time="cardInfo.upgrade_time"
                                :finish_time="cardInfo.progress_finish_at"
                                :progress-after="progressAfter"
                            />
                        </div>
                        <p class="accelerators__title">⚡ {{ $t("SHOP.Ускорители") }} ⚡</p>
                        <DialogShop :knowledge-id="cardInfo.id" :card-code="cardInfo.code"
                                    @accelerated="accelerated"
                                    @error="showError" />
                    </div>
                </transition>
                <transition>
                    <div class="modal__section body">
                        <div class="body__head">
                            <h3 class="header">{{ $t("KNOWLEDGE.Бонус") }}</h3>
                        </div>
                        <hr />
                        <div class="progress" v-for="(i) in 2" :key="i">
                                <span class="progress__title" v-if="cardInfo[`value${i}`].title">
                                    {{ $tt("KNOWLEDGE.", cardInfo[`value${i}`].title) }}
                                </span>
                            <div class="progress__bar" v-if="cardInfo[`value${i}`].title">
                                <Progress
                                    :max="cardInfo[`value${i}`].max"
                                    :progress="cardInfo[`value${i}`].current.replace('%', '') / cardInfo[`value${i}`].max * 100"
                                    :stats="{current: cardInfo[`value${i}`].current || '', next: cardInfo[`value${i}`].modify}"
                                />
                            </div>
                        </div>
                        <div class="progress">
                            <div class="progress__title">
                                {{ $tt("KNOWLEDGE.", cardInfo.puissance.title) }}
                            </div>
                            <div class="progress__stat">
                                <span class="current">{{ cardInfo.puissance.current }}</span>
                                <span class="modify">+{{ cardInfo.puissance.modify }}</span>
                            </div>
                        </div>
                    </div>
                </transition>
                <div
                    v-if="cardInfo.requirements_description.length > 0 && !cardInfo.is_upgrade_available"
                    class="modal__body"
                >
                    <div class="card__requirements">
                        <p v-for="(item, index) in cardInfo.requirements_description" :key="index">
                            <span v-if="index === 0">
                                {{ requirementTranslate(item.message ? item.message : item) }}
                            </span>
                            <a href="" class="link__purple" v-else
                               @click.prevent="loadCardDataByCode(item.card_code)">
                                {{ requirementTranslate(item.message ? item.message : item) }}
                            </a>
                        </p>
                    </div>
                </div>
            </BaseScrollbar>
            <transition name="fade_error">
                <div class="error__message" v-if="error_message" key="errorMesageField">{{ error_message }}
                </div>
            </transition>
        </div>
    </div>
</template>

<script lang="js">
import BaseScrollbar from "../base/BaseScrollbar";
import { mapGetters, mapActions } from "vuex";
import moment from "moment/moment";
import CountDown from "./components/Countdown";
import Progress from "./components/Progress";
import TimeProgress from "./components/TimeProgress";
import DialogShop from "./components/DialogShop";
import CurrencyShines from "@/components/site/CurrencyShines";

const momentDurationFormatSetup = require("moment-duration-format");

// TODO удалить заглушки
export default {
    name: "CardModal",
    components: { BaseScrollbar, CountDown, Progress, TimeProgress, DialogShop, CurrencyShines },
    props: ["data", "code"],
    data() {
        return {
            // Необходимо для заполнения картинками индекс массива означает валюту imageUrls[0] == shine1 ... shineN
            imageUrls: [
                "/design/icons/currencies/green.png", // Shine 1
                "/design/icons/currencies/yellow.png", // Shine 2
                "/design/icons/currencies/purple.png", // Shine 3
                "/design/icons/currencies/blue.png", // Shine 4
                "/design/icons/currencies/red.png", // Shine 5
            ],
            progress: null,
            error_message: null,
            previous_card_code: [],
            isDataChange: false,
            animationTimeout: null,
        };
    },
    computed: {
        ...mapGetters({
            show: "getKnowledgeModal",
            cardInfo: "getKnowledgeModalData",
            userData: "currentUser",
            progressAfter: "getAcceleratorsToUse",
            isProcess: "getUpgradeProcessing"
        }),
        upgradeTime() {
            const langString = this.$i18n.locale === "ru" ? "h[Ч] m[М] s[С]" : "h[H] m[М] s[S]"
            const langDString = this.$i18n.locale === "ru" ? "d[Д] h[Ч] m[М]" : "d[D] h[H] m[М]"
            const formatString = moment.duration(this.cardInfo.upgrade_time, "seconds").days() === 0 ? langString : langDString;
            return moment.duration(this.cardInfo.upgrade_time, "seconds").format(formatString);
        },
        isOpen() {
            const show = this.show;
            if (show) {
                // TODO переделать на изменение переменной в store
                document.querySelector("body").classList.add("overflow-hidden");
                return true;
            }
            return false;
        },
    },
    filters: {
        currency(value) {
            const currency = parseInt(value);
            if (currency >= 1000000000) {
                return `${(value / 1000000000).toFixed(1)}B`;
            }
            if (currency >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`;
            }
            if (currency >= 1000) {
                return `${(value / 1000).toFixed(2)}K`;
            }
            return value;
        },
    },
    watch: {
        error_message(newVal, oldVal) {
            if (newVal) {
                setTimeout(() => {
                    this.error_message = null;
                }, 5000);
            }
        },
    },
    beforeUpdate() {

    },
    created() {
        if (this.cardInfo.progress_finish_at != null) {
            this.progress = new moment(this.cardInfo.progress_finish_at);
            this.cardInfo.is_upgrade_available = false;
        }
        const onEscape = (e) => {
            if (this.show && e.keyCode === 27) {
                this.closeModal();
            }
        };
        document.addEventListener("keydown", onEscape);
        this.$once("hook:destroyed", () => {
            document.removeEventListener("keydown", onEscape);
        });
    },
    destroyed() {
        clearInterval(this.countdownProgress);
    },
    methods: {
        ...mapActions(["startUpgrade", "refreshKnowledgeModal", "getKnowledgeModalByCode", "purchaseUpgrade", "removeProcessFlag"]),
        calcProgressPercent(max, min) {
            return min / max * 100;
        },
        loadCardDataByCode(card_code) {
            this.previous_card_code.push(this.cardInfo.code);
            this.useOpacity(this.getKnowledgeModalByCode, card_code)

        },
        useOpacity(callback, args) {
            clearTimeout(this.animationTimeout);
            this.isDataChange = true;
            // половина времени анимации, так как длительность анимации 1с и в середине анимации opacity == 0
            this.animationTimeout = setTimeout(async () => {
                this.isDataChange = false;
                callback.call(this, args)
                this.removeProcessFlag();
            }, 500);
        },
        normalizePrice(value) {
            if (typeof value === "number") {
                return value;
            }
            if (typeof value === "string") {
                return parseInt(value.replace(/\s/g, ""));
            }
        },
        calcUpgradeProgress() {
            const finish = parseInt(new moment(this.cardInfo.progress_finish_at).unix()) / 1000;
            const current = new moment().unix() / 1000;
            const res = current / finish * 100;
            return res >= 0 && res <= 100 ? res : 100;
        },
        closeModal() {
            document.querySelector("body").classList.remove("overflow-hidden");
            this.$store.dispatch("toggleKnowledgeModal");

        },
        convertTime(timestamp) {
            let converted = new moment.unix(timestamp);
            return converted;
        },
        openModal() {
            document.querySelector("body").classList.add("overflow-hidden");
            this.$store.dispatch("toggleKnowledgeModal");
        },
        isEnoughBalance(tax, currency) {
            if (currency === "bucks") {
                return this.userData.balance.balance_bucks >= tax[currency];
            } else if (currency === "special") {
                return this.userData.balance["special"] >= tax[currency];
            } else if (currency === "shine") {
                for (const item in tax["shine"]) {
                    if (parseInt(this.userData.balance[item]) <= parseInt(tax[item])) {
                        return false;
                    }
                }
                return true;
            }
        },
        startFromServer(opt) {
            return this.startUpgrade({
                branch: this.$route.params.branch,
                card_code: this.cardInfo.code,
                bucks: true,
            });
        },
        async handlePurchase(callFunction, functionArgs) {
            try {
                await callFunction(functionArgs);
                await this.refreshKnowledgeModal();
                if (functionArgs.currency && functionArgs.currency === "bucks") {
                    await this.upgradeDoneHandler();
                }
            } catch (e) {
                this.error_message = e.message;
            }
        },
        async buyUpgrade() {
            if (!this.isProcess) {
                if (this.isEnoughBalance(this.cardInfo.cost_upgrade, "bucks")) {
                    this.userData.balance.balance_bucks -= this.normalizePrice(this.cardInfo.cost_upgrade.bucks);
                }
                await this.handlePurchase(this.purchaseUpgrade, {
                    card_code: this.cardInfo.code,
                    currency: "bucks",
                });
            }
        },
        async upgrade(currency) {
            if (this.cardInfo.is_upgrade_available) {
                await this.handlePurchase(this.startUpgrade, {
                    card_code: this.cardInfo.code,
                    currency,
                }).then(res => {
                    this.progress = moment().add(this.total_time_time, "seconds");
                });
            } else {
                this.error_message = "Нельзя улучшить";
            }
        },
        requirementTranslate(item) {
            const lexems = item.split(/\.\ |\:\ /);
            for (let i = 0; i < lexems.length; i++) {
                const tt = this.$tt("KNOWLEDGE.", lexems[i]);
                if (tt) {
                    item = item.replace(lexems[i], tt);
                }
            }
            return item;
        },
        async upgradeDoneHandler() {
            this.useOpacity(this.getKnowledgeModalByCode, this.previous_card_code.pop());
        },
        async accelerated(progress_finish_at) {
            console.log("0000000 ACELERATED ----", progress_finish_at);
            this.cardInfo.progress_finish_at = progress_finish_at;
            this.useOpacity(this.refreshKnowledgeModal)
        },
        showError(error_mesage) {
            this.error_message = error_mesage;
        },
    },
};
</script>
<style scoped lang="scss">
@import "./styles/cardmodal";
</style>
