import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1e40af',
          secondary: '#3b82f6',
          accent: '#6366f1',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#0ea5e9',
          surface: '#ffffff',
          background: '#f8fafc',
          'on-primary': '#ffffff',
        }
      },
      dark: {
        colors: {
          primary: '#3b82f6',
          secondary: '#6366f1',
          accent: '#818cf8',
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#38bdf8',
          surface: '#1e293b',
          background: '#0f172a',
        }
      }
    }
  },
  defaults: {
    VBtn: { rounded: 'lg' },
    VCard: { rounded: 'xl' },
    VTextField: { variant: 'outlined', density: 'comfortable' },
    VSelect: { variant: 'outlined', density: 'comfortable' },
    VTextarea: { variant: 'outlined', density: 'comfortable' },
  }
})
