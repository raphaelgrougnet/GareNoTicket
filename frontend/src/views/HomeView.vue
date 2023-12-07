<template>
    <div class="flex flex-col shadow-2xl rounded-2xl align-center">
        <div class="flex-grow">
            <LeafletMap :latitude="this.latitude"
            :longitude="this.longitude"
            :isDropping="this.isDropping"
            :is-moving="this.isMoving"
            :isParked="this.isParked"
            :wantLocation="this.wantLocation"
            @coord="saveCoord"
            @wantedLocation="wantLoc"/>
        </div>
        <div class="flex px-5 py-2" v-if="isMoving">
            <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled>Je laisse ma voiture</button>
            <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled>J'ai récupéré ma voiture</button>
        </div>
        <div class="flex px-5 py-2" v-else-if="isParked || isDropping">
            <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 flex-grow" disabled>Je laisse ma
                voiture</button>
            <button class="shadow rounded px-5 py-2 mx-2 hover:bg-slate-200 flex-grow" @click="pickUpCar">J'ai récupéré ma
                voiture</button>
            <button class="shadow px-2 py-2 rounded-full hover:bg-slate-200" @click="wantLoc">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
            </button>
        </div>
        <div class="flex px-5 py-2" v-else>
            <button class="shadow rounded px-5 py-2  hover:bg-slate-200 flex-grow" @click="askDrop">{{ dropTextButton }}</button>
            <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 mx-2 flex-grow" disabled>J'ai récupéré ma voiture</button>
            <button class="shadow px-2 py-2 rounded-full hover:bg-slate-200" @click="wantLoc">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
            </button>
        </div>
        <div class="flex align-middle justify-center flex-col" v-if="wantDrop">
            <p class="text-center">Veuillez vérifier que votre voiture est bien stationnée à l'endroid indiqué sur la carte,
                ou déplacer le marqueur sur la position de votre voiture.</p>
            <button class="shadow rounded px-5 py-2 m-3 hover:bg-slate-200" @click="dropCar">Je confirme</button>
        </div>
        <div v-if="isMoving">
            <p class="text-center px-2 pb-2 text-red-500" >Votre voiture est en cours de déplacement. Veuillez patienter jusqu'à ce que votre valet ait terminé de la déplacer, puis rafraîchissez la carte.</p>
        </div>
        
    </div>
</template>
  
<script>
import LeafletMap from '../components/LeafletMap.vue'
import { jwtDecode } from 'jwt-decode';
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
    name: 'HomeView',
    data() {
        return {
            isMoving: false,
            isParked: false,
            wantDrop: false,
            isDropping: false,
            wantLocation: false,
            dropTextButton: "Je laisse ma voiture",
            latitude: 0,
            longitude: 0,
        }
    },
    components: {
        LeafletMap
    },
    methods: {
        async sendPostion(lat, lng, pIsParked = false, pIsMoving = false) {
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
                const response = await fetch(`https://gare-no-ticket.vercel.app/car/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ latitude: lat, longitude: lng, isParked: pIsParked, isMoving: pIsMoving })
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        this.$router.push({ name: 'login' });
                        toast.error("Non authentifié. Redirection vers la connexion.")
                        throw new Error('Non authentifié. Redirection vers la connexion.');
                    } else {
                        toast.error("Erreur lors de l'envoi de la position.");
                        throw new Error('Erreur lors de l\'envoi de la position');
                        
                    }
                }
                else{
                    if (!pIsParked && !pIsMoving){
                        toast.success("Votre voiture a été récupérée avec succès.");
                    }
                    else{
                        toast.success("Votre voiture a été déposée avec succès.");
                    }
                    
                }
            } catch (error) {
                console.error(error);
            }
        },
        async getUser(){
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
                    throw new Error('Non authentifié. Redirection vers la connexion.');
                }
                const response = await fetch(`https://gare-no-ticket.vercel.app/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        this.$router.push({ name: 'login' });
                        throw new Error('Non authentifié. Redirection vers la connexion.');
                    } else {
                        throw new Error('Erreur lors de la récupération de l\'utilisateur');
                    }
                }
                const user = await response.json()
                return user;
            } catch (error) {
                console.error(error);
            }
        
        },
        dropCar() {
            this.isDropping = true;
            this.wantDrop = !this.wantDrop;

        },
        askDrop() {
            this.wantDrop = !this.wantDrop;
        },
        pickUpCar() {
            this.getUser().then((promise) => {
                if (promise.user.voiture.isMoving) {
                    location.reload();
                }
                else{
                    this.isParked = false;
                    this.isMoving = false;
                    this.isDropping = false;
                    this.sendPostion(0, 0, false, false);
                }
            });
        },
        saveCoord(coord) {
            this.latitude = coord.lat;
            this.longitude = coord.lng;
            this.sendPostion(this.latitude, this.longitude, true, false);
        },
        wantLoc() {
            this.wantLocation = !this.wantLocation;

        }

    },
    watch: {
        wantDrop() {
            this.wantDrop ? this.dropTextButton = "Annuler le dépôt de ma voiture" : this.dropTextButton = "Je laisse ma voiture";
        }
    },
    mounted() {
        this.getUser().then((user) => {
            this.isMoving = user.user.voiture.isMoving;
            this.latitude = user.user.voiture.latitude;
            this.longitude = user.user.voiture.longitude;
            this.isParked = user.user.voiture.isParked;
        });
        
    }
}
</script>
  
<style scoped></style>
  