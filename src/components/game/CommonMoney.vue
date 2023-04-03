<template lang="pug">
  div.tile-container(style="padding:30px 0" v-if="$parent.state.options.commonmoney")
    | Общак:
    br
    | {{ $parent.state.balance }}
    span(style="font-family:BTC") BTC
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  name: 'CommonMoney',
  methods: {
  }
}
</script>


