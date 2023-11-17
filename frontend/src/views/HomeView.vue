<template>
    <div class="flex flex-col shadow-2xl rounded-2xl align-center">
        <div class="flex-grow">
            <LeafletMap />
        </div>
        <div class="flex">
            <button class="shadow rounded px-5 py-2 m-3 hover:bg-slate-200 flex-grow">Je laisse ma voiture</button>
            <button class="bg-slate-300 text-neutral-400 rounded px-5 py-2 m-3 flex-grow" disabled>J'ai récupéré ma voiture</button>
        </div>
    </div>
</template>
  
<script>
    import LeafletMap from '../components/LeafletMap.vue'
    export default {
        name: 'HomeView',
        components: {
            LeafletMap
        }
    }
</script>
  
<style scoped>
</style>
  