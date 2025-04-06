import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'uno.css'

const app = createApp(App)

app.use(createPinia())
app.use(createHead())

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

app.mount('#app')
