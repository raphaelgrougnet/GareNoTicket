
<template>
  <nav class="p-4 shadow-2xl">
    <div class="flex justify-between p-2">
        <div>
            <router-link :to="{ name : 'home' }" class="text-black text-xl font-bold ">GareNoTicket</router-link>
        </div>
        <div v-if="this.isLoggedIn && !this.isValet">
            <router-link to="/test" class="text-black text-xl font-bold rounded px-3 py-2 hover:bg-slate-200 hover:shadow">Ma place</router-link>
            <router-link to="/" class="text-black text-xl font-bold rounded px-3 py-2 hover:bg-slate-200 hover:shadow">Profil</router-link>
            <router-link to="/" class="text-black text-xl font-bold rounded px-3 py-2 hover:bg-slate-200 hover:shadow">Transaction</router-link>
            <router-link :to="{ name : 'logout' }" class="text-black text-xl font-bold rounded px-3 py-2 hover:bg-slate-200 hover:shadow">Déconnexion</router-link>
        </div>
        <div v-else-if="this.isLoggedIn && this.isValet">
            <router-link to="/test" class="text-black text-xl font-bold rounded px-3 py-2 hover:bg-slate-200 hover:shadow">Valet</router-link>
            <router-link to="/" class="text-black text-xl font-bold rounded px-3 py-2 hover:bg-slate-200 hover:shadow">Profil</router-link>
            <router-link :to="{ name : 'logout' }" class="text-black text-xl font-bold rounded px-3 py-2 hover:bg-slate-200 hover:shadow">Déconnexion</router-link>
        </div>
        <div v-else>
            <router-link :to="{ name : 'login' }" class="text-black text-xl font-bold rounded px-3 py-2 hover:bg-slate-200 hover:shadow">Connexion</router-link>
        </div>
    </div>
  </nav>
</template>

<script>
import { jwtDecode } from 'jwt-decode';
export default {
    
    name: 'NavBar',
    data() {
        return {
            isLoggedIn: false,
            isValet: false,
        }
    },
    mounted() {
        this.updateUserStatus();
    },
    methods: {
        updateUserStatus() {
            if (localStorage.getItem('token')) {
                const decoded = jwtDecode(localStorage.getItem('token'));
                this.isLoggedIn = true;
                this.isValet = decoded.isValet;
            } else {
                this.isLoggedIn = false;
                this.isValet = false;
            }
        }
    },
    watch: {
        '$route': 'updateUserStatus'
    }

    
};
</script>

<style scoped>
</style>
