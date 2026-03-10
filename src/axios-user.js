import axios from "axios";
import router from "@/router/router";

// Отдельный axios instance для микросервиса пользователей
const userAxios = axios.create({
    baseURL: `${import.meta.env.VITE_TYPE_HTTP_PROTOCOL}://${import.meta.env.VITE_HOST_SERVER}:${import.meta.env.VITE_PORT_SERVER}/api/users/v1/`,
});

// Функция для синхронизации токена между instances
export const syncToken = (token) => {
    userAxios.defaults.headers.common['Authorization'] = `Bearer ` + token;
    axios.defaults.headers.common['Authorization'] = `Bearer ` + token;
};

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

// Устанавливаем начальный токен авторизации из sessionStorage
const initialToken = getTokenFromStorage();
if (initialToken) {
    syncToken(initialToken);
}

// Interceptor для обновления токена при 403/406 ошибках
userAxios.interceptors.response.use((response) => {
    return response;
}, async function (error){
    const originalRequest = error.config
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
                return userAxios(originalRequest)
            }else{
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

export default userAxios;
