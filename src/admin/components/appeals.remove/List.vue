<template>
    <div>
        <table class="table table-bordered table-striped dataTable" role="grid" >
            <thead>
            <tr role="row">
                <th @click="sortTable('initiator_name')" :class="classObjectForInitiatorColumn">
                    Инициатор жалобы
                </th>
                <th @click="sortTable('type')" :class="classObjectForTypeColumn">
                    Тип жалобы
                </th>
                <th @click="sortTable('target_name')" :class="classObjectForTargetColumn">
                    На кого жалуются
                </th>
                <th @click="sortTable('message')" :class="classObjectForMessageColumn">
                    Сообщение
                </th>
                <th @click="sortTable('game_id')" :class="classObjectForGameColumn">
                    Игра
                </th>
                <th @click="sortTable('turn')" :class="classObjectForTurnColumn">
                    Ход
                </th>
                <th @click="sortTable('is_resolved')" :class="classObjectForResolveColumn">
                    Статус
                </th>
                <th style="width: 84px">Действие</th>
            </tr>
            </thead>
            <tbody>
            <template v-if="!isLoaded">
                <tr role="row" class="odd">
                    <td colspan="8" class="text-center"><h2>Загрузка...</h2></td>
                </tr>
            </template>
            <template v-else-if="!rows.length">
                <tr role="row" class="odd">
                    <td colspan="8" class="text-center"><h2>Жалобы не найдены</h2></td>
                </tr>
            </template>
            <template v-else>
                <tr v-for="row in rows" :key="row.id">
                    <td>{{ row.initiator_name }}</td>
                    <td>{{ row.appeal_type }}</td>
                    <td>{{ row.target_name }}</td>
                    <td>{{ row.message }}</td>
                    <td>{{ row.game }}</td>
                    <td>{{ row.turn }}</td>
                    <td>{{ row.is_resolved ? 'Разрешена' : 'Не разрешена' }}</td>
                    <td class="text-center">
                        <button @click="resolveAppeal(row.id)" type="button" class="btn btn-success"><i class="fa fa-check-square"></i></button>
                    </td>
                </tr>
            </template>
            </tbody>
            <tfoot>
            <tr>
                <th>
                    Инициатор жалобы
                </th>
                <th>
                    Тип жалобы
                </th>
                <th>
                    На кого жалуются
                </th>
                <th>
                    Сообщение
                </th>
                <th>
                    Игра
                </th>
                <th>
                    Ход
                </th>
                <th>
                    Статус
                </th>
                <th style="width: 84px">Действие</th>
            </tr>
            </tfoot>
        </table>
        <pagination v-if="isLoaded" :currentPage="searchParams.page" :lastPage="this.lastPage"></pagination>
    </div>
</template>

<script>
    import axios from '@/helpers/axios-instance';
    import ListingMixin from '../../mixins/Listing';

    export default {
        name: 'list',
        mixins: [ListingMixin],
        data() {
            return {
                request_url: '/admin-list-appeals'
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
            classObjectForTypeColumn() {
                return {
                    sorting_asc: this.searchParams.column == 'type' && this.searchParams.sort == 'asc',
                    sorting_desc: this.searchParams.column == 'type' && this.searchParams.sort == 'desc',
                    sorting: this.searchParams.column != 'type'
                }
            },
            classObjectForTargetColumn() {
                return {
                    sorting_asc: this.searchParams.column == 'target_name' && this.searchParams.sort == 'asc',
                    sorting_desc: this.searchParams.column == 'target_name' && this.searchParams.sort == 'desc',
                    sorting: this.searchParams.column != 'target_name'
                }
            },
            classObjectForGameColumn() {
                return {
                    sorting_asc: this.searchParams.column == 'game_id' && this.searchParams.sort == 'asc',
                    sorting_desc: this.searchParams.column == 'game_id' && this.searchParams.sort == 'desc',
                    sorting: this.searchParams.column != 'game_id'
                }
            },
            classObjectForMessageColumn() {
                return {
                    sorting_asc: this.searchParams.column == 'message' && this.searchParams.sort == 'asc',
                    sorting_desc: this.searchParams.column == 'message' && this.searchParams.sort == 'desc',
                    sorting: this.searchParams.column != 'message'
                }
            },
            classObjectForTurnColumn() {
                return {
                    sorting_asc: this.searchParams.column == 'turn' && this.searchParams.sort == 'asc',
                    sorting_desc: this.searchParams.column == 'turn' && this.searchParams.sort == 'desc',
                    sorting: this.searchParams.column != 'turn'
                }
            },
            classObjectForResolveColumn() {
                return {
                    sorting_asc: this.searchParams.column == 'is_resolved' && this.searchParams.sort == 'asc',
                    sorting_desc: this.searchParams.column == 'is_resolved' && this.searchParams.sort == 'desc',
                    sorting: this.searchParams.column != 'is_resolved'
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
            //todo можно вставить дату создания и сорировать по ней
            this.searchParams.column = this.$route.query.column ? this.$route.query.column : 'initiator_name';
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
