import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import vuetify from './plugins/vuetify.js'
import { registerSW } from './sw/register.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')

// Registrar Service Worker para PWA (solo en producción o si está disponible)
registerSW().catch(err => {
  console.warn('[App] Service Worker no disponible:', err.message)
})
