import { InjectionKey } from 'vue'
import {createStore, useStore as baseUseStore, Store} from 'vuex';

import axios from 'axios';
import {Vue} from "vue-class-component";

export interface State {
    token:string|null,
    user:any
}


export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    state: {
        token:localStorage.getItem('token') || null,
        user:localStorage.getItem('user'),
    },
    getters: {
        getToken(state){
            return state.token
        },
        getCurrentUser(state){
            return state.user !== null ? JSON.parse(state.user) : { id:-1, name:"Unanimous" }
        },
        isAuthenticated(state){
            return state.token !== null
        }
    },
    actions: {
        async authenticate(context, credentials){
            try {
                const response = await axios.post('oauth/token',credentials);
                const token = response.data.access_token
                axios.defaults.headers.common['Authorization']= 'Bearer '+token;

                const user_data = await axios.get('/api/user/get_from_token');
                const user = JSON.stringify(user_data.data);
                context.commit('token',{token:token,user:user})
            } catch (error) {
                throw new Error("Invalid Credentials")
            }
        },
        de_authenticate(){
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
        async hasRole(context,name){
            if(context.getters.isAuthenticated === false)
                return false;
            return context.getters.getCurrentUser.roles.includes(name);
        },
        async hasPermission(context,name){
            if(context.getters.isAuthenticated === false)
                return false;
            return context.getters.getCurrentUser.permissions.includes(name);
        }
    },
    mutations: {
        token(state,data) {
            localStorage.setItem('user',data.user)
            localStorage.setItem('token',data.token)
            return state.token
        }
    }
});

export function useStore () {
    return baseUseStore(key)
}