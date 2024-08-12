import AuthService from "@/store/auth.service";

const user = JSON.parse(sessionStorage.getItem('user'))
const initialState = user
    ? { status : { loggedIn: true }, user: user.user, token : user.access_token }
    : { status : { loggedIn: false }, user: null, token : null };

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login( { commit }, payload) {
            return AuthService.login(payload.url, payload.email, payload.password).then(
                response => {
                    if (response.status === 200) {
                        commit('loginSuccess', response);
                    }
                    else {
                        commit('loginFailure');
                    }
                    return response
                }).catch(
                (response)=>{
                    commit('loginFailure');
                    return response
                }
            )
        }
    },
    logout({ commit }) {
        AuthService.logout();
        commit('logout');
    },
    mutations: {
        loginSuccess(state, response) {
            state.status.loggedIn = true;
            state.user = response.data.user;
            state.token = response.data.access_token
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
            state.token = null
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
            state.token = null
        }
    }
}