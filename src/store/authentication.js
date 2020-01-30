// ******** Gestisce le proprietà della sessione utente ********** //
import { bus } from "@/main";
export const authentication = {
    namespaced: true,
    state: {
        user: {
            loggedIn: false,
            signInMethod: "",
            isAdmin: false,
            isEnrolled: false,
            message: false,
            sessionRoute: null,
            data: null
        }
    },
    getters: {
        user(state) {
            return state.user;
        }
    },
    mutations: {
        mut_SET_LOGGED_IN(state, value) {

            state.user.loggedIn = value;
        },

        mut_prova(state, value) {
            console.log("Fiiiiiii")
            state.user.signInMethod = value;
        },
        mut_SET_ADMIN(state, value) {
            state.user.isAdmin = value;
        },
        mut_SET_SESSION_ROUTE(state, value) {
            state.user.sessionRoute = value;
        },
        mut_SET_ENROLLED(state, value) {
            state.user.isEnrolled = value;
        },
        mut_SET_USER(state, data) {
            state.user.data = data;
            bus.$emit("authStateChange");
        },
        mut_SET_MESSAGE(state, value) {
            state.user.message = value
        }
    },
    actions: {
        // ******** Emetto l'evento "authStateChanged" al caricamento dell'app ********* //
        act_initialize() {
            bus.$emit("authStateChange");
        },
        act_SET_SIGN_IN_METHOD({ commit }, value) {
            commit("mut_prova", value);
        },
        act_SET_SESSION_ROUTE({ commit }, value) {

            commit("mut_SET_SESSION_ROUTE", value);
        },
        act_fetchUser({ commit }, user) {
            commit("mut_SET_LOGGED_IN", user !== null);
            commit("mut_SET_ADMIN", user.admin == true);
            if (user) {
                commit("mut_SET_USER", {
                    displayName: user.displayName,
                    email: user.email,
                    emailVerified: user.emailVerified
                });

            } else {
                commit("mut_SET_USER", null);

            }
        },

        act_SET_ENROLLED({ commit }, value) {
            commit("mut_SET_ENROLLED", value)
        },

        // Reset dei dati utente a fine sessione
        act_resetUser({ commit }) {
            commit("mut_SET_LOGGED_IN", false);
            commit("mut_SET_ADMIN", false);
            commit("mut_SET_USER", null);
        },

        act_triggerMessage({ commit }, value) {
            commit("mut_SET_MESSAGE", value);

        }
    }
}

// ********* Gestisce le proprietà della barra in alto presente in tutte le pagine *********** //
export const topbar = {
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
