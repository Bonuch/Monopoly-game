<template lang="pug">
  div.profileblock__progress
    span.profileblock__progress-level Левел {{ lvl }}
    div.profileblock__progress-bar
      div.profileblock__progress-innerbar(:style="{ width: percent + '%' }")

</template>

<script>
    // TODO не факт что это вообще нужно будет, значения теперь хранятся в currentUser.level и currentUser.level_percent
    // todo а сама разметка при этом всего три тега, так что не понятно зачем это выносить в отдельный компонент
    import { mapActions } from 'vuex';

    export default {
        name: 'XpProgress',
        mounted() {
            this.refreshUserExperience();
        },
        methods: {
            ...mapActions([
                'refreshUserExperience',
            ]),
        }
    };
</script>

<style lang="scss">
    .profileblock__progress-bar {
      position: relative;
      width: 75%;
      height: 10px;
      background-color: #ffffff;
    }

    .profileblock__progress-innerbar {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      background-color: #3cb878;
    }
</style>
