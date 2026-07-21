<template>
    <div class="contenedor-principal">
    <dashbord />
    
  <div class="alta-cliente-container">
    <h2>Dar de Alta Nuevo Cliente</h2>
    
    <!-- El navegador se encarga de validar (required y type="email") antes de ejecutar guardarCliente -->
    <form @submit.prevent="guardarCliente">
      
      <!-- Campo Nombre -->
      <div class="form-group">
        <label for="Name">Nombre y Apellido:</label>
        <input 
          type="text" 
          id="Name" 
          v-model="Name" 
          placeholder="Ej. Juan Pérez"
          required 
        />
      </div>

      <!-- Campo Email -->
      <div class="form-group">
        <label for="Email">Correo Electrónico:</label>
        <input 
          type="email" 
          id="Email" 
          v-model="Email" 
          placeholder="Ej. juan@correo.com"
          required 
        />
      </div>

      <!-- Botón de Envío -->
      <button type="submit">Registrar Cliente</button>
    </form>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import dashbord from '@/components/dashbord.vue'

// Variables reactivas para capturar los datos del formulario
const Name = ref('');
const Email = ref('');

// Función que se ejecuta al presionar el botón si todo está correcto
const guardarCliente = async () => {
  try{
  // Armamos el objeto con las propiedades EXACTAS que espera tu clase Cliente en C# (Name y Email)
  const nuevoCliente = {
    Name: Name.value,
    Email: Email.value   
  };
  
      // CAMBIA EL PUERTO (ej: 7173, 5001, etc.) por el puerto real donde corre tu backend de C#
    const URL_API = 'https://localhost:7271/Clientes' 

    const response = await fetch(URL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoCliente) // Convertimos el objeto JS a un texto JSON
    })
    // Si la respuesta del backend es exitosa (código 200)
    if (response.ok) {
      const resultado = await response.json();
      alert(`¡Cliente registrado con éxito en la base de datos!\nID asignado: ${resultado.id}`);
      
      // Limpiamos los campos del formulario
      Name.value = '';
      Email.value = '';
    } else {
      // Si el backend nos rechazó (ej. mandamos algo mal o vacío)
      const errorTexto = await response.text();
      alert(`Error del servidor: ${errorTexto}`);
    }

  } catch (error) {
    // Si la API de C# está apagada o hay problemas de red
    console.error('Error de conexión:', error);
    alert('No se pudo conectar con el servidor backend. ¿Está corriendo la API en Visual Studio?');
  }
};
</script>

<style scoped>
.contenedor-principal {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 24px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.formulario, .alta-cliente-container {
  max-width: 480px;
  margin: 40px auto;
  /* Fondo llamativo en degradé oscuro/violáceo */
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 50px rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.2);
  padding: 40px;
  color: #f8fafc;
}

h1, h2 {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  /* Texto brillante con degradado */
  background: linear-gradient(to right, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 0;
  margin-bottom: 32px;
  letter-spacing: -0.5px;
}

.formulario-venta, .formulario-compra, form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
  color: #94a3b8; /* Gris claro para que resalte en el fondo oscuro */
}

input, select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 15px;
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.05); /* Input semi-transparente */
  box-sizing: border-box;
  transition: all 0.25s ease;
}

/* Estilo para las opciones del select (para que no queden blancas u ocultas) */
select option {
  background-color: #0f172a;
  color: #ffffff;
}

input:focus, select:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
}

.registrar-venta, .registrar-compra {
  margin-top: 8px;
}

button[type="submit"] {
  width: 100%;
  padding: 16px;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

/* Botón VENTA (Naranja Neón) */
.formulario-venta button[type="submit"] {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  box-shadow: 0 4px 15px rgba(234, 88, 12, 0.4);
}
.formulario-venta button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(234, 88, 12, 0.6);
}

/* Botón COMPRA (Azul Eléctrico) */
.formulario-compra button[type="submit"] {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}
.formulario-compra button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
}

/* Botón ALTA CLIENTE (Verde Esmeralda Brillante) */
.alta-cliente-container button[type="submit"] {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4);
}
.alta-cliente-container button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(5, 150, 105, 0.6);
}

button:active {
  transform: scale(0.98);
}
</style>