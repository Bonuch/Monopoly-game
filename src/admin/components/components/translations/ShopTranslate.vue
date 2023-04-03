<template>
    <div>
        Shop Translate
        {{ paths }}
    </div>
</template>

<script>
import TranslationPage from "../../../mixins/TranslationPage";

export default {
    name: "ShopTranslate",
    // mixins: [TranslationPage],
    data() {
        return {
            translation_type: 'shop',
        };
    },
    methods: {
        async load() {
            await this.$store.$app.$socket.client.emit("get_translate_structure", {
                group: this.$route.params.trGroup,
            }, response => {
                console.log('RESPONSE -------', response);
                this.paths = response
            });
        },
    },
    async mounted() {
        await this.load()
    }
};
</script>

<style scoped>

</style>
