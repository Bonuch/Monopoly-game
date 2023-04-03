<template>
    <div v-if="is_show" class="modal-background" @click.stop="handleBackground">
        <div class="modal-body">
            <div class="item-image">
                <img :src="image_url" :class="[{'is-jumping': is_jumping}, {'is-rotation': is_rotation}]">
                <i v-if="is_state_success" class="fa fa-check lime"></i>
                <i v-if="is_state_failure" class="fa fa-times red"></i>
            </div>
            <div class="message">
                <slot></slot>
                <div class="modal-buttons" v-if="is_state_ask">
                    <button @click="$emit('cancel'); hide();" :disabled="is_disabled" class="modal-button cancel">
                        {{ cancel_label_local }}
                    </button>
                    <button @click="$emit('ok')" :disabled="is_disabled" class="modal-button ok">
                        {{ accept_label }}
                    </button>
                </div>
                <div class="modal-buttons" v-else>
                    <button @click="$emit('close'); hide();" :disabled="is_disabled" class="modal-button cancel">
                        {{ $t("GENERAL.Закрыть") }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

export default {
    name: "IllustratedModal",
    props: {
        image_url: {
            type: String,
            default: "",
        },
        // Иконка успеха
        is_state_success: {
            type: Boolean,
            default: false,
        },
        // Иконка неудачи
        is_state_failure: {
            type: Boolean,
            default: false,
        },
        // Состояние вопроса. Кнопки "Да" / "Нет", иначе кнопка "Закрыть"
        is_state_ask: {
            type: Boolean,
            default: true,
        },
        accept_label: {
            type: String,
            default: "Ok",
        },
        cancel_label: {
            type: String,
            default: "",
        },
        // Блокирует все кнопки
        is_disabled: {
            type: Boolean,
            default: false,
        },
        // Эффект подпрыгивания картинки
        is_jumping: {
            type: Boolean,
            default: false,
        },
        // Эффект вращения картинки
        is_rotation: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            is_show: false,
            cancel_label_local: "",
        };
    },
    methods: {
        show() {
            this.cancel_label_local = this.cancel_label ? this.cancel_label : this.$t("GENERAL.Отменить");
            this.is_show = true;
        },
        hide() {
            this.is_show = false;
        },
        handleBackground(event) {
            if (event.target.className == "modal-background") {
                this.hide();
            }
        },
    },
    created() {
        const onEscape = (e) => {
            if (this.show && e.keyCode === 27) {
                this.hide();
            }
        };
        document.addEventListener("keydown", onEscape);
        this.$once("hook:destroyed", () => {
            document.removeEventListener("keydown", onEscape);
        });
    },
};
</script>

<style scoped>
.modal-background {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #1119;
}

.modal-body {
    position: fixed;
    border-radius: 6px;
    z-index: 1001;
    top: 40%;
    left: 50%;
    width: 450px;
    min-height: 150px;
    background: #323639f9;
    transform: translateX(-50%) translateY(-50%);
    border: solid 1px #424649f9;
    display: flex;
    justify-content: space-around;
    box-shadow: 0px 7px 5px -5px #4d4d4d99;
}

.item-image {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 150px;
    padding: 20px 0 20px 20px;;
    position: relative;
}

.item-image img {
    max-height: 100px;
}

.item-image i {
    position: absolute;
    font-size: 50px;
}

.message {
    display: flex;
    flex-direction: column;
    color: white;
    justify-content: space-around;
    padding: 5px 20px;
    width: 100%;
}

.message span {
    line-height: 1.4;
    text-align: left;
}

.message span a {
    color: rgb(115, 24, 243);
}

.modal-buttons {
    text-align: right;
    /*margin-top: 20px;*/
}

.modal-buttons button {
    width: 90px;
    margin: 5px;
    height: 25px;
    background-color: #323639;
    border: solid 1px #232629;
    border-radius: 3px;
    color: white;
    cursor: pointer;
}

.modal-buttons button.ok:hover {
    background-color: #16964b;
    border: solid 1px #10863b;
}

.modal-buttons button.cancel:hover {
    background-color: #525659;
    border: solid 1px #424649;
}

.modal-buttons button:focus {
    outline: none !important;
}

.modal-buttons button::-moz-focus-inner {
    border: 0;
}

.lime {
    color: lime;
}

.red {
    color: red;
}

.modal-buttons button:disabled, .modal-buttons button:disabled:hover {
    background-color: #626669 !important;
    border: solid 1px #838689 !important;
    color: #aaaaaa;
    opacity: 0.8;
}

@keyframes jump {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-7px);
    }
    55% {
        transform: translateY(-8px);
    }
    65% {
        transform: translateY(-6px);
    }
    95% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(0);
    }
}

.item-image img.is-jumping {
    animation: jump 0.3s infinite;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.item-image img.is-rotation {
    animation-name: rotation;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}
</style>
