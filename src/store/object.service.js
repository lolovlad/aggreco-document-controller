import axios from "axios";


class ObjectService{
    getPageObject(page){
        return axios
            .get('/object/page', {params: {page: page}})
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch((response) => {
                throw response
            })
    }
    deleteObject(uuid){
        return axios
            .delete(`/object/${uuid}`)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                return e
            })
    }
    getStateObject(){
        return axios
            .get(`/object/state_object`)
            .then((response)=> {
                if (response.status === 200)
                    return response.data
                })
    }
    getObjectByUuid(uuid){
        return axios
            .get(`/object/one/${uuid}`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                throw e
            })
    }
    addObject(obj){
        return axios
            .post("/object", obj)
            .then((response) => {
                if(response.status === 201)
                    return response.data.message
            })
            .catch(function (e){
                throw e
            })
    }
    updateObject(obj, uuid){
        return axios
            .put(`/object/${uuid}`, obj)
            .then((response) => {
                if(response.status === 200)
                    return response.data.message
            })
            .catch(function (e){
                throw e
            })
    }
    getEquipmentPage(uuidObject, page){
        return axios
            .get(`/object/${uuidObject}/equipment/page`, {params: {page: page}})
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch((response) => {
                throw response
            })
    }
    deleteEquipment(uuid){
        return axios
            .delete(`/object/equipment/${uuid}`, )
            .then((response) => {
                if(response.status === 200){
                    return response
                }
            })
            .catch(function (e){
                throw e
            })
    }
    getTypeEquipment(){
        return axios
            .get(`/object/equipment/type_equip`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
    }
    getEquipmentByUuid(uuid){
        return axios
            .get(`/object/equipment/${uuid}`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                throw e
            })
    }
    addEquipment(uuidObject, obj){
        return axios
            .post(`/object/${uuidObject}/equipment/`, obj)
            .then((response) => {
                if(response.status === 201)
                    return response.data.message
            })
            .catch(function (e){
                throw e.data.message
            })
    }
    updateEquipment(uuidEquipment, equip){
        return axios
            .put(`/object/equipment/${uuidEquipment}`, equip)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e.data.message
            })
    }

    getListObject(){
        return axios
            .get('/object/list')
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch((response) => {
                throw response
            })
    }

}

export default new ObjectService();
