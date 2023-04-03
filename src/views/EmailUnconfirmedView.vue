<template>
    <div id="emailUnConfirmed">
        <div class="container">
            <div class="card mt-5">
                <div class="card-body">
                    <p>
                        {{ $t('SITE.Вам на электронную почту') }} <b>“{{ currentUser.email }}”</b> {{ $t('SITE.было отправлено письмо чтобы подтвердить регистрацию') }}.
                    </p>
                        <!--<br>-->
                    <!--Если вы уже подтверждали почту и видите это сообщение, то обновите страницу.-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "EmailUnconfirmedView",
        computed: {
            ...mapGetters([
                'currentUser'
            ])
        }
    }
</script>

<style scoped>
    #emailUnConfirmed {
        font-size: 18px;
        line-height: 22px;
        color: #000;
    }
</style>
