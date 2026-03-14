import axios from "axios";

class FileDocumentService{
    saveFile(file){
        return axios
            .post(`/api/main/v1/file`, file)
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    getListFiles(){
        return axios
            .get('/api/main/v1/file/all')
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                throw e
            })
    }
    generateDocument(uuidClaim, dataGenerate){
        return axios
            .post(`/api/main/v1/file/generate/${uuidClaim}`, dataGenerate)
            .then((response) => {
                if(response.status === 201)
                    return response.data
            })
            .catch(function (e){
                throw e
            })
    }
    getFile(idBlueprint){
        return axios
            .get(`/api/main/v1/file/metadata/${idBlueprint}`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                throw e
            })
    }
    updateFile(idBlueprint, file){
        return axios
            .put(`/api/main/v1/file/${idBlueprint}`, file)
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
}

export default new FileDocumentService();