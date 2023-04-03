<template>
  <v-btn icon dark @click="hiddenToggle()">
    <v-icon>{{ isHiddenFieldIcon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      hidden_fields: []
    }
  },
  methods: {
    parseFields() {
      this.hidden_fields = this.value.split(',')
    },
    hiddenToggle() {
      let index = this.hidden_fields.indexOf(this.name)
      if (index == -1) {
        this.hidden_fields.push(this.name)
      } else {
        this.hidden_fields.splice(index, 1)
      }
      this.$emit('input', this.hidden_fields.join(','))
    },
  },
  watch: {
    value() {
      this.parseFields()
    },
  },
  computed: {
    isHiddenFieldIcon() {
      return this.hidden_fields.includes(this.name) ? 'fa-eye-slash' : 'fa-eye'
    }
  },
  mounted() {
    this.parseFields()
  }
}
</script>

<style>

</style>
