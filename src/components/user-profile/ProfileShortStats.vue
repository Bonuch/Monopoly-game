<template>
    <div class="profile-game-info">
        <div v-if="friends !== (null || undefined)" class="detail">
            <i class="icon users-small"></i>
            <p>{{
                    friends | setCase([
                        $t('USER_PROFILE.Друг'),
                        $t('USER_PROFILE.Друга'),
                        $t('USER_PROFILE.Друзей')
                    ])
                }}
                <span>{{ friends }}</span>
            </p>
        </div>

        <div v-if="victories !== (null || undefined)" class="detail">
            <i class="icon cup-small"></i>
            <p>{{
                    victories | setCase([
                        $t('USER_PROFILE.Победа'),
                        $t('USER_PROFILE.Победы'),
                        $t('USER_PROFILE.Побед')
                    ])
                }}
                <span>{{ victories }}</span>
            </p>
        </div>

        <div v-if="items !== (null || undefined)" class="detail">
            <i class="icon dice-small"></i>
            <p>{{
                    items | setCase([
                        $t('USER_PROFILE.Предмет'),
                        $t('USER_PROFILE.Предмета'),
                        $t('USER_PROFILE.Предметов')
                    ])
                }}
                <span>{{ items }}</span>
            </p>
        </div>
    </div>
</template>

<script>
import {setCase, truncate} from '@/helpers/text';

export default {
    name: 'ProfileShortStats',
    props: {
        victories: {
            type: Number,
        },
        friends: {
            type: Number,
        },
        items: {
            type: Number,
        }
    },
    filters: {
        setCase,
    },
};
</script>

<style scoped lang='scss'>
.profile-game-info {
    //flex: 1;
    display: flex;
    justify-content: space-around;
    .detail {
        color: #FFFFFF99;
        font-size: 16px;
        padding: 0px 20px;
        &:last-child {
            padding-right: 0;
        }
        p {
            margin: 0;
        }
        span {
            color: #fff;
            font-size: 22px;
            margin-top: 8px;
            display: block;
            text-align: center;
        }
    }
}
</style>
