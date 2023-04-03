<template>
    <div>
        <div class="wrapper">
            <Structure class="structure__container" :paths="struct" />
            <div class="translate__container">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
import Structure from "./Structure";

export default {
    name: "TranslateEditor",
    props: ["struct"],
    components: { Structure },
    data() {
        return {};
    },
};
</script>

<style scoped lang="scss">
.wrapper {
    display: flex;
    margin-top: 15px;
    //flex-wrap: wrap;
    //min-height: 50%;
    height: calc(100vh - 300px);
}

.flex {
    display: flex;
    .w-100 {
        width: 100%;
    }
}

.structure__container {
    display: flex;
    //height: 100%;
    flex-direction: column;
    background: lighten(#121212, 8);
    width: 15%;
    overflow-x: auto;
    scrollbar-color: #6969dd #e0e0e0;
    scrollbar-width: thin;
}

.translate__footer {
    //width: 100%;
    //display: flex;
    margin-top: 15px;
    text-align: right;
}

.translate__container {
    width: 100%;
    padding-left: 15px;
}

.translate__btn_save {
    background: #4A2996;
    padding: 5px 15px;
    border-radius: 3px;
}
</style>
