<template>
    <div id="mapContainer"></div> 
</template>
  
<script>
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  
  export default {
    name : 'LeafletMap',
    data() {
      return {
        map: null,
        latitude: 0,
        longitude: 0,
      };
    },
    async mounted() {
      this.initMap();
      this.findUserLocation();
    },
    methods: {
      initMap() {
        this.map = L.map("mapContainer").setView([this.latitude, this.longitude], 16);
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
      },
      findUserLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('position', position)
  
              const { latitude, longitude } = position.coords;
              this.latitude = latitude;
              this.longitude = longitude;
  
              this.map.setView([latitude, longitude], 13);
              L.marker([latitude, longitude], { draggable: true }).addTo(this.map);
            },
            (error) => {
              console.error("erreur:", error);
              if (error.code == error.PERMISSION_DENIED) {
                alert("Vous devez autoriser la géolocalisation pour utiliser cette fonctionnalité.");
              }
            }
          );
        } else {
          console.error("La géolocalisation n'est pas supportée par votre navigateur.");
        }
      },
    }
  }
</script>
  
  
<style>
  #mapContainer {
    width: 100%;
    height: 700px;
  }
</style>
  