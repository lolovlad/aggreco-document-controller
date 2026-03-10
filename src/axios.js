import axios from "axios";
import router from "@/router/router";

// Функция для получения токена из sessionStorage (избегаем циклической зависимости)
const getTokenFromStorage = () => {
    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user?.access_token || null;
    } catch {
        return null;
    }
};

const getRefreshTokenFromStorage = () => {
    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user?.refresh_token || null;
    } catch {
        return null;
    }
};

axios.defaults.baseURL = `${import.meta.env.VITE_TYPE_HTTP_PROTOCOL}://${import.meta.env.VITE_HOST_SERVER}:${import.meta.env.VITE_PORT_SERVER}/api/main/v1/`;
const initialToken = getTokenFromStorage();
if (initialToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ` + initialToken;
}


// Импортируем userAxios и syncToken для обновления токена через микросервис пользователей
import userAxios, {syncToken} from "@/axios-user";

axios.interceptors.response.use((response) => {
    return response;
}, async function (error){
    const originalRequest = error.config
    // Пропускаем запросы к микросервису пользователей - они обрабатываются в axios-user.js
    if (originalRequest.url.includes('/api/users/')) {
        return Promise.reject(error);
    }
    if (originalRequest.url.includes('/login/refresh')) {
        // Используем динамический импорт для избежания циклической зависимости
        import('@/store').then(storeModule => {
            storeModule.default.dispatch('auth/logout');
        });
        router.push('/');
        return Promise.reject(error);
    }
    if((error.response?.status === 403 || error.response?.status === 406) && !originalRequest._retry){
        originalRequest._retry = true;
        try {
            // Используем userAxios для обновления токена через микросервис пользователей
            const refreshToken = getRefreshTokenFromStorage();
            if (!refreshToken) {
                router.push('/');
                return Promise.reject(error);
            }
            const response = await userAxios.get('/login/refresh', {params: {refresh_token: refreshToken}})
            console.log(response, "response")
            if(response.status === 200){
                sessionStorage.setItem('user', JSON.stringify(response.data))
                syncToken(response.data.access_token)
                originalRequest.headers['Authorization'] = `Bearer ` + response.data.access_token
                return axios(originalRequest)
            }else{
                // Используем динамический импорт для избежания циклической зависимости
                import('@/store').then(storeModule => {
                    storeModule.default.dispatch('auth/logout');
                });
                router.push('/')
            }
        }catch (e){
            import('@/store').then(storeModule => {
                storeModule.default.dispatch('auth/logout');
            });
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
        // Используем динамический импорт для избежания циклической зависимости
        import('@/store').then(storeModule => {
            storeModule.default.dispatch('notification/notify', {
                message,
                color: 'success'
            });
        });
    }
    return response;
}, function (error) {
    const status = error.response?.status;
    // Используем динамический импорт для избежания циклической зависимости
    import('@/store').then(storeModule => {
        const store = storeModule.default;
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
    });
    return Promise.reject(error);
})
