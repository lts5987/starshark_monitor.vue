import "bootstrap/dist/css/bootstrap.css"
import { createApp } from 'vue'
import App from './App.vue'

let app = createApp(App)
app.use(store)
app.use(router)
app.use(VueAxios, axios)
app.config.globalProperties.StarShark = new StarShark
app.mount('#app')

import "bootstrap/dist/js/bootstrap.js"
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from "vue-axios"
import StarShark from "./assets/js/starshark"
