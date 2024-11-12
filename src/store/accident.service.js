import axios from "axios";


class AccidentService{
    getPageAccident(page){
        return axios
            .get('/accident/page', {params: {page: page}})
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                return e
            })
    }
    updateAccident(uuidAccident, accident){
        return axios
            .put(`accident/${uuidAccident}`, accident)
            .then((response) => {
                if(response.status >= 200){
                    return response
                }
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