<template>
    <div class="create__key">
        <button class="btn__close" @click.prevent="$emit('closeWindow')"><v-icon>mdi-close</v-icon></button>
        <h2>Название ключа</h2>
        <v-text-field
            :rules="rules"
            v-model="key"
            placeholder="название ключа"
            hide-details="auto"
        ></v-text-field>
        <v-btn class="btn__save" @click.prevent="$emit('save', key)">
            Сохранить
        </v-btn>
    </div>
</template>

<script>
export default {
    name: "CreateKey",
    data() {
        return {
            key: null
        }
    },
};
</script>

<style scoped lang="scss">
.create__key {
    padding: 20px;
    background: #2e2e2e;
    border-radius: 10px;
    width: 500px;
    box-shadow: 0px 4px 40px #000;
    position: relative;
}
.btn__close {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10000001;
}
.btn__save {
    margin-top: 15px;
    width: 100%;
}

</style>
