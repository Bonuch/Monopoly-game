const NavMenuGame = () => import(/* webpackChunkName: "NavMenuGame" */"@/components/navigations/NavMenuGames.vue")
const NavMenuProfile = () => import(/* webpackChunkName: "NavMenuProfile" */"@/components/navigations/NavMenuProfile.vue")
const NavMenuShop = () => import(/* webpackChunkName: "NavMenuShop" */"@/components/navigations/NavMenuShop.vue")
const CompleteVkontakteAuth = () => import(/* webpackChunkName: "CompleteVkontakteAuth" */'@/components/CompleteVkontakteAuth.vue')
const CompleteFacebookAuth = () => import(/* webpackChunkName: "CompleteFacebookAuth" */'@/components/CompleteFacebookAuth.vue')
const RegistrationView = () => import(/* webpackChunkName: "RegistrationView" */'@/views/RegistrationView.vue')
const LoginView = () => import(/* webpackChunkName: "LoginView" */'@/views/LoginView.vue')
const UserProfile = () => import(/* webpackChunkName: "UserProfile" */'@/views/UserProfile.vue')
const Play = () =>  import(/* webpackChunkName: "Play" */'@/views/Play.vue')
const CurrentUserProfile = () => import(/* webpackChunkName: "CurrentUserProfile" */'@/views/CurrentUserProfile.vue')
const EditUserProfile = () => import(/* webpackChunkName: "EditUserProfile" */'@/views/EditUserProfile.vue')
const CustomizeBrands = () => import(/* webpackChunkName: "CustomizeBrands" */'@/views/CustomizeBrands.vue')
const CustomizeChips = () => import(/* webpackChunkName: "CustomizeChips" */'@/views/CustomizeChips.vue')
const CustomizeDice = () => import(/* webpackChunkName: "CustomizeDice" */'@/views/CustomizeDice.vue')
const CustomizeLoot = () => import(/* webpackChunkName: "CustomizeLoot" */'@/views/CustomizeLoot.vue')
const Replays = () => import(/* webpackChunkName: "Replays" */'@/views/Replays.vue')
const CreateGame = () => import(/* webpackChunkName: "CreateGame" */'@/views/CreateGame.vue')
const Shop = () => import(/* webpackChunkName: "Shop" */'@/views/Shop.vue')
const GameLayout = () => import(/* webpackChunkName: "GameLayout" */'@/views/GameLayout.vue')
const GameWatch = () => import(/* webpackChunkName: "GameWatch" */"@/views/GameWatch.vue")
const EmailUnconfirmedView = () => import(/* webpackChunkName: "EmailUnconfirmedView" */'@/views/EmailUnconfirmedView.vue')
const ConfirmEmailView = () => import(/* webpackChunkName: "ConfirmEmailView" */'@/views/ConfirmEmailView.vue')
const BlogMain = () => import(/* webpackChunkName: "BlogMain" */'@/views/Blog.vue')
const KnowledgeView = () => import(/* webpackChunkName: "KnowledgeView" */"@/views/KnowledgeView.vue")
const KnowledgeGroup = () => import(/* webpackChunkName: "KnowledgeGroup" */"@/components/knowledge/KnowledgeGroup.vue")
const TestPage = () => import(/* webpackChunkName: "KnowledgeGroup" */"@/views/TestPage.vue")
const TicketView = () => import(/* webpackChunkName: "TicketView" */ '@/views/TicketView.vue')



export const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView,
    },
    {
        path: '/registration',
        name: 'registration',
        component: RegistrationView,
    },
    {
        path: '/play/games',
        name: 'play',
        components: {
            default: Play,
            navmenu: NavMenuGame
        },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        }
    },
    {
        path: '/play/new-game',
        name: 'creategame',
        components: {
            default: CreateGame,
            navmenu: NavMenuGame
        },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        }
    },
    {
        path: '/profile/me',
        name: 'profile',
        components: {
            default: CurrentUserProfile,
            navmenu: NavMenuProfile
        },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        },
    },
    {
        path: '/profile/me/settings',
        name: 'profile-settings',
        components: {
            default: EditUserProfile,
            navmenu: NavMenuProfile
        },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        }
    },
    {
        path: '/profile/brands',
        name: 'customize-brands',
        components: {
            default: CustomizeBrands,
            navmenu: NavMenuProfile
        },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        }
    },
    {
        path: '/profile/knowledge',
        name: 'knowledge',
        components: {
            default: KnowledgeView,
            navmenu: NavMenuProfile
        },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        },
        children: [
            {
                path: ':branch',
                name: 'knowledge-branch',
                component: KnowledgeGroup,
                meta: {
                    requiresAuth: true,
                    requiresEmailConfirm: true,
                    layoutSite: true
                },
            }
        ],
    },
    {
        path: '/profile/chips',
        name: 'customize-chips',
        components: {
            default: CustomizeChips,
            navmenu: NavMenuProfile
        },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        }
    },
    {
        path: '/profile/dice',
        name: 'customize-dice',
        components: {
            default: CustomizeDice,
            navmenu: NavMenuProfile
        },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        }
    },
    {
        path: '/profile/loot',
        name: 'customize-loot',
        components: {
            default: CustomizeLoot,
            navmenu: NavMenuProfile
        },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        }
    },
    {
        path: '/watch',
        name: 'watch',
        components: {
            default: GameWatch,
            navmenu: null
        },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        }
    },
    {
        path: '/support/',
        name: 'support',
        // components: {
        //     default: TicketView,
        //     navmenu: NavMenuProfile
        // },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            // layoutSite: true,
            supportView: true
        },
    },
    // Старый роут просмотра игр
    // {
    //   path: '/replays',
    //   name: 'replays',
    //   components: {
    //     default: Replays,
    //     navmenu: null
    //   },
    //   meta: {
    //     requiresAuth: true,
    //     requiresEmailConfirm: true,
    //     layoutSite: true
    //   }
    // },
    {
        path: '/shop',
        name: 'shop',
        components: {
            default: Shop,
            navmenu: NavMenuShop
        },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        },
        children: [
            {
                path: 'box',
                name: 'shop-box',
                meta: {
                    requiresAuth: true,
                    requiresEmailConfirm: true,
                    layoutSite: true
                }
            },
            {
                path: 'chip',
                name: 'shop-chip',
                meta: {
                    requiresAuth: true,
                    requiresEmailConfirm: true,
                    layoutSite: true
                }
            },
            {
                path: 'brand',
                name: 'shop-brand',
                meta: {
                    requiresAuth: true,
                    requiresEmailConfirm: true,
                    layoutSite: true
                }
            },
            {
                path: 'dice',
                name: 'shop-dice',
                meta: {
                    requiresAuth: true,
                    requiresEmailConfirm: true,
                    layoutSite: true
                }
            },
            {
                path: 'accelerator',
                name: 'shop-accelerator',
                meta: {
                    requiresAuth: true,
                    requiresEmailConfirm: true,
                    layoutSite: true
                }
            },
        ]
    },
    {
        path: '/users',
        components: {
            default: UserProfile,
            navmenu: NavMenuProfile
        },
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        },
        children: [
            {
                path: ':useruuid',
                name: 'user',
                component: UserProfile,
                meta: {
                    requiresAuth: true,
                    requiresEmailConfirm: true,
                    layoutSite: true
                }
            }
        ]
    },
    {
        path: '/game/:gameid',
        name: 'game',
        component: GameLayout,
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true
        }
    },
    {
        path: '/view-replay/:gameid.html',
        name: 'viewreplay',
        component: GameLayout,
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true
        }
    },
    //TODO test auth
    {
        path: '/complete-vkontakte-auth.html',
        name: 'complete-vk-auth',
        component: CompleteVkontakteAuth,
    },
    {
        path: '/complete-facebook-auth.html',
        name: 'complete-fb-auth',
        component: CompleteFacebookAuth
    },
    // {
    //   path: '/moder',
    //   name: 'moder',
    //   component: ModeratorView,
    //   meta: {
    //     requiresAuth: true,
    //     requiresModerRole: true,
    //     requiresEmailConfirm: true,
    //   }
    // },
    {
        path: '/email-unconfirmed',
        name: 'email-unconfirmed',
        component: EmailUnconfirmedView,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/confirm-email',
        name: 'confirm-email',
        component: ConfirmEmailView
    },
    {
        path: '*',
        redirect: '/play/games',
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
        }
    },
    {
        path: '/play/blog',
        name: 'blog',
        component: BlogMain,
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        }
    },
    {
        path: '/testpage',
        name: 'testpage',
        component: TestPage,
        meta: {
            requiresAuth: true,
            requiresEmailConfirm: true,
            layoutSite: true
        }
    }

];

