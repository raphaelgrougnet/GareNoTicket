<template>
    <div class="flex flex-col shadow-2xl rounded-2xl align-center">
        <div>
            <DeplacementMap :currentUser="currentUser"
                            :moveCar="this.moveCarBool"
                            :validatePosition="this.validatePositionBool" 
                            @coord="updateCoords"/>
        </div>
        <div v-if="currentUser">
            <div class="flex px-5 py-2" v-if="currentUser.voiture.isMoving">
                <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled >
                    Je déplace la voiture
                </button>
                <button class="shadow rounded px-5 py-2 m-3 hover:bg-slate-200 flex-grow" @click="validatePosition">
                    Validation du stationnement
                </button>
            </div>
            <div class="flex px-5 py-2" v-else-if="currentUser.voiture.isParked">
                <button class="shadow rounded px-5 py-2 m-3 hover:bg-slate-200 flex-grow" @click="moveCar">
                    Je déplace la voiture
                </button>
                <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled>
                    Validation du stationnement
                </button>
            </div>
            <div class="flex px-5 py-2" v-else>
                <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled>
                    Je déplace la voiture
                </button>
                <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled>
                    Validation du stationnement
                </button>
            </div>
            <p v-if="currentUser && currentUser.voiture.isMoving" class="text-center pb-4 text-red-500">Vérifier la position de la voiture ou déplacer le marqueur rouge pour la corriger puis validez le stationnement</p>

        </div>
    </div>
</template>

<script>
import DeplacementMap from '../components/DeplacementMap.vue'
import { jwtDecode } from 'jwt-decode'
import { useToast } from 'vue-toastification'
const toast = useToast()
export default {
    name: 'DeplacementView',
    data() {
        return {
            currentUser: null,
            moveCarBool: false,
            validatePositionBool: false
        }
    },
    components: {
        DeplacementMap
    },
    methods: {
        async getUser() {
            const id = this.$route.params.id
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    localStorage.removeItem('token')
                    this.$router.push({ name: 'login' })
                    throw new Error('Non authentifié. Redirection vers la connexion.')
                }
                const decodedToken = jwtDecode(token)
                const userId = decodedToken.userId
                if (!userId) {
                    localStorage.removeItem('token')
                    this.$router.push({ name: 'login' })
                    toast.error('Veuillez vous connecter pour faire une action avec votre voiture.')
                    throw new Error('Non authentifié. Redirection vers la connexion.')
                }
                const response = await fetch(`https://gare-no-ticket.vercel.app/user/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token')
                        this.$router.push({ name: 'login' })
                        toast.error('Non authentifié. Redirection vers la connexion.')
                        throw new Error('Non authentifié. Redirection vers la connexion.')
                    } else {
                        toast.error('Erreur lors de la récupération des voitures.')
                        throw new Error('Erreur lors de la récupération des voitures')
                    }
                }
                const data = await response.json()
                this.currentUser = data.user
            } catch (error) {
                console.error(error)
            }
        },
        async sendPostion(latitude, longitude, isParked, isMoving) {
            const id = this.$route.params.id
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    localStorage.removeItem('token')
                    this.$router.push({ name: 'login' })
                    throw new Error('Non authentifié. Redirection vers la connexion.')
                }
                const decodedToken = jwtDecode(token)
                const userId = decodedToken.userId
                if (!userId) {
                    localStorage.removeItem('token')
                    this.$router.push({ name: 'login' })
                    toast.error('Veuillez vous connecter pour faire une action avec votre voiture.')
                    throw new Error('Non authentifié. Redirection vers la connexion.')
                }
                const response = await fetch(`https://gare-no-ticket.vercel.app/car/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        latitude: latitude,
                        longitude: longitude,
                        isParked: isParked,
                        isMoving: isMoving
                    })
                })
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token')
                        this.$router.push({ name: 'login' })
                        toast.error('Non authentifié. Redirection vers la connexion.')
                        throw new Error('Non authentifié. Redirection vers la connexion.')
                    } else {
                        toast.error('Erreur lors de la mise à jour de la voiture.')
                        throw new Error('Erreur lors de la mise à jour de la voiture.')
                    }
                }
                const data = await response.json()
                console.log(data.voiture)
                // this.currentUser.voiture = data.voiture
            } catch (error) {
                console.error(error)
            }
        },
        moveCar(){
            this.currentUser.voiture.isMoving = true
            this.currentUser.voiture.isParked = false
            this.moveCarBool = true,
            this.validatePositionBool = false
            this.sendPostion(
                this.currentUser.voiture.latitude,
                this.currentUser.voiture.longitude,
                this.currentUser.voiture.isParked,
                this.currentUser.voiture.isMoving
            )
        },
        validatePosition() {
            this.currentUser.voiture.isMoving = false
            this.currentUser.voiture.isParked = true
            this.moveCarBool = false,
            this.validatePositionBool = true
        },
        updateCoords(lat, lng) {
            this.currentUser.voiture.latitude = lat.lat
            this.currentUser.voiture.longitude = lng.lng
            this.sendPostion(
                this.currentUser.voiture.latitude,
                this.currentUser.voiture.longitude,
                this.currentUser.voiture.isParked,
                this.currentUser.voiture.isMoving
            )
        },

        
    },
    mounted() {
        this.getUser()
    }
}
</script>
