<template>
  <span v-show="!disabled">
    <span v-html="seconds"></span>
  </span>
</template>

<script>
import EventBus from '@/helpers/global-event-bus'


export default {
  data() {
    return {
      disabled: false,
      seconds: 0,
      interval: null
    }
  },
  props: {
    userId: {
      type: Number,
      default: null
    },
  },
  name: 'Countdown',
  methods: {
    refreshCountdown(time) {
      if (this.interval) {
        clearInterval(this.interval);
      }

      this.seconds = time;

      this.interval = setInterval(() => {
        this.seconds -=1;
      }, 1000);

      this.disabled = false;
    },
    disableCountdown() {
      if (this.interval) {
        clearInterval(this.interval);
      }

      this.disabled = true;
    },
    textStyle() {
      if (this.seconds < 0) {
        return 'color:red;font-weight:bold;';
      } else if (this.seconds <= 15) {
        return 'font-weight:bold;';
      } else {
        return '';
      }
    }
  },
  mounted() {
    EventBus.$on("refresh-count-down", (count) => {
      this.refreshCountdown(count)
    });
  }
}
</script>

