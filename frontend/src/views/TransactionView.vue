<template>
    <div class="flex flex-col mt-5 shadow-lg rounded-md">
        <div class="flex py-3 px-4">
            <div class="flex gap-2">
                <p class="py-2">Total a payer :</p>
                <p class="rounded-full bg-sky-600 shadow-lg text-white px-4 py-2">{{ totalToPay }} $</p>
            </div>
            <div class="flex justify-end flex-grow" v-if="totalToPay > 0">
                <button class="text-white rounded bg-sky-600 px-4 py-2 shadow-lg" @click="payNow">
                    PAYER MAINTENANT
                </button>
            </div>
        </div>
        <div class="py-3 px-4 font-medium">
            <h1>Historique des factures</h1>
            <TableauFactures :factures="this.factures"  />
        </div>
        <div class="py-3 px-4 font-medium">
            <h1>Historique des déplacements</h1>
            <TableauDeplacements :deplacements="this.deplacements" />
            
        </div>
    </div>
</template>

<script>
import TableauFactures from '../components/TableauFactures.vue'
import TableauDeplacements from '../components/TableauDeplacements.vue'
export default {
    name: 'TransactionView',
    data() {
        return {
            transactions : [],
            deplacements : [],
            totalToPay : 0
        }
    },
    components: {
        TableauFactures,
        TableauDeplacements
    },
    methods : {
        async getTransactions() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    localStorage.removeItem('token');
                    this.$router.push({ name: 'login' });
                    throw new Error('Non authentifié. Redirection vers la connexion.');
                }
                
                const response = await fetch(`http://localhost:3000/facture`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        this.$router.push({ name: 'login' });
                        throw new Error('Non authentifié. Redirection vers la connexion.');
                    } else {
                        throw new Error('Erreur lors de la récupération des transactions');
                    }
                }
                else{
                    
                    this.factures = (await response.json()).factures
                }
            } catch (error) {
                console.error(error);
            }
        },
        async getDeplacements() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    localStorage.removeItem('token');
                    this.$router.push({ name: 'login' });
                    throw new Error('Non authentifié. Redirection vers la connexion.');
                }
                
                const response = await fetch(`http://localhost:3000/historique`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        this.$router.push({ name: 'login' });
                        throw new Error('Non authentifié. Redirection vers la connexion.');
                    } else {
                        throw new Error('Erreur lors de la récupération des transactions');
                    }
                }
                else{
                    
                    this.deplacements = (await response.json()).histo
                }
            } catch (error) {
                console.error(error);
            }
        },
        async payNow(){
            console.log("pay now")
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    localStorage.removeItem('token');
                    this.$router.push({ name: 'login' });
                    throw new Error('Non authentifié. Redirection vers la connexion.');
                }
                
                const response = await fetch(`http://localhost:3000/effectuerPaiement`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        this.$router.push({ name: 'login' });
                        throw new Error('Non authentifié. Redirection vers la connexion.');
                    } else {
                        throw new Error('Erreur lors de la récupération des transactions');
                    }
                }
                else{
                    this.getTransactions();
                    this.getDeplacements();
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    mounted() {
        this.getTransactions();
        this.getDeplacements();
    },
    watch :{
        deplacements : function(){
            this.totalToPay = this.deplacements.reduce((acc, deplacement) => deplacement.isPaid ? acc : acc + deplacement.price, 0)
        }
    }
}
</script>

<style scoped></style>
