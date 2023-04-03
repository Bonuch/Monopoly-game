import Dashboard from "./components/pages/Dashboard.vue";
import User from "./components/pages/User.vue";
import Users from "./components/pages/Users.vue";
import Knowledges from "./components/pages/Knowledges.vue";
import Knowledge from "./components/pages/Knowledge.vue";
import GameValues from "./components/pages/GameValues.vue";
import Blog from "./components/pages/blog/Blog.vue";
import Article from "./components/pages/blog/Article.vue";
import BlogMenu from "./components/pages/blog/Menu.vue";
import BlogSlider from "./components/pages/blog/Slider.vue";
import Login from "./components/pages/Login.vue";
import NotFound from "./components/pages/NotFound.vue";

// Middleware
import isAdminLoggedIn from "@/middleware/isAdmin";
import isNotAdmin from "@/middleware/isNotAdmin";

export const routes = [
    {
        path: "/admin",
        component: () => import(/* webpackChunkName: "AdminDashboard" */"./components/pages/Dashboard.vue"),
        meta: {
            requiresAuth: true,
            title: "Мониторнг игрового сервера",
            middleware: isAdminLoggedIn,
        },
    },
    {
        path: "/admin/users",
        component: () => import(/* webpackChunkName: "AdminUsers" */"./components/pages/Users.vue"),
        meta: {
            requiresAuth: true,
            title: "Список пользователей",
            middleware: isAdminLoggedIn,
        },
    },
    {
        path: "/admin/knowledges",
        component: () => import(/* webpackChunkName: "AdminKnowledges" */"./components/pages/Knowledges.vue"),
        meta: {
            requiresAuth: true,
            title: "Знания",
            middleware: isAdminLoggedIn,
        },
    },
    {
        path: "/admin/game-values",
        component: () => import(/* webpackChunkName: "AdminGameValues" */"./components/pages/GameValues.vue"),
        meta: {
            requiresAuth: true,
            title: "Игровые значения",
            middleware: isAdminLoggedIn,
        },
    },
    {
        path: "/admin/knowledge",
        component: () => import(/* webpackChunkName: "AdminKnowledge" */"./components/pages/Knowledge.vue"),
        meta: {
            requiresAuth: true,
            title: "Редактировать знание",
            middleware: isAdminLoggedIn,
        },
    },
    {
        path: "/admin/blog",
        component: () => import(/* webpackChunkName: "AdminBlog" */"./components/pages/blog/Blog.vue"),
        meta: {
            requiresAuth: true,
            title: "Блог и новости",
            middleware: isAdminLoggedIn,
        },
    },
    {
        path: "/admin/shines",
        component: () => import(/* webpackChunkName: "AdminShines" */"./components/pages/Shines.vue"),
        meta: {
            requiresAuth: true,
            title: "Сияние",
            middleware: isAdminLoggedIn,
        },
    },
    {
        path: "/admin/translations/",
        name: "translations",
        component: () => import(/* webpackChunkName: "AdminTranslation" */"./components/pages/Translations.vue"),
        // redirect: {
        //     name: "translator",
        // },
        meta: {
            requiresAuth: true,
            title: "Переводы",
            middleware: isAdminLoggedIn,
        },
        children: [
            {
                path: ":trGroup",
                name: "translator",
                component: () => import(/* webpackChunkName: "AdminTranslationGroup" */"./components/components/translations/Translator.vue"),
                meta: {
                    requiresAuth: true,
                    title: "Перевод",
                    middleware: isAdminLoggedIn,
                },
                children: [
                    {
                        path: "*",
                        name: "translateText",
                        title: "Текст",
                        component: () => import(/* webpackChunkName: "AdminTranslationValues" */"./components/components/translations/TranslatorValues.vue"),
                    }
                ],
            },
            // {
            //     path: 'game',
            //     name: 'gameTranslate',
            //     component: () => import(/* webpackChunkName: "AdminShines" */'./components/components/translations/GameTranslate.vue'),
            //     meta: {
            //         requiresAuth: true,
            //         title: 'Игра',
            //         middleware: isAdminLoggedIn
            //     },
            // },
            // {
            //     path: 'system',
            //     name: 'systemTranslate',
            //     component: () => import(/* webpackChunkName: "AdminShines" */'./components/components/translations/SystemTranslate.vue'),
            //     meta: {
            //         requiresAuth: true,
            //         title: 'Система',
            //         middleware: isAdminLoggedIn
            //     },
            // },
            // {
            //     path: 'ui',
            //     name: 'uiTranslate',
            //     component: () => import(/* webpackChunkName: "AdminShines" */'./components/components/translations/UITranslate.vue'),
            //     meta: {
            //         requiresAuth: true,
            //         title: 'Интерфейс',
            //         middleware: isAdminLoggedIn
            //     },
            // }
        ],
    },
    {
        path: "/admin/blog/article",
        component: () => import(/* webpackChunkName: "AdminArticle" */"./components/pages/blog/Article.vue"),
        meta: {
            requiresAuth: true,
            title: "Редактирование статьи",
            middleware: isAdminLoggedIn,
        },
    },
    {
        path: "/admin/blog/menu",
        component: () => import(/* webpackChunkName: "AdminBlogMenu" */"./components/pages/blog/Menu.vue"),
        meta: {
            requiresAuth: true,
            title: "Меню в блоге",
            middleware: isAdminLoggedIn,
        },
    },
    {
        path: "/admin/blog/slider",
        component: () => import(/* webpackChunkName: "BlogSlider" */"./components/pages/blog/Slider.vue"),
        meta: {
            requiresAuth: true,
            title: "Слайдер в блоге",
            middleware: isAdminLoggedIn,
        },
    },
    {
        path: "/admin/user",
        component: () => import(/* webpackChunkName: "AdminUser" */"./components/pages/User.vue"),
        meta: {
            requiresAuth: true,
            title: "Профиль пользователя",
            middleware: isAdminLoggedIn,
        },
    },
    {
        path: "/admin/login",
        component: () => import(/* webpackChunkName: "AdminLogin" */"./components/pages/Login.vue"),
        meta: {
            emptyLayout: true,
            middleware: isNotAdmin,
            requiresAuth: false,
            title: "Вход администратора",
        },
    },
    {
        path: "/404",
        name: "404",
        component: () => import(/* webpackChunkName: "Admin404" */"./components/pages/NotFound.vue"),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "*",
        redirect: "/404",
        meta: {
            requiresAuth: true,
        },
    },
];
