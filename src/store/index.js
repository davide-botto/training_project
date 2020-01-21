import Vue from "vue";
import Vuex from "vuex";
import {authentication} from "./authentication"
import {topbar} from "./topbar"
import {validateFormRules} from "./validateFormRules"

Vue.use(Vuex);


export default new Vuex.Store({
    modules: {
        authentication,
        topbar,
        validateFormRules,
        
    }
});

