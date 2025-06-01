export const notification = {
    namespaced: true,
    state: {
        show: false,
        message: '',
        color: 'error',
        timeout: 4000,
    },
    actions: {
        notify({ commit }, payload) {
            commit('SHOW_NOTIFICATION', payload);
        },
        hide({ commit }) {
            commit('HIDE_NOTIFICATION');
        }
    },
    mutations: {
        SHOW_NOTIFICATION(state, { message, color = 'error', timeout = 1500 }) {
            state.message = message;
            state.color = color;
            state.timeout = timeout;
            state.show = true;
        },
        HIDE_NOTIFICATION(state) {
            state.show = false;
        }
    },
    getters: {
        notification: state => state,
    }
}