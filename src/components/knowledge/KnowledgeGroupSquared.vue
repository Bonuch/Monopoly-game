<template>
  <div v-if="knowledge" :key="this.$route.params.branch">
    <div
      v-for="(row, index) in knowledge[this.$route.params.branch].rows"
      :key="index"
    >
      <KnowledgeRow
        class="knowledge__row"
        :class="'row-items_' + row.length"
        :items="row"
      />
      <RowConnector
        :codes="cardCodes(row)"
      />
    </div>

    <CardModal v-if="isOpen" key="cardModalWindow"/>
  </div>
</template>

<script>
import KnowledgeCard from "./components/KnowledgeCard";
import {mapGetters} from 'vuex';
import CardModal from "./CardModal";
import KnowledgeRow from "./components/KnowledgeRow";
import RowConnector from "./components/RowConnector";

export default {
  name: "KnowledgeGroupSquared",
  components: {
    RowConnector,
    KnowledgeCard,
    CardModal,
    KnowledgeRow,
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
      cardInfo: 'getKnowledgeModalData',
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
  methods: {
    cardCodes(items) {
      return items.map(item => {
        return item.code
      })
    },
    onCardClick(card_id) {
      alert(card_id)
      this.modalOpen = !this.modalOpen
    },
    saveDomPoint() {

    },
    drawRelations() {
      const ids = []
    },
    getIds() {

    },
    alrt() {
      alert('')
    }
  },
  mounted() {

  }
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
