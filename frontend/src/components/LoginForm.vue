<template>
  <div class="login-form p-8 w-2/3">
    <h1 class="title text-3xl mb-6 text-center">Connexion</h1>
    <form>
      <div class="field mb-4">
        <label class="label text-lg mb-2">Email</label>
        <div class="control">
          <input class="input border p-2 rounded w-full" type="email" placeholder="Entrez votre email">
        </div>
      </div>
      <div class="field mb-4">
        <label class="label text-lg mb-2">Mot de passe</label>
        <div class="control">
          <input class="input border p-2 rounded w-full" type="password" placeholder="Entrez votre mot de passe">
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button bg-blue-500 text-white p-2 rounded">Connexion</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
}
</script>

<style scoped>
</style>
