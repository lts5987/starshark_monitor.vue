import "bootstrap/dist/css/bootstrap.css"
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(store).use(router).use(VueAxios, axios).mount('#app')

import "bootstrap/dist/js/bootstrap.js"
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from "vue-axios"