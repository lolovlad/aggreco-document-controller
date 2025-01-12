import axios from "axios";

class FileDocumentService{
    saveFile(file){
        return axios
            .post(`/file`, file)
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
            .get('/file/all')
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
            .post(`/file/generate/${uuidClaim}`, dataGenerate)
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
            .get(`/file/metadata/${idBlueprint}`)
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
            .put(`/file/${idBlueprint}`, file)
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