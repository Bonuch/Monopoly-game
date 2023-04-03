<template>
  <div class="base-scrollbar">
      <slot />
  </div>
</template>

<script>
    export default {
        name: "BaseScrollbar"
    }
</script>

<style scoped lang="scss">
    .base-scrollbar {
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #585858 #454545;

        &::-webkit-scrollbar {
            width: 9px;
            background-color: transparent;
        }

        &::-webkit-scrollbar-track {
            border-radius: 10px;
            background-color: #454545;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background-color: #585858;
        }
    }
</style>
