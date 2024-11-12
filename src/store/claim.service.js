import axios from "axios";

class ClaimService{
    getStateClaim(){
        return axios
            .get('/claim/state_claim')
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }
    getPageClaim(page){
        return axios
            .get('/claim/page', {params: {page: page}})
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                return e
            })
    }
    addClaim(claim){
        return axios
            .post('/claim', claim)
            .then(response => {
                if(response.status === 201){
                    return response
                }
            })
            .catch(function (e){
                    return e
                })
    }
    getClaims(uuid){
        return axios
            .get(`/claim/get/${uuid}`)
            .then(response => {
                if(response.status === 200){
                    return response.data
                }
            })
            .catch(function (e){
                return e
            })
    }
    saveFile(uuid, typeFile, file){
        return axios
            .post(`/claim/file/${typeFile}/${uuid}`, file)
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    deleteClaim(uuid){
        return axios
            .delete(`/claim/${uuid}`)
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    updateStateClaim(uuid, stateClaim){
        return axios
            .put(`/claim/update/state/${uuid}/${stateClaim}`)
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    updateClaim(uuid, claim){
        return  axios
            .put(`/claim/${uuid}`, claim)
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
}

export default new ClaimService();