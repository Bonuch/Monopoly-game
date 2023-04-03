<template>
    <section class="content">
        <div class="error-page">
            <h2 class="headline text-warning">404</h2>

            <div class="error-content">
                <h3><i class="fa fa-exclamation-triangle text-warning"></i> Oops! Page not found.</h3>

                <p>
                    We could not find the page you were looking for.
                    Meanwhile, you may <router-link to="/">return to dashboard</router-link> or try using the search form.
                </p>
            </div>
            <!-- /.error-content -->
        </div>
        <!-- /.error-page -->
    </section>
</template>

<script>
    export default {
        name: "NotFound",
        created() {
            // this.$store.commit('updateTitlePage', 'Page Not Found');
        }
    }
</script>

<style scoped>

</style>