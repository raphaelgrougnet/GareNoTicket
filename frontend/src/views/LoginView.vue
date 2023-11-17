<template>
  <div class="flex justify-center">
    <LoginForm />
  </div>
</template>

<script>
    import LoginForm from '../components/LoginForm.vue'

    export default {
    name: 'LoginVue',
    components: {
        LoginForm
    }
    }
</script>

<style scoped>
</style>
