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

<style scoped>
.contenedor-principal {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #333;
}

h1 {
  text-align: left;
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
}

/* Contenedor de la tabla para darle bordes redondeados suaves y sombra ligera */
.historial-movimientos {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
  border: 1px solid #eef2f5;
  overflow: hidden;
  padding: 20px;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  background-color: #f8fafc;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px;
  border-bottom: 2px solid #edf2f7;
}

td {
  padding: 16px;
  color: #334155;
  font-size: 15px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

/* Efecto sutil al pasar el mouse por la fila */
tr:hover td {
  background-color: #f8fafc;
}

/* Estilo para las acciones (Compra / Venta) tipo Badge */
td:nth-child(2) {
  font-weight: 600;
  color: #059669; /* Verde moderno para compras */
}

/* Botones de acción estilizados en línea */
td button {
  padding: 6px 12px;
  margin-right: 6px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #ffffff;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

td button:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
  color: #1e293b;
}

/* Estilo destructivo específico para el botón Eliminar */
td button:last-child:hover {
  background-color: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}

/* Estilos para las tarjetas flotantes de Detalle y Edición */
.mostrarInfo {
  margin-top: 30px;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.mostrarInfo h2 {
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 16px;
  color: #1e293b;
}

.mostrarInfo p {
  margin: 10px 0;
  font-size: 14px;
}

.mostrarInfo label {
  display: block;
  font-weight: 600;
  margin-top: 12px;
  margin-bottom: 4px;
  font-size: 13px;
  color: #475569;
}

.mostrarInfo input, .mostrarInfo select {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.mostrarInfo button {
  margin-top: 16px;
  margin-right: 8px;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
</style>