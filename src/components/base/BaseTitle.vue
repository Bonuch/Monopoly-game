<template>
  <div class="base-title">
      <slot />
  </div>
</template>

<script>
    export default {
        name: "BaseTitle"
    }
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    .base-title {
        max-width: 684px;
        padding: 16px 56px 22px 36px;
        margin: 0 auto 12px;
        background: #323639;
        color: #fff;
        text-align: center;
        border-color: #323639;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
    }
</style>
