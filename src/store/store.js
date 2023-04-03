import createPersistedState from "vuex-persistedstate";
import { updateWebsocketAuth } from "@/helpers/general";
import { setAuthorization } from "@/helpers/axios-instance";
import i18n, { loadLanguageAsync } from "../i18n";

let isTokenRefreshing = false;

export default {
    plugins: [
        createPersistedState(),
    ],
    state: {
        dailyAward: null,
        // TODO изначально было задумано две схемы, но позже решили оставить только темную тему. В первых компонентах эта схема учитывается, в более поздних она игнорируется.
        colorSchema: "dark", // bright || dark
        awardModalOpen: false,
        tokens: null,
        currentUser: {},
        currentUserLoot: [],
        isLoggedIn: false,
        loading: false,
        loginAfterEmailConfirm: false,
        userItems: [],
        background: "",
        profilePageData: null,
        mutationIcons: {},
        awardList: [],
        screenWidth: window.innerWidth,
    },
    getters: {
        awardModalOpen: (state) => state.awardModalOpen,
        currentColorSchema(state) {
            return state.colorSchema;
        },
        screenWidth (state) {
            return state.screenWidth
        },
        isMobileWidth (state) {
          return state.screenWidth <= 1366;
        },
        awardList: (state) => state.awardList,
        isLoading(state) {
            return state.loading;
        },
        isLoggedIn(state) {
            return state.isLoggedIn;
        },
        tokens(state) {
            return state.tokens;
        },
        accessToken(state) {
            return state.tokens && state.tokens.accessToken ? state.tokens.accessToken : null;
        },
        isStaffUser(state) {
            return state.currentUser.is_staff || false;
        },
        refreshToken(state) {
            return state.tokens && state.tokens.refreshToken ? state.tokens.refreshToken : null;
        },
        currentUser(state) {
            return state.currentUser;
        },
        currentUserLoot(state) {
            return state.currentUserLoot;
        },
        currentUserLootCount(state) {
            return state.currentUserLoot ? state.currentUserLoot.length : 0;
        },
        loginAfterEmailConfirm(state) {
            return state.loginAfterEmailConfirm;
        },
        dailyAward(state) {
            return state.dailyAward;
        },
        profilePageData(state) {
            return state.profilePageData;
        },
        getMutationIcons(state) {
            return state.mutationIcons;
        },
    },
    mutations: {
        awardModalOpen: (state, payload) => state.awardModalOpen = payload,
        awardList: (state, payload) => state.awardList = payload,
        setScreenWidth: (state, payload) => state.screenWidth = payload,
        login(state) {
            state.loading = true;
            state.auth_error = null;
        },
        loginSuccess(state, payload) {
            state.isLoggedIn = true;
            state.loading = false;
            state.currentUser = Object.assign({}, payload);
        },
        logout(state) {
            state.tokens = null;
            state.currentUser = {};
        },
        updateToken(state, payload) {
            state.tokens = payload;
        },
        updateCurrentUserState(state, payload) {
            state.currentUser = Object.assign({}, state.currentUser, payload);
            // i18n.change(state.currentUser.language);
        },
        updateCurrentUserLoot(state, payload) {
            state.currentUserLoot = payload;
        },
        increaseBucksBalance(state, value) {
            state.currentUser.balance_bucks += value;
        },
        updateCurrentUserTokens(state, tokens) {
            state.currentUser = Object.assign({}, state.currentUser, tokens);
        },
        setLoginAfterEmailConfirm(state, bool) {
            state.loginAfterEmailConfirm = bool;
        },
        acceptEmailConfirmation(state) {
            state.currentUser.email_confirmed = true;
        },
        setMuteUser(state) {
            state.currentUser.is_muted = true;
        },
        refreshDailyAward(state, award) {
            state.dailyAward = award || {
                time: 0, // время следующего получения награды
                row: 0, // порядковый номер награды
                today: true, // true, если сегодня награда еще не была получена
            };
        },
        updateUserItems(state, items) {
            state.userItems = items;
        },
        updateCurrentChip(state, item) {
            state.currentChip = item;
        },
        updateCurrentDice(state, item) {
            state.currentDice = item;
        },
        updateBackground(state, url) {
            state.background = url;
        },
        setProfilePageData(state, data) {
            state.profilePageData = data;
        },
        updateProfilePageUserData(state, data) {
            if (data.uuid && state.profilePageData.user.uuid === data.uuid) {
                const update = state.profilePageData;
                update.user = { ...update.user, ...data };
                state.profilePageData = update;
            }
        },
        setMutationIcons(state, data) {
            state.mutationIcons = data;
        },
        updateUserBalance(state, data) {
            state.currentUser["balance"] = data;
        },
    },
    actions: {
        // handleResize: ({}, payload) => state.screenWidth = payload,
        login(context) {
            context.commit("login");
        },
        async logout({ commit }) {
            console.log("LOGOUT!");
            await this.$app.$socket.client.emit("disconnect");
            await this.$app.$socket.client.disconnect();
            commit("logout");
            window.localStorage.clear();
        },
        loadProfileData({ commit }, userUuid) {
            commit("setProfilePageData", null);
            return new Promise(resolve => {
                this.$app.$socket.client.emit("load_profile_data", userUuid, payload => {
                    commit("setProfilePageData", payload);
                    resolve(payload);
                });
            });
        },
        // сохранение данных из EditUserProfile
        async updateProfileData({ commit, getters }, updates) {
            return new Promise(resolve => {
                this.$app.$socket.client.emit("update_profile_data", updates, async payload => {
                    const changeLang = payload.userDetails ?
                        payload.userDetails.language !== getters.currentUser.language
                        : null;
                    if (payload.userDetails) {
                        commit("updateCurrentUserState", payload.userDetails);
                        if (payload.userDetails.language && payload.userDetails.language !== getters.currentUser.language) {
                            await loadLanguageAsync(payload.userDetails.language);
                        }
                    }
                    if (payload.message) {
                        if (changeLang) {
                            window.location.reload()
                        }
                        this.$app.$dialog.alert(payload.message);
                    }
                });
            });
        },
        loadUserInfo({ commit }) {
            return new Promise((resolve, reject) => {
                this.$app.$socket.client.emit("user_state", null, async (payload) => {
                    if (payload) {
                        commit("updateCurrentUserState", payload);
                        await loadLanguageAsync(payload.language);
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        },
        loadDailyAwards({ commit }) {
            this.$app.$socket.client.emit("load_daily_award", null, (award) => {
                commit("refreshDailyAward", award);
            });
        },
        getDailyAward({ commit }, callback) {
            this.$app.$socket.client.emit("get_daily_award", null, (award) => {
                commit("refreshDailyAward", award);
                callback();
            });
        },

        loadUserLoot({ commit, getters }) {
            this.$app.$socket.client.emit("get_user_loot", getters.currentUser.user_id, (data) => {
                if (data.error) {
                    // eslint-disable-next-line no-console
                    console.log(data.error);
                } else {
                    commit("updateCurrentUserLoot", data.loot);
                }
            });
        },

        fetchAwardList({ commit, getters }) {
            this.$app.$socket.client.emit("load_weekly_awards", {}, data => {
                commit("awardList", data);
            });
        },

        refreshUserExperience({ commit }) {
            this.$app.$socket.client.emit("get_user_xp", null, (data) => {
                if (data.error) {
                    // eslint-disable-next-line no-console
                    console.log(data.error);
                } else {
                    commit("updateCurrentUserState", data.level);
                }
            });
        },

        SOCKET_UPDATE_USER_BALANCE({ commit }, payload) {
            commit("updateUserBalance", payload);
        },

        SOCKET_CURRENT_USER_STATE({ commit }, payload) {
            commit("updateCurrentUserState", payload);
        },

        // поменялся профиль какого-то пользователя.
        SOCKET_UPDATE_PROFILE_DATA({ getters, dispatch }, payload) {
            // Если открыта страница его профиля, то запрашиваем обновленные данные
            if (payload.uuid && getters.profilePageData && getters.profilePageData.user.uuid === payload.uuid) {
                dispatch("loadProfileData", payload.uuid);
            }
            // если он находится в списке наших друзей, то перезагружаем контакты
            const hasContact = getters.contacts.find(p => (p.uuid === payload.uuid));
            if (hasContact) {
                dispatch("loadContactsList");
            }
        },

        // авторизация

        SOCKET_UPDATE_TOKENS({ commit }, payload) {
            commit("updateToken", payload);
        },

        SOCKET_REFRESH_TOKEN_HANDSHAKE() {
            // запрошено переподключение с refresh токеном
            updateWebsocketAuth(this, true);
        },

        SOCKET_REFRESH_TOKEN_REQUEIRED({ dispatch, commit, getters }) {
            // запрошен refresh token для обновления access token
            if (isTokenRefreshing === false) {
                isTokenRefreshing = true;
                const tokens = getters.tokens;
                this.$app.$socket.client.emit("refresh_auth_tokens", {
                    refresh_token: tokens.refreshToken,
                }, responseData => {
                    isTokenRefreshing = false;
                    if (!responseData.error) {
                        // получены свежие токены, сохраняем их в стейт и делаем реконнект
                        setAuthorization(responseData.accessToken);
                        commit("updateToken", responseData);
                        updateWebsocketAuth(this);
                        dispatch("loadUserInfo");
                        dispatch("loadContactsList");
                        dispatch("loadAllPrivateChatMessages", { offset: 0, limit: 40 });
                    }
                });
            }
        },

        SOCKET_RELOGIN_REQUIRED({ commit }) {
            // не удается обновить токен, требуется авторизоваться по новой
            commit("logout");
            this.$app.$router.push("/login");
        },

        loadMutationIcons({ getters, commit }) {
            if (Object.keys(getters.getMutationIcons).length === 0) {
                return new Promise((resolve, reject) => {
                    this.$app.$socket.client.emit("get_game_icons", null, (payload) => {
                        if (payload) {
                            commit("setMutationIcons", payload);
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            }
        },

    },
};
