<template>
    <div class="right">
        <img class="background" :src="gameWeeklyMutation.background_image || '/design/game-lobby/new_img.png'" alt=""/>
        <div class="gradient__layer"></div>
        <span class="alert-message" v-if="alert">{{ alert }}</span>
        <div class="week-mutations" v-if="hasMutations">
            <!--                <div class="title" :style="{color: gameWeeklyMutation.color || '#000'}">Мутация недели</div>-->
            <div class="title">{{ $t('SEARCH_CREATE_GAME.Мутация недели') }}</div>
            <div class="options">
                <img v-for="item in gameWeeklyMutation.mutationsList" href="#" :title="item.name" :src="item.image"/>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'WeeklyMutations',
        props: {
            alert: {
                required: true,
            }
        },
        data() {
            return {
            };
        },
        computed: {
            ...mapGetters([
                'gameWeeklyMutation',
            ]),
            hasMutations() {
                return (this.gameWeeklyMutation.mutationsList && this.gameWeeklyMutation.mutationsList.length > 0);
            }
        },
        methods: {
            ...mapActions([
                'getWeeklyMutations',
            ]),
        },
        mounted() {
            this.getWeeklyMutations();
        }
    };
</script>

<style scoped lang="scss">
    $widgetWidth: 812px;

    .right {
        flex-basis: ($widgetWidth / 2);
        overflow: hidden;
        position: relative;
        text-align: center;

        img.background {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
        }

        .alert-message {
            position: absolute;
            left: 20px;
            right: 20px;
            top: 20px;
            padding: 5px;
            background: rgba(#6A1ED5, 0.5);
            backdrop-filter: blur(5px);
            //background: #EC8D3F;
            border-radius: 4px;
            color: #FFFFFF;
        }

        .gradient__layer {
            width: 100%;
            height: 100%;
            position: absolute;
            background: linear-gradient(360deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
        }

        .week-mutations {
            position: absolute;
            bottom: 20px;
            left: 58px;
            right: 58px;
            text-align: center;
            //background-color: rgba(255, 255, 255, 0.9);
            padding: 2px;
            border-radius: 8px;
            z-index: 100;

            .title {
                font-weight: 600;
                font-size: 18px;
                //text-stroke: 1px #8D56C3;
                //-webkit-text-stroke: 1px #8D56C3;
                margin-bottom: 2px;
                color: #fff;
                text-shadow:
                    -1px -1px 0 var(--color-purple-light),
                    1px -1px 0 var(--color-purple-light),
                    -1px 1px 0 var(--color-purple-light),
                    1px 1px 0 var(--color-purple-light);
            }

            .options {
                padding-top: 8px;
                img {
                    margin: 0 8px;
                    height: 37px;
                    height: 37px;
                }
            }
        }
    }
</style>
