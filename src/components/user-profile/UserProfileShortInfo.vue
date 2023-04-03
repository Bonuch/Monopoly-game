<template>
    <div class="fullprofile__top-short_info">
        <!--truncate default was 24-->
        <span class="fullprofile__top-name">{{ fullname | exists | truncate(6) }}</span>
        <b class="fullprofile__top-agecity">{{ age | setCase([
                        $t('USER_PROFILE.год'),
                        $t('USER_PROFILE.года'),
                        $t('USER_PROFILE.лет')
                    ], '<') | exists(',') }} {{ town | exists }}</b>
    </div>
</template>

<script>
    import { exists, setCase, truncate } from '@/helpers/text';

    export default {
        name: "UserProfileShortInfo",
        filters: {
            truncate,
            setCase,
            exists
        },
        props: {
            fullname: String,
            age: Number,
            town: String
        }
    }
</script>

<style lang="scss" scoped>
    .fullprofile {
        &__top {
            &-short_info {
                margin-bottom: 10px;
            }

            &-name {
                display: block;
                font-size: 36px;
                line-height: 43px;
                font-weight: 600;
                color: #FFFFFF;
                text-shadow: 7px 7px 7px rgba(0, 0, 0, 0.3);
                white-space: nowrap;
                text-align: left;

                @media(min-width: 1920px) {
                    font-size: 60px;
                    line-height: 1;
                    text-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
                }
            }

            &-agecity {
                display: block;
                font-size: 13px;
                line-height: 16px;
                margin-top: 15px;
                color: #FFFFFF;
                text-align: left;
                font-weight: 600;
                text-shadow: 0px 0px 1px rgba   (#797979, .85);

                @media(min-width: 1920px) {
                    font-size: 22px;
                    line-height: 1;
                    text-shadow: 5px 5px 8px rgba(0, 0, 0, .85);
                }
            }
        }
    }
</style>
