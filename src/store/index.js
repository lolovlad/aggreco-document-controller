import {createStore} from 'vuex'
import {auth} from "@/store/auth.model"


const store = createStore(({
    modules:{
        auth,
    }
}))

export default store;