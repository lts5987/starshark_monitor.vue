import "@fortawesome/fontawesome-free/css/all.min.css"
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import { createApp } from 'vue'
import VueAxios from "vue-axios"
import App from './App.vue'
import StarSharks from "./assets/js/starsharks"
import router from './router'
import store from './store'

let check = localStorage.getItem('allowBaseApi')
if (check == undefined) localStorage.setItem('allowBaseApi', true)

let app = createApp(App)
app.use(store)
app.use(router)
app.use(VueAxios, axios)
app.config.globalProperties.StarSharks = new StarSharks
app.mount('#app')


