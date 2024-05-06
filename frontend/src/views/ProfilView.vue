<template>
    <div class="flex justify-center align-middle">
        <ProfilForm :user="user" @send-profile-form="sendProfileForm" @delete-account="onDeleteAccount"/>
    </div>
</template>

<script>
import ProfilForm from '../components/ProfilForm.vue'
import { jwtDecode } from 'jwt-decode'
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
    name: 'ProfilView',
    data() {
        return {
            user: {}
        }
    },
    components: {
        ProfilForm
    },
    methods: {
        async getUser() {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    localStorage.removeItem('token')
                    this.$router.push({ name: 'login' })
                    throw new Error('Non authentifié. Redirection vers la connexion.')
                }
                const decodedToken = jwtDecode(token)
                const userId = decodedToken.userId
                if (!userId) {
                    localStorage.removeItem('token')
                    this.$router.push({ name: 'login' })
                    throw new Error('Non authentifié. Redirection vers la connexion.')
                }
                const response = await fetch(`http://localhost:3000/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token')
                        this.$router.push({ name: 'login' })
                        throw new Error('Non authentifié. Redirection vers la connexion.')
                    } else {
                        throw new Error("Erreur lors de la récupération de l'utilisateur")
                    }
                }
                
                const user = await response.json()
                this.user = user
            } catch (error) {
                console.error(error)
            }
        },
        async sendProfileForm(userRecevied){
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    localStorage.removeItem('token');
                    this.$router.push({ name: 'login' });
                    throw new Error('Non authentifié. Redirection vers la connexion.');
                }
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;
                if (!userId) {
                    localStorage.removeItem('token');
                    this.$router.push({ name: 'login' });
                    throw new Error('Non authentifié. Redirection vers la connexion.');
                }
                const response = await fetch(`http://localhost:3000/user/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ user: userRecevied })
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        this.$router.push({ name: 'login' });
                        toast.error('Non authentifié. Redirection vers la connexion.');
                        throw new Error('Non authentifié. Redirection vers la connexion.');
                    } else {
                        toast.error('Erreur lors de l\'enregistrement des modifications');
                        throw new Error('Erreur lors de l\'enregistrement des modifications');
                    }
                }
                else {
                  response.json().then((data) => {
                    console.log(data)
                    localStorage.setItem('token', data.updatedUserJWT)
                  })

                  toast.success('Modifications enregistrées avec succès');
                }
            } catch (error) {
                console.error(error);
            }
        },
        async onDeleteAccount(){
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    localStorage.removeItem('token');
                    this.$router.push({ name: 'login' });
                    throw new Error('Non authentifié. Redirection vers la connexion.');
                }
                const response = await fetch(`http://localhost:3000/user`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        this.$router.push({ name: 'login' });
                        toast.error('Non authentifié. Redirection vers la connexion.');
                        throw new Error('Non authentifié. Redirection vers la connexion.');
                    } else {
                        toast.error('Erreur lors de la suppression du compte');
                        throw new Error('Erreur lors de la suppression du compte');
                    }
                }
                else {
                    localStorage.removeItem('token');
                    this.$router.push({ name: 'login' });
                    toast.success('Compte supprimé avec succès');
                }
            } catch (error) {
                console.error(error);
            }
        }
    },

    created() {
        this.getUser()
    }
}
</script>

<style scoped></style>
