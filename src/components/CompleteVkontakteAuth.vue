<template>
  <div>
    <div v-show="!error">... входим через "Facebook"</div>
    <div v-show="error">Произошла ошибка во время входа, пожалуйста попробуйте позже.</div>
  </div>
</template>

<script>
  import AuthMixin from '@/mixins/complete-auth-by-social-mixin'

  export default {
    name: "CompleteVkontakteAuth",
    mixins: [AuthMixin],
    data() {
      return {
        url: "/auth/facebook/get-token"
      };
    }
  };
</script>

