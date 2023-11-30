<template>
    <div class="shadow rounded-xl p-4 mt-5 w-[50%]">
        <h1 class="text-2xl">Informations personnelles</h1>
        <form class="space-y-4 mt-4" @submit.prevent="sendProfileForm">
            <div v-if="localUser">
                <label class="block">Pseudo</label>
                <input
                    class="w-full px-2 py-1 border rounded"
                    type="text"
                    name="pseudo"
                    v-model.trim="localUser.username"
                />
            </div>
            <div v-if="localUser">
                <label class="block">Email</label>
                <input
                    class="w-full px-2 py-1 border rounded"
                    type="email"
                    name="email"
                    v-model.trim="localUser.email"
                />
            </div>
            <h1 class="text-2xl">Voiture</h1>
            <div v-if="localUser?.voiture" class="space-y-4 mt-4">
                <div>
                    <label class="block">Immatriculation</label>
                    <input
                        class="w-full px-2 py-1 border rounded"
                        type="text"
                        name="immatriculation"
                        v-model.trim="localUser.voiture.plaque"
                    />
                </div>
                <div v-if="localUser.voiture">
                    <label class="block">Marque</label>
                    <input
                        class="w-full px-2 py-1 border rounded"
                        type="text"
                        name="marque"
                        v-model.trim="localUser.voiture.marque"
                    />
                </div>
                <div v-if="localUser.voiture">
                    <label class="block">Modèle</label>
                    <input
                        class="w-full px-2 py-1 border rounded"
                        type="text"
                        name="modele"
                        v-model.trim="localUser.voiture.modele"
                    />
                </div>
                <div v-if="localUser.voiture">
                    <label class="block">Couleur</label>
                    <input
                        class="w-full px-2 py-1 border rounded"
                        type="text"
                        name="couleur"
                        v-model.trim="localUser.voiture.couleur"
                    />
                </div>
            </div>
            <div v-else>
                <button
                    class="w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                    @click="addVoiture"
                >
                    Ajouter une voiture
                </button>
            </div>
            <button
                type="submit"
                class="w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
                Enregistrer les modifications
            </button>
            <button class="w-full px-4 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-700"
              @click.prevent="deleteAccount">
              Supprimer mon compte
            </button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'ProfilForm',
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    data() {
        return {}
    },
    computed: {
        localUser() {
            return this.user.user
        }
    },
    methods: {
        sendProfileForm() {
            this.$emit('send-profile-form', this.localUser)
        },
        addVoiture() {
            this.localUser.voiture = {
                plaque: '',
                marque: '',
                modele: '',
                couleur: ''
            }
        },
        deleteAccount() {
            if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
                this.$emit('delete-account')
            }
        }
    }
}
</script>

<style scoped></style>
