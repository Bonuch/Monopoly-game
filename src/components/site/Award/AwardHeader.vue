<template>
    <div class="modal__header">
        <img src="/design/awards/prize.png" alt="" class="header__image">
        <h1 class="header__title">{{ title }}</h1>
        <p class="header__description">{{ description }}</p>
    </div>
</template>

<script>
export default {
    name: "AwardHeader",
    props: ['description', 'title']
};
</script>

<style scoped lang="scss">
.modal {
    &__header {
        position: relative;

        .header {
            &__image {
                width: 50px;
                height: 50px;
                position: absolute;
                top: -50px;
                left: 50%;
                transform: translateX(-50%);
                filter: drop-shadow(0px 5px 5px #000);
            }

            &__title {
                margin: 15px 0 0 0;
                text-transform: uppercase;
            }

            &__description {
                margin: auto;
                margin-top: 5px;
                text-align: center;
                max-width: 400px;
            }
        }
    }
}
</style>
