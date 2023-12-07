<template>
    <div id="mapContainer"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
    name: 'ValetMap',
    props: {
        allUsers: {
            type: Object,
            default: null
        },
        wantCenterUser: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            map: null,
            latitude: 0,
            longitude: 0
        }
    },
    async mounted() {
        this.initMap()
        this.findUserLocation()
    },
    methods: {
        initMap() {
            this.map = L.map('mapContainer').setView([this.latitude, this.longitude], 16)
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution:
                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map)
        },
        findUserLocation() {
            var redIcon = new L.Icon({
                iconUrl:
                    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                shadowUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords

                        this.map.setView([latitude, longitude], 13)
                        L.marker([latitude, longitude], {
                            draggable: false,
                            icon: redIcon,
                            title: 'Votre position'
                        }).addTo(this.map)
                    },
                    (error) => {
                        console.error('erreur:', error)
                        if (error.code == error.PERMISSION_DENIED) {
                            alert(
                                'Vous devez autoriser la géolocalisation pour utiliser cette fonctionnalité.'
                            )
                        }
                    }
                )
            } else {
                console.error("La géolocalisation n'est pas supportée par votre navigateur.")
            }
        }
    },
    watch: {
        allUsers() {
            this.allUsers.forEach((user) => {
                L.marker([user.voiture.latitude, user.voiture.longitude], { draggable: false, title: user.username }).addTo(this.map)
            })
            
        },
        wantCenterUser() {
            if (this.wantCenterUser) {
                this.map.setView([this.wantCenterUser.voiture.latitude, this.wantCenterUser.voiture.longitude], 16)
            }
        }
    },
    
}
</script>

<style>
#mapContainer {
    width: 100%;
    height: 70vh;
}
</style>
