<template>
    <div>
        <v-row>
            <v-col cols="12" md="6">
                <v-list>
                    <v-list-item two-line>
                        <v-list-item-icon>
                            <v-avatar class="user-avatar" size="70">
                                <img :src="user.avatar_url">
                            </v-avatar>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <h3>{{ user.name }}</h3>
                                    <!-- <span title="Количество друзей">
                                      <v-icon small>fa-users</v-icon>
                                      {{ user.friends.length }}
                                    </span> -->
                                    <span title="Количество побед">
                  <v-icon small>fa-trophy</v-icon>
                  {{ user.number_of_victories }}
                </span>
                                    <span title="Количество предметов">
                  <v-icon small>fa-cube</v-icon>
                  {{ user.items.length }}
                </span>
                                </div>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <div>
                                    <v-progress-linear
                                        color="deep-purple darken-3"
                                        stream
                                        :value="(100 - user.level.percent)"
                                        height="25"
                                        striped
                                    >
                                        <strong>Уровень {{ user.level.level }}</strong>
                                    </v-progress-linear>
                                </div>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="12" md="3" sm="6">
                <CardSectionIcon
                    :is_hover="false"
                    icon="fa fa-dollar"
                    :title="user.UserBalance.balance_bucks"
                    color="light-green darken-4"
                ></CardSectionIcon>
            </v-col>
        </v-row>
        <v-row class="mb-5">

            <v-col>
                <ShineRow :shines="shines"/>
            </v-col>
<!--            <v-col cols="12" md="3" sm="6" v-for="key in shineKeys">-->
<!--                <CardSectionIcon-->
<!--                    :is_hover="false"-->
<!--                    :icon="key"-->
<!--                    :title="user.UserBalance[key]"-->
<!--                    color="blue-grey darken-2"-->
<!--                ></CardSectionIcon>-->
<!--            </v-col>-->
        </v-row>
    </div>
</template>

<script>
import CardSectionIcon from "../../CardSectionIcon.vue";
import ShineRow from "./ShineRow";

export default {
    components: {
        ShineRow,
        CardSectionIcon,
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    computed: {
        shines() {
            const result = {}
            this.shineKeys.forEach(key => {
                result[key] = this.user.UserBalance[key];
            })
            return result;
        }
    },
    data() {
        return {
            shineKeys: ["shine1", "shine2", "shine3", "shine4", "shine5"],
        };
    },
};
</script>

<style>

</style>
