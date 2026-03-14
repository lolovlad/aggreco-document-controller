import axios from "axios";


class ObjectService{
    getPageObject(page, perItemPage){
        return axios
            .get('/api/object_equipment/v1/object/page', {params: {page: page, per_item_page: perItemPage}})
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
            .delete(`/api/object_equipment/v1/object/${uuid}`)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                return e
            })
    }
    getObjectByUuid(uuid){
        return axios
            .get(`/api/object_equipment/v1/object/one/${uuid}`)
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
            .post("/api/object_equipment/v1/object", obj)
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
            .put(`/api/object_equipment/v1/object/${uuid}`, obj)
            .then((response) => {
                if(response.status === 200)
                    return response.data.message
            })
            .catch(function (e){
                throw e
            })
    }
    getEquipmentPage(uuidObject, page, perItemPage){
        return axios
            .get(`/api/object_equipment/v1/object/${uuidObject}/equipment/page`, {params: {page: page, per_item_page: perItemPage}})
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
            .delete(`/api/object_equipment/v1/object/equipment/${uuid}`, )
            .then((response) => {
                if(response.status === 200){
                    return response
                }
            })
            .catch(function (e){
                throw e
            })
    }
    getEquipmentByUuid(uuid){
        return axios
            .get(`/api/object_equipment/v1/object/equipment/${uuid}`)
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
            .post(`/api/object_equipment/v1/object/${uuidObject}/equipment`, obj)
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
            .put(`/api/object_equipment/v1/object/equipment/${uuidEquipment}`, equip)
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
            .get('/api/object_equipment/v1/object/list')
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch((response) => {
                throw response
            })
    }
    searchEquipmentInObject(uuid, search){
        return axios
            .get(`/api/object_equipment/v1/object/${uuid}/equipment/search`, {params: {search_field: search}})
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                throw e
            })
    }
    getObjectByUser(){
        return axios
            .get(`/api/object_equipment/v1/object/get_object_to_user`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                throw e
            })
    }

    getObjectSettings(uuid){
        return axios
            .get(`/api/object_equipment/v1/object/${uuid}/settings`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                throw e
            })
    }

    createObjectSettings(uuid, formData){
        return axios
            .post(`/api/object_equipment/v1/object/${uuid}/settings`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                if(response.status === 201)
                    return response.data
            })
            .catch(function (e){
                throw e
            })
    }

    updateObjectSettings(uuid, data){
        return axios
            .put(`/api/object_equipment/v1/object/${uuid}/settings`, data)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                throw e
            })
    }

}

export default new ObjectService();
