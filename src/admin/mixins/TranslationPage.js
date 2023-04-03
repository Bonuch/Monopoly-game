export default {
    data() {
      return {
          translation_type: null,
          paths: null,
      }
    },
     methods: {
        async load() {
            await this.$store.$app.$socket.client.emit("get_translate_structure", {
                group: this.$route.params.trGroup,
            }, response => {
                console.log('RESPONSE', response);
                this.paths = response
            });
        },
    },
}
