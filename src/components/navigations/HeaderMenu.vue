<template>
  <nav class="header-menu">
      <ul class="items">
          <li class="item" :class="{ 'active': sub('/play/games') }">
            <router-link :to="{ name: 'play' }" class="link-item play" title="Играть">
              <img src="/design/navigation/new-play-games-dark.svg" alt=""/>
            </router-link>
          </li>
          <li class="item" :class="{ 'active': sub('/play/new-game') }">
            <router-link :to="{ name: 'creategame' }" class="link-item create" title="Создать игру">
              <img src="/design/navigation/new-create-game-dark.svg" alt=""/>
            </router-link>
          </li>
          <li class="item" :class="{ 'active': sub('/profile') }">
            <router-link :to="{ name: 'profile' }" class="link-item profile" title="Игровой профиль">
              <img class="profile-photo" :src="currentUser.avatar" :style="{ borderColor: currentUser.color }"/>
            </router-link>
          </li>
<!--          <li class="item" :class="{'active': sub('/watch')}">-->
<!--              <router-link :to="{name: 'watch'}" class="link-item replay" title="Смотреть">-->
<!--                  <img src="/design/navigation/replay-dark.svg" alt=""/>-->
<!--              </router-link>-->
<!--          </li>-->
          <li class="item" :class="{ 'active': sub('/watch') }">
            <router-link :to="{ name: 'watch' }" class="link-item replay" title="Смотреть игры">
              <img src="/design/navigation/new-replay-dark.svg" alt=""/>
            </router-link>
          </li>
          <li class="item" :class="{ 'active': sub('/shop') }">
            <router-link :to="{ name: 'shop' }" class="link-item shop" title="Шоп">
              <img src="/design/navigation/new-shop-dark.svg" alt=""/>
            </router-link>
          </li>
      </ul>
  </nav>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'HeaderMenu',
    computed: {
      ...mapGetters([
        'currentUser',
      ])
    },
    methods: {
      sub(input) {
        const paths = Array.isArray(input) ? input : [input];
        return paths.some(path => {
          return this.$route.path.indexOf(path) === 0
        })
      }
    }
  };
</script>

<style scoped lang="scss">
    .header-menu {
        align-items: center;
        flex-basis: 60%;
        text-align: center;
        height: 65px;
        margin-top: 3px;

        .items {
            display: flex;
            justify-content: center;
            list-style: none;
            margin: 0;
            padding: 0;
            height: 100%;
            @media only screen and (max-width: 1366px) {
                justify-content: flex-end;
            }

            .item {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                box-sizing: content-box;
                width: 104px;
                @media only screen and (max-width: 1024px) {
                    width: 104px;
                }
                @media only screen and (max-width: 834px) {
                    width: 70px;
                }

                &::after {
                    content: "";
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: #7d33e4;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                &:hover::after {
                    opacity: 1;
                }

                &.active::after {
                    opacity: 1;
                }

                img {
                    height: 38px;

                    &.profile-photo {
                        height: 38px;
                        border-radius: 100%;
                        border: 1px solid #3418E4;
                    }
                }

                .link-item {
                    color: #333333;
                    text-decoration: none !important;
                    outline: none;
                    width: 70px;
                }
            }
        }
    }
</style>
