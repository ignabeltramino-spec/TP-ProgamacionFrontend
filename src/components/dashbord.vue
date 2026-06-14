<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink> | 
        <RouterLink to="/">About</RouterLink> | 
        <RouterLink to="/compras">Registrar Compra</RouterLink> | 
        <RouterLink to="/historial">Historial de Movimientos</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  padding: 20px;
  background-color: #f0f0f0;
  margin-bottom: 20px;
}

nav {
  width: 100%;
  font-size: 16px;
  text-align: center;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

nav a.router-link-exact-active {
  color: #007bff;
}

nav a:first-of-type {
  border: 0;
}
</style>