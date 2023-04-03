<template>
    <div class="modal__award_list">
        <BaseLoader v-if="!awards || awards.length === 0" />
        <div class="list__item" v-for="(item, index) in awards">
            <p class="item__day">{{ $t('AWARDS.День') }} {{ index + 1 }}</p>
            <div class="item__image__container">
                <div class="item__mark" v-if="item.picked">
                    <img src="/design/awards/checkmark.png" width="50px" height="50px" alt="#">
                </div>
                <img
                    :src="item.item.image"
                    alt="#"
                    class="item__image"
                    :class="{
                                blocked: item.picked,
                                current: item.current && item.canTakeAward,
                                future: !item.current && !item.picked
                            }">
            </div>
            <p class="item__name">{{ item.item.title }}</p>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import BaseLoader from "../../base/BaseLoader";

export default {
    name: "AwardList",
    components: { BaseLoader },
    data() {
        return {
            // awardList: [],
        };
    },
    computed: {
        ...mapGetters([
            "awardList",
        ]),
        awards() {
            if (this.awardList.length > 0) {
                const available = this.awardList.some(item => {
                    return item.canTakeAward
                })
                if (available) {
                    console.log('-000-0-0- award available', available);
                    this.$emit('awardAvailable')
                }
            }
            return this.awardList
        }
    },
    async mounted() {
        // console.log(this.awardList);
        // await this.$socket.client.emit("load_weekly_awards", {}, (data) => {
        //     if (!data.err) {
        //         this.awardList.push(...data);
        //     }
        // });
    },
};
</script>

<style scoped lang="scss">
::v-deep {
    .base-loader {
        display: flex;
        justify-content: center;
        height: 80px;
    }

    #base-loader-loading {
        width: 100px;
        margin: 0;
    }
}

.modal {
    &__award_list {
        display: flex;
        margin-top: 15px;
        justify-content: center;

        .list {
            &__item {
                display: block;
                width: 100px;

                &:first-child {
                    margin-left: 0px;
                }

                margin-left: 15px;

                .item {
                    &__day {
                        font-size: 14px;
                    }

                    &__name {
                        font-size: 14px;
                    }


                    &__image {
                        border-radius: 6px;
                        object-fit: contain;
                        width: 100px;
                        height: 100px;
                        position: relative;
                        border: 2px solid transparent;

                        &.blocked {
                            filter: grayscale(1);
                        }

                        &.current {
                            border: 2px solid var(--color-yellow-dark);
                        }

                        &.future {
                            filter: grayscale(.5);
                        }

                        &__container {
                            position: relative;

                            &.blocked {
                                &::after {
                                    border-radius: 6px;
                                    opacity: .1;
                                    filter: grayscale(50px);
                                    content: "";
                                    display: block;
                                    width: 100%;
                                    height: 100%;
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                    background: red;
                                }
                            }

                            .item__mark {
                                width: 100%;
                                height: 100%;
                                position: absolute;
                                left: 0;
                                top: 0;
                                //background: red;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                z-index: 10;

                                img {
                                    filter: drop-shadow(5px 5px 5px #000);
                                }
                            }

                        }
                    }
                }
            }
        }
    }
}
</style>
