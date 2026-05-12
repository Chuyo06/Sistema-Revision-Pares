<template>
  <v-container class="pa-4 pa-md-8 mx-auto" style="max-width: 800px">
    
    <!-- Título de la vista -->
    <div class="mb-8">
      <h1 style="font-size: 28px; font-weight: 800; color: #1B4332; letter-spacing: -0.5px;">Mi Perfil</h1>
      <p style="color: #8B5A2B; font-size: 15px; margin-top: 4px;">Asistente de configuración de cuenta y credenciales</p>
    </div>

    <!-- Tarjeta Principal de Información -->
    <v-card class="mb-6 profile-card" elevation="0" rounded="xl" style="border: 1px solid #D3E0D7; background: #FFFFFF;">
      <v-card-text class="d-flex flex-column flex-md-row align-center pa-8 gap-6" style="gap: 24px;">
        
        <!-- Avatar Rico en Diseño -->
        <div class="avatar-container position-relative">
          <input type="file" ref="fileInput" accept="image/*" class="d-none" @change="onFileSelected" />
          <div 
            class="avatar-gradient d-flex align-center justify-center elevation-3 cursor-pointer overflow-hidden position-relative"
            @click="triggerFileInput"
            :style="avatarImage ? `background: url(${avatarImage}) center/cover no-repeat;` : ''"
          >
            <span v-if="!avatarImage" style="font-size: 38px; font-weight: 700; color: white;">
              {{ (auth.usuario?.nombre?.substring(0,2)?.toUpperCase() || 'US') }}
            </span>
            
            <!-- Overlay Hover para cambiar foto -->
            <div class="avatar-overlay d-flex flex-column align-center justify-center">
              <v-icon color="white" size="24">mdi-camera-plus</v-icon>
              <span style="font-size: 10px; color: white; font-weight: bold; margin-top: 4px;">Cambiar</span>
            </div>
          </div>
          
          <!-- Indicador de guardando simulado -->
          <v-progress-circular v-if="isUploadingPhoto" indeterminate color="white" class="upload-spinner"></v-progress-circular>
        </div>

        <div class="flex-grow-1 text-center text-md-left">
          <h2 style="font-size: 24px; font-weight: 700; color: #1B4332; line-height: 1.2;">
            {{ auth.usuario?.nombre || 'Usuario Demo' }}
          </h2>
          <p style="font-size: 14px; color: #5C4033; font-weight: 500; margin-bottom: 12px; margin-top: 4px;">
             {{ auth.usuario?.email || 'email@desconocido.com' }}
          </p>
          
          <!-- Chips de Roles -->
          <div class="d-flex flex-wrap gap-2 justify-center justify-md-start">
            <v-chip
              v-for="rolReq in auth.roles"
              :key="rolReq"
              :color="getRolColor(rolReq)"
              :variant="rolReq.toLowerCase() === auth.rol.toLowerCase() ? 'flat' : 'outlined'"
              size="small"
              class="font-weight-bold px-3 py-1 text-uppercase"
              style="letter-spacing: 0.5px; border-width: 1.5px;"
            >
              {{ ROL_META[rolReq.toLowerCase()]?.label || rolReq }}
            </v-chip>
          </div>
        </div>

      </v-card-text>
    </v-card>

    <!-- Tarjeta de Seguridad (Cambio de contraseña) -->
    <v-card class="security-card" elevation="0" rounded="xl" style="border: 1px solid #D3E0D7; background: #ffffff;">
      <v-card-title class="px-8 pt-6 pb-2" style="font-size: 18px; font-weight: 700; color: #1B4332;">
        <v-icon color="#8B5A2B" class="mr-2 mb-1" size="22">mdi-shield-lock-outline</v-icon>
        Seguridad de la Cuenta
      </v-card-title>
      <v-card-text class="px-8 pb-8 pt-4">
        <p style="font-size: 14px; color: #8B5A2B; margin-bottom: 24px;">
          Asegúrate de utilizar una contraseña segura de al menos 8 caracteres.
        </p>
        
        <v-form ref="form" v-model="formValid" @submit.prevent="cambiarPassword">
          <v-text-field
            v-model="passwords.actual"
            label="Contraseña Actual"
            variant="outlined"
            type="password"
            bg-color="#FFFFFF"
            density="compact"
            class="mb-2 custom-input"
            hide-details="auto"
          ></v-text-field>

          <v-text-field
            v-model="passwords.nueva"
            label="Nueva Contraseña"
            variant="outlined"
            type="password"
            bg-color="#FFFFFF"
            density="compact"
            class="mb-2 custom-input"
            hide-details="auto"
          ></v-text-field>

          <v-text-field
            v-model="passwords.confirmar"
            label="Confirmar Nueva Contraseña"
            variant="outlined"
            type="password"
            bg-color="#FFFFFF"
            density="compact"
            class="mb-6 custom-input"
            :rules="[v => !!v || 'Confirma tu contraseña', v => v === passwords.nueva || 'Las contraseñas no coinciden']"
            hide-details="auto"
          ></v-text-field>

          <div class="d-flex justify-end">
            <v-btn
              type="submit"
              color="#4CAF50"
              rounded="pill"
              class="px-8 text-none font-weight-bold elevation-2"
              height="44"
              :loading="isSubmitting"
              :disabled="!isFormSubmittable"
            >
              Actualizar contraseña
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Tarjeta de Especialidades (Sólo Revisor) -->
    <v-card v-if="auth.roles.includes('revisor')" class="security-card mt-6" elevation="0" rounded="xl" style="border: 1px solid #D3E0D7; background: #ffffff;">
      <v-card-title class="px-8 pt-6 pb-2" style="font-size: 18px; font-weight: 700; color: #1B4332;">
        <v-icon color="#558b2f" class="mr-2 mb-1" size="22">mdi-school-outline</v-icon>
        Especialidades y Áreas Temáticas
      </v-card-title>
      <v-card-text class="px-8 pb-8 pt-4">
        <p style="font-size: 14px; color: #8B5A2B; margin-bottom: 24px;">
          Completa tus áreas de experiencia, palabras clave y un breve resumen de tu trayectoria para ayudar al sistema de asignación inteligente a recomendarte manuscritos relevantes.
        </p>
        
        <v-form @submit.prevent="guardarPerfilEspecialidad">
          <v-text-field
            v-model="perfilProfesional.especialidad"
            label="Área principal de especialidad"
            variant="outlined"
            density="compact"
            class="mb-4 custom-input"
            hide-details="auto"
          ></v-text-field>

          <v-combobox
            v-model="perfilProfesional.palabrasClave"
            label="Palabras clave de tus temas de interés"
            hint="Escribe y presiona Enter para añadir una palabra clave"
            persistent-hint
            multiple
            chips
            closable-chips
            variant="outlined"
            density="comfortable"
            class="mb-4 custom-input"
          ></v-combobox>

          <v-textarea
            v-model="perfilProfesional.experiencia"
            label="Breve experiencia profesional"
            variant="outlined"
            density="compact"
            rows="3"
            class="mb-6 custom-input"
            hide-details="auto"
          ></v-textarea>

          <div class="d-flex justify-end">
            <v-btn
              type="submit"
              color="#558b2f"
              rounded="pill"
              class="px-8 text-none font-weight-bold elevation-2"
              height="44"
              :loading="isSubmittingPerfil"
            >
              Guardar Perfil
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Notificación -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="bottom right">
      <span class="font-weight-medium"> {{ snackbar.text }} </span>
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { updateAvatarApi, cambiarPasswordApi } from '@/services/api/auth.js'

const auth = useAuthStore()

const formValid = ref(false)
const isSubmitting = ref(false)
const isSubmittingPerfil = ref(false)

const palabrasClaveArray = auth.usuario?.palabras_clave 
  ? auth.usuario.palabras_clave.split(',').map(s => s.trim()).filter(Boolean)
  : []

const perfilProfesional = ref({
  especialidad: auth.usuario?.especialidad || '',
  palabrasClave: palabrasClaveArray,
  experiencia: auth.usuario?.experiencia || ''
})

async function guardarPerfilEspecialidad() {
  isSubmittingPerfil.value = true
  try {
    const datosParaGuardar = {
      especialidad: perfilProfesional.value.especialidad,
      palabras_clave: perfilProfesional.value.palabrasClave.join(', '),
      experiencia: perfilProfesional.value.experiencia
    }
    await auth.guardarPerfilBackend(datosParaGuardar)
    // El backend hoy solo persiste `especialidad`. `palabras_clave` y `experiencia`
    // se conservan localmente en la sesión del usuario hasta que el backend los
    // soporte (evita perderlos al recargar la página).
    auth.actualizarPerfil({
      especialidad: datosParaGuardar.especialidad,
      palabras_clave: datosParaGuardar.palabras_clave,
      experiencia: datosParaGuardar.experiencia,
    })
    snackbar.value = {
      show: true,
      text: 'Perfil de especialidad actualizado exitosamente.',
      color: 'success'
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      text: 'Error al actualizar el perfil',
      color: 'error'
    }
  } finally {
    isSubmittingPerfil.value = false
  }
}

const fileInput = ref(null)
const avatarImage = ref(auth.usuario?.avatar?.length > 10 ? auth.usuario.avatar : null)
const isUploadingPhoto = ref(false)

const passwords = ref({
  actual: '',
  nueva: '',
  confirmar: ''
})

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const ROL_META = {
  autor:         { label:'Autor',         color:'#546e7a' },
  revisor:       { label:'Revisor',       color:'#558b2f' },
  editor:        { label:'Editor',        color:'#e65100' },
  administrador: { label:'Administrador', color:'#c62828' },
}

function getRolColor(rol) {
  return ROL_META[rol.toLowerCase()]?.color || '#8B5A2B'
}

const isFormSubmittable = computed(() => {
  return passwords.value.actual.length > 0 && 
         passwords.value.nueva.length >= 4 && 
         passwords.value.nueva === passwords.value.confirmar
})

async function cambiarPassword() {
  if (!isFormSubmittable.value) return

  isSubmitting.value = true
  
  try {
    await cambiarPasswordApi(auth.usuario.id, passwords.value.actual, passwords.value.nueva)
    snackbar.value = {
      show: true,
      text: '¡Contraseña actualizada con éxito! Ya puedes iniciar sesión con la nueva.',
      color: 'success'
    }
    passwords.value = { actual: '', nueva: '', confirmar: '' }
  } catch (error) {
    snackbar.value = {
      show: true,
      text: error.message || 'Error al cambiar la contraseña',
      color: 'error'
    }
  } finally {
    isSubmitting.value = false
  }
}

function triggerFileInput() {
  fileInput.value.click()
}

function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  // Iniciar animación de subida
  isUploadingPhoto.value = true
  
  // Leer la imagen para enviarla al backend
  const reader = new FileReader()
  reader.onload = async (e) => {
    const base64Str = e.target.result;
    
    try {
      if (auth.usuario?.id) {
        // Enviar al Backend y guardar permanente
        await updateAvatarApi(auth.usuario.id, base64Str);
      }
      
      // Guardado exitosamente en DB, actualizar localmente UI
      auth.actualizarPerfil({ avatar: base64Str });
      avatarImage.value = base64Str;
      
      snackbar.value = { 
        show: true, 
        text: '¡Foto guardada permanentemente con éxito!', 
        color: 'success' 
      }
    } catch (error) {
      console.error(error);
      snackbar.value = { 
        show: true, 
        text: 'Error de conexión con el backend', 
        color: 'error' 
      }
    } finally {
      isUploadingPhoto.value = false;
    }
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.avatar-container {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.avatar-gradient {
  width: 100px; 
  height: 100px; 
  border-radius: 50%;
  background: linear-gradient(135deg, #5C4033 0%, #F4A261 100%);
  box-shadow: 0 4px 15px rgba(121, 85, 72, 0.3) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.avatar-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  transition: opacity 0.25s ease;
  border-radius: 50%;
}

.avatar-gradient:hover .avatar-overlay {
  opacity: 1;
}

.upload-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.profile-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.05) !important;
}

.custom-input {
  border-radius: 8px;
}

.custom-input :deep(.v-field) {
  border-radius: 12px;
}
</style>
