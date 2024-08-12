import axios from "axios";


class DocumentService{
    getPageDocument(page){
        return axios
            .get('/document/page_document', {params: {page: page}})
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
            .post('/document', document)
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
            .get(`/document/get_document/${uuid}`)
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
            .put('/document', document)
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
            .delete(`/document/${uuid}`)
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
            .get(`/document/get_url/${uuid}`)
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
            .get(`/document/get_user_in_document/${uuid}`)
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