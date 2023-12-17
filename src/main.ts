import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupRouter } from './router'
import { setupPlugins } from './plugins'

const app = createApp(App)
setupPlugins(app)
setupRouter(app)
app.mount('#app')