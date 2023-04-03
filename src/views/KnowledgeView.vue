<template>
  <div class="knowledge-view__wrapper">
    <NavMenuProfile></NavMenuProfile>
    <nav class="branch__menu">
      <ul class="branch__list">
        <li class="list__item" v-for="(value, key) in getKnowledge" :key="key">
          <router-link v-if="key !== '_map'" :to="{ name: 'knowledge-branch', params: { branch: key }}">
            {{ $tt('KNOWLEDGE.', value.title) | normalize }}
          </router-link>
        </li>
      </ul>
    </nav>
    <main class="knowledge__wrapper">
      <div class="knowledge__content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import NavMenuProfile from '@/components/navigations/NavMenuProfile';
import {mapGetters} from 'vuex';

export default {
    name: 'KnowledgeView',
    components: {
        NavMenuProfile,
    },
    computed: {
        ...mapGetters(['getKnowledge'])
    },
    filters: {
        normalize(value) {
            if (!value) return ''
            value = value.toString().toLowerCase()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    },
    mounted() {
        // console.log("KNOWLEDGES: ", this.getKnowledge);
        this.$store.commit('updateBackground', '/images/knowledge/background_image.png');
    },
    beforeDestroy() {
      this.$store.commit('updateBackground', '');
    },
    created() {
        if (Object.keys(this.$router.currentRoute.params).length == 0) {
            this.$router.push('/profile/knowledge/economy');
        }
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

.knowledge-view__wrapper {
  position: relative;
}

.branch {
  &__menu {
    display: flex;
    position: sticky;
    top: 68px;
    background: #323639e9;
    justify-content: center;
    z-index: 500;
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

        &:hover {
          @include hoverActive;
        }
      }

    }
  }
}

.knowledge__wrapper {
  min-height: 100vh;
   background-image: url('../../public/images/knowledge/bg_blur.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.knowledge__content {
  width: 768px;
  margin: auto;
}

@media screen and (max-width: 1024px) {
  .knowledge__content {
    width: 100%;
  }
}


</style>
