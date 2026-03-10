import userAxios from "@/axios-user";

class UserService {
    getPageUser(page, perItemPage, typeUser=""){
        return userAxios
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
        return userAxios
            .post('/user/import_file/csv', form)
            .then(response => {
                if(response.status === 201)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    searchUsers(search){
        return userAxios
            .get('/user/search', {
                params: {
                    search_field: search,
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
        return userAxios
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
        return userAxios
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
        return userAxios
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
        return userAxios
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
        return userAxios
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
        return userAxios
            .get('/user/file/signature')
            .then(response => {
                if(response.status === 200)
                    return response.data

            })
            .catch(function (e){
                throw e
            })
    }
    deleteUser(uuidUser){
        return userAxios
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
        return userAxios
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