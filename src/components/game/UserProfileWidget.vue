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
            <img
                class="avatar"
                :style="{borderColor: player.borderColor}"
                :src="player.avatar"
                :alt="player.name"
                @click="onUserAvatarClick"
            >
            <div class="player-info">
                <div class="name-wrap">
          <span class="name">
            {{ player.name }}
            <span v-if="player.is_vip" class="vip"><img src="/design/game/vip.svg" alt="#" title="VIP"></span>
          </span>
                </div>
                <div class="location-wrap">
                    <div class="location">{{ player.town }}</div>
                    <span title="Возраст" class="age">{{ player.age }}</span>
                </div>
                <div class="social">
                    <a v-if="player.socials.instagram" class="instagram" :href="player.socials.instagram"
                       target="_blank">
                        <img src="/design/game/socials/instagram.svg" alt="Instagram">
                    </a>
                    <a v-if="player.socials.facebook" class="facebook" :href="player.socials.facebook" target="_blank">
                        <img src="/design/game/socials/facebook.svg" alt="Facebook">
                    </a>
                    <a v-if="player.socials.vk" class="vk" :href="player.socials.vk" target="_blank">
                        <img src="/design/game/socials/vk.svg" :alt="$t('USER_PROFILE.Вконтакте')">
                    </a>
                </div>
            </div>
        </div>
        <div class="icons">
            <img v-if="player.illuminati" class="illuminati" src="/design/game/illuminati.svg" alt="#"
                 :title="$t('GAME.Игрока спонсируют Иллюминаты')">
            <img v-if="player.masons" class="sanctions" src="/design/game/sanctions.svg" alt="#"
                 :title="$t('GAME.Игрок находится под санкциями правительства')">
            <img v-if="player.id_muted" class="muted" src="/design/game/muted.svg" alt="#" :title="$t('GAME.Мут')">

            <div
                v-if="deadline > 0 && ((gameStore.fake_should_turn == player.uuid) || (gameStore.fake_should_turn == null && gameStore.userTurn == player.uuid))"
                :style="playerBgColor()" class="deadline">
                <PlayerTimeout />
            </div>

            <h3 class="looser__title" v-if="isLooser">Банкрот</h3>
        </div>

        <div class="balance">
            <div class="money">
                {{ player.balance }} <br>
                {{ $t("GAME.Денег") }}
            </div>
            <div class="assets">
                {{ player.cellsTotalAmount }} <br>
                {{ $t("GAME.Активов") }}
            </div>
            <a v-if="currentUser.uuid == player.uuid && !isLooser" @click="giveUp()" class="exit"><img
                src="/design/game/power.svg" :alt="$t('GAME.Выход')"></a>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import PlayerTimeout from "./PlayerTimeout";

export default {
    name: "UserProfileWidget",
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
            this.setPlayerCardHovered(true)
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
    width: 250px !important;
    height: 170px !important;

    .looser {
        &__title {
            right: -26%;
            bottom: -70%;
        }
    }
}

.player-card {
    background-size: cover;
    text-align: left;
    padding: 15px 13px;
    color: #fff;
    width: 230px;
    margin-bottom: 7px;
    border-radius: 12px;
    transition: 300ms;

    .player-info_wrap {
        padding-bottom: 9px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        .avatar {
            width: 75px;
            height: 75px;
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

        .player-info {
            width: calc(100% - 83px);
        }

        .name-wrap {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 5px;
            cursor: default;
            padding-right: 20px;

            .name {
                position: relative;
                padding-right: 20px;
                display: inline-block;
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
        padding: 0 15px 11px;
        display: flex;
        align-items: center;
        height: 30px;
        box-sizing: border-box;

        img {
            margin-right: 18px;
        }

        .deadline {
            position: absolute;
            font-weight: 600;
            font-size: 16px;
            width: 37px;
            height: 37px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            right: 0;
            top: -25px;
            color: #000;
        }
    }

    .balance {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        line-height: 17px;

        .money {
            width: 40%;
        }

        .assets {
            width: 40%;
        }

        .exit {
            width: 20%;
            cursor: pointer;
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
