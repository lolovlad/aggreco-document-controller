import axios from "axios";
import moment from 'moment-timezone';


class AccidentService{
    getPageAccident(page, perItemPage){
        return axios
            .get('/accident/page', {params: {page: page, per_item_page: perItemPage}})
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                return e
            })
    }
    updateAccident(uuidAccident, accident){

        const timezone = moment().format("Z");
        return axios
            .put(`accident/${uuidAccident}`, accident, {
                headers: {
                    "X-Timezone": timezone,
                }
            })
            .then((response) => {
                if(response.status >= 200){
                    return response
                }
            })
            .catch(function (e){
                return e
            })
    }
    getTimeLine(uuidAccident){
        return axios
            .get(`accident/${uuidAccident}/time_line`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }

    getEventAll(uuidAccident){
        return axios
            .get(`accident/${uuidAccident}/event`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }
    getEvent(uuidAccident, uuidItem){
        return axios
            .get(`accident/${uuidAccident}/event/${uuidItem}`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }

    addTimeLine(uuidAccident, item){
        return axios
            .post(`accident/${uuidAccident}/time_line`, item)
            .then((response) => {
                if(response.status >= 200){
                    return response.data
                }
            })
            .catch(function (e){
                return e
            })

    }
    deleteTimeLine(uuidAccident, uuidItem){
        return axios
            .delete(`accident/${uuidAccident}/time_line/${uuidItem}`)
            .then((response) => {
                if(response.status >= 200){
                    return response.data
                }
            })
            .catch(function (e){
                return e
            })
    }
    updateTimeLine(uuidAccident, item){
        return axios
            .put(`accident/${uuidAccident}/time_line`, item)
            .then((response) => {
                if(response.status >= 200){
                    return response.data
                }
            })
            .catch(function (e){
                return e
            })
    }
    addEvent(uuidAccident, item){
        return axios
            .post(`accident/${uuidAccident}/event`, item)
            .then((response) => {
                if(response.status >= 200){
                    return response.data
                }
            })
            .catch(function (e){
                return e
            })
    }
    deleteEvent(uuidAccident, uuidEvent){
        return axios
            .delete(`accident/${uuidAccident}/event/${uuidEvent}`)
            .then((response) => {
                if(response.status >= 200){
                    return response.data
                }
            })
            .catch(function (e){
                return e
            })
    }
    updateEvent(uuidAccident, item){
        return axios
            .put(`accident/${uuidAccident}/event`, item)
            .then((response) => {
                if(response.status >= 200){
                    return response.data
                }
            })
            .catch(function (e){
                return e
            })
    }
}

export default new AccidentService();