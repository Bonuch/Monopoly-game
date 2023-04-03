<template>
    <div class="fullprofile__victories">
        <span class="fullprofile__victories-value">{{ victories | setCase([
                        $t('USER_PROFILE.Победа'),
                        $t('USER_PROFILE.Победы'),
                        $t('USER_PROFILE.Побед')
                    ], '<') }}</span>
    </div>
</template>

<script>
    import { setCase } from '@/helpers/text';

    export default {
        name: "UserProfileVictories",
        filters: {
            setCase,
        },
        props: {
            victories: Number
        }
    }
</script>

<style lang="scss" scoped>
    .fullprofile {
        &__victories {
            margin-bottom: 15px;

            &-value {
                font-size: 14px;
                line-height: 17px;
                font-weight: 500;
                color: #fff;

                @media(min-width: 1920px) {
                    font-size: 24px;
                    line-height: 28px;
                }
            }
        }
    }
</style>