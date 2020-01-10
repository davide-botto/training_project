import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            loggedIn: false,
            emailVerified:false,
            message: false,
            data: null
        }
    },
    getters: {
        user(state) {
            return state.user
        }
    },
    mutations: {
        SET_LOGGED_IN(state, value) {
            state.user.loggedIn = value;
        },

        SET_EMAIL_VER(state, value) {
            state.user.emailVerified = value;
        },

        SET_USER(state, data) {
            state.user.data = data;
        },
        SET_MESSAGE(state,value) {
            state.user.message = value
        }
    },
    actions: {
        fetchUser({commit}, user) {
            commit("SET_LOGGED_IN", user !== null);
            commit("SET_EMAIL_VER", user !== null);
            if (user) {
                commit("SET_USER", {
                    email: user.email,
                    admin: user.admin
                });
            } else {
                commit("SET_USER", null);
            }
        },

        triggerMessage({commit}, value) {
            commit("SET_MESSAGE",value);
        }
    }
});

