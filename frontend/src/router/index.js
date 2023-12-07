import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { jwtDecode } from 'jwt-decode';
import { useToast } from "vue-toastification";
const toast = useToast();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token') === null) {
          next({ name: 'login' })
        }
        else {
          const decoded = jwtDecode(localStorage.getItem('token'));
          if (!decoded.voiture && !decoded.isValet) {
            toast.error("Vous n'avez pas de voiture enregistrée. Veuillez en ajouter une.");
            next({ name: 'profil' })
          }
          else if (decoded.isValet) {
            next({ name: 'valet' })
          }
          else {
            next()
          }
        }
        
        
      }
    },
    {
      path: '/valet',
      name: 'valet',
      component: () => import('../views/ValetView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token') === null) {
          next({ name: 'login' })
        }
        else{
          if (!jwtDecode(localStorage.getItem('token')).isValet) {
            next({ name: 'home' })
          }
          else{
            next()
          }
        }
        
        
      }
    },
    {
      path: '/valet/deplacement/:id',
      name: 'deplacement',
      component: () => import('../views/DeplacementView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token') === null) {
          next({ name: 'login' })
        }
        else{
          if (!jwtDecode(localStorage.getItem('token')).isValet) {
            next({ name: 'home' })
          }
          else{
            next()
          }
        }
        
        
      }
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: () => import('../views/TransactionView.vue'),
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('../views/ProfilView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token') !== null) {
          next({ name: 'home' })
        }
        else {
          next()
        }
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token') !== null) {
          next({ name: 'home' })
        }
        else {
          next()
        }
        
      }
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (to, from, next) => {
        localStorage.removeItem('token');
        next({ name: 'login' });
      }
    },
  ],
  
  
})


export default router