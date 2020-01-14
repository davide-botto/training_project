import Vue from "vue";
import Vuex from "vuex";
import { bus } from "@/main";
Vue.use(Vuex);

// Gestisce le proprietà della sessione utente
const authentication = {
    namespaced: true,
    state: {
        user: {
            loggedIn: false,
            isAdmin: false,
            message: false,
            data: null
        }
    },
    getters: {
        user(state) {
            return state.user;
        }
    },
    mutations: {
        SET_LOGGED_IN(state, value) {
            state.user.loggedIn = value;
        },
        SET_ADMIN(state, value) {
            state.user.isAdmin = value;
        },
        SET_USER(state, data) {
            state.user.data = data;
            bus.$emit("authStateChange");
        },
        SET_MESSAGE(state, value) {
            state.user.message = value
        }
    },
    actions: {
        // Emetto l'evento "authStateChanged" al caricamento dell'app
        initialize() {
            bus.$emit("authStateChange");
        },

        fetchUser({ commit }, user) {
            commit("SET_LOGGED_IN", user !== null);
            commit("SET_ADMIN", user.admin == true);
            if (user) {
                commit("SET_USER", {
                    displayName: user.displayName,
                    email: user.email,
                    emailVerified: user.emailVerified
                });

            } else {
                commit("SET_USER", null);

            }
        },

        // Reset dei dati utente a fine sessione
        resetUser({ commit }) {
            commit("SET_LOGGED_IN", false);
            commit("SET_ADMIN", false);
            commit("SET_USER", null);
        },

        triggerMessage({ commit }, value) {
            commit("SET_MESSAGE", value);

        }
    }
}

// Gestisce le proprietà della barra in alto presente in tutte le pagine
const topbar = {
    namespaced: true,
    state: {
        barprop: {
            data: null
        }
    },
    getters: {
        barprop(state) {
            return state.barprop
        }
    },
    mutations: {
        mut_SET_BAR(state, data) {
            state.barprop.data = data
        },

    },
    actions: {
        act_setBar({ commit }, bar) {
            commit("mut_SET_BAR", {
                courseTitle: bar.courseTitle,
                coursePage: bar.coursePage,
                students: bar.students,
                profile: bar.profile,
                toHome: bar.toHome,
                exit: bar.exit
            })

        }
    }
}



export default new Vuex.Store({
    modules: {
        authentication,
        topbar
    }
});

