<template>
  <v-card tile class="mx-auto">
    <v-list nav>
      <v-list-item-group v-if="is_hover" color="primary">
        <v-list-item :to="route" :two-line="!!subtitle">
          <v-list-item-icon>
            <v-avatar class="user-avatar" :color="color">
            <v-icon>{{ icon }}</v-icon>
            </v-avatar>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ title }}</v-list-item-title>
            <v-list-item-subtitle>{{ subtitle }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-list-item v-else :two-line="!!subtitle">
        <v-list-item-icon>
          <v-avatar class="user-avatar" :color="color">
          <v-icon>{{ icon }}</v-icon>
          </v-avatar>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ title }}</v-list-item-title>
          <v-list-item-subtitle>{{ subtitle }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

    </v-list>
  </v-card>
</template>
<script>

export default {
  data: () => ({
  }),
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: [String, Number],
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    route: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#455A6455'
    },
    is_hover: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
  }
}
</script>