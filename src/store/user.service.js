import axios from "axios";

class UserService {
    getPageUser(page, perItemPage, typeUser=""){
        return axios
            .get('/user/page_user', {params: {page: page, type_user: typeUser, per_item_page: perItemPage}})
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    importFile(form){
        return axios
            .post('/user/import_file/csv', form)
            .then(response => {
                if(response.status === 201)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    searchUsers(search, count=5){
        return axios
            .get('/user/search', {
                params: {
                    search_field: search,
                    count: count
                }
            })
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    getUserByUuid(uuid){
        return axios
            .get(`/user/get_one/${uuid}`)
            .then((response) => {
                if(response.status === 200){
                    return response.data
                }
            })
            .catch(function (e){
                return e
            })
    }
    addUser(user){
        return axios
            .post("/user", user)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    updateUser(uuid, user){
        return axios
            .put(`/user/${uuid}`, user)
            .then((response) => {
                if(response.status === 205)
                    return response
            })
            .catch(function (e){
                return e
            })
    }
    getProfile(){
        return axios
            .get(`/user/get/profile`)
            .then(
                (response) => {
                    if(response.status === 200)
                        return response.data
                }
            )
            .catch(function (e){
                throw e
            })
    }
    saveSignature(form){
        return axios
            .post('/user/file/signature', form)
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    getSignature(){
        return axios
            .get('user/file/signature')
            .then(response => {
                if(response.status === 200)
                    return response.data

            })
            .catch(function (e){
                throw e
            })
    }
    deleteUser(uuidUser){
        return axios
            .delete(`/user/${uuidUser}`)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                return e
            })
    }
    updateProfileUser(uuid, user){
        return axios
            .put(`/user/profile/update/${uuid}`, user)
            .then((response) => {
                if(response.status === 205)
                    return response
            })
            .catch(function (e){
                return e
            })
    }
}

export default new UserService();