<template>
    <div class="modal" @click.self="closeModal">
        <div class="award__modal__wrapper">
            <div class="award__modal__content">
                <slot :closeModal="closeModal"></slot>
                <div class="modal__close__container">
                    <a href="#" @click="takeAward()">{{ btnTitle }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "Modal",
    props: {
        btnTitle: String,
    },
    methods: {
        ...mapActions([
            "fetchAwardList",
        ]),
        takeAward() {
            this.$socket.client.emit("take_weekly_awards", {}, async data => {
                if (!data.fail) {
                    await this.fetchAwardList();
                }
                this.closeModal();
            });
        },
        closeModal() {
            this.$store.commit("awardModalOpen", false);
        },
    },
};
</script>

<style lang="scss" scoped>
.modal {
    z-index: 1000;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 0;
    background: rgba(#000, .8);
    backdrop-filter: blur(20px);

    &__close__container {
        display: flex;
        position: absolute;
        justify-content: center;
        align-items: center;
        width: 100%;
        left: 0;
        box-sizing: border-box;

        a {
            box-sizing: border-box;
            background: var(--color-purple-medium);
            padding: 10px 45px;
            border-radius: 6px;
            color: #fff;
            font-size: 18px;
            text-decoration: none;
            background: linear-gradient(354deg, #c094e7, #8d56c3, #6a1ed5, #6a1ed5, #ec8d3f, #fed700, #f2ff40);
            background-size: 1400% 1400%;

            -webkit-animation: AnimationName 11s ease infinite;
            -moz-animation: AnimationName 11s ease infinite;
            animation: AnimationName 11s ease infinite;
        }

        bottom: -65px;
    }
}

.award {
    &__modal {
        &__content {
            position: relative;
            //animation-name: lightPoint;
            //animation-timing-function: ease;
            //animation-duration: 1s;
            //animation-fill-mode: forwards;
            display: flex;
            flex-direction: column;
            padding: 20px 30px;
            background: var(--color-background);
            border-radius: 16px;
            color: #fff;
        }

        &__wrapper {
            display: flex;
            padding: 3px;
            border-radius: 16px;
        }
    }
}

@-webkit-keyframes AnimationName {
    0% {
        background-position: 0% 33%
    }
    50% {
        background-position: 100% 68%
    }
    100% {
        background-position: 0% 33%
    }
}

@-moz-keyframes AnimationName {
    0% {
        background-position: 0% 33%
    }
    50% {
        background-position: 100% 68%
    }
    100% {
        background-position: 0% 33%
    }
}

@keyframes AnimationName {
    0% {
        background-position: 0% 33%
    }
    50% {
        background-position: 100% 68%
    }
    100% {
        background-position: 0% 33%
    }
}
</style>
