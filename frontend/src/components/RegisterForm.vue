<template>
    <div class="login-form p-8 w-2/3">
        <h1 class="title text-3xl mb-6 text-center">Inscription</h1>
        <form v-on:submit.prevent="register">
            <div class="field mb-4">
                <label class="label text-lg mb-2">Nom</label>
                <div class="control">
                    <input class="input border p-2 rounded w-full" type="text" placeholder="Entrez votre prénom et nom"
                        v-model.trim="username" id="username-input" />
                </div>
            </div>
            <div class="field mb-4">
                <label class="label text-lg mb-2">Email</label>
                <div class="control">
                    <input class="input border p-2 rounded w-full" type="email" placeholder="Entrez votre email"
                        v-model.trim="email" id="email-input" />
                </div>
            </div>
            <div class="field mb-4">
                <label class="label text-lg mb-2">Mot de passe</label>
                <div class="control">
                    <input class="input border p-2 rounded w-full" type="password" placeholder="Entrez votre mot de passe"
                        v-model.trim="password" id="password-input" />
                </div>
            </div>
            <div class="field mb-4">
                <label class="label text-lg mb-2">Confirmer votre mot de passe</label>
                <div class="control">
                    <input class="input border p-2 rounded w-full" type="password"
                        placeholder="Entrez votre confirmation de mot de passe" v-model.trim="confirmPassword"
                        id="confirm-password-input" />
                </div>
            </div>

            <div class="field flex">
                <div class="control">
                    <button class="button bg-blue-500 text-white p-2 rounded">Inscription</button>
                </div>
                <router-link :to="{ name: 'login' }" class="p-2 italic underline">Déjà inscrit ?</router-link>
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
    name: 'RegisterForm',
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorMessage: ''
        }
    },
    methods: {
        validateForm() {
            const usernameInput = document.getElementById('username-input')
            const emailInput = document.getElementById('email-input')
            const passwordInput = document.getElementById('password-input')
            const confirmPasswordInput = document.getElementById('confirm-password-input')
            if (this.email === '' || this.password === '' || this.confirmPassword === '' || this.username === '') {
                this.errorMessage = "Veuillez remplir tous les champs"

                usernameInput.classList.remove('border-green-500')
                emailInput.classList.remove('border-green-500')
                passwordInput.classList.remove('border-green-500')
                confirmPasswordInput.classList.remove('border-green-500')
                usernameInput.classList.remove('border-red-500')
                emailInput.classList.remove('border-red-500')
                passwordInput.classList.remove('border-red-500')
                confirmPasswordInput.classList.remove('border-red-500')

                this.username === '' ? usernameInput.classList.add('border-red-500') : usernameInput.classList.add('border-green-500')

                this.email === '' ? emailInput.classList.add('border-red-500') : emailInput.classList.add('border-green-500')

                this.password === '' ? passwordInput.classList.add('border-red-500') : passwordInput.classList.add('border-green-500')

                this.confirmPassword === '' ? confirmPasswordInput.classList.add('border-red-500') : confirmPasswordInput.classList.add('border-green-500')
                return false;
            }
            else if (this.password !== this.confirmPassword) {
                this.errorMessage = "Les mots de passe ne correspondent pas"
                usernameInput.classList.add('border-green-500')
                emailInput.classList.add('border-green-500')
                passwordInput.classList.remove('border-green-500')
                confirmPasswordInput.classList.remove('border-green-500')
                passwordInput.classList.add('border-red-500')
                confirmPasswordInput.classList.add('border-red-500')

                return false;
            }
            else {
                usernameInput.classList.remove('border-red-500')
                emailInput.classList.remove('border-red-500')
                passwordInput.classList.remove('border-red-500')
                confirmPasswordInput.classList.remove('border-red-500')
                usernameInput.classList.add('border-green-500')
                emailInput.classList.add('border-green-500')
                passwordInput.classList.add('border-green-500')
                confirmPasswordInput.classList.add('border-green-500')
                return true
            }

        },
        async register() {
            if (this.validateForm()) {
                    try {
                        const response = await fetch(`http://localhost:3000/auth/signup`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: this.email,
                                password: this.password,
                                username: this.username
                            })
                        });
                        const json = await response.json();
                        if (!response.ok) {
                            this.errorMessage = json.message;
                                toast.error("Une erreur est survenue durant l'inscription.", {
                                timeout: 5000
                            });
                            return;
                        }
                        toast.success("Inscription effectué avec succès, veuillez vous connecter.", {
                            timeout: 5000
                        });
                        this.$router.push({ name : 'login'})
                    } catch (error) {
                        console.error(error);
                    }
                
            }
        }
    }
}
</script>

<style scoped></style>
