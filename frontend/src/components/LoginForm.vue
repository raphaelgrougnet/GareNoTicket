<template>
    <div class="login-form p-8 w-2/3">
        <h1 class="title text-3xl mb-6 text-center">Connexion</h1>
        <form v-on:submit.prevent="login">
            <div class="field mb-4">
                <label class="label text-lg mb-2">Email</label>
                <div class="control">
                    <input
                        class="input border p-2 rounded w-full"
                        type="email"
                        placeholder="Entrez votre email"
                        v-model.trim="email"
                    />
                </div>
            </div>
            <div class="field mb-4">
                <label class="label text-lg mb-2">Mot de passe</label>
                <div class="control">
                    <input
                        class="input border p-2 rounded w-full"
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        v-model.trim="password"
                    />
                </div>
            </div>
            <div class="field flex">
                <div class="control">
                    <button class="button bg-blue-500 text-white p-2 rounded">Connexion</button>
                </div>
                <router-link :to="{ name : 'register' }" class="p-2 italic underline">Pas encore de compte ?</router-link>
            </div>
            <div class="field">
              <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
            </div>
        </form>
    </div>
</template>

<script>
import { useToast } from "vue-toastification";
const toast = useToast();
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
        async login() {
          try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.email,
                    password: this.password,
                })
            });
            const json = await response.json();
            if (!response.ok) {
              this.errorMessage = json.message;
              return;
            }
            localStorage.setItem('token', json.token)
            toast.success("Connexion effectué avec succès.", {
                timeout: 5000
            });
            this.$router.push({ name : 'home'})
          } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue.", {
                timeout: 5000
            });
          }
          

            
        }
    }
}
</script>

<style scoped></style>
