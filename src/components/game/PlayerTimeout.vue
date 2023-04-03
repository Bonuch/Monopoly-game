<template>
    <div>{{deadline}}</div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'PlayerDeadline',
        data() {
            return {
                interval: null,
            }
        },
        props: {

        },
        computed: {
            ...mapGetters([
                'deadline',
            ]),
        },
        mounted() {
            this.interval = setInterval(() => {
                this.$store.commit('updateDeadline');
            }, 1000);
        },
        beforeDestroy() {
            clearInterval(this.interval);
        }

    }
</script>

<style lang="scss">

</style>


