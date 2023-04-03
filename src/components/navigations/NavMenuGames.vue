<template lang="pug">
  ul.gamemenu__list
    li.gamemenu__item
      router-link(:to="{name: 'play'}").gamemenu__link.gamemenu__link--all Все игры
    li.gamemenu__item
      router-link(:to="{name: 'creategame'}").gamemenu__link.gamemenu__link--create Создать свою
    li.gamemenu__item
      a(href="#").gamemenu__link.gamemenu__link--near Игры рядом
</template>


<style scoped lang="scss">
    .gamemenu__link--all {
        &::before {
            background-image: url("/images/main/dice_play_inactive.png");
        }

        &:hover, &.active {
            &::before {
                background-image: url("/images/main/dice_play_active.png");
            }
        }
    }

    .gamemenu__link--create {
        &::before {
            background-image: url("/images/main/dice_create_inactive.png");
        }


        &:hover, &.active {
            &::before {
                background-image: url("/images/main/dice_create_active.png");
            }
        }
    }

    .gamemenu__link--near {
        &::before {
            background-image: url("/images/main/dice_local_inactive.png");
        }


        &:hover, &.active {
            &::before {
                background-image: url("/images/main/dice_local_active.png");
            }
        }
    }
</style>
