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
    getAccidentStatistic(start_date = null, end_date = null, list_object = null){
        // Формируем параметры запроса
        const searchParams = new URLSearchParams();
        
        if (start_date) {
            searchParams.append('start_date', start_date);
        }
        if (end_date) {
            searchParams.append('end_date', end_date);
        }
        
        // Сервер требует список объектов ВСЕГДА, даже если выбраны все объекты
        // Всегда передаем массив объектов (каждый UUID как отдельный параметр)
        if (list_object && Array.isArray(list_object)) {
            list_object.forEach(uuid => {
                searchParams.append('list_object', uuid);
            });
        }
        
        // Формируем URL с параметрами
        const queryString = searchParams.toString();
        const url = `/statistic/accident${queryString ? '?' + queryString : ''}`;
        
        console.log('Request URL:', url); // Для отладки
        
        return axios
            .get(url)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                console.error('Error fetching accident statistics:', e);
                return e
            })
    }
    
    getMonthlyAccidentStatistic(start_date = null, end_date = null, list_object = null){
        // Формируем параметры запроса
        const searchParams = new URLSearchParams();
        
        if (start_date) {
            searchParams.append('start_date', start_date);
        }
        if (end_date) {
            searchParams.append('end_date', end_date);
        }
        
        // Сервер требует список объектов ВСЕГДА
        if (list_object && Array.isArray(list_object)) {
            list_object.forEach(uuid => {
                searchParams.append('list_object', uuid);
            });
        }
        
        // Формируем URL с параметрами
        const queryString = searchParams.toString();
        const url = `/statistic/accident/monthly${queryString ? '?' + queryString : ''}`;
        
        console.log('Monthly Request URL:', url);
        
        return axios
            .get(url)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                console.error('Error fetching monthly accident statistics:', e);
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
    
    /**
     * Получить статистику по ClassBrake для конкретного объекта
     * GET /v1/statistic/accident/{uuid_object}/class
     */
    getObjectClassBrakeStatistic(uuid_object, start_date = null, end_date = null, sort_by = null, sort_order = null) {
        const searchParams = new URLSearchParams();
        
        if (start_date) {
            searchParams.append('start_date', start_date);
        }
        if (end_date) {
            searchParams.append('end_date', end_date);
        }
        if (sort_by) {
            searchParams.append('sort_by', sort_by);
        }
        if (sort_order) {
            searchParams.append('sort_order', sort_order);
        }
        
        const queryString = searchParams.toString();
        const url = `/statistic/accident/${uuid_object}/class${queryString ? '?' + queryString : ''}`;
        
        console.log('Object ClassBrake Request URL:', url);
        
        return axios
            .get(url)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                console.error('Error fetching object class brake statistics:', e);
                return e
            })
    }
    
    /**
     * Получить статистику по TypeBrake для конкретного объекта
     * GET /v1/statistic/accident/{uuid_object}/type
     */
    getObjectTypeBrakeStatistic(uuid_object, start_date = null, end_date = null, sort_by = null, sort_order = null) {
        const searchParams = new URLSearchParams();
        
        if (start_date) {
            searchParams.append('start_date', start_date);
        }
        if (end_date) {
            searchParams.append('end_date', end_date);
        }
        if (sort_by) {
            searchParams.append('sort_by', sort_by);
        }
        if (sort_order) {
            searchParams.append('sort_order', sort_order);
        }
        
        const queryString = searchParams.toString();
        const url = `/statistic/accident/${uuid_object}/type${queryString ? '?' + queryString : ''}`;
        
        console.log('Object TypeBrake Request URL:', url);
        
        return axios
            .get(url)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                console.error('Error fetching object type brake statistics:', e);
                return e
            })
    }
    
    /**
     * Получить статистику по месяцам и ClassBrake для конкретного объекта
     * GET /v1/statistic/accident/{uuid_object}/monthly/class
     */
    getObjectMonthlyClassBrakeStatistic(uuid_object, start_date = null, end_date = null, sort_by = null, sort_order = null) {
        const searchParams = new URLSearchParams();
        
        if (start_date) {
            searchParams.append('start_date', start_date);
        }
        if (end_date) {
            searchParams.append('end_date', end_date);
        }
        if (sort_by) {
            searchParams.append('sort_by', sort_by);
        }
        if (sort_order) {
            searchParams.append('sort_order', sort_order);
        }
        
        const queryString = searchParams.toString();
        const url = `/statistic/accident/${uuid_object}/monthly/class${queryString ? '?' + queryString : ''}`;
        
        console.log('Object Monthly ClassBrake Request URL:', url);
        
        return axios
            .get(url)
            .then((response) => {
                if(response.status === 200)
                    return response
            })
            .catch(function (e){
                console.error('Error fetching object monthly class brake statistics:', e);
                return e
            })
    }
    
    /**
     * Экспорт статистики в CSV
     * GET /v1/statistic/export/csv
     * Принимает те же параметры, что и get_accident_statistic_universal: start_date, end_date, list_object
     * Возвращает CSV файл с кодировкой UTF-8-sig (BOM) для корректного отображения кириллицы в Excel
     */
    exportToCSV(start_date = null, end_date = null, list_object = null) {
        // Формируем параметры запроса
        const searchParams = new URLSearchParams();
        
        if (start_date) {
            searchParams.append('start_date', start_date);
        }
        if (end_date) {
            searchParams.append('end_date', end_date);
        }
        
        // Сервер требует список объектов ВСЕГДА, даже если выбраны все объекты
        // Всегда передаем массив объектов (каждый UUID как отдельный параметр)
        if (list_object && Array.isArray(list_object)) {
            list_object.forEach(uuid => {
                searchParams.append('list_object', uuid);
            });
        }
        
        // Формируем URL с параметрами
        const queryString = searchParams.toString();
        const url = `/statistic/export/csv${queryString ? '?' + queryString : ''}`;
        
        console.log('Export CSV Request URL:', url);
        
        return axios
            .get(url, {
                responseType: 'blob', // Важно: указываем blob для бинарных данных
                headers: {
                    'Accept': 'text/csv'
                }
            })
            .then((response) => {
                // Создаем имя файла с датой и временем экспорта
                const now = new Date();
                const dateStr = now.toISOString().split('T')[0];
                const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
                const fileName = `statistic_export_${dateStr}_${timeStr}.csv`;
                
                // Создаем blob URL и скачиваем файл
                const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8-sig' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                return response;
            })
            .catch(function (e){
                console.error('Error exporting CSV:', e);
                throw e;
            })
    }
}

export default new StatisticService();