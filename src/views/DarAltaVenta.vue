<template>
  <div class="contenedor-principal">
    <dashbord />
    <div class="formulario">
      <h1>Nueva Venta</h1>
      <form class="formulario-venta" @submit.prevent="procesarFormulario">
        
    
        <label for="criptomoneda">Criptomoneda Vendida:</label>
        <select id="criptomoneda" v-model="monedaSeleccionada" required>
          <option value="" disabled>Selecciona una criptomoneda</option>
          <option value="btc">Bitcoin</option>
          <option value="eth">Ethereum</option>
          <option value="usdt">USDT</option>
          <option value="sol">Solana</option>
        </select>
        <label for="cantidad">Cantidad:</label>
        <input type="number" id="cantidad" v-model="montoCantidad" step="any" min="0" required />
        <label for="cliente">Cliente Asignado:</label>
        <select id="cliente" v-model="clienteSeleccionado" required>
          <option value="" disabled>Selecciona un cliente</option>
          <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
            {{ cliente.name }}
          </option>
        </select>
        <label for="fechayhora">Fecha y Hora:</label>
        <input type="datetime-local" id="fechayhora" v-model="fechaTransaccion" required />

        <div class="registrar-venta">
          <button type="submit">Registrar Venta</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dashbord from '@/components/dashbord.vue'

// Estados reactivos
const monedaSeleccionada = ref('')
const montoCantidad = ref(0)
const fechaTransaccion = ref('')
const clienteSeleccionado = ref('') 
const clientes = ref([])

const procesarFormulario = async () => {
  if (!monedaSeleccionada.value || !clienteSeleccionado.value||montoCantidad.value <= 0){

alert('Por favor, complete todos los campos obligatorios.')
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
    Action: 'sale', 
    CryptoAmount: montoCantidad.value,
    ClientId: clienteSeleccionado.value, 
    DateTime: fechaTransaccion.value,
  }
    const endpoint = 'https://localhost:7271/Transaction'
    
    const respuesta = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaTransaccion),
    })

    if (respuesta.ok) {
      const resultado = await respuesta.json()
      alert(`¡Venta registrada con éxito! El sistema calculó el total: $${resultado.moneyAmount || resultado.money}`)
    
      monedaSeleccionada.value = ''
      montoCantidad.value = 0
      fechaTransaccion.value = ''
      clienteSeleccionado.value = ''
    } else {
      const errorData = await respuesta.text()
      alert(`Error del servidor: ${errorData}`)
    }
 
  } catch (error) {

    console.error('Detalle del error:', error)
  }
  
}
const cargarClientes = async () => {
    try{
        const response = await fetch('https://localhost:7271/Clientes')
        if (response.ok){
            clientes.value = await response.json()
        }
    } catch (error){
        console.error('No se pudo cargar el cliente', error)
    }
  }
  cargarClientes();

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
  color: #94a3b8; 
}

input, select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 15px;
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.05); 
  box-sizing: border-box;
  transition: all 0.25s ease;
}

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

.formulario-venta button[type="submit"] {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  box-shadow: 0 4px 15px rgba(234, 88, 12, 0.4);
}
.formulario-venta button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(234, 88, 12, 0.6);
}

.formulario-compra button[type="submit"] {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}
.formulario-compra button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
}

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