import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/'
import Home from '../views/Home.vue'
import adminPanel from '../views/adminPanel.vue'
import Login from '../views/Login.vue'
import Studenti from '../views/Studenti.vue'
import profiloStudente from '../views/profiloStudente.vue'
import Corso from '../views/Corso.vue'
import courseProgram from '../views/courseProgram.vue'
import Materials from '../views/Materials.vue'
import ChangePassword from '../views/ChangePassword.vue'
import HandleEmailPassword from '../views/HandleEmailPassword.vue'
import signInWithAccounts from '../views/signInWithAccounts.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/signInWithAccounts',
    name: 'signInWithAccounts',
    component: signInWithAccounts
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
    path: '/adminPanel',
    name: 'adminPanel',
    component: adminPanel,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
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
  },
  {
    path: '/courseProgram',
    name: 'courseProgram',
    component: courseProgram,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/materials',
    name: 'materials',
    component: Materials,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/changePassword',
    name: 'changePassword',
    component: ChangePassword,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/handleEmailPassword',
    name: 'handleEmailPassword',
    component: HandleEmailPassword,
    
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
      
        next(false)
      }
    
  } else {
    next()
  }
})

export default router
