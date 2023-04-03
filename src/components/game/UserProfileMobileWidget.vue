<template>
    <div
        @click="updateDealModalUserId()"
        @mouseover="setPlayerCardHovered({hover: true, uuid: player.uuid})"
        @mouseleave="setPlayerCardHovered(null)"
        class="player-card"
        :class="{active: dealActiveUser, own_card: isMyCard, looser: isLooser}"
        :style="playerBgImage()"
    >
        <div class="player-info_wrap">
            <div class="name-wrap">
                <span class="name">
                        {{ player.name }}
                        <span v-if="player.is_vip" class="vip"><img src="/design/game/vip.svg" alt="#"
                                                                    title="VIP"></span>
                    </span>


                <div
                    v-if="deadline > 0 && ((gameStore.fake_should_turn == player.uuid) || (gameStore.fake_should_turn == null && gameStore.userTurn == player.uuid))"
                    :style="playerBgColor()" class="deadline">
                    <PlayerTimeout />
                </div>
            </div>


            <div class="player-info">
                <img
                    class="avatar"
                    :style="{borderColor: player.borderColor}"
                    :src="player.avatar"
                    :alt="player.name"
                    @click="onUserAvatarClick"
                >




                <a v-if="currentUser.uuid == player.uuid && !isLooser" @click="giveUp()" class="exit"><img
                    src="/design/game/power.svg" :alt="$t('GAME.Выход')"></a>
                <!--                <div class="location-wrap">-->
                <!--&lt;!&ndash;                    <div class="location">{{ player.town }}</div>&ndash;&gt;-->
                <!--&lt;!&ndash;                    <span title="Возраст" class="age">{{ player.age }}</span>&ndash;&gt;-->
                <!--                </div>-->
                <!--                <div class="social">-->
                <!--                    <a v-if="player.socials.instagram" class="instagram" :href="player.socials.instagram"-->
                <!--                       target="_blank">-->
                <!--                        <img src="/design/game/socials/instagram.svg" alt="Instagram">-->
                <!--                    </a>-->
                <!--                    <a v-if="player.socials.facebook" class="facebook" :href="player.socials.facebook" target="_blank">-->
                <!--                        <img src="/design/game/socials/facebook.svg" alt="Facebook">-->
                <!--                    </a>-->
                <!--                    <a v-if="player.socials.vk" class="vk" :href="player.socials.vk" target="_blank">-->
                <!--                        <img src="/design/game/socials/vk.svg" :alt="$t('USER_PROFILE.Вконтакте')">-->
                <!--                    </a>-->
                <!--                </div>-->
            </div>
            <div class="info__bar">
                <div class="balance">
                    <div class="money">
                        <span class="title">{{ $t("GAME.Денег") }}</span>
                        <span>{{ player.balance }}</span>
                    </div>
                    <div class="assets">
                        <span class="title">{{ $t("GAME.Активов") }}</span>
                        <span>{{ player.cellsTotalAmount }}</span>
                    </div>

                </div>

                <div class="icons">
                    <img v-if="player.illuminati" class="illuminati" src="/design/game/illuminati.svg" alt="#"
                         :title="$t('GAME.Игрока спонсируют Иллюминаты')">
                    <img v-if="player.masons" class="sanctions" src="/design/game/sanctions.svg" alt="#"
                         :title="$t('GAME.Игрок находится под санкциями правительства')">
                    <img v-if="player.id_muted" class="muted" src="/design/game/muted.svg" alt="#" :title="$t('GAME.Мут')">
                    <h3 class="looser__title" v-if="isLooser">Банкрот</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import PlayerTimeout from "./PlayerTimeout";

export default {
    name: "UserProfileMobileWidget",
    props: {
        player: {
            type: Object,
            required: true,
        },
    },
    components: { PlayerTimeout },
    computed: {
        ...mapGetters([
            "currentUser",
            "dealState",
            "gameStore",
            "deadline",
        ]),
        isLooser() {
            if (this.player && this.player.loser) {
                return true;
            }
            return false;
        },
        dealActiveUser() {
            if (this.dealState.userId == this.player.uuid) {
                return true;
            }
            return false;
        },
        isMyCard() {
            return this.currentUser.uuid === this.player.uuid;
        },
    },
    methods: {
        ...mapActions([
            "loadProfileData",
            "sendGameAction",
        ]),
        ...mapMutations([
            "setPlayerCardHovered",
            "setGameModalName",
        ]),

        markPlayerChip() {
            this.setPlayerCardHovered(true);
        },

        async giveUp() {
            const message = this.$i18n.locale === "ru" ? "Вы уверены что хотите сдаться?": "Are you sure?"
            await this.$dialog.confirm(message, {
                acceptText: this.$i18n.locale === "ru" ? "Да" : "Yes",
                cancelText: this.$i18n.locale === "ru" ? "Нет" : "No",
                // cancelText: this.$i18n.t('Нет'),
            }).then(() => {
                this.sendGameAction({ route: `game_give_up` });
            })
        },
        playerBgImage() {
            return `background-image: url(/design/game/player-bg/${this.player.background.image})`;
        },
        playerBgColor() {
            return `background-color: ${this.player.background.color}`;
        },
        // UserMouseover: function() {
        //   this.setPlayerCardHovered(true);
        //
        //   this.player.ownedCells.forEach((cellId) => {
        //     document.querySelector('#cell-' + cellId).classList.remove('hover-disabled');
        //   });
        // },
        // UserMouseleave: function() {
        //   this.setPlayerCardHovered(null);
        // },
        updateDealModalUserId() {
            if (this.dealState.opened && !this.dealState.requestConditions.items.length && (this.currentUser.uuid != this.player.uuid)) {
                this.$store.commit("setDealUserId", this.player.uuid);
            }
        },
        onUserAvatarClick() {
            this.loadProfileData(this.player.uuid).then(_ => {
                this.setGameModalName("GameModalUserProfile");
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.own_card {
    //width: 250px !important;
    //height: 170px !important;

    .looser {
        &__title {
            right: -26%;
            bottom: -70%;
        }
    }
}

.deadline {
    padding: 10px;
    position: absolute;
    font-weight: 600;
    font-size: 16px;
    width: 10px;
    height: 10px;
    box-shadow: 0px 0px 10px rgba(#000, .3);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    right: 0px;
    top: -4px;
    //left: 35px;
    color: #000;
}

.info__bar {
    display: flex;
    align-items: center;
}

.exit {
    text-align: center;
    width: 30px;
    display: block;
    cursor: pointer;
}


.player-card {
    background-size: cover;
    text-align: left;
    padding: 15px 13px;
    color: #fff;
    width: 140px;
    //width: 230px;
    margin-bottom: 7px;
    border-radius: 0 12px 12px 0;
    transition: 300ms;

    @media screen and (max-width: 1180px) {
        margin-right: 7px;
        border-radius: 12px;
        position: relative;
        flex-direction: row;
    }
    @media screen and (max-width: 980px) {
        margin-bottom: 0;
    }
    .player-info {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .player-info_wrap {
        //padding-bottom: 9px;
        display: flex;
        flex-wrap: wrap;
        //align-items: center;
        flex-direction: column;

        .avatar {
            width: 55px;
            height: 55px;
            box-sizing: border-box;
            border: 3px solid #000;
            margin-right: 8px;
            background-color: #C4C4C4;
            border-radius: 50%;
            cursor: pointer;
            transition: border-color 0.3s ease;

            &:hover {
                border-color: var(--color-base-blue) !important;
            }
        }

        .name-wrap {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 5px;
            position: relative;
            cursor: default;
            padding-right: 40px;

            .name {
                display: inline-block;
                position: relative;
                padding-right: 20px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            }

            .vip {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        .location-wrap {
            font-size: 12px;
            font-weight: 600;
            padding-bottom: 5px;
            cursor: default;
            position: relative;

            .location {
                position: relative;
                padding-right: 6px;
                display: inline-block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 80%;
            }

            .age {
                position: absolute;
            }
        }

        .social {
            display: flex;
            align-items: center;

            a {
                margin-right: 5px;
            }
        }
    }

    .icons {
        position: relative;
        //padding: 0 15px 11px;
        display: flex;
        width: 30px;
        text-align: center;
        flex-direction: column;
        align-items: center;
        height: 30px;
        box-sizing: border-box;

        img {
            //margin-right: 18px;
        }


    }

    .balance {
        padding: 10px 0 0 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        //text-align: center;
        font-size: 14px;
        font-weight: 600;
        line-height: 17px;

        .money {
            .title {
                width: 70px;
                display: inline-block;
            }
            flex: 1 1 100%;
        }

        .assets {
            .title {
                width: 70px;
                display: inline-block;
            }
            flex: 1 1 100%;
        }


    }

    &:hover, &.active {
        transform: scale(1.07);
    }
}

.looser {
    filter: grayscale(1);

    &__title {
        background: #fff;
        padding: 2px 10px;
        color: var(--color-danger);
        text-align: center;
        font-size: 28px;
        font-weight: 900;
        position: absolute;
        //right: -26%;
        border-radius: 6px;
        //bottom: -70%;
        right: -28%;
        bottom: -28%;
        transform: rotate(-90deg);
    }
}
</style>
