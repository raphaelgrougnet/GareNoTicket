<template>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th scope="col" class="px-6 py-3">Date</th>
                    <th scope="col" class="px-6 py-3">Prix</th>
                    <th scope="col" class="px-6 py-3">Payé</th>
                </tr>
            </thead>
            <tbody v-for="(deplacement, index) in deplacements" :key="index">
                <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    
                >
                    <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                        {{ new Date(deplacement.createdAt).toLocaleString() }}
                    </th>
                    <td class="px-6 py-4">{{ deplacement.price }}$</td>
                    <td class="px-6 py-4 text-green-500" v-if="deplacement.isPaid">Oui</td>
                    <td class="px-6 py-4 text-red-500" v-else>Non</td>
                </tr>
                
            </tbody>
        </table>
    </div>
</template>

<script>

export default {
    name: 'TableauDeplacements',
    data() {
        return {}
    },
    props: ['deplacements']

}
</script>

<style scoped></style>
