import axios from "axios";
import moment from 'moment-timezone';


class ClaimService{
    getPageClaim(page, perItemPage, idStateClaim, uuidObject, dateFrom = null, dateTo = null){
        const params = {
            page: page,
            per_item_page: perItemPage,
            id_state_claim: idStateClaim,
            uuid_object: uuidObject
        };
        
        if (dateFrom) {
            params.date_from = moment(dateFrom).format('YYYY-MM-DD');
        }
        if (dateTo) {
            params.date_to = moment(dateTo).format('YYYY-MM-DD');
        }
        
        return axios
            .get('/claim/page', {params: params})
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    addClaim(claim){
        const timezone = moment().format("Z");
        return axios
            .post('/claim', claim, {
                headers: {
                    "X-Timezone": timezone,
                }
            })
            .then(response => {
                if(response.status === 201){
                    return response
                }
            })
            .catch(function (e){
                throw e
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
                throw e
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