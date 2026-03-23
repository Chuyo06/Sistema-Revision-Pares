<template>
  <div>
    <v-row class="mb-4" align="center">
      <v-col>
        <h2 class="text-h6">Gestión de usuarios</h2>
      </v-col>
      <v-col cols="12" sm="auto">
        <v-text-field
          v-model="busqueda"
          placeholder="Buscar usuario..."
          density="compact"
          hide-details
          style="min-width: 200px"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="dialogoNuevo = true">Nuevo usuario</v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-4" align="center">
      <v-col cols="auto"><span class="text-body-2 mr-2">Filtrar por rol:</span></v-col>
      <v-col cols="12" sm="4">
        <v-select
          v-model="filtroRol"
          :items="['TODOS', 'autor', 'revisor', 'editor', 'administrador']"
          density="compact"
          hide-details
        />
      </v-col>
    </v-row>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="usuariosFiltrados"
        :search="busqueda"
        :items-per-page="8"
      >
        <template #item.acciones="{ item }">
          <v-btn
            size="small"
            variant="text"
            :color="item.estado === 'activo' ? 'error' : 'success'"
            @click="adminStore.toggleEstadoUsuario(item.id)"
          >
            {{ item.estado === 'activo' ? 'Desactivar' : 'Activar' }}
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogoNuevo" max-width="500">
      <v-card>
        <v-card-title>Nuevo usuario</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="valido" @submit.prevent="crearUsuario">
            <v-text-field v-model="nuevoUsuario.nombre" label="Nombre completo *" :rules="[r => !!r || 'Requerido']" class="mb-2" />
            <v-text-field v-model="nuevoUsuario.email" label="Email *" type="email" :rules="[r => !!r || 'Requerido']" class="mb-2" />
            <v-select
              v-model="nuevoUsuario.rol"
              :items="['autor', 'revisor', 'editor', 'administrador']"
              label="Rol *"
              :rules="[r => !!r || 'Requerido']"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialogoNuevo = false">Cancelar</v-btn>
          <v-btn color="primary" :disabled="!valido" @click="crearUsuario">Crear</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" timeout="3000">{{ mensajeSnackbar }}</v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/store/administrador/index.js'

const adminStore = useAdminStore()
const busqueda = ref('')
const filtroRol = ref('TODOS')
const dialogoNuevo = ref(false)
const valido = ref(false)
const snackbar = ref(false)
const mensajeSnackbar = ref('')

const nuevoUsuario = ref({ nombre: '', email: '', rol: '' })

const usuariosFiltrados = computed(() =>
  adminStore.usuarios.filter(u =>
    (filtroRol.value === 'TODOS' || u.rol === filtroRol.value) &&
    (u.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
     u.email.toLowerCase().includes(busqueda.value.toLowerCase()))
  )
)

const headers = [
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Rol', key: 'rol', sortable: true },
  { title: 'Registro', key: 'fechaRegistro', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: '', key: 'acciones', sortable: false, align: 'end' },
]

function crearUsuario() {
  adminStore.agregarUsuario({ ...nuevoUsuario.value })
  dialogoNuevo.value = false
  nuevoUsuario.value = { nombre: '', email: '', rol: '' }
  mensajeSnackbar.value = 'Usuario creado correctamente'
  snackbar.value = true
}
</script>
