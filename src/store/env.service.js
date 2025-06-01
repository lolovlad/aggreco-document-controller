import axios from "axios";


class EnvService{
    loadTypeUser(){
        return axios
            .get(`/env/type_user`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }
    getProfUser(){
        return axios
            .get(`/env/profession`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }
    addProf(prof){
        return axios
            .post("/env/profession", prof)
            .then((response) => {
                if(response.status === 201)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    deleteProf(id_prof){
        return axios
            .delete(`/env/profession/${id_prof}`)
            .then(
                (response) => {
                    if(response.status === 200)
                        return response
                }
            )
            .catch(function (e){
                throw e
            })
    }
    deleteTypeEquipment(idTypeEquip){
        return axios
            .delete(`/env/type_equip/${idTypeEquip}`)
            .then(
                (response) => {
                    if(response.status === 200)
                        return response
                }
            )
            .catch(function (e){
                throw e
            })
    }
    getTypeEquipment(){
        return axios
            .get(`/env/type_equip`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
    }
    getStateObject(){
        return axios
            .get(`/env/state_object`)
            .then((response)=> {
                if (response.status === 200)
                    return response.data
            })
    }
    getRegion(){
        return axios
            .get(`/env/region/get_all`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
    }

    getListSignsAccident(){
        return axios
            .get(`/env/signs_accident/get_all`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }
    getListExternalOrganizationalTypeBrake(){
        return axios
            .get(`/env/type_brake_mechanical/external_organizational`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }
    getListDomesticOrganizationalTypeBrake(){
        return axios
            .get(`/env/type_brake_mechanical/domestic_organizational`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }
    getListMehTypeBrake(){
        return axios
            .get(`/env/type_brake_mechanical/meh`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }
    getTypeEvent(){
        return axios
            .get(`/env/event/type_event`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }
    getStateEvent(){
        return axios
            .get(`/env/event/state_event`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }
    getStateClaim(){
        return axios
            .get('/env/state_claim')
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }
    exportTypeEquipmentFile(file){
        return axios
            .post(`/env/type_equip/import_file`, file)
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    addTypeEquipment(typeEquip){
        return axios
            .post("/env/type_equip", typeEquip)
            .then((response) => {
                if(response.status === 201)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    exportRegionFile(file){
        return axios
            .post(`/env/region/import_file`, file)
            .then(response => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
    addRegion(prof){
        return axios
            .post("/env/region", prof)
            .then((response) => {
                if(response.status === 201)
                    return response
            })
            .catch(function (e){
                throw e
            })
    }
}

export default new EnvService();