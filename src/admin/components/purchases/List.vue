<template>
    <div>
        <table class="table table-bordered table-striped dataTable" role="grid" >
            <thead>
            <tr role="row">
                <th @click="sortTable('id')" :class="classObjectForInitiatorColumn">
                   ID
                </th>
                <th @click="sortTable('title_item')" :class="classObjectForInitiatorColumn">
                    Название
                </th>
                <th @click="sortTable('price_bucks')" :class="classObjectForInitiatorColumn">
                    Цена($)
                </th>
                <th @click="sortTable('price_crypto')" :class="classObjectForInitiatorColumn">
                    Цена(B)
                </th>
                <th @click="sortTable('fullname')" :class="classObjectForInitiatorColumn">
                    Пользователь
                </th>
                <th @click="sortTable('text')" :class="classObjectForInitiatorColumn">
                    Сообщение
                </th>
                <th @click="sortTable('created_at')" :class="classObjectForInitiatorColumn">
                    Дата
                </th>
            </tr>
            </thead>
            <tbody>
            <template v-if="!isLoaded">
                <tr role="row" class="odd">
                    <td colspan="7" class="text-center"><h2>Загрузка...</h2></td>
                </tr>
            </template>
            <template v-else-if="!rows.length">
                <tr role="row" class="odd">
                    <td colspan="7" class="text-center"><h2>Жалобы не найдены</h2></td>
                </tr>
            </template>
            <template v-else>
                <tr v-for="row in rows" :key="row.id">
                    <td>{{ row.id }}</td>
                    <td>{{ row.title_item }}</td>
                    <td>{{ row.price_bucks }}</td>
                    <td>{{ row.price_crypto }}</td>
                    <td>{{ row.fullname }}</td>
                    <td>{{ row.text }}</td>
                    <td>{{ row.created_at }}</td>
                </tr>
            </template>
            </tbody>
            <tfoot>
            <tr>
                <th>
                    ID
                </th>
                <th>
                    Название
                </th>
                <th>
                    Цена($)
                </th>
                <th>
                    Цена(B)
                </th>
                <th>
                    Пользователь
                </th>
                <th>
                    Сообщение
                </th>
                <th>
                    Дата
                </th>
            </tr>
            </tfoot>
        </table>
        <pagination v-if="isLoaded" :currentPage="searchParams.page" :lastPage="this.lastPage"></pagination>
    </div>
</template>

<script>
    import ListingMixin from '../../mixins/Listing';
    import axios from '@/helpers/axios-instance';

    export default {
        name: 'list',
        mixins: [ListingMixin],
        data() {
            return {
                request_url: '/admin-list-purchases'
            }
        },
        computed: {
            classObjectForInitiatorColumn() {
                return {
                    sorting_asc: this.searchParams.column == 'initiator_name' && this.searchParams.sort == 'asc',
                    sorting_desc: this.searchParams.column == 'initiator_name' && this.searchParams.sort == 'desc',
                    sorting: this.searchParams.column != 'initiator_name'
                }
            },
        },
        methods: {
            getRows(query) {
                let getParams = Object.assign(this.searchParams, query);

                axios.get(this.request_url, {params: getParams})
                    .then((response) => {
                        this.rows = response.data.result;
                        this.lastPage = response.data.pages;
                        this.$store.commit('updateErrorMessage', []);
                        this.isLoaded = true;
                    }).catch(() => {
                        this.$store.commit('updateSuccessMessage', "");
                        this.$store.commit('updateErrorMessage', ["Возникла ошибка при получении данных"]);
                        this.isLoaded = true;
                });
            },
            resolveAppeal(id) {
                if (window.confirm('Уверены ?')) {
                    axios
                        .get("/admin-resolve-appeal", {
                            params: { id: id }
                        })
                        .then(response => {
                            this.getRows();
                        })
                        .catch(() => {});
                }
            }
        },
        beforeRouteUpdate (to, from, next) {
            this.getRows(to.query);
            next();
        },
        created() {
            this.searchParams.column = this.$route.query.column ? this.$route.query.column : 'id';
        },
        mounted() {
            // this.$store.commit('updateTitlePage', this.$route.meta.title);
            this.getRows({});
        }
    }
</script>

<style scoped>
    table thead th {
        user-select: none;
    }
</style>
