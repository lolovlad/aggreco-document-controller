<script>
import {defineComponent} from "vue";
import SingleObjectFilter from "@/components/Forms/Search/SingleObjectFilter.vue";
import StatisticService from "@/store/statistic.service";
import ObjectClassBrakePieChart from "@/components/Charts/ObjectClassBrakePieChart.vue";
import ObjectTypeBrakeBarChart from "@/components/Charts/ObjectTypeBrakeBarChart.vue";
import ObjectMonthlyClassBrakeLineChart from "@/components/Charts/ObjectMonthlyClassBrakeLineChart.vue";

export default defineComponent({
  name: "ObjectStatisticPage",
  components: {
    SingleObjectFilter,
    ObjectClassBrakePieChart,
    ObjectTypeBrakeBarChart,
    ObjectMonthlyClassBrakeLineChart
  },
  data(){
    return{
      // Фильтр
      selectedObject: null,
      dateStart: null,
      dateEnd: null,
      
      // Загрузка данных
      loadingClass: false,
      loadingType: false,
      loadingMonthly: false,
      
      // Данные графиков
      classData: [],
      typeData: [],
      monthlyData: [],
      
      // Активная вкладка
      currentTab: 'class',
      
      // Тип графика для вкладки "По типу"
      classChartType: 'bar'
    }
  },
  methods: {
    convertDate(date){
      const offset = date.getTimezoneOffset()
      let yourDate = new Date(date.getTime() - (offset*60*1000))
      return yourDate.toISOString().split('T')[0]
    },

    handleApplyFilter(filterData){
      this.selectedObject = filterData.selectedObject;
      this.dateStart = this.convertDate(filterData.dateStart);
      this.dateEnd = this.convertDate(filterData.dateEnd);
      
      // Загружаем данные для всех вкладок
      this.loadClassData();
      this.loadTypeData();
      this.loadMonthlyData();
    },

    loadClassData(){
      if (!this.selectedObject) return;
      this.loadingClass = false;
      
      StatisticService.getObjectClassBrakeStatistic(
        this.selectedObject,
        this.dateStart,
        this.dateEnd
      ).then(
        response => {
          console.log('Class data:', response);
          this.classData = response.data.items || [];
          this.loadingClass = true;
        }
      ).catch(
        (error) => {
          console.error('Error fetching class data:', error);
        }
      )
    },

    loadTypeData(){
      if (!this.selectedObject) return;
      this.loadingType = false;
      
      StatisticService.getObjectTypeBrakeStatistic(
        this.selectedObject,
        this.dateStart,
        this.dateEnd
      ).then(
        response => {
          console.log('Type data:', response);
          this.typeData = response.data.items || [];
          this.loadingType = true;
        }
      ).catch(
        (error) => {
          console.error('Error fetching type data:', error);
        }
      )
    },

    loadMonthlyData(){
      if (!this.selectedObject) return;
      this.loadingMonthly = false;
      
      StatisticService.getObjectMonthlyClassBrakeStatistic(
        this.selectedObject,
        this.dateStart,
        this.dateEnd
      ).then(
        response => {
          console.log('Monthly data:', response);
          this.monthlyData = response.data.items || [];
          this.loadingMonthly = true;
        }
      ).catch(
        (error) => {
          console.error('Error fetching monthly data:', error);
        }
      )
    }
  }
})
</script>

<template>
  <div>
    <SingleObjectFilter 
        @apply="handleApplyFilter"
    />
    
    <v-container v-if="selectedObject && (loadingClass || loadingType || loadingMonthly)" class="pa-2 pt-4">
      <v-tabs
          v-model="currentTab"
          align-tabs="start"
          color="primary"
      >
        <v-tab value="class">По типу</v-tab>
        <v-tab value="type">По признакам аварии</v-tab>
        <v-tab value="monthly">По месяцам и типу</v-tab>
      </v-tabs>

      <v-tabs-window v-model="currentTab" class="mt-4">
        <v-tabs-window-item value="class">
          <div v-if="loadingClass">
            <!-- График для ClassBrake с переключением типа -->
            <ObjectClassBrakePieChart 
                :data="classData"
                v-model:chart-type="classChartType"
            />
          </div>
        </v-tabs-window-item>
        
        <v-tabs-window-item value="type">
          <div v-if="loadingType">
            <!-- График со скроллом для TypeBrake -->
            <div class="chart-container">
              <ObjectTypeBrakeBarChart :data="typeData" />
            </div>
          </div>
        </v-tabs-window-item>
        
        <v-tabs-window-item value="monthly">
          <div v-if="loadingMonthly">
            <!-- Линейный график для Monthly ClassBrake -->
            <div class="chart-container">
              <ObjectMonthlyClassBrakeLineChart :data="monthlyData" />
            </div>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 500px;
}
</style>
