<template>
  <div id="mapContainer"></div>
</template>
  
<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default {
  name: 'LeafletMap',
  props: {
    draggableMarker: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      map: null,
      longitude: 0,
      latitude: 0,
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

            const { latitude, longitude } = position.coords;
            this.latitude = latitude;
            this.longitude = longitude;

            this.map.setView([latitude, longitude], 13);
            L.marker([latitude, longitude], { draggable: true, title:"currentPostion" }).addTo(this.map);
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
  },

  watch: {
    draggableMarker() {
      var markerPosition;
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          markerPosition = layer.getLatLng();
        }
      });
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });


      if (!this.draggableMarker) {
        L.marker([markerPosition.lat, markerPosition.lng], { draggable: false, title : "currentPosition" }).addTo(this.map);
        this.map.setView([markerPosition.lat, markerPosition.lng], 13);
        console.log(markerPosition.lat, markerPosition.lng);
        this.$emit('latitude', markerPosition.lat);
        this.$emit('longitude', markerPosition.lng);
      }
      else {
        this.findUserLocation();
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
  