<template>
    <div class="flex flex-col shadow-2xl rounded-2xl align-center">
        <div class="flex-grow">
            <LeafletMap :latitude="this.latitude" :longitude="this.longitude" :isDropped="this.isDropped" :is-moving="this.isMoving" :isParked="this.isParked" @coord="saveCoord"/>
        </div>
        <div class="flex" v-if="isMoving">
            <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled>Je laisse ma voiture</button>
            <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled>J'ai récupéré ma voiture</button>
        </div>
        <div class="flex" v-else-if="isParked">
            <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled>Je laisse ma
                voiture</button>
            <button class="shadow rounded px-5 py-2 m-3 hover:bg-slate-200 flex-grow" @click="pickUpCar">J'ai récupéré ma
                voiture</button>
        </div>
        <div class="flex" v-else>
            <button class="shadow rounded px-5 py-2 m-3 hover:bg-slate-200 flex-grow" @click="askDrop">{{ dropTextButton }}</button>
            <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled>J'ai récupéré ma voiture</button>
        </div>
        <div class="flex align-middle justify-center flex-col" v-if="wantDrop">
            <p class="text-center">Veuillez vérifier que votre voiture est bien stationnée à l'endroid indiqué sur la carte,
                ou déplacer le marqueur sur la position de votre voiture.</p>
            <button class="shadow rounded px-5 py-2 m-3 hover:bg-slate-200" @click="dropCar">Je confirme</button>
        </div>
        <div v-if="isMoving">
            <p class="text-center p-5 text-red-500" >Votre voiture est en cours de déplacement. Veuillez patienter jusqu'à ce que votre valet ait terminé de la déplacer, puis rafraîchissez la carte.</p>
        </div>
        
    </div>
</template>
  
<script>
import LeafletMap from '../components/LeafletMap.vue'
import { jwtDecode } from 'jwt-decode';
export default {
    name: 'HomeView',
    data() {
        return {
            isMoving: false,
            isParked: false,
            wantDrop: false,
            isDropped: false,
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
                    throw new Error('Non authentifié. Redirection vers la connexion.');
                }
                const response = await fetch(`http://localhost:3000/car/${userId}`, {
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
                        throw new Error('Non authentifié. Redirection vers la connexion.');
                    } else {
                        throw new Error('Erreur lors de l\'envoi de la position');
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
                const response = await fetch(`http://localhost:3000/user`, {
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
            this.isDropped = true;
            this.wantDrop = !this.wantDrop;

        },
        askDrop() {
            this.wantDrop = !this.wantDrop;
        },
        pickUpCar() {
            this.isParked = false;
            this.isMoving = false;
            this.sendPostion(0, 0, false, false);
        },
        saveCoord(coord) {
            this.latitude = coord.lat;
            this.longitude = coord.lng;
            console.log(this.latitude, this.longitude);
            this.sendPostion(this.latitude, this.longitude, true, false);
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
  