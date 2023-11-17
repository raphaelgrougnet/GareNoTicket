<template>
  <nav class="bg-blue-500 p-4">
    <div class="flex justify-between p-2">
        <div>
            <router-link :to="{ name : 'home' }" class="text-white text-xl font-bold ">GareNoTicket</router-link>
        </div>
        <div>
            <router-link :to="{ name : 'login' }" class="text-white text-xl font-bold bg-slate-600 rounded px-3 py-2 hover:bg-slate-700">Connexion</router-link>
        </div>
    </div>
  </nav>
</template>

<script>
export default {
    name: 'NavBar',
};
</script>

<style scoped>
</style>
