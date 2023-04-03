<template>
    <div class="statistic">
        <StatBlock v-for="(item, key) in stats" :cards="item" :key="key" class="mb-20"></StatBlock>
        <!--        <StatBlock v-for="(item, key) in stats" :cards="item" :key="key"/>-->
    </div>
</template>

<script>
import StatBlock from "./StatBlock";

export default {
    name: "UserStat",
    components: { StatBlock },
    data() {
        return {
            stats: null,
        };
    },
    async mounted() {
        await this.$socket.client.emit("get_knowledge_stat", {}, (response) => {
            if (response.error) {
                return;
            }
            const resObj = {};
            for (const key in response) {
                if (response[key] && Object.keys(response[key].cards).length > 0) {
                    resObj[key] = response[key]
                }
            }
            this.stats = resObj;
        });
    },
    methods: {
        filterStats(stats) {
            for (const key in stats) {
                // for (const groupType in stats[key].cards) {
                //     stats[key].cards[groupType]
                // }
                // stats[key].cards = stats[key].cards.filter(item => {
                //     return item.level
                // })
            }
        },
    },
};
</script>

<style scoped lang="scss">
.statistic {
    color: #fff;
}
.mb-20 {
    margin-bottom: 20px;
}
</style>
