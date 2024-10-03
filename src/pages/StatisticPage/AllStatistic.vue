<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {defineComponent} from "vue";
import {Bar} from "vue-chartjs";
import StatisticService from "@/store/statistic.service";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default defineComponent({
  components: {Bar},
  data(){
    return{
      loading: false,
      tableData: {},

      options: {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        layout: {
          padding: {
            left: 60,
            right: 50,
            top: 20,
            bottom: 80,
          },
        },
      },

      listFilter: [
        {"name": "year", "val": "Год"},
        {"name": "date", "val": "Период времени"}
      ],
      filter: "year",
      yearFilter: new Date().getFullYear(),
      dateFilter: {
        start: new Date(),
        end: new Date(),
      }
    }
  },
  methods:{
    getAllStatistic(){
      StatisticService.getAllStatistic(this.yearFilter).then(
          response => {
            this.tableData = this.convertTableData(response.data.obj)
            this.loading = true
          }
      ).catch(
          (response) => {
            console.log(response)
          }
      )
    },

    getStatisticSplice(start, end){
      StatisticService.getStatisticSlice(start, end).then(
          response => {
            this.tableData = this.convertTableData(response.data.obj)
            this.loading = true
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

    searchStatistic(){
      if(this.filter === "year"){
        this.getAllStatistic()
      }else{
        let dateStart = this.convertDate(this.dateFilter.start)
        let dateEnd = this.convertDate(this.dateFilter.end)
        this.getStatisticSplice(dateStart, dateEnd)
      }
    },


    convertTableData(tb){
      const lables = []
      const dataset = {}
      for(let data of Object.values(tb)){

        lables.push(data.name)
        let id_stack = 0
        for(let info of Object.values(data.type_count)){
          if(!(info.name in dataset)){
            dataset[info.name] = {
              label: info.name,
              backgroundColor: '#'+(id_stack / 10 * 0x1000000 | 0x1000000).toString(16).slice(1),
              data: [],
              stack: `Stack ${id_stack}`,
              minBarLength: 7,
            }
            id_stack++
          }
          console.log(id_stack)
          dataset[info.name].data.push(info.count)
        }
      }

      const new_dataset = []
      for (let data of Object.values(dataset)){
        new_dataset.push(data)
      }

      return {
        labels: lables,
        datasets: new_dataset,
      }
    }
  },
  computed:{
    listYear(){
      return [
        {"val": 2024},
        {"val": 2025},
        {"val": 2026},
        {"val": 2027},
        {"val": 2028},
      ]
    }
  },
  mounted() {
    this.getAllStatistic()
  }
})
</script>

<template>
  <v-container>
    <v-form @submit.prevent>
      <v-row>
        <v-col cols="12" sm="4">
          <v-select
              label="Тип фильтра"
              :items="listFilter"
              item-title="val"
              item-value="name"
              variant="underlined"
              v-model="filter"
          />
        </v-col>
        <v-col cols="12" sm="6" v-if="filter==='year'">
          <v-select
              label="Год"
              :items="listYear"
              item-title="val"
              item-value="val"
              variant="underlined"
              v-model="yearFilter"
          />
        </v-col>
        <v-col cols="12" sm="6" v-else>
          <v-row>
            <v-col cols="12" sm="6">
              <VueDatePicker v-model="dateFilter.start" locale="ru" :enable-time-picker="false">
                <template #input-icon>
                  <img/>
                </template>
              </VueDatePicker>
            </v-col>
            <v-col cols="12" sm="6">
              <VueDatePicker v-model="dateFilter.end"
                             locale="ru"
                             :min-date="dateFilter.start"
                             prevent-min-max-navigation
                             :enable-time-picker="false">
                <template #input-icon>
                  <img/>
                </template>
              </VueDatePicker>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn class="mt-4" type="submit" @click="searchStatistic">Поиск</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
  <v-container v-if="loading">
    <v-row>
      <Bar :data="tableData" :options="options" />
    </v-row>
  </v-container>
</template>

<style scoped>

</style>