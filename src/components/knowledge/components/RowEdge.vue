<template>
  <div>
    <span
      v-for="(card_pos, index) in lineAngle"
      :key="index"
      class="card__line"
      :style="{transform: 'rotate('+ card_pos.angle + 'deg)', width: card_pos.width + 'px'}"
    >
    </span>
  </div>
</template>

<script>
export default {
  name: "Edge",
  props: ['card_code'], // Зависимость карты
  data() {
    return {}
  },
  computed: {},
}
</script>

<style lang="scss" scoped>
.card {
  &__image {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      border-radius: 5px 5px 0 0;

    }
  }

  &__line {
    background: url("/design/knowledge/transparent-white-line-text-font-5d94042b98fd24.png");
    display: block;
    width: 170px;
    height: 30px;
    position: absolute;
    transform-origin: left;
    left: 48%;
  }

  &__name {
    padding: 0;
    margin-top: 0;
    margin-bottom: 15px;
  }

  &__description {
    padding: 15px 0;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__progress {
    margin-top: auto;
  }
}
</style>
