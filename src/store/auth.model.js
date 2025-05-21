import AuthService from "@/store/auth.service";

const user = JSON.parse(sessionStorage.getItem('user'))
const initialState = user
    ? { status : { loggedIn: true }, user: user.user, token : user.access_token, refresh_token: user.refresh_token }
    : { status : { loggedIn: false }, user: null, token : null, refresh_token : null };

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login( { commit }, payload) {
            return AuthService.resolveCodeYandex(payload.code, payload.token).then(
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
        },
        refreshToken({commit}, payload) {
            return AuthService.refresh(payload.refresh_token).then(
                response => {
                    if (response.status === 200) {
                        commit('loginSuccess', response);
                    }
                    else {
                        commit('loginFailure');
                    }
                }
            )
        },
        saveUser({commit}, payload) {
            commit('setUser', payload.user)
        },
        logout({ commit }) {
            AuthService.logout();
            commit('logout');
        },
    },
    mutations: {
        setUser(state, user){
            state.user = user;
        },
        loginSuccess(state, response) {
            state.status.loggedIn = true
            state.user = response.data.user
            state.token = response.data.access_token
            state.refresh_token = response.data.refresh_token
        },
        loginFailure(state) {
            state.status.loggedIn = false
            state.user = null
            state.token = null
            state.refresh_token = null
        },
        logout(state) {
            state.status.loggedIn = false
            state.user = null
            state.token = null
            state.refresh_token = null
        }
    }
}