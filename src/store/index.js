import Vue from "vue";
import Vuex from "vuex";
import {authentication} from "./authentication"
import {topbar} from "./topbar"
Vue.use(Vuex);


export default new Vuex.Store({
    modules: {
        authentication,
        topbar
    }
});

