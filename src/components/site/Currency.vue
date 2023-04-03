<template>
  <div class="currency">

  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Currency.vue",
  computed: {
    ...mapGetters([
      'currentUser',
    ])
  },
  data() {
    return {
      settingsDropdownVisible: false,
    };
  },
}
</script>

<style scoped>

</style>
