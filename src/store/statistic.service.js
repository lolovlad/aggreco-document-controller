import axios from "axios";


class StatisticService{
    getAllStatistic(year){
        return axios
            .get('/statistic/accident/type_brake', {params: {year: year}})
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                return e
            })
    }
    getStatisticSlice(date_start, date_end){
        return axios
            .get('/statistic/accident/date_slice', {params: {start_date: date_start, end_date: date_end}})
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                return e
            })
    }
    getObjectStatistic(uuidObject, typeFilter, param){
        return axios
            .get(`/statistic/object/${uuidObject}`, {params: {type_filter: typeFilter, param: param}})
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                return e
            })
    }
    getListClassBrake(){
        return axios
            .get(`/statistic/type_brake/class`)
            .then((response) => {
                if(response.status === 200)
                    return response.data
            })
            .catch(function (e){
                return e
            })
    }
}

export default new StatisticService();