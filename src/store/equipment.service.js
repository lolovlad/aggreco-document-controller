import axios from "axios";

class EquipmentService {
    getPageEquipment(page, perItemPage, idObject = null) {
        return axios
            .get('/api/object_equipment/v1/equipment/page', {
                params: {
                    page: page,
                    per_item_page: perItemPage,
                    id_object: idObject || undefined
                }
            })
            .then((response) => {
                if (response.status === 200)
                    return response;
            })
            .catch((response) => {
                throw response;
            });
    }

    getListEquipment(idObject = null) {
        return axios
            .get('/api/object_equipment/v1/equipment/list', {
                params: {
                    id_object: idObject || undefined
                }
            })
            .then((response) => {
                if (response.status === 200)
                    return response.data;
            })
            .catch((response) => {
                throw response;
            });
    }

    getEquipmentByUuid(uuid) {
        return axios
            .get(`/api/object_equipment/v1/equipment/${uuid}`)
            .then((response) => {
                if (response.status === 200)
                    return response.data;
            })
            .catch((e) => {
                throw e;
            });
    }

    addEquipment(equip) {
        return axios
            .post("/api/object_equipment/v1/equipment", equip)
            .then((response) => {
                if (response.status === 201)
                    return response.data.message;
            })
            .catch((e) => {
                throw e;
            });
    }

    updateEquipment(uuid, equip) {
        return axios
            .put(`/api/object_equipment/v1/equipment/${uuid}`, equip)
            .then((response) => {
                if (response.status === 200)
                    return response.data.message;
            })
            .catch((e) => {
                throw e;
            });
    }

    deleteEquipment(uuid) {
        return axios
            .delete(`/api/object_equipment/v1/equipment/${uuid}`)
            .then((response) => {
                if (response.status === 200)
                    return response;
            })
            .catch((e) => {
                throw e;
            });
    }

    searchEquipment(search, idObject = null) {
        return axios
            .get(`/api/object_equipment/v1/equipment/search`, {
                params: {
                    search_field: search,
                    id_object: idObject || undefined
                }
            })
            .then((response) => {
                if (response.status === 200)
                    return response.data;
            })
            .catch((e) => {
                throw e;
            });
    }

    getEquipmentUuids(idObject = null) {
        return axios
            .get(`/api/object_equipment/v1/equipment/uuids`, {
                params: {
                    id_object: idObject || undefined
                }
            })
            .then((response) => {
                if (response.status === 200)
                    return response.data;
            })
            .catch((e) => {
                throw e;
            });
    }

    getEquipmentBatch(uuids) {
        return axios
            .post(`/api/object_equipment/v1/equipment/batch`, uuids)
            .then((response) => {
                if (response.status === 200)
                    return response.data;
            })
            .catch((e) => {
                throw e;
            });
    }
}

export default new EquipmentService();

