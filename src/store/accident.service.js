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
}

export default new AccidentService();