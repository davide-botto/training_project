// Gestisce le proprietà della barra in alto presente in tutte le pagine
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