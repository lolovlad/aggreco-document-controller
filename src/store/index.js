import {createStore} from 'vuex'
import {auth} from "@/store/auth.model"
import {page} from "@/store/page.model"
import {notification} from "@/store/models/notification.model";


const store = createStore(({
    modules:{
        auth,
        page,
        notification
    }
}))

export default store;