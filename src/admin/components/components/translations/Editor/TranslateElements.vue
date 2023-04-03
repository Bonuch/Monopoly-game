<template>
    <div class="translate__elements">

        <v-overlay
            z-index="1000000"
            :value="overlay"
        >
            <CreateKey @closeWindow="overlay = !overlay" @save="createKey" />
        </v-overlay>

        <div class="translate__header">
            <p class="key__label">Ключ</p>
            <p class="key__descr">Перевод</p>
        </div>
        <table class="translate__table">
            <TranslateElement
                v-for="(elem, idx) in elements"
                :element="elem"
                :showDescription="showDescription"
                :key="langPref + '_' + elem.translate_key"
                @valueChanged="$emit('valueChanged', elem)"
            />
        </table>
        <button class="btn__add__translate" @click.prevent="addNewKey">Добавить ключ</button>
    </div>
</template>

<script>

import TranslateElement from "./TranslateElement";
import CreateKey from "./CreateKey";

export default {
    name: "TranslateElements",
    props: ["elements", "showDescription"],
    components: { CreateKey, TranslateElement },
    data() {
        return {
            overlay: false,
            translate_value: null,
            new_keys: [],
        };
    },
    computed: {
        langPref() {
            const route = this.$route.params.pathMatch.split("/").filter(item => item !== "");
            return route[route.length - 1];
        },
    },
    methods: {
        addNewKey() {
            this.toggleOverlay()
        },
        toggleOverlay() {
            this.overlay = !this.overlay;
        },
        createKey(new_key) {
            this.$emit('saveNewKey', {new_key, cb: this.toggleOverlay});
        }
    },
};
</script>

<style lang="scss" scoped>
.translate__elements {
    display: flex;
    flex-wrap: wrap;
}

.translate__header {
    display: flex;
    width: 100%;
    font-weight: bold;
    text-align: center;
    position: sticky;
    top: 0;
    padding: 15px;
    background: #171717;

    p {
        margin: 0;
    }
}

.translate__element {
    padding: 5px;
    //flex: 50%;
    margin-bottom: 15px;

    label {
        font-size: 14px;
        color: #999;
        margin-bottom: 5px;
        display: block;
    }

    textarea {
        width: 100%;
        padding: 5px 10px;
        color: #eee;
        background: #2e2e2e;

        &:focus {
            border-color: #2e2e2e;
        }

        &:focus-visible {
            outline: #6f6f6f;
        }
    }
}

.translate__table {
    width: 100%;
}

.key__label {
    width: 30%;
}

.key__descr {
    width: 70%;
}

.btn__add__translate {
    //width: 80%;
    margin: auto;
    text-align: center;
    padding: 10px 50px;
    background: lighten(#171717, 3);
    transition: .2s;
    margin-bottom: 10px;

    &:hover {
        background: lighten(#171717, 10);
    }
}
</style>
