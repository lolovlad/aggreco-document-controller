import axios from "axios";
import {auth as $store} from "@/store/auth.model";
import router from "@/router/router";


axios.defaults.baseURL = `http://${import.meta.env.VITE_HOST_SERVER}:${import.meta.env.VITE_PORT_SERVER}/v1/`;
axios.defaults.headers.common.authorization = `Bearer ` + $store.state.token;


axios.interceptors.response.use((response) => {
    return response;
}, async function (error){
    const originalRequest = error.config
    if((error.response.status === 403 || error.response.status === 406) && !originalRequest._retry){
        originalRequest._retry = true;
        const response = await axios.get('/login/refresh', {params: {refresh_token: $store.state.refresh_token}})

        if(response.status === 200){
            sessionStorage.setItem('user', JSON.stringify(response.data))
            axios.defaults.headers.common['Authorization'] = `Bearer ` + response.data.access_token
            originalRequest.headers.authorization = `Bearer ` + response.data.access_token
            return axios(originalRequest)
        }else{
            this.$store.dispatch('auth/logout')
            router.push('/')
        }
    }
    return Promise.reject(error);
})
