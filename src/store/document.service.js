import axios from "axios";


class DocumentService{
    getPageDocument(page){
        return axios
            .get('/api/main/v1/document/page_document', {params: {page: page}})
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    addDocument(document){
        return axios
            .post('/api/main/v1/document', document)
            .then(response => {
                if(response.status === 201)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    getDocumentByUuid(uuid){
        return axios
            .get(`/api/main/v1/document/get_document/${uuid}`)
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    updateDocument(document){
        return axios
            .put('/api/main/v1/document', document)
            .then((response) => {
                if(response.status === 205)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    deleteDocument(uuid){
        return axios
            .delete(`/api/main/v1/document/${uuid}`)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    getUrlDocument(uuid){
        return axios
            .get(`/api/main/v1/document/get_url/${uuid}`)
            .then((response) => {
                if(response.status === 200){
                    return response.data.message
                }
            })
            .catch(function (e){
                throw e
            })
    }
    getViewUsersDocument(uuid){
        return axios
            .get(`/api/main/v1/document/get_user_in_document/${uuid}`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch((response) => {
                throw response
            })
    }
}

export default new DocumentService();