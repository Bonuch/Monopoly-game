<template>
  <nav class="branch__menu">
    <ul class="branch__list">
      <li class="list__item">
        <router-link :to="{name: 'knowledge-battle'}">{{ $t('KNOWLEDGE.Боевое') }}</router-link>
      </li>
      <li class="list__item">
        <router-link :to="{name: 'knowledge-defense'}">{{ $t('KNOWLEDGE.Защитное') }}</router-link>
      </li>
      <li class="list__item">
        <router-link :to="{name: 'knowledge-economy'}">{{ $t('KNOWLEDGE.Экономика') }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "BranchNav",
  props: ['routes'],
  computed: {
    ...mapGetters(['getKnowledge'])
  }
}
</script>

<style lang="scss" scoped>
@mixin hoverActive {
  color: #fff;
  &::before {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background: #D3CCDC;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}

.branch {
  &__menu {
    display: flex;
    background: #323639;
    justify-content: center;
  }

  &__list {
    padding: 0;
    list-style: none;
    margin: 0;
    display: flex;

    .list__item {
      display: block;

      a {
        padding: 15px;
        display: block;
        color: #989A9C;
        position: relative;
        text-decoration: none;
        transition: .2s;

        &.active {
          @include hoverActive;
        }

        &:hover{
          @include hoverActive;
        }
      }

    }
  }
}
</style>
