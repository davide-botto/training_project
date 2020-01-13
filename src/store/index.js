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
                    email: user.email,
                    emailVerified: user.emailVerified
                });
                bus.$emit("authStateChange");
            } else {
                commit("SET_USER", null);
                bus.$emit("authStateChange");
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
            courseTitle: false,
            coursePage: false,
            students: false,
            home: false,
            exit: false
        }
    },
    getters: {
        barprop(state) {
            return state.barprop
        }
    },
    mutations: {
        SET_TITLE(state, value) {
            state.barprop.courseTitle = value
        },
        SET_PAGE(state, value) {
            state.barprop.coursePage = value
        },
        SET_STUDENTS(state, value) {
            state.barprop.students = value
        },
        SET_HOME(state, value) {
            state.barprop.home = value
        },
        SET_EXIT(state, value) {
            state.barprop.exit = value
        }

    },
    actions: {
        toggleTitle({ commit }, value) {
            commit('SET_TITLE', value);
        },
        togglePage({ commit }, value) {
            commit('SET_PAGE', value);
        },
        toggleStudents({ commit }, value) {
            commit('SET_STUDENTS', value);
        },
        toggleHome({ commit }, value) {
            commit('SET_HOME', value);
        },
        toggleExit({ commit }, value) {
            commit('SET_EXIT', value);
        }
    }
}



export default new Vuex.Store({
    modules: {
        authentication,
        topbar
    }
});

