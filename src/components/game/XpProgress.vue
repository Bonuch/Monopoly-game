<template>
  <div style="padding:0 20px;">
    <div class="progress-simplified">
      <b-progress height="20px" v-if="config" :value="0" :max="config.toXp">
        <b-progress-bar v-for="(i, index) in config.lvls" v-bind:key="index" :value="i.xp" variant="outline-warning">Уровень {{i.lvl}}</b-progress-bar>
      </b-progress>
    </div>
    <b-progress v-if="config" :max="config.toXp" show-progress animated>
      <b-progress-bar variant="warning" :value="config.lvls[0].xp">
        &nbsp;
      </b-progress-bar>
      <b-progress-bar ref="progress1" :value="config.from < config.lvls[1].xp ? config.from : config.lvls[1].xp">
        {{config.from < config.lvls[1].xp ? Math.floor(config.from / config.lvls[1].xp * 100) : 100}} %
      </b-progress-bar>
      <b-progress-bar ref="progress2" v-if="config.lvls.length > 2" :value="config.from >= config.lvls[1].xp ? config.from - config.lvls[1].xp : 0">
        {{config.from >= config.lvls[1].xp ? Math.floor((config.from - config.lvls[1].xp) / config.lvls[2].xp * 100) : '' }} %
      </b-progress-bar>
    </b-progress>
  </div>
</template>

<script>
export default {
  name: 'XpProgress',
  mounted() {
    $(() => {
      setTimeout(() => {
        this.config.from = this.config.to;

        let timeout = 0;

        $('.lootbox').map((index, item) => {
          setTimeout(() => {
            $(item).addClass('magictime tinUpIn');
          }, timeout);

          timeout += 100;
        });
      }, 1000);
    });
  },
  props: {
    config: null
  },
  methods: {
  }
}
</script>

<style>
.progress-simplified .progress {
  background-color: transparent;
}

.progress-simplified .progress-bar {
  background-color: transparent;
}
</style>
