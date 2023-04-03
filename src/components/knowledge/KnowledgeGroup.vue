<template>
    <div v-if="knowledge" :key="$route.params.branch">
        <div
            v-for="(row, index) in knowledge[$route.params.branch].rows"
            :key="index"
            :class="'row-items_' + row.length"
            class="knowledge__row"
        >
            <KnowledgeCard
                v-for="item in row"
                :item="item"
                :id="'card_' + item.code"
                :key="item.code"
                :name="item.name"
                :child="item.children || item.dependency"
                :curentLevel="item.level"
                :maxLevel="item.max_level"
                :image="item.image"
            />
        </div>
        <CardModal v-if="isOpen" key="cardModalWindow"/>
    </div>
</template>

<script>
import KnowledgeCard from "./components/KnowledgeCard";
import {mapGetters, mapActions} from 'vuex';
import CardModal from "./CardModal";


export default {
    name: "KnowledgeGroup",
    components: {
        KnowledgeCard,
        CardModal
    },
    data() {
        return {
            modalOpen: false,
            domPoints: [],
        }
    },
    computed: {
        ...mapGetters({
            knowledge: 'getKnowledge',
            show: 'getKnowledgeModal',
            // cardInfo: 'getKnowledgeModalData',
        }),
        isOpen() {
            const show = this.show
            if (show) {
                document.querySelector("body").classList.add("overflow-hidden");
                return true
            }
            return false
        },
    },
    watch: {
        getKnowledge() {
            this.refreshKnowledgeModal();
        }
    },
    mounted() {
        // console.log(this.knowledge)
        // console.log('this.$router', this.$router.currentRoute.params);
    },
    methods: {
        ...mapActions([
            'refreshKnowledgeModal',
        ]),
        onCardClick(card_id) {
            //alert(card_id)
            //this.modalOpen = !this.modalOpen
        }
    },

}
</script>

<style lang="scss" scoped>
.knowledge__row {
    display: flex;
    padding: 50px 0;
}

.row-items_3 {
    justify-content: space-between;
}

.row-items_2 {
    justify-content: space-around;
}

.row-items_1 {
    justify-content: center;
}
</style>
