<template>
  <div id="mapContainer"></div>
</template>
  
<script>

import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default {
  name: 'LeafletMap',
  props: {
    // draggableMarker: {
    //   type: Boolean,
    //   default: true,
    // },
    isMoving: {
      type: Boolean,
    },
    isParked: {
      type: Boolean,
    },
    isDropping: {
      type: Boolean,
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    wantLocation: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      map: null,
      pLongitude: 0,
      pLatitude: 0,
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
            this.pLatitude = latitude;
            this.pLongitude = longitude;

            this.map.setView([latitude, longitude], 13);
            L.marker([latitude, longitude], { draggable: true, title: "currentPostion" }).addTo(this.map);
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
    isDropping() {
      console.log("isDropping");
      if (this.isDropping) {
        let markerPosition;
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
        L.marker([markerPosition.lat, markerPosition.lng], { draggable: false, title: "currentPosition" }).addTo(this.map);
        this.map.setView([markerPosition.lat, markerPosition.lng], 13);
        this.$emit('coord', { lat: markerPosition.lat, lng: markerPosition.lng });
        
      }
      else{
        this.map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            this.map.removeLayer(layer);
          }
        });
        this.findUserLocation();
      }

    },
    isMoving() {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });
      if (!this.isMoving) {
        this.findUserLocation();
      }
    },
    isParked() {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });
      if (this.isParked) {
        L.marker([this.latitude, this.longitude], { draggable: false, title: "currentPosition" }).addTo(this.map);
        this.map.setView([this.latitude, this.longitude], 13);
      }
      else {
        this.findUserLocation();
      }
    },
    wantLocation() {
      if (this.wantLocation) {
        let markerPosition;
        this.map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            markerPosition = layer.getLatLng();
          }
        });
        this.map.setView([markerPosition.lat, markerPosition.lng], 16);
        this.$emit('wantedLocation');
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
  