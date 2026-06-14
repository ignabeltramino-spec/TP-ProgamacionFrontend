<template>
  <div class="contenedor-principal">
    <dashbord />
    <div class="formulario">
      <h1>Nueva Compra</h1>
      <form class="formulario-compra" @submit.prevent="procesarFormulario">
        <label for="criptomoneda">Criptomoneda:</label>
        <select id="criptomoneda" v-model="monedaSeleccionada" required>
          <option value="" disabled>Selecciona una criptomoneda</option>
          <option value="btc">Bitcoin</option>
          <option value="eth">Ethereum</option>
          <option value="usdt">USDT</option>
          <option value="sol">Solana</option>
        </select>

        <label for="cantidad">Cantidad:</label>
        <input type="number" id="cantidad" v-model="montoCantidad" step="any" min="0" required />

        <label for="fechayhora">Fecha y Hora:</label>
        <input type="datetime-local" id="fechayhora" v-model="fechaTransaccion" required />

        <div class="registrar-compra">
          <button type="submit">Registrar Compra</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dashbord from '@/components/dashbord.vue'


const monedaSeleccionada = ref('')
const montoCantidad = ref(0)
const fechaTransaccion = ref('')

const registrarCompraEnServidor = async (datos) => {
  const endpoint = 'https://localhost:7271/Transaction'
  
  const respuesta = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

  if (!respuesta.ok) {
    throw new Error('Error en el servidor')
  }

  return await respuesta.json()
}

const procesarFormulario = async () => {
  
  if (!monedaSeleccionada.value || !fechaTransaccion.value) {
    alert('Por favor, complete todos los campos obligatorios.')
    return
  }

  if (montoCantidad.value <= 0) {
    alert('La cantidad ingresada debe ser mayor a cero.')
    return
  }

  const momentoElegido = new Date(fechaTransaccion.value)
  const momentoActual = new Date()
  if (momentoElegido > momentoActual) {
    alert('No es posible registrar una transacción con fecha futura.')
    return
  }

  try {
    const nuevaTransaccion = {
      CryptoCode: monedaSeleccionada.value,
      Action: 'purchase',
      CryptoAmount: montoCantidad.value,
      DateTime: fechaTransaccion.value,
    }

    const resultado = await registrarCompraEnServidor(nuevaTransaccion)
    
    alert(`Compra registrada con exito en la base de datos. Total gastado: $${resultado.money}`)
    
    monedaSeleccionada.value = ''
    montoCantidad.value = 0
    fechaTransaccion.value = ''

  } catch (error) {
    alert('Error al guardar en el servidor. Revisa la consola.')
    console.error('Detalle del error:', error)
  }
}
</script>

<style scoped>
.contenedor-principal {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #333;
}

/* Centramos el bloque del formulario y le damos el mismo estilo de tarjeta que al historial */
.formulario {
  max-width: 500px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
  border: 1px solid #eef2f5;
  padding: 32px;
}

h1 {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: 0;
  margin-bottom: 24px;
}

.formulario-compra {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Separación interna constante entre campos */
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
  color: #475569;
}

/* Estilizamos los inputs y el select para que se vean sofisticados y no ocupen toda la pantalla infinita */
input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  color: #334155;
  background-color: #ffffff;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

/* Efecto azul sutil cuando el usuario hace clic para escribir */
input:focus, select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Contenedor del botón para alinearlo y darle espacio */
.registrar-compra {
  margin-top: 10px;
}

/* Botón principal llamativo, moderno y con esquinas suaves */
button {
  width: 100%;
  padding: 14px;
  background-color: #2563eb; /* Azul moderno */
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

button:hover {
  background-color: #1d4ed8; /* Azul un toque más oscuro al pasar el mouse */
}

button:active {
  transform: scale(0.98); /* Efecto sutil de hundimiento al clickear */
}
</style>