import axios from "axios";
import {auth as $store} from "@/store/auth.model";
import router from "@/router/router";


axios.defaults.baseURL = `http://${process.env.VUE_APP_HOST_SERVER}:${process.env.VUE_APP_PORT_SERVER}/v1/`;
axios.defaults.headers.common.authorization = `Bearer ` + $store.state.token;


axios.interceptors.response.use((response) => {
    return response;
}, async function (error){
    const originalRequest = error.config
    if(error.response.status === 403 && !originalRequest._retry){
        originalRequest._retry = true;
        const response = await axios.get('/login/refresh', {params: {refresh_token: $store.state.refresh_token}})

        if(response.status === 200){
            sessionStorage.setItem('user', JSON.stringify(response.data))
            axios.defaults.headers.common['Authorization'] = `Bearer ` + response.data.access_token
            originalRequest.headers.authorization = `Bearer ` + response.data.access_token
            return axios(originalRequest)
        }else{
            await router.push('/')
        }

    }
    return Promise.reject(error);
})
