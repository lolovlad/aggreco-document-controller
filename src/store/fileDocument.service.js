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
}

export default new FileDocumentService();