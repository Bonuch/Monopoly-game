<template>
    <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <template v-for="section in sections">
                <sidebar-menu-section v-if="section.childs.length" :key="section.title" :section="section"></sidebar-menu-section>
                <sidebar-menu-item v-else :key="section.title" :item="section"></sidebar-menu-item>
            </template>
        </ul>
    </nav>
</template>

<script>
    import SidebarMenuSection from './SidebarMenuSection.vue';
    import SidebarMenuItem from './SidebarMenuItem.vue';

    export default {
        name: "sidebar-menu",
        components: {
            SidebarMenuItem,
            SidebarMenuSection
        },
        computed: {
            sections() {
                let sections = [];

                sections.push({
                    title: 'Пользователи',
                    link: '/user',
                    icon: 'fa-users',
                    childs: [
                        {
                            title: 'Все пользователи',
                            link: '/users/any',
                            icon: 'fa-circle-o'
                        },
                        {
                            title: 'Администраторы',
                            link: '/users/admin',
                            icon: 'fa-circle-o'
                        },
                        {
                            title: 'Модераторы',
                            link: '/users/moderator',
                            icon: 'fa-circle-o'
                        },
                        {
                            title: 'Вип-пользователи',
                            link: '/users/vip',
                            icon: 'fa-circle-o'
                        },
                        {
                            title: 'Пользователи под баном',
                            link: '/users/banned',
                            icon: 'fa-circle-o'
                        },
                    ]
                });

                sections.push({
                    title: 'Жалобы',
                    link: '/appeals',
                    icon: 'fa-bullhorn',
                    childs: []
                });

                sections.push({
                    title: 'Покупки',
                    link: '/purchases',
                    icon: 'fa-money',
                    childs: []
                });

                return sections;
            }
        }
    }
</script>

<style scoped>

</style>
