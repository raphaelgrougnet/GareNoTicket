<template>
    <div id="mapContainer"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
    name: 'DeplacementMap',
    props: {
        currentUser: {
            type: Object,
            default: null
        },
        moveCar: {
            type: Boolean,
            default: false
        },
        validatePosition: {
            type: Boolean,
            default: false
        }

    },
    data() {
        return {
            map: null,
            latitude: 0,
            longitude: 0,
            markerValet: null,
            markerUser: null,
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
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords

                        this.map.setView([latitude, longitude], 13)
                        this.markerValet = L.marker([latitude, longitude], {
                            draggable: false,
                            title: 'Votre position'
                        })
                        this.markerValet.addTo(this.map)
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
        currentUser(val) {
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
            if (val) {
                this.latitude = val.voiture.latitude
                this.longitude = val.voiture.longitude
                this.map.setView([this.latitude, this.longitude], 13)
                this.markerUser = L.marker([this.latitude, this.longitude], {
                    draggable: false,
                    icon: redIcon,
                    title: 'La voiture à déplacer'
                })
                this.markerUser.addTo(this.map)
                if (val.voiture.isMoving) {
                    this.map.removeLayer(this.markerValet)
                }
            }
        },
        moveCar() {
            console.log('moveCar')
            if (this.moveCar) {
                this.map.removeLayer(this.markerValet)
                this.markerUser.dragging.enable()
            }
        },
        validatePosition() {
            console.log('validatePosition')
            if (this.validatePosition) {
                this.markerUser.dragging.disable()
                this.latitude = this.markerUser.getLatLng().lat
                this.longitude = this.markerUser.getLatLng().lng
                this.markerUser.setLatLng([this.latitude, this.longitude])
                this.$emit('coord', {lat: this.latitude}, {lng: this.longitude})
            }
        }
    }
}
</script>

<style>
#mapContainer {
    width: 100%;
    height: 70vh;
}
</style>
