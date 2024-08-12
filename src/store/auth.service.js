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
                if (response.data.access_token) {
                    sessionStorage.setItem('user', JSON.stringify(response.data));
                    axios.defaults.headers.common['Authorization'] = `Bearer ` + response.data.access_token
                }
                return response;
            })
            .catch(function (e) {
                return e;
            })
    }

    logout() {
        sessionStorage.removeItem('user');
    }
}

export default new AuthService();
