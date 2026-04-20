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
          primary:    '#4CAF50',
          secondary:  '#8B5A2B',
          accent:     '#5C4033',
          success:    '#558b2f',
          warning:    '#e65100',
          error:      '#c62828',
          info:       '#546e7a',
          surface:    '#FFFFFF',
          background: '#F6F8F6',
          'on-primary': '#ffffff',
          'on-surface': '#1B4332',
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
