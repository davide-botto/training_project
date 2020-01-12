import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

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
            return state.user
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
        SET_MESSAGE(state,value) {
            state.user.message = value
        }
    },
    actions: {
        fetchUser({commit}, user) {
            commit("SET_LOGGED_IN", user !== null);
            commit("SET_ADMIN", user.admin == true);
            if (user) {
                commit("SET_USER", {
                    email: user.email,
                    admin: user.admin,
                    emailVerified: user.emailVerified
                });
            } else {
                commit("SET_USER", null);
            }
        },

        triggerMessage({commit}, value) {
            commit("SET_MESSAGE",value);
        }
    }
}

export default new Vuex.Store({
    modules: {
        authentication
    }
});

