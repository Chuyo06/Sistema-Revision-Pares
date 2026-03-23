<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4">
          <v-card-title class="text-center">Sistema de Revisión por Pares</v-card-title>
          <v-card-subtitle class="text-center mb-2">Ingrese sus credenciales</v-card-subtitle>

          <v-card-text>
            <v-alert v-if="auth.error" type="error" class="mb-4" closable @click:close="auth.error = null">
              {{ auth.error }}
            </v-alert>

            <v-form @submit.prevent="iniciarSesion">
              <v-text-field
                v-model="email"
                label="Correo electrónico"
                type="email"
                required
                :disabled="auth.cargando"
                class="mb-2"
              />
              <v-text-field
                v-model="password"
                label="Contraseña"
                :type="mostrarPass ? 'text' : 'password'"
                required
                :disabled="auth.cargando"
                class="mb-4"
              />
              <v-btn type="submit" color="primary" block :loading="auth.cargando">
                Iniciar sesión
              </v-btn>
            </v-form>
          </v-card-text>

          <v-divider />

          <v-card-text>
            <p class="text-caption text-center mb-2">Accesos demo</p>
            <v-row dense>
              <v-col v-for="demo in usuariosDemo" :key="demo.email" cols="6">
                <v-btn variant="outlined" block size="small" @click="loginRapido(demo)" :disabled="auth.cargando">
                  {{ demo.rol }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const mostrarPass = ref(false)

const usuariosDemo = [
  { email: 'autor@demo.com', password: '1234', rol: 'Autor' },
  { email: 'revisor@demo.com', password: '1234', rol: 'Revisor' },
  { email: 'editor@demo.com', password: '1234', rol: 'Editor' },
  { email: 'admin@demo.com', password: '1234', rol: 'Admin' },
]

async function iniciarSesion() {
  try {
    const usuario = await auth.login(email.value, password.value)
    router.push(`/${usuario.rol}/dashboard`)
  } catch {}
}

function loginRapido(demo) {
  email.value = demo.email
  password.value = demo.password
  iniciarSesion()
}
</script>
