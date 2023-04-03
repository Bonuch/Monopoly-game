<template>
  <ul class="nav-menu-shop">
    <router-link
      v-for="(item, index) in list"
      :key="index"
      tag="li"
      :to="item.link"
      class="nav-menu-shop__item"
    >
      <img v-if="item.condition" class="new" :src="item.img" alt="#">

      {{ $tt('USER_PROFILE.', item.title) }}
    </router-link>
  </ul>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  data() {
    return {
      list: [
        {
          title: 'Боксы',
          link: '/profile/loot',
          condition: null,
          img: null,
        },
        {
          title: 'Бренды',
          link: '/profile/brands',
          condition: this.getIsNewCustomBrands,
          img: '/design/icons/new-mark.svg',
        },
        {
          title: 'Знания',
          link: '/profile/knowledge',
          condition: this.getIsNewCustomBrands,
          img: '/design/icons/new-mark.svg',
        },
        {
          title: 'Кубики',
          link: '/profile/dice',
          condition: this.getIsNewCustomDice,
          img: '/design/icons/new-mark.svg',
        },
        {
          title: 'Фишки',
          link: '/profile/chips',
          condition: this.getIsNewCustomChips,
          img: '/design/icons/new-mark.svg',
        },
        {
          title: 'Профиль',
          link: '/profile/me',
          condition: null,
          img: null,
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      'getIsNewCustomBrands',
      'getIsNewCustomChips',
      'getIsNewCustomDice',
    ]),
  },
  methods: {
    ...mapActions([
      'SOCKET_IS_NEW_CUSTOM_BRANDS',
      'SOCKET_IS_NEW_CUSTOM_CHIPS',
      'SOCKET_IS_NEW_CUSTOM_DICE',
    ]),
    path(item) {
      return '/' + item.name.replace('-', '/')
    },
    navigate(name) {
      this.$router.push({name: name});
    },
    // active (item) {
    //     if (this.$route.name == item.name) {
    //         return true
    //     } else {
    //         return false
    //     }
    // if (input == '/shop') return false

    // const paths = Array.isArray(input) ? input : [input];
    // return paths.some(path => {
    //     return this.$route.path.indexOf(path) === 0
    // })
    // }
  },
  created() {
    this.SOCKET_IS_NEW_CUSTOM_BRANDS();
    this.SOCKET_IS_NEW_CUSTOM_CHIPS();
    this.SOCKET_IS_NEW_CUSTOM_DICE();
  },
}
</script>


<style scoped lang="scss">
.nav-menu-shop {
  list-style: none;
  z-index: 1;
  position: relative;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0;
  margin: 0;
  background-color: #323639;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);

  &__item {
    box-sizing: border-box;
    position: relative;
    padding: 9px 20px 11px;
    color: #8D8B8B;
    font-size: 17px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;

    &.active,
    &:hover {
      background-color: #fff1;
      color: #fff;

      &::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #7D33E4;
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }

    &.active {
      pointer-events: none;
    }

    .new {
      position: absolute;
      width: 8px;
      height: 8px;
      top: 8px;
      right: 8px;
    }
  }
}

</style>
