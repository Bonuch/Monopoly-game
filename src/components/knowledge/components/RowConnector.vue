<template>
  <div class="connector" :style="{width: row_width + 'px'}" ref="rowItem" :class="codes">
    <span v-for="elem in codes" :style="drawLines(elem)" :key="elem"> {{ elem }}</span>
    {{ row_width }}
    {{ codes }}
  </div>
</template>

<script>
export default {
  name: "RowConnector",
  props: ['elements', 'row_width', 'codes'], // Коды карт которые содержит строка
  data() {
    return {
      el_pos: null
    }
  },
  mounted() {
  },
  computed: {
    fillClass() {
      return this.elements
    },
  },
  methods: {
    calcLeftDot(code) {
      const parent_width = this.$refs.rowItem
      const parent = document.getElementById('card_' + code)
      if (parent) {
        const cord = parent.getBoundingClientRect()
        console.log(cord.x - parent_width.x)
        return cord.x - parent_width.x

      }
    },
    drawLines(code) {
      const left = this.calcLeftDot(code)
      return {
        transformOrigin: 'left',
        position: 'absolute',
        background: 'red',
        width: '100px',
        height: '30px',
        transform: `rotate(90deg)`,
        left: left + 'px',
      }
    },
    calcWidth() {

    }
  }
}
</script>

<style scoped>
.connector {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  background-color: #00bff3;
}
</style>
