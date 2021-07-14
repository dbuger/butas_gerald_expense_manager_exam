import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import {store, key} from './store';


import './index.scss';
import VueAxios from "vue-axios";
import axios from "axios";

axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.state.token;
axios.defaults.baseURL = process.env.VUE_APP_API_HOST;

router.beforeEach((to, from, next) => {
    // console.log(to.path);
    // console.log('main:',from,to)
    if (!store.getters.isAuthenticated && to.path !== '/login') {
        next({path: '/login'})
    } else if (store.getters.isAuthenticated && to.path === '/login') {
        next({ path: '/'})
    } else {
        if(to.meta !== undefined && to.meta.role !== undefined){
            if(!store.getters.getCurrentUser.roles.includes(to.meta.role)){
                next({ path: '/'})
            }
        }

        if(to.meta !== undefined && to.meta.permissions !== undefined){
            const permissions = to.meta.permissions as Array<string>
            const result = store.getters.getCurrentUser.permissions.some((r: string)=> permissions.includes(r));

            if(!result){
                next({ path: '/'})
            }
        }
        next()
    }
})

import { Chart, registerables } from "chart.js";
import {response} from "express";

Chart.register(...registerables);

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

createApp(App)
    .use(store, key)
    .use(VueAxios, axios)
    .use(router)
    .use(VueSweetalert2)
    .mount('#app');
