<template>
  <div class="contenedor-principal">
    <dashbord />
    <div class="historial-movimientos">
      <h1>Historial de Movimientos</h1>

      <table class="tabla">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Acción</th>
            <th>Cantidad</th>
            <th>Fecha y Hora</th>
            <th>TotalCompra</th>
            <th>ControlHistorial</th>
          </tr>
        </thead>
        <tbody>
         <tr v-for="Historial in transacciones" :key="Historial.id">
  <td>{{ Historial.cryptoCode }}</td>
  
  <td>{{ Historial.action === 'purchase' || Historial.action === 'Compra' ? 'Compra' : 'Venta' }}</td>
  
  <td>{{ Historial.cryptoAmount || Historial.cryptoAmount }}</td>
  
  <td>{{ actualizarFecha(Historial.dateTime || Historial.datetime) }}</td>
  
  <td>{{ Historial.money }}</td>

  <td>
    <button @click="detalles(Historial.id)">Ver</button>
    <button @click="editar(Historial)"> Editar </button>
    <button @click="eliminar(Historial.id)">Eliminar</button> 
  </td>
</tr>
        </tbody>
      </table>

      <<div v-if="detalle" class="mostrarInfo">
  <h2>Detalles</h2>
  <p><strong>Criptomoneda:</strong> {{ objetoVer.cryptoCode?.toUpperCase() }} </p>
  <p><strong>Accion:</strong> {{ objetoVer.action === 'purchase' ? 'Compra' : 'Venta' }} </p>
  <p><strong>Cantidad:</strong> {{ objetoVer.cryptoAmount }}</p>
  <p><strong>Fecha y Hora:</strong> {{ actualizarFecha(objetoVer.dateTime) }} </p>
  <p><strong>TotalCompra:</strong> {{ objetoVer.money }} </p>
  <p><strong>Precio:</strong> {{ (objetoVer.money / objetoVer.cryptoAmount) }} </p>
  <button @click="detalle = false">Cerrar Detalles</button>
</div>
      <div v-if="edicion" class="mostrarInfo">
        <h2>Editar</h2>
        <label>Criptomoneda</label>
        <input type="text" v-model="objetoVer.CryptoCode"></input>
        <label>Accion</label>
        <select v-model="objetoVer.Action">
          <option value="purchase">Compra</option>
          <option value="sale">Venta</option>
        </select>
        <label>Cantidad</label>
        <input type="number" step = "any" v-model="objetoVer.CryptoAmount" />
        <label>TotalCompra</label>
        <input type="number" step = "any" v-model="objetoVer.Money" />
        <button @click="confirmar">Confirmar</button>
        <button @click="edicion = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dashbord from '@/components/dashbord.vue'

const transacciones = ref([])
const urlBackend = 'https://localhost:7271/Transaction'
const detalle = ref(false)
const edicion = ref(false)
const objetoVer = ref({ })
const obtenerTodasLasTransacciones = async () => {
  try {
    const respuesta = await fetch(urlBackend)

    if (respuesta.ok) {
      transacciones.value = await respuesta.json()
    } else {
      errorMensaje.value = 'Error al obtener el historial desde el servidor.'
    }
  } catch (error) {
    console.error('Error de conexión:', error) 
  }
}
obtenerTodasLasTransacciones();

const detalles = async (id) => {
  const respuesta = await fetch(`${urlBackend}/${id}`)
  objetoVer.value = await respuesta.json()
  detalle.value = true
  edicion.value = false
}

const editar = (Historial) => {
  objetoVer.value = {...Historial}
  detalle.value = false 
  edicion.value = true
}

const confirmar = async () => {
  await fetch(`${urlBackend}/${objetoVer.value.id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objetoVer.value)
    }
  )
  edicion.value = false
  obtenerTodasLasTransacciones()
  alert('Se confirmaron los cambios correctamente')
}

const eliminar = async (id) => { 
  if (confirm('Deseas eliminar este movimiento?'))
  {
    await fetch(`${urlBackend}/${id}`, {method: 'DELETE'})
    obtenerTodasLasTransacciones();
  }
}

const actualizarFecha = (fecha) => {
  if (!fecha) return ' '
return new Date (fecha).toLocaleString()
}
</script>

<<style scoped>
.contenedor-principal {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 24px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

h1 {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 28px;
}

.historial-movimientos {
  background: #ffffff;
  border-radius: 20px;
  /* Sombra violeta/azulada muy llamativa de fondo */
  box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.05);
  border: 2px solid #e2e8f0;
  overflow: hidden;
  padding: 24px;
}

.tabla {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th {
  /* Cabecera oscura para generar alto impacto visual */
  background-color: #0f172a;
  color: #38bdf8; /* Azul cyan llamativo */
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 20px;
}

/* Redondear las esquinas superiores de la cabecera oscura */
th:first-child { border-top-left-radius: 12px; }
th:last-child { border-top-right-radius: 12px; }

td {
  padding: 18px 20px;
  color: #334155;
  font-size: 15px;
  border-bottom: 1px solid #f1f5f9;
}

tr:hover td {
  /* Resaltado de fila con un tono celeste/azul muy suave */
  background-color: #f0fdf4; 
}

td:nth-child(2) {
  font-weight: 700;
}

/* Botones de control internos (Ver, Editar, Eliminar) */
td button {
  padding: 8px 14px;
  margin-right: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

td button:hover {
  background-color: #6366f1;
  color: #ffffff;
  border-color: #6366f1;
  transform: translateY(-1px);
}

td button:last-child:hover {
  background-color: #ef4444;
  border-color: #ef4444;
  color: #ffffff;
}

/* Caja de detalles y edición */
.mostrarInfo {
  margin-top: 36px;
  padding: 32px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 20px;
  color: #ffffff;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
}

.mostrarInfo h2 {
  font-size: 24px;
  color: #38bdf8;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
  margin-top: 0;
}

.mostrarInfo input, .mostrarInfo select {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.mostrarInfo button {
  margin-top: 24px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: #6366f1;
  color: white;
  transition: all 0.2s ease;
}

.mostrarInfo button:hover {
  background: #4f46e5;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
}
</style>