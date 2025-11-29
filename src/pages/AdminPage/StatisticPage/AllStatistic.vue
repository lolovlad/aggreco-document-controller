<script>
import {defineComponent} from "vue";
import StatisticService from "@/store/statistic.service";
import StatisticFilter from "@/components/Forms/Search/StatisticFilter.vue";
import StatisticChart from "@/components/Charts/StatisticChart.vue";
import MonthlyObjectChart from "@/components/Charts/MonthlyObjectChart.vue";

export default defineComponent({
  components: {
    StatisticFilter,
    StatisticChart,
    MonthlyObjectChart
  },
  data(){
    return{
      loading: false,
      loadingMonthly: false,
      chartData: [],
      monthlyData: {},
      chartType: 'bar',
      monthlyChartType: 'bar',
      tab: 'summary',

    }
  },
  methods:{
    getStatisticSplice(start, end, objectUuids){
      // Всегда передаем массив объектов (обязательно для сервера)
      const objectsToSend = Array.isArray(objectUuids) && objectUuids.length > 0 
          ? objectUuids 
          : [];
      
      StatisticService.getAccidentStatistic(start, end, objectsToSend).then(
          response => {
            console.log(response)
            this.chartData = response.data.objects || []
            this.loading = true
          }
      ).catch(
          (response) => {
            console.log(response)
          }
      )
    },

    getMonthlyStatistic(start, end, objectUuids){
      // Всегда передаем массив объектов (обязательно для сервера)
      const objectsToSend = Array.isArray(objectUuids) && objectUuids.length > 0 
          ? objectUuids 
          : [];
      
      StatisticService.getMonthlyAccidentStatistic(start, end, objectsToSend).then(
          response => {
            console.log(response)
            this.monthlyData = response.data || { months: [] }
            this.loadingMonthly = true
          }
      ).catch(
          (response) => {
            console.log(response)
          }
      )
    },

    convertDate(date){
      const offset = date.getTimezoneOffset()
      let yourDate = new Date(date.getTime() - (offset*60*1000))
      return yourDate.toISOString().split('T')[0]
    },

    handleApplyFilter(filterData){
      let dateStart = this.convertDate(filterData.dateStart)
      let dateEnd = this.convertDate(filterData.dateEnd)
      
      // Всегда передаем массив объектов (сервер требует список всегда)
      let objectUuidsToSend = Array.isArray(filterData.selectedObjects) 
          ? filterData.selectedObjects 
          : [];
      
      // Загружаем оба типа статистики
      this.getStatisticSplice(dateStart, dateEnd, objectUuidsToSend)
      this.getMonthlyStatistic(dateStart, dateEnd, objectUuidsToSend)
    },

    handleObjectsLoaded(objects) {
      // При первой загрузке объектов автоматически запускаем поиск
      if ((!this.loading || !this.loadingMonthly) && objects && objects.length > 0) {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        
        this.$nextTick(() => {
          this.handleApplyFilter({
            dateStart: startOfYear,
            dateEnd: endOfYear,
            selectedObjects: objects.map(obj => obj.uuid)
          });
        });
      }
    }
  }
})
</script>

<template>
  <div>
    <StatisticFilter 
        @apply="handleApplyFilter"
        @objects-loaded="handleObjectsLoaded"
    />
    
    <v-container v-if="loading || loadingMonthly" class="pa-2 pt-4">
      <v-tabs
          v-model="tab"
          align-tabs="start"
          color="primary"
      >
        <v-tab value="summary">Общая статистика</v-tab>
        <v-tab value="monthly">По месяцам и объектам</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab" class="mt-4">
        <v-tabs-window-item value="summary">
          <StatisticChart 
              v-if="loading"
              :data="chartData"
              v-model:chart-type="chartType"
          />
        </v-tabs-window-item>
        
        <v-tabs-window-item value="monthly">
          <v-row>
            <v-col cols="12" class="pa-0">
              <MonthlyObjectChart 
                  v-if="loadingMonthly"
                  :data="monthlyData"
                  v-model:chart-type="monthlyChartType"
              />
            </v-col>
          </v-row>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>
  </div>
</template>

<style scoped>
:deep(.v-container) {
  overflow: visible;
}

:deep(.v-tabs-window) {
  overflow: visible;
}

:deep(.v-tabs-window-item) {
  overflow: visible;
}
</style>