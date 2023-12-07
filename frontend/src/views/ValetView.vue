<template>
    <div class="flex flex-col shadow-2xl rounded-2xl align-center">
        <div>
            <ValetMap :allUsers="allUsers" :wantCenterUser="wantCenterUser"/>
        </div>
        <div class="p-4">
            <h1 class="text-xl font-medium">Voitures garées</h1>
            <table class="table-auto w-[100%] ">
                <thead>
                    <tr>
                        <th class="px-4 py-2">Nom</th>
                        <th class="px-4 py-2">Marque</th>
                        <th class="px-4 py-2">Modèle</th>
                        <th class="px-4 py-2">Plaque</th>
                        <th class="px-4 py-2">Couleur</th>
                        <th class="px-4 py-2">Temps restant</th>
                        <th class="px-4 py-2">Centrer</th>
                        <th class="px-4 py-2">Déplacer</th>

                    </tr>
                </thead>
                <tbody>

                    <tr v-for="user in allUsers" :key="user.id">
                        <td class="border px-4 py-2">{{ user.username }}</td>
                        <td class="border px-4 py-2" v-if="user.voiture">{{ user.voiture.marque }}</td>
                        <td class="border px-4 py-2" v-if="user.voiture">{{ user.voiture.modele }}</td>
                        <td class="border px-4 py-2" v-if="user.voiture">{{ user.voiture.plaque }}</td>
                        <td class="border px-4 py-2" v-if="user.voiture">{{ user.voiture.couleur }}</td>

                        <td class="border px-4 py-2 text-green-500" v-if="user.voiture && user.voiture.temps_restant > 1800">{{ user.voiture.temps_restant }}</td>
                        <td class="border px-4 py-2 text-orange-500" v-else-if="user.voiture && user.voiture.temps_restant > 900">{{ user.voiture.temps_restant }}</td>
                        <td class="border px-4 py-2 text-red-500" v-else>{{ user.voiture.temps_restant }} secondes</td>
                        <td class="border px-4 py-2">
                            <button class="flex justify-center rounded-full p-2 bg-slate-200 shadow-lg w-[100%] hover:bg-slate-300 hover:shadow-none"
                                @click="centerOnMap(user)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                                </svg>
                            </button>
                            
                        </td>
                        <td class="border px-4 py-2">
                            <button class="flex justify-center rounded-full p-2 bg-slate-200 shadow-lg w-[100%] hover:bg-slate-300 hover:shadow-none"
                                @click="moveCar(user)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-car-front-fill" viewBox="0 0 16 16">
                                    <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import ValetMap from '../components/ValetMap.vue'
import { jwtDecode } from 'jwt-decode';
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
    name: 'ValetView',
    data() {
        return {
            allUsers: [],
            wantCenterUser : null,
        }
    },
    components: {
        ValetMap
    },
    methods: {
        async getAllUsers() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    localStorage.removeItem('token');
                    this.$router.push({ name: 'login' });
                    throw new Error('Non authentifié. Redirection vers la connexion.');
                }
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;
                if (!userId) {
                    localStorage.removeItem('token');
                    this.$router.push({ name: 'login' });
                    toast.error("Veuillez vous connecter pour faire une action avec votre voiture.");
                    throw new Error('Non authentifié. Redirection vers la connexion.');
                }
                const response = await fetch(`https://gare-no-ticket.vercel.app/users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        this.$router.push({ name: 'login' });
                        toast.error("Non authentifié. Redirection vers la connexion.")
                        throw new Error('Non authentifié. Redirection vers la connexion.');
                    } else {
                        toast.error("Erreur lors de la récupération des voitures.");
                        throw new Error('Erreur lors de la récupération des voitures');
                    }
                }
                const data = await response.json();
                this.allUsers = data.users;
            } catch (error) {
                console.error(error);
            }
        },
        centerOnMap(user) {
            this.wantCenterUser = user;
        },
        moveCar(user) {
            this.$router.push({ name: 'deplacement', params: { id: user._id } });
        }
        
        
    },
    beforeMount() {
    },
    async mounted() {
        await this.getAllUsers();
        this.allUsers.forEach(user => {
            let date = new Date();
            let dateFin = new Date(user.voiture.timeToLeave);
            let jourActu = date.getDate();
            let heureActu = date.getHours();
            let minuteActu = date.getMinutes();
            let secActu = date.getSeconds();
            let jourFin = dateFin.getDate();
            let heureFin = dateFin.getHours();
            let minuteFin = dateFin.getMinutes();
            let secFin = dateFin.getSeconds();
            let jour = jourFin - jourActu;
            let heure = heureFin - heureActu;
            let minute = minuteFin - minuteActu;
            let sec = secFin - secActu;
            if (sec < 0) {
                minute--;
                sec = 60 + sec;
            }
            if (minute < 0) {
                heure--;
                minute = 60 + minute;
            }
            if (heure < 0) {
                jour--;
                heure = 24 + heure;
            }
            if (jour < 0) {
                jour = 0;
                heure = 0;
                minute = 0;
                sec = 0;
            }
            user.voiture.temps_restant = (jour * 86400) + (heure * 3600) + (minute * 60) + sec;
            
            setInterval(() => {
                user.voiture.temps_restant--;
                if (user.voiture.temps_restant <= 0) {
                    user.voiture.temps_restant = 0;
                    clearInterval();
                }
            }, 1000);
        })
    }
    
}
</script>