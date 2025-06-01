import axios from "axios";
import router from "@/router/router";
import {auth as $store} from "@/store/auth.model";
import store from '@/store'


axios.defaults.baseURL = `${import.meta.env.VITE_TYPE_HTTP_PROTOCOL}://${import.meta.env.VITE_HOST_SERVER}:${import.meta.env.VITE_PORT_SERVER}/v1/`;
axios.defaults.headers.common.authorization = `Bearer ` + $store.state.token;


axios.interceptors.response.use((response) => {
    return response;
}, async function (error){
    const originalRequest = error.config
    if (originalRequest.url.includes('/login/refresh')) {
        store.dispatch('auth/logout');
        router.push('/');
        return Promise.reject(error);
    }
    if((error.response.status === 403 || error.response.status === 406) && !originalRequest._retry){
        originalRequest._retry = true;
        try {
            const response = await axios.get('/login/refresh', {params: {refresh_token: $store.state.refresh_token}})
            console.log(response, "response")
            if(response.status === 200){
                sessionStorage.setItem('user', JSON.stringify(response.data))
                axios.defaults.headers.common['Authorization'] = `Bearer ` + response.data.access_token
                originalRequest.headers.authorization = `Bearer ` + response.data.access_token
                return axios(originalRequest)
            }else{
                store.dispatch('auth/logout');
                router.push('/')
            }
        }catch (e){
            store.dispatch('auth/logout');
            router.push('/');
            return Promise.reject(e);
        }
    }
    return Promise.reject(error);
})


axios.interceptors.response.use((response) => {
    const method = response.config.method?.toUpperCase();
    const message = response.data?.message
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
        //let message = '';
        //switch (method) {
        //    case 'POST':
        //        message = 'Запись успешно добавлена.';
        //        break;
        //    case 'PUT':
        //        message = 'Изменения успешно сохранены.';
        //        break;
        //    case 'DELETE':
        //        message = 'Запись успешно удалена.';
        //        break;
        //}
        store.dispatch('notification/notify', {
            message,
            color: 'success'
        });
    }
    return response;
}, function (error) {
    const status = error.response?.status;
    if (status === 500) {
        store.dispatch('notification/notify', {
            message: 'Ошибка сервера (500). Пожалуйста, попробуйте позже.',
            color: 'error'
        });
    } else if (status === 404) {
        store.dispatch('notification/notify', {
            message: 'Ресурс не найден (404).',
            color: 'warning'
        });
    } else if (status === 401) {
        store.dispatch('notification/notify', {
            message: 'Вы не авторизованы (401).',
            color: 'info'
        });
    } else {
        store.dispatch('notification/notify', {
            message: `Неизвестная ошибка. код ошибки (${status})`,
            color: 'error'
        });
    }
    return Promise.reject(error);
})
