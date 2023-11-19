<template>
    <div class="flex flex-col shadow-2xl rounded-2xl align-center">
        <div class="flex-grow">
            <LeafletMap :draggable-marker="this.draggableMarker" @latitude="updateLatitude" @longitude="updateLongitude"/>
        </div>
        <div class="flex" v-if="draggableMarker">
            <button class="shadow rounded px-5 py-2 m-3 hover:bg-slate-200 flex-grow" @click="askDrop">{{ dropTextButton
            }}</button>
            <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled>J'ai récupéré ma
                voiture</button>
        </div>
        <div class="flex" v-else>
            <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled>Je laisse ma
                voiture</button>
            <button class="shadow rounded px-5 py-2 m-3 hover:bg-slate-200 flex-grow" @click="pickUpCar">J'ai récupéré ma
                voiture</button>
        </div>
        <div class="flex align-middle justify-center flex-col" v-if="wantDrop">
            <p class="text-center">Veuillez vérifier que votre voiture est bien stationnée à l'endroid indiqué sur la carte,
                ou déplacer le marqueur sur la position de votre voiture.</p>
            <button class="shadow rounded px-5 py-2 m-3 hover:bg-slate-200" @click="dropCar">Je confirme</button>
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
            draggableMarker: true,
            wantDrop: false,
            dropTextButton: "Je laisse ma voiture",
            latitude: 0,
            longitude: 0,
        }
    },
    components: {
        LeafletMap
    },
    methods: {
        async sendPostion(lat, lng) {
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
                    body: JSON.stringify({ latitude: lat, longitude: lng })
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
                console.log('Position envoyée avec succès');
            } catch (error) {
                console.error(error);
            }
        },
        dropCar() {
            this.draggableMarker = false;
            this.wantDrop = !this.wantDrop;
            console.log(this.latitude, this.longitude);
            this.sendPostion(this.latitude, this.longitude);

        },
        askDrop() {
            this.wantDrop = !this.wantDrop;

        },
        pickUpCar() {
            this.draggableMarker = true;
        },
        updateLatitude(latitude) {
            this.latitude = latitude;
        },
        updateLongitude(longitude) {
            this.longitude = longitude;
        }

    },
    watch: {
        wantDrop() {
            this.wantDrop ? this.dropTextButton = "Annuler le dépôt de ma voiture" : this.dropTextButton = "Je laisse ma voiture";
        }
    }
}
</script>
  
<style scoped></style>
  