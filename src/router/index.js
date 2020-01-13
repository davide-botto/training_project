import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Studenti from '../views/Studenti.vue'
import profiloStudente from '../views/profiloStudente.vue'
import Corso from '../views/Corso.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },

  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/studenti',
    name: 'studenti',
    component: Studenti,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/profiloStudente',
    name: 'profilo',
    component: profiloStudente,
    meta: {
      requiresAuth: true,
      
    }
  },
  {
    path: '/corso',
    name: 'corso',
    component: Corso,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


/** PROTEZIONE NAVIGAZIONE SU VISTE
 * Per ogni route, controllo se possiede un navigation guard:
 * se sì, consento il routing alla vista solo se l'utente è logged-in
 * e la sua email è verificata
*/
router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    
    if (store.getters['authentication/user'].loggedIn && store.getters['authentication/user'].data.emailVerified) {
      next()

    } else {
      next('/')
    }
    // Alcune routes devono essere accessibili solo agli utenti admin
  } else if (to.matched.some(record => record.meta.requiresAdmin)){
    if (store.getters['authentication/user'].loggedIn && store.getters['authentication/user'].isAdmin) {
      next()
    } else {
      next('/home')
    }
  } else {
    next()
  }
})

export default router
