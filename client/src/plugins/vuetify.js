import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'papelAntiguo',
    themes: {
      papelAntiguo: {
        colors: {
          primary:    '#5d4037',
          secondary:  '#8d6e63',
          accent:     '#795548',
          success:    '#558b2f',
          warning:    '#e65100',
          error:      '#c62828',
          info:       '#546e7a',
          surface:    '#fdfbf5',
          background: '#f5f0e8',
          'on-primary': '#ffffff',
          'on-surface': '#3e2723',
        }
      }
    }
  },
  defaults: {
    VBtn:      { rounded: 'lg' },
    VCard:     { rounded: 'lg', elevation: 1 },
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VSelect:    { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VTextarea:  { variant: 'outlined', density: 'comfortable', color: 'primary' },
  }
})
