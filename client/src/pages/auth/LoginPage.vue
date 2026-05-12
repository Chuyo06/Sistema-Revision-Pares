<template>
  <!-- Fondo crema con patrón sutil -->
  <div style="min-height:100vh; background:#F6F8F6; display:flex; align-items:center; justify-content:center; padding:24px">

    <!-- Layout de dos columnas (Classroom style) â€” colapsa en mobile -->
    <div style="display:flex; width:100%; max-width:860px; background:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(93,64,55,0.12); border:1px solid #D3E0D7">

      <!-- Panel izquierdo (decorativo, como banner de Classroom) -->
      <div
        style="flex:1; min-width:0; background:linear-gradient(160deg,#4CAF50 0%,#8B5A2B 100%); padding:48px 40px; display:flex; flex-direction:column; justify-content:center; position:relative; overflow:hidden"
        class="d-none d-md-flex"
      >
        <v-icon size="200" style="position:absolute; right:-40px; bottom:-30px; color:rgba(255,255,255,0.06)">
          mdi-book-open-page-variant
        </v-icon>
        <div style="position:relative; z-index:1">
          <div
            style="background:rgba(255,255,255,0.15); border-radius:50%; width:56px; height:56px; display:flex; align-items:center; justify-content:center; margin-bottom:20px"
          >
            <v-icon color="white" size="28">mdi-book-open-page-variant</v-icon>
          </div>
          <div style="font-size:24px; font-weight:700; color:#fff; line-height:1.3; margin-bottom:10px">
            Sistema de Revisión por Pares
          </div>
          <div style="font-size:14px; color:rgba(255,255,255,0.75); line-height:1.6">
            Plataforma académica para la gestión de congresos y revistas científicas.
          </div>

          <!-- Roles como badges -->
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:28px">
            <span
              v-for="r in ['Autor', 'Revisor', 'Editor', 'Admin']"
              :key="r"
              style="background:rgba(255,255,255,0.15); color:rgba(255,255,255,0.9); padding:4px 12px; border-radius:20px; font-size:12px; font-weight:500"
            >{{ r }}</span>
          </div>
        </div>
      </div>

      <!-- Panel derecho (formulario) -->
      <div style="width:360px; flex-shrink:0; padding:40px 32px; display:flex; flex-direction:column; justify-content:center">

        <!-- Logo mobile -->
        <div class="d-flex d-md-none align-center justify-center mb-6">
          <v-icon color="primary" size="32">mdi-book-open-page-variant</v-icon>
          <span style="font-size:17px; font-weight:700; color:#1B4332; margin-left:8px">Rev. por Pares</span>
        </div>

        <div v-if="!modoRegistro">
          <div style="font-size:22px; font-weight:700; color:#1B4332; margin-bottom:4px">Iniciar sesión</div>
          <div style="font-size:13px; color:#8B5A2B; margin-bottom:24px">Ingresa tus credenciales</div>
        </div>
        <div v-else>
          <div style="font-size:22px; font-weight:700; color:#1B4332; margin-bottom:4px">Regístrate</div>
          <div style="font-size:13px; color:#8B5A2B; margin-bottom:24px">Crea una cuenta nueva en la plataforma</div>
        </div>

        <!-- Mensaje de Éxito -->
        <div
          v-if="auth.mensajeExito"
          style="background:#e8fce8; border:1px solid #c6f5c6; border-radius:8px; padding:10px 14px; margin-bottom:16px; display:flex; align-items:center; gap:8px"
        >
          <v-icon color="success" size="16">mdi-check-circle-outline</v-icon>
          <span style="font-size:13px; color:#2e7d32; flex:1">{{ auth.mensajeExito }}</span>
          <v-btn icon variant="text" size="x-small" @click="auth.mensajeExito = null">
            <v-icon size="14">mdi-close</v-icon>
          </v-btn>
        </div>

        <!-- Error -->
        <div
          v-if="auth.error"
          style="background:#fce8e8; border:1px solid #f5c6c6; border-radius:8px; padding:10px 14px; margin-bottom:16px; display:flex; align-items:center; gap:8px"
        >
          <v-icon color="error" size="16">mdi-alert-circle-outline</v-icon>
          <span style="font-size:13px; color:#c62828; flex:1">{{ auth.error }}</span>
          <v-btn icon variant="text" size="x-small" @click="auth.error = null">
            <v-icon size="14">mdi-close</v-icon>
          </v-btn>
        </div>

        <!-- Formulario Iniciar Sesión -->
        <form v-if="!modoRegistro" @submit.prevent="iniciarSesion">
          <div style="margin-bottom:14px">
            <label style="font-size:13px; font-weight:600; color:#4CAF50; display:block; margin-bottom:6px">
              Correo electrónico
            </label>
            <v-text-field
              v-model="email"
              type="email"
              placeholder="tu@correo.com"
              prepend-inner-icon="mdi-email-outline"
              density="compact"
              hide-details
              required
              :disabled="auth.cargando"
            />
          </div>

          <div style="margin-bottom:20px">
            <label style="font-size:13px; font-weight:600; color:#4CAF50; display:block; margin-bottom:6px">
              Contraseña
            </label>
            <v-text-field
              v-model="password"
              :type="mostrarPass ? 'text' : 'password'"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="mostrarPass ? 'mdi-eye-off' : 'mdi-eye'"
              density="compact"
              hide-details
              required
              :disabled="auth.cargando"
              @click:append-inner="mostrarPass = !mostrarPass"
            />
          </div>

          <v-btn
            type="submit"
            color="primary"
            block
            :loading="auth.cargando"
            rounded="lg"
            size="large"
            elevation="0"
            class="mb-3"
          >
            Entrar
          </v-btn>
          <div style="text-align:center; font-size:13px">
            ¿No tienes cuenta? <a href="#" @click.prevent="cambiarModo" style="color:#4CAF50; font-weight:600">Regístrate</a>
          </div>
        </form>

        <!-- Formulario Registro -->
        <form v-else @submit.prevent="registrarUsuario">
          <div style="margin-bottom:14px">
            <label style="font-size:13px; font-weight:600; color:#4CAF50; display:block; margin-bottom:6px">Nombre completo</label>
            <v-text-field v-model="reg.nombre" placeholder="Tu nombre" prepend-inner-icon="mdi-account-outline" density="compact" hide-details required :disabled="auth.cargando" />
          </div>
          <div style="margin-bottom:14px">
            <label style="font-size:13px; font-weight:600; color:#4CAF50; display:block; margin-bottom:6px">Correo electrónico</label>
            <v-text-field v-model="reg.email" type="email" placeholder="tu@correo.com" prepend-inner-icon="mdi-email-outline" density="compact" hide-details required :disabled="auth.cargando" />
          </div>
          <div style="margin-bottom:14px">
            <label style="font-size:13px; font-weight:600; color:#4CAF50; display:block; margin-bottom:6px">Contraseña</label>
            <v-text-field v-model="reg.password" type="password" placeholder="••••••••" prepend-inner-icon="mdi-lock-outline" density="compact" hide-details required :disabled="auth.cargando" />
          </div>
          <div style="margin-bottom:14px">
            <label style="font-size:13px; font-weight:600; color:#4CAF50; display:block; margin-bottom:6px">Rol deseado</label>
            <v-select v-model="reg.rol" :items="['AUTOR', 'REVISOR']" prepend-inner-icon="mdi-account-tag-outline" density="compact" hide-details required :disabled="auth.cargando" />
          </div>

          <!-- Campos extras de Revisor -->
          <div v-if="reg.rol === 'REVISOR'" style="background:#F6F8F6; padding:12px; border-radius:8px; margin-bottom:14px; border:1px dashed #D3E0D7;">
            <div style="font-size:12px; font-weight:bold; color:#1B4332; margin-bottom:10px">Datos del Revisor</div>
            <div style="margin-bottom:10px">
              <v-text-field v-model="reg.especialidad" label="Área de especialidad" density="compact" hide-details required :disabled="auth.cargando" />
            </div>
            <div style="margin-bottom:10px">
              <v-text-field v-model="reg.palabras_clave" label="Palabras clave (separadas por coma)" density="compact" hide-details required :disabled="auth.cargando" />
            </div>
            <div style="margin-bottom:10px">
              <v-textarea v-model="reg.experiencia" label="Breve experiencia" rows="2" density="compact" hide-details required :disabled="auth.cargando" />
            </div>
          </div>

          <v-btn type="submit" color="primary" block :loading="auth.cargando" rounded="lg" size="large" elevation="0" class="mb-3">
            Crear cuenta
          </v-btn>
          <div style="text-align:center; font-size:13px">
            ¿Ya tienes cuenta? <a href="#" @click.prevent="cambiarModo" style="color:#4CAF50; font-weight:600">Inicia sesión</a>
          </div>
        </form>

        <div v-if="!modoRegistro">
          <!-- Divisor -->
          <div style="display:flex; align-items:center; gap:10px; margin:20px 0">
            <div style="flex:1; height:1px; background:#D3E0D7" />
            <span style="font-size:12px; color:#bda89a">Accesos demo</span>
            <div style="flex:1; height:1px; background:#D3E0D7" />
          </div>

          <!-- Botones demo 2x2 -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px">
            <button
              v-for="demo in usuariosDemo"
              :key="demo.email"
              type="button"
              :disabled="auth.cargando"
              @click="loginRapido(demo)"
              style="border:1px solid #d7ccc8; background:#FFFFFF; border-radius:8px; padding:8px 10px; cursor:pointer; display:flex; align-items:center; gap:8px; transition:background 0.15s"
              @mouseenter="e => e.currentTarget.style.background='#f0e9df'"
              @mouseleave="e => e.currentTarget.style.background='#FFFFFF'"
            >
              <v-icon :color="demo.color" size="16">{{ demo.icon }}</v-icon>
              <span style="font-size:13px; font-weight:500; color:#1B4332">{{ demo.rol }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

const auth = useAuthStore()
const router = useRouter()

const modoRegistro = ref(false)

const email = ref('')
const password = ref('')
const mostrarPass = ref(false)

const reg = reactive({
  nombre: '',
  email: '',
  password: '',
  rol: 'AUTOR',
  especialidad: '',
  palabras_clave: '',
  experiencia: ''
})

const usuariosDemo = [
  { email:'autor@demo.com',           password:'1234', rol:'Autor',          icon:'mdi-account-edit-outline',    color:'#546e7a' },
  { email:'revisor@demo.com',         password:'1234', rol:'Revisor',        icon:'mdi-clipboard-check-outline', color:'#558b2f' },
  { email:'editor@demo.com',          password:'1234', rol:'Editor Jefe',    icon:'mdi-account-tie',             color:'#bf360c' },
  { email:'editor.seccion@demo.com',  password:'1234', rol:'Editor Sección', icon:'mdi-account-tie-outline',     color:'#ef6c00' },
  { email:'admin@demo.com',           password:'1234', rol:'Admin',          icon:'mdi-shield-account-outline',  color:'#7b1fa2' },
]

function cambiarModo() {
  modoRegistro.value = !modoRegistro.value
  auth.error = null
  auth.mensajeExito = null
}

async function iniciarSesion() {
  try {
    const usuario = await auth.login(email.value, password.value)
    router.push(`/${usuario.rolActivo}/dashboard`)
  } catch (err) {
    auth.error = err.message || 'Error al iniciar sesión'
  }
}

async function registrarUsuario() {
  try {
    const response = await auth.register(reg)
    auth.mensajeExito = response.message || 'Usuario registrado exitosamente.'
    // Limpiar form
    Object.keys(reg).forEach(k => reg[k] = k === 'rol' ? 'AUTOR' : '')
    modoRegistro.value = false
  } catch (err) {
    auth.error = err.message || 'Error al registrar usuario'
  }
}

function loginRapido(demo) {
  email.value = demo.email
  password.value = demo.password
  iniciarSesion()
}
</script>
