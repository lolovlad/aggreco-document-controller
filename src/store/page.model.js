const initialState = { pageNow : null, perItemPage: null, nameTable: null }


export const page = {
    namespaced: true,
    state: initialState,
    actions: {
        saveState({commit}, payload) {
            commit('setPage', payload.page);
            commit('setPerItemPage', payload.perItemPage);
            commit('setNameTable', payload.name);
        },
        dropState({ commit },) {
            commit('setNameTable', null);
            commit('setPerItemPage', null);
            commit('setNameTable', null);
        }
    },
    mutations: {
        setPage(state, page) {
            state.pageNow = page
        },
        setPerItemPage(state, perItemPage) {
            state.perItemPage = perItemPage
        },
        setNameTable(state, nameTable) {
            state.nameTable = nameTable
        }
    }
}