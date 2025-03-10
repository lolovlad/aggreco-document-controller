import axios from "axios";

class AuthService {
    login(url, email, password) {
        const payload = `grant_type=&username=${email}&password=${password}&client_id=&client_secret=`
        return axios
            .post(url, payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json'
                }
            })
            .then(response => {
                if(response.status === 200) {
                    if (response.data.access_token) {
                        sessionStorage.setItem('user', JSON.stringify(response.data));
                        axios.defaults.headers.common['Authorization'] = `Bearer ` + response.data.access_token
                    }
                    return response;
                }
            })
            .catch(function (e) {
                return e.response.data
            })
    }
    loginYandex(email, password){
        return axios
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
        return axios
            .post('/login/refresh', {refresh_token: refreshToken})
            .then(response => {
                console.log(response.status, "auth.service")
                if(response.status === 200) {
                    if (response.data.access_token) {
                        sessionStorage.setItem('user', JSON.stringify(response.data));
                        axios.defaults.headers.common['Authorization'] = `Bearer ` + response.data.access_token
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
        return axios
            .get(`/login/code_access/${code}`, {params: {token: token}})
            .then(response => {
                if(response.status === 200) {
                    if (response.data.access_token) {
                        sessionStorage.setItem('user', JSON.stringify(response.data));
                        axios.defaults.headers.common['Authorization'] = `Bearer ` + response.data.access_token
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
