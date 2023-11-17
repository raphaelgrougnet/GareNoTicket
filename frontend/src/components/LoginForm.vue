<template>
  <div class="login-form p-8 w-2/3">
    <h1 class="title text-3xl mb-6 text-center">Connexion</h1>
    <form v-on:submit.prevent="login">
      <div class="field mb-4">
        <label class="label text-lg mb-2">Email</label>
        <div class="control">
          <input class="input border p-2 rounded w-full" type="email" placeholder="Entrez votre email" v-model="email">
        </div>
      </div>
      <div class="field mb-4">
        <label class="label text-lg mb-2">Mot de passe</label>
        <div class="control">
          <input class="input border p-2 rounded w-full" type="password" placeholder="Entrez votre mot de passe" v-model="password">
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button bg-blue-500 text-white p-2 rounded">Connexion</button>
        </div>
      </div>
        <div class="field">
            <p class="text-red-500 text-sm">{{ errorMessage }}</p>
        </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
    methods: {
        login() {
            fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                email: this.email,
                password: this.password
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    response.json()
                    .then(message => {
                        this.errorMessage = message.message
                    })
                    
                    throw new Error('Something went wrong ...')
                }
            })
            .then(data => {
                localStorage.setItem('token', data.token)
                this.$router.push('/')
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
}
</script>

<style scoped>
</style>
