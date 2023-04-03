<template>
  <div class="cards__row">
    <KnowledgeCard
      v-for="item in items"
      :item="item"
      :id="'card_' + item.code"
      :key="item.id"
      :name="item.name"
      :child="item.children || item.dependency"
      :curentLevel="item.level"
      :maxLevel="item.max_level"
      :image="item.image"
    />
  </div>
</template>

<script>
import KnowledgeCard from "./KnowledgeCard";

export default {
  name: "KnowledgeRow",
  props: ['items'],
  components: {KnowledgeCard},
  computed: {
    cardCodes() {
      let res = this.items.map(item => {
        return item.code
      })
      return res
    }
  },
}
</script>

<style scoped>
.cards__row {
  display: flex;
  padding: 50px 0;
}
</style>
