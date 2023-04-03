<template>
    <div class="p-3">
        <h2>Переводы</h2>
<!--        <Structure :paths="paths" />-->
        <TranslateEditor :struct="structure"/>
    </div>
</template>

<script>
import TranslationPage from "../../../mixins/TranslationPage";
import TranslateEditor from "./Editor/TranslateEditor";

export default {
    name: "Translator",
    // mixins: [TranslationPage],
    components: {TranslateEditor},
    data() {
        return {
            translation_type: 'game',
            structure: null
        };
    },
    computed: {
        currentGroup() {
            console.log(this.$route.params.trGroup);
            return this.$route.params.trGroup;
        }
    },
    methods: {
        async load() {
            await this.$store.$app.$socket.client.emit("get_translate_structure", {
                group: this.$route.params.trGroup,
            }, response => {
                this.structure = response
            });
        },
    },
    async created() {
        await this.load();
    },
    async beforeRouteUpdate(to, from, next) {
        if (to.params.trGroup === from.params.trGroup) {
            next();
            return;
        }
        next();
        await this.load();
    }
};
</script>

<style lang="scss" scoped>
.p-3 {
    padding: 15px;
}
</style>
