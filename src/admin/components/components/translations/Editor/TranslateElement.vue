<template>
    <tr :class="{changed: isChanged}">
        <td class="translate__element key__label">
            <input
                v-if="creating"
                class="created__key"
                placeholder="название ключа"
                v-model="element.translate_key"
            >
            <label
                v-else
                :for="element.translate_key"
            >
                {{ element.translate_key }}
            </label>
        </td>
        <td class="translate__element">
                    <textarea
                        :id="element.translate_key"
                        v-model="element.translate_val"
                        @change="changeElem" type="text"
                    >
                    </textarea>
            <textarea
                v-if="showDescription"
                :id="element.translate_key + element.description"
                v-model="element.description"
                @change="changeElem" type="text"
            >
                    </textarea>
        </td>
    </tr>
</template>

<script>
export default {
    name: "TranslateElement",
    props: ["element", "creating", "showDescription"],
    data() {
        return {
            isChanged: false,
        };
    },
    methods: {
        changeElem() {
            this.isChanged = true;
            this.$emit("valueChanged", this.element);
        },
    },
};
</script>

<style scoped lang="scss">
.translate__element {
    padding: 5px;
    //flex: 50%;
    margin-bottom: 15px;

    label {
        font-size: 14px;
        color: #999;
        margin-bottom: 5px;
        display: block;
        transition: .2s;
    }

    textarea {
        width: 100%;
        padding: 5px 10px;
        color: #eee;
        background: #2e2e2e;
        transition: .2s;

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

.changed {
    label {
        color: #fff;
    }

    textarea {
        color: #fff;
        background: #4e4e4e;
    }
}

.created__key {
    color: #fff;
    width: 100%;
    height: 100%;
    padding: 10px 0;
}
</style>
