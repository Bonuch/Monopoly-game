<template>
  <span style="padding: 0 3px;">
    <!-- <input v-if="is_opened_edit" type="text" v-model="value"> -->
    <a @click="open">{{ value }}</a>
  </span>
</template>

<script>
export default {
  props: {
    is_open: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, String],
      required: true
    },
    data: {
      type: Object,
      default: null,
    },
    data_path: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }

  },
  data() {
    return {
      // is_opened_edit: false
    }
  },
  methods: {
    open() {
      this.$emit('open', {
        value: this.value,
        data: this.data,
        data_path: this.data_path,
        label: this.label
      })
    },
    // open2() {
    //   this.is_opened_edit = true
    // }
  }
}
</script>
