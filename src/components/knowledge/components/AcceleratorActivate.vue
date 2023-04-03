<template>
  <div class="accelerator-activate">
    <p v-if="accelerators.length">{{ $t('KNOWLEDGE.Ускорить изучение') }}</p>
    <p v-if="is_loading">
      <i class="fa fa-spin fa-spinner"></i>
      {{ $t('KNOWLEDGE.Загрузка ускорителей') }}...
    </p>
    <p v-if="!accelerators.length && !is_loading">
      {{ $t('KNOWLEDGE.Вы можете купить ускорители в') }}
      <button class="btn__goto" @click.prevent="gotoShop()">
        {{ $t('CUSTOMIZE_LOOT.магазине') }}
      </button>
    </p>
    <template v-for="accelerator in accelerators">
      <a v-if="accelerator.count"
        :key="accelerator.id"
        @click="runAccelerator(accelerator)"
        class="upgrade__button--mostly"
        style="padding: 10px;"
        :disabled="!!accelerator.is_processing"
      >
        <i v-if="!!accelerator.is_processing" class="fa fa-spin fa-spinner"></i>
        <span v-else>
          {{ accelerator.count }} х
          <i class="fa fa-hourglass-end"></i>
          {{ $tt('KNOWLEDGE.', accelerator.title.replace('Ускорить изучение ', '')) }}
        </span>
      </a>
    </template>
  </div>
</template>

<script>

import Vue from 'vue'

export default {
  props: {
    card_code: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      accelerators: [],
      is_loading: true
    }
  },
  methods: {
      gotoShop() {
          document.querySelector('body').classList.remove('overflow-hidden');
          this.$router.push({name: 'shop-accelerator'})
      },
    loadAccelerators() {
      this.is_loading = true
      this.$store.$app.$socket.client.emit('get_available_accelerators', null, response => {
        this.accelerators = response.accelerators
        this.is_loading = false
      })
    },
    runAccelerator(accelerator) {
      const options = {
        duration: accelerator.duration,
        card_code: this.card_code
      }

      Vue.set(accelerator, 'is_processing', true)

      this.$store.$app.$socket.client.emit('run_accelerator', options, response => {
        this.$emit('accelerated', response.progress_finish_at)
        accelerator.count--
        if (accelerator.count <= 0) {
          var index = this.accelerators.findIndex(x => x.duration == accelerator.duration)
          this.accelerators.splice(index, 1)
        }
        setTimeout(() => {
          Vue.set(accelerator, 'is_processing', false)
        }, 500);
      })
    }
  },
  mounted() {
    this.loadAccelerators()
  }
}
</script>

<style lang="scss" scoped>
// TODO: может создадим глобальные стили на кнопки?
@mixin buttonMixin($bgCol, $col: #000) {
    background: $bgCol;
    display: block;
    color: $col;
    text-decoration: none;
    width: 135px;
    padding: 8px 0;
    border-radius: 3px;
    text-align: center;
    i {
        margin-right: 5px;
    }
    &[disabled] {
        background-color: darken(#D4CFCF, 20);

        &:hover {
            cursor: not-allowed;
            background-color: darken(#D4CFCF, 15);
        }
    }
}

.upgrade__button {
    @include buttonMixin(#C4C4C4);

    &--shine {
        margin-top: 12px;
        cursor: pointer;
        @include buttonMixin(#E1DD7E);
        transition: .2s;

        &:hover {
            background-color: lighten(#E1DD7E, 10);
        }
    }

    &--mostly {
        margin-top: 12px;
        cursor: pointer;
        @include buttonMixin(#24202C, #fff);
        transition: .2s;

        &:hover {
            background-color: lighten(#24202C, 10);
        }
    }
}

.accelerator-activate {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 70%;
  margin-top: 10px;
  & > p {
    flex-grow: 1;
    flex-shrink: 1;
    width: 100%;
  }
 }
 a {
  text-decoration: none;
  color: rgb(166, 31, 255);
}

 .btn__goto {
     color: var(--color-purple-light);
     background: none;
     border: none;
     outline: none;
     font-size: 16px;
     padding: 0;
     cursor: pointer;
 }
</style>
