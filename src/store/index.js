import {createStore} from 'vuex'
import {auth} from "@/store/auth.model"
import {page} from "@/store/page.model"


const store = createStore(({
    modules:{
        auth,
        page
    }
}))

export default store;