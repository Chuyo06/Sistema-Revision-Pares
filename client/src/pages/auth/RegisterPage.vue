<template>
  <div style="min-height:100vh; background:#F6F8F6; display:flex; align-items:center; justify-content:center; padding:24px">
    <div style="display:flex; width:100%; max-width:860px; background:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(93,64,55,0.12); border:1px solid #D3E0D7">

      <!-- Panel izquierdo decorativo -->
      <div
        style="flex:1; min-width:0; background:linear-gradient(160deg,#4CAF50 0%,#8B5A2B 100%); padding:48px 40px; display:flex; flex-direction:column; justify-content:center; position:relative; overflow:hidden"
        class="d-none d-md-flex"
      >
        <v-icon size="200" style="position:absolute; right:-40px; bottom:-30px; color:rgba(255,255,255,0.06)">
          mdi-account-plus-outline
        </v-icon>
        <div style="position:relative; z-index:1">
          <div
            style="background:rgba(255,255,255,0.15); border-radius:50%; width:56px; height:56px; display:flex; align-items:center; justify-content:center; margin-bottom:20px"
          >
            <v-icon color="white" size="28">mdi-account-plus-outline</v-icon>
          </div>
          <div style="font-size:24px; font-weight:700; color:#fff; line-height:1.3; margin-bottom:10px">
            Crear cuenta
          </div>
          <div style="font-size:14px; color:rgba(255,255,255,0.75); line-height:1.6">
            Tu cuenta nueva tendrá rol de Autor por defecto. Un editor podrá ampliar tus permisos más tarde.
          </div>
        </div>
      </div>

      <!-- Panel derecho formulario -->
      <div style="width:360px; flex-shrink:0; padding:40px 32px; display:flex; flex-direction:column; justify-content:center">
        <div class="d-flex d-md-none align-center justify-center mb-6">
          <v-icon color="primary" size="32">mdi-book-open-page-variant</v-icon>
          <span style="font-size:17px; font-weight:700; color:#1B4332; margin-left:8px">Rev. por Pares</span>
        </div>

        <div style="font-size:22px; font-weight:700; color:#1B4332; margin-bottom:4px">Registrarse</div>
        <div style="font-size:13px; color:#8B5A2B; margin-bottom:24px">Crea tu cuenta de autor</div>

        <div
          v-if="error"
          style="background:#fce8e8; border:1px solid #f5c6c6; border-radius:8px; padding:10px 14px; margin-bottom:16px; display:flex; align-items:center; gap:8px"
        >
          <v-icon color="error" size="16">mdi-alert-circle-outline</v-icon>
          <span style="font-size:13px; color:#c62828; flex:1">{{ error }}</span>
        </div>

        <div
          v-if="exito"
          style="background:#e8f5e9; border:1px solid #c8e6c9; border-radius:8px; padding:10px 14px; margin-bottom:16px"
        >
          <span style="font-size:13px; color:#2e7d32">Cuenta creada. Redirigiendo a login...</span>
        </div>

        <form @submit.prevent="registrar">
          <div style="margin-bottom:14px">
            <label style="font-size:13px; font-weight:600; color:#4CAF50; display:block; margin-bottom:6px">
              Nombre completo
            </label>
            <v-text-field
              v-model="form.nombre"
              placeholder="Dra. Ana García"
              prepend-inner-icon="mdi-account-outline"
              density="compact"
              hide-details
              required
              :disabled="cargando || exito"
            />
          </div>

          <div style="margin-bottom:14px">
            <label style="font-size:13px; font-weight:600; color:#4CAF50; display:block; margin-bottom:6px">
              Correo electrónico
            </label>
            <v-text-field
              v-model="form.email"
              type="email"
              placeholder="tu@correo.com"
              prepend-inner-icon="mdi-email-outline"
              density="compact"
              hide-details
              required
              :disabled="cargando || exito"
            />
          </div>

          <div style="margin-bottom:14px">
            <label style="font-size:13px; font-weight:600; color:#4CAF50; display:block; margin-bottom:6px">
              Contraseña
            </label>
            <v-text-field
              v-model="form.password"
              :type="mostrarPass ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="mostrarPass ? 'mdi-eye-off' : 'mdi-eye'"
              density="compact"
              hide-details
              required
              :disabled="cargando || exito"
              @click:append-inner="mostrarPass = !mostrarPass"
            />
          </div>

          <div style="margin-bottom:20px">
            <label style="font-size:13px; font-weight:600; color:#4CAF50; display:block; margin-bottom:6px">
              Confirmar contraseña
            </label>
            <v-text-field
              v-model="form.confirmar"
              :type="mostrarPass ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-check-outline"
              density="compact"
              hide-details
              required
              :disabled="cargando || exito"
            />
          </div>

          <v-btn
            type="submit"
            color="primary"
            block
            :loading="cargando"
            :disabled="exito"
            rounded="lg"
            size="large"
            elevation="0"
          >
            Crear cuenta
          </v-btn>
        </form>

        <div style="text-align:center; margin-top:20px; font-size:13px; color:#8B5A2B">
          ¿Ya tienes cuenta?
          <router-link to="/login" style="color:#4CAF50; font-weight:600; text-decoration:none">
            Inicia sesión
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerApi } from '@/services/api/auth.js'

const router = useRouter()

const form = ref({ nombre: '', email: '', password: '', confirmar: '' })
const cargando = ref(false)
const error = ref(null)
const exito = ref(false)
const mostrarPass = ref(false)

async function registrar() {
  error.value = null

  if (form.value.password !== form.value.confirmar) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  if (form.value.password.length < 4) {
    error.value = 'La contraseña debe tener al menos 4 caracteres'
    return
  }

  cargando.value = true
  try {
    await registerApi({
      nombre: form.value.nombre.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
    })
    exito.value = true
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    error.value = e.message || 'Error al crear la cuenta'
  } finally {
    cargando.value = false
  }
}
</script>
