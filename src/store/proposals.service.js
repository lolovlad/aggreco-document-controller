import axios from "axios";


class ProposalsService {
    getPage(page, perItemPage, idStateClaim, uuidObject){
        const params = {
            page: page,
            per_item_page: perItemPage,
            id_state_claim: idStateClaim,
            uuid_object: uuidObject
        };

        return axios
            .get('/proposals/page', {params: params})
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    addEntity(data){
        return axios
            .post(`/proposals/`, data)
            .then(response => {
                if(response.status === 201)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    getEntity(uuid){
        return axios
            .get(`/proposals/get/${uuid}`)
            .then(response => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                throw e
            })
    }
    updateEntity(uuid, form){
        return  axios
            .put(`/proposals/${uuid}`, form)
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    deleteEntity(uuid){
        return axios
            .delete(`/proposals/${uuid}`, )
            .then((response) => {
                if(response.status === 200){
                    return response
                }
            })
            .catch(function (e){
                throw e
            })
    }
    approveProposal(uuid, comment){
        return axios
            .put(`/proposals/${uuid}/approve`, { comment: comment })
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    rejectProposal(uuid, comment){
        return axios
            .put(`/proposals/${uuid}/reject`, { comment: comment })
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
}
export default new ProposalsService();