import userAxios, {syncToken} from "@/axios-user";

class AuthService {
    login(url, email, password) {
        // Используем правильный эндпоинт для микросервиса пользователей
        const endpoint = url && url.startsWith('/login/') ? url : '/login/sign-in';
        const payload = `grant_type=&username=${email}&password=${password}&client_id=&client_secret=`
        return userAxios
            .post(endpoint, payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json'
                }
            })
            .then(response => {
                if(response.status === 200) {
                    if (response.data.access_token) {
                        sessionStorage.setItem('user', JSON.stringify(response.data));
                        syncToken(response.data.access_token);
                    }
                    return response;
                }
            })
            .catch(function (e) {
                return e.response.data
            })
    }
    loginYandex(email, password){
        return userAxios
            .post('/login/sign-in/yandex', {
                "email": email,
                "password": password
            })
            .then(response => {
                if(response.status === 200) {
                   return response.data
                }
            })
            .catch(function (e) {
                throw e
            })
    }
    refresh(refreshToken) {
        return userAxios
            .get('/login/refresh', {params: {refresh_token: refreshToken}})
            .then(response => {
                console.log(response.status, "auth.service")
                if(response.status === 200) {
                    if (response.data.access_token) {
                        sessionStorage.setItem('user', JSON.stringify(response.data));
                        syncToken(response.data.access_token);
                    }
                    return response;
                }
            })
            .catch(function (e) {
                return e.response.data
            })
    }
    logout() {
        sessionStorage.removeItem('user');
    }
    resolveCodeYandex(code, token){
        return userAxios
            .get(`/login/code_access/${code}`, {params: {token: token}})
            .then(response => {
                if(response.status === 200) {
                    if (response.data.access_token) {
                        sessionStorage.setItem('user', JSON.stringify(response.data));
                        syncToken(response.data.access_token);
                    }
                    return response
                }
            })
            .catch(function (e) {
                return e.response.data
            })
    }
}

export default new AuthService();
