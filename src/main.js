import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
//or import App from './App.vue'
import router from './router'

//Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify/lib/framework.mjs'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives
})
const app = createApp(App).use(vuetify)

app.use(router)

app.mount('#app')
