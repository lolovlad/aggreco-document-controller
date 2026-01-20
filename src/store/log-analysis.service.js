import axios from "axios";


class LogAnalysisService{
    /**
     * Получить все Summarize для объекта с фильтрацией по датам
     * GET /v1/log-analysis/object/{uuid_object}/summarize
     * @param {string} uuid_object - UUID объекта
     * @param {string} start_date - Начальная дата в формате YYYY-MM-DD (опционально)
     * @param {string} end_date - Конечная дата в формате YYYY-MM-DD (опционально)
     */
    getObjectSummarize(uuid_object, start_date = null, end_date = null){
        const searchParams = new URLSearchParams();
        
        if (start_date) {
            searchParams.append('start_date', start_date);
        }
        if (end_date) {
            searchParams.append('end_date', end_date);
        }
        
        const queryString = searchParams.toString();
        const url = `/log-analysis/object/${uuid_object}/summarize${queryString ? '?' + queryString : ''}`;
        
        return axios
            .get(url)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                console.error('Error fetching object summarize:', e);
                throw e
            })
    }

    /**
     * Получить все Summarize для объекта и оборудования с фильтрацией по датам
     * GET /v1/log-analysis/object/{uuid_object}/equipment/{uuid_equipment}/summarize
     * @param {string} uuid_object - UUID объекта
     * @param {string} uuid_equipment - UUID оборудования
     * @param {string} start_date - Начальная дата в формате YYYY-MM-DD (опционально)
     * @param {string} end_date - Конечная дата в формате YYYY-MM-DD (опционально)
     */
    getEquipmentSummarize(uuid_object, uuid_equipment, start_date = null, end_date = null){
        const searchParams = new URLSearchParams();
        
        if (start_date) {
            searchParams.append('start_date', start_date);
        }
        if (end_date) {
            searchParams.append('end_date', end_date);
        }
        
        const queryString = searchParams.toString();
        const url = `/log-analysis/object/${uuid_object}/equipment/${uuid_equipment}/summarize${queryString ? '?' + queryString : ''}`;
        
        return axios
            .get(url)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                console.error('Error fetching equipment summarize:', e);
                throw e
            })
    }

    /**
     * Запустить анализ логов для объекта
     * POST /v1/log-analysis/object/{uuid_object}/analyze
     * @param {string} uuid_object - UUID объекта
     */
    analyzeObjectLogs(uuid_object){
        return axios
            .post(`/log-analysis/object/${uuid_object}/analyze`, {}, {
                timeout: 600000 // 10 минут (600000 мс) для долгих запросов анализа
            })
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                console.error('Error analyzing object logs:', e);
                throw e
            })
    }
}

export default new LogAnalysisService();
