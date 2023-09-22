import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@/assets/styles/common.scss';
import * as L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import 'leaflet-draw/dist/leaflet.draw.css';
import 'element-plus/es/components/table-column/style/css';
import '@/assets/iconfont/iconfont.css'; // icon-font 字体
import './assets/iconfont/iconfont.js';
import router from './router'
import App from './App.vue'
import Directives from "@/directive/index"
import '@/utils/rem.js'


const app = createApp(App)

app.use(Directives)
app.use(createPinia());
app.use(router);
app.config.globalProperties.$L = L
app.mount('#app')

